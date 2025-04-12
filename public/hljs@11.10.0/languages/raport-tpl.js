function def(hljs) {
  return {
    name: 'raport-tpl',
    contains: [{
      begin: /{{/,
      beginScope: 'string',
      end: /}}/,
      endScope: 'string',
      subLanguage: 'raport',
      relevance: 10,
    }]
  };
}

hljs.registerLanguage("raport-tpl", def);
