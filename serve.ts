import * as oak from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import postgres from 'https://deno.land/x/postgresjs@v3.3.4/mod.js';
import * as diff from './diff.ts';
import { decode } from 'https://deno.land/std@0.177.0/encoding/base64url.ts'
import { fs } from './client.ts';

type JSONValue = postgres.JSONValue;

const VERSION = '1.1.1';

interface DatabaseConfig {
  host: string;
  username?: string;
  password?: string;
  port?: number;
  database: string;
  ssl?: 'prefer'|'require';
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
  }
}

interface Client {
  id: number;
  config: DatabaseConfig;
  client: postgres.Sql<Record<string, unknown>>;
}

interface State {
  segment: string;
  saved: diff.Entry[];
  diffId: number;
  diffs: { [id: number]: Client }
  leakId: number;
  leaks: { [id: number]: { client: Client; initial: { [database: string]: Connection[] }; current: Connection[]; databases: string[] } };
  leakTimer?: number;
}

const state: State = {
  segment: 'Initial',
  saved: [],
  diffId: 0,
  diffs: {},
  leakId: 0,
  leaks: {},
};

function source(config: DatabaseConfig): string {
  return `${config.username || 'postgres'}@${config.host || 'localhost'}:${config.port || 5432}/${config.database || 'postgres'}`;
}

function prepareConfig(cfg: DatabaseConfig, extra?: Partial<DatabaseConfig> & { app?: string }): DatabaseConfig {
  const base = {
    onnotice() {},
    types: { date: {
      to: 1184, from: [1082, 1114, 1184],
      serialize: (v: string) => v,
      parse: (v: string) => v,
    } },
    connection: { application_name: `pg-difficult:${config.port}${extra?.app ? `(${extra.app})` : ''}` },
  }
  return Object.assign(base, cfg, { host: cfg.host || 'localhost', username: cfg.username || 'postgres', database: cfg.database || 'postgres', port: cfg.port || 5432 }, extra);
}

// set up server
const app = new oak.Application();
const router = new oak.Router();

const clients: WebSocket[] = [];

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
});

let dev = false;
try { dev = (await Deno.stat('./public')).isDirectory; } catch { /* sure */ }

router.get('/:path*', async ctx => {
  const path: string = ctx.params.path || '';

  if (dev) {
    if (path.includes('..')) return ctx.throw(400);
    try {
      const f = await Deno.readFile(`./public/${path}`);
      return ctx.response.body = f;
    } catch {
      if (!path || path[path.length - 1] === '/') {
        try {
          const f = await Deno.readFile(`./public/${path}index.html`);
          return ctx.response.body = f;
        } catch { /* sure */ }
      }
    }
  }

  if (path in fs) return ctx.response.body = decode(fs[path]);
  if (!path || path[path.length - 1] === '/') {
    const index = `${path}index.html`;
    if (index in fs) ctx.response.body = decode(fs[index]);
    return;
  }

  ctx.throw(404);
});

interface Ping { action: 'ping' }
interface Start { action: 'start'; id: number; config: DatabaseConfig }
interface Restart { action: 'restart'; id: number; config: DatabaseConfig }
interface Resume { action: 'resume'; id: number; config: DatabaseConfig }
interface Stop { action: 'stop', id: number, save?: true }
interface Status { action: 'status' }
interface Clear { action: 'clear' }
interface Segment { action: 'segment'; segment: string, id?: string }
interface Check { action: 'check'; since?: string, id: string }
interface Schema { action: 'schema'; client?: number|DatabaseConfig; id?: string }
interface Query { action: 'query'; client: number|DatabaseConfig; query: string[]; params?: unknown[][]; id: string }
interface Leak { action: 'leak'; config: DatabaseConfig }
interface Unleak { action: 'unleak', config: DatabaseConfig }
interface Interval { action: 'interval', time: number }
type Message = Ping|Start|Restart|Resume|Stop|Status|Clear|Segment|Check|Schema|Query|Leak|Unleak|Interval;

