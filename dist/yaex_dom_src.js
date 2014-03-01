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

 /**
 * DOM - Cross browser DOM utilities using Yaex's API
 *
 *
 * @depends: Yaex.js | Core
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function (window, document, undefined) {

	'use strict';

	var YaexDOM = new Object;

	var ClassList;

	var IDsList;

	var EmptyArray = new Array;

	var Slice = EmptyArray.slice;

	var Filter = EmptyArray.filter;

	var document = window.document;

	var DocumentElement = document.documentElement;

	var ElementDisplay = new Object;

	var ClassCache = new Object;

	var IDsCache = new Object;

	var FragmentReplacement = /^\s*<(\w+|!)[^>]*>/;

	var SingleTagReplacement = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;

	var TagExpanderReplacement = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig;

	var ReadyReplacement = /complete|loaded|interactive/;

	var SimpleSelectorReplacement = /^[\w-]*$/;

	var RootNodeReplacement = /^(?:body|html)$/i;

	// Special attributes that should be get/set via method calls
	var MethodAttributes = [
		'title',
		'value',
		'val',
		'css',
		'html',
		'text',
		'data',
		'width',
		'height',
		'offset'
	];

	var adjacencyOperators = [
		'after',
		'prepend',
		'before',
		'append'
	];

	var Table = document.createElement('table');

	var TableRow = document.createElement('tr');

	var Containers = {
		'tr': document.createElement('tbody'),
		'tbody': Table,
		'thead': Table,
		'tfoot': Table,
		'td': TableRow,
		'th': TableRow,
		'*': document.createElement('div')
	};

	var TemporaryParent = document.createElement('div');

	var ProperitiesMap = {
		'tabindex': 'tabIndex',
		'readonly': 'readOnly',
		'for': 'htmlFor',
		'class': 'className',
		'maxlength': 'maxLength',
		'cellspacing': 'cellSpacing',
		'cellpadding': 'cellPadding',
		'rowspan': 'rowSpan',
		'colspan': 'colSpan',
		'usemap': 'useMap',
		'frameborder': 'frameBorder',
		'contenteditable': 'contentEditable',
		'scrollw': 'scrollWidth',
		'scrollh': 'scrollHeight',
		'tagname': 'tagName'
	};

	var CCSS;

	// Swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	var rdisplayswap = /^(none|table(?!-c[ea]).+)/;

	var rmargin = /^margin/;

	var rnumsplit = new RegExp('^(' + (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source) + ')(.*)$', 'i');

	var rnumnonpx = new RegExp('^(' + (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source) + ')(?!px)[a-z%]+$', 'i');

	var rrelNum = new RegExp('^([+-])=(' + (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source) + ')', 'i');

	var cssShow = {
		position: 'absolute',
		visibility: 'hidden',
		display: 'block'
	};

	var cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	};

	var cssExpand = [
		'Top', 
		'Right', 
		'Bottom', 
		'Left'
	];

	var cssPrefixes = [
		'Webkit', 
		'O', 
		'Moz', 
		'ms'
	];

	// BEGIN OF [Private Functions]

	/**
	 * functionArgument
	 *
	 * ...
	 *
	 * @param    string context Variable to get type
	 * @param    string argument Variable to get type
	 * @param    int index Variable to get type
	 * @param    object payload Variable to get type
	 * @return   boolean
	 */
	function functionArgument(context, argument, index, payload) {
		return Yaex.Global.isFunction(argument) ? argument.call(context, index, payload) : argument;
	}

	function classReplacement(name) {
		return name in ClassCache ?
			ClassCache[name] : (ClassCache[name] = new RegExp('(^|\\s)' + name + '(\\s|)'));
	}

	function idReplacement(name) {
		return name in IDsCache ?
			IDsCache[name] : (IDsCache[name] = new RegExp('(^|\\s)' + name + '(\\s|)'));
	}

	function traverseNode(node, func) {
		func(node);

		for (var key in node.childNodes) {
			traverseNode(node.childNodes[key], func);
		}
	}

	// Return a CSS property mapped to a potentially vendor prefixed property
	function vendorPropName(style, name) {
		// shortcut for names that are not vendor prefixed
		if (name in style) {
			return name;
		}

		// check for vendor prefixed names
		var capName = name.charAt(0).toUpperCase() + name.slice(1),
			origName = name,
			i = cssPrefixes.length;

		while (i--) {
			name = cssPrefixes[i] + capName;
			if (name in style) {
				return name;
			}
		}

		return origName;
	}

	// NOTE: We've included the "window" in window.getComputedStyle
	// because jsdom on node.js will break without it.
	function getStyles(elem) {
		return window.getComputedStyle(elem, null);
	}

	function getWindow(elem) {
		return Yaex.Global.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
	}

	function defaultDisplay(nodeName) {
		var element;
		var display;

		if (!ElementDisplay[nodeName]) {
			element = document.createElement(nodeName);
			document.body.appendChild(element);
			//display = getComputedStyle(element, '').getPropertyValue("display");
			display = getStyles(element).getPropertyValue('display');
			element.parentNode.removeChild(element);
			display == "none" && (display = "block");
			ElementDisplay[nodeName] = display;
		}

		return ElementDisplay[nodeName];
	}

	function Filtered(nodes, selector) {
		return selector === null ? (nodes) : (nodes).filter(selector);
	}

	function Contains(parent, node) {
		return parent !== node && parent.contains(node);
	}

	function setAttribute(node, name, value) {
		if (value === null) {
			node.removeAttribute(name);
		} else {
			node.setAttribute(name, value);
		}
	}

	// Access className property while respecting SVGAnimatedString
	function className(node, value) {
		var Class = node.className;

		var svg = Class && Class.baseVal !== undefined;

		if (value === undefined) {
			return svg ? Class.baseVal : Class;
		}

		svg = svg ? (Class.baseVal = value) : (node.className = value);
	}

	function idName(node, value) {
		var ID = node.id;

		if (value === undefined) {
			return ID;
		}

		ID = ID ? (ID = value) : (node.id = value);
	}

	function Children(element) {
		return 'children' in element ?
			Slice.call(element.children) :
			Map(element.childNodes, function (node) {
				if (node.nodeType == 1) {
					return node;
				}
			});
	}

	CCSS = function (elem, name, _computed) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles(elem),
			// Support: IE9
			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined,
			style = elem.style;

		if (computed) {

			if (ret === "" && !Contains(elem.ownerDocument, elem)) {
				ret = Yaex.DOM.Style(elem, name);
			}

			// Support: Safari 5.1
			// A tribute to the "awesome hack by Dean Edwards"
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if (rnumnonpx.test(ret) && rmargin.test(name)) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};

	function Flatten(array) {
		return array.length > 0 ? Yaex.DOM.Function.concat.apply([], array) : array;
	}

	function setPositiveNumber(elem, value, subtract) {
		var matches = rnumsplit.exec(value);
		return matches ?
		// Guard against undefined "subtract", e.g., when used as in CSS_Hooks
		Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") :
			value;
	}

	function argumentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
		var i = extra === (isBorderBox ? "border" : "content") ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialise for horizontal or vertical properties
		name === "width" ? 1 : 0,
			val = 0;

		for (; i < 4; i += 2) {
			// both box models exclude margin, so add it if we want it
			if (extra === "margin") {
				val += Yaex.DOM.CSS(elem, extra + cssExpand[i], true, styles);
			}

			if (isBorderBox) {
				// border-box includes padding, so remove it if we want content
				if (extra === "content") {
					val -= Yaex.DOM.CSS(elem, "padding" + cssExpand[i], true, styles);
				}

				// at this point, extra isn't border nor margin, so remove border
				if (extra !== "margin") {
					val -= Yaex.DOM.CSS(elem, "border" + cssExpand[i] + "Width", true, styles);
				}
			} else {
				// at this point, extra isn't content, so add padding
				val += Yaex.DOM.CSS(elem, "padding" + cssExpand[i], true, styles);

				// at this point, extra isn't content nor padding, so add border
				if (extra !== "padding") {
					val += Yaex.DOM.CSS(elem, "border" + cssExpand[i] + "Width", true, styles);
				}
			}
		}

		return val;
	}

	function getWidthOrHeight(elem, name, extra) {
		// Start with offset property, which is equivalent to the border-box value
		var valueIsBorderBox = true,
			val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
			styles = getStyles(elem),
			isBorderBox = Yaex.DOM.Support.boxSizing && Yaex.DOM.CSS(elem, "boxSizing", false, styles) === "border-box";

		// some non-html elements return undefined for offsetWidth, so check for null/undefined
		// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
		// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
		if (val <= 0 || val === null) {
			// Fall back to computed then uncomputed css if necessary
			val = CCSS(elem, name, styles);

			if (val < 0 || val === null) {
				val = elem.style[name];
			}

			// Computed unit is not pixels. Stop here and return.
			if (rnumnonpx.test(val)) {
				return val;
			}

			// we need the check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable elem.style
			valueIsBorderBox = isBorderBox && (Yaex.DOM.Support.boxSizingReliable || val === elem.style[name]);

			// Normalize "", auto, and prepare for extra
			val = parseFloat(val) || 0;
		}

		// use the active box-sizing model to add/subtract irrelevant styles
		return (val +
			argumentWidthOrHeight(
				elem,
				name,
				extra || (isBorderBox ? "border" : "content"),
				valueIsBorderBox,
				styles
			)
		) + "px";
	}

	function Map(elements, callback) {
		var value;
		var values = [];
		var x;
		var key;

		if (Yaex.Global.likeArray(elements)) {
			for (x = 0; x < elements.length; x++) {
				value = callback(elements[x], x);

				if (value !== null) {
					values.push(value);
				}
			}
		} else {
			for (key in elements) {
				value = callback(elements[key], key);

				if (value !== null) {
					values.push(value);
				}
			}
		}

		return Flatten(values);
	}

	// END OF [Private Functions]

	//---

	YaexDOM = {
		Matches: function (element, selector) {
			if (!element || element.nodeType !== 1) {
				return false;
			}

			var matchesSelector = element.webkitMatchesSelector ||
				element.mozMatchesSelector ||
				element.oMatchesSelector ||
				element.matchesSelector;

			if (matchesSelector) {
				return matchesSelector.call(element, selector);
			}

			// Fall back to performing a selector:
			var match;
			var parent = element.parentNode;
			var temp = !parent;

			if (temp) {
				(parent = TemporaryParent).appendChild(element);
			}

			match = ~YaexDOM.QSA(parent, selector).indexOf(element);

			temp && TemporaryParent.removeChild(element);

			return match;
		},

		// `YaexDOM.Fragment` takes a html string and an optional tag name
		// to generate DOM nodes nodes from the given html string.
		// The generated DOM nodes are returned as an array.
		// This function can be overriden in plugins for example to make
		// it compatible with browsers that don't support the DOM fully.
		Fragment: function (html, name, properties) {
			var dom;
			var nodes;
			var container;

			// A special case optimization for a single tag
			if (SingleTagReplacement.test(html)) {
				dom = Yaex.DOM(document.createElement(RegExp.$1));
			}

			if (!dom) {
				if (html.replace) {
					html = html.replace(TagExpanderReplacement, "<$1></$2>");
				}

				if (name === undefined) {
					name = FragmentReplacement.test(html) && RegExp.$1;
				}

				if (!(name in Containers)) {
					name = '*';
				}

				container = Containers[name];

				container.innerHTML = '' + html;

				dom = Yaex.Each(Slice.call(container.childNodes), function () {
					container.removeChild(this);
				});
			}

			if (Yaex.Global.isPlainObject(properties)) {
				nodes = Yaex.DOM(dom);

				Yaex.Each(properties, function (key, value) {
					if (MethodAttributes.indexOf(key) > -1) {
						nodes[key](value);
					} else {
						nodes.attr(key, value);
					}
				});
			}

			return dom;
		},

		// `YaexDOM.init` is Yaex.DOM's counterpart to jQuery's `Yaex.DOM.Function.init` and
		// takes a CSS selector and an optional context (and handles various
		// special cases).
		// This method can be overriden in plugins.
		init: function (selector, context) {
			var dom;

			// If nothing given, return an empty Yaex collection
			if (!selector) {
				return YaexDOM.Y();
			}

			if (Yaex.Global.isString(selector)) {
				// Optimize for string selectors
				selector = selector.trim();

				// If it's a html Fragment, create nodes from it
				// Note: In both Chrome 21 and Firefox 15, DOM error 12
				// is thrown if the Fragment doesn't begin with <
				// if (selector[0] === '<' && FragmentReplacement.test(selector)) {
				if (selector[0] === '<' && selector[selector.length - 1] === '>' && FragmentReplacement.test(selector) && selector.length >= 3) {
					dom = YaexDOM.Fragment(selector, RegExp.$1, context);
					selector = null;
				} else if (context !== undefined) {
					// If there's a context, create a collection on that context first, and select
					// nodes from there
					// return Yaex.DOM(context).find(selector);
					return Yaex.DOM(context).find(selector);
				} else {
					// If it's a CSS selector, use it to select nodes.
					dom = YaexDOM.QSA(document, selector);
				}
				// If a function is given, call it when the DOM is ready
			} else if (Yaex.Global.isFunction(selector)) {
				// return Yaex.DOM(document).ready(selector);
				return Yaex.DOM(document).ready(selector);
				// If a Yaex collection is given, just return it
			} else if (YaexDOM.isY(selector)) {
				return selector;
			} else {
				// normalize array if an array of nodes is given
				if (Yaex.Global.isArray(selector)) {
					dom = Yaex.Global.Compact(selector);
					// Wrap DOM nodes.
				} else if (Yaex.Global.isObject(selector)) {
					dom = [selector];
					selector = null;
					// If it's a html Fragment, create nodes from it
				} else if (FragmentReplacement.test(selector)) {
					dom = YaexDOM.Fragment(selector.trim(), RegExp.$1, context);
					selector = null;
					// If there's a context, create a collection on that context first, and select
					// nodes from there
				} else if (context !== undefined) {
					// return Yaex.DOM(context).find(selector);
					return Yaex.DOM(context).find(selector);
					// And last but no least, if it's a CSS selector, use it to select nodes.
				} else {
					dom = YaexDOM.QSA(document, selector);
				}
			}

			// Create a new YaexDOM collection from the nodes found
			return YaexDOM.Y(dom, selector);
		},

		// `YaexDOM.QSA` is Yaex's CSS selector implementation which
		// uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
		// This method can be overriden in plugins.
		QSA: function (element, selector) {
			var found;
			var maybeID;
			var maybeClass;
			var nameOnly;

			if (selector[0] === '#') {
				maybeID = '#';
			}

			if (!maybeID && selector[0] === '.') {
				maybeClass = '.';
			}

			// Ensure that a 1 char tag name still gets checked
			if (maybeID || maybeClass) {
				nameOnly = selector.slice(1);
			} else {
				nameOnly = selector;
			}

			var isSimple = SimpleSelectorReplacement.test(nameOnly);

			return (Yaex.Global.isDocument(element) && isSimple && maybeID) ?
				((found = element.getElementById(nameOnly)) ? [found] : []) :
				(element.nodeType !== 1 && element.nodeType !== 9) ? [] :
				Slice.call(
					isSimple && !maybeID ?
					maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
					element.getElementsByTagName(selector) : // Or a tag
					element.querySelectorAll(selector) // Or it's not simple, and we need to query all
			);
		},

		// `Yaex.DOM.Y` swaps out the prototype of the given `DOM` array
		// of nodes with `Yaex.DOM.Function` and thus supplying all the Yaex.DOM functions
		// to the array. Note that `__proto__` is not supported on Internet
		// Explorer. This method can be overriden in Plugins.
		Y: function (dom, selector) {
			dom = dom || [];

			dom.__proto__ = Yaex.DOM.Function;
			dom.selector = selector || '';
			// dom.result = (dom.length == 1) ? dom[0] : dom;
			// dom.uid = 'YAEX' + Yaex.Now;

			return dom;
		},

		// `Yaex.DOM.isY` should return `true` if the given object is a Yaex
		// collection. This method can be overriden in plugins.
		isY: function (object) {
			return object instanceof YaexDOM.Y;
		},
	};

	//---

	/**
	 * Yaex.DomUtil is a DOM class that Yaex.DomUtil classes inherit from.
	 */
	Yaex.DomUtil = Yaex.Class.Extend({
		initialise: function (selector, context) {
			return YaexDOM.init(selector, context);
		},

		getStyle: function (el, style) {
			var value = el.style[style] || (el.currentStyle && el.currentStyle[style]);

			if ((!value || value === 'auto') && document.defaultView) {
				var css = document.defaultView.getComputedStyle(el, null);
				value = css ? css[style] : null;
			}

			return value === 'auto' ? null : value;
		},

		documentIsLtr: function () {
			Yaex.DOM._docIsLtr = Yaex.DOM._docIsLtr || this.getStyle(document.body, 'direction') === 'ltr';
			return Yaex.DOM._docIsLtr;
		},

		Function: {
			// Because a collection acts like an array
			// copy over these useful array functions.
			forEach: EmptyArray.forEach,
			reduce: EmptyArray.reduce,
			push: EmptyArray.push,
			sort: EmptyArray.sort,
			indexOf: EmptyArray.indexOf,
			concat: EmptyArray.concat,
			extend: Yaex.Utility.Extend,
			// `map` and `slice` in the jQuery API work differently
			// from their array counterparts
			map: function (callback) {
				return Yaex.DOM(Map(this, function (el, i) {
					return callback.call(el, i, el);
				}));
			},
			slice: function () {
				return Yaex.DOM(Slice.apply(this, arguments));
				// return Yaex.DOM.pushStack(Slice.apply(this, arguments));
			},
			ready: function (callback) {
				// need to check if document.body exists for IE as that browser reports
				// document ready when it hasn't yet created the body element
				if (ReadyReplacement.test(document.readyState) && document.body) {
					callback(Yaex.DOM);
				} else {
					Yaex.DOM.Event.on(document, 'DOMContentLoaded', function () {
						callback(Yaex.DOM);
					}, false);

					// document.addEventListener('DOMContentLoaded', function () {
					// 	callback($);
					// }, false);
				}

				return this;
			},
			get: function (num) {
				// return num === undefined ? Slice.call(this) : this[num >= 0 ? num : num + this.length];

				return num === null ?
				// Return a 'Clean' array
				this.toArray() :
				// Return just the object
				(num < 0 ? this[this.length + num] : this[num]);
			},
			toArray: function () {
				// return this.get();
				return Slice.call(this);
			},
			size: function () {
				return this.length;
			},
			remove: function () {
				return this.each(function () {
					if (this.parentNode !== null) {
						this.parentNode.removeChild(this);
					}
				});
			},
			error: Yaex.Error,
			each: function (callback) {
				EmptyArray.every.call(this, function (el, index) {
					return callback.call(el, index, el) !== false;
				});

				return this;
			},
			filter: function (selector) {
				if (Yaex.Global.isFunction(selector)) {
					return this.not(this.not(selector));
				}

				return Yaex.DOM(Filter.call(this, function (element) {
					return Yaex.DOM.Matches(element, selector);
				}));
			},
			add: function (selector, context) {
				return Yaex.DOM(Yaex.Global.Unique(this.concat(Yaex.DOM(selector, context))));
			},
			is: function (selector) {
				return this.length > 0 && YaexDOM.Matches(this[0], selector);
			},
			not: function (selector) {
				var nodes = [];

				if (Yaex.Global.isFunction(selector) && selector.call !== undefined) {
					this.each(function (index) {
						if (!selector.call(this, index)) {
							nodes.push(this);
						}
					});
				} else {
					var excludes = Yaex.Global.isString(selector) ? this.filter(selector) :
						(Yaex.Global.likeArray(selector) && Yaex.Global.isFunction(selector.item)) ? Slice.call(selector) : Yaex.DOM(selector);

					this.forEach(function (el) {
						if (excludes.indexOf(el) < 0) {
							nodes.push(el);
						}
					});
				}

				return Yaex.DOM(nodes);
			},
			has: function (selector) {
				return this.filter(function () {
					return Yaex.Global.isObject(selector) ?
						Contains(this, selector) :
						Yaex.DOM(this).find(selector).size();
				});
			},
			eq: function (index) {
				return index === -1 ? this.slice(index) : this.slice(index, +index + 1);
			},
			first: function () {
				var el = this[0];
				return el && !Yaex.Global.isObject(el) ? el : Yaex.DOM(el);
			},
			last: function () {
				var el = this[this.length - 1];
				return el && !Yaex.Global.isObject(el) ? el : Yaex.DOM(el);
			},
			find: function (selector) {
				var result, $this = this;
				if (typeof (selector) === 'object')
					result = Yaex.DOM(selector).filter(function () {
						var node = this;
						return EmptyArray.some.call($this, function (parent) {
							return Contains(parent, node);
						});
					});
				else if (this.length === 1)
					result = Yaex.DOM(YaexDOM.QSA(this[0], selector));
				else
					result = this.map(function () {
						return YaexDOM.QSA(this, selector);
					});
				return result;
			},
			closest: function (selector, context) {
				var node = this[0],
					collection = false;
				if (typeof (selector) === 'object')
					collection = Yaex.DOM(selector);
				while (node && !(collection ? collection.indexOf(node) >= 0 : YaexDOM.Matches(node, selector)))
					node = node !== context && !Yaex.Global.isDocument(node) && node.parentNode;
				return Yaex.DOM(node);
			},
			parentsUntil: function (selector, context) {
				var nodes = this;
				var collection = false;
				var parents = [];

				if (Yaex.Global.isObject(selector)) {
					collection = Yaex.DOM(selector);
				}

				while (nodes.length > 0) {
					nodes = Map(nodes, function (node) {
						while (node && !(collection ? collection.indexOf(node) >= 0 : YaexDOM.Matches(node, selector))) {
							node = node !== context && !Yaex.Global.isDocument(node) && node.parentNode;
							parents.push(node);
						}
					});
				}

				return Yaex.DOM(parents);
			},
			parents: function (selector) {
				var ancestors = [];
				var nodes = this;

				while (nodes.length > 0) {
					nodes = Map(nodes, function (node) {
						if ((node = node.parentNode) && !Yaex.Global.isDocument(node) && ancestors.indexOf(node) < 0) {
							ancestors.push(node);
							return node;
						}
					});
				}

				return Filtered(ancestors, selector);
			},
			parent: function (selector) {
				return Filtered(Yaex.Global.Unique(this.pluck('parentNode')), selector);
			},
			children: function (selector) {
				return Filtered(this.map(function () {
					return Children(this);
				}), selector);
			},
			contents: function () {
				return this.map(function () {
					return Slice.call(this.childNodes);
				});
			},
			siblings: function (selector) {
				return Filtered(this.map(function (i, el) {
					return Filter.call(Children(el.parentNode), function (child) {
						return child !== el;
					});
				}), selector);
			},
			empty: function () {
				return this.each(function () {
					this.innerHTML = '';
				});
			},
			// `pluck` is borrowed from Prototype.js
			pluck: function (property) {
				return Map(this, function (el) {
					return el[property];
				});
			},
			show: function () {
				return this.each(function () {
					this.style.display === 'none' && (this.style.display = '');

					if (getStyles(this).getPropertyValue('display') === 'none') {
						this.style.display = defaultDisplay(this.nodeName);
					}
				});
			},
			replaceWith: function (newContent) {
				return this.before(newContent).remove();
			},
			wrap: function (structure) {
				var func = Yaex.Global.isFunction(structure);
				if (this[0] && !func)
					var dom = Yaex.DOM(structure).get(0),
				clone = dom.parentNode || this.length > 1;

				return this.each(function (index) {
					Yaex.DOM(this).wrapAll(
						func ? structure.call(this, index) :
						clone ? dom.cloneNode(true) : dom
					);
				});
			},
			wrapAll: function (structure) {
				if (this[0]) {
					Yaex.DOM(this[0]).before(structure = Yaex.DOM(structure));

					var children;

					// Drill down to the inmost element
					while ((children = structure.children()).length) {
						structure = children.first();
					}

					Yaex.DOM(structure).append(this);
				}

				return this;
			},
			wrapInner: function (structure) {
				var func = Yaex.Global.isFunction(structure);
				return this.each(function (index) {
					var self = Yaex.DOM(this),
						contents = self.contents(),
						dom = func ? structure.call(this, index) : structure;
					contents.length ? contents.wrapAll(dom) : self.append(dom);
				});
			},
			unwrap: function () {
				this.parent().each(function () {
					Yaex.DOM(this).replaceWith(Yaex.DOM(this).children());
				});

				return this;
			},
			clone: function () {
				return this.map(function () {
					return this.cloneNode(true);
				});
			},
			hide: function () {
				return this.css('display', 'none');
			},
			toggle: function (setting) {
				return this.each(function () {
					var el = Yaex.DOM(this);
					(setting === undefined ? el.css('display') === 'none' : setting) ? el.show() : el.hide();
				});
			},
			prev: function (selector) {
				return Yaex.DOM(this.pluck('previousElementSibling')).filter(selector || '*');
			},
			next: function (selector) {
				return Yaex.DOM(this.pluck('nextElementSibling')).filter(selector || '*');
			},
			html: function (html) {
				return arguments.length === 0 ?
					(this.length > 0 ? this[0].innerHTML : null) :
					this.each(function (index) {
						var originHtml = this.innerHTML;
						Yaex.DOM(this).empty().append(functionArgument(this, html, index, originHtml));
					});
			},
			text: function (text) {
				return arguments.length === 0 ?
					(this.length > 0 ? this[0].textContent : null) :
					this.each(function () {
						this.textContent = (text === undefined) ? '' : '' + text;
					});
			},
			title: function (title) {
				return arguments.length === 0 ?
					(this.length > 0 ? this[0].title : null) :
					this.each(function () {
						this.title = (title === undefined) ? '' : '' + title;
					});
			},
			attr: function (name, value) {
				var result;
				return (Yaex.Global.isString(name) && value === undefined) ?
					(this.length === 0 || this[0].nodeType !== 1 ? undefined :
					(name === 'value' && this[0].nodeName === 'INPUT') ? this.val() :
					(!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
				) :
					this.each(function (index) {
						if (this.nodeType !== 1)
							return;
						if (Yaex.Global.isObject(name)) {
							for (var key in name) {
								setAttribute(this, key, name[key]);
							}
						} else {
							setAttribute(this, name, functionArgument(this, value, index, this.getAttribute(name)));
						}
					});
			},
			removeAttr: function (name) {
				return this.each(function () {
					this.nodeType === 1 && setAttribute(this, name);
				});
			},
			prop: function (name, value) {
				name = ProperitiesMap[name] || name;
				return (value === undefined) ?
					(this[0] && this[0][name]) :
					this.each(function (index) {
						this[name] = functionArgument(this, value, index, this[name]);
					});
			},
			data: function (name, value) {
				var data = this.attr('data-' + Yaex.Global.Dasherise(name), value);
				return data !== null ? Yaex.Global.deserialiseValue(data) : undefined;
			},
			val: function (value) {
				return arguments.length === 0 ?
					(this[0] && (this[0].multiple ?
					Yaex.DOM(this[0]).find('option').filter(function () {
						return this.selected;
					}).pluck('value') :
					this[0].value)) :
					this.each(function (index) {
						this.value = functionArgument(this, value, index, this.value);
					});
			},
			value: function (value) {
				return arguments.length === 0 ?
					(this[0] && (this[0].multiple ?
					Yaex.DOM(this[0]).find('option').filter(function () {
						return this.selected;
					}).pluck('value') :
					this[0].value)) :
					this.each(function (index) {
						this.value = functionArgument(this, value, index, this.value);
					});
			},
			offset: function (coordinates) {
				if (coordinates)
					return this.each(function (index) {
						var $this = Yaex.DOM(this),
							coords = functionArgument(this, coordinates, index, $this.offset()),
							parentOffset = $this.offsetParent().offset(),
							props = {
								top: coords.top - parentOffset.top,
								left: coords.left - parentOffset.left
							};

						if ($this.css('position') === 'static')
							props['position'] = 'relative';
						$this.css(props);
					});

				if (this.length === 0) {
					return null;
				}

				var obj = this[0].getBoundingClientRect();

				return {
					left: obj.left + window.pageXOffset,
					top: obj.top + window.pageYOffset,
					width: Math.round(obj.width),
					height: Math.round(obj.height)
				};
			},
			css: function (name, value) {
				if (arguments.length < 2) {
					var element = this[0];
					var computedStyle = getStyles(element);

					if (!element) {
						return;
					}

					if (typeof (name) === 'string') {
						return element.style[Yaex.Global.Camelise(name)] || computedStyle.getPropertyValue(name);
					} else if (Yaex.Global.isArray(name)) {
						var props = {};

						Yaex.Each(Yaex.Global.isArray(name) ? name : [name], function (_, prop) {
							props[prop] = (element.style[Yaex.Global.Camelise(prop)] || computedStyle.getPropertyValue(prop));
						});

						return props;
					}
				}

				if (Yaex.Global.Type(name) === 'string') {
					if (!value && value !== 0) {
						this.each(function () {
							this.style.removeProperty(Yaex.Global.Dasherise(name));
						});
					}
				}

				return Yaex.DOM.Access(this, function (elem, name, value) {
					var styles;
					var len;
					var map = {};
					var i = 0;

					if (Yaex.Global.isArray(name)) {
						styles = getStyles(elem);
						len = name.length;

						for (; i < len; i++) {
							map[name[i]] = Yaex.DOM.CSS(elem, name[i], false, styles);
						}

						return map;
					}

					return value !== undefined ?
						Yaex.DOM.Style(elem, name, value) :
						Yaex.DOM.CSS(elem, name);
				}, name, value, arguments.length > 1);
			},
			index: function (element) {
				return element ? this.indexOf(Yaex.DOM(element)[0]) : this.parent().children().indexOf(this[0]);
			},
			hasClass: function (name) {
				if (!name) {
					return false;
				}

				return EmptyArray.some.call(this, function (el) {
					return this.test(className(el));
				}, classReplacement(name));
			},
			hasID: function (name) {
				if (!name) {
					return false;
				}

				return EmptyArray.some.call(this, function (el) {
					return this.test(idName(el));
				}, idReplacement(name));
			},
			addID: function (name) {
				if (!name) {
					return this;
				}

				return this.each(function (index) {
					IDsList = [];

					var id = idName(this);
					var newName = functionArgument(this, name, index, id);

					newName.split(/\s+/g).forEach(function (ID) {
						if (!Yaex.DOM(this).hasID(ID))
							IDsList.push(ID);
					}, this);

					IDsList.length && idName(this, id + (id ? ' ' : '') + IDsList.join(' '));
				});
			},
			addClass: function (name) {
				if (!name) {
					return this;
				}

				return this.each(function (index) {
					ClassList = [];

					var cls = className(this);
					var newName = functionArgument(this, name, index, cls);

					newName.split(/\s+/g).forEach(function (Class) {
						if (!Yaex.DOM(this).hasClass(Class))
							ClassList.push(Class);
					}, this);

					ClassList.length && className(this, cls + (cls ? ' ' : '') + ClassList.join(' '));
				});
			},
			removeID: function (name) {
				return this.each(function (index) {
					if (name === undefined) {
						return idName(this, '');
					}

					IDsList = idName(this);

					functionArgument(this, name, index, IDsList).split(/\s+/g).forEach(function (ID) {
						IDsList = IDsList.replace(idReplacement(ID), ' ');
					});

					idName(this, IDsList.trim());
				});
			},
			removeClass: function (name) {
				return this.each(function (index) {
					if (name === undefined) {
						return className(this, '');
					}

					ClassList = className(this);

					functionArgument(this, name, index, ClassList).split(/\s+/g).forEach(function (Class) {
						ClassList = ClassList.replace(classReplacement(Class), ' ');
					});

					className(this, ClassList.trim());
				});
			},
			toggleClass: function (name, when) {
				if (!name) {
					return this;
				}

				return this.each(function (index) {
					var $this = Yaex.DOM(this);
					var names = functionArgument(this, name, index, className(this));

					names.split(/\s+/g).forEach(function (Class) {
						(when === undefined ? !$this.hasClass(Class) : when) ?
							$this.addClass(Class) : $this.removeClass(Class);
					});
				});
			},
			scrollTop: function (value) {
				if (!this.length) {
					return;
				}

				var hasScrollTop = 'scrollTop' in this[0];

				if (value === undefined) {
					return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset;
				}

				return this.each(hasScrollTop ?
					function () {
						this.scrollTop = value;
					} :
					function () {
						this.scrollTo(this.scrollX, value);
					});
			},
			scrollLeft: function (value) {
				if (!this.length) {
					return;
				}

				var hasScrollLeft = 'scrollLeft' in this[0];

				if (value === undefined) {
					return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset;
				}

				return this.each(hasScrollLeft ?
					function () {
						this.scrollLeft = value;
					} :
					function () {
						this.scrollTo(value, this.scrollY);
					});
			},
			position: function () {
				if (!this.length) {
					return;
				}

				var elem = this[0],
					// Get *real* offsetParent
					offsetParent = this.offsetParent(),
					// Get correct offsets
					offset = this.offset(),
					parentOffset = RootNodeReplacement.test(offsetParent[0].nodeName) ? {
						top: 0,
						left: 0
					} : offsetParent.offset();

				// Subtract element margins
				// note: when an element has margin: auto the offsetLeft and marginLeft
				// are the same in Safari causing offset.left to incorrectly be 0
				offset.top -= parseFloat(Yaex.DOM(elem).css('margin-top')) || 0;
				offset.left -= parseFloat(Yaex.DOM(elem).css('margin-left')) || 0;

				// Add offsetParent borders
				parentOffset.top += parseFloat(Yaex.DOM(offsetParent[0]).css('border-top-width')) || 0;
				parentOffset.left += parseFloat(Yaex.DOM(offsetParent[0]).css('border-left-width')) || 0;

				// Subtract the two offsets
				return {
					top: offset.top - parentOffset.top,
					left: offset.left - parentOffset.left
				};
			},
			offsetParent: function () {
				return this.map(function () {
					var offsetParent = this.offsetParent || DocumentElement;

					while (offsetParent && (!Yaex.DOM.nodeName(offsetParent, 'html') && Yaex.DOM.CSS(offsetParent, 'position') === 'static')) {
						offsetParent = offsetParent.offsetParent;
					}

					return offsetParent || DocumentElement;
				});
			},
			detach: function (selector) {
				return this.remove(selector, true);
				// return this.remove(selector);
			},
			splice: [].splice
		},

		// Yaex.Global.Unique for each copy of Yaex on the page
		Expando: 'YAEX' + (Yaex.Version + Yaex.BuildNumber + Yaex.Global.randomNumber(10000, 70000)).replace(/\D/g, ''),

		// Multifunctional method to get and set values of a collection
		// The value/s can optionally be executed if it's a function
		Access: function (elems, callback, key, value, chainable, emptyGet, raw) {
			var i = 0;
			var length = elems.length;
			var bulk = key === null;

			// Sets many values
			if (Yaex.Global.Type(key) === 'object') {
				chainable = true;
				for (i in key) {
					this.Access(elems, callback, i, key[i], true, emptyGet, raw);
				}
				// Sets one value
			} else if (value !== undefined) {
				chainable = true;

				if (!Yaex.Global.isFunction(value)) {
					raw = true;
				}

				if (bulk) {
					// Bulk operations run against the entire set
					if (raw) {
						callback.call(elems, value);
						callback = null;

						// ...except when executing function values
					} else {
						bulk = callback;
						callback = function (elem, key, value) {
							return bulk.call(Yaex.DOM(elem), value);
						};
					}
				}

				if (callback) {
					for (; i < length; i++) {
						callback(elems[i], key, raw ? value : value.call(elems[i], i, callback(elems[i], key)));
					}
				}
			}

			return chainable ? elems :
			// Gets
			bulk ? callback.call(elems) : length ? callback(elems[0], key) : emptyGet;
		},

		// A method for quickly swapping in/out CSS properties to get correct calculations.
		// Note: this method belongs to the css module but it's needed here for the support module.
		// If support gets modularized, this method should be moved back to the css module.
		Swap: function (elem, options, callback, args) {
			var ret, name,
				old = {};

			// Remember the old values, and insert the new ones
			for (name in options) {
				old[name] = elem.style[name];
				elem.style[name] = options[name];
			}

			ret = callback.apply(elem, args || []);

			// Revert the old values
			for (name in options) {
				elem.style[name] = old[name];
			}

			return ret;
		},

		// Take an array of elements and push it onto the stack
		// (returning the new matched element set)
		pushStack: function (elems) {
			// Build a new Yaex matched element set
			var ret = Yaex.Merge(this.constructor(), elems);

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
			ret.context = this.context;

			// Return the newly-formed element set
			return ret;
		},

		nodeName: function (elem, name) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		},

		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		CSS_Hooks: {
			opacity: {
				get: function (elem, computed) {
					if (computed) {
						// We should always get a number back from opacity
						var ret = CCSS(elem, "opacity");
						return ret === "" ? "1" : ret;
					}
				}
			}
		},

		// Don't automatically add "px" to these possibly-unitless properties
		CSS_Number: {
			"columnCount": true,
			"fillOpacity": true,
			"fontWeight": true,
			"lineHeight": true,
			"opacity": true,
			"order": true,
			"orphans": true,
			"widows": true,
			"zIndex": true,
			"zoom": true
		},

		// Add in properties whose names you wish to fix before
		// setting or getting the value
		CSS_Properities: {
			// normalize float css property
			'float': 'cssFloat'
		},

		// Get and set the style property on a DOM Node
		Style: function (elem, name, value, extra) {
			// Don't set styles on text and comment nodes
			if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
				return;
			}

			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = Yaex.Global.Camelise(name),
				style = elem.style,
				newvalue;

			name = this.CSS_Properities[origName] || (this.CSS_Properities[origName] = vendorPropName(style, origName));

			// gets hook for the prefixed version
			// followed by the unprefixed version
			hooks = this.CSS_Hooks[name] || this.CSS_Hooks[origName];

			newvalue = value;

			// Check if we're setting a value
			if (value !== undefined) {
				type = typeof (value);

				// convert relative number strings (+= or -=) to relative numbers. #7345
				if (type === 'string' && (ret = rrelNum.exec(value))) {
					value = (ret[1] + 1) * ret[2] + parseFloat(this.CSS(elem, name));

					// Fixes bug #9237
					type = 'number';
				}

				// Make sure that NaN and null values aren't set. See: #7116
				if (value === null || type === 'number' && isNaN(value)) {
					return;
				}

				// If a number was passed in, add 'px' to the (except for certain CSS properties)
				if (type === "number" && !this.CSS_Number[origName]) {
					value += "px";
				}

				// Fixes #8908, it can be done more correctly by specifying setters in CSS_Hooks,
				// but it would mean to define eight (for every problematic property) identical functions
				if (!this.Support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
					style[name] = "inherit";
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
					style[name] = value;

					if (!newvalue && newvalue !== 0) {
						style.setProperty(name, '');
						style.removeProperty(name);
					}
				}
			} else {
				// If a hook was provided get the non-computed value from there
				if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
					return ret;
				}

				// Otherwise just get the value from the style object
				return style[name];
			}
		},

		CSS: function (elem, name, extra, styles) {
			var val, num, hooks,
				origName = Yaex.Global.Camelise(name);

			// Make sure that we're working with the right name
			name = this.CSS_Properities[origName] || (this.CSS_Properities[origName] = vendorPropName(elem.style, origName));

			// gets hook for the prefixed version
			// followed by the unprefixed version
			hooks = this.CSS_Hooks[name] || this.CSS_Hooks[origName];

			// If a hook was provided get the computed value from there
			if (hooks && "get" in hooks) {
				val = hooks.get(elem, true, extra);
			}

			// Otherwise, if a way to get the computed value exists, use that
			if (val === undefined) {
				val = CCSS(elem, name, styles);
			}

			//convert "normal" to computed value
			if (val === "normal" && name in cssNormalTransform) {
				val = cssNormalTransform[name];
			}

			// Return, converting to number if forced or a qualifier was provided and val looks numeric
			if (extra === "" || extra) {
				num = parseFloat(val);
				return extra === true || Yaex.Global.isNumber(num) ? num || 0 : val;
			}

			return val;
		},



		toString: function() {
			return '[Yaex DOM]';
		},

	}); // END OF Yaex.DOM CLASS

	//---

	// Aliases; we should ditch those eventually

	//---

	Yaex.DOM = function (selector, context) {
		return YaexDOM.init(selector, context);
	};

	// Yaex.DOM.toString = function() {
	// 	return '[Yaex DOM]';
	// };
	
	

	//---

	// `$` will be the base `Yaex.DOM` object. When calling this
	// function just call `$, which makes the implementation
	// details of selecting nodes and creating Yaex.DOM collections
	// patchable in Plugins.
	// $ = function (selector, context) {
	// 	return YaexDOM.init(selector, context);
	// };

	//---

	Yaex.Utility.Extend(Yaex.DOM, {

		MODINFO: {
			NAME: 'DOM',
			VERSION: '0.10',
			DEPS: 'Utility'
		},

		Contains: Contains,

		fn: Yaex.DomUtil.prototype.Function,

		pushStack: Yaex.DomUtil.prototype.pushStack,

		Access: Yaex.DomUtil.prototype.Access,

		Style: Yaex.DomUtil.prototype.Style,

		CSS_Number: Yaex.DomUtil.prototype.CSS_Number,

		nodeName: Yaex.DomUtil.prototype.nodeName,

		CSS_Properities: Yaex.DomUtil.prototype.CSS_Properities,

		CSS: Yaex.DomUtil.prototype.CSS,

		CSS_Hooks: Yaex.DomUtil.prototype.CSS_Hooks,

		Function: Yaex.DomUtil.prototype.Function,

		expr: new Object,

		Expr: new Object,

		Support: new Object,

		Map: Map,

		EmptyArray: EmptyArray,

		UUID: 0,

		Expando: Yaex.DomUtil.prototype.Expando,

		Timers: new Array,

		Location: window.location,

		// Results is for internal usage only
		makeArray: function(array, results) {
			var _return = results || [];

			if (!Yaex.Global.isNull(array)) {
				if (Yaex.Global.isArraylike(Object(array))) {
					Yaex.Merge(_return,
						Yaex.Global.isString(array) ?
						[array] : array
					);
				} else {
					EmptyArray.push.call(_return, array);
				}
			}

			return _return;
		},

		parseJSON: Yaex.parseJSON,

	});

	//---

	


	//---

	// Yaex.DOM.prototype = Yaex.DomUtil.prototype;

	//---

	// Generate the `width` and `height` functions
	['width', 'height'].forEach(function (dimension) {
		var dimensionProperty =
			dimension.replace(/./, function (m) {
				return m[0].toUpperCase();
			});

		Yaex.DOM.Function[dimension] = function (value) {
			var offset, el = this[0];
			if (value === undefined)
				return Yaex.Global.isWindow(el) ? el['inner' + dimensionProperty] :
					Yaex.Global.isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
					(offset = this.offset()) && offset[dimension];
			else
				return this.each(function (index) {
					el = Yaex.DOM(this);
					el.css(dimension, functionArgument(this, value, index, el[dimension]()));
				});
		};
	});

	//---

	// Create scrollLeft and scrollTop methods
	Yaex.Each({
		scrollLeft: 'pageXOffset',
		scrollTop: 'pageYOffset'
	}, function (method, prop) {
		var top = 'pageYOffset' === prop;

		Yaex.DOM.Function[method] = function (val) {
			return Yaex.DOM.Access(this, function (elem, method, val) {
				var win = getWindow(elem);

				if (val === undefined) {
					return win ? win[prop] : elem[method];
				}

				if (win) {
					win.scrollTo(!top ? val : window.pageXOffset, top ? val : window.pageYOffset);

				} else {
					elem[method] = val;
				}
			}, method, val, arguments.length, null);
		};
	});

	//---

	// Yaex.DOM.cssExpand = cssExpand;

	//---

	Yaex.Each(['height', 'width'], function (i, name) {
		Yaex.DOM.CSS_Hooks[name] = {
			get: function (elem, computed, extra) {
				if (computed) {
					// certain elements can have dimension info if we invisibly show them
					// however, it must have a current display style that would benefit from this
					return elem.offsetWidth === 0 && rdisplayswap.test(Yaex.DOM.CSS(elem, "display")) ?
						Yaex.DOM.Swap(elem, cssShow, function () {
							return getWidthOrHeight(elem, name, extra);
						}) :
						getWidthOrHeight(elem, name, extra);
				}
			},
			set: function (elem, value, extra) {
				var styles = extra && getStyles(elem);
				return setPositiveNumber(elem, value, extra ?
					argumentWidthOrHeight(
						elem,
						name,
						extra,
						Yaex.DOM.Support.boxSizing && Yaex.DOM.CSS(elem, "boxSizing", false, styles) === "border-box",
						styles
					) : 0
				);
			}
		};
	});

	//---

	Yaex.Each({
		Height: 'height',
		Width: 'width'
	}, function (name, type) {
		Yaex.Each({
			padding: 'inner' + name,
			content: type,
			'': 'outer' + name
		}, function (defaultExtra, funcName) {
			// margin is only for outerHeight, outerWidth
			Yaex.DOM.Function[funcName] = function (margin, value) {
				var chainable = arguments.length && (defaultExtra || typeof (margin) !== 'boolean');
				var extra = defaultExtra || (margin === true || value === true ? 'margin' : 'border');

				return Yaex.DOM.Access(this, function (elem, type, value) {
					var doc;

					if (Yaex.Global.isWindow(elem)) {
						// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
						// isn't a whole lot we can do. See pull request at this URL for discussion:
						// https://github.com/jquery/jquery/pull/764
						return elem.document.documentElement['client' + name];
					}

					// Get document width or height
					if (elem.nodeType === 9) {
						doc = elem.documentElement;

						// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
						// whichever is greatest
						return Math.max(
							elem.body['scroll' + name], doc['scroll' + name],
							elem.body['offset' + name], doc['offset' + name],
							doc['client' + name]
						);
					}

					return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					Yaex.DOM.CSS(elem, type, extra) :
					// Set width or height on the element
					Yaex.DOM.Style(elem, type, value, extra);
				}, type, chainable ? margin : undefined, chainable, null);
			};
		});
	});

	//---


	//---

	// Generate the `after`, `prepend`, `before`, `append`,
	// `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
	adjacencyOperators.forEach(function (operator, operatorIndex) {
		var inside = operatorIndex % 2; //=> prepend, append

		Yaex.DOM.Function[operator] = function () {
			// Arguments can be nodes, arrays of nodes, Yaex objects and HTML strings
			var argType;

			var nodes = Map(arguments, function (arg) {
				argType = Yaex.Global.Type(arg);

				return argType == 'object' || argType == 'array' || arg == null ?
					arg : YaexDOM.Fragment(arg);
			});

			var parent;

			var copyByClone = this.length > 1;

			if (nodes.length < 1) {
				return this;
			}

			return this.each(function (_, target) {
				parent = inside ? target : target.parentNode;

				// convert all methods to a "before" operation
				target = operatorIndex == 0 ? target.nextSibling :
					operatorIndex == 1 ? target.firstChild :
					operatorIndex == 2 ? target :
					null;

				nodes.forEach(function (node) {
					if (copyByClone) {
						node = node.cloneNode(true);
					} else if (!parent) {
						return Yaex.DOM(node).remove();
					}

					traverseNode(parent.insertBefore(node, target), function (el) {
						if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
							(!el.type || el.type === 'text/javascript') && !el.src) {
							window['eval'].call(window, el.innerHTML);
						}
					});
				});
			});
		};

		// after	=> insertAfter
		// prepend  => prependTo
		// before   => insertBefore
		// append   => appendTo
		Yaex.DOM.Function[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function (html) {
			Yaex.DOM(html)[operator](this);
			return this;
		};
	});

	//---

	YaexDOM.Y.prototype = Yaex.DOM.Function;

	Yaex.DOM.YaexDOM = YaexDOM;

	//---

	if (Yaex.Global.isObject(window) && Yaex.Global.isObject(window.document)) {
		'$' in window || (window.$ = Yaex.DOM)
	}
})(window);

