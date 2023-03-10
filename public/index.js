const { evaluate } = Raport;
const { Window } = RauiWindow;

Ractive.use(RauiButton.plugin(), RauiForm.plugin({ includeStyle: true }), RauiShell.plugin(), RauiMenu.plugin(), RauiWindow.plugin(), RauiAppBar.plugin(), RauiTabs.plugin(), RauiTable.plugin({ includeGrid: true }));

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

setInterval(() => {
  Ractive.sharedSet('now', new Date());
}, 5000);

Ractive.helpers.moveUp = ctx => {
  const idx = ctx.get('@index');

  if (idx <= 0) return;
  const [item] = ctx.splice('../', idx - 1, 1).result;
  ctx.splice('../', idx, 0, item);
};

Ractive.helpers.moveDown = ctx => {
  const idx = ctx.get('@index');

  if (idx >= ctx.get('@last')) return;
  const [item] = ctx.splice('../', idx + 1, 1).result;
  ctx.splice('../', idx, 0, item);
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
    'status.clients': {
      handler(v) {
        const active = Object.values(v || {}).map(v => {
          return { title: v.source, action() { app.openEntries(v.id) } };
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
    '@.host': {
      handler(v) {
        if (v) {
          const bb = () => {
            const wins = v.get('windows');
            const list = [];
            for (const k in wins) {
              if (!/query-|leaks-|entries-|control-/.test(k)) list.push({ title: wins[k].title, action() { v.raise(k, true); } });
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
  ask(question, title) {
    const w = new Ask({ data: { message: question } });
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
    const win = new Entries('Local File', { data: { loaded: JSON.parse(file.text) } });
    app.host.addWindow(win, { title: `Loaded entries from ${file.name}` });
  },
  async loadSchema() {
    const file = await load('.pgds');
    const win = new Schema(undefined, { data: { schema: JSON.parse(file.text) } });
    app.host.addWindow(win, { title: `Loaded schema from ${file.name}` });
  },
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
  hasLeak(cfg) {
    const clients = Object.values(this.get('status.leaks') || {}).reduce((a, c) => {
      for (const db of c.databases) a.push(constr(c.config, { database: db }));
      return a;
    }, []);
    return clients.includes(constr(cfg));
  }
  async startDiff(config) {
    const res = await request({ action: 'start', config });
    if (res.action === 'resume') {
      const what = await app.choose('There is already a running diff in this database. Would you like to cancel, resume the diff that is already running from this instance, or restart start the diff and disconnect any other instances that are connected?', [
        { label: 'Cancel', action() { this.close() }, where: 'left' },
        { label: 'Restart', action() { this.close(false, 'restart') }, where: 'center' },
        { label: 'Resume', action() { this.close(false, 'resume'); } }
      ], 'Restart or resume diff?');
      if (what) request({ action: what, config });
    }
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
}
Window.extendWith(ControlPanel, {
  template: '#control-panel',
  css: `
.record { display: flex; align-items: center; justify-content: space-between; }
.connection { display: flex; flex-direction: column; }
.connection .constr { display: flex; flex-grow: 1; min-width: 20em; align-items: center; justify-content: space-between; }
.connection .actions { display: flex; justify-content: space-between; }
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

function reverseEntry(entry, schema) {
  if (entry.old && !entry.new) {
    return [`insert into "${entry.schema}"."${entry.table}" (${Object.keys(entry.old).map(k => `"${k}"`).join(', ')}) values (${Object.keys(entry.old).map((_k, i) => `$${i + 1}`).join(', ')})`, Object.values(entry.old)];
  } else if (entry.new && !entry.old) {
    const tbl = schema.find(t => t.schema === entry.schema && t.name === entry.table);
    if (!tbl) return;
    const keys = tbl.columns.filter(c => c.pkey);
    if (keys.length) return [`delete from "${entry.schema}"."${entry.table}" where ${keys.map((k, i) => `"${k.name}" = $${i + 1}`).join(' and ')}`, keys.map(k => entry.new[k])];
    else return [`delete from "${entry.schema}"."${entry.table}" where ${tbl.columns.map((c, i) => `"${c.name}" = $${i + 1}`).join(' and ')}`, tbl.columns.map(c => entry.new[c.name])];
  } else {
    const tbl = schema.find(t => t.schema === entry.schema && t.name === entry.table);
    if (!tbl) return;
    const keys = tbl.columns.filter(c => c.pkey);
    // TODO: maybe diff this down to only the changed fields at some point
    let i = 1;
    if (keys.length) return [`update "${entry.schema}"."${entry.table}" set ${Object.keys(entry.old).map(k => `"${k}" = $${i++}`).join(', ')} where ${keys.map(k => `"${k.name}" = $${i++}`).join(' and ')}`, Object.keys(entry.old).map(k => entry.old[k]).concat(keys.map(k => entry.old[k.name]))];
    else return [`update "${entry.schema}"."${entry.table}" set ${Object.keys(entry.old).map(k => `"${k}" = $${i++}`).join(', ')} where ${Object.keys(entry.new).map(k => `"${k}" = $${i++}`).join(' and ')}`, Object.keys(entry.old).map(k => entry.old[k]).concat(Object.keys(entry.new).map(k => entry.new[k]))];
  }
}

const EntryCSS = `
.controls { display: flex; justify-content: space-between; align-items: center; }
.diff { padding: 0.3em; display: flex; flex-wrap: wrap; }
.diff .name, .diff .left, .diff .right { width: 33%; overflow: hidden; text-overflow: ellipsis; }
.diff .name, .wrapper .name { font-weight: bold; }
.diff.whole .name { width: 100%; }
.entry { padding: 0.2em 0.5em; }
.entry .key { font-weight: bold; }
.wrapper > .name, .diff.whole > .name { display: flex; justify-content: space-between; }
.wrapper > .name > .src, .diff.whole > .name > .src { opacity: 0.4; }
.wrapper, .diff.whole, .header { position: relative; }
h2 { padding: 1em 0 0.5em 0; }
button.undo { position: absolute; top: 0.2em; right: 0; opacity: 0; transition: opacity 0.3s ease; }
.header button.undo { top: 0.75em; }
.header:hover button.undo, .wrapper:hover button.undo, .diff.whole:hover button.undo { opacity: 1; z-index: 20; }
.header { position: sticky; top: -1em; background-color: #fff; z-index: 30; }
`
class Entries extends Window {
  constructor(source, opts) {
    super(opts);
    this.set('@.source', source);
  }
  details(entry) {
    const res = evaluate({ entry, schema: this.get('schema') }, `
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
set table = find(schema =>schema == ~entry.schema and name == ~entry.table)
set keys = filter(table.columns =>pkey)
if keys.length then set res.id = join(map(keys =>'{name} = {~entry.old[name] ?? ~entry.new[name]}') ', ')
res
`);
    return res;
  }
  download() {
    if (this.event?.event?.ctrlKey) return this.openHtml();
    const db = this.source ? this.source.replace(/.*@([^:]+).*\/(.*)/, '$1-$2') : 'multiple';
    const name = `diff ${db} ${evaluate(`#now##date,'yyyy-MM-dd HH mm'`)}`;
    const ext = this.event?.event?.shiftKey ? 'html' : 'pgdd';
    let html, css;
    const text = this.event?.event?.shiftKey ? ([html, css] = this.getHtml(), `<html><head><title>${name}</title><style>${css}</style></head><body>${html}</body></html>`) : JSON.stringify(this.get('entries'));
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
    `;
    const el = this.find('.rwindow-content');
    return [el.innerHTML, css];
  }
  undoSingle(entry) {
    if (!this.source) return;
    const schema = this.get('schema');
    const reverse = reverseEntry(entry, schema);
    if (reverse) request({ action: 'query', query: [reverse[0]], params: [reverse[1]], client: Object.values(app.get('status.clients') || {}).find(c => c.source === this.source).config });
    else this.host.toast(`Undo is not supported for this table`, { type: 'error', timeout: 3000 });
  }
  async undoSegment(entry) {
    if (!this.source) return;
    const schema = this.get('schema');
    const base = app.get('entries') || [];
    const entries = [];

    for (let i = 0; i < base.length; i++) {
      if (!entries.length) {
        if (entry.id === base[i].id) entries.push(base[i]);
        else continue;
      }
      if (base[i] !== entry.segment) break;
      else entries.push(base[i]);
    }

    if (!entries.length) return this.host.toast('Nothing to undo', { type: 'info', timeout: 3000 });

    const reverse = entries.map(e => reverseEntry(e, schema)).filter(e => e);
    if (reverse.length !== entries.length) return this.host.toast(`Undo is not supported for this segment`, { type: 'error', timeout: 3000 });

    if (!this.event?.event?.ctrlKey) await request({ action: 'segment', segment: `Undo ${entry.segment}` });

    request({ action: 'query', query: reverse.map(p => p[0]), params: reverse.map(p => p[1]), client: Object.values(app.get('status.clients') || {}).find(c => c.source === this.source).config });
  }
}
Window.extendWith(Entries, {
  template: '#entries',
  options: { flex: true, resizable: true, width: '40em', height: '30em' },
  css: EntryCSS,
  computed: {
    entries() {
      const source = this.get('@.source');
      const loaded = this.get('loaded');
      if (loaded) return loaded;
      const entries = app.get('entries');
      if (source != null) return entries.filter(e => e.source === this.source);
      return entries;
    }
  },
  on: {
    complete() {
      if (!this.source) return;
      this.link(`schemas.${Ractive.escapeKey(this.source)}`, 'schema', { instance: app });
      this.scroller = this.find('.content-wrapper');
    }
  },
  observe: {
    'entries.length'() {
      if (this.scroller) {
        const s = this.scroller;
        if (s.scrollTop + s.clientHeight >= s.scrollHeight - 10) setTimeout(() => s.children[s.children.length - 1].scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
      }
    }
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
  css: `
.leak { display: flex; flex-wrap: wrap; }
.leak > * { box-sizing: border-box; padding: 0.2em; }
.leak.header { font-weight: bold; position: sticky; top: -0.5em; background-color: #fff; border-bottom: 1px solid; z-index: 1; padding-top: 0.5em; }
.leak .user { width: 8em; }
.leak .application { width: 12em; }
.leak .client { width: 12em; }
.leak .state { width: 5em; }
.leak .started { width: 13em; }
.leak .constr { width: 18em; }
.leak .pid { width: 6em; text-align: right; }
`,
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
      this.host.addWindow(w, { title: `Comparing schema ${constr(target.config)} to ${constr(this.config || 'Local File')}` });
    } else {
      this.set('compareSchema', { config: this.config || 'Local File', schema: local });
      this.host.toast('Click Compare on another schema to compare', { type: 'info', timeout: 4000 });
    }
  }
  download() {
    const db = this.config ? `${this.config.host || 'localhost'}-${this.config.database || 'postgres'}` : `Local File`;
    download(`schema ${db} ${evaluate(`#now##date,'yyyy-MM-dd HH mm'`)}.pgds`, JSON.stringify(this.get('schema')), 'application/pg-difficult-schema');
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
      if (!this.config) return;
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
      case 'status': app.set('status', Object.assign(msg.status, { lastUpdate: new Date() })); break;
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
      case 'leaks':
        for (const k in msg.map) app.set(`status.leaks.${k}.current`, msg.map[k]);
        app.set('status.lastUpdate', new Date());
        break;
      default:
        if ('id' in msg) request.response(msg.id, msg);
        break;
    }
  });
}

function reconnect() {
  if (!app.get('connected')) setTimeout(() => connect(), 10000);
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

