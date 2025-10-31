import * as oak from 'https://deno.land/x/oak@v12.5.0/mod.ts';
import postgres from 'https://deno.land/x/postgresjs@v3.4.4/mod.js';
import * as diff from './diff.ts';
import { open } from 'https://deno.land/x/deno_open@v0.0.6/index.ts';
import { evaluate } from 'https://cdn.jsdelivr.net/npm/raport@0.30.0/lib/index.js';

type JSONValue = postgres.JSONValue;

const VERSION = '1.14.0';

interface DatabaseConfig {
  host: string;
  username?: string;
  password?: string;
  port?: number;
  database: string;
  ssl?: 'prefer'|'require';
  diffopts?: diff.StartOptions;
  connect_timeout: number;
}

interface DatabasesConfig extends DatabaseConfig {
  databases: string[];
}

interface Connection {
  pid: string;
  user: string;
  application: string;
  database: string;
  started: string;
  state: string;
  client: string;
}

const config = {
  port: 1999,
  pollingInterval: 10000,
  monitorInterval: 30000,
  listen: '127.0.0.1',
  noui: false,
  user: undefined as unknown as string,
  users: undefined as unknown as { [user: string]: string },
  password: undefined as unknown as string,
  ssl: undefined as any,
  connect_timeout: 30,
};

// process args
for (let i = 0; i < Deno.args.length; i++) {
  switch (Deno.args[i]) {
    case '--port': case '-p':
      config.port = +Deno.args[++i] || 1999;
      break;

    case '--interval': case '-t':
      config.pollingInterval = +Deno.args[++i] || 10000;
      break;

    case '--monitor': case '-m':
      config.monitorInterval = +Deno.args[++i] || 30000;
      break;

    case '--listen': case '-l':
      config.listen = Deno.args[++i] || '127.0.0.1';
      break;

    case '--noui':
      config.noui = true;
      break;

    case '--user': case '-u':
      config.user = Deno.args[++i];
      break;

    case '--password': case '-w':
      config.password = Deno.args[++i];
      break;

    case '--config': case '-c':
      try {
        Object.assign(config, evaluate(Deno.readTextFileSync(Deno.args[++i])));
      } catch (e) {
        console.error('Failed loading config file', e);
      }
      break;

    case '--help': case '-h':
      console.log(`Usage: pg-difficult [...options]

Options:
  --port     | -p  <number>   listen on the given port, defaults to 1999

  --interval | -t  <number>   have the connection monitor poll at the given rate in ms
                              defaults to 10000

  --listen   | -l  <ip>       listen on the given address, defaults to 127.0.0.1
                              to listen on all addresses, use 0.0.0.0

  --noui                      don't attempt to open the pg-difficult page for the
                              started instance

  --user     | -u  <string>   require basic auth with this as the user

  --password | -w  <string>   require basic auth with this as the password, which
                              defaults to an empty string if there is a user and
                              no password

  --config   | -c  <filepath> load configuration from the given file, which will be
                              parsed with Raport
                              the file should evaluate to an object with keys matching
                              these options with an optional users dictionary

  --help     | -h             display this message and exit

Running pg-difficult will start an http server that will serve the client interface and
handle connecting to requested databases. The server does not store any local state.
Any configuration is only stored in browser local storage from the client, meaning any
settings in the client will only apply to the specific url the browser accesses. So if
you want seperate environments, you can use a different listening address or port to
have a separate set of settings saved in the client.

WARNING: Starting a diff in a database will create a pgdifficult schema with two new tables
that pg-difficult will use to track changes made to any records in any other table in the
database. It will also add a function and install it as a trigger on every table in the
database. These tables are world readable and writable, so if there is any sensitive
information in the database that is guarded by access controls, it will be possible for
any user to view it as it changes through the diff tables.

Stopping the diff will remove the triggers, function, and schema from the database.
  `);
      Deno.exit(0);
      break;
  }
}

type PGClient = postgres.Sql<Record<string, unknown>>;

interface Client {
  id: number;
  config: DatabaseConfig;
  client?: PGClient;
  listening: boolean;
  lock?: boolean;
  pong?: { id: number; callback: () => void };
}

interface State {
  segment: string;
  hide: boolean;
  saved: diff.Entry[];
  diffId: number;
  diffs: { [id: number]: Client }
  leakId: number;
  leaks: { [id: number]: { client: Client; initial: { [database: string]: Connection[] }; current: Connection[]; databases: string[] } };
  leakTimer?: number;
}

