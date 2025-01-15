(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ractive'), require('raport/index')) :
    typeof define === 'function' && define.amd ? define(['exports', 'ractive', 'raport/index'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.Raport = global.Raport || {}, global.Raport.Design = {}), global.Ractive, global.Raport));
}(this, (function (exports, Ractive, index) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var Ractive__default = /*#__PURE__*/_interopDefaultLegacy(Ractive);

    const template$1 = {v:4,t:[{t:7,e:"div",m:[{t:13,n:"class",f:"raport-wrapper",g:1},{n:"trackfocus",t:71},{n:"class-proppop",t:13,f:[{t:2,r:"~/show.proppop"}]}],f:[{t:8,r:"left"}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"top-bar",g:1},{n:"class-shrinkleft",t:13,f:[{t:2,r:"~/show.shrinkleft"}]}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"design actions",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:"title",f:"Run report (CTRL+Shift+Enter)",t:13,g:1},{n:"disabled",f:[{t:2,x:{r:["report.type","report.sources.length"],s:"_0===\"delimited\"&&_1<1"}}],t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.run()&&_0.set(\"tab\",\"result\")]"}}],f:[{t:8,r:"play"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"Design report: modify layout and widgets",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"tab\",\"design\")]"}},{n:"class-active",t:13,f:[{t:2,x:{r:["tab"],s:"_0!==\"result\"&&_0!==\"context\"&&_0!==\"definition\"&&_0!==\"import\"&&_0!==\"project\""}}]}],f:["Designer"]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"tab output-tab",g:1},{n:"title",f:"View report output",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"tab\",\"result\")]"}},{n:"class-active",t:13,f:[{t:2,x:{r:["tab"],s:"_0===\"result\""}}]}],f:["Output"]}],n:50,r:"result"}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"Set up initial report data",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"tab\",\"context\")]"}},{n:"class-active",t:13,f:[{t:2,x:{r:["tab"],s:"_0===\"context\""}}]}],f:["Context"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"Import/export report definition as plain text",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"tab\",\"definition\")]"}},{n:"class-active",t:13,f:[{t:2,x:{r:["tab"],s:"_0===\"definition\""}}]}],f:["Definition"]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:["Manage data for the ",{t:2,r:"data.name"}," provided source"],t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"tab\",\"import\")]"}},{n:"class-active",t:13,f:[{t:2,x:{r:["tab"],s:"_0===\"import\""}}]}],f:["Source Data"]}],n:50,x:{r:["data","@this"],s:"_0&&_1.readLink(\"data\")"}}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"which",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.checkLink(\"import\")]"}}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1}],f:[{t:8,r:"times"}]}," Close ",{t:2,r:"data.name"}," Source Data"]}],n:50,x:{r:["data","tab"],s:"_0&&_1===\"import\""}}," ",{t:4,f:[{t:7,e:"label",m:[{t:13,n:"style",f:"margin: 0 1em;",g:1},{n:"title",f:"Display report output in a table rather than as plain delimited text.",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:"~/settings.delimitedTable"}],t:13},{n:["change"],t:70,f:{r:["@this"],s:"[_0.run()]"}}]}," Table view?"]}],n:50,x:{r:["~/report.type","tab"],s:"_0===\"delimited\"&&_1===\"result\""}}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico text",g:1},{n:["click"],t:70,f:{r:["~/report.name","@style.out.fg","@style.fg","@style.out.bg","@style.bg","~/result","@this","~/settings.delimitedTable","~/report.type","~/settings.runopts.delimited","~/settings.runopts.table"],s:"[_6.download((_0||\"report\")+((_8===\"delimited\"&&!_7||_8!==\"delimited\"&&_9&&!_10)?\".csv\":\".html\"),(_8===\"delimited\"&&!_7||_8!==\"delimited\"&&_9&&!_10)?_5:(\"<style>pre { padding: 0.5rem; } code { display: block; color: \"+(_1||_2)+\"; background-color: \"+(_3||_4)+\"; }</style><code><pre>\")+_5+\"</pre></code>\"+_6.frameExtra(),(_8===\"delimited\"&&!_7||_8!==\"delimited\"&&_9&&!_10)?\"text/csv\":\"text/html\")]"}},{n:"title",f:"Save output to a file",t:13,g:1}],f:["Save Output"]}],n:50,x:{r:["tab","~/report.type","~/settings.runopts.delimited","~/settings.delimitedTable"],s:"_0===\"result\"&&(_1!==\"delimited\"&&!_2||!_3)"}}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"center",g:1}],f:[{t:7,e:"a",m:[{t:13,n:"style",f:"margin-left: 1rem;",g:1},{n:"href",f:"https://github.com/evs-chris/raport",t:13,g:1},{n:"target",f:"_blank",t:13,g:1}],f:["Raport v0.26.0"]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"right",g:1}],f:[{t:4,f:[{t:7,e:"span",m:[{t:13,n:"style",f:"display: inline-block; margin: 0 1em; font-size: 0.8em; height: 1rem; vertical-align: middle;",g:1}],f:[{t:2,r:"~/project.name"}]}],n:50,x:{r:["~/showProjects","~/project.name"],s:"_0&&_1"}}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"ico error",g:1},{n:"title",f:["There are unsaved changes to this project (",{t:2,r:"~/project.name"},"). Press CTRL+s to save projects or click the Save Projects button on the Projects tab."],t:13}],f:[{t:8,r:"warning"}]}],n:50,r:"~/projectChanged"}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"Manage projects and designer settings",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"tab\",\"project\")]"}},{n:"class-active",t:13,f:[{t:2,x:{r:["tab"],s:"_0===\"project\""}}]}],f:[{t:2,x:{r:["~/showProjects"],s:"_0?\"Project\":\"Settings\""}}]}]}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"raport-report center-pane",g:1},{n:"class-shrinkleft",t:13,f:[{t:2,r:"~/show.shrinkleft"}]},{n:"class-shrinkbottom",t:13,f:[{t:2,r:"~/show.shrinkbottom"}]}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"layout",g:1},{n:["keys"],t:70,a:{r:[],s:"[\"z\",{ctrl:true}]"},f:{r:["@this"],s:"[_0.undo(),true]"}},{n:["keys"],t:70,a:{r:[],s:"[\"Z\",{ctrl:true,shift:true}]"},f:{r:["@this"],s:"[_0.redo(),true]"}},{n:"class-pad-me",t:13,f:[{t:2,r:"~/show.pad"}]}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"tab designer",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["tab"],s:"_0!==\"result\"&&_0!==\"context\"&&_0!==\"definition\"&&_0!==\"import\"&&_0!==\"project\""}}]}],f:[{t:8,r:"design"}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab report-context",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["tab"],s:"_0===\"context\""}}]}],f:[{t:8,r:"context"}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab report-definition",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["tab"],s:"_0===\"definition\""}}]}],f:[{t:8,r:"definition"}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab data-import",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["tab"],s:"_0===\"import\""}}]}],f:[{t:8,r:"data-import"}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"result tab",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["tab"],s:"_0===\"result\""}}]}],f:[{t:7,e:"iframe",m:[{n:"id",f:"result",t:13,g:1},{n:"srcdoc",f:[{t:2,x:{r:["~/report.type","~/settings.runopts.delimited","@style.out.fg","@style.fg","@style.out.bg","@style.bg","@this","result"],s:"(_0===\"delimited\"||_1)?(\"<style>pre { padding: 0.5rem; } code { display: block; color: \"+(_2||_3)+\"; background-color: \"+(_4||_5)+\"; }</style><code><pre>\")+_7+\"</pre></code>\"+_6.frameExtra():_7"}}],t:13}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"project tab",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["tab"],s:"_0===\"project\""}}]}],f:[{t:8,r:"project"}]}]}]}," ",{t:8,r:"bottom"}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"position: absolute; left: -1000px; width: 1rem; height: 1rem;",g:1},{n:"id",f:"sizer",t:13,g:1}]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"position: absolute; left: -1000px; width: 5rem; height: 5rem; overflow: auto;",g:1}],f:[{t:7,e:"textarea",m:[{n:"id",f:"text-helper",t:13},{n:"style",f:"padding: 0.5em;",t:13}]}]}]}],e:{"0":function (){return(0);},"1":function (){return(1);},"2":function (){return(2);},"3":function (){return(3);},"4":function (){return(4);},"5":function (){return(5);},"6":function (){return(6);},"7":function (){return(7);},"400":function (){return(400);},"500":function (){return(500);},"600":function (){return(600);},"700":function (){return(700);},"_0===\"delimited\"&&_1<1":function (_0,_1){return(_0==="delimited"&&_1<1);},"[_0.run()&&_0.set(\"tab\",\"result\")]":function (_0){return([_0.run()&&_0.set("tab","result")]);},"[_0.set(\"tab\",\"design\")]":function (_0){return([_0.set("tab","design")]);},"_0!==\"result\"&&_0!==\"context\"&&_0!==\"definition\"&&_0!==\"import\"&&_0!==\"project\"":function (_0){return(_0!=="result"&&_0!=="context"&&_0!=="definition"&&_0!=="import"&&_0!=="project");},"[_0.set(\"tab\",\"result\")]":function (_0){return([_0.set("tab","result")]);},"_0===\"result\"":function (_0){return(_0==="result");},"[_0.set(\"tab\",\"context\")]":function (_0){return([_0.set("tab","context")]);},"_0===\"context\"":function (_0){return(_0==="context");},"[_0.set(\"tab\",\"definition\")]":function (_0){return([_0.set("tab","definition")]);},"_0===\"definition\"":function (_0){return(_0==="definition");},"[_0.set(\"tab\",\"import\")]":function (_0){return([_0.set("tab","import")]);},"_0===\"import\"":function (_0){return(_0==="import");},"_0&&_1.readLink(\"data\")":function (_0,_1){return(_0&&_1.readLink("data"));},"[_0.checkLink(\"import\")]":function (_0){return([_0.checkLink("import")]);},"_0&&_1===\"import\"":function (_0,_1){return(_0&&_1==="import");},"[_0.run()]":function (_0){return([_0.run()]);},"_0===\"delimited\"&&_1===\"result\"":function (_0,_1){return(_0==="delimited"&&_1==="result");},"[_6.download((_0||\"report\")+((_8===\"delimited\"&&!_7||_8!==\"delimited\"&&_9&&!_10)?\".csv\":\".html\"),(_8===\"delimited\"&&!_7||_8!==\"delimited\"&&_9&&!_10)?_5:(\"<style>pre { padding: 0.5rem; } code { display: block; color: \"+(_1||_2)+\"; background-color: \"+(_3||_4)+\"; }</style><code><pre>\")+_5+\"</pre></code>\"+_6.frameExtra(),(_8===\"delimited\"&&!_7||_8!==\"delimited\"&&_9&&!_10)?\"text/csv\":\"text/html\")]":function (_0,_1,_2,_3,_4,_5,_6,_7,_8,_9,_10){return([_6.download((_0||"report")+((_8==="delimited"&&!_7||_8!=="delimited"&&_9&&!_10)?".csv":".html"),(_8==="delimited"&&!_7||_8!=="delimited"&&_9&&!_10)?_5:("<style>pre { padding: 0.5rem; } code { display: block; color: "+(_1||_2)+"; background-color: "+(_3||_4)+"; }</style><code><pre>")+_5+"</pre></code>"+_6.frameExtra(),(_8==="delimited"&&!_7||_8!=="delimited"&&_9&&!_10)?"text/csv":"text/html")]);},"_0===\"result\"&&(_1!==\"delimited\"&&!_2||!_3)":function (_0,_1,_2,_3){return(_0==="result"&&(_1!=="delimited"&&!_2||!_3));},"_0&&_1":function (_0,_1){return(_0&&_1);},"[_0.set(\"tab\",\"project\")]":function (_0){return([_0.set("tab","project")]);},"_0===\"project\"":function (_0){return(_0==="project");},"_0?\"Project\":\"Settings\"":function (_0){return(_0?"Project":"Settings");},"[\"z\",{ctrl:true}]":function (){return(["z",{ctrl:true}]);},"[_0.undo(),true]":function (_0){return([_0.undo(),true]);},"[\"Z\",{ctrl:true,shift:true}]":function (){return(["Z",{ctrl:true,shift:true}]);},"[_0.redo(),true]":function (_0){return([_0.redo(),true]);},"(_0===\"delimited\"||_1)?(\"<style>pre { padding: 0.5rem; } code { display: block; color: \"+(_2||_3)+\"; background-color: \"+(_4||_5)+\"; }</style><code><pre>\")+_7+\"</pre></code>\"+_6.frameExtra():_7":function (_0,_1,_2,_3,_4,_5,_6,_7){return((_0==="delimited"||_1)?("<style>pre { padding: 0.5rem; } code { display: block; color: "+(_2||_3)+"; background-color: "+(_4||_5)+"; }</style><code><pre>")+_7+"</pre></code>"+_6.frameExtra():_7);},"[(_0).set(\".width\",typeof _1===\"number\"||_1===undefined?{percent:_1}:typeof _1===\"object\"&&\"percent\" in _1?{x:\"\"}:typeof _1===\"object\"&&\"x\" in _1?\"grow\":_2)]":function (_0,_1,_2){return([(_0).set(".width",typeof _1==="number"||_1===undefined?{percent:_1}:typeof _1==="object"&&"percent" in _1?{x:""}:typeof _1==="object"&&"x" in _1?"grow":_2)]);},"typeof _0===\"number\"||_0===undefined?\"Change to percent\":typeof _0===\"object\"&&\"percent\" in _0?\"Change to Expression\":typeof _0===\"object\"&&\"x\" in _0?\"Change to Fill/Grow\":\"Change to REM\"":function (_0){return(typeof _0==="number"||_0===undefined?"Change to percent":typeof _0==="object"&&"percent" in _0?"Change to Expression":typeof _0==="object"&&"x" in _0?"Change to Fill/Grow":"Change to REM");},"[_0.editExpr(\".width.x\"),false]":function (_0){return([_0.editExpr(".width.x"),false]);},"typeof _0===\"object\"&&\"x\" in _0":function (_0){return(typeof _0==="object"&&"x" in _0);},"typeof _0===\"number\"||_0===undefined":function (_0){return(typeof _0==="number"||_0===undefined);},"typeof _0===\"object\"&&\"percent\" in _0":function (_0){return(typeof _0==="object"&&"percent" in _0);},"_0===\"grow\"":function (_0){return(_0==="grow");},"typeof _0===\"object\"":function (_0){return(typeof _0==="object");},"_0===\"label\"":function (_0){return(_0==="label");},"_0===\"container\"":function (_0){return(_0==="container");},"[(_0).set(\".height\",typeof _1===\"number\"||_1===undefined?{percent:_1}:typeof _1===\"object\"&&\"percent\" in _1?{x:\"\"}:typeof _1===\"object\"&&\"x\" in _1?\"grow\":_1===\"grow\"&&_2===\"container\"?\"auto\":_3)]":function (_0,_1,_2,_3){return([(_0).set(".height",typeof _1==="number"||_1===undefined?{percent:_1}:typeof _1==="object"&&"percent" in _1?{x:""}:typeof _1==="object"&&"x" in _1?"grow":_1==="grow"&&_2==="container"?"auto":_3)]);},"typeof _0===\"number\"||_0===undefined?\"Change to percent\":typeof _0===\"object\"&&\"percent\" in _0?\"Change to Expression\":typeof _0===\"object\"&&\"x\" in _0?\"Change to Fill/Grow\":_0===\"grow\"&&_1===\"container\"?\"Change to Auto\":\"Change to REM\"":function (_0,_1){return(typeof _0==="number"||_0===undefined?"Change to percent":typeof _0==="object"&&"percent" in _0?"Change to Expression":typeof _0==="object"&&"x" in _0?"Change to Fill/Grow":_0==="grow"&&_1==="container"?"Change to Auto":"Change to REM");},"[_0.editExpr(\".height.x\"),false]":function (_0){return([_0.editExpr(".height.x"),false]);},"_0===\"auto\"":function (_0){return(_0==="auto");},"_0.lastKey(_1)":function (_0,_1){return(_0.lastKey(_1));},"Array.isArray(_0)":function (_0){return(Array.isArray(_0));},"[(_0).set(\"^^/br\",typeof _1===\"object\"?false:{x:\"\"})]":function (_0,_1){return([(_0).set("^^/br",typeof _1==="object"?false:{x:""})]);},"typeof _0===\"object\"?\"Change to Boolean\":\"Change to Expression\"":function (_0){return(typeof _0==="object"?"Change to Boolean":"Change to Expression");},"[_0.editExpr(\"^^/br.x\"),false]":function (_0){return([_0.editExpr("^^/br.x"),false]);},"typeof _0!==\"object\"":function (_0){return(typeof _0!=="object");},"_0.split(_1,2)":function (_0,_1){return(_0.split(_1,2));},"[_0.editExpr(\".hide\")]":function (_0){return([_0.editExpr(".hide")]);},"undefined":function (){return(undefined);},"[_0.editExpr(\".border\")]":function (_0){return([_0.editExpr(".border")]);},"typeof _0===\"string\"":function (_0){return(typeof _0==="string");},"typeof _0===\"undefined\"":function (_0){return(typeof _0==="undefined");},"[(_0).set(\".border\",undefined)]":function (_0){return([(_0).set(".border",undefined)]);},"typeof _0!==\"undefined\"":function (_0){return(typeof _0!=="undefined");},"typeof _0===\"number\"":function (_0){return(typeof _0==="number");},"[(_0).set(\".border\",1)]":function (_0){return([(_0).set(".border",1)]);},"typeof _0!==\"number\"":function (_0){return(typeof _0!=="number");},"_0===1":function (_0){return(_0===1);},"[(_0).set(\".border\",[1])]":function (_0){return([(_0).set(".border",[1])]);},"_0!==1":function (_0){return(_0!==1);},"_0===2":function (_0){return(_0===2);},"[(_0).set(\".border\",[1,1])]":function (_0){return([(_0).set(".border",[1,1])]);},"_0!==2":function (_0){return(_0!==2);},"_0===4":function (_0){return(_0===4);},"[(_0).set(\".border\",[1,1,1,1])]":function (_0){return([(_0).set(".border",[1,1,1,1])]);},"[(_0).set(\".border\",\"\")]":function (_0){return([(_0).set(".border","")]);},"typeof _0!==\"string\"":function (_0){return(typeof _0!=="string");},"[(_0).set(\".font.align\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".font.align",typeof _1==="object"?undefined:{x:""})]);},"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\"":function (_0){return(typeof _0==="object"?"Change to value":"Change to Expression");},"[_0.editExpr(\".font.align.x\")]":function (_0){return([_0.editExpr(".font.align.x")]);},"_0!==\"image\"":function (_0){return(_0!=="image");},"[(_0).set(\".font.pre\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".font.pre",typeof _1==="object"?undefined:{x:""})]);},"[_0.editExpr(\".font.pre.x\")]":function (_0){return([_0.editExpr(".font.pre.x")]);},"[(_0).set(\".font.pre\",_1?true:undefined)]":function (_0,_1){return([(_0).set(".font.pre",_1?true:undefined)]);},"_0===\"measured\"||_0===\"image\"":function (_0){return(_0==="measured"||_0==="image");},"[(_0).set(\".font.clamp\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".font.clamp",typeof _1==="object"?undefined:{x:""})]);},"[_0.editExpr(\".font.clamp.x\")]":function (_0){return([_0.editExpr(".font.clamp.x")]);},"[(_0).set(\".font.clamp\",_1?true:undefined)]":function (_0,_1){return([(_0).set(".font.clamp",_1?true:undefined)]);},"[(_0).set(\".font.size\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".font.size",typeof _1==="object"?undefined:{x:""})]);},"[_0.editExpr(\".font.size.x\")]":function (_0){return([_0.editExpr(".font.size.x")]);},"[(_0).set(\".font.line\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".font.line",typeof _1==="object"?undefined:{x:""})]);},"[_0.editExpr(\".font.line.x\")]":function (_0){return([_0.editExpr(".font.line.x")]);},"_0===\"image\"":function (_0){return(_0==="image");},"[(_0).set(\".font.family\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".font.family",typeof _1==="object"?undefined:{x:""})]);},"[_0.editExpr(\".font.family.x\")]":function (_0){return([_0.editExpr(".font.family.x")]);},"[(_0).set(\".font.color\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".font.color",typeof _1==="object"?undefined:{x:""})]);},"[_0.editExpr(\".font.color.x\")]":function (_0){return([_0.editExpr(".font.color.x")]);},"[(_0).set(\".font.weight\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".font.weight",typeof _1==="object"?undefined:{x:""})]);},"[_0.editExpr(\".font.weight.x\")]":function (_0){return([_0.editExpr(".font.weight.x")]);},"[(_0).set(\".bg\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".bg",typeof _1==="object"?undefined:{x:""})]);},"[_0.editExpr(\".bg.x\")]":function (_0){return([_0.editExpr(".bg.x")]);},"[(_0).set(\".radius\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".radius",typeof _1==="object"?undefined:{x:""})]);},"[_0.editExpr(\".radius.x\")]":function (_0){return([_0.editExpr(".radius.x")]);},"!_0":function (_0){return(!_0);},"[_0.editExpr(\".url\")]":function (_0){return([_0.editExpr(".url")]);},"[(_0).set(\".fit\",!_1||typeof _1===\"string\"?{x:\"\"}:undefined)]":function (_0,_1){return([(_0).set(".fit",!_1||typeof _1==="string"?{x:""}:undefined)]);},"_0&&typeof _0!==\"object\"?\"Expression\":\"Value\"":function (_0){return(_0&&typeof _0!=="object"?"Expression":"Value");},"[_0.editExpr(\".fit.x\"),false]":function (_0){return([_0.editExpr(".fit.x"),false]);},"!_0||typeof _0===\"string\"":function (_0){return(!_0||typeof _0==="string");},"[typeof _0===\"string\"?_2.editExpr(_1+\".source\"):_2.editReportSrc((_3),\".source\")]":function (_0,_1,_2,_3){return([typeof _0==="string"?_2.editExpr(_1+".source"):_2.editReportSrc((_3),".source")]);},"[(_0).set(\".source\",\"\")]":function (_0){return([(_0).set(".source","")]);},"[(_0).set(\".source\",{source:\"\"})]":function (_0){return([(_0).set(".source",{source:""})]);},"_0||_1":function (_0,_1){return(_0||_1);},"_0||_1||_2":function (_0,_1,_2){return(_0||_1||_2);},"[(_0).toggle(\".headerPerPage\")]":function (_0){return([(_0).toggle(".headerPerPage")]);},"_0!==false":function (_0){return(_0!==false);},"_0&&_1===\"page\"":function (_0,_1){return(_0&&_1==="page");},"_0&&_1===\"flow\"":function (_0,_1){return(_0&&_1==="flow");},"_0.split(_1)":function (_0,_1){return(_0.split(_1));},"[_0.editExpr(\".text\")]":function (_0){return([_0.editExpr(".text")]);},"[(_0).set(\".font.metric\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".font.metric",typeof _1==="object"?undefined:{x:""})]);},"[_0.editExpr(\".font.metric.x\")]":function (_0){return([_0.editExpr(".font.metric.x")]);},"[_0.editExpr(\".macro\")]":function (_0){return([_0.editExpr(".macro")]);},"_0-1-_1":function (_0,_1){return(_0-1-_1);},"_0&&_2&&_2[_1]":function (_0,_1,_2){return(_0&&_2&&_2[_1]);},"[(_0).set(\".elide\",typeof _1===\"object\"?false:{x:\"\"})]":function (_0,_1){return([(_0).set(".elide",typeof _1==="object"?false:{x:""})]);},"[_0.editExpr(\".elide.x\"),false]":function (_0){return([_0.editExpr(".elide.x"),false]);},"_0&&_1===\"row\"":function (_0,_1){return(_0&&_1==="row");},"_0===\"page\"&&(_1===\"report.header\"||_1===\"report.footer\")&&_2":function (_0,_1,_2){return(_0==="page"&&(_1==="report.header"||_1==="report.footer")&&_2);},"Array.isArray(_0)?\"manual\":\"auto\"":function (_0){return(Array.isArray(_0)?"manual":"auto");},"[(_0).set(\".layout\",_1===\"manual\"?_2.fillArray(_3):undefined)]":function (_0,_1,_2,_3){return([(_0).set(".layout",_1==="manual"?_2.fillArray(_3):undefined)]);},"[_0.editExpr(\".context\")]":function (_0){return([_0.editExpr(".context")]);},"[_0.editExpr(\".html\",{html:true})]":function (_0){return([_0.editExpr(".html",{html:true})]);},"[_0.editExpr(\".text\",{label:true})]":function (_0){return([_0.editExpr(".text",{label:true})]);},"[(_0).set(\".text\",_2.getPartStrings(_1)),_2.editExpr(\".text\",{label:true})]":function (_0,_1,_2){return([(_0).set(".text",_2.getPartStrings(_1)),_2.editExpr(".text",{label:true})]);},"[(_0).set(\".id\",undefined)]":function (_0){return([(_0).set(".id",undefined)]);},"_0!=null":function (_0){return(_0!=null);},"[(_0).set(\".id\",\"\")]":function (_0){return([(_0).set(".id","")]);},"_0.inRepeater(_1)":function (_0,_1){return(_0.inRepeater(_1));},"[(_0).set(\".format\",undefined)]":function (_0){return([(_0).set(".format",undefined)]);},"[(_0).set(\".format\",{})]":function (_0){return([(_0).set(".format",{})]);},"[(_0).push(\".format.args\",\"\")]":function (_0){return([(_0).push(".format.args","")]);},"[(_0).splice(\"../\",_1,1)]":function (_0,_1){return([(_0).splice("../",_1,1)]);},"[_0.editExpr(\".margin.x\"),false]":function (_0){return([_0.editExpr(".margin.x"),false]);},"[(_0).set(\".margin\",undefined)]":function (_0){return([(_0).set(".margin",undefined)]);},"[(_0).set(\".margin\",1)]":function (_0){return([(_0).set(".margin",1)]);},"[(_0).set(\".margin\",[1,1])]":function (_0){return([(_0).set(".margin",[1,1])]);},"[(_0).set(\".margin\",[1,1,1,1])]":function (_0){return([(_0).set(".margin",[1,1,1,1])]);},"_0!==4":function (_0){return(_0!==4);},"[(_0).set(\".margin\",{x:\"\"})]":function (_0){return([(_0).set(".margin",{x:""})]);},"!_0||_1===undefined":function (_0,_1){return(!_0||_1===undefined);},"_0!==undefined":function (_0){return(_0!==undefined);},"_0!==\"delimited\"":function (_0){return(_0!=="delimited");},"[_0.saveProjects()]":function (_0){return([_0.saveProjects()]);},"[_1.download(_0+\".raport-proj\",_1.stringifyProject())]":function (_0,_1){return([_1.download(_0+".raport-proj",_1.stringifyProject())]);},"[_0.cloneProject()]":function (_0){return([_0.cloneProject()]);},"[_0.importProject(true)]":function (_0){return([_0.importProject(true)]);},"[_0.makeProject(true)]":function (_0){return([_0.makeProject(true)]);},"[_0.removeProject()]":function (_0){return([_0.removeProject()]);},"[_0.resetProject()]":function (_0){return([_0.resetProject()]);},"[_0.unlinkProject()]":function (_0){return([_0.unlinkProject()]);},"[_0.set(\"projectText\",_0.stringifyProject())]":function (_0){return([_0.set("projectText",_0.stringifyProject())]);},"[_0.importProject(true,_1)]":function (_0,_1){return([_0.importProject(true,_1)]);},"[_0.makeProject()]":function (_0){return([_0.makeProject()]);},"_0===_1":function (_0,_1){return(_0===_1);},"[_0.linkProject(_1)]":function (_0,_1){return([_0.linkProject(_1)]);},"[_0.download(\"Raport Projects.json\",_0.stringifyProjects())]":function (_0){return([_0.download("Raport Projects.json",_0.stringifyProjects())]);},"[_0.importProject()]":function (_0){return([_0.importProject()]);},"[_0.loadReportFile()]":function (_0){return([_0.loadReportFile()]);},"[_1.download((_0||\"report\")+\".raport\",_1.reportToString(true,_2,_3))]":function (_0,_1,_2,_3){return([_1.download((_0||"report")+".raport",_1.reportToString(true,_2,_3))]);},"[_0.fmtAll()]":function (_0){return([_0.fmtAll()]);},"[_0.copyToClipboard(_0.reportToString(_1,_2,_3))]":function (_0,_1,_2,_3){return([_0.copyToClipboard(_0.reportToString(_1,_2,_3))]);},"[_0.autosize(_1)]":function (_0,_1){return([_0.autosize(_1)]);},"_0.reportToString(_1,_2,_3)":function (_0,_1,_2,_3){return(_0.reportToString(_1,_2,_3));},"[_1.loadReportString(_0),_1.update(\"temp\")]":function (_0,_1){return([_1.loadReportString(_0),_1.update("temp")]);},"[_0.loadContextFile()]":function (_0){return([_0.loadContextFile()]);},"[_0.tryContext(_1)]":function (_0,_1){return([_0.tryContext(_1)]);},"[\"_contextText\"]":function (){return(["_contextText"]);},"[_0.loadImportFile()]":function (_0){return([_0.loadImportFile()]);},"_0===\"fetch\"":function (_0){return(_0==="fetch");},"[_0.set(\"data.type\",_1?\"fetch\":undefined)]":function (_0,_1){return([_0.set("data.type",_1?"fetch":undefined)]);},"[_1.set(\"data.header\",_0?1:undefined),_1.tryImport(_1.getImportText())]":function (_0,_1){return([_1.set("data.header",_0?1:undefined),_1.tryImport(_1.getImportText())]);},"[_0.editExpr(_1+\".url\",{template:true}),false]":function (_0,_1){return([_0.editExpr(_1+".url",{template:true}),false]);},"[(_0).push(\".headers\",[])]":function (_0){return([(_0).push(".headers",[])]);},"[_0.fetchData()]":function (_0){return([_0.fetchData()]);},"[_0.editExpr(_1+\".1\",{template:true}),false]":function (_0,_1){return([_0.editExpr(_1+".1",{template:true}),false]);},"[_0.editExpr(_1+\".body\",{template:true}),false]":function (_0,_1){return([_0.editExpr(_1+".body",{template:true}),false]);},"_0!==\"GET\"":function (_0){return(_0!=="GET");},"[\"_importText\"]":function (){return(["_importText"]);},"[_0.set(\"_importdirty\",true),console.log(\"change\",_1)]":function (_0,_1){return([_0.set("_importdirty",true),console.log("change",_1)]);},"[_0.tryImport(_0.getImportText()),_0.set(\"_importdirty\",false)]":function (_0){return([_0.tryImport(_0.getImportText()),_0.set("_importdirty",false)]);},"[_0.addHeader()]":function (_0){return([_0.addHeader()]);},"[_0.set(\"report.headers\",undefined)]":function (_0){return([_0.set("report.headers",undefined)]);},"[_0.push(\"report.headers\",\"\"),_0.push(\"report.fields\",\"\")]":function (_0){return([_0.push("report.headers",""),_0.push("report.fields","")]);},"[_0.fillBlankDelimitedHeaders()]":function (_0){return([_0.fillBlankDelimitedHeaders()]);},"[_0.editExpr((_1),{template:true})]":function (_0,_1){return([_0.editExpr((_1),{template:true})]);},"[true]":function (){return([true]);},"[_0.removeWidget((_1)),false]":function (_0,_1){return([_0.removeWidget((_1)),false]);},"!!_0":function (_0){return(!!_0);},"[_1.push(\"report.fields\",\"\"),_0&&_1.push(\"report.headers\",\"\")]":function (_0,_1){return([_1.push("report.fields",""),_0&&_1.push("report.headers","")]);},"[_0.editExpr((_1))]":function (_0,_1){return([_0.editExpr((_1))]);},"_0===\"delimited\"":function (_0){return(_0==="delimited");},"_0.paperSize()":function (_0){return(_0.paperSize());},"[_0===_1?_2.selectWidget(_3?\"report.overlay\":_4?\"report.watermark\":\"report\"):true]":function (_0,_1,_2,_3,_4){return([_0===_1?_2.selectWidget(_3?"report.overlay":_4?"report.watermark":"report"):true]);},"[_0.set(\"temp.hover\",\"\"),false]":function (_0){return([_0.set("temp.hover",""),false]);},"[_2!==_0?_1.set(\"shiftKey\",_2):\"\"]":function (_0,_1,_2){return([_2!==_0?_1.set("shiftKey",_2):""]);},"[_0.unlink(\"widget\"),_0.unlink(\"expr\"),_0.set(\"temp\",{name:\"report \",widget:_1?\"report.overlay\":_2?\"report.watermark\":\"report\",tree:_3})]":function (_0,_1,_2,_3){return([_0.unlink("widget"),_0.unlink("expr"),_0.set("temp",{name:"report ",widget:_1?"report.overlay":_2?"report.watermark":"report",tree:_3})]);},"_0===\"report\"||_0===\"report.watermark\"||_0===\"report.overlay\"":function (_0){return(_0==="report"||_0==="report.watermark"||_0==="report.overlay");},"[_0.set(\"temp.hover\",_1?\"report.watermark\":_2?\"report.overlay\":\"report\"),false]":function (_0,_1,_2){return([_0.set("temp.hover",_1?"report.watermark":_2?"report.overlay":"report"),false]);},"[_0.set(\"report.header\",undefined),_0.unlink(\"widget\"),_0.set(\"temp.widget\",\"\")]":function (_0){return([_0.set("report.header",undefined),_0.unlink("widget"),_0.set("temp.widget","")]);},"[_0.set(\"report.header\",{type:\"container\"})]":function (_0){return([_0.set("report.header",{type:"container"})]);},"[_0.set(\"report.footer\",undefined),_0.unlink(\"widget\"),_0.set(\"temp.widget\",\"\")]":function (_0){return([_0.set("report.footer",undefined),_0.unlink("widget"),_0.set("temp.widget","")]);},"[_0.set(\"report.footer\",{type:\"container\"})]":function (_0){return([_0.set("report.footer",{type:"container"})]);},"!_0||!/^report.(water|overlay)/.test(_0)":function (_0){return(!_0||!/^report.(water|overlay)/.test(_0));},"_0===\"page\"":function (_0){return(_0==="page");},"[_0.set(\"report.watermark\",undefined),_0.unlink(\"widget\"),_0.set(\"temp.widget\",\"\")]":function (_0){return([_0.set("report.watermark",undefined),_0.unlink("widget"),_0.set("temp.widget","")]);},"[_0.link(\"report.watermark\",\"widget\"),_0.set(\"temp.widget\",\"report.watermark\"),false]":function (_0){return([_0.link("report.watermark","widget"),_0.set("temp.widget","report.watermark"),false]);},"[_0.set(\"report.watermark\",{type:\"container\"}),_0.link(\"report.watermark\",\"widget\"),_0.set(\"temp.widget\",\"report.watermark\"),false]":function (_0){return([_0.set("report.watermark",{type:"container"}),_0.link("report.watermark","widget"),_0.set("temp.widget","report.watermark"),false]);},"[_0.set(\"report.overlay\",undefined),_0.unlink(\"widget\"),_0.set(\"temp.widget\",\"\")]":function (_0){return([_0.set("report.overlay",undefined),_0.unlink("widget"),_0.set("temp.widget","")]);},"[_0.link(\"report.overlay\",\"widget\"),_0.set(\"temp.widget\",\"report.overlay\"),false]":function (_0){return([_0.link("report.overlay","widget"),_0.set("temp.widget","report.overlay"),false]);},"[_0.set(\"report.overlay\",{type:\"container\"}),_0.link(\"report.overlay\",\"widget\"),_0.set(\"temp.widget\",\"report.overlay\"),false]":function (_0){return([_0.set("report.overlay",{type:"container"}),_0.link("report.overlay","widget"),_0.set("temp.widget","report.overlay"),false]);},"[_0.unlink(\"widget\"),_0.set(\"temp.widget\",\"\")]":function (_0){return([_0.unlink("widget"),_0.set("temp.widget","")]);},"/^report.(water|overlay)/.test(_0)":function (_0){return(/^report.(water|overlay)/.test(_0));},"/^report.water/.test(_0)":function (_0){return(/^report.water/.test(_0));},"/^report.overlay/.test(_0)":function (_0){return(/^report.overlay/.test(_0));},"\"Page Header\"":function (){return("Page Header");},"_0===\"page\"&&_1":function (_0,_1){return(_0==="page"&&_1);},"\"Page Footer\"":function (){return("Page Footer");},"_0?\"left\":\"right\"":function (_0){return(_0?"left":"right");},"[_0.toggle(\"show.props\")]":function (_0){return([_0.toggle("show.props")]);},"_0?\"off\":\"\"":function (_0){return(_0?"off":"");},"[_2.toggle(\"show.hidetree\"),!_0&&_1?_2.set(\"show.hideprops\",false):\"\"]":function (_0,_1,_2){return([_2.toggle("show.hidetree"),!_0&&_1?_2.set("show.hideprops",false):""]);},"[_0.toggle(\"show.props\"),_0.set(\"show.hidetree\",false),_0.set(\"show.hideprops\",true)]":function (_0){return([_0.toggle("show.props"),_0.set("show.hidetree",false),_0.set("show.hideprops",true)]);},"[_2.toggle(\"show.hideprops\"),!_0&&_1?_2.set(\"show.hidetree\",false):\"\"]":function (_0,_1,_2){return([_2.toggle("show.hideprops"),!_0&&_1?_2.set("show.hidetree",false):""]);},"[_0.toggle(\"show.props\"),_0.set(\"show.hidetree\",true),_0.set(\"show.hideprops\",false)]":function (_0){return([_0.toggle("show.props"),_0.set("show.hidetree",true),_0.set("show.hideprops",false)]);},"[_0.addWidget(_1)]":function (_0,_1){return([_0.addWidget(_1)]);},"_0!==\"delimited\"&&(_1===\"container\"||_2===\"report\")":function (_0,_1,_2){return(_0!=="delimited"&&(_1==="container"||_2==="report"));},"[_0.set(\"copy\",undefined)]":function (_0){return([_0.set("copy",undefined)]);},"true":function (){return(true);},"[_0.set(\"reparent\",undefined)]":function (_0){return([_0.set("reparent",undefined)]);},"[_0.treeScrollToActive()]":function (_0){return([_0.treeScrollToActive()]);},"_0===\"report\"":function (_0){return(_0==="report");},"[_0?_3.reparent((_2)):_1?_3.paste((_2)):_3.selectWidget(\"report\")]":function (_0,_1,_2,_3){return([_0?_3.reparent((_2)):_1?_3.paste((_2)):_3.selectWidget("report")]);},"\"\\n\"":function (){return("\n");},"[_0.set(\"temp.hover\",\"report\"),false]":function (_0){return([_0.set("temp.hover","report"),false]);},"[(_0).set(\".header\",{type:\"container\"}),false]":function (_0){return([(_0).set(".header",{type:"container"}),false]);},"[(_0).set(\".footer\",{type:\"container\"}),false]":function (_0){return([(_0).set(".footer",{type:"container"}),false]);},"[(_0).set(\".watermark\",{type:\"container\"}),false]":function (_0){return([(_0).set(".watermark",{type:"container"}),false]);},"[(_0).set(\".overlay\",{type:\"container\"}),false]":function (_0){return([(_0).set(".overlay",{type:"container"}),false]);},"_0!=\"delimited\"":function (_0){return(_0!="delimited");},"[_0.addHeader(),false]":function (_0){return([_0.addHeader(),false]);},"[_1.push(\"report.fields\",\"\"),_0&&_1.push(\"report.headers\",\"\"),false]":function (_0,_1){return([_1.push("report.fields",""),_0&&_1.push("report.headers",""),false]);},"_0.toUpperCase()":function (_0){return(_0.toUpperCase());},"_0.substr(1)":function (_0){return(_0.substr(1));},"_0===\"boolean\"":function (_0){return(_0==="boolean");},"_0===\"number\"":function (_0){return(_0==="number");},"[_0.editExpr(\"report.name\",{template:true}),false]":function (_0){return([_0.editExpr("report.name",{template:true}),false]);},"[_0.set(\"report.classifyStyles\",_1?undefined:false)]":function (_0,_1){return([_0.set("report.classifyStyles",_1?undefined:false)]);},"[_0.set(\"report.size\",_2[_1])]":function (_0,_1,_2){return([_0.set("report.size",_2[_1])]);},"JSON.stringify(_0)===JSON.stringify(_1)":function (_0,_1){return(JSON.stringify(_0)===JSON.stringify(_1));},"[_0.editExpr(\"report.rowContext\")]":function (_0){return([_0.editExpr("report.rowContext")]);},"[_0.push(\"report.parameters\",{})]":function (_0){return([_0.push("report.parameters",{})]);},"[_0.editParam((_1))]":function (_0,_1){return([_0.editParam((_1))]);},"[_0.checkLink(\"param\",_1),(_2).splice(\"../\",_3,1)]":function (_0,_1,_2,_3){return([_0.checkLink("param",_1),(_2).splice("../",_3,1)]);},"[_0.provideSource()]":function (_0){return([_0.provideSource()]);},"_0===false":function (_0){return(_0===false);},"[_0.editProvidedSource((_1))]":function (_0,_1){return([_0.editProvidedSource((_1))]);},"[_0.logData(_1)]":function (_0,_1){return([_0.logData(_1)]);},"\"console\"":function (){return("console");},"[_0.checkLink(\"import\",_1),(_2).splice(\"../\",_3,1)]":function (_0,_1,_2,_3){return([_0.checkLink("import",_1),(_2).splice("../",_3,1)]);},"[_0.push(\"report.sources\",{name:\"\",parameters:{}})]":function (_0){return([_0.push("report.sources",{name:"",parameters:{}})]);},"[_0.editReportSrc((_1))]":function (_0,_1){return([_0.editReportSrc((_1))]);},"[_0.checkLink(\"source\",_1),(_2).splice(\"../\",_3,1)]":function (_0,_1,_2,_3){return([_0.checkLink("source",_1),(_2).splice("../",_3,1)]);},"_0+\"-props\"":function (_0){return(_0+"-props");},"_0&&!_1":function (_0,_1){return(_0&&!_1);},"[_0.clickWidget((_1))]":function (_0,_1){return([_0.clickWidget((_1))]);},"_0?\"Click to move the selected field above this field\\n\":\"\"":function (_0){return(_0?"Click to move the selected field above this field\n":"");},"_0?\"Click to paste a copy of the selected field above this field\\n\":\"\"":function (_0){return(_0?"Click to paste a copy of the selected field above this field\n":"");},"[_0.set(\"temp.expr.hover\",_1),false]":function (_0,_1){return([_0.set("temp.expr.hover",_1),false]);},"[_0.set(\"temp.expr.hover\",\"\"),false]":function (_0){return([_0.set("temp.expr.hover",""),false]);},"_0+1":function (_0){return(_0+1);},"[_0.set(\"copy\",(_1)),false]":function (_0,_1){return([_0.set("copy",(_1)),false]);},"[_0.set(\"reparent\",(_1)),false]":function (_0,_1){return([_0.set("reparent",(_1)),false]);},"_0===0":function (_0){return(_0===0);},"[_0.moveUp((_1),[\"../\",_2?\"~/report.headers\":undefined],_3,_4),false]":function (_0,_1,_2,_3,_4){return([_0.moveUp((_1),["../",_2?"~/report.headers":undefined],_3,_4),false]);},"[_0.moveDown((_1),[\"../\",_2?\"~/report.headers\":undefined],_3,_4),false]":function (_0,_1,_2,_3,_4){return([_0.moveDown((_1),["../",_2?"~/report.headers":undefined],_3,_4),false]);},"[_0.removeWidget((_1))]":function (_0,_1){return([_0.removeWidget((_1))]);},"[_0.set(\"temp.hover\",_1),false]":function (_0,_1){return([_0.set("temp.hover",_1),false]);},"_0.get(\"type\")":function (_0){return(_0.get("type"));},"_0.getNestLevel(_1)":function (_0,_1){return(_0.getNestLevel(_1));},"[_0.set(\"temp.tree.\"+_1(_2),_3&&_3[_2]===false?true:false),false]":function (_0,_1,_2,_3){return([_0.set("temp.tree."+_1(_2),_3&&_3[_2]===false?true:false),false]);},"_1[_0]!==false":function (_0,_1){return(_1[_0]!==false);},"[_0.moveUp((_1),[\"../\",\"^^/groupEnds\"]),false]":function (_0,_1){return([_0.moveUp((_1),["../","^^/groupEnds"]),false]);},"[_0.moveDown((_1),[\"../\",\"^^/groupEnds\"]),false]":function (_0,_1){return([_0.moveDown((_1),["../","^^/groupEnds"]),false]);},"_0===\"repeater\"&&_1":function (_0,_1){return(_0==="repeater"&&_1);},"\"overlay\"":function (){return("overlay");},"\"header\"":function (){return("header");},"_0!==\"header\"&&_0!==\"footer\"&&_0!==\"alternate\"&&_0!==\"overlay\"&&_0!==\"watermark\"&&_1===\"container\"":function (_0,_1){return(_0!=="header"&&_0!=="footer"&&_0!=="alternate"&&_0!=="overlay"&&_0!=="watermark"&&_1==="container");},"\"alternate\"":function (){return("alternate");},"_0&&_1===_0.resolve()||_2&&_1===_2.resolve()":function (_0,_1,_2){return(_0&&_1===_0.resolve()||_2&&_1===_2.resolve());},"_0&&(_1||_2===\"container\")":function (_0,_1,_2){return(_0&&(_1||_2==="container"));},"_0||_1===\"repeater\"":function (_0,_1){return(_0||_1==="repeater");},"[_0?[(_1).push(\".group\",{type:\"container\"}),(_1).splice(\".groupEnds\",-1,0,true)]:(_1).set({\".group\":[{type:\"container\"}],\".groupEnds\":[true,true]}),false]":function (_0,_1){return([_0?[(_1).push(".group",{type:"container"}),(_1).splice(".groupEnds",-1,0,true)]:(_1).set({".group":[{type:"container"}],".groupEnds":[true,true]}),false]);},"[(_0).set(\".alternate\",{type:\"container\"}),false]":function (_0){return([(_0).set(".alternate",{type:"container"}),false]);},"_0===\"repeater\"":function (_0){return(_0==="repeater");},"_0||\"widget\"":function (_0){return(_0||"widget");},"[_0.moveUp((_1),[\"../\",!_2&&Array.isArray(_3)?\"^^/layout\":undefined],_4,_5),false]":function (_0,_1,_2,_3,_4,_5){return([_0.moveUp((_1),["../",!_2&&Array.isArray(_3)?"^^/layout":undefined],_4,_5),false]);},"[_0.moveDown((_1),[\"../\",!_2&&Array.isArray(_3)?\"^^/layout\":undefined],_4,_5),false]":function (_0,_1,_2,_3,_4,_5){return([_0.moveDown((_1),["../",!_2&&Array.isArray(_3)?"^^/layout":undefined],_4,_5),false]);},"!_0&&!_1":function (_0,_1){return(!_0&&!_1);},"\"footer\"":function (){return("footer");},"\"watermark\"":function (){return("watermark");},"_0||\"unknown\"":function (_0){return(_0||"unknown");},"_0!==\"row\"||_1!==\"repeater\"":function (_0,_1){return(_0!=="row"||_1!=="repeater");},"_0===\"label\"||_0===\"measured\"":function (_0){return(_0==="label"||_0==="measured");},"_1&&typeof _1===\"object\"&&\"x\" in _1?_0:typeof _1===\"string\"?_1:(_2||_3||\"(None)\")":function (_0,_1,_2,_3){return(_1&&typeof _1==="object"&&"x" in _1?_0:typeof _1==="string"?_1:(_2||_3||"(None)"));},"[(_0).set(\".group\",undefined),(_0).set(\".groupEnds\",[true]),_1.unlink(\"widget\"),_1.set(\"temp.widget\",undefined)]":function (_0,_1){return([(_0).set(".group",undefined),(_0).set(".groupEnds",[true]),_1.unlink("widget"),_1.set("temp.widget",undefined)]);},"[(_0).push(\".group\",{type:\"container\"}),(_0).splice(\".groupEnds\",-1,0,true)]":function (_0){return([(_0).push(".group",{type:"container"}),(_0).splice(".groupEnds",-1,0,true)]);},"[(_0).set(\".group\",[{type:\"container\"}]),(_0).set(\".groupEnds\",[true,true])]":function (_0){return([(_0).set(".group",[{type:"container"}]),(_0).set(".groupEnds",[true,true])]);},"[(_0).set(\".header\",undefined),_1.unlink(\"widget\"),_1.set(\"temp.widget\",undefined)]":function (_0,_1){return([(_0).set(".header",undefined),_1.unlink("widget"),_1.set("temp.widget",undefined)]);},"[(_0).set(\".header\",{type:\"container\"})]":function (_0){return([(_0).set(".header",{type:"container"})]);},"[(_0).set(\".alternate\",undefined),_1.unlink(\"widget\"),_1.set(\"temp.widget\",undefined)]":function (_0,_1){return([(_0).set(".alternate",undefined),_1.unlink("widget"),_1.set("temp.widget",undefined)]);},"[(_0).set(\".alternate\",{type:\"container\"})]":function (_0){return([(_0).set(".alternate",{type:"container"})]);},"[(_0).set(\".footer\",undefined),_1.unlink(\"widget\"),_1.set(\"temp.widget\",undefined)]":function (_0,_1){return([(_0).set(".footer",undefined),_1.unlink("widget"),_1.set("temp.widget",undefined)]);},"[(_0).set(\".footer\",{type:\"container\"})]":function (_0){return([(_0).set(".footer",{type:"container"})]);},"\"Group Header \"+(_0+1)":function (_0){return("Group Header "+(_0+1));},"\"Header\"":function (){return("Header");},"(_0).set(\".row\",{type:\"container\"})&&\"\"":function (_0){return((_0).set(".row",{type:"container"})&&"");},"\"Row\"":function (){return("Row");},"\"Alternate\"":function (){return("Alternate");},"\"Footer\"":function (){return("Footer");},"[(_0).toggle(\"ctx.preview\")]":function (_0){return([(_0).toggle("ctx.preview")]);},"[_0.autosizeHtml((_1))]":function (_0,_1){return([_0.autosizeHtml((_1))]);},"[_0.editExpr((_1).resolve(\".html\"),{html:true})]":function (_0,_1){return([_0.editExpr((_1).resolve(".html"),{html:true})]);},"_0||0.83":function (_0){return(_0||0.83);},"_0===0?\"initial\":(_0||_1||1)+\"rem\"":function (_0,_1){return(_0===0?"initial":(_0||_1||1)+"rem");},"_0<50":function (_0){return(_0<50);},"_0.evalExpr(_1)":function (_0,_1){return(_0.evalExpr(_1));},"!_0?\"contain\":_0===\"stretch\"?\"100% 100%\":\"cover\"":function (_0){return(!_0?"contain":_0==="stretch"?"100% 100%":"cover");},"_0.calcFont(_1)":function (_0,_1){return(_0.calcFont(_1));},"_0||\"container\"":function (_0){return(_0||"container");},"(_0).set(\"ctx.layout\",_1===\"row\"||!_1?\"auto\":\"manual\")&&\"\"":function (_0,_1){return((_0).set("ctx.layout",_1==="row"||!_1?"auto":"manual")&&"");},"[_0===\"auto\"?(_1).set(\".layout\",undefined):(_1).set(\".layout\",[])]":function (_0,_1){return([_0==="auto"?(_1).set(".layout",undefined):(_1).set(".layout",[])]);},"[_0.set(\"temp.hover\",_1)]":function (_0,_1){return([_0.set("temp.hover",_1)]);},"false":function (){return(false);},"_0===true":function (_0){return(_0===true);},"[_0]":function (_0){return([_0]);},"_0!==\"page footer\"":function (_0){return(_0!=="page footer");},"_0||0":function (_0){return(_0||0);},"_0===\"container\"?\"min-\":\"\"":function (_0){return(_0==="container"?"min-":"");},"(_0&&_0!==\"auth\")||_1!==\"container\"":function (_0,_1){return((_0&&_0!=="auth")||_1!=="container");},"_0.calcManualLayout(_2[_1],_3,_4)":function (_0,_1,_2,_3,_4){return(_0.calcManualLayout(_2[_1],_3,_4));},"_0.calcMargin(_1)":function (_0,_1){return(_0.calcMargin(_1));},"_0.calcBorder(_1)":function (_0,_1){return(_0.calcBorder(_1));},"[_0.removeWidget((_1),false)]":function (_0,_1){return([_0.removeWidget((_1),false)]);},"_0.calcWidthWithMargin(_1,(_2))":function (_0,_1,_2){return(_0.calcWidthWithMargin(_1,(_2)));},"_0.calcHeightWithMargin(_1)":function (_0,_1){return(_0.calcHeightWithMargin(_1));},"_0===\"params\"":function (_0){return(_0==="params");},"[_0.set(\"temp.bottom.tab\",\"params\"),_0.set(\"show.bottom\",true)]":function (_0){return([_0.set("temp.bottom.tab","params"),_0.set("show.bottom",true)]);},"!_0||_0===\"expr\"":function (_0){return(!_0||_0==="expr");},"[_0.set(\"temp.bottom.tab\",\"expr\"),_0.set(\"show.bottom\",true)]":function (_0){return([_0.set("temp.bottom.tab","expr"),_0.set("show.bottom",true)]);},"_0===\"langref\"":function (_0){return(_0==="langref");},"[_0.set(\"temp.bottom.tab\",\"langref\"),_0.set(\"show.bottom\",true)]":function (_0){return([_0.set("temp.bottom.tab","langref"),_0.set("show.bottom",true)]);},"_0===\"opref\"":function (_0){return(_0==="opref");},"[_0.set(\"temp.bottom.tab\",\"opref\"),_0.set(\"show.bottom\",true)]":function (_0){return([_0.set("temp.bottom.tab","opref"),_0.set("show.bottom",true)]);},"_0===\"param\"":function (_0){return(_0==="param");},"[_0.set(\"temp.bottom.tab\",\"param\"),_0.set(\"show.bottom\",true)]":function (_0){return([_0.set("temp.bottom.tab","param"),_0.set("show.bottom",true)]);},"_0===\"source\"":function (_0){return(_0==="source");},"[_0.set(\"temp.bottom.tab\",\"source\"),_0.set(\"show.bottom\",true)]":function (_0){return([_0.set("temp.bottom.tab","source"),_0.set("show.bottom",true)]);},"[_0.checkLink(\"expr\")]":function (_0){return([_0.checkLink("expr")]);},"_0.replace(/\\./g,\" 〉 \")":function (_0){return(_0.replace(/\./g," 〉 "));},"_0&&(!_1||_1===\"expr\")":function (_0,_1){return(_0&&(!_1||_1==="expr"));},"[_0.checkLink(\"param\")]":function (_0){return([_0.checkLink("param")]);},"+_0.lastKey(_1)+1":function (_0,_1){return(+_0.lastKey(_1)+1);},"_0&&_1===\"param\"":function (_0,_1){return(_0&&_1==="param");},"[_0.checkLink(\"source\")]":function (_0){return([_0.checkLink("source")]);},"_0&&_1===\"source\"":function (_0,_1){return(_0&&_1==="source");},"[_0.toggle(\"max.bottom\")]":function (_0){return([_0.toggle("max.bottom")]);},"[_0.toggle(\"show.bottom\")]":function (_0){return([_0.toggle("show.bottom")]);},"_0.langref(_1,_2)":function (_0,_1,_2){return(_0.langref(_1,_2));},"_0===\"#\"?\"Format \"+_1.slice(1):_1":function (_0,_1){return(_0==="#"?"Format "+_1.slice(1):_1);},"Array.isArray(_0)?_0.join(\" or \"):_0":function (_0){return(Array.isArray(_0)?_0.join(" or "):_0);},"(!_1||_0.includes(_1))&&(!_3||JSON.stringify(_2).toLowerCase().includes(_3.toLowerCase()))":function (_0,_1,_2,_3){return((!_1||_0.includes(_1))&&(!_3||JSON.stringify(_2).toLowerCase().includes(_3.toLowerCase())));},"_0!==\"ast\"&&_0!==\"text\"&&_0!==\"html\"":function (_0){return(_0!=="ast"&&_0!=="text"&&_0!=="html");},"[_0.eval()]":function (_0){return([_0.eval()]);},"_0===\"text\"":function (_0){return(_0==="text");},"[_0.set(\"temp.expr.tab\",\"text\")]":function (_0){return([_0.set("temp.expr.tab","text")]);},"[_0.fmt()]":function (_0){return([_0.fmt()]);},"_0===\"text\"&&!_1":function (_0,_1){return(_0==="text"&&!_1);},"!_0||_0===\"json\"":function (_0){return(!_0||_0==="json");},"[_0.set(\"temp.expr.parsedtype\",\"json\")]":function (_0){return([_0.set("temp.expr.parsedtype","json")]);},"_0&&_0!==\"json\"":function (_0){return(_0&&_0!=="json");},"[_0.copyToClipboard(JSON.stringify(_1))]":function (_0,_1){return([_0.copyToClipboard(JSON.stringify(_1))]);},"_0===\"raport\"":function (_0){return(_0==="raport");},"[_0.set(\"temp.expr.parsedtype\",\"raport\")]":function (_0){return([_0.set("temp.expr.parsedtype","raport")]);},"_0!==\"raport\"":function (_0){return(_0!=="raport");},"_0===\"json\"||!_0":function (_0){return(_0==="json"||!_0);},"_0===\"parsed\"":function (_0){return(_0==="parsed");},"_0?\"\":\"none\"":function (_0){return(_0?"":"none");},"_0===\"html\"":function (_0){return(_0==="html");},"[_0.set(\"temp.expr.tab\",\"html\")]":function (_0){return([_0.set("temp.expr.tab","html")]);},"[_0.set(\"~/temp.logs\",[])]":function (_0){return([_0.set("~/temp.logs",[])]);},"_0===\"logs\"":function (_0){return(_0==="logs");},"[_0.set(\"temp.expr.tab\",\"logs\")]":function (_0){return([_0.set("temp.expr.tab","logs")]);},"_0||_1===\"logs\"":function (_0,_1){return(_0||_1==="logs");},"[_0.set(\"temp.expr.tab\",\"result\")]":function (_0){return([_0.set("temp.expr.tab","result")]);},"[_0.set(\"temp.expr.tab\",\"parsed\")]":function (_0){return([_0.set("temp.expr.tab","parsed")]);},"!_0||_0===\"text\"":function (_0){return(!_0||_0==="text");},"[(_0).set(\".str\",_1.getPartStrings(_2))]":function (_0,_1,_2){return([(_0).set(".str",_1.getPartStrings(_2))]);},"[(_0).push(\".str\",\"\")]":function (_0){return([(_0).push(".str","")]);},"[_0.moveUp((_1))]":function (_0,_1){return([_0.moveUp((_1))]);},"[_0.moveDown((_1))]":function (_0,_1){return([_0.moveDown((_1))]);},"[(_0).set(\".\",{text:_1})]":function (_0,_1){return([(_0).set(".",{text:_1})]);},"[(_0).set(\".\",_1)]":function (_0,_1){return([(_0).set(".",_1)]);},"_0==null?1:_0":function (_0){return(_0==null?1:_0);},"[_0===\"result\"?_1.set(\"temp.expr.tab\",\"text\"):_1.eval()]":function (_0,_1){return([_0==="result"?_1.set("temp.expr.tab","text"):_1.eval()]);},"[_0.command(\"bold\")]":function (_0){return([_0.command("bold")]);},"[_0.command(\"italic\")]":function (_0){return([_0.command("italic")]);},"[_0.command(\"underline\")]":function (_0){return([_0.command("underline")]);},"[_0.command(\"strikeThrough\")]":function (_0){return([_0.command("strikeThrough")]);},"[_0.setHTMLFontSize()]":function (_0){return([_0.setHTMLFontSize()]);},"!_0||_0===\"plain\"":function (_0){return(!_0||_0==="plain");},"[_0.set(\"temp.expr.resulttype\",\"plain\")]":function (_0){return([_0.set("temp.expr.resulttype","plain")]);},"_0&&_0!==\"plain\"":function (_0){return(_0&&_0!=="plain");},"[_0.copyToClipboard(_1)]":function (_0,_1){return([_0.copyToClipboard(_1)]);},"_0===\"json\"":function (_0){return(_0==="json");},"[_0.set(\"temp.expr.resulttype\",\"json\")]":function (_0){return([_0.set("temp.expr.resulttype","json")]);},"_0!==\"json\"":function (_0){return(_0!=="json");},"[_0.copyToClipboard(JSON.stringify(_1,null,_2?undefined:\"  \"))]":function (_0,_1,_2){return([_0.copyToClipboard(JSON.stringify(_1,null,_2?undefined:"  "))]);},"[_0.set(\"temp.expr.resulttype\",\"raport\")]":function (_0){return([_0.set("temp.expr.resulttype","raport")]);},"[_0.copyToClipboard(_0.unparse(_1))]":function (_0,_1){return([_0.copyToClipboard(_0.unparse(_1))]);},"_0===\"tree\"":function (_0){return(_0==="tree");},"[_0.set(\"temp.expr.resulttype\",\"tree\")]":function (_0){return([_0.set("temp.expr.resulttype","tree")]);},"_0!==\"tree\"":function (_0){return(_0!=="tree");},"[_0.set(\"temp.expr.resulttype\",\"html\")]":function (_0){return([_0.set("temp.expr.resulttype","html")]);},"_0!==\"html\"":function (_0){return(_0!=="html");},"_0===undefined":function (_0){return(_0===undefined);},"JSON.stringify(_0,null,_1?undefined:\"  \")":function (_0,_1){return(JSON.stringify(_0,null,_1?undefined:"  "));},"_0.unparse(_1)":function (_0,_1){return(_0.unparse(_1));},"JSON.stringify(_0,null,_1?\"\":\"  \")":function (_0,_1){return(JSON.stringify(_0,null,_1?"":"  "));},"_0.join(\" \")":function (_0){return(_0.join(" "));},"_0===\"ast\"||_0===\"text\"||_0===\"html\"?\"\":\"none\"":function (_0){return(_0==="ast"||_0==="text"||_0==="html"?"":"none");},"_0===\"string\"":function (_0){return(_0==="string");},"[(_0).set(\".init\",\"\")]":function (_0){return([(_0).set(".init","")]);},"[(_0).set(\".init\",undefined)]":function (_0){return([(_0).set(".init",undefined)]);},"[(_0).set(\".options\",Array.isArray(_1)?undefined:[])]":function (_0,_1){return([(_0).set(".options",Array.isArray(_1)?undefined:[])]);},"[(_2).push(\".options\",!_0?_1:{label:_0,value:_1}),(_2).set({\"ctx.label\":\"\",\"ctx.value\":\"\"})]":function (_0,_1,_2){return([(_2).push(".options",!_0?_1:{label:_0,value:_1}),(_2).set({"ctx.label":"","ctx.value":""})]);},"~_0.indexOf(\"widget\")":function (_0){return(~_0.indexOf("widget"));},"[_0.editExpr(_1+\".base\")]":function (_0,_1){return([_0.editExpr(_1+".base")]);},"[_0.editExpr(_1+\".filter\")]":function (_0,_1){return([_0.editExpr(_1+".filter")]);},"[_0.editExpr(_1+\".sort\")]":function (_0,_1){return([_0.editExpr(_1+".sort")]);},"[(_0).push(\".group\",\"\")]":function (_0){return([(_0).push(".group","")]);},"[(_0).set(\".group\",undefined)]":function (_0){return([(_0).set(".group",undefined)]);},"[_0.editExpr(\"~/\"+_1)]":function (_0,_1){return([_0.editExpr("~/"+_1)]);},"[(_0).set(\".group\",[\"\"])]":function (_0){return([(_0).set(".group",[""])]);},"(_0+\"\").replace(/temp.expr.result./,\"\")":function (_0){return((_0+"").replace(/temp.expr.result./,""));},"Array.isArray(_0)?\"[\":\"{\"":function (_0){return(Array.isArray(_0)?"[":"{");},"[_0.toggle(\"temp.expr.expand.\"+_1(_2))]":function (_0,_1,_2){return([_0.toggle("temp.expr.expand."+_1(_2))]);},"typeof _0===\"object\"&&(_1||_3[_2])":function (_0,_1,_2,_3){return(typeof _0==="object"&&(_1||_3[_2]));},"Array.isArray(_0)?\"]\":\"}\"":function (_0){return(Array.isArray(_0)?"]":"}");},"_0||_2[_1]":function (_0,_1,_2){return(_0||_2[_1]);},"_0.treeString(_1)":function (_0,_1){return(_0.treeString(_1));},"[_0.exprToggle(_1)]":function (_0,_1){return([_0.exprToggle(_1)]);},"_1[_0]?\"-\":\"+\"":function (_0,_1){return(_1[_0]?"-":"+");},"[_0.insertRef(_1)]":function (_0,_1){return([_0.insertRef(_1)]);},"!_2||_0||~_1.indexOf(_2)":function (_0,_1,_2){return(!_2||_0||~_1.indexOf(_2));},"[Array.isArray(_0)?(_2).splice(\"../\",_1,1):(_2).set(\".\",undefined)]":function (_0,_1,_2){return([Array.isArray(_0)?(_2).splice("../",_1,1):(_2).set(".",undefined)]);},"[(_0).set(\".source\",{r:\"\"})]":function (_0){return([(_0).set(".source",{r:""})]);},"[(_0).set(\".apply\",{r:\"\"})]":function (_0){return([(_0).set(".apply",{r:""})]);},"_1[_0]&&_1[_0].type===\"aggregate\"":function (_0,_1){return(_1[_0]&&_1[_0].type==="aggregate");},"[_0.retypeASTNode(_1,_2)]":function (_0,_1,_2){return([_0.retypeASTNode(_1,_2)]);},"_1&&\"op\" in _1?\"operator\":_1&&\"v\" in _1?(typeof _0===\"string\"?\"string\":typeof _0===\"number\"?\"number\":\"object\"):_1&&\"r\" in _1?\"reference\":\"undefined\"":function (_0,_1){return(_1&&"op" in _1?"operator":_1&&"v" in _1?(typeof _0==="string"?"string":typeof _0==="number"?"number":"object"):_1&&"r" in _1?"reference":"undefined");},"[_0!==_2&&[_1.link(_2,\"temp.expr.part\"),_1.set(\"temp.expr.partpath\",_2)],false]":function (_0,_1,_2){return([_0!==_2&&[_1.link(_2,"temp.expr.part"),_1.set("temp.expr.partpath",_2)],false]);},"(_0&&(\"op\" in _0?\"op\":\"v\" in _0?\"value\":\"r\" in _0?\"ref\":\"wat\"))||\"wat\"":function (_0){return((_0&&("op" in _0?"op":"v" in _0?"value":"r" in _0?"ref":"wat"))||"wat");},"[(_0).push(\".args\",{v:\"\"})]":function (_0){return([(_0).push(".args",{v:""})]);},"_0&&\"op\" in _0":function (_0){return(_0&&"op" in _0);},"_0&&\"v\" in _0":function (_0){return(_0&&"v" in _0);},"_0&&\"r\" in _0":function (_0){return(_0&&"r" in _0);},"\"+ \"":function (){return("+ ");},"\"=> \"":function (){return("=> ");},"[_0.set(\"report.defaultParams\",_1)]":function (_0,_1){return([_0.set("report.defaultParams",_1)]);},"[_0.initParams()]":function (_0){return([_0.initParams()]);},"_0===\"code\"":function (_0){return(_0==="code");},"_0===\"object\"||_0===\"array\"||_0.slice(-2)===\"[]\"":function (_0){return(_0==="object"||_0==="array"||_0.slice(-2)==="[]");}},p:{types:[{t:7,e:"option",f:["any"]}," ",{t:7,e:"option",f:["string"]}," ",{t:7,e:"option",f:["number"]}," ",{t:7,e:"option",f:["boolean"]}," ",{t:7,e:"option",f:["date"]}," ",{t:7,e:"option",f:["array"]}," ",{t:7,e:"option",f:["object"]}," ",{t:7,e:"option",f:["string[]"]}," ",{t:7,e:"option",f:["number[]"]}," ",{t:7,e:"option",f:["boolean[]"]}," ",{t:7,e:"option",f:["date[]"]}," ",{t:7,e:"option",f:["object[]"]}],"widget-props":[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["Width of the ",{t:2,r:".type"}," in rem, if a number, a percentage of the parent, grow/fill, or an expression, defaulting to 100%"],t:13}],f:["Width ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1},{n:"tabindex",f:"-1",t:13,g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".width",".width.percent"],s:"[(_0).set(\".width\",typeof _1===\"number\"||_1===undefined?{percent:_1}:typeof _1===\"object\"&&\"percent\" in _1?{x:\"\"}:typeof _1===\"object\"&&\"x\" in _1?\"grow\":_2)]"}},{n:"title",f:[{t:2,x:{r:[".width"],s:"typeof _0===\"number\"||_0===undefined?\"Change to percent\":typeof _0===\"object\"&&\"percent\" in _0?\"Change to Expression\":typeof _0===\"object\"&&\"x\" in _0?\"Change to Fill/Grow\":\"Change to REM\""}}],t:13},{n:"tabindex",f:"-1",t:13,g:1}],f:[" ",{t:8,r:"switch"}]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".width.x\"),false]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".width"],s:"typeof _0===\"object\"&&\"x\" in _0"}}]}," ",{t:7,e:"span",f:[{t:4,f:[{t:7,e:"div",f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".width"}],t:13},{n:"style-width",f:"calc(100% - 2rem)",t:13}]},{t:7,e:"span",m:[{t:13,n:"class",f:"unit",g:1}],f:["rem"]}]}],n:50,x:{r:[".width"],s:"typeof _0===\"number\"||_0===undefined"}},{t:4,f:[{t:7,e:"div",f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".width.percent"}],t:13},{n:"style-width",f:"calc(100% - 2rem)",t:13}]},{t:7,e:"span",m:[{t:13,n:"class",f:"unit",g:1}],f:["%"]}]}," "],n:50,x:{r:[".width"],s:"typeof _0===\"object\"&&\"percent\" in _0"},l:1},{t:4,f:[" ",{t:7,e:"div",f:["Fill/Grow"]}," "],n:50,x:{r:[".width"],s:"_0===\"grow\""},l:1},{t:4,f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".width.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".width"],s:"typeof _0===\"object\""},l:1}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["Height of the ",{t:2,r:".type"}," in rem, if a number, a percentage of the parent, or an expression, fill/grow, defaults to ",{t:4,f:["the largest font size or 1"],n:50,x:{r:["type"],s:"_0===\"label\""}},{t:4,f:["auto"],n:50,x:{r:[".type"],s:"_0===\"container\""},l:1},{t:4,f:["1"],n:51,l:1}],t:13}],f:["Height ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1},{n:"tabindex",f:"-1",t:13,g:1}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".height",".type",".height.percent"],s:"[(_0).set(\".height\",typeof _1===\"number\"||_1===undefined?{percent:_1}:typeof _1===\"object\"&&\"percent\" in _1?{x:\"\"}:typeof _1===\"object\"&&\"x\" in _1?\"grow\":_1===\"grow\"&&_2===\"container\"?\"auto\":_3)]"}},{n:"title",f:[{t:2,x:{r:[".height",".type"],s:"typeof _0===\"number\"||_0===undefined?\"Change to percent\":typeof _0===\"object\"&&\"percent\" in _0?\"Change to Expression\":typeof _0===\"object\"&&\"x\" in _0?\"Change to Fill/Grow\":_0===\"grow\"&&_1===\"container\"?\"Change to Auto\":\"Change to REM\""}}],t:13},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"switch"}]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".height.x\"),false]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".height"],s:"typeof _0===\"object\"&&\"x\" in _0"}}]}," ",{t:7,e:"span",f:[{t:4,f:[{t:7,e:"div",f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".height"}],t:13},{n:"style-width",f:"calc(100% - 2rem)",t:13}]},{t:7,e:"span",m:[{t:13,n:"class",f:"unit",g:1}],f:["rem"]}]}],n:50,x:{r:[".height"],s:"typeof _0===\"number\"||_0===undefined"}},{t:4,f:[{t:7,e:"div",f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".height.percent"}],t:13},{n:"style-width",f:"calc(100% - 2rem)",t:13}]},{t:7,e:"span",m:[{t:13,n:"class",f:"unit",g:1}],f:["%"]}]}," "],n:50,x:{r:[".height"],s:"typeof _0===\"object\"&&\"percent\" in _0"},l:1},{t:4,f:[" ",{t:7,e:"div",f:["Fill/Grow"]}," "],n:50,x:{r:[".height"],s:"_0===\"grow\""},l:1},{t:4,f:[" ",{t:7,e:"div",f:["Auto"]}," "],n:50,x:{r:[".height"],s:"_0===\"auto\""},l:1},{t:4,f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".height.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".height"],s:"typeof _0===\"object\""},l:1}]}]}," ",{t:4,f:[{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"Offset from the sides of the container. Positive values are the offset from the left, and negative values are the offset from the right, where -1 will be touching the right side.",t:13,g:1}],f:["X"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,rx:{r:".layout",m:[{r:["@this","~/temp.widget"],s:"_0.lastKey(_1)"},{r:[],s:"0"}]}}],t:13}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"Offset from the top or bottom of the container. Positive values are the offset from the top, and negative values are the offset from the bottom, where -1 will be touching the bottom.",t:13,g:1}],f:["Y"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,rx:{r:".layout",m:[{r:["@this","~/temp.widget"],s:"_0.lastKey(_1)"},{r:[],s:"1"}]}}],t:13}]}]}]}],n:50,x:{r:[".layout"],s:"Array.isArray(_0)"}},{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"Cause the widget to start on the next line in an automatic layout",t:13,g:1}],f:["Break? ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1},{n:"tabindex",f:"-1",t:13,g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context","^^/br"],s:"[(_0).set(\"^^/br\",typeof _1===\"object\"?false:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:["^^/br"],s:"typeof _0===\"object\"?\"Change to Boolean\":\"Change to Expression\""}}],t:13},{n:"tabindex",f:"-1",t:13,g:1}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\"^^/br.x\"),false]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:["^^/br"],s:"typeof _0===\"object\"&&\"x\" in _0"}}," "]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:"^^/br"}],t:13}]}],n:50,x:{r:["^^/br"],s:"typeof _0!==\"object\""}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:"^^/br.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:["^^/br"],s:"typeof _0===\"object\""},l:1}]}]}],n:51,l:1}],n:54,rx:{r:"~/",m:[{r:["@this","~/temp.widget"],s:"_0.split(_1,2)"}]}},{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["If this evaluates to true, the ",{t:2,r:".type"}," will be hidden and not affect automatic layouts"],t:13}],f:["Hidden ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1},{n:"tabindex",f:"-1",t:13,g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".hide\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"span",f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".hide"}],t:13},{n:"tabout",f:0,t:13}]}]}]}]}," ",{t:8,r:"margin-prop"}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"Setting box to contain will make the margins fit within the designated size. Setting box to expand will expand the width to include the margin. The default depends on the type of sizing, with contain for percentages and expand for others.",t:13,g:1}],f:["Box"]},{t:7,e:"span",f:[" ",{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".box"}],t:13}],f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"undefined"}}],t:13}],f:["Default"]}," ",{t:7,e:"option",m:[{n:"value",f:"contain",t:13}],f:["Contain"]}," ",{t:7,e:"option",m:[{n:"value",f:"expand",t:13}],f:["Expand"]}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["The size in px for the border of this ",{t:2,r:".type"},". The base value for this property is a four number tuple with values for the top, right, bottom, and left. A two number tuple is converted to top/bottom and left/right. A single number tuple spcifies the same number for all sides. A single number specifies only the bottom border."],t:13}],f:["Border ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1},{n:"tabindex",f:"-1",t:13,g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".border\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".border"],s:"typeof _0===\"string\""}}]},{t:7,e:"span",f:[" ",{t:7,e:"div",m:[{t:13,n:"class",f:"toggles",g:1}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".border"],s:"typeof _0===\"undefined\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".border\",undefined)]"}}],n:50,x:{r:[".border"],s:"typeof _0!==\"undefined\""}}],f:["None"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".border"],s:"typeof _0===\"number\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".border\",1)]"}}],n:50,x:{r:[".border"],s:"typeof _0!==\"number\""}}],f:["Bottom"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".border.length"],s:"_0===1"}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".border\",[1])]"}}],n:50,x:{r:[".border.length"],s:"_0!==1"}}],f:["All"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".border.length"],s:"_0===2"}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".border\",[1,1])]"}}],n:50,x:{r:[".border.length"],s:"_0!==2"}}],f:["Paired"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".border.length"],s:"_0===4"}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".border\",[1,1,1,1])]"}}],n:50,x:{r:[".border.length"],s:"_0!==2"}}],f:["Individual"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".border"],s:"typeof _0===\"string\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".border\",\"\")]"}}],n:50,x:{r:[".border"],s:"typeof _0!==\"string\""}}],f:["Expression"]}]}," ",{t:4,f:[{t:7,e:"input",m:[{t:73,v:"l"},{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".border"}],t:13}]}],n:50,x:{r:[".border"],s:"typeof _0===\"number\""}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".border"}],t:13},{n:"tabout",f:0,t:13}]}]}," "],n:50,x:{r:[".border"],s:"typeof _0===\"string\""},l:1},{t:4,f:[" ",{t:7,e:"input",m:[{t:73,v:"l"},{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".border.0"}],t:13}]}," "],n:50,x:{r:[".border.length"],s:"_0===1"},l:1},{t:4,f:[" ",{t:7,e:"div",m:[{t:13,n:"class",f:"sides",g:1}],f:[{t:7,e:"span"},{t:7,e:"input",m:[{t:73,v:"l"},{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".border.0"}],t:13}]},{t:7,e:"span"}," ",{t:7,e:"span"},{t:7,e:"div",m:[{t:13,n:"class",f:"square",g:1}]},{t:7,e:"input",m:[{t:73,v:"l"},{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".border.1"}],t:13}]}," ",{t:7,e:"span"},{t:7,e:"span"},{t:7,e:"span"}]}," "],n:50,x:{r:[".border.length"],s:"_0===2"},l:1},{t:4,f:[" ",{t:7,e:"div",m:[{t:13,n:"class",f:"sides",g:1}],f:[{t:7,e:"span"},{t:7,e:"input",m:[{t:73,v:"l"},{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".border.0"}],t:13}]},{t:7,e:"span"}," ",{t:7,e:"input",m:[{t:73,v:"l"},{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".border.3"}],t:13}]},{t:7,e:"div",m:[{t:13,n:"class",f:"square",g:1}]},{t:7,e:"input",m:[{t:73,v:"l"},{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".border.1"}],t:13}]}," ",{t:7,e:"span"},{t:7,e:"input",m:[{t:73,v:"l"},{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".border.2"}],t:13}]},{t:7,e:"span"}]}],n:50,x:{r:[".border.length"],s:"_0===4"},l:1}]}]}," ",{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["Horizontal alignment of text within this ",{t:2,r:".type"},"."],t:13}],f:["Alignment ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1},{n:"tabindex",f:"-1",t:13,g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".font.align"],s:"[(_0).set(\".font.align\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".font.align"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13},{n:"tabindex",f:"-1",t:13,g:1}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".font.align.x\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".font.align"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".font.align.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".font.align"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".font.align"}],t:13}],f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"undefined"}}],t:13}],f:["(default)"]}," ",{t:7,e:"option",f:["left"]}," ",{t:7,e:"option",f:["center"]}," ",{t:7,e:"option",f:["right"]}," ",{t:7,e:"option",f:["justify"]}]}],n:51,l:1}]}]}],n:50,x:{r:[".type"],s:"_0!==\"image\""}},{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["Display all whitespace, including newlines, within the content of the ",{t:2,r:".type"},"?"],t:13}],f:["Significant Space? ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1},{n:"tabindex",f:"-1",t:13,g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".font.pre"],s:"[(_0).set(\".font.pre\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".font.pre"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13},{n:"tabindex",f:"-1",t:13,g:1}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".font.pre.x\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".font.pre"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".font.pre.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".font.pre"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{t:73,v:"t",f:"false"},{n:"checked",f:[{t:2,r:".font.pre"}],t:13},{n:["change"],t:70,f:{r:["@context","@node.checked"],s:"[(_0).set(\".font.pre\",_1?true:undefined)]"}}]}],n:51,l:1}]}]}],n:51,x:{r:[".type"],s:"_0===\"measured\"||_0===\"image\""}},{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"If enabled, content that would exceed the specified boundaries of the component will be clipped rather than overflowing.",t:13,g:1}],f:["Prevent Overflow? ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1},{n:"tabindex",f:"-1",t:13,g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".font.clamp"],s:"[(_0).set(\".font.clamp\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".font.clamp"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13},{n:"tabindex",f:"-1",t:13,g:1}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".font.clamp.x\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".font.clamp"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".font.clamp.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".font.clamp"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{t:73,v:"t",f:"false"},{n:"checked",f:[{t:2,r:".font.clamp"}],t:13},{n:["change"],t:70,f:{r:["@context","@node.checked"],s:"[(_0).set(\".font.clamp\",_1?true:undefined)]"}}]}],n:51,l:1}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["Size of the text within this ",{t:2,r:".type"}," in rem."],t:13}],f:["Text Size ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1},{n:"tabindex",f:"-1",t:13,g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".font.size"],s:"[(_0).set(\".font.size\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".font.size"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13},{n:"tabindex",f:"-1",t:13,g:1}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".font.size.x\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".font.size"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".font.size.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".font.size"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"input",m:[{t:73,v:"l"},{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".font.size"}],t:13}]}],n:51,l:1}]}]}],n:50,x:{r:[".type"],s:"_0!==\"image\""}},{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["The height of lines within this ",{t:2,r:".type"}," in rem. This defaults to the text size if it is set and a line height is not supplied."],t:13}],f:["Line Height ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1},{n:"tabindex",f:"-1",t:13,g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".font.line"],s:"[(_0).set(\".font.line\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".font.line"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13},{n:"tabindex",f:"-1",t:13,g:1}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".font.line.x\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".font.line"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".font.line.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".font.line"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"input",m:[{t:73,v:"l"},{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".font.line"}],t:13}]}],n:51,l:1}]}]}],n:51,x:{r:[".type"],s:"_0===\"image\""}},{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["The font family for text appearing within this ",{t:2,r:".type"},". Browser safe fonts are recommended e.g. serif, sans-serif, monospace."],t:13}],f:["Font Family ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1},{n:"tabindex",f:"-1",t:13,g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".font.family"],s:"[(_0).set(\".font.family\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".font.family"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13},{n:"tabindex",f:"-1",t:13,g:1}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".font.family.x\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".font.family"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".font.family.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".font.family"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".font.family"}],t:13}]}],n:51,l:1}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["The color of text appearing within this ",{t:2,r:".type"},"."],t:13}],f:["Text Color ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1},{n:"tabindex",f:"-1",t:13,g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".font.color"],s:"[(_0).set(\".font.color\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".font.color"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13},{n:"tabindex",f:"-1",t:13,g:1}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".font.color.x\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".font.color"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".font.color.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".font.color"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".font.color"}],t:13}]}],n:51,l:1}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["The weight of text appearing within this ",{t:2,r:".type"},"."],t:13}],f:["Weight ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1},{n:"tabindex",f:"-1",t:13,g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".font.weight"],s:"[(_0).set(\".font.weight\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".font.weight"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13},{n:"tabindex",f:"-1",t:13,g:1}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".font.weight.x\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".font.weight"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".font.weight.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".font.weight"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".font.weight"}],t:13}],f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"undefined"}}],t:13}],f:["(default)"]}," ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"400"}}],t:13}],f:["light"]}," ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"500"}}],t:13}],f:["normal"]}," ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"600"}}],t:13}],f:["bold"]}," ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"700"}}],t:13}],f:["bolder"]}]}],n:51,l:1}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["The background color of this ",{t:2,r:".type"},"."],t:13}],f:["Background Color ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1},{n:"tabindex",f:"-1",t:13,g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".bg"],s:"[(_0).set(\".bg\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".bg"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13},{n:"tabindex",f:"-1",t:13,g:1}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".bg.x\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".bg"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".bg.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".bg"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".bg"}],t:13}]}],n:51,l:1}]}]}],n:50,x:{r:[".type"],s:"_0!==\"image\""}},{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["The radius, including CSS unit, to apply to the corners of this ",{t:2,r:".type"}," if it has a border."],t:13}],f:["Radius ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1},{n:"tabindex",f:"-1",t:13,g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".radius"],s:"[(_0).set(\".radius\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".radius"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13},{n:"tabindex",f:"-1",t:13,g:1}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".radius.x\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".radius"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".radius.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".radius"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".radius"}],t:13}]}],n:51,l:1}]}]}," ",{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["Padding to add to the right side of the ",{t:2,r:".type"},", which is useful for right-aligned text"],t:13}],f:["Right Pad"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{t:73,v:"l"},{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".font.right"}],t:13}]}]}]}],n:50,x:{r:[".margin"],s:"!_0"}}],"image-props":[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The URL of the picture to load into this image. This can be a data url.",t:13,g:1}],f:["URL ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".url\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"span",f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".url"}],t:13},{n:"tabout",f:0,t:13}]}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"This property specifies how the image should be rendered if its aspect ratio and dimensions do not match the size of this image widget.",t:13,g:1}],f:["Fit ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".fit"],s:"[(_0).set(\".fit\",!_1||typeof _1===\"string\"?{x:\"\"}:undefined)]"}},{n:"title",f:["Switch to ",{t:2,x:{r:[".fit"],s:"_0&&typeof _0!==\"object\"?\"Expression\":\"Value\""}}],t:13},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"switch"}]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".fit.x\"),false]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".fit"],s:"typeof _0===\"object\"&&\"x\" in _0"}}," "]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".fit"}],t:13}],f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"undefined"}}],t:13}],f:["Contain"]}," ",{t:7,e:"option",m:[{n:"value",f:"cover",t:13}],f:["Cover"]}," ",{t:7,e:"option",m:[{n:"value",f:"stretch",t:13}],f:["Stretch"]}]}],n:50,x:{r:[".fit"],s:"!_0||typeof _0===\"string\""}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".fit.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:51,l:1}]}]}],"repeater-props":[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The source of the data that this repeater should iterate over. Report sources can be further grouped, filtered, and sorted here before being rendered by the repeater.",t:13,g:1}],f:["Source ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:[".source","@keypath","@this","@context"],s:"[typeof _0===\"string\"?_2.editExpr(_1+\".source\"):_2.editReportSrc((_3),\".source\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"span",f:[" ",{t:7,e:"div",m:[{t:13,n:"class",f:"toggles",g:1}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".source"],s:"typeof _0===\"string\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".source\",\"\")]"}}],n:50,x:{r:[".source"],s:"typeof _0!==\"string\""}}],f:["Expression"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".source"],s:"typeof _0!==\"string\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".source\",{source:\"\"})]"}}],n:50,x:{r:[".source"],s:"typeof _0===\"string\""}}],f:["Source"]}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".source"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".source"],s:"typeof _0===\"string\""}}," ",{t:4,f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".source.source"}],t:13}],f:[{t:7,e:"option",m:[{n:"value",f:"",t:13}],f:["(None)"]},{t:4,f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[".name",".source"],s:"_0||_1"}}],t:13}],f:[{t:2,x:{r:[".label",".name",".source"],s:"_0||_1||_2"}}]}],n:52,r:"~/report.sources"}]}],n:50,x:{r:[".source"],s:"typeof _0!==\"string\""}}]}]}," ",{t:19,f:[{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"If enabled, the header will be rerendered at the beginning of each new page.",t:13,g:1}],f:["Header Per Page?"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{t:73,v:"t",f:"false"},{n:["change"],t:70,f:{r:["@context"],s:"[(_0).toggle(\".headerPerPage\")]"}},{n:"checked",f:[{t:2,x:{r:[".headerPerPage"],s:"_0!==false"}}],t:13}]}]}]}],n:50,x:{r:["repeater.header","~/report.type"],s:"_0&&_1===\"page\""}}," ",{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"If set to a positive integer greater than 0, the header will be rerendered after the given number of rows.",t:13,g:1}],f:["Header Repeat"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".headerRepeat"}],t:13}]}]}]}],n:50,x:{r:["repeater.header","~/report.type"],s:"_0&&_1===\"flow\""}}," ",{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"If enabled, the header will be rendered before all of the groups.",t:13,g:1}],f:["Show Header?"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,rx:{r:"repeater.groupHeaders",m:[{t:30,n:"repeater.group.length"}]}}],t:13}]}]}]}],n:50,x:{r:["repeater.header","repeater.group.length"],s:"_0&&_1"}}," ",{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"If enabled, the footer will be rendered again after all of the groups. You can use the @level reference to render different footers for different group levels within the repeater.",t:13,g:1}],f:["Show Footer?"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,rx:{r:"repeater.groupEnds",m:[{t:30,n:"repeater.group.length"}]}}],t:13}]}]}]}],n:50,x:{r:["repeater.footer","repeater.group.length"],s:"_0&&_1"}}],n:54,z:[{n:"repeater",x:{rx:{r:"~/",m:[{r:["@this","~/temp.widget"],s:"_0.split(_1)"}]}}}]}],"measured-props":[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The text to appear in this label. This is an expression, so literal text will need to be specified as a string expression.",t:13,g:1}],f:["Text ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".text\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"span",f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".text"}],t:13},{n:"tabout",f:0,t:13}]}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The font metric to use when computing the height that the text will require based on the number of characters in the Text. This is the average width of the font character in em. Some fonts have automatic metric applied based on their name, such as browser-safe fonts and those with names containing things like 'narrow' or 'mono'.",t:13,g:1}],f:["Metric ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1},{n:"tabindex",f:"-1",t:13,g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".font.metric"],s:"[(_0).set(\".font.metric\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".font.metric"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13},{n:"tabindex",f:"-1",t:13,g:1}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".font.metric.x\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".font.metric"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".font.metric.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".font.metric"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".font.metric"}],t:13}]}],n:51,l:1}]}]}],"container-props":[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"Render this container as a macro with its properties and/or children supplied at render time.",t:13,g:1}],f:["Macro ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".macro\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"span",f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".macro"}],t:13},{n:"tabout",f:0,t:13}]}]}]}]}," ",{t:19,f:[{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"If enabled, show the repeater header for this grouping of rows. You can use the @level reference to modify the header for different levels within the repeater.",t:13,g:1}],f:["Show Header?"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,rx:{r:"repeater.groupHeaders",m:[{r:["repeater.group.length","index"],s:"_0-1-_1"}]}}],t:13}]}]}]}],n:50,x:{r:["repeater.header","index","repeater.group"],s:"_0&&_2&&_2[_1]"}}," ",{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"If enabled, show the repeater footer for this grouping of rows. You can use the @level reference to modify the footer for different levels within the repeater.",t:13,g:1}],f:["Show Footer?"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,rx:{r:"repeater.groupEnds",m:[{r:["repeater.group.length","index"],s:"_0-1-_1"}]}}],t:13}]}]}]}],n:50,x:{r:["repeater.footer","index","repeater.group"],s:"_0&&_2&&_2[_1]"}}," ",{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"If enabled, the row will be rendered internally to update data gathered labels as rows render, but the row will not be added to the report.",t:13,g:1}],f:["Elide? ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1},{n:"tabindex",f:"-1",t:13,g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".elide"],s:"[(_0).set(\".elide\",typeof _1===\"object\"?false:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".elide"],s:"typeof _0===\"object\"?\"Change to Boolean\":\"Change to Expression\""}}],t:13},{n:"tabindex",f:"-1",t:13,g:1}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".elide.x\"),false]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".elide"],s:"typeof _0===\"object\"&&\"x\" in _0"}}," "]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:".elide"}],t:13}]}],n:50,x:{r:[".elide"],s:"typeof _0!==\"object\""}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".elide.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".elide"],s:"typeof _0===\"object\""},l:1}]}]}],n:50,x:{r:["repeater","index"],s:"_0&&_1===\"row\""}}],n:54,z:[{n:"repeater",x:{rx:{r:"~/",m:[{r:["@this","~/temp.widget"],s:"_0.split(_1,2)"}]}}},{n:"index",x:{x:{r:["@this","~/temp.widget"],s:"_0.lastKey(_1)"}}}]}," ",{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["If enabled, render the ",{t:2,x:{r:["@this","~/temp.widget"],s:"_0.lastKey(_1)"}}," at the outer edge of the page margin rather than within the inner boundaries of the page margin."],t:13}],f:["Render in margin?"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:".outer"}],t:13}]}]}]}],n:50,x:{r:["~/report.type","~/temp.widget","~/report.margin"],s:"_0===\"page\"&&(_1===\"report.header\"||_1===\"report.footer\")&&_2"}}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"Auto layout containers position their children from top to bottom, left to right, along the x axis, with children wrapping below the tallest child on the line above. Manual layout containers must have x and y coordinates specified for each child, allowing overlap and defaulting to 0, 0.",t:13,g:1}],f:["Layout"]},{t:7,e:"span",f:[" ",{t:7,e:"select",m:[{t:73,v:"t",f:"false"},{n:"value",f:[{t:2,x:{r:[".layout"],s:"Array.isArray(_0)?\"manual\":\"auto\""}}],t:13},{n:["change"],t:70,f:{r:["@context","@node.value","@this",".widgets.length"],s:"[(_0).set(\".layout\",_1===\"manual\"?_2.fillArray(_3):undefined)]"}}],f:[{t:7,e:"option",m:[{n:"value",f:"auto",t:13}],f:["Auto"]}," ",{t:7,e:"option",m:[{n:"value",f:"manual",t:13}],f:["Manual"]}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"If bridging is enabled, the container can span multiple pages.",t:13,g:1}],f:["Bridge Breaks?"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:".bridge"}],t:13}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"If supplied, this expression is evaluated and the result is added to the context stack in which the container and its children are rendered. If the initial value should be used as the context while side-effecting expressions are evaluated, the last expression in the context source should be _, @value, or a false-y value.",t:13,g:1}],f:["Context ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".context\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"span",f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".context"}],t:13},{n:"tabout",f:0,t:13}]}]}]}]}],"html-props":[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The html to appear in this HTML widget.",t:13,g:1}],f:["HTML ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".html\",{html:true})]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"span",f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".html"}],t:13},{n:"tabout",f:0,t:13},{n:"template",f:0,t:13}]}]}]}]}],"label-props":[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The text to appear in this label. This is an expression, so literal text will need to be specified as a string expression.",t:13,g:1}],f:["Text ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".text\",{label:true})]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"span",f:[{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:["click"],t:70,f:{r:["@context",".text","@this"],s:"[(_0).set(\".text\",_2.getPartStrings(_1)),_2.editExpr(\".text\",{label:true})]"}}],f:["Convert to Text"]}],n:50,x:{r:[".text"],s:"Array.isArray(_0)"}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".text"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:51,l:1}]}]}," ",{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The name to use to collect values that are computed in this label in each row. It is often useful to use the Format property to modify the display for this computed value, so that the raw value can be used for computations in the footer.",t:13,g:1}],f:["ID ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Remove aggregate id",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".id\",undefined)]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"times"}]}],n:50,x:{r:[".id"],s:"_0!=null"}},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:"title",f:"Add aggregate id",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".id\",\"\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:["+"]}],n:51,l:1}," "]},{t:7,e:"span",f:[{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".id"}],t:13}]}],n:50,x:{r:[".id"],s:"_0!=null"}}]}]}],n:50,x:{r:["@this","~/temp.widget"],s:"_0.inRepeater(_1)"}}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"Process the text of the label for inline styles.",t:13,g:1}],f:["Styled?"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:".styled"}],t:13}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The name of a formatter to apply to the computed Text value of this label.",t:13,g:1}],f:["Format ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1},{n:"tabindex",f:"-1",t:13,g:1}]},{t:4,f:[" ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Remove format",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".format\",undefined)]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"times"}]}],n:50,x:{r:[".format"],s:"_0!=null"}},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:"title",f:"Add format",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".format\",{})]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:["+"]}],n:51,l:1}," "]},{t:7,e:"span",f:[{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".format.name"}],t:13},{n:"style-width",f:"80%",t:13}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:"title",f:"Add parameter",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).push(\".format.args\",\"\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:["+"]}," ",{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"."}],t:13},{n:"style-width",f:"80%",t:13}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Remove parameter",t:13,g:1},{n:["click"],t:70,f:{r:["@context","@index"],s:"[(_0).splice(\"../\",_1,1)]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"times"}]}],n:52,r:".format.args"}],n:50,x:{r:[".format"],s:"_0!=null"}}]}]}],"margin-prop":[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["Additional padding within the borders of the ",{t:2,r:".type"},". The base value for this property is a four number tuple with values for the top, right, bottom, and left. A two number tuple is converted to top/bottom and left/right. A single number specifies the same number for all sides."],t:13}],f:["Margin ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1},{n:"tabindex",f:"-1",t:13,g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".margin.x\"),false]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".margin"],s:"typeof _0===\"object\"&&\"x\" in _0"}}," "]},{t:7,e:"span",f:[" ",{t:7,e:"div",m:[{t:13,n:"class",f:"toggles",g:1}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".margin"],s:"typeof _0===\"undefined\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".margin\",undefined)]"}}],n:50,x:{r:[".margin"],s:"typeof _0!==\"undefined\""}}],f:["None"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".margin"],s:"typeof _0===\"number\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".margin\",1)]"}}],n:50,x:{r:[".margin"],s:"typeof _0!==\"number\""}}],f:["All"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".margin.length"],s:"_0===2"}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".margin\",[1,1])]"}}],n:50,x:{r:[".margin.length"],s:"_0!==2"}}],f:["Paired"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".margin.length"],s:"_0===4"}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".margin\",[1,1,1,1])]"}}],n:50,x:{r:[".margin.length"],s:"_0!==4"}}],f:["Individual"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".margin"],s:"typeof _0===\"object\"&&\"x\" in _0"}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".margin\",{x:\"\"})]"}}],n:50,x:{r:[".margin",".margin.x"],s:"!_0||_1===undefined"}}],f:["Expression"]}]}," ",{t:4,f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{t:73,v:"l"},{n:"value",f:[{t:2,r:".margin"}],t:13}]}],n:50,x:{r:[".margin"],s:"typeof _0===\"number\""}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"sides",g:1}],f:[{t:7,e:"span"},{t:7,e:"input",m:[{t:73,v:"l"},{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".margin.0"}],t:13}]},{t:7,e:"span"}," ",{t:7,e:"span"},{t:7,e:"div",m:[{t:13,n:"class",f:"square",g:1}]},{t:7,e:"input",m:[{t:73,v:"l"},{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".margin.1"}],t:13}]}," ",{t:7,e:"span"},{t:7,e:"span"},{t:7,e:"span"}]}," "],n:50,x:{r:[".margin.length"],s:"_0===2"},l:1},{t:4,f:[" ",{t:7,e:"div",m:[{t:13,n:"class",f:"sides",g:1}],f:[{t:7,e:"span"},{t:7,e:"input",m:[{t:73,v:"l"},{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".margin.0"}],t:13}]},{t:7,e:"span"}," ",{t:7,e:"input",m:[{t:73,v:"l"},{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".margin.3"}],t:13}]},{t:7,e:"div",m:[{t:13,n:"class",f:"square",g:1}]},{t:7,e:"input",m:[{t:73,v:"l"},{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".margin.1"}],t:13}]}," ",{t:7,e:"span"},{t:7,e:"input",m:[{t:73,v:"l"},{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".margin.2"}],t:13}]},{t:7,e:"span"}]}," "],n:50,x:{r:[".margin.length"],s:"_0===4"},l:1},{t:4,f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".margin.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".margin.x"],s:"_0!==undefined"},l:1}]}]}],"page-props":[],project:[{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 1;",g:1},{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"delimited paper project",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"settings-pane",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"settings-pane-inner",g:1}],f:[{t:7,e:"h3",f:["Settings"]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1}],f:["Theme",{t:7,e:"br"},{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"~/settings.theme"}],t:13}],f:[" ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"undefined"}}],t:13}],f:["Auto"]}," ",{t:7,e:"option",m:[{n:"value",f:"dark",t:13}],f:["Dark"]}," ",{t:7,e:"option",m:[{n:"value",f:"light",t:13}],f:["Light"]}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1},{n:"title",f:"Select a theme for the rendered report output",t:13,g:1}],f:["Output Theme",{t:7,e:"br"},{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"~/settings.outTheme"}],t:13}],f:[" ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"undefined"}}],t:13}],f:["Follow Designer"]}," ",{t:7,e:"option",m:[{n:"value",f:"dark",t:13}],f:["Dark"]}," ",{t:7,e:"option",m:[{n:"value",f:"light",t:13}],f:["Light"]}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1},{n:"title",f:"Scale the UI to a percentage of the default indenpendently of browser zoom (default: 100)",t:13,g:1}],f:["UI Scaling",{t:7,e:"br"},{t:7,e:"div",m:[{t:13,n:"style",f:"float: right; line-height: 2.5em;",g:1}],f:["%"]},{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"step",f:"1",t:13},{n:"value",f:[{t:2,r:"~/settings.scale"}],t:13},{n:"style",f:"width: calc(100% - 1.5em)",t:13},{t:73,v:"l",f:"1000"}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1},{n:"title",f:"The width in rem of the left pane (default 28)",t:13,g:1}],f:["Left Pane Width",{t:7,e:"br"},{t:7,e:"div",m:[{t:13,n:"style",f:"float: right; line-height: 2.5em;",g:1}]},{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"step",f:"1",t:13},{n:"value",f:[{t:2,r:"~/settings.leftwidth"}],t:13},{t:73,v:"l",f:"1000"}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1},{n:"title",f:"The height in percent of the viewport of the bottom pane (default 33)",t:13,g:1}],f:["Bottom Pane Height",{t:7,e:"br"},{t:7,e:"div",m:[{t:13,n:"style",f:"float: right; line-height: 2.5em;",g:1}]},{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"step",f:"1",t:13},{n:"value",f:[{t:2,r:"~/settings.bottomheight"}],t:13},{t:73,v:"l",f:"1000"}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"check",g:1},{n:"title",f:"Automatically save an open project when leaving the page?",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:"~/settings.autosave"}],t:13}]}," Auto save on leave?"]}," ",{t:7,e:"br"},{t:7,e:"br"}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1},{n:"title",f:"The base wrap length for the code formatter (default 40)",t:13,g:1}],f:["Format Wrap",{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:"~/settings.format.wrap"}],t:13}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1},{n:"title",f:"The wrap length for the code formatter array literals",t:13,g:1}],f:["Array Wrap",{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:"~/settings.format.wrap_array"}],t:13}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1},{n:"title",f:"The wrap length for the code formatter for object literals",t:13,g:1}],f:["Object Wrap",{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:"~/settings.format.wrap_keys"}],t:13}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1},{n:"title",f:"The wrap length for the code formatter for operator arguments",t:13,g:1}],f:["Argument Wrap",{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:"~/settings.format.wrap_args"}],t:13}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1},{n:"title",f:"The wrap length for the code formatter for schema unions",t:13,g:1}],f:["Union Wrap",{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:"~/settings.format.wrap_union"}],t:13}]}]}," ",{t:4,f:[{t:7,e:"h3",m:[{t:13,n:"style",f:"margin-top: 1.5em;",g:1}],f:["Advanced Rendering Options"]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"check",g:1},{n:"title",f:"Attempt to run a rendered report as a delimited report. This finds the first repeater in the report, and if it has a named source, extracts any labels from the header and row to create a delimited report.",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:"~/settings.runopts.delimited"}],t:13}]}," Run as a delimited report?"]}," ",{t:4,f:[{t:7,e:"label",m:[{t:13,n:"class",f:"check",g:1},{n:"title",f:"Render the delimited report to an html table rather than as plain text.",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:"~/settings.runopts.table"}],t:13}]}," Output data as a table?"]}," ",{t:4,f:[{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1}],f:["Record Delimiter",{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"~/settings.runopts.record"}],t:13},{n:"placeholder",f:"\\n",t:13}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1}],f:["Field Delimiter",{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"~/settings.runopts.field"}],t:13},{n:"placeholder",f:",",t:13}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1}],f:["Field Quote",{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"~/settings.runopts.quote"}],t:13},{n:"placeholder",f:"(none)",t:13}]}]}],n:50,x:{r:["~/settings.runopts.table"],s:"!_0"}}],n:50,r:"~/settings.runopts.delimited"}],n:50,x:{r:["~/report.type"],s:"_0!==\"delimited\""}}]}]}," ",{t:7,e:"input",m:[{n:"type",f:"file",t:13},{n:"style",f:"display: none;",t:13},{n:"id",f:"project-file",t:13},{n:"accept",f:"application/json",t:13}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"project-pane",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"project-pane-left",g:1}],f:[{t:4,f:[{t:7,e:"div",f:[{t:7,e:"label",m:[{t:13,n:"style",f:"width: 20rem;",g:1},{t:13,n:"class",f:"input",g:1}],f:["Project Name",{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"~/project.name"}],t:13}]}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"title",f:"Save all projects to browser storage (CTRL+s)",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.saveProjects()]"}}],f:["Save Projects"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"title",f:"Export this project to a raport/JSON file",t:13,g:1},{n:["click"],t:70,f:{r:["~/project.name","@this"],s:"[_1.download(_0+\".raport-proj\",_1.stringifyProject())]"}}],f:["Export Project"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"title",f:"Create a copy of this project",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.cloneProject()]"}}],f:["Clone Project"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"title",f:"Import this project definition from a raport/JSON file",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.importProject(true)]"}}],f:["Import Project"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"title",f:"Create a new empty project",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.makeProject(true)]"}}],f:["New Project"]}," ",{t:7,e:"br"},{t:7,e:"br"}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"title",f:"Delete this project from browser storage",t:13,g:1},{n:"style-background",f:[{t:2,r:"@style.error"}],t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.removeProject()]"}}],f:["Delete Project"]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"style-background",f:[{t:2,r:"@style.error"}],t:13},{n:"title",f:"Discard changes to this project",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.resetProject()]"}}],f:["Discard Project Changes"]}],n:50,r:"~/projectChanged"},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"style-background",f:[{t:2,r:"@style.error"}],t:13},{n:"title",f:"Close this project",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.unlinkProject()]"}}],f:["Close Project"]}],n:51,l:1}," ",{t:7,e:"br"},{t:7,e:"br"}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"title",f:"Export this project as text to the below text field",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"projectText\",_0.stringifyProject())]"}}],f:["Refresh Text"]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"grow area",g:1}],f:["Project Definition",{t:7,e:"textarea",m:[{t:73,v:"t",f:"false"},{n:["change"],t:70,f:{r:["@this","@node.value"],s:"[_0.importProject(true,_1)]"}}],f:[{t:2,r:"projectText"}]}]}],n:50,x:{r:["~/project"],s:"_0!=null"}},{t:4,f:[{t:7,e:"div",f:[{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"title",f:"Convert the current definition to a project",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.makeProject()]"}}],f:["Make Project"]}]}],n:51,l:1}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"project-pane-right",g:1},{n:"title",f:"Click a project to load it",t:13,g:1}],f:["Projects ",{t:7,e:"div",m:[{t:13,n:"class",f:"project-list",g:1}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"project-item",g:1},{t:4,f:[{n:"class",f:"active-project",t:13},{n:"title",f:["Project ",{t:2,r:".name"}," is already loaded"],t:13}],n:50,x:{r:[".","~/project"],s:"_0===_1"}},{t:4,f:[{n:"title",f:["Load ",{t:2,r:".name"},", discarding any unsaved changes in the current project or definitions"],t:13},{n:["click"],t:70,f:{r:["@this","@keypath"],s:"[_0.linkProject(_1)]"}}],n:51,l:1}],f:[{t:2,r:".name"}]}],n:52,r:"~/projects"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.download(\"Raport Projects.json\",_0.stringifyProjects())]"}},{n:"title",f:"Export all projects to a JSON file",t:13,g:1}],f:["Export All Projects"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"style-background",f:[{t:2,r:"@style.error"}],t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.importProject()]"}},{n:"title",f:"Import multiple projects from a JSON file. Existing projects with the same name as an import will be overwritten.",t:13,g:1}],f:["Import Projects"]}]}]}],n:50,r:"~/showProjects"}]}]}]}],definition:[{t:7,e:"div",m:[{t:13,n:"class",f:"delimited paper",g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"file",t:13},{n:"style",f:"display: none;",t:13},{n:"id",f:"definition-file",t:13},{n:"accept",f:".raport,.json",t:13}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"definition",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"style",f:"flex-wrap: wrap;",g:1},{t:13,n:"class",f:"actions",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico text",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.loadReportFile()]"}},{n:"title",f:"Load report definition from a file",t:13,g:1}],f:["Load"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico text spacer",g:1},{n:["click"],t:70,f:{r:["~/report.name","@this","~/tmp.js","~/tmp.strings"],s:"[_1.download((_0||\"report\")+\".raport\",_1.reportToString(true,_2,_3))]"}},{n:"title",f:"Save report definition to a file",t:13,g:1}],f:["Save"]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"spacer",g:1},{n:"title",f:"Render the report definition in a compact format",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:"~/tmp.compact"}],t:13},{n:"style",f:"vertical-align: middle;",t:13}]}," Compact?"]}," ",{t:4,f:[{t:7,e:"label",m:[{t:13,n:"class",f:"spacer",g:1},{n:"title",f:"Render the report definition as JS rather than JSON",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:"~/tmp.js"}],t:13},{n:"style",f:"vertical-align: middle;",t:13}]}," JS?"]}],n:50,r:"~/tmp.compact"}," ",{t:4,f:[{t:7,e:"label",m:[{t:13,n:"class",f:"spacer",g:1},{n:"title",f:"Render report definition strings as JSON strings or template literals",t:13,g:1}],f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"~/tmp.strings"}],t:13}],f:[{t:7,e:"option",f:["json"]},{t:7,e:"option",f:["template"]}]}]}],n:50,r:"~/tmp.js"}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"spacer",g:1},{n:"title",f:"Switch the formatter into compact mode",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:"~/tmp.nowrap"}],t:13}]}," Compact format?"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico text",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.fmtAll()]"}},{n:"title",f:"Reformat all expressions",t:13,g:1}],f:["Format All"]}," ",{t:7,e:"button",m:[{t:13,n:"style",f:"margin-left: 2em;",g:1},{t:13,n:"class",f:"ico text",g:1},{n:["click"],t:70,f:{r:["@this","~/tmp.compact","~/tmp.js","~/tmp.strings"],s:"[_0.copyToClipboard(_0.reportToString(_1,_2,_3))]"}},{n:"title",f:"Copy definition to clipboard",t:13,g:1}],f:["Copy Text"]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"json",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"textarea",m:[{n:"invalidated",t:71},{n:["change","input","invalidate"],t:70,f:{r:["@this","@node"],s:"[_0.autosize(_1)]"}},{t:73,v:"t",f:"false"},{n:"value",f:[{t:2,x:{r:["@this","~/tmp.compact","~/tmp.js","~/tmp.strings"],s:"_0.reportToString(_1,_2,_3)"}}],t:13},{n:["change"],t:70,f:{r:["@node.value","@this"],s:"[_1.loadReportString(_0),_1.update(\"temp\")]"}}]}]}]}]}]}]}],context:[{t:7,e:"div",m:[{t:13,n:"class",f:"delimited paper",g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"file",t:13},{n:"style",f:"display: none;",t:13},{n:"id",f:"context-file",t:13},{n:"accept",f:"application/json",t:13}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"definition",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"actions",g:1}],f:[{t:7,e:"span",m:[{n:"title",f:"The root context to load for the report, which is available before sources are loaded. This must be JSON.",t:13,g:1}],f:["Base Context"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico text spacer",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.loadContextFile()]"}},{n:"title",f:"Import context from a file",t:13,g:1}],f:["Load"]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"json",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"textarea",m:[{n:"invalidated",t:71},{n:["input","invalidate"],t:70,f:{r:["@this","@node"],s:"[_0.autosize(_1)]"}},{n:["change"],t:70,f:{r:["@this","@node.value"],s:"[_0.tryContext(_1)]"}},{n:"tracked",t:71,f:{r:[],s:"[\"_contextText\"]"}}]}]}]}]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"margin-top: 2rem;",g:1},{n:"title",f:"An expreession that is evaluated in the root context before the report is run. This is a good place to run set operators to set up helper applications. Sources are loaded before this is evaluated.",t:13,g:1}],f:["Extra Context"]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"extra-context",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:"~/report.extraContext"}],t:13}]}]}]}]}]}]}],"data-import":[{t:7,e:"div",m:[{t:13,n:"class",f:"delimited import paper",g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"file",t:13},{n:"style",f:"display: none;",t:13},{n:"id",f:"import-file",t:13},{n:"accept",f:"*/*",t:13}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"definition",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"actions",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico text spacer",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.loadImportFile()]"}},{n:"title",f:"Import data from a file",t:13,g:1}],f:["Load"]}," ",{t:7,e:"label",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"style",f:"vertical-align: middle;",t:13},{n:"checked",f:[{t:2,x:{r:["data.type"],s:"_0===\"fetch\""}}],t:13},{t:73,v:"t",f:"false"},{n:["change"],t:70,f:{r:["@this","@node.checked"],s:"[_0.set(\"data.type\",_1?\"fetch\":undefined)]"}}]}," Fetch request?"]}," ",{t:7,e:"label",m:[{t:13,n:"style",f:"margin-left: 1em;",g:1},{n:"title",f:"If the data is delimited text, use the first record to convert the remaining records to objects with keys named the matching field offset header.",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"style",f:"vertical-align: middle;",t:13},{n:"checked",f:[{t:2,r:"data.header"}],t:13},{t:73,v:"t",f:"false"},{n:["change"],t:70,f:{r:["@node.checked","@this"],s:"[_1.set(\"data.header\",_0?1:undefined),_1.tryImport(_1.getImportText())]"}}]}," Delimited header?"]}]}," ",{t:4,f:[{t:7,e:"div",f:[{t:7,e:"label",f:[{t:7,e:"input",m:[{n:"type",f:"radio",t:13},{n:"style",f:"vertical-align: middle;",t:13},{n:"name",f:[{t:2,r:"data.eval"}],t:13},{n:"value",f:[{t:2,x:{r:[],s:"undefined"}}],t:13}]}," JSON"]}," ",{t:7,e:"label",f:[{t:7,e:"input",m:[{n:"type",f:"radio",t:13},{n:"style",f:"vertical-align: middle;",t:13},{n:"name",f:[{t:2,r:"data.eval"}],t:13},{n:"value",f:"txt",t:13}]}," Plain text"]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"fetch scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:4,f:[{t:7,e:"label",m:[{t:13,n:"style",f:"width: 26rem;",g:1},{t:13,n:"class",f:"input",g:1}],f:["URL ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@this","@keypath"],s:"[_0.editExpr(_1+\".url\",{template:true}),false]"}}],f:[{t:8,r:"pencil"}]},{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".url"}],t:13}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1}],f:["Method",{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".method"}],t:13}],f:[" ",{t:7,e:"option",f:["GET"]}," ",{t:7,e:"option",f:["POST"]}," ",{t:7,e:"option",f:["PUT"]}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"check",g:1},{n:"title",f:"Check if this source should be fetched before each run or leave unchecked if cached data can be used",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:".fetch"}],t:13}]}," Fetch on each run?"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).push(\".headers\",[])]"}}],f:["Add Header"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.fetchData()]"}}],f:["Fetch Now"]}," ",{t:4,f:[{t:7,e:"h3",f:["Headers"]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"fetch-header",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Remove header",t:13,g:1},{n:["click"],t:70,f:{r:["@context","@index"],s:"[(_0).splice(\"../\",_1,1)]"}}],f:[{t:8,r:"times"}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1}],f:["Header",{t:7,e:"input",m:[{n:"value",f:[{t:2,rx:{r:".",m:[{r:[],s:"0"}]}}],t:13}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1}],f:["Value ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@this","@keypath"],s:"[_0.editExpr(_1+\".1\",{template:true}),false]"}}],f:[{t:8,r:"pencil"}]},{t:7,e:"input",m:[{n:"value",f:[{t:2,rx:{r:".",m:[{r:[],s:"1"}]}}],t:13}]}]}]}],n:52,r:".headers"}],n:50,r:".headers"}," ",{t:4,f:[{t:7,e:"label",m:[{t:13,n:"class",f:"area",g:1}],f:["Body ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@this","@keypath"],s:"[_0.editExpr(_1+\".body\",{template:true}),false]"}}],f:[{t:8,r:"pencil"}]},{t:7,e:"textarea",f:[{t:2,r:".body"}]}]}],n:50,x:{r:[".method"],s:"_0!==\"GET\""}}],n:54,r:"data"}]}]}],n:50,x:{r:["data.type"],s:"_0===\"fetch\""}}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"position: relative;",g:1},{t:13,n:"class",f:"json",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"textarea",m:[{n:"invalidated",t:71},{n:["change","input","invalidate","focus","blur"],t:70,f:{r:["@this","@node"],s:"[_0.autosize(_1)]"}},{n:"tracked",t:71,f:{r:[],s:"[\"_importText\"]"}},{n:["change","input"],t:70,f:{r:["@this","@event"],s:"[_0.set(\"_importdirty\",true),console.log(\"change\",_1)]"}}]}]}]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"style",f:"position: absolute; top: 0.5em; right: 0.5em;",g:1},{t:13,n:"class",f:"plain",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.tryImport(_0.getImportText()),_0.set(\"_importdirty\",false)]"}}],f:["Apply Changes"]}],n:50,r:"~/_importdirty"}]}]}]}],design:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 1;",g:1},{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 3rem; min-width: min-content;",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"delimited paper",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"widget active-widget",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"bar",g:1}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"name",g:1}],f:["Report"]}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.addHeader()]"}}],f:["Add Header"]}],n:50,x:{r:["report.headers"],s:"!_0"}},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"report.headers\",undefined)]"}}],f:["Remove Header"]}],n:51,l:1}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"children",g:1}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"widget hover-widget",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"bar",g:1}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"name",g:1}],f:["Header"]}," ",{t:7,e:"button",m:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.push(\"report.headers\",\"\"),_0.push(\"report.fields\",\"\")]"}}],f:["Add Field"]}," ",{t:4,f:[{t:7,e:"button",m:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.fillBlankDelimitedHeaders()]"}},{n:"title",f:"Fill any blank headers with the corresponding field expression",t:13,g:1}],f:["Fill Blanks"]}],n:50,r:"~/blankDelimitedHeaders"}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"children fields",g:1}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"field",g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.editExpr((_1),{template:true})]"}},{n:"class-active-expr",t:13,f:[{t:2,x:{r:["~/temp.expr.path","@keypath"],s:"_0===_1"}}]},{n:"expr",t:71,f:{r:[],s:"[true]"}}],f:[{t:7,e:"span",f:[{t:2,r:"."}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Remove this field",t:13,g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.removeWidget((_1)),false]"}}],f:[{t:8,r:"times"}]}]}],n:52,r:"report.headers"}]}]}],n:50,x:{r:["~/report.headers"],s:"!!_0"}}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"widget hover-widget",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"bar",g:1}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"name",g:1}],f:["Row"]}," ",{t:7,e:"button",m:[{n:["click"],t:70,f:{r:["~/report.headers","@this"],s:"[_1.push(\"report.fields\",\"\"),_0&&_1.push(\"report.headers\",\"\")]"}}],f:["Add Field"]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"children fields",g:1}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"field",g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.editExpr((_1))]"}},{n:"class-active-expr",t:13,f:[{t:2,x:{r:["~/temp.expr.path","@keypath"],s:"_0===_1"}}]},{n:"expr",t:71}],f:[{t:7,e:"span",f:[{t:2,r:"."}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Remove this field",t:13,g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.removeWidget((_1)),false]"}}],f:[{t:8,r:"times"}]}]}],n:52,r:"report.fields"}]}]}]}]}]}]}]}]}],n:50,x:{r:["report.type"],s:"_0===\"delimited\""}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 1;",g:1},{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 3rem; min-width: min-content;",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"paper",g:1},{n:"style",f:[{t:2,x:{r:["@this"],s:"_0.paperSize()"}}],t:13},{n:["click"],t:70,f:{r:["@event.target","@node","@this","~/inOverlay","~/inWatermark"],s:"[_0===_1?_2.selectWidget(_3?\"report.overlay\":_4?\"report.watermark\":\"report\"):true]"}},{n:["mouseleave"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.hover\",\"\"),false]"}},{n:["mousemove"],t:70,f:{r:["~/shiftKey","@this","@event.shiftKey"],s:"[_2!==_0?_1.set(\"shiftKey\",_2):\"\"]"}},{n:"class-shiftKey",t:13,f:[{t:2,r:"~/shiftKey"}]}],f:[{t:7,e:"div",m:[{t:13,n:"style",f:"cursor: pointer; z-index: 9;",g:1},{t:13,n:"class",f:"bar report-paper",g:1},{n:["click"],t:70,f:{r:["@this","~/inOverlay","~/inWatermark","~/temp.tree"],s:"[_0.unlink(\"widget\"),_0.unlink(\"expr\"),_0.set(\"temp\",{name:\"report \",widget:_1?\"report.overlay\":_2?\"report.watermark\":\"report\",tree:_3})]"}},{n:"class-active",t:13,f:[{t:2,x:{r:["temp.widget"],s:"_0===\"report\"||_0===\"report.watermark\"||_0===\"report.overlay\""}}]},{n:"class-hover",t:13,f:[{t:2,x:{r:["temp.hover"],s:"_0===\"report\"||_0===\"report.watermark\"||_0===\"report.overlay\""}}]},{n:["mouseover"],t:70,f:{r:["@this","~/inWatermark","~/inOverlay"],s:"[_0.set(\"temp.hover\",_1?\"report.watermark\":_2?\"report.overlay\":\"report\"),false]"}},{n:["mouseleave"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.hover\",\"\"),false]"}}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"name",g:1}],f:[{t:4,f:["Watermark"],n:50,r:"~/inWatermark"},{t:4,f:["Overlay "],n:50,r:"~/inOverlay",l:1},{t:4,f:["Report"],n:51,l:1}]}," ",{t:4,f:[{t:4,f:[{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"report.header\",undefined),_0.unlink(\"widget\"),_0.set(\"temp.widget\",\"\")]"}},{n:"title",f:"The page header takes a fixed amount of space at the top of every page",t:13,g:1}],f:["Remove page header"]}],n:50,r:"report.header"},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"report.header\",{type:\"container\"})]"}},{n:"title",f:"The page header takes a fixed amount of space at the top of every page",t:13,g:1}],f:["Add page header"]}],n:51,l:1}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"report.footer\",undefined),_0.unlink(\"widget\"),_0.set(\"temp.widget\",\"\")]"}},{n:"title",f:"The page footer takes a fixed amount of space at the bottom of every page",t:13,g:1}],f:["Remove page footer"]}],n:50,r:"report.footer"},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"report.footer\",{type:\"container\"})]"}},{n:"title",f:"The page footer takes a fixed amount of space at the bottom of every page",t:13,g:1}],f:["Add page footer"]}],n:51,l:1}],n:50,x:{r:["~/temp.widget"],s:"!_0||!/^report.(water|overlay)/.test(_0)"}}],n:50,x:{r:["report.type"],s:"_0===\"page\""}}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"report.watermark\",undefined),_0.unlink(\"widget\"),_0.set(\"temp.widget\",\"\")]"}},{n:"title",f:"The watermark content is layered beneath the contents of each page",t:13,g:1}],f:["Remove watermark"]}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.link(\"report.watermark\",\"widget\"),_0.set(\"temp.widget\",\"report.watermark\"),false]"}},{n:"title",f:"Switch the designer to the watermark view",t:13,g:1}],f:["Edit watermark"]}],n:51,r:"~/inWatermark"}],n:50,r:"report.watermark"},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"report.watermark\",{type:\"container\"}),_0.link(\"report.watermark\",\"widget\"),_0.set(\"temp.widget\",\"report.watermark\"),false]"}},{n:"title",f:"The watermark content is layered beneath the contents of each page",t:13,g:1}],f:["Add watermark"]}],n:51,l:1}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"report.overlay\",undefined),_0.unlink(\"widget\"),_0.set(\"temp.widget\",\"\")]"}},{n:"title",f:"The overlay content is layered above the conents of each page",t:13,g:1}],f:["Remove overlay"]}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.link(\"report.overlay\",\"widget\"),_0.set(\"temp.widget\",\"report.overlay\"),false]"}},{n:"title",f:"Switch the designer to the overlay view",t:13,g:1}],f:["Edit overlay"]}],n:51,r:"~/inOverlay"}],n:50,r:"report.overlay"},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"report.overlay\",{type:\"container\"}),_0.link(\"report.overlay\",\"widget\"),_0.set(\"temp.widget\",\"report.overlay\"),false]"}},{n:"title",f:"The overlay content is layered above the conents of each page",t:13,g:1}],f:["Add overlay"]}],n:51,l:1}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.unlink(\"widget\"),_0.set(\"temp.widget\",\"\")]"}}],f:["Edit report"]}],n:50,x:{r:["~/temp.widget"],s:"/^report.(water|overlay)/.test(_0)"}}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"widgets",g:1},{n:"class-manual",t:13,f:[{t:2,x:{r:["~/report.watermark.layout"],s:"Array.isArray(_0)"}}]}],f:[{t:4,f:[{t:4,f:[{t:8,r:"widget"}],n:52,r:".widgets"}],n:54,r:"~/report.watermark"}]}],n:50,x:{r:["~/temp.widget"],s:"/^report.water/.test(_0)"}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"widgets",g:1},{n:"class-manual",t:13,f:[{t:2,x:{r:["~/report.overlay.layout"],s:"Array.isArray(_0)"}}]}],f:[{t:4,f:[{t:4,f:[{t:8,r:"widget"}],n:52,r:".widgets"}],n:54,r:"~/report.overlay"}]}," "],n:50,x:{r:["~/temp.widget"],s:"/^report.overlay/.test(_0)"},l:1},{t:4,f:[" ",{t:4,f:[{t:8,r:"widget",c:{r:"~/report.header"},z:[{n:"label",x:{x:{r:[],s:"\"Page Header\""}}}]}],n:50,x:{r:["~/report.type","~/report.header"],s:"_0===\"page\"&&_1"}}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"widgets",g:1},{n:"class-manual",t:13,f:[{t:2,x:{r:["~/report.layout"],s:"Array.isArray(_0)"}}]}],f:[{t:4,f:[{t:4,f:[{t:8,r:"widget"}],n:52,r:".widgets"}],n:54,r:"~/report"}]}," ",{t:4,f:[{t:8,r:"widget",c:{r:"~/report.footer"},z:[{n:"label",x:{x:{r:[],s:"\"Page Footer\""}}}]}],n:50,x:{r:["~/report.type","~/report.footer"],s:"_0===\"page\"&&_1"}}],n:51,l:1}]}]}]}]}],n:51,l:1}],left:[{t:7,e:"div",m:[{t:13,n:"class",f:"left-bar",g:1}],f:[{t:7,e:"button",m:[{n:"class",f:["large ico ",{t:2,x:{r:["~/show.props"],s:"_0?\"left\":\"right\""}},"-arrow"],t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.toggle(\"show.props\")]"}},{n:"title",f:[{t:4,f:["Hide"],n:50,r:"~/show.props"},{t:4,f:["Show"],n:51,l:1}," the left pane"],t:13}],f:[{t:8,r:"arrow"}]}," ",{t:7,e:"button",m:[{n:"class",f:["large ico ",{t:2,x:{r:["~/show.hidetree"],s:"_0?\"off\":\"\""}}],t:13},{t:4,f:[{n:["click"],t:70,f:{r:["~/show.hidetree","~/show.hideprops","@this"],s:"[_2.toggle(\"show.hidetree\"),!_0&&_1?_2.set(\"show.hideprops\",false):\"\"]"}},{n:"title",f:[{t:4,f:["Show"],n:50,r:"~/show.hidetree"},{t:4,f:["Hide"],n:51,l:1}," widget tree"],t:13}],n:50,r:"~/show.props"},{t:4,f:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.toggle(\"show.props\"),_0.set(\"show.hidetree\",false),_0.set(\"show.hideprops\",true)]"}},{n:"title",f:"Show the left pane with only the widget tree",t:13}],n:51,l:1}],f:[{t:8,r:"tree"}]}," ",{t:7,e:"button",m:[{n:"class",f:["large ico ",{t:2,x:{r:["~/show.hideprops"],s:"_0?\"off\":\"\""}}],t:13},{t:4,f:[{n:["click"],t:70,f:{r:["~/show.hideprops","~/show.hidetree","@this"],s:"[_2.toggle(\"show.hideprops\"),!_0&&_1?_2.set(\"show.hidetree\",false):\"\"]"}},{n:"title",f:[{t:4,f:["Show"],n:50,r:"~/show.hideprops"},{t:4,f:["Hide"],n:51,l:1}," widget properties"],t:13}],n:50,r:"~/show.props"},{t:4,f:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.toggle(\"show.props\"),_0.set(\"show.hidetree\",true),_0.set(\"show.hideprops\",false)]"}},{n:"title",f:"Show the left pane with only widget properties",t:13}],n:51,l:1}],f:[{t:8,r:"cog"}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"left properties left-pop",g:1},{n:"class-popped",t:13,f:[{t:2,r:"~/show.props"}]}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"height: 3rem; margin-top: 0;",g:1},{t:13,n:"class",f:"header",g:1}],f:[{t:7,e:"h3",f:[{t:4,f:["Moving..."],n:50,r:"~/reparent"},{t:4,f:["Widgets"],n:51,l:1}]}," ",{t:4,f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"~/add"}],t:13},{n:["change"],t:70,f:{r:["@this","@node.value"],s:"[_0.addWidget(_1)]"}}],f:[{t:7,e:"option",f:["container"]}," ",{t:7,e:"option",f:["label"]}," ",{t:7,e:"option",f:["repeater"]}," ",{t:7,e:"option",f:["html"]}," ",{t:7,e:"option",f:["image"]}," ",{t:7,e:"option",f:["measured"]}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"add",g:1},{n:"title",f:["Add ",{t:2,r:"~/add"}," to ",{t:2,r:"~/temp.widget"}],t:13},{n:["click"],t:70,f:{r:["@this","~/add"],s:"[_0.addWidget(_1)]"}}],f:["+"]}],n:50,x:{r:["~/report.type","~/widget.type","~/temp.widget"],s:"_0!==\"delimited\"&&(_1===\"container\"||_2===\"report\")"}}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"copy\",undefined)]"}},{n:"title",f:"Cancel copy [Esc]",t:13,g:1}],f:[{t:8,r:"copy",z:[{n:"cancel",x:{x:{r:[],s:"true"}}}]}]}],n:50,r:"~/copy"}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"reparent\",undefined)]"}},{n:"title",f:"Cancel move [Esc]",t:13,g:1}],f:[{t:8,r:"reparent",z:[{n:"cancel",x:{x:{r:[],s:"true"}}}]}]}],n:50,r:"~/reparent"}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.treeScrollToActive()]"}},{n:"title",f:"Scroll active widget into view",t:13,g:1}],f:[{t:8,r:"scrollto"}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"scrolled-wrapper widget-tree",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"tree",g:1},{n:"scrolled",t:71},{n:["mouseout"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.hover\",\"\"),false]"}}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"node",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.widget"],s:"_0===\"report\""}}]},{n:"class-hover",t:13,f:[{t:2,x:{r:["~/temp.hover"],s:"_0===\"report\""}}]},{n:["click"],t:70,f:{r:["~/reparent","~/copy","@context","@this"],s:"[_0?_3.reparent((_2)):_1?_3.paste((_2)):_3.selectWidget(\"report\")]"}},{n:"title",f:[{t:4,f:[{t:4,f:["Click to move the selected field to the end of the field list",{t:2,x:{r:[],s:"\"\\n\""}}],n:50,x:{r:[".type"],s:"_0===\"delimited\""}},{t:4,f:["Click to move the widget to the end of this container",{t:2,x:{r:[],s:"\"\\n\""}}],n:51,l:1}],n:50,r:"~/reparent"},{t:4,f:[{t:4,f:["Click to add a copy of the selected field to the end of the field list",{t:2,x:{r:[],s:"\"\\n\""}}],n:50,x:{r:[".type"],s:"_0===\"delimited\""}},{t:4,f:["Click to add a copy of the widget to this container",{t:2,x:{r:[],s:"\"\\n\""}}],n:51,l:1}],n:50,r:"~/copy",l:1},"Path: ",{t:2,r:"@keypath"}],t:13}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"line",g:1},{n:["mouseover"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.hover\",\"report\"),false]"}}],f:["Report ",{t:7,e:"span",m:[{t:13,n:"class",f:"actions",g:1}],f:[{t:4,f:[{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Add page header",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".header\",{type:\"container\"}),false]"}}],f:["+H"]}],n:50,x:{r:[".header"],s:"!_0"}}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Add page footer",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".footer\",{type:\"container\"}),false]"}}],f:["+F"]}],n:50,x:{r:[".footer"],s:"!_0"}}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Add page watermark",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".watermark\",{type:\"container\"}),false]"}}],f:["+W"]}],n:50,x:{r:[".watermark"],s:"!_0"}}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Add page overlay",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".overlay\",{type:\"container\"}),false]"}}],f:["+O"]}],n:50,x:{r:[".overlay"],s:"!_0"}}],n:50,x:{r:[".type"],s:"_0!=\"delimited\""}},{t:4,f:[{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Add headers",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.addHeader(),false]"}}],f:["+H"]}],n:50,x:{r:[".headers"],s:"!_0"}}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Add field",t:13,g:1},{n:["click"],t:70,f:{r:[".headers","@this"],s:"[_1.push(\"report.fields\",\"\"),_0&&_1.push(\"report.headers\",\"\"),false]"}}],f:["+F"]}],n:51,l:1}]}]}," ",{t:4,f:[{t:8,r:"delimited-fields"}],n:50,x:{r:["report.type"],s:"_0===\"delimited\""}},{t:4,f:[{t:8,r:"widget-tree"}],n:51,l:1}]}],n:54,r:"report"}]}]}],n:50,x:{r:["~/show.hidetree"],s:"!_0"}}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"header",g:1}],f:[{t:7,e:"h3",f:[{t:2,x:{r:["~/temp.name.0"],s:"_0.toUpperCase()"}},{t:2,x:{r:["~/temp.name"],s:"_0.substr(1)"}}," Properties"]}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"growy",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"sheet",g:1}],f:[{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{t:4,f:[{n:"title",f:[{t:2,r:".tip"}],t:13}],n:50,r:".tip"}],f:[{t:2,x:{r:[".label",".name"],s:"_0||_1"}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,rx:{r:"~/report",m:[{t:30,n:".name"}]}}],t:13}]}],n:50,x:{r:[".type"],s:"_0===\"boolean\""}},{t:4,f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,rx:{r:"~/report",m:[{t:30,n:".name"}]}}],t:13}]}," "],n:50,x:{r:[".type"],s:"_0===\"number\""},l:1},{t:4,f:[" ",{t:7,e:"select",m:[{n:"value",f:[{t:2,rx:{r:"~/report",m:[{t:30,n:".name"}]}}],t:13}],f:[{t:4,f:[{t:4,f:[{t:7,e:"option",f:[{t:2,r:"."}]}],n:50,x:{r:["."],s:"typeof _0===\"string\""}},{t:4,f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,r:".value"}],t:13}],f:[{t:2,r:".label"}]}],n:51,l:1}],n:52,r:".options"}]}," "],n:50,r:".options.length",l:1},{t:4,f:[" ",{t:7,e:"input",m:[{n:"value",f:[{t:2,rx:{r:"~/report",m:[{t:30,n:".name"}]}}],t:13}]}],n:51,l:1}]}]}],n:52,r:"~/extraProperties"}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The name of this report, which is used for naming files. This is a template, so it must use mustache interpolators for variables.",t:13,g:1}],f:["Name ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\"report.name\",{template:true}),false]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"span",f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:"report.name"}],t:13},{n:"tabout",f:0,t:13},{n:"template",f:0,t:13}]}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"Paged reports are rendered in consectutive, fixed-size pages. Flowed reports are rendered in a continuous container, which does not allow height fit on immediate child widgets or negative offsets. Delimited reports render delimited text only e.g. CSV.",t:13,g:1}],f:["Type"]},{t:7,e:"span",f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"report.type"}],t:13}],f:[{t:7,e:"option",m:[{n:"value",f:"page",t:13}],f:["Paged"]}," ",{t:7,e:"option",m:[{n:"value",f:"flow",t:13}],f:["Continuous"]}," ",{t:7,e:"option",m:[{n:"value",f:"delimited",t:13}],f:["Delimited"]}]}]}]}," ",{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"When enabled, widgets will have as few inline styles as possible with common style sets combined into classes. This can significantly reduce the resuling HTML from a report run.",t:13,g:1}],f:["Combine styles into classes?"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,x:{r:["report.classifyStyles"],s:"_0!==false"}}],t:13},{t:73,v:"t",f:"false"},{n:["change"],t:70,f:{r:["@this","@node.checked"],s:"[_0.set(\"report.classifyStyles\",_1?undefined:false)]"}}]}]}]}," ",{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The size of the page for this report.",t:13,g:1}],f:["Paper size"]},{t:7,e:"span",f:[{t:7,e:"select",m:[{n:["change"],t:70,f:{r:["@this","@node.value","~/pageSizes"],s:"[_0.set(\"report.size\",_2[_1])]"}}],f:[{t:4,f:[{t:7,e:"option",m:[{n:"selected",f:[{t:2,x:{r:[".","report.size"],s:"JSON.stringify(_0)===JSON.stringify(_1)"}}],t:13}],f:[{t:2,r:"@key"}]}],n:52,r:"~/pageSizes"}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The orientation of the page for this report.",t:13,g:1}],f:["Orientation"]},{t:7,e:"span",f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"report.orientation"}],t:13}],f:[{t:7,e:"option",f:["landscape"]}," ",{t:7,e:"option",f:["portrait"]}]}]}]}],n:50,x:{r:["report.type"],s:"_0===\"page\""}},{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"An optional width in rem for this report.",t:13,g:1}],f:["Width"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:"report.width"}],t:13}]}]}]}," ",{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"An optional width for this report if not specified directly in rem.",t:13,g:1}],f:["Paper size"]},{t:7,e:"span",f:[{t:7,e:"select",m:[{n:["change"],t:70,f:{r:["@this","@node.value","~/pageSizes"],s:"[_0.set(\"report.size\",_2[_1])]"}}],f:[{t:7,e:"option",m:[{n:"selected",f:[{t:2,x:{r:["report.size"],s:"!_0"}}],t:13}],f:["(None)"]},{t:4,f:[{t:7,e:"option",m:[{n:"selected",f:[{t:2,x:{r:[".","report.size"],s:"JSON.stringify(_0)===JSON.stringify(_1)"}}],t:13}],f:[{t:2,r:"@key"}]}],n:52,r:"~/pageSizes"}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The orientation of the paper specifying the width for this report.",t:13,g:1}],f:["Orientation"]},{t:7,e:"span",f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"report.orientation"}],t:13}],f:[{t:7,e:"option",f:["landscape"]}," ",{t:7,e:"option",f:["portrait"]}]}]}]}],n:50,x:{r:["report.width"],s:"!_0"}}],n:51,l:1}," ",{t:8,r:"margin-prop",c:{r:"report"}}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The base text size in rem for all widgets in this report.",t:13,g:1}],f:["Text Size"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:"~/report.font.size"}],t:13}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The base line hieght in rem for all widgets in this report.",t:13,g:1}],f:["Line Height"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:"~/report.font.line"}],t:13}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The base font family for all widgets in this report.",t:13,g:1}],f:["Font Family"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"~/report.font.family"}],t:13}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The base text color for all widgets in this report.",t:13,g:1}],f:["Text Color"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"~/report.font.color"}],t:13}]}]}]}],n:50,x:{r:["report.type"],s:"_0!==\"delimited\""}},{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The primary source used as the basis for the report.",t:13,g:1}],f:["Primary Source"]},{t:7,e:"span",f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"report.source"}],t:13}],f:[{t:4,f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,r:".value"}],t:13}],f:[{t:2,r:".label"}]}],n:52,r:"~/sourceNames"}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The string to render between records, defaulting to '\\n'.",t:13,g:1}],f:["Record Delimiter"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"temp.record"}],t:13}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The string to render between fields, defaulting to ','.",t:13,g:1}],f:["Field Delimiter"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"temp.field"}],t:13}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The quote character to render around field values, defaulting to none.",t:13,g:1}],f:["Quote"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"temp.quote"}],t:13}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"If supplied, this expression is evaluated and the result replaces the value in the context in which the fields in the record are evaluated. If the initial value should be used while side-effecting expressions are evaluated, the last expression in the context source should be, _, @value, or a false-y value .",t:13,g:1}],f:["Row Context ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\"report.rowContext\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"span",f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:"report.rowContext"}],t:13},{n:"tabout",f:0,t:13}]}]}]}]}],n:51,l:1}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"header",g:1}],f:[{t:7,e:"h3",m:[{n:"title",f:"Define parameters that can be collected, passed into the report, and referenced as !name",t:13,g:1}],f:["Parameters"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"add",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.push(\"report.parameters\",{})]"}},{n:"title",f:"Add parameter",t:13,g:1}],f:["+"]}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"parameter head",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"param-name",g:1}],f:["Name"]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"param-type",g:1}],f:["Type"]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"width: 30%;",g:1},{t:13,n:"class",f:"param-require",g:1}],f:["Require"]}]}],n:50,r:"report.parameters"}," ",{t:7,e:"div",f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"parameter",g:1},{n:["focusin"],t:70,f:{r:["@this","@context"],s:"[_0.editParam((_1))]"}}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"param-name",g:1}],f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".name"}],t:13}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"param-type",g:1}],f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".type"}],t:13}],f:[{t:8,r:"types"}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"param-require",g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:".required"}],t:13}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"param-btn",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@this","@keypath","@context","@index"],s:"[_0.checkLink(\"param\",_1),(_2).splice(\"../\",_3,1)]"}}],f:[{t:8,r:"times"}]}]}]}],n:52,r:"report.parameters"}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"header",g:1}],f:[{t:7,e:"h3",m:[{n:"title",f:"Define data sources that are available in the designer",t:13,g:1}],f:["Provided Sources"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"add",g:1},{n:["click"],t:70,f:{r:["~/actions"],s:"[_0.provideSource()]"}},{n:"title",f:"Add provided source",t:13,g:1}],f:["+"]}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"src head",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"src-name",g:1}],f:["Name"]}]}],n:50,r:"~/sources"}," ",{t:7,e:"div",f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"src",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"src-name",g:1}],f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".name"}],t:13},{n:"disabled",f:[{t:2,x:{r:["~/showProjects"],s:"_0===false"}}],t:13}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"src-btn",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:"title",f:"Import data...",t:13,g:1},{n:["click"],t:70,f:{r:["~/actions","@context"],s:"[_0.editProvidedSource((_1))]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:"title",f:"Log data to console...",t:13,g:1},{n:["click"],t:70,f:{r:["@this","."],s:"[_0.logData(_1)]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,x:{r:[],s:"\"console\""}}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:["click"],t:70,f:{r:["@this","@keypath","@context","@index"],s:"[_0.checkLink(\"import\",_1),(_2).splice(\"../\",_3,1)]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"times"}]}]}]}],n:52,r:"~/sources"}]}],n:50,r:"~/sources"},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"justify-content: center;",g:1},{t:13,n:"class",f:"header",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:["click"],t:70,f:{r:["~/actions"],s:"[_0.provideSource()]"}},{n:"title",f:"Create a new source of data to reference from a report source",t:13,g:1}],f:["Provide Source"]}]}],n:51,l:1}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"header",g:1}],f:[{t:7,e:"h3",m:[{n:"title",f:"Define data sources that will be available in the report and will pull from provided sources or a base value",t:13,g:1}],f:["Sources"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"add",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.push(\"report.sources\",{name:\"\",parameters:{}})]"}},{n:"title",f:"Add source",t:13,g:1}],f:["+"]}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"src head",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"style",f:"width: 100%;",g:1},{t:13,n:"class",f:"src-name",g:1}],f:["Name"]}]}],n:50,r:"report.sources.length"}," ",{t:7,e:"div",f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"src",g:1},{n:["focusin"],t:70,f:{r:["@this","@context"],s:"[_0.editReportSrc((_1))]"}}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rsrc-name",g:1}],f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".name"}],t:13}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"rsrc-src",g:1}],f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".source"}],t:13}],f:[{t:4,f:[{t:7,e:"option",f:[{t:2,r:".name"}]}],n:52,r:"~/sources"}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"rsrc-btn",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@this","@keypath","@context","@index"],s:"[_0.checkLink(\"source\",_1),(_2).splice(\"../\",_3,1)]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"times"}]}]}]}],n:52,r:"report.sources"}]}],n:50,x:{r:["~/temp.widget"],s:"_0===\"report\""}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"sheet",g:1}],f:[{t:4,f:[{t:8,x:{r:[".type"],s:"_0+\"-props\""}}," ",{t:8,r:"widget-props"}],n:54,r:"~/widget"}]}]}]}],n:50,r:"~/widget",l:1}]}]}],n:50,x:{r:["~/temp.widget","~/show.hideprops"],s:"_0&&!_1"}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"placeholder",g:1}],f:["Click on a Widget"]}],n:50,x:{r:["~/show.hideprops"],s:"!_0"},l:1}]}],"delimited-fields":[{t:7,e:"div",m:[{t:13,n:"class",f:"delimited children",g:1}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"node",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["@keypath","~/temp.expr.path"],s:"_0===_1"}}]},{n:"class-hover",t:13,f:[{t:2,x:{r:["@keypath","~/temp.expr.hover"],s:"_0===_1"}}]},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.clickWidget((_1))]"}},{n:"title",f:[{t:2,x:{r:["~/reparent"],s:"_0?\"Click to move the selected field above this field\\n\":\"\""}},{t:2,x:{r:["~/copy"],s:"_0?\"Click to paste a copy of the selected field above this field\\n\":\"\""}},"Path: ",{t:2,r:"@keypath"}],t:13}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"line",g:1},{n:["mouseover"],t:70,f:{r:["@this","@keypath"],s:"[_0.set(\"temp.expr.hover\",_1),false]"}},{n:["mouseout"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.hover\",\"\"),false]"}}],f:[{t:7,e:"span",f:[{t:2,x:{r:["@index"],s:"_0+1"}},". ",{t:4,f:[{t:2,rx:{r:"^^/headers",m:[{t:30,n:"@index"}]}}," (",{t:2,r:"."},")"],n:50,rx:{r:"^^/headers",m:[{t:30,n:"@index"}]}},{t:4,f:[{t:2,r:"."}],n:51,l:1}]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"actions",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Copy field",t:13,g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.set(\"copy\",(_1)),false]"}}],f:[{t:8,r:"copy"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Move field",t:13,g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.set(\"reparent\",(_1)),false]"}}],f:[{t:8,r:"reparent"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico field up-arrow",g:1},{n:"title",f:"Move up (hold the shift key to move to first)",t:13,g:1},{n:"disabled",f:[{t:2,x:{r:["@index"],s:"_0===0"}}],t:13},{n:["click"],t:70,f:{r:["@this","@context","~/report.headers","@index","@event.shiftKey"],s:"[_0.moveUp((_1),[\"../\",_2?\"~/report.headers\":undefined],_3,_4),false]"}}],f:[{t:8,r:"arrow"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico field down-arrow",g:1},{n:"title",f:"Move down (hold the shift key to move to last)",t:13,g:1},{n:"disabled",f:[{t:2,x:{r:["@index","@last"],s:"_0===_1"}}],t:13},{n:["click"],t:70,f:{r:["@this","@context","~/report.headers","@index","@event.shiftKey"],s:"[_0.moveDown((_1),[\"../\",_2?\"~/report.headers\":undefined],_3,_4),false]"}}],f:[{t:8,r:"arrow"}]}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico field remove",g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.removeWidget((_1))]"}}],f:[{t:8,r:"times"}]}]}]}],n:52,r:".fields"}]}],"widget-tree":[{t:7,e:"div",m:[{t:13,n:"class",f:"children",g:1}],f:[{t:4,f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"node",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.widget","@keypath"],s:"_0===_1"}}]},{n:"class-hover",t:13,f:[{t:2,x:{r:["~/temp.hover","@keypath"],s:"_0===_1"}}]},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.clickWidget((_1))]"}},{n:["mouseover"],t:70,f:{r:["@this","@keypath"],s:"[_0.set(\"temp.hover\",_1),false]"}},{n:"title",f:[{t:4,f:["Click to move the selected ",{t:2,x:{r:["~/reparent"],s:"_0.get(\"type\")"}}," to the end of this container",{t:2,x:{r:[],s:"\"\\n\""}}],n:50,r:"~/reparent"},{t:4,f:["Click to add a copy of the selected ",{t:2,x:{r:["~/copy"],s:"_0.get(\"type\")"}}," to this container",{t:2,x:{r:[],s:"\"\\n\""}}],n:50,r:"~/copy",l:1},"Path: ",{t:2,r:"@keypath"}],t:13}],f:[{t:7,e:"span",m:[{n:"class",f:["line ",{t:2,x:{r:["@this","@keypath"],s:"_0.getNestLevel(_1)"}}],t:13}],f:[{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico expander",g:1},{n:["click"],t:70,f:{r:["@this","escapeKey","@keypath","~/temp.tree"],s:"[_0.set(\"temp.tree.\"+_1(_2),_3&&_3[_2]===false?true:false),false]"}}],f:[{t:4,f:["-"],n:50,x:{r:["@keypath","~/temp.tree"],s:"_1[_0]!==false"}},{t:4,f:["+"],n:51,l:1}]}],n:50,r:".widgets.length"}," ",{t:7,e:"span",f:["group ",{t:2,x:{r:["@index"],s:"_0+1"}}," ",{t:8,r:"widget-info"}]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"actions",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico up-arrow",g:1},{n:"disabled",f:[{t:2,x:{r:["@index"],s:"_0===0"}}],t:13},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.moveUp((_1),[\"../\",\"^^/groupEnds\"]),false]"}},{n:"title",f:"Move up",t:13,g:1}],f:[{t:8,r:"arrow"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico down-arrow",g:1},{n:"disabled",f:[{t:2,x:{r:["@index","@last"],s:"_0===_1"}}],t:13},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.moveDown((_1),[\"../\",\"^^/groupEnds\"]),false]"}},{n:"title",f:"Move down",t:13,g:1}],f:[{t:8,r:"arrow"}]}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico remove",g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.removeWidget((_1)),false]"}},{n:"title",f:"Remove group",t:13,g:1}],f:[{t:8,r:"times"}]}]}," ",{t:4,f:[{t:8,r:"widget-tree"}],n:50,x:{r:["@keypath","~/temp.tree"],s:"_1[_0]!==false"}}]}],n:52,r:".group"}],n:50,x:{r:[".type",".group"],s:"_0===\"repeater\"&&_1"}}," ",{t:4,f:[{t:4,f:[{t:8,r:"special-container",z:[{n:"label",x:{x:{r:[],s:"\"overlay\""}}}]}],n:54,r:".overlay"}],n:50,x:{r:[".overlay.type"],s:"_0===\"container\""}}," ",{t:4,f:[{t:4,f:[{t:8,r:"special-container",z:[{n:"label",x:{x:{r:[],s:"\"header\""}}}]}],n:54,r:".header"}],n:50,x:{r:[".header.type"],s:"_0===\"container\""}}," ",{t:4,f:[{t:4,f:[{t:8,r:"special-container",z:[{n:"label",x:{r:"@key"}}]}],n:50,x:{r:["@key",".type"],s:"_0!==\"header\"&&_0!==\"footer\"&&_0!==\"alternate\"&&_0!==\"overlay\"&&_0!==\"watermark\"&&_1===\"container\""}}],n:52,r:"."}," ",{t:4,f:[{t:4,f:[{t:8,r:"special-container",z:[{n:"label",x:{x:{r:[],s:"\"alternate\""}}}]}],n:54,r:".alternate"}],n:50,x:{r:[".alternate.type"],s:"_0===\"container\""}}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"node",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.widget","@keypath"],s:"_0===_1"}}]},{n:"class-hover",t:13,f:[{t:2,x:{r:["~/temp.hover","@keypath"],s:"_0===_1"}}]},{n:"class-moving",t:13,f:[{t:2,x:{r:["~/reparent","@keypath","~/copy"],s:"_0&&_1===_0.resolve()||_2&&_1===_2.resolve()"}}]},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.clickWidget((_1))]"}},{n:["mouseover"],t:70,f:{r:["@this","@keypath"],s:"[_0.set(\"temp.hover\",_1),false]"}},{n:"title",f:[{t:4,f:["Click to move the selected ",{t:2,x:{r:["~/reparent"],s:"_0.get(\"type\")"}}," to the end of this container.",{t:2,x:{r:[],s:"\"\\n\""}}],n:50,x:{r:["~/reparent",".widgets",".type"],s:"_0&&(_1||_2===\"container\")"}},{t:4,f:["Click to move the selected ",{t:2,x:{r:["~/reparent"],s:"_0.get(\"type\")"}}," above this ",{t:2,r:".type"},".",{t:2,x:{r:[],s:"\"\\n\""}}],n:50,r:"~/reparent",l:1},{t:4,f:["Click to add a copy of the selected ",{t:2,x:{r:["~/copy"],s:"_0.get(\"type\")"}}," to this container. Shift click to add a copy of the selected ",{t:2,x:{r:["~/copy"],s:"_0.get(\"type\")"}}," before this container.",{t:2,x:{r:[],s:"\"\\n\""}}],n:50,x:{r:["~/copy",".widgets",".type"],s:"_0&&(_1||_2===\"container\")"},l:1},{t:4,f:["Click to add a copy of the selected ",{t:2,x:{r:["~/copy"],s:"_0.get(\"type\")"}}," before this ",{t:2,r:".type"},".",{t:2,x:{r:[],s:"\"\\n\""}}],n:50,r:"~/copy",l:1},"Path: ",{t:2,r:"@keypath"}],t:13}],f:[{t:7,e:"span",m:[{n:"class",f:["line ",{t:2,x:{r:["@this","@keypath"],s:"_0.getNestLevel(_1)"}}],t:13}],f:[{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico expander",g:1},{n:["click"],t:70,f:{r:["@this","escapeKey","@keypath","~/temp.tree"],s:"[_0.set(\"temp.tree.\"+_1(_2),_3&&_3[_2]===false?true:false),false]"}}],f:[{t:4,f:["-"],n:50,x:{r:["@keypath","~/temp.tree"],s:"_1[_0]!==false"}},{t:4,f:["+"],n:51,l:1}]}],n:50,x:{r:[".widgets.length",".type"],s:"_0||_1===\"repeater\""}}," ",{t:7,e:"span",f:[{t:2,r:".type"},{t:8,r:"widget-info"}]}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"actions",g:1}],f:[{t:4,f:[{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Add header",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".header\",{type:\"container\"}),false]"}}],f:["+H"]}],n:50,x:{r:[".header"],s:"!_0"}}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:["Add group ",{t:4,f:["level"],n:50,r:".group"}],t:13},{n:["click"],t:70,f:{r:[".group","@context"],s:"[_0?[(_1).push(\".group\",{type:\"container\"}),(_1).splice(\".groupEnds\",-1,0,true)]:(_1).set({\".group\":[{type:\"container\"}],\".groupEnds\":[true,true]}),false]"}}],f:["+G"]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Add alternate",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".alternate\",{type:\"container\"}),false]"}}],f:["+A"]}],n:50,x:{r:[".alternate"],s:"!_0"}}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Add footer",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".footer\",{type:\"container\"}),false]"}}],f:["+F"]}],n:50,x:{r:[".footer"],s:"!_0"}}],n:50,x:{r:[".type"],s:"_0===\"repeater\""}}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:["Copy ",{t:2,x:{r:[".type"],s:"_0||\"widget\""}}],t:13},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.set(\"copy\",(_1)),false]"}}],f:[{t:8,r:"copy"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:["Move ",{t:2,x:{r:[".type"],s:"_0||\"widget\""}}],t:13},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.set(\"reparent\",(_1)),false]"}}],f:[{t:8,r:"reparent"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico up-arrow",g:1},{n:"title",f:["Move up (hold the shift key to move to first",{t:4,f:[", hold the control key to swap layout coordinate too"],n:50,x:{r:["^^/layout"],s:"Array.isArray(_0)"}},")"],t:13},{n:"disabled",f:[{t:2,x:{r:["@index"],s:"_0===0"}}],t:13},{n:["click"],t:70,f:{r:["@this","@context","@event.ctrlKey","^^/layout","@index","@event.shiftKey"],s:"[_0.moveUp((_1),[\"../\",!_2&&Array.isArray(_3)?\"^^/layout\":undefined],_4,_5),false]"}}],f:[{t:8,r:"arrow"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico down-arrow",g:1},{n:"title",f:["Move down (hold the shift key to move to last",{t:4,f:[", hold the control key to swap layout coordinates too"],n:50,x:{r:["^^/layout"],s:"Array.isArray(_0)"}},")"],t:13},{n:"disabled",f:[{t:2,x:{r:["@index","@last"],s:"_0===_1"}}],t:13},{n:["click"],t:70,f:{r:["@this","@context","@event.ctrlKey","^^/layout","@index","@event.shiftKey"],s:"[_0.moveDown((_1),[\"../\",!_2&&Array.isArray(_3)?\"^^/layout\":undefined],_4,_5),false]"}}],f:[{t:8,r:"arrow"}]}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico remove",g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.removeWidget((_1)),false]"}},{n:"title",f:["Remove ",{t:2,r:".type"}],t:13}],f:[{t:8,r:"times"}]}],n:50,x:{r:["~/reparent","~/copy"],s:"!_0&&!_1"}}]}," ",{t:4,f:[{t:8,r:"widget-tree"}],n:50,x:{r:["@keypath","~/temp.tree"],s:"_1[_0]!==false"}}]}],n:52,z:[{n:"widget",x:{r:"."}},{n:"kp",x:{r:"@keypath"}}],r:".widgets"}," ",{t:4,f:[{t:4,f:[{t:8,r:"special-container",z:[{n:"label",x:{x:{r:[],s:"\"footer\""}}}]}],n:54,r:".footer"}],n:50,x:{r:[".footer.type"],s:"_0===\"container\""}}," ",{t:4,f:[{t:4,f:[{t:8,r:"special-container",z:[{n:"label",x:{x:{r:[],s:"\"watermark\""}}}]}],n:54,r:".watermark"}],n:50,x:{r:[".watermark.type"],s:"_0===\"container\""}}]}],max:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 32 32",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"M 14.618244,4.9839578 V 6.2242813 8.2613998 H 21.78473 L 7.4782137,22.564804 9.7954554,24.882046 23.977473,10.701585 v 6.984406 h 3.277442 V 8.1633567 c 0,-1.7435588 -1.438601,-3.1793989 -3.180956,-3.1793989 z M 24.732249,7.0662073 9.2320964,22.564804 9.7954554,23.128163 25.295608,7.6295663 Z M 9.5143344,22.847073 25.013998,7.3474099 m -9.15543,-1.1231286 v 0.796795 h 8.215391 c 0.639958,0 1.143837,0.5023239 1.143837,1.1422804 v 8.2823113 h 0.796795 V 8.1633567 c 0,-1.067599 -0.873032,-1.9390754 -1.940632,-1.9390754 z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"m 3.2910156,1.1269531 c -1.3398667,0 -2.43554685,1.093727 -2.43554685,2.4335938 V 28.708984 c 0,1.339867 1.09568015,2.435547 2.43554685,2.435547 H 28.845703 c 1.339867,0 2.433594,-1.09568 2.433594,-2.435547 V 3.5605469 c 0,-1.3398668 -1.093727,-2.4335938 -2.433594,-2.4335938 z m 0,1 H 28.845703 c 0.803165,0 1.433594,0.6304293 1.433594,1.4335938 V 28.708984 c 0,0.803165 -0.630429,1.435547 -1.433594,1.435547 H 3.2910156 c -0.8031645,0 -1.4355468,-0.632382 -1.4355469,-1.435547 V 3.5605469 c 0,-0.8031645 0.6323824,-1.4335938 1.4355469,-1.4335938 z",t:13,g:1}]}]}],cog:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 32 32",t:13,g:1}],f:[{t:7,e:"path",m:[{t:13,n:"style",f:"stroke-width:1;",g:1},{n:"d",f:"M 16.00011,3.228628 A 12.771503,12.771503 0 0 0 14.886282,3.308861 L 13.781893,7.7216959 10.600878,4.4344882 A 12.771503,12.771503 0 0 0 8.6894353,5.5601152 L 9.9401325,9.9399127 5.5603348,8.6892168 a 12.771503,12.771503 0 0 0 -1.125627,1.9114422 l 3.2872078,3.181016 -4.4128347,1.104389 a 12.771503,12.771503 0 0 0 -0.080233,1.113828 12.771503,12.771503 0 0 0 0.080233,1.113828 l 4.4128347,1.104388 -3.2872078,3.181018 a 12.771503,12.771503 0 0 0 1.125627,1.913801 l 4.3797977,-1.253056 -1.2506972,4.379798 a 12.771503,12.771503 0 0 0 1.9138017,1.125626 l 3.178656,-3.287208 1.104389,4.412835 a 12.771503,12.771503 0 0 0 1.113828,0.08024 12.771503,12.771503 0 0 0 1.113828,-0.08024 l 1.104388,-4.412835 3.181018,3.289569 a 12.771503,12.771503 0 0 0 1.911441,-1.127987 l -1.250696,-4.379798 4.379798,1.253056 a 12.771503,12.771503 0 0 0 1.125626,-1.913801 L 24.278305,18.218108 28.69114,17.11372 a 12.771503,12.771503 0 0 0 0.08024,-1.113828 12.771503,12.771503 0 0 0 -0.04955,-1.106749 l -4.443513,-1.111468 3.294288,-3.185736 A 12.771503,12.771503 0 0 0 26.461136,8.6821366 L 22.0601,9.9399127 23.317875,5.5365171 A 12.771503,12.771503 0 0 0 21.404063,4.4297687 L 18.218326,7.7216959 17.106858,3.2805437 A 12.771503,12.771503 0 0 0 16.00011,3.228628 Z m 0,5.4794672 A 7.2902771,7.2902771 0 0 1 23.289547,15.999892 7.2902771,7.2902771 0 0 1 16.00011,23.289329 7.2902771,7.2902771 0 0 1 8.7106746,15.999892 7.2902771,7.2902771 0 0 1 16.00011,8.7080952 Z",t:13,g:1}]}]}],tree:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 32 32",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"m 3.1714129,1.718648 h 1.9581459 c 0.5092546,0 0.9192321,0.4099775 0.9192321,0.9192321 v 1.9581458 c 0,0.5092546 -0.4099775,0.9192322 -0.9192321,0.9192322 H 3.1714129 c -0.5092546,0 -0.9192321,-0.4099776 -0.9192321,-0.9192322 V 2.6378801 c 0,-0.5092546 0.4099775,-0.9192321 0.9192321,-0.9192321 z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"m 8.8285534,7.5689573 h 1.9581456 c 0.509255,0 0.919232,0.4099776 0.919232,0.9192322 v 1.9581455 c 0,0.509255 -0.409977,0.919232 -0.919232,0.919232 H 8.8285534 c -0.5092546,0 -0.9192321,-0.409977 -0.9192321,-0.919232 V 8.4881895 c 0,-0.5092546 0.4099775,-0.9192322 0.9192321,-0.9192322 z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"m 8.8285534,13.419266 h 1.9581456 c 0.509255,0 0.919232,0.409977 0.919232,0.919232 v 1.958146 c 0,0.509254 -0.409977,0.919232 -0.919232,0.919232 H 8.8285534 c -0.5092546,0 -0.9192321,-0.409978 -0.9192321,-0.919232 v -1.958146 c 0,-0.509255 0.4099775,-0.919232 0.9192321,-0.919232 z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"m 8.8285534,25.119884 h 1.9581456 c 0.509255,0 0.919232,0.409978 0.919232,0.919233 v 1.958145 c 0,0.509255 -0.409977,0.919233 -0.919232,0.919233 H 8.8285534 c -0.5092546,0 -0.9192321,-0.409978 -0.9192321,-0.919233 v -1.958145 c 0,-0.509255 0.4099775,-0.919233 0.9192321,-0.919233 z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"m 14.485694,19.269575 h 1.958146 c 0.509254,0 0.919232,0.409978 0.919232,0.919232 v 1.958146 c 0,0.509255 -0.409978,0.919232 -0.919232,0.919232 h -1.958146 c -0.509255,0 -0.919232,-0.409977 -0.919232,-0.919232 v -1.958146 c 0,-0.509254 0.409977,-0.919232 0.919232,-0.919232 z",t:13,g:1}]}," ",{t:7,e:"path",m:[{t:13,n:"style",f:"stroke-width:1;",g:1},{n:"d",f:"m 14,9.467 h 9.447664",t:13,g:1}]}," ",{t:7,e:"path",m:[{t:13,n:"style",f:"stroke-width:1;",g:1},{n:"d",f:"M 9.4132559,21.16788 H 13.192658",t:13,g:1}]}," ",{t:7,e:"path",m:[{t:13,n:"style",f:"stroke-width:1;",g:1},{n:"d",f:"M 3.5344077,27.29019 H 7.3138096 M 3.5344077,9.620506 H 7.3138096 M 3.5344077,15.317571 H 7.3138096 M 4.0344077,6.3835565 V 27.576964",t:13,g:1}]}," ",{t:7,e:"path",m:[{t:13,n:"style",f:"stroke-width:1;",g:1},{n:"d",f:"m 14,15.317309 h 9.447664",t:13,g:1}]}," ",{t:7,e:"path",m:[{t:13,n:"style",f:"stroke-width:1;",g:1},{n:"d",f:"m 9.8082219,18.086466 v 3.574792",t:13,g:1}]}," ",{t:7,e:"path",m:[{t:13,n:"style",f:"stroke-width:1;",g:1},{n:"d",f:"m 19.28605,21.167618 h 9.447664",t:13,g:1}]}," ",{t:7,e:"path",m:[{t:13,n:"style",f:"stroke-width:1;",g:1},{n:"d",f:"m 14,27.017928 h 9.447664",t:13,g:1}]}]}],warning:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"M 7.9999999,1.3419993 A 0.51954981,0.51954981 0 0 0 7.5501881,1.6016783 L 0.46200598,13.878401 A 0.51954981,0.51954981 0 0 0 0.91181778,14.658 H 15.088182 a 0.51954981,0.51954981 0 0 0 0.449812,-0.779599 L 8.4498118,1.6016783 A 0.51954981,0.51954981 0 0 0 7.9999999,1.3419993 Z m 0,1.5580761 6.1879971,10.7186456 H 1.8120026 Z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"M 7.5117187,5.7675781 V 10.755859 H 8.4882813 V 5.7675781 Z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"m 7.5097656,11.556641 v 1.058593 h 0.9804688 v -1.058593 z",t:13,g:1}]}]}],autosize:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"m 7.8643604,1.1461781 c -0.1252288,1.027e-4 -0.2452523,0.050113 -0.333504,0.13896 L 3.8599966,4.9559978 c -0.1847627,0.1839512 -0.1847627,0.4830568 0,0.667008 0.1836871,0.1832173 0.4810049,0.1832173 0.664692,0 L 7.3942123,2.7534819 V 14.081037 L 4.5246886,11.213829 c -0.1836871,-0.183218 -0.4810049,-0.183218 -0.664692,0 -0.1832174,0.183687 -0.1832174,0.481004 0,0.664692 l 3.6708598,3.673175 c 0.088631,0.088 0.1892895,0.136645 0.333504,0.136645 0.1442144,0 0.2225519,-0.0257 0.3335039,-0.136645 0.1109522,-0.110954 3.6708597,-3.673175 3.6708597,-3.673175 0.183218,-0.183688 0.183218,-0.481005 0,-0.664692 -0.183951,-0.184763 -0.483057,-0.184763 -0.667008,0 L 8.3345084,14.081037 V 2.7534819 l 2.8672076,2.8695239 c 0.183951,0.1847627 0.483057,0.1847627 0.667008,0 0.184763,-0.1839512 0.184763,-0.4830568 0,-0.667008 L 8.1978643,1.2851381 C 8.1096126,1.1962906 7.9895891,1.1462808 7.8643604,1.1461781 Z",t:13,g:1}]}]}],times:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"m 3.081157,3.2367593 a 0.39687499,0.39687499 0 0 0 -0.28125,0.1171875 0.39687499,0.39687499 0 0 0 0,0.5605469 L 7.3038132,8.4184 2.799907,12.920353 a 0.39687499,0.39687499 0 0 0 0,0.560547 0.39687499,0.39687499 0 0 0 0.5625,0 L 7.8643601,8.9789468 12.368266,13.4809 a 0.39687499,0.39687499 0 0 0 0.560547,0 0.39687499,0.39687499 0 0 0 0,-0.560547 L 8.424907,8.4184 12.928813,3.9144937 a 0.39687499,0.39687499 0 0 0 0,-0.5605469 0.39687499,0.39687499 0 0 0 -0.560547,0 L 7.8643601,7.8558999 3.362407,3.3539468 A 0.39687499,0.39687499 0 0 0 3.081157,3.2367593 Z",t:13,g:1}]}]}],eye:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"M 8.0292969,3.84375 C 5.8187216,3.7959779 3.2719166,4.828582 0.6875,7.9414062 L 0.47851563,8.1933594 0.68554687,8.4472656 C 4.2213376,12.771626 7.6072279,13.362529 10.207031,12.503906 12.806835,11.645284 14.588183,9.4664365 15.279297,8.4121094 L 15.449219,8.1542969 15.240234,7.9257812 C 14.56764,7.1977999 12.721311,5.0903713 10.117188,4.2148437 9.4661566,3.9959619 8.7661553,3.859674 8.0292969,3.84375 Z M 8.0019531,4.6191406 C 8.6565753,4.6408129 9.2772607,4.769772 9.8632813,4.9667969 12.042444,5.6994492 13.625228,7.3762655 14.40625,8.2207031 13.700218,9.2262323 12.130956,11.032675 9.9589844,11.75 7.7038396,12.494794 4.8499214,12.067539 1.5566406,8.1992188 3.9323632,5.4612889 6.1082738,4.5564473 8.0019531,4.6191406 Z",t:13,g:1}]}," ",{t:7,e:"circle",m:[{n:"r",f:"3.5391803",t:13,g:1},{n:"cy",f:"8.3395138",t:13,g:1},{n:"cx",f:"8.0542507",t:13,g:1},{n:"fill",f:"#000",t:13,g:1}]}]}],play:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"M 2.5273438,2.1328125 A 0.39691468,0.39691468 0 0 0 2.328125,2.4765625 V 14.357422 a 0.39691468,0.39691468 0 0 0 0.5957031,0.34375 L 13.201172,8.7675781 a 0.39691468,0.39691468 0 0 0 0,-0.6875 L 2.9238281,2.1328125 a 0.39691468,0.39691468 0 0 0 -0.3964843,0 z m 0.5957031,1.03125 9.0878911,5.2597656 -9.0878911,5.2460939 z",t:13,g:1}]}]}],pencil:[{t:7,e:"svg",m:[{t:13,n:"class",f:"pencil",g:1},{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"m 10.574807,3.7181493 1.230348,-1.230348 c 0.786061,-0.1047571 2.169305,1.3270952 2.115927,2.0909526 l -1.24767,1.2476704 z m 0,0 L 12.677529,5.825142 5.136945,13.365724 3.5226704,13.820162 1.9083957,14.2746 2.5400804,12.67292 3.1717651,11.07124 10.574806,3.718149 Z",t:13,g:1}]}]}],console:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"m 2.5800781,4.140625 a 0.39687499,0.39687499 0 0 0 -0.2773437,0.1230469 0.39687499,0.39687499 0 0 0 0.011719,0.5625 L 5.9921875,8.3320313 2.3085938,12.015625 a 0.39687499,0.39687499 0 0 0 0,0.5625 0.39687499,0.39687499 0 0 0 0.5605468,0 L 6.8417969,8.6054688 a 0.39687499,0.39687499 0 0 0 0.00391,-0.00391 0.39687499,0.39687499 0 0 0 0.00195,-0.00195 0.39687499,0.39687499 0 0 0 0.00977,-0.015625 0.39687499,0.39687499 0 0 0 0.076172,-0.1425781 0.39687499,0.39687499 0 0 0 0.011719,-0.060547 A 0.39687499,0.39687499 0 0 0 6.9433594,8.25 0.39687499,0.39687499 0 0 0 6.9316406,8.1992188 0.39687499,0.39687499 0 0 0 6.8417969,8.0449219 a 0.39687499,0.39687499 0 0 0 -0.00391,0 0.39687499,0.39687499 0 0 0 -0.00391,-0.00781 L 2.8632813,4.25 A 0.39687499,0.39687499 0 0 0 2.5800781,4.140625 Z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"m 7.0917969,11.767578 v 0.792969 h 6.4453121 v -0.792969 z",t:13,g:1}]}]}],switch:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"m 11.226563,3.7128906 -0.707032,0.7070313 1.642578,1.6445312 H 3.046875 v 1 h 11.529297 z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"M 1.1855469,8.9433594 4.5351562,12.292969 5.2421875,11.585938 3.5996094,9.9433594 h 9.1171876 v -1 z",t:13,g:1}]}]}],scrollto:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"m 7.9921875,0.95883941 c -0.250488,-0.00872 -0.5000001,0.18861599 -0.5,0.59179689 0,2.4565678 0.014046,5.4488885 0.015625,5.7792969 -0.414832,-0.4134912 -1.618944,-1.609179 -3.0527344,-3.0429688 -0.208715,-0.2087145 -0.833715,0.4162855 -0.625,0.625 L 8,9.0818863 12.169922,4.9119644 c 0.208822,-0.2088228 -0.41813,-0.8357759 -0.626953,-0.6269531 -1.010297,1.0102962 -2.5173079,2.5148582 -3.0351565,3.03125 -0.00152,-0.3342485 -0.013672,-3.072983 -0.013672,-5.71875 0,-0.4162448 -0.2514651,-0.62995161 -0.5019531,-0.63867189 z M 8.28125,7.5408707 C 8.2531767,7.5688634 8,7.8221207 8,7.8221207 c 0,0 -0.257095,-0.255216 -0.2792969,-0.2773438 z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"m 1.9238281,10.37163 v 2 H 14.076172 v -2 z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"m 1.9238281,13.169922 v 2 H 14.076172 v -2 z",t:13,g:1}]}]}],reparent:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"m 7.717269,6.5496963 c 1.1791128,1.1791128 3.537021,3.5439517 3.537021,3.5439517 0,0 -1.8715903,1.878096 -3.536918,3.543424 -0.2087145,0.208715 0.4174295,0.834858 0.626144,0.626143 1.739959,-1.739959 4.170103,-4.170102 4.170103,-4.170102 0,0 -2.8836136,-2.8836169 -4.170102,-4.1701053 C 8.1346942,5.7141849 7.5084462,6.3408735 7.717269,6.5496963 Z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"M 1.25,1.265625 V 3.1953125 H 3.1816406 V 1.265625 Z m 3.8613281,0 V 3.1953125 H 7.0410156 V 1.265625 Z m 3.859375,0 V 3.1953125 H 10.900391 V 1.265625 Z m 3.8593749,0 V 3.1953125 H 14.75 V 1.265625 Z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"m 3.5527344,4 c 0,1.570084 0,5.1494183 0,5.1494183 0,0.8840967 0.4590976,1.4746067 1.428392,1.4746067 l 7.3118426,-0.0166 -0.0039,-1.0000001 -7.2599976,0.014648 c -0.3569634,0 -0.476331,-0.1906315 -0.476331,-0.5277838 0,0 0,-3.4980046 0,-5.0942891 0,-0.3333353 -1.000006,-0.3333353 -1.000006,0 z",t:13,g:1}]}," ",{t:4,f:[{t:7,e:"path",m:[{n:"d",f:"M 2.5878906 1.7539062 L 1.3984375 2.9433594 L 6.7871094 8.3320312 L 1.3984375 13.720703 L 2.5878906 14.912109 L 7.9765625 9.5234375 L 13.367188 14.912109 L 14.556641 13.720703 L 9.1679688 8.3320312 L 14.556641 2.9433594 L 13.367188 1.7539062 L 7.9765625 7.1425781 L 2.5878906 1.7539062 z",t:13,g:1},{n:"opacity",f:"0.5",t:13,g:1},{n:"fill",f:"red",t:13,g:1}]}],n:50,r:"cancel"}]}],copy:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"m 2.5507813,0.02148438 c -1.0111865,0 -1.84570318,0.84012077 -1.84570318,1.84960932 v 9.7968753 c 0,1.009488 0.83451588,1.847656 1.84570318,1.847656 H 6.4335937 V 4.4023437 c 0,-0.2045815 0.1433298,-0.3457031 0.3496094,-0.3457031 H 11.121094 V 1.8710937 c 0,-1.00948872 -0.83647,-1.84960932 -1.8476565,-1.84960932 z m 0,1.50000002 h 6.7226562 c 0.2045818,0 0.3476563,0.1433291 0.3476563,0.3496093 V 2.5566406 H 6.7832031 c -1.0094885,0 -1.8496094,0.8345165 -1.8496094,1.8457031 V 12.015625 H 2.5507813 c -0.2045816,0 -0.3457032,-0.141378 -0.3457032,-0.347656 V 1.8710937 c 0,-0.2062803 0.1411208,-0.3496093 0.3457032,-0.3496093 z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"m 6.7832031,2.5566406 c -1.0104117,0 -1.8476562,0.8372445 -1.8476562,1.8476563 v 9.7968751 c 0,1.010412 0.8372445,1.847656 1.8476562,1.847656 h 6.7226559 c 1.010412,0 1.845704,-0.837245 1.845704,-1.847656 V 4.4042969 c 0,-1.010411 -0.835292,-1.8476563 -1.845704,-1.8476563 z m 0,1.5 h 6.7226559 c 0.205359,0 0.345703,0.1422974 0.345704,0.3476563 v 9.7968751 c 0,0.20536 -0.140345,0.347656 -0.345704,0.347656 H 6.7832031 c -0.205358,0 -0.3476562,-0.142297 -0.3476562,-0.347656 V 4.4042969 c 0,-0.205358 0.1422982,-0.3476563 0.3476562,-0.3476563 z",t:13,g:1}]}," ",{t:4,f:[{t:7,e:"path",m:[{n:"d",f:"M 2.5878906 1.7539062 L 1.3984375 2.9433594 L 6.7871094 8.3320312 L 1.3984375 13.720703 L 2.5878906 14.912109 L 7.9765625 9.5234375 L 13.367188 14.912109 L 14.556641 13.720703 L 9.1679688 8.3320312 L 14.556641 2.9433594 L 13.367188 1.7539062 L 7.9765625 7.1425781 L 2.5878906 1.7539062 z",t:13,g:1},{n:"opacity",f:"0.5",t:13,g:1},{n:"fill",f:"red",t:13,g:1}]}],n:50,r:"cancel"}]}],arrow:[{t:7,e:"svg",m:[{n:"viewBox",f:"4 7 16 10",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z",t:13,g:1}]}]}],"special-container":[{t:7,e:"div",m:[{t:13,n:"class",f:"node",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.widget","@keypath"],s:"_0===_1"}}]},{n:"class-hover",t:13,f:[{t:2,x:{r:["~/temp.hover","@keypath"],s:"_0===_1"}}]},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.clickWidget((_1))]"}},{n:["mouseover"],t:70,f:{r:["@this","@keypath"],s:"[_0.set(\"temp.hover\",_1),false]"}},{n:"title",f:[{t:4,f:["Click to move the selected ",{t:2,x:{r:["~/reparent"],s:"_0.get(\"type\")"}}," to the end of this container",{t:2,x:{r:[],s:"\"\\n\""}}],n:50,r:"~/reparent"},{t:4,f:["Click to add a copy of the selected ",{t:2,x:{r:["~/copy"],s:"_0.get(\"type\")"}}," to this container.",{t:2,x:{r:[],s:"\"\\n\""}}],n:50,r:"~/copy",l:1}," Path: ",{t:2,r:"@keypath"}],t:13}],f:[{t:7,e:"span",m:[{n:"class",f:["line ",{t:2,x:{r:["@this","@keypath"],s:"_0.getNestLevel(_1)"}}],t:13}],f:[{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico expander",g:1},{n:["click"],t:70,f:{r:["@this","escapeKey","@keypath","~/temp.tree"],s:"[_0.set(\"temp.tree.\"+_1(_2),_3&&_3[_2]===false?true:false),false]"}}],f:[{t:4,f:["-"],n:50,x:{r:["@keypath","~/temp.tree"],s:"_1[_0]!==false"}},{t:4,f:["+"],n:51,l:1}]}],n:50,r:".widgets.length"}," ",{t:7,e:"span",f:[{t:2,x:{r:["label"],s:"_0||\"unknown\""}}," ",{t:8,r:"widget-info"}]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico remove",g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.removeWidget((_1)),false]"}},{n:"title",f:["Remove ",{t:2,x:{r:["label"],s:"_0||\"unknown\""}}],t:13}],f:[{t:8,r:"times"}]}],n:50,x:{r:["@key","../type"],s:"_0!==\"row\"||_1!==\"repeater\""}}]}," ",{t:4,f:[{t:8,r:"widget-tree"}],n:50,x:{r:["@keypath","~/temp.tree"],s:"_1[_0]!==false"}}]}],"widget-info":[{t:4,f:[{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"widget-id",g:1}],f:[".",{t:2,r:".id"}]}],n:50,x:{r:[".id"],s:"_0!=null"}}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"widget-info",g:1}],f:[{t:2,r:".text"}]}],n:50,x:{r:[".type"],s:"_0===\"label\"||_0===\"measured\""}},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"widget-info",g:1}],f:[{t:2,r:".url"}]}," "],n:50,x:{r:[".type"],s:"_0===\"image\""},l:1},{t:4,f:[" ",{t:7,e:"span",m:[{t:13,n:"class",f:"widget-info",g:1}],f:[{t:2,x:{r:[".source.x",".source",".source.name",".source.source"],s:"_1&&typeof _1===\"object\"&&\"x\" in _1?_0:typeof _1===\"string\"?_1:(_2||_3||\"(None)\")"}}]}," "],n:50,x:{r:[".type"],s:"_0===\"repeater\""},l:1},{t:4,f:[" ",{t:7,e:"span",m:[{t:13,n:"class",f:"widget-info",g:1}],f:["macro: ",{t:2,r:".macro"}]}," "],n:50,r:".macro",l:1},{t:4,f:[" ",{t:7,e:"span",m:[{t:13,n:"class",f:"widget-info",g:1}],f:["(",{t:2,r:".widgets.length"}," child",{t:4,f:["ren"],n:50,x:{r:[".widgets.length"],s:"_0!==1"}},")"]}],n:50,r:".widgets.length",l:1}],repeater:[{t:7,e:"div",m:[{t:13,n:"class",f:"bar",g:1},{n:["mouseover"],t:70,f:{r:["@this","@keypath"],s:"[_0.set(\"temp.hover\",_1),false]"}}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"name",g:1}],f:["Repeater"]}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@context","@this"],s:"[(_0).set(\".group\",undefined),(_0).set(\".groupEnds\",[true]),_1.unlink(\"widget\"),_1.set(\"temp.widget\",undefined)]"}}],f:["Remove Group"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).push(\".group\",{type:\"container\"}),(_0).splice(\".groupEnds\",-1,0,true)]"}}],f:["Add Group Level"]}],n:50,r:".group"},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".group\",[{type:\"container\"}]),(_0).set(\".groupEnds\",[true,true])]"}}],f:["Add Group"]}],n:51,l:1}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@context","@this"],s:"[(_0).set(\".header\",undefined),_1.unlink(\"widget\"),_1.set(\"temp.widget\",undefined)]"}}],f:["Remove Header"]}],n:50,r:".header"},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".header\",{type:\"container\"})]"}}],f:["Add Header"]}],n:51,l:1}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@context","@this"],s:"[(_0).set(\".alternate\",undefined),_1.unlink(\"widget\"),_1.set(\"temp.widget\",undefined)]"}}],f:["Remove Alternate"]}],n:50,r:".alternate"},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".alternate\",{type:\"container\"})]"}}],f:["Add Alternate"]}],n:51,l:1}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@context","@this"],s:"[(_0).set(\".footer\",undefined),_1.unlink(\"widget\"),_1.set(\"temp.widget\",undefined)]"}}],f:["Remove Footer"]}],n:50,r:".footer"},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".footer\",{type:\"container\"})]"}}],f:["Add Footer"]}],n:51,l:1}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"widgets",g:1}],f:[{t:4,f:[{t:4,f:[{t:8,r:"widget",z:[{n:"label",x:{x:{r:["@index"],s:"\"Group Header \"+(_0+1)"}}}]}],n:52,r:".group"}],n:50,r:".group"}," ",{t:4,f:[{t:4,f:[{t:8,r:"widget",z:[{n:"label",x:{x:{r:[],s:"\"Header\""}}}]}],n:54,r:".header"}],n:50,r:".header"}," ",{t:4,f:[{t:2,x:{r:["@context"],s:"(_0).set(\".row\",{type:\"container\"})&&\"\""}}],n:50,x:{r:[".row"],s:"!_0"}}," ",{t:4,f:[{t:8,r:"widget",z:[{n:"label",x:{x:{r:[],s:"\"Row\""}}}]}],n:54,r:".row"}," ",{t:4,f:[{t:4,f:[{t:8,r:"widget",z:[{n:"label",x:{x:{r:[],s:"\"Alternate\""}}}]}],n:54,r:".alternate"}],n:50,r:".alternate"}," ",{t:4,f:[{t:4,f:[{t:8,r:"widget",z:[{n:"label",x:{x:{r:[],s:"\"Footer\""}}}]}],n:54,r:".footer"}],n:50,r:".footer"}]}],html:[{t:19,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"preview btn",g:1},{n:"title",f:"Toggle Preview",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).toggle(\"ctx.preview\")]"}}],f:[{t:8,r:"eye"}]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"autosize btn",g:1},{n:"title",f:"Autosize Block",t:13,g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.autosizeHtml((_1))]"}}],f:[{t:8,r:"autosize"}]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"content",g:1},{n:["mouseover"],t:70,f:{r:["@this","@keypath"],s:"[_0.set(\"temp.hover\",_1),false]"}},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.editExpr((_1).resolve(\".html\"),{html:true})]"}},{n:"class-preview",t:13,f:[{t:2,r:"ctx.preview"}]},{t:4,f:[{n:"style-font-size",f:[{t:2,x:{r:[".font.size"],s:"_0||0.83"}},"rem"],t:13},{n:"style-line-height",f:[{t:2,x:{r:[".font.line",".font.size"],s:"_0===0?\"initial\":(_0||_1||1)+\"rem\""}}],t:13}],n:50,r:"ctx.preview"},{t:4,f:[{n:"style",f:"height: auto;",t:13}],n:50,r:"ctx.autosize"},{t:4,f:[{n:"title",f:[{t:2,r:".html"}],t:13}],n:50,x:{r:[".html.length"],s:"_0<50"}}],f:[{t:4,f:[{t:3,r:".html"}],n:50,r:"ctx.preview"},{t:4,f:[{t:7,e:"Viewer",m:[{t:13,n:"style",f:"overflow: hidden;",g:1},{n:"src",f:[{t:2,r:".html"}],t:13},{n:"template",f:"true",t:13,g:1}]}],n:51,l:1}]}],n:54,z:[{n:"ctx",x:{r:"@local"}}]}],image:[{t:19,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"content",g:1},{n:["mouseover"],t:70,f:{r:["@this","@keypath"],s:"[_0.set(\"temp.hover\",_1),false]"}},{n:"title",f:[{t:2,r:".url"}],t:13}],f:[{t:4,f:[{t:7,e:"div",m:[{n:"style",f:["width: 100%; height: 100%; background-image: url('",{t:2,x:{r:["@this",".url"],s:"_0.evalExpr(_1)"}},"'); background-repeat: no-repeat; background-size: ",{t:2,x:{r:[".fit"],s:"!_0?\"contain\":_0===\"stretch\"?\"100% 100%\":\"cover\""}},"; background-position: center;"],t:13}]}],n:50,r:"ctx.preview"},{t:4,f:["IMG"],n:51,l:1}]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"preview btn",g:1},{n:"title",f:"Toggle Preview",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).toggle(\"ctx.preview\")]"}}],f:[{t:8,r:"eye"}]}],n:54,z:[{n:"ctx",x:{r:"@local"}}]}],label:[{t:7,e:"span",m:[{t:13,n:"class",f:"content",g:1},{n:["mouseover"],t:70,f:{r:["@this","@keypath"],s:"[_0.set(\"temp.hover\",_1),false]"}},{n:"title",f:[{t:2,r:".text"}],t:13}],f:[{t:4,f:[{t:4,f:[{t:4,f:[{t:2,r:"."}],n:50,x:{r:["."],s:"typeof _0===\"string\""}},{t:4,f:[{t:7,e:"span",m:[{t:4,f:[{n:"style",f:[{t:2,x:{r:["@this","."],s:"_0.calcFont(_1)"}}],t:13}],n:50,r:".font"}],f:[{t:2,r:".text"}]}],n:51,l:1}],n:52,r:".text"}],n:50,x:{r:[".text"],s:"Array.isArray(_0)"}},{t:4,f:[{t:7,e:"Viewer",m:[{t:13,n:"style",f:"overflow: hidden;",g:1},{n:"src",f:[{t:2,r:".text"}],t:13}]}],n:51,l:1}]}],container:[{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"content",g:1},{n:["mouseover"],t:70,f:{r:["@this","@keypath"],s:"[_0.set(\"temp.hover\",_1),false]"}},{n:"title",f:[{t:2,r:".text"}],t:13}],f:[{t:7,e:"Viewer",m:[{t:13,n:"style",f:"overflow: hidden;",g:1},{n:"src",f:[{t:2,r:".macro"}],t:13}]}]}],n:50,r:".macro"},{t:4,f:[{t:19,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"bar",g:1},{n:["mouseover"],t:70,f:{r:["@this","@keypath"],s:"[_0.set(\"temp.hover\",_1),false]"}}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"name",g:1}],f:[{t:2,x:{r:["label"],s:"_0||\"container\""}}]}," ",{t:4,f:[{t:2,x:{r:["@context",".layout"],s:"(_0).set(\"ctx.layout\",_1===\"row\"||!_1?\"auto\":\"manual\")&&\"\""}}],n:50,r:"ctx.layout"}," ",{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"ctx.layout"}],t:13},{n:["change"],t:70,f:{r:["@node.value","@context"],s:"[_0===\"auto\"?(_1).set(\".layout\",undefined):(_1).set(\".layout\",[])]"}}],f:[{t:7,e:"option",m:[{n:"value",f:"auto",t:13}],f:["Auto Layout"]}," ",{t:7,e:"option",m:[{n:"value",f:"manual",t:13}],f:["Manual Layout"]}]}]}],n:54,z:[{n:"ctx",x:{r:"@local"}}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"widgets",g:1},{n:"class-manual",t:13,f:[{t:2,x:{r:[".layout"],s:"Array.isArray(_0)"}}]},{n:"style",f:["height: ",{t:2,r:"heightMargin"},";"],t:13},{n:["mouseover"],t:70,f:{r:["@this","@keypath"],s:"[_0.set(\"temp.hover\",_1)]"}}],f:[{t:4,f:[{t:8,r:"widget",z:[{n:"label",x:{x:{r:[],s:"false"}}}]}],n:52,r:".widgets"}]}],n:51,l:1}],widget:[{t:19,f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"break",g:1}]}],n:50,x:{r:[".br"],s:"_0===true"}}," ",{t:7,e:"div",m:[{n:"widget",t:71,f:{r:[".type"],s:"[_0]"}},{n:"style",f:[{t:4,f:["width: ",{t:2,r:"widthMargin"},";"],n:50,x:{r:["label"],s:"_0!==\"page footer\""}},{t:4,f:["position: absolute; width: auto; left: ",{t:2,x:{r:["~/pageSize.margin.1"],s:"_0||0"}},"rem; right: ",{t:2,x:{r:["~/pageSize.margin.1"],s:"_0||0"}},"rem; bottom: ",{t:2,x:{r:["~/pageSize.margin.0"],s:"_0||0"}},"rem;"],n:51,l:1}," ",{t:4,f:[{t:2,x:{r:[".type"],s:"_0===\"container\"?\"min-\":\"\""}},"height: ",{t:2,r:"heightMargin"},";"],n:50,x:{r:[".height",".type"],s:"(_0&&_0!==\"auth\")||_1!==\"container\""}}],t:13},{t:4,f:[{n:"style",f:[{t:2,x:{r:["@this","@index","^^/layout","widthMargin","heightMargin"],s:"_0.calcManualLayout(_2[_1],_3,_4)"}}],t:13},{t:4,f:[{n:"moveable",t:71}],n:50,x:{r:["~/temp.widget","@keypath"],s:"_0===_1"}}," "],n:50,x:{r:["^^/layout"],s:"Array.isArray(_0)"}},{t:4,f:[{n:"style",f:[{t:4,f:["flex-grow: 1; break-after: always;"],n:50,x:{r:[".width"],s:"_0===\"grow\""}}],t:13}],n:51,l:1},{n:"class-macro",t:13,f:[{t:2,r:".macro"}]},{t:4,f:[{n:"style",f:[{t:2,x:{r:["@this","."],s:"_0.calcMargin(_1)"}}],t:13}],n:50,r:".margin"},{t:4,f:[{n:"style",f:[{t:2,x:{r:["@this","."],s:"_0.calcBorder(_1)"}}],t:13}],n:50,r:".border"},{t:4,f:[{n:"style",f:[{t:2,x:{r:["@this","."],s:"_0.calcFont(_1)"}}],t:13}],n:50,r:".font"},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.clickWidget((_1))]"}}],f:[{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"remove btn",g:1},{n:"title",f:["Remove ",{t:2,r:".type"}],t:13},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.removeWidget((_1),false)]"}}],f:[{t:8,r:"times"}]}],n:50,x:{r:["../"],s:"Array.isArray(_0)"}}," ",{t:8,r:".type"}]}],n:54,z:[{n:"widthMargin",x:{x:{r:["@this",".","@context"],s:"_0.calcWidthWithMargin(_1,(_2))"}}},{n:"heightMargin",x:{x:{r:["@this","."],s:"_0.calcHeightWithMargin(_1)"}}}]}],bottom:[{t:7,e:"div",m:[{t:13,n:"class",f:"bottom-bar",g:1},{n:"class-shrinkleft",t:13,f:[{t:2,r:"~/show.shrinkleft"}]}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"actions",g:1}],f:[{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"Set values for report parameters",t:13,g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.bottom.tab"],s:"_0===\"params\""}}]},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.bottom.tab\",\"params\"),_0.set(\"show.bottom\",true)]"}}],f:["Parameters"]}],n:50,r:"~/report.parameters.length"}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"Evaluate expressions",t:13,g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.bottom.tab"],s:"!_0||_0===\"expr\""}}]},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.bottom.tab\",\"expr\"),_0.set(\"show.bottom\",true)]"}}],f:[{t:4,f:["Expression"],n:50,r:"~/temp.expr.path"},{t:4,f:["Evaluate"],n:51,l:1}]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"Expression language reference",t:13,g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.bottom.tab"],s:"_0===\"langref\""}}]},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.bottom.tab\",\"langref\"),_0.set(\"show.bottom\",true)]"}}],f:["Language"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"Operator reference",t:13,g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.bottom.tab"],s:"_0===\"opref\""}}]},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.bottom.tab\",\"opref\"),_0.set(\"show.bottom\",true)]"}}],f:["Operators"]}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:["Modify report parameter ",{t:2,r:"~/param.name"}],t:13},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.bottom.tab"],s:"_0===\"param\""}}]},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.bottom.tab\",\"param\"),_0.set(\"show.bottom\",true)]"}}],f:["Parameter"]}],n:50,r:"~/temp.bottom.param"}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:["Modify data source ",{t:2,x:{r:["~/source.name","~/source.source"],s:"_0||_1"}}],t:13},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.bottom.tab"],s:"_0===\"source\""}}]},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.bottom.tab\",\"source\"),_0.set(\"show.bottom\",true)]"}}],f:["Source"]}],n:50,r:"~/temp.bottom.source"}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"which",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.checkLink(\"expr\")]"}},{n:"title",f:["Close expression for ",{t:2,r:"~/temp.expr.path"}],t:13}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1}],f:[{t:8,r:"times"}]}," ",{t:2,x:{r:["~/temp.expr.path"],s:"_0.replace(/\\./g,\" 〉 \")"}}]}],n:50,x:{r:["~/temp.expr.path","~/temp.bottom.tab"],s:"_0&&(!_1||_1===\"expr\")"}}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"which",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.checkLink(\"param\")]"}},{n:"title",f:["Close parameter editor for ",{t:2,r:"~/param.name"}],t:13}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1}],f:[{t:8,r:"times"}]}," Parameter ",{t:2,x:{r:["@this","~/temp.bottom.param"],s:"+_0.lastKey(_1)+1"}}]}],n:50,x:{r:["~/temp.bottom.param","~/temp.bottom.tab"],s:"_0&&_1===\"param\""}}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"which",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.checkLink(\"source\")]"}},{n:"title",f:["Close source editor for ",{t:2,r:"~/temp.bottom.source"}],t:13}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1}],f:[{t:8,r:"times"}]}," Source ",{t:2,x:{r:["@this","~/temp.bottom.source"],s:"+_0.lastKey(_1)+1"}}]}],n:50,x:{r:["~/temp.bottom.source","~/temp.bottom.tab"],s:"_0&&_1===\"source\""}}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 1;",g:1}]}," ",{t:7,e:"button",m:[{t:13,n:"style",f:"margin-left: 1rem;",g:1},{t:13,n:"class",f:"ico",g:1},{n:"title",f:[{t:4,f:["Shrink"],n:50,r:"~/max.bottom"},{t:4,f:["Embiggen"],n:51,l:1}," the bottom pane"],t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.toggle(\"max.bottom\")]"}},{n:"class",f:[{t:4,f:["off"],n:50,x:{r:["~/max.bottom"],s:"!_0"}}],t:13}],f:[{t:8,r:"max"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:[{t:4,f:["Hide"],n:50,r:"~/show.bottom"},{t:4,f:["Show"],n:51,l:1}," the bottom pane"],t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.toggle(\"show.bottom\")]"}},{n:"class",f:[{t:4,f:["down"],n:50,r:"~/show.bottom"},{t:4,f:["up"],n:51,l:1},"-arrow"],t:13}],f:[{t:8,r:"arrow"}]}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"bottom-pane",g:1},{n:"class-active",t:13,f:[{t:2,r:"~/show.bottom"}]},{n:"class-max",t:13,f:[{t:2,r:"~/max.bottom"}]},{n:"class-shrinkleft",t:13,f:[{t:2,r:"~/show.shrinkleft"}]}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"bottom",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"tab",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["~/temp.bottom.tab"],s:"_0===\"langref\""}}]}],f:[{t:7,e:"iframe",m:[{n:"srcdoc",f:[{t:2,x:{r:["@this","~/settings.scale","@style.theme"],s:"_0.langref(_1,_2)"}}],t:13},{n:"id",f:"langref",t:13,g:1}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["~/temp.bottom.tab"],s:"_0===\"opref\""}}]}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"ops-search",g:1}],f:[{t:7,e:"input",m:[{t:73,v:"l",f:"500"},{n:"placeholder",f:"Search...",t:13},{n:"value",f:[{t:2,r:"opDocSearch"}],t:13},{n:"style",f:"width: 10em; margin: 0.5em;",t:13},{n:"title",f:"Find any operators with docs containing the string entered here.",t:13}]}," ",{t:7,e:"input",m:[{t:73,v:"l",f:"500"},{n:"placeholder",f:"Operator...",t:13},{n:"value",f:[{t:2,r:"opDoc"}],t:13},{n:"style",f:"width: 10em; margin: 0.5em;",t:13},{n:"title",f:"Find any operators with a name containing the string entered here.",t:13}]}]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0.5rem; height: 100%; width: 100%; overflow: auto; box-sizing: border-box;",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"style",f:"max-width: 60em; margin: auto;",g:1}],f:[{t:7,e:"h2",m:[{t:13,n:"style",f:"text-align: center;",g:1}],f:["Raport Operators"]}," ",{t:7,e:"dl",f:[{t:4,f:[{t:4,f:[{t:7,e:"dt",m:[{t:13,n:"style",f:"border-bottom: 1px dotted; margin-bottom: 0.25rem; margin-top: 2rem;",g:1}],f:[{t:7,e:"h3",f:[{t:2,x:{r:["op.0.0","op.0"],s:"_0===\"#\"?\"Format \"+_1.slice(1):_1"}},{t:4,f:[" ",{t:7,e:"em",m:[{t:13,n:"style",f:"font-size: 0.8em;",g:1}],f:["- (alias for ",{t:7,e:"strong",f:[{t:2,r:"op.1.alias"}]},")"]}],n:50,r:"op.1.alias"}]}]}," ",{t:7,e:"dd",f:[{t:7,e:"dl",f:[{t:4,f:[{t:7,e:"dt",f:[{t:7,e:"strong",f:[{t:2,r:".proto"}]},{t:4,f:[" ",{t:7,e:"em",f:["or"]}," ",{t:7,e:"strong",f:["arg1 ",{t:2,r:"op.0"}," arg2"]}],n:50,r:".bin"},{t:4,f:[" or ",{t:7,e:"strong",f:[{t:2,r:"op.0"},"arg1"]}],n:50,r:".un"}," ",{t:4,f:[{t:7,e:"br"},{t:7,e:"em",f:["arg1 can implicitly be ",{t:7,e:"code",f:["@source"]}]}],n:50,r:".agg"}]}," ",{t:7,e:"dd",f:[{t:2,r:".desc"}]}],n:52,r:"op.1.sig"}]}," ",{t:4,f:[{t:7,e:"h4",f:["Options"]}," ",{t:7,e:"dl",f:[{t:4,f:[{t:7,e:"dt",f:[{t:7,e:"strong",f:[{t:2,x:{r:[".name"],s:"Array.isArray(_0)?_0.join(\" or \"):_0"}},{t:4,f:[" - ",{t:7,e:"em",f:[{t:2,r:".type"}]}],n:50,r:".type"}]}]}," ",{t:7,e:"dd",f:[{t:2,r:".desc"}]}],n:52,r:"op.1.opts"}]}],n:50,r:"op.1.opts.length"}]}],n:50,x:{r:["op.0","~/opDoc","op.1","~/opDocSearch"],s:"(!_1||_0.includes(_1))&&(!_3||JSON.stringify(_2).toLowerCase().includes(_3.toLowerCase()))"}}],n:52,z:[{n:"op",x:{r:"."}}],r:"~/operators"}]}]}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["~/temp.bottom.tab"],s:"!_0||_0===\"expr\""}}]}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"editor",g:1},{t:4,f:[{n:"style",f:"max-width: 100%;",t:13}],n:50,x:{r:["~/temp.expr.tab"],s:"_0!==\"ast\"&&_0!==\"text\"&&_0!==\"html\""}}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"actions",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:"title",f:"Evaluate the current expression (CTRL+Enter)",t:13,g:1},{n:"disabled",f:[{t:2,x:{r:["~/temp.expr.str"],s:"!_0"}}],t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.eval()]"}},{n:"class-error",t:13,f:[{t:2,r:"~/temp.expr.error"}]}],f:[{t:8,r:"play"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"Modify the current expression",t:13,g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.expr.tab"],s:"_0===\"text\""}}]},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.tab\",\"text\")]"}}],f:[{t:4,f:["Template"],n:50,r:"~/temp.expr.template"},{t:4,f:["Text"],n:51,l:1}]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico text",g:1},{n:"title",f:"Format the current expression",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.fmt()]"}}],f:["Format"]}],n:50,x:{r:["~/temp.expr.tab","~/temp.expr.template"],s:"_0===\"text\"&&!_1"}}," ",{t:4,f:[{t:7,e:"label",m:[{t:13,n:"style",f:"margin-left: 1em;",g:1},{n:"title",f:"Enable to treat the current expression as a template",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:"~/temp.expr.template"}],t:13}]}," Template?"]}],n:50,x:{r:["~/temp.expr.tab","~/temp.expr.path"],s:"_0===\"text\"&&!_1"}}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"editor-buttons",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"toggles",g:1}],f:[{t:19,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["t"],s:"!_0||_0===\"json\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.parsedtype\",\"json\")]"}}],n:50,x:{r:["t"],s:"_0&&_0!==\"json\""}},{n:"title",f:"Show the AST as JSON. Double click to copy the JSON to the clipboard.",t:13,g:1},{n:["dblclick"],t:70,f:{r:["@this","~/temp.expr.ast"],s:"[_0.copyToClipboard(JSON.stringify(_1))]"}}],f:["JSON"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["t"],s:"_0===\"raport\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.parsedtype\",\"raport\")]"}}],n:50,x:{r:["t"],s:"_0!==\"raport\""}},{n:"title",f:"Show the AST as a Raport expression.",t:13,g:1}],f:["Raport"]}],n:54,z:[{n:"t",x:{r:"~/temp.expr.parsedtype"}}]}]}]}," ",{t:4,f:[{t:7,e:"label",m:[{t:13,n:"style",f:"margin-left: 2em;",g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",t:13,f:[{t:2,r:"~/temp.expr.jsonsquash"}]},{n:"title",f:"Enable to display JSON with no additional whitespace",t:13}]}," Compact?"]}],n:50,x:{r:["~/temp.expr.parsedtype"],s:"_0===\"json\"||!_0"}}],n:50,x:{r:["~/temp.expr.tab"],s:"_0===\"parsed\""}}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"Modify the current HTML template",t:13,g:1},{n:"style-display",f:[{t:2,x:{r:["~/temp.expr.html"],s:"_0?\"\":\"none\""}}],t:13},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.expr.tab"],s:"_0===\"html\""}}]},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.tab\",\"html\")]"}}],f:["HTML"]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 2;",g:1}]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:"title",f:"Clear the logs",t:13,g:1},{n:"disabled",f:[{t:2,x:{r:["~/temp.logs.length"],s:"!_0"}}],t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"~/temp.logs\",[])]"}}],f:[{t:8,r:"times"}]}],n:50,x:{r:["~/temp.expr.tab"],s:"_0===\"logs\""}}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"style",f:"margin-left: 1em;",g:1},{t:13,n:"class",f:"tab",g:1},{n:"title",f:"View output from the log operator evaluated in expressions",t:13,g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.expr.tab"],s:"_0===\"logs\""}}]},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.tab\",\"logs\")]"}}],f:["Logs"]}],n:50,x:{r:["~/temp.logs.length","~/temp.expr.tab"],s:"_0||_1===\"logs\""}}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"View the result of the current expression's execution",t:13,g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.expr.tab"],s:"_0===\"result\""}}]},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.tab\",\"result\")]"}}],f:["Result"]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"View the parse tree of the current expression",t:13,g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.expr.tab"],s:"_0===\"parsed\""}}]},{n:"class-error",t:13,f:[{t:2,r:"~/temp.expr.error"}]},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.tab\",\"parsed\")]"}}],f:["Parsed"]}],n:50,r:"~/temp.expr.parsed"}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab text",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["~/temp.expr.tab"],s:"!_0||_0===\"text\""}}]}],f:[{t:4,f:[{t:4,f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"display: flex; justify-content: space-between;",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"title",f:"Convert multipart label text into a single expression",t:13,g:1},{n:["click"],t:70,f:{r:["@context","@this",".str"],s:"[(_0).set(\".str\",_1.getPartStrings(_2))]"}}],f:["Convert to Text"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:"title",f:"Add another part to this multipart label text",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).push(\".str\",\"\")]"}}],f:["+"]}]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 1;",g:1},{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"label-part",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico spacer",g:1},{n:["click"],t:70,f:{r:["@context","@index"],s:"[(_0).splice(\"../\",_1,1)]"}},{n:"title",f:"Remove part",t:13,g:1}],f:[{t:8,r:"times"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico up-arrow",g:1},{n:"disabled",f:[{t:2,x:{r:["@index"],s:"_0===0"}}],t:13},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.moveUp((_1))]"}},{n:"title",f:"Move up",t:13,g:1}],f:[{t:8,r:"arrow"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico spacer down-arrow",g:1},{n:"disabled",f:[{t:2,x:{r:["@index","@last"],s:"_0===_1"}}],t:13},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.moveDown((_1))]"}},{n:"title",f:"Move down",t:13,g:1}],f:[{t:8,r:"arrow"}]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context","."],s:"[(_0).set(\".\",{text:_1})]"}},{n:"title",f:"Format part",t:13,g:1}],f:["F"]}," ",{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:"."}],t:13},{n:"primary",f:[{t:2,x:{r:["@index"],s:"_0===0"}}],t:13}]}],n:50,x:{r:["."],s:"typeof _0===\"string\""}},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico spacer",g:1},{n:["click"],t:70,f:{r:["@context",".text"],s:"[(_0).set(\".\",_1)]"}},{n:"title",f:"Convert to a plain text part with no formatting",t:13,g:1}],f:["T"]}," ",{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".id"}],t:13},{n:"placeholder",f:"Tracking ID",t:13},{n:"title",f:"Track this value by assigning it a unique ID",t:13}]}," ",{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".text"}],t:13},{n:"primary",f:[{t:2,x:{r:["@index"],s:"_0===0"}}],t:13}]}," ",{t:7,e:"input",m:[{n:"title",f:"Font Family",t:13},{n:"placeholder",f:"Font Family",t:13},{n:"value",f:[{t:2,r:".font.family"}],t:13}]}," ",{t:7,e:"input",m:[{n:"title",f:"Color",t:13},{n:"placeholder",f:"Color",t:13},{n:"value",f:[{t:2,r:".font.color"}],t:13}]}," ",{t:7,e:"input",m:[{n:"title",f:"Size",t:13},{n:"placeholder",f:"Size (1)",t:13},{n:"value",f:[{t:2,r:".font.size"}],t:13},{n:"type",f:"number",t:13}]}," ",{t:7,e:"input",m:[{n:"title",f:"Line Height",t:13},{n:"placeholder",f:["Line Height (",{t:2,x:{r:[".font.size"],s:"_0==null?1:_0"}},")"],t:13},{n:"value",f:[{t:2,r:".font.line"}],t:13},{n:"type",f:"number",t:13}]}," ",{t:7,e:"select",m:[{n:"title",f:"Font Weight",t:13},{n:"value",f:[{t:2,r:".font.weight"}],t:13}],f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"undefined"}}],t:13}],f:["Font Weight"]}," ",{t:7,e:"option",m:[{n:"value",f:"400",t:13}],f:["light"]}," ",{t:7,e:"option",m:[{n:"value",f:"500",t:13}],f:["normal"]}," ",{t:7,e:"option",m:[{n:"value",f:"600",t:13}],f:["bold"]}," ",{t:7,e:"option",m:[{n:"value",f:"700",t:13}],f:["bolder"]}]}," ",{t:7,e:"label",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:".font.pre"}],t:13}]}," Significant whitespace?"]}," ",{t:7,e:"input",m:[{n:"title",f:"Background Color",t:13},{n:"placeholder",f:"Background",t:13},{n:"value",f:[{t:2,r:".bg"}],t:13}]}," ",{t:7,e:"input",m:[{n:"title",f:"Border Radius",t:13},{n:"placeholder",f:"Radius",t:13},{n:"value",f:[{t:2,r:".radius"}],t:13}]}],n:51,l:1}]}],n:52,r:".str"}]}]}],n:50,x:{r:[".str"],s:"Array.isArray(_0)"}},{t:4,f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 1;",g:1},{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".str"}],t:13},{n:"template",f:[{t:2,x:{r:[".html",".template"],s:"_0||_1"}}],t:13},{n:["run"],t:70,f:{r:["~/temp.expr.tab","@this"],s:"[_0===\"result\"?_1.set(\"temp.expr.tab\",\"text\"):_1.eval()]"}},{n:"primary",f:0,t:13}]}]}]}],n:51,l:1}],n:50,r:".label"},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 1;",g:1},{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".str"}],t:13},{n:"template",f:[{t:2,x:{r:[".html",".template"],s:"_0||_1"}}],t:13},{n:["run"],t:70,f:{r:["~/temp.expr.tab","@this"],s:"[_0===\"result\"?_1.set(\"temp.expr.tab\",\"text\"):_1.eval()]"}},{n:"primary",f:0,t:13}]}]}]}],n:51,l:1}],n:54,r:"~/temp.expr"}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab html",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["~/temp.expr.tab"],s:"_0===\"html\""}}]}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"editor-buttons",g:1}],f:[{t:7,e:"button",m:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.command(\"bold\")]"}},{n:"title",f:"Bold",t:13,g:1}],f:[{t:7,e:"strong",f:["B"]}]}," ",{t:7,e:"button",m:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.command(\"italic\")]"}},{n:"title",f:"Italic",t:13,g:1}],f:[{t:7,e:"em",f:["I"]}]}," ",{t:7,e:"button",m:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.command(\"underline\")]"}},{n:"title",f:"Underline",t:13,g:1}],f:[{t:7,e:"span",m:[{t:13,n:"style",f:"text-decoration: underline;",g:1}],f:["U"]}]}," ",{t:7,e:"button",m:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.command(\"strikeThrough\")]"}},{n:"title",f:"Strike Through",t:13,g:1}],f:[{t:7,e:"span",m:[{t:13,n:"style",f:"text-decoration: line-through;",g:1}],f:["S"]}]}," ",{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"~/temp.fontSize"}],t:13},{n:["change"],t:70,f:{r:["@this"],s:"[_0.setHTMLFontSize()]"}},{n:"title",f:"Change Font Size",t:13}],f:[{t:7,e:"option",m:[{n:"value",f:"",t:13}],f:["(font size)"]}," ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"1"}}],t:13}],f:["smallest"]}," ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"2"}}],t:13}],f:["smaller"]}," ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"3"}}],t:13}],f:["small"]}," ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"4"}}],t:13}],f:["regular"]}," ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"5"}}],t:13}],f:["large"]}," ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"6"}}],t:13}],f:["larger"]}," ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"7"}}],t:13}],f:["largest"]}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"html-editor",g:1},{n:"contenteditable",f:"true",t:13},{n:"value",f:[{t:2,r:"~/temp.expr.htmlstr"}],t:13},{n:"id",f:"expr-html",t:13,g:1}]}]}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab result",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["~/temp.expr.tab"],s:"_0===\"result\""}}]}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"editor-buttons",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"toggles",g:1}],f:[{t:19,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["t"],s:"!_0||_0===\"plain\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.resulttype\",\"plain\")]"}}],n:50,x:{r:["t"],s:"_0&&_0!==\"plain\""}},{n:"title",f:"Show result as a plain string. Double click to copy the text to the clipboard.",t:13,g:1},{n:["dblclick"],t:70,f:{r:["@this","~/temp.expr.result"],s:"[_0.copyToClipboard(_1)]"}}],f:["String"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["t"],s:"_0===\"json\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.resulttype\",\"json\")]"}}],n:50,x:{r:["t"],s:"_0!==\"json\""}},{n:"title",f:"Show result as JSON. Double click to copy the JSON to the clipboard.",t:13,g:1},{n:["dblclick"],t:70,f:{r:["@this","~/temp.expr.result","~/temp.expr.jsonsquash"],s:"[_0.copyToClipboard(JSON.stringify(_1,null,_2?undefined:\"  \"))]"}}],f:["JSON"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["t"],s:"_0===\"raport\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.resulttype\",\"raport\")]"}}],n:50,x:{r:["t"],s:"_0!==\"raport\""}},{n:"title",f:"Show result as a Raport expression Double click to copy the raport expression to the clipboard.",t:13,g:1},{n:["dblclick"],t:70,f:{r:["@this","~/temp.expr.result"],s:"[_0.copyToClipboard(_0.unparse(_1))]"}}],f:["Raport"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["t"],s:"_0===\"tree\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.resulttype\",\"tree\")]"}}],n:50,x:{r:["t"],s:"_0!==\"tree\""}},{n:"title",f:"Show result as an object tree.",t:13,g:1}],f:["Tree"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["t"],s:"_0===\"html\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.resulttype\",\"html\")]"}}],n:50,x:{r:["t"],s:"_0!==\"html\""}},{n:"title",f:"Show result as HTML",t:13,g:1}],f:["HTML"]}],n:54,z:[{n:"t",x:{r:"~/temp.expr.resulttype"}}]}]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"margin-left: 2em;",g:1}],f:[{t:4,f:[{t:7,e:"label",m:[{n:"title",f:"Enable to display JSON with no additional whitespace",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",t:13,f:[{t:2,r:"~/temp.expr.jsonsquash"}]}]}," Compact?"]}],n:50,x:{r:["~/temp.expr.resulttype"],s:"_0===\"json\""}}," ",{t:4,f:[{t:7,e:"label",m:[{t:13,n:"style",f:"margin-right: 1em;",g:1},{n:"title",f:"Change value display format",t:13,g:1}],f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"~/temp.expr.treefmt"}],t:13}],f:[{t:7,e:"option",f:["string"]},{t:7,e:"option",f:["json"]},{t:7,e:"option",f:["raport"]}]}]}," ",{t:7,e:"label",m:[{n:"title",f:"Expand all nodes",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",t:13,f:[{t:2,r:"~/temp.expr.expandall"}]}]}," Expand all?"]}],n:50,x:{r:["~/temp.expr.resulttype"],s:"_0===\"tree\""}}]}]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 1;",g:1},{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:4,f:[{t:7,e:"span",m:[{n:"style",f:["color: ",{t:2,r:"@style.code.c12"},";"],t:13}],f:["undefined"]}],n:50,x:{r:["~/temp.expr.result"],s:"_0===undefined"}},{t:4,f:[{t:4,f:[{t:3,r:"~/temp.expr.result"}],n:50,x:{r:["~/temp.expr.resulttype"],s:"_0===\"html\""}},{t:4,f:[{t:7,e:"code",f:[{t:7,e:"pre",f:[{t:2,x:{r:["~/temp.expr.result","~/temp.expr.jsonsquash"],s:"JSON.stringify(_0,null,_1?undefined:\"  \")"}}]}]}," "],n:50,x:{r:["~/temp.expr.resulttype"],s:"_0===\"json\""},l:1},{t:4,f:[" ",{t:7,e:"code",f:[{t:7,e:"pre",f:[{t:2,x:{r:["@this","~/temp.expr.result"],s:"_0.unparse(_1)"}}]}]}," "],n:50,x:{r:["~/temp.expr.resulttype"],s:"_0===\"raport\""},l:1},{t:4,f:[" ",{t:8,r:"tree-view",c:{r:"~/temp.expr.result"}}," "],n:50,x:{r:["~/temp.expr.resulttype"],s:"_0===\"tree\""},l:1},{t:4,f:[" ",{t:7,e:"code",f:[{t:7,e:"pre",f:[{t:2,r:"~/temp.expr.result"}]}]}],n:51,l:1}],n:51,l:1}]}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab parsed",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["~/temp.expr.tab"],s:"_0===\"parsed\""}}]}],f:[{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 1;",g:1},{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"code",f:[{t:7,e:"pre",m:[{t:13,n:"style",f:"margin: 1em;",g:1}],f:[{t:4,f:[{t:2,r:"~/temp.expr.errormsg"}],n:50,r:"~/temp.expr.errormsg"},{t:4,f:[{t:4,f:[{t:2,x:{r:["@this","~/temp.expr.ast"],s:"_0.unparse(_1)"}}],n:50,x:{r:["~/temp.expr.parsedtype"],s:"_0===\"raport\""}},{t:4,f:[{t:2,x:{r:["~/temp.expr.ast","~/temp.expr.jsonsquash"],s:"JSON.stringify(_0,null,_1?\"\":\"  \")"}}],n:51,l:1}],n:51,l:1}]}]}]}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab logs",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["~/temp.expr.tab"],s:"_0===\"logs\""}}]}],f:[{t:7,e:"div",m:[{t:13,n:"style",f:"margin-top: 0.2em; border-bottom: 1px dotted rgba(128, 128, 128, 0.5);",g:1}]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 1;",g:1},{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"log-entry",g:1}],f:[{t:7,e:"pre",f:[{t:7,e:"code",f:[{t:2,x:{r:["./1"],s:"_0.join(\" \")"}}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"time",g:1}],f:[{t:2,r:"./0"}]}]}],n:52,r:"~/temp.logs"}]}]}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"context",g:1},{n:"style-display",f:[{t:2,x:{r:["~/temp.expr.tab"],s:"_0===\"ast\"||_0===\"text\"||_0===\"html\"?\"\":\"none\""}}],t:13}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"header",g:1},{n:"title",f:"The approximate data that should be available in this expression's context",t:13,g:1}],f:[{t:7,e:"div",m:[{t:13,n:"style",f:"margin-right: 0.5em;",g:1}],f:["Context"]},{t:7,e:"div",f:[{t:7,e:"input",m:[{n:"placeholder",f:"Filter...",t:13},{n:"value",f:[{t:2,r:"~/ctxsearch"}],t:13},{t:73,v:"l",f:"500"},{n:"style",f:"width: 100%;",t:13}]}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"panel scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:4,f:[{t:8,r:"expr-context",c:{r:"~/temp.expr.ctx"}}],n:50,r:"~/temp.expr.ctx"}]}]}]}," "]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab properties",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["~/temp.bottom.tab"],s:"_0===\"param\""}}]}],f:[{t:4,f:[{t:7,e:"label",m:[{n:"title",f:"The name used to reference this parameter e.g. !name",t:13,g:1}],f:[{t:7,e:"span",f:["Name"]},{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".name"}],t:13}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",f:["Type"]},{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".type"}],t:13}],f:[{t:8,r:"types"}]}]}," ",{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",f:["Refine"]},{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".refine"}],t:13}],f:[" ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"undefined"}}],t:13}],f:["(none)"]}," ",{t:7,e:"option",m:[{n:"value",f:"text",t:13}],f:["Multiline Text"]}," ",{t:7,e:"option",m:[{n:"value",f:"code",t:13}],f:["Expression"]}]}]}],n:50,x:{r:[".type"],s:"_0===\"string\""}}," ",{t:7,e:"label",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:".required"}],t:13}]}," Require?"]}," ",{t:7,e:"label",m:[{n:"title",f:"An alternative to the name to show in the parameter fill interface",t:13,g:1}],f:[{t:7,e:"span",f:["Label"]},{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".label"}],t:13}]}]}," ",{t:4,f:[{t:7,e:"label",m:[{n:"title",f:"Add an Initialization expression to provide a default for the parameter",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{t:73,v:"t",f:"false"},{n:["change"],t:70,f:{r:["@context"],s:"[(_0).set(\".init\",\"\")]"}}]}," Initialization expression?"]}],n:50,x:{r:[".init"],s:"_0===undefined"}},{t:4,f:[{t:7,e:"label",m:[{n:"title",f:"Add an Initialization expression to provide a default for the parameter",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{t:73,v:"t",f:"false"},{n:"checked",f:0,t:13},{n:["change"],t:70,f:{r:["@context"],s:"[(_0).set(\".init\",undefined)]"}}]}," Initialization expression?"]}," ",{t:7,e:"div",m:[{n:"style",f:["height: 5em; border: 1px solid ",{t:2,r:"@style.border"},"; overflow: auto; margin: 0 0.5em;"],t:13}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".init"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:51,l:1}," ",{t:7,e:"label",m:[{n:"title",f:"Set up options to render the parameter as a select",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{t:73,v:"t",f:"false"},{n:"checked",f:[{t:2,x:{r:[".options"],s:"Array.isArray(_0)"}}],t:13},{n:["change"],t:70,f:{r:["@context",".options"],s:"[(_0).set(\".options\",Array.isArray(_1)?undefined:[])]"}}]}," Options?"]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"height: 100%; width: 30rem;",g:1},{t:13,n:"class",f:"options",g:1}],f:[{t:7,e:"h3",f:["Options"]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"option-entry",g:1}],f:[{t:19,f:[{t:7,e:"label",f:[{t:7,e:"span",f:["Label"]},{t:7,e:"br"},{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"ctx.label"}],t:13}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",f:["Value"]},{t:7,e:"br"},{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"ctx.value"}],t:13}]}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:"disabled",f:[{t:2,x:{r:["ctx.value"],s:"!_0"}}],t:13},{n:["click"],t:70,f:{r:["ctx.label","ctx.value","@context"],s:"[(_2).push(\".options\",!_0?_1:{label:_0,value:_1}),(_2).set({\"ctx.label\":\"\",\"ctx.value\":\"\"})]"}}],f:["+"]}],n:54,z:[{n:"ctx",x:{r:"@local"}}]}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:4,f:[{t:7,e:"div",f:[{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"."}],t:13}]}],n:50,x:{r:["."],s:"typeof _0===\"string\""}},{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".label"}],t:13}]}," ",{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".value"}],t:13}]}],n:51,l:1}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context","@index"],s:"[(_0).splice(\"../\",_1,1)]"}}],f:[{t:8,r:"times"}]}]}],n:52,r:".options"}]}]}],n:50,r:".options"}]}],n:50,x:{r:[".options"],s:"Array.isArray(_0)"}}],n:54,r:"~/param"}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab properties",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["~/temp.bottom.tab"],s:"_0===\"params\""}}]}],f:[{t:8,r:"bottom-parameters"}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab properties",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["~/temp.bottom.tab"],s:"_0===\"source\""}}]}],f:[{t:4,f:[{t:7,e:"label",m:[{n:"title",f:"Expose this source to the report context with this name. If none is provided, this source will be named based on its upstream source.",t:13,g:1}],f:[{t:7,e:"span",f:["Name"]},{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".name"}],t:13}]}]}," ",{t:4,f:[{t:7,e:"label",m:[{n:"title",f:"The upstream source that this source should be based on.",t:13,g:1}],f:[{t:7,e:"span",f:["Source"]},{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".source"}],t:13}],f:[{t:4,f:[{t:7,e:"option",f:[{t:2,r:".name"}]}],n:52,r:"~/report.sources"}]}]}],n:50,x:{r:["~/temp.bottom.source"],s:"~_0.indexOf(\"widget\")"}},{t:4,f:[{t:7,e:"label",m:[{n:"title",f:"The upstream source that this source should be based on.",t:13,g:1}],f:[{t:7,e:"span",f:["Source"]},{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".source"}],t:13}],f:[{t:4,f:[{t:7,e:"option",f:[{t:2,r:".name"}]}],n:52,r:"~/sources"}]}]}],n:51,l:1}," ",{t:7,e:"label",m:[{n:"title",f:"An expression providing the base data for this source. This will override the upstream source, which is available in this expression as @source.",t:13,g:1}],f:[{t:7,e:"span",f:["Base ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@this","~/temp.bottom.source"],s:"[_0.editExpr(_1+\".base\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"div",m:[{n:"style",f:["height: 5em; border: 1px solid ",{t:2,r:"@style.border"},"; overflow: auto; margin: 0;"],t:13}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".base"}],t:13},{n:"tabout",f:0,t:13}]}]}]}," ",{t:7,e:"label",m:[{n:"title",f:"A filter expression to apply to the source before it is used.",t:13,g:1}],f:[{t:7,e:"span",f:["Filter ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@this","~/temp.bottom.source"],s:"[_0.editExpr(_1+\".filter\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"div",m:[{n:"style",f:["height: 5em; border: 1px solid ",{t:2,r:"@style.border"},"; overflow: auto; margin: 0;"],t:13}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".filter"}],t:13},{n:"tabout",f:0,t:13}]}]}]}," ",{t:7,e:"label",m:[{n:"title",f:"A sort expression to apply to the source before it is used. This should be an array of applications or config objects with by keys having application values.",t:13,g:1}],f:[{t:7,e:"span",f:["Sort ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@this","~/temp.bottom.source"],s:"[_0.editExpr(_1+\".sort\")]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"div",m:[{n:"style",f:["height: 5em; border: 1px solid ",{t:2,r:"@style.border"},"; overflow: auto; margin: 0;"],t:13}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".sort"}],t:13},{n:"tabout",f:0,t:13}]}]}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"height: 100%; width: 20rem;",g:1},{t:13,n:"class",f:"options",g:1}],f:[{t:7,e:"h3",f:[{t:7,e:"button",m:[{t:13,n:"style",f:"float: right;",g:1},{t:13,n:"class",f:"ico large",g:1},{n:"title",f:"Add group expression",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).push(\".group\",\"\")]"}}],f:["+"]}," ",{t:7,e:"label",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:".group"}],t:13},{t:73,v:"t",f:"false"},{n:["change"],t:70,f:{r:["@context"],s:"[(_0).set(\".group\",undefined)]"}}]}," Groups"]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"group-edit",g:1}],f:[{t:7,e:"span",f:[{t:2,x:{r:["@index"],s:"_0+1"}}]}," ",{t:7,e:"div",m:[{n:"style",f:["height: 5em; border: 1px solid ",{t:2,r:"@style.border"},"; overflow: auto; margin: 0.5em; flex-grow: 1;"],t:13}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:"."}],t:13},{n:"tabout",f:0,t:13}]}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit group expression",t:13,g:1},{n:["click"],t:70,f:{r:["@this","@keypath"],s:"[_0.editExpr(\"~/\"+_1)]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"pencil"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Remove group expression",t:13,g:1},{n:["click"],t:70,f:{r:["@context","@index"],s:"[(_0).splice(\"../\",_1,1)]"}},{n:"tabindex",f:"-1",t:13,g:1}],f:[{t:8,r:"times"}]}]}],n:52,r:".group"}]}]}]}],n:50,x:{r:[".group"],s:"Array.isArray(_0)"}},{t:4,f:[{t:7,e:"label",f:[{t:7,e:"input",m:[{n:"title",f:"Group the rows in this source by one or more expression? This should be coordinated with the sort expression, as groups are produced by sequentially processing the source data.",t:13},{n:"type",f:"checkbox",t:13},{n:["change"],t:70,f:{r:["@context"],s:"[(_0).set(\".group\",[\"\"])]"}}]}," Group?"]}],n:51,l:1}],n:54,r:"~/source"}]}]}]}," ",{t:7,e:"datalist",m:[{n:"id",f:"operators",t:13,g:1}],f:[{t:4,f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,r:"./0"}],t:13}]}],n:52,r:"~/operators"}]}],"tree-node":[{t:7,e:"div",m:[{t:13,n:"class",f:"tree-view-tree",g:1}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"tree-view-node",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"tree-view-key",g:1},{n:"title",f:[{t:2,x:{r:["@keypath"],s:"(_0+\"\").replace(/temp.expr.result./,\"\")"}}],t:13}],f:[{t:2,r:"@key"},{t:7,e:"span",m:[{t:13,n:"style",f:"color: #aaa;",g:1}],f:[":"]},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"style",f:"color: #aaa; margin-left: 0.5em;",g:1}],f:[{t:2,x:{r:["."],s:"Array.isArray(_0)?\"[\":\"{\""}}]}],n:50,x:{r:["."],s:"typeof _0===\"object\""}}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"tree-view-expand",g:1},{t:4,f:[{n:"class-tree-view-show",t:13},{n:["click"],t:70,f:{r:["@this","escapeKey","@keypath"],s:"[_0.toggle(\"temp.expr.expand.\"+_1(_2))]"}}],n:50,x:{r:["."],s:"typeof _0===\"object\""}}],f:[{t:4,f:["-"],n:50,rx:{r:"~/temp.expr.expand",m:[{t:30,n:"@keypath"}]}},{t:4,f:["+"],n:51,l:1}]}],n:51,r:"~/temp.expr.expandall"}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tree-view-value",g:1},{n:"class-tree-view-children",t:13,f:[{t:2,x:{r:[".","~/temp.expr.expandall","@keypath","~/temp.expr.expand"],s:"typeof _0===\"object\"&&(_1||_3[_2])"}}]}],f:[{t:4,f:[{t:4,f:[{t:8,r:"tree-node",c:{r:"."}}," ",{t:7,e:"span",m:[{t:13,n:"style",f:"color: #aaa; margin-left: 0.5em;",g:1}],f:[{t:2,x:{r:["."],s:"Array.isArray(_0)?\"]\":\"}\""}}]}],n:50,x:{r:["~/temp.expr.expandall","@keypath","~/temp.expr.expand"],s:"_0||_2[_1]"}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"tree-view-type",g:1}],f:[{t:4,f:["]"],n:50,x:{r:["."],s:"Array.isArray(_0)"}},{t:4,f:["}"],n:51,l:1}]}],n:51,l:1}],n:50,x:{r:["."],s:"typeof _0===\"object\""}},{t:4,f:[{t:2,x:{r:["@this","."],s:"_0.treeString(_1)"}}],n:51,l:1}]}]}],n:52,r:"."}]}],"tree-view":[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"tree-view",g:1}],f:[{t:7,e:"span",m:[{t:13,n:"style",f:"color: #aaa; margin-left: 0.5em;",g:1}],f:[{t:2,x:{r:["."],s:"Array.isArray(_0)?\"[\":\"{\""}}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"root",g:1}],f:[{t:8,r:"tree-node",c:{r:"."}}]}," ",{t:7,e:"span",m:[{t:13,n:"style",f:"color: #aaa; margin-left: 0.5em;",g:1}],f:[{t:2,x:{r:["."],s:"Array.isArray(_0)?\"]\":\"}\""}}]}]}],n:50,x:{r:["."],s:"typeof _0===\"object\""}},{t:4,f:[{t:2,x:{r:["@this","."],s:"_0.treeString(_1)"}}],n:51,l:1}],"expr-context":[{t:4,f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"context-entry",g:1},{n:"class-entry-local",t:13,f:[{t:2,r:".meta.local"}]},{n:"class-expanded",t:13,f:[{t:2,rx:{r:"~/exprExpand",m:[{t:30,n:"@keypath"}]}}]}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"entry-details",g:1}],f:[{t:7,e:"div",f:[{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"expand",g:1},{n:["click"],t:70,f:{r:["@this","@keypath"],s:"[_0.exprToggle(_1)]"}}],f:[{t:2,x:{r:["@keypath","~/exprExpand"],s:"_1[_0]?\"-\":\"+\""}}]}],n:50,r:".fields"}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"entry-name",g:1},{n:["click"],t:70,f:{r:["@this","@keypath"],s:"[_0.insertRef(_1)]"}}],f:[{t:2,r:".name"}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"entry-type",g:1}],f:[{t:2,r:".type"}]}]}," ",{t:4,f:[{t:8,r:"expr-context"}],n:50,r:".fields"}]}],n:50,x:{r:[".fields",".name","~/ctxsearch"],s:"!_2||_0||~_1.indexOf(_2)"}}],n:52,r:".fields"}],"ast-dim-actions":[{t:7,e:"div",m:[{t:13,n:"class",f:"ast-actions",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["../","@index","@context"],s:"[Array.isArray(_0)?(_2).splice(\"../\",_1,1):(_2).set(\".\",undefined)]"}}],f:[{t:8,r:"times"}]}]}],"ast-actions":[{t:7,e:"div",m:[{t:13,n:"class",f:"ast-actions",g:1}],f:[{t:4,f:[{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico text",g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".source\",{r:\"\"})]"}}],f:["+ Source"]}],n:51,r:".source"}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico text",g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".apply\",{r:\"\"})]"}}],f:["+ Application"]}],n:51,r:".apply"}],n:50,x:{r:[".op","~/operators"],s:"_1[_0]&&_1[_0].type===\"aggregate\""}}," ",{t:7,e:"select",m:[{t:73,v:"t",f:"false"},{n:["change"],t:70,f:{r:["@this","@keypath","@node.value"],s:"[_0.retypeASTNode(_1,_2)]"}},{n:"value",f:[{t:2,x:{r:[".v","."],s:"_1&&\"op\" in _1?\"operator\":_1&&\"v\" in _1?(typeof _0===\"string\"?\"string\":typeof _0===\"number\"?\"number\":\"object\"):_1&&\"r\" in _1?\"reference\":\"undefined\""}}],t:13}],f:[{t:7,e:"option",f:["operator"]}," ",{t:7,e:"option",f:["string"]}," ",{t:7,e:"option",f:["number"]}," ",{t:7,e:"option",f:["reference"]}," ",{t:7,e:"option",f:["undefined"]}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["../","@index","@context"],s:"[Array.isArray(_0)?(_2).splice(\"../\",_1,1):(_2).set(\".\",undefined)]"}}],f:[{t:8,r:"times"}]}]}],"ast-node":[{t:7,e:"div",m:[{n:["click"],t:70,f:{r:["~/temp.expr.partpath","@this","@keypath"],s:"[_0!==_2&&[_1.link(_2,\"temp.expr.part\"),_1.set(\"temp.expr.partpath\",_2)],false]"}},{n:"class",f:["ast-node ast-",{t:2,x:{r:["."],s:"(_0&&(\"op\" in _0?\"op\":\"v\" in _0?\"value\":\"r\" in _0?\"ref\":\"wat\"))||\"wat\""}}],t:13},{n:"class-ast-active-node",t:13,f:[{t:2,x:{r:["~/temp.expr.partpath","@keypath"],s:"_0===_1"}}]}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"ast-content",g:1}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"ast-op-name",g:1}],f:[{t:7,e:"div",f:[{t:2,r:"prefix"},"(",{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".op"}],t:13},{n:"list",f:"operators",t:13}]}]},{t:8,r:"ast-actions"}]}," ",{t:4,f:[{t:8,r:"ast-node"}],n:52,r:".args"}," ",{t:7,e:"div",f:[") ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).push(\".args\",{v:\"\"})]"}}],f:["+"]}]}],n:50,x:{r:["."],s:"_0&&\"op\" in _0"}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"ast-content-value",g:1}],f:[{t:7,e:"div",f:[{t:2,r:"prefix"}," ",{t:4,f:[{t:7,e:"textarea",m:[{n:"rows",f:"1",t:13},{n:"cols",f:"30",t:13}],f:[{t:2,r:".v"}]}],n:50,x:{r:[".v"],s:"typeof _0===\"string\""}},{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".v"}],t:13},{n:"type",f:"number",t:13}]}],n:50,x:{r:[".v"],s:"typeof _0===\"number\""},l:1}]}," ",{t:8,r:"ast-actions"}]}," "],n:50,x:{r:["."],s:"_0&&\"v\" in _0"},l:1},{t:4,f:[" ",{t:7,e:"div",m:[{t:13,n:"class",f:"ast-content-ref",g:1}],f:[{t:7,e:"div",f:[{t:2,r:"prefix"},{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".r"}],t:13}]}]}," ",{t:8,r:"ast-actions"}]}],n:50,x:{r:["."],s:"_0&&\"r\" in _0"},l:1}]}],n:50,x:{r:["~/temp.expr.partpath","@keypath"],s:"_0===_1"}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"ast-content",g:1}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"ast-op-name",g:1}],f:[{t:7,e:"div",f:[{t:2,r:"prefix"},"(",{t:2,r:".op"}]},{t:8,r:"ast-dim-actions"}]}," ",{t:4,f:[{t:4,f:[{t:8,r:"ast-node",c:{r:".source"},z:[{n:"prefix",x:{x:{r:[],s:"\"+ \""}}}]}],n:50,r:".source"}," ",{t:4,f:[{t:8,r:"ast-node",c:{r:".apply"},z:[{n:"prefix",x:{x:{r:[],s:"\"=> \""}}}]}],n:50,r:".apply"}],n:50,x:{r:[".op","~/operators"],s:"_1[_0]&&_1[_0].type===\"aggregate\""}}," ",{t:4,f:[{t:8,r:"ast-node"}],n:52,r:".args"}," )"],n:50,x:{r:["."],s:"_0&&\"op\" in _0"}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"ast-content-value",g:1}],f:[{t:7,e:"div",m:[{n:"class-ast-string",t:13,f:[{t:2,x:{r:[".v"],s:"typeof _0===\"string\""}}]},{n:"class-ast-number",t:13,f:[{t:2,x:{r:[".v"],s:"typeof _0===\"number\""}}]}],f:[{t:2,r:"prefix"},{t:2,r:".v"}]},{t:8,r:"ast-dim-actions"}]}," "],n:50,x:{r:["."],s:"_0&&\"v\" in _0"},l:1},{t:4,f:[" ",{t:7,e:"div",m:[{t:13,n:"class",f:"ast-content-ref",g:1}],f:[{t:7,e:"div",f:[{t:2,r:"prefix"},{t:2,r:".r"}," (ref)"]},{t:8,r:"ast-dim-actions"}]}],n:50,x:{r:["."],s:"_0&&\"r\" in _0"},l:1}]}],n:51,l:1}]}],"bottom-parameters":[{t:7,e:"div",m:[{t:13,n:"class",f:"parameters",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"style",f:"display: flex; justify-content: space-around;",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico text",g:1},{n:["click"],t:70,f:{r:["@this","params"],s:"[_0.set(\"report.defaultParams\",_1)]"}},{n:"title",f:"Save these values as the report defaults",t:13,g:1}],f:["Save as Defaults"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico text",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.initParams()]"}},{n:"title",f:"Re-initialize all parameters",t:13,g:1}],f:["Re-init Params"]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"param-editor",g:1}],f:[{t:4,f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"param",g:1}],f:[{t:4,f:[{t:7,e:"label",m:[{t:13,n:"class",f:"check",g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,rx:{r:"~/params",m:[{t:30,n:".name"}]}}],t:13}]}," ",{t:2,x:{r:[".label",".name"],s:"_0||_1"}}]}],n:50,x:{r:[".type"],s:"_0===\"boolean\""}},{t:4,f:[{t:7,e:"label",m:[{t:13,n:"class",f:"pick",g:1}],f:[{t:2,x:{r:[".label",".name"],s:"_0||_1"}},{t:7,e:"select",m:[{n:"value",f:[{t:2,rx:{r:"~/params",m:[{t:30,n:".name"}]}}],t:13}],f:[" ",{t:4,f:[{t:4,f:[{t:7,e:"option",f:[{t:2,r:"."}]}],n:50,x:{r:["."],s:"typeof _0===\"string\""}},{t:4,f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,r:".value"}],t:13}],f:[{t:2,r:".label"}]}],n:51,l:1}],n:52,r:".options"}]}]}," "],n:50,r:".options.length",l:1},{t:4,f:[" ",{t:4,f:[{t:7,e:"div",f:[{t:2,x:{r:[".label",".name"],s:"_0||_1"}}]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"height: 5em; border: 1px solid #ccc; overflow: auto;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,rx:{r:"~/params",m:[{t:30,n:".name"}]}}],t:13}]}]}],n:50,x:{r:[".refine"],s:"_0===\"code\""}},{t:4,f:[{t:7,e:"label",f:[{t:7,e:"div",f:[{t:2,x:{r:[".label",".name"],s:"_0||_1"}}]}," ",{t:7,e:"textarea",f:[{t:2,rx:{r:"~/params",m:[{t:30,n:".name"}]}}]}]}," "],n:50,x:{r:[".refine"],s:"_0===\"text\""},l:1},{t:4,f:[" ",{t:7,e:"label",m:[{t:13,n:"class",f:"string",g:1}],f:[{t:2,x:{r:[".label",".name"],s:"_0||_1"}}," ",{t:7,e:"input",m:[{n:"value",f:[{t:2,rx:{r:"~/params",m:[{t:30,n:".name"}]}}],t:13}]}]}],n:51,l:1}," "],n:50,x:{r:[".type"],s:"_0===\"string\""},l:1},{t:4,f:[" ",{t:7,e:"label",m:[{t:13,n:"class",f:"string",g:1}],f:[{t:2,x:{r:[".label",".name"],s:"_0||_1"}}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"height: 1em; border: 1px solid #ccc; padding: 0.25em; text-align: center;",g:1}],f:[{t:2,r:".type"}," Parameter"]}]}," "],n:50,x:{r:[".type"],s:"_0===\"object\"||_0===\"array\"||_0.slice(-2)===\"[]\""},l:1},{t:4,f:[" ",{t:7,e:"label",m:[{t:13,n:"class",f:"string",g:1}],f:[{t:2,x:{r:[".label",".name"],s:"_0||_1"}}," ",{t:4,f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,rx:{r:"~/params",m:[{t:30,n:".name"}]}}],t:13}]}],n:50,x:{r:[".type"],s:"_0===\"number\""}},{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,rx:{r:"~/params",m:[{t:30,n:".name"}]}}],t:13}]}],n:51,l:1}]}],n:51,l:1}]}],n:50,r:".name"}],n:52,r:"~/report.parameters"}]}]}]}};
    const css$1 = function(data) { return [(function () { return this.Ractive({ template: {v:4,t:["h3 { padding: 0.5rem; margin: 0; } input, select, textarea { font-size: 0.875rem; } .raport-wrapper { font-family: sans-serif; } .left-bar { position: absolute; left: 0; width: 2rem; top: 0; bottom: 0; z-index: 20; background-color: ",{t:2,r:"@style.bg"},"; display: flex; flex-direction: column; padding-top: 0.5rem; align-items: center; } .left-bar .ico { margin-bottom: 1.5rem; } .ico.off svg { opacity: 0.3; } .left-pop { transform: translateX(-105%); position: absolute; left: 2rem; top: 0; bottom: 0; z-index: 19 !important; transition: transform 0.2s ease-in-out; } .left-pop.popped { transform: translateX(0); } .top-bar { position: absolute; top: 0; left: 2rem; right: 0; height: 2.1rem; background-color: ",{t:2,r:"@style.bg"},"; color: ",{t:2,r:"@style.fg"},"; overflow-x: auto; } .top-bar > .actions { min-width: max-content; height: 2.1rem; } .bottom-bar { position: absolute; left: 2rem; right: 0; bottom: 0; height: 2rem; background-color: ",{t:2,r:"@style.bg"},"; z-index: 10; padding: 0 0.5rem; color: ",{t:2,r:"@style.fg"},"; overflow-x: auto; } .bottom-bar > .actions { min-width: max-content; } .proppop .top-bar.shrinkleft { left: ",{t:2,x:{r:["@style.leftwidth"],s:"(_0||28)+2"}},"rem; } .proppop .bottom-bar.shrinkleft { left: ",{t:2,x:{r:["@style.leftwidth"],s:"(_0||28)+2"}},"rem; } .proppop .center-pane.shrinkleft { left: ",{t:2,x:{r:["@style.leftwidth"],s:"(_0||28)+2"}},"rem; } .proppop .bottom-pane.shrinkleft { left: ",{t:2,x:{r:["@style.leftwidth"],s:"(_0||28)+2"}},"rem; } @media screen and (max-width: 60rem) { .left-pop { box-shadow: 0 0 1rem #000; } } .bottom-pop { position: absolute; left: 2rem; right: 0; z-index: 9 !important; bottom: 2rem; transform: translateY(-100%); transition: transform 0.2s ease-in-out; } .bottom-pop.popped { transform: translateY(0); } .center-pane { position: absolute; left: 2rem; right: 0; bottom: 2rem; top: 2.1rem; z-index: 5; } .center-pane.shrinkbottom { bottom: calc(",{t:2,x:{r:["@style.bottomheight"],s:"_0||33"}},"vh + 2rem); } button.plain { text-decoration: none; text-align: center; letter-spacing: 0.5px; cursor: pointer; user-select: none; border: none; border-radius: 0.2rem; padding: 0 1.25rem; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2); transition: 0.2s ease-in-out; transition-property: box-shadow, opacity, background-color; font-size: 0.7rem; line-height: 1.5rem; background-color: ",{t:2,r:"@style.active"},"; color: ",{t:2,r:"@style.btntxt"},"; vertical-align: middle; min-height: 2.25rem; outline: 0; margin: 0.25rem; position: relative; overflow: hidden; -webkit-tap-highlight-color: transparent; font-family: inherit; } button.plain:hover { background-color: ",{t:2,r:"@style.hover"},"; } span.ico, button.ico { display: inline-block; border: none; background-color: transparent; cursor: pointer; outline: none; width: 1.2rem; height: 1.2rem; font-size: 0.8rem; margin-left: 0.1rem; box-sizing: content-box; color: ",{t:2,r:"@style.fg"},"; } span.ico svg, button.ico svg { fill: ",{t:2,r:"@style.fg"},"; stroke: ",{t:2,r:"@style.fg"},"; } span.ico.error svg, button.ico.error svg { fill: ",{t:2,r:"@style.error"},"; stroke: ",{t:2,r:"@style.error"},"; } button.ico.text { width: auto; } button.hide { border: none; width: 0; height: 0; padding: 0; outline: none; } button.ico:hover svg { fill: ",{t:2,r:"@style.hover"},"; } button.ico:hover { color: ",{t:2,r:"@style.hover"},"; } button.ico svg.pencil { stroke: ",{t:2,r:"@style.fg"},"; fill: none; } button.ico:hover svg.pencil { stroke: ",{t:2,r:"@style.hover"},"; fill: none; } button.ico.large { font-size: 1.5rem; width: 1.5rem; height: 1.5rem; padding: 0 0.5rem; } .properties button.ico.large { line-height: 1.5rem; } button.ico:disabled { color: ",{t:2,r:"@style.border"},"; cursor: default; } span.which { flex-grow: 0; flex-shrink: 1; white-space: nowrap; line-height: 1.5rem; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; cursor: pointer; } span.which button { flex-shrink: 0; } .raport-report { display: flex; flex-grow: 1; flex-shrink: 1; font-family: sans-serif; box-sizing: border-box; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; overflow: hidden; } button.add { width: 2rem; height: 2rem; line-height: 1em; text-align: center; border-radius: 2rem; background-color: ",{t:2,r:"@style.active"},"; color: ",{t:2,r:"@style.btntxt"},"; margin: 0.5rem; border: none; cursor: pointer; font-size: 1.5em; transition: background-color 0.2s ease-in-out; } button.add:hover { background-color: ",{t:2,r:"@style.hover"},"; } select { padding: 0.2rem; border-style: solid; border-width: 0 0 1px 0; background: none; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; } .layout { display: flex; flex-direction: column; flex-grow: 2; flex-shrink: 1; box-sizing: border-box; overflow: hidden; } .layout.pad-me { padding-bottom: 32.5vh; } .layout > .tab { background-color: ",{t:2,r:"@style.dark"},"; font-size: 0.875rem; } .editor > .tab, .layout > .tab { flex-grow: 10; flex-shrink: 1; overflow: hidden; max-height: 0; } .editor > .active-tab, .layout > .active-tab { max-height: none; } .designer { display: flex; flex-direction: column; } .spacer { margin-right: 3em; } .actions { display: flex; align-items: center; z-index: 2; } .actions .tab { box-sizing: border-box; padding: 0.5em; margin: 0 0.5em; background-color: ",{t:2,r:"@style.border"},"; color: ",{t:2,r:"@style.fg"},"; border-style: solid; border-width: 1px 1px 0 1px; font-weight: bold; cursor: pointer; outline: none; border-color: ",{t:2,r:"@style.border"},"; font-size: 0.875rem; } .actions .tab:first-of-type { margin-left: 0; } .actions span.ico { vertical-align: sub; } .actions .center { margin: auto; font-family: sans-serif; font-size: 0.8em; margin-right: 1em; } .actions a { color: ",{t:2,r:"@style.fg"},"; text-decoration: none; } .actions .right { margin-left: auto; } .actions.design .tab { background-color: ",{t:2,r:"@style.bg"},"; border-color: ",{t:2,r:"@style.border"},"; color: ",{t:2,r:"@style.fg"},"; } .actions .tab.active { background-color: ",{t:2,r:"@style.dark"},"; color: ",{t:2,r:"@style.btntxt"},"; border: none; border-top: 2px solid ",{t:2,r:"@style.highlight"},"; margin-bottom: -1px; } .actions .tab.output-tab.active { background-color: ",{t:2,x:{r:["@style.out.dark","@style.dark"],s:"_0||_1"}},"; color: ",{t:2,x:{r:["@style.out.fg","@style.fg"],s:"_0||_1"}},"; } .bottom-pane .actions .tab { line-height: 1.3rem; } .bottom-pane .actions .tab.active { background-color: ",{t:2,r:"@style.bg"},"; border-color: ",{t:2,r:"@style.border"},"; color: ",{t:2,r:"@style.fg"},"; margin-bottom: -2px; border-style: solid; border-width: 1px; border-bottom-color: ",{t:2,r:"@style.bg"},"; border-top-width: 2px; border-top-color: ",{t:2,r:"@style.fg"},"; } .bottom-pane .actions button.error { color: ",{t:2,r:"@style.error"},"; } .bottom-pane .actions button.error svg { fill: ",{t:2,r:"@style.error"},"; } .bottom-pane .actions .tab.error { border-color: ",{t:2,r:"@style.error"},"; color: ",{t:2,r:"@style.btntxt"},"; background-color: ",{t:2,r:"@style.error"},"; } .bottom-pane .actions .tab.active.error { background-color: ",{t:2,r:"@style.bg"},"; color: ",{t:2,r:"@style.error"},"; border-bottom-color: ",{t:2,r:"@style.bg"},"; } .bottom-pane { position: absolute; left: 2rem; right: 0; bottom: 2rem; height: ",{t:2,x:{r:["@style.bottomheight"],s:"_0||33"}},"vh; overflow: hidden; flex-shrink: 0; display: flex; flex-direction: column; flex-grow: 0; box-sizing: border-box; background-color: ",{t:2,r:"@style.bg"},"; transform: translateY(105%); transition: transform 0.2s ease-in-out; z-index: 8; border-style: solid; border-color: ",{t:2,r:"@style.border"},"; border-width: 0 0 1px 1px; } .bottom-pane.max { height: calc(100vh - 2rem); } .bottom-pane.active { transform: translateY(0); border-top: 1px solid ",{t:2,r:"@style.border"},"; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; } .result { display: flex; flex-grow: 2; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; } iframe { display: block; border: none; } .bar { height: 2rem; background-color: ",{t:2,r:"@style.dark"},"; color: ",{t:2,r:"@style.fg"},"; display: flex; align-items: center; font-size: 0.75rem; border-bottom: 1px solid ",{t:2,r:"@style.border"},"; box-sizing: border-box; padding: 0 0.25rem; user-select: none; transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out; opacity: 0; position: absolute; width: 100%; top: -2rem; height: 2rem; left: 0; } .delimited.paper .bar { opacity: 1; } .delimited.paper .active-widget { border: none; background-color: ",{t:2,r:"@style.bg"},"; } .delimited.paper .active-widget > .bar { top: -4.5rem; left: -0.5rem; right: -0.5rem; width: auto; } .delimited.paper .hover-widget { margin-top: 2.5rem; background-color: ",{t:2,r:"@style.bg"},"; } .active-widget > .bar, .hover-widget > .bar, .bar.active, .bar.hover { opacity: 1; } .shiftKey.paper .widget .bar { pointer-events: none; } .bar * { margin: 0 0.5em 0 0; } .bar .name { color: ",{t:2,r:"@style.btntxt"},"; } .bar button, .bar .btn { background: none; color: #fff; border: none; cursor: pointer; font-size: inherit; padding: 0 0.5em; } .bar select { background: none; border: none; color: #fff; height: 1rem; font-size: 0.6rem; padding: 0; } div.widgets { display: flex; flex-wrap: wrap; align-content: flex-start; position: relative; height: min-content; width: calc(100% + 3px); left: -1.5px; background-position: 1.5rem 1.5rem; background-size: 1rem 1rem; z-index: 10; } div.widgets.manual { display: inline-block; } div.widget { cursor: pointer; display: block; border: 1px dotted rgba(0, 0, 0, 0.2); box-sizing: border-box; font-size: 0.83rem; position: relative; z-index: 10; } div.widgets.manual > .widget { float: left; } div.widgets.manual > .active-widget { cursor: move; } div.widget:hover { z-index: 1000; } div.active-widget { border-color: ",{t:2,r:"@style.active"},"; border-style: solid; background-color: ",{t:2,r:"@style.active"},"20; user-select: none; z-index: 999; } div.active-widget > .widgets, div.hover-widget > .widgets { background-image: linear-gradient(to top, ",{t:2,r:"@style.active"},"20, ",{t:2,r:"@style.active"},"20), radial-gradient(circle, ",{t:2,r:"@style.dark"}," 1px, transparent 1px); background-color: ",{t:2,r:"@style.bg"},"; } div.hover-widget { border-color: ",{t:2,r:"@style.hover"},"; border-style: solid; background-color: ",{t:2,r:"@style.hover"},"20; z-index: 888; } .active-widget > .bar, .bar.active { background-color: ",{t:2,r:"@style.active"}," !important; z-index: 999; } .hover-widget > .bar, .bar.hover { background-color: ",{t:2,r:"@style.hover"}," !important; z-index: 888; } .widget > .btn { position: absolute; right: 0; top: 0; opacity: 0; cursor: pointer; font-weight: bold; border-radius: 0.2rem; width: 0.9rem; height: 0.9rem; text-align: center; line-height: 0.9rem; font-size: 0.7rem; z-index: 10; } .widget > .preview.btn { right: 1.2rem; } .widget > .autosize.btn { right: 2.3rem; } .widget > .btn > svg { width: 100%; height: 100%; } .active-widget > .btn, .hover-widget > .btn { opacity: 1; } .label, .html { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .html .preview { font-size: 0.83rem; line-height: 1rem; white-space: normal; word-break: break-all; display: block; } .widget.image .content { display: flex; align-items: center; justify-content: space-around; font-size: 2em; font-weight: bold; overflow: hidden; } .widget > .content { display: block; height: 100%; } .sheet .toggles { margin-bottom: 0.5rem; } .toggle { font-size: 0.6rem; border: 1px dotted; padding: 0.2rem; border-radius: 0.2rem; display: inline-block; margin: 0.1em; line-height: 0.8rem; color: ",{t:2,r:"@style.fg"},"; cursor: pointer; user-select: none; } .toggle.active { border: 1px solid; color: ",{t:2,r:"@style.highlight"},"; } .sides { display: flex; flex-wrap: wrap; width: 12rem; margin: 0.5rem; } .properties .sheet .sides > input { width: 3rem; margin: 0.5rem 0.5rem; box-sizing: border-box; color: ",{t:2,r:"@style.fg"},"; background: transparent; } .sides .square { width: 4rem; height: 4rem; background-color: ",{t:2,r:"@style.active"},"; border: 1px solid; box-sizing: border-box; } .sides span { width: 4rem; height: 0.1rem; display: inline-block; } .shrinky { flex-shrink: 200; flex-grow: 1; } .growy { flex-grow: 100; flex-shrink: 1; } .scrolled-wrapper { position: relative; overflow: hidden; min-height: 4em; display: flex; flex-direction: column; } .scrolled { height: 100%; overflow: auto; } .scrolled:before, .scrolled:after { content: ' '; display: block; position: absolute; z-index: 2; box-shadow: 0px 0px 10px ",{t:2,x:{r:["@style.theme"],s:"_0===\"dark\"?\"#265189\":\"rgb(0, 0, 0, 0.5)\""}},"; height: 5px; width: 100%; opacity: 1; transition: opacity 0.25s ease-in-out; } .scrolled:before { top: -5px; } .scrolled:after { bottom: -5px; } .scrolled.scroll-top:before { opacity: 0; transition: opacity 0s linear; } .scrolled.scroll-bottom:after { opacity: 0; transition: opacity 0s linear; } @media screen and (max-width: 72em) { .bottom-pane .bottom .ops { display: none; } } @media screen and (max-width: 48em) { .bottom-pane .bottom .context { display: none; } }"],e:{"(_0||28)+2":function (_0){return((_0||28)+2);},"_0||33":function (_0){return(_0||33);},"_0||_1":function (_0,_1){return(_0||_1);},"_0===\"dark\"?\"#265189\":\"rgb(0, 0, 0, 0.5)\"":function (_0){return(_0==="dark"?"#265189":"rgb(0, 0, 0, 0.5)");}}}, data: this.cssData }).fragment.toString(false); }).call(this), " .unit { font-size: 0.6rem; margin-left: 1em; }", (function () { return this.Ractive({ template: {v:4,t:[".project { display: flex; flex-grow: 1; flex-direction: column; } .active-tab .project { min-height: 75vh; } .settings-pane { display: flex; flex-direction: column; flex-grow: 0; flex-shrink: 0; } .settings-pane-inner { padding: 0.5rem; margin-bottom: 1em; border-bottom: 1px solid; } .project-pane { display: flex; flex-grow: 1; padding: 0.5rem; position: relative; flex-wrap: wrap; } .project-pane-left { flex-grow: 1; flex-shrink: 1; padding-right: 1rem; display: flex; flex-direction: column; box-sizing: border-box; } @media screen and (min-width: 48rem) { .project-pane-left { max-width: calc(100% - 15rem); } } .project-pane-right { width: 15rem; display: flex; flex-direction: column; flex-shrink: 0; margin-top: 0.5rem; } .project-list { flex-grow: 1; border: 1px solid ",{t:2,r:"@style.border"},"; overflow-y: auto; } .project-item { padding: 0.25rem 0.5rem; min-height: 1.5rem; line-height: 1.5rem; cursor: pointer; } .active-project { background-color: ",{t:2,r:"@style.border"},"; color: ",{t:2,r:"@style.fg"},"; cursor: default; } label.input, label.check { display: inline-block; margin: 0 1em 1em 0; }"]}, data: this.cssData }).fragment.toString(false); }).call(this), (function () { return this.Ractive({ template: {v:4,t:[".report-definition .paper { flex-grow: 1; display: flex; flex-direction: column; } .tab.report-definition { display: flex; flex-direction: column; } .definition { display: flex; flex-direction: column; flex-grow: 1; } .definition .json, .definition .extra-context { display: flex; flex-direction: column; flex-grow: 1; height: 10em; border: 1px solid ",{t:2,r:"@style.border"},"; } .definition .json > *, .definition .extra-context > * { flex-grow: 1; } .definition .json textarea, .definition .extra-context textarea { flex-shrink: 0; flex-grow: 1; width: 100%; box-sizing: border-box; min-height: 99%; border: none; outline: none; font-size: 0.875rem; } .definition .json textarea { color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; }"]}, data: this.cssData }).fragment.toString(false); }).call(this), " .report-context .paper { flex-grow: 1; display: flex; flex-direction: column; } .tab.report-context { display: flex; flex-direction: column; }", (function () { return this.Ractive({ template: {v:4,t:[".tab.data-import { display: flex; flex-direction: column; } .import.paper { flex-grow: 1; display: flex; flex-direction: column; max-height: calc(100% - 2em); } .import .definition { display: flex; flex-direction: column; max-height: 100%; } .import .fetch { margin: 1em 0 2em; max-height: 40%; flex-grow: 0; flex-shrink: 1; } label.input, label.check { display: inline-block; } label.check { padding-top: 1rem; } label.input input, label.input select { display: block; height: 2.5rem; width: 100%; padding: 0.5rem; box-sizing: border-box; margin: 0; border: 1px solid ",{t:2,r:"@style.border"},"; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; border-radius: 0; font-size: 0.875rem; } label.area { display: block; padding: 0.25rem; } label.area.grow { display: flex; flex-direction: column; flex-grow: 1; } label.area textarea { display: block; min-height: 11rem; width: 100%; padding: 0.5rem; box-sizing: border-box; border: 1px solid ",{t:2,r:"@style.border"},"; margin: 0; border-radius: 0; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; font-size: 0.875rem; } label.area.grow textarea { flex-grow: 1; } label.check input { height: 2rem; vertical-align: middle; }"]}, data: this.cssData }).fragment.toString(false); }).call(this), (function () { return this.Ractive({ template: {v:4,t:[".paper { background-color: ",{t:2,r:"@style.bg"},"; color: ",{t:2,r:"@style.fg"},"; position: relative; user-select: none; } .report-paper.bar { background-color: ",{t:2,r:"@style.border"},"; opacity: 1; } .delimited.paper { padding: 0.5rem; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; } @media screen and (min-width: 48rem) { .delimited.paper { margin: 1rem; } } .delimited .children.fields { display: flex; flex-wrap: wrap; } .field { display: flex; border: 1px solid ",{t:2,r:"@style.border"},"; margin: 0.25rem; padding: 0.25rem; } .field span { display: inline-block; width: 15em; min-height: 1em; max-height: 6em; word-break: break-all; white-space: pre-wrap; overflow: hidden; } .field.active-expr { background-color: ",{t:2,r:"@style.active"},"20; border-color: ",{t:2,r:"@style.active"},"; } .field.hover-expr { background-color: ",{t:2,r:"@style.hover"},"20; border-color: ",{t:2,r:"@style.hover"},"; } .widget span.btn { background-color: ",{t:2,r:"@style.fg"},"; color: ",{t:2,r:"@style.bg"},"; } .widget span.btn svg { fill: ",{t:2,r:"@style.bg"},"; } .widget .bar span.btn { background-color: transparent; color: ",{t:2,r:"@style.btntxt"},"; } .widget.container > .remove.btn { top: -1.5rem; right: 0.5rem; z-index: 1000; } .widget.container.macro > .remove.btn { top: 0; right: 0; } .break { width: 100%; }"]}, data: this.cssData }).fragment.toString(false); }).call(this), (function () { return this.Ractive({ template: {v:4,t:[".properties { width: ",{t:2,x:{r:["@style.leftwidth"],s:"_0||28"}},"rem; flex-grow: 0; flex-shrink: 0; border: 1px solid ",{t:2,r:"@style.border"},"; border-width: 0 1px; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; display: flex; flex-direction: column; z-index: 1999; } .properties-pull { display: none; } .placeholder { flex-grow: 1; align-items: center; display: flex; justify-content: center; font-size: 1.7rem; color: #aaa; } .properties .header { display: flex; flex: 1 1 auto; flex-grow: 0; flex-shrink: 0; align-items: center; margin-top: 1em; } .properties .header:first-of-type { margin-top: 0; } .properties .header h3 { flex-grow: 5; } .properties .tree { overflow-y: auto; } .properties .tree .children { margin-left: 0.5em; padding-left: 0.5em; border-left: 1px dotted ",{t:2,r:"@style.border"},"; } .properties .tree .node { color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; cursor: pointer; position: relative; transition: background-color 0.2s ease-in-out; z-index: 1; user-select: none; } .properties .tree .node.active > .line { background-color: ",{t:2,r:"@style.active"},"; color: ",{t:2,r:"@style.btntxt"},"; } .properties .tree .node.active { background-color: ",{t:2,r:"@style.active"},"20; } .properties .tree .node.hover > .children > .node { background-color: ",{t:2,r:"@style.hover"},"20; } .properties .tree .node .line { display: flex; align-items: center; padding: 0.1rem 0.25rem; margin: 0.1rem; min-height: 2rem; transition: background-color 0.2s ease-in-out; background-color: ",{t:2,r:"@style.bg"},"; z-index: 10; } .properties .tree .node.hover > .line { background-color: ",{t:2,r:"@style.hover"},"; color: #fff; } .properties .tree .node.moving > .line { background-color: #8061ee; color: #fff; } .properties .tree .node .line span { flex-grow: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; } .properties .tree .node.active > .line button, .properties .tree .node .line:hover button, .properties .tree .node.hover > .line button { color: #fff; } .properties .tree .node.active > .line button:disabled, .properties .tree .node .line:hover button:disabled, .properties .tree .node.hover > .line button:disabled { color: #ccc; cursor: default; } .properties .sheet { display: table; border-collapse: collapse; width: 100%; box-sizing: border-box; } .properties .sheet > label { display: table-row; } .properties .sheet > label > * { display: table-cell; line-height: 1rem; padding: 0.4rem; vertical-align: middle; border-style: solid; border-width: 1px 0; border-color: ",{t:2,r:"@style.border"},"; } .properties .sheet > label > *:first-of-type { border-width: 1px 1px 1px 0; } .properties .sheet > label > *:first-of-type > * { vertical-align: middle; } .properties .sheet input, .properties .sheet select { border: none; padding: 0; margin: 0; width: 100%; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; outline: none; } .properties .sheet textarea { border: none; width: 100%; height: 100%; margin: -0.2rem; padding: 0; box-sizing: border-box; outline: none; } .properties .sheet label:focus-within { background-color: transparent; color: ",{t:2,r:"@style.fg"},"; } .parameter, .src { display: flex; border-bottom: 1px solid ",{t:2,r:"@style.border"},"; } .parameter:focus-within, .src:focus-within { background-color: ",{t:2,r:"@style.border"},"; } .parameter.head, .src.head { border-top: 1px solid ",{t:2,r:"@style.border"},"; font-weight: bold; } .parameter > *, .src > * { border-left: 1px solid ",{t:2,r:"@style.border"},"; padding: 0.2rem; flex-grow: 0; flex-shrink: 0; box-sizing: border-box; } .parameter > *:first-of-type, .src > *:first-of-type { border-left: none; } .parameter input:not([type=checkbox]), .parameter select, .src input:not([type=checkbox]), .src select { width: 100%; height: 100%; border: none; background-color: ",{t:2,r:"@style.bg"},"; color: ",{t:2,r:"@style.fg"},"; } .param-name { width: 40%; } .param-type { width: 30%; } .param-require { width: 19%; text-align: center; } .param-btn { width: 10%; } .src-name { width: 65%; } .rsrc-name { width: 43%; } .rsrc-src { width: 43%; } .src-btn { width: 35%; display: flex; justify-content: space-around; } .rsrc-btn { width: 14%; }"],e:{"_0||28":function (_0){return(_0||28);}}}, data: this.cssData }).fragment.toString(false); }).call(this), (function () { return this.Ractive({ template: {v:4,t:["@media screen and (min-height: 10em) { .tree .line { position: sticky; top: 0; } .tree .line.level1 { top: 2.2em; } } @media screen and (min-height: 15em) { .tree .line.level2 { top: 4.4em; } .tree .line.level3 { top: 6.6em; } } @media screen and (min-height: 20em) { .tree .line.level4 { top: 8.8em; } .tree .line.level5 { top: 11em; } } @media screen and (min-height: 25em) { .tree .line.level6 { top: 13.2em; } .tree .line.level7 { top: 15.4em; } } @media screen and (min-height: 30em) { .tree .line.level8 { top: 17.6em; } } .line .actions { display: none; position: absolute; right: 3rem; background-color: inherit; } .line:hover .actions { display: flex; } button.ico svg { width: 100%; height: 100%; border-radius: 0.2rem; transition: transform 0.2s ease-in-out 0.3s; } .line button.ico { flex-shrink: 0; } .line button.ico.expander { position: absolute; left: -1.35em; opacity: 0.5; border: 0px solid; transition: border-width 0.2s ease; width: 0.75em; text-align: center; padding: 0 0.2em; } .line button.ico.expander:hover { border-width: 1px; } .properties .tree .node.hover > .line button.ico { color: ",{t:2,r:"@style.bg"},"; } .properties .tree .node.hover > .line button.ico:hover { color: ",{t:2,r:"@style.fg"},"; } .line button.ico svg, .line button.ico.remove:hover svg, .hover .line .actions button.ico svg { fill: ",{t:2,r:"@style.bg"},"; } .line button.ico.field svg, .line button.ico.remove svg { fill: ",{t:2,r:"@style.fg"},"; } .line button.ico.field[disabled] svg { fill: ",{t:2,r:"@style.dark"},"; } .line button.ico.field:hover svg { fill: ",{t:2,r:"@style.bg"},"; } .hover .line .actions button.ico:hover svg, .line button.ico:hover svg { fill: ",{t:2,r:"@style.fg"},"; } span.widget-id { display: inline-block; overflow: hidden; text-overflow: ellipsis; vertical-align: bottom; max-width: 20%; font-weight: bold; opacity: 0.5; } span.widget-info { display: inline; overflow: hidden; text-overflow: ellipsis; vertical-align: bottom; padding-left: 0.5em; max-width: 85%; opacity: 0.7; } button.ico[disabled] svg, button.ico[disabled]:hover svg { fill: gray; } button.ico.up-arrow svg { transform: rotate(180deg); } button.ico.left-arrow svg { transform: rotate(90deg); } button.ico.right-arrow svg { transform: rotate(270deg); }"]}, data: this.cssData }).fragment.toString(false); }).call(this), (function () { return this.Ractive({ template: {v:4,t:[".bottom-pane pre { margin: 0; } .bottom-pane .top { display: flex; flex-shrink: 0; flex-grow: 0; box-sizing: border-box; height: 2.5em; font-size: 0.75rem; align-items: end; } .bottom-pane .bottom { display: flex; flex-grow: 1; flex-shrink: 1; overflow: hidden; height: 100%; } .bottom-pane .bottom > .tab { display: flex; flex-grow: 0; border: none; display: none; overflow: auto; } .bottom-pane .bottom > .active-tab { flex-grow: 1; display: flex; } .bottom-pane .editor { width: 75%; max-width: calc(max(100% - 20em, 75% - 8px)); } .bottom-pane .context, .bottom-pane .ops { margin: 0.2em; width: 25%; max-width: 20em; flex-shrink: 0; display: flex; flex-direction: column; } .bottom-pane .context .panel, .bottom-pane .ops .panel { border: 1px solid ",{t:2,r:"@style.border"},"; flex-grow: 1; } .bottom-pane .context .header, .bottom-pane .ops .header { flex-wrap: wrap; font-weight: bold; display: flex; justify-content: space-evenly; line-height: 2.2em; font-size: 0.85rem; } .bottom-pane .editor { flex-grow: 2; display: flex; flex-direction: column; padding: 0.25rem; box-sizing: border-box; } .bottom-pane textarea { width: 100%; box-sizing: border-box; padding: 0.5em; min-height: 99%; border: none; outline: none; font-size: 1em; } .bottom-pane .properties textarea, .bottom-pane .properties select, .bottom-pane input { color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; border: 1px solid ",{t:2,r:"@style.border"},"; } .bottom-pane .properties textarea { min-height: 7em; } .bottom-pane .active-tab { border: 1px solid ",{t:2,r:"@style.border"},"; } .bottom-pane .editor .tab { display: flex; flex-direction: column; } .bottom-pane .ast.tab { word-wrap: anywhere; word-break: break-all; } .bottom-pane .ast.tab.error { border-color: ",{t:2,r:"@style.error"},"; } .bottom-pane .tab.html .scrolled { display: flex; flex-direction: column; } .bottom-pane .tab.result .scrolled { padding: 0.5rem; } .bottom-pane .tab.html, .bottom-pane .tab.result { display: flex; flex-direction: column; } .bottom-pane .tab .editor-buttons { display: flex; flex-shrink: 0; padding: 0.2rem; border-bottom: 1px solid ",{t:2,r:"@style.border"},"; } .bottom-pane .tab.html button { border: none; background-color: transparent; padding: 0.25rem; cursor: pointer; outline: none; } .bottom-pane .tab.html button:hover { color: ",{t:2,r:"@style.active"},"; } .bottom-pane .tab.html button.skip { margin-left: 1rem; } .bottom-pane .html-editor { padding: 0.5rem; flex-grow: 1; flex-shrink: 1; white-space: pre-wrap; word-wrap: anywhere; word-break: break-all; } .bottom-pane pre { white-space: pre-wrap; word-break: break-all; } .bottom-pane .properties { flex-direction: column; flex-wrap: wrap; align-content: flex-start; } .bottom-pane .properties > label { width: 20em; margin: 0 0.5rem; padding: 0.5rem 0; } .bottom-pane .options label { display: inline-block; } .bottom-pane .options label > span:first-of-type { font-size: 0.8rem; } .bottom-pane .properties > label > span:first-of-type { font-size: 0.8rem; display: flex; align-items: center; } .bottom-pane .options { box-sizing: border-box; padding: 0.5rem; border: 1px solid ",{t:2,r:"@style.border"},"; overflow: hidden; display: flex; flex-direction: column; } .bottom-pane .group-edit { display: flex; align-items: center; } .ast-node { margin-left: 0.5em; display: flex; cursor: pointer; min-height: 2em; border: 1px solid transparent; } .ast-node input, .ast-node select { border: 1px solid rgba(0, 0, 0, 0.15); background-color: ",{t:2,r:"@style.bg"},"; padding: 0.2em; } .ast-content { display: flex; flex-direction: column; flex-grow: 1; } .ast-active-node { background-color: ",{t:2,r:"@style.active"},"20; border: 1px solid ",{t:2,r:"@style.active"},"; cursor: default; } .ast-string:before, .ast-string:after { content: '\"'; } .ast-number { font-family: mono; } .ast-op-name, .ast-content-value, .ast-content-ref { display: flex; justify-content: space-between; } .entry-local .entry-name { font-style: italic; } .entry-details { display: flex; justify-content: space-between; } .entry-type { opacity: 0.6; padding: 0 0.5em; } .entry-details button { text-align: left; padding: 0; background: none; border: none; margin: 0; font-size: 1rem; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; } .entry-details button.expand { margin-left: -1em; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; border: 1px solid ",{t:2,r:"@style.border"},"; width: 1em; height: 1em; text-align: center; line-height: 0.6em; } .context-entry { padding-left: 0.5em; border-left: 1px dotted ",{t:2,r:"@style.border"},"; margin-left: 1em; } .context-entry .context-entry { margin-left: 0.5em; } .context-entry > .context-entry { display: none; } .context-entry.expanded > .context-entry { display: block; } .expr-operator, .context-entry { cursor: pointer; } .entry-details .expr-operator { padding: 0 0.5em; } .label-part { padding: 0.25em; margin: 0.25em; border: 1px solid; border-radius: 0.2em; } .label-part code { background-color: ",{t:2,r:"@style.bg"},"; color: ",{t:2,r:"@style.fg"},"; } .label-part input, .label-part label, .label-part select { font-size: 0.8rem; padding: 0.25em; border-radius: 0.2rem; margin: 0.25em; vertical-align: middle; border: 1px solid ",{t:2,r:"@style.border"},"; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; } .label-part input[type=number] { width: 8rem; } .label-part label { white-space: nowrap; } .option-entry { box-sizing: border-box; display: flex; margin-bottom: 0.5em; align-items: end; justify-content: space-between; } .option-entry > * { flex-shrink: 1; flex-grow: 1; margin: 0.2em; } .bottom-pane dt { margin-top: 1rem; font-family: monospace; } .bottom-pane dd { margin: 0.5em 0 1em 2em; white-space: pre-wrap; } .bottom-pane .ops-search { width: 10em; position: absolute; right: 2em; top: 0; background-color: ",{t:2,r:"@style.bg"},"; padding: 0.5rem; border: 1px solid ",{t:2,r:"@style.border"},"; border-radius: 0 0 0.5em 0.5em; border-top-width: 0; opacity: 0.2; transition: opacity 0.2s ease-in-out; } .bottom-pane .ops-search:hover { opacity: 1; } .bottom-pane .logs { flex-direction: column; } .bottom-pane .logs .actions { padding: 0.5em; border-bottom: 1px solid; } .bottom-pane .logs .log-entry { padding: 0.5em; border-bottom: 1px dotted rgba(128, 128, 128, 0.5); position: relative; } .bottom-pane .logs .log-entry .time { position: absolute; top: 0; right: 0; width: 10em; background-color: rgba(128, 128, 128, 0.5); opacity: 0.2; transition: opacity 0.2s ease; padding: 0.2em; border-radius: 0 0 0 0.5em; } .bottom-pane .logs .log-entry .time:hover { opacity: 1; } .tree-view { overflow: auto; flex-grow: 1; } .tree-view-tree { margin-left: 0.5em; padding-left: 0.5em; border-left: 1px dotted #aaa; } .tree-view-tree:hover { border-left-color: ",{t:2,x:{r:["@style.theme"],s:"_0===\"dark\"?\"cyan\":\"blue\""}},"; } .tree-view .tree-view-node { white-space: nowrap; } .tree-view .tree-view-key { margin-left: 0.5em; display: inline-block; } .tree-view .tree-view-type { color: #aaa; display: inline-block; } .tree-view .tree-view-value { display: inline-block; vertical-align: top; white-space: pre-wrap; word-break: break-all; } .tree-view .tree-view-children { display: block; } .tree-view .tree-view-expand { display: none; width: 1em; height: 1em; box-sizing: border-box; border: 1px solid #aaa; color: #999; vertical-align: middle; line-height: 0.8em; text-align: center; display: none; cursor: pointer; } .tree-view .tree-view-expand.tree-view-show { display: inline-block; }"],e:{"_0===\"dark\"?\"cyan\":\"blue\"":function (_0){return(_0==="dark"?"cyan":"blue");}}}, data: this.cssData }).fragment.toString(false); }).call(this), (function () { return this.Ractive({ template: {v:4,t:[".parameters { display: flex; flex-direction: column; width: 100%; height: 100%; box-sizing: border-box; } .param { width: 18rem; margin: 0.5rem; break-inside: avoid; } .param label { width: 100%; } .param label input, .param label select { display: block; width: 100%; box-sizing: border-box; padding: 0.5rem; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; } .param label.check input { width: auto; display: inline-block; vertical-align: middle; padding: 0; } .param-editor { display: flex; flex-direction: column; flex-wrap: wrap; width: 100%; height: 100%; align-content: start; overflow: auto; }"]}, data: this.cssData }).fragment.toString(false); }).call(this)].join(' '); };

    function nodeForPosition(node, pos, onlyNamed) {
        const res = [];
        let n = node;
        let c;
        while (n) {
            if (n.start <= pos && n.end >= pos && (!onlyNamed || n.name))
                res.unshift(n);
            c = null;
            for (let i = 0; i < n.children.length; i++) {
                c = n.children[i];
                if (c.start > pos || c.end < pos)
                    c = null;
                else
                    break;
            }
            n = c;
        }
        return res;
    }

    const template = {v:4,t:[{t:7,e:"div",m:[{t:13,n:"class",f:"syntax-editor",g:1},{t:8,r:"extra-attributes"},{n:"class-shrinky",t:13,f:[{t:2,rx:{r:"~/",m:[{r:[],s:"\"no-fill\""}]}}]}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"line-nos",g:1}],f:[{t:4,f:[{t:2,r:"."},{t:7,e:"br"}],n:52,r:"~/lines"}]}],n:50,x:{r:["~/lines.length"],s:"_0>4"}}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"editor-pane",g:1}],f:[{t:7,e:"code",m:[{t:13,n:"class",f:"ast-nodes",g:1}],f:[{t:8,r:"ast-node",c:{r:"ast"}},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"ast-fail",g:1}],f:[{t:2,x:{r:["src","ast.end","src.length"],s:"_0.substring(_1,_2)"}}]}],n:50,x:{r:["ast.end","src.length"],s:"_0<_1"}},{t:4,f:[],n:50,x:{r:["src.length","src"],s:"_0>0&&_1[_0-1]===\"\\n\""}}]}," ",{t:7,e:"code",m:[{t:13,n:"class",f:"expr-text",g:1},{t:4,f:[{n:"id",f:"expr-text",t:13}],n:50,r:"primary"},{n:"spellcheck",f:"false",t:13,g:1},{n:["focus"],t:70,f:{r:["@this","@event"],s:"[_0.highlightSyntax(),_1.stopPropagation()]"}},{n:"contenteditable",f:0,t:13},{n:["input"],t:70,f:{r:["@this","@node"],s:"[_0.sync(_1)]"}},{n:["keydown"],t:70,f:{r:["@this","@event"],s:"[_0.keydown(_1)]"}},{n:["keyup"],t:70,f:{r:["@this","@event"],s:"[_0.keyup(_1)]"}},{n:["click"],t:70,f:{r:["@event"],s:"[_0.preventDefault(),_0.stopPropagation()]"}}]}]}]}],e:{"\"no-fill\"":function (){return("no-fill");},"_0>4":function (_0){return(_0>4);},"_0.substring(_1,_2)":function (_0,_1,_2){return(_0.substring(_1,_2));},"_0<_1":function (_0,_1){return(_0<_1);},"_0>0&&_1[_0-1]===\"\\n\"":function (_0,_1){return(_0>0&&_1[_0-1]==="\n");},"[_0.highlightSyntax(),_1.stopPropagation()]":function (_0,_1){return([_0.highlightSyntax(),_1.stopPropagation()]);},"[_0.sync(_1)]":function (_0,_1){return([_0.sync(_1)]);},"[_0.keydown(_1)]":function (_0,_1){return([_0.keydown(_1)]);},"[_0.keyup(_1)]":function (_0,_1){return([_0.keyup(_1)]);},"[_0.preventDefault(),_0.stopPropagation()]":function (_0){return([_0.preventDefault(),_0.stopPropagation()]);},"(_0||\"\").substring(_1,_2)":function (_0,_1,_2){return((_0||"").substring(_1,_2));}},p:{viewer:[{t:7,e:"div",m:[{t:13,n:"class",f:"syntax-editor syntax-viewer",g:1},{t:8,r:"extra-attributes"}],f:[{t:7,e:"code",m:[{t:13,n:"class",f:"ast-nodes",g:1}],f:[{t:8,r:"ast-node",c:{r:"ast"}},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"ast-fail",g:1}],f:[{t:2,x:{r:["src","ast.end","src.length"],s:"_0.substring(_1,_2)"}}]}],n:50,x:{r:["ast.end","src.length"],s:"_0<_1"}},{t:4,f:[],n:50,x:{r:["src.length","src"],s:"_0>0&&_1[_0-1]===\"\\n\""}}]}]}],"ast-node":[{t:7,e:"span",m:[{n:"class",f:[{t:2,r:".name"}],t:13}],f:[{t:4,f:[{t:4,f:[{t:4,f:[{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"ast-extra",g:1}],f:[{t:2,x:{r:["~/src","./0","./1"],s:"(_0||\"\").substring(_1,_2)"}}]}],n:54,rx:{r:"^^/extra",m:[{t:30,n:"@index"}]}}],n:50,rx:{r:"^^/extra",m:[{t:30,n:"@index"}]}},{t:8,r:"ast-node"}],n:52,r:".children"},{t:4,f:[{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"ast-extra",g:1}],f:[{t:2,x:{r:["~/src","./0","./1"],s:"(_0||\"\").substring(_1,_2)"}}]}],n:54,rx:{r:".extra",m:[{t:30,n:".children.length"}]}}],n:50,rx:{r:".extra",m:[{t:30,n:".children.length"}]}}],n:50,r:".children.length"},{t:4,f:[{t:2,x:{r:["~/src",".start",".end"],s:"(_0||\"\").substring(_1,_2)"}}],n:51,l:1}]}]}};
    const css = function(data) { return [(function () { return this.Ractive({ template: {v:4,t:[".syntax-editor { position: relative; color: ",{t:2,r:"@style.code.c1"},"; display: flex; } .syntax-editor:not(.shrinky) { min-height: 99% !important; } .syntax-editor > .line-nos { height: 100%; flex-grow: 0; flex-shrink: 0; font-family: monospace; font-size: 0.875rem !important; line-height: 1rem !important; padding: 0.5rem !important; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.border"},"; border-right: 1px solid ",{t:2,r:"@style.dark"},"; text-align: right; border: none !important; } .syntax-editor > .editor-pane { position: relative; flex-grow: 1; flex-shrink: 1; } .ast-extra { color: ",{t:2,r:"@style.code.c1"},"; } .comment { color: ",{t:2,r:"@style.code.c14"},"; } .syntax-editor .expr-text { position: absolute; top: 0; font-family: monospace; color: transparent !important; background: transparent !important; caret-color: ",{t:2,r:"@style.fg"},"; min-height: 99% !important; overflow: hidden; resize: none; margin: 0 !important; padding: 0.5rem !important; line-height: 1rem !important; font-size: 0.875rem !important; white-space: pre-wrap; word-break: break-all; border: none !important; min-width: 100%; outline: none; } .syntax-editor code { padding: 0.5rem !important; font-family: monospace; display: block; box-sizing: border-box; min-height: 99% !important; overflow: hidden; line-height: 1rem !important; font-size: 0.875rem !important; min-height: 1.75rem !important; border: none !important; word-break: break-all; white-space: pre-wrap; } .syntax-editor.syntax-viewer code { line-height: 1rem !important; padding: 0 !important; } .ast-nodes .reference { color: ",{t:2,r:"@style.code.c2"},"; font-weight: 500; } .ast-nodes .primitive, .ast-nodes .number, .ast-nodes .date, .ast-nides .timespan { color: ",{t:2,r:"@style.code.c3"},"; font-weight: 500; } .ast-nodes .format-op { color: ",{t:2,r:"@style.code.c4"},"; } .ast-nodes .string, .ast-nodes .string > .ast-extra { color: ",{t:2,r:"@style.code.c5"},"; } .ast-nodes .string > .string-interpolation { font-style: oblique; } .ast-nodes .binary-op > .ast-extra, .ast-nodes .conditional > .ast-extra { color: ",{t:2,r:"@style.code.c6"},"; } .ast-nodes .typelit, .ast-nodes .typelit > .ast-extra { color: ",{t:2,r:"@style.code.c7"},"; } .ast-nodes .typelit .type { color: ",{t:2,r:"@style.code.c9"},"; font-weight: 500; } .ast-nodes .typelit .key, .ast-nodes .typelit .literal { font-weight: 500; color: ",{t:2,r:"@style.code.c10"},"; } .ast-nodes .typelit .key { color: ",{t:2,r:"@style.code.c8"},"; } .ast-nodes .typelit .condition { font-weight: 700; } .ast-nodes .ast-fail { color: ",{t:2,r:"@style.code.c20"},"; } .ast-nodes .interpolator, .ast-nodes .each-block > .ast-extra, .ast-nodes .if-block > .ast-extra, .ast-nodes .unless-block > .ast-extra, .ast-nodes .case-block > .ast-extra, .ast-nodes .with-block > .ast-extra { font-weight: 600; } .ast-nodes .each-block > .ast-extra { color: ",{t:2,r:"@style.code.c11"},"; } .ast-nodes .case-block > .ast-extra, .ast-nodes .unless-block > .ast-extra, .ast-nodes .if-block > .ast-extra { color: ",{t:2,r:"@style.code.c12"},"; } .ast-nodes .with-block > .ast-extra { color: ",{t:2,r:"@style.code.c13"},"; } ",{t:2,x:{r:["extra"],s:"_0||\"\""}}],e:{"_0||\"\"":function (_0){return(_0||"");}}}, data: this.cssData }).fragment.toString(false); }).call(this)].join(' '); };

    function autosize(node) {
        const helper = node.cloneNode();
        helper.style.position = 'absolute';
        helper.style.left = '-110%';
        helper.style.zIndex = '-1';
        helper.style.height = '0.875rem';
        document.body.appendChild(helper);
        function resize() {
            const style = getComputedStyle(node);
            helper.style.boxSizing = style.boxSizing;
            helper.style.width = `${node.clientWidth}px`;
            helper.style.fontSize = style.fontSize;
            helper.style.lineHeight = style.lineHeight;
            helper.style.padding = style.padding;
            helper.style.wordBreak = style.wordBreak;
            helper.style.whiteSpace = style.whiteSpace;
            helper.value = node.value;
            node.style.height = `${helper.scrollHeight + 8}px`;
        }
        function defer() {
            setTimeout(resize, 500);
        }
        node.addEventListener('focus', defer);
        node.addEventListener('input', defer);
        node.style.overflow = 'hidden';
        return {
            teardown() {
                helper.remove();
                node.removeEventListener('focus', defer);
                node.removeEventListener('input', defer);
            }
        };
    }

    function debounce(fn, time) {
        let tm;
        function wrapper(...args) {
            if (tm) {
                clearTimeout(tm);
            }
            tm = setTimeout(() => {
                tm = null;
                fn.apply(this, args);
            }, time);
        }
        return wrapper;
    }

    const notSpace = /[^\r \t]/;
    const initSpace = /^([ \t]*).*/;
    class Editor extends Ractive__default['default'] {
        constructor(opts) {
            super(opts);
            this.lock = false;
        }
        highlightSyntax() {
            const expr = this.get('src') || '';
            if (typeof expr !== 'string')
                return;
            const parser = this.get('template') ? index.parseTemplate : index.parse;
            const ast = parser(expr, { tree: true, compact: true });
            this.set('ast', ast);
            if (!this.rendered)
                return;
            const pre = this.find('code');
            if (pre)
                this.set('lines', breakLines(expr, pre.clientWidth));
        }
        sync(el) {
            this.lock = true;
            const str = el.innerText.slice(-1) === '\n' ? el.innerText.slice(0, -1) : el.innerText; // strip final \n
            this.set('src', str);
            this.lock = false;
        }
        keyup(ev) {
            const key = ev.key;
            if (key === 'Enter') {
                const range = window.getSelection().getRangeAt(0);
                if (range.startContainer !== range.endContainer || range.startOffset !== range.endOffset || range.startContainer.tagName)
                    return;
                let txt = range.startContainer.textContent;
                const start = range.startOffset;
                const end = range.endOffset;
                const idx = txt.lastIndexOf('\n', range.startOffset - 2);
                const line = txt.substring(idx >= 0 ? idx + 1 : 0, end - 1);
                const space = line.replace(initSpace, '$1');
                if (!space || space === '\n')
                    return;
                txt = txt.substring(0, start) + space + txt.substring(end);
                range.startContainer.textContent = txt;
                range.setStart(range.startContainer, start + space.length);
                range.setEnd(range.startContainer, start + space.length);
                this.sync(this.code);
                return false;
            }
        }
        keydown(ev) {
            const key = ev.key;
            if (key === 'Enter') {
                if (ev.ctrlKey || ev.metaKey) {
                    this.fire('run');
                    return false;
                }
            }
            else if (key === 'Tab') {
                const shift = ev.shiftKey;
                const range = window.getSelection().getRangeAt(0);
                const start = range.startContainer;
                const idx = range.startOffset;
                let txt = start.textContent;
                const prev = txt.substring(idx - 1, idx);
                const next = idx === txt.length ? start.nextSibling : txt.substring(idx, idx + 1);
                if (!shift && (next === '\n' && !notSpace.test(prev) || !next && txt.length))
                    return true;
                if (range.startOffset === range.endOffset && range.startContainer === range.endContainer) {
                    if (start.tagName) {
                        if (start.childNodes.length - 1 !== idx) {
                            var space = document.createTextNode('  ');
                            start.insertBefore(space, start.childNodes[idx]);
                            range.setStart(space, 2);
                            range.setEnd(space, 2);
                            this.sync(this.code);
                        }
                    }
                    else {
                        if (shift) {
                            if (txt.slice(idx - 2, idx) === '  ') {
                                start.textContent = txt.substring(0, idx - 2) + txt.substring(idx);
                                range.setStart(start, idx - 2);
                                range.setEnd(start, idx - 2);
                                this.sync(this.code);
                            }
                        }
                        else {
                            start.textContent = txt.substring(0, idx) + '  ' + txt.substring(idx);
                            range.setStart(start, idx + 2);
                            range.setEnd(start, idx + 2);
                            this.sync(this.code);
                        }
                    }
                }
                ev.preventDefault();
                return false;
            }
            else if (key === 'Home') {
                const range = window.getSelection().getRangeAt(0);
                let txt = range.startContainer.textContent;
                let start = range.startOffset;
                const init = start;
                const end = range.endOffset;
                const idx = txt.lastIndexOf('\n', range.startOffset - 1);
                start = idx >= 0 ? idx + 1 : 0;
                const first = start;
                for (let i = start; i < txt.length; i++)
                    if (notSpace.test(txt[i])) {
                        start = i;
                        break;
                    }
                if (init <= start) {
                    range.setStart(range.startContainer, first);
                    if (init === end)
                        range.setStart(range.startContainer, first);
                }
                else {
                    range.setStart(range.startContainer, start);
                    if (init === end)
                        range.setStart(range.startContainer, start);
                }
                return false;
            }
        }
    }
    Ractive__default['default'].extendWith(Editor, {
        template, css, cssId: 'raport-editor',
        on: {
            init() {
                this.observe('src template', debounce(function () {
                    this.highlightSyntax();
                }, 150));
            },
            render() {
                this.code = this.findAll('code')[1];
                if (this.code && !this.lock)
                    this.code.innerText = this.get('src');
            },
        },
        observe: {
            src(v) {
                if (this.code && !this.lock)
                    this.code.innerText = v;
            },
        },
        decorators: { autosize },
        attributes: ['src', 'template', 'tabout', 'primary', 'no-fill'],
    });
    class Viewer extends Ractive__default['default'] {
        constructor(opts) {
            super(opts);
        }
        highlightSyntax() {
            const expr = this.get('src') || '';
            if (typeof expr !== 'string')
                return;
            const parser = this.get('template') ? index.parseTemplate : index.parse;
            const ast = parser(expr, { tree: true, compact: true });
            this.set('ast', ast);
            if (!this.rendered)
                return;
            const pre = this.find('code');
            if (pre)
                this.set('lines', breakLines(expr, pre.clientWidth));
        }
    }
    Ractive__default['default'].extendWith(Viewer, {
        template: { v: template.v, t: template.p.viewer }, cssId: 'raport-ast-view',
        css,
        cssData: {
            extra: `
      pre { margin: 0; white-space: pre-wrap; font-size: 0.875rem; }
      .syntax-editor code { padding: 0; flex-grow: 1; }
      .syntax-editor { max-height: 100%; overflow: auto; }
      .syntax-editor code { font-size: inherit; line-height: 1rem; }
      `,
        },
        partials: {
            'ast-node': template.p['ast-node'],
        },
        on: {
            init() {
                this.observe('src template', debounce(function () {
                    this.highlightSyntax();
                }, 350));
            },
        },
        attributes: ['src', 'template'],
    });
    function breakLines(src, width) {
        if (width < 16)
            return [];
        const char = 8.4;
        const count = width / char;
        const res = [];
        const lines = src.split('\n');
        for (let il = 0; il < lines.length; il++) {
            const l = lines[il];
            const base = l.length / count;
            let vert = Math.ceil(base);
            let factor = (width - Math.floor(width / char) * char) / char;
            if (factor < 0.2)
                factor = 0.5;
            vert = Math.ceil(base + (vert * factor) / count);
            res.push(il + 1);
            if (vert > 1)
                for (let i = 1; i < vert; i++)
                    res.push('');
        }
        return res;
    }
    const _highlight = new Ractive__default['default']({ template: { v: template.v, t: [{ t: 8, r: 'ast-node', c: { r: 'ast' } }], p: { 'ast-node': template.p['ast-node'] } } });
    function highlight(src) {
        const ast = index.parse(src, { tree: true, compact: true });
        ast.name = 'ast-nodes';
        _highlight.set({ ast, src });
        return _highlight.toHTML();
    }

    const lasts = {};
    function getLastFocus(slot) {
        return lasts[slot || ''];
    }
    function trackfocus(node, slot) {
        function listen(ev) {
            const el = ev.target;
            if ('selectionStart' in el)
                lasts[slot || ''] = el;
        }
        node.addEventListener('focus', listen, { capture: true });
        return {
            teardown() { node.removeEventListener('focus', listen, { capture: true }); }
        };
    }

    const operators = `[
  { op:['%' 'modulus'] sig:[
    { bin:1 proto:'...any => number' desc:'Returns the modulus of the given values starting with the first.' }
  ]}
  { op:['*' 'multiply'] sig:[
    { bin:1 proto:'...number => number' desc:'Multiplies the given values starting with the first.

If there is context-local rounding set, it will be applied to the result (see set-defaults).' }
    { bin:1 proto:'(string, number) => string' desc:'Returns the given string copied number times if the number is positive.'}
    { bin:1 proto:'(any[], number) => any[]' desc:'Returns the given array concatenated number times if the array has fewer than 1,000 elements and the number is positive and less than 10,000.'}
  ]}
  { op:['**' 'pow'] sig:[
    { bin:1 proto:'...number => number' desc:'Applies exponentiation to the given arguments with right associativity.

If there is context-local rounding set, it will be applied to the result (see set-defaults).' eg:'(** 1 2 3) is 1^(2^3)'}
  ]}
  { op:['+' 'add'] sig:[
    { bin:1 proto:'...number => number' desc:'Adds the given numbers together.

If there is context-local rounding set, it will be applied to the result (see set-defaults).' }
    { bin:1 proto:'...any => string' desc:'Concatenates the given arguments as strings.' }
    { bin:1 proto:'...object => object' desc:'Creates a shallow copy comprised of each given object where overlapping keys in later arguments override keys in earlier arguments.' }
    { bin:1 proto:'...any[] => object' desc:'Creates a shallow copy comprised of each given array concatenated.' }
    { bin:1 proto:'(date, timespan) => date' desc:'Adds the given timespan to the given date.' }
    { bin:1 proto:'...timespan => timespan' desc:'Adds the given timespans together.' }
    { un:1 proto:'any => number' desc:'The unary + operator converts the given value to a number.' }
  ]}
  { op:['-' 'subtract'] sig:[
    { bin:1 proto:'...any => number' desc:'Subtracts the given values as numbers starting with the first.

If there is context-local rounding set, it will be applied to the result (see set-defaults).' }
    { bin:1 proto:'(date, date) => timespan' desc:'Subtracts the second date from the first, resulting in the timespan between the two dates.' }
    { bin:1 proto:'(date, timespan) => date' desc:'Subtracts the second date from the first, resulting in the timespan between the two dates.' }
    { un:1 proto:'any => number' desc:'The unary - operator converts the given value to a number and negates it.' }
  ]}
  { op:['/' 'divide'] sig:[
    { bin:1 proto:'...any => number' desc:'Divides the given values starting with the first.

If there is context-local rounding set, it will be applied to the result (see set-defaults).' }
  ]}
  { op:['/%' 'intdiv'] sig:[
    { bin:1 proto:'...any => number' desc:'Divides the given values with integer division starting with the first.'}
  ]}
  { op:['<' 'lt'] sig:[
    { bin:1 proto:'(any, any) => boolean' desc:'Returns true if the first value is less than the second.' }
  ]}
  { op:['<=' 'lte'] sig:[
    { bin:1 proto:'(any, any) => boolean' desc:'Returns true if the first value is less than or equal to the second.' }
  ]}
  { op:['==' 'is'] sig:[
    { bin:1 proto:'(any, any) => boolean' desc:'Returns true if the given values are equal (not strict).' }
    { bin:1 proto:'(any, schema) => boolean' desc:'(Only applies to the \\'is\\' alias) Returns true if the given value loosely conforms to the given schema.' }
  ]}
  { op:['!=' 'is-not'] sig:[
    { bin:1 proto:'(any, any) => boolean' desc:'Returns true if the given values are not equal (not strict).' }
    { bin:1 proto:'(any, schema) => boolean' desc:'(Only applies to the \\'is-not\\' alias) Returns true if the given value does not loosely conform to the given schema.' }
  ]}
  { op:['===' 'deep-is'] sig:[
    { bin:1 proto: '(any, any) => boolean' desc:'Do a deep equality check on the first two arguments using loose equality for primitives.' }
    { proto: "(any, any, 'strict'|'loose'|'sql'|application) => boolean" desc:'Do a deep equality check on the first two arguments using the comparison method specified by the third argument. If an application is given, it will be called with each item being checked at each step in the recursive check to determine equality.' }
  ] opts:[
    { name::equal type:"'strict'|'loose'|'sql'|(any, any) => boolaen" desc:'What type of equality check should be used to determine whether two values are different.

The strings strict (===), loose (==), and sql (loose plus numbers, dates, and booleans have special handling when they are or are compared to strings) will use a built-in equality check.' }
  ]}
  { op:['!==' 'deep-is-not'] sig:[
    { bin:1 proto: '(any, any) => boolean' desc:'Do a deep inequality check on the first two arguments using loose equality for primitives.' }
    { proto: "(any, any, 'strict'|'loose'|'sql'|application) => boolean" desc:'Do a deep inequality check on the first two arguments using the comparison method specified by the third argument. If an application is given, it will be called with each item being checked at each step in the recursive check to determine equality.' }
  ] opts:[
    { name::equal type:"'strict'|'loose'|'sql'|(any, any) => boolaen" desc:'What type of equality check should be used to determine whether two values are different.

The strings strict (===), loose (==), and sql (loose plus numbers, dates, and booleans have special handling when they are or are compared to strings) will use a built-in equality check.' }
  ]}
  { op:['>' 'gt'] sig:[
    { bin:1 proto: '(any, any) => boolean' desc:'Returns true if the first value is greater than the second value.' }
  ]}
  { op:['>=' 'gte'] sig:[
    { bin:1 proto: '(any, any) => boolean' desc:'Returns true if the first value is greater than or equal to the second value.' }
  ]}
  { op:'??' sig:[
    { bin:1 proto:'...any => any' desc:'Returns the first non-null, non-undefined value.'}
  ]}
  { op:['||' 'or'] sig:[
    { bin:1 proto: '(any, any) => any' desc:"Lazily evaluates its arguments and returns the first truthy value or \`false\` if there aren't any." }
  ]}
  { op:['&&' 'and'] sig:[
    { bin:1 proto: '(any, any) => any' desc:'Lazily evaluates its arguments and returns the final value or \`false\` if any of the values are not truthy.' }
  ]}
  { op:'abs' sig:[
    { proto:'number => number' desc:'Returns the absolute value of the given number.'}
  ]}
  { op:'array' sig:[
    { proto:'...any => any[]' desc:'Returns all of its arguments in an array.'}
    { proto: 'range => number[]' desc:'Convert a range to an array of numbers covered by the range. The maximum number of elements in the resulting array is 10,000, and the default bounds are -100 to 200.'}
  ] opts:[
    { name::range type::boolean desc:'Use the range prototype of the operator. Without this, even a parsed range will result in an array with the range as the only element.' }
    { name::bounds type:'[number, number]' desc:'Sets the lower and upper bounds, respectively, of the resulting array. If the bounds are more than 10,000 apart, the lower bound will be set to 10,000 less than the upper bound.' }
  ]}
  { op:'avg' sig:[
    { agg:1 proto: '() => number' desc:'Computes the average of the current source.' }
    { proto:'number[] => number' desc:'Computes the average of the given array of numbers.' }
    { proto:'(any[], application) => number' desc:'Computes the average of the applications for the given array of values.' }
    { agg:1 proto:'application => number' desc:'Computes the average of the applications for the current source.' }
  ]}
  { op:'block' sig:[
    { proto:'...any => any' desc:'Evaluates each of its arguments and returns the value of the final argument.' }
  ]}
  { op:['case' 'switch'] sig:[
    { proto:'(any, ...(any|application, any)) => any' desc:'Evaluates its first argument and uses it as a basis for comparison for each subsequent pair of arguments, called matchers.

The first value in a matcher is used for the comparison, and the second value is returned if the comparison holds. If the matcher first value is an application, the matcher matches if the application returns a truthy value when given the basis value. If the matcher first value is a value, the matcher matches if the first value and the basis value are loosely equal.

The basis value is available as @case or the shorthand _ in each matcher.' eg:['case 1+1 when 1 then :nope when =>4 - _ == _ then :yep else :other end' 'case(1+1 1 :nope =>4 - _ == _ :yep :other)'] }
  ]}
  { op:'cat' sig:[
    { proto:'...any => string' desc:'Concatenates all of the given values into a string.' }
  ]}
  { op:'ceil' sig:[
    { proto:'number => number' desc:'Returns the given number rounded up to the nearest integer.' }
  ]}
  { op:'clamp' sig:[
    { proto:'(number, number, number) => number' desc:'Takes a minimum, a value, and a maximum, and returns the minimum if the value is less than the minimum, the maximum if the value is more than the maximum, or the value otherwise.' }
  ]}
  { op:'coalesce' sig:[
    { proto:'...any => any' desc:'Lazily evalutes its arguments to return the first non-nullish one it encounters.' }
  ]}
  { op:'coalesce-truth' sig:[
    { proto:'...any => any' desc:'Lazily evalutes its arguments to return the first truthy one it encounters.' }
  ]}
  { op:'contains' sig:[
    { bin:1 proto:'(any[], any) => boolean' desc:'Returns true if the second argument is found in the first argument array using indexOf.' }
    { bin:1 proto:'(any[], any[]) => boolean' desc:'Returns true if each entry in the second argument is found in the first argument array using indexOf.' }
    { bin:1 proto:'(any[], application) => boolean' desc:'Returns true if the second argument application returns true for one of the values in the first argument array.' }
    { bin:1 proto:'(object, application) => boolean' desc:'Returns true if the second argument application returns true for one of the [value, index, key] tuples in the first argument array.' }
    { bin:1 proto:'(string, string) => boolean' desc:'Returns true if the second argument is a substring of the first argument.' }
    { bin:1 proto:'(daterange, date) => boolean' desc:'Returns true if the second argument is a falls within the first argument range.' }
  ]}
  { op:'count' sig:[
    { proto:'any[] => number' desc:'Returns the number of entries in the given array.' }
    { agg:1 proto:'() => number' desc:'Counts the number of entries in the current source.' }
  ]}
  { op:'date' sig:[
    { proto:'string => date' desc:'Parses the given date as a platform date (JS), using the builtin parser first and the platform parser if that fails.' }
    { proto:'(string, string) => date' desc:'Parses the given date as a platform date (JS), using the builtin parser first and the platform parser if that fails. If the second argument is parseable as a time, the date is shifted to that time.' }
    { proto:'(date, string) => date' desc:'If the second argument is parseable as a time, the given date is shifted to that time.' }
    { proto:'date => date' desc:'Processes the given date and return the result with optional named arguments applied.' }
  ] opts:[
    { name:['rel' 'parse'] type:'boolean' desc:'Return a raport date rather than a platform date.' }
    { name:'shift' type:'boolean' desc:'When combined with a relative date and time argument with a timezone, will shift the time along with the timezone in the resulting date rather than just changing the timezone and leaving the time as is.' }
    { name:'y' type:'number' desc:'Set the target year on the resulting date. This is not applicable for relative dates.' }
    { name:'m' type:'number' desc:'Set the target month on the resulting date with a 1 indexed number e.g. January is 1 rather than 0. This is not applicable for relative dates.' }
    { name:'d' type:'number' desc:'Set the target day on the resulting date. This is not applicable for relative dates.' }
    { name:'clamp' type:'boolean' desc:'If m or d is specified, setting a number not in the normal range will cause the date to shift outside its bounds e.g. m:13 would be January of the following year. This option will prevent that behavior.' }
  ]}
  { op:'detect-delimeters' sig:[
    { proto:'string => CSVOptions' desc:'Detects the field, record, and quote delimiters from the first 2048 characters of the given string.' }
    { proto:'(string, number) => CSVOptions' desc:'Detects the field, record, and quote delimiters from the first given number of characters of the given string.' }
  ] opts:[
    { name:'context' type:'number' desc:'Set the limit for the number of characters to examine from the given string.' }
  ]}
  { op:'diff' sig:[
    { proto:'(any, any) => Diff' desc:'Does a deep comparison of the two arguments returning a map of deep keypath to a tuple of the left value and right value for differing paths.' }
    { proto:'(any, any, equal) => Diff' desc:'Does a deep comparison of the two arguments returning a map of deep keypath to a tuple of the left value and right value for differing paths. The third argument is used as the equality check for comparisons (see equal named argument).' }
  ] opts:[
    { name::equal type:"'strict'|'loose'|'sql'|(any, any) => boolaen" desc:'What type of equality check should be used to determine whether two values are different. The strings strict (===), loose (==), and sql (loose plus numbers, dates, and booleans have special handling when they are or are compared to strings) will use a built-in equality check.' }
     { name::keys type:"'all'|'common'" desc:'Which keys to include in object comparisons. The default all will result in any key in either object being compared. common will result in only keys preset in both objects being compared.' }
  ]}
  { op:'does-not-contain' sig:[
    { bin:1 proto:'(any[], any) => boolean' desc:'Returns false if the second argument is found in the first argument array using indexOf.' }
    { bin:1 proto:'(any[], any[]) => boolean' desc:'Returns false if each entry in the second argument is found in the first argument array using indexOf.' }
    { bin:1 proto:'(any[], application) => boolean' desc:'Returns false if the second argument application returns true for one of the values in the first argument array.' }
    { bin:1 proto:'(object, application) => boolean' desc:'Returns false if the second argument application returns true for one of the [value, index, key] tuples in the first argument array.' }
    { bin:1 proto:'(string, string) => boolean' desc:'Returns false if the second argument is a substring of the first argument.' }
    { bin:1 proto:'(daterange, date) => boolean' desc:'Returns false if the second argument is a falls within the first argument range.' }
  ]}
  { op:'each' sig:[
    { proto:'(any[], application) => string' desc:'Iterates over the given array, executes the application for each value, and returns ther results joined with an empty string.' }
    { proto:'(any[], application, ...(boolean, result)) => string' desc:'Iterates over the given array, executes the application for each value, and returns ther results joined with an empty string. If the array is empty, then the final array of condition/result pairs are lazily evaluated to return one that matches.' }
    { proto:'(object, application) => string' desc:'Iterates over the given object entries, executes the application for each value, and returns ther results joined with an empty string.' }
    { proto:'(object, application, ...(boolean, result)) => string' desc:'Iterates over the given object entries, executes the application for each value, and returns ther results joined with an empty string. If the object is empty, then the final array of condition/result pairs are lazily evaluated to return one that matches.' }
  ] opts:[
    { name:'join' type:'string' desc:'An alternate string to use to join the results.' }
  ]}
  { op:'eval' sig:[
    { proto:'string => any' desc:'Evaluates the given string as an expression.' }
  ] opts: [
    { name:'template' type:'boolean' desc:'Evaluate the given string as a template in the current context.' }
    { name:'context' type:'Context' desc:'The context in which to evaluate the expression. If not given, the current context will be used.' }
  ]}
  { op:'filter' sig:[
    { proto:'(any[], application) => any[]' desc:'Filters the given array using the given application to remove entries that return a false-y result.' }
    { proto:'(object, application) => object' desc:'Filters the given object using the given application to remove entries that return a false-y result.' }
    { proto:'(any[], application, sort[]) => any[]' desc:'Filters the given array using the given application to remove entries that return a false-y result. The result is then sorted using the given sort array.' }
    { proto:'(object, application, sort[]) => object' desc:'Filters the given object using the given application to remove entries that return a false-y result. The result is then sorted using the given sort array.' }
    { proto:'(any[], application, sort[], application|application[]) => any[]' desc:'Filters the given array using the given application to remove entries that return a false-y result. The result is then sorted using the given sort array. The result is finally grouped by the final application or array of applications.' }
  ]}
  { op:'find' sig:[
    { proto:'(any[], application) => any' desc:'Finds the first element in the given array that matches the given application and returns it.' }
    { proto:'(object, application) => any' desc:'Finds the first value in the given object that matches the given application and returns it. The application is passed the value, index, and key of each entry.' }
    { agg:1 proto:'application => any' desc:'Finds the first element in the current source that matches the given application and returns it.' }
  ]}
  { op:'first' sig:[
    { proto:'any[] => any' desc:'Returns the first element in the given array.' }
    { agg:1 proto:'() => any' desc:'Returns the first element in the current source.' }
  ]}
  { op:'flatten' sig:[
    { agg:1 proto:'any[] => any[]' desc:'Flattens nested arrays into a single non-nested array.' }
    { agg:1 proto:'(any[], number) => any[]' desc:'Flattens nested arrays into a single non-nested array, up to as many levels as specified by the second argument.' }
  ], opts: [
    { name:'flat' type:'number' desc:'The number of levels of nested arrays to flatten. If this is not supplied or not a number, it defaults to 1.' }
  ]}
  { op:'floor' sig:[
    { proto:'number => number' desc:'Returns the given number rounded down to the nearest integer.' }
  ]}
  { op:['format' 'fmt'] sig:[
    { proto:'(any, string, ...args) => string' desc:'Applies the named formatted indicated by the second argument string to the given value, passing along any additional arguments to the formatter.' }
  ]}
  { op:'generate' sig:[
    { proto:'(application) => any[]' desc:'Calls the given application, aggregating values until the application returns undefined.

If the result is an array, the elements of the array are added to the result.
If the result is an object matching { value?: any, state?: any }, then the value will be added to the result and the state, if supplied, will replace the state of the generator.
Any other value will be added to the result.

Each application is passed the state, last value, and index of the call. Each of the arguments is also available a special reference, @state, @last, and @index, respectively.

The global defaults for generate have a max property, defaulting to 10000, that limits the number of iterations that can be run to avoid non-terminating generators.' }
    { proto:'(range) => number[]' desc:'Iterates the members of the range and returns an array of all of the included numbers. This takes into account excluded numbers and ranges and ignores any inclusive range that includes an infinite bound.

The global defaults for generate have a max property, defaulting to 10000, that limits the number of iterations that can be run to avoid non-terminating generators.' }
  ], opts: [
    { name:'[state]' type:'any' desc:'Any options passed to the operator are sent into the initial application as the state.' }
  ]}
  { op:'get' sig:[
    { proto:'(any, string) => any' desc:'Safely retrieves the value at the given path string from the value passed as the first argument.' }
  ]}
  { op:'group' sig:[
    { proto:'(any[], application|application[]) => any[]' desc:'Groups the given array using the given application or application array.' }
  ]}
  { op:'if' sig:[
    { proto:'(...(boolean, any)) => any' desc:'Lazily evaluates each odd argument and returns the first subsequent even argument when a truthy odd argument is found. If no truthy odd argument is found and there is not a final even argument, the final odd argument is returned.' }
  ]}
  { op:'ilike' sig:[
    { bin:1 proto:'(string, string) => any' desc:'Checks to see if the first string matches the second string used as a pattern case insensitively.' }
    { bin:1 proto:'(string[], string) => any' desc:'Checks to see if any of the strings in the first argument array matches the second string used as a pattern case insensitively.' }
    { bin:1 proto:'(string, string[]) => any' desc:'Checks to see if first string matches any of the second argument strings used as patterns case insensitively.' }
    { bin:1 proto:'(string[], string[]) => any' desc:'Checks to see if any of the strings in the first argument array matches any of the second argument strings used as patterns case insensitively.' }
  ] opts: [
    { name:'free' type:'boolean' desc:'Causes the patterns not to be anchored to the start and end of the target string.' }
  ]}
  { op:'in' sig:[
    { bin:1 proto:'(any, any[]) => boolean' desc:'Returns true if the first argument is found in the second argument array using indexOf.' }
    { bin:1 proto:'(any[], any[]) => boolean' desc:'Returns true if each entry in the first argument is found in the second argument array using indexOf.' }
    { bin:1 proto:'(application, any[]) => boolean' desc:'Returns true if the first argument application returns true for one of the values in the second argument array.' }
    { bin:1 proto:'(application, object) => boolean' desc:'Returns true if the first argument application returns true for one of the [value, index, key] tuples in the second argument array.' }
    { bin:1 proto:'(string, string) => boolean' desc:'Returns true if the first argument is a substring of the second argument.' }
    { bin:1 proto:'(string|string[], object) => boolean' desc:'Returns true if the strings in the first argument are all keys in the given object.' }
    { bin:1 proto:'(date, daterange) => boolean' desc:'Returns true if the first argument falls within the second argument range.' }
    { bin:1 proto:'(number, range) => boolean' desc:'Returns true if the first argument falls within the second argument range.' }
  ]}
  { op:'index' sig:[
    { agg:1 proto:'(array, application) => object' desc:'Returns a map of the given array keyed on the result of the application.

If the application returns a tuple, the values in the map will be the second value in the tuple and the keys will be the first. If the key portion of the tuple is an array, the value will be set for each key in the keys array.
If the application returns an empty tuple, the value in the array will be omitted from the result.
The value may also be an object with a "key" or "keys" key and, optionally, a "value" key.
The value may also be an object with a "many" key with an array value of multiple entries of any of the previous types to be added to the map.' }
  ] opts: [
    { name:'many' type::boolean desc:'If enabled, the values in the map will be arrays aggregating all of the values with the same key. Otherwise, the last entry for a key will be the value for that key in the map.' }
  ]}
  { op:'inspect' sig:[
    { proto:'(any) => schema' desc:'Inspects the given value and returns a schema based on its contents.' }
  ] opts:[
    { name:'mode' type:"'schema'" desc:"If set to 'schema' the result will be unparsed into a schema literal." }
    { name:'flat' type:'boolean' desc:'If enabled, deeply introspect objects to include nested types in the schema.' }
  ]}
  { op:'intersect' sig:[
    { proto:'(any[], any[]) => any[]' desc:'Returns the intersection of the two given arrays with no duplicates.' }
  ]}
  { op:'interval' sig:[
    { proto:'string => interval' desc:'Parses the given string as an interval.' }
  ]}
  { op:'join' sig:[
    { proto:'(any[], string) => string' desc:'Joins all of the elements in the given array with the given string.' }
    { proto:'(any[], application, string) => string' desc:'Joins all of the results of the given application of each element in the given array with the given string.' }
    { proto:'(any[], string, string) => string' desc:'Joins all of the elements in the given array with the given string. The last element is appended using the final string if there are more than two elements.' }
    { proto:'(any[], application, string, string) => string' desc:'Joins all of the results of the given application of each element in the given array with the given string. The last element is appended using the final string if there are more than two elements.' }
    { proto:'(any[], string, string, string) => string' desc:'Joins all of the elements in the given array with the given string. The elements are joined using the final string if there are only two elements. The last element is appended using the second string if there are more than two elements.' }
    { proto:'(any[], application, string, string, string) => string' desc:'Joins all of the results of the given application of each element in the given array with the given string. The elements are joined using the final string if there are only two elements. The last element is appended using the second string if there are more than two elements.' }
    { agg:1 proto:'string => string' desc:'Joins all of the elements in the current source with the given string.' }
    { agg:1 proto:'(application, string) => string' desc:'Joins all of the results of the given application of each element in the current source with the given string.' }
    { agg:1 proto:'(string, string) => string' desc:'Joins all of the elements in the current source with the given string. The last element is appended using the final string if there are more than two elements.' }
    { agg:1 proto:'(application, string, string) => string' desc:'Joins all of the results of the given application of each element in the current source with the given string. The last element is appended using the final string if there are more than two elements.' }
    { agg:1 proto:'(string, string, string) => string' desc:'Joins all of the elements in the current source with the given string. The elements are joined with the final string if there are only two elements. The last element is appended using the second string if there are more than two elements.' }
    { agg:1 proto:'(application, string, string, string) => string' desc:'Joins all of the results of the given application of each element in the current source with the given string. The elements are joined with the final string if there are only two elements. The last element is appended using the second string if there are more than two elements.' }
  ]}
  { op:'keys' sig:[
    { proto:'object => string[]' desc:'Returns an array of all of the keys in the given object.' }
    { proto:'(object, true) => string[]' desc:'Returns an array of all of the keys in the given object, including any from the prototype chain.' }
  ]}
  { op:'label-diff' sig:[
    { proto:'(Diff, LabelMap) => Diff' desc:'Takes the given diff and label map and swaps out paths in the diff for labels in the map.

The label map is a nested object with the keys being single key paths in the diff and the values being a label or tuple of a label and label map for nested sub structures.' eg:'label-diff(d { foo:[:Company { bar::Address }] }) where d = { :foo.bar: [:street :avenue] } will result in { "Company Address": [:street :avenue] }' }
  ] opts:[
    { name:'omit' type:'boolean' desc:'Remove any unlabelled diff entries from the output.' }
  ]}
  { op:'last' sig:[
    { proto:'any[] => any' desc:'Returns the last element in the given array.' }
    { agg:1 proto:'() => any' desc:'Returns the last element in the current source.' }
  ]}
  { op:'let' sig:[
    { proto:'(string, any) => interval' desc:'Sets the local value specified by the given path in the first argument the value supplied as the second argument and returns the value that was replaced, if any.' }
  ]}
  { op:['len' 'length'] sig:[
    { proto:'string|array|dataset|object => number' desc:'Returns the length of a given string or array, the length of a given array dataset, the number of keys in a given object, or 0.' }
  ]}
  { op:'like' sig:[
    { bin:1 proto:'(string, string) => any' desc:'Checks to see if the first string matches the second string used as a pattern case sensitively.' }
    { bin:1 proto:'(string[], string) => any' desc:'Checks to see if any of the strings in the first argument array matches the second string used as a pattern case sensitively.' }
    { bin:1 proto:'(string, string[]) => any' desc:'Checks to see if first string matches any of the second argument strings used as patterns case sensitively.' }
    { bin:1 proto:'(string[], string[]) => any' desc:'Checks to see if any of the strings in the first argument array matches any of the second argument strings used as patterns case sensitively.' }
  ] opts: [
    { name:'free' type:'boolean' desc:'Causes the patterns not to be anchored to the start and end of the target string.' }
  ]}
  { op:'lower' sig:[
    { proto:'string => string' desc:'Returns the given string in lower case.' }
  ]}
  { op:'map' sig:[
    { proto:'(any[], application) => any[]' desc:'Applies the given application to each element in the given array and returns an array containing the results.' }
    { proto:'application => any[]' desc:'Applies the given application to each element in the current source and returns an array containing the results.' }
    { proto:'(object, application) => object' desc:'Applies the given application to each [value, index, key] tuple in the given object and returns an object containing the results. If the application return a null, that entry will be left out of the result. If it returns a 2-tuple with a string as the first entry, the result will replace that entry. Otherwise, the entry will have its value replaced with the result of the application.' }
  ] opts: [
    { name:'array' type:'boolean' desc:'When truthy for an object map call, this will cause the result to be the array of application results rather than an object. The application in this case should only return result values.'}
    { name:'entries' type:'boolean' desc:'When truthy for an object map call, this will cause the result to be the array of resulting application entries rather than an object. The same handling for object entries still applies to this option as the operation without it.'}
    { name:'flat' type:'number' desc:'When applied to an array or an object call that results in an array, this will cause the array to be flattened up to the level specified by the value of the option. If the value is not a number but still truthy, the number defaults to 1.' }
  ]}
  { op:'max' sig:[
    { agg:1 proto: '() => number' desc:'Returns the largest entry in the current source.' }
    { proto:'number[] => number' desc:'Returns the largest entry in the given array of numbers.' }
    { proto:'(any[], application) => number' desc:'Returns the largest entry in the applications for the given array of values.' }
    { agg:1 proto:'application => number' desc:'Returns the largest entry in the applications for the current source.' }
    { proto:'...number => number' desc:'Returns the largest entry in the given list of number arguments. If no arguments are given the result will be 0.' }
  ]}
  { op:'min' sig:[
    { agg:1 proto: '() => number' desc:'Returns the smallest entry in the current source.' }
    { proto:'number[] => number' desc:'Returns the smallest entry in the given array of numbers.' }
    { proto:'(any[], application) => number' desc:'Returns the smallest entry in the applications for the given array of values.' }
    { agg:1 proto:'application => number' desc:'Returns the smallest entry in the applications for the current source.' }
    { proto:'...number => number' desc:'Returns the smallest entry in the given list of number arguments. If no arguments are given the result will be 0.' }
  ]}
  { op:'not' sig:[
    { un:1 proto:'any => boolean' desc:'Negates the truthiness of the given value.' }
  ]}
  { op:'not-ilike' sig:[
    { bin:1 proto:'(string, string) => any' desc:'Checks to see if the first string does not match the second string used as a pattern case insensitively.' }
    { bin:1 proto:'(string[], string) => any' desc:'Checks to see if all of the strings in the first argument array do not match the second string used as a pattern case insensitively.' }
    { bin:1 proto:'(string, string[]) => any' desc:'Checks to see if first string does not match any of the second argument strings used as patterns case insensitively.' }
    { bin:1 proto:'(string[], string[]) => any' desc:'Checks to see if all of the strings in the first argument array do not match any of the second argument strings used as patterns case insensitively.' }
  ] opts: [
    { name:'free' type:'boolean' desc:'Causes the patterns not to be anchored to the start and end of the target string.' }
  ]}
  { op:'not-in' sig:[
    { bin:1 proto:'(any, any[]) => boolean' desc:'Returns false if the first argument is found in the second argument array using indexOf.' }
    { bin:1 proto:'(any[], any[]) => boolean' desc:'Returns false if each entry in the first argument is found in the second argument array using indexOf.' }
    { bin:1 proto:'(application, any[]) => boolean' desc:'Returns false if the first argument application returns true for one of the values in the second argument array.' }
    { bin:1 proto:'(application, object) => boolean' desc:'Returns false if the first argument application returns true for one of the [value, index, key] tuples in the second argument array.' }
    { bin:1 proto:'(string, string) => boolean' desc:'Returns false if the first argument is a substring of the second argument.' }
    { bin:1 proto:'(string|string[], object) => boolean' desc:'Returns false if the strings in the first argument are all keys in the given object.' }
    { bin:1 proto:'(date, daterange) => boolean' desc:'Returns false if the first argument falls within the second argument range.' }
    { bin:1 proto:'(number, range) => boolean' desc:'Returns false if the first argument falls within the second argument range.' }
  ]}
  { op:'not-like' sig:[
    { bin:1 proto:'(string, string) => any' desc:'Checks to see if the first string does not match the second string used as a pattern case sensitively.' }
    { bin:1 proto:'(string[], string) => any' desc:'Checks to see if all of the strings in the first argument array do not match the second string used as a pattern case sensitively.' }
    { bin:1 proto:'(string, string[]) => any' desc:'Checks to see if first string does not match any of the second argument strings used as patterns case sensitively.' }
    { bin:1 proto:'(string[], string[]) => any' desc:'Checks to see if all of the strings in the first argument array do not match any of the second argument strings used as patterns case sensitively.' }
  ] opts: [
    { name:'free' type:'boolean' desc:'Causes the patterns not to be anchored to the start and end of the target string.' }
  ]}
  { op:'nth' sig:[
    { proto:'(any[], number) => any' desc:'Returns the nth item in the given array using a 1-based index. If the number is negative, the offset is from the end rather than the beginning.' }
    { agg:1 proto:'number => any' desc:'Returns the nth item in the current source using a 1-based index. If the number is negative, the offset is from the end rather than the beginning.' }
  ]}
  { op:'num' sig:[
    { proto:'string => number' desc:'Returns the first positive number found in the string, including an optional decimal.' }
  ]}
  { op:'object' sig:[
    { proto:'(...(string, any)) => object' desc:'Returns an object assembled from the arguments where each odd argument is a key and the subsequent even argument is its value.' eg: 'object(:key1 99 :key2 73)' }
  ]}
  { op:'overlap' sig:[
    { proto:'(string, string, number = 0.5) => string' desc:"Returns the first overlapping substring within the two given strings that is at least the given percentage of the smallest string's length long using the similar operator." }
  ]}
  { op:'pad' sig:[
    { proto:'(string, number) => string' desc:'Pads the given string with spaces at both ends such that it is at least the given number of characters long.' }
    { proto:'(string, number, stringy) => string' desc:'Pads the given string with the final string at both ends such that it is at least the given number of characters long. If the final string is not a single character, a single space will be used instead.' }
  ]}
  { op:'padl' sig:[
    { proto:'(string, number) => string' desc:'Pads the given string with spaces at the beginning such that it is at least the given number of characters long.' }
    { proto:'(string, number, stringy) => string' desc:'Pads the given string with the final string at the beginning such that it is at least the given number of characters long. If the final string is not a single character, a single space will be used instead.' }
  ]}
  { op:'padr' sig:[
    { proto:'(string, number) => string' desc:'Pads the given string with spaces at the end such that it is at least the given number of characters long.' }
    { proto:'(string, number, stringy) => string' desc:'Pads the given string with the final string at the end such that it is at least the given number of characters long. If the final string is not a single character, a single space will be used instead.' }
  ]}
  { op:'parse' sig:[
    { proto:'string => any' desc:'Parses the given string using the expression parser.' }
  ] opts: [
    { name:'date' type:'boolean' desc:'Use the date parser rather than the expression parser.' }
    { name:'template' type:'boolean' desc:'Use the template parser rather than the expression parser.' }
    { name:'time' type:'boolean' desc:'Use the time parser rather than the expression parser.' }
    { name:'schema' type:'boolean' desc:'Use the schema parser rather than the expression parser.' }
    { name:'base64' type:'boolean' desc:'Use a base64 parser to decode a base64 encoded string.' }
    { name:'xml' type:'boolean' desc:'Use the XML parser to read data. Properties and children are equivalent. Duplicate names result in all of the duplicate values being aggregated into an array rather than last in winning.' }
    { name:'strict' type:'boolean' desc:'For the XML parser, be less forgiving about malformed content. Defaults to false.' }
    { name:'csv' type:'boolean' desc:'Use the delimited text parser rather than the expression parser.' }
    { name:'delimited' type:'boolean' desc:'Use the delimited text parser rather than the expression parser.' }
    { name:'detect' type:'boolean' desc:'If using the delimited parser, detect the delimiters and use them to parse.' }
    { name:'header' type:'boolean' desc:'If using the delimited parser, treat the first result as a header and use it to build objects with field names based on the header.' }
    { name:'field' type:'string' desc:'If using the delimited parser, use the given string as the field delimiter.' }
    { name:'record' type:'string' desc:'If using the delimited parser, use the given string as the record delimiter.' }
    { name:'quote' type:'string' desc:'If using the delimited parser, use the given string as the field quote.' }
    { name:'order' type:'boolean' desc:'If set to a falsey value, the fields in resulting objects generated from input with headers will not be keyed in alphabetical order.' }
    { name:'fixedSize' type:'boolean' desc:'Discard any delimited rows that are not at least as long as the header/first row.' }
  ]}
  { op:'patch' sig:[
    { proto:'(any,...Diff) => any' desc:'Applies the given diffs to a deep copy of the given object. The direction of the patch can be changed with a named argument. By default, patches are applied in the order given using the new values of the patch to place in the result object. When run backward, the patch list is reversed, and the patches are applied in order using the old values of the patch to place in the result object.' }
  ] opts: [
    { name:'dir' type:"'forward'|'backward'" desc:'If unsupplied or forward, patches are applied in given order using the new values. If backward, patches are applied in reverse order using the old values.' }
    { name:'strict' type:'boolean' desc:'If strict is truthy, each diff entry that is applied will ensure that the current state of the object matches the starting point of the diff before updating the object.' }
  ]}
  { op:'pipe' sig:[
    { proto:'...any => any' desc:'This is a special built-in operator that evaluates its first argument, supplies that as an input to the next argument, supplies that result as an input to the next argument, and so on until the result of the last argument evaluation is returned. If any argument is an operation that does not reference \`@pipe\` or \`_\` as one of its arguments, then \`@pipe\` will be added as the first argument of that operation. Arguments that are applications are automatically applied with the piped value.' }
  ]}
  { op:['rand' 'random'] sig:[
    { proto:'() => number' desc:'Returns a random floating point number between 0 and 1, inclusive.' }
    { proto:'number => number' desc:'Returns a random integer between 1 and the given number, inclusive.' }
    { proto:'(number, true) => number' desc:'Returns a random floating point number between 1 and the given number, inclusive.' }
    { proto:'(number, number) => number' desc:'Returns a random integer between the given numbers, inclusive.' }
    { proto:'(number, number, true) => number' desc:'Returns a random floating point number between the given numbers, inclusive.' }
  ]}
  { op:'reduce' sig:[
    { proto:'(any[], application, any) => any' desc:'Folds the given array into the final argument value by passing each element in the given array into the application with the result of the last application (or the final argument for the first iteration) and returns the result of the final application.' }
    { agg:1 proto:'(application, any) => any' desc:'Folds the current source into the final argument value by passing each element in the current source into the application with the result of the last application (or the final argument for the first iteration) and returns the result of the final application.' }
  ]}
  { op:'replace-all' sig:[
    { proto:'(string, string, string) => string' desc:'Replaces all instances of the second string found in the first string with the third string.' }
    { proto:'(string, string, string, string) => string' desc:'Replaces all instances of a regular expression constructed with the seconds string as the expression and the fourth string as the flags, which may be empty, found in the first string with the third string.' }
  ]}
  { op:'replace' sig:[
    { proto:'(string, string, string) => string' desc:'Replaces the first instance of the second string found in the first string with the third string.' }
    { proto:'(string, string, string, string) => string' desc:'Replaces the first instance of a regular expression constructed with the seconds string as the expression and the fourth string as the flags, which may be empty, found in the first string with the third string.' }
  ]}
  { op:'reverse' sig:[
    { proto:'string => string' desc:'Reverses the given string.' }
    { proto:'any[] => any[]' desc:'Reverses the given array.' }
  ]}
  { op:'round' sig:[
    { proto:'number => number' desc:'Rounds the given number to the nearest integer.' }
    { proto:'(number, number, string) => number' desc:'Rounds the given number to the nearest decimal specified by the second number using the method specified by the string, defaulting to half-even. Supported methods are half-up, half-down, half-to-0, half-from-0, half-even, half-odd, to-0, from-0, up, and down. If the number of places negative, the number will be rounded left from the decimal point. All if the half methods look at the place to the right of the target number of places and round down if the digit is less than 5, up if the digit is more than 5, and based on the specific method if the digit is 5. For the non-half methods, if there is any amount to the right of the target place, the digit in the target place will be rounded based on specific method.' }
  ] note:"By default, the single-number signature will round to an integer, but if the round defaults are updated to include all-numeric as true, then it will return numbers rounded to the nearest default place. Round defaults are { places:2 all-numeric:false method::half-even }."
  opts:[
    { name:'places' type:'number' desc:'The number of places to round to' }
    { name:'method' type:':half-up|:half-down|:half-to-0|:half-from-0|:half-even|:half-odd|:to-0|:from-0|:up|:down' desc:'The rounding method to use' }
    { name:'string' type:'boolean' desc:'Return the number as a string rather than a number' }
  ]}
  { op:'set' sig:[
    { proto:'(string, any) => interval' desc:'Sets the root value specified by the given path in the first argument the value supplied as the second argument and returns the value that was replaced, if any.' }
  ]}
  { op:'set-defaults' sig:[
    { proto:"('format', string) => any" desc:'Sets the defaults for the given named formatter. Defaults should be passed in as named options that depend on the decorator.' }
    { proto:"('round') => any" desc:'Sets the defaults for rounding operations. Defaults should be passed in as named options, which can be places, all-numeric, and method. 

If a truthy option named context is supplied, the defaults will only be set in the current context and any derived from it in the future. With a context-local round default set, math operations performed in the context or its children will apply rounding as they are performed.

To clear a context-local round default, call this with truthy context and unset named options.' }
    { proto:"('generate') => any" desc:'Sets the defaults for generate operations. Defaults should be passed in as named options, which can be max. The default max is 10000.' }
  ]}
  { op:'similar' sig:[
    { proto:'(string, string, number = 0.5, number = 2) => [string, string, number]' desc:'Finds the first similar substrings within the two given strings based on a threshhold (3rd argument, defaults to 50%) and fudge factor (4th argument, defaults to 2). The two similar substrings are returned in a tuple with the similarity percentage.' }
  ]}
  { op:'similarity' sig:[
    { proto:'(string, string, number = 0.5, number = 2) => number' desc:'Finds the similarity percentage of the first similar substrings within the two given strings using the similar operator.' }
  ]}
  { op:['slice' 'substr'] sig:[
    { proto:'any[] => any[]' desc:'Returns a copy of the given array.' }
    { proto:'(any[], number) => any[]' desc:'Returns a copy of the given array starting from the element at the given index.' }
    { proto:'(any[], number, number) => any[]' desc:'Returns a copy of the given array starting from the element at the given index and ending immediately before the final given index. If the final index is negative, it is an offset from the end of the array.' }
    { proto:'(string, number) => string' desc:'Returns a substring of the given string starting from the character at the given index.' }
    { proto:'(string, number, number) => any[]' desc:'Returns a substring of the given string starting from the character at the given index and ending immediately before the final given index. If the final index is negative, it is an offset from the end of the string.' }
  ]}
  { op:'sort' sig:[
    { proto:'(any[], sort[]) => any[]' desc:'Sorts the given array using the given sort array.

Any array elements that are strings may indicate direction with a leading + or - for ascending and descending, respectively. The remainder of the string is parsed and used as an application.
Any array elements that are applications are applied directly to get a comparison value.
Any arguments that are objects may include a by key with an application value along with asc, desc, or dir flags.
If no sorts are provided, an identity sort will be applied.' }
    { proto:'(object, sort[]) => object' desc:'Sorts the given object keys using the given sort array.

Any array elements that are strings may indicate direction with a leading + or - for ascending and descending, respectively. The remainder of the string is parsed and used as an application.
Any array elements that are applications are applied directly to get a comparison value.
Any arguments that are objects may include a by key with an application value along with asc, desc, or dir flags.
If no sorts are provided, an identity sort will be applied to the keys.' }
  ]}
  { op:'source' sig:[
    { proto:'any => DataSet' desc:'Creates a DataSet from the given value, or returns the value if it is already a DataSet.' }
    { proto:'(any, application) => any' desc:'Creates a DateSet from the given value if it is not already a DataSet, and then sets that as the @source to call the given application. The result of the application is returned.' }
  ]}
  { op:'split' sig:[
    { proto:'string => string[]' desc:'Splits the given string into an array containing each of its characters.' }
    { proto:'(string, string) => string[]' desc:'Splits the given string into an array containing substrings delimited by the second argument.' }
  ]}
  { op:'strict-is' sig:[
    { bin:1 proto:'(any, any) => boolean' desc:'Returns true if the two arguments are the same literal value or are pointers to the same object.' }
    { bin:1 proto:'(any, schema) => boolean' desc:'(Only applies to the \\'strict-is\\' alias) Returns true if the given value strictly conforms to the given schema.' }
  ]}
  { op:'strict-is-not' sig:[
    { bin:1 proto:'(any, any) => boolean' desc:'Returns false if the two arguments are the same literal value or are pointers to the same object.' }
    { bin:1 proto:'(any, schema) => boolean' desc:'(Only applies to the \\'strict-is-not\\' alias) Returns true if the given value does not strictly conform to the given schema.' }
  ]}
  { op:'string' sig:[
    { proto:'any => string' desc:'Politely stringifies the given value, meaning that there are no undefined, null, or object prototype values strings returned.' }
  ] opts: [
    { name:'json' type:'boolean' desc:'Forces the output string to be JSON.' }
    { name:'raport' type:'boolean' desc:'Forces the output string to be a raport expresion. This can be paired with any options to the stringify function supplied by raport.' }
    { name:'string' type:'boolean' desc:'Processes the value as a styled string.' }
  ]}
  { op:'wrap-count' sig:[
    { proto:'string,number?,font?' desc:'Calculates the number of lines that the given string will occupy in the given width in rem using the given font. If the width is not specified, the @widget.width or @placement.availableX will be used. If the font is not specified, the @widget.font will be used. Inherited fonts are not considered.' }
  ] opts: [
    { name:'width' type:'number' desc:'A named version of the second positional argument.' }
    { name:'font' type:'font' desc:'A named version of the third positional argument. This is an object with the relevant parts of the interface conforming to { family?:string, size?:number, line?:number, metric?: number }. family defaults to "sans", size defaults to 0.83, line defaults to size, and metric defaults to the constant pixel width of the font at 16px per em e.g. sans: 7.4, serif: 6.7, mono: 7.85, and narrow: 5.9.' }
    { name:'family' type:'string' desc:'Overrides the given font family.' }
    { name:'size' type:'number' desc:'Overrides the given font size.' }
    { name:'line' type:'number' desc:'Overrides the given font line height.' }
    { name:'metric' type:'string' desc:'Overrides the given font metric.' }
    { name:'break-word' type:'boolean' desc:'Determines whether words that exceed the width should be broken, defaulting to true.' }
  ]}
  { op:'sum' sig:[
    { agg:1 proto: '() => number' desc:'Computes the sum of the current source.' }
    { proto:'number[] => number' desc:'Computes the sum of the given array of numbers.' }
    { proto:'(any[], application) => number' desc:'Computes the sum of the applications for the given array of values.' }
    { agg:1 proto:'application => number' desc:'Computes the sum of the applications for the current source.' }
  ]}
  { op:['time-span' 'time-span-ms'] sig:[
    { proto:'number => number[]' desc:'Returns an array of time units based on options given that represent the number of milliseconds passed as the first argument.' }
    { proto:'(date, date) => number[]' desc:'Returns an array of time units based on options given that represent the distance between the two dates.' }
    { proto:'timespan => number[]' desc:'Returns an array of time units based on options given that represent the distance between the start and end of the given timespan.' }
  ] opts:[
    { name:'unit' type:'string|string[]' desc:"The units desired in the result. This can be either a string or array of strings with the units represented by [y]ears, [M|mo]nths, [w]eeks, [d]ays, [h]ours, [m|mm]inutes, [s]econds, [ms] where 'M' will get months and 'mm' or 'm' not followed by an 'o' will get minutes. The string form can only be used for unambiguous single character units. Units must be specified in descending order by size." }
    { name:'string' type:'boolean' desc:'Causes the output to be a string rather than an array.' }
    { name:'round' type:"'floor'|'ceil'|'round'" desc:"Determines how the results should be rounded. By default they are 'floor'ed, but this can also be 'ceil' or 'round'. Rounding is done based on the next largest available unit after the smallest requiested unit e.g. hours if days are requested last or months if years are the only requested unit." }
  ] note:"If there's no way to get an accurate result from the given timespan e.g. you want years or months from a span specified in ms, approximations will be used. The approximations are 365.25 days in a year and 30.45 days in a month." }
  { op:'trim' sig:[
    { proto:'string => string' desc:'Trims whitespace from both ends of the given string.' }
  ]}
  { op:'triml' sig:[
    { proto:'string => string' desc:'Trims whitespace from the beginning of the given string.' }
  ]}
  { op:'trimr' sig:[
    { proto:'string => string' desc:'Trims whitespace from the end of the given string.' }
  ]}
  { op:'unique' sig:[
    { proto:'any[] => any[]' desc:'Returns a copy of the given array with no duplicate elements.' }
    { agg:1 proto:'() => any[]' desc:'Returns a copy of the current source with no duplicate elements.' }
    { proto:'(any[], application) => any[]' desc:'Returns a copy of the given array with no duplicate application results.' }
    { agg:1 proto:'application => any[]' desc:'Returns a copy of the current source with no duplicate application results.' }
  ]}
  { op:'unique-map' sig:[
    { proto:'(any[], application) => any[]' desc:'Returns an array of application results from the given array with no duplicate elements.' }
    { agg:1 proto:'application => any[]' desc:'Returns an array of application results of the current source with no duplicate elements.' }
  ]}
  { op:'unless' sig:[
    { proto:'(...(boolean, any)) => any' desc:'Lazily evaluates each odd argument and returns the first subsequent even argument when a false-y odd argument is found. If no false-y odd argument is found and there is not a final even argument, the final odd argument is returned.' }
  ]}
  { op:'unparse' sig:[
    { proto:'any => string' desc:'Stringifies the given value as a raport expression.' }
  ]}
  { op:'upper' sig:[
    { proto:'string => string' desc:'Converts the given string to upper case.' }
  ]}
  { op:'valid' sig:[
    { proto:'(any, schema) => boolean' desc:'Returns true if the given value validates against the given schema.' }
  ] opts:[
    { name:'strict' type:'boolean' desc:'Validate in strict mode rather than the default loose mode.' }
    { name: 'mode' type:"'strict'|'loose'|'missing'" desc:'Sets the mode of validation e.g. strict or loose or missing.'}
  ]}
  { op:'validate' sig:[
    { proto:'(any, schema) => true|error[]' desc:'Returns true if the given value validates against the given schema or an array of errors if it does not.' }
  ] opts:[
    { name:'strict' type:'boolean' desc:'Validate in strict mode rather than the default loose mode.' }
    { name: 'mode' type:"'strict'|'loose'|'missing'" desc:'Sets the mode of validation e.g. strict or loose or missing.'}
  ] note:"The schema of an error is @[{ error: string; type?: 'strict'; path?: string; actual?: string; expected?: string; value?: any }]. If the error is the result of a strict check, the type will be set to 'strict'. The path is the keypath from the root of the given value to the piece of data that caused the error. Missing mode requires that any referenced named types be declared. Strict mode additionally requires that there be no unspecified properties in objects and tuples." }
  { op:'values' sig:[
    { proto:'object => any[]' desc:'Returns an array of all of the values in the given object.' }
  ]}
  { op:'with' sig:[
    { proto:'(object, application) => any' desc:'Evaluates the given application with the given value as the context, returning the result of the application.' }
    { proto:'(object, application, any) => any' desc:'Evaluates the given application with the given value as the context, returning the result of the application. If the value is false-y, the final argument is returned instead.' }
  ]}
]`;
    const formats = `let dateparts = 'Available placeholders are:\\n\\n* y - year\\n* M - month\\n* d - date\\n* E - day of week\\n* H - hour (24 hour)\\n* h or k - hour (12 hour)\\n* m - minute\\n* s - second\\n* S - millisecond\\n* a - AM/PM\\n* z - timezone offset'
[
  { name:'base' desc:'Converts the given number to the given base' opts:[
    { name:'base' req:1 type:'number' desc:'The target base e.g. 2 or 8 or 16.' }
  ]}
  { name:'base64' desc:'Converts the given value to a base64 encoded string.' }
  { name:'case' desc:'Change the casing of the value.' opts:[
    { name:'case' req:1 type:"'upper'|'lower'|'snake'|'kebab'|'pascal'|'camel'|'proper'" desc:'The case format to use.'}
  ]}
  { name:'date' desc:'Formats the value as a date string using placeholder characters, where repeated characters render more descriptive or padded values. Any non-placeholder characters are rendered as entered. The default format is yyyy-MM-dd. Placeholders can be escaped with a \\\\ if the placeholder needs to be included in the output. Available placeholders are:\\n\\n* y - year\\n* M - month\\n* d - date\\n* E - day of week\\n* H - hour (24 hour)\\n* h or k - hour (12 hour)\\n* m - minute\\n* s - second\\n* S - millisecond\\n* a - AM/PM\\n* z - timezone offset' opts:[
    { name:'format' type:'string' desc:'The format template to apply.'}
  ]}
  { name:'dollar' desc:'Formats the value as a dollar amount with two decimal places by default.' opts:[
    { name:'dec' type:'number' desc:'The number of decimal places to render.' }
    { name:'group' type:'string' desc:'The string to use as a grouping divider.' }
    { name:'sign' type:'string' desc:'The currency symbol to render.' }
    { name:'neg' type:"'sign'|'wrap'|'both'" desc:'How to display negative values. Sign shows a leading minus symbol. Wrap wraps the value in parenteses.' }
  ]}
  { name:['hex'] desc:'Formats the given number in hexadecimal, or if the value is not a number, encodes it as string in hexadecimal.' }
  { name:['int' 'integer'] desc:'Formats the value as an integer.' opts:[
    { name:'group' type:'string' desc:'The string to use as a grouping divider.' }
    { name:'neg' type:"'sign'|'wrap'|'both'" desc:'How to display negative values. Sign shows a leading minus symbol. Wrap wraps the value in parenteses.' }
  ]}
  { name:'iso8601' desc:'Formats the value as an ISO-8601 timestamp.' }
  { name:'noxml' desc:'Escapes special XML characters so that the value may be safely rendered into xml.' }
  { name:['num' 'number'] desc:'Formats the value as an number.' opts:[
    { name:'dec' type:'number' desc:'The number of decimal places to render.' }
    { name:'group' type:'string' desc:'The string to use as a grouping divider.' }
    { name:'neg' type:"'sign'|'wrap'|'both'" desc:'How to display negative values. Sign shows a leading minus symbol. Wrap wraps the value in parenteses.' }
  ]}
  { name:'ordinal' desc:'Render the value as an ordinal number.' opts:[
    { name:'group' type:'string' desc:'The string to use as a grouping divider.' }
  ]}
  { name:'phone' desc:'Formats the value as phone number e.g. 111-2222, (111) 222-3333, 1-888-777-6666' }
  { name:'time' desc:'Formats a date value as a time string using placeholder characters, where repeated characters render more descriptive or padded values. Any non-placeholder characters are rendered as entered. The default format is HH:mm:ss. {dateparts}' opts:[
    { name:'format' type:'string' desc:'The format template to apply.'}
  ]}
  { name:'styled' desc:'Processes the value as a styled string.' }
  { name:'timestamp' desc:'Formats a date value as a timestamp using placeholder characters, where repeated characters render more descriptive or padded values. Any non-placeholder characters are rendered as entered. The default format is yyyy-MM-dd HH:mm:ss. {dateparts}' opts:[
    { name:'format' type:'string' desc:'The format template to apply.'}
  ]}
  { name:'timestamptz' desc:'Formats a date value as a timestamp with timezone offset using placeholder characters, where repeated characters render more descriptive or padded values. Any non-placeholder characters are rendered as entered. The default format is yyyy-MM-dd HH:mm:sszzz. {dateparts}' opts:[
    { name:'format' type:'string' desc:'The format template to apply.'}
  ]}
  { name:'xml' desc:'Converts the given value to XML if possible.' opts:[
    { name:'indent' type:'number' desc:'Indent each successive set of child nodes with this number of spaces.' }
  ]}
   { name:'[operator]' desc:'Calls the named operator as a formatter, passing the target value as the first argument with any arguments to the formatter following. Any set defaults for the formatter are passed as options to the operator.' }
]`;
    const generateMarkdown = `let mkarr = =>if count(_) then _ else [_]

// expand operators such that there is one name per entry
let expandedOps = sort(reduce(operators |a c| =>
  a + map(mkarr(c.op) |o| =>{ op:o alias:filter(mkarr(c.op) =>_ != o) sig:c.sig opts:c.opts note:c.note })
 []) [=>op])

// expand formats such that there is one name per entry
let expandedFormats = sort(reduce(formats |a c| =>
  a + map(mkarr(c.name) |f| =>{ name:f alias:filter(mkarr(c.name) =>_ != f) desc:c.desc opts:c.opts })
 []) [=>name])

 // this is a bit wacky dues to markdown having significant leading space
'
# Raport API

## Operators

{each(expandedOps =>
  '<dl><dt>

### \`{op}\`{if count(alias) then ' (alias {join(map(alias =>'\`{_}\`') ', ')})'}
---

</dt>
<dd>
{if note then '
__NOTE:__ {note}
'}
<dl>
{each(sig =>
  '<dt><code>{proto}</code>{if bin then ' (binary)' elif un then ' (unary)' elif agg then ' (aggregate)'}</dt>
<dd>{desc}</dd>{if eg then each(mkarr(eg) =>'
<dd>e.g. <code>{_}</code></dd>')}
'
)}</dl>
{if count(opts) then '
#### <ins>Options</ins>

<dl>
{each(opts =>'<dt>{join(map(mkarr(name) =>'<code>{_}</code>') ' or ')}</dt><dd>{desc}</dd>')}
</dl>'}
</dl>
<br/>

'
)}

## Formats

{each(expandedFormats =>
  '<dl><dt>

### \`{name}\`{if count(alias) then ' (alias {join(map(alias =>'\`{_}\`') ', ')})'}
---

</dt>
<dd>

{desc}

{if count(opts) then '<dl><dt>

#### <ins>Options</ins>

</dt><dd><dl>

{each(opts =>'<dt><code>{name}</code> - <code>{type}</code></dt><dd>

{desc}

</dd>')}
</dl></dd></dl>'}
</dd></dl>
<br/>

')}
'`;
    function languageReference(zoom = 100, theme = 'dark') {
        return `<html>
<head><title>Raport Expression Language Reference</title>
<style>
  html {
    font-family: sans-serif;
    font-size: ${zoom}%;
  }
  h2 { margin-top: 3em; }
  h3 { margin-top: 1.5em; }
  body { padding: 1em; max-width: 60em; margin: auto; }
  body.dark { color: #ccc; }
  body.light { color: #222; }
  code {
    font-family: monospace;
    padding: 0.4em;
    vertical-align: baseline;
    font-size: 1.1em;
    line-height: 1em;
    box-sizing: border-box;
    display: inline-block;
    border: 1px solid;
  }
  li { margin: 0.5rem 0; line-height: 1.75rem; }
  .dark code { border-color: #777; }
  .light code { border-color: #ddd; }

  div.indent {
    padding-left: 1em;
  }

  .ast-nodes .reference {
    color: #43b;
    font-weight: 500;
  }
  .dark .ast-nodes .reference { color: #98d; }

  .ast-nodes .primitive,
  .ast-nodes .number,
  .ast-nodes .date,
  .ast-nides .timespan {
    color: #087;
    font-weight: 500;
  }
  .dark .ast-nodes .primitive,
  .dark .ast-nodes .number,
  .dark .ast-nodes .date,
  .dark .ast-nodes .timespan {
    color: #0ca;
  }

  .ast-nodes .format-op {
    color: #e81;
  }

  .ast-nodes .string,
  .ast-nodes .string > .ast-extra {
    color: #170;
  }
  .dark .ast-nodes .string,
  .dark .ast-nodes .string > .ast-extra {
    color: #1a0;
  }

  .ast-nodes .string > .string-interpolation {
    font-style: oblique;
  }

  .ast-nodes .binary-op > .ast-extra,
  .ast-nodes .conditional > .ast-extra {
    color: #a66;
  }
  .dark .ast-nodes .binary-op > .ast-extra,
  .dark .ast-nodes .conditional > .ast-extra {
    color: #b88;
  }

  .ast-nodes .typelit,
  .ast-nodes .typelit > .ast-extra {
    color: #361;
  }
  .dark .ast-nodes .typelit,
  .dark .ast-nodes .typelit > .ast-extra {
    color: #491;
  }

  .ast-nodes .typelit .type {
    color: #67f;
    font-weight: 500;
  }

  .ast-nodes .typelit .key,
  .ast-nodes .typelit .literal {
    font-weight: 500;
    color: #557;
  }
  .dark .ast-nodes .typelit .key,
  .dark .ast-nodes .typelit .literal {
    font-weight: 500;
    color: #99b;
  }

  .ast-nodes .typelit .key {
    color: #b61;
  }

  .ast-nodes .typelit .condition {
    font-weight: 700;
  }

  .ast-nodes .ast-fail {
    color: #f00;
  }

  .ast-nodes .interpolator,
  .ast-nodes .each-block > .ast-extra,
  .ast-nodes .if-block > .ast-extra,
  .ast-nodes .unless-block > .ast-extra,
  .ast-nodes .case-block > .ast-extra,
  .ast-nodes .with-block > .ast-extra {
    font-weight: 600;
  }

  .ast-nodes .each-block > .ast-extra {
    color: #167;
  }
  .dark .ast-nodes .each-block > .ast-extra {
    color: #4bc;
  }

  .ast-nodes .case-block > .ast-extra,
  .ast-nodes .unless-block > .ast-extra,
  .ast-nodes .if-block > .ast-extra {
    color: #189;
  }
  .dark .ast-nodes .case-block > .ast-extra,
  .dark .ast-nodes .unless-block > .ast-extra,
  .dark .ast-nodes .if-block > .ast-extra {
    color: #1de;
  }

  .ast-nodes .with-block > .ast-extra {
    color: #145;
  }
  .dark .ast-nodes .with-block > .ast-extra {
    color: #29c;
  }

  .ast-nodes .interpolator > .ast-extra {
    color: #555;
  }
  .dark .ast-nodes .interpolator > .ast-extra {
    color: #ccc;
  }
</style>
</head>
<body class="${theme}">

<h2 id="raport-expression-language-reference" style="text-align: center; margin-top: 1rem;">Raport Expression Language Reference</h2>
<p>As implied by Raport Expression Language (REL), the language is composed entirely of expessions. There are no statements. The expressions are composed only of operations and values.</p>
<h2 id="syntax">Syntax</h2>
<div class=indent>
<p>The root syntax is based on LISP, but the most common usage relies on sugared syntax that more closely resembles other common languages. The general LISP-y syntax is <code>([operator] ...args)</code>, where <code>args</code> are values or operations. The default parser will accept multiple expressions in sequence and automatically wrap them in a <code>block</code> operation.</p>
</div>

<h2 id="values">Values</h2>
<div class=indent>
<p>Built-in data types include numbers, strings, booleans, objects, arrays, applications, null, undefined, dates, and schemas. There is also a range pseudo-value available to certain operators that automaically parse it from a string in certain circumstances.</p>
<h3 id="numbers">Numbers</h3>
<p>Numbers may have an optional leading <code>-</code>, one or more digits, optionally separated by <code>_</code>, an optional <code>.</code> followed by one or more digits, optionally separated by <code>_</code>, and an optional <code>e</code> followed by an optional <code>-</code> and one or more digits, optionally separated by <code>_</code>.</p>
<p>Example: <code><span class=ast-nodes><span class="number">1</span></span></code>, <code><span class=ast-nodes><span class="number">-1</span></span></code>, <code><span class=ast-nodes><span class="number">0.1</span></span></code>, <code><span class=ast-nodes><span class="number">-0.1</span></span></code>, <code><span class=ast-nodes><span class="number">111_000</span></span></code>, <code><span class=ast-nodes><span class="number">-5_0</span></span></code>, <code><span class=ast-nodes><span class="number">3.14159e-10</span></span></code></p>
<h3 id="strings">Strings</h3>
<p>Strings come in five different flavors: symbolic, single-quoted with optional interpolation, quoted, triple-quoted, and inline template. The symbolic form is constructed of a leading <code>:</code> followed character that is not whitespace or one of <code>():{}[]&lt;&gt;,;\\&amp;#</code> or a quote.</p>
<p>Single-quoted strings may be quoted with <code>&#39;</code> or <code>&#96;</code>, and interpolators are contained within <code>{}</code>, optionally prefixed with <code>$</code>.</p>
<p>Triple quoted strings start and end with a matching set of three matching quote characters. Non-interpolated triple quoted strings start and end with <code>&quot;&quot;&quot;</code>. Interpolated triple quoted strings start and end with either <code>&#39;&#39;&#39;</code> or <code>&#96;&#96;&#96;</code>. The non-interpolated form is particularly useful for pasting small data sets from markdown tables, csv, or CLI command output like psql data into an expression without having to worry about escaping quotes.</p>
<p>Quoted strings may have any character within escaped with <code>\\</code>, including the interpolation delimiters within single-quoted strings. Any characters that are not the terminating quote are included in the string, including newlines.</p>
<p>Inline templates enable using REL templates directly within an expression. They are particularly useful for more conveniently converting a set of data into a structured string, like HTML. Inline templates start and end with <code>$$$</code>, and everything between those delimiters is parsed with the template parser, meaning interopolators and <code>if</code>, <code>each</code>, <code>with</code>, <code>case</code>, and <code>unless</code> blocks are available.</p>
<p>Example: <code><span class=ast-nodes><span class="string">:foo22</span></span></code>, <code><span class=ast-nodes><span class="string">'test string'</span></span></code>, <code><span class=ast-nodes><span class="string">&quot;test string&quot;</span></span></code>, <code><span class=ast-nodes><span class="string"><span class="ast-extra">'an </span><span class="string-interpolation"><span class="ast-extra">{</span><span class="reference">interpolated</span><span class="ast-extra">}</span></span><span class="ast-extra"> string'</span></span></span></code></p>
<h3 id="booleans">Booleans</h3>
<p><code><span class="ast-nodes"><span class="primitive">true</span></span></code> and <code><span class="ast-nodes"><span class="primitive">false</span></span></code>. REL uses truthiness so as not to require explicit conversion of values to booleans. Anything that is not <code><span class="ast-nodes"><span class="primitive">null</span></span></code>, <code><span class="ast-nodes"><span class="primitive">undefined</span></span></code>, <code><span class="ast-nodes"><span class="primitive">false</span></span></code>, <code><span class="ast-nodes"><span class="number">0</span></span></code>, <code>NaN</code>, or an empty string is considered equivalent to <code><span class="ast-nodes"><span class="primitive">true</span></span></code>.</p>
<h3 id="objects">Objects</h3>
<p>Object literals consist of key/value pairs contained within <code>{}</code>s. Keys may be quoted, though it&#39;s only necessary for non-symbolic names or interpolation. Key/value pairs may be separated with <code>,</code>s, and the last pair may have a trailing <code>,</code>.</p>
<p>Example: <code><span class="ast-nodes"><span class="object"><span class="ast-extra">{ foo:</span><span class="string">:bar</span><span class="ast-extra"> baz:</span><span class="string">'bat'</span><span class="ast-extra"> bip:</span><span class="binary-op"><span class="reference">bop</span><span class="ast-extra"> * </span><span class="number">22</span></span><span class="ast-extra"> </span><span class="string">'some str'</span><span class="ast-extra">:</span><span class="number">99</span><span class="ast-extra"> </span><span class="string"><span class="ast-extra">'nine</span><span class="string-interpolation"><span class="ast-extra">{</span><span class="binary-op"><span class="number">9</span><span class="ast-extra"> + </span><span class="number">1</span></span><span class="ast-extra">}</span></span><span class="ast-extra">'</span></span><span class="ast-extra">:</span><span class="number">19</span><span class="ast-extra"> }</span></span></span></code></p>
<h3 id="arrays">Arrays</h3>
<p>Array literals consist of values contained within <code>[]</code>s. Values may be separated by <code>,</code>s, and the last value may have a trailing <code>,</code>.</p>
<p>Example: <code><span class="ast-nodes"><span class="array"><span class="ast-extra">[</span><span class="string">:a</span><span class="ast-extra"> </span><span class="string">:b</span><span class="ast-extra"> </span><span class="string">:c</span><span class="ast-extra"> </span><span class="number">1</span><span class="ast-extra"> </span><span class="number">2</span><span class="ast-extra"> </span><span class="number">3</span><span class="ast-extra">]</span></span></span></code></p>
<h3 id="applications">Applications</h3>
<p>An application is an expression that isn&#39;t immediately evaluated. Applications may optionally start with an argument list with named arguments listed between <code>||</code>s, then a required big arrow <code>=&gt;</code>, and an expression that may be enclosed in a block.</p>
<p>Example: <code><span class="ast-nodes"><span class="application"><span class="ast-extra">=&gt; </span><span class="binary-op"><span class="reference">_</span><span class="ast-extra"> + </span><span class="number">10</span></span></span></span></code>, <code><span class="ast-nodes"><span class="application"><span class="ast-extra">|a b c| =&gt; </span><span class="binary-op"><span class="reference">a</span><span class="ast-extra"> * </span><span class="reference">b</span><span class="ast-extra"> + </span><span class="reference">c</span></span></span></span></code></p>
<h3 id="null">Null</h3>
<p><code><span class="ast-nodes"><span class="primitive">null</span></span></code>. Null in a language with <code><span class="ast-nodes"><span class="primitive">undefined</span></span></code> is a bit of a strange concept, but it can be useful as a sort of &quot;this field intentionally left blank&quot; indicator. It also survives in JSON.</p>
<h3 id="undefined">Undefined</h3>
<p><code><span class="ast-nodes"><span class="primitive">undefined</span></span></code>. This will be omitted in JSON.</p>
<h3 id="dates">Dates</h3>
<p>Date literals include single dates, date ranges, and intervals of time. Dates are specified in a relaxed ISO-8601 format enclosed in <code>##</code>s. A date that isn&#39;t specified down to the millisecond is a range from the start of the specified time to the end e.g. <code><span class="ast-nodes"><span class="date">#2022-01-01#</span></span></code> spans from midnight to a millisecond before midnight on 2022-01-02. When dates are converted to an instant, the default is to resolve to the start of the range. To default to the end of the range, there can be a <code>&lt;</code> immediately before the closing <code>#</code>.</p>
<p>Example: <code><span class="ast-nodes"><span class="date">#2020#</span></span></code>, <code><span class="ast-nodes"><span class="date">#1999-01-01 17:45#</span></span></code>, <code><span class="ast-nodes"><span class="date">#1970-06-15T00:00:01.443+04:30#</span></span></code></p>
<p>Intervals are also specified enclosed in <code>##</code>s with each portion of the interval, optionally separated by spaces. Intervals may include years, months, weeks, days, hours, minutes, seconds, and milliseconds.</p>
<p>Example: <code><span class="ast-nodes"><span class="date">#2 years#</span></span></code>, <code><span class="ast-nodes"><span class="date">#5M3d#</span></span></code>, <code><span class="ast-nodes"><span class="date">#15 weeks 2 days 9 minutes 17 seconds#</span></span></code></p>
<p>There are also a few special relative dates available: <code><span class="ast-nodes"><span class="date">#yesterday#</span></span></code>, <code><span class="ast-nodes"><span class="date">#today#</span></span></code>, <code><span class="ast-nodes"><span class="date">#tomorrow#</span></span></code>, <code><span class="ast-nodes"><span class="date">#last week#</span></span></code>, <code><span class="ast-nodes"><span class="date">#this week#</span></span></code>, <code><span class="ast-nodes"><span class="date">#next week#</span></span></code>, <code><span class="ast-nodes"><span class="date">#last month#</span></span></code>, <code><span class="ast-nodes"><span class="date">#this month#</span></span></code>, <code><span class="ast-nodes"><span class="date">#next month#</span></span></code>, <code><span class="ast-nodes"><span class="date">#last year#</span></span></code>, <code><span class="ast-nodes"><span class="date">#this year#</span></span></code>, and <code><span class="ast-nodes"><span class="date">#next year#</span></span></code>. Like the ISO-ish dates, these are ranges that cover their narrowest specification, so last week is from midnight on the first day of the week to the last millisecond of the last day of the week.</p>
<h3 id="schemas">Schemas</h3>
<p>Schemas describe the type structure of a value. They consist of any number of type definitions followed by the root definition and are contained within <code>@[]</code>.</p>
<ul>
<li>Built-in primitive types include <code>number</code>, <code>string</code>, <code>boolean</code>, <code>date</code>, and <code>any</code>.</li>
<li>Types may also be followed by <code>[]</code> to indicate an array of that type of any length e.g. <code>string[]</code>. Complex array types may also be specified by wrapping a type within an <code>Array&lt;&gt;</code> e.g. <code>Array&lt;string|number&gt;</code>.</li>
<li>Literal values are also accepted as types e.g. <code>12</code> is a type that only matches the number <code>12</code>, and <code>&#39;yes&#39;</code> is a type that only matches the string <code>&quot;yes&quot;</code>.<ul>
<li>Other supported literal values are <code>true</code>, <code>false</code>, <code>null</code>, and <code>undefined</code>.</li>
</ul>
</li>
<li>Tuple types are composed of an array literal of other types e.g. <code>[number number boolean]</code> will match the value <code>[10 12 false]</code>.</li>
<li>Type unions are composed by separating types with a <code>|</code> e.g. <code>string|number</code> will match a string or number.</li>
<li>Object types are specified as object literals with types as the values of their pairs e.g. <code>{ a:number b:string }</code> will match the value <code>{ a:21 b::sure }</code>.<ul>
<li>Any key within an object type may be marked as optional by following its name with a <code>?</code> e.g. <code>{ a:number b?:date }</code> will match the value <code>{ a:21 }</code>.</li>
<li>All remaining keys can be matched with the special key <code>...</code> to ensure that any other keys within an object match a certain type e.g. <code>{ a:number ...:string }</code> will match any object with an <code>a</code> key that is a number and all other keys, if any, that have string values.</li>
</ul>
</li>
<li>Type aliases may be defined using the <code>type</code> keyword followed by a name and a definition e.g. <code>type Foo = { a:number b:string }</code>, followed by at least one whitespace or <code>;</code>. Type aliases may be used anywhere a primitive type would be, including in unions, tuples, and with array specifiers.</li>
<li>Any type may have conditions that are specified as applications that receive the value being validated and return true or false. Conditions are specified with a trailing <code>?</code> and application e.g. <code>type LargeNumber = number ? =&gt; _ &gt; 100000000</code>. More than one condition may be applied to a type.</li>
</ul>
<p>Example: <code><span class="ast-nodes"><span class="typelit"><span class="ast-extra">@[</span><span class="type">number</span><span class="ast-extra">|</span><span class="type">string</span><span class="ast-extra">]</span></span></span></code>, <code><span class="ast-nodes"><span class="typelit"><span class="ast-extra">@[type </span><span class="type">Foo</span><span class="ast-extra"> = { </span><span class="key">t</span><span class="ast-extra">:</span><span class="literal">'strings'</span><span class="ast-extra">, ...:</span><span class="type">string</span><span class="ast-extra"> }; type </span><span class="type">Bar</span><span class="ast-extra"> = { </span><span class="key">t</span><span class="ast-extra">:</span><span class="literal">'numbers'</span><span class="ast-extra">, ...:</span><span class="type">number</span><span class="ast-extra"> }; Array&lt;</span><span class="type">Foo</span><span class="ast-extra">|</span><span class="type">Bar</span><span class="ast-extra">&gt;]</span></span></span></code></p>
<h3 id="ranges">Ranges</h3>
<p>Ranges don&#39;t have any special syntax built directly into REL, but there is a built-in parser that several operators use to see if numbers fall into ranges. The range itself is an array of arrays or numbers, where a number is considered to be in the range if it appears directly in the array or in the inclusive range bounded by the first and second elements of an inner array. The components of a range may be specified by any of the following, separated by whitespace and optionally <code>,</code>s:</p>
<ul>
<li>Any integer, indicating exactly that integer</li>
<li>Two integers with nothing but a <code>-</code> between them, indicating any number that falls within the inclusive range of the left and right integer</li>
<li>a <code>&lt;</code> followed by an integer with optional preceding whitespace, indicating any number less than the integer</li>
<li>a <code>&gt;</code> followed by an integer with optional preceding whitespace, indicating any number greater than the integer</li>
<li>a <code>!</code> followed by any of the preceding range types, indicating that the range type should be excluded from the range</li>
<li>a <code>*</code>, indicating any number</li>
</ul>
<p>Exmaple: <code><span class="ast-nodes"><span class="string">'1, 3, 5, 7, &gt;10'</span></span></code>, <code><span class="ast-nodes"><span class="string">'22-33 44 55-66'</span></span></code>, <code><span class="ast-nodes"><span class="string">'1-100 !23 !34 !88'</span></span></code></p>
</div>

<h2 id="references">References</h2>
<div class=indent>
<p>REL is built around contexts that are somewhat analogous to stack frames that have an inherent base value. When an expression is being evaluated there is usually some value that is currently in scope as the focus of the context. The value of at the base of the current scope is available as the special reference <code><span class="ast-nodes"><span class="reference">@value</span></span></code> or <code>_</code>. If the value happens to have properties, they can be referenced directly by their names e.g. in a context with a value of <code>{ foo: 21, bar: 22 }</code>, the reference <code><span class="ast-nodes"><span class="reference">foo</span></span></code> will resolve to <code>21</code> when evaluated.</p>
<p>Each context also has a local lexical scope attached to it that is not directly connected with the underlying data in the context. This allows for passing named arguments to applications or utilyzing locally scoped variables without clobbering the associated data in the context. Some operators will introduce a new lexical scope while retaining the exising context, while others may introduce both a new context and a new lexical scope.</p>
<p>If the value resolved by a reference happens to have a nested structure built of objects and/or arrays, further children of the primary property can be accessed using dotted path or bracketed path notation e.g. <code><span class="ast-nodes"><span class="reference">foo.bar</span></span></code>, <code><span class="ast-nodes"><span class="reference">array.1.prop</span></span></code> or <code><span class="ast-nodes"><span class="reference"><span class="ast-extra">array[</span><span class="number">1</span><span class="ast-extra">].prop</span></span></span></code>, and <code><span class="ast-nodes"><span class="reference"><span class="ast-extra">foo[</span><span class="binary-op"><span class="string">:ba</span><span class="ast-extra"> + </span><span class="string">:r</span></span><span class="ast-extra">]</span></span></span></code>. The bracketed notation allows for expressions to be used when resolving names. References are always resolved safely to <code>undefined</code>, so doing something like <code><span class="ast-nodes"><span class="binary-op"><span class="object"><span class="ast-extra">{ foo:</span><span class="string">:bar</span><span class="ast-extra"> }</span></span><span class="ast-extra">.baz.bat</span></span></span></code> does not cause an error.</p>
<p>Any variables defined in the lexical scope will take precedent over values of the same name in the local context. To access a value in the context that has the same name as a local variable, you can start from the context special reference e.g. <code><span class="ast-nodes"><span class="reference">_.foo</span></span></code> would refer to the context <code>foo</code> value where <code><span class="ast-nodes"><span class="reference">foo</span></span></code> refers to a local variable.</p>
<h3 id="prefixes">Prefixes</h3>
<p>As indicated above, there are certain special references available in certain contexts. These references have the prefix <code>@</code>, and <code><span class="ast-nodes"><span class="reference">@value</span></span></code> is always available. Another example of a special reference is <code><span class="ast-nodes"><span class="reference">@index</span></span></code>, which is often available in contexts where iteration is taking place.</p>
<p>Report definitions may include named parameters that are kept in a separate namespace from the report root context value. These values are available in any context by prefixing their name with a <code>!</code> e.g. <code><span class="ast-nodes"><span class="reference">!date</span></span></code> would resolve the value passed for the <code>date</code> parameter.</p>
<p>Parent contexts are also available from their children by applying the context pop prefix <code>^</code> one or more times to a reference e.g. <code><span class="ast-nodes"><span class="reference">^foo</span></span></code> will resolve to whatever <code><span class="ast-nodes"><span class="reference">foo</span></span></code> would resolve to in the parent context, and <code><span class="ast-nodes"><span class="reference"><span class="ast-extra">^^^foo.bar[</span><span class="number">9</span><span class="ast-extra">]</span></span></span></code> will resolve to whatever <code><span class="ast-nodes"><span class="reference"><span class="ast-extra">foo.bar[</span><span class="number">9</span><span class="ast-extra">]</span></span></span></code> would resolve to in the great-grandparent context.</p>
<p>The root context value is also available in any context by prefixing a reference with the root context prefix <code>~</code> e.g. <code><span class="ast-nodes"><span class="reference">~foo.bar</span></span></code> will resolve to <code><span class="ast-nodes"><span class="reference">foo.bar</span></span></code> in the root context.</p>
<p>Report definitions may include named data sources that are kept in a separate namespace from the report root context value.  These data sources are available in any context by prefixing their name with a <code>*</code> e.g. <code><span class="ast-nodes"><span class="reference">*people</span></span></code> would resolve to the data passed or retrieved for the <code>people</code> data source.</p>
</div>

<h2 id="comments">Comments</h2>
<div class=indent>
<p>Any expression may be preceeded by any number of line comments, which start with <code>//</code> and include any subsequent characters up to a newline. The final line may not be comment, as comments must be followed by an expression.</p>
<p>Example: <pre><code><span class="ast-nodes"><span class="comment">// add a and b
</span><span class="binary-op"><span class="reference">a</span><span class="ast-extra"> + </span><span class="reference">b</span></span></span></code></pre></p>
</div>

<h2 id="variables">Variables</h2>
<div class=indent>
<p>Most of the data accessed in REL comes from a data source, and as such, it doesn&#39;t often make sense to change any values. There are some cases where local variables can be quite useful to allow breaking up complex calculations into steps or to foward an alias into an algorithm. For these purposes, REL has <code>let</code> and <code>set</code> operators, which change a value in the local lexical scope and local context, respectively. The <code>let</code> operator works with the <code>^</code> prefix to allow accessing parent scopes. The <code>set</code> operator works with <code>~</code> and <code>^</code> prefixes to allow working with the root and parent contexts.</p>
<p>Example: <code><span class="ast-nodes"><span class="let"><span class="ast-extra">let </span><span class="reference">foo</span><span class="ast-extra"> = </span><span class="number">10</span></span></span></code>, <code><span class="ast-nodes"><span class="set"><span class="ast-extra">set </span><span class="reference">~name</span><span class="ast-extra"> = </span><span class="string">:Joe</span></span></span></code>, <code><span class="ast-nodes"><span class="let"><span class="ast-extra">let </span><span class="reference">^^type</span><span class="ast-extra"> = </span><span class="object"><span class="ast-extra">{ size: </span><span class="number">22</span><span class="ast-extra">, id:</span><span class="string">:1</span><span class="ast-extra"> }</span></span></span></span></code></p>
</div>

<h2 id="operations">Operations</h2>
<div class=indent>
<p>Operators are the foundational component of REL, as everything within REL other than a few of the primitive literals, references, and comments are built as operators. An operator may be called using LISP syntax, call syntax, or in many cases special syntax such as unary or boolean syntax. The following are equivalent:</p>
<ul>
<li><code><span class="ast-nodes"><span class="s-expression"><span class="ast-extra">(if </span><span class="binary-op"><span class="reference">foo</span><span class="ast-extra"> &gt; </span><span class="number">10</span></span><span class="ast-extra"> </span><span class="string">:large</span><span class="ast-extra"> </span><span class="binary-op"><span class="reference">foo</span><span class="ast-extra"> &lt; </span><span class="number">5</span></span><span class="ast-extra"> </span><span class="string">:small</span><span class="ast-extra"> </span><span class="string">:medium</span><span class="ast-extra">)</span></span></span></code></li>
<li><code><span class="ast-nodes"><span class="call"><span class="ast-extra">if(</span><span class="binary-op"><span class="reference">foo</span><span class="ast-extra"> &gt; </span><span class="number">10</span></span><span class="ast-extra"> </span><span class="string">:large</span><span class="ast-extra"> </span><span class="binary-op"><span class="reference">foo</span><span class="ast-extra"> &lt; </span><span class="number">5</span></span><span class="ast-extra"> </span><span class="string">:small</span><span class="ast-extra"> </span><span class="string">:medium</span><span class="ast-extra">)</span></span></span></code></li>
<li><code><span class="ast-nodes"><span class="conditional"><span class="ast-extra">if </span><span class="binary-op"><span class="reference">foo</span><span class="ast-extra"> &gt; </span><span class="number">10</span></span><span class="ast-extra"> then </span><span class="string">:large</span><span class="ast-extra"> elif </span><span class="binary-op"><span class="reference">foo</span><span class="ast-extra"> &lt; </span><span class="number">5</span></span><span class="ast-extra"> then </span><span class="string">:small</span><span class="ast-extra"> else </span><span class="string">:medium</span></span></span></code></li>
<li><code><span class="ast-nodes"><span class="conditional"><span class="ast-extra">if </span><span class="binary-op"><span class="reference">foo</span><span class="ast-extra"> &gt; </span><span class="number">10</span></span><span class="ast-extra"> </span><span class="block"><span class="ast-extra">{ </span><span class="string">:large</span><span class="ast-extra"> }</span></span><span class="ast-extra"> elif </span><span class="binary-op"><span class="reference">foo</span><span class="ast-extra"> &lt; </span><span class="number">5</span></span><span class="ast-extra"> </span><span class="block"><span class="ast-extra">{ </span><span class="string">:small</span><span class="ast-extra"> }</span></span><span class="ast-extra"> else </span><span class="block"><span class="ast-extra">{ </span><span class="string">:medium</span><span class="ast-extra"> }</span></span></span></span></code></li>
</ul>
<p>Most operators are limited to LISP and call syntax because that&#39;s how they&#39;re most reasonably used. <code>+</code>, <code>-</code>, and <code>not</code> are available as unary operators. Supported binary operators in order of precedence are exponentiation (<code>**</code>), mutiplication/division/modulus/int division (<code>*</code>, <code>/</code>, <code>%</code>, <code>/%</code>), addition/subtraction (<code>+</code>, <code>-</code>), comparison (<code>&gt;=</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&lt;</code>, <code>ilike</code>, <code>in</code>, <code>like</code>, <code>not-ilike</code>, <code>not-like</code>, <code>not-in</code>, <code>contains</code>, <code>does-not-contain</code>, <code>gt</code>, <code>gte</code>, <code>lt</code>, <code>lte</code>), equality (<code>is</code>, <code>is-not</code>, <code>==</code>, <code>!=</code>, <code>deep-is</code>, <code>deep-is-not</code>, <code>strict-is</code>, <code>strict-is-not</code>, <code>===</code>, <code>!==</code>), boolean and (<code>and</code>, <code>&amp;&amp;</code>), boolean or (<code>or</code>, <code>\|\|</code>) and nullish coalescing (<code>??</code>). At least one space is required on either side of a binary operator.</p>
<p>Most operators take a number of arguments, which are passed within their <code>()</code>s. Some operators will evaluate their arguments lazily, like <code>and</code> and <code>or</code>, and others will evaluate all of their arguments before processing them. Some operators will implicitly operate on their nearest data source, and these are internally configured as aggregate operators, including <code>sum</code> and <code>avg</code>.</p>
<p>Call operations may be attached to a reference such that the reference further refines the result of the call operation.</p>
<p>Example: <code><span class="ast-nodes"><span class="binary-op"><span class="call"><span class="ast-extra">find(</span><span class="reference">list</span><span class="ast-extra"> </span><span class="application"><span class="ast-extra">=&gt;</span><span class="binary-op"><span class="call"><span class="ast-extra">len(</span><span class="reference">parts</span><span class="ast-extra">)</span></span><span class="ast-extra"> &gt; </span><span class="number">10</span></span></span><span class="ast-extra">)</span></span><span class="ast-extra">.name</span></span></span></code></p>
<h3 id="named-arguments">Named arguments</h3>
<p>Operators that are called in LISP or call syntax may also accept named arguments that are specified as key/value pairs at the end of the argument list. These are often used to control specialized behavior or the operator using flags that would otherwise be cumbersome as positional arguments e.g. <code><span class="ast-nodes"><span class="call"><span class="ast-extra">parse(</span><span class="string">'1 3 5 7'</span><span class="ast-extra"> range:</span><span class="number">1</span><span class="ast-extra">)</span></span></span></code>, which asks the <code>parse</code> operator to parse the given string as a range rather than the default REL expression.</p>
<h3 id="formats">Formats</h3>
<p>There is a built-in format operator that formats values as strings using registered formatters. One example is the <code>date</code> formatter that outputs <code>date</code> values as strings in the <code>yyyy-MM-dd</code> format by default. It can also accept an argument that specifies the format to use when converting the date to a string. The <code>format</code> operator can be called explicitly or, since formatting values as strings is a fairly common need, using a special postfix format operation syntax that is a <code>#</code> followed by the name of the formatter and optionally any argument expressions separated by <code>,</code>s with no whitespaces. The following are equivalent:</p>
<ul>
<li><code><span class="ast-nodes"><span class="call"><span class="ast-extra">format(</span><span class="reference">@date</span><span class="ast-extra"> </span><span class="string">:date</span><span class="ast-extra"> </span><span class="string">'MM/dd/yyyy'</span><span class="ast-extra">)</span></span></span></code></li>
<li><code><span class="ast-nodes"><span class="binary-op"><span class="reference">@date</span><span class="format-op"><span class="ast-extra">#date,</span><span class="string">'MM/dd/yyyy'</span></span></span></span></code></li>
</ul>
<h3 id="pipes">Pipes</h3>
<p>Processing data often calls operators on the results of calling operators on the results of calling operators, resulting in large nested argument lists that can become hard to keep track of. To address this, REL has a special built-in <code>pipe</code> operator that accepts a starting value and forwards it through the list of calls supplied to it as arguments, replacing the value with the result of the previous call each time. If one of the arguments to a call is <code>_</code>, the call will be evaluated as-is, but if no reference to <code>_</code> appears in the call arguments list, <code>_</code> will be supplied as the first argument. The following are equivalent:</p>
<ul>
<li><code><span class="ast-nodes"><span class="call"><span class="ast-extra">join(</span><span class="call"><span class="ast-extra">map(</span><span class="call"><span class="ast-extra">filter(</span><span class="reference">things</span><span class="ast-extra"> </span><span class="application"><span class="ast-extra">=&gt;</span><span class="binary-op"><span class="reference">count</span><span class="ast-extra"> &gt; </span><span class="number">10</span></span></span><span class="ast-extra">)</span></span><span class="ast-extra"> </span><span class="application"><span class="ast-extra">=&gt;</span><span class="reference">name</span></span><span class="ast-extra">)</span></span><span class="ast-extra"> </span><span class="string">', '</span><span class="ast-extra">)</span></span></span></code></li>
<li><code><span class="ast-nodes"><span class="call"><span class="ast-extra">pipe(</span><span class="reference">things</span><span class="ast-extra"> </span><span class="call"><span class="ast-extra">filter(</span><span class="application"><span class="ast-extra">=&gt;</span><span class="binary-op"><span class="reference">count</span><span class="ast-extra"> &gt; </span><span class="number">10</span></span></span><span class="ast-extra">)</span></span><span class="ast-extra"> </span><span class="call"><span class="ast-extra">map(</span><span class="application"><span class="ast-extra">=&gt;</span><span class="reference">name</span></span><span class="ast-extra">)</span></span><span class="ast-extra"> </span><span class="call"><span class="ast-extra">join(</span><span class="string">', '</span><span class="ast-extra">)</span></span><span class="ast-extra">)</span></span></span></code></li>
</ul>
<p>The latter is a bit longer, but considerably more easy to follow.</p>
</div>

<h2 id="flow-control">Flow Control</h2>
<div class=indent>
<h3 id="block">block</h3>
<p>A block isn&#39;t really flow control, but being an expression-based language, a way to execute a number of expressions ignoring results until the final expression is quite useful. The <code>block</code> operator does just that. The built-in syntax for a block operation is one or more expressions placed with <code>{}</code>s, separated by whitespace and/or <code>;</code>s.</p>
<p>Blocks introduce their own lexical scope, so any variables declared within them will not escape their scope. You can still access parent contexts though, so it is possible to <code>let</code> variables from any context that is parent to the block scope using the appropriate reference.</p>
<p>Exmaple: <code><span class="ast-nodes"><span class="block"><span class="ast-extra">{ </span><span class="let"><span class="ast-extra">let </span><span class="reference">a</span><span class="ast-extra"> = </span><span class="number">10</span></span><span class="ast-extra">; </span><span class="let"><span class="ast-extra">let </span><span class="reference">b</span><span class="ast-extra"> = </span><span class="number">20</span></span><span class="ast-extra">; </span><span class="binary-op"><span class="reference">a</span><span class="ast-extra"> + </span><span class="reference">b</span></span><span class="ast-extra"> }</span></span></span></code></p>
<h3 id="if">if</h3>
<p>The primary form of conditional flow control is handled by the <code>if</code> operator, which takes a conditional argument followed by a truth case expression, any number of additional conditional and truth case expressions, and then an optional alternate expression. As an operator, <code>if</code> may be called as any other operator, but there is also built-in syntax to make it slightly more readable in the form <code>if</code> followed by a condition, <code>then</code>, and an expression; followed by any number of alternate conditions and expressions in the form <code>else if</code> or <code>elseif</code> or <code>elsif</code> or <code>elif</code> followed by <code>then</code> and the value expression; optionally followed by <code>else</code> and a final alternate value expression.</p>
<p>The result of an <code>if</code> expression is the value of the value expression paired with the first matching conditional branch, the value of the final alternate branch if no conditions matched, or <code>undefined</code> if there were no matches and no final alternate value.</p>
<p>If an <code>if</code> needs to be nested in a way that may make further conditionals ambiguous, the expression can be ended with <code>end</code> or <code>fi</code>. The value expression of a branch may also be a block, which will also remove any ambiguity.</p>
<p>Example: <code><span class="ast-nodes"><span class="conditional"><span class="ast-extra">if </span><span class="binary-op"><span class="reference">count</span><span class="ast-extra"> &gt; </span><span class="number">23</span></span><span class="ast-extra"> then </span><span class="string">'there are dozens of us!'</span><span class="ast-extra"> elif </span><span class="binary-op"><span class="reference">count</span><span class="ast-extra"> &lt; </span><span class="number">0</span></span><span class="ast-extra"> then </span><span class="string">'not sure what happened'</span><span class="ast-extra"> else </span><span class="string">'something else'</span></span></span></code>, <code><span class="ast-nodes"><span class="conditional"><span class="ast-extra">if </span><span class="binary-op"><span class="reference">a</span><span class="ast-extra"> &gt; </span><span class="reference">b</span></span><span class="ast-extra"> then </span><span class="conditional"><span class="ast-extra">if </span><span class="binary-op"><span class="reference">b</span><span class="ast-extra"> &lt; </span><span class="number">12</span></span><span class="ast-extra"> then </span><span class="string">:c</span><span class="ast-extra"> else </span><span class="string">:d</span><span class="ast-extra"> end</span></span><span class="ast-extra"> elif </span><span class="binary-op"><span class="reference">b</span><span class="ast-extra"> &gt; </span><span class="reference">a</span></span><span class="ast-extra"> then </span><span class="string">:e</span><span class="ast-extra"> else </span><span class="string">:f</span></span></span></code></p>
<h3 id="unless">unless</h3>
<p>Unless is a negated <code>if</code>. If the conditional expression evaluates to a truthy value, then the value expression will be the result. <code>unless</code> also allows for an alternate value expression but does not allow additional condition cases. The built-in unless syntax starts with <code>unless</code> followed by a conditional expression, followed by <code>then</code> and a value expression, optionally followed by <code>else</code> and an alternate value expression, optionally followed by <code>end</code>.</p>
<p>Example: <code><span class="ast-nodes"><span class="conditional"><span class="ast-extra">unless </span><span class="reference">loggedIn</span><span class="ast-extra"> then </span><span class="string">'Please log in'</span></span></span></code></p>
<h3 id="case">case</h3>
<p>REL also has a case operator that allows for an alternate branch style that may be more comprehensible in some cases. Each branch condition is evaluated lazily, and if it is an expression will have the value being evaluated available as the special <code>@case</code> reference. If using the built-in syntax, <code>_</code> will also evaluate to <code>@case</code>. <code>case</code> expressions begin with <code>case</code> followed by a value expression, followed by any number of branches that start with <code>when</code> followed by a conditional value or expression, followed by <code>then</code> and a value expression, and finally optionally ending with an alternate <code>else</code> and value expression and optional <code>end</code> or <code>esac</code>.</p>
<p>Example:</p>
<pre><code><span class="ast-nodes"><span class="ast-extra">case </span><span class="reference">age</span><span class="ast-extra">
  when </span><span class="binary-op"><span class="reference">_</span><span class="ast-extra"> &lt; </span><span class="number">13</span></span><span class="ast-extra"> then </span><span class="string">'ask a parent'</span><span class="ast-extra">
  when </span><span class="number">15</span><span class="ast-extra"> then </span><span class="string">'happy quinceanera'</span><span class="ast-extra">
  when </span><span class="number">99</span><span class="ast-extra"> then </span><span class="string">'last year for legos, friend'</span><span class="ast-extra">
  when </span><span class="binary-op"><span class="reference">_</span><span class="ast-extra"> &gt;= </span><span class="number">18</span></span><span class="ast-extra"> then </span><span class="string">'ok'</span><span class="ast-extra">
  else </span><span class="string">'NaN, I guess'</span></span>
</code></pre>
</div>

<h2 id="styled-text">Styled Text</h2>
<div class=indent>
<p>Reports often benefit from styled text, and while most of the raport controls include properties that style their rendered text, it is usually only easily applied to the entire string at once. Labels can be split into an array of parts that are individually styled, but that makes interpolation within the label text difficult when flow control and styling interleave. To address this, raport also provides a light markup language that can be used to apply styling to plain text.</p>
<p>The syntax consists of markup tags interspersed within the text, where each tag may include multiple properties that are inline or block and boolean or valued. Inline properties are typically boolean and can be enabled and disabled at any place within the text. Block properties are grouped with other block properties within their initial tag and are enabled and disabled together. Boolean properties are toggled with each tag, and valued properties form a stack.</p>
<p>A tag is delimited by <code>|</code>s, and the properties within are delimited with <code>,</code>s. Valued properties specify their value with an <code>=</code>, which pushes a value onto the stack. Valued properties specified without a value will pop a value from the stack. Properties are named as identifiers, some of which also have shorthand aliases.</p>
<h3>Inline Properties</h3>
<p>Inline properties are treated as a flat structure, so that they can be interleaved. For instance, <code>this |b|is |i|a|b| test|i| string</code> will yield <code>this</code> plain, <code>is</code> bolded, <code>a</code> bolded and italicized, test italicized, and string plain. <code>|b,u|this is bold and underlined</code> will render the entire text bolded and underlined.</p>
<ul>
<li><code>background</code>, <code>back</code>, <code>bg</code> - sets the background color of the marked text to the given color specified in hexadecimal <code>rgb</code>, <code>rgba</code>, <code>rrggbb</code>, or <code>rrggbbaa</code>, optionally prefixed with a <code>#</code> e.g., <code>|bg=000|</code> or <code>|bg=#08296b|</code>.</li>
<li><code>bold</code>, <code>b</code> - bolds the marked text</li>
<li><code>br</code> - a special tag that inserts a line break. Multiple <code>br</code> tags may appear together to insert multiple line breaks e.g., <code>|br,br,br|</code> produces three line breaks.</li>
<li><code>color</code>, <code>fore</code>, <code>fg</code> - sets the text color of the marked text to the given color specified in hexadecimal <code>rgb</code>, <code>rgba</code>, <code>rrggbb</code>, or <code>rrggbbaa</code>, optionally prefixed with a <code>#</code> e.g., <code>|fg=#f00|</code>.</li>
<li><code>font</code> - sets the font for the marked text to the given value, which is read up to the next <code>,</code> or <code>|</code> e.g., <code>|font=liberation sans narrow|</code>.</li>
<li><code>italic</code>, <code>i</code> - italicizes the marked text</li>
<li><code>line</code> - sets the line height of the marked text to the given value in <code>rem</code> e.g., <code>|line=2.2|</code> sets the line height to 220% of the default 1rem. The decimal is optional.</li>
<li><code>overline</code> - adds an overline to the marked text</li>
<li><code>pre</code> - treats the marked text as white space sensitive</li>
<li><code>size</code> - sets the font size of the marked text to the given size in <code>rem</code> e.g., <code>|font=2.2|</code> sets the font size to 220% of the default. The decimal is optional.</li>
<li><code>strike</code> - adds a strike-through to the marked text</li>
<li><code>sub</code> - sets the marked text as subscripted</li>
<li><code>sup</code> - sets the marked text as superscripted</li>
<li><code>valign</code> - sets the marked text to vertically align with surrounding text to the given value, which may be <code>top</code>, <code>middle</code>, <code>base</code>, or <code>bottom</code>, corresponding to the top, center, baseline, and bottom e.g., <code>|valign=bottom|</code>.</li>
</ul>
<h3>Block Properties</h3>
<p>Block properties create a block around their content and contain any subsequent content until a closing property for one of the values in the initial tag is encountered e.g., <code>|w=10,align=middle center,border=1|this is in the block.|i|as is this.|w| this is not, but is still italicized</code>. By default, the contents of a block may not exceed its bounds.</p>
<ul>
<li><code>align</code> - sets the vertical and/or horizontal alignment of the block content. One or two values may be specified in any order with <code>top</code>, <code>middle</code>, <code>base</code>, and <code>bottom</code> specifying vertical alignment and <code>left</code>, <code>center</code>, and <code>right</code> specifying horizontal alignment.</li>
<li><code>background</code>, <code>back</code>, <code>bg</code> - sets the background color of the block. This is a special case of the inline <code>bg</code> property that will also end with the block.</li>
<li><code>border</code> - sets the border of block. The value given for a border property must include at least one width, but the rest of the properties are optional. The full signature is <code>[solid|dash|dot|double] &lt;width1&gt; [width2] [width3] [width4] [/ &lt;radius&gt; [radius2] [radius3] [radius4]] [color]</code>. If a type is not specified, it defaults to <code>solid</code>. The behavior of width1-4 depends on how many are supplied: 1 makes all four borders to width1; 2 sets the top and bottom to width1 and the left and right to width2; 3 sets top to width 1, right and left to width2, and bottom to width3; and 4 sets the top, right, bottom, and left to width1, width2, width3, and width4, respectively. Width values are integers and specify pixels. The radius value behaves similarly, but corresponds to the top-left, top-right, bottom-right, and bottom-left radii. Radius values can be decimals and specify <code>rem</code>. The color can be specified in hexadecimal <code>rgb</code>, <code>rgba</code>, <code>rrggbb</code>, or <code>rrggbbaa</code> with an optional leading <code>#</code>.</li>
<li><code>height</code>, <code>h</code> - sets the height of the block in <code>rem</code>, e.g., <code>|h=10|this is 10rem tall</code>. The height does not include any padding or margin, in contrast to the behavior of the height and margin properties of raport widgets. Height may also be set as a percentage of its container, making it easier to align text within a widget e.g., <code>|h=100%,align=middle|this is centered in the container</code>.</li>
<li><code>margin</code> - sets the margin of the block in <code>rem</code>. The value specified may be a decimal, and up to four values may be provided. If one is provided, all four sides will have the given value. If two are specified, the top and left will be set to the first, and the left and right will be set to the second. If three are specified, the top will be set to the first, the left and right will be set to the second, and the bottom will be set to the third. If four are specified, they will correspond to the top, right, bottom, and left values. Margins will add to any height or width values given.</li>
<li><code>move</code> - translates the block by the given <code>x</code> and <code>y</code> amounts. The coordinates may be specified as numbers corresponding to <code>rem</code> or percentages. The order of <code>move</code> and <code>rotate</code> tags will affect how they are applied.</li>
<li><code>nowrap</code> - specifies that text within the block should not wrap.</li>
<li><code>overflow</code> - specifies that the contents of the block may exceed its bounds.</li>
<li><code>pad</code> - sets the padding of the block in <code>rem</code>. The value specified may be a decimal, and up to four values may be provided. If one is provided, all four sides will have the given value. If two are specified, the top and left will be set to the first, and the left and right will be set to the second. If three are specified, the top will be set to the first, the left and right will be set to the second, and the bottom will be set to the third. If four are specified, they will correspond to the top, right, bottom, and left values. Padding will add to any height or width values given.</li>
<li><code>rotate</code> - rotates the block by the given number of turns. The direction may be specified as <code>left</code> or <code>right</code> and defaults to right. An addition set of coordinates may be supplied to set the point of rotation, and they may be numbers corresponding to <code>rem</code>, percentages, or relative values <code>top</code>, <code>left</code>, <code>bottom</code>, <code>right</code>, and <code>center</code>. The order of <code>move</code> and <code>rotate</code> tags will affect how they are applied.</li>
<li><code>width</code>, <code>w</code> - sets the width of the block in <code>rem</code>, e.g., <code>|w=10|this is 10rem wide</code>. The width does not include any padding or margin, in contrast to the behavior of the width and margin properties of raport widgets. Width may also be set as a percentage of its container, making it easier to align text within a widget e.g., <code>|w=100%,align=center|this is centered in the container</code>.</li>
</ul>
</div>

<h2 id="templates">Templates</h2>
<div class=indent>
<p>There are some contexts in which output is always a string, such as names and HTML output. In these cases it makes sense not to require wrapping the entire string in a set of quotes and using nested interpolators or concatenation. For this purpose, Raport has a template version of expressions that are similar to mustache or handlebars templates, where double curly braces delimit interpolation with special cases for iteration, branching, and context management, and everything else is plain text, including any special characters.</p>
<h3>Blocks</h3>
<p>There are five special interpolators that are treated as blocks with bodies and require a closing delimiter to indicate where their body ends. The opening delimiter includes the special name, and the closing delimiter includes a <code>/</code>, optionally followed by any text, typically the special name e.g. <code class="ast-nodes"><span><span class="if-block"><span class="ast-extra">{{if </span><span class="reference">user.logged-in</span><span class="ast-extra">}}</span><span class="content">Hello, </span><span class="interpolator"><span class="ast-extra">{{</span><span class="reference">user.name</span><span class="ast-extra">}}</span></span><span class="content">!</span><span class="ast-extra">{{/if}}</span></span></span></code>. Most of the block operators also accept sub-interpolators that split their body into multiple parts. This is used for different branches in an <code>if</code> and an alternative body for an <code>each</code> that has nothing to iterate over. Every sub-block will start with <code>else</code>, <code>else if</code>. <code>elseif</code>, <code>elsif</code>, <code>elif</code>, or <code>when</code>. The sub-blocks do not have their own closing delimiter.</p>
<ul>
<li><p>The <code>each</code> block accepts an expression that evaluates to a data source and renders its body once for each value in the source with the value set as the context of the body. The current index is available as <code>@index</code>, the last index is available as <code>@last</code>, the current key is available as <code>@key</code>, and the last key is available as <code>@last-key</code>. The body of an <code>each</code> may specify an alternative for use if there is nothing to iterate over using an <code>else</code> tag e.g. <pre><code class="ast-nodes"><span><span class="each-block"><span class="ast-extra">{{each </span><span class="reference">order.items</span><span class="ast-extra">}}</span><span class="interpolator"><span class="ast-extra">{{</span><span class="reference">name</span><span class="ast-extra">}}</span></span><span class="content"> - </span><span class="interpolator"><span class="ast-extra">{{</span><span class="reference">quantity</span><span class="ast-extra">}}</span></span><span class="content">
</span><span class="ast-extra">{{else}}</span><span class="content">No items.</span><span class="ast-extra">{{/}}</span></span></span></code></pre></p></li>
<li><p>The <code>if</code> block accepts an expression that evaluates to a boolean, and if the value is truthy, renders its body. The body of an <code>if</code> block can supply multiple alternate sub-blocks using <code>else if</code> interpolators, that each accept an expression, and a final <code>else</code> interpolator that does not accept an expression e.g. <code class="ast-nodes"><span><span class="interpolator"><span class="ast-extra">{{</span><span class="let"><span class="ast-extra">let </span><span class="reference">month</span><span class="ast-extra"> = </span><span class="binary-op"><span class="ast-extra">+(</span><span class="binary-op"><span class="reference">@date</span><span class="format-op"><span class="ast-extra">#date,</span><span class="string">:M</span></span></span><span class="ast-extra">)</span></span></span><span class="ast-extra">}}</span></span><span class="if-block"><span class="ast-extra">{{if </span><span class="binary-op"><span class="reference">month</span><span class="ast-extra"> in </span><span class="string">'11-12 1-3'</span></span><span class="ast-extra">}}</span><span class="content">Chilly outside, isn't it?</span><span class="ast-extra">{{else if </span><span class="binary-op"><span class="reference">month</span><span class="ast-extra"> == </span><span class="number">4</span></span><span class="ast-extra">}}</span><span class="content">Is it raining?</span><span class="ast-extra">{{else if </span><span class="binary-op"><span class="reference">month</span><span class="ast-extra"> in </span><span class="string">'7 8'</span></span><span class="ast-extra">}}</span><span class="content">Geez it's hot.</span><span class="ast-extra">{{else}}</span><span class="content">Nice out today, no?</span><span class="ast-extra">{{/if}}</span></span></span></code></p></li>
<li><p>The <code>unless</code> block accepts an expression that evaluates to a boolan, and if the value is <strong>not</strong> truthy, renders its body e.g. <code class="ast-nodes"><span><span class="unless-block"><span class="ast-extra">{{unless </span><span class="reference">logged-in</span><span class="ast-extra">}}</span><span class="content">Please log in.</span><span class="ast-extra">{{/unless}}</span></span></span></code>. The <code>unless</code> block does not support any sub-blocks.</p></li>
<li><p>The <code>case</code> block accepts an expression, the keyword <code>when</code>, and another expression. The first expression is evaluated, and the second expression is used with the first <code>when</code> block. The sub-blocks must be either <code>when</code> blocks, which accept an expression argument, or a final <code>else</code> block that is rendered if none of the <code>when</code> blocks match e.g. <pre><code class="ast-nodes"><span><span class="case-block"><span class="ast-extra">{{case </span><span class="reference">user</span><span class="ast-extra"> when </span><span class="reference">_.is-admin</span><span class="ast-extra">}}</span><span class="content">Hello admin user!
  </span><span class="ast-extra">{{when </span><span class="binary-op"><span class="reference">@date</span><span class="format-op"><span class="ast-extra">#date,</span><span class="binary-op"><span class="string">:H</span><span class="ast-extra"> &lt; </span><span class="number">12</span></span></span></span><span class="ast-extra">}}</span><span class="content">Good morning!
  </span><span class="ast-extra">{{else}}</span><span class="content">Good day!
</span><span class="ast-extra">{{/}}</span></span></span></code></pre>
<li><p>The <code>with</code> block accepts an expression, evaluates it, and sets the result as the context for its body. The <code>with</code> block accepts a an alternative sub-block in the form of an <code>else</code> that will be rendered if the value it is given is false-y. <code class="ast-nodes"><span><span class="with-block"><span class="ast-extra">{{with </span><span class="reference">user</span><span class="ast-extra">}}</span><span class="content">Hello, </span><span class="interpolator"><span class="ast-extra">{{</span><span class="reference">name</span><span class="ast-extra">}}</span></span><span class="content">.</span><span class="ast-extra">{{else}}</span><span class="content">Please log in.</span><span class="ast-extra">{{/with}}</span></span></span></code></p></li>
</ul>
<h3>Inline</h3>
<p>Any other interpolators encountered have their contents treated as expressions and will render the resulting value after passing it through the <code>string</code> operator.</p>
</div>

</body>
</html>`;
    }

    var docs$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        operators: operators,
        formats: formats,
        generateMarkdown: generateMarkdown,
        languageReference: languageReference
    });

    const docs = {
        operators: [],
        operatorText: {},
        languageReference: languageReference,
    };
    {
        const ops = index.evaluate(operators);
        for (const doc of ops) {
            const op = Array.isArray(doc.op) ? doc.op[0] : doc.op;
            const txt = `${op}${Array.isArray(doc.op) ? ` (alias ${doc.op.filter(n => n !== op).join(', ')})` : ''}
---${doc.note ? `
NOTE: ${doc.note}
` : ''}
${doc.sig.map(s => `${s.proto}${s.bin ? '        (can be binary)' : ''}${s.un ? '        (can be unary)' : ''}\n  ${s.desc}\n`).join('\n')}${doc.opts ? `

Options
---
${doc.opts.map(o => `${Array.isArray(o.name) ? `${o.name[0]} (alias ${o.name.slice(1).join(', ')})` : o.name} - ${o.type}\n  ${o.desc}\n`).join('\n')}` : ''}`;
            const all = Array.isArray(doc.op) ? doc.op : [doc.op];
            all.forEach((n, i) => {
                docs.operatorText[n] = txt;
                docs.operators.push(Object.assign({}, doc, i === 0 ? { op: n } : { op: n, alias: all[0] }));
            });
        }
        const fmts = index.evaluate(formats);
        for (const f of fmts) {
            const all = Array.isArray(f.name) ? f.name : [f.name];
            all.forEach((n, i) => {
                const op = `#${n}`;
                const val = { op, sig: [{ fmt: 1, proto: op, desc: f.desc }], opts: f.opts };
                if (i > 0)
                    val.alias = true;
                docs.operators.push(val);
                const txt = `${n}${all.length > 1 ? ` (alias: ${all.filter(nn => n !== nn).join(', ')})` : ''}${f.opts ? ` - #${n},${f.opts.map(o => `${o.name}${o.req ? '' : '?'}`).join(',')}` : ''}
${f.desc ? `${f.desc}
` : ''}
${f.opts ? `
Arguments
---
${f.opts.map(o => `${o.name} - ${o.type}\n  ${o.desc}\n`).join('\n')}` : ''}`;
                docs.operatorText[op] = txt;
            });
        }
    }
    let sourceTm;
    const darkTheme = { fg: '#ccc', bg: '#222', border: '#555555', highlight: '#ddd', dark: '#444444', active: '#265189', hover: '#167808', error: '#a00', btntxt: '#ddd', code: { c1: '#ccc', c2: '#ccc', c3: '#1ca', c4: '#e81', c5: '#2a0', c6: '#e78', c7: '#6c3', c8: '#e82', c9: '#67f', c10: '#89d', c11: '#4bc', c12: '#1de', c13: '#29c', c14: '#888', c20: '#f00', }, };
    const lightTheme = { fg: '#222', bg: '#fff', border: '#cccccc', highlight: '#000', dark: '#999999', active: '#4596ff', hover: '#26bf10', error: '#8b0000', btntxt: '#fff', code: { c1: '#555', c2: '#222', c3: '#164', c4: '#951', c5: '#a11', c6: '#708', c7: '#371', c8: '#630', c9: '#45c', c10: '#239', c11: '#167', c12: '#189', c13: '#145', c14: '#888', c20: '#f00', }, };
    let autosizeTm;
    const binops = ['**', '*', '/%', '/', '%', '+', '-', '>=', '>', '<=', '<', '??', 'gt', 'gte', 'lt', 'lte', 'in', 'like', 'ilike', 'not-in', 'not-like', 'not-ilike', 'contains', 'does-not-contain', 'is', 'is-not', '==', '!=', '===', '!==', 'strict-is', 'strict-is-not', 'deep-is', 'deep-is-not', 'and', '&&', 'or', '||'];
    const form_els = ['INPUT', 'TEXTAREA', 'SELECT'];
    class Designer extends Ractive__default['default'] {
        constructor(opts) {
            super(opts);
            this.evalLock = false;
            this._scrollers = [];
            this._undo = [];
            this._redo = [];
            this._inited = false;
            this._isplay = false;
            this.log = (args) => {
                this.push('temp.logs', [index.evaluate(`#now##date,'H:m:s yyyy-MM-dd'`), args]);
                console.log(...args);
            };
            this.langref = languageReference;
        }
        addWidget(type) {
            const widget = { type };
            const path = this.get('temp.widget');
            if (type === 'label') {
                if (path !== 'report')
                    widget.width = 10;
                widget.text = ':label';
            }
            else if (type === 'html') {
                widget.html = '<div>html</div>';
                widget.font = { line: 0 };
            }
            this.push(`${path}.widgets`, widget);
        }
        async run() {
            const report = this.get('report');
            this._isplay = true;
            const ctx = new index.Root(cloneDeep(report.context || {}), { parameters: this.get('params') });
            ctx.log = this.log;
            const srcs = await this.buildSources(false);
            this._isplay = false;
            let text;
            this.fire('running');
            try {
                const opts = {
                    foot: this.frameExtra(),
                    table: this.get('settings.delimitedTable'),
                };
                if (report.type !== 'delimited')
                    Object.assign(opts, this.get('settings.runopts'));
                text = index.run(report, srcs, ctx, opts);
            }
            catch (e) {
                console.error(e);
                text = `<html><head><style>.page { width: 63rem; height: 48rem; position: absolute; overflow: hidden; left: 1.5rem; top: 1.5rem; } .page-back { width: 66rem; height: 51rem; } body { font-size: 0.83rem; } @media screen { html { min-width: 68rem; } body { background-color: #999; display: flex; flex-direction: column; align-items: center; } .page-back { background-color: #fff; box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.4); position: relative; overflow: hidden; box-sizing: border-box; margin: 0.5em; } } @media print { body { margin: 0; padding: 0; width:66rem;background-color: none; display: block; height: 357rem } .page-back { position: absolute; box-shadow: none; background-color: none; margin: 0; padding: 0; left: 0rem; } .pb0 { top: 0rem; } .pb1 { top: 51rem; } .pb2 { top: 102rem; } .pb3 { top: 153rem; } .pb4 { top: 204rem; } .pb5 { top: 255rem; } .pb6 { top: 306rem; } } @page { size: 66em 51em; } .container { position:absolute;box-sizing:border-box; } .label {position:absolute;box-sizing:border-box;} pre { margin: 1rem; } h2 { color: red; margin: 1rem; }</style></head><body><div class="page-back"><h2>Report Exception</h2><code><pre>${e}\n${e.stack}</pre></code></div></body></html>`;
            }
            this.fire('run');
            this.set('result', text);
            return true;
        }
        frameExtra() {
            const delim = this.get('report.type') === 'delimited' || this.get('settings.runopts.delimited');
            return `
      <style>
        #print { display: none; }
        @media screen {
          :root {
            --fg: ${this.get('@style.out.fg') || this.get('@style.fg')};
            --bg: ${this.get('@style.out.bg') || this.get('@style.bg')};
          }
          html:before, html:after { content: ' '; position: fixed; display: block; z-index: 2; box-shadow: 0 0 10px #000; transition: opacity 0.4s ease-in-out; opacity: 1; width: 100%; height: 5px; }
          html:before { top: -5px; }
          html:after { bottom: -5px; }
          html.scrolled-top:before { opacity: 0; }
          html.scrolled-bottom:after { opacity: 0; }

          html { font-size: ${this.get('settings.scale')}% !important;
          body {
            background-color: ${this.get('@style.out.dark') || this.get('@style.dark')};
            padding: 2em;
            color: var(--fg);
          }${delim ? `
          body {
            display: inline-block;
          }
          table { border-collapse: collapse; }
          th, td { padding: 0.15em 0.4em; border: 1px solid rgba(128, 128, 128, 0.5); }
          tr.header th { position: sticky; top: 0; border-bottom: 2px solid; background: var(--bg); z-index: 10; }
          tr.row th { position: sticky; left: 0; padding: 0.15em 0.5em; text-align: right; border-right: 2px solid; background: var(--bg); z-index: 9; }
          tr:hover td, tr.row:hover th { background: rgba(128, 128, 128, 0.2); }` : `
          #print { position: fixed; top: 0.2em; right: 1em; opacity: 0.1; transition: opacity 0.5s ease-in-out; color: var(--bg); background-color: var(--fg); border: 1px solid; border-radius: 0.5em; cursor: pointer; display: inline-block; }
          #print:hover { opacity: 1; }`}
          .page-back {
            color: var(--fg);
            background-color: var(--bg);
          }
        }
      </style>
      <script>
        const html = document.scrollingElement || document.documentElement;
        const listener = ev => {
          if (html.scrollTop === 0) html.classList.add('scrolled-top');
          else html.classList.remove('scrolled-top');

          if (html.scrollTop + html.clientHeight >= html.scrollHeight) html.classList.add('scrolled-bottom');
          else html.classList.remove('scrolled-bottom');
        };
        html.addEventListener('scroll', listener, { passive: true });
        window.addEventListener('resize', listener);
        window.addEventListener('scroll', listener);
        window.addEventListener('keydown', ev => {
          if (ev.ctrlKey && ev.shiftKey && ev.key === 'Enter') window.parent.postMessage('run', '*');
        });
        html.classList.add('scrolled-top');
        const printbtn = document.createElement('button');
        printbtn.innerHTML = 'Print';
        printbtn.setAttribute('id', 'print');
        printbtn.setAttribute('title', 'Print the report using your browser\\'s print function.\\n\\nThis tends to work best with margins set to none and background/image printing turned on.\\n\\nIt also seems to work best in chromium-based browsers (notably, puppetteer), unless you\\'re okay missing page two in Firefox.');
        printbtn.addEventListener('click', () => window.print());
        document.body.appendChild(printbtn);
      </script>
    `;
        }
        paperSize() {
            const size = this.get('pageSize');
            const type = this.get('report.type');
            if (type === 'flow') {
                let res = `margin: auto; box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.4); min-heght: 10rem; background-size: 1rem 1rem; background-image: radial-gradient(circle, ${this.get('@style.border')}80 1px, transparent 1px);`;
                if (size && size.width)
                    res += `width: ${size.width}rem; box-sizing: border-box;`;
                return res;
            }
            if (size) {
                return `width: ${size.width}rem; box-sizing: border-box; margin: auto; box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.4); padding: ${size.margin[0]}rem ${size.margin[1]}rem; min-height: ${size.height}rem; background-size: 1rem 1rem; background-position: ${10.5 - size.margin[0]}rem ${10.5 - size.margin[1]}rem; background-image: radial-gradient(circle, ${this.get('@style.border')}80 1px, transparent 1px);`;
            }
            return '';
        }
        calcHeight(w) {
            if (typeof w.height === 'number')
                return `${w.height}rem`;
            else if (typeof w.height === 'object' && 'percent' in w.height && w.height.percent)
                return `${w.height.percent}%`;
            else if (w.type === 'label') {
                let n = 1;
                if (w.font && !index.isComputed(w.font.size) && w.font.size > n)
                    n = w.font.size;
                if (Array.isArray(w.text)) {
                    for (let i = 0; i < w.text.length; i++) {
                        const t = w.text[i];
                        if (typeof t === 'object' && 'font' in t && t.font && t.font.size > n)
                            n = +t.font.size;
                    }
                }
                return `${n}rem`;
            }
            else if (w.type !== 'container' && w.type !== 'repeater')
                return '1rem';
            else if (w.macro)
                return '1rem';
            else
                return 'min-content';
        }
        calcHeightWithMargin(w) {
            const h = this.calcHeight(w);
            if (!w.margin || index.isComputed(w.margin))
                return h;
            if (typeof w.margin === 'number')
                return `calc(${h} + ${2 * w.margin}rem)`;
            else if (w.margin.length === 2)
                return `calc(${h} + ${2 * w.margin[0]}rem)`;
            else if (w.margin.length === 4)
                return `calc(${h} + ${w.margin[0] + w.margin[2]}rem)`;
            return h;
        }
        calcWidth(w, context) {
            if (!w.width || index.isComputed(w.width))
                return '100%';
            else if (w.width === 'grow' && Array.isArray(context.get('../../layout')))
                return `(100% - ${context.get(`../../layout[${context.get('@index')}][0]`) || 0}rem)`;
            else if (typeof w.width === 'object' && 'percent' in w.width)
                return `${w.width.percent}%`;
            else if (typeof w.width === 'number')
                return `${w.width}rem`;
            else
                return '100%';
        }
        calcWidthWithMargin(w, context) {
            if (/^report\.widgets\.\d+$/.test(context.resolve()))
                return '100%';
            const width = this.calcWidth(w, context);
            if (!w.margin && w.font && w.font.right)
                return `calc(${width} + ${w.font.right}rem)`;
            if (!w.margin || index.isComputed(w.margin))
                return ~width.indexOf('(') ? `calc${width}` : width;
            if (typeof w.margin === 'number')
                return `calc(${width} + ${2 * w.margin}rem)`;
            else if (w.margin.length === 2)
                return `calc(${width} + ${2 * w.margin[1]}rem)`;
            else if (w.margin.length === 4)
                return `calc(${width} + ${w.margin[1] + w.margin[3]}rem)`;
        }
        calcMargin(w) {
            const m = w.margin;
            if (!m || index.isComputed(m))
                return '';
            if (typeof m === 'number')
                return `padding: ${m}rem;`;
            else if (m.length === 2)
                return `padding: ${m[0]}rem ${m[1]}rem;`;
            else if (m.length === 4)
                return `padding: ${m[0]}rem ${m[1]}rem ${m[2]}rem ${m[3]}rem;`;
            return '';
        }
        calcBorder(w) {
            const b = w.border;
            if (!b)
                return '';
            const color = this.get('@style.border');
            if (typeof b === 'number')
                return `border-bottom:${b * 0.0625}rem solid ${color};`;
            else if (Array.isArray(b)) {
                if (b.length === 1)
                    return `border:${b[0] * 0.0625}rem solid ${color};`;
                else if (b.length === 2)
                    return `border-style:solid;border-width:${b[0] * 0.0625}rem ${b[1] * 0.0625}rem;`;
                else if (b.length === 4)
                    return `border-style:solid;border-width:${b[0] * 0.0625}rem ${b[1] * 0.0625}rem ${b[2] * 0.0625}rem ${b[3] * 0.0625}rem;`;
            }
            else if (typeof b === 'string') {
                return `border: 1px dotted green;`;
            }
            else
                return `border-style:solid;border-width:${(b.top || 0) * 0.0625}rem ${(b.right || 0) * 0.0625}rem ${(b.bottom || 0) * 0.0625}rem ${(b.left || 0) * 0.0625}rem;`;
            return '';
        }
        calcFont(w) {
            const f = w.font;
            let res = '';
            if (f.size && !index.isComputed(f.size))
                res += `font-size: ${f.size}rem;`;
            if (f.line && !index.isComputed(f.line))
                res += `line-height: ${f.line}rem;`;
            if (f.align && !index.isComputed(f.align))
                res += `text-align: ${f.align};`;
            if (f.color && !index.isComputed(f.color))
                res += `color: ${f.color} !important;`;
            if (f.family && !index.isComputed(f.family))
                res += `font-family: ${f.family};`;
            if (f.weight && !index.isComputed(f.weight))
                res += `font-weight: ${f.weight};`;
            if (f.right)
                res += `padding-right: ${f.right}rem;`;
            return res;
        }
        calcManualLayout(l, width, height) {
            l = l || [];
            const x = l[0] || 0;
            const y = l[1] || 0;
            let res = '';
            if (x < 0)
                res += `margin-left: calc(100% - ${width} - ${-x - 1}rem); margin-right: -100%;`;
            else
                res += `margin-left: ${x}rem; margin-right: calc(${-x}rem - ${width});`;
            if (y < 0)
                res += `margin-top: calc(100% - ${height} - ${-y - 1}rem); margin-bottom: ${-y - 1}rem;`;
            else
                res += `margin-top: ${y}rem;`;
            return res;
        }
        split(path, pop, ...add) {
            const res = Ractive__default['default'].splitKeypath(path);
            if (pop)
                res.splice(-pop, pop);
            if (add)
                res.push(...add);
            return res;
        }
        lastKey(path, count = 1) {
            const keys = Ractive__default['default'].splitKeypath(path);
            for (let i = 1; i < count; i++)
                keys.pop();
            return keys.pop();
        }
        selectWidget(path) {
            var _a;
            const two = (path || '').split('.')[1] || 'report';
            const base = `report${two === 'overlay' || two === 'watermark' ? `.${two}` : ''}`;
            if (((_a = this.readLink('widget', { canonical: false })) === null || _a === void 0 ? void 0 : _a.keypath) === path)
                path = base;
            this.link(path, 'widget');
            this.set('temp.name', nameForWidget(this.get(path + '.type'), path));
            this.set('temp.widget', path);
            const w = this.get('widget');
            if (w.type === 'html')
                this.editExpr(`${path}.html`, { html: true });
            else if (w.type === 'label' || w.type === 'measured')
                this.editExpr(`${path}.text`, { label: true });
            else if (w.type === 'image')
                this.editExpr(`${path}.url`);
            else if (w.type === 'container' && w.macro)
                this.editExpr(`${path}.macro`);
            else if (w.type === 'repeater' && typeof w.source === 'string')
                this.editExpr(`${path}.source`);
            this.treeScrollToActive();
        }
        treeScrollToActive() {
            setTimeout(() => {
                const el = document.querySelector('.tree .node.active > .line');
                if (el && typeof el.scrollIntoView === 'function')
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
        async eval() {
            const start = Date.now();
            const str = this.get('temp.expr.str');
            let v = this.get('temp.expr.path');
            if (v && v.startsWith('widget.'))
                v = v.replace('widget', this.get('temp.widget'));
            const ctx = await this.buildLocalContext(v);
            const res = Array.isArray(str) ?
                str.map(p => {
                    if (typeof p === 'string')
                        return index.evaluate(ctx, p);
                    else if (p && typeof p === 'object' && typeof p.text === 'string')
                        return index.evaluate(ctx, p.text);
                    return '';
                }).join('') :
                index.evaluate(ctx, this.get('temp.expr.html') || this.get('temp.expr.template') ? index.parseTemplate(str) : str);
            console.log(`eval: ${Date.now() - start}ms`);
            this.set('temp.expr.result', res);
            this.set('temp.expr.tab', 'result');
        }
        evalExpr(expr, template, ctx) {
            if (ctx)
                return index.evaluate(ctx, template ? index.parseTemplate(expr) : index.parse(expr));
            return index.evaluate(template ? index.parseTemplate(expr) : index.parse(expr));
        }
        autosizeHtml(ctx) {
            const preview = ctx.get('ctx.preview');
            ctx.set('ctx.preview', true);
            ctx.set('ctx.autosize', true);
            ctx.set('.height', Math.ceil(ctx.node.nextElementSibling.offsetHeight / 16));
            ctx.set('ctx.autosize', false);
            ctx.set('ctx.preview', preview);
        }
        async editProvidedData(ctx) {
            ctx.link(ctx.resolve(), '~/data');
            const source = ctx.get();
            let val;
            if ('type' in source && source.type === 'fetch')
                val = await this.fetchData();
            else if ('input' in source)
                val = source.input;
            else if ('data' in source || 'values' in source)
                val = source.data ? source.data : await source.values();
            if (typeof val === 'object' && 'value' in val)
                val = val.value;
            if (typeof val === 'string')
                this._importText.value = val;
            else
                this._importText.value = JSON.stringify(val, null, 2);
            if (!this.get('show.proppop'))
                this.set('show.props', false);
            this.set('tab', 'import');
        }
        async logData(source) {
            console.log(await this.loadSourceData(source));
        }
        editExpr(path, options) {
            if (this.event)
                path = this.getContext(this.event.node).resolve(path);
            if (path.startsWith('widget.'))
                path = path.replace('widget', this.get('temp.widget'));
            let val = this.get(path);
            if (Array.isArray(val)) {
                val.forEach((v, i) => {
                    if (typeof v === 'object' && !('text' in v))
                        val[i] = index.stringify(v);
                });
            }
            else if (typeof val !== 'string')
                val = val === undefined ? '' : index.stringify(val);
            this.set('temp.expr.path', path);
            const html = options && options.html;
            const tab = this.get('temp.expr.tab');
            this.set('temp.expr.html', html);
            this.set('temp.expr.label', options && options.label);
            this.set('temp.expr.template', options && options.template);
            this.set('temp.expr.tab', html ? 'html' : tab === 'ast' || tab === 'text' ? tab : 'text');
            this.set('temp.bottom.tab', 'expr');
            this.link(path, 'expr');
            this.set('temp.expr.str', val);
            this.set('show.bottom', true);
            if (!this.get('show.proppop'))
                this.set('show.props', false);
            const el = document.getElementById(`expr-${html ? 'html' : 'text'}`);
            if (el)
                setTimeout(() => el.focus(), 500);
            const parent = Ractive__default['default'].joinKeys(...Ractive__default['default'].splitKeypath(path).slice(0, -1));
            let watch;
            watch = this.observe(`${parent} temp.expr.path`, (v, _o, k) => {
                if (k === 'temp.expr.path')
                    return watch.cancel();
                if (!v || typeof v !== 'object')
                    this.checkLink('expr');
            }, { init: false });
        }
        editParam(ctx) {
            const path = ctx.resolve();
            this.set('show.bottom', true);
            this.set('temp.bottom.param', path);
            this.set('temp.bottom.tab', 'param');
            this.link(path, 'param');
            if (!this.get('show.proppop'))
                this.set('show.props', false);
        }
        editReportSrc(ctx, key) {
            const path = ctx.resolve(key || undefined);
            this.set('show.bottom', true);
            this.set('temp.bottom.source', path);
            this.set('temp.bottom.tab', 'source');
            this.link(path, 'source');
            if (!this.get('show.proppop'))
                this.set('show.props', false);
        }
        moveUp(ctx, path, index, end) {
            const idx = index !== undefined ? index : ctx.get('@index');
            path = path || '../';
            if (!Array.isArray(path))
                path = [path];
            for (const p of path) {
                if (!p)
                    continue;
                if (idx == null || idx <= 0)
                    return;
                const item = ctx.get(joinPath(p, idx));
                ctx.splice(p, end ? 0 : idx - 1, 0, item);
                ctx.splice(p, idx + 1, 1);
            }
        }
        moveDown(ctx, path, index, end) {
            const idx = index !== undefined ? index : ctx.get('@index');
            path = path || '../';
            if (!Array.isArray(path))
                path = [path];
            for (const p of path) {
                if (!p)
                    continue;
                const last = ctx.get('@last');
                if (idx == null || !~idx || idx >= last)
                    return;
                const item = ctx.get(joinPath(p, idx));
                ctx.splice(p, end ? last + 1 : idx + 2, 0, item);
                ctx.splice(p, idx, 1);
            }
        }
        reparent(target) {
            const w = this.get('reparent');
            this.set('reparent', undefined);
            if (!w || !target)
                return;
            if (this.get('report.type') === 'delimited') {
                const widx = w.get('@index');
                const obj = w.splice('../', widx, 1).result[0];
                this.push('target.fields', obj);
                if (this.get('report.headers')) {
                    const obj = this.splice('report.headers', widx, 1).result[0];
                    this.push('report.headers', obj);
                }
            }
            else {
                let layout;
                if (Array.isArray(w.get('../../layout'))) {
                    layout = w.splice('../../layout', w.get('@index'), 1).result[0];
                }
                if (Array.isArray(target.get('.layout'))) {
                    target.push('.layout', layout || [0, 0]);
                }
                const obj = w.splice('../', w.get('@index'), 1).result[0];
                target.push('.widgets', obj);
            }
        }
        move(target) {
            const w = this.get('reparent');
            this.set('reparent', undefined);
            if (!w || !target)
                return;
            const idx = target.get('@index');
            if (this.get('report.type') === 'delimited') {
                const widx = w.get('@index');
                const obj = w.splice('../', widx, 1).result[0];
                this.splice('report.fields', idx, 0, obj);
                if (this.get('report.headers')) {
                    const obj = this.splice('report.headers', widx, 1).result[0];
                    this.splice('report.headers', idx, 0, obj);
                }
            }
            else {
                const container = target.get('../../');
                if (!container || container.type !== 'container' && container !== this.get('report'))
                    return;
                let layout;
                if (Array.isArray(w.get('../../layout'))) {
                    layout = w.splice('../../layout', w.get('@index'), 1).result[0];
                }
                if (Array.isArray(target.get('../../layout'))) {
                    target.splice('../../layout', idx, 0, layout || [0, 0]);
                }
                const obj = w.splice('../', w.get('@index'), 1).result[0];
                target.splice('../../widgets', idx, 0, obj);
            }
        }
        paste(target) {
            const w = this.get('copy');
            this.set('copy', undefined);
            if (!w || !target)
                return;
            if (this.get('report.type') === 'delimited') {
                const obj = cloneDeep(w.get());
                this.push('report.fields', obj);
                if (this.get('report.headers')) {
                    const obj = cloneDeep(this.get(`report.headers.${w.get('@index')}`));
                    this.push('report.headers', obj);
                }
            }
            else {
                const obj = cloneDeep(w.get());
                target.push('widgets', obj);
                if (Array.isArray(target.get('layout'))) {
                    if (Array.isArray(w.get('^^/layout')))
                        target.push('layout', w.get(`^^/layout.${w.get('@index')}`));
                    else
                        target.push('layout', [0, 0]);
                }
            }
        }
        pasteBefore(target) {
            const w = this.get('copy');
            this.set('copy', undefined);
            if (!w || !target)
                return;
            const idx = target.get('@index');
            if (this.get('report.type') === 'delimited') {
                const obj = cloneDeep(w.get());
                const widx = w.get('@index');
                this.splice('report.fields', idx, 0, obj);
                if (this.get('report.headers')) {
                    const obj = cloneDeep(this.get(`report.headers.${widx}`));
                    this.splice('report.headers', idx, 0, obj);
                }
            }
            else {
                const container = target.get('../../');
                if (!container || container.type !== 'container' && container !== this.get('report'))
                    return;
                const obj = cloneDeep(w.get());
                target.splice('../../widgets', idx, 0, obj);
                if (Array.isArray(target.get('../../layout'))) {
                    if (Array.isArray(w.get('^^/layout')))
                        target.splice('../../layout', idx, 0, w.get(`^^/layout.${w.get('@index')}`));
                    else
                        target.splice('../../layout', idx, 0, [0, 0]);
                }
            }
        }
        clickWidget(target) {
            var _a, _b, _c, _d;
            const keypath = target.get('@keypath');
            const type = target.get('.type');
            if (!((_b = (_a = this.event) === null || _a === void 0 ? void 0 : _a.event) === null || _b === void 0 ? void 0 : _b.shiftKey) && this.get('reparent') && type === 'container' && keypath.indexOf(this.get('reparent').resolve()) === -1)
                this.reparent(target);
            else if (this.get('reparent'))
                this.move(target);
            else if (!((_d = (_c = this.event) === null || _c === void 0 ? void 0 : _c.event) === null || _d === void 0 ? void 0 : _d.shiftKey) && this.get('~/copy') && type === 'container')
                this.paste(target);
            else if (this.get('~/copy'))
                this.pasteBefore(target);
            else if (this.get('report.type') === 'delimited')
                this.editExpr(target.resolve());
            else
                this.selectWidget(keypath);
            return false;
        }
        fillArray(count) {
            const res = [];
            for (let i = 0; i < count; i++) {
                res[i] = [];
            }
            return res;
        }
        addHeader() {
            this.set('report.headers', (this.get('report.fields') || []).map(() => ''));
        }
        command(name, ui, value) {
            return document.execCommand(name, ui || false, value === undefined ? null : value);
        }
        retypeASTNode(path, type) {
            if (type === 'operator') {
                this.set(path, { op: '+' });
            }
            else if (type === 'reference') {
                this.set(path, { r: '' });
            }
            else if (type === 'string') {
                this.set(path, { v: '' });
            }
            else if (type === 'number') {
                this.set(path, { v: 0 });
            }
            else if (type === 'undefined') {
                this.set(path, { v: undefined });
            }
        }
        autosize(node) {
            if (autosizeTm)
                clearTimeout(autosizeTm);
            autosizeTm = setTimeout(() => {
                autosizeTm = 0;
                const pos = node.parentElement.scrollTop;
                const sh = node.parentElement.scrollHeight;
                const ch = node.parentElement.clientHeight;
                const old = parseInt(node.style.height);
                node.style.height = '';
                node.style.overflow = '';
                setTimeout(() => {
                    const next = node.scrollHeight + 1;
                    node.style.height = `${next}px`;
                    node.style.overflow = 'hidden';
                    node.parentElement.scrollTop = old && pos + ch + (next - old) >= sh ? pos + (next - old) : pos;
                });
            }, 500);
        }
        exprToggle(path) {
            this.toggle('exprExpand.' + Ractive__default['default'].escapeKey(path));
        }
        async buildRoot(skipSources, sample) {
            if (sample !== false && this._builtroot)
                return this._builtroot;
            const report = this.get('report');
            const res = new index.Root(cloneDeep(report.context), { parameters: this.get('params') });
            res.log = this.log;
            if (report.extraContext)
                index.evaluate(res, report.extraContext);
            const srcs = await this.buildSources(sample);
            if (!skipSources)
                index.applySources(res, report.sources || [], srcs);
            if (sample !== false)
                this._builtroot = Promise.resolve(res);
            return res;
        }
        async loadSourceData(av, sample) {
            const load = this.get('actions.loadSourceData');
            const nocache = this._isplay;
            let d;
            let vv = av;
            if (vv.type === 'fetch' && (vv.fetch || !vv.data)) {
                d = await this.fetchData(vv);
                if (!vv.eval)
                    d = { value: tryParseData(d, vv.header) };
                if (!vv.fetch)
                    vv.data = d;
            }
            else if ('data' in av && av.data && (!vv.cached || !nocache)) {
                if (!vv.eval && typeof av.data === 'string') {
                    d = tryParseData(av.data, av.header);
                    if (!d || typeof d !== 'object' || !('value' in d))
                        d = { value: d };
                }
                else
                    d = av.data;
            }
            else if ('values' in av && typeof av.values === 'function') {
                d = await av.values(this.get('params') || []);
            }
            else if ('input' in av && av.input) {
                d = tryParseData(av.input, av.header);
                if (!d || typeof d !== 'object' || !('value' in d))
                    d = { value: d };
                av.data = d;
            }
            else {
                if (typeof load === 'function') {
                    vv.cached = true;
                    vv.data = d = await load(av, this._isplay, this.get('params'), this.get('report'));
                }
            }
            return d;
        }
        async buildSources(sample) {
            const report = this.get('report');
            const avs = this.get('sources') || [];
            const res = {};
            for (const src of report.sources || []) {
                const av = avs.find(s => s.name === src.source);
                if (av) {
                    const data = await this.loadSourceData(av, sample);
                    if (data && typeof data === 'object' && 'value' in data)
                        res[av.name] = data;
                    else
                        res[av.name] = { value: data };
                }
            }
            return res;
        }
        async buildLocalContext(path, sample) {
            const root = await this.buildRoot(path && path.slice(0, 'report.sources.'.length) === 'report.sources.', sample === false ? sample : true);
            root.special.date = new Date();
            root.special.local = {};
            root.special.locals = {};
            root.special.special = {};
            root.special.specials = {};
            let loc = this.get('report');
            let ctx = root;
            if (path) {
                const parts = Ractive__default['default'].splitKeypath(path);
                if (parts[0] === 'report')
                    parts.shift();
                if (parts[0] === 'fields') {
                    let src = index.evaluate(ctx, `*${this.get('report.source')}`);
                    if (src && !Array.isArray(src) && typeof src === 'object' && Array.isArray(src.all))
                        src = src.all;
                    if (src && typeof src === 'object' && Array.isArray(src.value))
                        src = src.value;
                    if (src && Array.isArray(src))
                        src = src[0];
                    let context = index.extend(ctx, { value: src });
                    const row = this.get('report.rowContext');
                    if (row) {
                        if (!context.locals)
                            context.locals = {};
                        const v = index.evaluate(context, row);
                        if (v)
                            context.value = v;
                    }
                    ctx = context;
                }
                else if (parts[0] === 'rowContext') {
                    let src = index.evaluate(ctx, `*${this.get('report.source')}`);
                    if (src && !Array.isArray(src) && typeof src === 'object' && Array.isArray(src.all))
                        src = src.all;
                    if (src && typeof src === 'object' && Array.isArray(src.value))
                        src = src.value;
                    if (src && Array.isArray(src))
                        src = src[0];
                    ctx = index.extend(ctx, { value: src });
                }
                else if (parts[0] === 'sources') {
                    if (parts[parts.length - 1] === 'base') {
                        const name = this.get(`report.sources.${parts[1]}.source`);
                        const provided = (this.get('sources') || []).find(s => s.name === name);
                        let src = await this.loadSourceData(provided);
                        ctx = index.extend(ctx, { value: ctx.value, special: { source: src } });
                    }
                    else {
                        const name = this.get(`report.sources.${parts[1]}.name`) || this.get(`report.sources.${parts[1]}.source`);
                        const srcs = await this.buildSources();
                        index.applySources(root, loc.sources || [], srcs);
                        let src = index.evaluate(ctx, `*${name}`);
                        if (src && !Array.isArray(src) && typeof src === 'object' && Array.isArray(src.all))
                            src = src.all;
                        if (src && typeof src === 'object' && Array.isArray(src.value))
                            src = src.value;
                        if (src && Array.isArray(src))
                            src = src[0];
                        ctx = index.extend(ctx, { value: src });
                    }
                }
                else {
                    while (loc && parts.length) {
                        const part = parts.shift();
                        if (loc.type === 'page' && (part === 'header' || part === 'footer' || part === 'watermark' || part === 'overlay')) {
                            root.special.page = 1;
                            root.special.pages = 10;
                            root.special.size = { x: 30, y: 40 };
                        }
                        if (part === 'height' || part === 'width' || part === 'br' || part === 'margin' || part === 'hide') {
                            root.special.placement = { x: 0, y: 0, availableX: 10, availableY: 10, maxX: 10, maxY: 10, offsetX: 5, offsetY: 5 };
                            root.special.widget = loc;
                        }
                        loc = loc[part];
                        if (loc) {
                            if (loc.context) {
                                if (!ctx.locals)
                                    ctx.locals = {};
                                const value = index.evaluate(ctx, loc.context);
                                if (value)
                                    ctx = index.extend(ctx, { value });
                            }
                            else if (loc.source && loc.source.source) {
                                const source = index.filter(root.sources[loc.source.source] || { value: [] }, loc.source.filter, loc.source.sort, loc.source.group, ctx);
                                ctx = index.extend(ctx, { value: source.value, special: { source } });
                            }
                            else if (loc.source) {
                                ctx = index.extend(ctx, { value: index.evaluate(ctx, loc.source) });
                            }
                        }
                        if (loc && loc.type === 'repeater') {
                            if (loc.group && loc.group.length && ctx.value && ctx.value.value && ctx.value.value[0]) {
                                root.special.grouped = true;
                                root.special.level = ctx.value.value[0].level;
                                root.special.group = ctx.value.value[0].group;
                            }
                            if (parts[0] === 'row') {
                                root.special.source = ctx.value;
                                ctx = index.extend(ctx, { value: index.evaluate(ctx, '@value.0') || index.evaluate(ctx, '@value.all.0') });
                                root.special.index = 0;
                            }
                            else if (parts[0] === 'footer') {
                                root.special.values = {};
                            }
                            if (parts[0] === 'row' || parts[0] === 'footer') {
                                root.special.last = 10;
                                root.special.count = 11;
                            }
                        }
                    }
                }
            }
            return ctx;
        }
        async fetchData(data) {
            const set = !data;
            data = data || this.get('data');
            const ctx = new index.Root({}, { parameters: this.get('params') });
            ctx.log = this.log;
            const url = this.evalExpr(data.url, true, ctx);
            const headers = {};
            if (Array.isArray(data.headers)) {
                for (let i = 0; i < data.headers.length; i++)
                    headers[data.headers[i][0]] = this.evalExpr(data.headers[i][1], true, ctx);
            }
            try {
                const req = { headers, method: data.method };
                if (req.method === 'POST' || req.method === 'PUT')
                    req.body = this.evalExpr(data.body, true, ctx);
                const res = await fetch(url, req);
                const txt = await res.text();
                if (set)
                    this.set('data.data', txt);
                return txt;
            }
            catch (_a) { }
        }
        getSchema(ctx) {
            const base = index.inspect(ctx.value);
            let last = ctx.value;
            let pl = base;
            pl.fields = pl.fields || [];
            let c = ctx;
            let prefix = '';
            for (const k in ctx.root.sources) {
                const source = ctx.root.sources[k];
                if (!source || !source.value)
                    continue;
                const schema = index.inspect(source.value);
                pl.fields.push({ name: `*${k}`, type: schema.type, fields: schema.fields });
            }
            let t = index.inspect(ctx.root.special);
            t.fields.forEach(f => (f.name = `@${f.name}`, pl.fields.push(f)));
            if (ctx.special) {
                t = index.inspect(ctx.special);
                t.fields.forEach(f => (f.name = `@${f.name}`, pl.fields.push(f)));
            }
            (this.get('report.parameters') || []).forEach((p) => pl.fields.push({ name: `!${p.name}`, type: p.type }));
            const stack = [];
            if (c !== c.root) {
                while (c) {
                    c = c.parent;
                    if (c === c.root)
                        prefix = '~';
                    else
                        prefix += '^';
                    if (last === c.value && c.parent)
                        continue;
                    stack.push(c);
                    t = index.inspect(c.value, c !== c.root);
                    (t.fields || []).forEach(f => (f.name = `${prefix}${f.name}`, pl.fields.push(f)));
                    last = c.value;
                    if (c.locals) {
                        t = index.inspect(c.locals);
                        if (t.fields)
                            t.fields.forEach(f => (f.meta = { local: true }, f.name = `${prefix === '~' ? '^' : prefix}${f.name}`, pl.fields.push(f)));
                    }
                    if (c === c.root)
                        break;
                }
            }
            stack.push(ctx);
            const locals = {};
            stack.forEach(c => {
                if (c.locals)
                    for (const k in c.locals)
                        locals[k] = c.locals[k];
            });
            t = index.inspect(locals);
            t.fields.forEach(f => (f.meta = { local: true }, pl.fields.push(f)));
            return base;
        }
        insertRef(path) {
            const tab = this.get('temp.expr.tab') || 'text';
            const parts = Ractive__default['default'].splitKeypath(path);
            let ps = [];
            while (parts.length && parts[parts.length - 1] !== 'ctx') {
                ps.unshift(this.get(Ractive__default['default'].joinKeys.apply(Ractive__default['default'], parts.concat('name'))));
                parts.pop();
                parts.pop();
            }
            if (ps[0][0] === '*' && ps[1] === 'value' && ps.length > 2)
                ps[1] = '0';
            const prefix = /^[!^@~*]+/.exec(ps[0]);
            if (prefix)
                ps[0] = ps[0].substring(prefix[0].length);
            let ref = index.stringify({ r: { k: ps } });
            if (prefix)
                ref = `${prefix[0]}${ref}`;
            if (this.get('temp.expr.html') || this.get('temp.expr.template'))
                ref = `{{${ref}}}`;
            if (tab === 'html' || tab === 'text') {
                return this.command('insertText', false, ref);
            }
            else if (tab === 'ast') {
                const active = this.get('temp.expr.partpath') || 'temp.expr.ast';
                this.set(active, { r: ref });
            }
        }
        insertOp(name) {
            const tab = this.get('temp.expr.tab') || 'text';
            if (tab === 'text') {
                const el = getLastFocus();
                if (!el)
                    return;
                const cur = el.value;
                const pos = [el.selectionStart, el.selectionEnd];
                let rep = cur.substring(pos[0], pos[1]);
                let cursor;
                if (binops.includes(name)) {
                    rep = ` ${name} `;
                    cursor = pos[0] + rep.length;
                }
                else if (name[0] === '#') {
                    rep = `${name}`;
                    cursor = pos[0] + rep.length;
                }
                else {
                    rep = `${name}(${rep})`;
                    cursor = pos[0] + rep.length - 1;
                }
                el.value = cur.substring(0, pos[0]) + rep + cur.substr(pos[1]);
                el.selectionStart = el.selectionEnd = cursor;
                el.dispatchEvent(new InputEvent('input'));
                el.dispatchEvent(new InputEvent('change'));
                el.focus();
            }
            else {
                return this.command('insertText', false, `{{${name}}}`);
            }
        }
        resetScrollers() {
            this._scrollers.forEach(fn => fn());
        }
        loadReportString(str) {
            try {
                const report = JSON.parse(str);
                this.set('report', report);
                this.set('params', report.defaultParams || {});
            }
            catch (e) {
                try {
                    const report = index.evaluate({ PageSizes: index.PageSizes }, str);
                    this.set('report', report);
                    this.set('params', report.defaultParams || {});
                }
                catch (e) {
                    console.error('Failed to load report', e);
                }
            }
        }
        async download(name, data, type = 'application/json') {
            name = index.evaluate(index.extend(await this.buildRoot(), { parser: index.parseTemplate }), name);
            const blob = new Blob([data], { type });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.download = name;
            a.href = url;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        }
        reportToString(compact, js, strings) {
            const json = this.get('report');
            if (!compact)
                return JSON.stringify(json, null, 2);
            else {
                if (js)
                    return jsonToJS(stripDefaults(json), strings);
                else
                    return JSON.stringify(stripDefaults(json));
            }
        }
        loadReportFile() {
            const input = this.find('#definition-file');
            let load;
            load = () => {
                input.removeEventListener('change', load);
                if (input.files.length) {
                    const file = input.files[0];
                    const reader = new FileReader();
                    reader.onload = txt => this.loadReportString(txt.target.result);
                    reader.readAsText(file);
                }
            };
            input.addEventListener('change', load);
            input.click();
        }
        loadImportFile() {
            const input = this.find('#import-file');
            let load;
            load = () => {
                input.removeEventListener('change', load);
                if (input.files.length) {
                    const file = input.files[0];
                    const reader = new FileReader();
                    reader.onload = txt => {
                        this.tryImport(txt.target.result);
                        this._importText.value = txt.target.result.toString();
                    };
                    reader.readAsText(file);
                }
            };
            input.addEventListener('change', load);
            input.click();
        }
        getImportText() {
            var _a;
            return ((_a = this._importText) === null || _a === void 0 ? void 0 : _a.value) || '';
        }
        tryImport(str) {
            if (!str || !this.readLink('data'))
                return;
            this.set('data.input', str);
            const json = tryParseData(str, this.get('data.header'));
            if (json) {
                if (typeof json === 'object' && 'type' in json && json.type === 'fetch')
                    this.set('data', json);
                else {
                    if (Array.isArray(json) || !Array.isArray(json.value))
                        this.set('data.data', { value: json });
                    else if (Object.keys(json).length === 1 && 'value' in json)
                        this.set('data.data', json.value);
                    else
                        this.set('data.data', json);
                }
            }
            else {
                this.set('data.data', str);
            }
            this.update('sources');
        }
        loadContextFile() {
            const input = this.find('#context-file');
            let load;
            load = () => {
                input.removeEventListener('change', load);
                if (input.files.length) {
                    const file = input.files[0];
                    const reader = new FileReader();
                    reader.onload = txt => this.tryContext(txt.target.result);
                    reader.readAsText(file);
                }
            };
            input.addEventListener('change', load);
            input.click();
        }
        tryContext(str) {
            if (!str)
                return;
            let ctx;
            try {
                ctx = JSON.parse(str);
            }
            catch (_a) {
                try {
                    ctx = index.evaluate({}, str);
                }
                catch (_b) {
                    ctx = {};
                }
            }
            this.set('report.context', ctx);
        }
        setHTMLFontSize() {
            const size = this.get('temp.fontSize');
            if (size) {
                this.command('fontSize', false, size);
            }
            setTimeout(() => this.set('temp.fontSize', ''));
        }
        inRepeater(path) {
            return /\.row\./.test(path);
        }
        getPartStrings(arr) {
            return arr.map(c => c.text || c).join(' + ');
        }
        nodeForPosition(pos, name) {
            const str = this.get('temp.expr.str');
            const r = (this.get('temp.expr.html') || this.get('temp.expr.template') ? index.parseTemplate : index.parse)(str, { tree: true });
            if ('message' in r)
                return r;
            else
                return nodeForPosition(r, pos, name);
        }
        fmt() {
            this._onChange(this.get('report'));
            const str = this.get('temp.expr.str');
            const settings = this.get('~/settings.format') || {};
            const opts = { listWrap: { base: settings.wrap, array: settings.wrap_array, union: settings.wrap_union, args: settings.wrap_args, keys: settings.wrap_keys } };
            this.set('temp.expr.str', fmt(str, this.get('temp.expr.html'), this.get('tmp.nowrap'), opts));
        }
        fmtAll() {
            const json = this.get('report');
            this._onChange(json);
            const settings = this.get('~/settings.format') || {};
            const opts = { listWrap: { base: settings.wrap, array: settings.wrap_array, union: settings.wrap_union, args: settings.wrap_args, keys: settings.wrap_keys } };
            this.set('report', fmtAll(json, this.get('tmp.nowrap'), opts));
        }
        unparse(value) {
            if (!index.isValueOrExpr(value))
                value = { v: value };
            const settings = this.get('~/settings.format') || {};
            const opts = { listWrap: { base: settings.wrap, array: settings.wrap_array, union: settings.wrap_union, args: settings.wrap_args, keys: settings.wrap_keys } };
            return index.stringify(value, opts);
        }
        removeWidget(ctx) {
            const path = ctx.resolve();
            const pathArr = Ractive__default['default'].splitKeypath(path);
            const key = pathArr.pop();
            const keyup = pathArr.pop();
            let link;
            if (this.get('temp.widget') === path)
                this.set('temp.widget', 'report');
            if ((link = this.readLink('widget')) && link.keypath === path)
                this.unlink('widget');
            this.checkLink('expr', ctx.resolve());
            if (ctx.get('^^/type') === 'repeater' && keyup === 'group') {
                if (ctx.get('^^/groupEnds'))
                    ctx.splice('^^/groupEnds', ctx.get('@index'), 1);
                if (ctx.get('^^/group'))
                    ctx.splice('^^/group', ctx.get('@index'), 1);
                if (ctx.get('^^/group.length') === 0)
                    ctx.set({ '^^/group': undefined, '^^/groupEnds': undefined });
            }
            else if (ctx.get('../type') === 'repeater')
                ctx.set('../' + key, undefined);
            else if (path === 'report.header' || path === 'report.footer' || path === 'report.watermark' || path === 'report.overlay')
                this.set(path, undefined);
            else {
                if (Array.isArray(ctx.get('^^/layout')))
                    ctx.splice('^^/layout', ctx.get('@index'), 1);
                const idx = ctx.get('@index');
                if (Array.isArray(ctx.get('../')))
                    ctx.splice('../', idx, 1);
                if (path.startsWith('report.fields') && ctx.get('../headers'))
                    ctx.splice('../headers', idx, 1);
                else if (path.startsWith('report.headers'))
                    ctx.splice('../fields', idx, 1);
            }
        }
        checkLink(type, path) {
            let link;
            if (type === 'import')
                link = this.readLink('data');
            else if (type === 'param')
                link = this.readLink('param');
            else if (type === 'source')
                link = this.readLink('source');
            if (path === undefined) {
                if (type === 'expr')
                    path = this.get('temp.expr.path');
                if (link)
                    path = link.keypath;
            }
            if (type === 'import' && link && path === link.keypath) {
                this.unlink('data');
                this.set('tab', 'definition');
            }
            else if ((type === 'expr' || type === 'field') && (this.get('temp.expr.path') || '').startsWith(path)) {
                this.unlink('expr');
                this.set('temp.expr', {
                    path: undefined,
                    str: '',
                    html: false,
                    tab: 'text',
                    label: false,
                    template: false,
                }, { deep: true });
            }
            else if (type === 'param' && link && path === link.keypath) {
                this.unlink('param');
                this.set('temp.bottom.param', undefined);
                this.set('temp.bottom.tab', 'expr');
            }
            else if (type === 'source' && link && path === link.keypath) {
                this.unlink('source');
                this.set('temp.bottom.source', undefined);
                this.set('temp.bottom.tab', 'expr');
            }
            if (type !== 'field' && path) {
                if (path.startsWith('report.fields'))
                    this.checkLink('field', path.replace('fields', 'headers'));
                if (path.startsWith('report.headers'))
                    this.checkLink('field', path.replace('headers', 'fields'));
            }
        }
        checkLinks() {
            this.checkLink('expr');
            this.checkLink('import');
            this.checkLink('source');
            this.checkLink('param');
            this.checkLink('field');
        }
        saveProjects() {
            if (this.get('showProjects') === false) {
                this.fire('save', {}, this);
            }
            else {
                const projects = this.get('projects') || [];
                for (const p of projects) {
                    if (!p.sources || !Array.isArray(p.sources))
                        continue;
                    for (const s of p.sources) {
                        if ('type' in s && s.type)
                            delete s.data;
                        else if ('input' in s)
                            delete s.data;
                    }
                }
                window.localStorage.setItem('projects', JSON.stringify(this.get('projects') || []));
                const project = this.get('project');
                if (project)
                    this.set('projectSaved', this.stringifyProject(project));
            }
        }
        loadProjects() {
            this.set('projects', JSON.parse(window.localStorage.getItem('projects') || '[]'));
        }
        resetProject() {
            this.set('project', JSON.parse(this.get('projectSaved')));
        }
        makeProject(clean) {
            const project = clean ?
                { name: 'Project', sources: [], report: { type: 'page', classifyStyles: true, orientation: 'landscape', size: index.PageSizes.letter } } :
                { name: 'Project', report: this.get('report') || {}, sources: this.get('sources') || [] };
            this.unlink('report');
            this.unlink('sources');
            this.unlink('project');
            this.checkLinks();
            this.push('projects', project);
            this.link('projects.' + (this.get('projects').length - 1), 'project');
            this.link('project.report', 'report');
            this.link('project.sources', 'sources');
            this.set('projectText', '');
        }
        stringifyProject(project) {
            if (!project)
                project = this.get('project');
            const sources = (this.get('project.sources') || this.get('sources') || []).map(s => {
                if ('type' in s && s.type) {
                    return Object.assign({}, s, { data: undefined });
                }
                else {
                    const res = Object.assign({}, s);
                    if ('input' in res)
                        delete res.data;
                    return res;
                }
            });
            return JSON.stringify(Object.assign({}, project, { sources, report: this.get('project.report') || this.get('report') || {} }));
        }
        stringifyProjects() {
            const projects = this.get('projects') || [];
            return JSON.stringify(projects.map(p => {
                const sources = (p.sources || []).map(s => {
                    if ('type' in s && s.type) {
                        return Object.assign({}, s, { data: undefined });
                    }
                    else {
                        const res = Object.assign({}, s);
                        if ('input' in res)
                            delete res.data;
                        return res;
                    }
                });
                return Object.assign({}, p, { sources });
            }));
        }
        removeProject() {
            if (window.confirm('Do you want to delete this project? This cannot be undone.')) {
                const project = this.get('project');
                const projects = this.get('projects') || [];
                projects.splice(projects.indexOf(project), 1);
                this.unlink('report');
                this.unlink('sources');
                this.unlink('project');
                this.set('project', undefined);
                this.checkLinks();
                this.saveProjects();
            }
        }
        importProject(single, str) {
            const cb = (txt) => {
                const res = JSON.parse(txt);
                if (!single && Array.isArray(res) && res.length > 0 && 'name' in res[0]) {
                    const current = (this.get('projects') || []).slice();
                    for (const r of res) {
                        const idx = current.findIndex(p => p.name === r.name);
                        if (~idx)
                            current.splice(idx, 1, r);
                        else
                            current.push(r);
                    }
                    this.set('projects', current);
                    this.checkLinks();
                }
                else if (single && typeof res === 'object' && !Array.isArray(res) && 'name' in res) {
                    const proj = this.get('project');
                    const projects = this.get('projects');
                    this.set('project', res);
                    this.link('project.report', 'report');
                    this.link('project.sources', 'sources');
                    if (~projects.indexOf(proj))
                        projects.splice(projects.indexOf(proj), 1, res);
                    this.checkLinks();
                }
            };
            this.set('projectText', '');
            if (typeof str === 'string') {
                if (str)
                    cb(str);
            }
            else {
                const input = this.find('#project-file');
                if (single)
                    input.accept = '.raport-proj,.json';
                else
                    input.accept = '.json';
                let load;
                load = () => {
                    input.removeEventListener('change', load);
                    if (input.files.length) {
                        const file = input.files[0];
                        const reader = new FileReader();
                        reader.onload = fr => cb(fr.target.result);
                        reader.readAsText(file);
                    }
                };
                input.addEventListener('change', load);
                input.click();
            }
        }
        cloneProject() {
            this.set('projectText', '');
            const project = this.get('project');
            this.unlink('report');
            this.unlink('sources');
            this.unlink('project');
            this.push('projects', JSON.parse(JSON.stringify(project)));
            this.link('projects.' + (this.get('projects').length - 1), 'project');
            this.link('project.report', 'report');
            this.link('project.sources', 'sources');
        }
        linkProject(path) {
            this.set('projectText', '');
            this.unlink('report');
            this.unlink('sources');
            this.unlink('project');
            this.checkLinks();
            this.link(path, 'project');
            this.link('project.report', 'report');
            this.link('project.sources', 'sources');
            this.set('projectSaved', this.stringifyProject(this.get(path)));
            this.resetUndo();
            // check for sample data refs
            const sources = this.get('sources') || [];
            for (let i = 0; i < sources.length; i++) {
                const s = sources[i];
                if (s && s.name === 'sample' && !s.value)
                    this.set(`sources.${i}.values`, this.get('sample'));
            }
        }
        unlinkProject() {
            this.unlink('report');
            this.unlink('sources');
            this.unlink('project');
            this.checkLinks();
            this.resetUndo();
        }
        resetUndo() {
            this._undo = [];
            this._redo = [];
        }
        undo() {
            if (this.event && ~form_els.indexOf(this.event.event.target.nodeName))
                return false;
            this._undoWatch.silence();
            let s = this._undo.shift();
            if (s && JSON.stringify(this.get('report')) === s) {
                this._redo.unshift(s);
                s = this._undo.shift();
            }
            if (s) {
                this._redo.unshift(s);
                this.set('report', JSON.parse(s));
            }
            this._undoWatch.resume();
        }
        redo() {
            if (this.event && ~form_els.indexOf(this.event.event.target))
                return false;
            this._undoWatch.silence();
            let s = this._redo.shift();
            if (s && JSON.stringify(this.get('report')) === s) {
                this._undo.unshift(s);
                s = this._redo.shift();
            }
            if (s) {
                this._undo.unshift(s);
                this.set('report', JSON.parse(s));
            }
            this._undoWatch.resume();
        }
        async initParams() {
            this.set('params', index.initParameters(this.get('report'), await this.buildSources()));
        }
        _onChange(v) {
            const s = JSON.stringify(v);
            if (s === this._undo[0])
                return;
            this._undo.unshift(JSON.stringify(v));
            if (this.undo.length > 40)
                this._undo = this._undo.slice(0, 40);
            this._redo = [];
        }
        applySettings() {
            var _a, _b;
            const settings = this.get('settings') || {};
            let dark = false;
            if (settings.theme === 'dark')
                dark = true, Ractive__default['default'].styleSet(darkTheme);
            else if (settings.theme === 'light')
                Ractive__default['default'].styleSet(lightTheme);
            else {
                const ml = window.matchMedia('(prefers-color-scheme: dark)');
                dark = ml.matches;
                Ractive__default['default'].styleSet(ml.matches ? darkTheme : lightTheme);
            }
            Ractive__default['default'].styleSet('theme', dark ? 'dark' : 'light');
            let scale = +settings.scale;
            if (isNaN(scale) || scale < 25 || scale > 300) {
                scale = 100;
                setTimeout(() => this.set('settings.scale', scale), 500);
            }
            if ((_b = (_a = document === null || document === void 0 ? void 0 : document.body) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.style)
                document.body.parentElement.style.fontSize = `${scale}%`;
            if (settings.outTheme === 'dark')
                Ractive__default['default'].styleSet('out', darkTheme);
            else if (settings.outTheme === 'light')
                Ractive__default['default'].styleSet('out', lightTheme);
            else
                Ractive__default['default'].styleSet('out', dark ? darkTheme : lightTheme);
            this.fire('applySettings', {}, this);
        }
        copyToClipboard(str) {
            copyToClipboard(str);
        }
        getOperatorDoc(op) {
            return docs.operatorText[op] || `<no documentation available> ${op} may be a designer-only, undesirable, or custom operator`;
        }
        showOperatorDoc(op) {
            const doc = this.getOperatorDoc(op);
            if (doc)
                window.alert(doc);
        }
        getNestLevel(path) {
            return `level${Math.floor(path.split('.').length / 2)}`;
        }
        fillBlankDelimitedHeaders() {
            const sets = {};
            const headers = this.get('report.headers') || [];
            const fields = this.get('report.fields') || [];
            for (let i = 0; i < headers.length; i++) {
                if (!headers[i])
                    sets[`report.headers.${i}`] = fields[i];
            }
            this.set(sets);
        }
        treeString(val) {
            if (val === undefined)
                return 'undefined';
            const fmt = this.get('temp.expr.treefmt');
            return index.evaluate({ val }, fmt === 'string' ? `string(val)` : fmt === 'json' ? 'string(val json:1)' : 'string({ v: val } raport:1)');
        }
        processExprStr(v) {
            if (!v) {
                this.set('temp.expr.error', undefined);
                this.set('temp.expr.ast', undefined);
            }
            const path = this.get('temp.expr.path');
            const html = this.get('temp.expr.html') || this.get('temp.expr.template');
            if (path)
                this.set(path, v);
            if (!this.evalLock) {
                if (typeof v === 'string' && v.trim()) {
                    this.evalLock = true;
                    try {
                        const arr = Array.isArray(v) ? v : [v];
                        for (let i = 0; i < arr.length; i++) {
                            const v = typeof arr[i] === 'string' ? arr[i] : 'text' in arr[i] && typeof arr[i].text === 'string' ? arr[i].text : arr[i];
                            const parsed = (html ? index.parseTemplate : index.parse)(v, { detailed: true, contextLines: 3, consumeAll: true });
                            const msg = ('marked' in parsed ?
                                `${'latest' in parsed ? `${parsed.latest.message || '(no message)'} on line ${parsed.latest.line} at column ${parsed.latest.column}\n\n${parsed.latest.marked}\n\n` : ''}${parsed.message || '(no message)'} on line ${parsed.line} at column ${parsed.column}\n\n${parsed.marked}\n\n` : '') + JSON.stringify(parsed, null, '  ');
                            this.set('temp.expr.parsed', msg);
                            if ('message' in parsed) {
                                this.set('temp.expr.error', parsed);
                                this.set('temp.expr.errormsg', msg);
                                this.set('temp.expr.ast', undefined);
                            }
                            else {
                                this.set('temp.expr.ast', parsed);
                                this.set('temp.expr.errormsg', undefined);
                                this.set('temp.expr.error', undefined);
                            }
                            if (html)
                                this.set('temp.expr.htmlstr', v);
                            else
                                this.set('temp.expr.htmlstr', '');
                            if ('message' in parsed)
                                break;
                        }
                    }
                    catch (_a) { }
                    this.evalLock = false;
                }
                else {
                    this.set('temp.expr.parsed', undefined);
                }
            }
        }
    }
    const designerOpts = {
        template: template$1, css: css$1, cssId: 'raport-report',
        partials: {
            measured: template$1.p.label,
        },
        data() {
            return {
                pageSizes: index.PageSizes,
                report: {
                    type: 'page',
                    parameters: [],
                    sources: [],
                    context: {},
                    classifyStyles: true,
                    widgets: [],
                    size: index.PageSizes.letter,
                    orientation: 'landscape',
                },
                temp: {
                    expr: {
                        tab: 'text',
                        expand: {},
                    },
                    widget: 'report',
                    name: 'report',
                    tree: {},
                },
                exprExpand: {},
                showProjects: true,
                actions: {
                    provideSource: () => this.push('sources', {}),
                    editProvidedSource: (ctx) => this.editProvidedData(ctx),
                },
            };
        },
        components: { Editor, Viewer },
        helpers: {
            escapeKey: Ractive__default['default'].escapeKey,
        },
        computed: {
            operators() {
                const map = docs.operators.reduce((a, c) => (Array.isArray(c.op) ? c.op.forEach(o => a.push([o, c])) : a.push([c.op, c]), a), []);
                let ops = index.evaluate({ map }, `sort(map =>if _.0[0] == '#' then 'zz[_.0]' elif _.0[0] == '|' then ' {_.0}' else _.0)`);
                const search = this.get('opsearch');
                if (search) {
                    const re = new RegExp(search.replace(/([*.\\\/$^()[\]{}+])/g, '\\$1'), 'i');
                    ops = ops.filter(p => re.test(p[0]) || re.test(docs.operatorText[p[0]]));
                }
                return ops;
            },
            inWatermark() {
                return /^report.water/.test(this.get('temp.widget'));
            },
            inOverlay() {
                return /^report.overlay/.test(this.get('temp.widget'));
            },
            pageSize() {
                const type = this.get('report.type');
                if (type === 'flow') {
                    const width = this.get('report.width');
                    if (width)
                        return { width };
                }
                const size = this.get('report.size');
                const orientation = this.get('report.orientation') || 'landscape';
                if (size) {
                    const margin = [((size.margin || [])[0] || 0), ((size.margin || [])[1]) || 0];
                    return {
                        width: orientation === 'landscape' ? size.height : size.width,
                        height: orientation === 'landscape' ? size.width : size.height,
                        margin
                    };
                }
            },
            sourceNames() {
                const sources = this.get('report.sources') || [];
                return sources.map(s => ({ label: s.label || s.name || s.source, value: s.name || s.source }));
            },
            blankDelimitedHeaders() {
                const headers = this.get('report.headers') || [];
                return ~headers.findIndex(h => !h);
            },
        },
        observe: {
            'report.type'(v) {
                if (v === 'delimited') {
                    if (!this.get('report.fields'))
                        this.set('report.fields', []);
                }
                else {
                    if (!this.get('report.widgets'))
                        this.set('report.widgets', []);
                }
            },
            'temp.quote temp.record temp.field'(v, _o, k) {
                if (this.evalLock)
                    return;
                this.evalLock = true;
                try {
                    this.set(k.replace('temp', 'report'), index.parse(`'${v.replace(/'/g, '\\\'')}'`).v);
                }
                catch (_a) { }
                this.evalLock = false;
            },
            'report.quote report.record report.field'(v, _o, k) {
                if (this.evalLock)
                    return;
                this.evalLock = true;
                try {
                    this.set(k.replace('report', 'temp'), JSON.stringify(v).slice(1, -1));
                }
                catch (_a) { }
                this.evalLock = false;
            },
            'temp.expr.template'() {
                this.processExprStr(this.get('temp.expr.str'));
            },
            'temp.expr.str'(v) {
                this.processExprStr(v);
            },
            'temp.expr.ast'(v, o) {
                if (!this.evalLock) {
                    this.evalLock = true;
                    if (o === undefined && v)
                        this.set('temp.expr.error', undefined);
                    try {
                        const str = v === undefined ? '' : index.stringify(v, { template: this.get('temp.expr.html') });
                        this.set('temp.expr.str', str);
                        if ('v' in v && (str[0] === '`' || str[0] === `'`)) {
                            this.set('temp.expr.htmlstr', str.substr(1, -1));
                        }
                        else {
                            this.set('temp.expr.htmlstr', '');
                        }
                    }
                    catch (_a) { }
                    this.evalLock = false;
                }
            },
            'temp.expr.htmlstr'(v) {
                if (!this.evalLock) {
                    this.set('temp.expr.str', v);
                }
            },
            'temp.widget'() {
                if (this.get(this.get('temp.expr.path')) == null) {
                    this.unlink('expr');
                    this.set('temp.expr.path', undefined);
                    this.set('temp.expr.str', '');
                    this.set('temp.expr.ctx', false);
                }
            },
            async 'temp.expr.path report.parameters report.sources sources'() {
                if (sourceTm) {
                    clearTimeout(sourceTm);
                }
                sourceTm = setTimeout(async () => {
                    sourceTm = 0;
                    let v = this.get('temp.expr.path');
                    if (v) {
                        if (v.startsWith('widget.'))
                            v = v.replace('widget', this.get('temp.widget'));
                        this.set('temp.expr.ctx', this.getSchema(await this.buildLocalContext(v)));
                    }
                    else {
                        this.set('temp.expr.ctx', this.getSchema(await this.buildLocalContext()));
                    }
                }, 1000);
            },
            'report.defaultParams'(v) {
                this.set('params', Object.assign({}, v));
            },
            'report.parameters': {
                async handler(v) {
                    if (v)
                        this.initParams();
                },
                init: false,
                strict: true,
            },
            settings(v) {
                if (!this._inited)
                    return;
                this.applySettings();
                window.localStorage.setItem('settings', JSON.stringify(v));
            },
            'project projectSaved': {
                handler: debounce(function () {
                    const project = this.get('project');
                    const saved = this.get('projectSaved');
                    if (!project)
                        this.set('projectChanged', false);
                    else if (this.stringifyProject(project) !== saved)
                        this.set('projectChanged', true);
                    else
                        this.set('projectChanged', false);
                }, 1000),
            },
            'report.parameters report.sources report.context sources'() {
                this._builtroot = undefined;
            },
            'report.context'(v) {
                if (!this._contextText)
                    return;
                const target = JSON.stringify(v || {}, null, 2);
                let str = this._contextText.value;
                try {
                    str = JSON.stringify(JSON.parse(str), null, 2);
                }
                catch (_a) { }
                if (str !== target) {
                    this._contextText.value = target;
                    this.autosize(this._contextText);
                }
            },
            report: {
                handler() {
                    this.set('temp.tree', {});
                },
                strict: true
            },
            'show.props'(v) {
                if (v)
                    setTimeout(() => this.set('show.shrinkleft', true), 200);
                else
                    this.set('show.shrinkleft', false);
            },
            'show.bottom'(v) {
                setTimeout(() => this.resetScrollers());
                if (v)
                    setTimeout(() => this.set('show.shrinkbottom', true), 200);
                else
                    this.set('show.shrinkbottom', false);
            },
            'settings.leftwidth'(v) {
                Ractive__default['default'].styleSet('leftwidth', v);
            },
            'settings.bottomheight'(v) {
                Ractive__default['default'].styleSet('bottomheight', v);
            },
            'settings.scale'() {
                if (this.checkResize)
                    setTimeout(() => this.checkResize());
            },
            'settings.leftwidth windowWidthInRem'(v) {
                const left = this.get('settings.leftwidth') || 28;
                const wnd = this.get('windowWidthInRem');
                const bigEnough = v && left && wnd > 2.5 * (left + 2);
                this.set('show.props', bigEnough);
                this.set('show.proppop', bigEnough);
            },
        },
        on: {
            init() {
                const getSize = () => {
                    if (!this.rendered)
                        return 0;
                    const el = document.createElement('div');
                    el.style.position = 'absolute';
                    el.style.width = '1rem';
                    document.body.appendChild(el);
                    const rem = el.clientWidth;
                    el.remove();
                    const wrapper = this.find('.raport-wrapper');
                    if (wrapper)
                        return wrapper.clientWidth / rem;
                    return 0;
                };
                const resize = () => {
                    this.set('windowWidthInRem', getSize());
                };
                this.checkResize = resize;
                this.resetUndo();
                this.command('styleWithCSS', false, 'true');
                this._undoWatch = this.observe('report', debounce(this._onChange, 2000), { defer: true, init: true });
                const settings = JSON.parse(window.localStorage.getItem('settings') || '{}');
                this.set('settings', settings);
                window.addEventListener('beforeunload', () => {
                    if (this.get('settings.autosave')) {
                        window.localStorage.setItem('autosave', JSON.stringify({
                            report: this.get('report'),
                            show: this.get('show'),
                            tmp: this.get('tmp'),
                            tab: this.get('tab'),
                            'temp.expr.tab': this.get('temp.expr.tab'),
                            'temp.bottom.tab': this.get('temp.bottom.tab'),
                            projectName: this.get('project.name'),
                        }));
                    }
                    else {
                        if (!window.confirm(`Leaving this page will lose any unsaved changes. Are you sure you want to leave?`)) {
                            return false;
                        }
                    }
                });
                window.addEventListener('keydown', ev => {
                    if (ev.ctrlKey) {
                        if (ev.key === 's') {
                            this.saveProjects();
                            ev.stopPropagation();
                            ev.preventDefault();
                        }
                        else if (ev.shiftKey && ev.key === 'Enter') {
                            this.run();
                            this.set('tab', 'result');
                            ev.stopPropagation();
                            ev.preventDefault();
                        }
                        else if (ev.key === 'Enter' && document.activeElement.tagName !== 'TEXTAREA') {
                            this.set({
                                'temp.expr.tab': 'text',
                                'show.bottom': true,
                            });
                            const el = document.getElementById('expr-text');
                            if (el)
                                el.focus();
                            ev.stopPropagation();
                            ev.preventDefault();
                        }
                    }
                    else if (ev.key === 'Escape' && this.get('reparent')) {
                        this.set('reparent', undefined);
                    }
                    else if (ev.key === 'Escape' && this.get('copy')) {
                        this.set('copy', undefined);
                    }
                }, { capture: true });
                window.addEventListener('message', ev => {
                    if (ev.data === 'run') {
                        this.run();
                        this.set('tab', 'result');
                    }
                });
                this.loadProjects();
                if (settings.autosave) {
                    let save = window.localStorage.getItem('autosave');
                    if (save)
                        save = JSON.parse(save);
                    const name = save && save.projectName;
                    if (name) {
                        const projects = this.get('projects');
                        const idx = projects.findIndex((p) => p.name === name);
                        if (~idx)
                            this.linkProject(`projects.${idx}`);
                    }
                    this.set('', save, { deep: true });
                }
                this._inited = true;
                this.applySettings();
            },
            expr(ctx, path) {
                const p = path || ctx.resolve();
                this.link(p, 'expr');
                this.set('temp.expr.path', p);
            },
            teardown() {
                this._undoWatch.cancel();
            },
            render() {
                setTimeout(() => {
                    this._onChange(this.get('report'));
                    this.applySettings();
                    this.checkResize();
                    window.addEventListener('resize', this.checkResize);
                    this.once('unrender', () => {
                        window.removeEventListener('resize', this.checkResize);
                    });
                }, 100);
            }
        },
        decorators: {
            expr(node, header) {
                const ctx = this.getContext(node);
                function change(v) {
                    if (!v)
                        v = '';
                    if (header)
                        v = v.replace(/\.fields\./, '.headers.');
                    if (v === ctx.resolve('.')) {
                        node.classList.add('hover-expr');
                    }
                    else {
                        node.classList.remove('hover-expr');
                    }
                }
                const observer = ctx.observe('~/temp.expr.hover', change);
                const listeners = [
                    ctx.listen('click', () => this.fire('expr', ctx)),
                    ctx.listen('mouseover', () => {
                        let p = ctx.resolve();
                        if (header)
                            p = p.replace(/\.headers\./, '.fields.');
                        ctx.set('~/temp.expr.hover', p);
                    }),
                    ctx.listen('mouseout', () => ctx.set('~/temp.expr.hover', '')),
                ];
                return {
                    teardown() {
                        observer.cancel();
                        listeners.forEach(l => l.cancel());
                        node.classList.remove('active-expr');
                    }
                };
            },
            widget(node, type) {
                const ctx = this.getContext(node);
                node.classList.add(type);
                node.classList.add('widget');
                function select(v) {
                    if (v === ctx.resolve()) {
                        node.classList.add('active-widget');
                    }
                    else {
                        node.classList.remove('active-widget');
                    }
                }
                function hover(v) {
                    if (v === ctx.resolve()) {
                        node.classList.add('hover-widget');
                    }
                    else {
                        node.classList.remove('hover-widget');
                    }
                }
                const selectObserver = ctx.observe('~/temp.widget', select);
                const hoverObserver = ctx.observe('~/temp.hover', hover);
                return {
                    teardown() {
                        selectObserver.cancel();
                        hoverObserver.cancel();
                        node.classList.remove(type);
                        node.classList.remove('widget');
                    }
                };
            },
            scrolled(node) {
                const ctx = this.getContext(node);
                const owner = ctx.ractive;
                if (!owner._scrollers)
                    owner._scrollers = [];
                node.classList.add('scrolled');
                let tm = setTimeout(() => {
                    scroll();
                }, 100);
                node.classList.add('scroll-top', 'scroll-bottom');
                function scroll() {
                    tm = null;
                    if (node.scrollHeight > node.offsetHeight) {
                        if (node.scrollTop > 0)
                            node.classList.remove('scroll-top');
                        else
                            node.classList.add('scroll-top');
                        if (node.scrollTop + node.offsetHeight < node.scrollHeight)
                            node.classList.remove('scroll-bottom');
                        else
                            node.classList.add('scroll-bottom');
                    }
                    else {
                        node.classList.add('scroll-top', 'scroll-bottom');
                    }
                }
                const scrollb = function () {
                    if (tm)
                        return;
                    tm = setTimeout(scroll, 250);
                };
                const listener = ctx.listen('scroll', scrollb);
                owner._scrollers.push(scroll);
                return {
                    invalidate() {
                        scrollb();
                        return '';
                    },
                    teardown() {
                        node.classList.remove('scrolled', 'scroll-top', 'scroll-bottom');
                        listener.cancel();
                        owner._scrollers.splice(owner._scrollers.indexOf(scroll), 1);
                    }
                };
            },
            moveable(node) {
                const ctx = this.getContext(node);
                const idx = ctx.get('@index');
                let x, y, sx, sy, cx, cy, sz;
                const listener = ctx.listen('mousedown', (ev) => {
                    sx = ctx.get(`^^/layout.${idx}.0`) || 0;
                    sy = ctx.get(`^^/layout.${idx}.1`) || 0;
                    cx = cy = 0;
                    x = ev.clientX;
                    y = ev.clientY;
                    const sizer = document.getElementById('sizer');
                    sz = sizer ? sizer.offsetHeight : 12;
                    document.body.addEventListener('mousemove', move);
                    document.body.addEventListener('mouseup', up);
                    document.body.addEventListener('keydown', esc);
                });
                function move(ev) {
                    cx = ev.clientX - x;
                    cy = ev.clientY - y;
                    if (!ev.ctrlKey && !ev.shiftKey) {
                        ctx.set({ [`^^/layout.${idx}.0`]: Math.round(sx + (cx / sz)), [`^^/layout.${idx}.1`]: Math.round(sy + (cy / sz)) });
                    }
                    else {
                        ctx.set({ [`^^/layout.${idx}.0`]: sx + (cx / sz), [`^^/layout.${idx}.1`]: sy + (cy / sz) });
                    }
                }
                function up() {
                    document.body.removeEventListener('mousemove', move);
                    document.body.removeEventListener('mouseup', up);
                    document.body.removeEventListener('keydown', esc);
                }
                function esc(ev) {
                    if (ev.key === 'Escape') {
                        up();
                        ctx.set({ [`^^/layout.${idx}.0`]: sx, [`^^/layout.${idx}.1`]: sy });
                    }
                }
                return {
                    teardown() {
                        listener.cancel();
                    }
                };
            },
            invalidated(node) {
                const ctx = this.getContext(node);
                return {
                    teardown() { },
                    invalidate() {
                        if (ctx.hasListener('invalidate'))
                            ctx.raise('invalidate', {});
                    }
                };
            },
            autosize,
            trackfocus,
            tracked(node, name) {
                this[name] = node;
                return {
                    teardown() {
                        if (this[name] === node)
                            this[name] = undefined;
                    },
                };
            },
        },
        events: {
            keys: function KeyEvent(_node, fire) {
                const options = Object.assign({}, arguments[arguments.length - 1]);
                if (arguments.length > 2) {
                    options.keys = [];
                    for (let i = 2; i < arguments.length; i++) {
                        if (typeof arguments[i] === 'string')
                            options.keys.push(arguments[i]);
                    }
                }
                const mods = ['ctrl', 'shift', 'alt', 'meta'];
                const listener = (ev) => {
                    for (const mod of mods) {
                        if (options[mod] && !ev[`${mod}Key`] || !options[mod] && ev[`${mod}Key`])
                            return;
                    }
                    if (~options.keys.indexOf(ev.key))
                        fire({ event: ev });
                };
                window.addEventListener('keydown', listener, { capture: true, passive: true });
                return {
                    teardown() {
                        window.removeEventListener('keydown', listener, { capture: true });
                    }
                };
            },
        },
    };
    Ractive__default['default'].extendWith(Designer, designerOpts);
    function nameForWidget(type, path) {
        if (path === 'report')
            return 'report ';
        else if (path === 'report.header')
            return 'Page Header ';
        else if (path === 'report.footer')
            return 'Page Footer ';
        else if (path === 'report.watermark')
            return 'Watermark ';
        else if (path === 'report.overlay')
            return 'Overlay ';
        if (type === 'container') {
            const p = Ractive__default['default'].splitKeypath(path);
            const prop = p.pop();
            if (prop === 'header')
                return 'Repeater Header ';
            else if (prop === 'footer')
                return 'Repeater Footer ';
            else if (prop === 'alternate')
                return 'Repeater Alternate ';
            else if (prop === 'row')
                return 'Repeater Row ';
            else if (!isNaN(+prop) && p.pop() === 'group')
                return `Repeater Group ${+prop + 1} `;
        }
        return `${type} `;
    }
    function tryParseData(str, header) {
        if (!str)
            return;
        try {
            return JSON.parse(str);
        }
        catch (_a) {
            if (str.trim()[0] === '<') {
                const data = index.parseXML(str);
                if (data)
                    return data;
            }
            const brace = /[\{\[]/.exec(str);
            if (brace && brace.index >= 0 && brace.index <= 20) {
                const res = index.evaluate(str);
                if (typeof res === 'string') {
                    try {
                        return JSON.parse(res);
                    }
                    catch (_b) {
                        const csv = index.evaluate({ res, header }, `parse(str, { csv:1 detect:1 header:header })`);
                        if (csv.length)
                            return csv;
                        else
                            return str;
                    }
                }
                else if (res)
                    return res;
            }
            const csv = index.evaluate({ str, header }, `parse(str, { csv:1 detect:1 header:header })`);
            if (!csv.length && str.length) {
                const res = index.evaluate(str);
                if (typeof res === 'string') {
                    try {
                        return JSON.parse(res);
                    }
                    catch (_c) {
                        const csv = index.evaluate({ res, header }, `parse(str, { csv:1 detect:1 header:header })`);
                        if (csv.length)
                            return csv;
                        else
                            return str;
                    }
                }
                else if (res)
                    return res;
            }
            else
                return csv;
        }
    }
    function cloneDeep(v) {
        try {
            return JSON.parse(JSON.stringify(v));
        }
        catch (_a) {
            return {};
        }
    }
    const fontKeys = ['family', 'size', 'weight', 'color', 'align', 'line', 'right', 'pre', 'clamp'];
    function stripDefaults(json) {
        if (typeof json !== 'object')
            return json;
        if (Array.isArray(json))
            return json.map(stripDefaults);
        const res = {};
        for (const k in json) {
            const v = json[k];
            if (v === false && k !== 'classifyStyles' && k !== 'headerPerPage')
                continue;
            else if ((k === 'hide' || k === 'br') && !v)
                continue;
            else if (k === 'height' && v === 'auto' && (json.type === 'container' || json.type === 'repeater'))
                continue;
            else if (Array.isArray(v)) {
                const a = [];
                v.forEach(v => a.push(stripDefaults(v)));
                res[k] = a;
            }
            else if (typeof v === 'object') {
                if (k === 'font') {
                    if (Object.values(v).find(v => v != null && v !== '' && v !== false) !== undefined) {
                        const font = {};
                        fontKeys.forEach(f => v[f] != null && v[f] !== '' && v[f] !== false && (font[f] = v[f]));
                        if (typeof font.weight === 'string')
                            font.weight = +font.weight;
                        if (json.type === 'html' && Object.keys(font).length === 1 && font.line === 0)
                            continue;
                        res.font = font;
                    }
                    else
                        continue;
                }
                else if (!Object.keys(v).length)
                    continue;
                else if (Object.keys(v).length === 1 && 'x' in v && !v.x)
                    continue;
                else if (k === 'format' && !v.name)
                    continue;
                else {
                    const r = stripDefaults(v);
                    if (r !== '')
                        res[k] = r;
                }
            }
            else if (v === '')
                continue;
            else
                res[k] = v;
        }
        if (res.type === 'page' || res.type === 'flow' || res.type === 'delimited') {
            if (res.context && !Object.keys(res.context).length)
                delete res.context;
            if (!res.extraContext)
                delete res.extraContext;
            if (res.defaultParams && !Object.keys(res.defaultParams).length)
                delete res.defaultParams;
            if (res.sources && !res.sources.length)
                delete res.sources;
            if (res.parameters && !res.parameters.length)
                delete res.parameters;
            if (!res.orientation || res.orientation === 'landscape')
                delete res.orientation;
            if (!res.name)
                delete res.name;
            if (!res.header || !Object.keys(res.header).length || !Array.isArray(res.header.widgets) || !res.header.widgets.length)
                delete res.header;
            if (!res.footer || !Object.keys(res.footer).length || !Array.isArray(res.footer.widgets) || !res.footer.widgets.length)
                delete res.footer;
            if (!res.width)
                delete res.width;
            if (!res.margin || (Array.isArray(res.margin)) && !res.margin.length)
                delete res.margin;
            if (!res.source)
                delete res.source;
            if (!res.headers || !res.headers.length)
                delete res.headers;
            if (!res.record)
                delete res.record;
            if (!res.field)
                delete res.field;
            if (!res.quote)
                delete res.quote;
        }
        if (res.type === 'delimited') {
            delete res.size;
            delete res.widgets;
        }
        if (res.type === 'repeater') {
            if (!res.header || res.headerPerPage)
                delete res.headerPerPage;
            if (!res.header || !res.group || !res.group.length)
                delete res.groupHeaders;
            if (!res.footer || !res.group || !res.group.length)
                delete res.groupEnds;
        }
        if (res.source) {
            if (!res.filter)
                delete res.filter;
            if (!res.sort)
                delete res.sort;
            if (!res.base)
                delete res.base;
            if (!res.parameters || Object.keys(res.parameters).length === 0)
                delete res.parameters;
        }
        if (res.classifyStyles || res.classifyStyles == null)
            delete res.classifyStyles;
        return res;
    }
    const fmtOpts = { throw: true, consumeAll: true };
    function fmt(str, template, compact, stringifyOpts) {
        if (typeof str !== 'string' && typeof str !== 'object')
            return str;
        const parser = template ? index.parseTemplate : index.parse;
        const opts = Object.assign(fmtOpts, { template });
        const listWrap = compact ? 0 : 40;
        const noIndent = compact;
        const fopts = Object.assign({ listWrap, noIndent }, stringifyOpts, { template });
        if (typeof str === 'string') {
            try {
                return index.stringify(parser(str, opts), fopts);
            }
            catch (_a) {
                return str;
            }
        }
        else if (Array.isArray(str)) {
            return str.map(e => {
                if (typeof e === 'string') {
                    try {
                        return index.stringify(parser(e, opts), fopts);
                    }
                    catch (_a) {
                        return e;
                    }
                }
                else if ('text' in e && typeof e.text === 'string') {
                    try {
                        return Object.assign({}, e, { text: index.stringify(parser(e.text, opts), fopts) });
                    }
                    catch (_b) {
                        return e;
                    }
                }
                else if (index.isValueOrExpr(e)) {
                    return index.stringify(e, fopts);
                }
                else {
                    return e;
                }
            });
        }
        else if ('x' in str && typeof str.x === 'string') {
            try {
                return { x: index.stringify(parser(str.x, opts), fopts) };
            }
            catch (_b) {
                return str;
            }
        }
        else if (index.isValueOrExpr(str)) {
            return index.stringify(str, fopts);
        }
        return str;
    }
    function fmtAll(json, compact, fopts) {
        if (typeof json !== 'object')
            return json;
        if (Array.isArray(json))
            return json.map(j => fmtAll(j, compact, fopts));
        const res = {};
        for (const k in json) {
            const v = json[k];
            if (k === 'text' || k === 'width' || k === 'height' || k === 'hide' || k === 'br')
                res[k] = fmt(v, false, compact, fopts);
            else if (k === 'name' || k === 'html')
                res[k] = fmt(v, true, compact, fopts);
            else
                res[k] = fmtAll(v, compact, fopts);
        }
        return res;
    }
    const plainKeys = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
    function jsonToJS(json, strings) {
        if (typeof json === 'number')
            return `${json}`;
        else if (typeof json === 'boolean')
            return json ? 'true' : 'false';
        else if (json === null)
            return 'null';
        else if (json === undefined)
            return 'null';
        else if (typeof json === 'string')
            return strings === 'json' ? JSON.stringify(json) : `\`${json.replace(/(`|${|\\)/g, '\\$1')}\``;
        else if (Array.isArray(json))
            return `[${json.map(v => jsonToJS(v, strings)).join(',')}]`;
        else if (typeof json === 'object')
            return `{${Object.entries(json).map(([k, v]) => v === undefined ? v : `${plainKeys.test(k) ? k : `'${k}'`}:${jsonToJS(v, strings)}`).filter(v => !!v).join(',')}}`;
    }
    function joinPath(one, two) {
        if (/\/$/.test(one))
            return `${one}${two}`;
        else
            return `${one}.${two}`;
    }
    index.registerOperator({
        type: 'value',
        names: ['debugger'],
        apply(..._args) {
            debugger;
        },
    });
    let clipEl;
    function copyToClipboard(text) {
        if (!clipEl) {
            clipEl = document.createElement('textarea');
            clipEl.id = 'clipEl';
            clipEl.style.position = 'absolute';
            clipEl.style.width = '1em';
            clipEl.style.height = '1em';
            clipEl.tabIndex = -1;
            clipEl.style.left = '-10000px';
            document.body.appendChild(clipEl);
        }
        try {
            clipEl.value = text;
            clipEl.select();
            document.execCommand('copy');
            return Promise.resolve(true);
        }
        catch (_a) {
            return Promise.resolve(false);
        }
    }

    exports.ReportDesigner = Designer;
    exports.debounce = debounce;
    exports.docs = docs$1;
    exports.highlight = highlight;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=raport.design.umd.js.map
