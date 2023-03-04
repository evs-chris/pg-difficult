const { evaluate } = Raport;
const { Window } = RauiWindow;

Ractive.use(RauiButton.plugin(), RauiForm.plugin({ includeStyle: true }), RauiShell.plugin(), RauiMenu.plugin(), RauiWindow.plugin(), RauiAppBar.plugin(), RauiTabs.plugin(), RauiTable.plugin({ includeGrid: true }));

function constr(config) {
  return `${config.username || 'postgres'}@${config.host || 'localhost'}:${config.port || 5432}/${config.database || 'postgres'}`;
}
Ractive.helpers.constr = constr;

Ractive.styleSet({
  raui: {
    primary: {
      fga: '#787878',
      fg: '#222',
    },
    menu: {
      primary: {
        fg: '#447A43',
        bg: '#fff',
      },
    },
    window: {
      title: {
        bg: '#325932',
        inactive: {
          bg: '#787878',
        },
      },
    },
  },
}, { deep: true });

function notify(msg) {
  if (ws) ws.send(JSON.stringify(msg));
}
let request;
{
  let id = 0;
  const listeners = {};
  request = function request(msg) {
    msg.id = id++;
    let ok, fail;
    const pr = new Promise((o, f) => (ok = o, fail = f));
    listeners[msg.id] = [ok, fail];
    notify(msg);
    return pr;
  };
  request.response = function response(id, msg) {
    const listener = listeners[id];
    if (Array.isArray(listener) && typeof listener[0] === 'function') listener[0](msg);
  }
  request.error = function error(id, msg) {
    const listener = listeners[id];
    if (Array.isArray(listener) && typeof listener[1] === 'function') listener[1](msg);
  }
}

const app = globalThis.app = new Ractive({
  target: '#target',
  template: '#template',
  data: {
    config: { username: 'postgres', host: 'localhost', port: 5432, database: 'postgres' },
    entries: [],
    diffs: [],
  },
  observe: {
    entries(v) {
     if (v && v.length) this.set('last', v[v.length - 1].stamp);
     else this.set('last', undefined);
    },
    'status.clients'(v) {
      const active = Object.values(v || {}).map(v => {
        return { title: v.source, action() { app.openEntries(v.id) } }
      });
      if (active.length > 1) active.unshift({ title: 'All Entries', action() { app.openEntries() } });
      this.set('diffs', active);
    },
    'connections savedQueries': {
      handler(v, _o, k) {
        localStorage.setItem(k, JSON.stringify(v || []));
      },
      init: false,
    },
    'settings': {
      handler(v) {
        localStorage.setItem('settings', JSON.stringify(v || {}));
      },
      init: false,
    },
  },
  on: {
    render() {
      // set up mobile resize
      const resize = size => {
        if (!size || !size.width || !size.height) return;
        if (size.width > 100 && size.height > 60) this.host.set('userMax', false);
        else this.host.set('userMax', true);
      };

      resize(this.shell.shellSize());
      setTimeout(() => this.shell.on('resize', (_ctx, size) => resize(size)));
    },
  },
  notify,
  request,
  openQuery(config) {
    const qid = (this.get('qid') || 0) + 1;
    this.set('qid', qid);
    const q = new Query(config);
    this.host.addWindow(q, { id: `query-${qid}`, title: `Query ${qid}: ${constr(config)}` });
    const e = { title: `Query ${qid}: ${constr(config)}`, action: () => q.raise(true) };
    app.push('queries', e);
    q.on('close', () => {
      const qs = this.get('queries') || [];
      const idx = qs.indexOf(e);
      if (~idx) this.splice('queries', idx, 1);
    });
  },
  openSchema(config) {
    const id = `schema-${constr(config)}`;
    let win = this.host.getWindow(id);
    if (win) return win.raise(true);
    win = new Schema(config);
    this.host.addWindow(win, { id, title: `Schema for ${constr(config)}` });
  },
  openEntries(id) {
    const wid = `entries-${id ?? 'all'}`;
    let win = this.host.getWindow(wid);
    if (win) return win.raise(true);
    if (id != null) {
      const con = this.get(`status.clients.${id}.config`);
      win = new Entries(constr(this.get(`status.clients.${id}.config`)));
      this.host.addWindow(win, { id: wid, title: `Entries for ${constr(con)}` });
    } else {
      win = new Entries();
      this.host.addWindow(win, { id: wid, title: `All Entries` });
    }
  },
  ask(question, title) {
    const w = new Ask({ data: { message: question } });
    this.host.addWindow(w, { title, block: true });
    return w.result;
  }
});

