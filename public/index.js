const { evaluate, registerOperator, parse, run, Root } = Raport;
const { docs } = Raport.Design;
const { Window } = RauiWindow;

registerOperator({ type: 'value', names: ['log'], apply: (_name, args) => console.log.apply(console, args) });

Ractive.use(RauiButton.plugin(), RauiForm.plugin({ includeStyle: true }), RauiShell.plugin(), RauiSplit.plugin(), RauiMenu.plugin(), RauiWindow.plugin(), RauiAppBar.plugin(), RauiTabs.plugin(), RauiTable.plugin({ includeGrid: true }), RauiVirtualList.plugin());

Ractive.perComponentStyleElements = true;

function constr(config, extra) {
  if (typeof config === 'string') return config;
  const cfg = Object.assign({}, config, extra);
  return `${cfg.username || 'postgres'}@${cfg.host || 'localhost'}:${cfg.port || 5432}/${cfg.database || 'postgres'}`;
}
Ractive.helpers.constr = constr;
Ractive.helpers.age = function(ts) {
  Ractive.sharedGet('now'); // trigger updates with global interval
  const now = new Date();
  const d = new Date(ts);
  let tmp;
  if ((tmp = +now - +d) < 120000) return `${Math.ceil(tmp / 1000)} second${tmp > 1000 ? 's' : ''} ago`;
  if ((tmp = +now - +d) < 5400000) return `${Math.ceil(tmp / 60000)} minute${tmp > 6000 ? 's' : ''} ago`;
  const today = evaluate({ d: new Date(ts) }, 'date(d :midnight)');
  if (+d > +today) return `${evaluate({ d }, `d#date,'HH:mm'`)} today`;
  const yesterday = evaluate({ d: new Date(ts) }, 'date(d :midnight) - #1d#');
  if (+d > +yesterday) return `${evaluate({ d }, `d#date,'HH:mm'`)} yesterday`;
  if (+now - +d < (300 * 86400000)) return evaluate({ d }, `d#date,'MMM d'`);
  if (+now - +d > (7 * 86400000)) return evaluate({ d }, `d#date,'yyyy-MM-dd'`);
  return evaluate({ d }, `d#date,'HH:mm EEE'`);
}
Ractive.helpers.escapeKey = Ractive.escapeKey;
Ractive.helpers.evaluate = Raport.evaluate;

Ractive.decorators.autofocus = function autofocus(node) {
  if (node) {
    if (typeof node.focus === 'function') node.focus();
    if ('selectionStart' in node) {
      node.selectionStart = 0;
      node.selectionEnd = -1;
    }
  }
  return { teardown() {} };
}

Ractive.decorators.tracked = function tracked(node, name) {
  const init = this[name];
  if (node && name) {
    this[name] = node;
  }
  return { 
    teardown() {
      if (this[name] === node) this[name] = init;
    }
  };
}

setInterval(() => {
  Ractive.sharedSet('now', new Date());
}, 5000);

let settingsLock = false;
function readSettings() {
  settingsLock = true;
  app.set('connections', JSON.parse(localStorage.getItem('connections') || '[]'));
  app.set('settings', JSON.parse(localStorage.getItem('settings') || '{}'));
  app.set('savedQueries', JSON.parse(localStorage.getItem('savedQueries') || '[]'));
  app.set('savedReports', JSON.parse(localStorage.getItem('savedReports') || '[]'));
  app.set('scratchPads', JSON.parse(localStorage.getItem('scratchPads') || '[]'));
  settingsLock = false;
}

Ractive.helpers.moveUp = (ctx, max) => {
  const idx = ctx.get('@index');

  if (idx <= 0) return;
  const path = ctx.resolve('../');
  const inst = ctx.ractive;
  const [item] = inst.splice(path, idx, 1).result;
  inst.splice(path, max ? 0 : idx - 1, 0, item);
};

Ractive.helpers.moveDown = (ctx, max) => {
  const idx = ctx.get('@index');

  if (idx >= ctx.get('@last')) return;
  const path = ctx.resolve('../');
  const inst = ctx.ractive;
  const [item] = inst.splice(path, idx, 1).result;
  inst.splice(path, max ? ctx.get('@last') + 1 : idx + 1, 0, item);
};

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
  if (globalThis.ws) ws.send(JSON.stringify(msg));
  else if (globalThis.clientOnly) {
    app.host.toast('Server not available', { type: 'error' });
    if ('id' in msg) request.error(msg.id, { error: 'Server not available' });
  }
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
    app.add('waiting', 1);
    return pr;
  };
  request.response = function response(id, msg) {
    const listener = listeners[id];
    if (Array.isArray(listener) && typeof listener[0] === 'function') {
      app.subtract('waiting', 1);
      delete listeners[id];
      listener[0](msg);
    }
  }
  request.error = function error(id, msg) {
    const listener = listeners[id];
    if (Array.isArray(listener) && typeof listener[1] === 'function') {
      app.subtract('waiting', 1);
      delete listeners[id];
      listener[1](msg);
    }
  }
}

let gate;
{
  const thunks = {};
  const pending = {};
  const defer = function(action, thunk) {
    let ok, fail;
    const res = new Promise((o, f) => (ok = o, fail = f));
    (thunks[action] || (thunks[action] = [])).push([thunk, ok, fail]);
    return res;
  }
  const pump = async function(action) {
    while ((thunks[action] || []).length) {
      const [thunk, ok, fail] = thunks[action].shift();
      const req = pending[action] = request(thunk());
      req.then(ok, fail);
      try {
        await req;
      } catch { /* ok */ }
    }
    pending[action] = undefined;
  }
  gate = function gate(action, thunk) {
    if (pending[action]) return defer(action, thunk);
    else {
      const req = request(thunk());
      pending[action] = req;
      req.then(() => pump(action), () => pump(action));
      return req;
    }
  };
}

function expandSchema(schema) {
  const res = {};
  for (const t of schema.tables) {
    if (!res[t.schema]) res[t.schema] = {};
    if (!res[t.schema].tables) res[t.schema].tables = {};
    const cols = res[t.schema].tables[t.name] = {};
    for (const c of t.columns) cols[c.name] = Object.assign({}, c, { name: undefined });
  }
  for (const t of schema.views || []) {
    if (!res[t.schema]) res[t.schema] = {};
    if (!res[t.schema].views) res[t.schema].views = {};
    const cols = res[t.schema].views[t.name] = {};
    for (const c of t.columns) cols[c.name] = Object.assign({}, c, { name: undefined });
  }
  for (const f of schema.functions) {
    if (!res[f.schema]) res[f.schema] = {};
    if (!res[f.schema].functions) res[f.schema].functions = {};
    const sig = `${f.name}(${f.arguments})`;
    res[f.schema].functions[sig] = f;
  }
  return res;
}

let reportId = 0;
let scratchId = 0;
let localDiffId = 0;

class App extends Ractive {
  constructor(opts) { super(opts); }

  compareSchema(local, config) {
    const target = this.get('compareSchema');
    if (target && target.schema !== local) {
      this.set('compareSchema', undefined);
      const left = expandSchema(target.schema);
      const right = expandSchema(local);
      const w = new SchemaCompare({ data: { diff: evaluate({ left, right }, 'diff(left right)') } });
      this.host.addWindow(w, { title: `Comparing schema ${constr(target.config)} to ${constr(config || 'Local File')}`});
    } else {
      this.set('compareSchema', { config: config || 'Local File', schema: local });
      this.host.toast('Click Compare on another schema to compare', { type: 'info', timeout: 4000 });
    }
  }
}
Ractive.extendWith(App, {
  css(data) {
    return `
      .html { color: ${data('raui.primary.fg') || '#222'}; background-color: ${data('raui.primary.bg') || '#fff'}; }
      .query-text textarea {
        color: ${data('raui.primary.fg') || data('raui.fg') || '#222'};
        background-color: ${data('raui.primary.bg') || data('raui.bg') || '#fff'};
      }
      .schema-row.sticky-header { background-color: ${data('raui.primary.bg') || '#fff'}; }
      .stiped:nth-child(odd), .striped-odd { background-color: ${data('theme') === 'dark' ? '#353535' : '#f2f2f2'}; }
      .stiped:nth-child(even), .striped-even { background-color: ${data('theme') === 'dark' ? '#3b3b3b' : '#fdfdfd'}; }
    `;
  },
});