const state: State = {
  segment: 'Initial',
  hide: false,
  saved: [],
  diffId: 0,
  diffs: {},
  leakId: 0,
  leaks: {},
};

function source(config: DatabaseConfig): string {
  return `${config.username || 'postgres'}@${config.host || 'localhost'}:${config.port || 5432}/${config.database || 'postgres'}`;
}

function clientForSource(src: number|string): number|undefined {
  if (typeof src === 'number') return src;
  for (const k in state.diffs) if (src === source(state.diffs[k].config)) return state.diffs[k].id;
}

function prepareConfig(cfg: DatabaseConfig, extra?: Partial<DatabaseConfig> & { app?: string }): DatabaseConfig {
  const base: any = {
    onnotice() {},
    types: { date: {
      to: 1184, from: [1082, 1114, 1184],
      serialize: (v: string) => v,
      parse: (v: string) => v,
    } },
    connection: { application_name: `pg-difficult:${config.port}${extra?.app ? `(${extra.app})` : ''}` },
    ssl: 'prefer',
    connect_timeout: 10,
  }
  if (config.ssl === 'require') base.ssl = 'require';
  if (config.ssl === false) delete base.ssl;
  if (base.ssl) base.ssl = { rejectUnauthorized: false };
  return Object.assign(base, cfg, { host: cfg.host || 'localhost', username: cfg.username || 'postgres', database: cfg.database || 'postgres', port: cfg.port || 5432 }, extra);
}

// set up server
const app = new oak.Application();
const router = new oak.Router();

const clients: WebSocket[] = [];

app.use((ctx, next) => {
  let ok = true;
  if (config.user || config.users) {
    if ((ctx.request.headers.get('authorization') || '').slice(0, 5) !== 'Basic') {
      ctx.response.headers.set('WWW-Authenticate', `Basic realm="pg-difficult login", charset="UTF-8"`);
      ctx.response.status = 401;
      ctx.response.body = 'Authentication required.';
      ok = false;
    } else {
      const [u, p] = atob((ctx.request.headers.get('authorization') || 'Basic Og==').slice(6)).split(':');
      if (config.user) {
        if (u !== config.user || p !== (config.password || '')) {
          ctx.response.headers.set('WWW-Authenticate', `Basic realm="pg-difficult login invalid, try again", charset="UTF-8"`);
          ctx.response.status = 401;
          ctx.response.body = 'Invalid authentication.';
          ok = false;
        }
      } else if (typeof config.users === 'object') {
        if (!(u in config.users) || config.users[u] !== p) {
          ctx.response.headers.set('WWW-Authenticate', `Basic realm="pg-difficult login invalid, try again", charset="UTF-8"`);
          ctx.response.status = 401;
          ctx.response.body = 'Invalid authentication.';
          ok = false;
        }
      }
    }
  }
  if (ok) return next();
});

app.use(router.routes());
app.use(router.allowedMethods());

router.get('/ws', ctx => {
  if (!ctx.isUpgradable) ctx.throw(400);
  const ws = ctx.upgrade();
  clients.push(ws);
  ws.addEventListener('close', () => {
    const idx = clients.indexOf(ws);
    if (~idx) clients.splice(idx, 1);
  });
  ws.addEventListener('message', ev => {
    message.call(ws, JSON.parse(ev.data));
  });
  checkDiffListeners();
});

let dev = false;
try { dev = (await Deno.stat('./public')).isDirectory; } catch { /* sure */ }

router.get('/:path*', async ctx => {
  const path: string = ctx.params.path || '';

  try {
    const f = await Deno.readFile(`${import.meta.dirname}/public/${path}`);
    ctx.response.type = path.slice(path.lastIndexOf('.') + 1);
    return ctx.response.body = f;
  } catch {
    if (!path || path[path.length - 1] === '/') {
      try {
        const f = await Deno.readFile(`${import.meta.dirname}/public/${path}index.html`);
        ctx.response.type = 'html';
        return ctx.response.body = f;
      } catch { /* sure */ }
    }
  }

  ctx.response.status = 404;
  ctx.response.body = 'Not found';
  ctx.response.type = 'txt';
});

