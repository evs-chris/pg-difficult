(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ractive')) :
  typeof define === 'function' && define.amd ? define(['exports', 'ractive'], factory) :
  (factory((global.RauiToast = {}),global.Ractive));
}(this, (function (exports,ractive) { 'use strict';

  var DEFAULTS = {
    timeout: 6000,
    top: true,
    stack: false,
  };

  function plugin(opts) {
    if ( opts === void 0 ) opts = {};

    var style = function(data) { return [(function(data) {
     var primary = Object.assign({}, data('raui.primary'), data('raui.toast.primary'));
     return ("\n   .rtoast-wrapper {\n     position: absolute;\n     display: flex;\n     flex-direction: column;\n     flex-wrap: no-wrap;\n     align-items: center;\n     overflow: hidden;\n     top: 0.8em;\n     left: 0.8em;\n     right: 0.8em;\n     bottom: auto;\n     z-index: 5;\n     pointer-events: none;\n     overflow: auto;\n     max-height: 80%;\n   }\n   .rtoast {\n     display: flex;\n     flex-wrap: wrap;\n     justify-content: center;\n     margin: 0.2em;\n   }\n   .rtoast-message {\n     flex-grow: 2;\n     display: flex;\n     align-items: center;\n   }\n   .rtoast-string {\n     white-space: pre-wrap;\n     line-height: 1.3em;\n     padding-top: 0.3em;\n   }\n   .rtoast-upper .rtoast-string {\n     \n   }\n   .rtoast-expand .rtoast-string {\n     padding-top: 0.5em;\n   }\n   .rtoast-buttons {\n     display: flex;\n     padding-left: 0.5em;\n     flex-shrink: 1;\n     align-items: center;\n     max-height: max-content;\n     margin-left: auto;\n   }\n   .rtoast-buttons button {\n     cursor: pointer;\n   }\n   .rtoast-button {\n     background-color: transparent;\n     border: none;\n     color: inherit;\n     padding: 0.5em 0.75em;\n     margin: 0 0 0 0.5em;\n     line-height: 1em;\n     box-shadow: none;\n   }\n   .rtoast-more {\n     cursor: pointer;\n     width: 2em;\n     position: relative;\n     flex-shrink: 2;\n     background-color: transparent;\n     border: none;\n     color: inherit;\n     margin: 0 0 0 0.5em;\n     height: 2em;\n   }\n   .rtoast-more:after {\n     content: ' ';\n     position: absolute;\n     display: block;\n     width: 0.6em;\n     height: 0.6em;\n     top: calc(50% - 0.55em);\n     left: calc(50% - 0.3em);\n     border-bottom: 0.125em solid;\n     border-right: 0.125em solid;\n     transform: rotate(45deg);\n     transition: transform 0.2s ease-in-out, top 0.2s ease-in-out;\n     pointer-events: none;\n   }\n   .rtoast-expanded .rtoast-more:after {\n     transform: rotate(225deg);\n     top: calc(50% - 0.1em);\n   }\n   .rtoast-bottom {\n     bottom: 0.8em;\n     top: auto;\n   }\n   .rtoast-left {\n     align-items: flex-start;\n   }\n   .rtoast-right {\n     align-items: flex-end;\n   }\n   .rtoast-body {\n     border-radius: 0.2em;\n     padding: 1em;\n     color: " + (primary.bg || '#fff') + ";\n     background-color: " + (primary.fg || '#222') + ";\n     box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);\n     opacity: 0.95;\n     pointer-events: all;\n     transition: color 0.5s ease-in-out, background 0.5s ease-in-out;\n     flex-shrink: 1;\n     display: flex;\n     flex-direction: column;\n   }\n   .rtoast-upper {\n     display: flex;\n     flex-shrink: 2;\n     flex-wrap: nowrap;\n     justify-content: space-between;\n   }\n \n   .rtoast-expand {\n     padding-top: 1em;\n   }\n   \n   .rtoast-expand .rtoast-string {\n     max-height: 15em;\n     overflow: auto;\n     border-radius: 0.2em;\n     padding: 0.5em;\n     background-color: " + (primary.bg || '#fff') + ";\n     color: " + (primary.fg || '#222') + ";\n     overflow: auto;\n   }\n \n   .rtoast-success {\n     color: " + (data('raui.toast.success.fg') || '#f9f9f9') + ";\n     background-color: " + (data('raui.toast.success.bg') || '#4caf50') + ";\n   }\n   .rtoast-info {\n     color: " + (data('raui.toast.info.fg') || '#f9f9f9') + ";\n     background-color: " + (data('raui.toast.info.bg') || '#07e') + ";\n   }\n   .rtoast-warn {\n     color: " + (data('raui.toast.warn.fg') || '#222') + ";\n     background-color: " + (data('raui.warn.success.bg') || '#ffc107') + ";\n   }\n   .rtoast-error {\n     color: " + (data('raui.toast.error.fg') || '#f9f9f9') + ";\n     background-color: " + (data('raui.toast.error.bg') || '#ff5252') + ";\n   }\n   ");
  }).call(this, data)].join(' '); };
    var template = {v:4,t:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rtoast-wrapper",g:1},{n:"class-rtoast-bottom",t:13,f:[{t:2,r:"@this.toastDefaults.bottom"}]},{n:"class-rtoast-left",t:13,f:[{t:2,r:"@this.toastDefaults.left"}]},{n:"class-rtoast-right",t:13,f:[{t:2,r:"@this.toastDefaults.right"}]}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rtoast",g:1},{n:"class-rtoast-expanded",t:13,f:[{t:2,r:".showMore"}]}],f:[{t:7,e:"div",m:[{n:"toast",t:72,v:"t0"},{n:"class",f:["rtoast-body",{t:4,f:[" rtoast-",{t:2,r:".type"}],n:50,r:".type"},{t:4,f:[{t:2,r:".class"}],n:50,r:".class"}],t:13},{t:4,f:[{n:["click"],t:70,f:{r:["."],s:"[_0.close()]"}}],n:50,x:{r:[".dismissable"],s:"_0!==false"}}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rtoast-upper",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rtoast-message",g:1}],f:[{t:4,f:[{t:4,f:[{t:8,r:".message",c:{r:".context"}}],n:50,x:{r:[".context"],s:"!!_0"}},{t:4,f:[{t:8,r:".message"}],n:51,l:1}],n:50,x:{r:[".message"],s:"Array.isArray(_0)"}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rtoast-string",g:1}],f:[{t:2,r:".message"}]}],n:51,l:1}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rtoast-buttons",g:1}],f:[{t:4,f:[{t:7,e:"button",m:[{n:"class",f:["rtoast-button",{t:4,f:[" ",{t:2,r:".class"}],n:50,r:".class"}],t:13},{t:4,f:[{n:["click"],t:70,f:{r:["."],s:"[_0.action()]"}}],n:50,x:{r:[".action"],s:"typeof _0===\"function\""}}],f:[{t:2,r:".label"}]}],n:52,r:".buttons"},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"rtoast-button",g:1}],f:["Close"]}],n:50,x:{r:[".dismissable",".closeButton"],s:"_0!==false&&_1!==false"},l:1}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rtoast-more",g:1},{n:"title",f:"Toggle more",t:13,g:1},{n:["click"],t:70,f:{r:[".","@context"],s:"[_0.expand(),(_1).toggle(\".showMore\"),false]"}}]}],n:50,r:".more"}]}],n:50,x:{r:[".dismissable",".closeButton",".buttons.length",".more"],s:"(_0!==false&&_1!==false)||_2||_3"}}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rtoast-expand",g:1},{n:"toast-expand",t:72,v:"t0"},{n:["click"],t:70,f:{r:[],s:"[false,false]"}}],f:[{t:4,f:[{t:4,f:[{t:8,r:".more",c:{r:".context"}}],n:50,x:{r:[".context"],s:"!!_0"}},{t:4,f:[{t:8,r:".more"}],n:51,l:1}],n:50,x:{r:[".more"],s:"Array.isArray(_0)"}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rtoast-string",g:1}],f:[{t:2,r:".more"}]}],n:51,l:1}]}],n:50,x:{r:[".more",".showMore"],s:"_0&&_1"}}]}]}],n:52,z:[{n:"shuffle",x:{x:{r:[],s:"true"}}}],r:"~/_toast"}]}],n:50,r:"~/_toast"}],e:{"[_0.close()]":function (_0){return([_0.close()]);},"_0!==false":function (_0){return(_0!==false);},"!!_0":function (_0){return(!!_0);},"Array.isArray(_0)":function (_0){return(Array.isArray(_0));},"[_0.action()]":function (_0){return([_0.action()]);},"typeof _0===\"function\"":function (_0){return(typeof _0==="function");},"_0!==false&&_1!==false":function (_0,_1){return(_0!==false&&_1!==false);},"[_0.expand(),(_1).toggle(\".showMore\"),false]":function (_0,_1){return([_0.expand(),(_1).toggle(".showMore"),false]);},"(_0!==false&&_1!==false)||_2||_3":function (_0,_1,_2,_3){return((_0!==false&&_1!==false)||_2||_3);},"[false,false]":function (){return([false,false]);},"_0&&_1":function (_0,_1){return(_0&&_1);},"true":function (){return(true);}}};

    return function(ref) {
      var Ractive = ref.Ractive;
      var instance = ref.instance;
      var proto = ref.proto;

      instance.partials[opts.name || 'toast'] = template;

      var defaults = Object.assign({}, DEFAULTS, opts);
      var toasts = [];
      var holder = { toasts: toasts };
      var active;

      Object.defineProperty(proto, 'toastDefaults', {
        value: defaults,
        writable: false,
        configurable: true,
      });

      proto.toast = function toast(message, options) {
        var this$1 = this;

        delete options.top, delete options.bottom, delete options.left, delete options.right;
        var opts = Object.assign({ message: message, instance: this }, defaults, this.toastDefaults, options);
        opts.close = function () { return closeToast(opts, this$1); };
        opts.expand = function () {
          if (!opts.stack && holder.active !== opts) { return; }
          if (holder.tm) {
            clearTimeout(holder.tm);
            holder.tm = null;
          }

          if (opts.showMore) {
            if (opts.timeout) { holder.tm = setTimeout(function () {
              opts.close();
              holder.tm = null;
            }, opts.timeout); }
          }
        };
        toasts.push(opts);
        if (!active || opts.stack) { showToast(opts.stack); }
        return new Handle(holder, opts);
      };

      function closeToast(which, instance) {
        var o = Object.assign(opts, instance.toastDefaults);

        if (active !== which) {
          toasts.splice(toasts.indexOf(which), 1);
          instance.set('_toast', active ? (o.stack ? [active].concat(toasts) : [active]) : null).then(function () {
            if (typeof which.onclose === 'function') { which.onclose(); }
          });
        } else {
          if (holder.tm) {
            clearTimeout(holder.tm);
            holder.tm = null;
          }

          var next = toasts.shift();
          instance.shift('_toast').then(function () {
            instance.set('_toast', next ? (o.stack ? [next].concat(toasts) : [next]) : null).then(function () {
              instance && instance.fire('toasted', null, which);
              if (typeof which.onclose === 'function') { which.onclose(); }
              holder.active = active = next;
              if (active && active.timeout && !active.showMore) {
                if (holder.tm) { clearTimeout(holder.tm); }
                holder.tm = setTimeout(function () {
                  active.close();
                  holder.tm = null;
                }, active.timeout);
              }
            });
          });
        }
      }
      function showToast(stack) {
        if (!active) { holder.active = active = toasts.shift(); }
        active.instance.set('_toast', stack ? [active].concat(toasts) : [active]).then(function () {
          if (active.timeout && !active.showMore) {
            if (holder.tm) { clearTimeout(holder.tm); }
            holder.tm = setTimeout(function () {
              active.close();
              holder.tm = null;
            }, active.timeout);
          }
        });
      }

      proto.on = proto.on || {};

      instance.transitions.toast = function(t, ps) {
        var params = t.processParams({ duration: 200 }, ps);
        var opacity = t.getStyle('opacity');
        if (t.isIntro) {
          t.setStyle({
            opacity: 0,
            transform: ("translateY(" + (active.bottom ? '' : '-') + "1em)")
          });
          return t.animateStyle({
            opacity: opacity,
            transform: "none"
          }, params);
        } else {
          t.setStyle({
            opacity: opacity,
            transform: "none"
          });
          return t.animateStyle({
            opacity: 0,
            transform: ("translateY(" + (active.bottom ? '' : '-') + "1em)")
          }, params);
        }
      };

      instance.transitions['toast-expand'] = function(t, ps) {
        var params = t.processParams({ duration: 200, nested: false }, ps);
        if (t.isIntro) {
          var h = t.getStyle('height');
          var w = t.getStyle('width');
          t.setStyle('height', 0);
          t.setStyle('width', 0);
          return t.animateStyle('width', w, params).then(function () { return t.animateStyle('height', h, params); }).then(function () {
            t.setStyle('height', '');
            t.setStyle('width', '');
          });
        } else {
          var h$1 = t.getStyle('height');
          t.setStyle('height', h$1);
          t.setStyle('width', t.getStyle('width'));
          return t.animateStyle('height', 0, params).then(function () { return t.animateStyle('width', 0, params); }).then(function () {
            t.setStyle('height', '');
            t.setStyle('width', '');
          });
        }
      };

      proto.on['close-toast'] = function() {
        if (active) { active.close(); }
      };

      if (instance === Ractive || Ractive.isInstance(instance)) {
        if (!Ractive.hasCSS('toast-css')) { Ractive.addCSS('toast', style); }
      } else {
        var pcss = instance.css;
        instance.css = function(data) {
          var css = '';
          if (typeof pcss === 'string') { css += pcss; }
          else if (typeof pcss === 'function') { css += pcss(data); }
          return style(data) + css;
        };
      }

      return proto;
    }
  }

  var Handle = function Handle(holder, data) {
    this.holder = holder;
    this.data = data;
  };

  var prototypeAccessors = { message: { configurable: true },more: { configurable: true },showMore: { configurable: true },left: { configurable: true },context: { configurable: true },type: { configurable: true },class: { configurable: true },dismissable: { configurable: true },closeButton: { configurable: true },buttons: { configurable: true },live: { configurable: true },closed: { configurable: true } };

  Handle.prototype.close = function close (timeout) {
      var this$1 = this;

    this.data.timeout = timeout;
    if (this.data === this.holder.active) {
      if (this.holder.tm) { clearTimeout(this.holder.tm); }
      if (timeout) {
        this.holder.tm = setTimeout(function () {
          this$1.data.close();
          this$1.holder.tm = null;
        }, timeout);
      } else { this.data.close(); }
    } else {
      if (timeout) {
        this.data.timeout = timeout;
      } else { this.data.close(); }
    }

    return this.closed;
  };

  Handle.prototype.cancelClose = function cancelClose () {
    if (this.data === this.holder.active) {
      clearTimeout(this.holder.tm);
      this.holder.tm = null;
    } else {
      this.data.timeout = 0;
    }
  };

  Handle.prototype.updateButtons = function updateButtons () { this.data.instance.update('_toast'); };

  Handle.prototype.set = function set (key, value) {
    if (typeof key === 'object') {
      for (var k in key) {
        this.data[k] = key[k];
      }
      return this.data.instance.update('_toast');
    } else {
      this.data[key] = value;
      return this.data.instance.update("_toast");
    }
  };

  prototypeAccessors.message.get = function () { return this.data.message; };
  prototypeAccessors.message.set = function (v) { this.data.message = v; this.data.instance.update('_toast'); };

  prototypeAccessors.more.get = function () { return this.data.more; };
  prototypeAccessors.more.set = function (v) { this.data.more = v; this.data.instance.update('_toast'); };

  prototypeAccessors.showMore.get = function () { return this.data.showMore; };
  prototypeAccessors.showMore.set = function (v) { this.data.showMore = v; this.data.instance.update('_toast'); };

  prototypeAccessors.left.get = function () { return this.data.left; };
  prototypeAccessors.left.set = function (v) { this.data.left = v; this.data.right = false; this.data.instance.update('_toast'); };

  prototypeAccessors.context.get = function () { return this.data.context; };
  prototypeAccessors.context.set = function (v) { this.data.context = v; this.data.instance.update('_toast'); };

  prototypeAccessors.type.get = function () { return this.data.type; };
  prototypeAccessors.type.set = function (v) { this.data.type = v; this.data.instance.update('_toast'); };

  prototypeAccessors.class.get = function () { return this.data.class; };
  prototypeAccessors.class.set = function (v) { this.data.class = v; this.data.instance.update('_toast'); };

  prototypeAccessors.dismissable.get = function () { return this.data.dismissable; };
  prototypeAccessors.dismissable.set = function (v) { this.data.dismissable = v; this.data.instance.update('_toast'); };

  prototypeAccessors.closeButton.get = function () { return this.data.closeButton; };
  prototypeAccessors.closeButton.set = function (v) { this.data.closeButton = v; this.data.instance.update('_toast'); };

  prototypeAccessors.buttons.get = function () { return this.data.buttons; };
  prototypeAccessors.buttons.set = function (v) { this.data.buttons = v; this.data.instance.update('_toast'); };

  prototypeAccessors.live.get = function () { return this.data === this.holder.active || ~this.holder.toasts.indexOf(this.data); };
  prototypeAccessors.closed.get = function () {
      var this$1 = this;

    if (!this._promise) {
      this._promise = new Promise(function (ok) {
        this$1.data.onclose = ok;
      });
    }
    return this._promise;
  };

  Object.defineProperties( Handle.prototype, prototypeAccessors );

  exports.default = plugin;
  exports.Handle = Handle;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
