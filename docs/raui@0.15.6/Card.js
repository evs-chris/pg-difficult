(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ractive')) :
  typeof define === 'function' && define.amd ? define(['exports', 'ractive'], factory) :
  (factory((global.RauiCard = {}),global.Ractive));
}(this, (function (exports,Ractive$1) { 'use strict';

  Ractive$1 = Ractive$1 && Ractive$1.hasOwnProperty('default') ? Ractive$1['default'] : Ractive$1;

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

  function expand(t, params) {
    var p = t.processParams(params, { duration: 200, easing: 'easeInOut' });
    return new Promise(function (ok) {
      // defer execution to allow for grid stuff
      requestAnimationFrame(function () {
        t.setStyle('overflow', 'hidden');
        var axis = p.axis === 'x' ? 'width' : 'height';
        if (t.isIntro || p.intro) {
          var val = t.getStyle(axis);
          t.setStyle(axis, 0);
          t.setStyle('opacity', 0);
          ok(t.animateStyle(axis, val, p)
            .then(function () { return t.animateStyle('opacity', 1, p); })
            .then(function () {
              t.setStyle(axis, '');
              t.setStyle('overflow', '');
            }));
        } else {
          t.setStyle(axis, t.getStyle(axis));
          t.setStyle('opacity', 1);
          ok(t.animateStyle('opacity', 0, p)
            .then(function () { return t.animateStyle(axis, 0, p); }));
        }
      });
    });
  }

  globalRegister('expand', 'transitions', expand);

  var template = {v:4,t:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-wrapper",g:1},{t:8,r:"extra-attributes"},{n:"class-rcard-margin",t:13,f:[{t:2,r:"_card.margin"}]},{n:"class-rcard-wrapper-popout",t:13,f:[{t:2,r:"_card.popout"}]}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard",g:1},{n:"class-rcard-no-pad",t:13,f:[{t:2,r:"_card.noPad"}]},{n:"class-rcard-section",t:13,f:[{t:2,r:"_card.section"}]},{n:"class-rcard-flat",t:13,f:[{t:2,x:{r:["_card","_card.flat","@style.card.flat"],s:"\"flat\" in _0?_1:_2"}}]},{n:"class-rcard-deep",t:13,f:[{t:2,x:{r:["_card","_card.flat","@style.card.flat"],s:"\"flat\" in _0?!_1:!_2"}}]},{n:"class-rcard-popout",t:13,f:[{t:2,r:"_card.popout"}]},{n:"class-rcard-collapsed",t:13,f:[{t:2,x:{r:["_card.expandable","_card.expanded"],s:"_0&&_1===false"}}]},{n:"class-rcard-expandable",t:13,f:[{t:2,r:"_card.expandable"}]},{n:"class-rcard-arrow",t:13,f:[{t:2,r:"_card.arrow"}]},{n:"class-rcard-no-fill",t:13,f:[{t:2,r:"_card.noFill"}]},{n:"class-rcard-with-header",t:13,f:[{t:2,x:{r:["_card.titleP","_card.subtitleP","_card.avatarP","_card.title","_card.subtitle","_card.avatar","_card.tabs","_card.section"],s:"_0||_1||_2||_3||_4||(_5&&typeof _5===\"string\"||(_6&&_7))"}}]}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-header",g:1},{t:4,f:[{n:"class-rcard-clickable",t:13},{n:["click"],t:70,f:{r:["_card"],s:"[_0.expand()]"}}],n:50,x:{r:["_card.expandable","_card.arrow"],s:"_0&&_1"}}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-expand",g:1},{n:"class-rcard-expanded",t:13,f:[{t:2,x:{r:["_card.expanded"],s:"_0!==false"}}]}],f:[{t:7,e:"svg",f:[{t:7,e:"path",m:[{n:"d",f:"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z",t:13,g:1}]}]}]}],n:50,x:{r:["_card.arrow","_card.expandable"],s:"_0&&_1"}}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-avatar",g:1},{n:"class-rcard-avatar-round",t:13,f:[{t:2,r:"_card.round"}]}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-avatar-inner",g:1},{n:"style-background-image",f:["url(",{t:2,r:"_card.avatar"},")"],t:13}]}]}],n:50,x:{r:["_card.avatar"],s:"_0&&typeof _0===\"string\""}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-avatar",g:1},{t:4,f:[{t:8,r:"_card.avatarA"}],n:50,r:"_card.avatarA"}],f:[{t:8,r:"_card.avatarP"}]}],n:50,r:"_card.avatarP",l:1}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-titles",g:1},{n:"class-rcard-with-sub",t:13,f:[{t:2,x:{r:["_card.subtitle","_card.subtitleP"],s:"_0||_1"}}]},{n:"class-rcard-with-tabs",t:13,f:[{t:2,r:"_card.tabs"}]},{t:4,f:[{n:"class-rcard-shrink",t:13},{n:"class-rcard-clickable",t:13},{n:["click"],t:70,f:{r:["_card"],s:"[_0.expand()]"}}],n:50,x:{r:["_card.expandable","_card.arrow"],s:"_0&&!_1"}}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-title",g:1}],f:[{t:2,r:"_card.title"}]}],n:50,r:"_card.title"},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-title",g:1},{t:4,f:[{t:8,r:"_card.titleA"}],n:50,r:"_card.titleA"}],f:[{t:8,r:"_card.titleP"}]}],n:50,r:"_card.titleP",l:1}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-subtitle",g:1}],f:[{t:2,r:"_card.subtitle"}]}],n:50,r:"_card.subtitle"},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-subtitle",g:1},{t:4,f:[{t:8,r:"_card.subtitleA"}],n:50,r:"_card.subtitleA"}],f:[{t:8,r:"_card.subtitleP"}]}],n:50,r:"_card.subtitleP",l:1}]}," ",{t:4,f:[{t:8,r:"tabs"}],n:50,x:{r:["_card.tabs","_card.section"],s:"_0&&_1"}}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-title-right",g:1},{n:["click"],t:70,f:{r:[],s:"[false,false]"}}],f:[{t:8,r:"_card.titleRightP"}]}],n:50,r:"_card.titleRightP"}]}],n:50,x:{r:["_card.titleP","_card.subtitleP","_card.avatarP","_card.title","_card.subtitle","_card.avatar","_card.tabs","_card.section"],s:"_0||_1||_2||_3||_4||(_5&&typeof _5===\"string\"||(_6&&_7))"}}," ",{t:4,f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-tab-wrapper",g:1},{t:4,f:[{n:"expand",t:72,v:"t0"}],n:50,r:"_card.expandable"}],f:[{t:8,r:"tab-bodies"}]}],n:50,x:{r:["_card.tabs","_card.section"],s:"_0&&_1"}}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-image",g:1},{t:4,f:[{n:"expand",t:72,v:"t0"}],n:50,r:"_card.expandable"}],f:[{t:7,e:"img",m:[{n:"src",f:[{t:2,r:"_card.image"}],t:13},{n:"alt",f:[{t:2,r:"_card.alt"}],t:13}]}]}],n:50,r:"_card.image"},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-image",g:1},{t:4,f:[{n:"expand",t:72,v:"t0"}],n:50,r:"_card.expandable"},{t:4,f:[{t:8,r:"_card.imageA"}],n:50,r:"_card.imageA"}],f:[{t:8,r:"_card.imageP"}]}],n:50,r:"_card.imageP",l:1}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-content",g:1},{t:4,f:[{n:"expand",t:72,v:"t0"}],n:50,r:"_card.expandable"}],f:[{t:8,r:"_card.contentP"}]}],n:50,r:"_card.contentP"}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-tab-wrapper",g:1},{t:4,f:[{n:"expand",t:72,v:"t0"}],n:50,r:"_card.expandable"}],f:[{t:8,r:"tab-bodies"}," ",{t:8,r:"tabs"}]}],n:50,x:{r:["_card.tabs","_card.section"],s:"_0&&!_1"}}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-footer",g:1},{t:4,f:[{t:8,r:"_card.footerA"}],n:50,r:"_card.footerA"},{t:4,f:[{n:"expand",t:72,v:"t0"}],n:50,r:"_card.expandable"}],f:[{t:8,r:"_card.footerP"}]}],n:50,r:"_card.footerP"}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-actions",g:1},{t:4,f:[{n:"expand",t:72,v:"t0"}],n:50,r:"_card.expandable"}],f:[{t:4,f:[{t:4,f:[{t:8,r:".P"}],n:50,r:".P"},{t:4,f:[{t:7,e:"button",m:[{t:8,x:{r:[".attrs"],s:"_0||[]"}}],f:[{t:8,r:".content"}]}],n:51,l:1}],n:52,r:"_card.actions"}]}],n:50,r:"_card.actions.length"}],n:50,x:{r:["_card.expanded"],s:"_0!==false"}}]}]}],e:{"\"flat\" in _0?_1:_2":function (_0,_1,_2){return("flat" in _0?_1:_2);},"\"flat\" in _0?!_1:!_2":function (_0,_1,_2){return("flat" in _0?!_1:!_2);},"_0&&_1===false":function (_0,_1){return(_0&&_1===false);},"_0||_1||_2||_3||_4||(_5&&typeof _5===\"string\"||(_6&&_7))":function (_0,_1,_2,_3,_4,_5,_6,_7){return(_0||_1||_2||_3||_4||(_5&&typeof _5==="string"||(_6&&_7)));},"[_0.expand()]":function (_0){return([_0.expand()]);},"_0&&_1":function (_0,_1){return(_0&&_1);},"_0!==false":function (_0){return(_0!==false);},"_0&&typeof _0===\"string\"":function (_0){return(_0&&typeof _0==="string");},"_0||_1":function (_0,_1){return(_0||_1);},"_0&&!_1":function (_0,_1){return(_0&&!_1);},"[false,false]":function (){return([false,false]);},"_0||[]":function (_0){return(_0||[]);},"_0===_1+_2||(!_0&&!_1&&!_2)":function (_0,_1,_2){return(_0===_1+_2||(!_0&&!_1&&!_2));},"_0!==_1+_2||(!_0&&_1+_2)":function (_0,_1,_2){return(_0!==_1+_2||(!_0&&_1+_2));},"_0===_1||(!_0&&!_1)":function (_0,_1){return(_0===_1||(!_0&&!_1));},"_0!==_1||(!_0&&_1)":function (_0,_1){return(_0!==_1||(!_0&&_1));},"[(_0).set(\"_card.selected\",_1+_2),_3.expand(true),false]":function (_0,_1,_2,_3){return([(_0).set("_card.selected",_1+_2),_3.expand(true),false]);},"[(_0).set(\"_card.selected\",_1),_2.expand(true),false]":function (_0,_1,_2){return([(_0).set("_card.selected",_1),_2.expand(true),false]);}},p:{"tab-body":[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-tab-content",g:1},{n:"class-rcard-content-selected",t:13,f:[{t:2,x:{r:["_card.selected","@index","_card.tabs.length"],s:"_0===_1+_2||(!_0&&!_1&&!_2)"}}]},{n:"class-rcard-content-not-selected",t:13,f:[{t:2,x:{r:["_card.selected","@index","_card.tabs.length"],s:"_0!==_1+_2||(!_0&&_1+_2)"}}]}],f:[{t:8,r:".content"}]}],"tab-bodies":[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-tab-window",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-tab-contents",g:1}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-tab-content",g:1},{n:"class-rcard-content-selected",t:13,f:[{t:2,x:{r:["_card.selected","@index"],s:"_0===_1||(!_0&&!_1)"}}]},{n:"class-rcard-content-not-selected",t:13,f:[{t:2,x:{r:["_card.selected","@index"],s:"_0!==_1||(!_0&&_1)"}}]}],f:[{t:8,r:".content",c:{r:"^^/"}}]}],n:52,r:"_card.tabs"}," ",{t:4,f:[{t:8,r:"_card.tablist.body"}],n:50,r:"_card.tablist"}]}]}],tab:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-tab",g:1},{n:"class-rcard-tab-selected",t:13,f:[{t:2,x:{r:["_card.selected","@index","_card.tabs.length"],s:"_0===_1+_2||(!_0&&!_1&&!_2)"}}]},{n:["click"],t:70,f:{r:["@context","_card.tabs.length","@index","_card"],s:"[(_0).set(\"_card.selected\",_1+_2),_3.expand(true),false]"}}],f:[{t:8,r:".title"}]}],tabs:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-tabs-window",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-tabs",g:1}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rcard-tab",g:1},{n:"class-rcard-tab-selected",t:13,f:[{t:2,x:{r:["_card.selected","@index"],s:"_0===_1||(!_0&&!_1)"}}]},{n:["click"],t:70,f:{r:["@context","@index","_card"],s:"[(_0).set(\"_card.selected\",_1),_2.expand(true),false]"}}],f:[{t:8,r:".title",c:{r:"^^/"}}]}],n:52,r:"_card.tabs"}," ",{t:4,f:[{t:8,r:"_card.tablist.tab"}],n:50,r:"_card.tablist"}]}]}]}};

  var Card = Ractive$1.macro(
    function (handle) {
      var callbacks = init(handle);
      handle.setTemplate(template);

      return Object.assign({}, callbacks, {
        update: function update() {
          updateAttrs(handle);
        },
        teardown: function teardown() {
          if (handle._link && typeof handle._link === 'string') { handle.unlink(handle._link); }
        }
      });
    }, {
      cssId: 'rm-card',
      css: function(data) { return [(function(data) {
     var primary = Object.assign({}, data('raui.primary'), data('raui.card.primary'));
     var header = Object.assign({}, primary, data('raui.card.primary.header'));
     var themes = (data('raui.themes') || []).slice();
     (data('raui.card.themes') || []).forEach(function (t) {
       if (!~themes.indexOf(t)) { themes.push(t); }
     });
     return "\n   .rcard-margin {\n     padding: 0.5em;\n     box-sizing: border-box;\n   }\n   .rcard-margin.rcard-wrapper-popout {\n     padding-top: 2.5em;\n   }\n   .rcard-no-fill {\n     height: auto;\n   }\n   .rcard {\n     position: relative;\n     display: flex;\n     flex-direction: column;\n     color: " + (primary.fg || '#222') + ";\n     background-color: " + (primary.bg || '#fff') + ";\n     border-radius: " + (primary.radius || '0.2em') + ";\n     transition-duration: " + (primary.duration || '0.2s') + ";\n     transition-timing-function: " + (primary.easing || 'ease-in-out') + ";\n     transition-property: box-shadow, border, background-color, color, margin, padding;\n     height: 100%;\n     box-sizing: border-box;\n   }\n \n   .rcard > div {\n     margin-top: 1em;\n   }\n   .rcard.rcard-with-header > div:first-of-type {\n     margin-top: 0;\n   }\n   .rcard > div:last-of-type {\n     margin-bottom: 1em;\n   }\n   .rcard.rcard-section.rcard-no-pad > div:last-of-type {\n     margin: 0;\n   }\n   .rcard > .rcard-actions:last-of-type {\n     margin-bottom: 0;\n   }\n   .rcard-section > .rcard-header:last-of-type {\n     margin-bottom: 0;\n   }\n \n   .rcard-section {\n     overflow: hidden;\n   }\n \n   .rcard-deep {\n     box-shadow: " + (primary.shadow || '0 1px 4px 0 rgba(0,0,0,0.14)') + ";\n     border: 1px solid " + (primary.bc || '#ccc') + ";\n   }\n   .rcard-flat {\n     border: 0.0625em solid " + (primary.bc || '#ccc') + ";\n     box-shadow: none;\n   }\n \n   .rcard-no-pad > .rcard-content {\n     padding: 0;\n   }\n \n   .rcard-content {\n     padding: 0 1em;\n   }\n \n   .rcard-header {\n     position: relative;\n     display: flex;\n     align-items: center;\n     transition-duration: " + (header.duration || '0.2s') + ";\n     transition-timing-function: " + (header.easing || 'ease-in-out') + ";\n     transition-property: color, background-color, padding, height;\n     min-height: 4em;\n     flex-wrap: wrap;\n   }\n \n   .rcard-section > .rcard-header {\n     background-color: " + (header.fga || '#07e') + ";\n     color: " + (header.bg || '#fff') + ";\n     min-height: 3em;\n   }\n \n   .rcard-section > .rcard-header:first-of-type {\n     padding: 0;" + (header.gradient ? ("\n     background: " + (header.gradient) + ";\n     color: " + (header.fg || '#222') + ";\n     border-bottom: 1px solid " + (header.bc || '#ccc') + ";") : '') + "\n   }\n \n   .rcard-avatar {\n     width: 3em;\n     height: 3em;\n     margin: 1em 0 0 1em;\n     transition-duration: " + (primary.duration || '0.2s') + ";\n     transition-timing-function: " + (primary.easing || 'ease-in-out') + ";\n     transition-property: width, height, bottom;\n   }\n \n   .rcard-avatar-inner {\n     height: 100%;\n     background-size: cover;\n     transition-duration: " + (primary.duration || '0.2s') + ";\n     transition-timing-function: " + (primary.easing || 'ease-in-out') + ";\n     transition-property: border-radius, box-shadow;\n   }\n \n   .rcard-avatar-round .rcard-avatar-inner {\n     border-radius: 100%;\n   }\n \n   .rcard-section > .rcard-header .rcard-avatar {\n     margin: 0.5em 0 0.5em 1em;\n   }\n \n   .rcard-section.rcard-popout {\n     overflow: visible;\n   }\n   .rcard-section.rcard-popout > .rcard-header {\n     border-radius: " + (primary.easing || '0.2em') + " " + (primary.radius || '0.2em') + " 0 0;\n   }\n   .rcard-popout > .rcard-header .rcard-avatar {\n     margin-top: -2em;\n     width: 6em;\n     height: 6em;\n   }\n   .rcard-popout.rcard-section > .rcard-header .rcard-avatar {\n     width: 3.75em;\n     height: 3.75em;\n     margin-top: -1.25em;\n   }\n   .rcard-popout.rcard-deep > .rcard-header .rcard-avatar-inner {\n     box-shadow: 0 2px 2px rgba(0, 0, 0, 0.24), 0 0 2px rgba(0, 0, 0, 0.12);\n   }\n \n   .rcard-titles {\n     flex-grow: 1;\n     display: flex;\n     flex-direction: column;\n     justify-content: center;\n     line-height: 1em;\n     transition-duration: " + (primary.duration || '0.2s') + ";\n     transition-timing-function: " + (primary.easing || 'ease-in-out') + ";\n     transition-property: margin;\n     margin: 1em 1em 0 1em;\n   }\n   .rcard-section > .rcard-header .rcard-titles.rcard-with-tabs {\n     flex-grow: 0;\n     margin-right: 3em;\n   }\n   .rcard-titles.rcard-shrink {\n     flex-grow: 0;\n   }\n \n   .rcard-with-sub {\n     justify-content: space-evenly;\n   }\n   .rcard-with-sub > .rcard-title {\n     font-size: 1.2em;\n   }\n \n   .rcard-title {\n     font-size: 1.5em;\n   }\n \n   .rcard-subtitle {\n     opacity: 0.7;\n     font-size: 1em;\n   }\n \n   .rcard-section > .rcard-header .rcard-titles {\n     line-height: 1.2em;\n     margin: 0.5em 1em 0.5em 1em;\n   }\n   .rcard-section > .rcard-header .rcard-with-sub {\n     line-height: 1em;\n   }\n   .rcard-section > .rcard-header .rcard-with-sub > .rcard-title {\n     font-size: 1.1em;\n   }\n   .rcard-section > .rcard-header .rcard-title {\n     font-size: 1.2em;\n   }\n \n   .rcard-title-right {\n     margin-top: 1em;\n     margin-left: auto;\n     margin-right: 1em;\n     cursor: default;\n   }\n   .rcard-section > .rcard-header .rcard-title-right {\n     margin-top: 0;\n   }\n \n   .rcard-expandable > .rcard-header:first-of-type {\n     transition-property: color, background-color, height;\n     padding-right: 2em;\n   }\n   .rcard-clickable {\n     cursor: pointer;\n   }\n   .rcard-header > .rcard-expand {\n     position: absolute;\n     height: 24px;\n     top: 1.7em;\n     right: 0.5em;\n     transition: transform 0.2s ease-in-out, top 0.2s ease-in-out;\n     z-index: 1;\n   }\n   .rcard-section > .rcard-header .rcard-expand {\n     top: 0.8em;\n   }\n   .rcard-expand.rcard-expanded {\n     transform: rotate(180deg);\n     transform-origin: center;\n   }\n   .rcard-expand svg {\n     width: 24px;\n     height: 24px;\n   }\n   .rcard-expand svg path {\n     fill: " + (header.fg || '#222') + ";\n     stroke: " + (header.fg || '#222') + ";\n   }\n   .rcard-section > .rcard-header .rcard-expand svg path {\n     fill: " + (header.bg || '#fff') + ";\n     stroke: " + (header.bg || '#fff') + ";\n   }\n \n   .rcard-popout.rcard-collapsed > .rcard-header .rcard-avatar {\n     bottom: 1em;\n   }\n   .rcard-popout.rcard-collapsed.rcard-section > .rcard-header .rcard-avatar {\n     bottom: 0.5em;\n   }\n \n   .rcard > div:first-of-type.rcard-image {\n     margin-top: 0;\n   }\n \n   .rcard-image {\n     margin-top: 1em;\n   }\n \n   .rcard-image > img {\n     width: 100%;\n   }\n \n   .rcard-tabs-window {\n     overflow: auto;\n   }\n   .rcard-section > .rcard-header .rcard-tabs-window {\n     align-self: flex-end;\n     flex-grow: 1;\n   }\n \n   .rcard-tabs {\n     display: flex;\n     border-top: 0.15em solid " + (primary.bga || '#f4f4f4') + ";\n   }\n \n   .rcard-tab {\n     box-sizing: border-box;\n     padding: 0.5em 1em;\n     height: 2.5em;\n     user-select: none;\n     opacity: 0.9;\n     cursor: pointer;\n     transition-duration: 0.2s;\n     transition-timing-function: ease-in-out;\n     transition-property: opacity, background-color, color, border-top, border-width;\n     border-top: 0.15em solid transparent;\n     margin-top: -0.15em;\n     white-space: nowrap;\n     border-top: 0.15em solid " + (primary.bga || '#f4f4f4') + ";\n   }\n   .rcard-tab:hover {\n     opacity: 1;\n   }\n \n   .rcard-tab.rcard-tab-selected {\n     border-top: 0.15em solid " + (primary.fga || '#07e') + ";\n     opacity: 1;\n     font-weight: 500;\n     cursor: default;\n   }\n \n   .rcard-section > .rcard-header .rcard-tabs {\n     margin-top: 0.5em;\n     border-top: 0;\n   }\n   .rcard-section > .rcard-header .rcard-tab {\n     margin-top: 0;\n     border-color: " + (header.gradient ? (primary.bc || '#ccc') : (primary.bg || '#fff')) + ";\n     border-style: solid;\n     border-width: 1px 1px 0 0;\n     color: " + (header.gradient ? (primary.fga || '#07e') : (header.bg || '#fff')) + ";\n   }\n   .rcard-section > .rcard-header .rcard-tab:first-of-type {\n     border-width: 1px 1px 0 1px;\n   }\n   .rcard-section > .rcard-header .rcard-tab-selected {\n     background-color: " + (primary.bg || '#fff') + ";\n     color: " + (primary.fg || '#222') + ";\n   }" + (header.gradient ? "\n   .rcard-section > .rcard-header .rcard-tabs-window {\n     margin-bottom: -1px;\n   }" : '') + "\n   \n \n   .rcard-tab-window {\n     overflow: hidden;\n     margin: 0.5em 1em;\n   }\n \n   .rcard-tab-contents {\n     width: 100%;\n     box-sizing: border-box;\n     position: relative;\n     display: flex;\n   }\n \n   .rcard-tab-content {\n     width: 0;\n     overflow: hidden;\n     box-sizing: border-box;\n     flex-shrink: 0;\n     flex-grow: 0;\n     opacity: 0;\n     transition: opacity 0.4s ease-in-out;\n   }\n   .rcard-content-selected {\n     width: 100%;\n     opacity: 1;\n     overflow: visible;\n   }\n   .rcard-content-not-selected {\n     height: 1px;\n   }\n \n   .rcard-actions {\n     padding: 0.5em;\n   }\n \n   .rcard > .rcard-actions:nth-of-type(n+1) {\n     margin-top: 0.5em;\n   }\n \n   .rcard-actions > button {\n     text-decoration: none;\n     text-align: center;\n     letter-spacing: 0.5px;\n     cursor: pointer;\n     user-select: none;\n     border: none;\n     border-radius: 2px;\n     padding: 0 2rem;\n     transition: 0.2s ease-in-out;\n     transition-property: box-shadow, opacity, background-color;\n     font-size: 1em;\n     line-height: 1.5em;\n     background-color: " + (primary.bg || '#fff') + ";\n     color: " + (primary.fg || '#222') + ";\n     vertical-align: middle;\n     min-height: 2.25em;\n     outline: 0;\n     margin: 0.25em;\n     position: relative;\n     overflow: hidden;\n     font-weight: 500;\n     -webkit-tap-highlight-color: transparent;\n     box-shadow: none;\n   }\n \n   .rcard-actions > button[disabled], .btn.disabled {\n     opacity: 0.7;\n     cursor: not-allowed;\n   }\n \n   .rcard-actions > button[disabled]:hover {\n     opacity: 0.7;\n   }\n \n   .rcard-actions > button.flat:hover {\n     box-shadow: none;\n   }\n \n   .rcard-actions > button:after {\n     content: ' ';\n     position: absolute;\n     top: 0;\n     left: 0;\n     height: 100%;\n     width: 100%;\n     background: radial-gradient(circle, rgba(0, 0, 0, 0.2) 1.5em, transparent 1.6em);\n     opacity: 0;\n     transform: scale(5, 5);\n     transition: opacity 0.6s ease-out, transform 0.5s ease-in;\n   }\n \n   .rcard-actions > button:before {\n     content: ' ';\n     position: absolute;\n     height: 100%;\n     width: 100%;\n     background-color: rgba(0, 0, 0, 0.075);\n     opacity: 0;\n     top: 0;\n     left: 0;\n     transition: opacity 0.4s ease-in-out;\n   }\n \n   .rcard-actions > button:focus:before {\n     opacity: 1;\n   }\n   .rcard-actions > button:hover:before {\n     opacity: 0.5;\n   }\n   \n   .rcard-actions > button:active:after {\n     transform: scale(1, 1);\n     opacity: 1;\n     transition: none;\n   }\n   " + themes.map(function (t) {
       var theme = Object.assign({}, data('raui.primary'), data('raui.card.primary'), data(("raui." + t)), data(("raui.card." + t)));
       var header = Object.assign({}, theme, data('raui.card.primary.header'), data(("raui.card." + t + ".header")));
       return ("\n   ." + t + ".rcard {\n     color: " + (theme.fg || '#222') + ";\n     background-color: " + (theme.bg || '#fff') + ";\n     border-radius: " + (theme.radius || '0.2em') + ";\n   }\n   ." + t + ".rcard-deep {\n     box-shadow: " + (primary.shadow || '0 1px 4px 0 rgba(0,0,0,0.14)') + ";\n     border: 1px solid " + (primary.bc || '#ccc') + ";\n   }\n   ." + t + ".rcard-flat {\n     border: 0.0625em solid " + (primary.bc || '#ccc') + ";\n   }\n \n   ." + t + ".rcard-section > .rcard-header {\n     background-color: " + (header.fga || '#07e') + ";\n     color: " + (header.bg || '#fff') + ";\n   }\n \n   ." + t + ".rcard-section > .rcard-header:first-of-type {\n     padding: " + (header.padding || '0.5em 1em') + ";" + (header.gradient ? ("\n     background: " + (header.gradient) + ";\n     color: " + (header.fg || '#222') + ";\n     border-bottom: 1px solid " + (header.bc || '#ccc') + ";") : '') + "\n   }" + (header.gradient ? ("\n   " + t + ".rcard-section > .rcard-header .rcard-tabs {\n     margin-bottom: -1px;\n   }") : '') + "\n \n   ." + t + " > .rcard-header.rcard-expand svg path {\n     fill: " + (header.fg || '#222') + ";\n     stroke: " + (header.fg || '#222') + ";\n   }\n   ." + t + ".rcard-section > .rcard-header .rcard-expand svg path {\n     fill: " + (header.bg || '#fff') + ";\n     stroke: " + (header.bg || '#fff') + ";\n   }\n   ." + t + " > .rcard-actions > button {\n     background-color: " + (primary.bg || '#fff') + ";\n     color: " + (primary.fg || '#222') + ";\n   }\n     ");
     }).join('');
  }).call(this, data)].join(' '); },
      noCssTransform: true,
      attributes: ['title', 'subtitle', 'image', 'avatar', 'avatar-round', 'no-pad', 'image-alt', 'section', 'flat', 'popout', 'margin', 'expandable', 'expanded', 'no-arrow']
    }
  );

  function init(h) {
    var data = h.get('@local');
    h.aliasLocal('_card');

    h.set('_card.expand', function(set) {
      if (!h.get('_card.expandable')) { return h.set('_card.expanded', true); }
      var expanded = h.get('_card.expanded');
      if (set !== undefined && set === !!expanded) { return; }
      var ctx = h.ractive.getContext(h.find('.rcard-wrapper'));
      var ok = ctx.raise('expanded', {}, !expanded);

      if (ok === false) { h.set('_card.expanded', !!expanded); }
      else { h.set('_card.expanded', !expanded); }
    });

    updateAttrs(h);
    
    var tpl = h.partials.content;
    var content = [];
    h.partials.tabs = template.p.tabs;
    h.partials['tab-bodies'] = template.p['tab-bodies'];
    h.partials.tab = template.p.tab;
    h.partials['tab-body'] = template.p['tab-body'];

    tpl.forEach(function (n) {
      if (n.e === 'title') {
        data.titleA = n.m;
        data.titleP = n.f.filter(function (e) { return e.e !== 'right'; });
        var right = n.f.find(function (e) { return e.e === 'right'; });
        if (right) { data.titleRightP = right.f; }
      }
      else if (n.e === 'subtitle') {
        data.subtitleA = n.m;
        data.subtitleP = n.f;
      }
      else if (n.e === 'avatar') {
        var img;
        if (n.m) {
          data.avatarA = n.m.filter(function (a) { return a.n !== 'round' && a.n !== 'image' && a.n !== 'popout'; });
          var a;
          if (a = n.m.find(function (a) { return a.n === 'round'; })) {
            if (a.f === 0) { data.avatarA.push({ t: 13, g: 1, n: 'class', f: 'rcard-avatar-round' }); }
            else { data.avatarA.push({ t: 13, n: 'class-rcard-avatar-round', f: a.f }); }
          }
          if (a = n.m.find(function (a) { return a.n === 'image'; })) { img = a.f; }
        }

        if (img) {
          data.avatarP = [{ t: 7, e: 'div', m: [{ t: 13, n: 'class',f: 'rcard-avatar-inner', g: 1 }, { n: 'style-background-image', f: [ 'url(' ].concat( img, [')'] ), t: 13 }] }];
          if (img.length === 1 && img[0].t === 2) { data.avatarP = [Object.assign({}, img[0], { t: 4, n: 50, f: data.avatarP })]; }
        } else if (n.f && n.f.length) {
          data.avatarP = n.f;
        }
      }
      else if (n.e === 'footer') {
        data.footerA = n.m;
        data.footerP = n.f;
      }
      else if (n.e === 'action') {
        (data.actions || (data.actions = [])).push({
          attrs: n.m,
          content: n.f
        });
      }
      else if (n.t === 4 && n.n === 50 && n.f && n.f.filter(function (n) { return typeof n !== 'string'; }).length === 1 && n.f.find(function (e) { return e.e === 'action'; })) { // if action
        var section = Object.assign({}, n);
        var b = section.f.find(function (e) { return e.e === 'action'; });
        section.f = [{ t: 7, e: 'button', m: b.m, f: b.f }];
        (data.actions || (data.actions = [])).push({ P: [section] });
      }
      else if (n.e === 'tabs') {
        var tabs = data.tabs = [];
        if (Array.isArray(n.f)) {
          n.f.forEach(function (e) {
            if (e.e === 'tab') {
              var tab = { content: e.f };
              tabs.push(tab);
              if (!Array.isArray(tab.content)) { tab.content = [tab.content]; }
              var attrs = e.m || [];
              var attr = attrs.find(function (a) { return a.n === 'title'; }) || tab.content.find(function (e) { return e.e === 'title'; });
              if (attr) { tab.title = attr.f; }
              if (!Array.isArray(tab.title)) { tab.title = [tab.title]; }
            }
          });
        }
      }
      else if (n.e === 'tablist') {
        var tablist = { tab: [], body: [] };
        var items = n.m.find(function (a) { return a.n === 'items'; });
        var condition = n.m.find(function (a) { return a.n === 'condition'; });
        if (typeof items.f === 'string') {
          tablist.items = items.f;
          tablist.tab.push({ t: 4, n: 52, r: items.f, f: [] });
          tablist.body.push({ t: 4, n: 52, r: items.f, f: [] });
          var e = n.f.find(function (e) { return e.e === 'title'; }) || n.m.find(function (a) { return a.n === 'title'; });
          if (e && e.f) { tablist.tab[0].f = [Object.assign({}, template.p.tab[0], { f: e.f })]; }
          e = n.f.find(function (e) { return e.e === 'tab'; });
          if (e && e.f) { tablist.body[0].f = [Object.assign({}, template.p['tab-body'][0], { f: e.f })]; }
          data.tablist = tablist;
          if (!data.tabs) { data.tabs = []; }
          if (condition && condition.f && condition.f[0] && condition.f[0].t === 2) {
            tablist.tab[0].f = [Object.assign({}, condition.f[0], { t: 4, n: 50, f: tablist.tab[0].f })];
            tablist.body[0].f = [Object.assign({}, condition.f[0], { t: 4, n: 50, f: tablist.body[0].f }), { t: 4, n: 51, l: 1, f: [Object.assign({}, template.p['tab-body'][0])] }];
          }
        }
      }
      else { content.push(n); }
    });

    if (data.tablist || data.tabs) {
      data._observer = h.observe(("_card.tabs.length " + (data.tablist ? ((data.tablist.items) + ".length ") : '') + "_card.selected"), function () {
        var len = data.tabs.length + ((data.tablist ? h.get(((data.tablist.items) + ".length")) : 0) || 0);
        var tab = h.get('_card.selected');
        var tabs = Ractive$1.getContext(h.find('.rcard-header')).findAll('.rcard-tab') || [];
        var ctxs = tabs.map(function (e) { return h.ractive.getContext(e); });
        if (tab >= len && ctxs.length) {
          setTimeout(function () { return h.set('_card.selected', ctxs[ctxs.length - 1].get('@index')); });
        } else if (len > 0 && tab < 0) {
          var idx = ctxs.length ? ctxs[0].get('@index') : 0;
          setTimeout(function () { return h.set('_card.selected', idx); });
        }
        var sel = ctxs.find(function (c) { return c.get('@index') == tab; });
        if (!sel && ctxs.length) { setTimeout(function () { return h.set('_card.selected', ctxs[0].get('@index')); }); }
      }, { init: false, defer: true });
    }

    data.contentP = content;

    h.select = function (idx) { return h.set('_card.selected', idx); };

    return {
      render: function render() {
        setTimeout(function () { return h.select(-1); });
      },
      unrender: function unrender() {
        if (data._observer) { data._observer.cancel(); }
        if (h.get('_card.expandLinked')) { h.unlink('_card.expandLinked'); }
      }
    };
  }

  var keys = ['title', 'subtitle', 'image', 'section', 'flat', 'popout', 'margin', 'expandable'];
  function updateAttrs(h) {
    keys.forEach(function (k) { return k in h.attributes && h.set(("@local." + k), h.attributes[k]); });
    'avatar-round' in h.attributes && h.set('@local.round', h.attributes['avatar-round']);
    'avatar' in h.attributes && h.set('@local.avatar', h.attributes.avatar || h.attributes['avatar-image']);
    'image-alt' in h.attributes && h.set('@local.alt', h.attributes['image-alt']);
    'no-pad' in h.attributes && h.set('@local.noPad', h.attributes['no-pad']);
    'no-fill' in h.attributes && h.set('@local.noFill', h.attributes['no-fill']);
    h.set('@local.arrow', !h.attributes['no-arrow']);
    if ('expanded' in h.attributes && h._link !== h.attributes.expanded) {
      if (h._link && typeof h._link === 'string') { h.unlink(h._link); }
      h._link = h.attributes.expanded;
      if (h._link && typeof h._link === 'string') {
        h.link(h._link, '_card.expanded');
        h.set('_card.expandLinked', true);
      } else {
        h.set({
          '_card.expanded': h.attributes.expanded,
          '_card.expandLinked': false
        });
      }
    } else {
      h.set('_card.expandLinked', true);
    }
  }

  function plugin$1(opts) {
    if ( opts === void 0 ) opts = {};

    return function(ref) {
      var instance = ref.instance;

      if (!instance.transitions.expand) { instance.transitions.expand = expand; }
      instance.partials[opts.name || 'card'] = Card;
    };
  }

  globalRegister('RauiCard', 'partials', Card);

  exports.Card = Card;
  exports.plugin = plugin$1;
  exports.default = plugin$1;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
