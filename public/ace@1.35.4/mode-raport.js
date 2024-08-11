define("ace/mode/raport_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module){
        "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var binopsRE = '(\\*\\*|[\\+\\-\\*\\%]|\\/%?|<=?|>=?|==?=?|!==?|\\|\\||\\?\\?|\\&\\&|gte?|lte?|in|like|ilike|not-in|not-like|not-ilike|contains|does-not-contain|is-not|is|strict-is-not|deep-is-not|deep-is|and|or)';
    var unopsRE = '(not|\\+|-)';

    var RaportHighlightRules = function() {
        var keywordControl = "";
        var constantLanguage = "null|undefined|true|false";

        var keywordMapper = this.createKeywordMapper({
            "keyword.control": keywordControl,
            "constant.language": constantLanguage,
        }, "identifier", true);

        // regexp must not have capturing parentheses. Use (?:) instead.
        // regexps are ordered -> the first match is used

        this.$rules = {
            "start": [
                {
                    regex: "[{}]", onMatch: function(val, state, stack) {
                        this.next = val == "{" ? this.nextState : "";
                        if (val == "{" && stack.length) {
                            stack.unshift("start", state);
                        }
                        else if (val == "}" && stack.length) {
                            stack.shift();
                            this.next = stack.shift();
                            if (this.next.indexOf("string") != -1)
                                return "paren.quasi.end";
                        }
                        return val == "{" ? "paren.lparen" : "paren.rparen";
                    },
                    nextState: 'start',
                },
                'qstring',
                'bqstring',
                'comment',
                'sstring',
                'qqstring',
                'schema',
                'binops',
                'unops',
                {
                    token: "keyword.operator",
                    regex: /(?:\s|^)(=>)/
                },
                {
                    token: "paren.lparen",
                    regex: /\[|\(/
                },
                {
                    token: "paren.rparen",
                    regex: /\]|\)/
                },
                {
                    token: 'constant.other',
                    regex: /#([^#\r\n]+)#/,
                },
                'key',
                {
                    token: ['keyword.operator', 'entity.name.function'],
                    regex: /(#)([a-zA-Z][-a-zA-Z0-9]*)/
                },
                'lnumber',
                'keywords',
                {
                    token: 'entity.function.name',
                    regex: `(?:[a-zA-z_][-a-zA-Z0-9_]*)(?=\\()|(?<=\\()(?:[a-zA-z_][-a-zA-Z0-9_]*|${binopsRE}|${unopsRE})(?=\\s)`
                },
                {
                    token: 'identifer',
                    regex: /((?:[\!*\~\@]|\^+)[a-zA-Z_$][-.a-zA-Z0-9_$]*)/,
                    onMatch: function(val) {
                        if (val[0] === '!') return 'support.variable';
                        else if (val[0] === '*') return 'support.class';
                        else if (val[0] === '~') return 'support.function';
                        else if (val[0] === '^') return 'support.constant';
                        else if (val[0] === '@') return 'support.type';
                        return 'identifier';
                    }
                },
                {
                    token : keywordMapper,
                    regex : "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
                },
                {
                    defaultToken: 'identifier'
                },
            ],
            keywords: {
                token: 'keyword.control',
                regex: /(?<=\s|^)(let|set|if|unless|case|elif|elsif|elseif|else|esac|end|fi|when|then)(?=\s|$)/,
            },
            qstring: {
                token : "string.quasi.start",
                regex : /'/,
                push  : [{
                    token : "constant.language.escape",
                    regex : /\\(?:[u]\d{4})|\\(?:[x][a-zA-Z0-9]{2})|\\\$?{|\\./
                }, {
                    token : "paren.quasi.start",
                    regex : /(\$?{)/,
                    push  : "start"
                }, {
                    token : "string.quasi.end",
                    regex : /'/,
                    next  : "pop"
                }, {
                    defaultToken: "string.quasi"
                }]
            },
            bqstring: {
                token : "string.quasi.start",
                regex : /`/,
                push  : [{
                    token : "constant.language.escape",
                    regex : /(\\(?:[uU]\d{3,5})|\\.)/
                }, {
                    token : "paren.quasi.start",
                    regex : /(\${)/,
                    push  : "start"
                }, {
                    token : "string.quasi.end",
                    regex : /`/,
                    next  : "pop"
                }, {
                    defaultToken: "string.quasi"
                }]
            },
            comment: {
                token : "comment",
                regex : /\/\/.*$/
            },
            key: {
                token: 'meta.tag.attribute-name',
                regex: /\b([-a-zA-Z0-9_]+\:)/
            },
            lnumber: {
                token : "constant.numeric", // float
                regex : "[+-]?\\d[\\d_]*(?:(?:\\.\\d[\\d_]*)?(?:[eE][+-]?\\d+)?)?\\b"
            },
            sstring: {
                token : "string",
                regex : /(?!\s|!^)(:[^ \r\n\t()\:{}\[\]<>,"\'`\\;&#]+)/
            },
            qqstring: {
                token: 'string',
                regex: '"',
                next: [{
                    token : "constant.language.escape",
                    regex : /\\(?:[u]\d{4})|\\(?:[x][a-zA-Z0-9]{2})|\\./,
                }, {
                    token : "string",
                    regex : "\\\"",
                    next: 'start',
                }, {
                    defaultToken: "string"
                }],
            },
            constants: {
                token: 'constant.language',
                regex: /true|false|null|undefined/,
            },
            schema: {
              token: 'keyword.operator',
              regex: /(\@\[)/,
              push: [{
                  token: 'keyword.operator',
                  regex: /type|=>?|\||\[\]|\<|\>/,
              }, {
                 token: 'keyword.operator',
                 regex: /\]/,
                 onMatch: function(val, state, stack) {
                     if (!stack.opens) {
                         if (stack.length) {
                             this.next = 'pop';
                             stack.shift();
                         } else {
                             this.next = 'start'
                         }
                     } else {
                         stack.opens--;
                         this.next = undefined;
                     }
                     return this.token;
                 },
                 next: 'pop',
              },
              'binops',
              'lnumber',
              'sstring',
              'key',
              'qstring',
              'bqstring',
              {
                  token: 'constant.language',
                  regex: /Array|string|date|number|boolean|any/,
              }, {
                  token: 'keyword.operator',
                  regex: /\[/,
                  onMatch: function(val, state, stack) {
                      if (!('opens' in stack)) stack.opens = 1;
                      else stack.opens++;
                      return this.token;
                  },
              }, {
                  defaultToken: 'storage.type',
              }],
            },
            binops: {
                token : "keyword.operator",
                regex : `(?:\\s)${binopsRE}(?:\\s)`
            },
            unops: {
                token: 'keyword.operator',
                regex: /(?<=\s|^)(not |\+|-)/
            }
        };

        this.normalizeRules();
    };

    oop.inherits(RaportHighlightRules, TextHighlightRules);

    exports.RaportHighlightRules = RaportHighlightRules;

});

define("ace/mode/raport",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/raport_highlight_rules"], function(require, exports, module){
    "use strict";
    var oop = require("../lib/oop");
    var TextMode = require("./text").Mode;
    var RaportHighlightRules = require("./raport_highlight_rules").RaportHighlightRules;
    var Mode = function () {
        this.HighlightRules = RaportHighlightRules;
        this.$behaviour = this.$defaultBehaviour;
    };
    oop.inherits(Mode, TextMode);
    (function () {
        this.lineCommentStart = "//";
        this.$id = "ace/mode/raport";
    }).call(Mode.prototype);
    exports.Mode = Mode;
});

(function() {
    window.require(["ace/mode/raport"], function(m) {
        if (typeof module == "object" && typeof exports == "object" && module) {
            module.exports = m;
        }
    });
})();