interface Ping { action: 'ping' }
interface Debug { action: 'debug', id: number }
interface Start { action: 'start'; id: number; config: DatabaseConfig }
interface Restart { action: 'restart'; id: number; config: DatabaseConfig }
interface Resume { action: 'resume'; id: number; config: DatabaseConfig }
interface Stop { action: 'stop', id: number; diff: number; save?: true }
interface Status { action: 'status'; id: string }
interface Clear { action: 'clear'; source?: string|number }
interface Segment { action: 'segment'; segment: string; id?: string }
interface Hide { action: 'hide'; hide: boolean; id?: string }
interface Check { action: 'check'; client: string|number; since?: string; id: string; }
interface Schema { action: 'schema'; client?: string|number|DatabaseConfig; id?: string }
interface Query { action: 'query'; client: string|number|DatabaseConfig; query: string[]; params?: unknown[][]; id: string }
interface QueryAll { action: 'query-all', clients: Array<DatabasesConfig>, query: string[]; params?: unknown[][]; batch?: number; id: string }
interface Leak { action: 'leak'; config: DatabaseConfig }
interface Unleak { action: 'unleak'; config: DatabaseConfig }
interface Interval { action: 'interval'; time: number }
interface Halt { action: 'halt' }
interface ServerFetch extends FetchRequest { action: 'fetch', id: string }
type Message = Ping|Debug|Start|Restart|Resume|Stop|Status|Clear|Segment|Hide|Check|Schema|Query|QueryAll|Leak|Unleak|Interval|Halt|ServerFetch;

async function message(this: WebSocket, msg: Message) {
  try {
    switch (msg.action) {
      case 'start': await start(msg.config, msg.id, this); break;
      case 'resume': await start(msg.config, msg.id, this, 'resume'); break;
      case 'restart': await start(msg.config, msg.id, this, 'restart'); break;
      case 'stop': await stop(msg.diff, msg.id, this, msg.save); break;
      case 'status': status(msg.id, this); break;
      case 'clear': await clear(msg.source ? clientForSource(msg.source) : undefined); break;
      case 'segment': await next(msg.segment, this, msg.id); break;
      case 'hide': await hide(msg.hide, this, msg.id); break;
      case 'ping': this.send(JSON.stringify({ action: 'pong' })); break;
      case 'check': check(this, msg.client, msg.id, msg.since); break;
      case 'schema': schema(this, msg.client, msg.id); break;
      case 'query': query(msg.client, msg.query, msg.params || [], msg.id, this); break;
      case 'query-all': queryAll(msg.clients, msg.query, msg.params || [], msg.batch || 10, msg.id, this); break;
      case 'leak': leak(msg.config); break;
      case 'unleak': unleak(msg.config); break;
      case 'interval':
        config.pollingInterval = msg.time >= 1000 ? msg.time : 10000;
        status();
        break;
      case 'fetch': makeRequest(msg, this, msg.id); break;
      case 'halt': halt(); break;
      case 'debug':
        notify({ data: { config, state, VERSION, timestamp: evaluate('date()#timestamp') }, action: 'result', id: msg.id }, this);
        break;
    }
  } catch (e) {
    if ('id' in msg) error(e.message, this, { id: msg.id, stack: e.stack });
    else error(e.message, this, { stack: e.stack });
  }
}

function notify(msg: { [key: string]: unknown; action: string; }, ws?: WebSocket) {
  if (ws) ws.send(JSON.stringify(msg));
  else for (const c of clients) c.send(JSON.stringify(msg));
}

function error(message: string, ws?: WebSocket, extra?: Record<string, unknown>) {
  notify(Object.assign({}, extra, { action: 'error', error: message }), ws);
}

let throttleCheck: () => void;
{
  let tm: number|undefined;
  throttleCheck = () => {
    if (tm != null) {
      return;
    }
    tm = setTimeout(() => {
      tm = undefined;
      notify({ action: 'check' });
    }, 1000);
  };
}

