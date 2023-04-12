(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.RauiButton = {})));
}(this, (function (exports) { 'use strict';

  function button(data) {
    var primary = Object.assign({}, data('raui.primary'), data('raui.button.primary'), { disabled: Object.assign({}, data('raui.primary.disabled'), data('raui.button.primary.disabled')) });
    var themes = (data('raui.themes') || []).slice();
    (data('raui.button.themes') || []).forEach(function (t) {
      if (!~themes.indexOf(t)) { themes.push(t); }
    });

    return "\n    button, .btn {\n      text-decoration: none;\n      text-align: center;\n      letter-spacing: 0.5px;\n      cursor: pointer;\n      user-select: none;\n      border: none;\n      border-radius: " + (primary.radius || '0.2em') + ";\n      padding: 0 1.25rem;\n      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),\n        0 1px 5px 0 rgba(0, 0, 0, 0.12),\n        0 3px 1px -2px rgba(0, 0, 0, 0.2);\n      transition: 0.2s ease-in-out;\n      transition-property: box-shadow, opacity, background-color;\n      font-size: 1em;\n      line-height: 1.5em;\n      background-color: " + (primary.fga || '#07e') + ";\n      color: " + (primary.bg || '#fff') + ";\n      vertical-align: middle;\n      min-height: 2.25em;\n      outline: 0;\n      margin: 0.25em;\n      position: relative;\n      overflow: hidden;\n      -webkit-tap-highlight-color: transparent;\n      font-family: inherit;\n    }\n    button.alt, .btn.alt {\n      background-color: " + (primary.fg || '#222') + ";\n    }\n\n    button[disabled], .btn.disabled {\n      opacity: 0.7;\n      cursor: not-allowed;\n    }\n\n    button.round {\n      width: 2.2em;\n      height: 2.2em;\n      border-radius: 100%;\n      line-height: 2.2em;\n      text-align: center;\n      padding: 0;\n    }\n\n    button.flat, .btn.flat {\n      background-color: transparent;\n      color: " + (primary.fg || '#222') + ";\n      box-shadow: none;\n    }\n    button.flat.alt, .btn.flat.alt {\n      color: " + (primary.fga || '#07e') + ";\n    }\n\n    button:hover, .btn:hover {\n      opacity: 0.9;\n      box-shadow: 0 3px 3px 0 rgba(0,0,0,0.14),\n      0 1px 7px 0 rgba(0,0,0,0.12),\n      0 3px 1px -1px rgba(0,0,0,0.2);\n    }\n\n    button[disabled]:hover, .btn.disabled:hover {\n      opacity: 0.7;\n    }\n\n    button.flat:hover, .btn.flat:hover {\n      box-shadow: none;\n    }\n\n    button:after {\n      content: ' ';\n      position: absolute;\n      top: 0;\n      left: 0;\n      height: 100%;\n      width: 100%;\n      background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 2em, transparent 2.1em);\n      opacity: 0;\n      transform: scale(5, 5);\n      transition: opacity 1s ease-out, transform 0.5s ease-in;\n    }\n\n    button.flat:after {\n      background: radial-gradient(circle, rgba(0, 0, 0, 0.2) 1.5em, transparent 1.6em);\n    }\n\n    button.round:after {\n      background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0.75em, transparent 0.76em);\n    }\n\n    button.round.flat:after {\n      background: radial-gradient(circle, rgba(0, 0, 0, 0.2) 0.75em, transparent 0.76em);\n    }\n\n    button:before {\n      content: ' ';\n      position: absolute;\n      height: 100%;\n      width: 100%;\n      background-color: rgba(0, 0, 0, 0.075);\n      opacity: 0;\n      top: 0;\n      left: 0;\n      transition: opacity 0.4s ease-in-out;\n    }\n    button:focus:before {\n      opacity: 1;\n    }\n    button.flat:hover:before {\n      opacity: 0.5;\n    }\n    \n    button:active:after {\n      transform: scale(1, 1);\n      opacity: 1;\n      transition: none;\n    }\n  " + themes.map(function (t) {
      var theme = Object.assign({}, primary, data(("raui." + t)), data(("raui.button." + t)), { disabled: Object.assign({}, primary.disabled, data(("raui." + t + ".disabled")), data(("raui.button." + t + ".disabled")))});
      return (".btn." + t + ", button." + t + " {\n      background-color: " + (theme.fga || '#07e') + ";\n      color: " + (theme.bg || '#fff') + ";\n    }\n    button." + t + ".alt, .btn." + t + ".alt {\n      background-color: " + (theme.fg || '#222') + ";\n    }\n    .btn.flat." + t + ", button.flat." + t + " {\n      background-color: " + (theme.bg || '#fff') + ";\n      color: " + (theme.fg || '#222') + ";\n    }\n    button.flat." + t + ".alt, .btn.flat." + t + ".alt {\n      color: " + (theme.fga || '#07e') + ";\n    }\n    ");
    }).join('');
  }

  function plugin() {
    return function(ref) {
      var instance = ref.instance;
      var Ractive = ref.Ractive;

      if (instance === Ractive || Ractive.isInstance(instance)) {
        Ractive.addCSS('raui-button', button);
      } else {
        var css = instance.css;
        instance.css = function(data) {
          var res = typeof css === 'string' ? css : typeof css === 'function' ? css(data) : '';
          return res + button(data);
        };
      }
    };
  }

  exports.button = button;
  exports.plugin = plugin;
  exports.default = plugin;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