const app = globalThis.app = new App({
  target: '#target',
  template: '#template',
  data: {
    config: { username: 'postgres', host: 'localhost', port: 5432, database: 'postgres' },
    waiting: 0,
    entries: [],
    diffs: [],
  },
  observe: {
    'status.clients': {
      handler(v) {
        const active = Object.values(v || {}).map(v => {
          return { title: v.source, action() { app.openEntries(v.id) }, right: !(v.connected ?? true) ? '<span class=disconnected title="Connection to server has been lost.">!</span>' : '' };
        });
        if (active.length > 1) active.unshift({ title: 'All Entries', action() { app.openEntries() } });
        this.set('diffs', active);

        const found = [];
        const schemas = this.get('schemas') || {};
        for (const client of Object.values(v || {})) {
          found.push(client.source);
          if (schemas[client.source]) continue;
          request({ action: 'schema', client: client.config }).then(s => this.set(`schemas.${Ractive.escapeKey(client.source)}`, s.schema));
        }
        for (const k in schemas) {
          if (!~found.indexOf(k)) this.set(`schemas.${Ractive.escapeKey(k)}`, undefined);
        }
      },
      strict: true, init: false,
    },
    'status.leaks': {
      handler(v) {
        const all = Object.values(v || {}).reduce((a, c) => {
          a.push.apply(a, c.databases.map(d => ({ title: constr(c.config, { database: d }), action() { app.openLeak(c.id, d) } })));
          return a;
        }, []);
        if (all.length > 1) all.unshift({ title: 'All Connections', action() { app.openLeak() } });
        this.set('leaks', all);
      },
      strict: true, init: false,
    },
    'connections savedQueries savedReports scratchPads': {
      handler: debounce((v, _o, k) => {
        if (settingsLock) return;
        localStorage.setItem(k, JSON.stringify(v || []));
        if (k === 'savedReports') {
          const min = Math.max.apply(Math, v.map(r => +r.id).concat([reportId]));
          reportId = min;
        } else if (k === 'scratchPads') {
          const min = Math.max.apply(Math, v.map(r => +r.id).concat([scratchId]));
          scratchId = min;
        }
      }),
      init: false,
    },
    'settings': {
      handler: debounce((v) => {
        if (settingsLock) return;
        localStorage.setItem('settings', JSON.stringify(v || {}));
      }),
      init: false,
    },
    '@.host': {
      handler(v) {
        if (v) {
          const bb = () => {
            const wins = v.get('windows');
            const list = [];
            for (const k in wins) {
              if (!/query-|leaks-|entries-|control-|host-/.test(k)) list.push({ title: wins[k].title, marquee: true, action() { v.raise(k, true); } });
            }
            this.set('others', list);
          };
          let tm;
          const cb = () => {
            if (tm != null) return;
            tm = setTimeout(() => {
              tm = null;
              bb();
            }, 200);
          };
          v.observe('windows.* windows.*.title', cb, { strict: true });
        }
      },
      strict: true,
    },
    'settings.theme'(v) {
      if (v !== 'light' && v !== 'dark') {
        const ml = window.matchMedia('(prefers-color-scheme: dark)');
        v = ml.matches ? 'dark' : 'light';
      }
      Ractive.styleSet('theme', v);
      if (v === 'light') {
        Ractive.styleSet({
          'raui.primary.bg': '#fff',
          'raui.primary.fg': '#222',
          'raui.primary.fga': '#787878',
          'raui.window.host.bg': '#eee',
          'raui.window.primary.title.fg': '#ddd',
          'raui.window.primary.shadow': 'rgba(0, 0, 0, 0.2)',
          'raui.window.primary.topmost.shadow': 'rgba(0, 0, 0, 0.3)',
          'raui.table': {
            even: '#f2f2f2',
            odd: '#fdfdfd',
            header: {
              bg: '#dedede',
            },
          },
          'raui.split.handle': {
            bg: 'rgba(0, 0, 0, 0.1)',
            fg: 'rgba(0, 0, 0, 0.4)',
          },
        });
      } else if (v === 'dark') {
        Ractive.styleSet({
          'raui.primary.bg': '#333',
          'raui.primary.fg': '#e0e0e0',
          'raui.primary.fga': '#999',
          'raui.window.host.bg': '#444',
          'raui.window.primary.title.fg': '#e0e0e0',
          'raui.window.primary.shadow': 'rgba(128, 128, 128, 0.2)',
          'raui.window.primary.topmost.shadow': 'rgba(128, 128, 128, 0.3)',
          'raui.table': {
            even: '#3b3b3b',
            odd: '#353535',
            header: {
              bg: '#2a2a2a',
            },
          },
          'raui.split.handle': {
            bg: 'rgba(255, 255, 255, 0.1)',
            fg: 'rgba(255, 255, 255, 0.4)',
          },
        });
      }
    },
    waiting(v) {
      if (v) document.body.style.cursor = 'wait';
      else document.body.style.cursor = 'default';
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

      this.host.toastDefaults.top = false;
      this.host.toastDefaults.bottom = true;
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
      win.combined = true;
      this.host.addWindow(win, { id: wid, title: `All Entries` });
    }
    win.link('newSegment', 'newSegment', { instance: this });
  },
  openLeak(id, database) {
    const wid = `leaks-${id ?? 'all'}-${database || 'all'}`;
    let win = this.host.getWindow(wid);
    if (win) return win.raise(true);
    if (id != null) {
      const con = this.get(`status.leaks.${id}.config`);
      win = new Leaks(id, database);
      this.host.addWindow(win, { id: wid, title: `Monitored Connections for ${constr(con, { database })}` });
    } else {
      win = new Leaks();
      this.host.addWindow(win, { id: wid, title: 'All Monitored Connections' });
    }
  },
  openReport(report) {
    const id = report?.id ?? ++reportId;
    const wid = `report-${id}`;
    let win = this.host.getWindow(wid);
    if (win) return win.raise(true);
    win = new Report({ data: { reportId } }, report);
    this.host.addWindow(win, { id: wid, title: `Loading report...` });
  },
  openScratch(pad) {
    const id = pad?.id ?? ++scratchId;
    const wid = `scratch-${id}`;
    let win = this.host.getWindow(wid);
    if (win) return win.raise(true);
    win = new ScratchPad({ data: { scratchId } }, pad);
    this.host.addWindow(win, { id: wid, title: `Loading scratch pad...` });
  },
  openLocalDiff() {
    const id = ++localDiffId;
    const win = new Diff();
    this.host.addWindow(win, { id: `local-diff-${id}`, title: `Local Diff ${id}` });
  },
  confirm(question, title) {
    const w = new Confirm({ data: { message: question } });
    this.host.addWindow(w, { title, block: true, top: 'center', left: 'center' });
    return w.result;
  },
  ask(question, title, value) {
    const w = new Ask({ data: { message: question, value: value || '' } });
    this.host.addWindow(w, { title, block: true, top: 'center', left: 'center' });
    return w.result;
  },
  choose(question, buttons, title) {
    const w = new Choose({ data: { message: question, buttons } });
    this.host.addWindow(w, { title, block: true, top: 'center', left: 'center' });
    return w.result;
  },
  async loadEntries() {
    const file = await load('.pgdd');
    const win = new Entries(undefined, { data: { loaded: JSON.parse(file.text) } });
    app.host.addWindow(win, { title: `Loaded entries from ${file.name}` });
  },
  async loadSchema() {
    const file = await load('.pgds,.pgdd');
    let data = JSON.parse(file.text);
    if ('schemas' in data) {
      for (let [id, schema] of Object.entries(data.schemas)) {
        if (Array.isArray(schema)) schema = { tables: schema };
        const win = new Schema(undefined, { data: { schema } });
        app.host.addWindow(win, { title: `Loaded diff schema ${id} from ${file.name}` });
      }
    } else {
      if (Array.isArray(data)) data = { tables: data };
      const win = new Schema(undefined, { data: { schema: data } });
      app.host.addWindow(win, { title: `Loaded schema from ${file.name}` });
    }
  },
  exploreHosts() {
    const wnd = new HostExplore();
    wnd.link('savedReports', 'reports', { instance: this });
    app.host.addWindow(wnd);
  },
});

Ractive.helpers.appSet = (p, v) => app.set(p, v);

readSettings();