async function message(this: WebSocket, msg: Message) {
  try {
    switch (msg.action) {
      case 'start': await start(msg.config, msg.id, this); break;
      case 'resume': await start(msg.config, msg.id, this, 'resume'); break;
      case 'restart': await start(msg.config, msg.id, this, 'restart'); break;
      case 'stop': await stop(msg.id, msg.save); break;
      case 'status': status(); break;
      case 'clear': await clear(); break;
      case 'segment': await next(msg.segment, this, msg.id); break;
      case 'ping': this.send(JSON.stringify({ action: 'pong' })); break;
      case 'check': check(this, msg.id, msg.since); break;
      case 'schema': schema(this, msg.client, msg.id); break;
      case 'query': query(msg.client, msg.query, msg.params || [], msg.id, this); break;
      case 'leak': leak(msg.config); break;
      case 'unleak': unleak(msg.config); break;
      case 'interval':
        config.pollingInterval = msg.time >= 1000 ? msg.time : 10000;
        status();
        break;
    }
  } catch (e) {
    if ('id' in msg) error(e.message, this, { id: msg.id });
    else error(e.message);
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
      console.log('skipping check for throttle');
      return;
    }
    tm = setTimeout(() => {
      tm = undefined;
      console.log('firing throttled check');
      notify({ action: 'check' });
    }, 1000);
  };
}

async function start(config: DatabaseConfig, id: number, ws: WebSocket, start?: 'resume'|'restart') {
  for (const k in state.diffs) {
    const st = state.diffs[k];
    if (source(st.config) === source(config)) return error(`Already connected to ${source(config)}`);
  }

  config = prepareConfig(config, { app: 'diff' });
  if (!config.ssl) config.ssl = 'prefer';

  const client = postgres(config);

  const did = state.diffId++;
  state.diffs[did] = { client, config, id: did };

  try {
    await client`select 1 as x`;

    // check for started diff
    let restart = false;
    try {
      await client`select * from __pgdifficult_state`;
      restart = true;
      if (!start) {
        await client.end();
        delete state.diffs[did];
        return notify({ id, action: 'resume' }, ws);
      }
    } catch { /* good */ }

    if (restart && start === 'restart') {
      await diff.stop(client);
    } else if (restart && start === 'resume') {
      await client`notify __pg_difficult, 'joined'`;
      notify({ id, action: 'resumed' }, ws);
    } else {
      try {
        await diff.start(client);
      } catch (e) {
        await client.end();
        throw e;
      }

      await diff.next(client, state.segment);
      notify({ id, action: 'started' }, ws);
    }

    await client.listen('__pg_difficult', async v => {
      if (v === 'stopped') {
        await client.end();
        delete state.diffs[id];
        status();
      } else if (!v || v === 'record') {
        throttleCheck();
      }
    });
  } catch (e) {
    delete state.diffs[did];
    try {
      await client.end();
    } catch { /* sure */ }
    throw e;
  }

  status();
  notify({ action: 'check', reset: true });
}

async function stop(id: number, save?: true) {
  const client = state.diffs[id];
  if (!client) return error('Cannot stop what is not started.');
  if (save || save !== false && Object.keys(state.diffs).length > 1) state.saved.push.apply(state.saved, await diff.entries(client.client));
  await diff.stop(client.client);
  await client.client.end();
  delete state.diffs[id];
  status();
}

function status() {
  const status = {
    segment: state.segment,
    clients: {} as { [k: number]: { id: number; config: DatabaseConfig; source: string } },
    leaks: {} as { [k: number]: { id: number; config: DatabaseConfig; databases: string[]; initial: { [database: string]: Connection[] }; current: Connection[] } },
    pollingInterval: config.pollingInterval,
    VERSION,
  };
  for (const k in state.diffs) {
    status.clients[k] = { id: +k, config: Object.assign({}, state.diffs[k].config, { types: undefined, connection: undefined }), source: source(state.diffs[k].config) };
  }
  for (const k in state.leaks) {
    status.leaks[k] = { id: +k, config: Object.assign({}, state.leaks[k].client.config, { types: undefined, connection: undefined }), databases: state.leaks[k].databases, initial: state.leaks[k].initial, current: state.leaks[k].current };
  }
  notify({ action: 'status', status });
}

async function next(segment: string, ws: WebSocket, id?: string) {
  if (!segment) return error('Segment is required.');
  state.segment = segment;
  for (const k in state.diffs) {
    await diff.next(state.diffs[k].client, segment);
  }

  status();

  if (id) notify({ action: 'segment-change', id }, ws);
}

async function clear() {
  state.saved = [];
  for (const k in state.diffs) {
    await diff.clear(state.diffs[k].client);
  }
  notify({ action: 'clear' });
}

async function check(ws: WebSocket, id: string, since?: string) {
  const entries: diff.Entry[] = ([] as diff.Entry[]).concat(state.saved);
  for (const k in state.diffs) {
    const client = state.diffs[k];
    const src = source(client.config);
    const res = await diff.entries(client.client, since);
    for (const e of res) e.source = src;
    entries.push.apply(entries, res);
  }
  notify({ action: 'entries', entries, id }, ws);
}

