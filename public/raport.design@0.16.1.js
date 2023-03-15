(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ractive'), require('raport/index')) :
    typeof define === 'function' && define.amd ? define(['exports', 'ractive', 'raport/index'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.Raport = global.Raport || {}, global.Raport.Design = {}), global.Ractive, global.Raport));
}(this, (function (exports, Ractive, index) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var Ractive__default = /*#__PURE__*/_interopDefaultLegacy(Ractive);

    const template$1 = {v:4,t:[{t:7,e:"div",m:[{t:13,n:"class",f:"raport-report",g:1},{n:"trackfocus",t:71}],f:[{t:8,r:"left"}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"layout",g:1},{n:["keys"],t:70,a:{r:[],s:"[\"z\",{ctrl:true}]"},f:{r:["@this"],s:"[_0.undo(),true]"}},{n:["keys"],t:70,a:{r:[],s:"[\"Z\",{ctrl:true,shift:true}]"},f:{r:["@this"],s:"[_0.redo(),true]"}},{n:"class-pad-me",t:13,f:[{t:2,r:"~/show.pad"}]}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"design actions",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:"title",f:"Run report",t:13,g:1},{n:"disabled",f:[{t:2,x:{r:["report.type","report.sources.length"],s:"_0===\"delimited\"&&_1!==1"}}],t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.run()&&_0.set(\"tab\",\"result\")]"}}],f:[{t:8,r:"play"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"Design report: modify layout and widgets",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"tab\",\"design\")]"}},{n:"class-active",t:13,f:[{t:2,x:{r:["tab"],s:"_0!==\"result\"&&_0!==\"context\"&&_0!==\"definition\"&&_0!==\"import\"&&_0!==\"project\""}}]}],f:["Designer"]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"View report output",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"tab\",\"result\")]"}},{n:"class-active",t:13,f:[{t:2,x:{r:["tab"],s:"_0===\"result\""}}]}],f:["Output"]}],n:50,r:"result"}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"Set up initial report data",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"tab\",\"context\")]"}},{n:"class-active",t:13,f:[{t:2,x:{r:["tab"],s:"_0===\"context\""}}]}],f:["Context"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"Import/export report definition as plain text",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"tab\",\"definition\")]"}},{n:"class-active",t:13,f:[{t:2,x:{r:["tab"],s:"_0===\"definition\""}}]}],f:["Definition"]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:["Manage data for the ",{t:2,r:"data.name"}," provided source"],t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"tab\",\"import\")]"}},{n:"class-active",t:13,f:[{t:2,x:{r:["tab"],s:"_0===\"import\""}}]}],f:["Import Data"]}],n:50,x:{r:["data","@this"],s:"_0&&_1.readLink(\"data\")"}}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"which",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.checkLink(\"import\")]"}}],f:[{t:8,r:"times"}]}," Close Import"]}],n:50,x:{r:["data","tab"],s:"_0&&_1===\"import\""}}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico text",g:1},{n:["click"],t:70,f:{r:["@this","~/report.name","~/result","~/report.type"],s:"[_0.download((_1||\"report\")+(_3===\"delimited\"?\".csv\":\".html\"),_2,_3===\"delimited\"?\"text/csv\":\"text/html\")]"}},{n:"title",f:"Save output to a file",t:13,g:1}],f:["Save Output"]}],n:50,x:{r:["tab"],s:"_0===\"result\""}}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"right",g:1}],f:[{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"ico error",g:1},{n:"title",f:["There are unsaved changes to this project (",{t:2,r:"~/project.name"},")"],t:13}],f:[{t:8,r:"warning"}]}],n:50,r:"~/projectChanged"}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"Manage projects and designer settings",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"tab\",\"project\")]"}},{n:"class-active",t:13,f:[{t:2,x:{r:["tab"],s:"_0===\"project\""}}]}],f:[{t:2,x:{r:["~/showProjects"],s:"_0?\"Project\":\"Settings\""}}]}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab designer",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["tab"],s:"_0!==\"result\"&&_0!==\"context\"&&_0!==\"definition\"&&_0!==\"import\"&&_0!==\"project\""}}]}],f:[{t:8,r:"design"}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab report-context",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["tab"],s:"_0===\"context\""}}]}],f:[{t:8,r:"context"}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab report-definition",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["tab"],s:"_0===\"definition\""}}]}],f:[{t:8,r:"definition"}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab data-import",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["tab"],s:"_0===\"import\""}}]}],f:[{t:8,r:"data-import"}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"result tab",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["tab"],s:"_0===\"result\""}}]}],f:[{t:7,e:"iframe",m:[{n:"id",f:"result",t:13,g:1},{n:"srcdoc",f:[{t:2,x:{r:["~/report.type","@style.out.fg","@style.fg","@style.out.bg","@style.bg","@this","result"],s:"_0===\"delimited\"?(\"<style>pre { padding: 0.5rem; } code { display: block; color: \"+(_1||_2)+\"; background-color: \"+(_3||_4)+\"; }</style><code><pre>\")+_6+\"</pre></code>\"+_5.frameExtra():_6"}}],t:13}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"project tab",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["tab"],s:"_0===\"project\""}}]}],f:[{t:8,r:"project"}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"bottom-pane",g:1},{n:"class-active",t:13,f:[{t:2,r:"~/show.bottom"}]},{n:"class-max",t:13,f:[{t:2,r:"~/max.bottom"}]}],f:[{t:8,r:"bottom"}]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"position: absolute; left: -1000px; width: 1rem; height: 1rem;",g:1},{n:"id",f:"sizer",t:13,g:1}]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"position: absolute; left: -1000px; width: 5rem; height: 5rem; overflow: auto;",g:1}],f:[{t:7,e:"textarea",m:[{n:"id",f:"text-helper",t:13},{n:"style",f:"padding: 0.5em;",t:13}]}]}]}],e:{"0":function (){return(0);},"1":function (){return(1);},"2":function (){return(2);},"3":function (){return(3);},"4":function (){return(4);},"5":function (){return(5);},"6":function (){return(6);},"7":function (){return(7);},"[\"z\",{ctrl:true}]":function (){return(["z",{ctrl:true}]);},"[_0.undo(),true]":function (_0){return([_0.undo(),true]);},"[\"Z\",{ctrl:true,shift:true}]":function (){return(["Z",{ctrl:true,shift:true}]);},"[_0.redo(),true]":function (_0){return([_0.redo(),true]);},"_0===\"delimited\"&&_1!==1":function (_0,_1){return(_0==="delimited"&&_1!==1);},"[_0.run()&&_0.set(\"tab\",\"result\")]":function (_0){return([_0.run()&&_0.set("tab","result")]);},"[_0.set(\"tab\",\"design\")]":function (_0){return([_0.set("tab","design")]);},"_0!==\"result\"&&_0!==\"context\"&&_0!==\"definition\"&&_0!==\"import\"&&_0!==\"project\"":function (_0){return(_0!=="result"&&_0!=="context"&&_0!=="definition"&&_0!=="import"&&_0!=="project");},"[_0.set(\"tab\",\"result\")]":function (_0){return([_0.set("tab","result")]);},"_0===\"result\"":function (_0){return(_0==="result");},"[_0.set(\"tab\",\"context\")]":function (_0){return([_0.set("tab","context")]);},"_0===\"context\"":function (_0){return(_0==="context");},"[_0.set(\"tab\",\"definition\")]":function (_0){return([_0.set("tab","definition")]);},"_0===\"definition\"":function (_0){return(_0==="definition");},"[_0.set(\"tab\",\"import\")]":function (_0){return([_0.set("tab","import")]);},"_0===\"import\"":function (_0){return(_0==="import");},"_0&&_1.readLink(\"data\")":function (_0,_1){return(_0&&_1.readLink("data"));},"[_0.checkLink(\"import\")]":function (_0){return([_0.checkLink("import")]);},"_0&&_1===\"import\"":function (_0,_1){return(_0&&_1==="import");},"[_0.download((_1||\"report\")+(_3===\"delimited\"?\".csv\":\".html\"),_2,_3===\"delimited\"?\"text/csv\":\"text/html\")]":function (_0,_1,_2,_3){return([_0.download((_1||"report")+(_3==="delimited"?".csv":".html"),_2,_3==="delimited"?"text/csv":"text/html")]);},"[_0.set(\"tab\",\"project\")]":function (_0){return([_0.set("tab","project")]);},"_0===\"project\"":function (_0){return(_0==="project");},"_0?\"Project\":\"Settings\"":function (_0){return(_0?"Project":"Settings");},"_0===\"delimited\"?(\"<style>pre { padding: 0.5rem; } code { display: block; color: \"+(_1||_2)+\"; background-color: \"+(_3||_4)+\"; }</style><code><pre>\")+_6+\"</pre></code>\"+_5.frameExtra():_6":function (_0,_1,_2,_3,_4,_5,_6){return(_0==="delimited"?("<style>pre { padding: 0.5rem; } code { display: block; color: "+(_1||_2)+"; background-color: "+(_3||_4)+"; }</style><code><pre>")+_6+"</pre></code>"+_5.frameExtra():_6);},"undefined":function (){return(undefined);},"[_0.saveProjects()]":function (_0){return([_0.saveProjects()]);},"[_1.download(_0+\".json\",_1.stringifyProject())]":function (_0,_1){return([_1.download(_0+".json",_1.stringifyProject())]);},"[_0.cloneProject()]":function (_0){return([_0.cloneProject()]);},"[_0.importProject(true)]":function (_0){return([_0.importProject(true)]);},"[_0.makeProject(true)]":function (_0){return([_0.makeProject(true)]);},"[_0.removeProject()]":function (_0){return([_0.removeProject()]);},"[_0.resetProject()]":function (_0){return([_0.resetProject()]);},"[_0.set(\"projectText\",_0.stringifyProject())]":function (_0){return([_0.set("projectText",_0.stringifyProject())]);},"[_0.importProject(true,_1)]":function (_0,_1){return([_0.importProject(true,_1)]);},"_0!=null":function (_0){return(_0!=null);},"[_0.makeProject()]":function (_0){return([_0.makeProject()]);},"_0===_1":function (_0,_1){return(_0===_1);},"[_0.linkProject(_1)]":function (_0,_1){return([_0.linkProject(_1)]);},"[_0.download(\"Raport Projects.json\",_0.stringifyProjects())]":function (_0){return([_0.download("Raport Projects.json",_0.stringifyProjects())]);},"[_0.importProject()]":function (_0){return([_0.importProject()]);},"[_0.loadImportFile()]":function (_0){return([_0.loadImportFile()]);},"_0===\"fetch\"":function (_0){return(_0==="fetch");},"[_0.set(\"data.type\",_1?\"fetch\":undefined)]":function (_0,_1){return([_0.set("data.type",_1?"fetch":undefined)]);},"[_1.set(\"data.header\",_0?1:undefined),_1.tryImport(_2)]":function (_0,_1,_2){return([_1.set("data.header",_0?1:undefined),_1.tryImport(_2)]);},"[_0.editExpr(_1+\".url\",{template:true}),false]":function (_0,_1){return([_0.editExpr(_1+".url",{template:true}),false]);},"[(_0).push(\".headers\",[])]":function (_0){return([(_0).push(".headers",[])]);},"[_0.fetchData()]":function (_0){return([_0.fetchData()]);},"[(_0).splice(\"../\",_1,1)]":function (_0,_1){return([(_0).splice("../",_1,1)]);},"[_0.editExpr(_1+\".1\",{template:true}),false]":function (_0,_1){return([_0.editExpr(_1+".1",{template:true}),false]);},"[_0.editExpr(_1+\".body\",{template:true}),false]":function (_0,_1){return([_0.editExpr(_1+".body",{template:true}),false]);},"_0!==\"GET\"":function (_0){return(_0!=="GET");},"[_1.autosize(_0),_1.tryImport(_2)]":function (_0,_1,_2){return([_1.autosize(_0),_1.tryImport(_2)]);},"[\"_importText\"]":function (){return(["_importText"]);},"[_0.loadReportFile()]":function (_0){return([_0.loadReportFile()]);},"[_1.download((_0||\"report\")+\".js\"+(_2?\"\":\"on\"),_1.reportToString(true,_2,_3))]":function (_0,_1,_2,_3){return([_1.download((_0||"report")+".js"+(_2?"":"on"),_1.reportToString(true,_2,_3))]);},"[_0.fmtAll()]":function (_0){return([_0.fmtAll()]);},"[_0.autosize(_1)]":function (_0,_1){return([_0.autosize(_1)]);},"_0.reportToString(_1,_2,_3)":function (_0,_1,_2,_3){return(_0.reportToString(_1,_2,_3));},"[_1.loadReportString(_0),_1.update(\"temp\")]":function (_0,_1){return([_1.loadReportString(_0),_1.update("temp")]);},"[_0.loadContextFile()]":function (_0){return([_0.loadContextFile()]);},"[_0.tryContext(_1)]":function (_0,_1){return([_0.tryContext(_1)]);},"[\"_contextText\"]":function (){return(["_contextText"]);},"[_0.addHeader()]":function (_0){return([_0.addHeader()]);},"!_0":function (_0){return(!_0);},"[_0.set(\"report.headers\",undefined)]":function (_0){return([_0.set("report.headers",undefined)]);},"[_0.push(\"report.headers\",\"\"),_0.push(\"report.fields\",\"\")]":function (_0){return([_0.push("report.headers",""),_0.push("report.fields","")]);},"[_0.editExpr((_1),{template:true})]":function (_0,_1){return([_0.editExpr((_1),{template:true})]);},"[true]":function (){return([true]);},"[_0.removeWidget((_1)),false]":function (_0,_1){return([_0.removeWidget((_1)),false]);},"!!_0":function (_0){return(!!_0);},"[_1.push(\"report.fields\",\"\"),_0&&_1.push(\"report.headers\",\"\")]":function (_0,_1){return([_1.push("report.fields",""),_0&&_1.push("report.headers","")]);},"[_0.editExpr((_1))]":function (_0,_1){return([_0.editExpr((_1))]);},"_0===\"delimited\"":function (_0){return(_0==="delimited");},"_0.paperSize()":function (_0){return(_0.paperSize());},"[_0===_1?_2.selectWidget(\"report\"):true]":function (_0,_1,_2){return([_0===_1?_2.selectWidget("report"):true]);},"[_0.unlink(\"widget\"),_0.unlink(\"expr\"),_0.set(\"temp\",{name:\"report \",widget:\"report\",tree:_1})]":function (_0,_1){return([_0.unlink("widget"),_0.unlink("expr"),_0.set("temp",{name:"report ",widget:"report",tree:_1})]);},"_0===\"report\"||_0===\"report.watermark\"||_0===\"report.overlay\"":function (_0){return(_0==="report"||_0==="report.watermark"||_0==="report.overlay");},"[_0.set(\"temp.hover\",_1?\"report.watermark\":_2?\"report.overlay\":\"report\"),false]":function (_0,_1,_2){return([_0.set("temp.hover",_1?"report.watermark":_2?"report.overlay":"report"),false]);},"[_0.set(\"temp.hover\",\"\"),false]":function (_0){return([_0.set("temp.hover",""),false]);},"[_0.set(\"report.header\",undefined),_0.unlink(\"widget\"),_0.set(\"temp.widget\",\"\")]":function (_0){return([_0.set("report.header",undefined),_0.unlink("widget"),_0.set("temp.widget","")]);},"[_0.set(\"report.header\",{type:\"container\"})]":function (_0){return([_0.set("report.header",{type:"container"})]);},"[_0.set(\"report.footer\",undefined),_0.unlink(\"widget\"),_0.set(\"temp.widget\",\"\")]":function (_0){return([_0.set("report.footer",undefined),_0.unlink("widget"),_0.set("temp.widget","")]);},"[_0.set(\"report.footer\",{type:\"container\"})]":function (_0){return([_0.set("report.footer",{type:"container"})]);},"!_0||!/^report.(water|overlay)/.test(_0)":function (_0){return(!_0||!/^report.(water|overlay)/.test(_0));},"_0===\"page\"":function (_0){return(_0==="page");},"[_0.set(\"report.watermark\",undefined),_0.unlink(\"widget\"),_0.set(\"temp.widget\",\"\")]":function (_0){return([_0.set("report.watermark",undefined),_0.unlink("widget"),_0.set("temp.widget","")]);},"[_0.link(\"report.watermark\",\"widget\"),_0.set(\"temp.widget\",\"report.watermark\"),false]":function (_0){return([_0.link("report.watermark","widget"),_0.set("temp.widget","report.watermark"),false]);},"[_0.set(\"report.watermark\",{type:\"container\"}),_0.link(\"report.watermark\",\"widget\"),_0.set(\"temp.widget\",\"report.watermark\"),false]":function (_0){return([_0.set("report.watermark",{type:"container"}),_0.link("report.watermark","widget"),_0.set("temp.widget","report.watermark"),false]);},"[_0.set(\"report.overlay\",undefined),_0.unlink(\"widget\"),_0.set(\"temp.widget\",\"\")]":function (_0){return([_0.set("report.overlay",undefined),_0.unlink("widget"),_0.set("temp.widget","")]);},"[_0.link(\"report.overlay\",\"widget\"),_0.set(\"temp.widget\",\"report.overlay\"),false]":function (_0){return([_0.link("report.overlay","widget"),_0.set("temp.widget","report.overlay"),false]);},"[_0.set(\"report.overlay\",{type:\"container\"}),_0.link(\"report.overlay\",\"widget\"),_0.set(\"temp.widget\",\"report.overlay\"),false]":function (_0){return([_0.set("report.overlay",{type:"container"}),_0.link("report.overlay","widget"),_0.set("temp.widget","report.overlay"),false]);},"[_0.unlink(\"widget\"),_0.set(\"temp.widget\",\"\")]":function (_0){return([_0.unlink("widget"),_0.set("temp.widget","")]);},"/^report.(water|overlay)/.test(_0)":function (_0){return(/^report.(water|overlay)/.test(_0));},"\"page header\"":function (){return("page header");},"_0===\"page\"&&_1":function (_0,_1){return(_0==="page"&&_1);},"/^report.water/.test(_0)":function (_0){return(/^report.water/.test(_0));},"/^report.overlay/.test(_0)":function (_0){return(/^report.overlay/.test(_0));},"\"page footer\"":function (){return("page footer");},"_0===\"params\"":function (_0){return(_0==="params");},"[_0.set(\"temp.bottom.tab\",\"params\"),_0.set(\"show.bottom\",true)]":function (_0){return([_0.set("temp.bottom.tab","params"),_0.set("show.bottom",true)]);},"!_0||_0===\"expr\"":function (_0){return(!_0||_0==="expr");},"[_0.set(\"temp.bottom.tab\",\"expr\"),_0.set(\"show.bottom\",true)]":function (_0){return([_0.set("temp.bottom.tab","expr"),_0.set("show.bottom",true)]);},"_0===\"param\"":function (_0){return(_0==="param");},"[_0.set(\"temp.bottom.tab\",\"param\"),_0.set(\"show.bottom\",true)]":function (_0){return([_0.set("temp.bottom.tab","param"),_0.set("show.bottom",true)]);},"_0||_1":function (_0,_1){return(_0||_1);},"_0===\"source\"":function (_0){return(_0==="source");},"[_0.set(\"temp.bottom.tab\",\"source\"),_0.set(\"show.bottom\",true)]":function (_0){return([_0.set("temp.bottom.tab","source"),_0.set("show.bottom",true)]);},"[_0.checkLink(\"expr\")]":function (_0){return([_0.checkLink("expr")]);},"_0.replace(/\\./g,\" 〉 \")":function (_0){return(_0.replace(/\./g," 〉 "));},"_0&&(!_1||_1===\"expr\")":function (_0,_1){return(_0&&(!_1||_1==="expr"));},"[_0.checkLink(\"param\")]":function (_0){return([_0.checkLink("param")]);},"+_0.lastKey(_1)+1":function (_0,_1){return(+_0.lastKey(_1)+1);},"_0&&_1===\"param\"":function (_0,_1){return(_0&&_1==="param");},"[_0.checkLink(\"source\")]":function (_0){return([_0.checkLink("source")]);},"_0&&_1===\"source\"":function (_0,_1){return(_0&&_1==="source");},"[_0.toggle(\"max.bottom\")]":function (_0){return([_0.toggle("max.bottom")]);},"[_0.toggle(\"show.bottom\")]":function (_0){return([_0.toggle("show.bottom")]);},"[_0.eval()]":function (_0){return([_0.eval()]);},"_0===\"text\"":function (_0){return(_0==="text");},"[_0.set(\"temp.expr.tab\",\"text\")]":function (_0){return([_0.set("temp.expr.tab","text")]);},"[_0.fmt()]":function (_0){return([_0.fmt()]);},"_0===\"text\"&&!_1":function (_0,_1){return(_0==="text"&&!_1);},"!_0||_0===\"json\"":function (_0){return(!_0||_0==="json");},"[_0.set(\"temp.expr.parsedtype\",\"json\")]":function (_0){return([_0.set("temp.expr.parsedtype","json")]);},"_0&&_0!==\"json\"":function (_0){return(_0&&_0!=="json");},"[_0.copyToClipboard(JSON.stringify(_1))]":function (_0,_1){return([_0.copyToClipboard(JSON.stringify(_1))]);},"_0===\"raport\"":function (_0){return(_0==="raport");},"[_0.set(\"temp.expr.parsedtype\",\"raport\")]":function (_0){return([_0.set("temp.expr.parsedtype","raport")]);},"_0!==\"raport\"":function (_0){return(_0!=="raport");},"_0===\"json\"||!_0":function (_0){return(_0==="json"||!_0);},"_0===\"parsed\"":function (_0){return(_0==="parsed");},"_0?\"\":\"none\"":function (_0){return(_0?"":"none");},"_0===\"html\"":function (_0){return(_0==="html");},"[_0.set(\"temp.expr.tab\",\"html\")]":function (_0){return([_0.set("temp.expr.tab","html")]);},"[_0.set(\"temp.expr.tab\",\"result\")]":function (_0){return([_0.set("temp.expr.tab","result")]);},"[_0.set(\"temp.expr.tab\",\"parsed\")]":function (_0){return([_0.set("temp.expr.tab","parsed")]);},"!_0||_0===\"text\"":function (_0){return(!_0||_0==="text");},"[(_0).set(\".str\",_1.getPartStrings(_2))]":function (_0,_1,_2){return([(_0).set(".str",_1.getPartStrings(_2))]);},"[(_0).push(\".str\",\"\")]":function (_0){return([(_0).push(".str","")]);},"_0===0":function (_0){return(_0===0);},"[_0.moveUp((_1))]":function (_0,_1){return([_0.moveUp((_1))]);},"[_0.moveDown((_1))]":function (_0,_1){return([_0.moveDown((_1))]);},"[(_0).set(\".\",{text:_1})]":function (_0,_1){return([(_0).set(".",{text:_1})]);},"typeof _0===\"string\"":function (_0){return(typeof _0==="string");},"[(_0).set(\".\",_1)]":function (_0,_1){return([(_0).set(".",_1)]);},"_0==null?1:_0":function (_0){return(_0==null?1:_0);},"Array.isArray(_0)":function (_0){return(Array.isArray(_0));},"[(_0).set(\".str\",[_1])]":function (_0,_1){return([(_0).set(".str",[_1])]);},"[_0===\"result\"?_1.set(\"temp.expr.tab\",\"text\"):_1.eval()]":function (_0,_1){return([_0==="result"?_1.set("temp.expr.tab","text"):_1.eval()]);},"[_0.command(\"bold\")]":function (_0){return([_0.command("bold")]);},"[_0.command(\"italic\")]":function (_0){return([_0.command("italic")]);},"[_0.command(\"underline\")]":function (_0){return([_0.command("underline")]);},"[_0.command(\"strikeThrough\")]":function (_0){return([_0.command("strikeThrough")]);},"[_0.setHTMLFontSize()]":function (_0){return([_0.setHTMLFontSize()]);},"!_0||_0===\"plain\"":function (_0){return(!_0||_0==="plain");},"[_0.set(\"temp.expr.resulttype\",\"plain\")]":function (_0){return([_0.set("temp.expr.resulttype","plain")]);},"_0&&_0!==\"plain\"":function (_0){return(_0&&_0!=="plain");},"[_0.copyToClipboard(_1)]":function (_0,_1){return([_0.copyToClipboard(_1)]);},"_0===\"json\"":function (_0){return(_0==="json");},"[_0.set(\"temp.expr.resulttype\",\"json\")]":function (_0){return([_0.set("temp.expr.resulttype","json")]);},"_0!==\"json\"":function (_0){return(_0!=="json");},"[_0.set(\"temp.expr.resulttype\",\"raport\")]":function (_0){return([_0.set("temp.expr.resulttype","raport")]);},"[_0.set(\"temp.expr.resulttype\",\"html\")]":function (_0){return([_0.set("temp.expr.resulttype","html")]);},"_0!==\"html\"":function (_0){return(_0!=="html");},"_0===undefined":function (_0){return(_0===undefined);},"JSON.stringify(_0,null,_1?undefined:\"  \")":function (_0,_1){return(JSON.stringify(_0,null,_1?undefined:"  "));},"_0.unparse(_1)":function (_0,_1){return(_0.unparse(_1));},"JSON.stringify(_0,null,_1?\"\":\"  \")":function (_0,_1){return(JSON.stringify(_0,null,_1?"":"  "));},"_0===\"ast\"||_0===\"text\"||_0===\"html\"?\"\":\"none\"":function (_0){return(_0==="ast"||_0==="text"||_0==="html"?"":"none");},"_0===\"ast\"&&(_1).decorators.scrolled&&(_1).decorators.scrolled.invalidate()||\"\"&&\"\"":function (_0,_1){return(_0==="ast"&&(_1).decorators.scrolled&&(_1).decorators.scrolled.invalidate()||"");},"_0.getOperatorDoc(_1)":function (_0,_1){return(_0.getOperatorDoc(_1));},"[_0?_1.showOperatorDoc(_2):_1.insertOp(_2)]":function (_0,_1,_2){return([_0?_1.showOperatorDoc(_2):_1.insertOp(_2)]);},"_0===\"string\"":function (_0){return(_0==="string");},"[(_0).set(\".init\",\"\")]":function (_0){return([(_0).set(".init","")]);},"[(_0).set(\".init\",undefined)]":function (_0){return([(_0).set(".init",undefined)]);},"[(_0).set(\".options\",Array.isArray(_1)?undefined:[])]":function (_0,_1){return([(_0).set(".options",Array.isArray(_1)?undefined:[])]);},"[(_2).push(\".options\",!_0?_1:{label:_0,value:_1}),(_2).set({\"ctx.label\":\"\",\"ctx.value\":\"\"})]":function (_0,_1,_2){return([(_2).push(".options",!_0?_1:{label:_0,value:_1}),(_2).set({"ctx.label":"","ctx.value":""})]);},"[_0.editExpr(_1+\".base\")]":function (_0,_1){return([_0.editExpr(_1+".base")]);},"[_0.editExpr(_1+\".filter\")]":function (_0,_1){return([_0.editExpr(_1+".filter")]);},"[_0.editExpr(_1+\".sort\")]":function (_0,_1){return([_0.editExpr(_1+".sort")]);},"[(_0).push(\".group\",\"\")]":function (_0){return([(_0).push(".group","")]);},"[(_0).set(\".group\",undefined)]":function (_0){return([(_0).set(".group",undefined)]);},"_0+1":function (_0){return(_0+1);},"[_0.editExpr(\"~/\"+_1)]":function (_0,_1){return([_0.editExpr("~/"+_1)]);},"[(_0).set(\".group\",[\"\"])]":function (_0){return([(_0).set(".group",[""])]);},"[_0.exprToggle(_1)]":function (_0,_1){return([_0.exprToggle(_1)]);},"_1[_0]?\"-\":\"+\"":function (_0,_1){return(_1[_0]?"-":"+");},"[_0.insertRef(_1)]":function (_0,_1){return([_0.insertRef(_1)]);},"!_2||_0||~_1.indexOf(_2)":function (_0,_1,_2){return(!_2||_0||~_1.indexOf(_2));},"[Array.isArray(_0)?(_2).splice(\"../\",_1,1):(_2).set(\".\",undefined)]":function (_0,_1,_2){return([Array.isArray(_0)?(_2).splice("../",_1,1):(_2).set(".",undefined)]);},"[(_0).set(\".source\",{r:\"\"})]":function (_0){return([(_0).set(".source",{r:""})]);},"[(_0).set(\".apply\",{r:\"\"})]":function (_0){return([(_0).set(".apply",{r:""})]);},"_1[_0]&&_1[_0].type===\"aggregate\"":function (_0,_1){return(_1[_0]&&_1[_0].type==="aggregate");},"[_0.retypeASTNode(_1,_2)]":function (_0,_1,_2){return([_0.retypeASTNode(_1,_2)]);},"_1&&\"op\" in _1?\"operator\":_1&&\"v\" in _1?(typeof _0===\"string\"?\"string\":typeof _0===\"number\"?\"number\":\"object\"):_1&&\"r\" in _1?\"reference\":\"undefined\"":function (_0,_1){return(_1&&"op" in _1?"operator":_1&&"v" in _1?(typeof _0==="string"?"string":typeof _0==="number"?"number":"object"):_1&&"r" in _1?"reference":"undefined");},"[_0!==_2&&[_1.link(_2,\"temp.expr.part\"),_1.set(\"temp.expr.partpath\",_2)],false]":function (_0,_1,_2){return([_0!==_2&&[_1.link(_2,"temp.expr.part"),_1.set("temp.expr.partpath",_2)],false]);},"(_0&&(\"op\" in _0?\"op\":\"v\" in _0?\"value\":\"r\" in _0?\"ref\":\"wat\"))||\"wat\"":function (_0){return((_0&&("op" in _0?"op":"v" in _0?"value":"r" in _0?"ref":"wat"))||"wat");},"[(_0).push(\".args\",{v:\"\"})]":function (_0){return([(_0).push(".args",{v:""})]);},"_0&&\"op\" in _0":function (_0){return(_0&&"op" in _0);},"typeof _0===\"number\"":function (_0){return(typeof _0==="number");},"_0&&\"v\" in _0":function (_0){return(_0&&"v" in _0);},"_0&&\"r\" in _0":function (_0){return(_0&&"r" in _0);},"\"+ \"":function (){return("+ ");},"\"=> \"":function (){return("=> ");},"[_0.set(\"report.defaultParams\",_1)]":function (_0,_1){return([_0.set("report.defaultParams",_1)]);},"[_0.initParams()]":function (_0){return([_0.initParams()]);},"_0===\"boolean\"":function (_0){return(_0==="boolean");},"_0===\"code\"":function (_0){return(_0==="code");},"_0===\"number\"":function (_0){return(_0==="number");},"[(_0).set(\".width\",typeof _1===\"number\"||_1===undefined?{percent:_1}:typeof _1===\"object\"&&\"percent\" in _1?{x:\"\"}:typeof _1===\"object\"&&\"x\" in _1?\"grow\":_2)]":function (_0,_1,_2){return([(_0).set(".width",typeof _1==="number"||_1===undefined?{percent:_1}:typeof _1==="object"&&"percent" in _1?{x:""}:typeof _1==="object"&&"x" in _1?"grow":_2)]);},"typeof _0===\"number\"||_0===undefined?\"Change to percent\":typeof _0===\"object\"&&\"percent\" in _0?\"Change to Expression\":typeof _0===\"object\"&&\"x\" in _0?\"Change to Fill/Grow\":\"Change to REM\"":function (_0){return(typeof _0==="number"||_0===undefined?"Change to percent":typeof _0==="object"&&"percent" in _0?"Change to Expression":typeof _0==="object"&&"x" in _0?"Change to Fill/Grow":"Change to REM");},"[_0.editExpr(\".width.x\"),false]":function (_0){return([_0.editExpr(".width.x"),false]);},"typeof _0===\"object\"&&\"x\" in _0":function (_0){return(typeof _0==="object"&&"x" in _0);},"typeof _0===\"number\"||_0===undefined":function (_0){return(typeof _0==="number"||_0===undefined);},"typeof _0===\"object\"&&\"percent\" in _0":function (_0){return(typeof _0==="object"&&"percent" in _0);},"_0===\"grow\"":function (_0){return(_0==="grow");},"typeof _0===\"object\"":function (_0){return(typeof _0==="object");},"_0===\"label\"":function (_0){return(_0==="label");},"[(_0).set(\".height\",typeof _1===\"number\"||_1===undefined?{percent:_1}:typeof _1===\"object\"&&\"percent\" in _1?{x:\"\"}:typeof _1===\"object\"&&\"x\" in _1?\"grow\":_2)]":function (_0,_1,_2){return([(_0).set(".height",typeof _1==="number"||_1===undefined?{percent:_1}:typeof _1==="object"&&"percent" in _1?{x:""}:typeof _1==="object"&&"x" in _1?"grow":_2)]);},"[_0.editExpr(\".height.x\"),false]":function (_0){return([_0.editExpr(".height.x"),false]);},"_0.lastKey(_1)":function (_0,_1){return(_0.lastKey(_1));},"[(_0).set(\"^^/br\",typeof _1===\"object\"?false:{x:\"\"})]":function (_0,_1){return([(_0).set("^^/br",typeof _1==="object"?false:{x:""})]);},"typeof _0===\"object\"?\"Change to Boolean\":\"Change to Expression\"":function (_0){return(typeof _0==="object"?"Change to Boolean":"Change to Expression");},"[_0.editExpr(\"^^/br.x\"),false]":function (_0){return([_0.editExpr("^^/br.x"),false]);},"typeof _0!==\"object\"":function (_0){return(typeof _0!=="object");},"_0.split(_1,2)":function (_0,_1){return(_0.split(_1,2));},"[_0.editExpr(\".hide\")]":function (_0){return([_0.editExpr(".hide")]);},"[_0.editExpr(\".margin.x\"),false]":function (_0){return([_0.editExpr(".margin.x"),false]);},"typeof _0===\"undefined\"":function (_0){return(typeof _0==="undefined");},"[(_0).set(\".margin\",undefined)]":function (_0){return([(_0).set(".margin",undefined)]);},"typeof _0!==\"undefined\"":function (_0){return(typeof _0!=="undefined");},"[(_0).set(\".margin\",1)]":function (_0){return([(_0).set(".margin",1)]);},"typeof _0!==\"number\"":function (_0){return(typeof _0!=="number");},"_0===2":function (_0){return(_0===2);},"[(_0).set(\".margin\",[1,1])]":function (_0){return([(_0).set(".margin",[1,1])]);},"_0!==2":function (_0){return(_0!==2);},"_0===4":function (_0){return(_0===4);},"[(_0).set(\".margin\",[1,1,1,1])]":function (_0){return([(_0).set(".margin",[1,1,1,1])]);},"_0!==4":function (_0){return(_0!==4);},"[(_0).set(\".margin\",{x:\"\"})]":function (_0){return([(_0).set(".margin",{x:""})]);},"!_0||_1===undefined":function (_0,_1){return(!_0||_1===undefined);},"_0!==undefined":function (_0){return(_0!==undefined);},"[_0.editExpr(\".border\")]":function (_0){return([_0.editExpr(".border")]);},"[(_0).set(\".border\",undefined)]":function (_0){return([(_0).set(".border",undefined)]);},"[(_0).set(\".border\",1)]":function (_0){return([(_0).set(".border",1)]);},"_0===1":function (_0){return(_0===1);},"[(_0).set(\".border\",[1])]":function (_0){return([(_0).set(".border",[1])]);},"_0!==1":function (_0){return(_0!==1);},"[(_0).set(\".border\",[1,1])]":function (_0){return([(_0).set(".border",[1,1])]);},"[(_0).set(\".border\",[1,1,1,1])]":function (_0){return([(_0).set(".border",[1,1,1,1])]);},"[(_0).set(\".border\",\"\")]":function (_0){return([(_0).set(".border","")]);},"typeof _0!==\"string\"":function (_0){return(typeof _0!=="string");},"[(_0).set(\".font.align\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".font.align",typeof _1==="object"?undefined:{x:""})]);},"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\"":function (_0){return(typeof _0==="object"?"Change to value":"Change to Expression");},"[_0.editExpr(\".font.align.x\")]":function (_0){return([_0.editExpr(".font.align.x")]);},"_0!==\"image\"":function (_0){return(_0!=="image");},"[(_0).set(\".font.pre\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".font.pre",typeof _1==="object"?undefined:{x:""})]);},"[_0.editExpr(\".font.pre.x\")]":function (_0){return([_0.editExpr(".font.pre.x")]);},"[(_0).set(\".font.pre\",_1?true:undefined)]":function (_0,_1){return([(_0).set(".font.pre",_1?true:undefined)]);},"_0===\"measured\"||_0===\"image\"":function (_0){return(_0==="measured"||_0==="image");},"[(_0).set(\".font.clamp\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".font.clamp",typeof _1==="object"?undefined:{x:""})]);},"[_0.editExpr(\".font.clamp.x\")]":function (_0){return([_0.editExpr(".font.clamp.x")]);},"[(_0).set(\".font.clamp\",_1?true:undefined)]":function (_0,_1){return([(_0).set(".font.clamp",_1?true:undefined)]);},"[(_0).set(\".font.size\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".font.size",typeof _1==="object"?undefined:{x:""})]);},"[_0.editExpr(\".font.size.x\")]":function (_0){return([_0.editExpr(".font.size.x")]);},"[(_0).set(\".font.line\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".font.line",typeof _1==="object"?undefined:{x:""})]);},"[_0.editExpr(\".font.line.x\")]":function (_0){return([_0.editExpr(".font.line.x")]);},"[(_0).set(\".font.family\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".font.family",typeof _1==="object"?undefined:{x:""})]);},"[_0.editExpr(\".font.family.x\")]":function (_0){return([_0.editExpr(".font.family.x")]);},"[(_0).set(\".font.color\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".font.color",typeof _1==="object"?undefined:{x:""})]);},"[_0.editExpr(\".font.color.x\")]":function (_0){return([_0.editExpr(".font.color.x")]);},"[(_0).set(\".font.weight\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".font.weight",typeof _1==="object"?undefined:{x:""})]);},"[_0.editExpr(\".font.weight.x\")]":function (_0){return([_0.editExpr(".font.weight.x")]);},"[(_0).set(\".bg\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".bg",typeof _1==="object"?undefined:{x:""})]);},"[_0.editExpr(\".bg.x\")]":function (_0){return([_0.editExpr(".bg.x")]);},"[(_0).set(\".radius\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".radius",typeof _1==="object"?undefined:{x:""})]);},"[_0.editExpr(\".radius.x\")]":function (_0){return([_0.editExpr(".radius.x")]);},"[_0.editExpr(\".url\")]":function (_0){return([_0.editExpr(".url")]);},"[(_0).set(\".fit\",!_1||typeof _1===\"string\"?{x:\"\"}:undefined)]":function (_0,_1){return([(_0).set(".fit",!_1||typeof _1==="string"?{x:""}:undefined)]);},"_0&&typeof _0!==\"object\"?\"Expression\":\"Value\"":function (_0){return(_0&&typeof _0!=="object"?"Expression":"Value");},"[_0.editExpr(\".fit.x\"),false]":function (_0){return([_0.editExpr(".fit.x"),false]);},"!_0||typeof _0===\"string\"":function (_0){return(!_0||typeof _0==="string");},"[typeof _0===\"string\"?_2.editExpr(_1+\".source\"):_2.editReportSrc((_3),\".source\")]":function (_0,_1,_2,_3){return([typeof _0==="string"?_2.editExpr(_1+".source"):_2.editReportSrc((_3),".source")]);},"[(_0).set(\".source\",\"\")]":function (_0){return([(_0).set(".source","")]);},"[(_0).set(\".source\",{source:\"\"})]":function (_0){return([(_0).set(".source",{source:""})]);},"_0||_1||_2":function (_0,_1,_2){return(_0||_1||_2);},"_0&&_1":function (_0,_1){return(_0&&_1);},"_0.split(_1)":function (_0,_1){return(_0.split(_1));},"[_0.editExpr(\".text\")]":function (_0){return([_0.editExpr(".text")]);},"[(_0).set(\".font.metric\",typeof _1===\"object\"?undefined:{x:\"\"})]":function (_0,_1){return([(_0).set(".font.metric",typeof _1==="object"?undefined:{x:""})]);},"[_0.editExpr(\".font.metric.x\")]":function (_0){return([_0.editExpr(".font.metric.x")]);},"_0-1-_1":function (_0,_1){return(_0-1-_1);},"_0&&_2[_1]":function (_0,_1,_2){return(_0&&_2[_1]);},"Array.isArray(_0)?\"manual\":\"auto\"":function (_0){return(Array.isArray(_0)?"manual":"auto");},"[(_0).set(\".layout\",_1===\"manual\"?_2.fillArray(_3):undefined)]":function (_0,_1,_2,_3){return([(_0).set(".layout",_1==="manual"?_2.fillArray(_3):undefined)]);},"[_0.editExpr(\".context\")]":function (_0){return([_0.editExpr(".context")]);},"[_0.editExpr(\".html\",{html:true})]":function (_0){return([_0.editExpr(".html",{html:true})]);},"[_0.editExpr(\".text\",{label:true})]":function (_0){return([_0.editExpr(".text",{label:true})]);},"[(_0).set(\".text\",_2.getPartStrings(_1)),_2.editExpr(\".text\",{label:true})]":function (_0,_1,_2){return([(_0).set(".text",_2.getPartStrings(_1)),_2.editExpr(".text",{label:true})]);},"[(_0).set(\".id\",undefined)]":function (_0){return([(_0).set(".id",undefined)]);},"[(_0).set(\".id\",\"\")]":function (_0){return([(_0).set(".id","")]);},"_0.inRepeater(_1)":function (_0,_1){return(_0.inRepeater(_1));},"[(_0).set(\".format\",undefined)]":function (_0){return([(_0).set(".format",undefined)]);},"[(_0).set(\".format\",{})]":function (_0){return([(_0).set(".format",{})]);},"[(_0).push(\".format.args\",\"\")]":function (_0){return([(_0).push(".format.args","")]);},"[_0.toggle(\"~/show.props\")]":function (_0){return([_0.toggle("~/show.props")]);},"_0?\"left\":\"right\"":function (_0){return(_0?"left":"right");},"[_0.addWidget(_1)]":function (_0,_1){return([_0.addWidget(_1)]);},"_0!==\"delimited\"&&(_1===\"container\"||_2===\"report\")":function (_0,_1,_2){return(_0!=="delimited"&&(_1==="container"||_2==="report"));},"[_0.set(\"copy\",undefined)]":function (_0){return([_0.set("copy",undefined)]);},"true":function (){return(true);},"[_0.set(\"reparent\",undefined)]":function (_0){return([_0.set("reparent",undefined)]);},"[_0.treeScrollToActive()]":function (_0){return([_0.treeScrollToActive()]);},"_0===\"report\"":function (_0){return(_0==="report");},"[_0?_3.reparent((_2)):_1?_3.paste((_2)):_3.selectWidget(\"report\")]":function (_0,_1,_2,_3){return([_0?_3.reparent((_2)):_1?_3.paste((_2)):_3.selectWidget("report")]);},"[_0.set(\"temp.hover\",\"report\"),false]":function (_0){return([_0.set("temp.hover","report"),false]);},"_0.toUpperCase()":function (_0){return(_0.toUpperCase());},"_0.substr(1)":function (_0){return(_0.substr(1));},"[_0.editExpr(\"report.name\",{template:true}),false]":function (_0){return([_0.editExpr("report.name",{template:true}),false]);},"_0!==\"delimited\"":function (_0){return(_0!=="delimited");},"[_0.push(\"report.parameters\",{})]":function (_0){return([_0.push("report.parameters",{})]);},"[_0.editParam((_1))]":function (_0,_1){return([_0.editParam((_1))]);},"[_0.checkLink(\"param\",_1),(_2).splice(\"../\",_3,1)]":function (_0,_1,_2,_3){return([_0.checkLink("param",_1),(_2).splice("../",_3,1)]);},"[_0.provideSource()]":function (_0){return([_0.provideSource()]);},"_0===false":function (_0){return(_0===false);},"[_0.editProvidedSource((_1))]":function (_0,_1){return([_0.editProvidedSource((_1))]);},"[_0.logData(_1)]":function (_0,_1){return([_0.logData(_1)]);},"\"console\"":function (){return("console");},"[_0.checkLink(\"import\",_1),(_2).splice(\"../\",_3,1)]":function (_0,_1,_2,_3){return([_0.checkLink("import",_1),(_2).splice("../",_3,1)]);},"[_0.push(\"report.sources\",{name:\"\",parameters:{}})]":function (_0){return([_0.push("report.sources",{name:"",parameters:{}})]);},"_0!==\"delimited\"||_1<1":function (_0,_1){return(_0!=="delimited"||_1<1);},"[_0.editReportSrc((_1))]":function (_0,_1){return([_0.editReportSrc((_1))]);},"[_0.checkLink(\"source\",_1),(_2).splice(\"../\",_3,1)]":function (_0,_1,_2,_3){return([_0.checkLink("source",_1),(_2).splice("../",_3,1)]);},"_0+\"-props\"":function (_0){return(_0+"-props");},"[_0.set(\"temp.expr.hover\",_1),false]":function (_0,_1){return([_0.set("temp.expr.hover",_1),false]);},"[_0.set(\"temp.expr.hover\",\"\"),false]":function (_0){return([_0.set("temp.expr.hover",""),false]);},"[_0.moveUp((_1),[\"../\",_2?\"~/report.headers\":undefined],_3,_4),false]":function (_0,_1,_2,_3,_4){return([_0.moveUp((_1),["../",_2?"~/report.headers":undefined],_3,_4),false]);},"[_0.moveDown((_1),[\"../\",_2?\"~/report.headers\":undefined],_3,_4),false]":function (_0,_1,_2,_3,_4){return([_0.moveDown((_1),["../",_2?"~/report.headers":undefined],_3,_4),false]);},"[_0.removeWidget((_1))]":function (_0,_1){return([_0.removeWidget((_1))]);},"[_0&&_2===\"container\"&&_5.indexOf(_0.resolve())===-1?_4.reparent((_3)):_1&&_2===\"container\"?_4.paste((_3)):_4.selectWidget(_5),false]":function (_0,_1,_2,_3,_4,_5){return([_0&&_2==="container"&&_5.indexOf(_0.resolve())===-1?_4.reparent((_3)):_1&&_2==="container"?_4.paste((_3)):_4.selectWidget(_5),false]);},"_0.getNestLevel(_1)":function (_0,_1){return(_0.getNestLevel(_1));},"[_0.set(\"temp.hover\",_1),false]":function (_0,_1){return([_0.set("temp.hover",_1),false]);},"[_0.moveUp((_1),[\"../\",\"^^/groupEnds\"]),false]":function (_0,_1){return([_0.moveUp((_1),["../","^^/groupEnds"]),false]);},"[_0.moveDown((_1),[\"../\",\"^^/groupEnds\"]),false]":function (_0,_1){return([_0.moveDown((_1),["../","^^/groupEnds"]),false]);},"_0===\"repeater\"&&_1":function (_0,_1){return(_0==="repeater"&&_1);},"_0!==\"row\"||_1!==\"repeater\"":function (_0,_1){return(_0!=="row"||_1!=="repeater");},"_0===\"container\"":function (_0){return(_0==="container");},"_0&&_1===_0.resolve()||_2&&_1===_2.resolve()":function (_0,_1,_2){return(_0&&_1===_0.resolve()||_2&&_1===_2.resolve());},"[_0&&_0.resolve()===_5?_4.set(\"reparent\",undefined):_0&&_2===\"container\"&&_5.indexOf(_0.resolve())===-1?_4.reparent((_3)):_1&&_2===\"container\"?_4.paste((_3)):_4.selectWidget(_5),false]":function (_0,_1,_2,_3,_4,_5){return([_0&&_0.resolve()===_5?_4.set("reparent",undefined):_0&&_2==="container"&&_5.indexOf(_0.resolve())===-1?_4.reparent((_3)):_1&&_2==="container"?_4.paste((_3)):_4.selectWidget(_5),false]);},"!_2||_0===\"container\"&&_1.indexOf(_2.resolve())===-1":function (_0,_1,_2){return(!_2||_0==="container"&&_1.indexOf(_2.resolve())===-1);},"[_0.set(\"temp.tree.\"+_1(_2),_3&&_3[_2]===false?true:false),false]":function (_0,_1,_2,_3){return([_0.set("temp.tree."+_1(_2),_3&&_3[_2]===false?true:false),false]);},"_1[_0]!==false":function (_0,_1){return(_1[_0]!==false);},"_0||_1===\"repeater\"":function (_0,_1){return(_0||_1==="repeater");},"[_0.set(\"copy\",(_1)),false]":function (_0,_1){return([_0.set("copy",(_1)),false]);},"[_0.set(\"reparent\",(_1)),false]":function (_0,_1){return([_0.set("reparent",(_1)),false]);},"[_0.moveUp((_1),[\"../\",!_2&&Array.isArray(_3)?\"^^/layout\":undefined],_4,_5),false]":function (_0,_1,_2,_3,_4,_5){return([_0.moveUp((_1),["../",!_2&&Array.isArray(_3)?"^^/layout":undefined],_4,_5),false]);},"[_0.moveDown((_1),[\"../\",!_2&&Array.isArray(_3)?\"^^/layout\":undefined],_4,_5),false]":function (_0,_1,_2,_3,_4,_5){return([_0.moveDown((_1),["../",!_2&&Array.isArray(_3)?"^^/layout":undefined],_4,_5),false]);},"[(_0).set(\".group\",undefined),(_0).set(\".groupEnds\",[true]),_1.unlink(\"widget\"),_1.set(\"temp.widget\",undefined)]":function (_0,_1){return([(_0).set(".group",undefined),(_0).set(".groupEnds",[true]),_1.unlink("widget"),_1.set("temp.widget",undefined)]);},"[(_0).push(\".group\",{type:\"container\"}),(_0).splice(\".groupEnds\",-1,0,true)]":function (_0){return([(_0).push(".group",{type:"container"}),(_0).splice(".groupEnds",-1,0,true)]);},"[(_0).set(\".group\",[{type:\"container\"}]),(_0).set(\".groupEnds\",[true,true])]":function (_0){return([(_0).set(".group",[{type:"container"}]),(_0).set(".groupEnds",[true,true])]);},"[(_0).set(\".header\",undefined),_1.unlink(\"widget\"),_1.set(\"temp.widget\",undefined)]":function (_0,_1){return([(_0).set(".header",undefined),_1.unlink("widget"),_1.set("temp.widget",undefined)]);},"[(_0).set(\".header\",{type:\"container\"})]":function (_0){return([(_0).set(".header",{type:"container"})]);},"[(_0).set(\".footer\",undefined),_1.unlink(\"widget\"),_1.set(\"temp.widget\",undefined)]":function (_0,_1){return([(_0).set(".footer",undefined),_1.unlink("widget"),_1.set("temp.widget",undefined)]);},"[(_0).set(\".footer\",{type:\"container\"})]":function (_0){return([(_0).set(".footer",{type:"container"})]);},"\"Group Header \"+(_0+1)":function (_0){return("Group Header "+(_0+1));},"\"Header\"":function (){return("Header");},"(_0).set(\".row\",{type:\"container\"})&&\"\"":function (_0){return((_0).set(".row",{type:"container"})&&"");},"\"Row\"":function (){return("Row");},"\"Footer\"":function (){return("Footer");},"[(_0).toggle(\"ctx.preview\")]":function (_0){return([(_0).toggle("ctx.preview")]);},"[_0.autosizeHtml((_1))]":function (_0,_1){return([_0.autosizeHtml((_1))]);},"[_0.editExpr((_1).resolve(\".html\"),{html:true})]":function (_0,_1){return([_0.editExpr((_1).resolve(".html"),{html:true})]);},"_0||0.83":function (_0){return(_0||0.83);},"_0===0?\"initial\":(_0||_1||1)+\"rem\"":function (_0,_1){return(_0===0?"initial":(_0||_1||1)+"rem");},"_0<50":function (_0){return(_0<50);},"_0.evalExpr(_1)":function (_0,_1){return(_0.evalExpr(_1));},"!_0?\"contain\":_0===\"stretch\"?\"100% 100%\":\"cover\"":function (_0){return(!_0?"contain":_0==="stretch"?"100% 100%":"cover");},"_0.calcFont(_1)":function (_0,_1){return(_0.calcFont(_1));},"_0||\"container\"":function (_0){return(_0||"container");},"(_0).set(\"ctx.layout\",_1===\"row\"||!_1?\"auto\":\"manual\")&&\"\"":function (_0,_1){return((_0).set("ctx.layout",_1==="row"||!_1?"auto":"manual")&&"");},"[_0===\"auto\"?(_1).set(\".layout\",undefined):(_1).set(\".layout\",[])]":function (_0,_1){return([_0==="auto"?(_1).set(".layout",undefined):(_1).set(".layout",[])]);},"false":function (){return(false);},"[_0]":function (_0){return([_0]);},"_0!==\"page footer\"":function (_0){return(_0!=="page footer");},"_0||0":function (_0){return(_0||0);},"_0===\"container\"?\"min-\":\"\"":function (_0){return(_0==="container"?"min-":"");},"(_0&&_0!==\"auth\")||_1!==\"container\"":function (_0,_1){return((_0&&_0!=="auth")||_1!=="container");},"_0.calcManualLayout(_2[_1],_3,_4)":function (_0,_1,_2,_3,_4){return(_0.calcManualLayout(_2[_1],_3,_4));},"_0===true":function (_0){return(_0===true);},"_0.calcMargin(_1)":function (_0,_1){return(_0.calcMargin(_1));},"_0.calcBorder(_1)":function (_0,_1){return(_0.calcBorder(_1));},"[_0.selectWidget(_1)]":function (_0,_1){return([_0.selectWidget(_1)]);},"[_0.removeWidget((_1),false)]":function (_0,_1){return([_0.removeWidget((_1),false)]);},"_0.calcWidthWithMargin(_1,(_2))":function (_0,_1,_2){return(_0.calcWidthWithMargin(_1,(_2)));},"_0.calcHeightWithMargin(_1)":function (_0,_1){return(_0.calcHeightWithMargin(_1));}},p:{types:[{t:7,e:"option",f:["any"]}," ",{t:7,e:"option",f:["string"]}," ",{t:7,e:"option",f:["number"]}," ",{t:7,e:"option",f:["boolean"]}," ",{t:7,e:"option",f:["date"]}," ",{t:7,e:"option",f:["array"]}," ",{t:7,e:"option",f:["object"]}," ",{t:7,e:"option",f:["string[]"]}," ",{t:7,e:"option",f:["number[]"]}," ",{t:7,e:"option",f:["boolean[]"]}," ",{t:7,e:"option",f:["date[]"]}," ",{t:7,e:"option",f:["object[]"]}],project:[{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 1;",g:1},{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"delimited paper project",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"settings-pane",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"settings-pane-inner",g:1}],f:[{t:7,e:"h3",f:["Settings"]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1}],f:["Theme",{t:7,e:"br"},{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"~/settings.theme"}],t:13}],f:[" ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"undefined"}}],t:13}],f:["Auto"]}," ",{t:7,e:"option",m:[{n:"value",f:"dark",t:13}],f:["Dark"]}," ",{t:7,e:"option",m:[{n:"value",f:"light",t:13}],f:["Light"]}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1},{n:"title",f:"Select a theme for the rendered report output",t:13,g:1}],f:["Output Theme",{t:7,e:"br"},{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"~/settings.outTheme"}],t:13}],f:[" ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"undefined"}}],t:13}],f:["Follow Designer"]}," ",{t:7,e:"option",m:[{n:"value",f:"dark",t:13}],f:["Dark"]}," ",{t:7,e:"option",m:[{n:"value",f:"light",t:13}],f:["Light"]}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"check",g:1},{n:"title",f:"Automatically save an open project when leaving the page?",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:"~/settings.autosave"}],t:13}]}," Auto save on leave?"]}," ",{t:7,e:"br"},{t:7,e:"br"}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1},{n:"title",f:"The base wrap length for the code formatter (default 40)",t:13,g:1}],f:["Format Wrap",{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:"~/settings.format.wrap"}],t:13}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1},{n:"title",f:"The wrap length for the code formatter array literals",t:13,g:1}],f:["Array Wrap",{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:"~/settings.format.wrap_array"}],t:13}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1},{n:"title",f:"The wrap length for the code formatter for object literals",t:13,g:1}],f:["Object Wrap",{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:"~/settings.format.wrap_keys"}],t:13}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1},{n:"title",f:"The wrap length for the code formatter for operator arguments",t:13,g:1}],f:["Argument Wrap",{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:"~/settings.format.wrap_args"}],t:13}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1},{n:"title",f:"The wrap length for the code formatter for schema unions",t:13,g:1}],f:["Union Wrap",{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:"~/settings.format.wrap_union"}],t:13}]}]}]}]}," ",{t:7,e:"input",m:[{n:"type",f:"file",t:13},{n:"style",f:"display: none;",t:13},{n:"id",f:"project-file",t:13},{n:"accept",f:"application/json",t:13}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"project-pane",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"project-pane-left",g:1}],f:[{t:4,f:[{t:7,e:"div",f:[{t:7,e:"label",m:[{t:13,n:"style",f:"width: 20rem;",g:1},{t:13,n:"class",f:"input",g:1}],f:["Project Name",{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"~/project.name"}],t:13}]}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"title",f:"Save all projects to browser storage",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.saveProjects()]"}}],f:["Save Projects"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"title",f:"Export this project to a JSON file",t:13,g:1},{n:["click"],t:70,f:{r:["~/project.name","@this"],s:"[_1.download(_0+\".json\",_1.stringifyProject())]"}}],f:["Export Project"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"title",f:"Create a copy of this project",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.cloneProject()]"}}],f:["Clone Project"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"title",f:"Import this project definition from a JSON file",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.importProject(true)]"}}],f:["Import Project"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"title",f:"Create a new empty project",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.makeProject(true)]"}}],f:["New Project"]}," ",{t:7,e:"br"},{t:7,e:"br"}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"title",f:"Delete this project from browser storage",t:13,g:1},{n:"style-background",f:[{t:2,r:"@style.error"}],t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.removeProject()]"}}],f:["Delete Project"]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"style-background",f:[{t:2,r:"@style.error"}],t:13},{n:"title",f:"Discard changes to this project",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.resetProject()]"}}],f:["Discard Project Changes"]}],n:50,r:"~/projectChanged"}," ",{t:7,e:"br"},{t:7,e:"br"}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"title",f:"Export this project as text to the below text field",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"projectText\",_0.stringifyProject())]"}}],f:["Refresh Text"]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"grow area",g:1}],f:["Project Definition",{t:7,e:"textarea",m:[{t:73,v:"t",f:"false"},{n:["change"],t:70,f:{r:["@this","@node.value"],s:"[_0.importProject(true,_1)]"}}],f:[{t:2,r:"projectText"}]}]}],n:50,x:{r:["~/project"],s:"_0!=null"}},{t:4,f:[{t:7,e:"div",f:[{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"title",f:"Convert the current definition to a project",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.makeProject()]"}}],f:["Make Project"]}]}],n:51,l:1}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"project-pane-right",g:1},{n:"title",f:"Click a project to load it",t:13,g:1}],f:["Projects ",{t:7,e:"div",m:[{t:13,n:"class",f:"project-list",g:1}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"project-item",g:1},{t:4,f:[{n:"class",f:"active-project",t:13},{n:"title",f:["Project ",{t:2,r:".name"}," is already loaded"],t:13}],n:50,x:{r:[".","~/project"],s:"_0===_1"}},{t:4,f:[{n:"title",f:["Load ",{t:2,r:".name"},", discarding any unsaved changes in the current project or definitions"],t:13},{n:["click"],t:70,f:{r:["@this","@keypath"],s:"[_0.linkProject(_1)]"}}],n:51,l:1}],f:[{t:2,r:".name"}]}],n:52,r:"~/projects"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.download(\"Raport Projects.json\",_0.stringifyProjects())]"}},{n:"title",f:"Export all projects to a JSON file",t:13,g:1}],f:["Export All Projects"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"style-background",f:[{t:2,r:"@style.error"}],t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.importProject()]"}},{n:"title",f:"Import multiple projects from a JSON file. Existing projects with the same name as an import will be overwritten.",t:13,g:1}],f:["Import Projects"]}]}]}],n:50,r:"~/showProjects"}]}]}]}],"data-import":[{t:7,e:"div",m:[{t:13,n:"class",f:"delimited import paper",g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"file",t:13},{n:"style",f:"display: none;",t:13},{n:"id",f:"import-file",t:13},{n:"accept",f:"*/*",t:13}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"definition",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"actions",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico text spacer",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.loadImportFile()]"}},{n:"title",f:"Import data from a file",t:13,g:1}],f:["Load"]}," ",{t:7,e:"label",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"style",f:"vertical-align: middle;",t:13},{n:"checked",f:[{t:2,x:{r:["data.type"],s:"_0===\"fetch\""}}],t:13},{t:73,v:"t",f:"false"},{n:["change"],t:70,f:{r:["@this","@node.checked"],s:"[_0.set(\"data.type\",_1?\"fetch\":undefined)]"}}]}," Fetch request?"]}," ",{t:7,e:"label",m:[{t:13,n:"style",f:"margin-left: 1em;",g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"style",f:"vertical-align: middle;",t:13},{n:"checked",f:[{t:2,r:"data.header"}],t:13},{t:73,v:"t",f:"false"},{n:["change"],t:70,f:{r:["@node.checked","@this","@this._importText.value"],s:"[_1.set(\"data.header\",_0?1:undefined),_1.tryImport(_2)]"}}]}," Delimited header?"]}]}," ",{t:4,f:[{t:7,e:"div",f:[{t:7,e:"label",f:[{t:7,e:"input",m:[{n:"type",f:"radio",t:13},{n:"style",f:"vertical-align: middle;",t:13},{n:"name",f:[{t:2,r:"data.eval"}],t:13},{n:"value",f:[{t:2,x:{r:[],s:"undefined"}}],t:13}]}," JSON"]}," ",{t:7,e:"label",f:[{t:7,e:"input",m:[{n:"type",f:"radio",t:13},{n:"style",f:"vertical-align: middle;",t:13},{n:"name",f:[{t:2,r:"data.eval"}],t:13},{n:"value",f:"txt",t:13}]}," Plain text"]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"fetch scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:4,f:[{t:7,e:"label",m:[{t:13,n:"style",f:"width: 26rem;",g:1},{t:13,n:"class",f:"input",g:1}],f:["URL ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@this","@keypath"],s:"[_0.editExpr(_1+\".url\",{template:true}),false]"}}],f:[{t:8,r:"pencil"}]},{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".url"}],t:13}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1}],f:["Method",{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".method"}],t:13}],f:[" ",{t:7,e:"option",f:["GET"]}," ",{t:7,e:"option",f:["POST"]}," ",{t:7,e:"option",f:["PUT"]}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"check",g:1},{n:"title",f:"Check if this source should be fetched before each run or leave unchecked if cached data can be used",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:".fetch"}],t:13}]}," Fetch on each run?"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).push(\".headers\",[])]"}}],f:["Add Header"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.fetchData()]"}}],f:["Fetch Now"]}," ",{t:4,f:[{t:7,e:"h3",f:["Headers"]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"fetch-header",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Remove header",t:13,g:1},{n:["click"],t:70,f:{r:["@context","@index"],s:"[(_0).splice(\"../\",_1,1)]"}}],f:[{t:8,r:"times"}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1}],f:["Header",{t:7,e:"input",m:[{n:"value",f:[{t:2,rx:{r:".",m:[{r:[],s:"0"}]}}],t:13}]}]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"input",g:1}],f:["Value ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@this","@keypath"],s:"[_0.editExpr(_1+\".1\",{template:true}),false]"}}],f:[{t:8,r:"pencil"}]},{t:7,e:"input",m:[{n:"value",f:[{t:2,rx:{r:".",m:[{r:[],s:"1"}]}}],t:13}]}]}]}],n:52,r:".headers"}],n:50,r:".headers"}," ",{t:4,f:[{t:7,e:"label",m:[{t:13,n:"class",f:"area",g:1}],f:["Body ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@this","@keypath"],s:"[_0.editExpr(_1+\".body\",{template:true}),false]"}}],f:[{t:8,r:"pencil"}]},{t:7,e:"textarea",f:[{t:2,r:".body"}]}]}],n:50,x:{r:[".method"],s:"_0!==\"GET\""}}],n:54,r:"data"}]}]}],n:50,x:{r:["data.type"],s:"_0===\"fetch\""}}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"json",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"textarea",m:[{n:"invalidated",t:71},{n:["change","input","invalidate"],t:70,f:{r:["@node","@this","@node.value"],s:"[_1.autosize(_0),_1.tryImport(_2)]"}},{n:"tracked",t:71,f:{r:[],s:"[\"_importText\"]"}}]}]}]}]}]}]}],definition:[{t:7,e:"div",m:[{t:13,n:"class",f:"delimited paper",g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"file",t:13},{n:"style",f:"display: none;",t:13},{n:"id",f:"definition-file",t:13},{n:"accept",f:"application/json",t:13}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"definition",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"style",f:"flex-wrap: wrap;",g:1},{t:13,n:"class",f:"actions",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico text",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.loadReportFile()]"}},{n:"title",f:"Load report definition from a file",t:13,g:1}],f:["Load"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico text spacer",g:1},{n:["click"],t:70,f:{r:["~/report.name","@this","~/tmp.js","~/tmp.strings"],s:"[_1.download((_0||\"report\")+\".js\"+(_2?\"\":\"on\"),_1.reportToString(true,_2,_3))]"}},{n:"title",f:"Save report definition to a file",t:13,g:1}],f:["Save"]}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"spacer",g:1},{n:"title",f:"Render the report definition in a compact format",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:"~/tmp.compact"}],t:13},{n:"style",f:"vertical-align: middle;",t:13}]}," Compact?"]}," ",{t:4,f:[{t:7,e:"label",m:[{t:13,n:"class",f:"spacer",g:1},{n:"title",f:"Render the report definition as JS rather than JSON",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:"~/tmp.js"}],t:13},{n:"style",f:"vertical-align: middle;",t:13}]}," JS?"]}],n:50,r:"~/tmp.compact"}," ",{t:4,f:[{t:7,e:"label",m:[{t:13,n:"class",f:"spacer",g:1},{n:"title",f:"Render report definition strings as JSON strings or template literals",t:13,g:1}],f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"~/tmp.strings"}],t:13}],f:[{t:7,e:"option",f:["json"]},{t:7,e:"option",f:["template"]}]}]}],n:50,r:"~/tmp.js"}," ",{t:7,e:"label",m:[{t:13,n:"class",f:"spacer",g:1},{n:"title",f:"Switch the formatter into compact mode",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:"~/tmp.nowrap"}],t:13}]}," Compact format?"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico text",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.fmtAll()]"}},{n:"title",f:"Reformat all expressions",t:13,g:1}],f:["Format All"]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"json",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"textarea",m:[{n:"invalidated",t:71},{n:["change","input","invalidate"],t:70,f:{r:["@this","@node"],s:"[_0.autosize(_1)]"}},{t:73,v:"t",f:"false"},{n:"value",f:[{t:2,x:{r:["@this","~/tmp.compact","~/tmp.js","~/tmp.strings"],s:"_0.reportToString(_1,_2,_3)"}}],t:13},{n:["change"],t:70,f:{r:["@node.value","@this"],s:"[_1.loadReportString(_0),_1.update(\"temp\")]"}}]}]}]}]}]}]}],context:[{t:7,e:"div",m:[{t:13,n:"class",f:"delimited paper",g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"file",t:13},{n:"style",f:"display: none;",t:13},{n:"id",f:"context-file",t:13},{n:"accept",f:"application/json",t:13}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"definition",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"actions",g:1}],f:[{t:7,e:"span",m:[{n:"title",f:"The root context to load for the report, which is available before sources are loaded. This must be JSON.",t:13,g:1}],f:["Base Context"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico text spacer",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.loadContextFile()]"}},{n:"title",f:"Import context from a file",t:13,g:1}],f:["Load"]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"json",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"textarea",m:[{n:"invalidated",t:71},{n:["input","invalidate"],t:70,f:{r:["@this","@node"],s:"[_0.autosize(_1)]"}},{n:["change"],t:70,f:{r:["@this","@node.value"],s:"[_0.tryContext(_1)]"}},{n:"tracked",t:71,f:{r:[],s:"[\"_contextText\"]"}}]}]}]}]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"margin-top: 2rem;",g:1},{n:"title",f:"An expreession that is evaluated in the root context before the report is run. This is a good place to run set operators to set up helper applications. Sources are loaded before this is evaluated.",t:13,g:1}],f:["Extra Context"]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"extra-context",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:"~/report.extraContext"}],t:13}]}]}]}]}]}]}],design:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 1;",g:1},{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 3rem; min-width: min-content;",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"delimited paper",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"widget active-widget",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"bar",g:1}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"name",g:1}],f:["Report"]}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.addHeader()]"}}],f:["Add Header"]}],n:50,x:{r:["report.headers"],s:"!_0"}},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"report.headers\",undefined)]"}}],f:["Remove Header"]}],n:51,l:1}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"children",g:1}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"widget hover-widget",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"bar",g:1}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"name",g:1}],f:["Header"]}," ",{t:7,e:"button",m:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.push(\"report.headers\",\"\"),_0.push(\"report.fields\",\"\")]"}}],f:["Add Field"]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"children fields",g:1}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"field",g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.editExpr((_1),{template:true})]"}},{n:"class-active-expr",t:13,f:[{t:2,x:{r:["~/temp.expr.path","@keypath"],s:"_0===_1"}}]},{n:"expr",t:71,f:{r:[],s:"[true]"}}],f:[{t:7,e:"span",f:[{t:2,r:"."}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Remove this field",t:13,g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.removeWidget((_1)),false]"}}],f:[{t:8,r:"times"}]}]}],n:52,r:"report.headers"}]}]}],n:50,x:{r:["~/report.headers"],s:"!!_0"}}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"widget hover-widget",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"bar",g:1}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"name",g:1}],f:["Row"]}," ",{t:7,e:"button",m:[{n:["click"],t:70,f:{r:["~/report.headers","@this"],s:"[_1.push(\"report.fields\",\"\"),_0&&_1.push(\"report.headers\",\"\")]"}}],f:["Add Field"]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"children fields",g:1}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"field",g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.editExpr((_1))]"}},{n:"class-active-expr",t:13,f:[{t:2,x:{r:["~/temp.expr.path","@keypath"],s:"_0===_1"}}]},{n:"expr",t:71}],f:[{t:7,e:"span",f:[{t:2,r:"."}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Remove this field",t:13,g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.removeWidget((_1)),false]"}}],f:[{t:8,r:"times"}]}]}],n:52,r:"report.fields"}]}]}]}]}]}]}]}]}],n:50,x:{r:["report.type"],s:"_0===\"delimited\""}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 1;",g:1},{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 3rem; min-width: min-content;",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"paper",g:1},{n:"style",f:[{t:2,x:{r:["@this"],s:"_0.paperSize()"}}],t:13},{n:["click"],t:70,f:{r:["@event.target","@node","@this"],s:"[_0===_1?_2.selectWidget(\"report\"):true]"}}],f:[{t:7,e:"div",m:[{t:13,n:"style",f:"cursor: pointer;",g:1},{t:13,n:"class",f:"bar report-paper",g:1},{n:["click"],t:70,f:{r:["@this","~/temp.tree"],s:"[_0.unlink(\"widget\"),_0.unlink(\"expr\"),_0.set(\"temp\",{name:\"report \",widget:\"report\",tree:_1})]"}},{n:"class-active",t:13,f:[{t:2,x:{r:["temp.widget"],s:"_0===\"report\"||_0===\"report.watermark\"||_0===\"report.overlay\""}}]},{n:"class-hover",t:13,f:[{t:2,x:{r:["temp.hover"],s:"_0===\"report\"||_0===\"report.watermark\"||_0===\"report.overlay\""}}]},{n:["mouseover"],t:70,f:{r:["@this","~/inWatermark","~/inOverlay"],s:"[_0.set(\"temp.hover\",_1?\"report.watermark\":_2?\"report.overlay\":\"report\"),false]"}},{n:["mouseout"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.hover\",\"\"),false]"}}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"name",g:1}],f:[{t:4,f:["Watermark"],n:50,r:"~/inWatermark"},{t:4,f:["Overlay "],n:50,r:"~/inOverlay",l:1},{t:4,f:["Report"],n:51,l:1}]}," ",{t:4,f:[{t:4,f:[{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"report.header\",undefined),_0.unlink(\"widget\"),_0.set(\"temp.widget\",\"\")]"}},{n:"title",f:"The page header takes a fixed amount of space at the top of every page",t:13,g:1}],f:["Remove page header"]}],n:50,r:"report.header"},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"report.header\",{type:\"container\"})]"}},{n:"title",f:"The page header takes a fixed amount of space at the top of every page",t:13,g:1}],f:["Add page header"]}],n:51,l:1}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"report.footer\",undefined),_0.unlink(\"widget\"),_0.set(\"temp.widget\",\"\")]"}},{n:"title",f:"The page footer takes a fixed amount of space at the bottom of every page",t:13,g:1}],f:["Remove page footer"]}],n:50,r:"report.footer"},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"report.footer\",{type:\"container\"})]"}},{n:"title",f:"The page footer takes a fixed amount of space at the bottom of every page",t:13,g:1}],f:["Add page footer"]}],n:51,l:1}],n:50,x:{r:["~/temp.widget"],s:"!_0||!/^report.(water|overlay)/.test(_0)"}}],n:50,x:{r:["report.type"],s:"_0===\"page\""}}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"report.watermark\",undefined),_0.unlink(\"widget\"),_0.set(\"temp.widget\",\"\")]"}},{n:"title",f:"The watermark content is layered beneath the contents of each page",t:13,g:1}],f:["Remove watermark"]}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.link(\"report.watermark\",\"widget\"),_0.set(\"temp.widget\",\"report.watermark\"),false]"}},{n:"title",f:"Switch the designer to the watermark view",t:13,g:1}],f:["Edit watermark"]}],n:51,r:"~/inWatermark"}],n:50,r:"report.watermark"},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"report.watermark\",{type:\"container\"}),_0.link(\"report.watermark\",\"widget\"),_0.set(\"temp.widget\",\"report.watermark\"),false]"}},{n:"title",f:"The watermark content is layered beneath the contents of each page",t:13,g:1}],f:["Add watermark"]}],n:51,l:1}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"report.overlay\",undefined),_0.unlink(\"widget\"),_0.set(\"temp.widget\",\"\")]"}},{n:"title",f:"The overlay content is layered above the conents of each page",t:13,g:1}],f:["Remove overlay"]}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.link(\"report.overlay\",\"widget\"),_0.set(\"temp.widget\",\"report.overlay\"),false]"}},{n:"title",f:"Switch the designer to the overlay view",t:13,g:1}],f:["Edit overlay"]}],n:51,r:"~/inOverlay"}],n:50,r:"report.overlay"},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"report.overlay\",{type:\"container\"}),_0.link(\"report.overlay\",\"widget\"),_0.set(\"temp.widget\",\"report.overlay\"),false]"}},{n:"title",f:"The overlay content is layered above the conents of each page",t:13,g:1}],f:["Add overlay"]}],n:51,l:1}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.unlink(\"widget\"),_0.set(\"temp.widget\",\"\")]"}}],f:["Edit report"]}],n:50,x:{r:["~/temp.widget"],s:"/^report.(water|overlay)/.test(_0)"}}]}," ",{t:4,f:[{t:8,r:"widget",c:{r:"~/report.header"},z:[{n:"label",x:{x:{r:[],s:"\"page header\""}}}]}],n:50,x:{r:["~/report.type","~/report.header"],s:"_0===\"page\"&&_1"}}," ",{t:4,f:[{t:4,f:[{t:8,r:"widget"}],n:52,r:"~/report.watermark.widgets"}],n:50,x:{r:["~/temp.widget"],s:"/^report.water/.test(_0)"}},{t:4,f:[{t:4,f:[{t:8,r:"widget"}],n:52,r:"~/report.overlay.widgets"}," "],n:50,x:{r:["~/temp.widget"],s:"/^report.overlay/.test(_0)"},l:1},{t:4,f:[" ",{t:4,f:[{t:8,r:"widget"}],n:52,r:"~/report.widgets"}],n:51,l:1}," ",{t:4,f:[{t:8,r:"widget",c:{r:"~/report.footer"},z:[{n:"label",x:{x:{r:[],s:"\"page footer\""}}}]}],n:50,x:{r:["~/report.type","~/report.footer"],s:"_0===\"page\"&&_1"}}]}]}]}]}],n:51,l:1}],bottom:[{t:7,e:"div",m:[{t:13,n:"class",f:"top actions",g:1}],f:[{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"Set values for report parameters",t:13,g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.bottom.tab"],s:"_0===\"params\""}}]},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.bottom.tab\",\"params\"),_0.set(\"show.bottom\",true)]"}}],f:["Parameters"]}],n:50,r:"~/report.parameters.length"}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"Evaluate expressions",t:13,g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.bottom.tab"],s:"!_0||_0===\"expr\""}}]},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.bottom.tab\",\"expr\"),_0.set(\"show.bottom\",true)]"}}],f:[{t:4,f:["Expression"],n:50,r:"~/temp.expr.path"},{t:4,f:["Evaluate"],n:51,l:1}]}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:["Modify report parameter ",{t:2,r:"~/param.name"}],t:13},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.bottom.tab"],s:"_0===\"param\""}}]},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.bottom.tab\",\"param\"),_0.set(\"show.bottom\",true)]"}}],f:["Parameter"]}],n:50,r:"~/temp.bottom.param"}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:["Modify data source ",{t:2,x:{r:["~/source.name","~/source.source"],s:"_0||_1"}}],t:13},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.bottom.tab"],s:"_0===\"source\""}}]},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.bottom.tab\",\"source\"),_0.set(\"show.bottom\",true)]"}}],f:["Source"]}],n:50,r:"~/temp.bottom.source"}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"which",g:1}],f:[{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:["Close expression for ",{t:2,r:"~/temp.expr.path"}],t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.checkLink(\"expr\")]"}}],f:[{t:8,r:"times"}]}," ",{t:2,x:{r:["~/temp.expr.path"],s:"_0.replace(/\\./g,\" 〉 \")"}}],n:50,x:{r:["~/temp.expr.path","~/temp.bottom.tab"],s:"_0&&(!_1||_1===\"expr\")"}}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:["Close parameter editor for ",{t:2,r:"~/param.name"}],t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.checkLink(\"param\")]"}}],f:[{t:8,r:"times"}]}," Parameter ",{t:2,x:{r:["@this","~/temp.bottom.param"],s:"+_0.lastKey(_1)+1"}}],n:50,x:{r:["~/temp.bottom.param","~/temp.bottom.tab"],s:"_0&&_1===\"param\""}}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:["Close source editor for ",{t:2,r:"~/temp.bottom.source"}],t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.checkLink(\"source\")]"}}],f:[{t:8,r:"times"}]}," Source ",{t:2,x:{r:["@this","~/temp.bottom.source"],s:"+_0.lastKey(_1)+1"}}],n:50,x:{r:["~/temp.bottom.source","~/temp.bottom.tab"],s:"_0&&_1===\"source\""}}]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"style",f:"height: 2.5rem;",g:1},{t:13,n:"class",f:"ico",g:1},{n:"title",f:[{t:4,f:["Shrink"],n:50,r:"~/max.bottom"},{t:4,f:["Embiggen"],n:51,l:1}," the bottom pane"],t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.toggle(\"max.bottom\")]"}},{n:"class",f:[{t:4,f:["down"],n:50,r:"~/max.bottom"},{t:4,f:["up"],n:51,l:1},"-arrow"],t:13}],f:[{t:8,r:"arrow"}]}],n:50,r:"~/show.bottom"}," ",{t:7,e:"button",m:[{t:13,n:"style",f:"height: 2.5rem;",g:1},{t:13,n:"class",f:"ico",g:1},{n:"title",f:[{t:4,f:["Hide"],n:50,r:"~/show.bottom"},{t:4,f:["Show"],n:51,l:1}," the bottom pane"],t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.toggle(\"show.bottom\")]"}},{n:"class",f:[{t:4,f:["down"],n:50,r:"~/show.bottom"},{t:4,f:["up"],n:51,l:1},"-arrow"],t:13}],f:[{t:8,r:"arrow"}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"bottom",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"tab",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["~/temp.bottom.tab"],s:"!_0||_0===\"expr\""}}]}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"editor",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"actions",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:"title",f:"Evaluate the current expression",t:13,g:1},{n:"disabled",f:[{t:2,x:{r:["~/temp.expr.str"],s:"!_0"}}],t:13},{n:["click"],t:70,f:{r:["@this"],s:"[_0.eval()]"}},{n:"class-error",t:13,f:[{t:2,r:"~/temp.expr.error"}]}],f:[{t:8,r:"play"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"Modify the current expression",t:13,g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.expr.tab"],s:"_0===\"text\""}}]},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.tab\",\"text\")]"}}],f:[{t:4,f:["Template"],n:50,r:"~/temp.expr.template"},{t:4,f:["Text"],n:51,l:1}]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico text",g:1},{n:"title",f:"Format the current expression",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.fmt()]"}}],f:["Format"]}],n:50,x:{r:["~/temp.expr.tab","~/temp.expr.template"],s:"_0===\"text\"&&!_1"}}," ",{t:4,f:[{t:7,e:"label",m:[{t:13,n:"style",f:"margin-left: 1em;",g:1},{n:"title",f:"Enable to treat the current expression as a template",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:"~/temp.expr.template"}],t:13}]}," Template?"]}],n:50,x:{r:["~/temp.expr.tab","~/temp.expr.path"],s:"_0===\"text\"&&!_1"}}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"editor-buttons",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"toggles",g:1}],f:[{t:19,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["t"],s:"!_0||_0===\"json\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.parsedtype\",\"json\")]"}}],n:50,x:{r:["t"],s:"_0&&_0!==\"json\""}},{n:"title",f:"Show the AST as JSON. Double click to copy the JSON to the clipboard.",t:13,g:1},{n:["dblclick"],t:70,f:{r:["@this","~/temp.expr.ast"],s:"[_0.copyToClipboard(JSON.stringify(_1))]"}}],f:["JSON"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["t"],s:"_0===\"raport\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.parsedtype\",\"raport\")]"}}],n:50,x:{r:["t"],s:"_0!==\"raport\""}},{n:"title",f:"Show the AST as a Raport expression.",t:13,g:1}],f:["Raport"]}],n:54,z:[{n:"t",x:{r:"~/temp.expr.parsedtype"}}]}]}]}," ",{t:4,f:[{t:7,e:"label",m:[{t:13,n:"style",f:"margin-left: 2em;",g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",t:13,f:[{t:2,r:"~/temp.expr.jsonsquash"}]},{n:"title",f:"Enable to display JSON with no additional whitespace",t:13}]}," Compact?"]}],n:50,x:{r:["~/temp.expr.parsedtype"],s:"_0===\"json\"||!_0"}}],n:50,x:{r:["~/temp.expr.tab"],s:"_0===\"parsed\""}}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"Modify the current HTML template",t:13,g:1},{n:"style-display",f:[{t:2,x:{r:["~/temp.expr.html"],s:"_0?\"\":\"none\""}}],t:13},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.expr.tab"],s:"_0===\"html\""}}]},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.tab\",\"html\")]"}}],f:["HTML"]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 2;",g:1}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"View the result of the current expression's execution",t:13,g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.expr.tab"],s:"_0===\"result\""}}]},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.tab\",\"result\")]"}}],f:["Result"]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"tab",g:1},{n:"title",f:"View the parse tree of the current expression",t:13,g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.expr.tab"],s:"_0===\"parsed\""}}]},{n:"class-error",t:13,f:[{t:2,r:"~/temp.expr.error"}]},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.tab\",\"parsed\")]"}}],f:["Parsed"]}],n:50,r:"~/temp.expr.parsed"}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab text",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["~/temp.expr.tab"],s:"!_0||_0===\"text\""}}]}],f:[{t:4,f:[{t:4,f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"display: flex; justify-content: space-between;",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"title",f:"Convert multipart label text into a single expression",t:13,g:1},{n:["click"],t:70,f:{r:["@context","@this",".str"],s:"[(_0).set(\".str\",_1.getPartStrings(_2))]"}}],f:["Convert to Text"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:"title",f:"Add another part to this multipart label text",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).push(\".str\",\"\")]"}}],f:["+"]}]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 1;",g:1},{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"label-part",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico spacer",g:1},{n:["click"],t:70,f:{r:["@context","@index"],s:"[(_0).splice(\"../\",_1,1)]"}},{n:"title",f:"Remove part",t:13,g:1}],f:[{t:8,r:"times"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico up-arrow",g:1},{n:"disabled",f:[{t:2,x:{r:["@index"],s:"_0===0"}}],t:13},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.moveUp((_1))]"}},{n:"title",f:"Move up",t:13,g:1}],f:[{t:8,r:"arrow"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico spacer down-arrow",g:1},{n:"disabled",f:[{t:2,x:{r:["@index","@last"],s:"_0===_1"}}],t:13},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.moveDown((_1))]"}},{n:"title",f:"Move down",t:13,g:1}],f:[{t:8,r:"arrow"}]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context","."],s:"[(_0).set(\".\",{text:_1})]"}},{n:"title",f:"Format part",t:13,g:1}],f:["F"]}," ",{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:"."}],t:13},{n:"primary",f:[{t:2,x:{r:["@index"],s:"_0===0"}}],t:13}]}],n:50,x:{r:["."],s:"typeof _0===\"string\""}},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico spacer",g:1},{n:["click"],t:70,f:{r:["@context",".text"],s:"[(_0).set(\".\",_1)]"}},{n:"title",f:"Convert to a plain text part with no formatting",t:13,g:1}],f:["T"]}," ",{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".id"}],t:13},{n:"placeholder",f:"Tracking ID",t:13},{n:"title",f:"Track this value by assigning it a unique ID",t:13}]}," ",{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".text"}],t:13},{n:"primary",f:[{t:2,x:{r:["@index"],s:"_0===0"}}],t:13}]}," ",{t:7,e:"input",m:[{n:"title",f:"Font Family",t:13},{n:"placeholder",f:"Font Family",t:13},{n:"value",f:[{t:2,r:".font.family"}],t:13}]}," ",{t:7,e:"input",m:[{n:"title",f:"Color",t:13},{n:"placeholder",f:"Color",t:13},{n:"value",f:[{t:2,r:".font.color"}],t:13}]}," ",{t:7,e:"input",m:[{n:"title",f:"Size",t:13},{n:"placeholder",f:"Size (1)",t:13},{n:"value",f:[{t:2,r:".font.size"}],t:13},{n:"type",f:"number",t:13}]}," ",{t:7,e:"input",m:[{n:"title",f:"Line Height",t:13},{n:"placeholder",f:["Line Height (",{t:2,x:{r:[".font.size"],s:"_0==null?1:_0"}},")"],t:13},{n:"value",f:[{t:2,r:".font.line"}],t:13},{n:"type",f:"number",t:13}]}," ",{t:7,e:"select",m:[{n:"title",f:"Font Weight",t:13},{n:"value",f:[{t:2,r:".font.weight"}],t:13}],f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"undefined"}}],t:13}],f:["Font Weight"]}," ",{t:7,e:"option",m:[{n:"value",f:"400",t:13}],f:["light"]}," ",{t:7,e:"option",m:[{n:"value",f:"500",t:13}],f:["normal"]}," ",{t:7,e:"option",m:[{n:"value",f:"600",t:13}],f:["bold"]}," ",{t:7,e:"option",m:[{n:"value",f:"700",t:13}],f:["bolder"]}]}," ",{t:7,e:"label",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:".font.pre"}],t:13}]}," Significant whitespec?"]}," ",{t:7,e:"input",m:[{n:"title",f:"Background Color",t:13},{n:"placeholder",f:"Background",t:13},{n:"value",f:[{t:2,r:".bg"}],t:13}]}," ",{t:7,e:"input",m:[{n:"title",f:"Border Radius",t:13},{n:"placeholder",f:"Radius",t:13},{n:"value",f:[{t:2,r:".radius"}],t:13}]}],n:51,l:1}]}],n:52,r:".str"}]}]}],n:50,x:{r:[".str"],s:"Array.isArray(_0)"}},{t:4,f:[{t:7,e:"div",f:[{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:"title",f:"Convert a single expression label text into a multipart label text that can have individual properties set per part",t:13,g:1},{n:["click"],t:70,f:{r:["@context",".str"],s:"[(_0).set(\".str\",[_1])]"}}],f:["Convert to Parts"]}]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 1;",g:1},{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".str"}],t:13},{n:"template",f:[{t:2,x:{r:[".html",".template"],s:"_0||_1"}}],t:13},{n:["run"],t:70,f:{r:["~/temp.expr.tab","@this"],s:"[_0===\"result\"?_1.set(\"temp.expr.tab\",\"text\"):_1.eval()]"}},{n:"primary",f:0,t:13}]}]}]}],n:51,l:1}],n:50,r:".label"},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 1;",g:1},{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".str"}],t:13},{n:"template",f:[{t:2,x:{r:[".html",".template"],s:"_0||_1"}}],t:13},{n:["run"],t:70,f:{r:["~/temp.expr.tab","@this"],s:"[_0===\"result\"?_1.set(\"temp.expr.tab\",\"text\"):_1.eval()]"}},{n:"primary",f:0,t:13}]}]}]}],n:51,l:1}],n:54,r:"~/temp.expr"}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab html",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["~/temp.expr.tab"],s:"_0===\"html\""}}]}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"editor-buttons",g:1}],f:[{t:7,e:"button",m:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.command(\"bold\")]"}},{n:"title",f:"Bold",t:13,g:1}],f:[{t:7,e:"strong",f:["B"]}]}," ",{t:7,e:"button",m:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.command(\"italic\")]"}},{n:"title",f:"Italic",t:13,g:1}],f:[{t:7,e:"em",f:["I"]}]}," ",{t:7,e:"button",m:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.command(\"underline\")]"}},{n:"title",f:"Underline",t:13,g:1}],f:[{t:7,e:"span",m:[{t:13,n:"style",f:"text-decoration: underline;",g:1}],f:["U"]}]}," ",{t:7,e:"button",m:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.command(\"strikeThrough\")]"}},{n:"title",f:"Strike Through",t:13,g:1}],f:[{t:7,e:"span",m:[{t:13,n:"style",f:"text-decoration: line-through;",g:1}],f:["S"]}]}," ",{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"~/temp.fontSize"}],t:13},{n:["change"],t:70,f:{r:["@this"],s:"[_0.setHTMLFontSize()]"}},{n:"title",f:"Change Font Size",t:13}],f:[{t:7,e:"option",m:[{n:"value",f:"",t:13}],f:["(font size)"]}," ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"1"}}],t:13}],f:["smallest"]}," ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"2"}}],t:13}],f:["smaller"]}," ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"3"}}],t:13}],f:["small"]}," ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"4"}}],t:13}],f:["regular"]}," ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"5"}}],t:13}],f:["large"]}," ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"6"}}],t:13}],f:["larger"]}," ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"7"}}],t:13}],f:["largest"]}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"html-editor",g:1},{n:"contenteditable",f:"true",t:13},{n:"value",f:[{t:2,r:"~/temp.expr.htmlstr"}],t:13},{n:"id",f:"expr-html",t:13,g:1}]}]}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab result",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["~/temp.expr.tab"],s:"_0===\"result\""}}]}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"editor-buttons",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"toggles",g:1}],f:[{t:19,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["t"],s:"!_0||_0===\"plain\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.resulttype\",\"plain\")]"}}],n:50,x:{r:["t"],s:"_0&&_0!==\"plain\""}},{n:"title",f:"Show result as a plain string. Double click to copy the text to the clipboard.",t:13,g:1},{n:["dblclick"],t:70,f:{r:["@this","~/temp.expr.result"],s:"[_0.copyToClipboard(_1)]"}}],f:["Plain"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["t"],s:"_0===\"json\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.resulttype\",\"json\")]"}}],n:50,x:{r:["t"],s:"_0!==\"json\""}},{n:"title",f:"Show result as JSON",t:13,g:1}],f:["JSON"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["t"],s:"_0===\"raport\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.resulttype\",\"raport\")]"}}],n:50,x:{r:["t"],s:"_0!==\"raport\""}},{n:"title",f:"Show result as a Raport expression",t:13,g:1}],f:["Raport"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["t"],s:"_0===\"html\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.resulttype\",\"html\")]"}}],n:50,x:{r:["t"],s:"_0!==\"html\""}},{n:"title",f:"Show result as HTML",t:13,g:1}],f:["HTML"]}],n:54,z:[{n:"t",x:{r:"~/temp.expr.resulttype"}}]}]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"margin-left: 2em;",g:1}],f:[{t:4,f:[{t:7,e:"label",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",t:13,f:[{t:2,r:"~/temp.expr.jsonsquash"}]},{n:"title",f:"Enable to display JSON with no additional whitespace",t:13}]}," Compact?"]}],n:50,x:{r:["~/temp.expr.resulttype"],s:"_0===\"json\""}}]}]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 1;",g:1},{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:4,f:[{t:7,e:"span",m:[{n:"style",f:["color: ",{t:2,r:"@style.code.c12"},";"],t:13}],f:["undefined"]}],n:50,x:{r:["~/temp.expr.result"],s:"_0===undefined"}},{t:4,f:[{t:4,f:[{t:3,r:"~/temp.expr.result"}],n:50,x:{r:["~/temp.expr.resulttype"],s:"_0===\"html\""}},{t:4,f:[{t:7,e:"code",f:[{t:7,e:"pre",f:[{t:2,x:{r:["~/temp.expr.result","~/temp.expr.jsonsquash"],s:"JSON.stringify(_0,null,_1?undefined:\"  \")"}}]}]}," "],n:50,x:{r:["~/temp.expr.resulttype"],s:"_0===\"json\""},l:1},{t:4,f:[" ",{t:7,e:"code",f:[{t:7,e:"pre",f:[{t:2,x:{r:["@this","~/temp.expr.result"],s:"_0.unparse(_1)"}}]}]}," "],n:50,x:{r:["~/temp.expr.resulttype"],s:"_0===\"raport\""},l:1},{t:4,f:[" ",{t:7,e:"code",f:[{t:7,e:"pre",f:[{t:2,r:"~/temp.expr.result"}]}]}],n:51,l:1}],n:51,l:1}]}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab parsed",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["~/temp.expr.tab"],s:"_0===\"parsed\""}}]}],f:[{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 1;",g:1},{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"code",f:[{t:7,e:"pre",m:[{t:13,n:"style",f:"margin: 1em;",g:1}],f:[{t:4,f:[{t:2,r:"~/temp.expr.errormsg"}],n:50,r:"~/temp.expr.errormsg"},{t:4,f:[{t:4,f:[{t:2,x:{r:["@this","~/temp.expr.ast"],s:"_0.unparse(_1)"}}],n:50,x:{r:["~/temp.expr.parsedtype"],s:"_0===\"raport\""}},{t:4,f:[{t:2,x:{r:["~/temp.expr.ast","~/temp.expr.jsonsquash"],s:"JSON.stringify(_0,null,_1?\"\":\"  \")"}}],n:51,l:1}],n:51,l:1}]}]}]}]}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"context",g:1},{n:"style-display",f:[{t:2,x:{r:["~/temp.expr.tab"],s:"_0===\"ast\"||_0===\"text\"||_0===\"html\"?\"\":\"none\""}}],t:13}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"header",g:1},{n:"title",f:"The approximate data that should be available in this expression's context",t:13,g:1}],f:[{t:7,e:"span",f:["Context"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"placeholder",f:"Filter...",t:13},{n:"value",f:[{t:2,r:"~/ctxsearch"}],t:13},{t:73,v:"l",f:"500"}]}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"panel scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:4,f:[{t:8,r:"expr-context",c:{r:"~/temp.expr.ctx"}}],n:50,r:"~/temp.expr.ctx"}]}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"ops",g:1},{n:"style-display",f:[{t:2,x:{r:["~/temp.expr.tab"],s:"_0===\"ast\"||_0===\"text\"||_0===\"html\"?\"\":\"none\""}}],t:13}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"header",g:1},{n:"title",f:"All of the registered operators know at design time. Click an operator to insert it into the expression. Hover over an operator for a tooltip with its documentation. Hold the shift key and click an operator for popup with its documentation.",t:13,g:1}],f:[{t:7,e:"span",f:["Operators"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"placeholder",f:"Search...",t:13},{n:"value",f:[{t:2,r:"~/opsearch"}],t:13},{t:73,v:"l",f:"500"}]}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"panel scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:2,x:{r:["~/temp.expr.tab","@context"],s:"_0===\"ast\"&&(_1).decorators.scrolled&&(_1).decorators.scrolled.invalidate()||\"\"&&\"\""}}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"entry-details",g:1},{n:"title",f:[{t:2,x:{r:["@this","@key"],s:"_0.getOperatorDoc(_1)"}}],t:13}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"expr-operator",g:1},{n:["click"],t:70,f:{r:["@event.shiftKey","@this","@key"],s:"[_0?_1.showOperatorDoc(_2):_1.insertOp(_2)]"}}],f:[{t:2,r:"@key"}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"entry-type",g:1}],f:[{t:2,r:".type"}]}]}],n:52,r:"~/operators"}]}]}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab properties",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["~/temp.bottom.tab"],s:"_0===\"param\""}}]}],f:[{t:4,f:[{t:7,e:"label",m:[{n:"title",f:"The name used to reference this parameter e.g. !name",t:13,g:1}],f:[{t:7,e:"span",f:["Name"]},{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".name"}],t:13}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",f:["Type"]},{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".type"}],t:13}],f:[{t:8,r:"types"}]}]}," ",{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",f:["Refine"]},{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".refine"}],t:13}],f:[" ",{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"undefined"}}],t:13}],f:["(none)"]}," ",{t:7,e:"option",m:[{n:"value",f:"text",t:13}],f:["Multiline Text"]}," ",{t:7,e:"option",m:[{n:"value",f:"code",t:13}],f:["Expression"]}]}]}],n:50,x:{r:[".type"],s:"_0===\"string\""}}," ",{t:7,e:"label",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:".required"}],t:13}]}," Require?"]}," ",{t:7,e:"label",m:[{n:"title",f:"An alternative to the name to show in the parameter fill interface",t:13,g:1}],f:[{t:7,e:"span",f:["Label"]},{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".label"}],t:13}]}]}," ",{t:4,f:[{t:7,e:"label",m:[{n:"title",f:"Add an Initialization expression to provide a default for the parameter",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{t:73,v:"t",f:"false"},{n:["change"],t:70,f:{r:["@context"],s:"[(_0).set(\".init\",\"\")]"}}]}," Initialization expression?"]}],n:50,x:{r:[".init"],s:"_0===undefined"}},{t:4,f:[{t:7,e:"label",m:[{n:"title",f:"Add an Initialization expression to provide a default for the parameter",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{t:73,v:"t",f:"false"},{n:"checked",f:0,t:13},{n:["change"],t:70,f:{r:["@context"],s:"[(_0).set(\".init\",undefined)]"}}]}," Initialization expression?"]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"height: 5em; border: 1px solid #ccc; overflow: auto; margin-right: 1em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".init"}],t:13}]}]}],n:51,l:1}," ",{t:7,e:"label",m:[{n:"title",f:"Set up options to render the parameter as a select",t:13,g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{t:73,v:"t",f:"false"},{n:"checked",f:[{t:2,x:{r:[".options"],s:"Array.isArray(_0)"}}],t:13},{n:["change"],t:70,f:{r:["@context",".options"],s:"[(_0).set(\".options\",Array.isArray(_1)?undefined:[])]"}}]}," Options?"]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"height: 100%; width: 30rem;",g:1},{t:13,n:"class",f:"options",g:1}],f:[{t:7,e:"h3",f:["Options"]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"option-entry",g:1}],f:[{t:19,f:[{t:7,e:"label",f:[{t:7,e:"span",f:["Label"]},{t:7,e:"br"},{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"ctx.label"}],t:13}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",f:["Value"]},{t:7,e:"br"},{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"ctx.value"}],t:13}]}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:"disabled",f:[{t:2,x:{r:["ctx.value"],s:"!_0"}}],t:13},{n:["click"],t:70,f:{r:["ctx.label","ctx.value","@context"],s:"[(_2).push(\".options\",!_0?_1:{label:_0,value:_1}),(_2).set({\"ctx.label\":\"\",\"ctx.value\":\"\"})]"}}],f:["+"]}],n:54,z:[{n:"ctx",x:{r:"@local"}}]}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:4,f:[{t:7,e:"div",f:[{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"."}],t:13}]}],n:50,x:{r:["."],s:"typeof _0===\"string\""}},{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".label"}],t:13}]}," ",{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".value"}],t:13}]}],n:51,l:1}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context","@index"],s:"[(_0).splice(\"../\",_1,1)]"}}],f:[{t:8,r:"times"}]}]}],n:52,r:".options"}]}]}],n:50,r:".options"}]}],n:50,x:{r:[".options"],s:"Array.isArray(_0)"}}],n:54,r:"~/param"}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab properties",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["~/temp.bottom.tab"],s:"_0===\"params\""}}]}],f:[{t:8,r:"bottom-parameters"}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"tab properties",g:1},{n:"class-active-tab",t:13,f:[{t:2,x:{r:["~/temp.bottom.tab"],s:"_0===\"source\""}}]}],f:[{t:4,f:[{t:7,e:"label",m:[{n:"title",f:"Expose this source to the report context with this name. If none is provided, this source will be named based on its upstream source.",t:13,g:1}],f:[{t:7,e:"span",f:["Name"]},{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".name"}],t:13}]}]}," ",{t:7,e:"label",m:[{n:"title",f:"The upstream source that this source should be based on.",t:13,g:1}],f:[{t:7,e:"span",f:["Source"]},{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".source"}],t:13}],f:[{t:4,f:[{t:7,e:"option",f:[{t:2,r:".name"}]}],n:52,r:"~/sources"}]}]}," ",{t:7,e:"label",m:[{n:"title",f:"An expression providing the base data for this source. This will override the upstream source.",t:13,g:1}],f:[{t:7,e:"span",f:["Base ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@this","~/temp.bottom.source"],s:"[_0.editExpr(_1+\".base\")]"}}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"textarea",m:[{n:"rows",f:"1",t:13}],f:[{t:2,r:".base"}]}]}," ",{t:7,e:"label",m:[{n:"title",f:"A filter expression to apply to the source before it is used.",t:13,g:1}],f:[{t:7,e:"span",f:["Filter ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@this","~/temp.bottom.source"],s:"[_0.editExpr(_1+\".filter\")]"}}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"textarea",m:[{n:"rows",f:"1",t:13}],f:[{t:2,r:".filter"}]}]}," ",{t:7,e:"label",m:[{n:"title",f:"A sort expression to apply to the source before it is used. This should be an array of applications or config objects with by keys having application values.",t:13,g:1}],f:[{t:7,e:"span",f:["Sort ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@this","~/temp.bottom.source"],s:"[_0.editExpr(_1+\".sort\")]"}}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"textarea",m:[{n:"rows",f:"1",t:13}],f:[{t:2,r:".sort"}]}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"height: 100%; width: 20rem;",g:1},{t:13,n:"class",f:"options",g:1}],f:[{t:7,e:"h3",f:[{t:7,e:"button",m:[{t:13,n:"style",f:"float: right;",g:1},{t:13,n:"class",f:"ico large",g:1},{n:"title",f:"Add group expression",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).push(\".group\",\"\")]"}}],f:["+"]}," ",{t:7,e:"label",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:".group"}],t:13},{t:73,v:"t",f:"false"},{n:["change"],t:70,f:{r:["@context"],s:"[(_0).set(\".group\",undefined)]"}}]}," Groups"]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"group-edit",g:1}],f:[{t:7,e:"span",f:[{t:2,x:{r:["@index"],s:"_0+1"}}]}," ",{t:7,e:"textarea",m:[{n:"rows",f:"1",t:13}],f:[{t:2,r:"."}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit group expression",t:13,g:1},{n:["click"],t:70,f:{r:["@this","@keypath"],s:"[_0.editExpr(\"~/\"+_1)]"}}],f:[{t:8,r:"pencil"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Remove group expression",t:13,g:1},{n:["click"],t:70,f:{r:["@context","@index"],s:"[(_0).splice(\"../\",_1,1)]"}}],f:[{t:8,r:"times"}]}]}],n:52,r:".group"}]}]}]}],n:50,x:{r:[".group"],s:"Array.isArray(_0)"}},{t:4,f:[{t:7,e:"label",f:[{t:7,e:"input",m:[{n:"title",f:"Group the rows in this source by one or more expression? This should be coordinated with the sort expression, as groups are produced by sequentially processing the source data.",t:13},{n:"type",f:"checkbox",t:13},{n:["change"],t:70,f:{r:["@context"],s:"[(_0).set(\".group\",[\"\"])]"}}]}," Group?"]}],n:51,l:1}],n:54,r:"~/source"}]}]}," ",{t:7,e:"datalist",m:[{n:"id",f:"operators",t:13,g:1}],f:[{t:4,f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,r:"@key"}],t:13}]}],n:52,r:"~/operators"}]}],"expr-context":[{t:4,f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"context-entry",g:1},{n:"class-expanded",t:13,f:[{t:2,rx:{r:"~/exprExpand",m:[{t:30,n:"@keypath"}]}}]}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"entry-details",g:1}],f:[{t:7,e:"div",f:[{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"expand",g:1},{n:["click"],t:70,f:{r:["@this","@keypath"],s:"[_0.exprToggle(_1)]"}}],f:[{t:2,x:{r:["@keypath","~/exprExpand"],s:"_1[_0]?\"-\":\"+\""}}]}],n:50,r:".fields"}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"entry-name",g:1},{n:["click"],t:70,f:{r:["@this","@keypath"],s:"[_0.insertRef(_1)]"}}],f:[{t:2,r:".name"}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"entry-type",g:1}],f:[{t:2,r:".type"}]}]}," ",{t:4,f:[{t:8,r:"expr-context"}],n:50,r:".fields"}]}],n:50,x:{r:[".fields",".name","~/ctxsearch"],s:"!_2||_0||~_1.indexOf(_2)"}}],n:52,r:".fields"}],"ast-dim-actions":[{t:7,e:"div",m:[{t:13,n:"class",f:"ast-actions",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["../","@index","@context"],s:"[Array.isArray(_0)?(_2).splice(\"../\",_1,1):(_2).set(\".\",undefined)]"}}],f:[{t:8,r:"times"}]}]}],"ast-actions":[{t:7,e:"div",m:[{t:13,n:"class",f:"ast-actions",g:1}],f:[{t:4,f:[{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico text",g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".source\",{r:\"\"})]"}}],f:["+ Source"]}],n:51,r:".source"}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico text",g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".apply\",{r:\"\"})]"}}],f:["+ Application"]}],n:51,r:".apply"}],n:50,x:{r:[".op","~/operators"],s:"_1[_0]&&_1[_0].type===\"aggregate\""}}," ",{t:7,e:"select",m:[{t:73,v:"t",f:"false"},{n:["change"],t:70,f:{r:["@this","@keypath","@node.value"],s:"[_0.retypeASTNode(_1,_2)]"}},{n:"value",f:[{t:2,x:{r:[".v","."],s:"_1&&\"op\" in _1?\"operator\":_1&&\"v\" in _1?(typeof _0===\"string\"?\"string\":typeof _0===\"number\"?\"number\":\"object\"):_1&&\"r\" in _1?\"reference\":\"undefined\""}}],t:13}],f:[{t:7,e:"option",f:["operator"]}," ",{t:7,e:"option",f:["string"]}," ",{t:7,e:"option",f:["number"]}," ",{t:7,e:"option",f:["reference"]}," ",{t:7,e:"option",f:["undefined"]}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["../","@index","@context"],s:"[Array.isArray(_0)?(_2).splice(\"../\",_1,1):(_2).set(\".\",undefined)]"}}],f:[{t:8,r:"times"}]}]}],"ast-node":[{t:7,e:"div",m:[{n:["click"],t:70,f:{r:["~/temp.expr.partpath","@this","@keypath"],s:"[_0!==_2&&[_1.link(_2,\"temp.expr.part\"),_1.set(\"temp.expr.partpath\",_2)],false]"}},{n:"class",f:["ast-node ast-",{t:2,x:{r:["."],s:"(_0&&(\"op\" in _0?\"op\":\"v\" in _0?\"value\":\"r\" in _0?\"ref\":\"wat\"))||\"wat\""}}],t:13},{n:"class-ast-active-node",t:13,f:[{t:2,x:{r:["~/temp.expr.partpath","@keypath"],s:"_0===_1"}}]}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"ast-content",g:1}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"ast-op-name",g:1}],f:[{t:7,e:"div",f:[{t:2,r:"prefix"},"(",{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".op"}],t:13},{n:"list",f:"operators",t:13}]}]},{t:8,r:"ast-actions"}]}," ",{t:4,f:[{t:8,r:"ast-node"}],n:52,r:".args"}," ",{t:7,e:"div",f:[") ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).push(\".args\",{v:\"\"})]"}}],f:["+"]}]}],n:50,x:{r:["."],s:"_0&&\"op\" in _0"}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"ast-content-value",g:1}],f:[{t:7,e:"div",f:[{t:2,r:"prefix"}," ",{t:4,f:[{t:7,e:"textarea",m:[{n:"rows",f:"1",t:13},{n:"cols",f:"30",t:13}],f:[{t:2,r:".v"}]}],n:50,x:{r:[".v"],s:"typeof _0===\"string\""}},{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".v"}],t:13},{n:"type",f:"number",t:13}]}],n:50,x:{r:[".v"],s:"typeof _0===\"number\""},l:1}]}," ",{t:8,r:"ast-actions"}]}," "],n:50,x:{r:["."],s:"_0&&\"v\" in _0"},l:1},{t:4,f:[" ",{t:7,e:"div",m:[{t:13,n:"class",f:"ast-content-ref",g:1}],f:[{t:7,e:"div",f:[{t:2,r:"prefix"},{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".r"}],t:13}]}]}," ",{t:8,r:"ast-actions"}]}],n:50,x:{r:["."],s:"_0&&\"r\" in _0"},l:1}]}],n:50,x:{r:["~/temp.expr.partpath","@keypath"],s:"_0===_1"}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"ast-content",g:1}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"ast-op-name",g:1}],f:[{t:7,e:"div",f:[{t:2,r:"prefix"},"(",{t:2,r:".op"}]},{t:8,r:"ast-dim-actions"}]}," ",{t:4,f:[{t:4,f:[{t:8,r:"ast-node",c:{r:".source"},z:[{n:"prefix",x:{x:{r:[],s:"\"+ \""}}}]}],n:50,r:".source"}," ",{t:4,f:[{t:8,r:"ast-node",c:{r:".apply"},z:[{n:"prefix",x:{x:{r:[],s:"\"=> \""}}}]}],n:50,r:".apply"}],n:50,x:{r:[".op","~/operators"],s:"_1[_0]&&_1[_0].type===\"aggregate\""}}," ",{t:4,f:[{t:8,r:"ast-node"}],n:52,r:".args"}," )"],n:50,x:{r:["."],s:"_0&&\"op\" in _0"}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"ast-content-value",g:1}],f:[{t:7,e:"div",m:[{n:"class-ast-string",t:13,f:[{t:2,x:{r:[".v"],s:"typeof _0===\"string\""}}]},{n:"class-ast-number",t:13,f:[{t:2,x:{r:[".v"],s:"typeof _0===\"number\""}}]}],f:[{t:2,r:"prefix"},{t:2,r:".v"}]},{t:8,r:"ast-dim-actions"}]}," "],n:50,x:{r:["."],s:"_0&&\"v\" in _0"},l:1},{t:4,f:[" ",{t:7,e:"div",m:[{t:13,n:"class",f:"ast-content-ref",g:1}],f:[{t:7,e:"div",f:[{t:2,r:"prefix"},{t:2,r:".r"}," (ref)"]},{t:8,r:"ast-dim-actions"}]}],n:50,x:{r:["."],s:"_0&&\"r\" in _0"},l:1}]}],n:51,l:1}]}],"bottom-parameters":[{t:7,e:"div",m:[{t:13,n:"style",f:"flex-grow: 1;",g:1},{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico text",g:1},{n:["click"],t:70,f:{r:["@this","params"],s:"[_0.set(\"report.defaultParams\",_1)]"}},{n:"title",f:"Save these values as the report defaults",t:13,g:1}],f:["Save as Defaults"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico text",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.initParams()]"}},{n:"title",f:"Re-initialize all parameters",t:13,g:1}],f:["Re-init Params"]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"param-editor",g:1}],f:[{t:4,f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"param",g:1}],f:[{t:4,f:[{t:7,e:"label",m:[{t:13,n:"class",f:"check",g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,rx:{r:"~/params",m:[{t:30,n:".name"}]}}],t:13}]}," ",{t:2,x:{r:[".label",".name"],s:"_0||_1"}},"?"]}],n:50,x:{r:[".type"],s:"_0===\"boolean\""}},{t:4,f:[{t:7,e:"label",m:[{t:13,n:"class",f:"pick",g:1}],f:[{t:2,x:{r:[".label",".name"],s:"_0||_1"}},{t:7,e:"select",m:[{n:"value",f:[{t:2,rx:{r:"~/params",m:[{t:30,n:".name"}]}}],t:13}],f:[" ",{t:4,f:[{t:4,f:[{t:7,e:"option",f:[{t:2,r:"."}]}],n:50,x:{r:["."],s:"typeof _0===\"string\""}},{t:4,f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,r:".value"}],t:13}],f:[{t:2,r:".label"}]}],n:51,l:1}],n:52,r:".options"}]}]}," "],n:50,r:".options.length",l:1},{t:4,f:[" ",{t:4,f:[{t:7,e:"div",f:[{t:2,x:{r:[".label",".name"],s:"_0||_1"}}]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"height: 5em; border: 1px solid #ccc; overflow: auto;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,rx:{r:"~/params",m:[{t:30,n:".name"}]}}],t:13}]}]}],n:50,x:{r:[".refine"],s:"_0===\"code\""}},{t:4,f:[{t:7,e:"label",f:[{t:7,e:"div",f:[{t:2,x:{r:[".label",".name"],s:"_0||_1"}}]}," ",{t:7,e:"textarea",f:[{t:2,rx:{r:"~/params",m:[{t:30,n:".name"}]}}]}]}," "],n:50,x:{r:[".refine"],s:"_0===\"text\""},l:1},{t:4,f:[" ",{t:7,e:"label",m:[{t:13,n:"class",f:"string",g:1}],f:[{t:2,x:{r:[".label",".name"],s:"_0||_1"}}," ",{t:7,e:"input",m:[{n:"value",f:[{t:2,rx:{r:"~/params",m:[{t:30,n:".name"}]}}],t:13}]}]}],n:51,l:1}," "],n:50,x:{r:[".type"],s:"_0===\"string\""},l:1},{t:4,f:[" ",{t:7,e:"label",m:[{t:13,n:"class",f:"string",g:1}],f:[{t:2,x:{r:[".label",".name"],s:"_0||_1"}}," ",{t:4,f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,rx:{r:"~/params",m:[{t:30,n:".name"}]}}],t:13}]}],n:50,x:{r:[".type"],s:"_0===\"number\""}},{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,rx:{r:"~/params",m:[{t:30,n:".name"}]}}],t:13}]}],n:51,l:1}]}],n:51,l:1}]}],n:50,r:".name"}],n:52,r:"~/report.parameters"}]}]}]}],"widget-props":[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["Width of the ",{t:2,r:".type"}," in rem, if a number, a percentage of the parent, grow/fill, or an expression, defaulting to 100%"],t:13}],f:["Width ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".width",".width.percent"],s:"[(_0).set(\".width\",typeof _1===\"number\"||_1===undefined?{percent:_1}:typeof _1===\"object\"&&\"percent\" in _1?{x:\"\"}:typeof _1===\"object\"&&\"x\" in _1?\"grow\":_2)]"}},{n:"title",f:[{t:2,x:{r:[".width"],s:"typeof _0===\"number\"||_0===undefined?\"Change to percent\":typeof _0===\"object\"&&\"percent\" in _0?\"Change to Expression\":typeof _0===\"object\"&&\"x\" in _0?\"Change to Fill/Grow\":\"Change to REM\""}}],t:13}],f:[" ",{t:8,r:"switch"}]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".width.x\"),false]"}}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".width"],s:"typeof _0===\"object\"&&\"x\" in _0"}}]}," ",{t:7,e:"span",f:[{t:4,f:[{t:7,e:"div",f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".width"}],t:13},{n:"style-width",f:"calc(100% - 2rem)",t:13}]},{t:7,e:"span",m:[{t:13,n:"class",f:"unit",g:1}],f:["rem"]}]}],n:50,x:{r:[".width"],s:"typeof _0===\"number\"||_0===undefined"}},{t:4,f:[{t:7,e:"div",f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".width.percent"}],t:13},{n:"style-width",f:"calc(100% - 2rem)",t:13}]},{t:7,e:"span",m:[{t:13,n:"class",f:"unit",g:1}],f:["%"]}]}," "],n:50,x:{r:[".width"],s:"typeof _0===\"object\"&&\"percent\" in _0"},l:1},{t:4,f:[" ",{t:7,e:"div",f:["Fill/Grow"]}," "],n:50,x:{r:[".width"],s:"_0===\"grow\""},l:1},{t:4,f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".width.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".width"],s:"typeof _0===\"object\""},l:1}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["Height of the ",{t:2,r:".type"}," in rem, if a number, a percentage of the parent, or an expression, fill/grow, default to",{t:4,f:["the largest font size or"],n:50,x:{r:["type"],s:"_0===\"label\""}}," 1"],t:13}],f:["Height ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".height",".height.percent"],s:"[(_0).set(\".height\",typeof _1===\"number\"||_1===undefined?{percent:_1}:typeof _1===\"object\"&&\"percent\" in _1?{x:\"\"}:typeof _1===\"object\"&&\"x\" in _1?\"grow\":_2)]"}},{n:"title",f:[{t:2,x:{r:[".height"],s:"typeof _0===\"number\"||_0===undefined?\"Change to percent\":typeof _0===\"object\"&&\"percent\" in _0?\"Change to Expression\":typeof _0===\"object\"&&\"x\" in _0?\"Change to Fill/Grow\":\"Change to REM\""}}],t:13}],f:[{t:8,r:"switch"}]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".height.x\"),false]"}}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".height"],s:"typeof _0===\"object\"&&\"x\" in _0"}}]}," ",{t:7,e:"span",f:[{t:4,f:[{t:7,e:"div",f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".height"}],t:13},{n:"style-width",f:"calc(100% - 2rem)",t:13}]},{t:7,e:"span",m:[{t:13,n:"class",f:"unit",g:1}],f:["rem"]}]}],n:50,x:{r:[".height"],s:"typeof _0===\"number\"||_0===undefined"}},{t:4,f:[{t:7,e:"div",f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".height.percent"}],t:13},{n:"style-width",f:"calc(100% - 2rem)",t:13}]},{t:7,e:"span",m:[{t:13,n:"class",f:"unit",g:1}],f:["%"]}]}," "],n:50,x:{r:[".height"],s:"typeof _0===\"object\"&&\"percent\" in _0"},l:1},{t:4,f:[" ",{t:7,e:"div",f:["Fill/Grow"]}," "],n:50,x:{r:[".height"],s:"_0===\"grow\""},l:1},{t:4,f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".height.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".height"],s:"typeof _0===\"object\""},l:1}]}]}," ",{t:4,f:[{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"Offset from the sides of the container. Positive values are the offset from the left, and negative values are the offset from the right, where -1 will be touching the right side.",t:13,g:1}],f:["X"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,rx:{r:".layout",m:[{r:["@this","~/temp.widget"],s:"_0.lastKey(_1)"},{r:[],s:"0"}]}}],t:13}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"Offset from the top or bottom of the container. Positive values are the offset from the top, and negative values are the offset from the bottom, where -1 will be touching the bottom.",t:13,g:1}],f:["Y"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,rx:{r:".layout",m:[{r:["@this","~/temp.widget"],s:"_0.lastKey(_1)"},{r:[],s:"1"}]}}],t:13}]}]}]}],n:50,x:{r:[".layout"],s:"Array.isArray(_0)"}},{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"Cause the next widget to start on the next line in an automatic layout",t:13,g:1}],f:["Break? ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context","^^/br"],s:"[(_0).set(\"^^/br\",typeof _1===\"object\"?false:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:["^^/br"],s:"typeof _0===\"object\"?\"Change to Boolean\":\"Change to Expression\""}}],t:13}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\"^^/br.x\"),false]"}}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:["^^/br"],s:"typeof _0===\"object\"&&\"x\" in _0"}}," "]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:"^^/br"}],t:13}]}],n:50,x:{r:["^^/br"],s:"typeof _0!==\"object\""}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:"^^/br.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:["^^/br"],s:"typeof _0===\"object\""},l:1}]}]}],n:51,l:1}],n:54,rx:{r:"~/",m:[{r:["@this","~/temp.widget"],s:"_0.split(_1,2)"}]}},{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["If this evaluates to true, the ",{t:2,r:".type"}," will be hidden and not affect automatic layouts"],t:13}],f:["Hidden ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".hide\")]"}}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"span",f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".hide"}],t:13},{n:"tabout",f:0,t:13}]}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["Additional padding within the borders of the ",{t:2,r:".type"},". The base value for this property is a four number tuple with values for the top, right, bottom, and left. A two number tuple is converted to top/bottom and left/right. A single number specifies the same number for all sides."],t:13}],f:["Margin ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".margin.x\"),false]"}}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".margin"],s:"typeof _0===\"object\"&&\"x\" in _0"}}," "]},{t:7,e:"span",f:[" ",{t:7,e:"div",m:[{t:13,n:"class",f:"toggles",g:1}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".margin"],s:"typeof _0===\"undefined\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".margin\",undefined)]"}}],n:50,x:{r:[".margin"],s:"typeof _0!==\"undefined\""}}],f:["None"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".margin"],s:"typeof _0===\"number\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".margin\",1)]"}}],n:50,x:{r:[".margin"],s:"typeof _0!==\"number\""}}],f:["All"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".margin.length"],s:"_0===2"}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".margin\",[1,1])]"}}],n:50,x:{r:[".margin.length"],s:"_0!==2"}}],f:["Paired"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".margin.length"],s:"_0===4"}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".margin\",[1,1,1,1])]"}}],n:50,x:{r:[".margin.length"],s:"_0!==4"}}],f:["Individual"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".margin"],s:"typeof _0===\"object\"&&\"x\" in _0"}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".margin\",{x:\"\"})]"}}],n:50,x:{r:[".margin",".margin.x"],s:"!_0||_1===undefined"}}],f:["Expression"]}]}," ",{t:4,f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".margin"}],t:13}]}],n:50,x:{r:[".margin"],s:"typeof _0===\"number\""}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"sides",g:1}],f:[{t:7,e:"span"},{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".margin.0"}],t:13}]},{t:7,e:"span"}," ",{t:7,e:"span"},{t:7,e:"div",m:[{t:13,n:"class",f:"square",g:1}]},{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".margin.1"}],t:13}]}," ",{t:7,e:"span"},{t:7,e:"span"},{t:7,e:"span"}]}," "],n:50,x:{r:[".margin.length"],s:"_0===2"},l:1},{t:4,f:[" ",{t:7,e:"div",m:[{t:13,n:"class",f:"sides",g:1}],f:[{t:7,e:"span"},{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".margin.0"}],t:13}]},{t:7,e:"span"}," ",{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".margin.3"}],t:13}]},{t:7,e:"div",m:[{t:13,n:"class",f:"square",g:1}]},{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".margin.1"}],t:13}]}," ",{t:7,e:"span"},{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".margin.2"}],t:13}]},{t:7,e:"span"}]}," "],n:50,x:{r:[".margin.length"],s:"_0===4"},l:1},{t:4,f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".margin.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".margin.x"],s:"_0!==undefined"},l:1}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"Setting box to contain will make the margins fit within the designated size. Setting box to expand will expand the width to include the margin. The default depends on the type of sizing, with contain for percentages and expand for others.",t:13,g:1}],f:["Box"]},{t:7,e:"span",f:[" ",{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".box"}],t:13}],f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"undefined"}}],t:13}],f:["Default"]}," ",{t:7,e:"option",m:[{n:"value",f:"contain",t:13}],f:["Contain"]}," ",{t:7,e:"option",m:[{n:"value",f:"expand",t:13}],f:["Expand"]}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["The size in px for the border of this ",{t:2,r:".type"},". The base value for this property is a four number tuple with values for the top, right, bottom, and left. A two number tuple is converted to top/bottom and left/right. A single number tuple spcifies the same number for all sides. A single number specifies only the bottom border."],t:13}],f:["Border ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".border\")]"}}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".border"],s:"typeof _0===\"string\""}}]},{t:7,e:"span",f:[" ",{t:7,e:"div",m:[{t:13,n:"class",f:"toggles",g:1}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".border"],s:"typeof _0===\"undefined\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".border\",undefined)]"}}],n:50,x:{r:[".border"],s:"typeof _0!==\"undefined\""}}],f:["None"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".border"],s:"typeof _0===\"number\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".border\",1)]"}}],n:50,x:{r:[".border"],s:"typeof _0!==\"number\""}}],f:["Bottom"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".border.length"],s:"_0===1"}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".border\",[1])]"}}],n:50,x:{r:[".border.length"],s:"_0!==1"}}],f:["All"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".border.length"],s:"_0===2"}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".border\",[1,1])]"}}],n:50,x:{r:[".border.length"],s:"_0!==2"}}],f:["Paired"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".border.length"],s:"_0===4"}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".border\",[1,1,1,1])]"}}],n:50,x:{r:[".border.length"],s:"_0!==2"}}],f:["Individual"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".border"],s:"typeof _0===\"string\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".border\",\"\")]"}}],n:50,x:{r:[".border"],s:"typeof _0!==\"string\""}}],f:["Expression"]}]}," ",{t:4,f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".border"}],t:13}]}],n:50,x:{r:[".border"],s:"typeof _0===\"number\""}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".border"}],t:13},{n:"tabout",f:0,t:13}]}]}," "],n:50,x:{r:[".border"],s:"typeof _0===\"string\""},l:1},{t:4,f:[" ",{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".border.0"}],t:13}]}," "],n:50,x:{r:[".border.length"],s:"_0===1"},l:1},{t:4,f:[" ",{t:7,e:"div",m:[{t:13,n:"class",f:"sides",g:1}],f:[{t:7,e:"span"},{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".border.0"}],t:13}]},{t:7,e:"span"}," ",{t:7,e:"span"},{t:7,e:"div",m:[{t:13,n:"class",f:"square",g:1}]},{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".border.1"}],t:13}]}," ",{t:7,e:"span"},{t:7,e:"span"},{t:7,e:"span"}]}," "],n:50,x:{r:[".border.length"],s:"_0===2"},l:1},{t:4,f:[" ",{t:7,e:"div",m:[{t:13,n:"class",f:"sides",g:1}],f:[{t:7,e:"span"},{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".border.0"}],t:13}]},{t:7,e:"span"}," ",{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".border.3"}],t:13}]},{t:7,e:"div",m:[{t:13,n:"class",f:"square",g:1}]},{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".border.1"}],t:13}]}," ",{t:7,e:"span"},{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".border.2"}],t:13}]},{t:7,e:"span"}]}],n:50,x:{r:[".border.length"],s:"_0===4"},l:1}]}]}," ",{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["Horizontal alignment of text within this ",{t:2,r:".type"},"."],t:13}],f:["Alignment ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".font.align"],s:"[(_0).set(\".font.align\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".font.align"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".font.align.x\")]"}}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".font.align"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".font.align.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".font.align"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".font.align"}],t:13}],f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"undefined"}}],t:13}],f:["(default)"]}," ",{t:7,e:"option",f:["left"]}," ",{t:7,e:"option",f:["center"]}," ",{t:7,e:"option",f:["right"]}]}],n:51,l:1}]}]}],n:50,x:{r:[".type"],s:"_0!==\"image\""}},{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["Display all whitespace, including newlines, within the content of the ",{t:2,r:".type"},"?"],t:13}],f:["Significant Space? ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".font.pre"],s:"[(_0).set(\".font.pre\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".font.pre"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".font.pre.x\")]"}}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".font.pre"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".font.pre.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".font.pre"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{t:73,v:"t",f:"false"},{n:"checked",f:[{t:2,r:".font.pre"}],t:13},{n:["change"],t:70,f:{r:["@context","@node.checked"],s:"[(_0).set(\".font.pre\",_1?true:undefined)]"}}]}],n:51,l:1}]}]}],n:51,x:{r:[".type"],s:"_0===\"measured\"||_0===\"image\""}},{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"If enabled, content that would exceed the specified boundaries of the component will be clipped rather than overflowing.",t:13,g:1}],f:["Prevent Overflow? ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".font.clamp"],s:"[(_0).set(\".font.clamp\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".font.clamp"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".font.clamp.x\")]"}}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".font.clamp"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".font.clamp.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".font.clamp"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{t:73,v:"t",f:"false"},{n:"checked",f:[{t:2,r:".font.clamp"}],t:13},{n:["change"],t:70,f:{r:["@context","@node.checked"],s:"[(_0).set(\".font.clamp\",_1?true:undefined)]"}}]}],n:51,l:1}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["Size of the text within this ",{t:2,r:".type"}," in rem."],t:13}],f:["Text Size ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".font.size"],s:"[(_0).set(\".font.size\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".font.size"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".font.size.x\")]"}}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".font.size"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".font.size.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".font.size"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".font.size"}],t:13}]}],n:51,l:1}]}]}],n:50,x:{r:[".type"],s:"_0!==\"image\""}},{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["The height of lines within this ",{t:2,r:".type"}," in rem. This defaults to the text size if it is set and a line height is not supplied."],t:13}],f:["Line Height ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".font.line"],s:"[(_0).set(\".font.line\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".font.line"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".font.line.x\")]"}}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".font.line"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".font.line.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".font.line"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".font.line"}],t:13}]}],n:51,l:1}]}]}],n:51,x:{r:[".type"],s:"_0===\"measured\"||_0===\"image\""}},{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"text",f:["The font family for text appearing within this ",{t:2,r:".type"},". Browser safe fonts are recommended e.g. serif, sans-serif, monospace."],t:13}],f:["Font Family ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".font.family"],s:"[(_0).set(\".font.family\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".font.family"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".font.family.x\")]"}}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".font.family"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".font.family.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".font.family"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".font.family"}],t:13}]}],n:51,l:1}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["The color of text appearing within this ",{t:2,r:".type"},"."],t:13}],f:["Text Color ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".font.color"],s:"[(_0).set(\".font.color\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".font.color"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".font.color.x\")]"}}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".font.color"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".font.color.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".font.color"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".font.color"}],t:13}]}],n:51,l:1}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["The weight of text appearing within this ",{t:2,r:".type"},"."],t:13}],f:["Weight ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".font.weight"],s:"[(_0).set(\".font.weight\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".font.weight"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".font.weight.x\")]"}}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".font.weight"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".font.weight.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".font.weight"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".font.weight"}],t:13}],f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"undefined"}}],t:13}],f:["(default)"]}," ",{t:7,e:"option",m:[{n:"value",f:"400",t:13}],f:["light"]}," ",{t:7,e:"option",m:[{n:"value",f:"500",t:13}],f:["normal"]}," ",{t:7,e:"option",m:[{n:"value",f:"600",t:13}],f:["bold"]}," ",{t:7,e:"option",m:[{n:"value",f:"700",t:13}],f:["bolder"]}]}],n:51,l:1}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["The background color of this ",{t:2,r:".type"},"."],t:13}],f:["Background Color ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".bg"],s:"[(_0).set(\".bg\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".bg"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".bg.x\")]"}}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".bg"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".bg.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".bg"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".bg"}],t:13}]}],n:51,l:1}]}]}],n:50,x:{r:[".type"],s:"_0!==\"image\""}},{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["The radius, including CSS unit, to apply to the corners of this ",{t:2,r:".type"}," if it has a border."],t:13}],f:["Radius ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".radius"],s:"[(_0).set(\".radius\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".radius"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".radius.x\")]"}}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".radius"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".radius.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".radius"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".radius"}],t:13}]}],n:51,l:1}]}]}," ",{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:["Padding to add to the right side of the ",{t:2,r:".type"},", which is useful for right-aligned text"],t:13}],f:["Right Pad"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".font.right"}],t:13}]}]}]}],n:50,x:{r:[".margin"],s:"!_0"}}],"image-props":[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The URL of the picture to load into this image. This can be a data url.",t:13,g:1}],f:["URL ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".url\")]"}}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"span",f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".url"}],t:13},{n:"tabout",f:0,t:13}]}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"This property specifies how the image should be rendered if its aspect ratio and dimensions do not match the size of this image widget.",t:13,g:1}],f:["Fit ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".fit"],s:"[(_0).set(\".fit\",!_1||typeof _1===\"string\"?{x:\"\"}:undefined)]"}},{n:"title",f:["Sitch to ",{t:2,x:{r:[".fit"],s:"_0&&typeof _0!==\"object\"?\"Expression\":\"Value\""}}],t:13}],f:[{t:8,r:"switch"}]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".fit.x\"),false]"}}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".fit"],s:"typeof _0===\"object\"&&\"x\" in _0"}}," "]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".fit"}],t:13}],f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"undefined"}}],t:13}],f:["Contain"]}," ",{t:7,e:"option",m:[{n:"value",f:"cover",t:13}],f:["Cover"]}," ",{t:7,e:"option",m:[{n:"value",f:"stretch",t:13}],f:["Stretch"]}]}],n:50,x:{r:[".fit"],s:"!_0||typeof _0===\"string\""}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".fit.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:51,l:1}]}]}],"repeater-props":[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The source of the data that this repeater should iterate over. Report sources can be further grouped, filtered, and sorted here before being rendered by the repeater.",t:13,g:1}],f:["Source ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:[".source","@keypath","@this","@context"],s:"[typeof _0===\"string\"?_2.editExpr(_1+\".source\"):_2.editReportSrc((_3),\".source\")]"}}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"span",f:[" ",{t:7,e:"div",m:[{t:13,n:"class",f:"toggles",g:1}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".source"],s:"typeof _0===\"string\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".source\",\"\")]"}}],n:50,x:{r:[".source"],s:"typeof _0!==\"string\""}}],f:["Expression"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"toggle",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:[".source"],s:"typeof _0!==\"string\""}}]},{t:4,f:[{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".source\",{source:\"\"})]"}}],n:50,x:{r:[".source"],s:"typeof _0===\"string\""}}],f:["Source"]}]}," ",{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".source"}],t:13}]}],n:50,x:{r:[".source"],s:"typeof _0===\"string\""}}," ",{t:4,f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".source.source"}],t:13}],f:[{t:7,e:"option",m:[{n:"value",f:"",t:13}],f:["(None)"]},{t:4,f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[".name",".source"],s:"_0||_1"}}],t:13}],f:[{t:2,x:{r:[".label",".name",".source"],s:"_0||_1||_2"}}]}],n:52,r:"~/report.sources"}]}],n:50,x:{r:[".source"],s:"typeof _0!==\"string\""}}]}]}," ",{t:19,f:[{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"If enabled, the footer will be rendered again after all of the groups. You can use the @level reference to render different footers for different group levels within the repeater.",t:13,g:1}],f:["Show Footer?"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,rx:{r:"repeater.groupEnds",m:[{t:30,n:"repeater.group.length"}]}}],t:13}]}]}]}],n:50,x:{r:["repeater.footer","repeater.group.length"],s:"_0&&_1"}}],n:54,z:[{n:"repeater",x:{rx:{r:"~/",m:[{r:["@this","~/temp.widget"],s:"_0.split(_1)"}]}}}]}],"measured-props":[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The text to appear in this label. This is an expression, so literal text will need to be specified as a string expression.",t:13,g:1}],f:["Text ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".text\")]"}}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"span",f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".text"}],t:13},{n:"tabout",f:0,t:13}]}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The font metric to use when computing the height that the text will require based on the number of characters in the Text. This is the average width of the font character in em. Some fonts have automatic metric applied based on their name, such as browser-safe fonts and those with names containing things like 'narrow' or 'mono'.",t:13,g:1}],f:["Metric ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@context",".font.metric"],s:"[(_0).set(\".font.metric\",typeof _1===\"object\"?undefined:{x:\"\"})]"}},{n:"title",f:[{t:2,x:{r:[".font.metric"],s:"typeof _0===\"object\"?\"Change to value\":\"Change to Expression\""}}],t:13}],f:[" ",{t:8,r:"switch"}," "]},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".font.metric.x\")]"}}],f:[{t:8,r:"pencil"}]}],n:50,x:{r:[".font.metric"],s:"typeof _0===\"object\""}}]},{t:7,e:"span",f:[" ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".font.metric.x"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:50,x:{r:[".font.metric"],s:"typeof _0===\"object\""}},{t:4,f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:".font.metric"}],t:13}]}],n:51,l:1}]}]}],"container-props":[{t:19,f:[{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"If enabled, show the repeater footer for this grouping of rows. You can use the @level reference to modify the footer for different levels within the repeater.",t:13,g:1}],f:["Show Footer?"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,rx:{r:"repeater.groupEnds",m:[{r:["repeater.group.length","index"],s:"_0-1-_1"}]}}],t:13}]}]}]}],n:50,x:{r:["repeater.footer","index","repeater.group"],s:"_0&&_2[_1]"}}],n:54,z:[{n:"repeater",x:{rx:{r:"~/",m:[{r:["@this","~/temp.widget"],s:"_0.split(_1,2)"}]}}},{n:"index",x:{x:{r:["@this","~/temp.widget"],s:"_0.lastKey(_1)"}}}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"Auto layout containers position their children from top to bottom, left to right, along the x axis, with children wrapping below the tallest child on the line above. Manual layout containers must have x and y coordinates specified for each child, allowing overlap and defaulting to 0, 0.",t:13,g:1}],f:["Layout"]},{t:7,e:"span",f:[" ",{t:7,e:"select",m:[{t:73,v:"t",f:"false"},{n:"value",f:[{t:2,x:{r:[".layout"],s:"Array.isArray(_0)?\"manual\":\"auto\""}}],t:13},{n:["change"],t:70,f:{r:["@context","@node.value","@this",".widgets.length"],s:"[(_0).set(\".layout\",_1===\"manual\"?_2.fillArray(_3):undefined)]"}}],f:[{t:7,e:"option",m:[{n:"value",f:"auto",t:13}],f:["Auto"]}," ",{t:7,e:"option",m:[{n:"value",f:"manual",t:13}],f:["Manual"]}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"If bridging is enabled, the container can span multiple pages.",t:13,g:1}],f:["Bridge Breaks?"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:".bridge"}],t:13}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"If supplied, this expression is evaluated and the result is added to the context stack in which the container and its children are rendered.",t:13,g:1}],f:["Context ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".context\")]"}}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"span",f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".context"}],t:13},{n:"tabout",f:0,t:13}]}]}]}]}],"html-props":[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The html to appear in this HTML widget.",t:13,g:1}],f:["HTML ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".html\",{html:true})]"}}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"span",f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".html"}],t:13},{n:"tabout",f:0,t:13},{n:"template",f:0,t:13}]}]}]}]}],"label-props":[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The text to appear in this label. This is an expression, so literal text will need to be specified as a string expression.",t:13,g:1}],f:["Text ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Edit in Expression Editor",t:13,g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\".text\",{label:true})]"}}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"span",f:[{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:["click"],t:70,f:{r:["@context",".text","@this"],s:"[(_0).set(\".text\",_2.getPartStrings(_1)),_2.editExpr(\".text\",{label:true})]"}}],f:["Convert to Text"]}],n:50,x:{r:[".text"],s:"Array.isArray(_0)"}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:".text"}],t:13},{n:"tabout",f:0,t:13}]}]}],n:51,l:1}]}]}," ",{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The name to use to collect values that are computed in this label in each row. It is often useful to use the Format property to modify the display for this computed value, so that the raw value can be used for computations in the footer.",t:13,g:1}],f:["ID ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Remove aggregate id",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".id\",undefined)]"}}],f:[{t:8,r:"times"}]}],n:50,x:{r:[".id"],s:"_0!=null"}},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:"title",f:"Add aggregate id",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".id\",\"\")]"}}],f:["+"]}],n:51,l:1}," "]},{t:7,e:"span",f:[{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".id"}],t:13}]}],n:50,x:{r:[".id"],s:"_0!=null"}}]}]}],n:50,x:{r:["@this","~/temp.widget"],s:"_0.inRepeater(_1)"}}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The name of a formatter to apply to the computed Text value of this label.",t:13,g:1}],f:["Format ",{t:7,e:"button",m:[{t:13,n:"class",f:"hide",g:1}]},{t:4,f:[" ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Remove format",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".format\",undefined)]"}}],f:[{t:8,r:"times"}]}],n:50,x:{r:[".format"],s:"_0!=null"}},{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:"title",f:"Add format",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".format\",{})]"}}],f:["+"]}],n:51,l:1}," "]},{t:7,e:"span",f:[{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".format.name"}],t:13},{n:"style-width",f:"80%",t:13}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:"title",f:"Add parameter",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).push(\".format.args\",\"\")]"}}],f:["+"]}," ",{t:4,f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"."}],t:13},{n:"style-width",f:"80%",t:13}]},{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Remove parameter",t:13,g:1},{n:["click"],t:70,f:{r:["@context","@index"],s:"[(_0).splice(\"../\",_1,1)]"}}],f:[{t:8,r:"times"}]}],n:52,r:".format.args"}],n:50,x:{r:[".format"],s:"_0!=null"}}]}]}],"page-props":[],sure:[],left:[{t:7,e:"div",m:[{t:13,n:"class",f:"left properties",g:1},{n:"class-popped",t:13,f:[{t:2,r:"~/show.props"}]}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"properties-pull",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.toggle(\"~/show.props\")]"}}],f:[{t:7,e:"button",m:[{n:"class",f:["ico large ",{t:2,x:{r:["~/show.props"],s:"_0?\"left\":\"right\""}},"-arrow"],t:13}],f:[{t:8,r:"arrow"}]}]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"height: 3rem;",g:1},{t:13,n:"class",f:"header",g:1}],f:[{t:7,e:"h3",f:[{t:4,f:["Moving..."],n:50,r:"~/reparent"},{t:4,f:["Widgets"],n:51,l:1}]}," ",{t:4,f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"~/add"}],t:13},{n:["change"],t:70,f:{r:["@this","@node.value"],s:"[_0.addWidget(_1)]"}}],f:[{t:7,e:"option",f:["container"]}," ",{t:7,e:"option",f:["label"]}," ",{t:7,e:"option",f:["repeater"]}," ",{t:7,e:"option",f:["html"]}," ",{t:7,e:"option",f:["image"]}," ",{t:7,e:"option",f:["measured"]}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"add",g:1},{n:"title",f:["Add ",{t:2,r:"~/add"}," to ",{t:2,r:"~/temp.widget"}],t:13},{n:["click"],t:70,f:{r:["@this","~/add"],s:"[_0.addWidget(_1)]"}}],f:["+"]}],n:50,x:{r:["~/report.type","~/widget.type","~/temp.widget"],s:"_0!==\"delimited\"&&(_1===\"container\"||_2===\"report\")"}}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"copy\",undefined)]"}},{n:"title",f:"Cancel copy",t:13,g:1}],f:[{t:8,r:"copy",z:[{n:"cancel",x:{x:{r:[],s:"true"}}}]}]}],n:50,r:"~/copy"}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.set(\"reparent\",undefined)]"}},{n:"title",f:"Cancel move",t:13,g:1}],f:[{t:8,r:"reparent",z:[{n:"cancel",x:{x:{r:[],s:"true"}}}]}]}],n:50,r:"~/reparent"}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.treeScrollToActive()]"}},{n:"title",f:"Scroll active widget into view",t:13,g:1}],f:[{t:8,r:"scrollto"}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"scrolled-wrapper widget-tree",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"tree",g:1},{n:"scrolled",t:71},{n:["mouseout"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.hover\",\"\"),false]"}}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"node",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.widget"],s:"_0===\"report\""}}]},{n:"class-hover",t:13,f:[{t:2,x:{r:["~/temp.hover"],s:"_0===\"report\""}}]},{n:["click"],t:70,f:{r:["~/reparent","~/copy","@context","@this"],s:"[_0?_3.reparent((_2)):_1?_3.paste((_2)):_3.selectWidget(\"report\")]"}}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"line",g:1},{n:["mouseover"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.hover\",\"report\"),false]"}}],f:["Report"]}," ",{t:4,f:[{t:8,r:"delimited-fields"}],n:50,x:{r:["report.type"],s:"_0===\"delimited\""}},{t:4,f:[{t:8,r:"widget-tree"}],n:51,l:1}]}],n:54,r:"report"}]}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"header",g:1}],f:[{t:7,e:"h3",f:[{t:2,x:{r:["~/temp.name.0"],s:"_0.toUpperCase()"}},{t:2,x:{r:["~/temp.name"],s:"_0.substr(1)"}}," Properties"]}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"growy",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"sheet",g:1}],f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The name of this report, which is used for naming files. This is a template, so it must use mustache interpolators for variables.",t:13,g:1}],f:["Name ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.editExpr(\"report.name\",{template:true}),false]"}}],f:[{t:8,r:"pencil"}]}]},{t:7,e:"span",f:[" ",{t:7,e:"div",m:[{t:13,n:"style",f:"padding: 0; overflow: auto; max-height: 5em;",g:1}],f:[{t:7,e:"Editor",m:[{n:"src",f:[{t:2,r:"report.name"}],t:13},{n:"tabout",f:0,t:13},{n:"template",f:0,t:13}]}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"Paged reports are rendered in consectutive, fixed-size pages. Flowed reports are rendered in a continuous container, which does not allow height fit on immediate child widgets or negative offsets. Delimited reports render delimited text only e.g. CSV.",t:13,g:1}],f:["Type"]},{t:7,e:"span",f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"report.type"}],t:13}],f:[{t:7,e:"option",m:[{n:"value",f:"page",t:13}],f:["Paged"]}," ",{t:7,e:"option",m:[{n:"value",f:"flow",t:13}],f:["Continuous"]}," ",{t:7,e:"option",m:[{n:"value",f:"delimited",t:13}],f:["Delimited"]}]}]}]}," ",{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"When enabled, widgets will have as few inline styles as possible with common style sets combined into classes. This can significantly reduce the resuling HTML from a report run.",t:13,g:1}],f:["Combine styles into classes?"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:"report.classifyStyles"}],t:13}]}]}]}," ",{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The size of the page for this report.",t:13,g:1}],f:["Paper size"]},{t:7,e:"span",f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"report.size"}],t:13}],f:[{t:4,f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,r:"."}],t:13}],f:[{t:2,r:"@key"}]}],n:52,r:"~/pageSizes"}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The orientation of the page for this report.",t:13,g:1}],f:["Orientation"]},{t:7,e:"span",f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"report.orientation"}],t:13}],f:[{t:7,e:"option",f:["landscape"]}," ",{t:7,e:"option",f:["portrait"]}]}]}]}],n:50,x:{r:["report.type"],s:"_0===\"page\""}},{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"An optional width in rem for this report.",t:13,g:1}],f:["Width"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:"report.width"}],t:13}]}]}]}," ",{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"An optional width for this report if not specified directly in rem.",t:13,g:1}],f:["Paper size"]},{t:7,e:"span",f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"report.size"}],t:13}],f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,x:{r:[],s:"undefined"}}],t:13}],f:["(None)"]},{t:4,f:[{t:7,e:"option",m:[{n:"value",f:[{t:2,r:"."}],t:13}],f:[{t:2,r:"@key"}]}],n:52,r:"~/pageSizes"}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The orientation of the paper specifying the width for this report.",t:13,g:1}],f:["Orientation"]},{t:7,e:"span",f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"report.orientation"}],t:13}],f:[{t:7,e:"option",f:["landscape"]}," ",{t:7,e:"option",f:["portrait"]}]}]}]}],n:50,x:{r:["report.width"],s:"!_0"}}],n:51,l:1}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The base text size in rem for all widgets in this report.",t:13,g:1}],f:["Text Size"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:"~/report.font.size"}],t:13}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The base line hieght in rem for all widgets in this report.",t:13,g:1}],f:["Line Height"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"type",f:"number",t:13},{n:"value",f:[{t:2,r:"~/report.font.line"}],t:13}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The base font family for all widgets in this report.",t:13,g:1}],f:["Font Family"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"~/report.font.family"}],t:13}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The base text color for all widgets in this report.",t:13,g:1}],f:["Text Color"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"~/report.font.color"}],t:13}]}]}]}],n:50,x:{r:["report.type"],s:"_0!==\"delimited\""}},{t:4,f:[{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The string to render between records, defaulting to '\\n'.",t:13,g:1}],f:["Record Delimiter"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"temp.record"}],t:13}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The string to render between fields, defaulting to ','.",t:13,g:1}],f:["Field Delimiter"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"temp.field"}],t:13}]}]}]}," ",{t:7,e:"label",f:[{t:7,e:"span",m:[{n:"title",f:"The quote character to render around field values, defaulting to none.",t:13,g:1}],f:["Quote"]},{t:7,e:"span",f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:"temp.quote"}],t:13}]}]}]}],n:51,l:1}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"header",g:1}],f:[{t:7,e:"h3",m:[{n:"title",f:"Define parameters that can be collected, passed into the report, and referenced as !name",t:13,g:1}],f:["Parameters"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"add",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.push(\"report.parameters\",{})]"}},{n:"title",f:"Add parameter",t:13,g:1}],f:["+"]}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"parameter head",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"param-name",g:1}],f:["Name"]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"param-type",g:1}],f:["Type"]}," ",{t:7,e:"div",m:[{t:13,n:"style",f:"width: 30%;",g:1},{t:13,n:"class",f:"param-require",g:1}],f:["Require"]}]}],n:50,r:"report.parameters"}," ",{t:7,e:"div",f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"parameter",g:1},{n:["focusin"],t:70,f:{r:["@this","@context"],s:"[_0.editParam((_1))]"}}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"param-name",g:1}],f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".name"}],t:13}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"param-type",g:1}],f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".type"}],t:13}],f:[{t:8,r:"types"}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"param-require",g:1}],f:[{t:7,e:"input",m:[{n:"type",f:"checkbox",t:13},{n:"checked",f:[{t:2,r:".required"}],t:13}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"param-btn",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@this","@keypath","@context","@index"],s:"[_0.checkLink(\"param\",_1),(_2).splice(\"../\",_3,1)]"}}],f:[{t:8,r:"times"}]}]}]}],n:52,r:"report.parameters"}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"header",g:1}],f:[{t:7,e:"h3",m:[{n:"title",f:"Define data sources that are available in the designer",t:13,g:1}],f:["Provided Sources"]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"add",g:1},{n:["click"],t:70,f:{r:["~/actions"],s:"[_0.provideSource()]"}},{n:"title",f:"Add provided source",t:13,g:1}],f:["+"]}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"src head",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"src-name",g:1}],f:["Name"]}]}],n:50,r:"~/sources"}," ",{t:7,e:"div",f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"src",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"src-name",g:1}],f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".name"}],t:13},{n:"disabled",f:[{t:2,x:{r:["~/showProjects"],s:"_0===false"}}],t:13}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"src-btn",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:"title",f:"Import data...",t:13,g:1},{n:["click"],t:70,f:{r:["~/actions","@context"],s:"[_0.editProvidedSource((_1))]"}}],f:[{t:8,r:"pencil"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:"title",f:"Log data to console...",t:13,g:1},{n:["click"],t:70,f:{r:["@this","."],s:"[_0.logData(_1)]"}}],f:[{t:8,x:{r:[],s:"\"console\""}}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico large",g:1},{n:["click"],t:70,f:{r:["@this","@keypath","@context","@index"],s:"[_0.checkLink(\"import\",_1),(_2).splice(\"../\",_3,1)]"}}],f:[{t:8,r:"times"}]}]}]}],n:52,r:"~/sources"}]}],n:50,r:"~/sources"},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"style",f:"justify-content: center;",g:1},{t:13,n:"class",f:"header",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"plain",g:1},{n:["click"],t:70,f:{r:["~/actions"],s:"[_0.provideSource()]"}},{n:"title",f:"Create a new source of data to reference from a report source",t:13,g:1}],f:["Provide Source"]}]}],n:51,l:1}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"header",g:1}],f:[{t:7,e:"h3",m:[{n:"title",f:["Define ",{t:4,f:["the data source"],n:50,x:{r:["report.type"],s:"_0===\"delimited\""}},{t:4,f:["data sources"],n:51,l:1}," that will be available in the report and will pull from provided sources or a base value"],t:13}],f:["Source",{t:4,f:["s"],n:50,x:{r:["report.type"],s:"_0!==\"delimited\""}}]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"add",g:1},{n:["click"],t:70,f:{r:["@this"],s:"[_0.push(\"report.sources\",{name:\"\",parameters:{}})]"}},{n:"title",f:"Add source",t:13,g:1}],f:["+"]}],n:50,x:{r:["report.type","report.sources.length"],s:"_0!==\"delimited\"||_1<1"}}]}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"src head",g:1}],f:[{t:7,e:"div",m:[{t:13,n:"style",f:"width: 100%;",g:1},{t:13,n:"class",f:"src-name",g:1}],f:["Name"]}]}],n:50,r:"report.sources.length"}," ",{t:7,e:"div",f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"src",g:1},{n:["focusin"],t:70,f:{r:["@this","@context"],s:"[_0.editReportSrc((_1))]"}}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"rsrc-name",g:1}],f:[{t:7,e:"input",m:[{n:"value",f:[{t:2,r:".name"}],t:13}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"rsrc-src",g:1}],f:[{t:7,e:"select",m:[{n:"value",f:[{t:2,r:".source"}],t:13}],f:[{t:4,f:[{t:7,e:"option",f:[{t:2,r:".name"}]}],n:52,r:"~/sources"}]}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"rsrc-btn",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:["click"],t:70,f:{r:["@this","@keypath","@context","@index"],s:"[_0.checkLink(\"source\",_1),(_2).splice(\"../\",_3,1)]"}}],f:[{t:8,r:"times"}]}]}]}],n:52,r:"report.sources"}]}],n:50,x:{r:["~/temp.widget"],s:"_0===\"report\""}},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"scrolled-wrapper",g:1}],f:[{t:7,e:"div",m:[{n:"scrolled",t:71}],f:[{t:7,e:"div",m:[{t:13,n:"class",f:"sheet",g:1}],f:[{t:4,f:[{t:8,x:{r:[".type"],s:"_0+\"-props\""}}," ",{t:8,r:"widget-props"}],n:54,r:"~/widget"}]}]}]}],n:50,r:"~/widget",l:1}]}]}],n:50,r:"~/temp.widget"},{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"placeholder",g:1}],f:["Click on a Widget"]}],n:51,l:1}]}],"delimited-fields":[{t:7,e:"div",m:[{t:13,n:"class",f:"delimited children",g:1}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"node",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["@keypath","~/temp.expr.path"],s:"_0===_1"}}]},{n:"class-hover",t:13,f:[{t:2,x:{r:["@keypath","~/temp.expr.hover"],s:"_0===_1"}}]},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.editExpr((_1))]"}}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"line",g:1},{n:["mouseover"],t:70,f:{r:["@this","@keypath"],s:"[_0.set(\"temp.expr.hover\",_1),false]"}},{n:["mouseout"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.expr.hover\",\"\"),false]"}}],f:[{t:7,e:"span",f:[{t:2,x:{r:["@index"],s:"_0+1"}},". ",{t:4,f:[{t:2,rx:{r:"^^/headers",m:[{t:30,n:"@index"}]}}," (",{t:2,r:"."},")"],n:50,rx:{r:"^^/headers",m:[{t:30,n:"@index"}]}},{t:4,f:[{t:2,r:"."}],n:51,l:1}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico field up-arrow",g:1},{n:"title",f:"Move up (hold the shift key to move to first)",t:13,g:1},{n:"disabled",f:[{t:2,x:{r:["@index"],s:"_0===0"}}],t:13},{n:["click"],t:70,f:{r:["@this","@context","~/report.headers","@index","@event.shiftKey"],s:"[_0.moveUp((_1),[\"../\",_2?\"~/report.headers\":undefined],_3,_4),false]"}}],f:[{t:8,r:"arrow"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico field down-arrow",g:1},{n:"title",f:"Move down (hold the shift key to move to last)",t:13,g:1},{n:"disabled",f:[{t:2,x:{r:["@index","@last"],s:"_0===_1"}}],t:13},{n:["click"],t:70,f:{r:["@this","@context","~/report.headers","@index","@event.shiftKey"],s:"[_0.moveDown((_1),[\"../\",_2?\"~/report.headers\":undefined],_3,_4),false]"}}],f:[{t:8,r:"arrow"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico field remove",g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.removeWidget((_1))]"}}],f:[{t:8,r:"times"}]}]}]}],n:52,r:".fields"}]}],"widget-tree":[{t:7,e:"div",m:[{t:13,n:"class",f:"children",g:1}],f:[{t:4,f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"node",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.widget","@keypath"],s:"_0===_1"}}]},{n:"class-hover",t:13,f:[{t:2,x:{r:["~/temp.hover","@keypath"],s:"_0===_1"}}]},{n:["click"],t:70,f:{r:["~/reparent","~/copy",".type","@context","@this","@keypath"],s:"[_0&&_2===\"container\"&&_5.indexOf(_0.resolve())===-1?_4.reparent((_3)):_1&&_2===\"container\"?_4.paste((_3)):_4.selectWidget(_5),false]"}}],f:[{t:7,e:"span",m:[{n:"class",f:["line ",{t:2,x:{r:["@this","@keypath"],s:"_0.getNestLevel(_1)"}}],t:13},{n:["mouseover"],t:70,f:{r:["@this","@keypath"],s:"[_0.set(\"temp.hover\",_1),false]"}}],f:[{t:7,e:"span",f:["group ",{t:2,x:{r:["@index"],s:"_0+1"}}]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"actions",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico up-arrow",g:1},{n:"disabled",f:[{t:2,x:{r:["@index"],s:"_0===0"}}],t:13},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.moveUp((_1),[\"../\",\"^^/groupEnds\"]),false]"}},{n:"title",f:"Move up",t:13,g:1}],f:[{t:8,r:"arrow"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico down-arrow",g:1},{n:"disabled",f:[{t:2,x:{r:["@index","@last"],s:"_0===_1"}}],t:13},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.moveDown((_1),[\"../\",\"^^/groupEnds\"]),false]"}},{n:"title",f:"Move down",t:13,g:1}],f:[{t:8,r:"arrow"},">"]}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico remove",g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.removeWidget((_1)),false]"}},{n:"title",f:"Remove group",t:13,g:1}],f:[{t:8,r:"times"}]}]}," ",{t:8,r:"widget-tree"}]}],n:52,r:".group"}],n:50,x:{r:[".type",".group"],s:"_0===\"repeater\"&&_1"}}," ",{t:4,f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"node",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.widget","@keypath"],s:"_0===_1"}}]},{n:"class-hover",t:13,f:[{t:2,x:{r:["~/temp.hover","@keypath"],s:"_0===_1"}}]},{n:["click"],t:70,f:{r:["~/reparent","~/copy",".type","@context","@this","@keypath"],s:"[_0&&_2===\"container\"&&_5.indexOf(_0.resolve())===-1?_4.reparent((_3)):_1&&_2===\"container\"?_4.paste((_3)):_4.selectWidget(_5),false]"}},{n:["mouseover"],t:70,f:{r:["@this","@keypath"],s:"[_0.set(\"temp.hover\",_1),false]"}}],f:[{t:7,e:"span",m:[{n:"class",f:["line ",{t:2,x:{r:["@this","@keypath"],s:"_0.getNestLevel(_1)"}}],t:13}],f:[{t:7,e:"span",f:[{t:2,r:"@key"}]}," ",{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico remove",g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.removeWidget((_1)),false]"}},{n:"title",f:"Remove container",t:13,g:1}],f:[{t:8,r:"times"}]}],n:50,x:{r:["@key","../type"],s:"_0!==\"row\"||_1!==\"repeater\""}}]}," ",{t:8,r:"widget-tree"}]}],n:50,x:{r:[".type"],s:"_0===\"container\""}}],n:52,r:"."}," ",{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"node",g:1},{n:"class-active",t:13,f:[{t:2,x:{r:["~/temp.widget","@keypath"],s:"_0===_1"}}]},{n:"class-hover",t:13,f:[{t:2,x:{r:["~/temp.hover","@keypath"],s:"_0===_1"}}]},{n:"class-moving",t:13,f:[{t:2,x:{r:["~/reparent","@keypath","~/copy"],s:"_0&&_1===_0.resolve()||_2&&_1===_2.resolve()"}}]},{n:["click"],t:70,f:{r:["~/reparent","~/copy",".type","@context","@this","@keypath"],s:"[_0&&_0.resolve()===_5?_4.set(\"reparent\",undefined):_0&&_2===\"container\"&&_5.indexOf(_0.resolve())===-1?_4.reparent((_3)):_1&&_2===\"container\"?_4.paste((_3)):_4.selectWidget(_5),false]"}},{t:4,f:[{n:["mouseover"],t:70,f:{r:["@this","@keypath"],s:"[_0.set(\"temp.hover\",_1),false]"}}],n:50,x:{r:[".type","@keypath","~/reparent"],s:"!_2||_0===\"container\"&&_1.indexOf(_2.resolve())===-1"}}],f:[{t:7,e:"span",m:[{n:"class",f:["line ",{t:2,x:{r:["@this","@keypath"],s:"_0.getNestLevel(_1)"}}],t:13}],f:[{t:4,f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico expander",g:1},{n:["click"],t:70,f:{r:["@this","escapeKey","@keypath","~/temp.tree"],s:"[_0.set(\"temp.tree.\"+_1(_2),_3&&_3[_2]===false?true:false),false]"}}],f:[{t:4,f:["-"],n:50,x:{r:["@keypath","~/temp.tree"],s:"_1[_0]!==false"}},{t:4,f:["+"],n:51,l:1}]}],n:50,x:{r:[".widgets.length",".type"],s:"_0||_1===\"repeater\""}}," ",{t:7,e:"span",f:[{t:2,r:".type"},{t:8,r:"widget-info"}]}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"actions",g:1}],f:[{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:["Copy ",{t:2,r:".type"}],t:13},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.set(\"copy\",(_1)),false]"}}],f:[{t:8,r:"copy"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico",g:1},{n:"title",f:"Move to another container",t:13,g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.set(\"reparent\",(_1)),false]"}}],f:[{t:8,r:"reparent"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico up-arrow",g:1},{n:"title",f:["Move up (hold the shift key to move to first",{t:4,f:[", hold the control key to swap layout coordinate too"],n:50,x:{r:["^^/layout"],s:"Array.isArray(_0)"}},")"],t:13},{n:"disabled",f:[{t:2,x:{r:["@index"],s:"_0===0"}}],t:13},{n:["click"],t:70,f:{r:["@this","@context","@event.ctrlKey","^^/layout","@index","@event.shiftKey"],s:"[_0.moveUp((_1),[\"../\",!_2&&Array.isArray(_3)?\"^^/layout\":undefined],_4,_5),false]"}}],f:[{t:8,r:"arrow"}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico down-arrow",g:1},{n:"title",f:["Move down (hold the shift key to move to last",{t:4,f:[", hold the control key to swap layout coordinates too"],n:50,x:{r:["^^/layout"],s:"Array.isArray(_0)"}},")"],t:13},{n:"disabled",f:[{t:2,x:{r:["@index","@last"],s:"_0===_1"}}],t:13},{n:["click"],t:70,f:{r:["@this","@context","@event.ctrlKey","^^/layout","@index","@event.shiftKey"],s:"[_0.moveDown((_1),[\"../\",!_2&&Array.isArray(_3)?\"^^/layout\":undefined],_4,_5),false]"}}],f:[{t:8,r:"arrow"}]}]}," ",{t:7,e:"button",m:[{t:13,n:"class",f:"ico remove",g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.removeWidget((_1)),false]"}},{n:"title",f:["Remove ",{t:2,r:".type"}],t:13}],f:[{t:8,r:"times"}]}],n:50,x:{r:["~/reparent"],s:"!_0"}}]}," ",{t:4,f:[{t:8,r:"widget-tree"}],n:50,x:{r:["@keypath","~/temp.tree"],s:"_1[_0]!==false"}}]}],n:52,r:".widgets"}]}],warning:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"M 7.9999999,1.3419993 A 0.51954981,0.51954981 0 0 0 7.5501881,1.6016783 L 0.46200598,13.878401 A 0.51954981,0.51954981 0 0 0 0.91181778,14.658 H 15.088182 a 0.51954981,0.51954981 0 0 0 0.449812,-0.779599 L 8.4498118,1.6016783 A 0.51954981,0.51954981 0 0 0 7.9999999,1.3419993 Z m 0,1.5580761 6.1879971,10.7186456 H 1.8120026 Z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"M 7.5117187,5.7675781 V 10.755859 H 8.4882813 V 5.7675781 Z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"m 7.5097656,11.556641 v 1.058593 h 0.9804688 v -1.058593 z",t:13,g:1}]}]}],autosize:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"m 7.8643604,1.1461781 c -0.1252288,1.027e-4 -0.2452523,0.050113 -0.333504,0.13896 L 3.8599966,4.9559978 c -0.1847627,0.1839512 -0.1847627,0.4830568 0,0.667008 0.1836871,0.1832173 0.4810049,0.1832173 0.664692,0 L 7.3942123,2.7534819 V 14.081037 L 4.5246886,11.213829 c -0.1836871,-0.183218 -0.4810049,-0.183218 -0.664692,0 -0.1832174,0.183687 -0.1832174,0.481004 0,0.664692 l 3.6708598,3.673175 c 0.088631,0.088 0.1892895,0.136645 0.333504,0.136645 0.1442144,0 0.2225519,-0.0257 0.3335039,-0.136645 0.1109522,-0.110954 3.6708597,-3.673175 3.6708597,-3.673175 0.183218,-0.183688 0.183218,-0.481005 0,-0.664692 -0.183951,-0.184763 -0.483057,-0.184763 -0.667008,0 L 8.3345084,14.081037 V 2.7534819 l 2.8672076,2.8695239 c 0.183951,0.1847627 0.483057,0.1847627 0.667008,0 0.184763,-0.1839512 0.184763,-0.4830568 0,-0.667008 L 8.1978643,1.2851381 C 8.1096126,1.1962906 7.9895891,1.1462808 7.8643604,1.1461781 Z",t:13,g:1}]}]}],times:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"m 3.081157,3.2367593 a 0.39687499,0.39687499 0 0 0 -0.28125,0.1171875 0.39687499,0.39687499 0 0 0 0,0.5605469 L 7.3038132,8.4184 2.799907,12.920353 a 0.39687499,0.39687499 0 0 0 0,0.560547 0.39687499,0.39687499 0 0 0 0.5625,0 L 7.8643601,8.9789468 12.368266,13.4809 a 0.39687499,0.39687499 0 0 0 0.560547,0 0.39687499,0.39687499 0 0 0 0,-0.560547 L 8.424907,8.4184 12.928813,3.9144937 a 0.39687499,0.39687499 0 0 0 0,-0.5605469 0.39687499,0.39687499 0 0 0 -0.560547,0 L 7.8643601,7.8558999 3.362407,3.3539468 A 0.39687499,0.39687499 0 0 0 3.081157,3.2367593 Z",t:13,g:1}]}]}],eye:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"M 8.0292969,3.84375 C 5.8187216,3.7959779 3.2719166,4.828582 0.6875,7.9414062 L 0.47851563,8.1933594 0.68554687,8.4472656 C 4.2213376,12.771626 7.6072279,13.362529 10.207031,12.503906 12.806835,11.645284 14.588183,9.4664365 15.279297,8.4121094 L 15.449219,8.1542969 15.240234,7.9257812 C 14.56764,7.1977999 12.721311,5.0903713 10.117188,4.2148437 9.4661566,3.9959619 8.7661553,3.859674 8.0292969,3.84375 Z M 8.0019531,4.6191406 C 8.6565753,4.6408129 9.2772607,4.769772 9.8632813,4.9667969 12.042444,5.6994492 13.625228,7.3762655 14.40625,8.2207031 13.700218,9.2262323 12.130956,11.032675 9.9589844,11.75 7.7038396,12.494794 4.8499214,12.067539 1.5566406,8.1992188 3.9323632,5.4612889 6.1082738,4.5564473 8.0019531,4.6191406 Z",t:13,g:1}]}," ",{t:7,e:"circle",m:[{n:"r",f:"3.5391803",t:13,g:1},{n:"cy",f:"8.3395138",t:13,g:1},{n:"cx",f:"8.0542507",t:13,g:1},{n:"fill",f:"#000",t:13,g:1}]}]}],play:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"M 2.5273438,2.1328125 A 0.39691468,0.39691468 0 0 0 2.328125,2.4765625 V 14.357422 a 0.39691468,0.39691468 0 0 0 0.5957031,0.34375 L 13.201172,8.7675781 a 0.39691468,0.39691468 0 0 0 0,-0.6875 L 2.9238281,2.1328125 a 0.39691468,0.39691468 0 0 0 -0.3964843,0 z m 0.5957031,1.03125 9.0878911,5.2597656 -9.0878911,5.2460939 z",t:13,g:1}]}]}],pencil:[{t:7,e:"svg",m:[{t:13,n:"class",f:"pencil",g:1},{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"m 10.574807,3.7181493 1.230348,-1.230348 c 0.786061,-0.1047571 2.169305,1.3270952 2.115927,2.0909526 l -1.24767,1.2476704 z m 0,0 L 12.677529,5.825142 5.136945,13.365724 3.5226704,13.820162 1.9083957,14.2746 2.5400804,12.67292 3.1717651,11.07124 10.574806,3.718149 Z",t:13,g:1}]}]}],console:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"m 2.5800781,4.140625 a 0.39687499,0.39687499 0 0 0 -0.2773437,0.1230469 0.39687499,0.39687499 0 0 0 0.011719,0.5625 L 5.9921875,8.3320313 2.3085938,12.015625 a 0.39687499,0.39687499 0 0 0 0,0.5625 0.39687499,0.39687499 0 0 0 0.5605468,0 L 6.8417969,8.6054688 a 0.39687499,0.39687499 0 0 0 0.00391,-0.00391 0.39687499,0.39687499 0 0 0 0.00195,-0.00195 0.39687499,0.39687499 0 0 0 0.00977,-0.015625 0.39687499,0.39687499 0 0 0 0.076172,-0.1425781 0.39687499,0.39687499 0 0 0 0.011719,-0.060547 A 0.39687499,0.39687499 0 0 0 6.9433594,8.25 0.39687499,0.39687499 0 0 0 6.9316406,8.1992188 0.39687499,0.39687499 0 0 0 6.8417969,8.0449219 a 0.39687499,0.39687499 0 0 0 -0.00391,0 0.39687499,0.39687499 0 0 0 -0.00391,-0.00781 L 2.8632813,4.25 A 0.39687499,0.39687499 0 0 0 2.5800781,4.140625 Z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"m 7.0917969,11.767578 v 0.792969 h 6.4453121 v -0.792969 z",t:13,g:1}]}]}],switch:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"m 11.226563,3.7128906 -0.707032,0.7070313 1.642578,1.6445312 H 3.046875 v 1 h 11.529297 z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"M 1.1855469,8.9433594 4.5351562,12.292969 5.2421875,11.585938 3.5996094,9.9433594 h 9.1171876 v -1 z",t:13,g:1}]}]}],scrollto:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"m 7.9921875,0.95883941 c -0.250488,-0.00872 -0.5000001,0.18861599 -0.5,0.59179689 0,2.4565678 0.014046,5.4488885 0.015625,5.7792969 -0.414832,-0.4134912 -1.618944,-1.609179 -3.0527344,-3.0429688 -0.208715,-0.2087145 -0.833715,0.4162855 -0.625,0.625 L 8,9.0818863 12.169922,4.9119644 c 0.208822,-0.2088228 -0.41813,-0.8357759 -0.626953,-0.6269531 -1.010297,1.0102962 -2.5173079,2.5148582 -3.0351565,3.03125 -0.00152,-0.3342485 -0.013672,-3.072983 -0.013672,-5.71875 0,-0.4162448 -0.2514651,-0.62995161 -0.5019531,-0.63867189 z M 8.28125,7.5408707 C 8.2531767,7.5688634 8,7.8221207 8,7.8221207 c 0,0 -0.257095,-0.255216 -0.2792969,-0.2773438 z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"m 1.9238281,10.37163 v 2 H 14.076172 v -2 z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"m 1.9238281,13.169922 v 2 H 14.076172 v -2 z",t:13,g:1}]}]}],reparent:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"m 7.717269,6.5496963 c 1.1791128,1.1791128 3.537021,3.5439517 3.537021,3.5439517 0,0 -1.8715903,1.878096 -3.536918,3.543424 -0.2087145,0.208715 0.4174295,0.834858 0.626144,0.626143 1.739959,-1.739959 4.170103,-4.170102 4.170103,-4.170102 0,0 -2.8836136,-2.8836169 -4.170102,-4.1701053 C 8.1346942,5.7141849 7.5084462,6.3408735 7.717269,6.5496963 Z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"M 1.25,1.265625 V 3.1953125 H 3.1816406 V 1.265625 Z m 3.8613281,0 V 3.1953125 H 7.0410156 V 1.265625 Z m 3.859375,0 V 3.1953125 H 10.900391 V 1.265625 Z m 3.8593749,0 V 3.1953125 H 14.75 V 1.265625 Z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"m 3.5527344,4 c 0,1.570084 0,5.1494183 0,5.1494183 0,0.8840967 0.4590976,1.4746067 1.428392,1.4746067 l 7.3118426,-0.0166 -0.0039,-1.0000001 -7.2599976,0.014648 c -0.3569634,0 -0.476331,-0.1906315 -0.476331,-0.5277838 0,0 0,-3.4980046 0,-5.0942891 0,-0.3333353 -1.000006,-0.3333353 -1.000006,0 z",t:13,g:1}]}," ",{t:4,f:[{t:7,e:"path",m:[{n:"d",f:"M 2.5878906 1.7539062 L 1.3984375 2.9433594 L 6.7871094 8.3320312 L 1.3984375 13.720703 L 2.5878906 14.912109 L 7.9765625 9.5234375 L 13.367188 14.912109 L 14.556641 13.720703 L 9.1679688 8.3320312 L 14.556641 2.9433594 L 13.367188 1.7539062 L 7.9765625 7.1425781 L 2.5878906 1.7539062 z",t:13,g:1},{n:"opacity",f:"0.5",t:13,g:1},{n:"fill",f:"red",t:13,g:1}]}],n:50,r:"cancel"}]}],copy:[{t:7,e:"svg",m:[{n:"viewBox",f:"0 0 16 16",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"m 2.5507813,0.02148438 c -1.0111865,0 -1.84570318,0.84012077 -1.84570318,1.84960932 v 9.7968753 c 0,1.009488 0.83451588,1.847656 1.84570318,1.847656 H 6.4335937 V 4.4023437 c 0,-0.2045815 0.1433298,-0.3457031 0.3496094,-0.3457031 H 11.121094 V 1.8710937 c 0,-1.00948872 -0.83647,-1.84960932 -1.8476565,-1.84960932 z m 0,1.50000002 h 6.7226562 c 0.2045818,0 0.3476563,0.1433291 0.3476563,0.3496093 V 2.5566406 H 6.7832031 c -1.0094885,0 -1.8496094,0.8345165 -1.8496094,1.8457031 V 12.015625 H 2.5507813 c -0.2045816,0 -0.3457032,-0.141378 -0.3457032,-0.347656 V 1.8710937 c 0,-0.2062803 0.1411208,-0.3496093 0.3457032,-0.3496093 z",t:13,g:1}]}," ",{t:7,e:"path",m:[{n:"d",f:"m 6.7832031,2.5566406 c -1.0104117,0 -1.8476562,0.8372445 -1.8476562,1.8476563 v 9.7968751 c 0,1.010412 0.8372445,1.847656 1.8476562,1.847656 h 6.7226559 c 1.010412,0 1.845704,-0.837245 1.845704,-1.847656 V 4.4042969 c 0,-1.010411 -0.835292,-1.8476563 -1.845704,-1.8476563 z m 0,1.5 h 6.7226559 c 0.205359,0 0.345703,0.1422974 0.345704,0.3476563 v 9.7968751 c 0,0.20536 -0.140345,0.347656 -0.345704,0.347656 H 6.7832031 c -0.205358,0 -0.3476562,-0.142297 -0.3476562,-0.347656 V 4.4042969 c 0,-0.205358 0.1422982,-0.3476563 0.3476562,-0.3476563 z",t:13,g:1}]}," ",{t:4,f:[{t:7,e:"path",m:[{n:"d",f:"M 2.5878906 1.7539062 L 1.3984375 2.9433594 L 6.7871094 8.3320312 L 1.3984375 13.720703 L 2.5878906 14.912109 L 7.9765625 9.5234375 L 13.367188 14.912109 L 14.556641 13.720703 L 9.1679688 8.3320312 L 14.556641 2.9433594 L 13.367188 1.7539062 L 7.9765625 7.1425781 L 2.5878906 1.7539062 z",t:13,g:1},{n:"opacity",f:"0.5",t:13,g:1},{n:"fill",f:"red",t:13,g:1}]}],n:50,r:"cancel"}]}],arrow:[{t:7,e:"svg",m:[{n:"viewBox",f:"4 7 16 10",t:13,g:1}],f:[{t:7,e:"path",m:[{n:"d",f:"M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z",t:13,g:1}]}]}],"widget-info":[{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"widget-info",g:1}],f:[{t:2,r:".text"}]}],n:50,x:{r:[".type"],s:"_0===\"label\""}},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"widget-info",g:1}],f:["(",{t:2,r:".widgets.length"}," children)"]}],n:50,r:".widgets.length",l:1}],repeater:[{t:7,e:"div",m:[{t:13,n:"class",f:"bar",g:1},{t:4,f:[{n:["mouseover"],t:70,f:{r:["@this","@keypath"],s:"[_0.set(\"temp.hover\",_1),false]"}}],n:51,r:"~/reparent"},{n:["mouseout"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.hover\",\"\"),false]"}}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"name",g:1}],f:["Repeater"]}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@context","@this"],s:"[(_0).set(\".group\",undefined),(_0).set(\".groupEnds\",[true]),_1.unlink(\"widget\"),_1.set(\"temp.widget\",undefined)]"}}],f:["Remove Group"]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).push(\".group\",{type:\"container\"}),(_0).splice(\".groupEnds\",-1,0,true)]"}}],f:["Add Group Level"]}],n:50,r:".group"},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".group\",[{type:\"container\"}]),(_0).set(\".groupEnds\",[true,true])]"}}],f:["Add Group"]}],n:51,l:1}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@context","@this"],s:"[(_0).set(\".header\",undefined),_1.unlink(\"widget\"),_1.set(\"temp.widget\",undefined)]"}}],f:["Remove Header"]}],n:50,r:".header"},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".header\",{type:\"container\"})]"}}],f:["Add Header"]}],n:51,l:1}," ",{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@context","@this"],s:"[(_0).set(\".footer\",undefined),_1.unlink(\"widget\"),_1.set(\"temp.widget\",undefined)]"}}],f:["Remove Footer"]}],n:50,r:".footer"},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"btn",g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).set(\".footer\",{type:\"container\"})]"}}],f:["Add Footer"]}],n:51,l:1}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"widgets",g:1}],f:[{t:4,f:[{t:4,f:[{t:8,r:"widget",z:[{n:"label",x:{x:{r:["@index"],s:"\"Group Header \"+(_0+1)"}}}]}],n:52,r:".group"}],n:50,r:".group"}," ",{t:4,f:[{t:4,f:[{t:8,r:"widget",z:[{n:"label",x:{x:{r:[],s:"\"Header\""}}}]}],n:54,r:".header"}],n:50,r:".header"}," ",{t:4,f:[{t:2,x:{r:["@context"],s:"(_0).set(\".row\",{type:\"container\"})&&\"\""}}],n:50,x:{r:[".row"],s:"!_0"}}," ",{t:4,f:[{t:8,r:"widget",z:[{n:"label",x:{x:{r:[],s:"\"Row\""}}}]}],n:54,r:".row"}," ",{t:4,f:[{t:4,f:[{t:8,r:"widget",z:[{n:"label",x:{x:{r:[],s:"\"Footer\""}}}]}],n:54,r:".footer"}],n:50,r:".footer"}]}],html:[{t:19,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"preview btn",g:1},{n:"title",f:"Toggle Preview",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).toggle(\"ctx.preview\")]"}}],f:[{t:8,r:"eye"}]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"autosize btn",g:1},{n:"title",f:"Autosize Block",t:13,g:1},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.autosizeHtml((_1))]"}}],f:[{t:8,r:"autosize"}]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"content",g:1},{t:4,f:[{n:["mouseover"],t:70,f:{r:["@this","@keypath"],s:"[_0.set(\"temp.hover\",_1),false]"}}],n:51,r:"~/reparent"},{n:["mouseout"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.hover\",\"\"),false]"}},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.editExpr((_1).resolve(\".html\"),{html:true})]"}},{n:"class-preview",t:13,f:[{t:2,r:"ctx.preview"}]},{t:4,f:[{n:"style-font-size",f:[{t:2,x:{r:[".font.size"],s:"_0||0.83"}},"rem"],t:13},{n:"style-line-height",f:[{t:2,x:{r:[".font.line",".font.size"],s:"_0===0?\"initial\":(_0||_1||1)+\"rem\""}}],t:13}],n:50,r:"ctx.preview"},{t:4,f:[{n:"style",f:"height: auto;",t:13}],n:50,r:"ctx.autosize"},{t:4,f:[{n:"title",f:[{t:2,r:".html"}],t:13}],n:50,x:{r:[".html.length"],s:"_0<50"}}],f:[{t:4,f:[{t:3,r:".html"}],n:50,r:"ctx.preview"},{t:4,f:[{t:7,e:"Viewer",m:[{t:13,n:"style",f:"overflow: hidden;",g:1},{n:"src",f:[{t:2,r:".html"}],t:13},{n:"template",f:"true",t:13,g:1}]}],n:51,l:1}]}],n:54,z:[{n:"ctx",x:{r:"@local"}}]}],image:[{t:19,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"content",g:1},{t:4,f:[{n:["mouseover"],t:70,f:{r:["@this","@keypath"],s:"[_0.set(\"temp.hover\",_1),false]"}}],n:51,r:"~/reparent"},{n:["mouseout"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.hover\",\"\"),false]"}},{n:"title",f:[{t:2,r:".url"}],t:13}],f:[{t:4,f:[{t:7,e:"div",m:[{n:"style",f:["width: 100%; height: 100%; background-image: url('",{t:2,x:{r:["@this",".url"],s:"_0.evalExpr(_1)"}},"'); background-repeat: no-repeat; background-size: ",{t:2,x:{r:[".fit"],s:"!_0?\"contain\":_0===\"stretch\"?\"100% 100%\":\"cover\""}},"; background-position: center;"],t:13}]}],n:50,r:"ctx.preview"},{t:4,f:["IMG"],n:51,l:1}]}," ",{t:7,e:"span",m:[{t:13,n:"class",f:"preview btn",g:1},{n:"title",f:"Toggle Preview",t:13,g:1},{n:["click"],t:70,f:{r:["@context"],s:"[(_0).toggle(\"ctx.preview\")]"}}],f:[{t:8,r:"eye"}]}],n:54,z:[{n:"ctx",x:{r:"@local"}}]}],label:[{t:7,e:"span",m:[{t:13,n:"class",f:"content",g:1},{t:4,f:[{n:["mouseover"],t:70,f:{r:["@this","@keypath"],s:"[_0.set(\"temp.hover\",_1),false]"}}],n:51,r:"~/reparent"},{n:["mouseout"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.hover\",\"\"),false]"}},{n:"title",f:[{t:2,r:".text"}],t:13}],f:[{t:4,f:[{t:4,f:[{t:4,f:[{t:2,r:"."}],n:50,x:{r:["."],s:"typeof _0===\"string\""}},{t:4,f:[{t:7,e:"span",m:[{t:4,f:[{n:"style",f:[{t:2,x:{r:["@this","."],s:"_0.calcFont(_1)"}}],t:13}],n:50,r:".font"}],f:[{t:2,r:".text"}]}],n:51,l:1}],n:52,r:".text"}],n:50,x:{r:[".text"],s:"Array.isArray(_0)"}},{t:4,f:[{t:7,e:"Viewer",m:[{t:13,n:"style",f:"overflow: hidden;",g:1},{n:"src",f:[{t:2,r:".text"}],t:13}]}],n:51,l:1}]}],container:[{t:19,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"bar",g:1},{n:["mouseover"],t:70,f:{r:["@this","@keypath"],s:"[_0.set(\"temp.hover\",_1),false]"}},{n:["mouseout"],t:70,f:{r:["@this"],s:"[_0.set(\"temp.hover\",\"\"),false]"}}],f:[{t:7,e:"span",m:[{t:13,n:"class",f:"name",g:1}],f:[{t:2,x:{r:["label"],s:"_0||\"container\""}}]}," ",{t:4,f:[{t:2,x:{r:["@context",".layout"],s:"(_0).set(\"ctx.layout\",_1===\"row\"||!_1?\"auto\":\"manual\")&&\"\""}}],n:50,r:"ctx.layout"}," ",{t:7,e:"select",m:[{n:"value",f:[{t:2,r:"ctx.layout"}],t:13},{n:["change"],t:70,f:{r:["@node.value","@context"],s:"[_0===\"auto\"?(_1).set(\".layout\",undefined):(_1).set(\".layout\",[])]"}}],f:[{t:7,e:"option",m:[{n:"value",f:"auto",t:13}],f:["Auto Layout"]}," ",{t:7,e:"option",m:[{n:"value",f:"manual",t:13}],f:["Manual Layout"]}]}]}],n:54,z:[{n:"ctx",x:{r:"@local"}}]}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"widgets",g:1},{n:"class-manual",t:13,f:[{t:2,x:{r:[".layout"],s:"Array.isArray(_0)"}}]},{n:"style",f:["height: ",{t:2,r:"heightMargin"},";"],t:13}],f:[{t:4,f:[{t:8,r:"widget",z:[{n:"label",x:{x:{r:[],s:"false"}}}]}],n:52,r:".widgets"}]}],widget:[{t:19,f:[{t:7,e:"div",m:[{n:"widget",t:71,f:{r:[".type"],s:"[_0]"}},{n:"style",f:[{t:4,f:["width: ",{t:2,r:"widthMargin"},";"],n:50,x:{r:["label"],s:"_0!==\"page footer\""}},{t:4,f:["position: absolute; width: auto; left: ",{t:2,x:{r:["~/pageSize.margin.1"],s:"_0||0"}},"rem; right: ",{t:2,x:{r:["~/pageSize.margin.1"],s:"_0||0"}},"rem; bottom: ",{t:2,x:{r:["~/pageSize.margin.0"],s:"_0||0"}},"rem;"],n:51,l:1}," ",{t:4,f:[{t:2,x:{r:[".type"],s:"_0===\"container\"?\"min-\":\"\""}},"height: ",{t:2,r:"heightMargin"},";"],n:50,x:{r:[".height",".type"],s:"(_0&&_0!==\"auth\")||_1!==\"container\""}}],t:13},{t:4,f:[{n:"style",f:[{t:2,x:{r:["@this","@index","^^/layout","widthMargin","heightMargin"],s:"_0.calcManualLayout(_2[_1],_3,_4)"}}],t:13},{t:4,f:[{n:"moveable",t:71}],n:50,x:{r:["~/temp.widget","@keypath"],s:"_0===_1"}}," "],n:50,x:{r:["^^/layout"],s:"Array.isArray(_0)"}},{t:4,f:[{n:"style",f:[{t:4,f:["break-after: always;"],n:50,x:{r:[".br"],s:"_0===true"}},{t:4,f:["flex-grow: 1; break-after: always;"],n:50,x:{r:[".width"],s:"_0===\"grow\""}}],t:13}],n:51,l:1},{t:4,f:[{n:"style",f:[{t:2,x:{r:["@this","."],s:"_0.calcMargin(_1)"}}],t:13}],n:50,r:".margin"},{t:4,f:[{n:"style",f:[{t:2,x:{r:["@this","."],s:"_0.calcBorder(_1)"}}],t:13}],n:50,r:".border"},{t:4,f:[{n:"style",f:[{t:2,x:{r:["@this","."],s:"_0.calcFont(_1)"}}],t:13}],n:50,r:".font"},{n:["click"],t:70,f:{r:["@this","@keypath"],s:"[_0.selectWidget(_1)]"}}],f:[{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"remove btn",g:1},{n:"title",f:["Remove ",{t:2,r:".type"}],t:13},{n:["click"],t:70,f:{r:["@this","@context"],s:"[_0.removeWidget((_1),false)]"}}],f:[{t:8,r:"times"}]}],n:50,x:{r:["../"],s:"Array.isArray(_0)"}}," ",{t:8,r:".type"}]}],n:54,z:[{n:"widthMargin",x:{x:{r:["@this",".","@context"],s:"_0.calcWidthWithMargin(_1,(_2))"}}},{n:"heightMargin",x:{x:{r:["@this","."],s:"_0.calcHeightWithMargin(_1)"}}}]}]}};
    const css$1 = function(data) { return [(function () { return this.Ractive({ template: {v:4,t:["h3 { padding: 0.5rem; margin: 0; } button.plain { text-decoration: none; text-align: center; letter-spacing: 0.5px; cursor: pointer; user-select: none; border: none; border-radius: 0.2em; padding: 0 1.25rem; box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2); transition: 0.2s ease-in-out; transition-property: box-shadow, opacity, background-color; font-size: 0.7em; line-height: 1.5em; background-color: ",{t:2,r:"@style.active"},"; color: ",{t:2,r:"@style.btntxt"},"; vertical-align: middle; min-height: 2.25em; outline: 0; margin: 0.25em; position: relative; overflow: hidden; -webkit-tap-highlight-color: transparent; font-family: inherit; } button.plain:hover { background-color: ",{t:2,r:"@style.hover"},"; } span.ico, button.ico { display: inline-block; border: none; background-color: transparent; cursor: pointer; outline: none; width: 1.2em; height: 1.2em; margin-left: 0.1rem; box-sizing: content-box; color: ",{t:2,r:"@style.fg"},"; } span.ico svg, button.ico svg { fill: ",{t:2,r:"@style.fg"},"; } span.ico.error svg, button.ico.error svg { fill: ",{t:2,r:"@style.error"},"; } button.ico.text { width: auto; } button.hide { border: none; width: 0; height: 0; padding: 0; outline: none; } button.ico:hover svg { fill: ",{t:2,r:"@style.hover"},"; } button.ico:hover { color: ",{t:2,r:"@style.hover"},"; } button.ico svg.pencil { stroke: ",{t:2,r:"@style.fg"},"; fill: none; } button.ico:hover svg.pencil { stroke: ",{t:2,r:"@style.hover"},"; fill: none; } button.ico.large { font-size: 1.5rem; width: 1.5rem; height: 1.5rem; padding: 0 0.5rem; } .properties button.ico.large { line-height: 1.5rem; } button.ico:disabled { color: ",{t:2,r:"@style.border"},"; cursor: default; } span.which { flex-grow: 1; line-height: 2em; display: flex; align-items: center; } .bottom-pane span.which { line-height: 2.7em; } .raport-report { display: flex; flex-grow: 1; flex-shrink: 1; font-family: sans-serif; height: 100%; width: 100%; box-sizing: border-box; padding: 0.5em; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; position: relative; overflow: hidden; } button.add { width: 2rem; height: 2rem; line-height: 1em; text-align: center; border-radius: 2rem; background-color: ",{t:2,r:"@style.active"},"; color: ",{t:2,r:"@style.btntxt"},"; margin: 0.5rem; border: none; cursor: pointer; font-size: 1.5em; transition: background-color 0.2s ease-in-out; } button.add:hover { background-color: ",{t:2,r:"@style.hover"},"; } select { padding: 0.2rem; border-style: solid; border-width: 0 0 1px 0; background: none; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; } .layout { display: flex; flex-direction: column; flex-grow: 2; flex-shrink: 1; margin: 0 0.5em; box-sizing: border-box; overflow: hidden; padding-bottom: 1.75rem; } .layout.pad-me { padding-bottom: 32.5vh; } .layout > .tab { background-color: ",{t:2,r:"@style.dark"},"; } .editor > .tab, .layout > .tab { flex-grow: 10; flex-shrink: 1; overflow: hidden; max-height: 0; } .editor > .active-tab, .layout > .active-tab { max-height: none; } .designer { display: flex; flex-direction: column; } .spacer { margin-right: 3em; } .actions { display: flex; align-items: center; z-index: 2; } .actions .tab { box-sizing: border-box; padding: 0.5em; margin: 0 0.5em; background-color: ",{t:2,r:"@style.border"},"; color: ",{t:2,r:"@style.fg"},"; border-style: solid; border-width: 1px 1px 0 1px; font-weight: bold; cursor: pointer; outline: none; border-color: ",{t:2,r:"@style.border"},"; } .actions .tab:first-of-type { margin-left: 0; } .actions span.ico { vertical-align: middle; } .actions .right { margin-left: auto; } .actions.design .tab { background-color: ",{t:2,r:"@style.bg"},"; border-color: ",{t:2,r:"@style.border"},"; color: ",{t:2,r:"@style.fg"},"; } .actions .tab.active { background-color: ",{t:2,r:"@style.dark"},"; color: ",{t:2,r:"@style.btntxt"},"; border: none; border-top: 2px solid ",{t:2,r:"@style.highlight"},"; margin-bottom: -1px; } .bottom-pane .actions .tab { line-height: 1.3rem; } .bottom-pane .actions .tab.active { background-color: ",{t:2,r:"@style.bg"},"; border-color: ",{t:2,r:"@style.border"},"; color: ",{t:2,r:"@style.fg"},"; margin-bottom: -2px; border-style: solid; border-width: 1px; border-bottom-color: ",{t:2,r:"@style.bg"},"; border-top-width: 2px; border-top-color: ",{t:2,r:"@style.fg"},"; } .bottom-pane .actions button.error { color: ",{t:2,r:"@style.error"},"; } .bottom-pane .actions button.error svg { fill: ",{t:2,r:"@style.error"},"; } .bottom-pane .actions .tab.error { border-color: ",{t:2,r:"@style.error"},"; color: ",{t:2,r:"@style.btntxt"},"; background-color: ",{t:2,r:"@style.error"},"; } .bottom-pane .actions .tab.active.error { background-color: ",{t:2,r:"@style.bg"},"; color: ",{t:2,r:"@style.error"},"; border-bottom-color: ",{t:2,r:"@style.bg"},"; } .bottom-pane { height: 33vh; overflow: hidden; flex-shrink: 0; display: flex; flex-direction: column; flex-grow: 0; box-sizing: border-box; position: absolute; right: 0.5rem; width: calc(100% - 29rem); bottom: 0; transition: transform 0.2s ease-in-out; transform: translateY(calc(33vh - 2.25rem)); background-color: ",{t:2,r:"@style.bg"},"; padding: 0.5rem; z-index: 1998; } .bottom-pane.max { height: 90vh; transform: translateY(calc(90vh - 2.25rem)); } .bottom-pane.active { transform: translateY(0); border-top: 1px solid ",{t:2,r:"@style.border"},"; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; } .result { display: flex; flex-grow: 2; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; } iframe { display: block; border: none; } .bar { height: 2rem; background-color: ",{t:2,r:"@style.dark"},"; color: ",{t:2,r:"@style.fg"},"; display: flex; align-items: center; font-size: 0.75rem; border-bottom: 1px solid ",{t:2,r:"@style.border"},"; box-sizing: border-box; padding: 0 0.25rem; user-select: none; transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out; opacity: 0; position: absolute; width: 100%; top: -2rem; height: 2rem; left: 0; } .delimited.paper .bar { opacity: 1; } .delimited.paper .active-widget { border: none; background-color: ",{t:2,r:"@style.bg"},"; } .delimited.paper .active-widget > .bar { top: -4.5rem; left: -0.5rem; right: -0.5rem; width: auto; } .delimited.paper .hover-widget { margin-top: 2.5rem; background-color: ",{t:2,r:"@style.bg"},"; } .active-widget > .bar, .hover-widget > .bar, .bar.active, .bar.hover { opacity: 1; } .bar * { margin: 0 0.5em 0 0; } .bar .name { color: ",{t:2,r:"@style.btntxt"},"; } .bar button, .bar .btn { background: none; color: #fff; border: none; cursor: pointer; font-size: inherit; padding: 0 0.5em; } .bar select { background: none; border: none; color: #fff; height: 1rem; font-size: 0.6rem; padding: 0; } div.widgets { display: flex; flex-wrap: wrap; align-content: flex-start; position: relative; height: min-content; width: calc(100% + 3px); left: -1.5px; background-position: 1.5rem 1.5rem; background-size: 1rem 1rem; z-index: 10; } div.widgets.manual { display: inline-block; } div.widget { cursor: pointer; display: block; border: 1px dotted rgba(0, 0, 0, 0.2); box-sizing: border-box; font-size: 0.83rem; position: relative; z-index: 10; } div.widgets.manual > .widget { float: left; } div.widgets.manual > .active-widget { cursor: move; } div.widget:hover { z-index: 1000; } div.active-widget { border-color: ",{t:2,r:"@style.active"},"; border-style: solid; background-color: ",{t:2,r:"@style.active"},"20; user-select: none; z-index: 999; } div.active-widget > .widgets, div.hover-widget > .widgets { background-image: linear-gradient(to top, ",{t:2,r:"@style.active"},"20, ",{t:2,r:"@style.active"},"20), radial-gradient(circle, ",{t:2,r:"@style.dark"}," 1px, transparent 1px); background-color: ",{t:2,r:"@style.bg"},"; } div.hover-widget { border-color: ",{t:2,r:"@style.hover"},"; border-style: solid; background-color: ",{t:2,r:"@style.hover"},"20; z-index: 888; } .active-widget > .bar, .bar.active { background-color: ",{t:2,r:"@style.active"}," !important; z-index: 999; } .hover-widget > .bar, .bar.hover { background-color: ",{t:2,r:"@style.hover"}," !important; z-index: 888; z-index: 888; } .widget > .btn { position: absolute; right: 0; top: 0; opacity: 0; cursor: pointer; font-weight: bold; border-radius: 0.2rem; width: 0.9rem; height: 0.9rem; text-align: center; line-height: 0.9rem; font-size: 0.7rem; z-index: 10; } .widget > .preview.btn { right: 1.2rem; } .widget > .autosize.btn { right: 2.3rem; } .widget > .btn > svg { width: 100%; height: 100%; } .active-widget > .btn, .hover-widget > .btn { opacity: 1; } .label, .html { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .html .preview { font-size: 0.83rem; line-height: 1rem; white-space: normal; word-break: break-all; display: block; } .widget.image .content { display: flex; align-items: center; justify-content: space-around; font-size: 2em; font-weight: bold; overflow: hidden; } .widget > .content { display: block; height: 100%; } .sheet .toggles { margin-bottom: 0.5rem; } .toggle { font-size: 0.6rem; border: 1px dotted; padding: 0.2rem; border-radius: 0.2rem; display: inline-block; margin: 0.1em; line-height: 0.8rem; color: ",{t:2,r:"@style.fg"},"; cursor: pointer; user-select: none; } .toggle.active { border: 1px solid; color: ",{t:2,r:"@style.highlight"},"; } .sides { display: flex; flex-wrap: wrap; width: 12rem; margin: 0.5rem; } .properties .sheet .sides > input { width: 3rem; margin: 0.5rem 0.5rem; box-sizing: border-box; color: ",{t:2,r:"@style.fg"},"; background: transparent; } .sides .square { width: 4rem; height: 4rem; background-color: ",{t:2,r:"@style.active"},"; border: 1px solid; box-sizing: border-box; } .sides span { width: 4rem; height: 0.1rem; display: inline-block; } .shrinky { flex-shrink: 200; flex-grow: 1; } .growy { flex-grow: 100; flex-shrink: 1; } .scrolled-wrapper { position: relative; overflow: hidden; min-height: 4em; display: flex; flex-direction: column; } .scrolled { height: 100%; overflow: auto; } .scrolled:before, .scrolled:after { content: ' '; display: block; position: absolute; z-index: 2; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5); height: 5px; width: 100%; opacity: 1; transition: opacity 0.25s ease-in-out; } .scrolled:before { top: -5px; } .scrolled:after { bottom: -5px; } .scrolled.scroll-top:before { opacity: 0; transition: opacity 0s linear; } .scrolled.scroll-bottom:after { opacity: 0; transition: opacity 0s linear; } @media screen and (max-width: 96em) { .properties.left { position: absolute; top: 0; height: 100%; left: -28rem; z-index: 1999; transition: transform 0.2s ease-in-out; overflow-x: visible; box-sizing: border-box; } .properties.popped { transform: translateX(28rem); box-shadow: 4px 5px 0.5rem #0005; } .properties .properties-pull { display: flex; align-items: center; justify-content: space-around; position: absolute; width: 2.5em; height: 3em; right: -2.5em; top: 3em; border-radius: 0 2rem 2rem 0; border: 1px solid ",{t:2,r:"@style.border"},"; background-color: ",{t:2,r:"@style.bg"},"; border-left-color: ",{t:2,r:"@style.bg"},"; box-shadow: 4px 5px 0.5rem #0005; } .bottom-pane { width: calc(100% - 1rem); right: 0.5rem; } } @media screen and (max-width: 72em) { .bottom-pane .bottom .ops { display: none; } } @media screen and (max-width: 48em) { .bottom-pane .bottom .context { display: none; } }"]}, data: this.cssData }).fragment.toString(false); }).call(this), (function () { return this.Ractive({ template: {v:4,t:[".project { display: flex; flex-grow: 1; flex-direction: column; } .active-tab .project { min-height: 75vh; } .settings-pane { display: flex; flex-direction: column; flex-grow: 0; flex-shrink: 0; } .settings-pane-inner { padding: 0.5rem; margin-bottom: 1em; border-bottom: 1px solid; } .project-pane { display: flex; flex-grow: 1; padding: 0.5rem; position: relative; flex-wrap: wrap; } .project-pane-left { flex-grow: 1; flex-shrink: 1; padding-right: 1rem; display: flex; flex-direction: column; box-sizing: border-box; } @media screen and (min-width: 48rem) { .project-pane-left { max-width: calc(100% - 15rem); } } .project-pane-right { width: 15rem; display: flex; flex-direction: column; flex-shrink: 0; margin-top: 0.5rem; } .project-list { flex-grow: 1; border: 1px solid ",{t:2,r:"@style.border"},"; overflow-y: auto; } .project-item { padding: 0.25rem 0.5rem; min-height: 1.5rem; line-height: 1.5rem; cursor: pointer; } .active-project { background-color: ",{t:2,r:"@style.border"},"; color: ",{t:2,r:"@style.fg"},"; cursor: default; } label.input { display: inline-block; }"]}, data: this.cssData }).fragment.toString(false); }).call(this), (function () { return this.Ractive({ template: {v:4,t:[".tab.data-import { display: flex; flex-direction: column; } .import.paper { flex-grow: 1; display: flex; flex-direction: column; max-height: calc(100% - 2em); } .import .definition { display: flex; flex-direction: column; max-height: 100%; } .import .fetch { margin: 1em 0 2em; max-height: 40%; flex-grow: 0; flex-shrink: 1; } label.input, label.check { padding: 0.25rem; display: inline-block; } label.check { padding-top: 1.625rem; } label.input input, label.input select { display: block; height: 2.5rem; width: 100%; padding: 0.5rem; box-sizing: border-box; margin: 0; border: 1px solid ",{t:2,r:"@style.border"},"; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; border-radius: 0; } label.area { display: block; padding: 0.25rem; } label.area.grow { display: flex; flex-direction: column; flex-grow: 1; } label.area textarea { display: block; min-height: 11rem; width: 100%; padding: 0.5rem; box-sizing: border-box; border: 1px solid ",{t:2,r:"@style.border"},"; margin: 0; border-radius: 0; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; } label.area.grow textarea { flex-grow: 1; } label.check input { height: 2rem; vertical-align: middle; }"]}, data: this.cssData }).fragment.toString(false); }).call(this), (function () { return this.Ractive({ template: {v:4,t:[".report-definition .paper { flex-grow: 1; display: flex; flex-direction: column; } .tab.report-definition { display: flex; flex-direction: column; } .definition { display: flex; flex-direction: column; flex-grow: 1; } .definition .json, .definition .extra-context { display: flex; flex-direction: column; flex-grow: 1; height: 10em; border: 1px solid ",{t:2,r:"@style.border"},"; } .definition .json > *, .definition .extra-context > * { flex-grow: 1; } .definition .json textarea, .definition .extra-context textarea { flex-shrink: 0; flex-grow: 1; width: 100%; box-sizing: border-box; min-height: 99%; border: none; outline: none; } .definition .json textarea { color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; }"]}, data: this.cssData }).fragment.toString(false); }).call(this), " .report-context .paper { flex-grow: 1; display: flex; flex-direction: column; } .tab.report-context { display: flex; flex-direction: column; }", (function () { return this.Ractive({ template: {v:4,t:[".paper { background-color: ",{t:2,r:"@style.bg"},"; color: ",{t:2,r:"@style.fg"},"; position: relative; } .report-paper.bar { background-color: ",{t:2,r:"@style.border"},"; opacity: 1; } .delimited.paper { padding: 0.5rem; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; } @media screen and (min-width: 48rem) { .delimited.paper { margin: 1rem; } } .delimited .children.fields { display: flex; flex-wrap: wrap; } .field { display: flex; border: 1px solid ",{t:2,r:"@style.border"},"; margin: 0.25rem; padding: 0.25rem; } .field span { display: inline-block; width: 15em; min-height: 1em; max-height: 6em; word-break: break-all; white-space: pre-wrap; overflow: hidden; } .field.active-expr { background-color: ",{t:2,r:"@style.active"},"20; border-color: ",{t:2,r:"@style.active"},"; } .field.hover-expr { background-color: ",{t:2,r:"@style.hover"},"20; border-color: ",{t:2,r:"@style.hover"},"; } .widget span.btn { background-color: ",{t:2,r:"@style.fg"},"; color: ",{t:2,r:"@style.bg"},"; } .widget span.btn svg { fill: ",{t:2,r:"@style.bg"},"; } .widget .bar span.btn { background-color: transparent; color: ",{t:2,r:"@style.btntxt"},"; } .widget.container > .remove.btn { top: -1.5rem; right: 0.5rem; z-index: 1000; }"]}, data: this.cssData }).fragment.toString(false); }).call(this), (function () { return this.Ractive({ template: {v:4,t:[".bottom-pane pre { margin: 0; } .bottom-pane .top { display: flex; flex-shrink: 0; flex-grow: 0; box-sizing: border-box; height: 2.5em; font-size: 0.75rem; align-items: end; } .bottom-pane .bottom { display: flex; flex-grow: 1; flex-shrink: 1; overflow: hidden; border: 1px solid ",{t:2,r:"@style.border"},"; } .bottom-pane .bottom > .tab { display: flex; padding: 0.5rem; flex-grow: 0; border: none; display: none; } .bottom-pane .bottom > .active-tab { flex-grow: 1; display: flex; } .bottom-pane .context, .bottom-pane .ops { margin: 0.2em; width: 25%; max-width: 20em; flex-shrink: 0; display: flex; flex-direction: column; } .bottom-pane .context .panel, .bottom-pane .ops .panel { border: 1px solid ",{t:2,r:"@style.border"},"; flex-grow: 1; } .bottom-pane .context .header, .bottom-pane .ops .header { height: 2.55em; font-weight: bold; display: flex; justify-content: space-evenly; line-height: 2.2em; font-size: 0.85rem; } .bottom-pane .editor { flex-grow: 2; display: flex; flex-direction: column; padding: 0.25rem; box-sizing: border-box; } .bottom-pane textarea { width: 100%; box-sizing: border-box; padding: 0.5em; min-height: 99%; border: none; outline: none; font-size: 1em; } .bottom-pane .properties textarea, .bottom-pane .properties select, .bottom-pane input { color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; border: 1px solid ",{t:2,r:"@style.border"},"; } .bottom-pane .properties textarea { min-height: 7em; } .bottom-pane .active-tab { border: 1px solid ",{t:2,r:"@style.border"},"; } .bottom-pane .editor .tab { display: flex; flex-direction: column; } .bottom-pane .ast.tab { word-wrap: anywhere; word-break: break-all; } .bottom-pane .ast.tab.error { border-color: ",{t:2,r:"@style.error"},"; } .bottom-pane .tab.html .scrolled { display: flex; flex-direction: column; } .bottom-pane .tab.result .scrolled { padding: 0.5rem; } .bottom-pane .tab.html, .bottom-pane .tab.result { display: flex; flex-direction: column; } .bottom-pane .tab .editor-buttons { display: flex; flex-shrink: 0; padding: 0.2rem; border-bottom: 1px solid ",{t:2,r:"@style.border"},"; } .bottom-pane .tab.html button { border: none; background-color: transparent; padding: 0.25rem; cursor: pointer; outline: none; } .bottom-pane .tab.html button:hover { color: ",{t:2,r:"@style.active"},"; } .bottom-pane .tab.html button.skip { margin-left: 1rem; } .bottom-pane .html-editor { padding: 0.5rem; flex-grow: 1; flex-shrink: 1; white-space: pre-wrap; word-wrap: anywhere; word-break: break-all; } .bottom-pane pre { white-space: pre-wrap; word-break: break-all; } .bottom-pane .properties { flex-direction: column; flex-wrap: wrap; align-content: flex-start; } .bottom-pane .properties > label { width: 20em; margin: 0 0.5rem; padding: 0.5rem 0; } .bottom-pane .options label { display: inline-block; } .bottom-pane .options label > span:first-of-type { font-size: 0.8rem; } .bottom-pane .properties > label > span:first-of-type { font-size: 0.8rem; display: flex; } .bottom-pane .options { box-sizing: border-box; padding: 0.5rem; border: 1px solid ",{t:2,r:"@style.border"},"; overflow: hidden; display: flex; flex-direction: column; } .bottom-pane .group-edit { display: flex; align-items: center; } .ast-node { margin-left: 0.5em; display: flex; cursor: pointer; min-height: 2em; border: 1px solid transparent; } .ast-node input, .ast-node select { border: 1px solid rgba(0, 0, 0, 0.15); background-color: ",{t:2,r:"@style.bg"},"; padding: 0.2em; } .ast-content { display: flex; flex-direction: column; flex-grow: 1; } .ast-active-node { background-color: ",{t:2,r:"@style.active"},"20; border: 1px solid ",{t:2,r:"@style.active"},"; cursor: default; } .ast-string:before, .ast-string:after { content: '\"'; } .ast-number { font-family: mono; } .ast-op-name, .ast-content-value, .ast-content-ref { display: flex; justify-content: space-between; } .entry-details { display: flex; justify-content: space-between; } .entry-type { opacity: 0.6; padding: 0 0.5em; } .entry-details button { text-align: left; padding: 0; background: none; border: none; margin: 0; font-size: 1rem; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; } .entry-details button.expand { margin-left: -1em; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; border: 1px solid ",{t:2,r:"@style.border"},"; width: 1em; height: 1em; text-align: center; line-height: 0.6em; } .context-entry { padding-left: 0.5em; border-left: 1px dotted ",{t:2,r:"@style.border"},"; margin-left: 1em; } .context-entry .context-entry { margin-left: 0.5em; } .context-entry > .context-entry { display: none; } .context-entry.expanded > .context-entry { display: block; } .expr-operator, .context-entry { cursor: pointer; } .entry-details .expr-operator { padding: 0 0.5em; } .label-part { padding: 0.25em; margin: 0.25em; border: 1px solid; border-radius: 0.2em; } .label-part code { background-color: ",{t:2,r:"@style.bg"},"; color: ",{t:2,r:"@style.fg"},"; } .label-part input, .label-part label, .label-part select { font-size: 0.8rem; padding: 0.25em; border-radius: 0.2rem; margin: 0.25em; vertical-align: middle; border: 1px solid ",{t:2,r:"@style.border"},"; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; } .label-part input[type=number] { width: 8rem; } .label-part label { white-space: nowrap; } .option-entry { box-sizing: border-box; display: flex; margin-bottom: 0.5em; align-items: end; justify-content: space-between; } .option-entry > * { flex-shrink: 1; flex-grow: 1; margin: 0.2em; }"]}, data: this.cssData }).fragment.toString(false); }).call(this), (function () { return this.Ractive({ template: {v:4,t:[".param { width: 18rem; margin: 0.5rem; break-inside: avoid; } .param label { width: 100%; } .param label input, .param label select { display: block; width: 100%; box-sizing: border-box; padding: 0.5rem; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; } .param label.check input { width: auto; display: inline-block; vertical-align: middle; padding: 0; } .param-editor { column-width: 20em; }"]}, data: this.cssData }).fragment.toString(false); }).call(this), " .unit { font-size: 0.6rem; margin-left: 1em; }", (function () { return this.Ractive({ template: {v:4,t:[".properties { width: 28em; flex-grow: 0; flex-shrink: 0; border: 1px solid ",{t:2,r:"@style.border"},"; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; display: flex; flex-direction: column; z-index: 1999; } .properties-pull { display: none; } .placeholder { flex-grow: 1; align-items: center; display: flex; justify-content: center; font-size: 1.7rem; color: #aaa; } .properties .header { display: flex; flex: 1 1 auto; flex-grow: 0; flex-shrink: 0; align-items: center; margin-top: 1em; } .properties .header:first-of-type { margin-top: 0; } .properties .header h3 { flex-grow: 5; } .properties .tree { overflow-y: auto; } .properties .tree .children { margin-left: 0.5em; padding-left: 0.5em; border-left: 1px dotted ",{t:2,r:"@style.border"},"; } .properties .tree .node { color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; cursor: pointer; position: relative; transition: background-color 0.2s ease-in-out; z-index: 1; } .properties .tree .node.active > .line { background-color: ",{t:2,r:"@style.active"},"; color: ",{t:2,r:"@style.btntxt"},"; } .properties .tree .node.active { background-color: ",{t:2,r:"@style.active"},"20; } .properties .tree .node.hover > .children > .node { background-color: ",{t:2,r:"@style.hover"},"20; } .properties .tree .node .line { display: flex; align-items: center; padding: 0.1rem 0.25rem; margin: 0.1rem; min-height: 2rem; transition: background-color 0.2s ease-in-out; background-color: ",{t:2,r:"@style.bg"},"; z-index: 10; } .properties .tree .node.hover > .line { background-color: ",{t:2,r:"@style.hover"},"; color: #fff; } .properties .tree .node.moving > .line { background-color: #8061ee; color: #fff; } .properties .tree .node .line span { flex-grow: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; } .properties .tree .node.active > .line button, .properties .tree .node .line:hover button, .properties .tree .node.hover > .line button { color: #fff; } .properties .tree .node.active > .line button:disabled, .properties .tree .node .line:hover button:disabled, .properties .tree .node.hover > .line button:disabled { color: #ccc; cursor: default; } .properties .sheet { display: table; border-collapse: collapse; width: 100%; box-sizing: border-box; } .properties .sheet > label { display: table-row; } .properties .sheet > label > * { display: table-cell; line-height: 1rem; padding: 0.4rem; vertical-align: middle; border-style: solid; border-width: 1px 0; border-color: ",{t:2,r:"@style.border"},"; } .properties .sheet > label > *:first-of-type { border-width: 1px 1px 1px 0; } .properties .sheet > label > *:first-of-type > * { vertical-align: middle; } .properties .sheet input, .properties .sheet select { border: none; padding: 0; margin: 0; width: 100%; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.bg"},"; outline: none; } .properties .sheet textarea { border: none; width: 100%; height: 100%; margin: -0.2rem; padding: 0; box-sizing: border-box; outline: none; } .properties .sheet label:focus-within { background-color: transparent; color: ",{t:2,r:"@style.fg"},"; } .parameter, .src { display: flex; border-bottom: 1px solid ",{t:2,r:"@style.border"},"; } .parameter:focus-within, .src:focus-within { background-color: ",{t:2,r:"@style.border"},"; } .parameter.head, .src.head { border-top: 1px solid ",{t:2,r:"@style.border"},"; font-weight: bold; } .parameter > *, .src > * { border-left: 1px solid ",{t:2,r:"@style.border"},"; padding: 0.2rem; flex-grow: 0; flex-shrink: 0; box-sizing: border-box; } .parameter > *:first-of-type, .src > *:first-of-type { border-left: none; } .parameter input:not([type=checkbox]), .parameter select, .src input:not([type=checkbox]), .src select { width: 100%; height: 100%; border: none; background-color: ",{t:2,r:"@style.bg"},"; color: ",{t:2,r:"@style.fg"},"; } .param-name { width: 40%; } .param-type { width: 30%; } .param-require { width: 19%; text-align: center; } .param-btn { width: 10%; } .src-name { width: 65%; } .rsrc-name { width: 43%; } .rsrc-src { width: 43%; } .src-btn { width: 35%; display: flex; justify-content: space-around; } .rsrc-btn { width: 14%; }"]}, data: this.cssData }).fragment.toString(false); }).call(this), (function () { return this.Ractive({ template: {v:4,t:["@media screen and (min-height: 10em) { .tree .line { position: sticky; top: 0; } .tree .line.level1 { top: 2.2em; } } @media screen and (min-height: 15em) { .tree .line.level2 { top: 4.4em; } .tree .line.level3 { top: 6.6em; } } @media screen and (min-height: 20em) { .tree .line.level4 { top: 8.8em; } .tree .line.level5 { top: 11em; } } @media screen and (min-height: 25em) { .tree .line.level6 { top: 13.2em; } .tree .line.level7 { top: 15.4em; } } @media screen and (min-height: 30em) { .tree .line.level8 { top: 17.6em; } } .line .actions { display: none; position: absolute; right: 3rem; background-color: inherit; } .line:hover .actions { display: block; } button.ico svg { width: 100%; height: 100%; border-radius: 0.2rem; transition: transform 0.2s ease-in-out 0.3s; } .line button.ico { flex-shrink: 0; } .line button.ico.expander { position: absolute; left: -1.35em; opacity: 0.5; border: 0px solid; transition: border-width 0.2s ease; width: 0.75em; text-align: center; padding: 0 0.2em; } .line button.ico.expander:hover { border-width: 1px; } .line button.ico svg, .line button.ico.remove:hover svg, .hover .line .actions button.ico svg { fill: ",{t:2,r:"@style.bg"},"; } .line button.ico.field svg, .line button.ico.remove svg { fill: ",{t:2,r:"@style.fg"},"; } .line button.ico.field[disabled] svg { fill: ",{t:2,r:"@style.dark"},"; } .line button.ico.field:hover svg { fill: ",{t:2,r:"@style.bg"},"; } .hover .line .actions button.ico:hover svg, .line button.ico:hover svg { fill: ",{t:2,r:"@style.fg"},"; } span.widget-info { display: inline-block; overflow: hidden; text-overflow: ellipsis; vertical-align: bottom; padding-left: 0.5em; max-width: 85%; opacity: 0.7; } button.ico[disabled] svg, button.ico[disabled]:hover svg { fill: gray; } button.ico.up-arrow svg { transform: rotate(180deg); } button.ico.left-arrow svg { transform: rotate(90deg); } button.ico.right-arrow svg { transform: rotate(270deg); }"]}, data: this.cssData }).fragment.toString(false); }).call(this)].join(' '); };

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

    const template = {v:4,t:[{t:7,e:"div",m:[{t:13,n:"class",f:"syntax-editor",g:1},{t:8,r:"extra-attributes"}],f:[{t:4,f:[{t:7,e:"div",m:[{t:13,n:"class",f:"line-nos",g:1}],f:[{t:4,f:[{t:2,r:"."},{t:7,e:"br"}],n:52,r:"~/lines"}]}],n:50,x:{r:["~/lines.length"],s:"_0>4"}}," ",{t:7,e:"div",m:[{t:13,n:"class",f:"editor-pane",g:1}],f:[{t:7,e:"code",m:[{t:13,n:"class",f:"ast-nodes",g:1}],f:[{t:7,e:"pre",f:[{t:8,r:"ast-node",c:{r:"ast"}},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"ast-fail",g:1}],f:[{t:2,x:{r:["src","ast.end","src.length"],s:"_0.substring(_1,_2)"}}]}],n:50,x:{r:["ast.end","src.length"],s:"_0<_1"}},{t:4,f:[" "],n:50,x:{r:["src.length","src"],s:"_0>0&&_1[_0-1]===\"\\n\""}}]}]}," ",{t:7,e:"textarea",m:[{n:"autosize",t:71},{n:"class-expr-text",t:13},{t:4,f:[{n:"id",f:"expr-text",t:13}],n:50,r:"primary"},{n:"spellcheck",f:"false",t:13},{n:["keydown"],t:70,f:{r:["@this","@event"],s:"[_0.keydown(_1)]"}},{n:["focus"],t:70,f:{r:["@this"],s:"[_0.highlightSyntax()]"}}],f:[{t:2,r:"src"}]}]}]}],e:{"_0>4":function (_0){return(_0>4);},"_0.substring(_1,_2)":function (_0,_1,_2){return(_0.substring(_1,_2));},"_0<_1":function (_0,_1){return(_0<_1);},"_0>0&&_1[_0-1]===\"\\n\"":function (_0,_1){return(_0>0&&_1[_0-1]==="\n");},"[_0.keydown(_1)]":function (_0,_1){return([_0.keydown(_1)]);},"[_0.highlightSyntax()]":function (_0){return([_0.highlightSyntax()]);},"(_0||\"\").substring(_1,_2)":function (_0,_1,_2){return((_0||"").substring(_1,_2));}},p:{viewer:[{t:7,e:"div",m:[{t:13,n:"class",f:"syntax-editor",g:1},{t:8,r:"extra-attributes"}],f:[{t:7,e:"code",m:[{t:13,n:"class",f:"ast-nodes",g:1}],f:[{t:7,e:"pre",f:[{t:8,r:"ast-node",c:{r:"ast"}},{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"ast-fail",g:1}],f:[{t:2,x:{r:["src","ast.end","src.length"],s:"_0.substring(_1,_2)"}}]}],n:50,x:{r:["ast.end","src.length"],s:"_0<_1"}},{t:4,f:[" "],n:50,x:{r:["src.length","src"],s:"_0>0&&_1[_0-1]===\"\\n\""}}]}]}]}],"ast-node":[{t:7,e:"span",m:[{n:"class",f:[{t:2,r:".name"}],t:13}],f:[{t:4,f:[{t:4,f:[{t:4,f:[{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"ast-extra",g:1}],f:[{t:2,x:{r:["~/src","./0","./1"],s:"(_0||\"\").substring(_1,_2)"}}]}],n:54,rx:{r:"^^/extra",m:[{t:30,n:"@index"}]}}],n:50,rx:{r:"^^/extra",m:[{t:30,n:"@index"}]}},{t:8,r:"ast-node"}],n:52,r:".children"},{t:4,f:[{t:4,f:[{t:7,e:"span",m:[{t:13,n:"class",f:"ast-extra",g:1}],f:[{t:2,x:{r:["~/src","./0","./1"],s:"(_0||\"\").substring(_1,_2)"}}]}],n:54,rx:{r:".extra",m:[{t:30,n:".children.length"}]}}],n:50,rx:{r:".extra",m:[{t:30,n:".children.length"}]}}],n:50,r:".children.length"},{t:4,f:[{t:2,x:{r:["~/src",".start",".end"],s:"(_0||\"\").substring(_1,_2)"}}],n:51,l:1}]}]}};
    const css = function(data) { return [(function () { return this.Ractive({ template: {v:4,t:[".syntax-editor { position: relative; min-height: 99%; color: ",{t:2,r:"@style.code.c1"},"; display: flex; } .syntax-editor > .line-nos { height: 100%; flex-grow: 0; flex-shrink: 0; font-family: monospace; font-size: 14px !important; line-height: 14px !important; padding: 14px !important; color: ",{t:2,r:"@style.fg"},"; background-color: ",{t:2,r:"@style.border"},"; border-right: 1px solid ",{t:2,r:"@style.dark"},"; text-align: right; } .syntax-editor > .editor-pane { position: relative; flex-grow: 1; flex-shrink: 1; } .ast-extra { color: ",{t:2,r:"@style.code.c1"},"; } .comment { color: ",{t:2,r:"@style.code.c14"},"; } .syntax-editor textarea { position: absolute; top: 0; font-family: monospace; color: transparent; background: transparent; caret-color: ",{t:2,r:"@style.fg"},"; min-height: 99%; overflow: hidden; resize: none; margin: 0 !important; padding: 14px !important; line-height: 14px !important; font-size: 14px !important; white-space: pre-wrap; word-break: break-all; } .syntax-editor code { padding: 14px; font-family: monospace; display: block; box-sizing: border-box; min-height: 99%; overflow: hidden; line-height: 14px;; font-size: 14px; min-height: 28px; } .syntax-editor > .editor-pane > code > pre { word-break: break-all; white-space: pre-wrap; margin: 0 !important; padding: 0 !important; } .ast-nodes .reference { color: ",{t:2,r:"@style.code.c2"},"; font-weight: 500; } .ast-nodes .primitive, .ast-nodes .number, .ast-nodes .date, .ast-nides .timespan { color: ",{t:2,r:"@style.code.c3"},"; font-weight: 500; } .ast-nodes .format-op { color: ",{t:2,r:"@style.code.c4"},"; } .ast-nodes .string, .ast-nodes .string > .ast-extra { color: ",{t:2,r:"@style.code.c5"},"; } .ast-nodes .string > .string-interpolation { font-style: oblique; } .ast-nodes .binary-op > .ast-extra, .ast-nodes .conditional > .ast-extra { color: ",{t:2,r:"@style.code.c6"},"; } .ast-nodes .typelit, .ast-nodes .typelit > .ast-extra { color: ",{t:2,r:"@style.code.c7"},"; } .ast-nodes .typelit .type { color: ",{t:2,r:"@style.code.c9"},"; font-weight: 500; } .ast-nodes .typelit .key, .ast-nodes .typelit .literal { font-weight: 500; color: ",{t:2,r:"@style.code.c10"},"; } .ast-nodes .typelit .key { color: ",{t:2,r:"@style.code.c8"},"; } .ast-nodes .typelit .condition { font-weight: 700; } .ast-nodes .ast-fail { color: ",{t:2,r:"@style.code.c20"},"; } .ast-nodes .interpolator, .ast-nodes .each-block > .ast-extra, .ast-nodes .if-block > .ast-extra, .ast-nodes .unless-block > .ast-extra, .ast-nodes .case-block > .ast-extra, .ast-nodes .with-block > .ast-extra { font-weight: 600; } .ast-nodes .each-block > .ast-extra { color: ",{t:2,r:"@style.code.c11"},"; } .ast-nodes .case-block > .ast-extra, .ast-nodes .unless-block > .ast-extra, .ast-nodes .if-block > .ast-extra { color: ",{t:2,r:"@style.code.c12"},"; } .ast-nodes .with-block > .ast-extra { color: ",{t:2,r:"@style.code.c13"},"; } ",{t:2,x:{r:["extra"],s:"_0||\"\""}}],e:{"_0||\"\"":function (_0){return(_0||"");}}}, data: this.cssData }).fragment.toString(false); }).call(this)].join(' '); };

    function autosize(node) {
        const helper = node.cloneNode();
        helper.style.position = 'absolute';
        helper.style.left = '-110%';
        helper.style.zIndex = '-1';
        helper.style.height = '14px';
        helper.style.fontSize = '14px';
        helper.style.lineHeight = '14px';
        helper.style.padding = '14px';
        helper.style.wordBreak = 'break-all';
        helper.style.whiteSpace = 'pre-wrap';
        document.body.appendChild(helper);
        function resize() {
            const style = getComputedStyle(node);
            helper.style.boxSizing = style.boxSizing;
            helper.style.width = `${node.clientWidth}px`;
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

    const notSpace = /[^\s]/;
    const initSpace = /^(\s*).*/;
    class Editor extends Ractive__default['default'] {
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
            const pre = this.find('pre');
            if (pre)
                this.set('lines', breakLines(expr, pre.clientWidth));
        }
        keydown(ev) {
            let key = ev.key;
            let shift = ev.shiftKey;
            if (key === 'Backspace') {
                const n = ev.target;
                const txt = n.value;
                if (n.selectionStart === n.selectionEnd) {
                    const idx = txt.lastIndexOf('\n', n.selectionStart - 1);
                    const str = txt.substring(idx > 0 ? idx + 1 : 0, n.selectionStart);
                    if (str && !notSpace.test(str) && str.length > 1) {
                        key = 'Tab';
                        shift = true;
                    }
                }
            }
            if (key === 'Home') {
                const n = ev.target;
                const txt = n.value;
                if (n.selectionStart) {
                    const idx = txt.lastIndexOf('\n', n.selectionStart - 1);
                    let line = txt.substring(idx > 0 ? idx + 1 : 0, n.selectionStart);
                    let space = line.replace(initSpace, '$1');
                    if (!line || notSpace.test(line)) {
                        if (!line) {
                            let nidx = line.indexOf('\n', idx);
                            if (!~nidx)
                                nidx = txt.length;
                            let i = n.selectionStart;
                            for (i; i < nidx; i++)
                                if (notSpace.test(txt[i]))
                                    break;
                            n.selectionStart = i;
                        }
                        else {
                            n.selectionStart = n.selectionStart - line.length + space.length;
                        }
                    }
                    else {
                        n.selectionStart = n.selectionStart - line.length;
                    }
                    if (!shift)
                        n.selectionEnd = n.selectionStart;
                    return false;
                }
            }
            else if (key === 'Tab') {
                const n = ev.target;
                let txt = n.value;
                let pos = [n.selectionStart, n.selectionEnd];
                let idx;
                if (pos[0] === pos[1]) {
                    idx = txt.lastIndexOf('\n', pos[0]);
                    if (this.get('tabout')) {
                        if (txt.length === 0)
                            return true;
                        if (!shift && notSpace.test(txt.substring(idx === -1 ? 0 : idx, pos[0])))
                            return true;
                    }
                    if (idx === pos[0])
                        idx = txt.lastIndexOf('\n', idx - 1);
                    if (idx === -1)
                        idx = 0;
                    else
                        idx += 1;
                    if (shift) {
                        if (txt.substr(idx, 2) === '  ') {
                            txt = txt.substring(0, idx) + txt.substr(idx + 2);
                            pos[0] = pos[0] - 2;
                            pos[1] = pos[1] - 2;
                        }
                    }
                    else {
                        txt = txt.substring(0, idx) + '  ' + txt.substr(idx);
                        pos[0] = pos[0] + 2;
                        pos[1] = pos[1] + 2;
                    }
                }
                else {
                    idx = txt.lastIndexOf('\n', n.selectionEnd);
                    if (idx === pos[0] && idx == pos[1])
                        idx = txt.lastIndexOf('\n', idx - 1);
                    for (; ~idx && idx > n.selectionStart;) {
                        if (shift) {
                            if (txt.substr(idx + 1, 2) === '  ') {
                                txt = txt.substring(0, idx + 1) + txt.substr(idx + 3);
                                pos[1] = pos[1] - 2;
                            }
                        }
                        else {
                            txt = txt.substring(0, idx + 1) + '  ' + txt.substr(idx + 1);
                            pos[1] = pos[1] + 2;
                        }
                        idx = txt.lastIndexOf('\n', idx - 1);
                    }
                    idx = txt.lastIndexOf('\n', n.selectionStart);
                    if (!~idx)
                        idx = 0;
                    else
                        idx += 1;
                    if (~idx) {
                        if (shift) {
                            if (txt.substr(idx, 2) === '  ') {
                                txt = txt.substring(0, idx) + txt.substr(idx + 2);
                                pos[0] = pos[0] - 2;
                                pos[1] = pos[1] - 2;
                            }
                        }
                        else {
                            txt = txt.substring(0, idx) + '  ' + txt.substr(idx);
                            pos[0] = pos[0] + 2;
                            pos[1] = pos[1] + 2;
                        }
                    }
                }
                n.value = txt;
                n.selectionStart = pos[0];
                n.selectionEnd = pos[1];
                n.dispatchEvent(new InputEvent('input'));
                n.dispatchEvent(new InputEvent('change'));
                return false;
            }
            else if (ev.key === 'Enter') {
                if (ev.ctrlKey) {
                    this.fire('run');
                    return false;
                }
                const n = ev.target;
                let txt = n.value;
                let pos = [n.selectionStart, n.selectionEnd];
                let idx = txt.lastIndexOf('\n', pos[0] - 1);
                const line = txt.substring(idx >= 0 ? idx + 1 : 0, pos[0]);
                const space = line.replace(initSpace, '$1');
                txt = txt.substr(0, pos[0]) + '\n' + space + txt.substr(pos[1]);
                n.value = txt;
                n.selectionStart = n.selectionEnd = pos[0] + space.length + 1;
                n.dispatchEvent(new InputEvent('input'));
                n.dispatchEvent(new InputEvent('change'));
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
        },
        decorators: { autosize },
        attributes: ['src', 'template', 'tabout', 'primary'],
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
            const pre = this.find('pre');
            if (pre)
                this.set('lines', breakLines(expr, pre.clientWidth));
        }
    }
    Ractive__default['default'].extendWith(Viewer, {
        template: { v: template.v, t: template.p.viewer }, cssId: 'raport-ast-view',
        css,
        cssData: {
            extra: `
      pre { margin: 0; white-space: pre-wrap; font-size: 14px; }
      .syntax-editor code { padding: 0; flex-grow: 1; }
      .syntax-editor { max-height: 100%; overflow: auto; }
      .syntax-editor code { font-size: inherit; line-height: 14px; }
      `,
        },
        partials: {
            'ast-node': template.p['ast-node'],
        },
        on: {
            init() {
                this.observe('src template', debounce(function () {
                    this.highlightSyntax();
                }, 150));
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
		{ bin:1 proto:'...number => number' desc:'Multiplies the given values starting with the first.' }
		{ bin:1 proto:'(string, number) => string' desc:'Returns the given string copied number times.'}
	]}
	{ op:['**' 'pow'] sig:[
		{ bin:1 proto:'...number => number' desc:'Applies exponentiation to the given arguments with right associativity.' eg:'(** 1 2 3) is 1^(2^3)'}
	]}
	{ op:['+' 'add'] sig:[
		{ bin:1 proto:'...number => number' desc:'Adds the given numbers together.' }
		{ bin:1 proto:'...any => string' desc:'Concatenates the given arguments as strings.' }
		{ un:1 proto:'any => number' desc:'The unary + operator converts the given value to a number.' }
	]}
	{ op:['-' 'subtract'] sig:[
		{ bin:1 proto:'...any => number' desc:'Subtracts the given values as numbers starting with the first.' }
	]}
	{ op:['/' 'divide'] sig:[
		{ bin:1 proto:'...any => number' desc:'Divides the given values starting with the first.' }
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
		{ proto: "(any, any, 'strict'|'loose'|application) => boolean' desc:'Do a deep equality check on the first two arguments using the comparison method specified by the third argument. If an application is given, it will be called with each item being checked at each step in the recursive check to determine equality." }
	]}
	{ op:['!==' 'deep-is-not'] sig:[
		{ bin:1 proto: '(any, any) => boolean' desc:'Do a deep inequality check on the first two arguments using loose equality for primitives.' }
		{ proto: "(any, any, 'strict'|'loose'|application) => boolean' desc:'Do a deep inequality check on the first two arguments using the comparison method specified by the third argument. If an application is given, it will be called with each item being checked at each step in the recursive check to determine equality." }
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
		{ proto:'(any, ...(any|application, any)) => any' desc:'Evaluates its first argument and uses it as a basis for comparison for each subsequent pair of arguments, called matchers. The first value in a matcher is used for the comparison, and the second value is returned if the comparison holds. If the matcher first value is an application, the matcher matches if the application returns a truthy value when given the basis value. If the matcher first value is a value, the matcher matches if the first value and the basis value are loosely equal. The basis value is available as @case or the shorthand _ in each matcher.' eg:['case 1+1 when 1 then :nope when =>4 - _ == _ then :yep else :other end' 'case(1+1 1 :nope =>4 - _ == _ :yep :other)'] }
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
	]}
	{ op:'diff' sig:[
		{ proto:'(any, any) => Diff' desc:'Does a deep comparison of the two arguments returning a map of deep keypath to a tuple of the left value and right value for differing paths.' }
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
	{ op:'floor' sig:[
		{ proto:'number => number' desc:'Returns the given number rounded down to the nearest integer.' }
	]}
	{ op:['format' 'fmt'] sig:[
		{ proto:'(any, string, ...args) => string' desc:'Applies the named formatted indicated by the second argument string to the given value, passing along any additional arguments to the formatter.' }
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
		{ bin:1 proto:'(date, daterange) => boolean' desc:'Returns true if the first argument is a falls within the second argument range.' }
		{ bin:1 proto:'(number, range) => boolean' desc:'Returns true if the first argument is a falls within the second argument range.' }
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
		{ agg:1 proto:'string => string' desc:'Joins all of the elements in the current source with the given string.' }
		{ proto:'(any[], string, string) => string' desc:'Joins all of the elements in the given array with the given string. The last element is appended using the final string.' }
		{ agg:1 proto:'(string, string) => string' desc:'Joins all of the elements in the current source with the given string. The last element is appended using the final string.' }
	]}
	{ op:'keys' sig:[
		{ proto:'object => string[]' desc:'Returns an array of all of the keys in the given object.' }
		{ proto:'(object, true) => string[]' desc:'Returns an array of all of the keys in the given object, including any from the prototype chain.' }
	]}
	{ op:'label-diff' sig:[
		{ proto:'(Diff, LabelMap) => Diff' desc:'Takes the given diff and label map and swaps out paths in the diff for labels in the map. The label map is a nested object with the keys being single key paths in the diff and the values being a label or tuple of a label and label map for nested sub structures.' eg:'label-diff(d { foo:[:Company { bar::Address }] }) where d = { :foo.bar: [:street :avenue] } will result in { "Company Address": [:street :avenue] }' }
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
		{ proto:'any => number' desc:'Returns the length of the given value or 0 if it has none.' }
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
		{ bin:1 proto:'(date, daterange) => boolean' desc:'Returns false if the first argument is a falls within the second argument range.' }
		{ bin:1 proto:'(number, range) => boolean' desc:'Returns false if the first argument is a falls within the second argument range.' }
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
		{ proto:'(...(string, any)) => object' desc:'Returns an object assembled from the arguments where each odd argument is a key and the subsequent event argument is its value.' eg: 'object(:key1 99 :key2 73)' }
	]}
	{ op:'overlap' sig:[
		{ proto:'(string, string, number = 0.5) => string' desc:"Returns the first overlapping substring within the two given strings that is at least the given percentage of the smallest string's length long using the similar operator." }
	]}
	{ op:'pad' sig:[
		{ proto:'(string, number) => string' desc:'Pads the given string with spaces at both ends such that it is at least the given number of characters long.' }
		{ proto:'(string, number, string) => string' desc:'Pads the given string with the final string at both ends such that it is at least the given number of characters long.' }
	]}
	{ op:'padl' sig:[
		{ proto:'(string, number) => string' desc:'Pads the given string with spaces at the beginning such that it is at least the given number of characters long.' }
		{ proto:'(string, number, string) => string' desc:'Pads the given string with the final string at the beginning such that it is at least the given number of characters long.' }
	]}
	{ op:'padr' sig:[
		{ proto:'(string, number) => string' desc:'Pads the given string with spaces at the end such that it is at least the given number of characters long.' }
		{ proto:'(string, number, string) => string' desc:'Pads the given string with the final string at the end such that it is at least the given number of characters long.' }
	]}
	{ op:'parse' sig:[
		{ proto:'string => any' desc:'Parses the given string using the expression parser.' }
	] opts: [
		{ name:'date' type:'boolean' desc:'Use the date parser rather than the expression parser.' }
		{ name:'template' type:'boolean' desc:'Use the template parser rather than the expression parser.' }
		{ name:'time' type:'boolean' desc:'Use the time parser rather than the expression parser.' }
		{ name:'schema' type:'boolean' desc:'Use the schema parser rather than the expression parser.' }
		{ name:'csv' type:'boolean' desc:'Use the delimited text parser rather than the expression parser.' }
		{ name:'detect' type:'boolean' desc:'If using the delimited parser, detect the delimiters and use them to parse.' }
		{ name:'header' type:'boolean' desc:'If using the delimited parser, treat the first result as a header and use it to build objects with field names based on the header.' }
		{ name:'field' type:'string' desc:'If using the delimited parser, use the given string as the field delimiter.' }
		{ name:'record' type:'string' desc:'If using the delimited parser, use the given string as the record delimiter.' }
		{ name:'quote' type:'string' desc:'If using the delimited parser, use the given string as the field quote.' }
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
	]}
	{ op:'set' sig:[
		{ proto:'(string, any) => interval' desc:'Sets the root value specified by the given path in the first argument the value supplied as the second argument and returns the value that was replaced, if any.' }
	]}
	{ op:'set-defaults' sig:[
		{ proto:'(string, string) => any' desc:'Sets the defaults for the given class and name of a defaulted thing. Currently, only format is supported as a class, and the name provided should be the name of the format for which to set defaults. Defaults should be passed in as named options.' }
	]}
	{ op:'similar' sig:[
		{ proto:'(string, string, number = 0.5, number = 2) => [string, string, number]' desc:'Finds the first similar substrings within the two given strings based on a threshhold (3rd argument, defaults to 50%) and fudge factor (4th argument, defaults to 2). The two similar substrings are returned in a tuple with the similarity percentage.' }
	]}
	{ op:'similarity' sig:[
		{ proto:'(string, string, number = 0.5, number = 2) => [string, string, number]' desc:'Finds the similarity percentage of the first similar substrings within the two given strings using the similar operator.' }
	]}
	{ op:['slice' 'substr'] sig:[
		{ proto:'any[] => any[]' desc:'Returns a copy of the given array.' }
		{ proto:'(any[], number) => any[]' desc:'Returns a copy of the given array starting from the element at the given index.' }
		{ proto:'(any[], number, number) => any[]' desc:'Returns a copy of the given array starting from the element at the given index and ending immediately before the final given index. If the final index is negative, it is an offset from the end of the array.' }
		{ proto:'(string, number) => string' desc:'Returns a substring of the given string starting from the character at the given index.' }
		{ proto:'(string, number, number) => any[]' desc:'Returns a substring of the given string starting from the character at the given index and ending immediately before the final given index. If the final index is negative, it is an offset from the end of the string.' }
	]}
	{ op:'sort' sig:[
		{ proto:'(any[], sort[]) => any[]' desc:'Sorts the given array using the given sort array. Any array elements that are strings may indicate direction with a leading + or - for ascending and descending, respectively. The remainder of the string is parsed and used as an application. Any array elements that are applications are applied directly to get a comparison value. Any arguments that are objects may include a by key with an application value along with asc, desc, or dir flags. If no sorts are provided, an identity sort will be applied.' }
		{ proto:'(object, sort[]) => object' desc:'Sorts the given object keys using the given sort array. Any array elements that are strings may indicate direction with a leading + or - for ascending and descending, respectively. The remainder of the string is parsed and used as an application. Any array elements that are applications are applied directly to get a comparison value. Any arguments that are objects may include a by key with an application value along with asc, desc, or dir flags. If no sorts are provided, an identity sort will be applied to the keys.' }
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
	{ name:'case' desc:'Change the casing of the value.' opts:[
		{ name:'case' type:"'upper'|'lower'|'snake'|'kebab'|'pascal'|'camel'|'proper'" desc:'The case format to use.'}
	]}
	{ name:'date' desc:'Formats the value as a date string using placeholder characters, where repeated characters render more descriptive or padded values. Any non-placeholder characters are rendered as entered. The default format is yyyy-MM-dd. Available placeholders are:\\n\\n* y - year\\n* M - month\\n* d - date\\n* E - day of week\\n* H - hour (24 hour)\\n* h or k - hour (12 hour)\\n* m - minute\\n* s - second\\n* S - millisecond\\n* a - AM/PM\\n* z - timezone offset' opts:[
		{ name:'format' type:'string' desc:'The format template to apply.'}
	]}
	{ name:'dollar' desc:'Formats the value as a dollar amount with two decimal places by default.' opts:[
		{ name:'dec' type:'number' desc:'The number of decimal places to render.' }
		{ name:'group' type:'string' desc:'The string to use as a grouping divider.' }
		{ name:'sign' type:'string' desc:'The currency symbol to render.' }
		{ name:'neg' type:"'sign'|'wrap'|'both'" desc:'How to display negative values. Sign shows a leading minus symbol. Wrap wraps the value in parenteses.' }
	]}
	{ name:['int' 'integer'] desc:'Formats the value as an integer.' opts:[
		{ name:'group' type:'string' desc:'The string to use as a grouping divider.' }
		{ name:'neg' type:"'sign'|'wrap'|'both'" desc:'How to display negative values. Sign shows a leading minus symbol. Wrap wraps the value in parenteses.' }
	]}
	{ name:'iso8601' desc:'Formats the value as an ISO-8601 timestamp.' }
	{ name:['num' 'number'] desc:'Formats the value as an number.' opts:[
		{ name:'dec' type:'number' desc:'The number of decimal places to render.' }
		{ name:'group' type:'string' desc:'The string to use as a grouping divider.' }
		{ name:'neg' type:"'sign'|'wrap'|'both'" desc:'How to display negative values. Sign shows a leading minus symbol. Wrap wraps the value in parenteses.' }
	]}
	{ name:'or' desc:'Renders the first argument if the value is not truthy.' }
	{ name:'ordinal' desc:'Render the value as an ordinal number.' opts:[
		{ name:'group' type:'string' desc:'The string to use as a grouping divider.' }
	]}
	{ name:'pad' desc:'Renders the given value as a string and ensures it is at least the given length by padding both ends with a configurable string that defaults to a single space.' opts: [
		{ name:'len' type:'number' desc:'Minimum length for the formatted string.' }
		{ name:'pad' type:'number' desc:'The string to use for padding.' }
	]}
	{ name:'padl' desc:'Renders the given value as a string and ensures it is at least the given length by padding the beginning with a configurable string that defaults to a single space.' opts: [
		{ name:'len' type:'number' desc:'Minimum length for the formatted string.' }
		{ name:'pad' type:'number' desc:'The string to use for padding.' }
	]}
	{ name:'padr' desc:'Renders the given value as a string and ensures it is at least the given length by padding the end with a configurable string that defaults to a single space.' opts: [
		{ name:'len' type:'number' desc:'Minimum length for the formatted string.' }
		{ name:'pad' type:'number' desc:'The string to use for padding.' }
	]}
	{ name:'phone' desc:'Formats the value as phone number e.g. 111-2222, (111) 222-3333, 1-888-777-6666' }
	{ name:'time' desc:'Formats a date value as a time string using placeholder characters, where repeated characters render more descriptive or padded values. Any non-placeholder characters are rendered as entered. The default format is HH:mm:ss. {dateparts}' opts:[
		{ name:'format' type:'string' desc:'The format template to apply.'}
	]}
	{ name:'timestamp' desc:'Formats a date value as a timestamp using placeholder characters, where repeated characters render more descriptive or padded values. Any non-placeholder characters are rendered as entered. The default format is yyyy-MM-dd HH:mm:ss. {dateparts}' opts:[
		{ name:'format' type:'string' desc:'The format template to apply.'}
	]}
	{ name:'timestamptz' desc:'Formats a date value as a timestamp with timezone offset using placeholder characters, where repeated characters render more descriptive or padded values. Any non-placeholder characters are rendered as entered. The default format is yyyy-MM-dd HH:mm:sszzz. {dateparts}' opts:[
		{ name:'format' type:'string' desc:'The format template to apply.'}
	]}
	{ name:'trim' desc:'Removes any whitespace from the ends of the value.' }
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

    var docs$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        operators: operators,
        formats: formats,
        generateMarkdown: generateMarkdown
    });

    const docs = {
        operators: index.evaluate(operators),
    };
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
            const ctx = new index.Root(cloneDeep(report.context), { parameters: this.get('params') });
            const srcs = await this.buildSources();
            let text;
            this.fire('running');
            try {
                text = index.run(report, srcs, ctx, {
                    foot: this.frameExtra()
                });
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
            return `
      <style>
        @media screen {
          html:before, html:after { content: ' '; position: fixed; display: block; z-index: 2; box-shadow: 0 0 10px #000; transition: opacity 0.4s ease-in-out; opacity: 1; width: 100%; height: 5px; }
          html:before { top: -5px; }
          html:after { bottom: -5px; }
          html.scrolled-top:before { opacity: 0; }
          html.scrolled-bottom:after { opacity: 0; }

          body {
            background-color: ${this.get('@style.out.dark') || this.get('@style.dark')};
            padding: 2em;
          }
          .page-back {
            color: ${this.get('@style.out.fg') || this.get('@style.fg')};
            background-color: ${this.get('@style.out.bg') || this.get('@style.bg')};
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
        html.classList.add('scrolled-top');
      </script>
    `;
        }
        paperSize() {
            const size = this.get('pageSize');
            const type = this.get('report.type');
            if (type === 'flow') {
                if (size.width)
                    return `width: ${size.width}rem;`;
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
                        if (typeof w.text[0] === 'object' && w.text[0].font && w.text[0].font.size > n)
                            n = w.text[0].font.size;
                    }
                }
                return `${n}rem`;
            }
            else if (w.type !== 'container' && w.type !== 'repeater')
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
                return `border-bottom: ${b * 0.0625}rem solid ${color};`;
            else if (Array.isArray(b)) {
                if (b.length === 1)
                    return `border: ${b[0] * 0.0625}rem solid ${color};`;
                else if (b.length === 2)
                    return `border-style: solid; border-width: ${b[0] * 0.0625}rem ${b[1] * 0.0625}rem`;
                else if (b.length === 4)
                    return `border-style: solid; border-width: ${b[0] * 0.0625}rem ${b[1] * 0.0625}rem ${b[2] * 0.0625}rem ${b[3] * 0.0625}rem`;
            }
            else if (typeof b === 'string') {
                return `border: 1px dotted green;`;
            }
            else
                return `border-style: solid; border-width: ${(b.top || 0) * 0.0625}rem ${(b.right || 0) * 0.0625}rem ${(b.bottom || 0) * 0.0625}rem ${(b.left || 0) * 0.0625}rem;`;
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
            this.link(path, 'widget');
            this.set('temp.name', (path === 'report' ? 'Report' : (this.get(path + '.type') || '')) + ' ');
            this.set('temp.widget', path);
            const w = this.get('widget');
            if (w.type === 'html')
                this.editExpr(`${path}.html`, { html: true });
            else if (w.type === 'label' || w.type === 'measured')
                this.editExpr(`${path}.text`, { label: true });
            else if (w.type === 'image')
                this.editExpr(`${path}.url`);
            this.treeScrollToActive();
        }
        treeScrollToActive() {
            setTimeout(() => {
                const el = document.querySelector('.tree .node.active > .line');
                if (el && typeof el.scrollIntoView === 'function')
                    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
                val = index.stringify(val);
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
        }
        editReportSrc(ctx, key) {
            const path = ctx.resolve(key || undefined);
            this.set('show.bottom', true);
            this.set('temp.bottom.source', path);
            this.set('temp.bottom.tab', 'source');
            this.link(path, 'source');
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
        paste(target) {
            const w = this.get('copy');
            this.set('copy', undefined);
            if (!w || !target)
                return;
            const obj = cloneDeep(w.get());
            target.push('widgets', obj);
            if (Array.isArray(target.get('layout'))) {
                if (Array.isArray(w.get('^^/layout')))
                    target.push('layout', w.get(`^^/layout.${w.get('@index')}`));
                else
                    target.push('layout', [0, 0]);
            }
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
        async buildRoot() {
            const report = this.get('report');
            const res = new index.Root(cloneDeep(report.context), { parameters: this.get('params') });
            if (report.extraContext)
                index.evaluate(res, report.extraContext);
            const srcs = await this.buildSources();
            index.applySources(res, report.sources || [], srcs);
            return res;
        }
        async loadSourceData(av) {
            const load = this.get('actions.loadSourceData');
            let d;
            let vv = av;
            if (vv.type === 'fetch' && (vv.fetch || !vv.data)) {
                d = await this.fetchData(vv);
                if (!vv.eval)
                    d = { value: tryParseData(d, vv.header) };
                if (!vv.fetch)
                    vv.data = d;
            }
            else if ('data' in av && av.data) {
                if (!vv.eval && typeof av.data === 'string')
                    d = { value: tryParseData(av.data, av.header) };
                else
                    d = av.data;
            }
            else if ('values' in av && typeof av.values === 'function') {
                d = await av.values(this.get('params') || []);
            }
            else if ('input' in av && av.input) {
                d = { value: tryParseData(av.input, av.header) };
                av.data = d;
            }
            else {
                if (typeof load === 'function')
                    vv.data = d = await load(av);
            }
            return d;
        }
        async buildSources() {
            const report = this.get('report');
            const avs = this.get('sources') || [];
            const res = {};
            for (const src of report.sources || []) {
                const av = avs.find(s => s.name === src.source);
                if (av) {
                    const data = await this.loadSourceData(av);
                    if (data && typeof data === 'object' && 'value' in data)
                        res[av.name] = data;
                    else
                        res[av.name] = { value: data };
                }
            }
            return res;
        }
        async buildLocalContext(path) {
            const root = await this.buildRoot();
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
                    const src = index.evaluate(ctx, `*${this.get('report.sources.0.source')}`);
                    if (src) {
                        if (src.all)
                            ctx = index.extend(ctx, { value: src.all[0] });
                        else
                            ctx = index.extend(ctx, { value: src[0] });
                    }
                }
                else if (parts[0] === 'sources') {
                    if (parts[parts.length - 1] === 'base')
                        ctx = index.extend(ctx, { value: index.evaluate(ctx, `*${this.get(`report.sources.${parts[1]}.source`)}.value`) });
                    else
                        ctx = index.extend(ctx, { value: index.evaluate(ctx, `*${this.get(`report.sources.${parts[1]}.source`)}.0`) });
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
                                ctx = index.extend(ctx, { value: index.evaluate(ctx, loc.context) });
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
                const schema = index.inspect(ctx.root.sources[k].value);
                pl.fields.push({ name: `*${k}`, type: schema.type, fields: schema.fields });
            }
            let t = index.inspect(ctx.root.special);
            t.fields.forEach(f => (f.name = `@${f.name}`, pl.fields.push(f)));
            (this.get('report.parameters') || []).forEach((p) => pl.fields.push({ name: `!${p.name}`, type: p.type }));
            if (c !== c.root) {
                while (c) {
                    c = c.parent;
                    if (c === c.root)
                        prefix = '~';
                    else
                        prefix += '^';
                    if (last === c.value)
                        continue;
                    t = index.inspect(c.value, c !== c.root);
                    (t.fields || []).forEach(f => (f.name = `${prefix}${f.name}`, pl.fields.push(f)));
                    last = c.value;
                    if (c === c.root)
                        break;
                }
            }
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
            if (tab === 'text') {
                const node = getLastFocus();
                if (!node)
                    return;
                const cur = node.value;
                const pos = [node.selectionStart, node.selectionEnd];
                node.value = cur.substring(0, pos[0]) + ref + cur.substr(pos[1]);
                node.selectionStart = node.selectionEnd = pos[0] + ref.length;
                node.dispatchEvent(new InputEvent('input'));
                node.dispatchEvent(new InputEvent('change'));
                node.focus();
            }
            else if (tab === 'html') {
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
            let link;
            if (this.get('temp.widget') === path)
                this.set('temp.widget', 'report');
            if ((link = this.readLink('widget')) && link.keypath === path)
                this.unlink('widget');
            this.checkLink('expr', ctx.resolve());
            if (ctx.get('^^/groupEnds'))
                ctx.splice('^^/groupEnds', ctx.get('^^/groupEnds') - 1 - ctx.get('@index'), 1);
            if (ctx.get('../type') === 'repeater')
                ctx.set('^^/' + ctx.get('@key'), undefined);
            else if (path === 'report.header' || path === 'report.footer' || path === 'report.watermark' || path === 'report.overlay')
                this.set(path, undefined);
            else {
                if (Array.isArray(ctx.get('^^/layout')))
                    ctx.splice('^^/layout', ctx.get('@index'), 1);
                const idx = ctx.get('@index');
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
            const doc = docs.operators.find(d => d.op === op || Array.isArray(d.op) && d.op.includes(op));
            if (doc)
                return `${op}${Array.isArray(doc.op) ? `(alias ${doc.op.filter(n => n !== op).join(', ')})` : ''}
---${doc.note ? `
NOTE: ${doc.note}
` : ''}
${doc.sig.map(s => `${s.proto}\n  ${s.desc}\n`).join('\n')}${doc.opts ? `

Options
---
${doc.opts.map(o => `${Array.isArray(o.name) ? `${o.name[0]} (alias ${o.name.slice(1).join(', ')})` : o.name} - ${o.type}\n  ${o.desc}\n`).join('\n')}` : ''}`;
            else
                return `<no documentation available> ${op} may be a designer-only, undesirable, or custom operator`;
        }
        showOperatorDoc(op) {
            const doc = this.getOperatorDoc(op);
            if (doc)
                window.alert(doc);
        }
        getNestLevel(path) {
            return `level${Math.floor(path.split('.').length / 2)}`;
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
                const map = index.getOperatorMap();
                const search = this.get('opsearch');
                let keys = Object.keys(map).sort();
                if (search)
                    keys = keys.filter(k => ~k.indexOf(search));
                return keys.reduce((a, c) => (a[c] = map[c], a), {});
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
                try {
                    this.set(k.replace('temp', 'report'), index.parse(`'${v.replace(/'/g, '\\\'')}'`).v);
                }
                catch (_a) { }
            },
            'temp.expr.str'(v) {
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
            },
            'temp.expr.ast'(v, o) {
                if (!this.evalLock) {
                    this.evalLock = true;
                    if (o === undefined && v)
                        this.set('temp.expr.error', undefined);
                    try {
                        const str = index.stringify(v, { template: this.get('temp.expr.html') });
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
            'show.bottom'(v) {
                setTimeout(() => this.resetScrollers());
                if (v)
                    setTimeout(() => this.set('show.pad', true), 300);
                else
                    this.set('show.pad', false);
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
        },
        on: {
            init() {
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
                }, { capture: true });
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
                setTimeout(() => this._onChange(this.get('report')), 100);
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
                const listener = ctx.listen('click', ev => {
                    const p = ctx.resolve();
                    this.link(p, 'widget');
                    this.set('temp.widget', p);
                    this.set('temp.name', `${ctx.get('label') || ctx.get('type')} `);
                    ev.stopPropagation();
                    ev.preventDefault();
                    return false;
                });
                return {
                    teardown() {
                        selectObserver.cancel();
                        hoverObserver.cancel();
                        listener.cancel();
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
                    if (!ev.ctrlKey) {
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
                        console.log('ESCAPE!');
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
    function tryParseData(str, header) {
        try {
            return JSON.parse(str);
        }
        catch (_a) {
            const csv = index.evaluate({ str, header }, `parse(str, { csv:1 detect:1 header:header })`);
            if (!csv.length && str.length) {
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
            if (v === false && k !== 'classifyStyles')
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
            if (!res.margin || !res.margin.length)
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
        names: ['log'],
        apply(_name, args) {
            console.log.apply(console, args);
        }
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

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=raport.design.umd.js.map
