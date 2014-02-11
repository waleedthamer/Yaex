/**
 * Yaex
 *
 * Yet another simple Javascript library.
 *
 * NOTICE OF LICENSE
 *
 * Licensed under the Open Software License version 3.0
 *
 * This source file is subject to the Open Software License (OSL 3.0) that is
 * bundled with this package in the files license.txt / license.rst. It is also
 * available through the world wColorIDe web at this URL:
 * http://opensource.org/licenses/OSL-3.0 If you did not receive a copy of the
 * license and are unable to obtain it through the world wide web, please send
 * an email to licensing@mefso.org so we can send you a copy immediately.
 *
 * @author Xeriab Nabil (aka KodeBurner) <kodeburner@gmail.com> <xeriab@mefso.org>
 * @copyright Copyright (C) 2013 - 2014, MEFSO, Inc. (http://mefso.org/)
 * @license http://opensource.org/licenses/OSL-3.0 Open Software License (OSL 3.0)
 * @link http://mefso.org/en-GB/projects/yaex
 * @since Version 0.10-dev Beta 4
 */

(function(){"use strict";function t(t){return null==t?String(t):"object"==typeof t||"function"==typeof t?fe[ye.call(t)]||"object":typeof t}function e(e){return"function"===t(e)}function n(t){return null!=t&&t===t.window}function r(t){return null!==t&&t.nodeType===t.DOCUMENT_NODE}function o(e){return"object"===t(e)}function a(e){return"undefined"===t(e)}function s(e){if("object"!==t(e)||e.nodeType||n(e))return!1;try{if(e.constructor&&!xe.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(r){return!1}return!0}function u(t){return!isNaN(parseFloat(t))&&isFinite(t)}function c(t){return t instanceof Array}function l(t){return"number"==typeof t.length}function f(t){var e;for(e in t)return!1;return!0}function h(t,e,n){return null==e?-1:X.indexOf.call(e,t,n)}function p(e){return"string"===t(e)}function d(t){throw console.error(t),new d(t)}function g(t){return V.call(t,function(t){return null!==t})}function m(t){return t.length>0?I.fn.concat.apply([],t):t}function v(t){t=1e3*t;for(var e=(new Date).getTime(),n=0;1e7>n&&!((new Date).getTime()-e>t);n++);}function y(t){return t.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function x(t){return t in K?K[t]:K[t]=new RegExp("(^|\\s)"+t+"(\\s|$)")}function b(t){var e,n;return Z[t]||(e=G.createElement(t),G.body.appendChild(e),n=D(e).getPropertyValue("display"),e.parentNode.removeChild(e),"none"===n&&(n="block"),Z[t]=n),Z[t]}function w(t){return"children"in t?q.call(t.children):I.map(t.childNodes,function(t){return 1===t.nodeType?t:void 0})}function S(t,e,n){for(W in e)n&&(s(e[W])||c(e[W]))?(s(e[W])&&!s(t[W])&&(t[W]={}),c(e[W])&&!c(t[W])&&(t[W]=[]),S(t[W],e[W],n)):e[W]!==H&&(t[W]=e[W])}function E(t,e){var n=e||[];return null!==t&&(Y(Object(t))?I.merge(n,p(t)?[t]:t):me.call(n,t)),n}function O(t,e){var n=e.length,r=t.length,i=0;if("number"==typeof n)for(;n>i;i++)t[r++]=e[i];else for(;e[i]!==H;)t[r++]=e[i++];return t.length=r,t}function T(t,e){return null==e?I(t):I(t).filter(e)}function C(t,e){return t!==e&&t.contains(e)}function N(t,n,r,i){return e(n)?n.call(t,r,i):n}function j(t,e,n){null==n?t.removeAttribute(e):t.setAttribute(e,n)}function P(t,e){var n=t.className,r=n&&n.baseVal!==H;return e===H?r?n.baseVal:n:(r=r?n.baseVal=e:t.className=e,void 0)}function _(t){var e;try{return t?"true"==t||("false"==t?!1:"null"==t?null:isNaN(e=Number(t))||e+""!==t?/^[\[\{]/.test(t)?I.parseJSON(t):t:e):t}catch(n){return t}}function Y(t){var e=t.length,n=I.type(t);return I.isWindow(t)?!1:1===t.nodeType&&e?!0:"array"===n||"function"!==n&&(0===e||"number"==typeof e&&e>0&&e-1 in t)}function A(t,e){return Math.random()*(e-t+1)+t}function k(t,e){if(e in t)return e;for(var n=e.charAt(0).toUpperCase()+e.slice(1),r=e,i=Re.length;i--;)if(e=Re[i]+n,e in t)return e;return r}function D(t){return window.getComputedStyle(t,null)}function F(t,e,n){var r=_e.exec(e);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):e}function R(t,e,n,r,i){for(var o=n===(r?"border":"content")?4:"width"===e?1:0,a=0;4>o;o+=2)"margin"===n&&(a+=I.css(t,n+Fe[o],!0,i)),r?("content"===n&&(a-=I.css(t,"padding"+Fe[o],!0,i)),"margin"!==n&&(a-=I.css(t,"border"+Fe[o]+"Width",!0,i))):(a+=I.css(t,"padding"+Fe[o],!0,i),"padding"!==n&&(a+=I.css(t,"border"+Fe[o]+"Width",!0,i)));return a}function L(t,e,n){var r=!0,i="width"===e?t.offsetWidth:t.offsetHeight,o=D(t),a=I.Support.boxSizing&&"border-box"===I.css(t,"boxSizing",!1,o);if(0>=i||null===i){if(i=Ne(t,e,o),(0>i||null===i)&&(i=t.style[e]),Ye.test(i))return i;r=a&&(I.Support.boxSizingReliable||i===t.style[e]),i=parseFloat(i)||0}return i+R(t,e,n||(a?"border":"content"),r,o)+"px"}function M(t,e){e(t);for(var n in t.childNodes)M(t.childNodes[n],e)}function $(t){return I.isWindow(t)?t:9===t.nodeType&&t.defaultView}var H,W,I,z,U,B,J={},X=[],q=X.slice,V=X.filter,G=window.document,Q=G.documentElement,Z={},K={},te=/^\s*<(\w+|!)[^>]*>/,ee=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,ne=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,re=/complete|loaded|interactive/,ie=/^[\w-]*$/,oe=/^(?:body|html)$/i,ae=["title","value","val","css","html","text","data","width","height","offset"],se=["after","prepend","before","append"],ue=G.createElement("table"),ce=G.createElement("tr"),le={tr:G.createElement("tbody"),tbody:ue,thead:ue,tfoot:ue,td:ce,th:ce,"*":G.createElement("div")},fe={},he=[],pe="0.10-dev",de="1243",ge=X.concat,me=X.push,ve=X.indexOf,ye=fe.toString,xe=fe.hasOwnProperty,be=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,we=typeof H,Se=G.createElement("div"),Ee={tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable",scrollw:"scrollWidth",scrollh:"scrollHeight",tagname:"tagName"},Oe=/\S+/g,Te=/^<(\w+)\s*\/?>(?:<\/\1>|)$/;J.Matches=function(t,e){if(!t||1!==t.nodeType)return!1;var n=t.webkitMatchesSelector||t.mozMatchesSelector||t.oMatchesSelector||t.matchesSelector;if(n)return n.call(t,e);var r,i=t.parentNode,o=!i;return o&&(i=Se).appendChild(t),r=~J.QSA(i,e).indexOf(t),o&&Se.removeChild(t),r};var Ce=function(t,e){var n="";e||(e=0);for(var r=" ",i=0;e+1>i;i++)r+=" ";if("object"==typeof t)for(var o in t){var a=t[o];"object"==typeof a?(n+=r+"'"+o+"' ...\n",n+=Ce(a,e+1)):n+=r+"'"+o+"' => \""+a+'"\n'}else n="===>"+t+"<===("+typeof t+")";return n};U=function(t){return t.replace(/-+(.)?/g,function(t,e){return e?e.toUpperCase():""})},B=function(t){return V.call(t,function(e,n){return t.indexOf(e)===n})},J.Fragment=function(t,e,n){var r,i,o;return ee.test(t)&&(r=I(G.createElement(RegExp.$1))),r||(t.replace&&(t=t.replace(ne,"<$1></$2>")),e===H&&(e=te.test(t)&&RegExp.$1),e in le||(e="*"),o=le[e],o.innerHTML=""+t,r=I.each(q.call(o.childNodes),function(){o.removeChild(this)})),s(n)&&(i=I(r),I.each(n,function(t,e){ae.indexOf(t)>-1?i[t](e):i.attr(t,e)})),r},J.Y=function(t,e){return t=t||[],t.__proto__=I.fn,t.selector=e||"",t},J.isYaex=function(t){return t instanceof J.Y},J.init=function(t,n){var r;if(!t)return J.Y();if(p(t))if(t=t.trim(),"<"===t[0]&&">"===t[t.length-1]&&te.test(t)&&t.length>=3)r=J.Fragment(t,RegExp.$1,n),t=null;else{if(n!==H)return I(n).find(t);r=J.QSA(G,t)}else{if(e(t))return I(G).ready(t);if(J.isYaex(t))return t;if(c(t))r=g(t);else if(o(t))r=[t],t=null;else if(te.test(t))r=J.Fragment(t.trim(),RegExp.$1,n),t=null;else{if(n!==H)return I(n).find(t);r=J.QSA(G,t)}}return J.Y(r,t)},I=function(t,e){return J.init(t,e)},I._Extend=function(t){var e,n=q.call(arguments,1);return"boolean"==typeof t&&(e=t,t=n.shift()),n.forEach(function(n){S(t,n,e)}),t},I.Extend=function(){var t,n,r,i,o,a,s=arguments[0]||{},u=1,c=arguments.length,l=!1;for("boolean"==typeof s&&(l=s,s=arguments[1]||{},u=2),"object"==typeof s||e(s)||(s={}),c===u&&(s=this,--u);c>u;u++)if(null!==(t=arguments[u]))for(n in t)r=s[n],i=t[n],s!==i&&(l&&i&&(I.isPlainObject(i)||(o=I.isArray(i)))?(o?(o=!1,a=r&&I.isArray(r)?r:[]):a=r&&I.isPlainObject(r)?r:{},s[n]=I.Extend(l,a,i)):i!==H&&(s[n]=i));return s},J.QSA=function(t,e){var n,i="#"==e[0],o=!i&&"."==e[0],a=i||o?e.slice(1):e,s=ie.test(a);return r(t)&&s&&i?(n=t.getElementById(a))?[n]:[]:1!==t.nodeType&&9!==t.nodeType?[]:q.call(s&&!i?o?t.getElementsByClassName(a):t.getElementsByTagName(e):t.querySelectorAll(e))},I.trim=function(t){return null==t?"":String.prototype.trim.call(t)},I.ArrayToObject=function(t,e){for(var n={},r=0;r<t.length;++r)t[i]!==H&&(n[t[r]]=null!==e?e:null);return n},I.InToArray=function(t,e){for(var n=[],r=0;r<t.length;++r)t[i]!==H&&(n[t[r]]=null!==e?e:null);return n},I.ObjectToArray=function(t){var e=[];for(var n in t)t.hasOwnProperty(n)&&e.push(t[n]);return e},I.type=t,I.isUndefined=a,I.isFunction=e,I.isWindow=n,I.isArray=c,I.isObject=o,I.isNumeric=u,I.isPlainObject=s,I.Error=d,I.isEmptyObject=f,I.inArray=h,I.isString=p,I.GUID=0,I.camelCase=U,I.core_version=pe,I.version=pe,I.core_deletedIds=he,I.class2type=fe,I.core_concat=ge,I.core_push=me,I.core_slice=q,I.core_indexOf=ve,I.core_toString=ye,I.core_hasOwn=xe,I.core_rnotwhite=Oe,I.delay=v,I.vardump=Ce,I.getWindow=$,I.contains=C,I.randomNumber=A,I.makeArray=E,I.merge=O,I.emptyArray=X,I.timers=[],I.location=window.location,I.Globals={},I.Now=Date.now,I.UserAgent={},I.Browser={},I.Support={},I.expr={},I.UUID=0,I.map=function(t,e){var n,r,i,o=[];if(l(t))for(r=0;r<t.length;r++)n=e(t[r],r),null!=n&&o.push(n);else for(i in t)n=e(t[i],i),null!=n&&o.push(n);return m(o)},I.each=function(t,e){var n,r;if(Y(t)){for(n=0;n<t.length;n++)if(e.call(t[n],n,t[n])===!1)return t}else for(r in t)if(e.call(t[r],r,t[r])===!1)return t;return t},I.grep=function(t,e){return V.call(t,e)},window.JSON&&(I.ParseJSON=JSON.parse),I.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(t,e){fe["[object "+e+"]"]=e.toLowerCase()}),I.fn=J.prototype={forEach:X.forEach,reduce:X.reduce,push:X.push,sort:X.sort,indexOf:X.indexOf,concat:X.concat,map:function(t){return I(I.map(this,function(e,n){return t.call(e,n,e)}))},slice:function(){return I(q.apply(this,arguments))},ready:function(t){return re.test(G.readyState)&&G.body?t(I):G.addEventListener("DOMContentLoaded",function(){t(I)},!1),this},get:function(t){return null==t?this.toArray():0>t?this[this.length+t]:this[t]},toArray:function(){return q.call(this)},size:function(){return this.length},remove:function(){return this.each(function(){null!=this.parentNode&&this.parentNode.removeChild(this)})},each:function(t){return X.every.call(this,function(e,n){return t.call(e,n,e)!==!1}),this},filter:function(t){return e(t)?this.not(this.not(t)):I(V.call(this,function(e){return J.Matches(e,t)}))},add:function(t,e){return I(B(this.concat(I(t,e))))},is:function(t){return this.length>0&&J.Matches(this[0],t)},not:function(t){var n=[];if(e(t)&&t.call!==H)this.each(function(e){t.call(this,e)||n.push(this)});else{var r=p(t)?this.filter(t):l(t)&&e(t.item)?q.call(t):I(t);this.forEach(function(t){r.indexOf(t)<0&&n.push(t)})}return I(n)},has:function(t){return this.filter(function(){return o(t)?C(this,t):I(this).find(t).size()})},eq:function(t){return-1===t?this.slice(t):this.slice(t,+t+1)},first:function(){var t=this[0];return t&&!o(t)?t:I(t)},last:function(){var t=this[this.length-1];return t&&!o(t)?t:I(t)},find:function(t){var e,n=this;return e="object"==typeof t?I(t).filter(function(){var t=this;return X.some.call(n,function(e){return C(e,t)})}):1==this.length?I(J.QSA(this[0],t)):this.map(function(){return J.QSA(this,t)})},closest:function(t,e){var n=this[0],i=!1;for("object"==typeof t&&(i=I(t));n&&!(i?i.indexOf(n)>=0:J.Matches(n,t));)n=n!==e&&!r(n)&&n.parentNode;return I(n)},parents:function(t){for(var e=[],n=this;n.length>0;)n=I.map(n,function(t){return(t=t.parentNode)&&!r(t)&&e.indexOf(t)<0?(e.push(t),t):void 0});return T(e,t)},parent:function(t){return T(B(this.pluck("parentNode")),t)},children:function(t){return T(this.map(function(){return w(this)}),t)},contents:function(){return this.map(function(){return q.call(this.childNodes)})},siblings:function(t){return T(this.map(function(t,e){return V.call(w(e.parentNode),function(t){return t!==e})}),t)},empty:function(){return this.each(function(){this.innerHTML=""})},pluck:function(t){return I.map(this,function(e){return e[t]})},show:function(){return this.each(function(){"none"==this.style.display&&(this.style.display=""),"none"==D(this).getPropertyValue("display")&&(this.style.display=b(this.nodeName))})},replaceWith:function(t){return this.before(t).remove()},wrap:function(t){var n=e(t);if(this[0]&&!n)var r=I(t).get(0),i=r.parentNode||this.length>1;return this.each(function(e){I(this).wrapAll(n?t.call(this,e):i?r.cloneNode(!0):r)})},wrapAll:function(t){if(this[0]){I(this[0]).before(t=I(t));for(var e;(e=t.children()).length;)t=e.first();I(t).append(this)}return this},wrapInner:function(t){var n=e(t);return this.each(function(e){var r=I(this),i=r.contents(),o=n?t.call(this,e):t;i.length?i.wrapAll(o):r.append(o)})},unwrap:function(){return this.parent().each(function(){I(this).replaceWith(I(this).children())}),this},clone:function(){return this.map(function(){return this.cloneNode(!0)})},hide:function(){return this.css("display","none")},toggle:function(t){return this.each(function(){var e=I(this);(t===H?"none"==e.css("display"):t)?e.show():e.hide()})},prev:function(t){return I(this.pluck("previousElementSibling")).filter(t||"*")},next:function(t){return I(this.pluck("nextElementSibling")).filter(t||"*")},html:function(t){return 0===arguments.length?this.length>0?this[0].innerHTML:null:this.each(function(e){var n=this.innerHTML;I(this).empty().append(N(this,t,e,n))})},title:function(t){return 0===arguments.length?this.length>0?this[0].title:null:this.each(function(e){var n=this.title;I(this).empty().append(N(this,t,e,n))})},text:function(t){return 0===arguments.length?this.length>0?this[0].textContent:null:this.each(function(){this.textContent=t===H?"":""+t})},attr:function(t,e){var n;return p(t)&&e===H?0==this.length||1!==this[0].nodeType?H:"value"==t&&"INPUT"==this[0].nodeName?this.val():!(n=this[0].getAttribute(t))&&t in this[0]?this[0][t]:n:this.each(function(n){if(1===this.nodeType)if(o(t))for(W in t)j(this,W,t[W]);else j(this,t,N(this,e,n,this.getAttribute(t)))})},removeAttr:function(t){return this.each(function(){1===this.nodeType&&j(this,t)})},prop:function(t,e){return t=Ee[t]||t,e===H?this[0]&&this[0][t]:this.each(function(n){this[t]=N(this,e,n,this[t])})},data:function(t,e){var n=this.attr("data-"+y(t),e);return null!==n?_(n):H},val:function(t){return 0===arguments.length?this[0]&&(this[0].multiple?I(this[0]).find("option").filter(function(){return this.selected}).pluck("value"):this[0].value):this.each(function(e){this.value=N(this,t,e,this.value)})},offset:function(t){if(t)return this.each(function(e){var n=I(this),r=N(this,t,e,n.offset()),i=n.offsetParent().offset(),o={top:r.top-i.top,left:r.left-i.left};"static"==n.css("position")&&(o.position="relative"),n.css(o)});if(0==this.length)return null;var e=this[0].getBoundingClientRect();return{left:e.left+window.pageXOffset,top:e.top+window.pageYOffset,width:Math.round(e.width),height:Math.round(e.height)}},css:function(e,n){if(arguments.length<2){var r=this[0],i=D(r);if(!r)return;if("string"==typeof e)return r.style[U(e)]||i.getPropertyValue(e);if(c(e)){var o={};return I.each(c(e)?e:[e],function(t,e){o[e]=r.style[U(e)]||i.getPropertyValue(e)}),o}}return"string"==t(e)&&(n||0===n||this.each(function(){this.style.removeProperty(y(e))})),I.access(this,function(t,e,n){var r,i,o={},a=0;if(c(e)){for(r=D(t),i=e.length;i>a;a++)o[e[a]]=I.css(t,e[a],!1,r);return o}return n!==H?I.style(t,e,n):I.css(t,e)},e,n,arguments.length>1)},index:function(t){return t?this.indexOf(I(t)[0]):this.parent().children().indexOf(this[0])},hasClass:function(t){return t?X.some.call(this,function(t){return this.test(P(t))},x(t)):!1},addClass:function(t){return t?this.each(function(e){z=[];var n=P(this),r=N(this,t,e,n);r.split(/\s+/g).forEach(function(t){I(this).hasClass(t)||z.push(t)},this),z.length&&P(this,n+(n?" ":"")+z.join(" "))}):this},removeClass:function(t){return this.each(function(e){return t===H?P(this,""):(z=P(this),N(this,t,e,z).split(/\s+/g).forEach(function(t){z=z.replace(x(t)," ")}),P(this,z.trim()),void 0)})},toggleClass:function(t,e){return t?this.each(function(n){var r=I(this),i=N(this,t,n,P(this));i.split(/\s+/g).forEach(function(t){(e===H?!r.hasClass(t):e)?r.addClass(t):r.removeClass(t)})}):this},scrollTop:function(t){if(this.length){var e="scrollTop"in this[0];return t===H?e?this[0].scrollTop:this[0].pageYOffset:this.each(e?function(){this.scrollTop=t}:function(){this.scrollTo(this.scrollX,t)})}},scrollLeft:function(t){if(this.length){var e="scrollLeft"in this[0];return t===H?e?this[0].scrollLeft:this[0].pageXOffset:this.each(e?function(){this.scrollLeft=t}:function(){this.scrollTo(t,this.scrollY)})}},position:function(){if(this.length){var t=this[0],e=this.offsetParent(),n=this.offset(),r=oe.test(e[0].nodeName)?{top:0,left:0}:e.offset();return n.top-=parseFloat(I(t).css("margin-top"))||0,n.left-=parseFloat(I(t).css("margin-left"))||0,r.top+=parseFloat(I(e[0]).css("border-top-width"))||0,r.left+=parseFloat(I(e[0]).css("border-left-width"))||0,{top:n.top-r.top,left:n.left-r.left}}},offsetParent:function(){return this.map(function(){for(var t=this.offsetParent||Q;t&&!I.nodeName(t,"html")&&"static"===I.css(t,"position");)t=t.offsetParent;return t||Q})},detach:function(t){return this.remove(t,!0)},splice:[].splice},J.init.prototype=I.fn,I.fn.extend=I.Extend,I.fn.offset=function(t){if(arguments.length)return t===H?this:this.each(function(e){I.offset.setOffset(this,t,e)});if(0==this.length)return null;var e,n,r=this[0],i={top:0,left:0},o=r&&r.ownerDocument;if(o)return e=o.documentElement,C(e,r)?(typeof r.getBoundingClientRect!==we&&(i=r.getBoundingClientRect()),n=$(o),{top:i.top+n.pageYOffset-e.clientTop,left:i.left+n.pageXOffset-e.clientLeft}):i},I.offset={setOffset:function(t,n,r){var i,o,a,s,u,c,l,f=I.css(t,"position"),h=I(t),p={};"static"===f&&(t.style.position="relative"),u=h.offset(),a=I.css(t,"top"),c=I.css(t,"left"),l=("absolute"===f||"fixed"===f)&&(a+c).indexOf("auto")>-1,l?(i=h.position(),s=i.top,o=i.left):(s=parseFloat(a)||0,o=parseFloat(c)||0),e(n)&&(n=n.call(t,r,u)),null!=n.top&&(p.top=n.top-u.top+s),null!=n.left&&(p.left=n.left-u.left+o),"using"in n?n.using.call(t,p):h.css(p)}},I.Extend({parseHTML:function(t,e,n){if(!t||"string"!=typeof t)return null;"boolean"==typeof e&&(n=e,e=!1),e=e||G;var r=Te.exec(t),i=!n&&[];return r?[e.createElement(r[1])]:(r=I.buildFragment([t],e,i),i&&I(i).remove(),I.merge([],r.childNodes))},parseJSON:JSON.parse,parseXML:function(t){var e,n;if(!t||"string"!=typeof t)return null;try{n=new DOMParser,e=n.parseFromString(t,"text/xml")}catch(r){e=H}return(!e||e.getElementsByTagName("parsererror").length)&&I.Error("Invalid XML: "+t),e},noop:function(){},globalEval:function(t){var e,n=eval;t=I.trim(t),t&&(1===t.indexOf("use strict")?(e=G.createElement("script"),e.text=t,G.head.appendChild(e).parentNode.removeChild(e)):n(t))}}),I.Extend({Expando:"Yaex"+(pe+de+A(2,3)).replace(/\D/g,""),access:function(e,n,r,i,o,a,s){var u=0,c=e.length,l=null===r;if("object"===t(r)){o=!0;for(u in r)I.access(e,n,u,r[u],!0,a,s)}else if(i!==H&&(o=!0,I.isFunction(i)||(s=!0),l&&(s?(n.call(e,i),n=null):(l=n,n=function(t,e,n){return l.call(I(t),n)})),n))for(;c>u;u++)n(e[u],r,s?i:i.call(e[u],u,n(e[u],r)));return o?e:l?n.call(e):c?n(e[0],r):a},swap:function(t,e,n,r){var i,o,a={};for(o in e)a[o]=t.style[o],t.style[o]=e[o];i=n.apply(t,r||[]);for(o in e)t.style[o]=a[o];return i},pushStack:function(t){var e=I.merge(this.constructor(),t);return e.prevObject=this,e.context=this.context,e},nodeName:function(t,e){return t.nodeName&&t.nodeName.toLowerCase()===e.toLowerCase()}}),["width","height"].forEach(function(t){var e=t.replace(/./,function(t){return t[0].toUpperCase()});I.fn[t]=function(n){var r,i=this[0];return n===H?I.isWindow(i)?i["inner"+e]:I.isDocument(i)?i.documentElement["scroll"+e]:(r=this.offset())&&r[t]:this.each(function(e){i=I(this),i.css(t,N(this,n,e,i[t]()))})}}),I.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,e){var n="pageYOffset"===e;I.fn[t]=function(r){return I.access(this,function(t,r,i){var o=$(t);return i===H?o?o[e]:t[r]:(o?o.scrollTo(n?window.pageXOffset:i,n?i:window.pageYOffset):t[r]=i,void 0)},t,r,arguments.length,null)}});var Ne,je=/^(none|table(?!-c[ea]).+)/,Pe=/^margin/,_e=new RegExp("^("+be+")(.*)$","i"),Ye=new RegExp("^("+be+")(?!px)[a-z%]+$","i"),Ae=new RegExp("^([+-])=("+be+")","i"),ke={position:"absolute",visibility:"hidden",display:"block"},De={letterSpacing:0,fontWeight:400},Fe=["Top","Right","Bottom","Left"],Re=["Webkit","O","Moz","ms"];return I.cssExpand=Fe,I.Extend({CSS_Hooks:{opacity:{get:function(t,e){if(e){var n=Ne(t,"opacity");return""===n?"1":n}}}},CSS_Number:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},CSS_Properities:{"float":"cssFloat"},style:function(t,e,n,r){if(t&&3!==t.nodeType&&8!==t.nodeType&&t.style){var i,o,a,s,u=I.camelCase(e),c=t.style;return e=I.CSS_Properities[u]||(I.CSS_Properities[u]=k(c,u)),a=I.CSS_Hooks[e]||I.CSS_Hooks[u],s=n,n===H?a&&"get"in a&&(i=a.get(t,!1,r))!==H?i:c[e]:(o=typeof n,"string"===o&&(i=Ae.exec(n))&&(n=(i[1]+1)*i[2]+parseFloat(I.css(t,e)),o="number"),null==n||"number"===o&&isNaN(n)||("number"!==o||I.CSS_Number[u]||(n+="px"),I.Support.clearCloneStyle||""!==n||0!==e.indexOf("background")||(c[e]="inherit"),a&&"set"in a&&(n=a.set(t,n,r))===H||(c[e]=n,s||0===s||(c.setProperty(e,""),c.removeProperty(e)))),void 0)}},css:function(t,e,n,r){var i,o,a,s=I.camelCase(e);return e=I.CSS_Properities[s]||(I.CSS_Properities[s]=k(t.style,s)),a=I.CSS_Hooks[e]||I.CSS_Hooks[s],a&&"get"in a&&(i=a.get(t,!0,n)),i===H&&(i=Ne(t,e,r)),"normal"===i&&e in De&&(i=De[e]),""===n||n?(o=parseFloat(i),n===!0||I.isNumeric(o)?o||0:i):i}}),Ne=function(t,e,n){var r,i,o,a=n||D(t),s=a?a.getPropertyValue(e)||a[e]:H,u=t.style;return a&&(""!==s||C(t.ownerDocument,t)||(s=I.style(t,e)),Ye.test(s)&&Pe.test(e)&&(r=u.width,i=u.minWidth,o=u.maxWidth,u.minWidth=u.maxWidth=u.width=s,s=a.width,u.width=r,u.minWidth=i,u.maxWidth=o)),s},I.each(["height","width"],function(t,e){I.CSS_Hooks[e]={get:function(t,n,r){return n?0===t.offsetWidth&&je.test(I.css(t,"display"))?I.swap(t,ke,function(){return L(t,e,r)}):L(t,e,r):void 0},set:function(t,n,r){var i=r&&D(t);return F(t,n,r?R(t,e,r,I.Support.boxSizing&&"border-box"===I.css(t,"boxSizing",!1,i),i):0)}}}),I.each({Height:"height",Width:"width"},function(t,e){I.each({padding:"inner"+t,content:e,"":"outer"+t},function(n,r){I.fn[r]=function(r,i){var o=arguments.length&&(n||"boolean"!=typeof r),a=n||(r===!0||i===!0?"margin":"border");return I.access(this,function(e,n,r){var i;return I.isWindow(e)?e.document.documentElement["client"+t]:9===e.nodeType?(i=e.documentElement,Math.max(e.body["scroll"+t],i["scroll"+t],e.body["offset"+t],i["offset"+t],i["client"+t])):r===H?I.css(e,n,a):I.style(e,n,r,a)},e,o?r:H,o,null)}})}),se.forEach(function(e,n){var r=n%2;I.fn[e]=function(){var e,i,o=I.map(arguments,function(n){return e=t(n),"object"===e||"array"===e||null===n?n:J.Fragment(n)}),a=this.length>1;return o.length<1?this:this.each(function(t,e){i=r?e:e.parentNode,e=0===n?e.nextSibling:1===n?e.firstChild:2===n?e:null,o.forEach(function(t){if(a)t=t.cloneNode(!0);else if(!i)return I(t).remove();M(i.insertBefore(t,e),function(t){null==t.nodeName||"SCRIPT"!==t.nodeName.toUpperCase()||t.type&&"text/javascript"!==t.type||t.src||window.eval.call(window,t.innerHTML)})})})},I.fn[r?e+"To":"insert"+(n?"Before":"After")]=function(t){return I(t)[e](this),this}}),J.Y.prototype=I.fn,I.Unique=B,I.DeserializeValue=_,I.Yaex=J,o(window)&&o(window.document)&&(window.Yaex=window.$=I),I})()+function(t){"use strict";function e(t){return t.YID||(t.YID=l++)}function n(t,n,o,a){if(n=r(n),n.ns)var s=i(n.ns);return(c[e(t)]||[]).filter(function(t){return!(!t||n.e&&t.e!=n.e||n.ns&&!s.test(t.ns)||o&&e(t.fn)!==e(o)||a&&t.sel!=a)})}function r(t){var e=(""+t).split(".");return{e:e[0],ns:e.slice(1).sort().join(" ")}}function i(t){return new RegExp("(?:^| )"+t.replace(" "," .* ?")+"(?: |$)")}function o(e,n,r){t.isString(e)?e.split(/\s/).forEach(function(t){r(t,n)}):t.each(e,r)}function a(t,e){return t.del&&("focus"==t.e||"blur"==t.e)||!!e}function s(t){return f[t]||t}function u(e){t.Yaex.Event.fix(e);var n,r={originalEvent:e};for(n in e)h.test(n)||void 0===e[n]||(r[n]=e[n]);return t.each(p,function(t,n){r[t]=function(){return this[n]=d,e[t].apply(e,arguments)},r[n]=g}),r}var c={},l=1,f={mouseenter:"mouseover",mouseleave:"mouseout"},h=/^([A-Z]|layer[XY]$)/,p={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};t.Yaex.Event={add:function(n,i,u,l,h,p){var d=e(n),g=c[d]||(c[d]=[]);o(i,u,function(e,i){var o=r(e);o.fn=i,o.sel=l,o.e in f&&(i=function(e){var n=e.relatedTarget;return!n||n!==this&&!t.contains(this,n)?o.fn.apply(this,arguments):void 0}),o.del=h&&h(i,e);var u=o.del||i;o.proxy=function(t){var e=u.apply(n,[t].concat(t.data));return e===!1&&(t.preventDefault(),t.stopPropagation()),e},o.i=g.length,g.push(o),"addEventListener"in n&&n.addEventListener(s(o.e),o.proxy,a(o,p))})},remove:function(t,r,i,u,l){var f=e(t);o(r||"",i,function(e,r){n(t,e,r,u).forEach(function(e){delete c[f][e.i],"removeEventListener"in t&&t.removeEventListener(s(e.e),e.proxy,a(e,l))})})},special:{},fix:function(t){if(!("defaultPrevented"in t)){t.defaultPrevented=!1;var e=t.preventDefault;t.preventDefault=function(){t.defaultPrevented=!0,e.call(t)}}}},t.Yaex.Event.special.click=t.Yaex.Event.special.mousedown=t.Yaex.Event.special.mouseup=t.Yaex.Event.special.mousemove="MouseEvents",t.proxy=function(n,r){if(t.isFunction(n)){var i=function(){return n.apply(r,arguments)};return i.YID=e(n),i}if("string"==typeof r)return t.proxy(n[r],n);throw new TypeError("expected function")},t.fn.bind=function(e,n){return this.each(function(){t.Yaex.Event.add(this,e,n)})},t.fn.unbind=function(e,n){return this.each(function(){t.Yaex.Event.remove(this,e,n)})},t.fn.one=function(e,n){return this.each(function(r,i){t.Yaex.Event.add(this,e,n,null,function(e,n){return function(){var r=e.apply(i,arguments);return t.Yaex.Event.remove(i,n,e),r}})})};var d=function(){return!0},g=function(){return!1};t.fn.delegate=function(e,n,r){return this.each(function(i,o){t.Yaex.Event.add(o,n,r,e,function(n){return function(r){var i,a=t(r.target).closest(e,o).get(0);return a?(i=t.Extend(u(r),{currentTarget:a,liveFired:o}),n.apply(a,[i].concat([].slice.call(arguments,1)))):void 0}})})},t.fn.undelegate=function(e,n,r){return this.each(function(){t.Yaex.Event.remove(this,n,r,e)})},t.fn.live=function(e,n){return t(document.body).delegate(this.selector,e,n),this},t.fn.die=function(e,n){return t(document.body).undelegate(this.selector,e,n),this},t.fn.on=function(e,n,r){return!n||t.isFunction(n)?this.bind(e,n||r):this.delegate(n,e,r)},t.fn.off=function(e,n,r){return!n||t.isFunction(n)?this.unbind(e,n||r):this.undelegate(n,e,r)},t.fn.trigger=function(e,n){return(t.isString(e)||t.isPlainObject(e))&&(e=t.Event(e)),t.Yaex.Event.fix(e),e.data=n,this.each(function(){"dispatchEvent"in this?this.dispatchEvent(e):t(this).triggerHandler(e,n)})},t.fn.triggerHandler=function(e,r){var i,o;return this.each(function(a,s){i=u(t.isString(e)?t.Event(e):e),i.data=r,i.target=s,t.each(n(s,e.type||e),function(t,e){return o=e.proxy(i),i.isImmediatePropagationStopped()?!1:void 0})}),o},"focusin focusout load resize scroll unload click dblclick wheel mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(e){t.fn[e]=function(t){return t?this.bind(e,t):this.trigger(e)}}),["focus","blur"].forEach(function(e){t.fn[e]=function(t){return t?this.bind(e,t):this.each(function(){try{this[e]()}catch(t){}}),this}}),t.Event=function(e,n){t.isString(e)&&(n=e,e=n.type);var r=document.createEvent(t.Yaex.Event.special[e]||"Events"),i=!0;if(n)for(var o in n)"bubbles"==o?i=!!n[o]:r[o]=n[o];return r.initEvent(e,i,!0),r.isDefaultPrevented=function(){return r.defaultPrevented},r}}(Yaex)+function(t){"use strict";function e(e,n,r){var i=t.Event(n);return t(e).trigger(i,r),!i.defaultPrevented}function n(t,n,r,i){return t.global?e(n||b,r,i):void 0}function r(e){e.global&&0===t.active++&&n(e,null,"ajaxStart")}function i(e){e.global&&!--t.active&&n(e,null,"ajaxStop")}function o(t,e){var r=e.context;return e.beforeSend.call(r,t,e)===!1||n(e,r,"ajaxBeforeSend",[t,e])===!1?!1:(n(e,r,"ajaxSend",[t,e]),void 0)}function a(t,e,r,i){var o=r.context,a="success";r.success.call(o,t,a,e),i&&i.resolveWith(o,[t,a,e]),n(r,o,"ajaxSuccess",[e,r,t]),u(a,e,r)}function s(t,e,r,i,o){var a=i.context;i.error.call(a,r,e,t),o&&o.rejectWith(a,[r,e,t]),n(i,a,"ajaxError",[r,i,t]),u(e,r,i)}function u(t,e,r){var o=r.context;r.complete.call(o,e,t),n(r,o,"ajaxComplete",[e,r]),i(r)}function c(){}function l(t){var e=new RegExp("(?:^|; )"+encodeURIComponent(t)+"=([^;]*)").exec(b.cookie);return e?e[1]:null}function f(t){var e="//"+b.location.host,n=b.location.protocol+e;return t==n||t.slice(0,n.length+1)==n+"/"||t==e||t.slice(0,e.length+1)==e+"/"||!/^(\/\/|http:|https:).*/.test(t)}function h(t){return t&&(t=t.split(";",2)[0]),t&&(t===T?"html":t===O?"json":S.test(t)?"script":E.test(t)&&"xml")||"text"}function p(t,e){return(t+"&"+e).replace(/[&?]{1,2}/,"?")}function d(e){e.processData&&e.data&&"string"!==t.type(e.data)&&(e.data=t.param(e.data,e.traditional)),!e.data||e.type&&"GET"!==e.type.toUpperCase()||(e.url=p(e.url,e.data),e.data=void 0)}function g(e,n,r,i){var o=!t.isFunction(n);return{url:e,data:o?n:void 0,success:o?t.isFunction(r)?r:void 0:n,dataType:o?i||r:r}}function m(e,n,r,i){var o,a=t.isArray(n);t.each(n,function(n,s){o=t.type(s),i&&(n=r?i:i+"["+(a?"":n)+"]"),!i&&a?e.add(s.name,s.value):"array"===o||!r&&"object"===o?m(e,s,r,n):e.add(n,s)})}var v,y,x=0,b=window.document,w=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,S=/^(?:text|application)\/javascript/i,E=/^(?:text|application)\/xml/i,O="application/json",T="text/html",C=/^\s*$/,N=t.fn.load;t.active=0,t.ajaxJSONP=function(e,n){if(!("type"in e))return t.ajax(e);var r,i,u=e.jsonpCallback,c=(t.isFunction(u)?u():u)||"jsonp"+ ++x,l=b.createElement("script"),f=window[c],h=function(e){t(l).triggerHandler("error",e||"abort")},p={abort:h};return n&&n.promise(p),t(l).on("load error",function(o,u){clearTimeout(i),t(l).off("load error"),t(l).remove(),"error"!=o.type&&r?a(r[0],p,e,n):s(null,u||"error",p,e,n),window[c]=function(t){a(t,p,e)},f=r=void 0}),o(p,e)===!1?(h("abort"),p):(window[c]=function(){r=arguments},l.onerror=function(){h("error")},l.src=e.url.replace(/=\?/,"="+c),b.head.appendChild(l),e.timeout>0&&(i=setTimeout(function(){h("timeout")},e.timeout)),p)},t.ajaxSettings={type:"GET",beforeSend:c,success:c,error:c,complete:c,context:null,global:!0,xhr:function(){return new window.XMLHttpRequest},accepts:{script:"text/javascript, application/javascript, application/x-javascript",json:O,xml:"application/xml, text/xml",html:T,text:"text/plain"},crossDomain:!1,timeout:0,processData:!0,cache:!0},t.ajax=function(e){var n=t.Extend({},e||{}),i=t.Deferred&&t.Deferred();for(v in t.ajaxSettings)void 0===n[v]&&(n[v]=t.ajaxSettings[v]);r(n),n.crossDomain||(n.crossDomain=/^([\w-]+:)?\/\/([^\/]+)/.test(n.url)&&RegExp.$2!==window.location.host),n.url||(n.url=window.location.toString()),d(n),n.cache===!1&&(n.url=p(n.url,"_="+Date.now()));var u=n.dataType,l=/=\?/.test(n.url);if("jsonp"==u||l)return l||(n.url=p(n.url,n.jsonp?n.jsonp+"=?":n.jsonp===!1?"":"callback=?")),t.ajaxJSONP(n,i);var f,g=n.accepts[u],m={},x=function(t,e){m[t.toLowerCase()]=[t,e]},b=/^([\w-]+:)\/\//.test(n.url)?RegExp.$1:window.location.protocol,w=n.xhr(),S=w.setRequestHeader;if(i&&i.promise(w),n.crossDomain||x("X-Requested-With","XMLHttpRequest"),x("Accept",g||"*/*"),(g=n.mimeType||g)&&(g.indexOf(",")>-1&&(g=g.split(",",2)[0]),w.overrideMimeType&&w.overrideMimeType(g)),(n.contentType||n.contentType!==!1&&n.data&&"GET"!==n.type.toUpperCase())&&x("Content-Type",n.contentType||"application/x-www-form-urlencoded"),n.headers)for(y in n.headers)x(y,n.headers[y]);if(w.setRequestHeader=x,w.onreadystatechange=function(){if(4==w.readyState){w.onreadystatechange=c,clearTimeout(f);var e,r=!1;if(w.status>=200&&w.status<300||304==w.status||0==w.status&&"file:"==b){u=u||h(w.getResponseHeader("content-type")),e=w.responseText;try{"script"==u?(1,eval)(e):"xml"==u?e=w.responseXML:"json"==u&&(e=C.test(e)?null:t.parseJSON(e))}catch(o){r=o}r?s(r,"parsererror",w,n,i):a(e,w,n,i)}else s(w.statusText||null,w.status?"error":"abort",w,n,i)}},o(w,n)===!1)return w.abort(),s(null,"abort",w,n,i),w;if(n.xhrFields)for(y in n.xhrFields)w[y]=n.xhrFields[y];var E="async"in n?n.async:!0;w.open(n.type,n.url,E,n.username,n.password);for(y in m)S.apply(w,m[y]);return n.timeout>0&&(f=setTimeout(function(){w.onreadystatechange=c,w.abort(),s(null,"timeout",w,n,i)
},n.timeout)),w.send(n.data?n.data:null),w},t.get=function(){return t.ajax(g.apply(null,arguments))},t.post=function(){var e=g.apply(null,arguments);return e.type="POST",t.ajax(e)},t.getJSON=function(){var e=g.apply(null,arguments);return e.dataType="json",t.ajax(e)},t.fn.load=function(e,n,r){if(!this.length)return this;var i,o=this,a=e.split(/\s/),s=g(e,n,r),u=s.success;return a.length>1&&(s.url=a[0],i=a[1]),s.success=function(e){o.html(i?t("<div>").html(e.replace(w,"")).find(i):e),u&&u.apply(o,arguments)},t.ajax(s),this},t.fn.load=function(e,n,r){if("string"!=typeof e&&N)return N.apply(this,arguments);var i,o,a,s=this,u=e.indexOf(" ");return u>=0&&(i=e.slice(u),e=e.slice(0,u)),t.isFunction(n)?(r=n,n=void 0):n&&t.isObject(n)&&(o="POST"),s.length>0&&t.ajax({url:e,type:o,dataType:T,data:n}).success(function(e){a=arguments,s.html(i?t("<div>").append(t.Yaex.ParseHTML(e)).find(i):e)}).complete(r&&function(t,e){s.each(r,a||[t.responseText,e,t])}),this},t.JSON_Stringify=function(e,n){var r,i="";n=void 0===n?1:n;var o=typeof e;switch(o){case"function":i+=e;break;case"boolean":i+=e?"true":"false";break;case"object":if(null===e)i+="null";else if(e instanceof Array){i+="[";var a=e.length;for(r=0;a-1>r;++r)i+=t.JSON_Stringify(e[r],n+1);i+=t.JSON_Stringify(e[a-1],n+1)+"]"}else{i+="{";for(var s in e)e.hasOwnProperty(s)&&(i+='"'+s+'":'+t.JSON_Stringify(e[s],n+1));i+="}"}break;case"string":var u=e,c={"\\\\":"\\\\",'"':'\\"',"/":"\\/","\\n":"\\n","\\r":"\\r","\\t":"\\t"};for(r in c)c.hasOwnProperty(r)&&(u=u.replace(new RegExp(r,"g"),c[r]));i+='"'+u+'"';break;case"number":i+=String(e)}return i+=n>1?",":"",1===n&&(i=i.replace(/,([\]}])/g,"$1")),i.replace(/([\[{]),/g,"$1")};var j=encodeURIComponent;t.param=function(t,e){var n=[];return n.add=function(t,e){this.push(j(t)+"="+j(e))},m(n,t,e),n.join("&").replace(/%20/g,"+")},t.Extend(t.ajaxSettings,{beforeSend:function(t,e){!/^(GET|HEAD|OPTIONS|TRACE)$/.test(e.type)&&f(e.url)&&t.setRequestHeader("X-CSRFToken",l("csrftoken"))}})}(Yaex)+function(t){"use strict";t.fn.serializeArray=function(){var e,n=[];return t([].slice.call(this.get(0).elements)).each(function(){e=t(this);var r=e.attr("type");"fieldset"!=this.nodeName.toLowerCase()&&!this.disabled&&"submit"!=r&&"reset"!=r&&"button"!=r&&("radio"!=r&&"checkbox"!=r||this.checked)&&n.push({name:e.attr("name"),value:e.val()})}),n},t.fn.serialize=function(){var t=[];return this.serializeArray().forEach(function(e){t.push(encodeURIComponent(e.name)+"="+encodeURIComponent(e.value))}),t.join("&")},t.fn.submit=function(e){if(e)this.bind("submit",e);else if(this.length){var n=t.Event("submit");this.eq(0).trigger(n),n.defaultPrevented||this.get(0).submit()}return this}}(Yaex)+function(t,e){"__proto__"in{}||$.Extend({Y:function(t,e){return t=t||[],$.Extend(t,$.fn),t.selector=e||"",t.__Y=!0,t},isYaex:function(t){return"array"===$.type(t)&&"__Y"in t}});try{getComputedStyle(e)}catch(n){var r=getComputedStyle;t.getComputedStyle=function(t){try{return r(t)}catch(e){return null}}}}(this);