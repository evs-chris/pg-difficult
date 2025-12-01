(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ractive')) :
  typeof define === 'function' && define.amd ? define(['exports', 'ractive'], factory) :
  (factory((global.RauiShell = {}),global.Ractive));
}(this, (function (exports,Ractive$1) { 'use strict';

  Ractive$1 = Ractive$1 && Ractive$1.hasOwnProperty('default') ? Ractive$1['default'] : Ractive$1;

  // based on ractive-event-tap
  var abs = Math.abs;

  function makeSwipe(opts) {
    var init = Object.assign({}, { distance: 150, flick: 200, threshold: 0.2 }, opts);
    return function setup(ref) {
      var Ractive = ref.Ractive;
      var instance = ref.instance;

      instance.events[opts.name || ("swipe" + (opts.direction || ''))] = function swipe(node, fire, options) {
        if ( options === void 0 ) options = {};

        var handler;
        var opts = Object.assign({}, { direction: 'right' }, init, options);
        opts.fire = fire;
        if (handler = node.__r_swipes__) {
          handler.subscribe(opts);
        } else {
          handler = new Handler(Ractive.getContext(node));
          node.__r_swipes__ = handler;
          handler.subscribe(opts);
        }

        return { teardown: function teardown() { handler.unsubscribe(fire); } };
      };
    }
  }

  var left = makeSwipe({ direction: 'left' });
  var right = makeSwipe({ direction: 'right' });
  var up = makeSwipe({ direction: 'up' });
  var down = makeSwipe({ direction: 'down' });

  var Handler = function Handler(context) {
    this.context = context;
    this.node = context.node;
    this.fires = [];

    this.bind();
  };

  Handler.prototype.subscribe = function subscribe (opts) {
    this.fires.push(opts);
    this.hasBinding = !!this.fires.find(function (f) { return f.bindPx || f.bind; });
    this.hasBounds = !!this.fires.find(function (f) { return f.maxX != null || f.maxY != null || f.minX != null || f.minY != null; });
  };

  Handler.prototype.unsubscribe = function unsubscribe (fire) {
    this.fires = this.fires.filter(function (f) { return f.fire !== fire; });
    if (!this.fires.length) { this.teardown(); }
    this.hasBinding = !!this.fires.find(function (f) { return f.bindPx || f.bind; });
    this.hasBounds = !!this.fires.find(function (f) { return f.maxX != null || f.maxY != null || f.minX != null || f.minY != null; });
  };

  Handler.prototype.bind = function bind () {
    // listen for mouse/pointer events...
    if ('ontouchstart' in window) {
      this.context.listen('mousedown', handleMousedown);
      this.context.listen('dragstart', handleDragstart);

      // ...and touch events
      this.context.listen('touchstart', handleTouchstart, { passive: false });
    } else if (window.PointerEvent || window.navigator.pointerEnabled) {
      this.context.listen('pointerdown', handleMousedown, { passive: false });
    } else if (window.navigator.msPointerEnabled) {
      this.context.listen('MSPointerDown', handleMousedown);
    } else {
      this.context.listen('mousedown', handleMousedown);
      this.context.listen('dragstart', handleDragstart);

      // ...and touch events
      this.context.listen('touchstart', handleTouchstart, { passive: false });
    }
  };

  Handler.prototype.fire = function fire (event, startx, starty, endx, endy, duration) {
      var this$1 = this;

    var node = this.node;
    var fired;

    this.fires.forEach(function (f) {
      if (!f.active) { f.active = true; return; }

      var distx = duration < f.flick ? endx - startx + ((f.flick / duration) * (endx - startx)) : endx - startx;
      var disty = duration < f.flick ? endy - starty + ((f.flick / duration) * (endy - starty)) : endy - starty;
      var threshold = abs(f.threshold <= 0 ? Math.max(distx, disty) : f.threshold < 1 ? f.direction === 'right' || f.direction === 'left' ? f.threshold * distx : f.threshold * disty : f.threshold);
      var dist = f.bindPx;
      var pct = f.bind;

      if (distx > 0 && f.direction === 'right' && distx >= f.distance && abs(disty) <= threshold) {
        f.fire({ node: node, event: event });
        fired = true;
      } else if (distx < 0 && f.direction === 'left' && -distx >= f.distance && abs(disty) <= threshold) {
        f.fire({ node: node, event: event });
        fired = true;
      }

      if (disty > 0 && f.direction === 'down' && disty >= f.distance && abs(distx) <= threshold) {
        f.fire({ node: node, event: event });
        fired = true;
      } else if (disty < 0 && f.direction === 'up' && -disty >= f.distance && abs(distx) <= threshold) {
        f.fire({ node: node, event: event });
        fired = true;
      }

      if (dist) { this$1.context.set(dist, 0); }
      if (pct) { this$1.context.set(pct, 0); }
    });

    return fired;
  };

  Handler.prototype.checkBounds = function checkBounds (startx, starty) {
    var rect = this.node.getBoundingClientRect();
    var x = startx - rect.x, y = starty - rect.y;

    this.fires.forEach(function (f) {
      var maxX = f.maxX;
        var maxY = f.maxY;
        var minX = f.minX;
        var minY = f.minY;
      if (maxX > 0 && x > maxX) { f.active = false; return; }
      if (maxX < 0 && x > rect.width + maxX) { f.active = false; return; }
      if (maxY > 0 && y > maxY) { f.active = false; return; }
      if (maxY < 0 && y > rect.height + maxY) { f.active = false; return; }
      if (minX > 0 && x < minX) { f.active = false; return; }
      if (minX < 0 && x < rect.width + minX) { f.active = false; return; }
      if (minY > 0 && y < minY) { f.active = false; return; }
      if (minY < 0 && y < rect.width + minY) { f.active = false; return; }
      f.active = true;
    });

    return !!this.fires.find(function (f) { return f.active; });
  };

  Handler.prototype.updateBindings = function updateBindings (startx, starty, endx, endy) {
      var this$1 = this;

    this.fires.forEach(function (f) {
      if (!f.active) { return; }

      if (!f.bindPx && !f.bind) { return; }

      var dist = f.bindPx;
      var pct = f.bind;
      var distx = endx - startx;
      var disty = endy - starty;
      var threshold = abs(f.threshold <= 0 ? Math.max(distx, disty) : f.threshold < 1 ? f.direction === 'right' || f.direction === 'left' ? f.threshold * distx : f.threshold * disty : f.threshold);

      if (dist) {
        if (f.direction === 'left') { this$1.context.set(dist, distx < 0 && abs(disty) <= threshold ? -distx : 0); }
        else if (f.direction === 'right') { this$1.context.set(dist, distx > 0 && abs(disty) <= threshold ? distx : 0); }
        else if (f.direction === 'up') { this$1.context.set(dist, disty < 0 && abs(distx) <= threshold ? -disty : 0); }
        else if (f.direction === 'down') { this$1.context.set(dist, disty > 0 && abs(distx) <= threshold ? disty : 0); }
      }

      if (pct) {
        if (f.direction === 'left') { this$1.context.set(pct, distx < 0 && abs(disty) <= threshold ? (-distx / f.distance) * 100 : 0); }
        else if (f.direction === 'right') { this$1.context.set(pct, distx > 0 && abs(disty) <= threshold ? (distx / f.distance) * 100 : 0); }
        else if (f.direction === 'up') { this$1.context.set(pct, disty < 0 && abs(distx) <= threshold ? (-disty / f.distance) * 100 : 0); }
        else if (f.direction === 'down') { this$1.context.set(pct, disty > 0 && abs(distx) <= threshold ? (disty / f.distance) * 100 : 0); }
      }
    });
  };

  Handler.prototype.mousedown = function mousedown (event) {
      var this$1 = this;

    if (this.preventMousedownEvents) {
      return;
    }

    if (event.which !== undefined && event.which !== 1) {
      return;
    }

    var start = new Date();
    var x = event.clientX;
    var y = event.clientY;

    if (this.hasBounds && !this.checkBounds(x, y)) { return; }
   
    // This will be null for mouse events.
    var pointerId = event.pointerId;

    var handleMouseup = function (event) {
      this$1.fire(event, x, y, event.clientX, event.clientY, new Date() - start) && event.cancelable !== false && event.preventDefault();
      cancel();
    };

    var handleMousemove = function (event) {
      if (event.pointerId != pointerId) {
        return;
      }

      if (this$1.hasBinding) {
        this$1.updateBindings(x, y, event.clientX, event.clientY);
      }  
    };

    var cancel = function () {
      this$1.node.removeEventListener('MSPointerUp', handleMouseup, false);
      document.removeEventListener('MSPointerMove', handleMousemove, false);
      document.removeEventListener('MSPointerCancel', cancel, false);
      document.removeEventListener('pointerup', handleMouseup, false);
      document.removeEventListener('pointermove', handleMousemove, false);
      document.removeEventListener('pointercancel', cancel, false);
      document.removeEventListener('mouseup', handleMouseup, false);
      document.removeEventListener('click', handleMouseup, false);
      document.removeEventListener('mousemove', handleMousemove, false);
    };

    if (window.PointerEvent || window.navigator.pointerEnabled) {
      document.addEventListener('pointerup', handleMouseup, false);
      document.addEventListener('pointermove', handleMousemove, false);
      document.addEventListener('pointercancel', cancel, false);
    } else if (window.navigator.msPointerEnabled) {
      document.addEventListener('MSPointerUp', handleMouseup, false);
      document.addEventListener('MSPointerMove', handleMousemove, false);
      document.addEventListener('MSPointerCancel', cancel, false);
    } else {
      document.addEventListener('mouseup', handleMouseup, false);
      document.addEventListener('click', handleMouseup, false);
      document.addEventListener('mousemove', handleMousemove, false);
    }
  };

  Handler.prototype.touchdown = function touchdown (event) {
      var this$1 = this;

    var touch = event.touches[0];

    var start = new Date();
    var x = touch.clientX;
    var y = touch.clientY;

    if (this.hasBounds && !this.checkBounds(x, y)) { return; }
      
    var finger = touch.identifier;

    var handleTouchup = function (event) {
      var touch = event.changedTouches[0];

      if (touch.identifier !== finger) {
        cancel();
        return;
      }

      // for the benefit of mobile Firefox and old Android browsers, we need this absurd hack.
      this$1.preventMousedownEvents = true;
      clearTimeout(this$1.preventMousedownTimeout);

      this$1.preventMousedownTimeout = setTimeout(function () {
        this$1.preventMousedownEvents = false;
      }, 400);

      this$1.fire(event, x, y, touch.clientX, touch.clientY, new Date() - start) && event.cancelable !== false && event.preventDefault();
      cancel();
    };

    var handleTouchmove = function (event) {
      if (event.touches.length !== 1 || event.touches[0].identifier !== finger) {
        cancel();
      }

      var touch = event.touches[0];

      if (event.cancelable) {
        var distX = touch.clientX - x;
        var distY = touch.clientY - y;
        if (abs(distX) > abs(distY)) {
          if (distX > 0 && this$1.fires.find(function (f) { return f.direction === 'right'; })) { event.preventDefault(); }
          if (distX < 0 && this$1.fires.find(function (f) { return f.direction === 'left'; })) { event.preventDefault(); }
        }
      }

      if (this$1.hasBinding) {
        this$1.updateBindings(x, y, touch.clientX, touch.clientY);
      }  
    };

    var cancel = function () {
      this$1.node.removeEventListener('touchend', handleTouchup, false);
      window.removeEventListener('touchmove', handleTouchmove, { passive: false, capture: false });
      window.removeEventListener('touchcancel', cancel, false);
    };

    this.node.addEventListener('touchend', handleTouchup, false);
    window.addEventListener('touchmove', handleTouchmove, { passive: false, capture: false });
    window.addEventListener('touchcancel', cancel, false);
  };

  Handler.prototype.teardown = function teardown () {
    var ctx = this.context;

    ctx.unlisten('pointerdown', handleMousedown);
    ctx.unlisten('MSPointerDown', handleMousedown);
    ctx.unlisten('mousedown', handleMousedown);
    ctx.unlisten('touchstart', handleTouchstart);
    ctx.unlisten('dragstart', handleDragstart);

    delete this.node.__r_swipes__;
  };
  function handleMousedown(event) {
    return this.__r_swipes__.mousedown(event);
  }

  function handleTouchstart(event) {
    return this.__r_swipes__.touchdown(event);
  }

  function handleDragstart(event) {
    event.preventDefault();
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

  /** @param { HTMLElement } node  */

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

  var emSize = 16;
  var emEl;

  function setEmSize(size) {
    emSize = size;
  }

  function initEmEl() {
    if (!emEl && window && 'document' in window && typeof document.createElement === 'function') {
      emEl = document.createElement('div');
      emEl.setAttribute('style', 'position: absolute; left: -2em; width: 1em; height: 1em;');

      initObject(emEl, function () { return setEmSize(emEl.getBoundingClientRect().width); });

      window.addEventListener('resize', function () {
        initEmEl();
        setEmSize(emEl.getBoundingClientRect().width);
      });
    }

    if (emEl && !emEl.parent) {
      document.body.appendChild(emEl);
    }
  }

  function sizeInEm(px) {
    if (!emEl) { initEmEl(); }
    if (typeof px === 'string') { px = px.replace(/[^-.\d]/g, ''); }
    return +px / emSize;
  }

  var Shell = /*@__PURE__*/(function (Ractive) {
    function Shell(opts) { Ractive.call(this, opts); }

    if ( Ractive ) Shell.__proto__ = Ractive;
    Shell.prototype = Object.create( Ractive && Ractive.prototype );
    Shell.prototype.constructor = Shell;

    Shell.prototype.adaptSize = function adaptSize (reinit) {
      if (reinit) {
        if (this._media) { this._media.cancel(); }
        initMediaListener(this);
      } else {
        this._media && this._media.fn();
      }
    };

    Shell.prototype.shellSize = function shellSize (rel) {
      if ( rel === void 0 ) rel = '1em';

      var el = this.outer;
      if (!el) { return { width: 0, height: 0 }; }
      return { width: sizeInEm(el.clientWidth), height: sizeInEm(el.clientHeight) }
    };

    return Shell;
  }(Ractive$1));

  Ractive$1.extendWith(Shell, {
    template: {v:4,t:[{t:7,e:"div",m:[{t:13,n:"class",f:"rshell",g:1},{t:16,r:"extra-attributes"},{n:"tracked",t:71,f:{r:[],s:"[\"outer\"]"}},{n:"class-rshell-left-popped",t:13,f:[{t:2,r:".leftPop"}]},{n:"class-rshell-right-popped",t:13,f:[{t:2,r:".rightPop"}]},{n:"class-rshell-top-popped",t:13,f:[{t:2,r:".topPop"}]},{n:"class-rshell-bottom-popped",t:13,f:[{t:2,r:".bottomPop"}]}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rshell-main",g:1}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rshell-top",g:1},{n:"class-rshell-overflow",t:13,f:[{t:2,r:"~/topOverflow"}]},{t:4,f:[{t:16,r:"._topA"}],n:50,r:"._topA"}],f:[{t:16,r:"._top"}]}],n:50,r:"._top"}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"rshell-middle",g:1},{n:"class-rshell-has-left",t:13,f:[{t:2,x:{r:["._left","._leftOver",".leftOver"],s:"_0&&!_1&&!_2"}}]},{n:"class-rshell-has-right",t:13,f:[{t:2,x:{r:["._right","._rightOver",".rightOver"],s:"_0&&!_1&&!_2"}}]},{n:"class-rshell-left-hidden",t:13,f:[{t:2,r:".leftHidden"}]},{n:"class-rshell-right-hidden",t:13,f:[{t:2,r:".rightHidden"}]}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rshell-modal",g:1},{n:"class-rshell-blocked",t:13,f:[{t:2,x:{r:[".blocked",".blockableLeft",".leftPull",".blockableRight",".rightPull"],s:"_0||(_1&&_2)||(_3&&_4)"}}]},{n:["click"],t:70,f:{r:["@this",".leftOver","._leftOver",".leftHidden",".rightOver","._rightOver",".rightHidden"],s:"[_0.set({leftHidden:_1||_2?true:_3,rightHidden:_4||_5?true:_6})]"}},{t:4,f:[{n:["swipeleft"],t:70,a:{r:[],s:"[{bind:\".leftPush\"}]"},f:{r:["@this"],s:"[_0.set(\"leftHidden\",true)]"}},{n:["swiperight"],t:70,a:{r:[],s:"[{bind:\".rightPush\"}]"},f:{r:["@this"],s:"[_0.set(\"rightHidden\",true)]"}}],n:50,rx:{r:"~/",m:[{r:[],s:"\"side-swipe\""}]}},{t:4,f:[{n:"style-transition",f:"none",t:13},{n:"style-opacity",f:[{t:2,x:{r:[".leftPull",".rightPull"],s:"Math.min(_0||_1,100)/200"}}],t:13}],n:50,x:{r:[".leftPull",".rightPull"],s:"_0||_1"}}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rshell-left",g:1},{n:"tracked",t:71,f:{r:[],s:"[\"left\"]"}},{t:4,f:[{t:16,r:"._leftA"}],n:50,r:"._leftA"},{t:4,f:[{n:["swipeleft"],t:70,a:{r:[],s:"[{bind:\".leftPush\"}]"},f:{r:["@this"],s:"[_0.set(\"leftHidden\",true)]"}}],n:50,rx:{r:"~/",m:[{r:[],s:"\"side-swipe\""}]}},{t:4,f:[{n:"style-transition",f:"none",t:13},{n:"style-transform",f:["translate(-",{t:2,x:{r:[".leftPull"],s:"100-(_0>100?100:_0)"}},"%)"],t:13}],n:50,r:".leftPull"},{t:4,f:[{n:"style-transition",f:"none",t:13},{n:"style-transform",f:["translate(-",{t:2,x:{r:[".leftPush"],s:"_0>100?100:_0"}},"%)"],t:13}],n:50,r:".leftPush"},{n:"class-rshell-overflow",t:13,f:[{t:2,r:"~/leftOverflow"}]}],f:[{t:16,r:"._left"}]}],n:50,r:"._left"}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rshell-center",g:1},{n:"tracked",t:71,f:{r:[],s:"[\"center\"]"}},{t:4,f:[{t:16,r:"._centerA"}],n:50,r:"._centerA"},{t:4,f:[" ",{t:4,f:[{n:["swiperight"],t:70,a:{r:[],s:"[{maxX:80,bind:\".leftPull\"}]"},f:{r:["@this"],s:"[_0.set(\"leftHidden\",false)]"}}],n:50,x:{r:["._left",".leftHidden"],s:"_0&&_1"}}," ",{t:4,f:[{n:["swipeleft"],t:70,a:{r:[],s:"[{minX:-80,bind:\".rightPull\"}]"},f:{r:["@this"],s:"[_0.set(\"rightHidden\",false)]"}}],n:50,x:{r:["._right",".rightHidden"],s:"_0&&_1"}}," "],n:50,rx:{r:"~/",m:[{r:[],s:"\"side-swipe\""}]}},{n:"class-rshell-overflow",t:13,f:[{t:2,r:"~/centerOverflow"}]}],f:[{t:16,r:"._center"}]}],n:50,r:"._center"}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rshell-right",g:1},{n:"tracked",t:71,f:{r:[],s:"[\"right\"]"}},{t:4,f:[{t:16,r:"._rightA"}],n:50,r:"._rightA"},{t:4,f:[{n:["swiperight"],t:70,a:{r:[],s:"[{bind:\".rightPush\"}]"},f:{r:["@this"],s:"[_0.set(\"rightHidden\",true)]"}}],n:50,rx:{r:"~/",m:[{r:[],s:"\"side-swipe\""}]}},{t:4,f:[{n:"style-transition",f:"none",t:13},{n:"style-transform",f:["translate(",{t:2,x:{r:[".rightPull"],s:"100-(_0>100?100:_0)"}},"%)"],t:13}],n:50,r:".rightPull"},{t:4,f:[{n:"style-transition",f:"none",t:13},{n:"style-transform",f:["translate(",{t:2,x:{r:[".rightPush"],s:"_0>100?100:_0"}},"%)"],t:13}],n:50,r:".rightPush"},{n:"class-rshell-overflow",t:13,f:[{t:2,r:"~/rightOverflow"}]}],f:[{t:16,r:"._right"}]}],n:50,r:"._right"}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rshell-bottom",g:1},{t:4,f:[{t:16,r:"._bottomA"}],n:50,r:"._bottomA"},{n:"class-rshell-overflow",t:13,f:[{t:2,r:"~/bottomOverflow"}]}],f:[{t:16,r:"._bottom"}]}],n:50,r:"._bottom"}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rshell-left-pop",g:1},{t:4,f:[{t:16,r:"._leftPopA"}],n:50,r:"._leftPopA"}],f:[{t:16,r:"._leftPop"}]}],n:50,r:"._leftPop"}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rshell-right-pop",g:1},{t:4,f:[{t:16,r:"._rightPopA"}],n:50,r:"._rightPopA"}],f:[{t:16,r:"._rightPop"}]}],n:50,r:"._rightPop"}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rshell-bottom-pop",g:1},{t:4,f:[{t:16,r:"._bottomPopA"}],n:50,r:"._bottomPopA"}],f:[{t:16,r:"._bottomPop"}]}],n:50,r:"._bottomPop"}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rshell-top-pop",g:1},{t:4,f:[{t:16,r:"._topPopA"}],n:50,r:"._topPopA"}],f:[{t:16,r:"._topPop"}]}],n:50,r:"._topPop"}]}],e:{"[\"outer\"]":function (){return(["outer"]);},"_0&&!_1&&!_2":function (_0,_1,_2){return(_0&&!_1&&!_2);},"_0||(_1&&_2)||(_3&&_4)":function (_0,_1,_2,_3,_4){return(_0||(_1&&_2)||(_3&&_4));},"[_0.set({leftHidden:_1||_2?true:_3,rightHidden:_4||_5?true:_6})]":function (_0,_1,_2,_3,_4,_5,_6){return([_0.set({leftHidden:_1||_2?true:_3,rightHidden:_4||_5?true:_6})]);},"[{bind:\".leftPush\"}]":function (){return([{bind:".leftPush"}]);},"[_0.set(\"leftHidden\",true)]":function (_0){return([_0.set("leftHidden",true)]);},"[{bind:\".rightPush\"}]":function (){return([{bind:".rightPush"}]);},"[_0.set(\"rightHidden\",true)]":function (_0){return([_0.set("rightHidden",true)]);},"\"side-swipe\"":function (){return("side-swipe");},"Math.min(_0||_1,100)/200":function (_0,_1){return(Math.min(_0||_1,100)/200);},"_0||_1":function (_0,_1){return(_0||_1);},"[\"left\"]":function (){return(["left"]);},"100-(_0>100?100:_0)":function (_0){return(100-(_0>100?100:_0));},"_0>100?100:_0":function (_0){return(_0>100?100:_0);},"[\"center\"]":function (){return(["center"]);},"[{maxX:80,bind:\".leftPull\"}]":function (){return([{maxX:80,bind:".leftPull"}]);},"[_0.set(\"leftHidden\",false)]":function (_0){return([_0.set("leftHidden",false)]);},"_0&&_1":function (_0,_1){return(_0&&_1);},"[{minX:-80,bind:\".rightPull\"}]":function (){return([{minX:-80,bind:".rightPull"}]);},"[_0.set(\"rightHidden\",false)]":function (_0){return([_0.set("rightHidden",false)]);},"[\"right\"]":function (){return(["right"]);}}}, css: function(data) { return [(function(data) {
     var left$$1 = data('raui.shell.left.width') || data('raui.menu.width') || '18em';
     var right$$1 = data('raui.shell.right.width') || data('raui.menu.width') || '18em';
     var primary = Object.assign({}, data('raui.primary'), data('raui.shell.primary'));
     return ("\n   .rshell {\n     width: 100%;\n     height: 100%;\n     position: absolute;\n     overflow: hidden;\n   }\n   .rshell-modal {\n     position: absolute;\n     top: 0;\n     left: 0;\n     bottom: 0;\n     right: 0;\n     opacity: 0;\n     background-color: #000;\n     z-index: -1;\n     transition: opacity " + (data('raui.shell.slide.ms') || 400) + "ms ease-in-out, z-index 0s linear " + (data('raui.shell.slide.ms') || 400) + "ms;\n   }\n   .rshell-modal.rshell-blocked {\n     opacity: 0.5;\n     z-index: 3;\n     transition: opacity " + (data('raui.shell.slide.ms') || 400) + "ms ease-in-out, z-index 0s linear;\n   }\n   .rshell-main {\n     width: 100%;\n     height: 100%;\n     box-sizing: border-box;\n     display: flex;\n     flex-direction: column;\n     overflow: hidden;\n     z-index: 1;\n     background-color: " + (primary.bg || 'inherit') + ";\n   }\n \n   .rshell-middle {\n     flex-grow: 1;\n     position: relative;\n   }\n \n   .rshell-left, .rshell-right {\n     position: absolute;\n     top: 0;\n     box-sizing: border-box;\n     height: 100%;\n     overflow: auto;\n     z-index: 4;\n     background-color: " + (primary.bg || 'inherit') + ";\n     transition: transform " + (data('raui.shell.slide.ms') || 400) + "ms ease-in-out;\n   }\n   .rshell-left {\n     left: 0;\n     width: " + left$$1 + ";\n   }\n   .rshell-right {\n     right: 0;\n     width: " + right$$1 + ";\n   }\n   .rshell-left-hidden > .rshell-left {\n     transform: translateX(-100%);\n   }\n   .rshell-right-hidden > .rshell-right {\n     transform: translateX(100%);\n   }\n   .rshell-has-right > .rshell-right,\n   .rshell-has-left > .rshell-left {\n     z-index: 2;\n   }\n   .rshell-left-popped > .rshell-main > .rshell-middle > .rshell-left,\n   .rshell-left-popped > .rshell-main > .rshell-middle > .rshell-right,\n   .rshell-top-popped > .rshell-main > .rshell-middle > .rshell-left,\n   .rshell-top-popped > .rshell-main > .rshell-middle > .rshell-right,\n   .rshell-bottom-popped > .rshell-main > .rshell-middle > .rshell-left,\n   .rshell-bottom-popped > .rshell-main > .rshell-middle > .rshell-right,\n   .rshell-right-popped > .rshell-main > .rshell-middle > .rshell-left,\n   .rshell-right-popped > .rshell-main > .rshell-middle > .rshell-right {\n     z-index: 2;\n   }\n \n   .rshell-left-pop, .rshell-right-pop, .rshell-top-pop, .rshell-bottom-pop {\n     z-index: 5;\n     transition: transform " + (data('raui.shell.slide.ms') || 400) + "ms ease-in-out;\n     position: absolute;\n   }\n   .rshell-left-pop, .rshell-right-pop {\n     top: 0;\n     bottom: 0;\n     max-width: 100%;\n     overflow: auto;\n   }\n   .rshell-top-pop, .rshell-bottom-pop {\n     left: 0;\n     right: 0;\n     max-height: 100%;\n     overflow: auto;\n   }\n \n   .rshell-left-pop {\n     transform: translateX(-100%);\n   }\n   .rshell-right-pop {\n     transform: translateX(100%);\n     right: 0;\n   }\n   .rshell-top-pop {\n     top: 0;\n     transform: translateY(-100%);\n   }\n   .rshell-bottom-pop {\n     bottom: 0;\n     transform: translateY(100%);\n   }\n \n   .rshell-left-popped > .rshell-left-pop,\n   .rshell-right-popped > .rshell-right-pop,\n   .rshell-top-popped > .rshell-top-pop,\n   .rshell-bottom-popped > .rshell-bottom-pop {\n     transform: none;\n   }\n \n   .rshell-center {\n     position: absolute;\n     top: 0;\n     left: 0;\n     z-index: 1;\n     box-sizing: border-box;\n     height: 100%;\n     width: 100%;\n     flex-grow: 1;\n     overflow: auto;\n   }\n   .rshell-has-left > .rshell-center {\n     width: calc(100% - " + left$$1 + ");\n     left: " + left$$1 + ";\n   }\n   .rshell-has-right > .rshell-center {\n     width: calc(100% - " + right$$1 + ");\n     left: 0;\n   }\n   .rshell-has-left.rshell-has-right > .rshell-center {\n     width: calc(100% - " + left$$1 + " - " + right$$1 + ");\n     left: " + left$$1 + ";\n   }\n   .rshell-has-left.rshell-left-hidden > .rshell-center {\n     width: 100%;\n     left: 0;\n   }\n   .rshell-has-right.rshell-right-hidden > .rshell-center {\n     width: 100%;\n   }\n   .rshell-has-left.rshell-has-right.rshell-left-hidden > .rshell-center {\n     width: calc(100% - " + right$$1 + ");\n     left: 0;\n   }\n   .rshell-has-left.rshell-has-right.rshell-right-hidden > .rshell-center {\n     width: calc(100% - " + left$$1 + ");\n     left: " + left$$1 + ";\n   }\n   .rshell-has-left.rshell-has-right.rshell-left-hidden.rshell-right-hidden > .rshell-center {\n     width: 100%;\n     left: 0;\n   }\n \n   .rshell-overflow {\n     overflow: visible;\n   }\n   ");
     // TODO: other themes
  }).call(this, data)].join(' '); },
    attributes: ['adaptive', 'side-swipe'],
    use: [ left, right ],
    decorators: {
      tracked: function tracked(node, name) {
        this[name] = node;
        return { teardown: function teardown() { this[name] = undefined; } };
      }
    },
    cssId: 'rshell',
    noCssTransform: true,
    computed: {
      blockableLeft: function blockableLeft() {
        return this.get('_left') && (this.get('leftOver') || this.get('_leftOver'));
      },
      blockableRight: function blockableRight() {
        return this.get('_right') && (this.get('rightOver') || this.get('_rightOver'));
      },
      blocked: function blocked() {
        return (this.get('blockableLeft') && !(this.get('leftHidden')) || (this.get('blockableRight') && !this.get('rightHidden'))) || this.get('leftPop') || this.get('rightPop') || this.get('topPop') || this.get('bottomPop');
      }
    },
    on: {
      construct: construct,
      config: function config() {
        if (this._items) { this.set(this._items); }
      },
      init: function init() {
        var this$1 = this;

        if (this.get('@style.shell.sides.initialTimeout') && (this.get('rightOver') || this.get('leftOver'))) {
          setTimeout(function () {
            if (this$1.get('rightOver')) { this$1.set('rightHidden', true); }
            if (this$1.get('leftOver')) { this$1.set('leftHidden', true); }
          }, this.get('@style.shell.sides.initialTimeout') || 1500);
        } else {
            if (this.get('rightOver')) { this.set('rightHidden', true); }
            if (this.get('leftOver')) { this.set('leftHidden', true); }
        }
      },
      complete: function complete() {
        initMediaListener(this);
      },
      unrender: function unrender() {
        if (this._media) { this._media.cancel(); }
      }
    },
    observe: {
      'leftHidden rightHidden': {
        handler: function handler(v, o, k) {
          var this$1 = this;

          if (~k.indexOf('left') && !this.get('leftOver') && !this.get('_leftOver') || ~k.indexOf('right') && !this.get('rightOver') && !this.get('_rightOver')) {
            setTimeout(function () {
              this$1._media && this$1._media.listener && this$1._media.listener.silence();
              this$1._media && this$1._media.observer && this$1._media.observer.silence();
              this$1._media.notify();
              this$1._media && this$1._media.listener && this$1._media.listener.resume();
              this$1._media && this$1._media.observer && this$1._media.observer.resume();
            }, (this.get('shell.slide.ms') || 400) + 10);
          }
        },
        defer: true,
        init: false
      }
    }
  });

  var parts = ['top', 'bottom', 'center', 'left', 'right', 'left-pop', 'right-pop', 'top-pop', 'bottom-pop'];
  var skipAttrs = ['hidden', 'primary', 'over', 'popped', 'overflow', 'forced'];
  function construct() {
    var cmp = this.component;
    if ( !cmp ) { return; }

    var tpl = cmp.template.f || [];
    var attrs = cmp.template.m ? cmp.template.m.slice() : [];
    var t = cmp.template;
    cmp.template = { e: t.e, f: t.f, t: t.t, m: attrs };

    var items = {};

    tpl.forEach(function (e) {
      if (~parts.indexOf(e.e)) {
        var name = e.e === 'left-pop' ? 'leftPop' : e.e === 'right-pop' ? 'rightPop' : e.e === 'top-pop' ? 'topPop' : e.e === 'bottom-pop' ? 'bottomPop' : e.e;
        items[("_" + name)] = { t: e.f };
        if (e.m) {
          var as = e.m.filter(function (a) { return !~skipAttrs.indexOf(a.n); });

          if (as.length) {
            items[("_" + name + "A")] = { t: as };
          }

          if (as.length !== e.m.length) {
            var a = e.m.find(function (a) { return a.n === 'hidden'; });
            if (a) { attrs.push({ t: 13, n: (name + "Hidden"), f: a.f }); }
            a = e.m.find(function (a) { return a.n === 'over'; });
            if (a) { attrs.push({ t: 13, n: (name + "Over"), f: a.f }); }
            a = e.m.find(function (a) { return a.n === 'primary'; });
            if (a) { attrs.push({ t: 13, n: ("_" + name + "Primary"), f: a.f }); }
            if (~e.e.indexOf('-pop')) {
              a = e.m.find(function (a) { return a.n === 'popped'; });
              if (a) { attrs.push({ t: 13, n: name, f: a.f }); }
            }
            a = e.m.find(function (a) { return a.n === 'overflow'; });
            if (a) { attrs.push({ t: 13, n: (name + "Overflow"), f: a.f }); }
            a = (e.e === 'left' || e.e === 'right') && e.m.find(function (a) { return a.n === 'forced'; });
            if (a) { attrs.push({ t: 13, n: ("_" + name + "Over"), f: a.f }); }
          }
        }
      }
    });

    this._items = items;
  }

  function initMediaListener(r) {
    if (typeof window === 'undefined') { return; }
    if (!r.left && !r.right) { return; }
    if (r._media) { return r._media.fn; }
    var inited = 0;
    var tm;

    function notify(sizes) {
      if (!sizes) { sizes = { width: sizeInEm(r.outer.clientWidth), height: sizeInEm(r.outer.clientHeight) }; }
      if (!sizes.center && r.center) { sizes.center = { width: sizeInEm(r.center.clientWidth), height: sizeInEm(r.center.clientHeight) }; }
      r.fire('resize', {}, sizes);
    }
    var media = {
      fn: function fn() {
        var outer = sizeInEm(r.outer.clientWidth);
        var outerH = sizeInEm(r.outer.clientHeight);
        if (media.last === outer && media.lastH === outerH) { return; }
        else { media.last = outer; }

        var sizes = {
          left:  !r.get('leftOver') && r.left && r.left.clientWidth || 0,
          right: !r.get('rightOver') && r.right && r.right.clientWidth || 0
        };
        if (sizes.left) { sizes.left = sizeInEm(sizes.left); }
        if (sizes.right) { sizes.right = sizeInEm(sizes.right); }

        var primary = r.get('_rightPrimary') ? 'right' : 'left';
        var secondary = primary === 'right' ? 'left' : 'right';
        var medium = r.get('@style.break.medium') || 60;

        var overs = { _leftOver: false, _rightOver: false };
        var hides = { leftHidden: r.get('leftOver'), rightHidden: r.get('rightOver') };

        if (!inited) {
          overs.leftHidden = false;
          overs.rightHidden = false;
        }

        var w = outer - sizes.left - sizes.right;
        if (w <= medium) {
          w += sizes[secondary];
          hides[(secondary + "Hidden")] = true;
          overs[("_" + secondary + "Over")] = true;
          if (w <= medium) {
            hides[(primary + "Hidden")] = true;
            overs[("_" + primary + "Over")] = true;
          }
        }

        r.set(overs);

        if (!inited) {
          inited = 1;
          setTimeout(function () {
            inited = 2;
            r.set(hides);
          }, r.get('@style.shell.sides.initialTimeout') || 1500);
        } else if (inited === 2) {
          r.set(hides);
        }

        if (tm) { clearTimeout(tm); }
        tm = setTimeout(function () {
          if (media.listener) { media.listener.silence(); }
          notify({ width: outer, height: outerH });
          if (media.listener) { media.listener.resume(); }
          tm = 0;
        }, (r.get('shell.slide.ms') || 400) + 100);
      },
      notify: notify,
      cancel: function cancel() {
        r._media = null;
        window.removeEventListener('resize', media.fn);
        if (media.observer) { media.observer.cancel(); }
        if (media.listener) { media.listener.cancel(); }
      }
    };

    window.addEventListener('resize', media.fn);
    media.observer = r.observe('@style leftOver rightOver _leftPrimary _rightPrimary', media.fn, { init: false });
    if (r.get('adaptive')) { media.listener = r.root.on('*.resize', media.fn); }

    r._media = media;

    r._media.fn();
  }

  function plugin$1(opts) {
    if ( opts === void 0 ) opts = {};

    return function(ref) {
      var instance = ref.instance;

      instance.components[opts.name || 'shell'] = Shell;
    }
  }

  globalRegister('RauiShell', 'components', Shell);

  exports.Shell = Shell;
  exports.plugin = plugin$1;
  exports.default = plugin$1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