//---


/**
 * DOM.Selector - Cross browser selector implementation using Yaex.DOM's API
 *
 *
 * @depends: Yaex.js | Core, DOM
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {
	
	'use strict';

	var YaexDOM = Yaex.DOM;
	var oldQSA = Yaex.DOM.YaexDOM.QSA;
	var oldMatches = Yaex.DOM.YaexDOM.Matches;

	var filterReplacement = new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*');
	var childReplacement = /^\s*>/;
	var classTag = 'YAEX' + Yaex.Now;

	//---

	function Visible(element) {
		elem = Yaex.DOM(element);
		return !!(element.width() || element.height()) && element.css('display') !== 'none';
	}

	// Complex selectors are not supported:
	//   li:has(label:contains("foo")) + li:has(label:contains("bar"))
	//   ul.inner:first > li
	var Filters = Yaex.DOM.Expr[':'] = {
		visible: function () {
			if (Visible(this)) {
				return this;
			}
		},
		hidden: function () {
			if (Visible(this)) {
				return this;
			}
		},
		selected: function () {
			if (Visible(this)) {
				return this;
			}
		},
		checked: function () {
			if (Visible(this)) {
				return this;
			}
		},
		parent: function () {
			return this.parentNode;
		},
		first: function (index) {
			if (index === 0) {
				return this;
			}
		},
		last: function (index, nodes) {
			if (index === nodes.length - 1) {
				return this;
			}
		},
		eq: function (index, _, value) {
			if (index === value) {
				return this;
			}
		},
		contains: function (index, _, text) {
			if (Yaex.DOM(this).text().indexOf(text) > -1) {
				return this;
			}
		},
		has: function (index, _, selector) {
			if (YaexDOM.YaexDOM.QSA(this, selector).length) {
				return this;
			}
		}
	};

	function Process(selector, callback) {
		// Quote the hash in `a[href^=#]` expression
		selector = selector.replace(/=#\]/g, '="#"]');

		var filter;
		var argument;
		var match = filterReplacement.exec(selector);

		if (match && match[2] in Filters) {
			filter = Filters[match[2]];
			argument = match[3];
			selector = match[1];

			if (argument) {
				var num = Number(argument);

				if (isNaN(num)) {
					argument = argument.replace(/^["']|["']$/g, '');
				} else {
					argument = num;
				}
			}
		}

		return callback(selector, filter, argument);
	}

	Yaex.DOM.YaexDOM.QSA = function (node, selector) {
		return Process(selector, function (_selector, filter, argument) {
			try {
				var taggedParent;

				if (!_selector && filter) {
					_selector = '*';
				} else if (childReplacement.test(_selector)) {
					// support "> *" child queries by tagging the parent node with a
					// unique class and prepending that classname onto the selector
					taggedParent = Yaex.DOM(node).addClass(classTag);
					_selector = '.' + classTag + ' ' + _selector;
				}

				var nodes = oldQSA(node, _selector);
			} catch (e) {
				// console.error('error performing selector: %o', selector);
				Yaex.Error('Error performing selector: ' + selector);
				throw e;
			} finally {
				if (taggedParent) {
					taggedParent.removeClass(classTag);
				}
			}
			return !filter ? nodes :
				Yaex.Global.Unique(Yaex.DOM.Map(nodes, function (n, i) {
					return filter.call(n, i, nodes, argument);
				}));
		});
	};

	Yaex.DOM.YaexDOM.Matches = function (node, selector) {
		return Process(selector, function (_selector, filter, argument) {
			return (!_selector || oldMatches(node, _selector)) && (!filter || filter.call(node, null, argument) === node);
		});
	};

	//---
	
})(Yaex.DOM);

//---



/**
 * DOM.Data - Cross browser data implementation using Yaex.DOM's API [DOM]
 *
 *
 * @depends: Yaex.js | Core, DOM, Selector
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function (window, document, undefined) {

	'use strict';

	var data = {};
	var dataAttr = Yaex.DOM.Function.data;
	var Camelise = Yaex.Global.Camelise;
	var exp = Yaex.DOM.Expando;

	/**
	 Implementation Summary

	 1. Enforce API surface and semantic compatibility with 1.9.x branch
	 2. Improve the module's maintainability by reducing the storage
	 paths to a single mechanism.
	 3. Use the same single mechanism to support "private" and "user" data.
	 4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	 5. Avoid exposing implementation details on user objects (eg. Expando properties)
	 6. Provide a clear path for implementation upgrade to WeakMap in 2014
	 */
	var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/;
	var rmultiDash = /([A-Z])/g;

	function Data() {
		// Support: Android < 4,
		// Old WebKit does not have Object.preventExtensions/freeze method,
		// return new empty object instead with no [[set]] accessor
		Object.defineProperty(this.cache = {}, 0, {
			get: function () {
				return {};
			}
		});

		this.Expando = Yaex.DOM.Expando;
	}

	Data.UID = 1;

	Data.accepts = function (owner) {
		// Accepts only:
		//  - Node
		//    - Node.ELEMENT_NODE
		//    - Node.DOCUMENT_NODE
		//  - Object
		//    - Any
		return owner.nodeType ?
			owner.nodeType === 1 || owner.nodeType === 9 : true;
	};

	Data.prototype = {
		key: function (owner) {
			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return the key for a frozen object.
			if (!Data.accepts(owner)) {
				return 0;
			}

			var descriptor = {},
				// Check if the owner object already has a cache key
				unlock = owner[this.Expando];

			// If not, create one
			if (!unlock) {
				unlock = Data.UID++;

				// Secure it in a non-enumerable, non-writable property
				try {
					descriptor[this.Expando] = {
						value: unlock
					};
					Object.defineProperties(owner, descriptor);

					// Support: Android < 4
					// Fallback to a less secure definition
				} catch (e) {
					descriptor[this.Expando] = unlock;
					Yaex.Extend(owner, descriptor);
				}
			}

			// Ensure the cache object
			if (!this.cache[unlock]) {
				this.cache[unlock] = {};
			}

			return unlock;
		},
		set: function (owner, data, value) {
			var prop,
				// There may be an unlock assigned to this node,
				// if there is no entry for this "owner", create one inline
				// and set the unlock as though an owner entry had always existed
				unlock = this.key(owner),
				cache = this.cache[unlock];

			// Handle: [ owner, key, value ] args
			if (typeof data === "string") {
				cache[data] = value;

				// Handle: [ owner, { properties } ] args
			} else {
				// Fresh assignments by object are shallow copied
				if (Yaex.Global.isEmptyObject(cache)) {
					Yaex.Extend(this.cache[unlock], data);
					// Otherwise, copy the properties one-by-one to the cache object
				} else {
					for (prop in data) {
						cache[prop] = data[prop];
					}
				}
			}
			return cache;
		},
		get: function (owner, key) {
			// Either a valid cache is found, or will be created.
			// New caches will be created and the unlock returned,
			// allowing direct access to the newly created
			// empty data object. A valid owner object must be provided.
			var cache = this.cache[this.key(owner)];

			return key === undefined ?
				cache : cache[key];
		},
		access: function (owner, key, value) {
			var stored;
			// In cases where either:
			//
			//   1. No key was specified
			//   2. A string key was specified, but no value provided
			//
			// Take the "read" path and allow the get method to determine
			// which value to return, respectively either:
			//
			//   1. The entire cache object
			//   2. The data stored at the key
			//
			if (key === undefined ||
				((key && typeof key === "string") && value === undefined)) {

				stored = this.get(owner, key);

				return stored !== undefined ?
					stored : this.get(owner, Camelise(key));
			}

			// [*]When the key is not a string, or both a key and value
			// are specified, set or extend (existing objects) with either:
			//
			//   1. An object of properties
			//   2. A key and value
			//
			this.set(owner, key, value);

			// Since the "set" path can have two possible entry points
			// return the expected data based on which path was taken[*]
			return value !== undefined ? value : key;
		},
		remove: function (owner, key) {
			var i, name, camel,
				unlock = this.key(owner),
				cache = this.cache[unlock];

			if (key === undefined) {
				this.cache[unlock] = {};

			} else {
				// Support array or space separated string of keys
				if (Yaex.Global.isArray(key)) {
					// If "name" is an array of keys...
					// When data is initially created, via ("key", "val") signature,
					// keys will be converted to camelCase.
					// Since there is no way to tell _how_ a key was added, remove
					// both plain key and camelCase key. #12786
					// This will only penalize the array argument path.
					name = key.concat(key.map(Camelise));
				} else {
					camel = Camelise(key);
					// Try the string as a key before any manipulation
					if (key in cache) {
						name = [key, camel];
					} else {
						// If a key with the spaces exists, use it.
						// Otherwise, create an array by matching non-whitespace
						name = camel;
						name = name in cache ? [name] : (name.match(/\S+/g) || []);
					}
				}

				i = name.length;
				while (i--) {
					delete cache[name[i]];
				}
			}
		},
		hasData: function (owner) {
			return !Yaex.Global.isEmptyObject(
				this.cache[owner[this.Expando]] || {}
			);
		},
		discard: function (owner) {
			if (owner[this.Expando]) {
				delete this.cache[owner[this.Expando]];
			}
		}
	};

	// These may be used throughout the Yaex core codebase
	Yaex.DOM.dataUser = Yaex.DOM.data_user = new Data();
	Yaex.DOM.dataPrivative = Yaex.DOM.data_priv = new Data();

	Yaex.Extend(Yaex.DOM, {
		acceptData: Data.accepts,
		hasData: function (elem) {
			return Yaex.DOM.dataUser.hasData(elem) || Yaex.DOM.dataPrivative.hasData(elem);
		},
		data: function (elem, name, data) {
			return Yaex.DOM.dataUser.access(elem, name, data);
		},
		removeData: function (elem, name) {
			Yaex.DOM.dataUser.remove(elem, name);
		},
		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to dataPrivative methods, these can be deprecated.
		_data: function (elem, name, data) {
			return Yaex.DOM.dataPrivative.access(elem, name, data);
		},
		_removeData: function (elem, name) {
			Yaex.DOM.dataPrivative.remove(elem, name);
		}
	});

	Yaex.DOM.Function.extend({
		data: function (key, value) {
			var attrs, name,
				elem = this[0],
				i = 0,
				data = null;

			// Gets all values
			if (key === undefined) {
				if (this.length) {
					data = Yaex.DOM.dataUser.get(elem);

					if (elem.nodeType === 1 && !Yaex.DOM.dataPrivative.get(elem, "hasDataAttrs")) {
						attrs = elem.attributes;
						for (; i < attrs.length; i++) {
							name = attrs[i].name;

							if (name.indexOf("data-") === 0) {
								name = Camelise(name.slice(5));
								dataAttr(elem, name, data[name]);
							}
						}
						Yaex.DOM.dataPrivative.set(elem, "hasDataAttrs", true);
					}
				}

				return data;
			}

			// Sets multiple values
			if (typeof key === "object") {
				return this.each(function () {
					Yaex.DOM.dataUser.set(this, key);
				});
			}

			return Yaex.DOM.Access(this, function (value) {
				var data,
					camelKey = Camelise(key);

				// The calling Yaex object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty Yaex object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if (elem && value === undefined) {
					// Attempt to get data from the cache
					// with the key as-is
					data = Yaex.DOM.dataUser.get(elem, key);
					if (data !== undefined) {
						return data;
					}

					// Attempt to get data from the cache
					// with the key Camelised
					data = Yaex.DOM.dataUser.get(elem, camelKey);
					if (data !== undefined) {
						return data;
					}

					// Attempt to "discover" the data in
					// HTML5 custom data-* attrs
					data = dataAttr(elem, camelKey, undefined);
					if (data !== undefined) {
						return data;
					}

					// We tried really hard, but the data doesn't exist.
					return;
				}

				// Set the data...
				this.each(function () {
					// First, attempt to store a copy or reference of any
					// data that might've been store with a camelCased key.
					var data = Yaex.DOM.dataUser.get(this, camelKey);

					// For HTML5 data-* attribute interop, we have to
					// store property names with dashes in a camelCase form.
					// This might not apply to all properties...*
					Yaex.DOM.dataUser.set(this, camelKey, value);

					// *... In the case of properties that might _actually_
					// have dashes, we need to also store a copy of that
					// unchanged property.
					if (key.indexOf("-") !== -1 && data !== undefined) {
						Yaex.DOM.dataUser.set(this, key, value);
					}
				});
			}, null, value, arguments.length > 1, null, true);
		},
		removeData: function (key) {
			return this.each(function () {
				Yaex.DOM.dataUser.remove(this, key);
			});
		}
	});

	function dataAttr(elem, key, data) {
		var name;

		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if (data === undefined && elem.nodeType === 1) {
			name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();
			data = elem.getAttribute(name);

			if (typeof data === "string") {
				try {
					data = data === "true" ? true :
						data === "false" ? false :
						data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
						rbrace.test(data) ? JSON.parse(data) :
						data;
				} catch (e) {}

				// Make sure we set the data so it isn't changed later
				Yaex.DOM.dataUser.set(elem, key, data);
			} else {
				data = undefined;
			}
		}
		return data;
	}

	// Get value from node:
	// 1. first try key as given,
	// 2. then try Camelised key,
	// 3. fall back to reading "data-*" attribute.

	function getData(node, name) {
		var id = node[exp];
		var store = id && data[id];
		if (name === undefined) {
			return store || setData(node);
		} else {
			if (store) {
				if (name in store) {
					return store[name];
				}

				var camelName = Camelise(name);

				if (camelName in store) {
					return store[camelName];
				}
			}

			return dataAttr.call(Yaex.DOM(node), name);
		}
	}

	// Store value under Camelised key on node

	function setData(node, name, value) {
		var id = node[exp] || (node[exp] = ++Yaex.DOM.UUID);
		var store = data[id] || (data[id] = attributeData(node));

		if (name !== undefined) {
			store[Camelise(name)] = value;
		}

		return store;
	}

	// Read all "data-*" attributes from a node
	function attributeData(node) {
		var store = {};

		Yaex.Each(node.attributes || Yaex.DOM.EmptyArray, function (i, attr) {
			if (attr.name.indexOf('data-') == 0) {
				store[Camelise(attr.name.replace('data-', ''))] =
					Yaex.Global.deserialiseValue(attr.value);
			}
		});

		return store;
	}

	Yaex.DOM.Function.data = function (name, value) {
		return value === undefined ?
		// set multiple values via object
		Yaex.Global.isPlainObject(name) ?
			this.each(function (i, node) {
				Yaex.Each(name, function (key, value) {
					setData(node, key, value);
				});
			}) :
		// get value from first element
		this.length === 0 ? undefined : getData(this[0], name) :
		// set value on all elements
		this.each(function () {
			setData(this, name, value);
		});
	};

	Yaex.DOM.Function.removeData = function (names) {
		if (typeof names == 'string') {
			names = names.split(/\s+/);
		}
		return this.each(function () {
			var id = this[exp];
			var store = id && data[id];
			if (store)
				Yaex.Each(names || store, function (key) {
					delete store[names ? Camelise(this) : key];
				});
		});
	};

	// Generate extended `remove` and `empty` functions
	['remove', 'empty'].forEach(function (methodName) {
		var origFn = Yaex.DOM.Function[methodName];
		Yaex.DOM.Function[methodName] = function () {
			var elements = this.find('*');
			if (methodName === 'remove') elements = elements.add(this);
			elements.removeData();
			return origFn.call(this);
		}
	});

})(window, document);