async function start(config: DatabaseConfig, id: number, ws: WebSocket, start?: 'resume'|'restart') {
  for (const k in state.diffs) {
    const st = state.diffs[k];
    if (source(st.config) === source(config)) return error(`Already connected to ${source(config)}`);
  }

  if (!config.ssl) config.ssl = 'prefer';
  config = prepareConfig(config, { app: 'diff' });


  const did = state.diffId++;
  const rec = { client: undefined as any, config, id: did, lock: false, listening: false };
  const client = await connectClient(rec, 1);
  state.diffs[did] = rec;

  try {
    // check for started diff
    let restart = false;
    try {
      // watch out for old-style diffs and clean them up
      await client`select count(key) from __pgdifficult_state`;
      restart = true;
      start = 'restart';
    } catch (e) {
      try {
        await client`select count(key) from pgdifficult.state`;
        restart = true;
        if (!start) {
          try {
            await client.end({ timeout: 10 });
          } catch {};
          delete state.diffs[did];
          return notify({ id, action: 'resume' }, ws);
        }
      } catch {}
    }

    if (restart && start === 'resume') {
      await client`notify __pg_difficult, 'joined'`;
      if (state.segment === 'Initial') {
        state.segment = (await diff.getState(client, 'segment')) || state.segment;
        state.hide = await diff.getState(client, 'hide') === 'true';
      }

      for (const id in state.diffs) {
        const d = state.diffs[id];
        if (d.client) {
          await diff.setState(d.client, 'segments', state.segment);
          await diff.setState(d.client, 'hide', state.hide);
        }
      }

      notify({ id, action: 'resumed' }, ws);
      try {
        await client.end({ timeout: 10 });
      } catch {}
    } else {
      if (restart && start === 'restart') await diff.stop(client);
      try {
        await diff.start(client, config.diffopts);
      } catch (e) {
        console.error(e)
        try {
          await client.end({ timeout: 10 });
        } catch {}
        throw e;
      }

      await diff.next(client, state.segment);
      notify({ id, action: 'started' }, ws);
    }

    await connectedDiff(rec);
  } catch (e) {
    delete state.diffs[did];
    try {
      await client.end({ timeout: 10 });
    } catch { /* sure */ }
    throw e;
  }

  status();
  notify({ action: 'check', reset: true });
}

const connecting: { [id: number]: undefined|Promise<PGClient> } = {};
async function connectClient(client: Client, attempts: number = NaN): Promise<PGClient> {
  const pending = connecting[client.id];
  if (pending) return pending;
  const [pr, ok, fail] = defer<PGClient>();
  pr.catch(() => {});
  connecting[client.id] = pr;
  let connected = false;
  let i = 0;
  let res: PGClient = undefined as any;
  while (!connected) {
    try {
      res = client.client = postgres(client.config);
      await client.client`select 1 as x`;
      connected = true;
      ok(client.client);
      connecting[client.id] = undefined;
    } catch {
      i++;
      console.error(`failed connecting client ${client.id} (${source(client.config)}) - retrying in 5s`);
      if (attempts <= i) {
        const err = new Error(`too many failed attempts to connect to ${source(client.config)}`);
        connecting[client.id] = undefined;
        fail(err);
        throw err;
      }
      await sleep(5000);
    }
  }
  return res;
}
async function reconnectDiff(client: Client) {
  const current = client.client;
  if (connecting[client.id]) return;
  client.client = undefined;
  if (current) {
    status();
    try {
      await current.end({ timeout: 10 });
    } catch {}
  }

  await connectClient(client);
  await connectedDiff(client);
  status();
  throttleCheck();
}

async function connectedDiff(rec: Client) {
  if (!rec.client || rec.listening) return;
  rec.listening = true;
  await rec.client.listen('__pg_difficult', async v => {
    if (rec.lock) return;
    let req: any;
    if (v[0] === '{') {
      req = JSON.parse(v);
      v = req.action;
    }
    if (v === 'stopped') {
      console.log('stopping remotely stopped diff');
      delete state.diffs[rec.id];
      try {
        if (rec.client) await rec.client.end({ timeout: 10 });
      } catch {
        console.log(`Failed to disconnect listener for stopped diff ${source(rec.config)}.`);
      }
      console.log('notifying about remotely stopped diff');
      delete state.diffs[rec.id];
      status();
    } else if (v === 'clear') {
      notify({ action: 'clear', source: source(rec.config) });
    } else if (v === 'segment') {
      if (req && req.segment) state.segment = req.segment;
      status();
    } else if (v === 'state') {
      if (req && req.key && req.key === 'hide') {
        state.hide = req.value === 'true';
      }
    } else if (v === 'ping') {
      if (rec.pong && req.id === rec.pong.id) rec.pong.callback();
    } else if (!v || v === 'record') {
      throttleCheck();
    }
  });
}

async function listenerPing(client: Client) {
  if (client.pong || !client.client) return;
  const id = Math.floor(Math.random() * 10000);
  const [pr, ok, fail] = defer();
  pr.catch(() => {});
  const tm = setTimeout(() => {
    client.pong = undefined;
    console.log(`ping timeout on ${id}, client ${client.id} (${source(client.config)})`);
    client.listening = false;
    fail(new Error('timeout'));
  }, 5000);
  client.pong = { id, callback: () => { clearTimeout(tm); ok(); } };
  client.client.notify('__pg_difficult', JSON.stringify({ action: 'ping', id }));
  await pr;
  client.pong = undefined;
  return;
}

