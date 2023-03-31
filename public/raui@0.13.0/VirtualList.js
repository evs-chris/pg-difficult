(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ractive')) :
  typeof define === 'function' && define.amd ? define(['exports', 'ractive'], factory) :
  (factory((global.RauiVirtualList = {}),global.Ractive));
}(this, (function (exports,Ractive$1) { 'use strict';

  Ractive$1 = Ractive$1 && Ractive$1.hasOwnProperty('default') ? Ractive$1['default'] : Ractive$1;

  function scrolled(node, opts) {
    if ( opts === void 0 ) opts = {};

    var bind = typeof opts === 'string' ? opts : opts.bind;
    if (typeof bind !== 'string') { return { teardown: function teardown() {} }; }

    var allow = opts.allow || 2;

    var ctx = this.getContext(node);
    var pending = false;
    var tm;

    function watch() {
      pending = false;
      var str = '';
      if (node.scrollHeight > node.clientHeight) { str += 'vscroll'; }
      if (node.scrollWidth > node.clientWidth) { str += (str ? ' ' : '') + 'hscroll'; }

      if (node.scrollTop <= allow) { str += ' top'; }
      if (node.scrollTop >= node.scrollHeight - node.clientHeight - allow) { str += ' bottom'; }
      if (!~str.indexOf('top') && !~str.indexOf('bottom')) { str += ' vmiddle'; }

      if (node.scrollLeft <= allow) { str += ' left'; }
      if (node.scrollLeft >= node.scrollWidth - node.clientWidth - allow) { str += ' right'; }
      else if (!~str.indexOf('left') && !~str.indexOf('right')) { str += ' hmiddle'; }

      ctx.set(bind, str);
      if (ctx.hasListener('scrolled')) { ctx.raise('scrolled', {}); }
    }

    node.addEventListener('scroll', watch, { passive: true });

    requestAnimationFrame(watch);

    return {
      refresh: function refresh() {
        if (pending) { return; }
        if (tm) { clearTimeout(tm); }
        tm = setTimeout(function() {
          tm = null;
          pending = true;
          requestAnimationFrame(watch);
        }, 250);
      },
      teardown: function teardown() {
        node.removeEventListener('scroll', watch);
        ctx.set(bind, '');
      }
    }
  }

  function plugin(options) {
    if ( options === void 0 ) options = {};

    return function(ref) {
      var instance = ref.instance;

      instance.decorators[options.name || 'scrolled'] = scrolled;
    }
  }

  /** @param { HTMLElement } node  */
  function sized(node, attrs) {
    var ctx = attrs.context || this.getContext(node);
    var start = {
      position: node.style.position,
      overflowY: node.style.overflowY
    };

    if (node.style.position === '' || node.style.position === 'static') { node.style.position = 'relative'; }

    var refresh = function () {
      if (attrs.offsetWidth) { ctx.set(attrs.offsetWidth, node.offsetWidth); }
      if (attrs.offsetHeight) { ctx.set(attrs.offsetHeight, node.offsetHeight); }
      if (attrs.clientWidth) { ctx.set(attrs.clientWidth, node.clientWidth); }
      if (attrs.clientHeight) { ctx.set(attrs.clientHeight, node.clientHeight); }
      if (attrs.diffWidth) { ctx.set(attrs.diffWidth, node.offsetWidth - node.clientWidth); }
      if (attrs.diffHeight) { ctx.set(attrs.diffHeight, node.offsetHeight - node.clientHeight); }
    };

    var obj = initObject(node, refresh);

    return {
      refresh: refresh,
      teardown: function teardown() {
        node.removeChild(obj);
        node.style.position = start.position;
        node.style.overflowY = start.overflowY;
      }
    }
  }

  function initObject(parent, refresh) {
    var obj = document.createElement('object');
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
    obj.setAttribute('tabindex', '-1');
    obj.type = 'text/html';

    obj.onload = function () {
      obj.contentDocument.defaultView.addEventListener('resize', refresh);
      refresh();
    };
    
    if (/Trident/.test(navigator.userAgent)) {
      parent.appendChild(obj);
      obj.data = 'about:blank';
    } else {
      obj.data = 'about:blank';
      parent.appendChild(obj);
    }

    return obj;
  }

  var win = typeof window !== 'undefined' ? window : null;

  function globalRegister(name, registry, constructor) {
    if (win && win.Ractive && typeof win.Ractive[registry] === 'object') {
      var script = document.currentScript;
      if (!script) {
        script = document.querySelectorAll('script');
        script = script[script.length - 1];
      }

      if (script) {
        var aliases = script.getAttribute('data-alias');
        if (aliases) {
          aliases = aliases.split('&');
          aliases = aliases.reduce(function (a, c) {
            var ref = c.split('=');
            var k = ref[0];
            var v = ref[1];
            a[k] = v;
            return a;
          }, {});
        }

        Ractive[registry][(aliases && aliases[name]) || name] = constructor;
      }
    }
  }

  var VirtualList = /*@__PURE__*/(function (Ractive) {
    function VirtualList(opts) { Ractive.call(this, opts); }

    if ( Ractive ) VirtualList.__proto__ = Ractive;
    VirtualList.prototype = Object.create( Ractive && Ractive.prototype );
    VirtualList.prototype.constructor = VirtualList;
    VirtualList.prototype.adjust = function adjust () {
      if (!this.rendered) { return; }
      var items = this.get('items') || [];
      var size = this.get('size');
      var top = this.get('virtual.top') || 0;
      var vheight = this.get('virtual.height') || 100;

      if (!items.length) {
        this.set({
          'virtual.padTop': 0,
          'virtual.padBottom': 0,
          'virtual.adjust': 0,
          'virtual.items': [],
        });
        return;
      }

      if (!size) {
        this.set({
          'virtual.items': items.slice(0, 10),
          'virtual.offsetIndex': 0,
        });
        var els = this.findAll('.rvlitem'); 
        size = Math.max(Math.floor(els.reduce(function (a, c) { return a + c.offsetHeight; }, 0) / els.length), 16);
        this.set('size', size);
      }

      var targetEl = this.findAll('.rvlitem').find(function (e) { return top <= e.offsetTop + e.offsetHeight && top >= e.offsetTop; });

      var idx, targetTop = -1;
      if (targetEl) {
        idx = +targetEl.getAttribute('data-index');
        targetTop = targetEl.offsetTop;
      } else {
        idx = idx = Math.min(Math.max(Math.floor(top / size), 0), items.length - 1);
      }
      if (!~idx) { idx = Math.min(Math.max(Math.floor(top / size), 0), items.length - 1); }

      var count = Math.ceil(vheight / size);

      if (idx === this.get('virtual.target') && count === this.get('virtual.count') && items.length === this.get('virtual.length')) { return; }

      var lidx = idx - count;
      var uidx = idx + 2 * count;

      // make sure there are three pages available
      if (lidx < 0) {
        uidx += Math.abs(lidx);
        lidx = 0;
      }
      if (uidx > items.length) {
        lidx -= uidx - (items.length - 1);
        uidx = items.length - 1;
      }
      if (uidx > items.length - 5) {
        uidx = items.length;
        lidx = uidx - 3 * count;
      }
      if (lidx < 0) { lidx = 0; }
      if (lidx > idx) { lidx = idx; }

      var next = items.slice(lidx, uidx);

      this.set({
        'virtual.count': count,
        'virtual.size': size,
        'virtual.items': next,
        'virtual.offsetIndex': lidx,
        'virtual.adjust': 0,
        'virtual.target': idx,
        'virtual.length': items.length,
      });

      var above = lidx * size;
      var below = uidx === items.length ? 0 : (items.length - uidx - 1) * size;

      var refEl = this.find((".rvlitem-" + idx));

      this.set({
        'virtual.padTop': above,
        'virtual.padBottom': below,
      });
      var adjust = ~targetTop ? targetTop - refEl.offsetTop : size * idx - refEl.offsetTop;
      this.set('virtual.adjust', adjust);

      if (Math.abs(adjust) > 2 * count * size || above + adjust < 0 || above === 0 && adjust < 0 || below === 0 && adjust > 0) {
        this.set('virtual.adjust', 0);
        this.scroller.scrollTop -= adjust;
      }
    };

    VirtualList.prototype.estimateSize = function estimateSize () {
      var this$1 = this;

      this.set('size', undefined);
      requestAnimationFrame(function () { return this$1.adjust(); });
    };

    return VirtualList;
  }(Ractive$1));
  Ractive$1.extendWith(VirtualList, {
    template: {v:4,t:[{t:4,f:[{t:16,x:{r:[],s:"\"header\""},c:{rx:{r:"~/items",m:[{t:30,n:"~/virtual.target"}]}}}],n:50,r:"header"},{t:7,e:"div",m:[{t:13,n:"class",f:"rvlist",g:1},{t:16,r:"extra-attributes"},{n:"scrolled",t:71},{n:"sized",t:71,f:{r:[],s:"[{offsetHeight:\"virtual.height\",offsetWidth:\"virtual.width\"}]"}},{n:"scroller",t:71}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rvlwindow",g:1},{n:"style",f:["padding-top: ",{t:2,x:{r:["~/virtual.padTop","~/virtual.adjust"],s:"_0+_1"}},"px; padding-bottom: ",{t:2,r:"~/virtual.padBottom"},"px;"],t:13}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rvlblock",g:1}],f:[{t:4,f:[{t:4,f:[{t:4,f:[{t:7,e:"div",m:[{n:"class",f:["rvlitem rvlitem-",{t:2,x:{r:["~/virtual.offsetIndex","@index"],s:"_0+_1"}}],t:13},{n:"data-index",f:[{t:2,x:{r:["~/virtual.offsetIndex","@index"],s:"_0+_1"}}],t:13},{t:16,x:{r:[],s:"\"item-attrs\""},c:{r:"."},z:[{n:"index",x:{x:{r:["~/virtual.offsetIndex","@index"],s:"_0+_1"}}}]}],f:[{t:16,x:{r:[],s:"\"item\""},c:{r:"."},z:[{n:"index",x:{x:{r:["~/virtual.offsetIndex","@index"],s:"_0+_1"}}}]}]}],n:54,rx:{r:"~/items",m:[{r:["~/virtual.offsetIndex","@index"],s:"_0+_1"}]}}],n:52,r:"~/virtual.items"}],n:50,r:"~/virtual.items.length"},{t:4,f:[{t:16,x:{r:[],s:"\"else\""}}],n:51,l:1}]}]}]}],e:{"\"header\"":function (){return("header");},"[{offsetHeight:\"virtual.height\",offsetWidth:\"virtual.width\"}]":function (){return([{offsetHeight:"virtual.height",offsetWidth:"virtual.width"}]);},"_0+_1":function (_0,_1){return(_0+_1);},"\"item-attrs\"":function (){return("item-attrs");},"\"item\"":function (){return("item");},"\"else\"":function (){return("else");}}},
    css: " .rvlist { display: block; min-height: 16px; overflow: auto; } .rvlitem { display: block; }",
    cssId: 'rvlist',
    noCssTransform: true,
    attributes: ['items', 'size'],
    data: function data() {
      return {
        virtual: {
          offsetIndex: 0,
          items: [],
          top: 0,
          adjust: 0,
          count: 0,
          padTop: 0,
          padBottom: 0,
        },
      };
    },
    decorators: {
      sized: sized,
      scroller: function scroller(node) {
        var ctx = Ractive$1.getContext(node);
        var handler = function (ev) {
          if (ev.target !== node) { return; }
          ctx.set({
            '~/virtual.top': node.scrollTop,
            '~/virtual.bottom': node.scrollBottom,
          });
        };
        node.addEventListener('scroll', handler, { passive: true });
        return {
          teardown: function teardown() {
            node.removeEventListener('scroll', handler, { passive: true });
          }
        }
      },
    },
    use: [plugin()],
    observe: {
      'items.length virtual.height virtual.top': function items_lengthvirtual_heightvirtual_top() {
        var this$1 = this;

        if (this._throttle) { return; }
        this._throttle = setTimeout(function () {
          requestAnimationFrame(function () {
            this$1.adjust();
            this$1._throttle = 0;
          });
        }, 60);
      },
    },
    on: {
      construct: function construct() {
        var cmp = this.component;
        if (!cmp) { return; }

        var tpl = cmp.template.f || [];
        var t = cmp.template;
        cmp.template = { e: t.e, f: t.f, t: t.t, m: t.m, p: t.p || {} };
        var init = {};

        var alt = tpl.find(function (t) { return typeof t === 'object' && 'e' in t && t.e === 'else'; });
        if (alt) { init.else = alt.f; }

        var header = init.header = tpl.find(function (t) { return typeof t === 'object' && 'e' in t && t.e === 'header'; });
        if (header) { init.header = header.f; }

        var item = init.item = tpl.find(function (t) { return typeof t === 'object' && 'e' in t && t.e === 'item'; });
        cmp.template.f = tpl.filter(function (t) { return t !== alt && t !== item && t !== header; });

        if (!item) {
          init.item = cmp.template.f;
          init['item-attrs'] = [];
        } else {
          init['item-attrs'] = init.item.m || [];
          init.item = init.item.f;
        }

        this._init = init;
      },
      config: function config() {
        if (this._init) { Object.assign(this.partials, this._init); }
        if (this.partials.header) { this.set('header', true); }
      },
      render: function render() {
        this.scroller = this.find('.rvlist');
        this.window = this.find('.rvlwindow');
      },
    },
  });

  function plugin$2(opts) {
    if ( opts === void 0 ) opts = {};

    return function(ref) {
      var instance = ref.instance;

      instance.components[opts.name || 'virtual-list'] = VirtualList;
    };
  }

  globalRegister('RauiVirtualList', 'components', VirtualList);

  exports.VirtualList = VirtualList;
  exports.plugin = plugin$2;
  exports.default = plugin$2;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