//---



/**
 * DOM.Event - Cross browser events implementation using Yaex.DOM's API
 *
 *
 * @depends: Yaex.js | Core, DOM, Selector
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	var YID = 1;

	var hover = {
		mouseenter: 'mouseover',
		mouseleave: 'mouseout'
	};

	var focus = {
		focus: 'focusin',
		blur: 'focusout'
	};

	var handlers = [];

	var slice = Array.prototype.slice;

	var rkeyEvent = /^key/;

	var rmouseEvent = /^(?:mouse|contextmenu)|click/;

	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

	var rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

	var ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/;

	var focusinSupported = 'onfocusin' in window;

	var eventMethods = {
		preventDefault: 'isDefaultPrevented',
		stopImmediatePropagation: 'isImmediatePropagationStopped',
		stopPropagation: 'isPropagationStopped'
	};

	var specialEvents = {}

	specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';

	//---

	// BEGIN OF [Private Functions]

	function yid(element) {
		return element.YID || (element.YID = YID++);
	}

	function findHandlers(element, event, fn, selector) {
		event = parse(event);
		
		if (event.ns) {
			var matcher = matcherFor(event.ns);
		}

		// return (handlers[yid(element)] || []).filter(function (handler) {
		return (_handlers(element) || []).filter(function (handler) {
			return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || yid(handler.fn) === yid(fn)) && (!selector || handler.sel == selector);
		});
	}

	function parse(event) {
		var parts = ('' + event).split('.');

		return {
			e: parts[0],
			ns: parts.slice(1).sort().join(' ')
		};
	}

	function matcherFor(ns) {
		return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
	}

	function eachEvent(events, fn, iterator) {
		if (!Yaex.Global.isString(events)) {
			Yaex.Each(events, iterator);
		} else {
			events.split(/\s/).forEach(function (type) {
				iterator(type, fn);
			});
		}
	}

	function _handlers(elem) {
		return elem._yhandlers || (elem._yhandlers = []);
	}

	function eventCapture(handler, captureSetting) {
		return handler.del &&
			(!focusinSupported && (handler.e in focus)) || !! captureSetting;
	}

	function realEvent(type) {
		return hover[type] || (focusinSupported && focus[type]) || type;
	}

	function compatible(event, source) {
		if (source || !event.isDefaultPrevented) {
			source || (source = event);

			Yaex.Each(eventMethods, function (name, predicate) {
				var sourceMethod = source[name];

				event[name] = function () {
					this[predicate] = returnTrue;
					return sourceMethod && sourceMethod.apply(source, arguments);
				};

				event[predicate] = returnFalse;
			});

			if (!Yaex.Global.isUndefined(source.defaultPrevented) ? source.defaultPrevented :
				'returnValue' in source ? source.returnValue === false :
				source.getPreventDefault && source.getPreventDefault()) {
				event.isDefaultPrevented = returnTrue;
			}
		}

		return event;
	}

	var returnTrue = function () {
		return true;
	};

	var returnFalse = function () {
		return false;
	};

	function createProxy(event) {
		var key;
		var proxy = {
			originalEvent: event
		};

		for (key in event) {
			if (!ignoreProperties.test(key) && !Yaex.Global.isUndefined(event[key])) {
				proxy[key] = event[key];
			}
		}

		return compatible(proxy, event);
	}

	// END OF [Private Functions]

	//---

	Yaex.DOM.Event = function (type, props) {
		if (!Yaex.Global.isString(type)) {
			props = type;
			type = props.type;
		}

		var event = window.document.createEvent(specialEvents[type] || 'Events');

		var bubbles = true;

		if (props) {
			for (var name in props) {
				(name == 'bubbles') ? (bubbles = !! props[name]) : (event[name] = props[name]);
			}
		}

		event.initEvent(type, bubbles, true);

		return compatible(event);
	};

	//---

	//---

	var eventsKey = '_yaex_events';

	/**
	 * Yaex.DOM.Event contains functions for working with DOM events.
	 */
	Yaex.Utility.Extend(Yaex.DOM.Event, {
		// Inspired by John Resig, Dean Edwards and YUI addEvent implementations 
		addListener: function (object, type, callback, context) {

			var id = type + Yaex.Stamp(callback) + (context ? '_' + Yaex.Stamp(context) : '');

			// console.log(object);

			if (object[eventsKey] && object[eventsKey][id]) {
				return this;
			}

			var handler = function (e) {
				return callback.call(context || object, e || window.event);
			};

			var originalHandler = handler;

			if (Yaex.UserAgent.Features.Pointer && typevent.indexOf('touch') === 0) {
				return this.addPointerListener(object, type, handler, id);
			}

			if (Yaex.UserAgent.Features.Touch && (type === 'dblclick') && this.addDoubleTapListener) {
				this.addDoubleTapListener(object, handler, id);
			}

			if (('addEventListener' in object)) {
				if (type === 'mousewheel') {
					object.addEventListener('DOMMouseScroll', handler, false);
					object.addEventListener(type, handler, false);
				} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
					handler = function (e) {
						e = e || window.event;
						if (!Yaex.DOM.Event._checkMouse(object, e)) { return; }
						return originalHandler(e);
					};

					object.addEventListener(type === 'mouseenter' ? 'mouseover' : 'mouseout', handler, false);

				} else {
					if (type === 'click' && Yaex.UserAgent.OS.Android) {
						handler = function (e) {
							return Yaex.DOM.Event._filterClick(e, originalHandler);
						};
					}

					object.addEventListener(type, handler, false);
				}
			} else if ('attachEvent' in object) {
				object.attachEvent('on' + type, handler);
			}

			object[eventsKey] = object[eventsKey] || {};
			object[eventsKey][id] = handler;

			return this;
		},

		removeListener: function (object, type, callback, context) {
			var id = type + Yaex.Stamp(callback) + (context ? '_' + Yaex.Stamp(context) : '');
			var handler = object[eventsKey] && object[eventsKey][id];

			if (!handler) {
				return this;
			}

			if (Yaex.UserAgent.Features.Pointer && typevent.indexOf('touch') === 0) {
				this.removePointerListener(object, type, id);
			} else if (Yaex.UserAgent.Features.Touch && (type === 'dblclick') && this.removeDoubleTapListener) {
				this.removeDoubleTapListener(object, id);
			} else if ('removeEventListener' in object) {
				if (type === 'mousewheel') {
					object.removeEventListener('DOMMouseScroll', handler, false);
					object.removeEventListener(type, handler, false);

				} else {
					object.removeEventListener(
						type === 'mouseenter' ? 'mouseover' :
						type === 'mouseleave' ? 'mouseout' : type, handler, false);
				}

			} else if ('detachEvent' in object) {
				object.detachEvent('on' + type, handler);
			}

			object[eventsKey][id] = null;

			return this;
		},

		stopPropagation: function (event) {
			if (event.stopPropagation) {
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}
			Yaex.DOM.Event._skipped(event);

			return this;
		},

		disableScrollPropagation: function (el) {
			var stop = Yaex.DOM.Event.stopPropagation;

			return Yaex.DOM.Event
				.on(el, 'mousewheel', stop)
				.on(el, 'MozMousePixelScroll', stop);
		},

		disableClickPropagation: function (el) {
			var stop = Yaex.DOM.Event.stopPropagation;

			for (var i = L.Draggablevent.START.length - 1; i >= 0; i--) {
				Yaex.DOM.Event.on(el, L.Draggablevent.START[i], stop);
			}

			return Yaex.DOM.Event
				.on(el, 'click', Yaex.DOM.Event._fakeStop)
				.on(el, 'dblclick', stop);
		},

		preventDefault: function (event) {
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}

			return this;
		},

		stop: function (event) {
			return Yaex.DOM.Event
				.preventDefault(event)
				.stopPropagation(event);
		},

		getMousePosition: function (event, container) {
			var body = document.body,
			    docEl = document.documentElement,

			    // Gecko makes scrollLeft more negative as you scroll in rtl, other browsers don't
				// ref: https://code.google.com/p/closure-library/source/browse/closure/goog/style/bidi.js
				x = event.pageX ? event.pageX - body.scrollLeft -
						docEl.scrollLeft * (Yaex.DOM.documentIsLtr() || Yaex.UserAgent.Browser.Gecko ? 1 : -1) : event.clientX,
			    y = event.pageY ? event.pageY - body.scrollTop - docEl.scrollTop : event.clientY,

			    pos = new L.Point(x, y);

			if (!container) {
				return pos;
			}

			var rect = container.getBoundingClientRect(),
			    left = rect.left - container.clientLeft,
			    top = rect.top - container.clientTop;

			return pos._subtract(new L.Point(left, top));
		},

		getWheelDelta: function (e) {
			var delta = 0;

			if (event.wheelDelta) {
				delta = event.wheelDelta / 120;
			}

			if (event.detail) {
				delta = -event.detail / 3;
			}

			return delta;
		},

		_skipEvents: {},

		_fakeStop: function (e) {
			// fakes stopPropagation by setting a special event flag, checked/reset with Yaex.DOM.Event._skipped(e)
			Yaex.DOM.Event._skipEvents[event.type] = true;
		},

		_skipped: function (e) {
			var skipped = this._skipEvents[event.type];
			// reset when checking, as it's only used in map container and propagates outside of the map
			this._skipEvents[event.type] = false;
			return skipped;
		},

		// check if element really left/entered the event target (for mouseenter/mouseleave)
		_checkMouse: function (el, e) {
			var related = event.relatedTarget;

			if (!related) { return true; }

			try {
				while (related && (related !== el)) {
					related = related.parentNode;
				}
			} catch (err) {
				return false;
			}
			return (related !== el);
		},

		// this is a horrible workaround for a bug in Android where a single touch triggers two click events
		_filterClick: function (e, handler) {
			var timeStamp = (event.timeStamp || event.originalEvent.timeStamp),
				elapsed = Yaex.DOM.Event._lastClick && (timeStamp - Yaex.DOM.Event._lastClick);

			// are they closer together than 1000ms yet more than 100ms?
			// Android typically triggers them ~300ms apart while multiple listeners
			// on the same event should be triggered far faster;
			// or check if click is simulated on the element, and if it is, reject any non-simulated events

			if ((elapsed && elapsed > 100 && elapsed < 1000) || (event.target._simulatedClick && !event._simulated)) {
				Yaex.DOM.Event.stop(e);
				return;
			}

			Yaex.DOM.Event._lastClick = timeStamp;

			return handler(e);
		}, 


	});

	//---

	Yaex.DOM.Event.on = Yaex.DOM.Event.addListener;
	Yaex.DOM.Event.off = Yaex.DOM.Event.removeListener;

	//---

	Yaex.Utility.Extend(Yaex.DOM.Event, {
		add: function (element, events, fn, data, selector, delegator, capture) {
			// var id = yid(element);
			var set = _handlers(element);
			// var _set = (handlers[id] || (handlers[id] = []));
			// var type;

			events.split(/\s/).forEach(function (event) {
				if (event == 'ready') {
					return Yaex.DOM(document).ready(fn);
				}

				var handler = parse(event);

				handler.fn = fn;
				handler.sel = selector;

				// console.log((handler.e in hover));

				// Emulate mouseenter, mouseleave
				if (handler.e in hover) {
					fn = function (e) {
						var related = e.relatedTarget;

						if (!related || (related !== this && !Yaex.DOM.Contains(this, related))) {
							return handler.fn.apply(this, arguments);
						}
					}
				}

				handler.del = delegator;

				var callback = delegator || fn;
				
				handler.proxy = function (e) {
					e = compatible(e);

					if (e.isImmediatePropagationStopped()) {
						return;
					}

					e.data = data;

					var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args));

					if (result === false) {
						e.preventDefault(), e.stopPropagation();
					}

					return result;
				};

				handler.i = set.length;

				set.push(handler);

				if ('addEventListener' in element) {
					// element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
					Yaex.DOM.Event.on(element, realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
				}
			});
		},

		remove: function (element, events, fn, selector, capture) {
			// var id = yid(element);

			(events || '').split(/\s/).forEach(function (event) {
				findHandlers(element, event, fn, selector).forEach(function (handler) {
					// delete handlers[id][handler.i];
					delete _handlers(element)[handler.i];

					if ('removeEventListener' in element) {
						// element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
						Yaex.DOM.Event.off(element, realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
					}
				});
			});
		},

		dispacher: function (eventType, object) {
			var dispatcher = function (event, event_type, handler) {
				try {
					var classes = [];
					var clsStr = Yaex.DOM(event.target || event.srcElement).attr('class');

					if (clsStr.indexOf(' ') > -1) {
						classes = clsStr.split(' ');
					} else {
						classes = [clsStr];
					}

					for (var x in classes) {
						var hname = classes[x].replace(/com_/, '');

						if (handler[hname]) {
							if (handler[hname][event_type]) {
								handler[hname][event_type](event, event_type);
							}
						}
					}
				} catch (e) {
					//...
				}
			};

			var eventTypes;

			if (eventType.indexOf(',') > -1) {
				eventTypes = eventType.split(',');
			} else if (eventType.indexOf(', ') > -1) {
				eventTypes = eventType.split(', ');
			} else if (eventType.indexOf(' , ') > -1) {
				eventTypes = eventType.split(' , ');
			} else if (eventType.indexOf(' ,') > -1) {
				eventTypes = eventType.split(' ,');
			} else {
				eventTypes = [eventType];
			}

			for (var x in eventTypes) {
				Yaex.DOM('body')[eventTypes[x]]((function (evt) {
					return function (e) {
						dispatcher(e, evt, object);
					}
				})(eventTypes[x]));
			}
		}
	});

	//---

	Yaex.DOM.proxy = Yaex.DOM.Proxy = function (callback, context) {
		if (Yaex.Global.isFunction(callback)) {
			var proxyFn = function () {
				return callback.apply(context, arguments);
			};

			proxyFn.YID = yid(callback);

			return proxyFn;
		} else if (Yaex.Global.isString(context)) {
			return Yaex.DOM.Proxy(callback[context], callback);
		} else {
			throw new TypeError('expected function');
		}
	};

	Yaex.DOM.Function.bind = function (event, data, callback) {
		return this.on(event, data, callback);
	};

	Yaex.DOM.Function.unbind = function (event, callback) {
		return this.off(event, callback)
	};

	Yaex.DOM.Function.one = function (event, selector, data, callback) {
		return this.on(event, selector, data, callback, 1);
	};

	Yaex.DOM.Function.delegate = function (selector, event, callback) {
		return this.on(event, selector, callback);
	};

	Yaex.DOM.Function.undelegate = function (selector, event, callback) {
		return this.off(event, selector, callback);
	};

	Yaex.DOM.Function.live = function (event, callback) {
		Yaex.DOM(document.body).delegate(this.selector, event, callback);
		return this;
	};

	Yaex.DOM.Function.die = function (event, callback) {
		Yaex.DOM(document.body).undelegate(this.selector, event, callback);
		return this;
	};

	Yaex.DOM.Function.on = function (event, selector, data, callback, one) {
		var autoRemove;
		var delegator;
		var $this = this;

		if (event && !Yaex.Global.isString(event)) {
			Yaex.Each(event, function (type, fn) {
				$this.on(type, selector, data, fn, one);
			});

			return $this;
		}

		if (!Yaex.Global.isString(selector) && !Yaex.Global.isFunction(callback) && callback !== false) {
			callback = data;
			data = selector;
			selector = undefined;
		}

		if (Yaex.Global.isFunction(data) || data === false) {
			callback = data;
			data = undefined;
		}

		if (callback === false) {
			callback = returnFalse;
		}

		return $this.each(function (_, element) {
			if (one) {
				autoRemove = function (e) {
					Yaex.DOM.Event.remove(element, e.type, callback);
					return callback.apply(this, arguments);
				}
			}

			if (selector) {
				delegator = function (e) {
					var evt;
					var match = Yaex.DOM(e.target).closest(selector, element).get(0);

					if (match && match !== element) {
						evt = Yaex.Extend(createProxy(e), {
							currentTarget: match,
							liveFired: element
						});

						return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)));
					}
				};
			}

			Yaex.DOM.Event.add(element, event, callback, data, selector, delegator || autoRemove);
		});
	};

	Yaex.DOM.Function.off = function (event, selector, callback) {
		var $this = this;

		if (event && !Yaex.Global.isString(event)) {
			Yaex.Each(event, function (type, fn) {
				$this.off(type, selector, fn);
			});

			return $this;
		}

		if (!Yaex.Global.isString(selector) && !Yaex.Global.isFunction(callback) && callback !== false) {
			callback = selector;
			selector = undefined;
		}

		if (callback === false) {
			callback = returnFalse;
		}

		return $this.each(function () {
			Yaex.DOM.Event.remove(this, event, callback, selector);
		});
	};

	Yaex.DOM.Function.trigger = function (event, args) {
		if (Yaex.Global.isString(event) || Yaex.Global.isPlainObject(event)) {
			event = Yaex.DOM.Event(event);
		} else {
			event = compatible(event);
		}

		event._args = args;

		return this.each(function () {
			// items in the collection might not be DOM elements
			if ('dispatchEvent' in this) {
				this.dispatchEvent(event);
			} else {
				Yaex.DOM(this).triggerHandler(event, args);
			}
		});
	};

	// triggers event handlers on current element just as if an event occurred,
	// doesn't trigger an actual event, doesn't bubble
	Yaex.DOM.Function.triggerHandler = function (event, args) {
		var e;
		var result;

		this.each(function (i, element) {
			e = createProxy(Yaex.Global.isString(event) ? Yaex.Event.Create(event) : event);
			e._args = args;
			e.target = element;

			Yaex.Each(findHandlers(element, event.type || event), function (i, handler) {
				result = handler.proxy(e);

				if (e.isImmediatePropagationStopped()) {
					return false
				}
			});
		});

		return result;
	};


	// shortcut methods for `.bind(event, fn)` for each event type
	('focusin focusout load resize scroll unload click dblclick hashchange ' +
		'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
		'change select submit keydown keypress keyup error contextmenu').split(' ').forEach(function (event) {
		Yaex.DOM.Function[event] = function (callback) {
			return callback ?
				this.bind(event, callback) :
				this.trigger(event);
		};
	});

	Yaex.DOM.Function.hashchange = function (callback) {
		return callback ? this.bind('hashchange', callback) : this.trigger('hashchange', callback);
	};

	['focus', 'blur'].forEach(function (name) {
		Yaex.DOM.Function[name] = function (callback) {
			if (callback) {
				this.bind(name, callback);
			} else {
				this.each(function () {
					try {
						this[name]();
					} catch (e) {
						//...
					}
				});
			}

			return this;
		};
	});

	// Generate extended `remove` and `empty` functions
	['remove', 'empty'].forEach(function (method) {
		var origFn = Yaex.DOM.Function[method];

		Yaex.DOM.Function[method] = function () {
			var elements = this.find('*');

			if (method === 'remove') {
				elements = elements.add(this);
			}

			elements.forEach(function (elem) {
				Yaex.DOM.Event.remove(elem);
			});

			return origFn.call(this);
		};
	});

	//---

})(Yaex.DOM);