async function stop(did: number, msgid: number, ws: WebSocket, save?: true) {
  const client = state.diffs[did];
  if (!client) return error('Cannot stop what is not started.');
  if (!client.client) return error('Cannot stop diff while not attached to server.');
  if (save || save !== false && Object.keys(state.diffs).length > 1) {
    const entries = await diff.entries(client.client);
    const src = source(client.config);
    for (const e of entries) e.source = src;
    state.saved.push.apply(state.saved, entries);
  }
  await diff.stop(client.client);
  try {
    await client.client.end({ timeout: 10 });
  } catch {}
  delete state.diffs[did];
  notify({ action: 'stopped', id: msgid }, ws);
  status();
}

function status(id?: string, ws?: WebSocket) {
  const status = {
    segment: state.segment,
    clients: {} as { [k: number]: { id: number; config: DatabaseConfig; source: string; connected: boolean } },
    leaks: {} as { [k: number]: { id: number; config: DatabaseConfig; databases: string[]; initial: { [database: string]: Connection[] }; current: Connection[] } },
    pollingInterval: config.pollingInterval,
    VERSION,
  };
  for (const k in state.diffs) {
    const d = state.diffs[k];
    status.clients[k] = { id: +k, config: Object.assign({}, d.config, { types: undefined, connection: undefined }), source: source(d.config), connected: !!d.client };
  }
  for (const k in state.leaks) {
    status.leaks[k] = { id: +k, config: Object.assign({}, state.leaks[k].client.config, { types: undefined, connection: undefined }), databases: state.leaks[k].databases, initial: state.leaks[k].initial, current: state.leaks[k].current };
  }
  notify({ action: 'status', status, id }, ws);
}

async function next(segment: string, ws: WebSocket, id?: string) {
  if (!segment) return error('Segment is required.');
  state.segment = segment;
  for (const k in state.diffs) {
    const d = state.diffs[k];
    if (!d.client) continue;
    d.lock = true;
    await diff.next(d.client, segment);
    d.lock = false;
  }

  status();

  if (id) notify({ action: 'segment-change', id }, ws);
}

async function hide(hide: boolean, ws: WebSocket, id?: string) {
  for (const k in state.diffs) {
    const d = state.diffs[k];
    if (!d.client) continue;
    d.lock = true;
    await diff.setState(d.client, 'hide', `${hide}`);
    d.lock = false;
  }

  if (id) notify({ action: 'hide-change', id }, ws);
}

async function clear(client?: number) {
  if (!client) state.saved = [];

  if (client) {
    if (client in state.diffs && state.diffs[client].client) await diff.clear(state.diffs[client].client);
  } else {
    for (const k in state.diffs) {
      const d = state.diffs[k];
      if (!d.client) continue;
      d.lock = true;
      await diff.clear(d.client);
      d.lock = false;
    }
  }

  const cfg = state.diffs[(client || -1)]?.config;
  notify({ action: 'clear', source: cfg ? source(cfg) : undefined });
}

async function check(ws: WebSocket, client: string|number, id: string, since?: string) {
  try {
    const entries: diff.Entry[] = since ? [] : ([] as diff.Entry[]).concat(state.saved);
    for (const k in state.diffs) {
      if (+client === +k) {
        const client = state.diffs[k];
        if (!client.client) return error('Cannot check entries while disconnected', ws, { id });
        try {
          await listenerPing(client);
        } catch {
          await reconnectDiff(client);
        }
        const src = source(client.config);
        let res: diff.Entry[];
        try {
          res = await diff.entries(client.client, since);
        } catch {
          await reconnectDiff(client);
          res = await diff.entries(client.client, since);
        }
        for (const e of res) e.source = src;
        entries.push.apply(entries, res);
      }
    }
    notify({ action: 'entries', entries, id }, ws);
  } catch (e) {
    error(`Failed checking entries`, ws, { id, stack: e.stack });
  }
}

async function schema(ws: WebSocket, client?: string|number|DatabaseConfig, id?: string) {
  const res: { [id: number]: diff.Schema } = {};
  if (typeof client === 'number' || typeof client === 'string') {
    const c = state.diffs[+client];
    if (!c) return error(`Cannot retrieve schema for unknown client ${client}.`, ws, { id });
    if (!c.client) return error('Cannot retrieve schema while disconnected.', ws, { id });
    res[c.id] = await diff.schema(c.client);
  } else if (client) {
    const c = postgres(prepareConfig(client, { app: 'schema' }));
    try {
      await c`select 1 as x`;
    } catch (e) {
      return error(`Error getting schema: ${e.message}`, ws, { id });
    }

    try {
      return notify({ action: 'schema', schema: await diff.schema(c), id }, ws);
    } catch (e) {
      return error(`Error getting schema: ${e.message}`, ws, { id });
    } finally {
      try {
        await c.end({ timeout: 10 });
      } catch {}
    }
  } else {
    for (const k in state.diffs) {
      const client = state.diffs[k];
      if (!client.client) continue;
      res[client.id] = await diff.schema(client.client);
    }
  }
  notify({ action: 'schema', schema: res, id }, ws);
}

