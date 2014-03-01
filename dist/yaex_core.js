/**
 * Yaex
 *
 * Yet another simple Javascript library.
 *
 * NOTICE OF LICENSE
 *
 * Licensed under the MIT License
 *
 * @author Xeriab Nabil (aka KodeBurner) <kodeburner@gmail.com> <xeriab@mefso.org>
 * @copyright Copyright (C) 2013 - 2014, MEFSO, Inc. (http://mefso.org/)
 * @license http://opensource.org/licenses/MIT The MIT License (MIT)
 * @link http://mefso.org/en-GB/projects/yaex
 * @since Version 0.14-dev Beta 1
 */

 if(function(e,t,n){"use strict";function i(e){var t,n;return n=L.toString,t=null===e?String(e):{}[n.call(e)]?L[n.call(e)]:typeof e}function r(e){return"string"===i(e)}function a(e){return"object"===i(e)}function o(e){return a(e)&&!c(e)&&Object.getPrototypeOf(e)===Object.prototype}function l(e){return Array.isArray(e)}function s(e){return"function"===i(e)?!0:!1}function c(e){return null!==e&&e===e.window}function u(e){return null!==e&&e.nodeType===e.DOCUMENT_NODE}function f(e){return!isNaN(parseFloat(e))&&isFinite(e)}function d(e){return i(e)===i()}function m(e){return"undefined"!==i(e)}function p(e){return"number"===i(e.length)}function h(e){var t=e.length;return c(e)?!1:1===e.nodeType&&t?!0:l(e)||!s(e)&&(0===t||f(t)&&t>0&&t-1 in e)}function b(e){return i(e)===i(null)}function x(e){for(var t in e)if(e.hasOwnProperty(t))return!1;return!0}function y(e){var t=E().exec(e);if(t&&t.length>1&&t[1]!==n){var i=t[1].replace(O(),"");if(i&&w().test(i))return!1}return!0}function g(e){return"boolean"===i(e)?!0:!1}function v(e){var t=[null,"",0,!1,n],r=!1;if(Array.isArray(e)&&0===e.length)r=!0;else if(s(e)&&y(e))r=!0;else if(a(e)&&x(e))r=!0;else if("number"===i(e)&&isNaN(e))r=e===Number.NEGATIVE_INFINITY||e===Number.POSITIVE_INFINITY?!1:!0;else for(var o=t.length;o>0;o--)if(t[o-1]===e){r=!0;break}return r}function Y(e,t,n){return null===t?-1:H.indexOf.call(t,e,n)}function w(){return M.reContainsWordChar||(M.reContainsWordChar=new RegExp("\\S+","g")),M.reContainsWordChar}function E(){return M.reGetFunctionBody||(M.reGetFunctionBody=new RegExp("{((.|\\s)*)}","m")),M.reGetFunctionBody}function O(){return M.reRemoveCodeComments||(M.reRemoveCodeComments=new RegExp("(\\/\\*[\\w\\'\\s\\r\\n\\*]*\\*\\/)|(\\/\\/[\\w\\s\\']*)","g")),M.reRemoveCodeComments}function A(e){if(!console)throw new Error(e);console.error(e)}function _(e){e=e;for(var t=(new Date).getTime(),n=0;1e7>n&&!((new Date).getTime()-t>e);n++);}function S(e){return e.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function C(e,t,n){var i=new Object;if(t&&f(t)&&1===t&&!n)for(var r=0;r<e.length;++r)d(e[r])||d(e[r][0])||d(e[r][1])||(i[e[r][0].toString()]=e[r][1]);else for(var r=0;r<e.length;++r)d(e[r])||(b(n)?i[e[r]]=null:i[e[r][0].toString()]=e[r][1]);return i}function j(e,t){for(var i=new Array,r=0;r<e.length;++r)e[r]!==n&&(i[e[r]]=null!==t?t:null);return i}function k(e,t){var n=[];if(t&&f(t)&&1===t)for(var i in e)e.hasOwnProperty(i)&&n.push([i,e[i]]);else for(var i in e)e.hasOwnProperty(i)&&n.push(e[i]);return n}function P(e){var t;try{return e?"true"===e||("false"===e?!1:"null"===e?null:isNaN(t=Number(e))||t+""!==e?/^[\[\{]/.test(e)?JSON.parse(e):e:t):e}catch(n){return e}}function G(e,t){var n="";t||(t=0);for(var r=" ",o=0;t+1>o;o++)r+="    ";if(a(e))for(var l in e){var s=e[l];a(s)?(n+=r+"'"+l+"' ...\n",n+=G(s,t+1)):n+=r+"'"+l+"' => \""+s+'"\n'}else n="===>"+e+"<===("+i(e)+")";return n}function T(e){return R.call(e,function(e){return null!==e})}function N(e,t){var i=t.length,r=e.length,a=0;if("number"==typeof i)for(;i>a;a++)e[r++]=t[a];else for(;t[a]!==n;)e[r++]=t[a++];return e.length=r,e}function U(e){return R.call(e,function(t,n){return e.indexOf(t)===n})}function D(e){return e.replace(/-+(.)?/g,function(e,t){return t?t.toUpperCase():""})}function F(e,t){return Math.floor(Math.random()*(t-e+1)+e)}function I(e,t){return R.call(e,t)}function W(e,t){var n,i;if(h(e)){for(n=0;n<e.length;n++)if(t.call(e[n],n,e[n])===!1)return e}else for(i in e)if(t.call(e[i],i,e[i])===!1)return e;return e}function B(){var e,t,i,r,a,o,l=arguments[0]||{},s=1,c=arguments.length,u=!1;for("boolean"==typeof l&&(u=l,l=arguments[1]||{},s=2),"object"==typeof l||M.Global.isFunction(l)||(l={}),c===s&&(l=this,--s);c>s;s++)if(null!==(e=arguments[s]))for(t in e)i=l[t],r=e[t],l!==r&&(u&&r&&(M.Global.isPlainObject(r)||(a=M.Global.isArray(r)))?(a?(a=!1,o=i&&M.Global.isArray(i)?i:[]):o=i&&M.Global.isPlainObject(i)?i:{},l[t]=M.Utility.Extend(u,o,r)):r!==n&&(l[t]=r))}var V=e.Yaex,M=new Object;M.Version="0.12",M.BuildNumber="1077",M.DevStatus="dev",M.CodeName="Karmen",M.Global=new Object,M.Mixin=new Object,"object"==typeof module&&"object"==typeof module.exports?module.exports=M:"function"==typeof define&&define.amd&&define(M),M.noConflict=function(){return e.Yaex=V,this},e.Yaex=M,M.Global=new Object,M.Mixin=new Object;var H=new Array,R=H.filter,L={};W("Boolean Number String Function Array Date RegExp Object Error global HTMLDocument".split(" "),function(e,t){L["[object "+t+"]"]=t.toLowerCase()}),B(M,{parseJSON:JSON.parse,parseXML:function(e){var t,i;if(!e||!M.Global.isString(e))return null;try{i=new DOMParser,t=i.parseFromString(e,"text/xml")}catch(r){t=n,M.Error(r)}return(!t||t.getElementsByTagName("parsererror").length)&&M.Error("Invalid XML: "+e),t},Evaluate:function(e){var n,i=eval;e=M.Trim(e),e&&(1===e.indexOf("use strict")?(n=t.createElement("script"),n.text=e,t.head.appendChild(n).parentNode.removeChild(n)):i(e))},Delay:_,Grep:I,Each:W,Merge:N,Error:A,classToType:L,hasOwnProperty:{}.hasOwnProperty,toString:{}.toString,reContainsWordChar:null,reGetFunctionBody:null,reRemoveCodeComments:null,Now:Date.now(),Date:Date()}),e.JSON&&(M.parseJSON=JSON.parse),B(M.Global,{variableDump:G,Type:i,type:i,isArray:l,isArraylike:h,isObject:a,isFunction:s,isWindow:c,isDocument:u,isString:r,isPlainObject:o,isUndefined:d,isDefined:m,likeArray:p,isNull:b,isEmpty:v,isObjectEmpty:x,isFunctionEmpty:y,isBool:g,isNumber:f,isNumeric:f,inArray:Y,Unique:U,Compact:T,Camelise:D,randomNumber:F,Dasherise:S,deserialiseValue:P,arrayToObject:C,objectToArray:k,intoArray:j})}(window,document),+function(){"use strict";Yaex.AjaxActive=0,Yaex.Global.Options={CoreAllowAjax:!0,CoreAllowDeferred:!0,CoreAllowCallbacks:!0,CoreAllowEvents:!0}}(Yaex),+function(){"use strict";var e=encodeURIComponent;Yaex.Utility={MODINFO:{NAME:"Utility",VERSION:"0.10",DEPS:"None"},LastUID:0,simpleExtend:function(e){var t,n,i,r,a=Array.prototype.slice.call(arguments,1);for(n=0,i=a.length;i>n;n++){r=a[n];for(t in r)e[t]=r[t]}return e},Extend:function(){var e,t,n,i,r,a,o=arguments[0]||{},l=1,s=arguments.length,c=!1;for("boolean"==typeof o&&(c=o,o=arguments[1]||{},l=2),"object"==typeof o||Yaex.Global.isFunction(o)||(o={}),s===l&&(o=this,--l);s>l;l++)if(null!==(e=arguments[l]))for(t in e)n=o[t],i=e[t],o!==i&&(c&&i&&(Yaex.Global.isPlainObject(i)||(r=Yaex.Global.isArray(i)))?(r?(r=!1,a=n&&Yaex.Global.isArray(n)?n:[]):a=n&&Yaex.Global.isPlainObject(n)?n:{},o[t]=Yaex.Utility.Extend(c,a,i)):void 0!==i&&(o[t]=i))},Create:Object.create||function(){function e(){}return function(t){return e.prototype=t,new e}}(),Stamp:function(e){return e._yaex_uid=e._yaex_uid||++Yaex.Utility.LastUID,e._yaex_uid},Bind:function(e,t){var n=Array.prototype.slice;if(e.bind)return e.bind.apply(e,n.call(arguments,1));var i=n.call(arguments,2);return function(){return e.apply(t,i.length?i.concat(n.call(arguments)):arguments)}},Throttle:function(e,t,n){var i,r,a,o;return o=function(){i=!1,r&&(a.apply(n,r),r=!1)},a=function(){i?r=arguments:(e.apply(n,arguments),setTimeout(o,t),i=!0)}},Noop:function(){return!1},Trim:function(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")},splitWords:function(e){return Yaex.Utility.Trim(e).split(/\s+/)},setOptions:function(e,t){e.hasOwnProperty("options")||(e.options=e.options?Yaex.Utility.Create(e.options):{});for(var n in t)e.options[n]=t[n];return e.options},isArray:Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},emptyImageUrl:"data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",jsonStringify:function(e,t){var n,i="";t=Yaex.Global.isUndefined(t)?1:t;var r=Yaex.Global.Type(e);switch(r){case"function":i+=e;break;case"boolean":i+=e?"true":"false";break;case"object":if(null===e)i+="null";else if(e instanceof Array){i+="[";var a=e.length;for(n=0;a-1>n;++n)i+=Yaex.Utility.jsonStringify(e[n],t+1);i+=Yaex.Utility.jsonStringify(e[a-1],t+1)+"]"}else{i+="{";for(var o in e)e.hasOwnProperty(o)&&(i+='"'+o+'":'+Yaex.Utility.jsonStringify(e[o],t+1));i+="}"}break;case"string":var l=e,s={"\\\\":"\\\\",'"':'\\"',"/":"\\/","\\n":"\\n","\\r":"\\r","\\t":"\\t"};for(n in s)s.hasOwnProperty(n)&&(l=l.replace(new RegExp(n,"g"),s[n]));i+='"'+l+'"';break;case"number":i+=String(e)}return i+=t>1?",":"",1===t&&(i=i.replace(/,([\]}])/g,"$1")),i.replace(/([\[{]),/g,"$1")},Serialise:function(e,t,n,i){var r,a=Yaex.Global.isArray(t);Yaex.Each(t,function(t,o){r=Yaex.Global.Type(o),i&&(t=n?i:i+"["+(a?"":t)+"]"),!i&&a?e.add(o.name,o.value):Yaex.Global.isArray(r)||!n&&Yaex.Global.isObject(r)?Yaex.Utility.Serialise(e,o,n,t):e.add(t,o)})},Parameters:function(t,n){var i=[];return i.add=function(t,n){this.push(e(t)+"="+e(n))},Yaex.Utility.Serialise(i,t,n),i.join("&").replace(/%20/g,"+")}},function(){function e(e){return window["webkit"+e]||window["moz"+e]||window["ms"+e]}function t(e){var t=+new Date,i=Math.max(0,16-(t-n));return n=t+i,window.setTimeout(e,i)}var n=0,i=window.requestAnimationFrame||e("RequestAnimationFrame")||t,r=window.cancelAnimationFrame||e("CancelAnimationFrame")||e("CancelRequestAnimationFrame")||function(e){window.clearTimeout(e)};Yaex.Utility.requestAnimationFrame=function(e,n,r,a){return r&&i===t?void e.call(n):i.call(window,Yaex.Bind(e,n),a)},Yaex.Utility.cancelAnimationFrame=function(e){e&&r.call(window,e)}}(),Yaex.Extend=Yaex.Utility.Extend,Yaex.Bind=Yaex.Utility.Bind,Yaex.Stamp=Yaex.Utility.Stamp,Yaex.setOptions=Yaex.Utility.setOptions,Yaex.Noop=Yaex.Utility.Noop,Yaex.Global.Trim=Yaex.Utility.Trim}(Yaex),+function(){"use strict";Yaex.Class=function(){},Yaex.Class.Extend=function(e){var t=function(){this.initialise&&this.initialise.apply(this,arguments),this._initialHook.length&&this.callInitialHooks()},n=t.__super__=this.prototype,i=Yaex.Utility.Create(n);i.constructor=t,t.prototype=i;for(var r in this)this.hasOwnProperty(r)&&"prototype"!==r&&(t[r]=this[r]);return e.statics&&(Yaex.Extend(t,e.statics),delete e.statics),e.includes&&(Yaex.Utility.Extend.apply(null,[i].concat(e.includes)),delete e.includes),i.options&&(e.options=Yaex.Utility.Extend(Yaex.Utility.Create(i.options),e.options)),Yaex.Extend(i,e),i._initialHook=[],i.callInitialHooks=function(){if(!this._initialHookCalled){n.callInitialHooks&&n.callInitialHooks.call(this),this._initialHookCalled=!0;for(var e=0,t=i._initialHook.length;t>e;e++)i._initialHook[e].call(this)}},t},Yaex.Class.Include=function(e){Yaex.Extend(this.prototype,e)},Yaex.Class.mergeOptions=function(e){Yaex.Extend(this.prototype.options,e)},Yaex.Class.addInitialHook=function(e){var t,n=Array.prototype.slice.call(arguments,1);t=Yaex.Global.isFunction(e)?e:function(){this[e].apply(this,n)},this.prototype._initialHook=this.prototype._initialHook||[],this.prototype._initialHook.push(t)}}(Yaex),+function(){"use strict";function e(e){var t=document.createElement("input");return t.setAttribute("type",e),"text"!==t.type}function t(e){var t=this.OS={},n=this.Browser={},i=e.match(/Linux/)||e.match(/Windows/)||e.match(/iOS/)||e.match(/Android/)||"Unknown",r=e.match(/Web[kK]it[\/]{0,1}([\d.]+)/),a=e.match(/Gecko[\/]{0,1}([\d.]+)/),o=e.match(/(Android);?[\s\/]+([\d.]+)?/),l=e.match(/(iPad).*OS\s([\d_]+)/),s=e.match(/(iPod)(.*OS\s([\d_]+))?/),c=!l&&e.match(/(iPhone\sOS)\s([\d_]+)/),u=e.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),f=u&&e.match(/TouchPad/),d=e.match(/Kindle\/([\d.]+)/),m=e.match(/Silk\/([\d._]+)/),p=e.match(/(BlackBerry).*Version\/([\d.]+)/),h=e.match(/(BB10).*Version\/([\d.]+)/),b=e.match(/(RIM\sTablet\sOS)\s([\d.]+)/),x=e.match(/PlayBook/),y=e.match(/Chrome\/([\d.]+)/)||e.match(/CriOS\/([\d.]+)/),g=e.match(/Firefox\/([\d.]+)/),v=e.match(/MSIE ([\d.]+)/),Y=r&&e.match(/Mobile\//)&&!y,w=e.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/)&&!y;v=e.match(/MSIE\s([\d.]+)/),(n.Webkit=!!r)&&(n.Version=r[1]),(n.Gecko=!!a)&&(n.Version=a[1]),o&&(t.Android=!0,t.Version=o[2]),c&&!s&&(t.iOS=t.iPhone=!0,t.Version=c[2].replace(/_/g,".")),l&&(t.iOS=t.iPad=!0,t.Version=l[2].replace(/_/g,".")),s&&(t.iOS=t.iPod=!0,t.Version=s[3]?s[3].replace(/_/g,"."):null),u&&(t.webOS=!0,t.Version=u[2]),f&&(t.Touchpad=!0),p&&(t.Blackberry=!0,t.Version=p[2]),h&&(t.BB10=!0,t.Version=h[2]),b&&(t.Rimtabletos=!0,t.Version=b[2]),x&&(n.Playbook=!0),d&&(t.Kindle=!0,t.Version=d[1]),m&&(n.Silk=!0,n.Version=m[1]),!m&&t.Android&&e.match(/Kindle Fire/)&&(n.Silk=!0),y&&(n.Chrome=!0,n.Version=y[1]),g&&(n.Firefox=!0,n.Version=g[1]),v&&(n.IE=!0,n.Version=v[1]),Y&&(e.match(/Safari/)||t.iOS)&&(n.Safari=!0),w&&(n.WebView=!0),v&&(n.IE=!0,n.Version=v[1]),t.Tablet=!!(l||x||o&&!e.match(/Mobile/)||g&&e.match(/Tablet/)||v&&!e.match(/Phone/)&&e.match(/Touch/)),t.Phone=!(t.Tablet||t.iPod||!(o||c||u||p||h||y&&e.match(/Android/)||y&&e.match(/CriOS\/([\d.]+)/)||g&&e.match(/Mobile/)||v&&e.match(/Touch/))),t.Desktop=!!n.IE||n.Firefox||n.Safari||n.Chrome,t.Platform=i[0]}Yaex.Extend({UserAgent:{}});var n="devicePixelRatio"in window&&window.devicePixelRatio>1;if(!n&&"matchMedia"in window){var i=window.matchMedia("(min-resolution:144dppx)");n=i&&i.matches}var r=navigator.msPointerEnabled&&navigator.msMaxTouchPoints&&!window.PointerEvent,a=window.PointerEvent&&navigator.pointerEnabled&&navigator.maxTouchPoints||r;t.call(Yaex.UserAgent,navigator.userAgent),Yaex.Extend(Yaex.UserAgent,{Features:{Audio:!!document.createElement("audio").canPlayType,Canvas:!!document.createElement("canvas").getContext,Command:"type"in document.createElement("command"),Time:"valueAsDate"in document.createElement("time"),Video:!!document.createElement("video").canPlayType,Offline:navigator.hasOwnProperty("onLine")&&navigator.onLine,ApplicationCache:!!window.applicationCache,ContentEditable:"isContentEditable"in document.createElement("span"),DragDrop:"draggable"in document.createElement("span"),Geolocation:!!navigator.geolocation,History:!(!window.history||!window.history.pushState),WebSockets:!!window.WebSocket,WebWorkers:!!window.Worker,Retina:n,Pointer:Yaex.Global.isUndefined(a)?!1:a,MicrosoftPointer:Yaex.Global.isUndefined(r)?!1:r,Autofocus:"autofocus"in document.createElement("input"),InputPlaceholder:"placeholder"in document.createElement("input"),TextareaPlaceholder:"placeholder"in document.createElement("textarea"),InputTypeEmail:e("email"),InputTypeNumber:e("number"),InputTypeSearch:e("search"),InputTypeTel:e("tel"),InputTypeUrl:e("url"),IndexDB:!!window.indexedDB,LocalStorage:"localStorage"in window&&null!==window.localStorage,WebSQL:!!window.openDatabase,Orientation:"orientation"in window,Touch:"ontouchend"in document,ScrollTop:("pageXOffset"in window||"scrollTop"in document.documentElement)&&!Yaex.UserAgent.OS.webOS,Standalone:"standalone"in window.navigator&&window.navigator.standalone}})}(Yaex),+function(){"use strict";function e(t){var n=[["resolve","done",Yaex.Callbacks({once:1,memory:1}),"resolved"],["reject","fail",Yaex.Callbacks({once:1,memory:1}),"rejected"],["notify","progress",Yaex.Callbacks({memory:1})]],i="pending",r={state:function(){return i},always:function(){return a.done(arguments).fail(arguments),this},then:function(){var t=arguments;return e(function(e){Yaex.Each(n,function(n,i){var o=Yaex.Global.isFunction(t[n])&&t[n];a[i[1]](function(){var t=o&&o.apply(this,arguments);if(t&&Yaex.Global.isFunction(t.promise))t.promise().done(e.resolve).fail(e.reject).progress(e.notify);else{var n=this===r?e.promise():this,a=o?[t]:arguments;e[i[0]+"With"](n,a)}})}),t=null}).promise()},promise:function(e){return null!==e?Yaex.Extend(e,r):r}},a=new Object;return Yaex.Each(n,function(e,t){var o=t[2],l=t[3];r[t[1]]=o.add,l&&o.add(function(){i=l},n[1^e][2].disable,n[2][2].lock),a[t[0]]=function(){return a[t[0]+"With"](this===a?r:this,arguments),this},a[t[0]+"With"]=o.fireWith}),r.promise(a),t&&t.call(a,a),a}var t=Array.prototype.slice;Yaex.Global.When=function(n){var i,r,a,o=t.call(arguments),l=o.length,s=0,c=1!==l||n&&Yaex.Global.isFunction(n.promise)?l:0,u=1===c?n:e(),f=function(e,n,r){return function(a){n[e]=this,r[e]=arguments.length>1?t.call(arguments):a,r===i?u.notifyWith(n,r):--c||u.resolveWith(n,r)}};if(l>1)for(i=new Array(l),r=new Array(l),a=new Array(l);l>s;++s)o[s]&&Yaex.Global.isFunction(o[s].promise)?o[s].promise().done(f(s,a,o)).fail(u.reject).progress(f(s,r,i)):--c;return c||u.resolveWith(a,o),u.promise()},Yaex.Global.Deferred=e}(Yaex),+function(e,t,n){"use strict";Yaex.Callbacks=function(e){e=Yaex.Utility.simpleExtend({},e);var t,i,r,a,o,l,s=[],c=!e.once&&[],u=function(n){for(t=e.memory&&n,i=!0,l=a||0,a=0,o=s.length,r=!0;s&&o>l;++l)if(s[l].apply(n[0],n[1])===!1&&e.stopOnFalse){t=!1;break}r=!1,s&&(c?c.length&&u(c.shift()):t?s.length=0:f.disable())},f={add:function(){if(s){var n=s.length,i=function(t){Yaex.Each(t,function(t,n){"function"==typeof n?e.unique&&f.has(n)||s.push(n):n&&n.length&&"string"!=typeof n&&i(n)})};i(arguments),r?o=s.length:t&&(a=n,u(t))}return this},remove:function(){return s&&Yaex.Each(arguments,function(e,t){for(var n;(n=Yaex.Global.inArray(t,s,n))>-1;)s.splice(n,1),r&&(o>=n&&--o,l>=n&&--l)}),this},has:function(e){return!(!s||!(e?Yaex.Global.inArray(e,s)>-1:s.length))},empty:function(){return o=s.length=0,this},disable:function(){return s=c=t=n,this},disabled:function(){return!s},lock:function(){return c=n,t||f.disable(),this},locked:function(){return!c},fireWith:function(e,t){return!s||i&&!c||(t=t||[],t=[e,t.slice?t.slice():t],r?c.push(t):u(t)),this},fire:function(){return f.fireWith(this,arguments)},fired:function(){return!!i}};return f}}(window,document),+function(){"use strict";Yaex.Evented=Yaex.Class.Extend({on:function(e,t,n){if("object"==typeof e)for(var i in e)this._on(i,e[i],t);else{e=Yaex.Utility.splitWords(e);for(var r=0,a=e.length;a>r;r++)this._on(e[r],t,n)}return this},off:function(e,t,n){if(e)if("object"==typeof e)for(var i in e)this._off(i,e[i],t);else{e=Yaex.Utility.splitWords(e);for(var r=0,a=e.length;a>r;r++)this._off(e[r],t,n)}else delete this._events;return this},_on:function(e,t,n){var i=this._events=this._events||{},r=n&&n!==this&&Yaex.Stamp(n);if(r){var a=e+"_idx",o=e+"_len",l=i[a]=i[a]||{},s=Yaex.Stamp(t)+"_"+r;l[s]||(l[s]={callback:t,ctx:n},i[o]=(i[o]||0)+1)}else i[e]=i[e]||[],i[e].push({callback:t})},_off:function(e,t,n){var i=this._events,r=e+"_idx",a=e+"_len";if(i){if(!t)return delete i[e],delete i[r],void delete i[a];var o,l,s,c,u,f=n&&n!==this&&Yaex.Stamp(n);if(f)u=Yaex.Stamp(t)+"_"+f,o=i[r],o&&o[u]&&(c=o[u],delete o[u],i[a]--);else for(o=i[e],l=0,s=o.length;s>l;l++)if(o[l].callback===t){c=o[l],o.splice(l,1);break}c&&(c.callback=Yaex.Noop)}},fire:function(e,t,n){if(!this.listens(e,n))return this;var i=Yaex.Utility.Extend({},t,{type:e,target:this}),r=this._events;if(r){var a,o,l,s,c=r[e+"_idx"];if(r[e])for(l=r[e].slice(),a=0,o=l.length;o>a;a++)l[a].callback.call(this,i);for(s in c)c[s].callback.call(c[s].ctx,i)}return n&&this._propagateEvent(i),this},listens:function(e,t){var n=this._events;if(n&&(n[e]||n[e+"_len"]))return!0;if(t)for(var i in this._eventParents)if(this._eventParents[i].listens(e))return!0;return!1},once:function(e,t,n){if("object"==typeof e){for(var i in e)this.once(i,e[i],t);return this}var r=Yaex.Bind(function(){this.off(e,t,n).off(e,r,n)},this);return this.on(e,t,n).on(e,r,n)},addEventParent:function(e){return this._eventParents=this._eventParents||{},this._eventParents[Yaex.Stamp(e)]=e,this},removeEventParent:function(e){return this._eventParents&&delete this._eventParents[Yaex.Stamp(e)],this},_propagateEvent:function(e){for(var t in this._eventParents)this._eventParents[t].fire(e.type,Yaex.Extend({layer:e.target},e))}});var e=Yaex.Evented.prototype;e.addEventListener=e.on,e.removeEventListener=e.clearAllEventListeners=e.off,e.addOneTimeEventListener=e.once,e.fireEvent=e.fire,e.hasEventListeners=e.listens,Yaex.Mixin.Events=e}(Yaex),Object.prototype.__defineGetter__&&!Object.defineProperty&&(Object.defineProperty=function(e,t,n){"get"in n&&e.__defineGetter__(t,n.get),"set"in n&&e.__defineSetter__(t,n.set)}),"object"!=typeof Yaex||!window.Yaex)throw"Yaex.ObjectOriented: not found Yaex. Please ensure `yaex.js` is referenced before the `ObjectOriented.js` file.";+function(window,document,undefined){"use strict";function setAccessor(e,t){Yaex.Global.isObject(e)&&Yaex.Global.isObject(t)&&!function(e,t){for(var n in t)Object.defineProperty(e,n,t[n])}(e,t)}function createClass(){var len,objectOrientedClassName,baseClass,members,klass;return len=arguments.length,objectOrientedClassName=arguments[0],baseClass=arguments[1],members=arguments[len-1],Yaex.Global.isString(objectOrientedClassName)||""===Yaex.Global.Trim(objectOrientedClassName)||Yaex.Error("not defined Yaex.ObjectOriented ClassName in 1st argument, must be {string}."),2===len&&Yaex.Global.isObject(members)||3===len&&Yaex.Global.isFunction(baseClass)&&Yaex.Global.isObject(members)||Yaex.Error("wrong arguments."),members.initialize||Yaex.Global.isFunction(members.initialize)||Yaex.Error("not defined initialize method in member object."),eval("klass=function "+objectOrientedClassName+'(){try {this.initialize.apply(this, arguments)}catch(e){console.log(e.stack);throw "required `new` operator in `'+objectOrientedClassName+'`."}}'),3===len&&(klass.prototype=new baseClass,klass.prototype.constructor=klass),Yaex.Utility.Extend(klass.prototype,members),klass}function isA(e,t){for(var n=Yaex.Global.isFunction(e)?new e:e,i=!1;!(i||(i=n instanceof t,i||n instanceof Object));)n=n.__proto__;return i}var global=this,slice=[].slice;Yaex.Global.isString=Yaex.Global.isString||function(e){return Yaex.Global.Type(e)},Yaex.Global.isDefined=Yaex.Global.isDefined||function(e){"undefined"!==Yaex.Global.Type(e)},Yaex.ObjectOriented={accessor:setAccessor,create:createClass,isA:isA}}(window,document),Yaex.Handler=Yaex.Class.Extend({Initialise:function(e){this._map=e},Enable:function(){this._Enabled||(this._Enabled=!0,this.addHooks())},Disable:function(){this._Enabled&&(this._Enabled=!1,this.removeHooks())},Enabled:function(){return!!this._Enabled}});