/*
Language: Raport
Description: Raport is a browser reporting library with a built-in expression language.
Author: Chris Reeves <evschris@gmail.com>
Website: https://github.com/evs-chris/raport
Category: reports
*/

function def(hljs) {
	const IDENT = '[^\\s(){}\\[\\]\\\\<>:"\'`;&#.+\\/*|^%=!?]+'
  const NUMBER = {
    className: 'number',
    match: /[-]?[0-9_]+(\.[0-9_]+)?([eE][0-9_]+)?/,
  };
  const BUILT_INS = [
    '!=', '!==', '%', '&&', '*', '**', '+', '-', '/', '/%', '<', '<=', '==', '===', '>', '>=', '??', 'abs', 'add', 'and', 'array', 'avg', 'block', 'case', 'cat', 'ceil', 'clamp', 'coalesce', 'coalesce-truth', 'contains', 'count', 'date', 'deep-is', 'deep-is-not', 'detect-delimeters', 'diff', 'divide', 'does-not-contain', 'each', 'eval', 'filter', 'find', 'first', 'flatten', 'floor', 'fmt', 'format', 'generate', 'get', 'group', 'gt', 'gte', 'if', 'ilike', 'in', 'index', 'inspect', 'intdiv', 'intersect', 'interval', 'is', 'is-not', 'join', 'keys', 'label-diff', 'last', 'len', 'length', 'let', 'like', 'lower', 'lt', 'lte', 'map', 'max', 'min', 'modulus', 'multiply', 'not', 'not-ilike', 'not-in', 'not-like', 'nth', 'num', 'object', 'or', 'overlap', 'pad', 'padl', 'padr', 'parse', 'patch', 'pipe', 'pow', 'rand', 'random', 'reduce', 'replace', 'replace-all', 'reverse', 'round', 'set', 'set-defaults', 'similar', 'similarity', 'slice', 'sort', 'source', 'split', 'strict-is', 'strict-is-not', 'string', 'substr', 'subtract', 'sum', 'switch', 'time-span', 'time-span-ms', 'trim', 'triml', 'trimr', 'unique', 'unique-map', 'unless', 'unparse', 'upper', 'valid', 'validate', 'values', 'with', 'wrap-count', '||',
    '=>', '=',
  ];
  const LITERALS = [
    'true',
    'false',
    'null',
    'undefined',
  ];
  const KEYWORDS = [
    'if',
    'else',
    'elseif',
    'elsif',
    'elif',
    'unless',
    'end',
    'fi',
    'then',
    'let',
    'set',
    'case',
    'when',
    'esac',
  ];
  const BINOPS = {

  }
  const COMMENT = {
  	className: 'comment',
  	variants: [
  		hljs.C_LINE_COMMENT_MODE,
  	],
  };
  const ARRAY = {
    className: 'variable.constant',
    begin: /\[/,
    end: /\]/,
    contains: [],
  };
  const OBJECT = {
    className: 'variable.constant',
    begin: /\{/,
    end: /\}/,
    relevance: 0,
    contains: [{
      className: 'symbol',
      match: IDENT + '\\s*:',
    }],
  };
  const REFERENCE = { // include prefixes
  };
  const SCHEMA = {
    className: 'meta',
    begin: /\@\[/,
    end: /\]/,
  };
  const FORMAT = {
    className: 'title.function.invoke',
    match: '\\#' + IDENT,
  };
  const DATE = {
    className: 'variable.constant',
    begin: /\s\#/,
    end: /\#/,
  };
  const SYMBOL = {
    className: 'string',
    match: /:[^\s\(\)\{\}\[\]\\\<\>\:"'`;\&\#]+/,
  };
  const DOUBLE_STRING = {
    className: 'string',
    contains: [
      hljs.BACKSLASH_ESCAPE,
    ],
    variants: [{
      begin: '"""',
      end: '"""',
      relevance: 10,
    }, {
      begin: '"',
      end: '"',
      relevance: 0,
    }],
  };
  const STRING_INTERP = {
    className: 'subst',
    begin: /\$?\{/,
    end: /\}/,
    contains: [],
    relevance: 1,
  }
  const SINGLE_STRING = {
    className: 'string',
    contains: [
      STRING_INTERP,
      hljs.BACKSLASH_ESCAPE,
    ],
    variants: [{
      begin: "'''",
      end: "'''",
      relevance: 10,
    }, {
      begin: "'",
      end: "'",
      relevance: 0,
    }, {
      begin: "```",
      end: "```",
      relevance: 10,
    }, {
      begin: "`",
      end: "`",
      relevance: 0,
    }],
  };
  const TPL_INTERP = {
    className: 'subst',
    begin: /\{\{/,
    end: /\}\}/,
    contains: [],
    relevance: 1,
  };
  const TEMPLATE = {
    className: 'code',
    begin: /\$\$\$/,
    end: /\$\$\$/,
    contains: [
      TPL_INTERP,
    ],
  };
  const APPLICATION_ARGS = {
    className: 'params',
    begin: /\|/,
    end: /\|/,
  };

  const hl = {
    name: 'Raport',
    case_insensitive: false,
    keywords: {
    	$pattern: IDENT,
      keyword: KEYWORDS,
      operator: BUILT_INS.filter(o => !KEYWORDS.includes(o)),
      literal: LITERALS
    },
    contains: [
      NUMBER,
      SYMBOL,
      DATE,
      FORMAT,
      DOUBLE_STRING,
      SINGLE_STRING,
      TEMPLATE,
      SCHEMA,
      OBJECT,
      ARRAY,
      APPLICATION_ARGS,
      COMMENT,
    ]
  };

  STRING_INTERP.contains.push.apply(STRING_INTERP.contains, hl.contains);
  STRING_INTERP.keywords = hl.keywords;
  TPL_INTERP.contains.push.apply(TPL_INTERP.contains, hl.contains);
  TPL_INTERP.keywords = hl.keywords;
  ARRAY.contains.push.apply(ARRAY.contains, hl.contains);
  ARRAY.keywords = hl.keywords;
  OBJECT.contains.push.apply(OBJECT.contains, hl.contains);
  OBJECT.keywords = hl.keywords;

  return hl;
}
hljs.registerLanguage("raport", def);