async function schema(ws: WebSocket, client?: number|DatabaseConfig, id?: string) {
  const res: { [id: number]: diff.Table[] } = {};
  if (typeof client === 'number') {
    const c = state.diffs[client];
    if (!c) return error(`Cannot retrieve schema for unknown client ${client}.`, ws, { id });
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
      await c.end();
    }
  } else {
    for (const k in state.diffs) {
      const client = state.diffs[k];
      res[client.id] = await diff.schema(client.client);
    }
  }
  notify({ action: 'schema', schema: res, id }, ws);
}

async function query(client: DatabaseConfig|number, query: string[], params: unknown[][], id: string, ws: WebSocket) {
  if (typeof client === 'number') {
    const c = state.diffs[client];
    if (!c) return error(`Could not query unknown client ${client}.`, ws, { id });

    try {
      const start = Date.now();
      await c.client.begin(async sql => {
        const results: unknown[] = [];
        for (let i = 0; i < query.length; i++) results.push(await sql.unsafe(query[i], params[i] as JSONValue[]));
        notify({ action: 'query', id, result: results.length === 1 ? results[0] : results, time: Date.now() - start, affected: results.length === 1 ? (results[0] as { count: number }).count : results.map(r => (r as { count: number }).count) });
      });
    } catch (e) {
      console.error(e, query);
      error(`Error running query: ${e.message}`, ws, { id });
    }
  } else {
    const c = postgres(prepareConfig(client, { app: 'query' }));
    try {
      await c`select 1 as x`;
    } catch (e) {
      return error(`Error running query: ${e.message}`, ws, { id });
    }

    try {
      const start = Date.now();
      await c.begin(async sql => {
        const results: unknown[] = [];
        for (let i = 0; i < query.length; i++) results.push(await sql.unsafe(query[i], params[i] as JSONValue[]));
        notify({ action: 'query', id, result: results.length === 1 ? results[0] : results, time: Date.now() - start, affected: results.length === 1 ? (results[0] as { count: number }).count : results.map(r => (r as { count: number }).count) });
      });
    } catch (e) {
      console.error(e, query);
      error(`Error running query: ${e.message}`, ws, { id });
    } finally {
      await c.end();
    }
  }
}

async function listConnections(client: postgres.Sql<Record<string, unknown>>): Promise<Connection[]> {
  return await client<Connection[]>`select pid, usename as user, application_name as application, datname as database, backend_start as started, state, client_addr || ':' || client_port as client from pg_stat_activity order by backend_start desc`;
}

async function leak(config: DatabaseConfig) {
  config = prepareConfig(config);
  for (const c of Object.values(state.leaks)) {
    if (source(prepareConfig(c.client.config, { database: config.database || 'postgres' })) === source(config)) {
      if (c.databases.includes(config.database)) return error(`Already connected to ${source(config)}`);
      else {
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
    state.leaks[id] = { client: { id, client: c, config }, initial: { [config.database || 'postgres']: connections }, current: connections, databases: [config.database || 'postgres'] };
  } catch (e) {
    c.end();
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
    await c.client.client.end();
    delete state.leaks[c.client.id];
  }
  
  status();

  poll(true);
}

async function poll(out: boolean) {
  const leaks = Object.values(state.leaks);
  if (leaks.length < 1) {
    if (state.leakTimer != null && out) clearTimeout(state.leakTimer);
    delete state.leakTimer;
    return;
  }

  for (const l of leaks) l.current = await listConnections(l.client.client);

  if (out && state.leakTimer != null) {
    clearTimeout(state.leakTimer);
    delete state.leakTimer;
  }

  const send: { [id: number]: Connection[] } = {};
  for (const l of leaks) send[l.client.id] = l.current;
  notify({ action: 'leaks', map: send });

  state.leakTimer = setTimeout(poll, config.pollingInterval);
}

app.addEventListener('listen', ({ secure, hostname, port }) => {
  console.info(`pg-difficult server v${VERSION} is available at ${secure ? 'https://' : 'http://'}${hostname}:${port}/`);
});

// make sure interrupt stops the diff
Deno.addSignalListener('SIGINT', async () => {
  for (const k in state.diffs) {
    const client = state.diffs[k];
    try {
      await diff.stop(client.client);
      await client.client.end();
    } catch { /* sure */ }
    if (state.leakTimer != null) clearTimeout(state.leakTimer);
    for (const k in state.leaks) {
      const leak = state.leaks[k];
      try {
        await leak.client.client.end();
      } catch { /* sure */ }
    }
  }
  console.log(`
pg_difficult stopped`);
  Deno.exit(0);
});

// start server
await app.listen({
  port: config.port,
});
