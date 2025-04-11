function def(hljs) {
  return {
    name: 'ejs',
    contains: [{
      begin: /<%=/,
      beginScope: 'string',
      end: /%>/,
      endScope: 'string',
      subLanguage: 'javascript',
      relevance: 10,
    }, {
      begin: /<%/,
      beginScope: 'title.function',
      end: /%>/,
      endScope: 'title.function',
      subLanguage: 'javascript',
      relevance: 0,
    }]
  };
}

hljs.registerLanguage("ejs", def);