app.set('connections', JSON.parse(localStorage.getItem('connections') || '[]'));
app.set('settings', JSON.parse(localStorage.getItem('settings') || '{}'));
app.set('savedQueries', JSON.parse(localStorage.getItem('savedQueries') || '[]'));

class ControlPanel extends Window {
  constructor(opts) { super(opts); }
  async editConnection(which) {
    const config = (this.get('connections') || [])[which];
    const wnd = new Connect({ data: { config: Object.assign({}, config) } });
    this.host.addWindow(wnd, { block: this });
    const res = await wnd.result;
    if (res !== false) {
      if (which != null) this.splice('connections', which, 1, res);
      else this.push('connections', res);
    }
  }
  next(segment) {
    notify({ action: 'segment', segment });
  }
  hasDiff(cfg) {
    const clients = Object.values(this.get('status.clients') || {}).map(c => c.source);
    return clients.includes(constr(cfg));
  }
  startDiff(config) {
    notify({ action: 'start', config });
  }
  stopDiff(config) {
    const clients = Object.values(this.get('status.clients') || {});
    const str = constr(config);
    const client = clients.find(c => c.source === str);
    if (client) notify({ action: 'stop', id: client.id });
  }
  async addDiff() {
    const wnd = new Connect();
    this.host.addWindow(wnd, { block: this });
    const res = await wnd.result;
    if (res !== false) this.startDiff(res);
  }
  clear() {
    notify({ action: 'clear' });
  }
  query(config) {
    app.openQuery(config);
  }
  schema(config) {
    app.openSchema(config);
  }
  entries(id) {
    app.openEntries(id);
  }
}
Window.extendWith(ControlPanel, {
  template: '#control-panel',
  css: `
.connection { display: flex; align-items: center; }
.connection .constr { flex-grow: 1; min-width: 20em; }
.connection .actions { flex-grow: 0 }
.query { display: flex; align-items: center; }
.query .name { width: 15%; }
.query .sql { width: 60%; }
.query .actions { width: 25%; }
`,
  options: { title: 'Control Panel', flex: true, close: false, resizable: true, width: '60em', height: '45em', id: 'control-panel' },
  on: {
    init() {
      // map in the data from the root instance
      this.link('connections', 'connections', { instance: app });
      this.link('status', 'status', { instance: app });
      this.link('entries', 'entries', { instance: app });
      this.link('settings', 'settings', { instance: app });
      this.link('savedQueries', 'savedQueries', { instance: app });
      this.link('loadedQuery', 'loadedQuery', { instance: app });
    },
  },
  observe: {
    'status.segment'(v) {
      this.set('newSegment', v);
    },
  },
});

app.host.addWindow(new ControlPanel());

class Ask extends Window {
  constructor(opts) { super(opts); }
}
Window.extendWith(Ask, {
  template: '#ask',
  options: { flex: true, close: false, resizable: false, maximize: false, minimize: false, width: 'auto', height: 'auto' },
});

class Connect extends Window {
  constructor(opts) { super(opts); }
  cancel() {
    this.close(false, false);
  }
  accept() {
    this.close(false, this.get('config'));
  }
}
Window.extendWith(Connect, {
  template: '#connect',
  options: { title: 'Connect', flex: true, close: false, resizable: false, maximize: false, minimize: false, width: '40em', height: '30em' },
});