type QueryResult = { rows: any[]; count: number } | { error: string };

async function query(client: DatabaseConfig|number|string, query: string[], params: unknown[][], id: string, ws: WebSocket) {
  if (typeof client === 'number' || typeof client === 'string') {
    const cl: Client = state.diffs[+client];
    if (!cl) return error(`Could not query unknown client ${client}.`, ws, { id });
    if (!cl.client) return error(`Could not query disconnected client ${client} (${source(cl.config)})`);
    const start = Date.now();

    let c: PGClient = undefined as any;
    try {
      c = postgres(prepareConfig(cl.config, { app: 'query' }));
      await c`select 1 as x`;
      await c.begin(async sql => {
        const results: unknown[] = [];
        for (let i = 0; i < query.length; i++) results.push(await sql.unsafe(query[i], params[i] as JSONValue[]));
        notify({ action: 'query', id, result: results.length === 1 ? results[0] : results, time: Date.now() - start, affected: results.length === 1 ? (results[0] as { count: number }).count : results.map(r => (r as { count: number }).count) }, ws);
      });
    } catch (e) {
      if (/cannot run inside a transaction block/.test(e.message)) {
        if (query.length === 1) {
          try {
            const results: unknown[] = [];
            results.push(await c.unsafe(query[0], params[0] as JSONValue[]));
            notify({ action: 'query', id, result: results.length === 1 ? results[0] : results, time: Date.now() - start, affected: results.length === 1 ? (results[0] as { count: number }).count : results.map(r => (r as { count: number }).count) }, ws);
          } catch (e) {
            console.error(e, query);
            error(`Error running query: ${e.message}`, ws, { id });
          }
        } else {
          const err = `Cannot run multiple queries outside of a transaction block, and the supplied sql must be run outside of a transaction block.`;
          console.error(err, query);
          error(`Error running query: ${err}`, ws, { id });
        }
      } else {
        console.error(e, query);
        error(`Error running query: ${e.message}`, ws, { id });
      }
    } finally {
      try {
        await c.end({ timeout: 10 });
      } catch {}
    }
  } else {
    let c: PGClient;
    try {
      c = postgres(prepareConfig(client, { app: 'query' }));
      await c`select 1 as x`;
    } catch (e) {
      return error(`Error running query: ${e.message}`, ws, { id });
    }

    const start = Date.now();
    try {
      await c.begin(async sql => {
        const results: unknown[] = [];
        for (let i = 0; i < query.length; i++) results.push(await sql.unsafe(query[i], params[i] as JSONValue[]));
        notify({ action: 'query', id, result: results.length === 1 ? results[0] : results, time: Date.now() - start, affected: results.length === 1 ? (results[0] as { count: number }).count : results.map(r => (r as { count: number }).count) }, ws);
      });
    } catch (e) {
      if (/cannot run inside a transaction block/.test(e.message)) {
        if (query.length === 1) {
          try {
            const results: unknown[] = [];
            results.push(await c.unsafe(query[0], params[0] as JSONValue[]));
            notify({ action: 'query', id, result: results.length === 1 ? results[0] : results, time: Date.now() - start, affected: results.length === 1 ? (results[0] as { count: number }).count : results.map(r => (r as { count: number }).count) }, ws);
          } catch (e) {
            console.error(e, query);
            error(`Error running query: ${e.message}`, ws, { id });
          }
        } else {
          const err = `Cannot run multiple queries outside of a transaction block, and the supplied sql must be run outside of a transaction block.`;
          console.error(err, query);
          error(`Error running query: ${err}`, ws, { id });
        }
      } else {
        console.error(e, query);
        error(`Error running query: ${e.message}`, ws, { id });
      }
    } finally {
      try { // hmmmm
        await c.end({ timeout: 10 });
      } catch {}
    }
  }
}

interface QueryControl {
  pending: number;
  result: { [con: string]: QueryResult };
  callback: () => void;
  progress: () => void;
}

