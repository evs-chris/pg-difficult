import * as oak from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import postgres from 'https://deno.land/x/postgresjs@v3.3.3/mod.js';
import * as diff from './diff.ts';
import { decode } from 'https://deno.land/std@0.177.0/encoding/base64url.ts'
import { fs } from './client.ts';

interface DatabaseConfig {
  host: string;
  username?: string;
  password?: string;
  port?: number;
  database: string;
  ssl?: 'prefer'|'require';
}

const config = {
  port: 1999,
};

// process args
for (let i = 0; i < Deno.args.length; i++) {
  switch (Deno.args[i]) {
    case '--port': case '-p':
      config.port = +Deno.args[++i] || 1999;
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
}

const state: State = {
  segment: 'Initial',
  saved: [],
  diffId: 0,
  diffs: {},
};

function source(config: DatabaseConfig): string {
  return `${config.username || 'postgres'}@${config.host || 'localhost'}:${config.port || 5432}/${config.database || 'postgres'}`;
}

function prepareConfig(config: DatabaseConfig): DatabaseConfig {
  return Object.assign({ onnotice() {} }, config, { host: config.host || 'localhost', username: config.username || 'postgres', database: config.database || 'postgres', port: config.port || 5432 });
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
type Message = Ping|Start|Stop|Status|Clear|Segment|Check|Schema|Query;

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

  config = prepareConfig(config);
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
  };
  for (const k in state.diffs) {
    status.clients[k] = { id: +k, config: state.diffs[k].config, source: source(state.diffs[k].config) };
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
    const c = postgres(prepareConfig(client));
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
    const c = postgres(prepareConfig(client));
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

app.addEventListener('listen', ({ secure, hostname, port }) => {
  console.info(`pg_difficult server is available at ${secure ? 'https://' : 'http://'}${hostname}:${port}/`);
});

// make sure interrupt stops the diff
Deno.addSignalListener('SIGINT', async () => {
  for (const k in state.diffs) {
    const client = state.diffs[k];
    try {
      await diff.stop(client.client);
      await client.client.end();
    } catch {/* sure */ }
  }
  console.log(`
pg_difficult stopped`);
  Deno.exit(0);
});

// start server
await app.listen({
  port: config.port,
});
