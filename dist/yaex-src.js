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




('Yaex', function () {
	'use strict';
	var undefined;
	var key;
	var $;
	var Yaex = {};
	var classList;
	var emptyArray = [];
	var slice = emptyArray.slice;
	var filter = emptyArray.filter;
	var document = window.document;
	var docelem = document.documentElement;
	var elementDisplay = {};
	var classCache = {};
	var fragmentReplacement = /^\s*<(\w+|!)[^>]*>/;
	var singleTagReplacement = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
	var tagExpanderReplacement = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig;
	var readyReplacement = /complete|loaded|interactive/;
	var simpleSelectorReplacement = /^[\w-]*$/;
	var rootNodeRE = /^(?:body|html)$/i;
	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	// var rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/;
	// Special attributes that should be get/set via method calls
	var methodAttributes = [
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

	var table = document.createElement('table');

	var tableRow = document.createElement('tr');

	var containers = {
		'tr': document.createElement('tbody'),
		'tbody': table,
		'thead': table,
		'tfoot': table,
		'td': tableRow,
		'th': tableRow,
		'*': document.createElement('div')
	};

	// [[Class]] -> type pairs
	var class2type = {};
	// List of deleted data cache ids, so we can reuse them
	var core_deletedIds = [];
	var core_version = '0.10-dev';
	var core_build = '1243';
	// Save a reference to some core methods
	var core_concat = emptyArray.concat;
	var core_push = emptyArray.push;
	var core_indexOf = emptyArray.indexOf;
	var core_toString = class2type.toString;
	var core_hasOwn = class2type.hasOwnProperty;
	var core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
	var core_strundefined = typeof undefined;
	var camelize;
	var Unique;
	var temparent = document.createElement('div');
	var prop_map = {
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
	// Used for splitting on whitespace
	var core_rnotwhite = /\S+/g;
	// var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	// rtagName = /<([\w:]+)/,
	// rhtml = /<|&#?\w+;/,
	// rscriptType = /^$|\/(?:java|ecma)script/i,
	var rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;

	Yaex.Matches = function (element, selector) {
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
			(parent = temparent).appendChild(element);
		}

		match = ~Yaex.QSA(parent, selector).indexOf(element);

		temp && temparent.removeChild(element);

		return match;
	};

	function type(obj) {
		if (obj == null) {
			return String(obj);
		}

		// if (typeof obj === 'object') {
		// 	return 'object';
		// } else if (typeof obj === 'function') {
		// 	return 'function';
		// } else if (class2type[core_toString.call(obj)]) {
		// 	return class2type[core_toString.call(obj)];
		// } else {
		// 	return typeof obj;
		// }

		return typeof obj === 'object' || typeof obj === 'function' ?
			class2type[core_toString.call(obj)] || 'object' :
			typeof obj;
	}

	var varDump = function ($array, $level) {
		var $dumped_text = '';

		if (!$level) {
			$level = 0;
		}

		// The padding given at the beginning of the line.
		var $level_padding = ' ';

		for (var $j = 0; $j < $level + 1; $j++) {
			// $level_padding += '\t';
			// $level_padding += ' ';
			$level_padding += ' ';
		}

		// Array/Hashes/Objects
		if (typeof ($array) === 'object') {
			for (var $item in $array) {
				var $value = $array[$item];

				// If it is an array,
				if (typeof ($value) === 'object') {
					$dumped_text += $level_padding + "'" + $item + "' ...\n";
					$dumped_text += varDump($value, $level + 1);
				} else {
					$dumped_text += $level_padding + "'" + $item + "' => \"" + $value + "\"\n";
				}
			}
			// Stings/Chars/Numbers etc.
		} else {
			$dumped_text = '===>' + $array + '<===(' + typeof ($array) + ')';
		}

		return $dumped_text;
	};


	function isFunction(obj) {
		return type(obj) === 'function';
	}

	function isWindow(obj) {
		return obj != null && obj === obj.window;
	}

	function isDocument(obj) {
		return obj !== null && obj.nodeType === obj.DOCUMENT_NODE;
	}

	function isObject(obj) {
		return type(obj) === 'object';
	}

	function isUndefined(obj) {
		return type(obj) === 'undefined';
	}

	function isPlainObject(obj) {
		// return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;

		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if (type(obj) !== 'object' || obj.nodeType || isWindow(obj)) {
			return false;
		}

		// Support: Firefox <20
		// The try/catch suppresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
		try {
			if (obj.constructor && !core_hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
				return false;
			}
		} catch (e) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	}

	function isNumeric(obj) {
		return !isNaN(parseFloat(obj)) && isFinite(obj);
	}

	function isArray(value) {
		return value instanceof Array;
	}

	function likeArray(obj) {
		return typeof obj.length === 'number';
	}

	function isEmptyObject(obj) {
		var name;

		for (name in obj) {
			return false;
		}

		return true;
	}

	function inArray(el, arr, x) {
		return arr == null ? -1 : emptyArray.indexOf.call(arr, el, x);
	};

	function isString(obj) {
		return type(obj) === 'string';
	}

	function Error(msg) {
		console.error(msg);
		throw new Error(msg);
	}

	function compact(array) {
		return filter.call(array, function (item) {
			return item !== null;
		});
	}

	function flatten(array) {
		return array.length > 0 ? $.fn.concat.apply([], array) : array;
	}

	function delay($milliseconds) {
		$milliseconds = $milliseconds * 1000;

		var $start = new Date().getTime();

		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - $start) > $milliseconds) {
				break;
			}
		}
	}

	camelize = function (str) {
		return str.replace(/-+(.)?/g, function (match, chr) {
			return chr ? chr.toUpperCase() : '';
		});
	};

	function dasherize(str) {
		return str.replace(/::/g, '/')
			.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
			.replace(/([a-z\d])([A-Z])/g, '$1_$2')
			.replace(/_/g, '-')
			.toLowerCase();
	}

	Unique = function (array) {
		return filter.call(array, function (item, idx) {
			return array.indexOf(item) === idx;
		});
	};

	function classRE(name) {
		return name in classCache ?
			classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'));
	}

	// function maybeAddPx(name, value) {
	// 	return (typeof value === "number" && !$.CSS_Number[dasherize(name)]) ? value + "px" : value;
	// }

	function defaultDisplay(nodeName) {
		var element, display;
		if (!elementDisplay[nodeName]) {
			element = document.createElement(nodeName);
			document.body.appendChild(element);
			//display = getComputedStyle(element, '').getPropertyValue("display");
			display = getStyles(element).getPropertyValue('display');
			element.parentNode.removeChild(element);
			display === "none" && (display = "block");
			elementDisplay[nodeName] = display;
		}
		return elementDisplay[nodeName];
	}

	function children(element) {
		return 'children' in element ?
			slice.call(element.children) :
			$.map(element.childNodes, function (node) {
				if (node.nodeType === 1)
					return node;
			});
	}

	// `Yaex.Fragment` takes a html string and an optional tag name
	// to generate DOM nodes nodes from the given html string.
	// The generated DOM nodes are returned as an array.
	// This function can be overriden in plugins for example to make
	// it compatible with browsers that don't support the DOM fully.
	Yaex.Fragment = function (html, name, properties) {
		var dom, nodes, container;

		// A special case optimization for a single tag
		if (singleTagReplacement.test(html))
			dom = $(document.createElement(RegExp.$1));

		if (!dom) {
			if (html.replace)
				html = html.replace(tagExpanderReplacement, "<$1></$2>");
			if (name === undefined)
				name = fragmentReplacement.test(html) && RegExp.$1;
			if (!(name in containers))
				name = '*';

			container = containers[name];
			container.innerHTML = '' + html;
			dom = $.each(slice.call(container.childNodes), function () {
				container.removeChild(this);
			});
		}

		if (isPlainObject(properties)) {
			nodes = $(dom);
			$.each(properties, function (key, value) {
				if (methodAttributes.indexOf(key) > -1)
					nodes[key](value);
				else
					nodes.attr(key, value);
			});
		}

		return dom;
	};

	// `Yaex.Y` swaps out the prototype of the given `dom` array
	// of nodes with `$.fn` and thus supplying all the Yaex functions
	// to the array. Note that `__proto__` is not supported on Internet
	// Explorer. This method can be overriden in plugins.
	Yaex.Y = function (dom, selector) {
		dom = dom || [];

		dom.__proto__ = $.fn;
		dom.selector = selector || '';

		return dom;
	};

	// `Yaex.isYaex` should return `true` if the given object is a Yaex
	// collection. This method can be overriden in plugins.
	Yaex.isYaex = function (object) {
		return object instanceof Yaex.Y;
	};

	// `Yaex.init` is Yaex's counterpart to jQuery's `$.fn.init` and
	// takes a CSS selector and an optional context (and handles various
	// special cases).
	// This method can be overriden in plugins.
	Yaex.init = function (selector, context) {
		var dom;
		// If nothing given, return an empty Yaex collection
		if (!selector) {
			return Yaex.Y();
		}

		if (isString(selector)) {
			// Optimize for string selectors
			selector = selector.trim();

			// If it's a html Fragment, create nodes from it
			// Note: In both Chrome 21 and Firefox 15, DOM error 12
			// is thrown if the Fragment doesn't begin with <
			// if (selector[0] === '<' && fragmentReplacement.test(selector)) {
			if (selector[0] === '<' && selector[selector.length - 1] === '>' && fragmentReplacement.test(selector) && selector.length >= 3) {
				dom = Yaex.Fragment(selector, RegExp.$1, context);
				selector = null;
			} else if (context !== undefined) {
				// If there's a context, create a collection on that context first, and select
				// nodes from there
				return $(context).find(selector);
			} else {
				// If it's a CSS selector, use it to select nodes.
				dom = Yaex.QSA(document, selector);
			}
			// If a function is given, call it when the DOM is ready
		} else if (isFunction(selector)) {
			return $(document).ready(selector);
			// If a Yaex collection is given, just return it
		} else if (Yaex.isYaex(selector)) {
			return selector;
		} else {
			// normalize array if an array of nodes is given
			if (isArray(selector)) {
				dom = compact(selector);
				// Wrap DOM nodes.
			} else if (isObject(selector)) {
				dom = [selector];
				selector = null;
				// If it's a html Fragment, create nodes from it
			} else if (fragmentReplacement.test(selector)) {
				dom = Yaex.Fragment(selector.trim(), RegExp.$1, context);
				selector = null;
				// If there's a context, create a collection on that context first, and select
				// nodes from there
			} else if (context !== undefined) {
				return $(context).find(selector);
				// And last but no least, if it's a CSS selector, use it to select nodes.
			} else {
				dom = Yaex.QSA(document, selector);
			}
		}

		// create a new Yaex collection from the nodes found
		return Yaex.Y(dom, selector);
	};

	//

	// Yaex.constructor = Yaex;

	//

	// `$` will be the base `Yaex` object. When calling this
	// function just call `Yaex.init, which makes the implementation
	// details of selecting nodes and creating Yaex collections
	// patchable in plugins.
	$ = function (selector, context) {
		return Yaex.init(selector, context);
	};

	function Extend(target, source, deep) {
		for (key in source) {
			if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
				if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
					target[key] = {};
				}

				if (isArray(source[key]) && !isArray(target[key])) {
					target[key] = [];
				}

				Extend(target[key], source[key], deep);

			} else if (source[key] !== undefined) {
				target[key] = source[key];
			}
		}
	}

	// results is for internal usage only

	function MakeArray(arr, results) {
		var ret = results || [];

		if (arr !== null) {
			if (isArraylike(Object(arr))) {
				$.merge(ret,
					isString(arr) ? [arr] : arr
				);
			} else {
				core_push.call(ret, arr);
			}
		}

		return ret;
	}

	function Merge(first, second) {
		var l = second.length,
			i = first.length,
			j = 0;

		if (typeof l === "number") {
			for (; j < l; j++) {
				first[i++] = second[j];
			}
		} else {
			while (second[j] !== undefined) {
				first[i++] = second[j++];
			}
		}

		first.length = i;

		return first;
	}

	// Copy all but undefined properties from one or more
	// objects to the `target` object.
	$._Extend = function (target) {
		var deep;
		var args = slice.call(arguments, 1);

		if (typeof target === 'boolean') {
			deep = target;
			target = args.shift();
		}

		args.forEach(function (arg) {
			Extend(target, arg, deep);
		});

		return target;
	};

	$.Extend = function () {
		var options;
		var name;
		var src;
		var copy;
		var copyIsArray;
		var clone;
		var target = arguments[0] || {};
		var i = 1;
		var length = arguments.length;
		var deep = false;

		// Handle a deep copy situation
		if (typeof target === "boolean") {
			deep = target;
			target = arguments[1] || {};
			// skip the boolean and the target
			i = 2;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if (typeof target !== "object" && !isFunction(target)) {
			target = {};
		}

		// extend Yaex itself if only one argument is passed
		if (length === i) {
			target = this;
			--i;
		}

		for (; i < length; i++) {
			// Only deal with non-null/undefined values
			if ((options = arguments[i]) !== null) {
				// Extend the base object
				for (name in options) {
					src = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if (deep && copy && ($.isPlainObject(copy) || (copyIsArray = $.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && $.isArray(src) ? src : [];

						} else {
							clone = src && $.isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = $.Extend(deep, clone, copy);

						// Don't bring in undefined values
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}

		// Return the modified object
		return target;
	};

	// `Yaex.QSA` is Yaex's CSS selector implementation which
	// uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
	// This method can be overriden in plugins.
	Yaex.QSA = function (element, selector) {
		var found,
			maybeID = selector[0] == '#',
			maybeClass = !maybeID && selector[0] == '.',
			nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
			isSimple = simpleSelectorReplacement.test(nameOnly);
		return (isDocument(element) && isSimple && maybeID) ?
			((found = element.getElementById(nameOnly)) ? [found] : []) :
			(element.nodeType !== 1 && element.nodeType !== 9) ? [] :
			slice.call(
				isSimple && !maybeID ?
				maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
				element.getElementsByTagName(selector) : // Or a tag
				element.querySelectorAll(selector) // Or it's not simple, and we need to query all
		);
	};

	function filtered(nodes, selector) {
		return selector == null ? $(nodes) : $(nodes).filter(selector);
	}

	function contains(parent, node) {
		return parent !== node && parent.contains(node);
	}

	function funcArg(context, arg, idx, payload) {
		return isFunction(arg) ? arg.call(context, idx, payload) : arg;
	}

	function setAttribute(node, name, value) {
		value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
	}

	// access className property while respecting SVGAnimatedString

	function className(node, value) {
		var klass = node.className;
		var svg = klass && klass.baseVal !== undefined;

		if (value === undefined) {
			return svg ? klass.baseVal : klass;
		}

		svg = svg ? (klass.baseVal = value) : (node.className = value);
	}

	// "true"  => true
	// "false" => false
	// "null"  => null
	// "42"	=> 42
	// "42.5"  => 42.5
	// "08"	=> "08"
	// JSON	=> parse if valid
	// String  => self

	function DeserializeValue(value) {
		var num;
		try {
			return value ?
				value == "true" ||
				(value == "false" ? false :
				value == "null" ? null : !isNaN(num = Number(value)) && (num + '') === value ? num :
				/^[\[\{]/.test(value) ? $.parseJSON(value) :
				value) : value;
		} catch (e) {
			return value;
		}
	}

	$.trim = function (str) {
		return str == null ? "" : String.prototype.trim.call(str);
	};

	$.ArrayToObject = function ($array, $data) {
		var $_tmp = {};

		for (var $i = 0; $i < $array.length; ++$i) {
			if ($array[i] !== undefined) {
				//$_tmp[$i] = $arr[$i];
				if ($data !== null) {
					$_tmp[$array[$i]] = $data;
				} else {
					$_tmp[$array[$i]] = null;
				}
			}
		}

		return $_tmp;
	};

	$.InToArray = function ($array, $data) {
		var $_tmp = [];

		for (var $i = 0; $i < $array.length; ++$i) {
			if ($array[i] !== undefined) {
				//$_tmp[$i] = $arr[$i];
				if ($data !== null) {
					//$_tmp['\'' + $array[$i] + '\''] = $data;
					$_tmp[$array[$i]] = $data;
				} else {
					$_tmp[$array[$i]] = null;
				}
			}
		}

		return $_tmp;
	};

	$.ObjectToArray = function ($object) {
		var $_tmp = [];

		for (var $i in $object) {
			if ($object.hasOwnProperty($i)) {
				$_tmp.push($object[$i]);
			}
		}

		return $_tmp;
	};

	$.type = type;
	$.isUndefined = isUndefined;
	$.isFunction = isFunction;
	$.isWindow = isWindow;
	$.isArray = isArray;
	$.isObject = isObject;
	$.isNumeric = isNumeric;
	$.isPlainObject = isPlainObject;
	$.Error = Error;
	$.isEmptyObject = isEmptyObject;
	$.inArray = inArray;
	$.isString = isString;
	$.GUID = 0;
	$.camelCase = camelize;
	$.core_version = core_version;
	$.version = core_version;
	$.core_deletedIds = core_deletedIds;
	$.class2type = class2type;
	$.core_concat = core_concat;
	$.core_push = core_push;
	$.core_slice = slice;
	$.core_indexOf = core_indexOf;
	$.core_toString = core_toString;
	$.core_hasOwn = core_hasOwn;
	$.core_rnotwhite = core_rnotwhite;
	$.delay = delay;
	$.vardump = varDump;
	$.getWindow = getWindow;
	$.contains = contains;
	$.randomNumber = randomNumber;
	$.makeArray = MakeArray;
	$.merge = Merge;
	$.emptyArray = emptyArray;
	$.timers = [];

	$.location = window.location;

	$.Globals = {};
	$.Now = Date.now;
	$.UserAgent = {};
	$.Browser = {};

	// Module Compatibility
	$.Support = {};
	$.expr = {};
	$.UUID = 0;

	$.map = function (elements, callback) {
		var value, values = [],
			i, key;
		if (likeArray(elements))
			for (i = 0; i < elements.length; i++) {
				value = callback(elements[i], i);
				if (value != null)
					values.push(value);
			} else
				for (key in elements) {
					value = callback(elements[key], key);
					if (value != null)
						values.push(value);
				}

		return flatten(values);
	};

	$.each = function (elements, callback) {
		var i;
		var key;

		if (isArraylike(elements)) {
			for (i = 0; i < elements.length; i++) {
				if (callback.call(elements[i], i, elements[i]) === false) {
					return elements;
				}
			}
		} else {
			for (key in elements) {
				if (callback.call(elements[key], key, elements[key]) === false) {
					return elements;
				}
			}
		}

		return elements;
	};

	$.grep = function (elements, callback) {
		return filter.call(elements, callback);
	};

	if (window.JSON) {
		$.ParseJSON = JSON.parse;
	}

	// Populate the class2type map
	$.each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function (i, name) {
		class2type['[object ' + name + ']'] = name.toLowerCase();
	});

	function isArraylike(obj) {
		var length = obj.length,
			type = $.type(obj);

		if ($.isWindow(obj)) {
			return false;
		}

		if (obj.nodeType === 1 && length) {
			return true;
		}

		return type === "array" || type !== "function" &&
			(length === 0 ||
			typeof length === "number" && length > 0 && (length - 1) in obj);
	}

	//



	//



	//

	// Define methods that will be available on all
	// Yaex collections
	// $.fn = Yaex.init.prototype = Yaex.prototype = {
	$.fn = Yaex.prototype = {
		// Because a collection acts like an array
		// copy over these useful array functions.
		forEach: emptyArray.forEach,
		reduce: emptyArray.reduce,
		push: emptyArray.push,
		sort: emptyArray.sort,
		indexOf: emptyArray.indexOf,
		concat: emptyArray.concat,
		// `map` and `slice` in the jQuery API work differently
		// from their array counterparts
		map: function (fn) {
			return $($.map(this, function (el, i) {
				return fn.call(el, i, el);
			}));
		},
		slice: function () {
			return $(slice.apply(this, arguments));
			// return $.pushStack(slice.apply(this, arguments));
		},
		ready: function (callback) {
			// need to check if document.body exists for IE as that browser reports
			// document ready when it hasn't yet created the body element
			if (readyReplacement.test(document.readyState) && document.body) {
				callback($);
			} else {
				document.addEventListener('DOMContentLoaded', function () {
					callback($);
				}, false);
			}

			return this;
		},
		get: function (num) {
			// return num === undefined ? slice.call(this) : this[num >= 0 ? num : num + this.length];

			return num == null ?
			// Return a 'Clean' array
			this.toArray() :
			// Return just the object
			(num < 0 ? this[this.length + num] : this[num]);
		},
		toArray: function () {
			// return this.get();
			return slice.call(this);
		},
		size: function () {
			return this.length;
		},
		remove: function () {
			return this.each(function () {
				if (this.parentNode != null) {
					this.parentNode.removeChild(this);
				}
			})
		},
		each: function (callback) {
			emptyArray.every.call(this, function (el, idx) {
				return callback.call(el, idx, el) !== false
			})
			return this
		},
		filter: function (selector) {
			if (isFunction(selector))
				return this.not(this.not(selector))
			return $(filter.call(this, function (element) {
				return Yaex.Matches(element, selector)
			}))
		},
		add: function (selector, context) {
			return $(Unique(this.concat($(selector, context))))
		},
		is: function (selector) {
			return this.length > 0 && Yaex.Matches(this[0], selector)
		},
		not: function (selector) {
			var nodes = []
			if (isFunction(selector) && selector.call !== undefined)
				this.each(function (idx) {
					if (!selector.call(this, idx))
						nodes.push(this)
				})
			else {
				var excludes = isString(selector) ? this.filter(selector) :
					(likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
				this.forEach(function (el) {
					if (excludes.indexOf(el) < 0)
						nodes.push(el)
				})
			}
			return $(nodes)
		},
		has: function (selector) {
			return this.filter(function () {
				return isObject(selector) ?
					contains(this, selector) :
					$(this).find(selector).size()
			})
		},
		eq: function (idx) {
			return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1)
		},
		first: function () {
			var el = this[0]
			return el && !isObject(el) ? el : $(el)
		},
		last: function () {
			var el = this[this.length - 1]
			return el && !isObject(el) ? el : $(el)
		},
		find: function (selector) {
			var result, $this = this
			if (typeof selector == 'object')
				result = $(selector).filter(function () {
					var node = this
					return emptyArray.some.call($this, function (parent) {
						return contains(parent, node)
					})
				})
			else if (this.length == 1)
				result = $(Yaex.QSA(this[0], selector))
			else
				result = this.map(function () {
					return Yaex.QSA(this, selector)
				})
			return result
		},
		closest: function (selector, context) {
			var node = this[0],
				collection = false;
			if (typeof selector == 'object')
				collection = $(selector);
			while (node && !(collection ? collection.indexOf(node) >= 0 : Yaex.Matches(node, selector)))
				node = node !== context && !isDocument(node) && node.parentNode;
			return $(node);
		},
		parents: function (selector) {
			var ancestors = [],
				nodes = this;
			while (nodes.length > 0)
				nodes = $.map(nodes, function (node) {
					if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
						ancestors.push(node);
						return node;
					}
				});
			return filtered(ancestors, selector);
		},
		parent: function (selector) {
			return filtered(Unique(this.pluck('parentNode')), selector);
		},
		children: function (selector) {
			return filtered(this.map(function () {
				return children(this);
			}), selector);
		},
		contents: function () {
			return this.map(function () {
				return slice.call(this.childNodes);
			});
		},
		siblings: function (selector) {
			return filtered(this.map(function (i, el) {
				return filter.call(children(el.parentNode), function (child) {
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
			return $.map(this, function (el) {
				return el[property];
			});
		},
		show: function () {
			return this.each(function () {
				this.style.display == "none" && (this.style.display = '')
				if (getStyles(this).getPropertyValue("display") == "none")
					this.style.display = defaultDisplay(this.nodeName)
			})
		},
		replaceWith: function (newContent) {
			return this.before(newContent).remove()
		},
		wrap: function (structure) {
			var func = isFunction(structure)
			if (this[0] && !func)
				var dom = $(structure).get(0),
			clone = dom.parentNode || this.length > 1

			return this.each(function (index) {
				$(this).wrapAll(
					func ? structure.call(this, index) :
					clone ? dom.cloneNode(true) : dom
				)
			})
		},
		wrapAll: function (structure) {
			if (this[0]) {
				$(this[0]).before(structure = $(structure))
				var children
				// drill down to the inmost element
				while ((children = structure.children()).length)
					structure = children.first()
				$(structure).append(this)
			}
			return this
		},
		wrapInner: function (structure) {
			var func = isFunction(structure)
			return this.each(function (index) {
				var self = $(this),
					contents = self.contents(),
					dom = func ? structure.call(this, index) : structure
					contents.length ? contents.wrapAll(dom) : self.append(dom)
			})
		},
		unwrap: function () {
			this.parent().each(function () {
				$(this).replaceWith($(this).children())
			})
			return this
		},
		clone: function () {
			return this.map(function () {
				return this.cloneNode(true)
			})
		},
		hide: function () {
			return this.css("display", "none")
		},
		toggle: function (setting) {
			return this.each(function () {
				var el = $(this);
				(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
			})
		},
		prev: function (selector) {
			return $(this.pluck('previousElementSibling')).filter(selector || '*')
		},
		next: function (selector) {
			return $(this.pluck('nextElementSibling')).filter(selector || '*')
		},
		html: function (html) {
			return arguments.length === 0 ?
				(this.length > 0 ? this[0].innerHTML : null) :
				this.each(function (idx) {
					var originHtml = this.innerHTML;
					$(this).empty().append(funcArg(this, html, idx, originHtml));
				});
		},
		title: function (title) {
			return arguments.length === 0 ?
				(this.length > 0 ? this[0].title : null) :
				this.each(function (idx) {
					var originHtml = this.title;
					$(this).empty().append(funcArg(this, title, idx, originHtml));
				});
		},
		text: function (text) {
			return arguments.length === 0 ?
				(this.length > 0 ? this[0].textContent : null) :
				this.each(function () {
					this.textContent = (text === undefined) ? '' : '' + text
				});
		},
		attr: function (name, value) {
			var result
			return (isString(name) && value === undefined) ?
				(this.length == 0 || this[0].nodeType !== 1 ? undefined :
				(name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
				(!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
			) :
				this.each(function (idx) {
					if (this.nodeType !== 1)
						return
					if (isObject(name))
						for (key in name)
							setAttribute(this, key, name[key])
					else
						setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
				})
		},
		removeAttr: function (name) {
			return this.each(function () {
				this.nodeType === 1 && setAttribute(this, name)
			})
		},
		prop: function (name, value) {
			name = prop_map[name] || name;
			return (value === undefined) ?
				(this[0] && this[0][name]) :
				this.each(function (idx) {
					this[name] = funcArg(this, value, idx, this[name]);
				});
		},
		data: function (name, value) {
			var data = this.attr('data-' + dasherize(name), value)
			return data !== null ? DeserializeValue(data) : undefined
		},
		val: function (value) {
			return arguments.length === 0 ?
				(this[0] && (this[0].multiple ?
				$(this[0]).find('option').filter(function () {
					return this.selected
				}).pluck('value') :
				this[0].value)) :
				this.each(function (idx) {
					this.value = funcArg(this, value, idx, this.value)
				})
		},
		offset: function (coordinates) {
			if (coordinates)
				return this.each(function (index) {
					var $this = $(this),
						coords = funcArg(this, coordinates, index, $this.offset()),
						parentOffset = $this.offsetParent().offset(),
						props = {
							top: coords.top - parentOffset.top,
							left: coords.left - parentOffset.left
						}

					if ($this.css('position') == 'static')
						props['position'] = 'relative'
					$this.css(props)
				})

			if (this.length == 0) {
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

				if (typeof name == 'string') {
					return element.style[camelize(name)] || computedStyle.getPropertyValue(name);
				} else if (isArray(name)) {
					var props = {};

					$.each(isArray(name) ? name : [name], function (_, prop) {
						props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop));
					});

					return props;
				}
			}

			if (type(name) == 'string') {
				if (!value && value !== 0) {
					this.each(function () {
						this.style.removeProperty(dasherize(name));
					});
				}
			}

			return $.access(this, function (elem, name, value) {
				var styles;
				var len;
				var map = {};
				var i = 0;

				if (isArray(name)) {
					styles = getStyles(elem);
					len = name.length;

					for (; i < len; i++) {
						map[name[i]] = $.css(elem, name[i], false, styles);
					}

					return map;
				}

				return value !== undefined ?
					$.style(elem, name, value) :
					$.css(elem, name);
			}, name, value, arguments.length > 1);
		},
		index: function (element) {
			return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
		},
		hasClass: function (name) {
			if (!name)
				return false
			return emptyArray.some.call(this, function (el) {
				return this.test(className(el))
			}, classRE(name))
		},
		addClass: function (name) {
			if (!name)
				return this
			return this.each(function (idx) {
				classList = []
				var cls = className(this),
					newName = funcArg(this, name, idx, cls)
					newName.split(/\s+/g).forEach(function (klass) {
						if (!$(this).hasClass(klass))
							classList.push(klass)
					}, this)
					classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
			})
		},
		removeClass: function (name) {
			return this.each(function (idx) {
				if (name === undefined)
					return className(this, '')
				classList = className(this)
				funcArg(this, name, idx, classList).split(/\s+/g).forEach(function (klass) {
					classList = classList.replace(classRE(klass), " ")
				})
				className(this, classList.trim())
			})
		},
		toggleClass: function (name, when) {
			if (!name)
				return this
			return this.each(function (idx) {
				var $this = $(this),
					names = funcArg(this, name, idx, className(this))
					names.split(/\s+/g).forEach(function (klass) {
						(when === undefined ? !$this.hasClass(klass) : when) ?
							$this.addClass(klass) : $this.removeClass(klass)
					})
			})
		},
		scrollTop: function (value) {
			if (!this.length)
				return
			var hasScrollTop = 'scrollTop' in this[0]
			if (value === undefined)
				return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
			return this.each(hasScrollTop ?
				function () {
					this.scrollTop = value
				} :
				function () {
					this.scrollTo(this.scrollX, value)
				})
		},
		scrollLeft: function (value) {
			if (!this.length)
				return
			var hasScrollLeft = 'scrollLeft' in this[0]
			if (value === undefined)
				return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
			return this.each(hasScrollLeft ?
				function () {
					this.scrollLeft = value
				} :
				function () {
					this.scrollTo(value, this.scrollY)
				})
		},
		position: function () {
			if (!this.length)
				return;

			var elem = this[0],
				// Get *real* offsetParent
				offsetParent = this.offsetParent(),
				// Get correct offsets
				offset = this.offset(),
				parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? {
					top: 0,
					left: 0
				} : offsetParent.offset()

				// Subtract element margins
				// note: when an element has margin: auto the offsetLeft and marginLeft
				// are the same in Safari causing offset.left to incorrectly be 0
				offset.top -= parseFloat($(elem).css('margin-top')) || 0
				offset.left -= parseFloat($(elem).css('margin-left')) || 0

				// Add offsetParent borders
				parentOffset.top += parseFloat($(offsetParent[0]).css('border-top-width')) || 0
				parentOffset.left += parseFloat($(offsetParent[0]).css('border-left-width')) || 0

				// Subtract the two offsets
			return {
				top: offset.top - parentOffset.top,
				left: offset.left - parentOffset.left
			}
		},
		offsetParent: function () {
			return this.map(function () {
				var offsetParent = this.offsetParent || docelem;

				while (offsetParent && (!$.nodeName(offsetParent, 'html') && $.css(offsetParent, 'position') === 'static')) {
					offsetParent = offsetParent.offsetParent;
				}

				return offsetParent || docelem;
			});
		},
		detach: function (selector) {
			return this.remove(selector, true);
			// return this.remove(selector);
		},
		splice: [].splice
	};

	// Give the init function the Yaex prototype for later instantiation
	Yaex.init.prototype = $.fn;

	$.fn.extend = $.Extend;

	$.fn.offset = function (options) {
		if (arguments.length) {
			return options === undefined ?
				this :
				this.each(function (i) {
					$.offset.setOffset(this, options, i);
				});
		}

		if (this.length == 0) {
			return null;
		}

		var docElem, win,
			elem = this[0],
			box = {
				top: 0,
				left: 0
			},
			doc = elem && elem.ownerDocument;

		if (!doc) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if (!contains(docElem, elem)) {
			return box;
		}

		// If we don't have gBCR, just use 0,0 rather than error
		// BlackBerry 5, iOS 3 (original iPhone)
		if (typeof elem.getBoundingClientRect !== core_strundefined) {
			box = elem.getBoundingClientRect();
		}

		win = getWindow(doc);

		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	};

	$.offset = {
		setOffset: function (elem, options, i) {
			var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
				position = $.css(elem, "position"),
				curElem = $(elem),
				props = {};

			// Set position first, in-case top/left are set even on static elem
			if (position === "static") {
				elem.style.position = "relative";
			}

			curOffset = curElem.offset();
			curCSSTop = $.css(elem, "top");
			curCSSLeft = $.css(elem, "left");
			calculatePosition = (position === "absolute" || position === "fixed") && (curCSSTop + curCSSLeft).indexOf("auto") > -1;

			// Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
			if (calculatePosition) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;

			} else {
				curTop = parseFloat(curCSSTop) || 0;
				curLeft = parseFloat(curCSSLeft) || 0;
			}

			if (isFunction(options)) {
				options = options.call(elem, i, curOffset);
			}

			if (options.top != null) {
				props.top = (options.top - curOffset.top) + curTop;
			}
			if (options.left != null) {
				props.left = (options.left - curOffset.left) + curLeft;
			}

			if ("using" in options) {
				options.using.call(elem, props);

			} else {
				curElem.css(props);
			}
		}
	};

	function randomNumber(min, max) {
		// return Math.random() * (max - min) + min;
		// return Math.floor(Math.random() * (max - min + 1) + min);
		return (Math.random() * (max - min + 1) + min);
	}

	$.Extend({
		// data: string of html
		// context (optional): If specified, the fragment will be created in this context, defaults to document
		// keepScripts (optional): If true, will include scripts passed in the html string
		parseHTML: function (data, context, keepScripts) {
			if (!data || typeof data !== "string") {
				return null;
			}
			if (typeof context === "boolean") {
				keepScripts = context;
				context = false;
			}
			context = context || document;

			var parsed = rsingleTag.exec(data),
				scripts = !keepScripts && [];

			// Single tag
			if (parsed) {
				return [context.createElement(parsed[1])];
			}

			parsed = $.buildFragment([data], context, scripts);

			if (scripts) {
				$(scripts).remove();
			}

			return $.merge([], parsed.childNodes);
		},
		parseJSON: JSON.parse,
		// Cross-browser xml parsing
		parseXML: function (data) {
			var xml;
			var tmp;

			if (!data || typeof data !== 'string') {
				return null;
			}

			// Support: IE9
			try {
				tmp = new DOMParser();
				xml = tmp.parseFromString(data, 'text/xml');
			} catch (e) {
				xml = undefined;
			}

			if (!xml || xml.getElementsByTagName('parsererror').length) {
				$.Error('Invalid XML: ' + data);
			}
			return xml;
		},
		noop: function () {},
		// Evaluates a script in a global context
		globalEval: function (code) {
			var script;
			var indirect = eval;

			code = $.trim(code);

			if (code) {
				// If the code includes a valid, prologue position
				// strict mode pragma, execute code by injecting a
				// script tag into the document.
				if (code.indexOf("use strict") === 1) {
					script = document.createElement("script");
					script.text = code;
					document.head.appendChild(script).parentNode.removeChild(script);
				} else {
					// Otherwise, avoid the DOM node creation, insertion
					// and removal by using an indirect global eval
					indirect(code);
				}
			}
		}
	});

	$.Extend({
		// Unique for each copy of Yaex on the page
		// Expando: 'Yaex' + (core_version + Math.random()).replace(/\D/g, ''),
		Expando: 'Yaex' + (core_version + core_build + randomNumber(2, 3)).replace(/\D/g, ''),

		// Multifunctional method to get and set values of a collection
		// The value/s can optionally be executed if it's a function
		access: function (elems, fn, key, value, chainable, emptyGet, raw) {
			var i = 0;
			var length = elems.length;
			var bulk = key === null;

			// Sets many values
			if (type(key) === 'object') {
				chainable = true;
				for (i in key) {
					$.access(elems, fn, i, key[i], true, emptyGet, raw);
				}
				// Sets one value
			} else if (value !== undefined) {
				chainable = true;

				if (!$.isFunction(value)) {
					raw = true;
				}

				if (bulk) {
					// Bulk operations run against the entire set
					if (raw) {
						fn.call(elems, value);
						fn = null;

						// ...except when executing function values
					} else {
						bulk = fn;
						fn = function (elem, key, value) {
							return bulk.call($(elem), value);
						};
					}
				}

				if (fn) {
					for (; i < length; i++) {
						fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
					}
				}
			}

			return chainable ? elems :
			// Gets
			bulk ? fn.call(elems) : length ? fn(elems[0], key) : emptyGet;
		},
		// A method for quickly swapping in/out CSS properties to get correct calculations.
		// Note: this method belongs to the css module but it's needed here for the support module.
		// If support gets modularized, this method should be moved back to the css module.
		swap: function (elem, options, callback, args) {
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
			var ret = $.merge(this.constructor(), elems);

			// Add the old object onto the stack (as a reference)
			ret.prevObject = this;
			ret.context = this.context;

			// Return the newly-formed element set
			return ret;
		},
		nodeName: function (elem, name) {
			return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
		}
	});

	// Generate the `width` and `height` functions
	['width', 'height'].forEach(function (dimension) {
		var dimensionProperty =
			dimension.replace(/./, function (m) {
				return m[0].toUpperCase();
			});

		$.fn[dimension] = function (value) {
			var offset, el = this[0];
			if (value === undefined)
				return $.isWindow(el) ? el['inner' + dimensionProperty] :
					$.isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
					(offset = this.offset()) && offset[dimension];
			else
				return this.each(function (idx) {
					el = $(this);
					el.css(dimension, funcArg(this, value, idx, el[dimension]()));
				});
		};
	});

	// Create scrollLeft and scrollTop methods
	$.each({
		scrollLeft: 'pageXOffset',
		scrollTop: 'pageYOffset'
	}, function (method, prop) {
		var top = 'pageYOffset' === prop;

		$.fn[method] = function (val) {
			return $.access(this, function (elem, method, val) {
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

	var curCSS,
		// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
		// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap = /^(none|table(?!-c[ea]).+)/,
		rmargin = /^margin/,
		rnumsplit = new RegExp("^(" + core_pnum + ")(.*)$", "i"),
		rnumnonpx = new RegExp("^(" + core_pnum + ")(?!px)[a-z%]+$", "i"),
		rrelNum = new RegExp("^([+-])=(" + core_pnum + ")", "i"),
		cssShow = {
			position: "absolute",
			visibility: "hidden",
			display: "block"
		},
		cssNormalTransform = {
			letterSpacing: 0,
			fontWeight: 400
		},
		cssExpand = ["Top", "Right", "Bottom", "Left"],
		cssPrefixes = ["Webkit", "O", "Moz", "ms"];

	$.cssExpand = cssExpand;

	// return a css property mapped to a potentially vendor prefixed property

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

	// NOTE: we've included the "window" in window.getComputedStyle
	// because jsdom on node.js will break without it.

	function getStyles(elem) {
		return window.getComputedStyle(elem, null);
	}

	$.Extend({
		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		CSS_Hooks: {
			opacity: {
				get: function (elem, computed) {
					if (computed) {
						// We should always get a number back from opacity
						var ret = curCSS(elem, "opacity");
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
			"float": "cssFloat"
		},
		// Get and set the style property on a DOM Node
		style: function (elem, name, value, extra) {
			// Don't set styles on text and comment nodes
			if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
				return;
			}

			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = $.camelCase(name),
				style = elem.style,
				newvalue;

			name = $.CSS_Properities[origName] || ($.CSS_Properities[origName] = vendorPropName(style, origName));

			// gets hook for the prefixed version
			// followed by the unprefixed version
			hooks = $.CSS_Hooks[name] || $.CSS_Hooks[origName];

			newvalue = value;

			// Check if we're setting a value
			if (value !== undefined) {
				type = typeof value;

				// convert relative number strings (+= or -=) to relative numbers. #7345
				if (type === "string" && (ret = rrelNum.exec(value))) {
					value = (ret[1] + 1) * ret[2] + parseFloat($.css(elem, name));

					// Fixes bug #9237
					type = "number";
				}

				// Make sure that NaN and null values aren't set. See: #7116
				if (value == null || type === "number" && isNaN(value)) {
					return;
				}

				// If a number was passed in, add 'px' to the (except for certain CSS properties)
				if (type === "number" && !$.CSS_Number[origName]) {
					value += "px";
				}

				// Fixes #8908, it can be done more correctly by specifying setters in CSS_Hooks,
				// but it would mean to define eight (for every problematic property) identical functions
				if (!$.Support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
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
		css: function (elem, name, extra, styles) {
			var val, num, hooks,
				origName = $.camelCase(name);

			// Make sure that we're working with the right name
			name = $.CSS_Properities[origName] || ($.CSS_Properities[origName] = vendorPropName(elem.style, origName));

			// gets hook for the prefixed version
			// followed by the unprefixed version
			hooks = $.CSS_Hooks[name] || $.CSS_Hooks[origName];

			// If a hook was provided get the computed value from there
			if (hooks && "get" in hooks) {
				val = hooks.get(elem, true, extra);
			}

			// Otherwise, if a way to get the computed value exists, use that
			if (val === undefined) {
				val = curCSS(elem, name, styles);
			}

			//convert "normal" to computed value
			if (val === "normal" && name in cssNormalTransform) {
				val = cssNormalTransform[name];
			}

			// Return, converting to number if forced or a qualifier was provided and val looks numeric
			if (extra === "" || extra) {
				num = parseFloat(val);
				return extra === true || $.isNumeric(num) ? num || 0 : val;
			}

			return val;
		}
	});

	curCSS = function (elem, name, _computed) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles(elem),
			// Support: IE9
			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined,
			style = elem.style;

		if (computed) {

			if (ret === "" && !contains(elem.ownerDocument, elem)) {
				ret = $.style(elem, name);
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

	function setPositiveNumber(elem, value, subtract) {
		var matches = rnumsplit.exec(value);
		return matches ?
		// Guard against undefined "subtract", e.g., when used as in CSS_Hooks
		Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") :
			value;
	}

	function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
		var i = extra === (isBorderBox ? "border" : "content") ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,
			val = 0;

		for (; i < 4; i += 2) {
			// both box models exclude margin, so add it if we want it
			if (extra === "margin") {
				val += $.css(elem, extra + cssExpand[i], true, styles);
			}

			if (isBorderBox) {
				// border-box includes padding, so remove it if we want content
				if (extra === "content") {
					val -= $.css(elem, "padding" + cssExpand[i], true, styles);
				}

				// at this point, extra isn't border nor margin, so remove border
				if (extra !== "margin") {
					val -= $.css(elem, "border" + cssExpand[i] + "Width", true, styles);
				}
			} else {
				// at this point, extra isn't content, so add padding
				val += $.css(elem, "padding" + cssExpand[i], true, styles);

				// at this point, extra isn't content nor padding, so add border
				if (extra !== "padding") {
					val += $.css(elem, "border" + cssExpand[i] + "Width", true, styles);
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
			isBorderBox = $.Support.boxSizing && $.css(elem, "boxSizing", false, styles) === "border-box";

		// some non-html elements return undefined for offsetWidth, so check for null/undefined
		// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
		// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
		if (val <= 0 || val === null) {
			// Fall back to computed then uncomputed css if necessary
			val = curCSS(elem, name, styles);

			if (val < 0 || val === null) {
				val = elem.style[name];
			}

			// Computed unit is not pixels. Stop here and return.
			if (rnumnonpx.test(val)) {
				return val;
			}

			// we need the check for style in case a browser which returns unreliable values
			// for getComputedStyle silently falls back to the reliable elem.style
			valueIsBorderBox = isBorderBox && ($.Support.boxSizingReliable || val === elem.style[name]);

			// Normalize "", auto, and prepare for extra
			val = parseFloat(val) || 0;
		}

		// use the active box-sizing model to add/subtract irrelevant styles
		return (val +
			augmentWidthOrHeight(
				elem,
				name,
				extra || (isBorderBox ? "border" : "content"),
				valueIsBorderBox,
				styles
			)
		) + "px";
	}

	$.each(["height", "width"], function (i, name) {
		$.CSS_Hooks[name] = {
			get: function (elem, computed, extra) {
				if (computed) {
					// certain elements can have dimension info if we invisibly show them
					// however, it must have a current display style that would benefit from this
					return elem.offsetWidth === 0 && rdisplayswap.test($.css(elem, "display")) ?
						$.swap(elem, cssShow, function () {
							return getWidthOrHeight(elem, name, extra);
						}) :
						getWidthOrHeight(elem, name, extra);
				}
			},
			set: function (elem, value, extra) {
				var styles = extra && getStyles(elem);
				return setPositiveNumber(elem, value, extra ?
					augmentWidthOrHeight(
						elem,
						name,
						extra,
						$.Support.boxSizing && $.css(elem, "boxSizing", false, styles) === "border-box",
						styles
					) : 0
				);
			}
		};
	});

	$.each({
		Height: 'height',
		Width: 'width'
	}, function (name, type) {
		$.each({
			padding: 'inner' + name,
			content: type,
			'': 'outer' + name
		}, function (defaultExtra, funcName) {
			// margin is only for outerHeight, outerWidth
			$.fn[funcName] = function (margin, value) {
				var chainable = arguments.length && (defaultExtra || typeof margin !== 'boolean');
				var extra = defaultExtra || (margin === true || value === true ? 'margin' : 'border');

				return $.access(this, function (elem, type, value) {
					var doc;

					if ($.isWindow(elem)) {
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
					$.css(elem, type, extra) :
					// Set width or height on the element
					$.style(elem, type, value, extra);
				}, type, chainable ? margin : undefined, chainable, null);
			};
		});
	});

	function traverseNode(node, fun) {
		fun(node);

		for (var key in node.childNodes) {
			traverseNode(node.childNodes[key], fun);
		}
	}

	function getWindow(elem) {
		return $.isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
	}

	// Generate the `after`, `prepend`, `before`, `append`,
	// `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
	adjacencyOperators.forEach(function (operator, operatorIndex) {
		var inside = operatorIndex % 2; //=> prepend, append

		$.fn[operator] = function () {
			// arguments can be nodes, arrays of nodes, Yaex objects and HTML strings
			var argType, nodes = $.map(arguments, function (arg) {
					argType = type(arg);
					return argType === "object" || argType === "array" || arg === null ?
						arg : Yaex.Fragment(arg);
				}),
				parent, copyByClone = this.length > 1;

			if (nodes.length < 1)
				return this;


			return this.each(function (_, target) {
				parent = inside ? target : target.parentNode;

				// convert all methods to a "before" operation
				target = operatorIndex === 0 ? target.nextSibling :
					operatorIndex === 1 ? target.firstChild :
					operatorIndex === 2 ? target :
					null;

				nodes.forEach(function (node) {
					if (copyByClone) {
						node = node.cloneNode(true);
					} else if (!parent) {
						return $(node).remove();
					}

					traverseNode(parent.insertBefore(node, target), function (el) {
						/*if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT') {
						 window['eval'].call(window, el.innerHTML);
						 }*/
						// if (el.nodeName != null || el.nodeName != undefined && el.nodeName.toUpperCase() === 'SCRIPT' && (!el.type || el.type === 'text/javascript') && !el.src) {
						if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' && (!el.type || el.type === 'text/javascript') && !el.src) {
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
		$.fn[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function (html) {
			$(html)[operator](this);
			return this;
		};
	});

	Yaex.Y.prototype = $.fn;

	// Export internal API functions in the `$.Yaex` namespace
	$.Unique = Unique;
	$.DeserializeValue = DeserializeValue;

	$.Yaex = Yaex;

	if (isObject(window) && isObject(window.document)) {
		window.Yaex = window.$ = $;
	}

	return $;
})()

// 'Yaex' in window || (window.Yaex = $);
// '$' in window || (window.$ = Yaex);

/**
 * Event - Cross browser events implementation using Yaex's API
 *
 *
 * @depends: Yaex.js | Core
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function ($) {
	'use strict';

	var handlers = {};
	var YID = 1;
	var hover = {
		mouseenter: 'mouseover',
		mouseleave: 'mouseout'
	};

	var ignoreProperties = /^([A-Z]|layer[XY]$)/;

	var eventMethods = {
		preventDefault: 'isDefaultPrevented',
		stopImmediatePropagation: 'isImmediatePropagationStopped',
		stopPropagation: 'isPropagationStopped'
	};

	function yid(element) {
		return element.YID || (element.YID = YID++);
	}

	function findHandlers(element, event, fn, selector) {
		event = parse(event);

		if (event.ns) {
			var matcher = matcherFor(event.ns);
		}

		return (handlers[yid(element)] || []).filter(function (handler) {
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
		if (!$.isString(events)) {
			$.each(events, iterator);
		} else {
			events.split(/\s/).forEach(function (type) {
				iterator(type, fn);
			});
		}
	}

	function eventCapture(handler, captureSetting) {
		return handler.del &&
			(handler.e == 'focus' || handler.e == 'blur') || !! captureSetting;
	}

	function realEvent(type) {
		return hover[type] || type;
	}

	$.Yaex.Event = {
		add: function(element, events, fn, selector, getDelegate, capture) {
			var id = yid(element);
			var set = (handlers[id] || (handlers[id] = []));
			var type;

			eachEvent(events, fn, function (event, fn) {
				var handler = parse(event);
				handler.fn = fn;
				handler.sel = selector;

				// emulate mouseenter, mouseleave
				if (handler.e in hover) {
					fn = function (e) {
						var related = e.relatedTarget;

						if (!related || (related !== this && !$.contains(this, related))) {
							return handler.fn.apply(this, arguments);
						}
					}
				}

				handler.del = getDelegate && getDelegate(fn, event);

				var callback = handler.del || fn;

				handler.proxy = function (e) {
					var result = callback.apply(element, [e].concat(e.data));

					if (result === false) {
						e.preventDefault(), e.stopPropagation();
					}

					return result;
				};

				handler.i = set.length;

				set.push(handler);

				if ('addEventListener' in element) {
					element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
				}
			})
		},

		remove: function(element, events, fn, selector, capture) {
			var id = yid(element);

			eachEvent(events || '', fn, function (event, fn) {
				findHandlers(element, event, fn, selector).forEach(function (handler) {
					delete handlers[id][handler.i];

					if ('removeEventListener' in element) {
						element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
					}
				});
			});
		},

		special: {},

		fix: function(event) {
			if (!('defaultPrevented' in event)) {
				event.defaultPrevented = false;
				var prevent = event.preventDefault;
				event.preventDefault = function () {
					event.defaultPrevented = true;
					prevent.call(event);
				};
			}
		},
	};

	$.Yaex.Event.special.click = $.Yaex.Event.special.mousedown = $.Yaex.Event.special.mouseup = $.Yaex.Event.special.mousemove = 'MouseEvents';

	$.proxy = function (fn, context) {
		if ($.isFunction(fn)) {
			var proxyFn = function () {
				return fn.apply(context, arguments);
			};

			proxyFn.YID = yid(fn);

			return proxyFn;
		} else if (typeof context == 'string') {
			return $.proxy(fn[context], fn);
		} else {
			throw new TypeError("expected function");
		}
	};

	$.fn.bind = function (event, callback) {
		return this.each(function () {
			$.Yaex.Event.add(this, event, callback);
		});
	};
	$.fn.unbind = function (event, callback) {
		return this.each(function () {
			$.Yaex.Event.remove(this, event, callback);
		});
	};
	$.fn.one = function (event, callback) {
		return this.each(function (i, element) {
			$.Yaex.Event.add(this, event, callback, null, function (fn, type) {
				return function () {
					var result = fn.apply(element, arguments);
					$.Yaex.Event.remove(element, type, fn);
					return result;
				};
			});
		});
	};

	var returnTrue = function () {
		return true;
	};

	var returnFalse = function () {
		return false;
	};

	function createProxy(event) {
		$.Yaex.Event.fix(event);

		var key;

		var proxy = {
			originalEvent: event
		};

		for (key in event) {
			if (!ignoreProperties.test(key) && event[key] !== undefined) {
				proxy[key] = event[key];
			}
		}

		$.each(eventMethods, function (name, predicate) {
			proxy[name] = function () {
				this[predicate] = returnTrue;
				return event[name].apply(event, arguments);
			};

			proxy[predicate] = returnFalse;
		});

		return proxy;
	}

	$.fn.delegate = function (selector, event, callback) {
		return this.each(function (i, element) {
			$.Yaex.Event.add(element, event, callback, selector, function (fn) {
				return function (e) {
					var evt;
					var match = $(e.target).closest(selector, element).get(0);

					if (match) {
						evt = $.Extend(createProxy(e), {
							currentTarget: match,
							liveFired: element
						});

						return fn.apply(match, [evt].concat([].slice.call(arguments, 1)));
					}
				};
			});
		});
	};

	$.fn.undelegate = function (selector, event, callback) {
		return this.each(function () {
			$.Yaex.Event.remove(this, event, callback, selector);
		})
	};

	$.fn.live = function (event, callback) {
		$(document.body).delegate(this.selector, event, callback);
		return this;
	};

	$.fn.die = function (event, callback) {
		$(document.body).undelegate(this.selector, event, callback);
		return this;
	};

	$.fn.on = function (event, selector, callback) {
		return !selector || $.isFunction(selector) ?
			this.bind(event, selector || callback) : this.delegate(selector, event, callback);
	};

	$.fn.off = function (event, selector, callback) {
		return !selector || $.isFunction(selector) ?
			this.unbind(event, selector || callback) : this.undelegate(selector, event, callback);
	};

	$.fn.trigger = function (event, data) {
		if ($.isString(event) || $.isPlainObject(event)) {
			event = $.Event(event);
		}

		$.Yaex.Event.fix(event);

		event.data = data;

		return this.each(function () {
			// items in the collection might not be DOM elements
			if ('dispatchEvent' in this) {
				this.dispatchEvent(event);
			} else {
				$(this).triggerHandler(event, data);
			}
		});
	};

	// triggers event handlers on current element just as if an event occurred,
	// doesn't trigger an actual event, doesn't bubble
	$.fn.triggerHandler = function (event, data) {
		var e;
		var result;
		this.each(function (i, element) {
			e = createProxy($.isString(event) ? $.Event(event) : event);
			e.data = data;
			e.target = element;

			$.each(findHandlers(element, event.type || event), function (i, handler) {
				result = handler.proxy(e);

				if (e.isImmediatePropagationStopped()) {
					return false;
				}
			});
		});

		return result;
	};

	// shortcut methods for `.bind(event, fn)` for each event type
	('focusin focusout load resize scroll unload click dblclick wheel ' +
		'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
		'change select keydown keypress keyup error').split(' ').forEach(function (event) {
		$.fn[event] = function (callback) {
			return callback ?
				this.bind(event, callback) :
				this.trigger(event);
		};
	});

	['focus', 'blur'].forEach(function (name) {
		$.fn[name] = function (callback) {
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

	$.Event = function (type, props) {
		if ($.isString(type)) {
			props = type;
			type = props.type;
		}

		var event = document.createEvent($.Yaex.Event.special[type] || 'Events');

		var bubbles = true;

		if (props) {
			for (var name in props) {
				(name == 'bubbles') ? (bubbles = !! props[name]) : (event[name] = props[name]);
			}
		}

		event.initEvent(type, bubbles, true);

		event.isDefaultPrevented = function () {
			return event.defaultPrevented;
		};

		return event;
	};
})(Yaex)

+(function ($) {
	'use strict';
	var jsonpID = 0;
	var document = window.document;
	var key;
	var name;
	var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	var scriptTypeRE = /^(?:text|application)\/javascript/i;
	var xmlTypeRE = /^(?:text|application)\/xml/i;
	var jsonType = 'application/json';
	var htmlType = 'text/html';
	var blankRE = /^\s*$/;
	var _load = $.fn.load;

	// trigger a custom event and return false if it was cancelled

	function triggerAndReturn(context, eventName, data) {
		var event = $.Event(eventName);

		$(context).trigger(event, data);

		return !event.defaultPrevented;
	}

	// trigger an Ajax "global" event

	function triggerGlobal(settings, context, eventName, data) {
		if (settings.global) {
			return triggerAndReturn(context || document, eventName, data);
		}
	}

	// Number of active Ajax requests
	$.active = 0;

	function ajaxStart(settings) {
		if (settings.global && $.active++ === 0) {
			triggerGlobal(settings, null, 'ajaxStart');
		}
	}

	function ajaxStop(settings) {
		if (settings.global && !(--$.active)) {
			triggerGlobal(settings, null, 'ajaxStop');
		}
	}

	// triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable

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
		if (deferred) deferred.resolveWith(context, [data, status, xhr]);
		triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data]);

		ajaxComplete(status, xhr, settings);
	}

	// type: "timeout", "error", "abort", "parsererror"

	function ajaxError(error, type, xhr, settings, deferred) {
		var context = settings.context;

		settings.error.call(context, xhr, type, error);
		if (deferred) deferred.rejectWith(context, [xhr, type, error]);
		triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error]);

		ajaxComplete(type, xhr, settings);
	}

	// status: "success", "notmodified", "error", "timeout", "abort", "parsererror"

	function ajaxComplete(status, xhr, settings) {
		var context = settings.context;

		settings.complete.call(context, xhr, status);
		triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings]);

		ajaxStop(settings);
	}

	// Empty function, used as default callback

	function empty() {}

	$.ajaxJSONP = function (options, deferred) {
		if (!('type' in options)) {
			return $.ajax(options);
		}

		//var callbackName = 'jsonp' + (++jsonpID);
		var _callbackName = options.jsonpCallback;

		var callbackName = ($.isFunction(_callbackName) ? _callbackName() : _callbackName) || ('jsonp' + (++jsonpID));

		var script = document.createElement('script');

		var originalCallback = window[callbackName];

		var responseData;

		var abort = function (errorType) {
			$(script).triggerHandler('error', errorType || 'abort')
		};

		var xhr = {
			abort: abort
		};

		var abortTimeout;

		if (deferred) deferred.promise(xhr);

		// console.log($(script));

		// $(script).on('load error', function(e, errorType) {
		$(script).on('load error', function (e, errorType) {
			clearTimeout(abortTimeout);
			// $(script).off().remove();
			$(script).off('load error');
			$(script).remove();

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
	};

	/*
	 * Retrieves the value of a cookie by the given key.
	 *
	 * @param key, (string) Name of the cookie to retrieve.
	 * @return (string) Value of the given key or null.
	 **/

	function getCookie(key) {
		var result = (
			new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)')
		).exec(document.cookie);

		return result ? result[1] : null;
	}

	/*
	 * Checks if our host matches the request's host.
	 *
	 * @param url, (string) URL of request.
	 * @return (boolean) Request is to origin.
	 **/

	function sameOrigin(url) {
		// Url could be relative or scheme relative or absolute
		var sr_origin = '//' + document.location.host,
			origin = document.location.protocol + sr_origin;

		// Allow absolute or scheme relative URLs to same origin
		return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
			(url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
		// or any other URL that isn't scheme relative or absolute i.e relative.
		!(/^(\/\/|http:|https:).*/.test(url));
	}

	$.ajaxSettings = {
		// Default type of request
		type: 'GET',
		// Callback that is executed before request
		beforeSend: empty,
		// Callback that is executed if the request succeeds
		success: empty,
		// Callback that is executed the the server drops error
		error: empty,
		// Callback that is executed on request complete (both: error and success)
		complete: empty,
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
	};

	function mimeToDataType(mime) {
		if (mime) {
			mime = mime.split(';', 2)[0];
		}
		return mime && (mime === htmlType ? 'html' :
			mime === jsonType ? 'json' :
			scriptTypeRE.test(mime) ? 'script' :
			xmlTypeRE.test(mime) && 'xml') || 'text';
	}

	function appendQuery(url, query) {
		// console.log(query);
		return (url + '&' + query).replace(/[&?]{1,2}/, '?');
	}

	// serialize payload and append it to the URL for GET requests

	function serializeData(options) {
		if (options.processData && options.data && $.type(options.data) !== "string") {
			options.data = $.param(options.data, options.traditional);
		}

		if (options.data && (!options.type || options.type.toUpperCase() === 'GET')) {
			options.url = appendQuery(options.url, options.data);
			options.data = undefined;
		}
	}

	$.ajax = function (options) {
		var settings = $.Extend({}, options || {});
		var deferred = $.Deferred && $.Deferred();

		for (key in $.ajaxSettings) {
			if (settings[key] === undefined) {
				settings[key] = $.ajaxSettings[key];
			}
		}

		ajaxStart(settings);

		if (!settings.crossDomain) {
			settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 !== window.location.host;
		}

		if (!settings.url) {
			settings.url = window.location.toString();
		}

		serializeData(settings);

		if (settings.cache === false) {
			settings.url = appendQuery(settings.url, '_=' + Date.now());
		}

		var dataType = settings.dataType;

		var hasPlaceholder = /=\?/.test(settings.url);

		if (dataType == 'jsonp' || hasPlaceholder) {
			if (!hasPlaceholder) {
				settings.url = appendQuery(settings.url, settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?');
			}

			return $.ajaxJSONP(settings, deferred);
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

		if (deferred) deferred.promise(xhr);

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

		if (settings.headers)
			for (name in settings.headers) setHeader(name, settings.headers[name]);

		xhr.setRequestHeader = setHeader;

		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				xhr.onreadystatechange = empty;
				clearTimeout(abortTimeout);

				var result;
				var error = false;

				if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
					dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'));
					result = xhr.responseText;
					try {
						// http://perfectionkills.com/global-eval-what-are-the-options/
						if (dataType == 'script') {
							(1, eval)(result);
						} else if (dataType == 'xml') {
							result = xhr.responseXML;
						} else if (dataType == 'json') {
							result = blankRE.test(result) ? null : $.parseJSON(result);
							// console.log(result);
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
				xhr.onreadystatechange = empty;
				xhr.abort();
				ajaxError(null, 'timeout', xhr, settings, deferred);
			}, settings.timeout);
		}

		// avoid sending empty string (#319)
		xhr.send(settings.data ? settings.data : null);

		return xhr;
	};

	// handle optional data/success arguments

	function parseArguments(url, data, success, dataType) {
		var hasData = !$.isFunction(data);
		return {
			url: url,
			data: hasData ? data : undefined,
			success: !hasData ? data : $.isFunction(success) ? success : undefined,
			dataType: hasData ? dataType || success : success
		};
	}

	$.get = function () {
		return $.ajax(parseArguments.apply(null, arguments));
	};

	$.post = function () {
		var options = parseArguments.apply(null, arguments);
		options.type = 'POST';
		return $.ajax(options);
	};

	$.getJSON = function () {
		var options = parseArguments.apply(null, arguments);
		options.dataType = 'json';
		return $.ajax(options);
	};

	$.fn.load = function (url, data, success) {
		if (!this.length) {
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
			self.html(selector ? $('<div>').html(response.replace(rscript, "")).find(selector) : response);
			callback && callback.apply(self, arguments);
		};

		$.ajax(options);

		return this;
	};

	$.fn.load = function (url, params, callback) {
		if (typeof url !== "string" && _load) {
			return _load.apply(this, arguments);
		}

		var selector;
		var type;
		var response
		var self = this;
		var off = url.indexOf(' ');

		if (off >= 0) {
			selector = url.slice(off);
			url = url.slice(0, off);
		}

		// If it's a function
		if ($.isFunction(params)) {
			// We assume that it's the callback
			callback = params;
			params = undefined;

			// Otherwise, build a param string
		} else if (params && $.isObject(params)) {
			type = 'POST';
		}

		// If we have elements to modify, make the request
		if (self.length > 0) {
			$.ajax({
				url: url,
				// if "type" variable is undefined, then "GET" method will be used
				type: type,
				dataType: htmlType,
				data: params
			}).success(function (responseText) {

				// Save response for use in complete callback
				response = arguments;

				self.html(selector ?
					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					$('<div>').append($.Yaex.ParseHTML(responseText)).find(selector) :
					// Otherwise use the full result
					responseText);

			}).complete(callback && function (jqXHR, status) {
				self.each(callback, response || [jqXHR.responseText, status, jqXHR]);
			});
		}

		return this;
	}

	$.JSON_Stringify = function (object, level) {
		var result = '';
		var i;

		level = level === undefined ? 1 : level;

		var type = typeof object;

		switch (type) {
		case 'function':
			result += object;
			break;
		case 'boolean':
			result += object ? 'true' : 'false';
			break;
		case 'object':
			if (object === null) {
				result += 'null';
			} else if (object instanceof Array) {
				result += '[';
				var len = object.length;
				for (i = 0; i < len - 1; ++i) {
					result += $.JSON_Stringify(object[i], level + 1);
				}
				result += $.JSON_Stringify(object[len - 1], level + 1) + ']';
			} else {
				result += '{';
				for (var property in object) {
					if (object.hasOwnProperty(property)) {
						result += '"' + property + '":' +
							$.JSON_Stringify(object[property], level + 1);
					}
				}
				result += '}';
			}
			break;
		case 'string':
			var str = object;
			var repl = {
				'\\\\': '\\\\',
				'"': '\\"',
				'/': '\\/',
				'\\n': '\\n',
				'\\r': '\\r',
				'\\t': '\\t'
			};
			for (i in repl) {
				if (repl.hasOwnProperty(i)) {
					str = str.replace(new RegExp(i, 'g'), repl[i]);
				}
			}
			result += '"' + str + '"';
			break;
		case 'number':
			result += String(object);
			break;
		}

		result += (level > 1 ? ',' : '');

		// Quick hacks below
		if (level === 1) {
			// fix last comma
			result = result.replace(/,([\]}])/g, '$1');
		}

		// Fix comma before array or object
		return result.replace(/([\[{]),/g, '$1');
	};

	var escape = encodeURIComponent;

	function serialize(params, obj, traditional, scope) {
		var type, array = $.isArray(obj);
		$.each(obj, function (key, value) {
			type = $.type(value);

			if (scope) {
				key = traditional ? scope : scope + '[' + (array ? '' : key) + ']';
			}

			// handle data in serializeArray() format
			if (!scope && array) {
				params.add(value.name, value.value);
			}

			// recurse into nested objects
			else if (type === "array" || (!traditional && type === "object")) {
				serialize(params, value, traditional, key);
			} else {
				params.add(key, value);
			}
		});
	}

	$.param = function (obj, traditional) {
		var params = [];
		params.add = function (k, v) {
			this.push(escape(k) + '=' + escape(v));
		};
		serialize(params, obj, traditional);
		return params.join('&').replace(/%20/g, '+');
	};

	/**
	 * Extend Yaex's AJAX beforeSend method by setting an X-CSRFToken on any
	 * 'unsafe' request methods.
	 **/
	$.Extend($.ajaxSettings, {
		beforeSend: function (xhr, settings) {
			// console.log(settings);
			if (!(/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type)) && sameOrigin(settings.url)) {
				xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
			}
		}
	});
	
})(Yaex)


+(function ($) {
	'use strict';
	
	$.fn.serializeArray = function () {
		var result = [];
		var el;

		$([].slice.call(this.get(0).elements)).each(function () {
			el = $(this);
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

	$.fn.serialize = function () {
		var result = [];

		this.serializeArray().forEach(function (elm) {
			result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value));
		});

		return result.join('&');
	};

	$.fn.submit = function (callback) {
		if (callback) {
			this.bind('submit', callback);
		} else if (this.length) {
			var event = $.Event('submit');

			this.eq(0).trigger(event);

			if (!event.defaultPrevented) {
				this.get(0).submit();
			}
		}

		return this;
	};
})(Yaex)


+(function (window, undefined) {
	// __proto__ doesn't exist on IE<11, so redefine
	// the X function to use object extension instead
	if (!('__proto__' in {})) {
		$.Extend({
			Y: function (dom, selector) {
				dom = dom || [];
				$.Extend(dom, $.fn);
				dom.selector = selector || '';
				dom.__Y = true;
				return dom;
			},
			// this is a kludge but works
			isYaex: function (object) {
				return $.type(object) === 'array' && '__Y' in object;
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
})(this)