//---


/**
 * Draggable - Cross browser Draggable events implementation using Yaex.DOM's API [DOM]
 *
 *
 * @depends: Yaex.js | Core, DOM, Selector, DomEvent
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function (window, document, undefined) {

	'use strict';

	Yaex.Draggable = Yaex.Evented.Extend({
	});

	//---

})(window, document);

//---


/**
 * FX - Cross browser animations implementation using Yaex.DOM's API [DOM]
 *
 *
 * @depends: Yaex.js | Core, DOM, Selector
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	var prefix = '';
	var eventPrefix;
	var vendors = {
		Webkit: 'webkit',
		Moz: 'Moz',
		O: 'o',
		ms: 'MS'
	};
	
	var document = window.document;
	var testEl = document.createElement('div');
	var supportedTransforms = /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;
	var transform;
	var transitionProperty;
	var transitionDuration;
	var transitionTiming;
	var transitionDelay;
	var animationName;
	var animationDuration;
	var animationTiming;
	var animationDelay;
	var cssReset = {};

	//--

	function dasherize(str) {
		return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase();
	}

	function normalizeEvent(name) {
		return eventPrefix ? eventPrefix + name : name.toLowerCase();
	}

	Yaex.Each(vendors, function (vendor, event) {
		if (testEl.style[vendor + 'TransitionProperty'] !== undefined) {
			prefix = '-' + vendor.toLowerCase() + '-';
			eventPrefix = event;
			return false;
		}
	});

	transform = prefix + 'transform';

	cssReset[transitionProperty = prefix + 'transition-property'] =
		cssReset[transitionDuration = prefix + 'transition-duration'] =
		cssReset[transitionDelay = prefix + 'transition-delay'] =
		cssReset[transitionTiming = prefix + 'transition-timing-function'] =
		cssReset[animationName = prefix + 'animation-name'] =
		cssReset[animationDuration = prefix + 'animation-duration'] =
		cssReset[animationDelay = prefix + 'animation-delay'] =
		cssReset[animationTiming = prefix + 'animation-timing-function'] = '';

	Yaex.DOM.fx = {
		off: (eventPrefix === undefined && testEl.style.transitionProperty === undefined),
		speeds: {
			_default: 400,
			fast: 200,
			slow: 600
		},
		cssPrefix: prefix,
		transitionEnd: normalizeEvent('TransitionEnd'),
		animationEnd: normalizeEvent('AnimationEnd'),
	};

	Yaex.DOM.Function.animate = function (properties, duration, ease, callback, delay) {
		if (Yaex.Global.isFunction(duration)) {
			callback = duration;
			ease = undefined;
			duration = undefined;
		}

		if (Yaex.Global.isFunction(ease)) {
			callback = ease;
			ease = undefined;
		}

		if (Yaex.Global.isPlainObject(duration)) {
			ease = duration.easing;
			callback = duration.complete;
			delay = duration.delay;
			duration = duration.duration;
		}

		if (duration) {
			duration = (typeof duration == 'number' ? duration :
				(Yaex.DOM.fx.speeds[duration] || Yaex.DOM.fx.speeds._default)) / 1000;
		}

		if (delay) {
			delay = parseFloat(delay) / 1000;
		}

		return this.anim(properties, duration, ease, callback, delay);
	};

	Yaex.DOM.Function.anim = function (properties, duration, ease, callback, delay) {
		var key, cssValues = {}, cssProperties, transforms = '',
			that = this,
			wrappedCallback, endEvent = Yaex.DOM.fx.transitionEnd,
			fired = false;

		if (duration === undefined) {
			duration = Yaex.DOM.fx.speeds._default / 1000;
		}

		if (delay === undefined) delay = 0;
		if (Yaex.DOM.fx.off) duration = 0;

		if (typeof properties === 'string') {
			// keyframe animation
			cssValues[animationName] = properties
			cssValues[animationDuration] = duration + 's'
			cssValues[animationDelay] = delay + 's'
			cssValues[animationTiming] = (ease || 'linear')
			endEvent = Yaex.DOM.fx.animationEnd
		} else {
			cssProperties = []
			// CSS transitions
			for (key in properties)
				if (supportedTransforms.test(key)) transforms += key + '(' + properties[key] + ') '
				else cssValues[key] = properties[key], cssProperties.push(dasherize(key))

			if (transforms) cssValues[transform] = transforms, cssProperties.push(transform)
			if (duration > 0 && typeof properties === 'object') {
				cssValues[transitionProperty] = cssProperties.join(', ')
				cssValues[transitionDuration] = duration + 's'
				cssValues[transitionDelay] = delay + 's'
				cssValues[transitionTiming] = (ease || 'linear')
			}
		}

		wrappedCallback = function (event) {
			if (typeof event !== 'undefined') {
				if (event.target !== event.currentTarget) return; // makes sure the event didn't bubble from 'below'
				Yaex.DOM(event.target).unbind(endEvent, wrappedCallback);
			} else
				Yaex.DOM(this).unbind(endEvent, wrappedCallback); // triggered by setTimeout

			fired = true;

			Yaex.DOM(this).css(cssReset);
			
			callback && callback.call(this);
		}
		if (duration > 0) {
			this.bind(endEvent, wrappedCallback);
			// transitionEnd is not always firing on older Android phones
			// so make sure it gets fired
			setTimeout(function () {
				if (fired) return
				wrappedCallback.call(that)
			}, (duration * 1000) + 25);
		}

		// trigger page reflow so new elements can animate
		this.size() && this.get(0).clientLeft;

		this.css(cssValues);

		if (duration <= 0) setTimeout(function () {
			that.each(function () {
				wrappedCallback.call(this)
			})
		}, 0);

		return this
	};

	testEl = null;

})(Yaex.DOM);

//---



/**
 * FX.Methods - Cross browser animations implementation using Yaex.DOM's API [DOM]
 *
 *
 * @depends: Yaex.js | Core, DOM, Selector, FX
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	var origShow = Yaex.DOM.Function.show;
	var origHide = Yaex.DOM.Function.hide;
	var origToggle = Yaex.DOM.Function.toggle;

	function anim(el, speed, opacity, scale, callback) {
		if (typeof speed == 'function' && !callback) {
			callback = speed;
			speed = undefined;
		}

		var props = {
			opacity: opacity
		};

		if (scale) {
			props.scale = scale;
			el.css(Yaex.DOM.fx.cssPrefix + 'transform-origin', '0 0');
		}
		return el.animate(props, speed, null, callback);
	}

	function hide(el, speed, scale, callback) {
		return anim(el, speed, 0, scale, function () {
			origHide.call(Yaex.DOM(this));
			callback && callback.call(this);
		});
	}

	Yaex.DOM.Function.show = function (speed, callback) {
		origShow.call(this);
		if (speed === undefined) speed = 0;
		else this.css('opacity', 0);
		return anim(this, speed, 1, '1,1', callback);
	};

	Yaex.DOM.Function.hide = function (speed, callback) {
		if (speed === undefined) return origHide.call(this);
		else return hide(this, speed, '0,0', callback);
	};

	Yaex.DOM.Function.toggle = function (speed, callback) {
		if (speed === undefined || typeof speed == 'boolean')
			return origToggle.call(this, speed);
		else return this.each(function () {
			var el = Yaex.DOM(this);
			el[el.css('display') == 'none' ? 'show' : 'hide'](speed, callback);
		});
	};

	Yaex.DOM.Function.fadeTo = function (speed, opacity, callback) {
		return anim(this, speed, opacity, null, callback);
	};

	Yaex.DOM.Function.fadeIn = function (speed, callback) {
		var target = this.css('opacity');
		if (target > 0) this.css('opacity', 0);
		else target = 1;
		return origShow.call(this).fadeTo(speed, target, callback);
	};

	Yaex.DOM.Function.fadeOut = function (speed, callback) {
		return hide(this, speed, null, callback);
	};

	Yaex.DOM.Function.fadeToggle = function (speed, callback) {
		return this.each(function () {
			var el = Yaex.DOM(this);
			el[(el.css('opacity') === 0 || el.css('display') === 'none') ? 'fadeIn' : 'fadeOut'](speed, callback);
		});
	};

	Yaex.DOM.Function.stop = function (type, clearQueue, gotoEnd) {
		var stopQueue = function (hooks) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop(gotoEnd);
		};

		if (typeof type !== 'string') {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		
		if (clearQueue && type !== false) {
			this.queue(type || 'fx', []);
		}

		return this.each(function () {
			var dequeue = true,
				index = type != null && type + 'queueHooks',
				timers = Yaex.DOM.Timers,
				data = Yaex.DOM.dataPrivative.get(this);

			if (index) {
				if (data[index] && data[index].stop) {
					stopQueue(data[index]);
				}
			} else {
				for (index in data) {
					if (data[index] && data[index].stop && rrun.test(index)) {
						stopQueue(data[index]);
					}
				}
			}

			for (index = timers.length; index--;) {
				if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
					timers[index].anim.stop(gotoEnd);
					dequeue = false;
					timers.splice(index, 1);
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if (dequeue || !gotoEnd) {
				Yaex.DOM.dequeue(this, type);
			}
		});
	};

})(Yaex.DOM);

//---



/**
 * Ajax - Ajax implementation using Yaex.DOM's API [DOM]
 *
 *
 * @depends: Yaex.js | Core, DOM, Event, Deferred
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	var jsonpID = 0;
	var document = window.document;
	var key;
	var name;
	var scriptReplacement = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	var scriptTypeReplacement = /^(?:text|application)\/javascript/i;
	var xmlTypeReplacement = /^(?:text|application)\/xml/i;
	var jsonType = 'application/json';
	var htmlType = 'text/html';
	var blankReplacement = /^\s*$/;

	//---

	// BEGIN OF [Private Functions]

	/**
	 * Empty
	 *
	 * Used as default callback
	 *
	 * @return 	void
	 */

	function Empty() {}

	// Trigger a custom event and return false if it was cancelled

	function triggerAndReturn(context, event, data) {
		var eventName = Yaex.DOM.Event(event);

		Yaex.DOM(context).trigger(eventName, data);

		return !eventName.defaultPrevented;
	}

	// Trigger an Ajax "Global" event

	function triggerGlobal(settings, context, event, data) {
		if (settings.global) {
			return triggerAndReturn(context || document, event, data);
		}
	}

	function ajaxStart(settings) {
		if (settings.global && Yaex.AjaxActive++ === 0) {
			triggerGlobal(settings, null, 'ajaxStart');
		}
	}

	function ajaxStop(settings) {
		if (settings.global && !(--Yaex.AjaxActive)) {
			triggerGlobal(settings, null, 'ajaxStop');
		}
	}

	// Triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable

	function ajaxBeforeSend(xhr, settings) {
		var context = settings.context;

		if (settings.beforeSend.call(context, xhr, settings) === false || triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false) {
			return false;
		}

		triggerGlobal(settings, context, 'ajaxSend', [xhr, settings]);
	}

	function ajaxSuccess(data, xhr, settings, deferred) {
		var context = settings.context;
		var status = 'success';

		settings.success.call(context, data, status, xhr);

		if (deferred) {
			deferred.resolveWith(context, [data, status, xhr]);
		}

		triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data]);

		ajaxComplete(status, xhr, settings);
	}

	// Type: "timeout", "error", "abort", "parsererror"

	function ajaxError(error, type, xhr, settings, deferred) {
		var context = settings.context;

		settings.error.call(context, xhr, type, error);

		if (deferred) {
			deferred.rejectWith(context, [xhr, type, error]);
		}

		triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error]);

		ajaxComplete(type, xhr, settings);
	}

	// Status: "success", "notmodified", "error", "timeout", "abort", "parsererror"

	function ajaxComplete(status, xhr, settings) {
		var context = settings.context;

		settings.complete.call(context, xhr, status);

		triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings]);

		ajaxStop(settings);
	}

	//---

	/**
	 * Retrieves the value of a cookie by the given key.
	 *
	 * @param key, (string) Name of the cookie to retrieve.
	 * @return (string) Value of the given key or null.
	 */

	function getCookie(key) {
		var result = (
			new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)')
		).exec(document.cookie);

		return result ? result[1] : null;
	}

	/**
	 * Checks if our host matches the request's host.
	 *
	 * @param url, (string) URL of request.
	 * @return (boolean) Request is to origin.
	 */

	function sameOrigin(url) {
		// Url could be relative or scheme relative or absolute
		var sr_origin = '//' + document.location.host;
		var origin = document.location.protocol + sr_origin;

		// Allow absolute or scheme relative URLs to same origin
		return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
			(url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
		// or any other URL that isn't scheme relative or absolute i.e relative.
		!(/^(\/\/|http:|https:).*/.test(url));
	}


	function mimeToDataType(mime) {
		if (mime) {
			mime = mime.split(';', 2)[0];
		}

		return mime && (mime === htmlType ? 'html' :
			mime === jsonType ? 'json' :
			scriptTypeReplacement.test(mime) ? 'script' :
			xmlTypeReplacement.test(mime) && 'xml') || 'text';
	}

	function appendQuery(url, query) {
		return (url + '&' + query).replace(/[&?]{1,2}/, '?');
	}

	// Serialise payload and append it to the URL for GET requests

	function serialiseData(options) {
		if (options.processData && options.data && !Yaex.Global.isString(options.data)) {
			options.data = Yaex.Utility.Parameters(options.data, options.traditional);
		}

		if (options.data && (!options.type || options.type.toUpperCase() === 'GET')) {
			options.url = appendQuery(options.url, options.data);
			options.data = undefined;
		}
	}

	// Handle optional data/success arguments

	function parseArguments(url, data, success, dataType) {
		var hasData = !Yaex.Global.isFunction(data);

		return {
			url: url,
			data: hasData ? data : undefined,
			success: !hasData ? data : Yaex.Global.isFunction(success) ? success : undefined,
			dataType: hasData ? dataType || success : success
		};
	}

	// END OF [Private Functions]

	//---

	Yaex.Utility.Extend(Yaex.DOM, {
		AjaxSettings: {
			// Default type of request
			type: 'GET',
			// Callback that is executed before request
			beforeSend: Empty,
			// Callback that is executed if the request succeeds
			success: Empty,
			// Callback that is executed the the server drops error
			error: Empty,
			// Callback that is executed on request complete (both: error and success)
			complete: Empty,
			// The context for the callbacks
			context: null,
			// Whether to trigger "global" Ajax events
			global: true,
			// Transport
			xhr: function () {
				return new window.XMLHttpRequest();
			},
			// MIME types mapping
			accepts: {
				script: 'text/javascript, application/javascript, application/x-javascript',
				json: jsonType,
				xml: 'application/xml, text/xml',
				html: htmlType,
				text: 'text/plain'
			},
			// Whether the request is to another domain
			crossDomain: false,
			// Default timeout
			timeout: 0,
			// Whether data should be serialized to string
			processData: true,
			// Whether the browser should be allowed to cache GET responses
			cache: true
		},
	});

	//---

	Yaex.Utility.Extend(Yaex.DOM, {
		AjaxJSONP: function (options, deferred) {
			if (!('type' in options)) {
				return this.Ajax(options);
			}

			//var callbackName = 'jsonp' + (++jsonpID);
			var _callbackName = options.jsonpCallback;

			var callbackName = (Yaex.Global.isFunction(_callbackName) ? _callbackName() : _callbackName) || ('jsonp' + (++jsonpID));

			var script = document.createElement('script');

			var originalCallback = window[callbackName];

			var responseData;

			var abort = function (errorType) {
				Yaex.DOM(script).triggerHandler('error', errorType || 'abort')
			};

			var xhr = {
				abort: abort
			};

			var abortTimeout;

			if (deferred) {
				deferred.promise(xhr);
			}

			// Yaex.DOM(script).on('load error', function(e, errorType) {
			Yaex.DOM(script).on('load error', function (e, errorType) {
				clearTimeout(abortTimeout);

				Yaex.DOM(script).off('load error');
				Yaex.DOM(script).remove();

				console.log(e);

				if (e.type == 'error' || !responseData) {
					ajaxError(null, errorType || 'error', xhr, options, deferred);
				} else {
					ajaxSuccess(responseData[0], xhr, options, deferred)
				}

				window[callbackName] = function (data) {
					// cleanup();
					ajaxSuccess(data, xhr, options);
				};

				originalCallback = responseData = undefined;
			});

			if (ajaxBeforeSend(xhr, options) === false) {
				abort('abort');
				return xhr;
			}

			window[callbackName] = function () {
				responseData = arguments;
			};

			script.onerror = function () {
				abort('error');
			};

			script.src = options.url.replace(/=\?/, '=' + callbackName);

			document.head.appendChild(script);

			if (options.timeout > 0) {
				abortTimeout = setTimeout(function () {
					abort('timeout');
				}, options.timeout);
			}

			return xhr;
		},

		Ajax: function (options) {
			var settings = Yaex.Utility.simpleExtend({}, options || {});
			var deferred = Yaex.Global.Deferred && Yaex.Global.Deferred();

			for (key in this.AjaxSettings) {
				if (settings[key] === undefined) {
					settings[key] = this.AjaxSettings[key];
				}
			}

			ajaxStart(settings);

			if (!settings.crossDomain) {
				settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 !== window.location.host;
			}

			if (!settings.url) {
				settings.url = window.location.toString();
			}

			serialiseData(settings);

			if (settings.cache === false) {
				settings.url = appendQuery(settings.url, '_=' + Date.now());
			}

			var dataType = settings.dataType;

			var hasPlaceholder = /\?.+=\?/.test(settings.url);

			if (dataType == 'jsonp' || hasPlaceholder) {
				if (!hasPlaceholder) {
					settings.url = appendQuery(settings.url, settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?');
				}

				return this.AjaxJSONP(settings, deferred);
			}

			var mime = settings.accepts[dataType];

			var headers = {};

			var setHeader = function (name, value) {
				headers[name.toLowerCase()] = [name, value]
			};

			var protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;

			var xhr = settings.xhr();

			var nativeSetHeader = xhr.setRequestHeader;

			var abortTimeout;

			if (deferred) {
				deferred.promise(xhr);
			}

			if (!settings.crossDomain) {
				setHeader('X-Requested-With', 'XMLHttpRequest');
			}

			setHeader('Accept', mime || '*/*');

			if (mime = settings.mimeType || mime) {
				if (mime.indexOf(',') > -1) {
					mime = mime.split(',', 2)[0];
				}
				xhr.overrideMimeType && xhr.overrideMimeType(mime);
			}

			if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() !== 'GET')) {
				setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');
			}

			if (settings.headers) {
				for (name in settings.headers) {
					setHeader(name, settings.headers[name]);
				}
			}

			xhr.setRequestHeader = setHeader;

			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					xhr.onreadystatechange = Empty;

					clearTimeout(abortTimeout);

					var result;

					var error = false;

					if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || (xhr.status === 0 && protocol == 'file:')) {
						dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'));

						result = xhr.responseText;

						try {
							// http://perfectionkills.com/global-eval-what-are-the-options/
							if (dataType == 'script') {
								(1, eval)(result);
							}

							if (dataType == 'xml') {
								result = xhr.responseXML;
							}

							if (dataType == 'json') {
								result = blankReplacement.test(result) ? null : Yaex.parseJSON(result);
							}
						} catch (e) {
							error = e;
						}

						if (error) {
							ajaxError(error, 'parsererror', xhr, settings, deferred);
						} else {
							ajaxSuccess(result, xhr, settings, deferred);
						}
					} else {
						ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred);
					}
				}
			};

			if (ajaxBeforeSend(xhr, settings) === false) {
				xhr.abort();
				ajaxError(null, 'abort', xhr, settings, deferred);
				return xhr;
			}

			if (settings.xhrFields) {
				for (name in settings.xhrFields) {
					xhr[name] = settings.xhrFields[name];
				}
			}

			var async = 'async' in settings ? settings.async : true;

			xhr.open(settings.type, settings.url, async, settings.username, settings.password);

			for (name in headers) {
				nativeSetHeader.apply(xhr, headers[name]);
			}

			if (settings.timeout > 0) {
				abortTimeout = setTimeout(function () {
					xhr.onreadystatechange = Empty;
					xhr.abort();
					ajaxError(null, 'timeout', xhr, settings, deferred);
				}, settings.timeout);
			}

			// avoid sending Empty string (#319)
			xhr.send(settings.data ? settings.data : null);

			return xhr;
		},

		Get: function () {
			return this.Ajax(parseArguments.apply(null, arguments));
		},

		Post: function () {
			var options = parseArguments.apply(null, arguments);
			options.type = 'POST';
			return this.Ajax(options);
		},

		getJSON: function () {
			var options = parseArguments.apply(null, arguments);
			options.dataType = 'json';
			return this.Ajax(options);
		},

	});

	//---

	Yaex.DOM.Function.load = function (url, data, success) {
		if (!this.length) {
			return this;
		}

		if (Yaex.Global.isWindow(this[0])) {
			return this;
		}

		var self = this;

		var parts = url.split(/\s/);

		var selector;

		var options = parseArguments(url, data, success);

		var callback = options.success;

		if (parts.length > 1) {
			options.url = parts[0];
			selector = parts[1];
		}

		options.success = function (response) {
			self.html(selector ? Yaex.DOM('<div>').html(response.replace(scriptReplacement, '')).find(selector) : response);
			callback && callback.apply(self, arguments);
		};

		Yaex.DOM.Ajax(options);

		return this;
	};

	//---

	// Yaex.DOM.Function.load = function (url, data, success) {
	// 	if (!this.length) {
	// 		return this;
	// 	}

	// 	if (Yaex.Global.isWindow(this[0])) {
	// 		return this;
	// 	}

	// 	var self = this;

	// 	var parts = url.split(/\s/);

	// 	var selector;

	// 	var options = parseArguments(url, data, success);

	// 	var callback = options.success;

	// 	if (parts.length > 1) {
	// 		options.url = parts[0];
	// 		selector = parts[1];
	// 	}

	// 	options.success = function (response) {
	// 		self.html(selector ? Yaex.DOM('<div>').html(response.replace(scriptReplacement, '')).find(selector) : response);
	// 		callback && callback.apply(self, arguments);
	// 	};

	// 	Yaex.DOM.Ajax(options);

	// 	return this;
	// };

	//---

	/**
	 * Extend Yaex's AJAX beforeSend method by setting an X-CSRFToken on any
	 * 'unsafe' request methods.
	 **/
	Yaex.Utility.Extend(Yaex.DOM.AjaxSettings, {
		beforeSend: function (xhr, settings) {
			if (!(/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type)) && sameOrigin(settings.url)) {
				xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
			}
		}
	});

	//---

})(Yaex.DOM);