class Query extends Window {
  constructor(config, opts) {
    super(opts);
    this.config = config;
  }
  async run(query) {
    this.blocked = true;
    try {
      const res = await request({ action: 'query', query, client: this.config });
      this.set('result', res.result);
      this.set('runtime', res.time);
    } catch (e) {
      this.set('result', e.error);
    }
    this.blocked = false;
  }
  async save() {
    const query = this.get('query');
    let name = this.get('name');
    if (!name) {
      name = await app.ask('What should this query be named?');
      if (name) {
        const qs = app.get('savedQueries') || [];
        if (qs.find(q => q.name === name)) return this.host.toast(`A query named ${name} already exists.`, { type: 'error' });
        else {
          this.set('name', name);
          app.push('savedQueries', { name, sql: query });
        }
      }
    } else {
      const idx = (app.get('savedQueries') || []).findIndex(q => q.name === name)
      if (~idx) app.set(`savedQueries.${idx}`, { name, sql: query });
    }
  }
  load() {
    const q = this.get('loadedQuery');
    this.set({
      loadedQuery: undefined,
      query: q.sql,
      name: q.name,
    });
  }
}
Window.extendWith(Query, {
  template: '#query',
  options: { title: 'Query', flex: true, close: true, width: '50em', height: '40em', resizable: true },
  css: `
.query { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; }
.query .query-text { display: flex; min-height: 20%; }
.query textarea { width: 100%; border: 0; outline: none; }
.query .result { display: flex; border-top: 1px solid; overflow: hidden; flex-grow: 1; }
`,
  on: {
    init() {
      this.set('settings', Object.assign({}, app.get('settings')));
      this.link('loadedQuery', 'loadedQuery', { instance: app });
    },
    raise() {
      const txt = this.find('textarea');
      if (txt) txt.focus();
    },
  },
  observe: {
    'result settings.queryOrderColumns'() {
      const result = this.get('result') || [];
      const first = (result && result[0]) || {};
      const order = this.get('settings.queryOrderColumns') ? Object.keys(first).sort() : Object.keys(first);
      if (order.length) {
        const cols = [];
        for (const k of order) {
          cols.push({ title: k, label: [k], content: [{ t: 2, r: k }], attrs: [{ t: 13, n: 'style', f: [`width: ${Math.ceil(Math.min(20, Math.max(4, k.length, `${first[k]}`.length)) / 1.4)}em;`]}] });
        }
        this.table.replaceColumns(cols);
      } else {
        this.table.replaceColumns([]);
      }
    }
  },
});

class Entries extends Window {
  constructor(source, opts) {
    super(opts);
    this.source = source;
  }
  details(entry) {
    const res = evaluate({ entry }, `
set res = { table:entry.table segment:entry.segment }
if entry.old and entry.new {
 let d = diff(entry.old entry.new)
 if keys(d).length {
   set res.status = :changed
   set res.changed = ^d
 }
} elif not entry.old {
 set res.status = :added
 set res.record = entry.new
} elif not entry.new {
 set res.status = :removed
 set res.record = entry.old
}
res
`);
    return res;
  }
}
Window.extendWith(Entries, {
  template: '#entries',
  options: { flex: true, resizable: true, width: '40em', height: '30em' },
  css: `
.diff { padding: 0.3em; display: flex; flex-wrap: wrap; }
.diff .name, .diff .left, .diff .right { width: 33%; }
.diff .name, .wrapper .name { font-weight: bold; }
.diff.whole .name { width: 100%; }
.entry { padding: 0.2em; }
.entry .key { font-weight: bold; }
h2 { padding: 1em 0 0.5em 0; position: sticky; top: -1em; background-color: #fff; }
`,
  computed: {
    entries() {
      const entries = app.get('entries');
      if (this.source != null) return entries.filter(e => e.source === this.source);
      return entries;
    }
  }
});

class Schema extends Window {
  constructor(config, opts) {
    super(opts);
    this.config = config;
  }
  matches(table, column) {
    const filter = this.get('filter');
    const expr = this.get('expr');
    if (!filter && !expr) return true;
    let str = '';
    if (column) {
      if (filter) str += `([column.name] ilike '%{filter}%')`;
      if (expr) str += `${str ? ' and ' : ''}${expr}`;
    } else {
      if (filter) str += `([table.name] + map(table.columns =>name) ilike '%{filter}%')`;
      if (expr) str += `${str ? ' and ' : ''}find(table.columns |column| => (${expr}))`;
    }
    return evaluate({ table, column, filter }, str);
  }
  compareSchema() {
    const target = this.get('compareSchema');
    const local = this.get('schema');
    if (target && target.schema !== local) {
      this.set('compareSchema', undefined);
      const left = target.schema.reduce((a, t) => (a[t.name] = { schema: t.schema }, t.columns.reduce((a, c) => (a[`${t.name}.${c.name}`] = c, a), a), a), {});
      const right = local.reduce((a, t) => (a[t.name] = { schema: t.schema }, t.columns.reduce((a, c) => (a[`${t.name}.${c.name}`] = c, a), a), a), {});
      const w = new SchemaCompare({ data: { diff: evaluate({ left, right }, 'diff(left right)') } });
      this.host.addWindow(w, { title: `Comparing schema ${constr(target.config)} to ${constr(this.config)}` });
    } else {
      this.set('compareSchema', { config: this.config, schema: local });
      this.host.toast('Click Compare on another schema to compare', { type: 'info', timeout: 4000 });
    }
  }
}
Window.extendWith(Schema, {
  template: '#schema',
  css: `
.schema { overflow: auto; }
.schema-row { padding: 0.2em; position: relative; display: flex; flex-wrap: no-wrap; }
.table { cursor: pointer; position: sticky; top: 0; z-index: 10; }
.column .name { padding-left: 1.7em; box-sizing: border-box; }
.schema-row > * { overflow: hidden; text-overflow: ellipsis; }
.schema-row .name { width: 55%; }
.schema-row .name.pkey { font-weight: bold; }
.schema-row .type { width: 20%; }
.schema-row .nullable { width: 7%; text-align: center; }
.schema-row .default { width: 8%; text-align: center; }
.schema-row .size { width: 10%; }
`,
  options: { flex: true, resizable: true, width: '50em', height: '35em' },
  data() { return { expanded: {} }; },
  on: {
    init() {
      this.link('compareSchema', 'compareSchema', { instance: app });
    },
    async render() {
      this.blocked = true;
      try {
        const msg = await request({ action: 'schema', client: this.config });
        this.blocked = false;
        this.set('schema', msg.schema);
      } catch (e) {
        setTimeout(() => this.close(), 1000);
      }
    },
  },
});