class ControlPanel extends Window {
  constructor(opts) { super(opts); }
  diffStateMap = new Map();
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
  hasLeak(cfg) {
    const clients = Object.values(this.get('status.leaks') || {}).reduce((a, c) => {
      for (const db of c.databases) a.push(constr(c.config, { database: db }));
      return a;
    }, []);
    return clients.includes(constr(cfg));
  }
  async startDiff(config) {
    this.waitForDiff(config, true);
    let res;
    try {
      res = await request({ action: 'start', config });
    } finally {
      this.waitForDiff(config, false);
    }
    if (res.action === 'resume') {
      const what = await app.choose('There is already a running diff in this database. Would you like to cancel, resume the diff that is already running from this instance, or restart start the diff and disconnect any other instances that are connected?', [
        { label: 'Cancel', action() { this.close(); }, where: 'left', title: 'Nevermind, don\'t do anything.' },
        { label: 'Restart', action() { this.close(false, 'restart'); }, title: 'Stop the active diff and start a new one.', where: 'center' },
        { label: 'Resume', action() { this.close(false, 'resume'); }, title: 'Join the active diff.' }
      ], 'Restart or resume diff?');
      if (what) {
        this.waitForDiff(config, true);
        try {
          await request({ action: what, config });
        } finally {
          this.waitForDiff(config, false);
        }
      }
    }
  }
  async stopDiff(config) {
    const clients = Object.values(this.get('status.clients') || {});
    const str = constr(config);
    const client = clients.find(c => c.source === str);
    if (client) {
      this.waitForDiff(config, true);
      await request({ action: 'stop', diff: client.id });
      this.waitForDiff(config, false);
    }
  }
  async addDiff() {
    const wnd = new Connect();
    this.host.addWindow(wnd, { block: this });
    const res = await wnd.result;
    if (res !== false) this.startDiff(res);
  }
  waitForDiff(config, wait) {
    this.diffStateMap.set(config, wait);
    this.update('@.diffStateMap');
  }
  diffWait(config) {
    const map = this.get('@.diffStateMap');
    return map.get(config);
  }
  startLeak(config) {
    notify({ action: 'leak', config });
  }
  stopLeak(config) {
    const cfg = Object.assign({}, config);
    notify({ action: 'unleak', config: cfg });
  }
  async addLeak() {
    const wnd = new Connect();
    this.host.addWindow(wnd, { block: this });
    const res = await wnd.result;
    if (res !== false) this.startLeak(res);
  }
  clear() {
    notify({ action: 'clear' });
  }
  query(config, database) {
    app.openQuery(database ? Object.assign({}, config, { database }) : config);
  }
  schema(config, database) {
    app.openSchema(database ? Object.assign({}, config, { database }) : config);
  }
  entries(id) {
    if (typeof id === 'object') id = Object.values(this.get('status.clients')).find(c => constr(c.config) === constr(id))?.id;
    if (id != null) app.openEntries(id);
    else app.openEntries();
  }
  leaks(id, database) {
    if (typeof id === 'object') {
      database = id.database;
      id = Object.values(this.get('status.leaks')).find(c => c.databases.map(d => constr(c.config, { database: d })).includes(constr(id)))?.id;
      if (id != null) app.openLeak(id, database);
    } else app.openLeak(id, database);
  }
  poll() {
    app.notify({ action: 'interval', time: this.get('status.pollingInterval') });
  }
  report(rep) {
    app.openReport(rep);
  }
  scratch(pad) {
    app.openScratch(pad);
  }
  localDiff() {
    app.openLocalDiff();
  }
  reportHasQuerySql(rep) {
    return rep.sources.find(s => s.type === 'query-all-sql' || s.type === 'query' && !s.config);
  }
  halt() {
    app.set('halted', true);
    app.notify({ action: 'halt' });
  }
  exploreHosts() {
    app.exploreHosts();
  }
  exportSettings() {
    const json = {};
    json.settings = app.get('settings');
    json.connections = app.get('connections');
    json.savedQueries = app.get('savedQueries');
    json.savedReports = app.get('savedReports');
    json.scratchPads = app.get('scratchPads');
    download(`${window.location.host} ${evaluate('@date#timestamp')} settings.pgdconf`.replace(/:/g, '-'), JSON.stringify(json), 'application/pg-difficult-config');
  }
  async importSettings() {
    const file = (await load('.pgdconf', false)).text;
    app.set(JSON.parse(file));
  }
}
Window.extendWith(ControlPanel, {
  template: '#control-panel',
  css: `
.record { display: flex; align-items: center; justify-content: space-between; }
.connection { display: flex; flex-direction: column; }
.connection .constr { display: flex; flex-grow: 1; min-width: 20em; align-items: center; }
.connection .actions { display: flex; flex-shrink: 0; justify-content: space-between; }
.query { display: flex; align-items: center; }
.query .name { width: 15%; }
.query .sql { width: 60%; }
.query .actions { width: 25%; }
.report, .scratch { display: flex; align-items: center; justify-content: space-between; }
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
      this.link('savedReports', 'savedReports', { instance: app });
      this.link('scratchPads', 'scratchPads', { instance: app });
      this.link('loadedQuery', 'loadedQuery', { instance: app });
      this.link('newSegment', 'newSegment', { instance: app });
    },
  },
  observe: {
    'status.segment'(v) {
      this.set('newSegment', v);
    },
    newSegment(v) {
      if (v && v !== this.get('status.segment')) this.next(v);
    },
  },
});

app.host.addWindow(new ControlPanel());

class Confirm extends Window {
  constructor(opts) { super(opts); }
}
Window.extendWith(Confirm, {
  template: '#confirm',
  options: { flex: true, close: false, resizable: false, maximize: false, minimize: false, width: 'auto', height: 'auto' },
});

class Ask extends Window {
  constructor(opts) { super(opts); }
}
Window.extendWith(Ask, {
  template: '#ask',
  options: { flex: true, close: false, resizable: false, maximize: false, minimize: false, width: 'auto', height: 'auto' },
});

class Choose extends Window {
  constructor(opts) { super(opts); }
}
Window.extendWith(Choose, {
  template: '#choose',
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
  options: { title: 'Connect', flex: true, close: false, resizable: true, maximize: false, minimize: false, width: '40em', height: '30em' },
});

const escRE = /[<>&]/g;
const escapes = { '<': '&lt;', '>': '&gt;', '&': '&amp;' };

class Diff extends Window {
  constructor(opts) { super(opts); }

  diff(left, right) {
    const l = this.parse(left);
    const lcsv = this.get('csv');
    const r = this.parse(right);
    const rcsv = this.get('csv');
    this.set('hasCSV', lcsv || rcsv);
    const diff = evaluate({ left: l, right: r }, 'diff(left right)')
    const res = {};
    for (const k in diff) res[k.replace(/^v\./, '')] = diff[k];
    return res;
  }

  parse(val) {
    this.set('csv', false);
    if (!val) return;
    if (val[0] === '<') return evaluate({ val }, 'parse(val xml:1)');
    const res = evaluate({ val }, 'parse(val)')?.v;
    if (res === undefined || Object.keys(res).length === 1 && res.r && res.r.k) {
      this.set('csv', true);
      return evaluate({ val, header: this.get('csvHeader') }, `parse(val csv:1 detect:1 header:header)`);
    }
    return res;
  }

  string(val, comp) {
    if (val === undefined) return 'undefined';
    if (comp && val && typeof comp === 'string' && typeof val === 'string') {
      comp = evaluate({ val: comp }, `string(val ${this.get('format') || 'raport'}:1)`).replace(escRE, c => escapes[c]);
      val = evaluate({ val }, `string(val ${this.get('format') || 'raport'}:1)`).replace(escRE, c => escapes[c]);
      let i = 0;
      for (; i < comp.length && i < val.length; i++) if (val[i] !== comp[i]) break;
      return val.slice(0, i) + '<span class=highlight>' + val.slice(i) + '</span>';
    }
    return evaluate({ val }, `string(val ${this.get('format') || 'raport'}:1)`);
  }

  paste(which, patch) {
    let val = this.get('copied.text');
    if (patch) {
      const cur = this.parse(this.get(which));
      Object.assign(cur, this.parse(val));
      this.set(which, JSON.stringify(cur));
    } else {
      this.set(which, val);
    }
    this.set('copied.recent', false);
  }
}
Window.extendWith(Diff, {
  template: '#diff',
  options: { flex: true, width: '60em', height: '45em', resizable: true },
  noCssTransform: true,
  css(data) {
    return `
h3 { padding: 0.5rem; text-align: center; }
textarea { border: none; outline: none; padding: 0.2rem; }
pre { margin: 0; white-space: pre-wrap; word-break: break-all; }
.tree-view { overflow: auto; flex-grow: 1; }
.tree { margin-left: 0.5em; padding-left: 0.5em; border-left: 1px dotted #aaa; }
.tree:hover { border-left-color: blue; }
.tree .node { white-space: nowrap; }
.tree .key { margin-left: 0.5em; display: inline-block; }
.tree .type { color: #aaa; display: inline-block; }
.tree .value { display: inline-block; vertical-align: top; white-space: pre-wrap; word-break: break-all; }
.tree .children { display: block; }
.tree .expand { display: none; width: 1em; height: 1em; box-sizing: border-box; border: 1px solid #aaa; color: #999; vertical-align: middle; line-height: 0.8em; text-align: center; display: none; cursor: pointer; }
.tree .expand.show { display: inline-block; }
.highlight { background-color: yellow; }
.paster { display: flex; width: 100%; height: 100%; opacity: 0.8; justify-content: space-around; align-items: center; cursor: pointer; }
${data('theme') === 'dark' ? `
.differ, textarea { color: #ddd; background-color: #333; }
.tree:hover { border-left-color: cyan; }
.highlight { background-color: darkblue; }` : ''}
`;
  },
  on: {
    init() {
      this.link('copied', 'copied', { instance: app });
      const s = app.get('settings.diff') || {};
      this.set('leftView', s.leftview === 'text' ? undefined : 'tree');
      this.set('rightView', s.rightview === 'text' ? undefined : 'tree');
      this.set('format', s.format);
    },
  },
});

class Query extends Window {
  constructor(config, opts) {
    super(opts);
    this.config = config;
  }
  async runQuery(query) {
    if (this.ace) {
      const sel = this.getContext(this.ace).decorators.ace.editor.getSelectedText();
      if (sel) query = sel;
    }
    this.blocked = true;
    try {
      const res = await request({ action: 'query', query: [query], client: this.config });
      this.set('result', res.result);
      this.set('runtime', res.time);
      this.set('affected', res.affected);
      this.set('error', null);
    } catch (e) {
      this.set('error', e.message);
      this.set('result', []);
      this.set('affected', null);
    }
    this.blocked = false;
  }
  async saveQuery() {
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
  loadQuery() {
    const q = this.get('loadedQuery');
    this.set({
      loadedQuery: undefined,
      query: q.sql,
      name: q.name,
    });
  }
  clicked(ev, col, rec) {
    if (col === undefined) return;
    if (rec?.query === this.get('query')) return;
    const val = (ev.ctrlKey || ev.shiftKey) ? rec : col;
    const msg = `Copied ${(ev.ctrlKey || ev.shiftKey) ? 'record JSON' : 'column value'} to clipboard.`;
    const str = val && typeof val === 'object' ? JSON.stringify(val) : val;
    Ractive.helpers.copyToClipboard(str, msg);
  }
  downloadQuery = downloadQuery;
}
Window.extendWith(Query, {
  template: '#query',
  options: { title: 'Query', flex: true, close: true, width: '50em', height: '40em', resizable: true },
  css: `
.query { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; }
.query .query-text { height: 100%; }
.query textarea { width: 100%; border: 0; outline: none; }
.query .result { display: flex; border-top: 1px solid; overflow: hidden; flex-grow: 1; height: 100%; box-sizing: border-box; }
`,
  on: {
    init() {
      this.set('settings', Object.assign({}, app.get('settings')));
      this.link('settings.editor', 'editor', { instance: app });
      this.link('loadedQuery', 'loadedQuery', { instance: app });
    },
    raise() {
      const txt = this.find('textarea');
      if (txt) txt.focus();
    },
  },
  observe: {
    'result settings.queryOrderColumns': {
      handler() {
        const result = this.get('result') || [];
        const first = (result && result[0]) || {};
        const order = this.get('settings.queryOrderColumns') ? Object.keys(first).sort() : Object.keys(first);
        if (order.length) {
          const cols = [];
          for (const k of order) {
            cols.push({ label: [k], content: [{ t: 2, x: { r: [k], s: '_0&&typeof _0==="object"?JSON.stringify(_0):_0' } }], attrs: [{ t: 13, n: 'style', f: [`width: ${Math.ceil(Math.min(20, Math.max(4, k.length, `${first[k]}`.length)) / 1.4)}em;`]}, { t: 70, n: ['click'], f: { r: ['@this', '@event', k, '.'], s: '[_0.clicked(_1,_2,_3)]' } }], id: k, sort: k });
          }
          this.table.replaceColumns(cols);
        } else {
          this.table.replaceColumns([]);
        }
      },
      init: false,
    }
  },
});

function reverseEntry(entry, schema) {
  if (entry.old && !entry.new) {
    return [`insert into "${entry.schema}"."${entry.table}" (${Object.keys(entry.old).map(k => `"${k}"`).join(', ')}) values (${Object.keys(entry.old).map((_k, i) => `$${i + 1}`).join(', ')})`, Object.values(entry.old)];
  } else if (entry.new && !entry.old) {
    const tbl = schema.tables.find(t => t.schema === entry.schema && t.name === entry.table);
    if (!tbl) return;
    const keys = tbl.columns.filter(c => c.pkey);
    if (keys.length) return [`delete from "${entry.schema}"."${entry.table}" where ${keys.map((k, i) => `"${k.name}" = $${i + 1}`).join(' and ')}`, keys.map(k => entry.new[k.name])];
    else return [`delete from "${entry.schema}"."${entry.table}" where ${tbl.columns.map((c, i) => `"${c.name}" = $${i + 1}`).join(' and ')}`, tbl.columns.map(c => entry.new[c.name])];
  } else {
    const tbl = schema.tables.find(t => t.schema === entry.schema && t.name === entry.table);
    if (!tbl) return;
    const keys = tbl.columns.filter(c => c.pkey);
    // TODO: maybe diff this down to only the changed fields at some point
    let i = 1;
    if (keys.length) return [`update "${entry.schema}"."${entry.table}" set ${Object.keys(entry.old).map(k => `"${k}" = $${i++}`).join(', ')} where ${keys.map(k => `"${k.name}" = $${i++}`).join(' and ')}`, Object.keys(entry.old).map(k => entry.old[k]).concat(keys.map(k => entry.old[k.name]))];
    else return [`update "${entry.schema}"."${entry.table}" set ${Object.keys(entry.old).map(k => `"${k}" = $${i++}`).join(', ')} where ${Object.keys(entry.new).map(k => `"${k}" = $${i++}`).join(' and ')}`, Object.keys(entry.old).map(k => entry.old[k]).concat(Object.keys(entry.new).map(k => entry.new[k]))];
  }
}

function adjacentEntries(entry, entries, by) {
  let idx = entries.indexOf(entry);
  const segment = entry.segment;
  if (!~idx) return [];
  const res = [];
  if (by === 'segment') {
    for (; idx >= 0; idx--) if (entries[idx].segment !== segment) break;
    idx++; // start on the topmost matching entry
    by = 'below';
  }

  for (; entries[idx]?.segment === segment && entries[idx]; by === 'above' ? idx-- : idx++) res.push(entries[idx]);

  return res;
}

const EntryCSS = `
.controls { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; }
.controls > * { margin: 0 0.5em; }
.controls .filter { flex-grow: 1; min-width: 5em; }
.controls button, .controls label.check { flex-shrink: 0; }
.diff { padding: 0.3em; display: flex; flex-wrap: wrap; }
.diff .left, .diff .right, .diff .value { white-space: pre-wrap; word-break: break-all; }
.diff .name, .diff .left, .diff .right { width: 33%; overflow: hidden; text-overflow: ellipsis; }
.diff .name, .wrapper .name { font-weight: bold; }
.diff.whole .name { width: 100%; }
.diff.whole { min-height: 5.5em; }
.entry { padding: 0.2em 0.5em; }
.entry .key { font-weight: bold; }
.wrapper > .name, .diff.whole > .name { display: flex; justify-content: space-between; }
.wrapper > .name > .src, .diff.whole > .name > .src { opacity: 0.4; }
.wrapper, .diff.whole, .header { position: relative; }
.wrapper { min-height: 5.5em; }
h2 { padding: 1em 0 0.5em 0; margin: 0; }
.header { display: flex; justify-content: space-between; }
.header h2 { flex-shrink: 1; user-select: none; }
.header > .buttons, .wrapper > .buttons { opacity: 0; transition: opacity 0.3s ease; }
.header:hover .buttons, .wrapper:hover > .buttons, .diff.whole:hover .buttons { opacity: 1; z-index: 20; }
.wrapper > .buttons { position: absolute; right: 0.2em; top: 0.2em; }
.rvlitem { position: relative; }
.rvlitem .buttons { position: absolute; top: 0; right: 0; opacity: 0; transition: opacity 0.2s ease-in-out; }
`
class Entries extends Window {
  constructor(source, opts) {
    super(opts);
    this.set('@.source', source);
  }
  details(entry) {
    const res = evaluate({ entry, schema: (this.get('schemas') || {})[entry.source], hideBlank: this.get('hideBlankFields'), hideDefault: this.get('hideDefaultFields') }, `
set res = { table:entry.table segment:entry.segment }
if entry.old and entry.new {
 let d = sort(diff(filter(entry.old =>@key in ~entry.new) entry.new))
 if keys(d).length {
   set res.status = :changed
   set res.changed = ^d
 }
} elif not entry.old {
 set res.status = :added
 set res.record = sort(entry.new)
} elif not entry.new {
 set res.status = :removed
 set res.record = sort(entry.old)
}
set table = find(schema.tables =>schema == ~entry.schema and name == ~entry.table)
set keys = filter(table.columns =>pkey)
if keys.length then set res.id = join(map(keys =>'{name} = {~entry.old[name] ?? ~entry.new[name]}') ', ')
if hideBlank then set res.record = filter(res.record =>_ strict-is-not '')
if hideDefault then set res.record = filter(res.record |val idx key| => {
  let col = find(~table.columns =>name == key)
  if not col then true
  elif col.default and '{val}' strict-is '{eval(replace(col.default, '^\\\\(?([^):]+).*', '$1', ''))}' then false
  elif col.nullable and val strict-is null then false
  else true
});
if res.record then set res.record = map(res.record =>[@key _] array:1)
if res.changed then set res.changed = map(res.changed =>[@key _] array:1)
res
`);
    return res;
  }
  download() {
    if (this.event?.event?.ctrlKey || this.event?.event?.shiftKey) return this.openHtml();
    const db = this.source ? this.source.replace(/.*@([^:]+).*\/(.*)/, '$1-$2') : this.get('loaded') ? 'Local file' : 'multiple';
    const name = `diff ${db} ${evaluate(`#now##date,'yyyy-MM-dd HH mm'`)}`;
    const ext = this.event?.event?.shiftKey ? 'html' : 'pgdd';
    let html, css;
    let text;
    if (this.event?.event?.shiftKey) {
      [html, css] = this.getHtml();
      text = `<html><head><title>${name}</title><style>${css}</style></head><body>${html}</body></html>`
    } else {
      const out = { entries: this.get('allEntries') };
      if (this.source) out.schemas = { [this.source]: (this.get('schemas') || {})[this.source] };
      else out.schemas = this.get('schemas');
      if (this.get('expr')) out.expr = this.get('expr');
      text = JSON.stringify(out);
    }
    download(`${name}.${ext}`, text, ext === 'html' ? 'text/html' : 'application/pg-difficult-diff');
  }
  openHtml() {
    const wnd = window.open('about:blank', '_blank', 'popup');
    if (wnd) setTimeout(() => {
      const [html, css] = this.getHtml();
      const style = wnd.document.createElement('style');
      style.textContent = css;
      wnd.document.head.appendChild(style);
      wnd.document.body.innerHTML = html;
    }, 100);
  }
  getHtml() {
    const css = EntryCSS + `
      html { margin: 0; padding: 0; font-family: sans-serif; height: 100%; }
      body { margin: 0; padding: 0; display: flex; flex-direction: column; height: 100%; }
      @media print {
        body { height: auto; }
        html: { height: auto; }
        .diff, .entry { break-inside: avoid; }
      }
      button, .controls { display: none; }
      .stretch-fields { display: flex; }
      .stretch-fields > * { flex-grow: 1; }

      .striped:nth-child(odd) { background-color: #eee; }
      .striped { background-color: #fff; padding: 0.3em; box-sizing: border-box; border-radius: 0.3em; }
      .striped > * { overflow: hidden; text-overflow: ellipsis; }

      .content-wrapper { display: flex; flex-direction: column; overflow: auto; position: relative; padding: 0.5em; box-sizing: border-box; }
      .header { position: sticky; top: -1em; background-color: #fff; z-index: 30; }
    `;
    const tmp = new Ractive({ template: '#entries-text', data: { entries: [], schemas: this.get('schemas'), hideBlankFields: this.get('hideBlankFields'), hideDefaultFields: this.get('hideDefaultFields') } });
    tmp.source = this.source;
    tmp.details = this.details;
    tmp.set('entries', this.get('entries'));
    return [tmp.toHtml(), css];
  }
  undoSingle(entry) {
    if (!this.source) return;
    const schemas = this.get('schemas') || {};
    const schema = schemas[entry.source];
    const reverse = reverseEntry(entry, schema);
    if (reverse) request({ action: 'query', query: [reverse[0]], params: [reverse[1]], client: Object.values(app.get('status.clients') || {}).find(c => c.source === this.source).config });
    else this.host.toast(`Undo is not supported for this table`, { type: 'error', timeout: 3000 });
  }
  async undoSegment(entry) {
    if (!this.source) return;
    const schemas = this.get('schemas') || {};
    const schema = schemas[entry.source];
    const base = app.get('entries') || [];
    const entries = [];

    const idx = base.findIndex(e => entry.id === e.id);

    if (!~idx) return this.host.toast('Unable to find base entry for reversal', { type: 'error', timeout: 3000 });

    for (let i = idx; i >= 0; i--) {
      if (base[i].segment !== entry.segment) break;
      if (base[i].source !== entry.source) continue;
      entries.push(base[i]);
    }

    for (let i = idx + 1; i < base.length; i++) {
      if (base[i].segment !== entry.segment) break;
      if (base[i].source !== entry.source) continue;
      entries.unshift(base[i]);
    }

    if (!entries.length) return this.host.toast('Nothing to undo', { type: 'info', timeout: 3000 });

    const reverse = entries.map(e => reverseEntry(e, schema)).filter(e => e);
    if (reverse.length !== entries.length) return this.host.toast(`Undo is not supported for this segment`, { type: 'error', timeout: 3000 });

    if (!this.event?.event?.ctrlKey || this.event?.event?.shiftKey) await request({ action: 'segment', segment: `Undo ${entry.segment}` });

    request({ action: 'query', query: reverse.map(p => p[0]), params: reverse.map(p => p[1]), client: Object.values(app.get('status.clients') || {}).find(c => c.source === this.source).config });
  }

  async renameSegment(entry, by) {
    const all = (this.source || this.combined) ? app.get('entries') : this.get('entries') || [];
    const name = await app.ask('What would you like the new segment name to be?', `${by ? 'Split' : 'Rename'} ${entry.segment}`, entry.segment);
    if (!name) return;

    let targets;
    if (by === 'above') targets = adjacentEntries(entry, all, 'above');
    else if (by === 'below') targets = adjacentEntries(entry, all, 'below');
    else targets = adjacentEntries(entry, all, 'segment');

    if (!~targets.indexOf(entry)) targets.push(entry);

    if (this.source || this.combined) {
      const srcs = [];
      for (const t of targets) if (!srcs.includes(t.source)) srcs.push(t.source);
      const configs = app.get('status.clients');
      const srcConfig = {};
      for (const s of srcs) {
        for (const id in configs) if (configs[id].source === s) srcConfig[s] = id;
        if (!srcConfig[s]) return;
      }

      for (const s of srcs) {
        const ts = targets.filter(t => t.source === s);
        await request({ action: 'query', query: ['update pgdifficult.entries set segment = $1 where id = any($2)'], params: [[name, ts.map(t => t.id)]], client: srcConfig[s] });
      }
    }

    for (const t of targets) t.segment = name;

    (this.source ? app : this).update('entries');
  }

  clearEntries() {
    if (this.event?.event?.ctrlKey || this.event?.event?.shiftKey || !this.source) notify({ action: 'clear' });
    else notify({ action: 'clear', source: this.source });
  }
}
Window.extendWith(Entries, {
  template: '#entries',
  options: { flex: true, resizable: true, width: '50em', height: '40em' },
  use: [RauiPopover.default({ name: 'pop' })],
  css: EntryCSS,
  computed: {
    allEntries() {
      const source = this.get('@.source');
      const loaded = this.get('loaded');
      let res;
      if (loaded) {
        if (Array.isArray(loaded)) res = loaded;
        else if (loaded && typeof loaded === 'object' && 'entries' in loaded) res = loaded.entries;
        else res = [];
      } else {
        const entries = app.get('entries');
        if (source != null) res = entries.filter(e => e.source === this.source);
        else res = entries;
      }
      return res;
    },
    entries() {
      let res = this.get('allEntries');
      const expr = this.get('expr');
      if (expr) res = evaluate({ list: res }, `filter(list =>(${expr}))`);
      return res;
    },
    exprError() {
      const expr = this.get('expr');
      if (expr) {
        const out = parse(expr, { trim: true, consumeAll: true });
        if (out && typeof out === 'object' && 'message' in out) return out;
      }
    },
  },
  on: {
    complete() {
      this.set({
        hideBlankFields: app.get('settings.hideBlankFields'),
        hideDefaultFields: app.get('settings.hideDefaultFields'),
      });
      if (this.get('loaded')) {
        this.link('loaded.schemas', 'schemas');
      } else {
        this.link(`schemas`, 'schemas', { instance: app });
        this.set({
          allowUndoSegment: app.get('settings.allowUndoSegment'),
          allowUndoSingle: app.get('settings.allowUndoSingle'),
        });
      }
      this.scroller = this.find('.rvlist');
    }
  },
  observe: {
    'entries.length'() {
      if (this.scroller) {
        const s = this.scroller;
        if (s.scrollTop + s.clientHeight >= s.scrollHeight - 10) setTimeout(() => s.scrollTo({ top: s.scrollHeight, behavior: 'smooth', block: 'end' }), 100);
      }
    },
    'loaded.expr'(v) {
      if (v) this.set('expr', v);
    },
  },
});

class Leaks extends Window {
  constructor(id, database, opts) {
    super(opts);
    this.leakId = id;
    this.database = database;
  }
}
Window.extendWith(Leaks, {
  template: '#leaks',
  options: { flex: true, resizable: true, width: '40em', height: '30em' },
  css(data) { return `
.leak { display: flex; flex-wrap: wrap; }
.leak > * { box-sizing: border-box; padding: 0.2em; }
.leak.header { font-weight: bold; position: sticky; top: -0.5em; background-color: ${data('raui.window.host.bg') || '#fff'}; border-bottom: 1px solid; z-index: 1; padding: 0.3em; }
.leak .user { width: 8em; }
.leak .application { width: 12em; }
.leak .client { width: 12em; }
.leak .state { width: 5em; }
.leak .started { width: 13em; }
.leak .constr { width: 18em; }
.leak .pid { width: 6em; text-align: right; }
`; },
  computed: {
    leaks() {
      if (this.leakId != null) {
        const leak = app.get(`status.leaks.${this.leakId}`);
        return leak.current.filter(l => l.database === this.database && !leak.initial[this.database].find(k => k.pid === l.pid && k.started === l.started)).map(l => Object.assign({ source: constr(leak.config, { database: l.database }) }, l));
      } else {
        return Object.values(app.get('status.leaks')).reduce((a, leak) => {
          const inits = Object.values(leak.initial).reduce((a, c) => (a.push.apply(a, c), a), []);
          a.push.apply(a, leak.current.filter(l => leak.databases.includes(l.database) && !inits.find(k => k.pid === l.pid && k.started === l.started)).map(l => Object.assign({ source: constr(leak.config, { database: l.database }) }, l)));
          return a;
        }, []);
      }
    },
    current() {
      if (this.leakId != null) {
        const leak = app.get(`status.leaks.${this.leakId}`);
        return (app.get(`status.leaks.${this.leakId}.current`) || []).filter(l => l.database === this.database).map(l => Object.assign({ source: constr(leak, { database: l.database }) }, l));
      } else {
        return Object.values(app.get('status.leaks')).reduce((a, c) => {
          a.push.apply(a, c.current.filter(l => c.databases.includes(l.database)).map(l => Object.assign({ source: constr(c.config, { database: l.database }) }, l)));
          return a;
        }, []);
      }
    },
    initial() {
      if (this.leakId != null) {
        const leak = app.get(`status.leaks.${this.leakId}`);
        return (app.get(`status.leaks.${this.leakId}.initial.${this.database}`) || []).filter(l => l.database === this.database).map(l => Object.assign({ source: constr(leak, { database: l.database }) }, l));
      } else {
        return Object.values(app.get('status.leaks')).reduce((a, c) => {
          const all = Object.values(c.initial);
          for (const set of all) {
            for (const l of set) {
              if (!a.find(e => e.pid === l.pid) && c.databases.includes(l.database)) a.push(Object.assign({ source: constr(c.config, { database: l.database }) }, l));
            }
          }
          return a;
        }, []);
      }
    },
  },
  on: {
    init() {
      this.link('status', 'status', { instance: app });
    },
  },
});

function schemaEntries(schema, which, filter, expr, expanded, sort) {
  const items = [];
  let tables = schema?.[which] || [];
  expanded = expanded || {};
  expanded = (which === 'views' ? expanded.view : expanded.table) || {};

  if (filter) tables = evaluate({ tables, filter }, `filter(tables =>[name description definition] + map(columns =>name) ilike '%{~filter}%')`);
  if (expr) tables = evaluate({ tables }, `filter(tables =>find(columns |column| => (${expr})))`);

  const matches = {};

  for (const t of tables) {
    let cols;
    if (filter) cols = evaluate({ cols: t.columns, filter }, `filter(cols =>name ilike '%{~filter}%')`);
    if (expr) cols = evaluate({ cols: cols || t.columns }, `filter(cols |column| => (${expr}))`);
    matches[t.name] = cols;
    items.push(t);
    if (expanded[t.name]) cols = t.columns;
    if (cols && sort === 'position') cols = evaluate({ cols: cols.slice() }, 'sort(cols =>position)');
    if (cols) for (const c of cols) items.push(c);
  }

  return { matches, items };
}

class Schema extends Window {
  constructor(config, opts) {
    super(opts);
    this.config = config;
  }
  schemaMatchCount(matches) {
    return Object.values(matches || {}).reduce((a, c) => a + (c?.length || 0), 0);
  }
  compareSchema(local, config) {
    app.compareSchema(local, config);
  }
  colCount(schema, which) {
    const tables = schema?.[which] || [];
    return tables.reduce((a, c) => a + c.columns.length, 0);
  }
  colsFor(name, which) {
    const tables = this.get(`schema.${which}`);
    for (const t of tables) if (t.name === name) return t.columns.length;
    return 0;
  }
  downloadSchema(schema) {
    const db = this.config ? `${this.config.host || 'localhost'}-${this.config.port || 5432}-${this.config.database || 'postgres'}` : `Local File`;
    download(`schema ${db} ${evaluate(`#now##date,'yyyy-MM-dd HH mm'`)}.pgds`, JSON.stringify(schema), 'application/pg-difficult-schema');
  }
}
Window.extendWith(Schema, {
  template: '#schema',
  options: { flex: true, resizable: true, width: '50em', height: '35em' },
  data() { return { schemaexpanded: { table: {} } }; },
  helpers: {
    escapeKey: Ractive.escapeKey,
  },
  computed: {
    tables() {
      const { matches, items } = schemaEntries(this.get('schema'), 'tables', this.get('schemafilter'), this.get('schemaexpr'), this.get('schemaexpanded'), this.get('schemasort'));

      setTimeout(() => this.set('schemaMatches.tables', matches));

      return items;
    },
    views() {
      const { matches, items } = schemaEntries(this.get('schema'), 'views', this.get('schemafilter'), this.get('schemaexpr'), this.get('schemaexpanded'), this.get('schemasort'));

      setTimeout(() => this.set('schemaMatches.views', matches));

      return items;
    },
    functions() {
      return this.get('schema.functions') || [];
    }
  },
  on: {
    init() {
      this.link('compareSchema', 'compareSchema', { instance: app });
    },
    async render() {
      if (!this.config) return;
      this.blocked = true;
      try {
        const msg = await request({ action: 'schema', client: this.config });
        this.blocked = false;
        this.set('schema', msg.schema);
      } catch {
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

class ScratchPad extends Window {
  constructor(opts, pad) {
    super(opts);
    const id = pad?.id || this.get('scratchId') || ++scratchId;
    pad = pad || { id, syntax: 'markdown', text: '' };
    this.upstream = pad;
    if (!('text' in pad)) pad.text = '';
    setTimeout(() => this.set('pad', JSON.parse(JSON.stringify(pad))));
  }
  save() {
    const saved = app.get('scratchPads') || [];
    const pad = this.get('pad');
    if (!pad || !pad.id) return;
    const idx = saved.findIndex(r => r.id === pad.id);
    if (~idx) app.splice('scratchPads', idx, 1, pad);
    else app.push('scratchPads', pad);
    this.upstream = Object.assign({}, pad);
  }
  saveDebounced = debounce(() => this.save(), 2000);
  evaluate(txt) {
    if (this.ace) {
      const sel = this.getContext(this.ace).decorators.ace.editor.getSelectedText();
      if (sel) txt = sel;
    }
    const ok = parse(txt, { consumeAll: true });
    if (ok && 'cause' in ok) {
      this.set({
        evalresult: '',
        evalerror: `Invalid expression: ${ok.message}\n\n${ok.marked}`,
      });
    } else {
      const opts = app.get('scratchroot') || {};
      const root = new Root({}, opts);
      root.sources = Object.assign({}, opts.sources);
      if (opts.all) {
        for (const k in opts.all.apply || {}) if (opts.all.apply[k]) root.sources[k] = { value: opts.all.apply[k] };
        for (const k in opts.all.provide || {}) if (opts.all.provide[k]) root.sources[k] = { value: opts.all.provide[k] };
      }
      this.set({
        evalresult: evaluate(root, ok),
        evalerror: '',
      });
    }
    const split = this.findComponent('split');
    if (split) {
      const sp = split.get('splits.1');
      if (sp.min) {
        split.set('splits.1.min', false);
        if (sp.lastSize < 0.5) split.set('splits.1', { curSize: 40, lastSize: 40, min: false }, { deep: true });
        else split.set('splits.1.curSize', sp.lastSize);
      } else if (sp.curSize < 0.5) split.set('splits.1', { curSize: 40, lastSize: 40, min: false }, { deep: true });
    }
    const tabs = this.findComponent('tabs');
    if (tabs && tabs.selection > 1) tabs.select(0);
  }
  string(v) {
    return v === undefined ? 'undefined' : JSON.stringify(v);
  }
}
Window.extendWith(ScratchPad, {
  template: '#scratch-pad',
  css: `
h3 { text-align: left; }
dt { margin-top: 1rem; font-family: monospace; }
dd { margin: 0.5em 0 1em 2em; white-space: pre-wrap; }
.ops-search { opacity: 0.2; }
.ops-search:hover { opacity: 1; }
`,
  options: { flex: true, resizable: true, minimize: false, width: '50em', height: '35em' },
  on: {
    init() {
      this.link('settings.editor', 'editor', { instance: app });
      this.partials.root = Diff.prototype.template.p.root;
      this.partials.tree = Diff.prototype.template.p.tree;
      this.watch = app.observe('scratchPads', v => {
        const id = this.get('pad.id');
        const txt = this.get('pad.text');
        if (v) {
          const up = v.find(p => p.id == id);
          if (up) {
            this.set('pad.syntax', up.syntax);
            this.set('pad.name', up.name);
            if (up.text !== txt) {
              if (this.upstream?.text === txt) {
                this.set('pad.text', up.text);
                this.set('diff', false);
              } else this.set('diff', true);
            } else this.set('diff', false);
            this.upstream = up;
          }
        }
      }, { strict: true });
    },
    destruct() {
      if (this.watch) this.watch.cancel();
    }
  },
  data() {
    return { docs, ops: evaluate(docs.operators) };
  },
  computed: {
    operators() {
      const map = this.get('ops').reduce((a, c) => (Array.isArray(c.op) ? c.op.forEach(o => a.push([o, c])) : a.push([c.op, c]), a), []);
      let ops = evaluate({ map }, `sort(map =>if _.0[0] == '#' then 'zz[_.0]' elif _.0[0] == '|' then ' {_.0}' else _.0)`)
      const search = this.get('opsearch');
      if (search) {
        const re = new RegExp(search.replace(/([*.\\\/$^()[\]{}+])/g, '\\$1'), 'i');
        ops = ops.filter(p => re.test(p[0]) || re.test(docs.operatorText[p[0]]));
      }
      return ops;
    },
  },
  observe: {
    'pad.name'(n) {
      this.title = `Scratch Pad${n ? ` - ${n}` : ''}`;
      this.save();
    },
    'pad.syntax'() {
      if (typeof this.get('pad.text') === 'string') this.save();
    },
    'pad.text'(v) {
      if (typeof v === 'string') this.saveDebounced();
    },
  },
});

const listDBQuery = `SELECT d.datname as "database",
  pg_catalog.pg_get_userbyid(d.datdba) as "owner",
   pg_catalog.pg_encoding_to_char(d.encoding) as "encoding",
   d.datcollate as "collate",
   d.datctype as "ctype",
   pg_catalog.array_to_string(d.datacl, E'\n') AS "access"
FROM pg_catalog.pg_database d
ORDER BY d.datname;`;
class HostExplore extends Window {
  constructor(opts) { super(opts); }

  async refreshHost(con) {
    const dbs = this.get('hosts.' + Ractive.escapeKey(con.constr));
    this.blocked = true;
    try {
      const res = await request({ action: 'query', query: [listDBQuery], client: con.config });
      this.set('hosts.' + Ractive.escapeKey(con.constr), res.result);
    } catch (e) {
      this.set('hosts.' + Ractive.escapeKey(con.constr), { error: e.message || e.error });
    }
    this.blocked = false;
    if (dbs) {
      const schemas = this.get('schemas');
      for (const d of dbs) {
        if (schemas[`${con.constr}@${d.database}`]) this.set(`schemas.${Ractive.escapeKey(`${con.constr}@${d.database}`)}`, undefined);
      }
    }
  }

  async refreshSchema(selected) {
    this.blocked = true;

    try {
      const res = await request({ action: 'schema', client: Object.assign({}, selected.connection.config, { database: selected.entry.database }) });
      this.set('schemas.' + Ractive.escapeKey(selected.connection.constr + '@' + selected.entry.database), res);
    } catch (e) {
      this.set(`schemas.${Ractive.escapeKey(selected.connection.constr + '@' + selected.entry.database)}`, { error: e.message || e.error })
    }

    this.blocked = false;
  }

  isQueryAllReport(report) {
    return (report?.sources || []).find(s => s.type === 'query-all-sql');
  }

  isJustQueryReport(report) {
    return (report?.sources || []).find(s => s.type === 'query');
  }

  visibleDBs(sample) {
    const list = [];
    const entries = Object.assign({}, this.get('_entries'));
    const expanded = this.get('expanded') || {};
    const cons = this.get('connections');

    for (const k in entries) {
      if (expanded[k]) {
        const c = cons.find(c => c.constr === k);
        const dbs = entries[k];
        if (!c || !Array.isArray(dbs)) continue;
        if (dbs.length) list.push(Object.assign({}, c.config, { databases: dbs.map(d => d.database) }));
        if (sample) {
          list[0].databases = list[0].databases[0].slice(0, 1);
          return list;
        }
      }
    }

    return list;
  }

  async queryAll(query, apply, result) {
    const list = this.visibleDBs();
    if (!list.length) return;

    this.blocked = true;

    const res = await request({ action: 'query-all', clients: list, query: [query] });
    if (apply) {
      const old = this.get(`results.${Ractive.escapeKey(apply)}`);
      this.set(`results.${Ractive.escapeKey(apply)}`, Object.assign({}, old, res.result));
    }
    if (result) {
      const set = [];
      for (const l of list) {
        for (const d of l.databases) {
          const k = `${l.username || 'postgres'}@${l.host || 'localhost'}:${l.port || 5432}/${l.database}@${d}`;
          set.push(Object.assign({}, { connection: Object.assign({}, l, { database: d, databases: undefined }) }, res.result[k]));
        }
      }
      app.set(`results.${Ractive.escapeKey(result)}`, set);
    }
    if (!apply && !result) this.set('lastresults', res.result);
    if (apply) app.set(`scratchroot.all.apply.${Ractive.escapeKey(apply)}`, res.result);
    if (result) app.set(`scratchroot.all.provide.${Ractive.escapeKey(result)}`, res.result);

    this.blocked = false;
  }

  clearResult(type, name) {
    if (type === 'applied') {
      this.set(name ? `results.${Ractive.escapeKey(name)}` : 'results', {});
      if (name) app.set(`scratchroot.all.apply.${Ractive.escapeKey(name)}`, undefined);
      else app.set('scratchroot.all.apply', {});
      this.set('queryapply', '');
    } else if (type === 'provided') {
      app.set(name ? `results.${Ractive.escapeKey(name)}` : 'results', {});
      if (name) app.set(`scratchroot.all.provide.${Ractive.escapeKey(name)}`, undefined);
      else app.set('scratchroot.all.provide', {});
      this.set('queryname', '')
    }
  }

  async reportData(connections, source, sample, params, report) {
    if (!connections) {
      connections = this.visibleDBs(sample);
    }

    if (!connections.length) return { value: {} };

    if (source.type === 'query-all-sql') {
      const res = await request({ action: 'query-all', clients: connections, query: [source.query], params: [queryParams(report.definition, source, params)], });
      const set = [];
      for (const l of connections) {
        for (const d of l.databases) {
          const k = `${l.username || 'postgres'}@${l.host || 'localhost'}:${l.port || 5432}/${l.database}@${d}`;
          set.push(Object.assign({}, { connection: Object.assign({}, l, { database: d, databases: undefined }) }, res.result[k]));
        }
      }
      return { value: set };
    }
  }
  
  async runReport(report, sample) {
    const list = this.visibleDBs();

    if (!list.length) return;

    const hosts = list.length;
    const dbs = list.reduce((a, c) => a + c.databases.length, 0);
    const queries = report.sources.filter(s => s.type === 'query-all-sql');

    if (await app.confirm(`Do you want to run ${queries.length} queries on ${dbs} databases across ${hosts} servers?\n\n${queries.map(q => q.query).join('\n\n')}`), 'Run Report?') {
      const data = {};

      for (const src of report.sources) {
        data[src.name] = await this.reportData(list, src, sample, this.get('params'), report);
      } // TODO: other sources?

      const html = run(report.definition, data);
      const w = new ViewReport({}, html);
      this.host.addWindow(w, { title: `Report Viewer - ${report.definition.name}` });
    }
  }

  reportDesigner(report) {
    const id = report?.id ?? ++reportId;
    const wid = `report-${id}`;
    let win = this.host.getWindow(wid);
    if (win) return win.raise(true);
    win = new Report({ data: { reportId } }, report, this);
    this.host.addWindow(win, { id: wid, title: `Loading report...` });
  }

  async singleReportQuery(report, src, params) {
    const selected = this.get('selectedDB.connection.config');
    if (!selected) return {};
    const client = Object.assign({}, selected, { database: this.get('selectedDB.entry.database') });
    this.blocked = true;

    try {
      const res = (await request({ action: 'query', query: [src.query], params: [queryParams(report.definition, src, params)], client })).result;
      return res;
    } catch (e) {
      return { error: e.message };
    } finally {
      this.blocked = false;
    }
  }

  async runSingleReport(report, sample, params) {
    const selected = this.get('selectedDB.connection.config');
    if (!selected) return;
    const client = Object.assign({}, selected, { database: this.get('selectedDB.entry.database') });

    this.blocked = true;

    try {
      const data = {};

      for (const src of report.sources) {
        if (src.type === 'query') {
          data[src.name] = (await request({ action: 'query', query: [src.query], params: [queryParams(report.definition, src, params)], client })).result;
        }
      } // TODO: other sources?

      const html = run(report.definition, data);
      const w = new ViewReport({}, html);
      this.host.addWindow(w, { title: `Report Viewer - ${report.definition.name}` });
    } finally {
      this.blocked = false;
    }
  }

  async runQuery(query) {
    const selected = this.get('selectedDB.connection.config');
    if (!selected) return;
    const client = Object.assign({}, selected, { database: this.get('selectedDB.entry.database') });
    if (this.ace) {
      const sel = this.getContext(this.ace).decorators.ace.editor.getSelectedText();
      if (sel) query = sel;
    }
    this.blocked = true;
    try {
      const res = await request({ action: 'query', query: [query], client });
      this.set('result', res.result);
      this.set('runtime', res.time);
      this.set('affected', res.affected);
      this.set('error', null);
    } catch (e) {
      this.set('error', e.message);
      this.set('result', []);
      this.set('affected', null);
    }
    this.blocked = false;
  }
  async saveQuery() {
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
  loadQuery() {
    const q = this.get('loadedQuery');
    this.set({
      loadedQuery: undefined,
      query: q.sql,
      name: q.name,
    });
  }

  schemaEntries(schema, which) {
    const { items, matches } = schemaEntries(schema, which, this.get('schemafilter'), this.get('schemaexpr'), this.get('schemaexpanded'), this.get('schemasort'));

    setTimeout(() => this.set(`schemaMatches.${which}`, matches));

    return items;
  }
  colsFor(name, which) {
    const selected = this.get('selectedDB');
    if (!selected) return;
    const key = selected.connection.constr + '@' + selected.entry.database;
    const tables = this.get(`schemas.${Ractive.escapeKey(key)}.schema.${which}`);
    for (const t of tables) if (t.name === name) return t.columns.length;
    return 0;
  }
  colCount(schema, which) {
    return (schema?.[which] || []).reduce((a, c) => a + c.columns.length, 0);
  }
  schemaMatchCount(obj) {
    return Object.values(obj || {}).reduce((a, c) => a + (c?.length || 0), 0);
  }
  downloadSchema() {
    const selected = this.get('selectedDB');
    if (!selected) return;
    const db = `${selected.connection.host || 'localhost'}-${selected.connection.port || 5432}-${selected.entry.database || 'postgres'}`;
    download(`schema ${db} ${evaluate(`#now##date,'yyyy-MM-dd HH mm'`)}.pgds`, JSON.stringify(this.get(`schemas.${Ractive.escapeKey(selected.connection.constr + '@' + selected.entry.database)}.schema`)), 'application/pg-difficult-schema');
  }
  compareSchema(local, config) {
    app.compareSchema(local, config);
  }

  clicked(ev, col, rec) {
    if (col === undefined) return;
    if (rec?.query === this.get('query')) return;
    const val = (ev.ctrlKey || ev.shiftKey) ? rec : col;
    const msg = `Copied ${(ev.ctrlKey || ev.shiftKey) ? 'record JSON' : 'column value'} to clipboard.`;
    const str = val && typeof val === 'object' ? JSON.stringify(val) : val;
    Ractive.helpers.copyToClipboard(str, msg);
  }

  downloadQuery = downloadQuery;
}
Window.extendWith(HostExplore, {
  template: '#host-explore',
  css(data) {
    return `div.host { background-color: ${data('raui.primary.bg') || '#fff'}; }
.filter-pane { background-color: ${data('raui.window.host.bg') || '#eee'}; height: 3.5em; }
.query { flex-grow: 1; display: flex; flex-direction: column; overflow: hidden; }
.query .query-text { height: 100%; }
.query textarea { width: 100%; border: 0; outline: none; }
.query .result { display: flex; border-top: 1px solid; overflow: hidden; flex-grow: 1; height: 100%; box-sizing: border-box; }
.selected { background-color: rgba(128, 128, 128, 0.1); }
dd { white-space: pre-wrap; }
`;
  },
  options: { flex: true, resizable: true, minimize: false, width: '70em', height: '45em', title: 'Host Explorer' },
  helpers: { escapeKey: Ractive.escapeKey },
  on: {
    init() {
      this.link('connections', '_connections', { instance: app });
      this.set('settings', Object.assign({}, app.get('settings')));
      this.link('loadedQuery', 'loadedQuery', { instance: app });
      this.link('@', 'app', { instance: app });
      this.link('compareSchema', 'compareSchema', { instance: app });
      this.link('settings.editor', 'editor', { instance: app });
    },
  },
  computed: {
    connections() {
      const cons = this.get('_connections');
      return cons.map(c => {
        return {
          constr: `${c.username || 'postgres'}@${c.host || 'localhost'}:${c.port || 5432}/${c.database}`,
          label: c.label,
          config: c,
        };
      });
    },
  },
  data() {
    return { hosts: {}, meta: {}, expanded: {}, schemaexpanded: { table: {} } };
  },
  observe: {
    'hosts filter'() {
      const filter = this.get('filter');
      const hosts = this.get('hosts');
      if (!filter) this.set('_entries', hosts);
      const cons = this.get('connections') || [];
      const apply = this.get('results') || {};
      const last = this.get('lastresults') || {};
      const provided = app.get('results');

      const context = {};
      const res = {};
      for (const constr in hosts) {
        const con = cons.find(c => c.constr === constr);
        if (!con) continue;
        const list = hosts[constr];
        res[constr] = Raport.evaluate({ list, con, filter, apply, last, results: provided }, `let flt = parse('=>{filter}' raport:1);
let connection = con.config;
let constr = con.constr;
filter(list |entry| => {
  let db = entry.database;
  let index = @index;
  let query = map(~apply =>_['{constr}@{db}']);
  let last-query = map(~last =>_['{constr}@{db}']);
  flt()
})`);
      }

      this.set('_entries', res);
    },
    'result settings.queryOrderColumns': {
      handler() {
        const result = this.get('result') || [];
        const first = (result && result[0]) || {};
        const order = this.get('settings.queryOrderColumns') ? Object.keys(first).sort() : Object.keys(first);
        if (order.length) {
          const cols = [];
          for (const k of order) {
            cols.push({ label: [k], content: [{ t: 2, x: { r: [k], s: '_0&&typeof _0==="object"?JSON.stringify(_0):_0' } }], attrs: [{ t: 13, n: 'style', f: [`width: ${Math.ceil(Math.min(20, Math.max(4, k.length, `${first[k]}`.length)) / 1.4)}em;`]}, { t: 70, n: ['click'], f: { r: ['@this', '@event', k, '.'], s: '[_0.clicked(_1,_2,_3)]' } }], id: k, sort: k });
          }
          this.table.replaceColumns(cols);
        } else {
          this.table.replaceColumns([]);
        }
      },
      init: false,
    }
  },
});

class ViewReport extends Window {
  constructor(opts, html) {
    super(opts);
    this.set('html', html);
  }
}
Window.extendWith(ViewReport, {
  template: '#view-report',
  options: { flex: true, resizeable: true, minimize: false, width: '70em', height: '45em', title: 'Report Viewer' },
  css: `iframe { flex-grow: 1; border: 0; }`,
});

let reportFrameId = 0;
class Report extends Window {
  constructor(opts, report, parent) {
    super(opts);
    this.ownerId = 0;
    this.callbacks = {};
    this._parent = parent;
    const id = this.get('reportId') || ++reportId;
    report = report || { id, sources: [], definition: { type: 'page', size: { width: 51, height: 66, margin: [1.5, 1.5] }, name: 'New Report', classifyStyles: true } };
    this.set('report', JSON.parse(JSON.stringify(report)));
  }

  handleMessage(ev) {
    if (ev.data.frameId !== this.frameId) return;

    if (ev.data.ownerId != null) {
      if (this.callbacks[ev.data.ownerId]) this.callbacks[ev.data.ownerId][ev.data.error ? 1 : 0](ev.data);
      return;
    }

    const wnd = this.find('iframe').contentWindow;

    if (this.frameId == null && ev.data.action === 'init') {
      this.frameId = reportFrameId++;
      wnd.postMessage({ action: 'init', frameId: this.frameId });
      return;
    }

    switch (ev.data.action) {
      case 'ready':
        wnd.postMessage({ action: 'set', set: { 'settings.theme': app.get('settings.theme'), showProjects: false, report: this.get('report.definition') || {}, sources: this.get('report.sources') || [] } });
        break;

      case 'new-source': case 'edit-source':
        this.editSource(ev.data);
        break;

      case 'fetch-source':
        this.fetchSource(ev.data);
        break;

      case 'name':
        this.title = `Report - ${ev.data.name}`;
        break;

      case 'save':
        this.save();
        break;
    }
  }

  async editSource(msg) {
    const src = msg.source || {};
    const wnd = new SourceEdit({ data: { source: src } });
    this.host.addWindow(wnd, { block: this, title: msg.source ? 'Edit Source' : 'Add Source' });
    const res = await wnd.result;
    if (res) {
      if (msg.source) {
        const idx = (this.get('report.sources') || []).find(s => s.name === msg.source.name);
        if (~idx) this.splice('report.sources', idx, 1, res);
        else this.push('report.sources', res);
      } else {
        this.push('report.sources', res);
      }
      this.respond({ source: res }, msg);
    } else this.respond({ error: 'cancelled' }, msg);
  }

  async fetchSource(msg) {
    const src = msg.source;
    if (src.type === 'diff') {
      if (Object.keys(app.get('status.clients') || {}).length) {
        this.respond({ data: app.get('entries') }, msg);
      } else {
        for (const id of app.host.windows) {
          const wnd = app.host.getWindow(id);
          if (wnd && wnd.get('loaded')) return this.respond({ data: wnd.get('loaded.entries') }, msg);
        }
        this.respond({ data: [] }, msg);
      }
    } else if (src.type === 'diff-schema') {
      if (Object.keys(app.get('status.clients') || {}).length) {
        this.respond({ data: app.get('schemas') }, msg);
      } else {
        for (const id of app.host.windows) {
          const wnd = app.host.getWindow(id);
          if (wnd && wnd.get('loaded')) return this.respond({ data: wnd.get('loaded.schemas') }, msg);
        }
        this.respond({ data: [] }, msg);
      }
    } else if (src.type === 'json') {
      this.respond({ data: JSON.parse(src.json) }, msg);
    } else if (src.type === 'query-all') {
      this.respond({ data: app.get(`results.${Ractive.escapeKey(src.result)}`) || {} }, msg);
    } else if (src.type === 'query-all-sql') {
      if (!this._parent) return this.respond({ data: {} }, msg);
      const data = await this._parent.reportData(undefined, src, !msg.play, msg.params, { definition: msg.report || this.get('report') });
      this.respond({ data }, msg);
    } else if (src.type === 'query' && this._parent) {
      this.respond({ data: await this._parent.singleReportQuery({ definition: msg.report || this.get('report') }, src, msg.params) }, msg);
    } else if (src.type === 'query' && src.config) {
      try {
        this.respond({ data: (await request({ action: 'query', query: [src.query], client: src.config })).result }, msg);
      } catch (e) {
        this.respond({ error: e.message }, msg);
      }
    } else {
      this.respond({ error: `Invalid source ${src.type}` }, msg);
    }
  }

  respond(message, source) {
    const wnd = this.find('iframe').contentWindow;
    const base = {};
    if (source && source.designId != null) base.designId = source.designId;
    wnd.postMessage(Object.assign(base, message));
  }

  request(message) {
    const id = this.ownerId++;
    let ok, fail;
    const wnd = this.find('iframe').contentWindow;
    const res = new Promise((o, f) => (ok = o, fail = f));
    this.callbacks[id] = [ok, fail];
    message.ownerId = id;
    wnd.postMessage(message);
    return res;
  }

  async save() {
    const saved = app.get('savedReports') || [];
    const report = this.get('report');
    report.definition = (await this.request({ action: 'get', get: 'report' })).get;
    report.sources = (await this.request({ action: 'get', get: 'sources' })).get;
    const idx = saved.findIndex(r => r.id === report.id);
    if (~idx) app.splice('savedReports', idx, 1, report);
    else app.push('savedReports', report);
  }
}
Window.extendWith(Report, {
  template: '#report',
  options: { flex: true, resizable: true, minimize: true, width: '105em', height: '75em' },
  css: `iframe { flex-grow: 1; border: 0; }`,
  on: {
    render() {
      window.addEventListener('message', (this._messageHandler = this.handleMessage.bind(this)));
    },
    unrender() {
      window.removeEventListener('message', this._messageHandler);
    },
  },
});

class SourceEdit extends Window {
  constructor(opts) { super(opts); }
  save() {
    if (this.get('error')) return;
    const source = this.get('source');
    const arr = this.get('paramArray');
    if (arr.length) {
      source.parameters = source.parameters || [];
      source.parameters = source.parameters.slice(0, arr.length);
    } else {
      delete source.parameters;
    }
    this.close(false, source);
  }
}
Window.extendWith(SourceEdit, {
  template: '#source-edit', css: `
.field.textarea { flex-grow: 1; min-height: 5em; }
.field.textarea textarea { height: calc(100% - 1.6em); }
  `,
  options: { close: false, flex: true, resizable: true, maximize: false, minimize: false, width: '40em', height: '30em' },
  observe: {
    'source.query'(q) {
      if (q) {
        let list = [];
        q.replaceAll(/\$([0-9])+/g, (_, n) => { list.push(+n); return _; });
        list = Raport.evaluate({ list }, 'sort(unique(list))');
        for (let i = 0; i < list.length; i++) {
          if (list[i] !== i + 1) {
            this.set('error', `Parameter $${i + 1} expected, but found $${list[i]}`);
            return;
          }
        }
        this.set('error', undefined);
        this.set('paramArray', list.map(p => ''));
      }
    },
  },
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
    request({ action: 'status' }).then(() => {
      message({ action: 'check' });
    });
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
    message(msg);
  });
}

function message(msg) {
  switch (msg.action) {
    case 'status': app.set('status', Object.assign(msg.status, { lastUpdate: new Date() })); break;
    case 'clear':
      if (msg.source) app.set('entries', (app.get('entries') || []).filter(e => e.source !== msg.source));
      else app.set('entries', []);
      break;

    case 'error':
      app.host.toast(msg.error || '(unknown error)', { type: 'error', more: msg.stack, showMore: !!msg.stack });
      if ('id' in msg) request.error(msg.id, msg);
      break;

    case 'check': {
      if (msg.reset) app.set('entries', []);
      const entries = app.get('entries');
      const clients = app.get('status.clients');
      for (const k in clients) {
        const client = clients[k];
        const since = evaluate({ entries, source: client.source }, 'max(filter(~entries =>source == ~source) =>id)') || undefined;
        gate('check', () => ({ action: 'check', client: client.id, since }));
      }
      break;
    }

    case 'entries': { 
      const current = app.get('entries');
      const add = (msg.entries || []).filter(e => !current.find(o => o.source === e.source && o.id === e.id));
      add.unshift('entries');
      app.push.apply(app, add);
      break;
    }

    case 'leaks':
      for (const k in msg.map) app.set(`status.leaks.${k}.current`, msg.map[k]);
      app.set('status.lastUpdate', new Date());
      break;
  }

  if ('id' in msg) request.response(msg.id, msg);
}

function reconnect(wait = 10000) {
  if (app.get('halted')) return;
  if (!app.get('connected')) setTimeout(() => connect(), wait);
}

function download(name, value, type) {
  const blob = typeof value === 'string' ? new Blob([value], { type: type || 'application/octet-stream' }) : value;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = name;
  a.href = url;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function load(ext, multi) {
  const file = document.getElementById('file');
  file.accept = ext || '.json';
  file.multiple = multi;
  let ok, fail;
  const res = new Promise((o, f) => (ok = o, fail = f));
  file.onchange = async () => {
    if (file.files.length < 1) fail(new Error('No files selected'));
    const res = [];
    for (const f of file.files) res.push({ name: f.name, text: await f.text() });
    if (multi) ok(res);
    else ok(res[0]);
    file.value = '';
  };
  file.click();
  return res;
}

async function downloadQuery(result) {
  const settings = app.get('settings');
  const field = settings.csv.field || ',';
  const record = settings.csv.record || '\n';
  const quote = settings.csv.quote || undefined;
  const ext = field === ',' ? 'csv' : field === '\\t' ? 'tsv' : 'txt';
  const name = await app.ask('Please enter a file name:', 'Query Result File Name', `${evaluate('@date#timestamp')} query.${ext}`);
  if (name) {
    const txt = run({ type: 'delimited', sources: [{ name: 'results' }], field, record, quote, source: 'results' }, { results: result });
    download(name, txt, 'text/plain');
  }
}

function cloneDeep(any) {
  try {
    return JSON.parse(JSON.stringify(any));
  } catch {
    return undefined;
  }
}

function queryParams(definition, source, params) {
  if (source.query) {
    const ctx = new Raport.Root(definition.context ? cloneDeep(definition.context) : {});
    ctx.parameters = params;
    if (definition.extraContext) Raport.evaluate(definition.extraContext)
    params = params || {};
    if (definition.parameters) {
      for (const p of definition.parameters) {
        if (!(p.name in params) && p.init) params[p.name] = Raport.evaluate(ctx, p.init);
      }
    }
    if (source.parameters) {
      return source.parameters.map(p => Raport.evaluate(ctx, p));
    } else return [];
  }
}

if (!globalThis.clientOnly) connect();
else {
  app.set('connected', true);
  app.findComponent('tabs').select(5);
}

Ractive.helpers.copyToClipboard = (function() {
  let clipEl;
  let id = 0;
  return function copyToClipboard(text, message) {
    if (typeof text !== 'string') text = JSON.stringify(text);

    const cur = ++id;
    app.set('copied.text', text);
    app.set('copied.recent', true);
    setTimeout(() => {
      if (cur === id) app.set('copied.recent', false);
    }, app.get('settings.pasteTimeout') || 10000);

    if (!clipEl) {
      clipEl = document.createElement('textarea');
      clipEl.id = 'clipEl';
      clipEl.style.position = 'absolute';
      clipEl.style.width = '1em';
      clipEl.style.height = '1em';
      clipEl.tabIndex = -1;
      clipEl.style.left = '-10000px';
      document.body.appendChild(clipEl);
    }

    try {
      clipEl.value = text;
      clipEl.select();
      document.execCommand('copy');
      if (message) app.host.toast(message, { type: 'success', timeout: 2000 });
      return Promise.resolve(true);
    } catch {
      return Promise.resolve(false);
    }
  }
})();

let unloadTm;
function unload(ev) {
  if (app.get('halted')) return;
  ev.preventDefault();
  ev.returnValue = '';
  app.set('unloading', true);
  setTimeout(() => {
    unloadTm = setTimeout(async () => {
      const what = await app.choose('Leaving this page will not stop the pg-difficult server to which this client is currently connected. If you are refreshing, connected elsewhere, or intend to leave the server running, you will not be stopped from leaving this page again for the next 10 seconds.', [
        { label: 'Leave', action() { this.close(false, 'leave'); }, where: 'left', title: 'Leave the server running and leave the page.' },
        { label: 'Stop Server', action() { this.close(false, 'halt'); }, title: 'Stop the server now and leave the page.', where: 'center', class: 'reject' },
        { label: 'Cancel', action() { this.close(false, 'cancel'); }, title: 'Don\'t leave the page.' },
      ], 'Leave server running?');

      if (what === 'leave') {
        window.removeEventListener('beforeunload', unload);
        setTimeout(() => {
          app.set('unloading', false);
          window.addEventListener('beforeunload', unload);
        }, 10000);
      } else if (what === 'halt') {
        app.set('halted', true);
        app.notify({ action: 'halt' });
      }
    }, 500);

  });
}

function unloading() {
  clearTimeout(unloadTm);
}

function debounce(fn, timeout = 1000, target) {
  let tm;
  return (function(...args) {
    if (tm) clearTimeout(tm);
    tm = setTimeout(() => fn.apply(target, args), timeout);
  });
}

window.addEventListener('beforeunload', unload);
window.addEventListener('unload', unloading);
window.addEventListener('storage', debounce(readSettings, 5000));

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