//---


/**
 * DOM.Form - Cross browser form implementation using Yaex.DOM's API
 *
 *
 * @depends: Yaex.js | Core, DOM, DOM.Selector DOM.Events
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {
	
	'use strict';

	Yaex.DOM.Function.serialiseArray = function () {
		var result = [];
		var el;

		Yaex.DOM([].slice.call(this.get(0).elements)).each(function () {
			el = Yaex.DOM(this);

			var type = el.attr('type');

			if (this.nodeName.toLowerCase() != 'fieldset' && 
				!this.disabled && type != 'submit' && type != 'reset' && 
				type != 'button' && ((type != 'radio' && type != 'checkbox') || this.checked)) {
				result.push({
					name: el.attr('name'),
					value: el.val()
				});
			}
		});

		return result;
	};

	Yaex.DOM.Function.serialise = function () {
		var result = [];

		this.serialiseArray().forEach(function (elm) {
			result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value));
		});

		return result.join('&');
	};

	Yaex.DOM.Function.submit = function (callback) {
		if (callback) {
			this.bind('submit', callback);
		} else if (this.length) {
			var event = Yaex.DOM.Event('submit');

			this.eq(0).trigger(event);

			if (!event.defaultPrevented) {
				this.get(0).submit();
			}
		}

		return this;
	};
	
})(Yaex.DOM);

//---

/**
 * DOM.Extra - Cross browser DOM utilities using Yaex's API [DOM]
 *
 *
 * @depends: Yaex.js | Core, DOM, Selector, Event
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	// Map object to object
	Yaex.DOM.mapObjectToObject = function (obj, callback) {
		var result = {};

		Yaex.Each(obj, function (key, value) {
			result[key] = callback.call(obj, key, value);
		});

		return result;
	};

	//---

	// Storage Module
	// Private data
	var isLocalStorage = typeof window.localStorage !== 'undefined';

	// Private functions
	function WriteToLocalStorage(name, value) {
		var key;

		if (Yaex.Global.isString(name) && Yaex.Global.isString(value)) {
			localStorage[name] = value;
			return true;
		// } else if (Yaex.Global.isObject(name) && typeof value === 'undefined') {
		} else if (Yaex.Global.isObject(name) && Yaex.Global.isUndefined(value)) {
			for (key in name) {
				if (name.hasOwnProperty(key)) {
					localStorage[key] = name[key];
				}
			}

			return true;
		}

		return false;
	}

	function ReadFromLocalStorage(name) {
		return localStorage[name];
	}

	function DeleteFromLocalStorage(name) {
		return delete localStorage[name];
	}

	function WriteCookie(name, value) {
		var date;
		var expire;
		var key;

		date = new Date();
		date.setTime(date.getTime() + 31536000000);

		expire = '; expires=' + date.toGMTString();

		if (Yaex.Global.isString(name) && Yaex.Global.isString(value)) {
			document.cookie = name + '=' + value + expire + '; path=/';
			return true;
		// } else if (typeof n === 'object' && typeof v === 'undefined') {
		} else if (Yaex.Global.isObject(name) && Yaex.Global.isUndefined(value)) {
			for (key in name) {
				if (name.hasOwnProperty(key)) {
					document.cookie = key + '=' + name[key] + expire + '; path=/';
				}
			}

			return true;
		}

		return false;
	}

	function ReadCookie(name) {
		var newName;
		var cookieArray;
		var x;
		var cookie;

		newName = name + '=';
		cookieArray = document.cookie.split(';');

		for (x = 0; x < cookieArray.length; x++) {
			cookie = cookieArray[x];

			while (cookie.charAt(0) === ' ') {
				cookie = cookie.substring(1, cookie.length);
			}

			if (cookie.indexOf(newName) === 0) {
				return cookie.substring(newName.length, cookie.length);
			}
		}

		return null;
	}

	function DeleteCookie(name) {
		return WriteCookie(name, '', -1);
	}

	/**
	 * Public API
	 * Yaex.DOM.Storage.Set('name', 'value')
	 * Yaex.DOM.Storage.Set({'name1':'value1', 'name2':'value2', etc})
	 * Yaex.DOM.Storage.Get('name')
	 * Yaex.DOM.Storage.Remove('name')
	 */
	Yaex.Extend(Yaex.DOM, {
		Storage: {
			Set: isLocalStorage ? WriteToLocalStorage : WriteCookie,
			Get: isLocalStorage ? ReadFromLocalStorage : ReadCookie,
			Remove: isLocalStorage ? DeleteFromLocalStorage : DeleteCookie
		}
	});

	//---

	// Yaex Timers
	Yaex.DOM.Function.extend({
		everyTime: function (interval, label, fn, times, belay) {
			//console.log(this);
			return this.each(function () {
				Yaex.DOM.timer.add(this, interval, label, fn, times, belay);
			});
		},
		oneTime: function (interval, label, fn) {
			return this.each(function () {
				Yaex.DOM.timer.add(this, interval, label, fn, 1);
			});
		},
		stopTime: function (label, fn) {
			return this.each(function () {
				Yaex.DOM.timer.remove(this, label, fn);
			});
		}
	});

	Yaex.Extend(Yaex.DOM, {
		timer: {
			GUID: 1,
			global: {},
			regex: /^([0-9]+)\s*(.*s)?$/,
			powers: {
				// Yeah this is major overkill...
				'ms': 1,
				'cs': 10,
				'ds': 100,
				's': 1000,
				'das': 10000,
				'hs': 100000,
				'ks': 1000000
			},
			timeParse: function (value) {
				if (value === undefined || value === null) {
					return null;
				}
				var result = this.regex.exec(Yaex.Global.Trim(value.toString()));
				if (result[2]) {
					var num = parseInt(result[1], 10);
					var mult = this.powers[result[2]] || 1;
					return num * mult;
				} else {
					return value;
				}
			},
			add: function (element, interval, label, fn, times, belay) {
				var counter = 0;

				if (Yaex.Global.isFunction(label)) {
					if (!times) {
						times = fn;
					}
					fn = label;
					label = interval;
				}

				interval = Yaex.DOM.timer.timeParse(interval);

				if (typeof interval !== 'number' ||
					isNaN(interval) ||
					interval <= 0) {
					return;
				}
				if (times && times.constructor !== Number) {
					belay = !! times;
					times = 0;
				}

				times = times || 0;
				belay = belay || false;

				if (!element.$timers) {
					element.$timers = {};
				}
				if (!element.$timers[label]) {
					element.$timers[label] = {};
				}
				fn.$timerID = fn.$timerID || this.GUID++;

				var handler = function () {
					if (belay && handler.inProgress) {
						return;
					}
					handler.inProgress = true;
					if ((++counter > times && times !== 0) ||
						fn.call(element, counter) === false) {
						Yaex.DOM.timer.remove(element, label, fn);
					}
					handler.inProgress = false;
				};

				handler.$timerID = fn.$timerID;

				if (!element.$timers[label][fn.$timerID]) {
					element.$timers[label][fn.$timerID] = window.setInterval(handler, interval);
				}

				if (!this.global[label]) {
					this.global[label] = [];
				}
				this.global[label].push(element);

			},
			remove: function (element, label, fn) {
				var timers = element.$timers,
					ret;

				if (timers) {

					if (!label) {
						for (var lab in timers) {
							if (timers.hasOwnProperty(lab)) {
								this.remove(element, lab, fn);
							}
						}
					} else if (timers[label]) {
						if (fn) {
							if (fn.$timerID) {
								window.clearInterval(timers[label][fn.$timerID]);
								delete timers[label][fn.$timerID];
							}
						} else {
							for (var _fn in timers[label]) {
								if (timers[label].hasOwnProperty(_fn)) {
									window.clearInterval(timers[label][_fn]);
									delete timers[label][_fn];
								}
							}
						}

						for (ret in timers[label]) {
							if (timers[label].hasOwnProperty(ret)) {
								break;
							}
						}
						if (!ret) {
							ret = null;
							delete timers[label];
						}
					}

					for (ret in timers) {
						if (timers.hasOwnProperty(ret)) {
							break;
						}
					}
					if (!ret) {
						element.$timers = null;
					}
				}
			}
		}
	});

	//---

	Yaex.Extend(Yaex.DOM, {
		queue: function (elem, type, data) {
			var queue;

			if (elem) {
				type = (type || 'fx') + 'queue';
				queue = Yaex.DOM.dataPrivative.get(elem, type);

				// Speed up dequeue by getting out quickly if this is just a lookup
				if (data) {
					if (!queue || Yaex.Global.isArray(data)) {
						queue = Yaex.DOM.dataPrivative.access(elem, type, Yaex.DOM.makeArray(data));
					} else {
						queue.push(data);
					}
				}
				return queue || [];
			}
		},

		dequeue: function (elem, type) {
			type = type || 'fx';

			var queue = Yaex.DOM.queue(elem, type),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = Yaex.DOM._queueHooks(elem, type),
				next = function () {
					Yaex.DOM.dequeue(elem, type);
				};

			// If the fx queue is dequeued, always remove the progress sentinel
			if (fn === 'inprogress') {
				fn = queue.shift();
				startLength--;
			}

			if (fn) {

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if (type === 'fx') {
					queue.unshift('inprogress');
				}

				// clear up the last queue stop function
				delete hooks.stop;
				fn.call(elem, next, hooks);
			}

			if (!startLength && hooks) {
				hooks.empty.fire();
			}
		},

		// not intended for public consumption - generates a queueHooks object, or returns the current one
		_queueHooks: function (elem, type) {
			var key = type + 'queueHooks';
			return Yaex.DOM.dataPrivative.get(elem, key) || Yaex.DOM.dataPrivative.access(elem, key, {
				empty: Yaex.Callbacks('once memory').add(function () {
					Yaex.DOM.dataPrivative.remove(elem, [type + 'queue', key]);
				})
			});
		}
	});

	//---

	Yaex.DOM.Function.extend({
		queue: function (type, data) {
			var setter = 2;

			if (typeof type !== 'string') {
				data = type;
				type = 'fx';
				setter--;
			}

			if (arguments.length < setter) {
				return Yaex.DOM.queue(this[0], type);
			}

			return data === undefined ?
				this :
				this.each(function () {
					var queue = Yaex.DOM.queue(this, type, data);

					// ensure a hooks for this queue
					Yaex.DOM._queueHooks(this, type);

					if (type === 'fx' && queue[0] !== 'inprogress') {
						Yaex.DOM.dequeue(this, type);
					}
				});
		},
		dequeue: function (type) {
			return this.each(function () {
				Yaex.DOM.dequeue(this, type);
			});
		},
		// Based off of the plugin by Clint Helfers, with permission.
		// http://blindsignals.com/index.php/2009/07/jquery-delay/
		delay: function (time, type) {
			time = Yaex.DOM.fx ? Yaex.DOM.fx.speeds[time] || time : time;
			type = type || 'fx';

			return this.queue(type, function (next, hooks) {
				var timeout = setTimeout(next, time);
				hooks.stop = function () {
					clearTimeout(timeout);
				};
			});
		},
		clearQueue: function (type) {
			return this.queue(type || 'fx', []);
		},
		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function (type, obj) {
			var tmp,
				count = 1,
				defer = Yaex.Global.Deferred(),
				elements = this,
				i = this.length,
				resolve = function () {
					if (!(--count)) {
						defer.resolveWith(elements, [elements]);
					}
				};

			if (typeof type !== 'string') {
				obj = type;
				type = undefined;
			}
			type = type || 'fx';

			while (i--) {
				tmp = dataPrivative.get(elements[i], type + 'queueHooks');
				if (tmp && tmp.empty) {
					count++;
					tmp.empty.add(resolve);
				}
			}
			resolve();
			return defer.promise(obj);
		}
	});

	//---

	Yaex.DOM.Function.appear = function (fn, options) {
		var settings = Yaex.Extend({
			//arbitrary data to pass to fn
			data: undefined,

			//call fn only on the first appear?
			one: true
		}, options);

		return this.each(function () {
			var t = Yaex.DOM(this);

			//whether the element is currently visible
			t.appeared = false;

			if (!fn) {

				//trigger the custom event
				t.trigger('appear', settings.data);
				return;
			}

			var w = Yaex.DOM(window);

			//fires the appear event when appropriate
			var check = function () {

				//is the element hidden?
				if (!t.is(':visible')) {

					//it became hidden
					t.appeared = false;
					return;
				}

				//is the element inside the visible window?
				var a = window.scrollX;
				var b = window.scrollY;
				var o = t.offset();
				var x = o.left;
				var y = o.top;

				if (y + t.height() >= b &&
					y <= b + w.height() &&
					x + t.width() >= a &&
					x <= a + w.width()) {

					//trigger the custom event
					if (!t.appeared) t.trigger('appear', settings.data);
				} else {

					//it scrolled out of view
					t.appeared = false;
				}
			};

			//create a modified fn with some additional logic
			var modifiedFn = function () {

				//mark the element as visible
				t.appeared = true;

				//is this supposed to happen only once?
				if (settings.one) {

					//remove the check
					w.unbind('scroll', check);
					var i = Yaex.Global.inArray(check, Yaex.DOM.Function.appear.checks);
					if (i >= 0) Yaex.DOM.Function.appear.checks.splice(i, 1);
				}

				//trigger the original fn
				fn.apply(this, arguments);
			};

			//bind the modified fn to the element
			if (settings.one) t.one('appear', modifiedFn);
			else t.bind('appear', modifiedFn);

			//check whenever the window scrolls
			w.scroll(check);

			//check whenever the dom changes
			Yaex.DOM.Function.appear.checks.push(check);

			//check now
			(check)();
		});
	};

	// Keep a queue of appearance checks
	Yaex.Extend(Yaex.DOM.Function.appear, {

		checks: [],
		timeout: null,

		//process the queue
		checkAll: function () {
			var length = Yaex.DOM.Function.appear.checks.length;
			if (length > 0)
				while (length--)(Yaex.DOM.Function.appear.checks[length])();
		},

		//check the queue asynchronously
		run: function () {
			if (Yaex.DOM.Function.appear.timeout) clearTimeout(Yaex.DOM.Function.appear.timeout);
			Yaex.DOM.Function.appear.timeout = setTimeout(Yaex.DOM.Function.appear.checkAll, 20);
		}
	});

	// Run checks when these methods are called
	Yaex.Each(['append', 'prepend', 'after', 'before',
		'attr', 'removeAttr', 'addClass', 'removeClass',
		'toggleClass', 'remove', 'css', 'show', 'hide'
	], function (i, n) {
		var old = Yaex.DOM.Function[n];

		if (old) {
			Yaex.DOM.Function[n] = function () {
				var r = old.apply(this, arguments);

				Yaex.DOM.Function.appear.run();

				return r;
			}
		}
	});

	//---

	Yaex.DOM.Function.swipe = function (options) {
		if (!this) return false;
		var touchable = 'ontouchstart' in window,
			START = 'start',
			MOVE = 'move',
			END = 'end',
			CANCEL = 'cancel',
			LEFT = 'left',
			RIGHT = 'right',
			UP = 'up',
			DOWN = 'down',
			phase = START;

		return this.each(function () {
			var self = this,
				$self = Yaex.DOM(this),
				start = {
					x: 0,
					y: 0
				},
				end = {
					x: 0,
					y: 0
				},
				delta = {
					x: 0,
					y: 0
				},
				distance = {
					x: 0,
					y: 0
				},
				direction = undefined,
				touches = 0;

			function validate(event) {
				var evt = touchable ? event.touches[0] : event;
				distance.x = evt.pageX - start.x;
				distance.y = evt.pageY - start.y;
				delta.x = evt.pageX - end.x;
				delta.y = evt.pageY - end.y;
				end.x = evt.pageX;
				end.y = evt.pageY;

				var angle = Math.round(Math.atan2(end.y - start.y, start.x - end.x) * 180 / Math.PI);
				if (angle < 0) angle = 360 - Math.abs(angle);
				if ((angle <= 360) && (angle >= 315) || (angle <= 45) && (angle >= 0)) {
					direction = LEFT;
				} else if ((angle <= 225) && (angle >= 135)) {
					direction = RIGHT;
				} else if ((angle < 135) && (angle > 45)) {
					direction = DOWN;
				} else {
					direction = UP;
				}
			}

			function swipeStart(event) {
				var evt = touchable ? event.touches[0] : event;
				if (touchable) touches = event.touches.length;
				phase = START;
				start.x = evt.pageX;
				start.y = evt.pageY;
				validate(event);

				self.addEventListener((touchable) ? 'touchmove' : 'mousemove', swipeMove, false);
				self.addEventListener((touchable) ? 'touchend' : 'mouseup', swipeEnd, false);

				if (options.status) options.status.call($self, event, phase, direction, distance);
			}

			function swipeMove(event) {
				if (phase === END) return;
				phase = MOVE;
				validate(event);
				//todo implement page scrolling
				if (direction === LEFT || direction === RIGHT)
					event.preventDefault();
				if (options.status) options.status.call($self, event, phase, direction, distance);
			}

			function swipeEnd(event) {
				phase = END;
				if (options.status) options.status.call($self, event, phase, direction, distance);
			}

			function swipeCancel(event) {
				phase = CANCEL;
				if (options.status) options.status.call($self, event, phase);
				start = {
					x: 0,
					y: 0
				}, end = {
					x: 0,
					y: 0
				}, delta = {
					x: 0,
					y: 0
				}, distance = {
					x: 0,
					y: 0
				}, direction = undefined, touches = 0;
			}

			self.addEventListener((touchable) ? 'touchstart' : 'mousedown', swipeStart, false);
			self.addEventListener('touchcancel', swipeCancel, false);
		});
	};

	//---

	Yaex.DOM.Function.visible = function (visibility) {
		// return this.each(function (index, item) {
		return this.each(function () {
			var yEl = Yaex.DOM(this);
			yEl.css('visibility', visibility ? '' : 'hidden');
		});
	};

	//---

	Yaex.DOM.Function.resizeText = function (value) {
		// return this.each(function (index, item) {
		return this.each(function () {
			var yEl = Yaex.DOM(this);

			var current = yEl.html();

			//don't bother if the text we're setting is the same as the current contents
			if (value == current) return;

			//set the content so we get something for the height
			yEl.html('&nbsp;');

			//remove any previous font-size from style attribute
			yEl.css('font-size', '');

			var w = yEl.width();
			var h = yEl.height();

			var fontStr = yEl.css('font-size');
			var fontNumStr = fontStr.replace(/[a-z ]/gi, '');
			var fontSize = parseFloat(fontNumStr);

			var fontSuffix = fontStr.split(fontNumStr).join('');

			yEl.html(value);

			do {
				yEl.css('font-size', fontSize + fontSuffix);
				fontSize -= .5;
			} while ((yEl.width() > w || yEl.height() > h) && fontSize > 0);
		});
	};

	//---

})(Yaex.DOM);