class SchemaCompare extends Window {
  constructor(opts) { super(opts); }
}
Window.extendWith(SchemaCompare, {
  template: '#schema-compare',
  options: { flex: true, resizable: true, minimize: false, width: '50em', height: '35em' },
  css: `
.schema-diff { padding: 0.3em; display: flex; flex-wrap: wrap; }
.schema-diff .name, .schema-diff .left, .schema-diff .right { width: 33%; }
.schema-diff .name { font-weight: bold; }
.schema-diff.whole .name { width: 100%; }
.entry { padding: 0.2em; }
.entry .key { font-weight: bold; }
`,
});

const wsUrl = new URL(window.location);
wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:';
wsUrl.pathname = '/ws';
function connect() {
  if (globalThis.ws) globalThis.ws.close();
  let ws = globalThis.ws = new WebSocket(wsUrl);
  ws.addEventListener('open', () => {
    app.set('connected', true);
    app.set('entries', []);
    notify({ action: 'status' });
    notify({ action: 'check' });
  });
  ws.addEventListener('error', () => {
    ws.close();
    ws = globalThis.ws = undefined;
    app.set('connected', false);
  });
  ws.addEventListener('close', () => {
    ws = globalThis.ws = undefined;
    app.set('connected', false);
    reconnect();
  });
  ws.addEventListener('message', ev => {
    const msg = JSON.parse(ev.data);
    switch (msg.action) {
      case 'status': app.set('status', msg.status); break;
      case 'clear': app.set('entries', []); break;
      case 'error':
        app.host.toast(msg.error || '(unknown error)', { type: 'error' });
        if ('id' in msg) request.error(msg.id, msg);
        break;
      case 'check':
        if (msg.reset) app.set('entries', []);
        notify({ action: 'check', since: app.get('last') });
        break;
      case 'entries': app.push.apply(app, ['entries'].concat(msg.entries || [])); break;
      default:
        if ('id' in msg) request.response(msg.id, msg);
        break;
    }
  });
}

function reconnect() {
  if (!app.get('connected')) setTimeout(() => connect(), 10000);
}

connect();

// Set up debug helper
let el;
document.addEventListener('click', ev => el = ev.target);
document.addEventListener('focus', ev => el = ev.target);

Object.defineProperty(globalThis, 'R', {
  value: new Proxy(() => ({}), {
    apply(_obj, _e, args) {
      if (args.length) {
        let ctx;
        if (typeof args[0] === 'object' && args[0] instanceof Node) ctx = Ractive.getContext(args.shift());
        else ctx = Ractive.getContext(el);
        if (!ctx) return;
        if (typeof args[0] === 'string') {
          if (args.length === 1) return ctx.get(args[0]);
          else if (args.length === 2) return ctx.set(args[0], args[1]);
        } else if (typeof args[0] === 'object') {
          return ctx.set(args[0]);
        }
        return ctx;
      } else {
        return Ractive.getContext(el).get();
      }
    },
    get(_obj, prop) {
      const ctx = Ractive.getContext(el);
      if (!ctx) return;
      if (!(prop in ctx) && prop in ctx.ractive) {
        const val = ctx.ractive[prop];
        if (typeof val === 'function') return val.bind(ctx.ractive);
        return val;
      } else {
        return ctx[prop];
      }
    },
  }),
});

