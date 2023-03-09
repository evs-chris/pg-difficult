import * as oak from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import postgres from 'https://deno.land/x/postgresjs@v3.3.3/mod.js';
import * as diff from './diff.ts';
import { decode } from 'https://deno.land/std@0.177.0/encoding/base64url.ts'
import { fs } from './client.ts';

const VERSION = '1.0.2';

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
  return Object.assign({ onnotice() {}, connection: { application_name: `pg-difficult:${config.port}${extra?.app ? `(${extra.app})` : ''}` } }, cfg, { host: cfg.host || 'localhost', username: cfg.username || 'postgres', database: cfg.database || 'postgres', port: cfg.port || 5432 }, extra);
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
interface Start { action: 'start'; config: DatabaseConfig }
interface Stop { action: 'stop', id: number, save?: true }
interface Status { action: 'status' }
interface Clear { action: 'clear' }
interface Segment { action: 'segment'; segment: string }
interface Check { action: 'check'; since?: string }
interface Schema { action: 'schema'; client?: number|DatabaseConfig; id?: string }
interface Query { action: 'query'; client: number|DatabaseConfig; query: string; id: string }
interface Leak { action: 'leak'; config: DatabaseConfig }
interface Unleak { action: 'unleak', config: DatabaseConfig }
interface Interval { action: 'interval', time: number }
type Message = Ping|Start|Stop|Status|Clear|Segment|Check|Schema|Query|Leak|Unleak|Interval;

async function message(this: WebSocket, msg: Message) {
  try {
    switch (msg.action) {
      case 'start': await start(msg.config); break;
      case 'stop': await stop(msg.id, msg.save); break;
      case 'status': status(); break;
      case 'clear': await clear(); break;
      case 'segment': await next(msg.segment); break;
      case 'ping': this.send(JSON.stringify({ action: 'pong' })); break;
      case 'check': check(this, msg.since); break;
      case 'schema': schema(this, msg.client, msg.id); break;
      case 'query': query(msg.client, msg.query, msg.id, this); break;
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

async function start(config: DatabaseConfig) {
  for (const k in state.diffs) {
    const st = state.diffs[k];
    if (source(st.config) === source(config)) return error(`Already connected to ${source(config)}`);
  }

  config = prepareConfig(config, { app: 'diff' });
  if (!config.ssl) config.ssl = 'prefer';

  let client: undefined|postgres.Sql<Record<string, unknown>>;
  try {
    client = postgres(config);
    await client`select 1 as x`;
  } catch (e) {
    client = undefined;
    throw e;
  }

  try {
    await diff.start(client);
  } catch (e) {
    await client.end();
    client = undefined;
    throw e;
  }

  const id = state.diffId++;
  state.diffs[id] = { client, config, id };

  await diff.next(client, state.segment);
  await client.listen('__pg_difficult', () => {
    notify({ action: 'check' });
  });

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
    status.clients[k] = { id: +k, config: state.diffs[k].config, source: source(state.diffs[k].config) };
  }
  for (const k in state.leaks) {
    status.leaks[k] = { id: +k, config: state.leaks[k].client.config, databases: state.leaks[k].databases, initial: state.leaks[k].initial, current: state.leaks[k].current };
  }
  notify({ action: 'status', status });
}

async function next(segment: string) {
  if (!segment) return error('Segment is required.');
  state.segment = segment;
  for (const k in state.diffs) {
    await diff.next(state.diffs[k].client, segment);
  }

  status();
}

async function clear() {
  state.saved = [];
  for (const k in state.diffs) {
    await diff.clear(state.diffs[k].client);
  }
  notify({ action: 'clear' });
}

async function check(ws: WebSocket, since?: string) {
  const entries: diff.Entry[] = ([] as diff.Entry[]).concat(state.saved);
  for (const k in state.diffs) {
    const client = state.diffs[k];
    const src = source(client.config);
    const res = await diff.entries(client.client, since);
    for (const e of res) e.source = src;
    entries.push.apply(entries, res);
  }
  notify({ action: 'entries', entries }, ws);
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

async function query(client: DatabaseConfig|number, query: string, id: string, ws: WebSocket) {
  if (typeof client === 'number') {
    const c = state.diffs[client];
    if (!c) return error(`Could not query unknown client ${client}.`, ws, { id });

    try {
      const result = await c.client.unsafe(query);
      notify({ action: 'query', id, result });
    } catch (e) {
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
      const result = await c.unsafe(query);
      notify({ action: 'query', id, result, time: Date.now() - start });
    } catch (e) {
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