function queryAll(clients: DatabasesConfig[], query: string[], params: unknown[][], batch: number, id: string, ws: WebSocket) {
  // interleave clients to minimize impact on each server if possible
  const queue: Array<DatabaseConfig & { __key: string }> = [];
  let i = 0;
  while (true) {
    let queued = false;
    for (const c of clients) {
      if (c.databases[i]) {
        queue.push(Object.assign({}, c, { database: c.databases[i], __key: `${source(c)}@${c.databases[i]}` }));
        queued = true;
      }
    }
    i++;
    if (!queued) break;
  }
  const total = queue.length;

  const ctrl: QueryControl = { pending: queue.length, result: {},
    callback: () => notify({ action: 'query-all', id, result: ctrl.result }, ws),
    progress: () => notify({ action: 'notify', notify: `query-all-progress-${id}`, queryId: id, done: total - queue.length, total }, ws),
  };

  for (let i = 0; i < batch && queue.length; i++) {
    queryQueue(queue, query, params, ctrl);
  }
}

async function queryOne(client: DatabaseConfig, query: string[], params: unknown[][]): Promise<QueryResult> {
  let c: PGClient;
  try {
    c = postgres(prepareConfig(client, { app: 'query-all' }));
    await c`select 1 as x`;
  } catch (e) {
    return { error: e.message };
  }

  try {
    return await c.begin(async sql => {
      let result: unknown;
      for (let i = 0; i < query.length; i++) result = await sql.unsafe(query[i], params[i] as JSONValue[]);
      return { rows: result, count: (result as any).count } as QueryResult;
    });
  } catch (e) {
    console.error(e, query);
    return { error: e.message };
  } finally {
    try {
      await c.end({ timeout: 10 });
    } catch {}
  }
}

async function queryQueue(queue: Array<DatabaseConfig & { __key: string }>, query: string[], params: unknown[][], ctrl: QueryControl) {
  let e: (DatabaseConfig & { __key: string })|undefined;
  while ((e = queue.pop())) {
    const res = await queryOne(e, query, params);
    ctrl.pending--;
    ctrl.result[e.__key] = res;
    ctrl.progress();
    if (ctrl.pending === 0) ctrl.callback();
  }
}

async function listConnections(client: PGClient): Promise<Connection[]> {
  return await client<Connection[]>`select pid, usename as user, application_name as application, datname as database, backend_start as started, state, state_change as updated, client_addr || ':' || client_port as client, query, query_start as queried from pg_stat_activity order by backend_start desc`;
}

async function leak(config: DatabaseConfig) {
  config = prepareConfig(config);
  for (const c of Object.values(state.leaks)) {
    if (source(prepareConfig(c.client.config, { database: config.database || 'postgres' })) === source(config)) {
      if (c.databases.includes(config.database)) return error(`Already connected to ${source(config)}`);
      else {
        if (!c.client.client) continue;
        c.databases.push(config.database);
        c.initial[config.database] = await listConnections(c.client.client);
        return status();
      }
    }
  }

  if (!config.ssl) config.ssl = 'prefer';
  const c = postgres(prepareConfig(config, { app: 'monitor' }));

  await c`select 1 as x`;
  const id = state.leakId++;

  try {
    const connections = await listConnections(c);
    state.leaks[id] = { client: { id, client: c, config, listening: false }, initial: { [config.database || 'postgres']: connections }, current: connections, databases: [config.database || 'postgres'] };
  } catch (e) {
    try {
      await c.end({ timeout: 10 });
    } catch {}
    throw (e);
  }

  status();

  poll(true);
}

async function unleak(client: DatabaseConfig) {
  const cfg = source(prepareConfig(client));
  const c = Object.values(state.leaks).find(v => source(prepareConfig(v.client.config, { database: client.database || 'postgres' })) === cfg);
  if (!c) throw new Error(`Cannot stop what is not started`);

  c.databases = c.databases.filter(d => d !== (client.database || 'postgres'));
  delete c.initial[client.database || 'postgres'];

  if (c.databases.length < 1) {
    if (c.client.client) {
      try {
        await c.client.client.end({ timeout: 10 });
      } catch {}
    }
    delete state.leaks[c.client.id];
  }
  
  status();

  poll(true);
}

async function poll(out: boolean) {
  try {
    await Promise.race([sleep(2 * config.pollingInterval).then(() => { throw new Error('poll timed out'); }), _poll(out)]);
  } catch (e) {
    console.error('error processing leaks', e);
  }
  state.leakTimer = setTimeout(poll, config.pollingInterval);
}

