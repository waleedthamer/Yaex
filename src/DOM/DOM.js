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
