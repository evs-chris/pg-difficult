(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.RauiAceEditor = {})));
}(this, (function (exports) { 'use strict';

  function makeAceEditor(opts) {
    if ( opts === void 0 ) opts = {};

    var Ace = opts.ace;
    if (!Ace) { Ace = window.ace; }
    if (!Ace) { throw new Error('Ace must be passed in or available globally.'); }

    function aceEditor(node, options) {
      if ( options === void 0 ) options = {};

      var handle = {};

      var ctx = Ractive.getContext(node);
      var editor = handle.editor = Ace.edit(node);
      editor.$blockScrolling = Infinity;
      var session = editor.getSession();

      if (!node.classList.contains('ace-editor')) { node.classList.add('ace-editor'); }

      var binding;
      var observer;
      var lock = false;

      session.setUseSoftTabs(false);
      session.setTabSize(2);

      editor.on('change', function() {
        if (lock) { return; }
        lock = true;
        if (binding) { ctx.set(binding, editor.getValue()); }
        if (ctx.hasListener('change')) {
          ctx.raise('change');
        }
        lock = false;
      });
      function observed(value) {
        if (lock) { return; }
        lock = true;
        var pos = editor.getCursorPosition();
        editor.setValue(value || '', -1);
        editor.clearSelection();
        editor.moveCursorTo(pos.row, pos.column, false);
        lock = false;
      }

      handle.update = function(options) {
        if (!options) { return; }
        if (options.syntax) { editor.getSession().setMode('ace/mode/' + options.syntax); }
        if (options.theme) { editor.setTheme('ace/theme/' + options.theme); }
        session.setTabSize(options.tabSize || 2);
        if (typeof options.softTabs === 'boolean') session.setUseSoftTabs(options.softTabs);
        if (typeof options.margin === 'boolean') { editor.setShowPrintMargin(options.margin); }
        if (typeof options.wrap === 'boolean') { session.setUseWrapMode(options.wrap); }
        if (typeof options.highlightActive === 'boolean') { editor.setHighlightActiveLine(options.highlightActive); }
        if (typeof options.highlightSelected === 'boolean') { editor.setHighlightSelectedWord(options.highlightSelected); }
        if (options.font) editor.setOptions({ fontFamily: options.font });
        if (options.fontSize) editor.setOptions({ fontSize: options.fontSize });
        if ('printMargin' in options) editor.setOption('showPrintMargin', options.printMargin);
        if (typeof options.lineNumbers === 'boolean') editor.setOption('showLineNumbers', options.lineNumbers);
        if (typeof options.relativeLineNumbers === 'boolean') editor.setOption('relativeLineNumbers', options.relativeLineNumbers);

        if ('keymode' in options && options.keymode) { editor.setKeyboardHandler(`ace/keyboard/${options.keymode}`); }
        else { editor.setKeyboardHandler(null); }

        if (options.bind !== binding) {
          if (observer) { observer.cancel(); }
          if (options.bind) {
            binding = options.bind;
            observer = ctx.observe(binding, observed, { init: false });
          }
        }
      };

      handle.editor = editor;

      handle.resize = function() {
        editor && editor.resize();
      };

      handle.focus = function() {
        editor.focus();
      };

      var listener = ctx.get('@.root').on('*.resize', handle.resize);
      window.addEventListener('resize', handle.resize);

      handle.teardown = function() {
        editor.off('change');
        editor.destroy();
        listener.cancel();
        window.removeEventListener('resize', handle.resize);
        node.classList.remove('ace-editor');
      };

      handle.update(options);
      if (options.bind) { setTimeout(function() { observed(ctx.get(options.bind)); }); }

      return handle;
    }
    function plugin(ref) {
      var instance = ref.instance;

      instance.decorators[opts.name || 'ace-editor'] = aceEditor;
    }

    plugin.plugin = plugin;
    plugin.aceEditor = aceEditor;

    return plugin;
  }

  exports.default = makeAceEditor;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