async function _poll(out: boolean) {
  const leaks = Object.values(state.leaks);
  if (leaks.length < 1) {
    if (state.leakTimer != null && out) clearTimeout(state.leakTimer);
    delete state.leakTimer;
    return;
  }

  for (const l of leaks) {
    if (l.client.client) {
      try {
        try {
          await l.client.client`select 1 as x`;
          l.current = await listConnections(l.client.client);
        } catch (e) {
          console.error('failed to list connections', e);
          const c = l.client.client;
          l.client.client = undefined;
          try {
            await c.end({ timeout: 10 });
          } catch {}
          try {
            const c = postgres(prepareConfig(l.client.config, { app: 'monitor' }));

            await c`select 1 as x`;
            l.client.client = c;
            l.current = await listConnections(c);
          } catch (e) {
            console.error('failed to list connections with new connection', e);
          }
        }
      } catch (e) {
        console.error('failed to process leaks', e);
      }
    } else {
      try {
        const c = postgres(prepareConfig(l.client.config, { app: 'monitor' }));

        await c`select 1 as x`;
        l.client.client = c;
        l.current = await listConnections(c);
      } catch (e) {
        console.error('failed to list connections with new connection', e);
      }
    }
  }

  if (out && state.leakTimer != null) {
    clearTimeout(state.leakTimer);
    delete state.leakTimer;
  }

  const send: { [id: number]: Connection[] } = {};
  for (const l of leaks) send[l.client.id] = l.current;
  notify({ action: 'leaks', map: send });
}

interface FetchRequest {
  url: string;
  headers?: { [name: string]: string };
  method?: 'GET'|'POST'|'PUT'|'get'|'post'|'put';
  body?: string;
}
async function makeRequest(config: FetchRequest, ws: WebSocket, id: string) {
  try {
    const init: RequestInit = {};
    if (config.headers) init.headers = config.headers;
    if (config.body) init.body = config.body;
    if (config.method) init.method = config.method;
    const res = await fetch(config.url, init);
    notify({ id, action: 'result', result: await res.text() }, ws);
  } catch (e) {
    notify({ id, action: 'result', result: { error: e.stack } });
  }
}

app.addEventListener('listen', ({ secure, hostname, port }) => {
  console.info(`pg-difficult server v${VERSION} is available at ${secure ? 'https://' : 'http://'}${hostname}:${port}/`);
  if (!config.noui) {
    console.info(`Attempting to open http${secure ? 's' : ''}://127.0.0.1:${port} in your browser.`);
    open(`http${secure ? 's' : ''}://127.0.0.1:${port}/`, { wait: false });
  }
});

async function checkDiffListeners() {
  for (const id in state.diffs) {
    const d = state.diffs[id];
    if (!d.client) continue;
    try {
      await listenerPing(d);
    } catch (e) {
      console.error(`listener ping failed, reconnecting...`, e);
      try {
        await reconnectDiff(d);
      } catch (e) {
        console.error('failed to reconnect listener for diff', e);
      }
    }
  }
}
const checkInt = setInterval(checkDiffListeners, config.monitorInterval);

async function halt() {
  console.log(`
stop requested, shutting down...
`);
  clearInterval(checkInt);
  for (const k in state.diffs) {
    const client = state.diffs[k];
    try {
      if (client.client) {
        await diff.stop(client.client);
        try {
          await client.client.end({ timeout: 10 });
        } catch {}
      }
    } catch { /* sure */ }
    if (state.leakTimer != null) clearTimeout(state.leakTimer);
    for (const k in state.leaks) {
      const leak = state.leaks[k];
      try {
        if (leak.client.client) {
          try {
            await leak.client.client.end({ timeout: 10 });
          } catch {}
        }
      } catch { /* sure */ }
    }
  }
  console.log(`
pg_difficult stopped`);
  Deno.exit(0);
}

function defer<T = void>(): [Promise<T>, (ok: T) => void, (err: Error) => void] {
  let ok: (ok: T | Promise<T>) => void = undefined as any;
  let fail: (err: Error) => void = undefined as any;
  const pr = new Promise<T>((y, n) => [ok, fail] = [y, n]);
  return [pr, ok, fail];
}

function sleep(ms: number): Promise<void> {
  const [pr, ok] = defer();
  setTimeout(ok, ms);
  return pr;
}

// make sure interrupt stops the diff
Deno.addSignalListener('SIGINT', halt);

app.addEventListener('error', ev => {
  console.error(`Caught an application error: ${ev.message}`);
});

globalThis.addEventListener("unhandledrejection", (e) => {
  console.log("unhandled rejection at:", e.reason);
  e.preventDefault();
});

// start server
await app.listen({
  port: config.port,
  hostname: config.listen,
});