//---


/**
 * DOM.Gesture - Cross browser gesture event implementation using Yaex.DOM's API
 *
 *
 * @depends: Yaex.js | Core, DOM, Selector, Event
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	function parentIfText(node) {
		return 'tagName' in node ? node : node.parentNode;
	}

	if (Yaex.UserAgent.OS.iOS) {
		var gesture = new Object;
		var gestureTimeout;

		Yaex.DOM(document).bind('gesturestart', function (e) {
			var now = Yaex.Now;
			var delta = now - (gesture.last || now);
			gesture.target = parentIfText(e.target);
			gestureTimeout && clearTimeout(gestureTimeout);
			gesture.e1 = e.scale;
			gesture.last = now;
		}).bind('gesturechange', function (e) {
			gesture.e2 = e.scale;
		}).bind('gestureend', function (e) {
			if (gesture.e2 > 0) {
				Math.abs(gesture.e1 - gesture.e2) !== 0 && 
					Yaex.DOM(gesture.target).trigger('pinch') && 
					Yaex.DOM(gesture.target).trigger('pinch' + (gesture.e1 - gesture.e2 > 0 ? 'In' : 'Out'));
				gesture.e1 = gesture.e2 = gesture.last = 0;
			} else if ('last' in gesture) {
				gesture = {};
			}
		});
		
		('pinch pinchIn pinchOut').split(' ').forEach(function (event) {
			Yaex.DOM.Function[event] = function (callback) {
				return this.bind(event, callback);
			};
		});
	}

	//---

})(Yaex.DOM);

//---


/**
 * DOM.Press - Cross browser press event implementation using Yaex.DOM's API
 *
 *
 * @depends: Yaex.js | Core, DOM, Selector, Event
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	// Yaex.UserAgent.Features.Touch = !(typeof window.ontouchstart === 'undefined');

	var ghostsLifeTime = 1000;

	var normalizeArgs = function (args) {
		var callback,
			selector;

		if (Yaex.Global.isFunction(args[0])) {
			callback = args[0];
		} else {
			selector = args[0];
			callback = args[1];
		}

		return [selector, callback];
	};

	if (Yaex.UserAgent.Features.Touch) {
		var ghosts = [],
			callbacks = [],
			handlers = [],
			doc = Yaex.DOM(document);

		var removeGhosts = function () {
			ghosts.splice(0, 2);
		};

		var handleGhosts = function (e) {
			for (var i = 0, l = ghosts.length; i < l; i += 2) {
				if (Math.abs(e.pageX - ghosts[i]) < 25 && Math.abs(e.pageY - ghosts[i + 1]) < 25) {
					e.stopPropagation();
					e.preventDefault();
				}
			}
		};

		doc.on('click', handleGhosts);

		Yaex.DOM.Function.onpress = function () {
			// Passing empty selectors, empty arguments list or a document node cause bugs on android/iOS
			// Just to be on the safe side allowing only element and document fragment nodes to be used
			if (!arguments.length || !this.length || !this[0].nodeType || (this[0].nodeType !== 1 && this[0].nodeType !== 11)) {
				return;
			}

			var touches = [],
				that = this;

			var args = normalizeArgs(arguments);

			var handleTouchStart = function (e) {
				e.stopPropagation();
				var coords = e.touches ? e.touches[0] : e; // Android weirdness fix

				touches[0] = coords.pageX;
				touches[1] = coords.pageY;

				doc.on('touchmove.onpress', handleTouchMove);

				args[0] ? that.on('touchend.onpress', args[0], handleTouchEnd) : that.on('touchend.onpress', handleTouchEnd);
			};

			var handleTouchMove = function (e) {
				if (Math.abs(e.touches[0].pageX - touches[0]) > 10 || Math.abs(e.touches[0].pageY - touches[1]) > 10) {
					resetHandlers();
				}
			};

			var handleTouchEnd = function (e) {
				resetHandlers();

				args[1].call(this, e);

				if (e.type === 'touchend') {
					ghosts.push(touches[0], touches[1]);
					window.setTimeout(removeGhosts, ghostsLifeTime);
				}
			};

			var resetHandlers = function () {
				doc.off('touchmove.onpress', handleTouchMove);
				args[0] ? that.off('touchend.onpress', args[0], handleTouchEnd) : that.off('touchend.onpress', handleTouchEnd);
			};

			callbacks.push(args[1]);

			handlers.push(handleTouchStart);

			if (args[0]) {
				this.on('touchstart.onpress', args[0], handleTouchStart);
				// this.on('click', args[0], handleTouchStart);
				this.on('press.onpress', args[0], args[1]);
			} else {
				this.on('touchstart.onpress', handleTouchStart);
				// this.on('click', handleTouchStart);
				this.on('press.onpress', args[1]);
			}
		};

		Yaex.DOM.Function.offpress = function () {
			var args = normalizeArgs(arguments),
				i;

			if (args[1]) {
				i = callbacks.indexOf(args[1]);

				if (i < 0) { // Something went terribly wrong and there is no associated callback/handler
					return;
				}

				if (args[0]) {
					this.off('touchstart.onpress', args[0], handlers[i]);
					//this.off('click.onpress', args[0], handlers[i]);
					this.off('press.onpress', args[0], args[1]);
				} else {
					this.off('touchstart.onpress', handlers[i]);
					//this.off('click.onpress', handlers[i]);
					this.off('press.onpress', args[1]);
				}
				callbacks.splice(i, 1);
				handlers.splice(i, 1);
			} else {
				if (args[0]) {
					this.off('touchstart.onpress', args[0]);
					//this.off('click.onpress', args[0]);
					this.off('press.onpress', args[0]);
				} else {
					this.off('touchstart.onpress');
					//this.off('click.onpress');
					this.off('press.onpress');
				}
			}
		}
	} else {
		Yaex.DOM.Function.onpress = function () {
			var args = normalizeArgs(arguments);
			if (args[0]) {
				this.on('click.onpress', args[0], args[1]);
				this.on('press.onpress', args[0], args[1]);
			} else {
				this.on('click.onpress', args[1]);
				this.on('press.onpress', args[1]);
			}
		};
		Yaex.DOM.Function.offpress = function () {
			var args = normalizeArgs(arguments);
			args[0] ? this.off('.onpress', args[0], args[1]) : this.off('.onpress', args[1]);
		};
	}

	//---

})(Yaex.DOM);

//---


/**
 * DOM.Shake - Cross browser shake event implementation using Yaex.DOM's API
 *
 *
 * @depends: Yaex.js | Core, DOM, Selector, Event
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	if (typeof window.DeviceMotionEvent !== 'undefined') {
		Yaex.DOM.Function.onshake = function (callb, sens) {
			// Shake sensitivity (a lower number is more sensitive)
			var sensitivity = sens || 20,
				checkDelay = 150,
				callbackDelay = 2500;

			// Position variables
			var x1 = 0,
				y1 = 0,
				z1 = 0,
				x2 = 0,
				y2 = 0,
				z2 = 0;

			var checkDeviceMotion = function () {
				var change = Math.abs((x1 - x2) + (y1 - y2) + (z1 - z2));

				// Update new position
				x2 = x1;
				y2 = y1;
				z2 = z1;

				if (change > sensitivity) {
					callb.call(window);
					setTimeout(checkDeviceMotion, callbackDelay);
				} else {
					setTimeout(checkDeviceMotion, checkDelay);
				}
			};

			// Listen to motion events and update the position
			window.addEventListener('devicemotion', function (e) {
				x1 = e.accelerationIncludingGravity.x;
				y1 = e.accelerationIncludingGravity.y;
				z1 = e.accelerationIncludingGravity.z;
			}, false);

			// Periodically check the position and fire
			// if the change is greater than the sensitivity
			checkDeviceMotion();
		};
	} else {
		Yaex.DOM.Function.onshake = function () {
			//...
		};
	}

	//---

})(Yaex.DOM);

//---



/**
 * DOM.Touch - Cross browser touch event implementation using Yaex.DOM's API
 *
 *
 * @depends: Yaex.js | Core, DOM, Selector, Event
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	var touch = new Object;
	var touchTimeout;
	var tapTimeout;
	var swipeTimeout;
	var longTapTimeout;
	var longTapDelay = 750;
	var gesture;

	function swipeDirection(x1, x2, y1, y2) {
		return Math.abs(x1 - x2) >= Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
	}

	function longTap() {
		longTapTimeout = null;

		if (touch.last) {
			touch.el.trigger('longTap');
			touch = new Object;
		}
	}

	function cancelLongTap() {
		if (longTapTimeout) {
			clearTimeout(longTapTimeout);
		}

		longTapTimeout = null;
	}

	function cancelAll() {
		if (touchTimeout) clearTimeout(touchTimeout);
		if (tapTimeout) clearTimeout(tapTimeout);
		if (swipeTimeout) clearTimeout(swipeTimeout);
		if (longTapTimeout) clearTimeout(longTapTimeout);
		touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null;
		touch = new Object;
	}

	function isPrimaryTouch(event) {
		return (event.pointerType == 'touch' || event.pointerType == event.MSPOINTER_TYPE_TOUCH) && event.isPrimary;
	}

	function isPointerEventType(e, type) {
		return (e.type == 'pointer' + type || e.type.toLowerCase() == 'mspointer' + type);
	}

	Yaex.DOM(document).ready(function () {
		var now;
		var delta;
		var deltaX = 0;
		var deltaY = 0;
		var firstTouch;
		var _isPointerType;

		if ('MSGesture' in window) {
			gesture = new MSGesture();
			gesture.target = document.body;
		}

		Yaex.DOM(document)
			.bind('MSGestureEnd', function (e) {
				var swipeDirectionFromVelocity = e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
				if (swipeDirectionFromVelocity) {
					touch.el.trigger('swipe');
					touch.el.trigger('swipe' + swipeDirectionFromVelocity);
				}
			})
			.on('touchstart MSPointerDown pointerdown', function (e) {
				if ((_isPointerType = isPointerEventType(e, 'down')) && !isPrimaryTouch(e)) return;
				
				firstTouch = _isPointerType ? e : e.touches[0];

				if (e.touches && e.touches.length === 1 && touch.x2) {
					// Clear out touch movement data if we have it sticking around
					// This can occur if touchcancel doesn't fire due to preventDefault, etc.
					touch.x2 = undefined;
					touch.y2 = undefined;
				}

				now = Date.now();
				delta = now - (touch.last || now);
				touch.el = Yaex.DOM('tagName' in firstTouch.target ? firstTouch.target : firstTouch.target.parentNode);
				touchTimeout && clearTimeout(touchTimeout);
				touch.x1 = firstTouch.pageX;
				touch.y1 = firstTouch.pageY;
				if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
				touch.last = now;
				longTapTimeout = setTimeout(longTap, longTapDelay);
				// adds the current touch contact for IE gesture recognition
				if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
			})
			.on('touchmove MSPointerMove pointermove', function (e) {
				if ((_isPointerType = isPointerEventType(e, 'move')) && !isPrimaryTouch(e)) return;
				firstTouch = _isPointerType ? e : e.touches[0];
				cancelLongTap();
				touch.x2 = firstTouch.pageX;
				touch.y2 = firstTouch.pageY;

				deltaX += Math.abs(touch.x1 - touch.x2);
				deltaY += Math.abs(touch.y1 - touch.y2);
			})
			.on('touchend MSPointerUp pointerup', function (e) {
				if ((_isPointerType = isPointerEventType(e, 'up')) && !isPrimaryTouch(e)) return;
				cancelLongTap();

				// swipe
				if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
					(touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))

					swipeTimeout = setTimeout(function () {
						touch.el.trigger('swipe');
						touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)));
						touch = new Object;
					}, 0);

				// normal tap
				else if ('last' in touch)
				// don't fire tap when delta position changed by more than 30 pixels,
				// for instance when moving to a point and back to origin
					if (deltaX < 30 && deltaY < 30) {
						// delay by one tick so we can cancel the 'tap' event if 'scroll' fires
						// ('tap' fires before 'scroll')
						tapTimeout = setTimeout(function () {

							// trigger universal 'tap' with the option to cancelTouch()
							// (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
							var event = Yaex.DOM.Event('tap');
							event.cancelTouch = cancelAll;
							touch.el.trigger(event);

							// trigger double tap immediately
							if (touch.isDoubleTap) {
								if (touch.el) {
									touch.el.trigger('doubleTap');
								}

								touch = new Object;
							}

							// trigger single tap after 250ms of inactivity
							else {
								touchTimeout = setTimeout(function () {
									touchTimeout = null;
									if (touch.el) {
										touch.el.trigger('singleTap');
									}

									touch = new Object;
								}, 250);
							}
						}, 0);
					} else {
						touch = new Object;
					}

				deltaX = deltaY = 0;

			})
		// when the browser window loses focus,
		// for example when a modal dialog is shown,
		// cancel all ongoing events
		.on('touchcancel MSPointerCancel pointercancel', cancelAll);

		// scrolling the window indicates intention of the user
		// to scroll, not tap or swipe, so cancel all ongoing events
		Yaex.DOM(window).on('scroll', cancelAll);
	});

	('swipe swipeLeft swipeRight swipeUp swipeDown doubleTap tap singleTap longTap').split(' ').forEach(function (event) {
		Yaex.DOM.Function[event] = function (callback) {
			return this.bind(event, callback);
		};
	});

	//---

})(Yaex.DOM);

//---



/**
 * DOM.Stack - Stack implementation using Yaex.DOM's API
 *
 *
 * @depends: Yaex.js | Core, DOM, DOM.Selector DOM.Events
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {
	
	'use strict';

	Yaex.DOM.Function.end = function () {
		return this.prevObject || Yaex.DOM(null);
	};

	Yaex.DOM.Function.andSelf = function () {
		return this.add(this.prevObject || Yaex.DOM(null));
	};

	('filter add not eq first last find closest ' +
		'parents parent children siblings').split(' ').forEach(function (property) {
		var callback = Yaex.DOM.Function[property];
		
		Yaex.DOM.Function[property] = function () {
			var ret = callback.apply(this, arguments);
			ret.prevObject = this;
			return ret;
		};
	});

})(Yaex.DOM);

//---

/**
 * Assets - Clear iOS <IMG> implementation using Yaex.DOM's API [DOM]
 *
 *
 * @depends: Yaex.js | Core, DOM
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {
	
	'use strict';

	var cache = new Array;
	var timeout;

	Yaex.DOM.Function.remove = function () {
		return this.each(function () {
			if (this.parentNode) {
				if (this.tagName === 'IMG') {
					cache.push(this);

					this.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

					if (timeout) {
						clearTimeout(timeout);
					}

					timeout = setTimeout(function () {
						cache = [];
					}, 60000);
				}
				
				this.parentNode.removeChild(this);
			}
		});
	};

	//---

})(Yaex.DOM);

//---


/**
 * InternetExplorer - Microsoft's Internet Explorer fix/support using Yaex's API [Support]
 *
 *
 * @depends: Yaex.js | Core
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function (window, undefined) {

	// __proto__ doesn't exist on IE<11, so redefine
	// the X function to use object extension instead
	if (!('__proto__' in {})) {
		Yaex.Utility.Extend(Yaex.DOM.YaexDOM, {
			Y: function (dom, selector) {
				dom = dom || [];
				Yaex.Utility.Extend(dom, Yaex.DOM.Function);
				dom.selector = selector || '';
				dom._Y_ = true;
				// dom.uid = 'YAEX' + Yaex.Now;
				return dom;
			},

			// This is a kludge but works
			isY: function (object) {
				return Yaex.Global.Type(object) === 'array' && '_Y_' in object;
			}
		});
	}

	// getComputedStyle shouldn't freak out when called
	// without a valid element as argument
	try {
		getComputedStyle(undefined);
	} catch (e) {
		var nativeGetComputedStyle = getComputedStyle;
		window.getComputedStyle = function (element) {
			try {
				return nativeGetComputedStyle(element);
			} catch (e) {
				return null;
			}
		};
	}

})(this);

//---



/**
 * IOS3 - Apple's iOS3 fix/support using Yaex's API [Support]
 *
 *
 * @depends: Yaex.js | Core
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function (undefined) {

	// Fix for iOS 3.2
	if (String.prototype.trim === undefined) {
		String.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/g, '');
		}
	}

	// For iOS 3.x
	// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
	if (Array.prototype.reduce === undefined) {
		Array.prototype.reduce = function (callback) {
			if (this === void 0 || this === null) {
				throw new TypeError();
			}

			var t = Object(this),
				len = t.length >>> 0,
				k = 0,
				accumulator;

			if (typeof callback != 'function') throw new TypeError()
			if (len == 0 && arguments.length == 1) throw new TypeError()

			if (arguments.length >= 2) {
				accumulator = arguments[1]
			} else {
				do {
					if (k in t) {
						accumulator = t[k++];
						break;
					}

					if (++k >= len) {
						throw new TypeError();
					}
				} while (true);

				while (k < len) {
					if (k in t) {
						accumulator = callback.call(undefined, accumulator, t[k], k, t);
					}

					k++;
				}
			}

			return accumulator;
		}
	}

})();

//---



/**
 * Cordova - Apache's Cordova support using Yaex's API [Support]
 *
 *
 * @depends: Yaex.js | Core, DOM, Selector, Event
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	window.cordova = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

	if (window.cordova === false) {
		Yaex.DOM(function () {
			Yaex.DOM(document).trigger('deviceready');
		});
	}

})(Yaex.DOM);

//---


