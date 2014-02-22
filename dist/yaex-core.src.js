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


('Yaex', function (undefined) {

	'use strict';

	var CORE_VERSION = '0.11-dev';

	var CORE_BUILD = '1243';

	var $ = Object;

	var Yaex = Object;

	var $ClassList;

	var $EmptyArray = [];

	var $Slice = $EmptyArray.slice;

	var $Filter = $EmptyArray.filter;

	var document = window.document;

	var $DocumentElement = document.documentElement;

	var $ElementDisplay = {};

	var $ClassCache = {};

	var $FragmentReplacement = /^\s*<(\w+|!)[^>]*>/;

	var $SingleTagReplacement = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;

	var $TagExpanderReplacement = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig;

	var $ReadyReplacement = /complete|loaded|interactive/;

	var $SimpleSelectorReplacement = /^[\w-]*$/;

	var $RootNodeReplacement = /^(?:body|html)$/i;

	// Special attributes that should be get/set via method calls
	var $MethodAttributes = [
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

	var $AdjacencyOperators = [
		'after',
		'prepend',
		'before',
		'append'
	];

	var $Table = document.createElement('table');

	var $TableRow = document.createElement('tr');

	var $Containers = {
		'tr': document.createElement('tbody'),
		'tbody': $Table,
		'thead': $Table,
		'tfoot': $Table,
		'td': $TableRow,
		'th': $TableRow,
		'*': document.createElement('div')
	};

	// [[Class]] -> type pairs
	var $ClassToType = {};

	var core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;

	var $TemporaryParent = document.createElement('div');

	var $ProperitiesMap = {
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

	//----------

	Yaex.hasOwnProperty = ({}).hasOwnProperty;
	Yaex.toString = ({}).toString;
	Yaex.reContainsWordChar = null;
	Yaex.reGetFunctionBody = null;
	Yaex.reRemoveCodeComments = null;

	//----------



	//----------

	// START OF PRIVATE FUNCTIONS

	function $varDump($array, $level) {
		var $dumped_text = '';

		if (!$level) {
			$level = 0;
		}

		// The padding given at the beginning of the line.
		var $level_padding = ' ';

		for (var $j = 0; $j < $level + 1; $j++) {
			// $level_padding += '\t';
			// $level_padding += ' ';
			$level_padding += '    ';
		}

		// Array/Hashes/Objects
		if ($isObject($array)) {
			for (var $item in $array) {
				var $value = $array[$item];

				// If it is an array,
				if ($isObject($value)) {
					$dumped_text += $level_padding + "'" + $item + "' ...\n";
					$dumped_text += $varDump($value, $level + 1);
				} else {
					$dumped_text += $level_padding + "'" + $item + "' => \"" + $value + "\"\n";
				}
			}
			// Stings/Chars/Numbers etc.
		} else {
			$dumped_text = '===>' + $array + '<===(' + $Type($array) + ')';
		}

		return $dumped_text;
	}

	function $Type($object) {
		var $type;

		if ($object == null) {
			$type = String($object);
		} else if (({})[Yaex.toString.call($object)]){
			$type = Yaex.toString.call($object);
		} else {
			$type = typeof ($object);
		}

		return $type;
	}

	function $isString($object) {
		return $Type($object) === 'string';
	};

	function $isObject($object) {
		return $Type($object) === 'object';
	};

	function $isPlainObject($object) {
		// return $isObject($object) && !$isWindow($object) && Object.getPrototypeOf($object) === Object.prototype;

		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if (!$isObject($object) || $object.nodeType || $isWindow($object)) {
			return false;
		}

		// Support: Firefox <20
		// The try/catch suppresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
		try {
			if ($object.constructor && !Yaex.hasOwnProperty.call($object.constructor.prototype, 'isPrototypeOf')) {
				return false;
			}
		} catch (e) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |$object| is a plain object, created by {} or constructed with new Object
		return true;
	}

	function $isArray($object) {
		return Array.isArray($object);
	};

	function $isFunction($object) {
		if ($Type($object) === 'function') {
			return true;
		}

		return false;
	}

	function $isWindow($object) {
		return $object !== null && $object === $object.window;
	}

	function $isDocument($object) {
		return $object !== null && $object.nodeType === $object.DOCUMENT_NODE;
	}

	function $isNumber($object) {
		return !isNaN(parseFloat($object)) && isFinite($object);
	}

	function $isUndefined($object) {
		return $Type($object) === $Type();
	}

	function $Compact($array) {
		return $Filter.call($array, function ($item) {
			return $item !== null;
		});
	}

	function $likeArray($object) {
		return $Type($object.length) === 'number';
	}

	function $isArraylike($object) {
		var $length = $object.length;

		if ($isWindow($object)) {
			return false;
		}

		if ($object.nodeType === 1 && $length) {
			return true;
		}

		return $isArray($object) || !$isFunction($object) &&
			($length === 0 || $isNumber($length) && $length > 0 && ($length - 1) in $object);
	};

	function $Merge($first, $second) {
		var $l = $second.length;
		var $i = $first.length;
		var $j = 0;

		if (typeof ($l) === 'number') {
			for (; $j < $l; $j++) {
				$first[$i++] = $second[$j];
			}
		} else {
			while ($second[$j] !== undefined) {
				$first[$i++] = $second[$j++];
			}
		}

		$first.length = $i;

		return $first;
	}

	function $Unique($array) {
		return $Filter.call($array, function ($item, $index) {
			return $array.indexOf($item) === $index;
		});
	}

	function $Camelise($string) {
		return $string.replace(/-+(.)?/g, function ($match, $char) {
			return $char ? $char.toUpperCase() : '';
		});
	}

	function $RandomNumber($min, $max) {
		return Math.floor(Math.random() * ($max - $min + 1) + $min);
	}

	function $ClassReplacement($name) {
		return $name in $ClassCache ?
			$ClassCache[$name] : ($ClassCache[$name] = new RegExp('(^|\\s)' + $name + '(\\s|$)'));
	}

	function $TraverseNode($node, $function) {
		$function($node);

		for (var $key in $node.childNodes) {
			$TraverseNode($node.childNodes[$key], $function);
		}
	}

	// Return a css property mapped to a potentially vendor prefixed property
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
	function $GetStyles(elem) {
		return window.getComputedStyle(elem, null);
	}

	function $GetWindow($elem) {
		return $isWindow($elem) ? $elem : $elem.nodeType === 9 && $elem.defaultView;
	}

	function defaultDisplay(nodeName) {
		var element, display;
		if (!$ElementDisplay[nodeName]) {
			element = document.createElement(nodeName);
			document.body.appendChild(element);
			//display = getComputedStyle(element, '').getPropertyValue("display");
			display = $GetStyles(element).getPropertyValue('display');
			element.parentNode.removeChild(element);
			display === "none" && (display = "block");
			$ElementDisplay[nodeName] = display;
		}
		return $ElementDisplay[nodeName];
	}

	function $Filtered($nodes, $selector) {
		return $selector == null ? $($nodes) : $($nodes).filter($selector);
	}

	function $Contains($parent, $node) {
		return $parent !== $node && $parent.contains($node);
	}

	function funcArg(context, arg, idx, payload) {
		return $isFunction(arg) ? arg.call(context, idx, payload) : arg;
	}

	function setAttribute(node, name, value) {
		value == null ? node.removeAttribute(name) : node.setAttribute(name, value);
	}

	// Access className property while respecting SVGAnimatedString
	function className(node, value) {
		var klass = node.className;
		var svg = klass && klass.baseVal !== undefined;

		if (value === undefined) {
			return svg ? klass.baseVal : klass;
		}

		svg = svg ? (klass.baseVal = value) : (node.className = value);
	}

	function $Children(element) {
		return 'children' in element ?
			$Slice.call(element.children) :
			$.Map(element.childNodes, function (node) {
				if (node.nodeType === 1) {
					return node;
				}
			});
	}


	curCSS = function (elem, name, _computed) {
		var width, minWidth, maxWidth,
			computed = _computed || $GetStyles(elem),
			// Support: IE9
			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined,
			style = elem.style;

		if (computed) {

			if (ret === "" && !$Contains(elem.ownerDocument, elem)) {
				ret = $.Style(elem, name);
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
				val += $.CSS(elem, extra + cssExpand[i], true, styles);
			}

			if (isBorderBox) {
				// border-box includes padding, so remove it if we want content
				if (extra === "content") {
					val -= $.CSS(elem, "padding" + cssExpand[i], true, styles);
				}

				// at this point, extra isn't border nor margin, so remove border
				if (extra !== "margin") {
					val -= $.CSS(elem, "border" + cssExpand[i] + "Width", true, styles);
				}
			} else {
				// at this point, extra isn't content, so add padding
				val += $.CSS(elem, "padding" + cssExpand[i], true, styles);

				// at this point, extra isn't content nor padding, so add border
				if (extra !== "padding") {
					val += $.CSS(elem, "border" + cssExpand[i] + "Width", true, styles);
				}
			}
		}

		return val;
	}

	function getWidthOrHeight(elem, name, extra) {
		// Start with offset property, which is equivalent to the border-box value
		var valueIsBorderBox = true,
			val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
			styles = $GetStyles(elem),
			isBorderBox = $.Support.boxSizing && $.CSS(elem, "boxSizing", false, styles) === "border-box";

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

	//

	Yaex.Matches = function ($element, $selector) {
		if (!$element || $element.nodeType !== 1) {
			return false;
		}

		var $matchesSelector = $element.webkitMatchesSelector ||
			$element.mozMatchesSelector ||
			$element.oMatchesSelector ||
			$element.matchesSelector;

		if ($matchesSelector) {
			return $matchesSelector.call($element, $selector);
		}

		// Fall back to performing a selector:
		var $match;
		var $parent = $element.parentNode;
		var $temp = !$parent;

		if ($temp) {
			($parent = $TemporaryParent).appendChild($element);
		}

		$match = ~Yaex.QSA($parent, $selector).indexOf($element);

		$temp && $TemporaryParent.removeChild($element);

		return $match;
	};

	// `Yaex.Fragment` takes a html string and an optional tag name
	// to generate DOM nodes nodes from the given html string.
	// The generated DOM nodes are returned as an array.
	// This function can be overriden in plugins for example to make
	// it compatible with browsers that don't support the DOM fully.
	Yaex.Fragment = function ($html, $name, $properties) {
		var $dom;
		var $nodes;
		var $container;

		// A special case optimization for a single tag
		if ($SingleTagReplacement.test($html)) {
			$dom = $(document.createElement(RegExp.$1));
		}

		if (!$dom) {
			if ($html.replace) {
				$html = $html.replace($TagExpanderReplacement, "<$1></$2>");
			}

			if ($name === undefined) {
				$name = $FragmentReplacement.test($html) && RegExp.$1;
			}

			if (!($name in $Containers)) {
				$name = '*';
			}

			$container = $Containers[$name];

			$container.innerHTML = '' + $html;

			$dom = $.Each($Slice.call($container.childNodes), function () {
				$container.removeChild(this);
			});
		}

		if ($isPlainObject($properties)) {
			$nodes = $(dom);

			$.Each($properties, function ($key, $value) {
				if ($MethodAttributes.indexOf($key) > -1) {
					$nodes[$key]($value);
				} else {
					$nodes.attr($key, $value);
				}
			});
		}

		return $dom;
	};

	// `Yaex.Y` swaps out the prototype of the given `dom` array
	// of nodes with `$.Func` and thus supplying all the Yaex functions
	// to the array. Note that `__proto__` is not supported on Internet
	// Explorer. This method can be overriden in plugins.
	Yaex.Y = function ($dom, $selector) {
		$dom = $dom || [];

		$dom.__proto__ = $.Func;
		$dom.selector = $selector || '';

		return $dom;
	};

	// `Yaex.isY` should return `true` if the given object is a Yaex
	// collection. This method can be overriden in plugins.
	Yaex.isY = function ($object) {
		return $object instanceof Yaex.Y;
	};

	// `Yaex.init` is Yaex's counterpart to jQuery's `$.Func.init` and
	// takes a CSS selector and an optional context (and handles various
	// special cases).
	// This method can be overriden in plugins.
	Yaex.init = function (selector, context) {
		var dom;


		// If nothing given, return an empty Yaex collection
		if (!selector) {
			return Yaex.Y();
		}

		if ($isString(selector)) {
			// Optimize for string selectors
			selector = selector.trim();

			// If it's a html Fragment, create nodes from it
			// Note: In both Chrome 21 and Firefox 15, DOM error 12
			// is thrown if the Fragment doesn't begin with <
			// if (selector[0] === '<' && $FragmentReplacement.test(selector)) {
			if (selector[0] === '<' && selector[selector.length - 1] === '>' && $FragmentReplacement.test(selector) && selector.length >= 3) {
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
		} else if ($isFunction(selector)) {
			return $(document).ready(selector);
			// If a Yaex collection is given, just return it
		} else if (Yaex.isY(selector)) {
			return selector;
		} else {
			// normalize array if an array of nodes is given
			if ($isArray(selector)) {
				dom = $Compact(selector);
				// Wrap DOM nodes.
			} else if ($isObject(selector)) {
				dom = [selector];
				selector = null;
				// If it's a html Fragment, create nodes from it
			} else if ($FragmentReplacement.test(selector)) {
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

		// Create a new Yaex collection from the nodes found
		return Yaex.Y(dom, selector);
	};

	// `Yaex.QSA` is Yaex's CSS selector implementation which
	// uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
	// This method can be overriden in plugins.
	Yaex.QSA = function (element, selector) {
		var found;

		if (selector[0] == '#') {
			var maybeID = '#';
		}

		if (!maybeID && selector[0] == '.') {
			var maybeClass = '.';
		}

		// Ensure that a 1 char tag name still gets checked
		if (maybeID || maybeClass) {
			var nameOnly = selector.slice(1);
		} else {
			var nameOnly = selector;
		}

		var isSimple = $SimpleSelectorReplacement.test(nameOnly);

		return ($isDocument(element) && isSimple && maybeID) ?
			((found = element.getElementById(nameOnly)) ? [found] : []) :
			(element.nodeType !== 1 && element.nodeType !== 9) ? [] :
			$Slice.call(
				isSimple && !maybeID ?
				maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
				element.getElementsByTagName(selector) : // Or a tag
				element.querySelectorAll(selector) // Or it's not simple, and we need to query all
		);
	};

	//

	// `$` will be the base `Yaex` object. When calling this
	// function just call `Yaex.init, which makes the implementation
	// details of selecting nodes and creating Yaex collections
	// patchable in plugins.
	$ = function ($selector, $context) {
		return Yaex.init($selector, $context);
	};

	//

	$.varDump = $varDump;

	$.Type = $.type = $Type;

	$.isArray = $isArray;

	$.isArraylike = $isArraylike;

	$.isObject = $isObject;

	$.isFunction = $isFunction;

	$.isWindow = $isWindow;

	$.isDocument = $isDocument;

	$.isString = $isString;

	$.isNumeric = $.isNumber = $isNumber;

	$.isPlainObject = $isPlainObject;

	$.isUndefined = $isUndefined;

	$.likeArray = $likeArray;

	$.Unique = $Unique;

	$.Compact = $Compact;

	$.Camelize = $.camelCase = $Camelise;

	$.getContainsWordCharRegEx = function () {
		if (!Yaex.reContainsWordChar) {
			Yaex.reContainsWordChar = new RegExp('\\S+', 'g');
		}

		return Yaex.reContainsWordChar;
	};

	$.getGetFunctionBodyRegEx = function () {
		if (!Yaex.reGetFunctionBody) {
			Yaex.reGetFunctionBody = new RegExp('{((.|\\s)*)}', 'm');
		}

		return Yaex.reGetFunctionBody;
	};

	$.getRemoveCodeCommentsRegEx = function () {
		if (!Yaex.reRemoveCodeComments) {
			Yaex.reRemoveCodeComments = new RegExp("(\\/\\*[\\w\\'\\s\\r\\n\\*]*\\*\\/)|(\\/\\/[\\w\\s\\']*)", 'g');
		}

		return Yaex.reRemoveCodeComments;
	};

	$.isNull = function ($object) {
		return $Type($object) === $Type(null);
	};

	$.isObjectEmpty = function ($object) {
		for (var $name in $object) {
			if ($object.hasOwnProperty($name)) {
				return false;
			}
		}

		return true;
	};

	$.isFunctionEmpty = function ($object) {
		// Only get RegExs when needed
		var $arr = $.getGetFunctionBodyRegEx().exec($object);

		if ($arr && $arr.length > 1 && $arr[1] !== undefined) {

			var $body = $arr[1].replace($.getRemoveCodeCommentsRegEx(), '');

			if ($body && $.getContainsWordCharRegEx().test($body)) {
				return false;
			}
		}

		return true;
	};

	$.isBool = function ($object) {
		if ($Type($object) === 'boolean') {
			return true;
		}

		return false;
	};

	$.isEmpty = function ($value) {
		var $empty = [null, '', 0, false, undefined];

		var $isEmpty = false;

		if (Array.isArray($value) && $value.length === 0) {
			$isEmpty = true;
		} else if ($isFunction($value) && $.isFunctionEmpty($value)) {
			$isEmpty = true;
		} else if ($isObject($value) && $.isObjectEmpty($value)) {
			$isEmpty = true;
		} else if ($Type($value) === 'number' && isNaN($value)) {
			$isEmpty = ($value === Number.NEGATIVE_INFINITY || $value === Number.POSITIVE_INFINITY) ? false : true;
		} else {
			for (var x = $empty.length; x > 0; x--) {
				if ($empty[x - 1] === $value) {
					$isEmpty = true;
					break;
				}
			}
		}

		return $isEmpty;
	};

	$.inArray = function ($el, $arr, $x) {
		return $arr == null ? -1 : $EmptyArray.indexOf.call($arr, $el, $x);
	};

	$.Error = function ($message) {
		console.error($message);
		throw new Error($message);
	};

	$.Delay = function ($milliseconds) {
		$milliseconds = $milliseconds * 1000;

		var $start = new Date().getTime();

		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - $start) > $milliseconds) {
				break;
			}
		}
	};

	$.Dasherize = function ($string) {
		return $string.replace(/::/g, '/')
			.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
			.replace(/([a-z\d])([A-Z])/g, '$1_$2')
			.replace(/_/g, '-')
			.toLowerCase();
	};

	$.Flatten = function ($array) {
		return $array.length > 0 ? $.Func.concat.apply([], $array) : $array;
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

	$.IntoArray = function ($array, $data) {
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

	$.Trim = $.trim = function ($string) {
		return $string == null ? '' : String.prototype.trim.call($string);
	};

	// "true"  => true
	// "false" => false
	// "null"  => null
	// "42"	=> 42
	// "42.5"  => 42.5
	// "08"	=> "08"
	// JSON	=> parse if valid
	// String  => self
	$.DeserializeValue = function ($value) {
		var $num;

		try {
			return $value ?
				$value == 'true' ||
				($value == 'false' ? false :
				$value == 'null' ? null : !isNaN($num = Number($value)) && ($num + '') === $value ? $num :
				/^[\[\{]/.test($value) ? $.ParseJSON($value) :
				$value) : $value;
		} catch (e) {
			return $value;
		}
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
		if (typeof (target) === 'boolean') {
			deep = target;
			target = arguments[1] || {};
			// Skip the boolean and the target
			i = 2;
		}

		// Handle case when target is a string or something (possible in deep copy)
		if (typeof (target) !== 'object' && !$isFunction(target)) {
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
					if (deep && copy && ($isPlainObject(copy) || (copyIsArray = $isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && $isArray(src) ? src : [];

						} else {
							clone = src && $isPlainObject(src) ? src : {};
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

	Yaex.constructor = Yaex;

	$.GUID = 0;
	$.Version = CORE_VERSION;
	$.BuildNumber = CORE_BUILD;
	$.ClassToType = $ClassToType;
	$.GetWindow = $.getWindow = $GetWindow;
	$.contains = $.Contains = $Contains;
	$.RandomNumber = $RandomNumber;
	$.Merge = $.merge = $Merge;
	$.EmptyArray = $EmptyArray;
	$.GetStyles = $GetStyles;
	$.timers = [];

	$.Location = window.location;

	$.Globals = {};
	$.Now = Date.now;
	$.UserAgent = {};
	$.Browser = {};

	// Module Compatibility
	$.Support = {};
	$.Expr = $.expr = {};
	$.UUID = 0;

	$.Map = $.map = function (elements, callback) {
		var value, values = [],
			i, key;
		if ($likeArray(elements))
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

		return $.Flatten(values);
	};

	$.Each = $.each = function (elements, callback) {
		var i;
		var key;

		if ($isArraylike(elements)) {
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

	$.Grep = $.grep = function ($elements, $callback) {
		return $Filter.call($elements, $callback);
	};

	// Populate the $ClassToType map
	$.Each('Boolean Number String Function Array Date RegExp Object Error'.split(' '), function ($x, $name) {
		$ClassToType['[object ' + $name + ']'] = $name.toLowerCase();
	});

	//

	//

	//

	// Define methods that will be available on all
	// Yaex collections
	// $.Func = Yaex.init.prototype = Yaex.prototype = {
	$.Func = $.fn = {
		// Because a collection acts like an array
		// copy over these useful array functions.
		forEach: $EmptyArray.forEach,
		reduce: $EmptyArray.reduce,
		push: $EmptyArray.push,
		sort: $EmptyArray.sort,
		indexOf: $EmptyArray.indexOf,
		concat: $EmptyArray.concat,
		// `map` and `slice` in the jQuery API work differently
		// from their array counterparts
		map: function (fn) {
			return $($.Map(this, function (el, i) {
				return fn.call(el, i, el);
			}));
		},
		slice: function () {
			return $($Slice.apply(this, arguments));
			// return $.pushStack($Slice.apply(this, arguments));
		},
		ready: function (callback) {
			// need to check if document.body exists for IE as that browser reports
			// document ready when it hasn't yet created the body element
			if ($ReadyReplacement.test(document.readyState) && document.body) {
				callback($);
			} else {
				document.addEventListener('DOMContentLoaded', function () {
					callback($);
				}, false);
			}

			return this;
		},
		get: function (num) {
			// return num === undefined ? $Slice.call(this) : this[num >= 0 ? num : num + this.length];

			return num == null ?
			// Return a 'Clean' array
			this.toArray() :
			// Return just the object
			(num < 0 ? this[this.length + num] : this[num]);
		},
		toArray: function () {
			// return this.get();
			return $Slice.call(this);
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
		error: $.Error,
		each: function (callback) {
			$EmptyArray.every.call(this, function (el, idx) {
				return callback.call(el, idx, el) !== false;
			});

			return this;
		},
		filter: function (selector) {
			if ($isFunction(selector)) {
				return this.not(this.not(selector));
			}

			return $($Filter.call(this, function (element) {
				return Yaex.Matches(element, selector);
			}));
		},
		add: function (selector, context) {
			return $($Unique(this.concat($(selector, context))));
		},
		is: function (selector) {
			return this.length > 0 && Yaex.Matches(this[0], selector);
		},
		not: function (selector) {
			var nodes = [];

			if ($isFunction(selector) && selector.call !== undefined) {
				this.each(function (idx) {
					if (!selector.call(this, idx)) {
						nodes.push(this);
					}
				});
			} else {
				var excludes = $isString(selector) ? this.filter(selector) :
					($likeArray(selector) && $isFunction(selector.item)) ? $Slice.call(selector) : $(selector);

				this.forEach(function (el) {
					if (excludes.indexOf(el) < 0) {
						nodes.push(el);
					}
				});
			}

			return $(nodes);
		},
		has: function (selector) {
			return this.filter(function () {
				return $isObject(selector) ?
					$Contains(this, selector) :
					$(this).find(selector).size();
			});
		},
		eq: function (idx) {
			return idx === -1 ? this.slice(idx) : this.slice(idx, +idx + 1);
		},
		first: function () {
			var el = this[0];
			return el && !$isObject(el) ? el : $(el);
		},
		last: function () {
			var el = this[this.length - 1]
			return el && !$isObject(el) ? el : $(el)
		},
		find: function (selector) {
			var result, $this = this
			if (typeof (selector) == 'object')
				result = $(selector).filter(function () {
					var node = this
					return $EmptyArray.some.call($this, function (parent) {
						return $Contains(parent, node)
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
			if (typeof (selector) == 'object')
				collection = $(selector);
			while (node && !(collection ? collection.indexOf(node) >= 0 : Yaex.Matches(node, selector)))
				node = node !== context && !$isDocument(node) && node.parentNode;
			return $(node);
		},
		parentsUntil: function (selector, context) {
			var nodes = this;
			var collection = false;
			var parents = [];

			if ($isObject(selector)) {
				collection = $(selector);
			}

			while (nodes.length > 0) {
				nodes = $.Map(nodes, function (node) {
					while (node && !(collection ? collection.indexOf(node) >= 0 : Yaex.Matches(node, selector))) {
						node = node !== context && !$isDocument(node) && node.parentNode;
						parents.push(node);
					}
				});
			}

			return $(parents);
		},
		parents: function (selector) {
			var ancestors = [];
			var nodes = this;

			while (nodes.length > 0) {
				nodes = $.Map(nodes, function (node) {
					if ((node = node.parentNode) && !$isDocument(node) && ancestors.indexOf(node) < 0) {
						ancestors.push(node);
						return node;
					}
				});
			}

			return $Filtered(ancestors, selector);
		},
		parent: function (selector) {
			return $Filtered($Unique(this.pluck('parentNode')), selector);
		},
		children: function (selector) {
			return $Filtered(this.map(function () {
				return $Children(this);
			}), selector);
		},
		contents: function () {
			return this.map(function () {
				return $Slice.call(this.childNodes);
			});
		},
		siblings: function (selector) {
			return $Filtered(this.map(function (i, el) {
				return $Filter.call($Children(el.parentNode), function (child) {
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
			return $.Map(this, function (el) {
				return el[property];
			});
		},
		show: function () {
			return this.each(function () {
				this.style.display == "none" && (this.style.display = '')
				if ($GetStyles(this).getPropertyValue("display") == "none")
					this.style.display = defaultDisplay(this.nodeName)
			})
		},
		replaceWith: function (newContent) {
			return this.before(newContent).remove()
		},
		wrap: function (structure) {
			var func = $isFunction(structure)
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
				$(this[0]).before(structure = $(structure));

				var children;

				// Drill down to the inmost element
				while ((children = structure.children()).length) {
					structure = children.first();
				}

				$(structure).append(this);
			}

			return this;
		},
		wrapInner: function (structure) {
			var func = $isFunction(structure)
			return this.each(function (index) {
				var self = $(this),
					contents = self.contents(),
					dom = func ? structure.call(this, index) : structure
					contents.length ? contents.wrapAll(dom) : self.append(dom);
			})
		},
		unwrap: function () {
			this.parent().each(function () {
				$(this).replaceWith($(this).children());
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
			return ($isString(name) && value === undefined) ?
				(this.length == 0 || this[0].nodeType !== 1 ? undefined :
				(name == 'value' && this[0].nodeName == 'INPUT') ? this.val() :
				(!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
			) :
				this.each(function (idx) {
					if (this.nodeType !== 1)
						return
					if ($isObject(name))
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
			name = $ProperitiesMap[name] || name;
			return (value === undefined) ?
				(this[0] && this[0][name]) :
				this.each(function (idx) {
					this[name] = funcArg(this, value, idx, this[name]);
				});
		},
		data: function (name, value) {
			var data = this.attr('data-' + $.Dasherize(name), value)
			return data !== null ? $.DeserializeValue(data) : undefined
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
				var computedStyle = $GetStyles(element);

				if (!element) {
					return;
				}

				if (typeof (name) == 'string') {
					return element.style[$Camelise(name)] || computedStyle.getPropertyValue(name);
				} else if ($isArray(name)) {
					var props = {};

					$.Each($isArray(name) ? name : [name], function (_, prop) {
						props[prop] = (element.style[$Camelise(prop)] || computedStyle.getPropertyValue(prop));
					});

					return props;
				}
			}

			if ($Type(name) == 'string') {
				if (!value && value !== 0) {
					this.each(function () {
						this.style.removeProperty($.Dasherize(name));
					});
				}
			}

			return $.Access(this, function (elem, name, value) {
				var styles;
				var len;
				var map = {};
				var i = 0;

				if ($isArray(name)) {
					styles = $GetStyles(elem);
					len = name.length;

					for (; i < len; i++) {
						map[name[i]] = $.CSS(elem, name[i], false, styles);
					}

					return map;
				}

				return value !== undefined ?
					$.Style(elem, name, value) :
					$.CSS(elem, name);
			}, name, value, arguments.length > 1);
		},
		index: function (element) {
			return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
		},
		hasClass: function (name) {
			if (!name)
				return false
			return $EmptyArray.some.call(this, function (el) {
				return this.test(className(el))
			}, $ClassReplacement(name))
		},
		addClass: function (name) {
			if (!name)
				return this
			return this.each(function (idx) {
				$ClassList = []
				var cls = className(this),
					newName = funcArg(this, name, idx, cls)
					newName.split(/\s+/g).forEach(function (klass) {
						if (!$(this).hasClass(klass))
							$ClassList.push(klass)
					}, this)
					$ClassList.length && className(this, cls + (cls ? " " : "") + $ClassList.join(" "))
			})
		},
		removeClass: function (name) {
			return this.each(function (idx) {
				if (name === undefined)
					return className(this, '')
				$ClassList = className(this)
				funcArg(this, name, idx, $ClassList).split(/\s+/g).forEach(function (klass) {
					$ClassList = $ClassList.replace($ClassReplacement(klass), " ")
				})
				className(this, $ClassList.trim())
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
				parentOffset = $RootNodeReplacement.test(offsetParent[0].nodeName) ? {
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
				var offsetParent = this.offsetParent || $DocumentElement;

				while (offsetParent && (!$.nodeName(offsetParent, 'html') && $.CSS(offsetParent, 'position') === 'static')) {
					offsetParent = offsetParent.offsetParent;
				}

				return offsetParent || $DocumentElement;
			});
		},
		detach: function (selector) {
			return this.remove(selector, true);
			// return this.remove(selector);
		},
		splice: [].splice
	};

	$.Func.extend = $.Extend;

	$.Extend({
		ParseJSON: JSON.parse,
		// Cross-browser xml parsing
		ParseXML: function (data) {
			var xml;
			var tmp;

			if (!data || typeof (data) !== 'string') {
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
		Noop: function () {},
		// Evaluates a script in a global context
		globalEval: function (code) {
			var script;
			var indirect = eval;

			code = $.Trim(code);

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
		Expando: 'YAEX' + ($.Version + $.BuildNumber + $RandomNumber(10000, 70000)).replace(/\D/g, ''),

		// Multifunctional method to get and set values of a collection
		// The value/s can optionally be executed if it's a function
		Access: function (elems, fn, key, value, chainable, emptyGet, raw) {
			var i = 0;
			var length = elems.length;
			var bulk = key === null;

			// Sets many values
			if ($Type(key) === 'object') {
				chainable = true;
				for (i in key) {
					$.Access(elems, fn, i, key[i], true, emptyGet, raw);
				}
				// Sets one value
			} else if (value !== undefined) {
				chainable = true;

				if (!$isFunction(value)) {
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
			var ret = $Merge(this.constructor(), elems);

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

	$.NodeName = $.nodeName;
	$.PushStack = $.pushStack;

	// Generate the `width` and `height` functions
	['width', 'height'].forEach(function (dimension) {
		var dimensionProperty =
			dimension.replace(/./, function (m) {
				return m[0].toUpperCase();
			});

		$.Func[dimension] = function (value) {
			var offset, el = this[0];
			if (value === undefined)
				return $isWindow(el) ? el['inner' + dimensionProperty] :
					$isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
					(offset = this.offset()) && offset[dimension];
			else
				return this.each(function (idx) {
					el = $(this);
					el.css(dimension, funcArg(this, value, idx, el[dimension]()));
				});
		};
	});

	// Create scrollLeft and scrollTop methods
	$.Each({
		scrollLeft: 'pageXOffset',
		scrollTop: 'pageYOffset'
	}, function (method, prop) {
		var top = 'pageYOffset' === prop;

		$.Func[method] = function (val) {
			return $.Access(this, function (elem, method, val) {
				var win = $GetWindow(elem);

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

	$.CSSExpand = cssExpand;

	$.Extend({
		Find: function (selector, context, results, seed) {
			var elem;
			var nodeType;
			var i = 0;

			results = results || [];
			context = context || document;

			// Same basic safeguard as Sizzle
			if (!selector || !$isString(selector)) {
				return results;
			}

			// Early return if context is not an element or document
			if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
				return [];
			}

			if (seed) {
				while ((elem = seed[i++])) {
					if ($.Find.matchesSelector(elem, selector)) {
						results.push(elem);
					}
				}
			} else {
				$Merge(results, context.querySelectorAll(selector));
			}

			return results;
		},
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
		Style: function (elem, name, value, extra) {
			// Don't set styles on text and comment nodes
			if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
				return;
			}

			// Make sure that we're working with the right name
			var ret, type, hooks,
				origName = $Camelise(name),
				style = elem.style,
				newvalue;

			name = $.CSS_Properities[origName] || ($.CSS_Properities[origName] = vendorPropName(style, origName));

			// gets hook for the prefixed version
			// followed by the unprefixed version
			hooks = $.CSS_Hooks[name] || $.CSS_Hooks[origName];

			newvalue = value;

			// Check if we're setting a value
			if (value !== undefined) {
				type = typeof (value);

				// convert relative number strings (+= or -=) to relative numbers. #7345
				if (type === 'string' && (ret = rrelNum.exec(value))) {
					value = (ret[1] + 1) * ret[2] + parseFloat($.CSS(elem, name));

					// Fixes bug #9237
					type = 'number';
				}

				// Make sure that NaN and null values aren't set. See: #7116
				if (value == null || type === 'number' && isNaN(value)) {
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
		CSS: function (elem, name, extra, styles) {
			var val, num, hooks,
				origName = $Camelise(name);

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
				return extra === true || $isNumber(num) ? num || 0 : val;
			}

			return val;
		}
	});

	$.Extend($.Find, {
		matches: function (expr, elements) {
			return $.Find(expr, null, null, elements);
		},

		matchesSelector: function (elem, expr) {
			return matches.call(elem, expr);
		},

		attr: function (elem, name) {
			return elem.getAttribute(name);
		}
	});

	$.Each(['height', 'width'], function (i, name) {
		$.CSS_Hooks[name] = {
			get: function (elem, computed, extra) {
				if (computed) {
					// certain elements can have dimension info if we invisibly show them
					// however, it must have a current display style that would benefit from this
					return elem.offsetWidth === 0 && rdisplayswap.test($.CSS(elem, "display")) ?
						$.Swap(elem, cssShow, function () {
							return getWidthOrHeight(elem, name, extra);
						}) :
						getWidthOrHeight(elem, name, extra);
				}
			},
			set: function (elem, value, extra) {
				var styles = extra && $GetStyles(elem);
				return setPositiveNumber(elem, value, extra ?
					augmentWidthOrHeight(
						elem,
						name,
						extra,
						$.Support.boxSizing && $.CSS(elem, "boxSizing", false, styles) === "border-box",
						styles
					) : 0
				);
			}
		};
	});

	$.Each({
		Height: 'height',
		Width: 'width'
	}, function (name, type) {
		$.Each({
			padding: 'inner' + name,
			content: type,
			'': 'outer' + name
		}, function (defaultExtra, funcName) {
			// margin is only for outerHeight, outerWidth
			$.Func[funcName] = function (margin, value) {
				var chainable = arguments.length && (defaultExtra || typeof (margin) !== 'boolean');
				var extra = defaultExtra || (margin === true || value === true ? 'margin' : 'border');

				return $.Access(this, function (elem, type, value) {
					var doc;

					if ($isWindow(elem)) {
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
					$.CSS(elem, type, extra) :
					// Set width or height on the element
					$.Style(elem, type, value, extra);
				}, type, chainable ? margin : undefined, chainable, null);
			};
		});
	});

	// Generate the `after`, `prepend`, `before`, `append`,
	// `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
	$AdjacencyOperators.forEach(function (operator, operatorIndex) {
		var inside = operatorIndex % 2; //=> prepend, append

		$.Func[operator] = function () {
			// arguments can be nodes, arrays of nodes, Yaex objects and HTML strings
			var argType, nodes = $.Map(arguments, function (arg) {
					argType = $Type(arg);
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

					$TraverseNode(parent.insertBefore(node, target), function (el) {
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
		$.Func[inside ? operator + 'To' : 'insert' + (operatorIndex ? 'Before' : 'After')] = function (html) {
			$(html)[operator](this);
			return this;
		};
	});

	Yaex.Y.prototype = $.Func;

	$.Yaex = Yaex;

	if (typeof (module) === 'object' && module && typeof (module.exports) === 'object') {
		// Expose Yaex as module.exports in loaders that implement the Node
		// module pattern (including browserify). Do not create the global, since
		// the user will be storing it themselves locally, and globals are frowned
		// upon in the Node module world.
		module.exports = Yaex;
	} else {
		// Register as a named AMD module, since Yaex can be concatenated with other
		// files that may use define, but not via a proper concatenation script that
		// understands anonymous AMD modules. A named AMD is safest and most robust
		// way to register. Lower-case yaex is used because AMD module names are
		// derived from file names, and Yaex is normally delivered in a lower-case
		// file name. Do this after creating the global
		if (typeof (define) === 'function' && define.amd) {
			define('yaex', [], function () {
				return Yaex;
			});
		}
	}

	if ($Type(window) === 'object' && $Type(window.document) === 'object') {
		// 'Yaex' in window || (window.Yaex = Yaex);
		// '$' in window || (window.$ = $);
		'$' in window || (window.Yaex = window.$ = $);
	}
})()


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

	var undefined;

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
		if (!$.isString(events)) {
			$.Each(events, iterator);
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

			$.Each(eventMethods, function (name, predicate) {
				var sourceMethod = source[name];

				event[name] = function () {
					this[predicate] = returnTrue;
					return sourceMethod && sourceMethod.apply(source, arguments);
				};

				event[predicate] = returnFalse;
			});

			if (!$.isUndefined(source.defaultPrevented) ? source.defaultPrevented :
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
			if (!ignoreProperties.test(key) && !$.isUndefined(event[key])) {
				proxy[key] = event[key];
			}
		}

		return compatible(proxy, event);
	}

	$.Yaex.Event = {};


	$.Yaex.Event = {
		add: function (element, events, fn, data, selector, delegator, capture) {
			// var id = yid(element);
			var set = _handlers(element);
			// var _set = (handlers[id] || (handlers[id] = []));

			// var type;

			events.split(/\s/).forEach(function (event) {
				if (event == 'ready') {
					return $(document).ready(fn);
				}

				var handler = parse(event);

				handler.fn = fn;
				handler.sel = selector;

				// emulate mouseenter, mouseleave
				if (handler.e in hover) {
					fn = function (e) {
						var related = e.relatedTarget;

						if (!related || (related !== this && !$.Contains(this, related))) {
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
					element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
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
						element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
					}
				});
			});
		}
	};

	$.Extend({
		dispacher: function (eventType, obj) {
			var dispatcher = function (event, event_type, handler) {
				try {
					var classes = [];
					var clsStr = $(event.target || event.srcElement).attr('class');

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
				$('body')[eventTypes[x]]((function (evt) {
					return function (e) {
						dispatcher(e, evt, obj);
					}
				})(eventTypes[x]));
			}
		}
	});

	$.proxy = $.Proxy = function (callback, context) {
		if ($.isFunction(callback)) {
			var proxyFn = function () {
				return callback.apply(context, arguments);
			};

			proxyFn.YID = yid(callback);

			return proxyFn;
		} else if ($.isString(context)) {
			return $.proxy(callback[context], callback);
		} else {
			throw new TypeError('expected function');
		}
	};

	$.fn.bind = function (event, data, callback) {
		return this.on(event, data, callback);
	};

	$.fn.unbind = function (event, callback) {
		return this.off(event, callback)
	};

	$.fn.one = function (event, selector, data, callback) {
		return this.on(event, selector, data, callback, 1);
	};

	$.fn.delegate = function (selector, event, callback) {
		return this.on(event, selector, callback);
	};

	$.fn.undelegate = function (selector, event, callback) {
		return this.off(event, selector, callback);
	};

	$.fn.live = function (event, callback) {
		$(document.body).delegate(this.selector, event, callback);
		return this;
	};

	$.fn.die = function (event, callback) {
		$(document.body).undelegate(this.selector, event, callback);
		return this;
	};

	$.fn.on = function (event, selector, data, callback, one) {
		var autoRemove;
		var delegator;
		var $this = this;

		if (event && !$.isString(event)) {
			$.Each(event, function (type, fn) {
				$this.on(type, selector, data, fn, one);
			});

			return $this;
		}

		if (!$.isString(selector) && !$.isFunction(callback) && callback !== false) {
			callback = data;
			data = selector;
			selector = undefined;
		}

		if ($.isFunction(data) || data === false) {
			callback = data;
			data = undefined;
		}

		if (callback === false) {
			callback = returnFalse;
		}

		return $this.each(function (_, element) {
			if (one) {
				autoRemove = function (e) {
					$.Yaex.Event.remove(element, e.type, callback);
					return callback.apply(this, arguments);
				}
			}

			if (selector) {
				delegator = function (e) {
					var evt;
					var match = $(e.target).closest(selector, element).get(0);

					if (match && match !== element) {
						evt = $.Extend(createProxy(e), {
							currentTarget: match,
							liveFired: element
						});

						return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)));
					}
				};
			}

			$.Yaex.Event.add(element, event, callback, data, selector, delegator || autoRemove);
		});
	};

	$.fn.off = function (event, selector, callback) {
		var $this = this;

		if (event && !$.isString(event)) {
			$.Each(event, function (type, fn) {
				$this.off(type, selector, fn);
			});

			return $this;
		}

		if (!$.isString(selector) && !$.isFunction(callback) && callback !== false) {
			callback = selector;
			selector = undefined;
		}

		if (callback === false) {
			callback = returnFalse;
		}

		return $this.each(function () {
			$.Yaex.Event.remove(this, event, callback, selector);
		});
	};

	$.fn.trigger = function (event, args) {
		if ($.isString(event) || $.isPlainObject(event)) {
			event = $.Event(event);
		} else {
			event = compatible(event);
		}

		event._args = args;

		return this.each(function () {
			// items in the collection might not be DOM elements
			if ('dispatchEvent' in this) {
				this.dispatchEvent(event);
			} else {
				$(this).triggerHandler(event, args);
			}
		});
	};

	// triggers event handlers on current element just as if an event occurred,
	// doesn't trigger an actual event, doesn't bubble
	$.fn.triggerHandler = function (event, args) {
		var e;
		var result;

		this.each(function (i, element) {
			e = createProxy($.isString(event) ? $.Event(event) : event);
			e._args = args;
			e.target = element;

			$.Each(findHandlers(element, event.type || event), function (i, handler) {
				result = handler.proxy(e);

				if (e.isImmediatePropagationStopped()) {
					return false
				}
			});
		});

		return result;
	};

	// shortcut methods for `.bind(event, fn)` for each event type
	('focusin focusout load resize scroll unload click dblclick ' +
		'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
		'change select submit keydown keypress keyup error contextmenu wheel').split(' ').forEach(function (event) {
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

	// Generate extended `remove` and `empty` functions
	['remove', 'empty'].forEach(function (method) {
		var origFn = $.fn[method];

		$.fn[method] = function () {
			var elements = this.find('*');

			if (method === 'remove') {
				elements = elements.add(this);
			}

			elements.forEach(function (elem) {
				$.Yaex.Event.remove(elem);
			});

			return origFn.call(this);
		};
	});

	$.Event = function (type, props) {
		if (!$.isString(type)) {
			props = type;
			type = props.type;
		}

		var event = document.createEvent(specialEvents[type] || 'Events');

		var bubbles = true;

		if (props) {
			for (var name in props) {
				(name == 'bubbles') ? (bubbles = !! props[name]) : (event[name] = props[name]);
			}
		}

		event.initEvent(type, bubbles, true);

		return compatible(event);
	};
})(Yaex)


/**
 * FX - Animation methods for Yaex
 *
 *
 * @depends: Yaex.js | Core, Selector, Data, Event, Extra
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function ($, undefined) {
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

	$.each(vendors, function (vendor, event) {
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

	$.fx = {
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

	$.fn.animate = function (properties, duration, ease, callback, delay) {
		if ($.isFunction(duration)) {
			callback = duration;
			ease = undefined;
			duration = undefined;
		}

		if ($.isFunction(ease)) {
			callback = ease;
			ease = undefined;
		}

		if ($.isPlainObject(duration)) {
			ease = duration.easing;
			callback = duration.complete;
			delay = duration.delay;
			duration = duration.duration;
		}

		if (duration) {
			duration = (typeof duration == 'number' ? duration :
				($.fx.speeds[duration] || $.fx.speeds._default)) / 1000;
		}

		if (delay) {
			delay = parseFloat(delay) / 1000;
		}

		return this.anim(properties, duration, ease, callback, delay);
	};

	$.fn.anim = function (properties, duration, ease, callback, delay) {
		var key, cssValues = {}, cssProperties, transforms = '',
			that = this,
			wrappedCallback, endEvent = $.fx.transitionEnd,
			fired = false;

		if (duration === undefined) {
			duration = $.fx.speeds._default / 1000;
		}

		if (delay === undefined) delay = 0;
		if ($.fx.off) duration = 0;

		if (typeof properties === 'string') {
			// keyframe animation
			cssValues[animationName] = properties
			cssValues[animationDuration] = duration + 's'
			cssValues[animationDelay] = delay + 's'
			cssValues[animationTiming] = (ease || 'linear')
			endEvent = $.fx.animationEnd
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
				$(event.target).unbind(endEvent, wrappedCallback);
			} else
				$(this).unbind(endEvent, wrappedCallback); // triggered by setTimeout

			fired = true;
			$(this).css(cssReset);
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
})(Yaex)

/**
 * FX.Methods - Extra animation methods for Yaex
 *
 *
 * @depends: Yaex.js | Core, Selector, Data, Event, Extra, FX
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function ($, undefined) {
	'use strict';
	var origShow = $.fn.show;
	var origHide = $.fn.hide;
	var origToggle = $.fn.toggle;

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
			el.css($.fx.cssPrefix + 'transform-origin', '0 0');
		}
		return el.animate(props, speed, null, callback);
	}

	function hide(el, speed, scale, callback) {
		return anim(el, speed, 0, scale, function () {
			origHide.call($(this));
			callback && callback.call(this);
		});
	}

	$.fn.show = function (speed, callback) {
		origShow.call(this);
		if (speed === undefined) speed = 0;
		else this.css('opacity', 0);
		return anim(this, speed, 1, '1,1', callback);
	};

	$.fn.hide = function (speed, callback) {
		if (speed === undefined) return origHide.call(this);
		else return hide(this, speed, '0,0', callback);
	};

	$.fn.toggle = function (speed, callback) {
		if (speed === undefined || typeof speed == 'boolean')
			return origToggle.call(this, speed);
		else return this.each(function () {
			var el = $(this);
			el[el.css('display') == 'none' ? 'show' : 'hide'](speed, callback);
		});
	};

	$.fn.fadeTo = function (speed, opacity, callback) {
		return anim(this, speed, opacity, null, callback);
	};

	$.fn.fadeIn = function (speed, callback) {
		var target = this.css('opacity');
		if (target > 0) this.css('opacity', 0);
		else target = 1;
		return origShow.call(this).fadeTo(speed, target, callback);
	};

	$.fn.fadeOut = function (speed, callback) {
		return hide(this, speed, null, callback);
	};

	$.fn.fadeToggle = function (speed, callback) {
		return this.each(function () {
			var el = $(this);
			el[(el.css('opacity') === 0 || el.css('display') === 'none') ? 'fadeIn' : 'fadeOut'](speed, callback);
		});
	};

	$.fn.stop = function (type, clearQueue, gotoEnd) {
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
				timers = $.timers,
				data = $.data_priv.get(this);

			console.log(timers);

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
				$.dequeue(this, type);
			}
		});
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
					$('<div>').append($.ParseHTML(responseText)).find(selector) :
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
				$.Extend(dom, $.Func);
				dom.selector = selector || '';
				dom._Y_ = true;
				return dom;
			},

			// This is a kludge but works
			isY: function (object) {
				return $.Type(object) === 'array' && '_Y_' in object;
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


////// ECMAScript 5 style notation
if (Object.prototype.__defineGetter__ && !Object.defineProperty) {
	Object.defineProperty = function (obj, prop, desc) {
		if ("get" in desc) obj.__defineGetter__(prop, desc.get);
		if ("set" in desc) obj.__defineSetter__(prop, desc.set);
	}
}

// Check dependence files
if (typeof ($) !== 'function' || !! !window.Yaex) {
	throw 'ObjectOriented: not found Yaex. Please ensure `Yaex.js` is referenced before the `ObjectOriented.js` file.';
}

/**
 * ObjectOriented - Object oriented implementation using Yaex's API
 *
 *
 * @depends: Yaex.js | Core
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function ($) {
	'use strict';

	var global = this; // [Window object]
	var slice = [].slice;

	// Yaex Module : 
	$.isString = $.isString || function (s) {
		return typeof s === 'string';
	};

	$.isDefined = $.isDefined || function (o) {
		return typeof o !== 'undefined';
	};

	$.akimana = $.akimana || {};
	$.akimana.app = $.akimana.app || {};

	/**
	 * set accessor like a ES5
	 * @param object{object} required,
	 * @param object{object} required, {prop:{set:<function>, get:<function>}, ... }
	 */
	function setAccessor(object, props) {
		if ($.isObject(object) && $.isObject(props)) {
			// define setter and getter
			(function (obj, props) {
				for (var name in props) {
					Object.defineProperty(obj, name, props[name]);
				}
			})(object, props);
		}
	}

	/**
	 * createClass, Class builder for OOP
	 * implemented `new` operator checker : throw error message when not use `new`.
	 *
	 * @usage $.OO.create('className', classMembers);
	 * @param className{string} required, Named oo-class.
	 * @param classMembers{object} required,
	 */

	/**
	 * inherit class, overloaded createClass.
	 * @usage $.OO.create(className, baseClass, classMembers);
	 * @param className{string} required, Named oo-subclass.
	 * @param baseClass{function} required, superclass created with createClass method.
	 * @param classMembers{string} required, oo-subclass members.
	 */
	function createClass() {
		var len, objectOrientedClassName, baseClass, members, klass;

		len = arguments.length;
		objectOrientedClassName = arguments[0];
		baseClass = arguments[1];
		members = arguments[len - 1];

		// Check arguments type
		if (!$.isString(objectOrientedClassName) && $.trim(objectOrientedClassName) !== '') {
			throw TypeError('not defined $.OO ClassName in 1st argument, must be {string}.');
		}
		if (!(len === 2 && $.isObject(members)) && !(len === 3 && $.isFunction(baseClass) && $.isObject(members))) {
			throw TypeError('wrong arguments.');
		}
		if ( !! !members.initialize && !$.isFunction(members.initialize)) {
			throw TypeError('not defined initialize method in member object.');
		}
		
		// Implement `new` operator error check.
		eval('klass=function ' + objectOrientedClassName + '(){try {this.initialize.apply(this, arguments)}catch(e){console.log(e.stack);throw "required `new` operator in `' + objectOrientedClassName + '`."}}');
		
		// Inherit
		if (len === 3) {
			klass.prototype = new baseClass;
			klass.prototype.constructor = klass;
		}

		$.Extend(klass.prototype, members);

		return klass;
	}

	/**
	 * check `is-a` utility.
	 * @param a{ObjectOrientedClass} subClass
	 * @param b{ObjectOrientedClass} superClass
	 */
	function isA(a, b) {
		var tmp = ($.isFunction(a)) ? new a : a;

		var rslt = false;

		while (!rslt) {
			rslt = tmp instanceof b;

			if (rslt || tmp instanceof Object) {
				break;
			}

			tmp = tmp.__proto__;
		}

		return rslt;
	}

	$.OO = {
		accessor: setAccessor,
		create: createClass,
		isA: isA
	};
})(Yaex)


+(function ($) {
	'use strict';
	var cache = [];
	var timeout;

	$.fn.remove = function () {
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
})(Yaex)


+(function ($) {
	'use strict';

	/*
	 * Detect Suite
	 *
	 * Tests the client against a variety of modern browser features.
	 * These tests are primarily from Mark Pilgrim's "Dive Into HTML5" section
	 * "The All-In-One Almost-Alphabetical No-Bullshit Guide to Detecting
	 * Everything."
	 *
	 * You can find "Dive Into HTML5" here: http://www.diveintohtml5.net/
	 *
	 * "Dive Into HTML5" is protected by (CC BY 3.0):
	 * http://creativecommons.org/licenses/by/3.0/
	 *
	 * @return (boolean) Whether or not the client supports a given feature.
	 **/

	function testInput(inputType) {
		var i = document.createElement('input');

		i.setAttribute('type', inputType);

		return i.type !== 'text';
	}

	function detect(user_agent) {
		var OS = this.OS = {};
		var Browser = this.Browser = {};

		// console.log(user_agent);

		var platform = user_agent.match(/Linux/) || user_agent.match(/Windows/) || user_agent.match(/iOS/) || user_agent.match(/Android/) || 'Unknown';

		var webkit = user_agent.match(/Web[kK]it[\/]{0,1}([\d.]+)/);
		// var gecko = user_agent.match(/Gecko[\/]{0,1}([\d.]+)/);
		var android = user_agent.match(/(Android);?[\s\/]+([\d.]+)?/);
		var ipad = user_agent.match(/(iPad).*OS\s([\d_]+)/);
		var ipod = user_agent.match(/(iPod)(.*OS\s([\d_]+))?/);
		var iphone = !ipad && user_agent.match(/(iPhone\sOS)\s([\d_]+)/);
		var webos = user_agent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/);
		var touchpad = webos && user_agent.match(/TouchPad/);
		var kindle = user_agent.match(/Kindle\/([\d.]+)/);
		var silk = user_agent.match(/Silk\/([\d._]+)/);
		var blackberry = user_agent.match(/(BlackBerry).*Version\/([\d.]+)/);
		var bb10 = user_agent.match(/(BB10).*Version\/([\d.]+)/);
		var rimtabletos = user_agent.match(/(RIM\sTablet\sOS)\s([\d.]+)/);
		var playbook = user_agent.match(/PlayBook/);
		var chrome = user_agent.match(/Chrome\/([\d.]+)/) || user_agent.match(/CriOS\/([\d.]+)/);
		var firefox = user_agent.match(/Firefox\/([\d.]+)/);
		var ie = user_agent.match(/MSIE ([\d.]+)/);
		var safari = webkit && user_agent.match(/Mobile\//) && !chrome;
		var webview = user_agent.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/) && !chrome;

		ie = user_agent.match(/MSIE\s([\d.]+)/);

		//---

		// TODO: clean this up with a better OS/Browser seperation:
		// - discern (more) between multiple browsers on android
		// - decide if kindle fire in silk mode is android or not
		// - Firefox on Android doesn't specify the Android version
		// - possibly devide in OS, device and Browser hashes

		if (Browser.Webkit = !! webkit) {
			Browser.Version = webkit[1];
		}

		// if (Browser.Gecko = !! gecko) {
		// 	Browser.Version = gecko[1];
		// }

		if (android) {
			OS.Android = true;
			OS.Version = android[2];
		}

		if (iphone && !ipod) {
			OS.iOS = OS.iPhone = true;
			OS.Version = iphone[2].replace(/_/g, '.');
		}

		if (ipad) {
			OS.iOS = OS.iPad = true;
			OS.Version = ipad[2].replace(/_/g, '.');
		}

		if (ipod) {
			OS.iOS = OS.iPod = true;
			OS.Version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
		}

		if (webos) {
			OS.webOS = true;
			OS.Version = webos[2];
		}

		if (touchpad) {
			OS.Touchpad = true;
		}

		if (blackberry) {
			OS.Blackberry = true;
			OS.Version = blackberry[2];
		}

		if (bb10) {
			OS.BB10 = true;
			OS.Version = bb10[2];
		}

		if (rimtabletos) {
			OS.Rimtabletos = true;
			OS.Version = rimtabletos[2];
		}

		if (playbook) {
			Browser.Playbook = true;
		}

		if (kindle) {
			OS.Kindle = true;
			OS.Version = kindle[1];
		}

		if (silk) {
			Browser.Silk = true;
			Browser.Version = silk[1];
		}

		if (!silk && OS.Android && user_agent.match(/Kindle Fire/)) {
			Browser.Silk = true;
		}

		if (chrome) {
			Browser.Chrome = true;
			Browser.Version = chrome[1];
		}

		if (firefox) {
			Browser.Firefox = true;
			Browser.Version = firefox[1];
		}

		if (ie) {
			Browser.IE = true;
			Browser.Version = ie[1];
		}

		if (safari && (user_agent.match(/Safari/) || !! OS.iOS)) {
			Browser.Safari = true;
		}

		if (webview) {
			Browser.WebView = true;
		}

		if (ie) {
			Browser.IE = true;
			Browser.Version = ie[1];
		}

		OS.Tablet = !! (ipad || playbook || (android && !user_agent.match(/Mobile/)) || (firefox && user_agent.match(/Tablet/)) || (ie && !user_agent.match(/Phone/) && user_agent.match(/Touch/)));
		OS.Phone = !! (!OS.Tablet && !OS.iPod && (android || iphone || webos || blackberry || bb10 || (chrome && user_agent.match(/Android/)) || (chrome && user_agent.match(/CriOS\/([\d.]+)/)) || (firefox && user_agent.match(/Mobile/)) || (ie && user_agent.match(/Touch/))));
		OS.Desktop = !! Browser.IE || Browser.Firefox || Browser.Safari || Browser.Chrome;
		OS.Platform = platform[0];
	}

	//---

	detect.call($, navigator.userAgent);

	// Make available to unit tests
	$._Detect = detect;

	//---

	$.Extend({
		Detect: {
			// Elements
			Audio: !! document.createElement('audio').canPlayType,
			Canvas: !! document.createElement('canvas').getContext,
			Command: 'type' in document.createElement('command'),
			Time: 'valueAsDate' in document.createElement('time'),
			Video: !! document.createElement('video').canPlayType,

			// Features and Attributes
			Offline: navigator.hasOwnProperty('onLine') && navigator.onLine,
			ApplicationCache: !! window.applicationCache,
			ContentEditable: 'isContentEditable' in document.createElement('span'),
			DragDrop: 'draggable' in document.createElement('span'),
			Geolocation: !! navigator.geolocation,
			History: !! (window.history && window.history.pushState),
			WebSockets: !! window.WebSocket,
			WebWorkers: !! window.Worker,

			// Forms
			Autofocus: 'autofocus' in document.createElement('input'),
			InputPlaceholder: 'placeholder' in document.createElement('input'),
			TextareaPlaceholder: 'placeholder' in document.createElement('textarea'),
			InputTypeEmail: testInput('email'),
			InputTypeNumber: testInput('number'),
			InputTypeSearch: testInput('search'),
			InputTypeTel: testInput('tel'),
			InputTypeUrl: testInput('url'),

			// Storage
			IndexDB: !! window.indexedDB,
			LocalStorage: 'localStorage' in window && window['localStorage'] !== null,
			WebSQL: !! window.openDatabase,

			// Touch and orientation capabilities.
			Orientation: 'orientation' in window,
			Touch: 'ontouchend' in document,
			ScrollTop: ('pageXOffset' in window || 'scrollTop' in document.documentElement) && !$.OS.webOS,

			// Propietary features
			Standalone: 'standalone' in window.navigator && window.navigator.standalone
		}
	});

	/*
	 * Return (boolean) of likely client device classifications.
	 **/
	$.Extend({
		Device: {
			Mobile: (screen.width < 768),
			Tablet: (screen.width >= 768 && $.Detect.Orientation),
			Desktop: (screen.width >= 800 && !$.Detect.Orientation)
		}
	});
})(Yaex)


/**
 * Selector - Cross browser selector implementation using Yaex's API
 *
 *
 * @depends: Yaex.js | Core
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function ($) {
	'use strict';

	var Yaex = $.Yaex;
	var oldQsa = $.Yaex.QSA;
	var oldMatches = $.Yaex.Matches;

	var filterRE = new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*');
	var childRE = /^\s*>/;
	var classTag = 'YAEX' + (+new Date());

	//
	// Complex selectors are not supported:
	//   li:has(label:contains("foo")) + li:has(label:contains("bar"))
	//   ul.inner:first > li
	var filters = $.Expr[':'] = {
		visible: function () {
			if (visible(this)) return this;
		},
		hidden: function () {
			if (!visible(this)) return this;
		},
		selected: function () {
			if (this.selected) return this;
		},
		checked: function () {
			if (this.checked) return this;
		},
		parent: function () {
			return this.parentNode;
		},
		first: function (idx) {
			if (idx === 0) return this;
		},
		last: function (idx, nodes) {
			if (idx === nodes.length - 1) return this;
		},
		eq: function (idx, _, value) {
			if (idx === value) return this;
		},
		contains: function (idx, _, text) {
			if ($(this).text().indexOf(text) > -1) return this;
		},
		has: function (idx, _, sel) {
			if ($.Yaex.QSA(this, sel).length) return this;
		}
	};

	function visible(elem) {
		elem = $(elem);
		return !!(elem.width() || elem.height()) && elem.css('display') !== 'none';
	}

	function process(sel, fn) {
		// Quote the hash in `a[href^=#]` expression
		sel = sel.replace(/=#\]/g, '="#"]');

		var filter;
		var arg;
		var match = filterRE.exec(sel);

		if (match && match[2] in filters) {
			filter = filters[match[2]];
			arg = match[3];
			sel = match[1];
			if (arg) {
				var num = Number(arg);
				if (isNaN(num)) arg = arg.replace(/^["']|["']$/g, '');
				else arg = num;
			}
		}

		return fn(sel, filter, arg);
	}

	Yaex.QSA = function (node, selector) {
		return process(selector, function (sel, filter, arg) {
			try {
				var taggedParent;

				if (!sel && filter) {
					sel = '*';
				} else if (childRE.test(sel)) {
					// support "> *" child queries by tagging the parent node with a
					// unique class and prepending that classname onto the selector
					taggedParent = $(node).addClass(classTag);
					sel = '.' + classTag + ' ' + sel;
				}

				var nodes = oldQsa(node, sel);
			} catch (e) {
				// console.error('error performing selector: %o', selector);
				$.Error('Error performing selector: %o', selector);
				throw e;
			} finally {
				if (taggedParent) {
					taggedParent.removeClass(classTag);
				}
			}
			return !filter ? nodes :
				$.Unique($.Map(nodes, function (n, i) {
					return filter.call(n, i, nodes, arg);
				}));
		});
	};

	Yaex.Matches = function (node, selector) {
		return process(selector, function (sel, filter, arg) {
			return (!sel || oldMatches(node, sel)) && (!filter || filter.call(node, null, arg) === node);
		});
	};
})(Yaex)


/**
 * Data - Data implementation using Yaex's API
 *
 *
 * @depends: Yaex.js | Core, Selector
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function ($) {
	'use strict';
	var data = {};
	var dataAttr = $.fn.data;
	var camelize = $.camelCase;
	var exp = $.Expando + new Date();

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

		// this.Expando = 'Yaex' + ($.Version + $.BuildNumber + $.RandomNumber(10000, 70000)).replace(/\D/g, '');
		this.Expando = $.Expando + Math.random();
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
					$.Extend(owner, descriptor);
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
				if ($.isEmptyObject(cache)) {
					$.Extend(this.cache[unlock], data);
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
					stored : this.get(owner, $.camelCase(key));
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
				if ($.isArray(key)) {
					// If "name" is an array of keys...
					// When data is initially created, via ("key", "val") signature,
					// keys will be converted to camelCase.
					// Since there is no way to tell _how_ a key was added, remove
					// both plain key and camelCase key. #12786
					// This will only penalize the array argument path.
					name = key.concat(key.map($.camelCase));
				} else {
					camel = $.camelCase(key);
					// Try the string as a key before any manipulation
					if (key in cache) {
						name = [key, camel];
					} else {
						// If a key with the spaces exists, use it.
						// Otherwise, create an array by matching non-whitespace
						name = camel;
						name = name in cache ? [name] : (name.match($.core_rnotwhite) || []);
					}
				}

				i = name.length;
				while (i--) {
					delete cache[name[i]];
				}
			}
		},
		hasData: function (owner) {
			return !$.isEmptyObject(
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
	$.data_user = new Data();
	$.data_priv = new Data();

	$.Extend({
		acceptData: Data.accepts,
		hasData: function (elem) {
			return $.data_user.hasData(elem) || $.data_priv.hasData(elem);
		},
		data: function (elem, name, data) {
			return $.data_user.access(elem, name, data);
		},
		removeData: function (elem, name) {
			$.data_user.remove(elem, name);
		},
		// TODO: Now that all calls to _data and _removeData have been replaced
		// with direct calls to data_priv methods, these can be deprecated.
		_data: function (elem, name, data) {
			return $.data_priv.access(elem, name, data);
		},
		_removeData: function (elem, name) {
			$.data_priv.remove(elem, name);
		}
	});


	$.fn.extend({
		data: function (key, value) {
			var attrs, name,
				elem = this[0],
				i = 0,
				data = null;

			// Gets all values
			if (key === undefined) {
				if (this.length) {
					data = $.data_user.get(elem);

					if (elem.nodeType === 1 && !$.data_priv.get(elem, "hasDataAttrs")) {
						attrs = elem.attributes;
						for (; i < attrs.length; i++) {
							name = attrs[i].name;

							if (name.indexOf("data-") === 0) {
								name = $.camelCase(name.slice(5));
								dataAttr(elem, name, data[name]);
							}
						}
						$.data_priv.set(elem, "hasDataAttrs", true);
					}
				}

				return data;
			}

			// Sets multiple values
			if (typeof key === "object") {
				return this.each(function () {
					$.data_user.set(this, key);
				});
			}

			return $.access(this, function (value) {
				var data,
					camelKey = $.camelCase(key);

				// The calling Yaex object (element matches) is not empty
				// (and therefore has an element appears at this[ 0 ]) and the
				// `value` parameter was not undefined. An empty Yaex object
				// will result in `undefined` for elem = this[ 0 ] which will
				// throw an exception if an attempt to read a data cache is made.
				if (elem && value === undefined) {
					// Attempt to get data from the cache
					// with the key as-is
					data = $.data_user.get(elem, key);
					if (data !== undefined) {
						return data;
					}

					// Attempt to get data from the cache
					// with the key camelized
					data = $.data_user.get(elem, camelKey);
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
					var data = $.data_user.get(this, camelKey);

					// For HTML5 data-* attribute interop, we have to
					// store property names with dashes in a camelCase form.
					// This might not apply to all properties...*
					$.data_user.set(this, camelKey, value);

					// *... In the case of properties that might _actually_
					// have dashes, we need to also store a copy of that
					// unchanged property.
					if (key.indexOf("-") !== -1 && data !== undefined) {
						$.data_user.set(this, key, value);
					}
				});
			}, null, value, arguments.length > 1, null, true);
		},
		removeData: function (key) {
			return this.each(function () {
				$.data_user.remove(this, key);
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
				$.data_user.set(elem, key, data);
			} else {
				data = undefined;
			}
		}
		return data;
	}

	// Get value from node:
	// 1. first try key as given,
	// 2. then try camelized key,
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

				var camelName = $.camelCase(name);

				if (camelName in store) {
					return store[camelName];
				}
			}

			return dataAttr.call($(node), name);
		}
	}

	// Store value under camelized key on node

	function setData(node, name, value) {
		var id = node[exp] || (node[exp] = ++$.UUID);
		var store = data[id] || (data[id] = attributeData(node));

		if (name !== undefined) {
			store[camelize(name)] = value;
		}

		return store;
	}

	// Read all "data-*" attributes from a node
	function attributeData(node) {
		var store = {};

		$.each(node.attributes || $.EmptyArray, function (i, attr) {
			if (attr.name.indexOf('data-') == 0) {
				store[camelize(attr.name.replace('data-', ''))] =
					$.DeserializeValue(attr.value);
			}
		});

		return store;
	}

	$.fn.data = function (name, value) {
		return value === undefined ?
		// set multiple values via object
		$.isPlainObject(name) ?
			this.each(function (i, node) {
				$.each(name, function (key, value) {
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

	$.fn.removeData = function (names) {
		if (typeof names == 'string') {
			names = names.split(/\s+/);
		}
		return this.each(function () {
			var id = this[exp];
			var store = id && data[id];
			if (store)
				$.each(names || store, function (key) {
					delete store[names ? camelize(this) : key];
				});
		});
	};

	// Generate extended `remove` and `empty` functions
	['remove', 'empty'].forEach(function (methodName) {
		var origFn = $.fn[methodName];
		$.fn[methodName] = function () {
			var elements = this.find('*');
			if (methodName === 'remove') elements = elements.add(this);
			elements.removeData();
			return origFn.call(this);
		}
	});
})(Yaex)


+(function (window, undefined) {
	'use strict';
	// Create a collection of callbacks to be fired in a sequence, with configurable behaviour
	// Option flags:
	//   - once: Callbacks fired at most one time.
	//   - memory: Remember the most recent context and arguments
	//   - stopOnFalse: Cease iterating over callback list
	//   - unique: Permit adding at most one instance of the same callback
	$.Callbacks = function (options) {

		options = $.Extend({}, options);

		var memory; // Last fire value (for non-forgettable lists)

		var fired; // Flag to know if list was already fired

		var firing; // Flag to know if list is currently firing

		var firingStart; // First callback to fire (used internally by add and fireWith)

		var firingLength; // End of the loop when firing

		var firingIndex; // Index of currently firing callback (modified by remove if needed)

		var list = []; // Actual callback list

		var stack = !options.once && []; // Stack of fire calls for repeatable lists

		var fire = function (data) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;

			for (; list && firingIndex < firingLength; ++firingIndex) {
				if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
					memory = false;
					break;
				}
			}

			firing = false;

			if (list) {
				if (stack) {
					stack.length && fire(stack.shift());
				} else if (memory) {
					list.length = 0;
				} else {
					Callbacks.disable();
				}
			}
		};

		var Callbacks = {
			add: function () {
				if (list) {
					var start = list.length;

					var add = function (args) {
						$.each(args, function (_, arg) {
							if (typeof arg === 'function') {
								if (!options.unique || !Callbacks.has(arg)) list.push(arg);
							} else if (arg && arg.length && typeof arg !== 'string') add(arg);
						});
					};

					add(arguments);

					if (firing) {
						firingLength = list.length;
					} else if (memory) {
						firingStart = start;
						fire(memory);
					}
				}

				return this;
			},
			remove: function () {
				if (list) {
					$.each(arguments, function (_, arg) {
						var index;
						while ((index = $.inArray(arg, list, index)) > -1) {
							list.splice(index, 1);
							// Handle firing indexes
							if (firing) {
								if (index <= firingLength)--firingLength;
								if (index <= firingIndex)--firingIndex;
							}
						}
					});
				}
				return this;
			},
			has: function (fn) {
				return !!(list && (fn ? $.inArray(fn, list) > -1 : list.length));
			},
			empty: function () {
				firingLength = list.length = 0;
				return this;
			},
			disable: function () {
				list = stack = memory = undefined;
				return this;
			},
			disabled: function () {
				return !list;
			},
			lock: function () {
				stack = undefined;
				if (!memory) Callbacks.disable();
				return this;
			},
			locked: function () {
				return !stack;
			},
			fireWith: function (context, args) {
				if (list && (!fired || stack)) {
					args = args || [];
					args = [context, args.slice ? args.slice() : args];
					if (firing) stack.push(args);
					else fire(args);
				}
				return this;
			},
			fire: function () {
				return Callbacks.fireWith(this, arguments);
			},
			fired: function () {
				return !!fired;
			}
		};

		return Callbacks;
	};
})(this)


+(function ($) {
	'use strict';
	
	var slice = Array.prototype.slice;

	function Deferred(func) {
		var tuples = [
			// action, add listener, listener list, final state
			['resolve', 'done', $.Callbacks({
				once: 1,
				memory: 1
			}), 'resolved'],
			['reject', 'fail', $.Callbacks({
				once: 1,
				memory: 1
			}), 'rejected'],
			['notify', 'progress', $.Callbacks({
				memory: 1
			})]
		],
			state = 'pending',
			promise = {
				state: function () {
					return state;
				},
				always: function () {
					deferred.done(arguments).fail(arguments);
					return this;
				},
				then: function ( /* fnDone [, fnFailed [, fnProgress]] */ ) {
					var fns = arguments;
					return Deferred(function (defer) {
						$.each(tuples, function (i, tuple) {
							var fn = $.isFunction(fns[i]) && fns[i];
							deferred[tuple[1]](function () {
								var returned = fn && fn.apply(this, arguments);
								if (returned && $.isFunction(returned.promise)) {
									returned.promise()
										.done(defer.resolve)
										.fail(defer.reject)
										.progress(defer.notify);
								} else {
									var context = this === promise ? defer.promise() : this,
										values = fn ? [returned] : arguments;
									defer[tuple[0] + 'With'](context, values);
								}
							});
						});
						fns = null;
					}).promise();
				},

				promise: function (obj) {
					return obj !== null ? $.Extend(obj, promise) : promise;
				}
			},
			deferred = {};

		$.each(tuples, function (i, tuple) {
			var list = tuple[2],
				stateString = tuple[3];

			promise[tuple[1]] = list.add;

			if (stateString) {
				list.add(function () {
					state = stateString;
				}, tuples[i ^ 1][2].disable, tuples[2][2].lock);
			}

			deferred[tuple[0]] = function () {
				deferred[tuple[0] + 'With'](this === deferred ? promise : this, arguments);
				return this;
			};
			deferred[tuple[0] + 'With'] = list.fireWith;
		});

		promise.promise(deferred);

		if (func) func.call(deferred, deferred);

		return deferred;
	}

	$.when = function (sub) {
		var resolveValues = slice.call(arguments),
			len = resolveValues.length,
			i = 0,
			remain = len !== 1 || (sub && $.isFunction(sub.promise)) ? len : 0,
			deferred = remain === 1 ? sub : Deferred(),
			progressValues, progressContexts, resolveContexts,
			updateFn = function (i, ctx, val) {
				return function (value) {
					ctx[i] = this;
					val[i] = arguments.length > 1 ? slice.call(arguments) : value;
					if (val === progressValues) {
						deferred.notifyWith(ctx, val);
					} else if (!(--remain)) {
						deferred.resolveWith(ctx, val);
					}
				};
			};

		if (len > 1) {
			progressValues = new Array(len);
			progressContexts = new Array(len);
			resolveContexts = new Array(len);
			for (; i < len; ++i) {
				if (resolveValues[i] && $.isFunction(resolveValues[i].promise)) {
					resolveValues[i].promise()
						.done(updateFn(i, resolveContexts, resolveValues))
						.fail(deferred.reject)
						.progress(updateFn(i, progressContexts, progressValues));
				} else {
					--remain;
				}
			}
		}
		if (!remain) deferred.resolveWith(resolveContexts, resolveValues);

		return deferred.promise();
	};

	$.Deferred = Deferred;

})(Yaex)


/**
 * Extra - Extra functionalities for Yaex
 *
 *
 * @depends: Yaex.js | Core, Selector, Data, Event, Extra
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function ($) {
	'use strict';

	// Map object to object
	$.MapObjectToObject = function (obj, callback) {
		var result = {};

		$.each(obj, function (key, value) {
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

		if ($.isString(name) && $.isString(value)) {
			localStorage[name] = value;
			return true;
		// } else if ($.isObject(name) && typeof value === 'undefined') {
		} else if ($.isObject(name) && $.isUndefined(value)) {
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

		if ($.isString(name) && $.isString(value)) {
			document.cookie = name + '=' + value + expire + '; path=/';
			return true;
		// } else if (typeof n === 'object' && typeof v === 'undefined') {
		} else if ($.isObject(name) && $.isUndefined(value)) {
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
	 * $.Storage.Set('name', 'value')
	 * $.Storage.Set({'name1':'value1', 'name2':'value2', etc})
	 * $.Storage.Get('name')
	 * $.Storage.Remove('name')
	 */
	$.Extend({
		Storage: {
			Set: isLocalStorage ? WriteToLocalStorage : WriteCookie,
			Get: isLocalStorage ? ReadFromLocalStorage : ReadCookie,
			Remove: isLocalStorage ? DeleteFromLocalStorage : DeleteCookie
		}
	});

	//---

	// Local storage Implementation 
	// $.map(['localStorage', 'sessionStorage'], function (method) {
	// 	var defaults = {
	// 		cookiePrefix: 'fallback:' + method + ':',
	// 		cookieOptions: {
	// 			path: '/',
	// 			domain: document.domain,
	// 			expires: ('localStorage' === method) ? {
	// 				expires: 365
	// 			} : undefined
	// 		}
	// 	};

	// 	try {
	// 		$.Support[method] = method in window && window[method] !== null;
	// 	} catch (e) {
	// 		$.Support[method] = false;
	// 	}

	// 	$[method] = function (key, value) {
	// 		var options = $.Extend({}, defaults, $[method].options);

	// 		this.getItem = function (key) {
	// 			var returns = function (key) {
	// 				return JSON.parse($.Support[method] ? window[method].getItem(key) : $.cookie(options.cookiePrefix + key));
	// 			};
	// 			if (typeof key === 'string') return returns(key);

	// 			var arr = [],
	// 				i = key.length;
	// 			while (i--) arr[i] = returns(key[i]);
	// 			return arr;
	// 		};

	// 		this.setItem = function (key, value) {
	// 			value = JSON.stringify(value);
	// 			return $.Support[method] ? window[method].setItem(key, value) : $.cookie(options.cookiePrefix + key, value, options.cookieOptions);
	// 		};

	// 		this.removeItem = function (key) {
	// 			return $.Support[method] ? window[method].removeItem(key) : $.cookie(options.cookiePrefix + key, null, $.Extend(options.cookieOptions, {
	// 				expires: -1
	// 			}));
	// 		};

	// 		this.clear = function () {
	// 			if ($.Support[method]) {
	// 				return window[method].clear();
	// 			} else {
	// 				var reg = new RegExp('^' + options.cookiePrefix, ''),
	// 					opts = $.Extend(options.cookieOptions, {
	// 						expires: -1
	// 					});

	// 				if (document.cookie && document.cookie !== '') {
	// 					$.map(document.cookie.split(';'), function (cookie) {
	// 						if (reg.test(cookie = $.trim(cookie))) {
	// 							$.cookie(cookie.substr(0, cookie.indexOf('=')), null, opts);
	// 						}
	// 					});
	// 				}
	// 			}
	// 		};

	// 		if (typeof key !== 'undefined') {
	// 			return typeof value !== 'undefined' ? (value === null ? this.removeItem(key) : this.setItem(key, value)) : this.getItem(key);
	// 		}

	// 		return this;
	// 	};

	// 	$[method].options = defaults;
	// });

	//---

	// Yaex Timers
	$.fn.extend({
		everyTime: function (interval, label, fn, times, belay) {
			//console.log(this);
			return this.each(function () {
				$.timer.add(this, interval, label, fn, times, belay);
			});
		},
		oneTime: function (interval, label, fn) {
			return this.each(function () {
				$.timer.add(this, interval, label, fn, 1);
			});
		},
		stopTime: function (label, fn) {
			return this.each(function () {
				$.timer.remove(this, label, fn);
			});
		}
	});

	$.Extend({
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
				var result = this.regex.exec($.trim(value.toString()));
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

				if ($.isFunction(label)) {
					if (!times) {
						times = fn;
					}
					fn = label;
					label = interval;
				}

				interval = $.timer.timeParse(interval);

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
						$.timer.remove(element, label, fn);
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

	$.Extend({
		queue: function (elem, type, data) {
			var queue;

			if (elem) {
				type = (type || 'fx') + 'queue';
				queue = $.data_priv.get(elem, type);

				// Speed up dequeue by getting out quickly if this is just a lookup
				if (data) {
					if (!queue || $.isArray(data)) {
						queue = $.data_priv.access(elem, type, $.makeArray(data));
					} else {
						queue.push(data);
					}
				}
				return queue || [];
			}
		},

		dequeue: function (elem, type) {
			type = type || 'fx';

			var queue = $.queue(elem, type),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = $._queueHooks(elem, type),
				next = function () {
					$.dequeue(elem, type);
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
			return $.data_priv.get(elem, key) || $.data_priv.access(elem, key, {
				empty: $.Callbacks('once memory').add(function () {
					$.data_priv.remove(elem, [type + 'queue', key]);
				})
			});
		}
	});

	//---

	$.fn.extend({
		queue: function (type, data) {
			var setter = 2;

			if (typeof type !== 'string') {
				data = type;
				type = 'fx';
				setter--;
			}

			if (arguments.length < setter) {
				return $.queue(this[0], type);
			}

			return data === undefined ?
				this :
				this.each(function () {
					var queue = $.queue(this, type, data);

					// ensure a hooks for this queue
					$._queueHooks(this, type);

					if (type === 'fx' && queue[0] !== 'inprogress') {
						$.dequeue(this, type);
					}
				});
		},
		dequeue: function (type) {
			return this.each(function () {
				$.dequeue(this, type);
			});
		},
		// Based off of the plugin by Clint Helfers, with permission.
		// http://blindsignals.com/index.php/2009/07/jquery-delay/
		delay: function (time, type) {
			time = $.fx ? $.fx.speeds[time] || time : time;
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
				defer = $.Deferred(),
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
				tmp = data_priv.get(elements[i], type + 'queueHooks');
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

	$.fn.appear = function (fn, options) {
		var settings = $.Extend({
			//arbitrary data to pass to fn
			data: undefined,

			//call fn only on the first appear?
			one: true
		}, options);

		return this.each(function () {
			var t = $(this);

			//whether the element is currently visible
			t.appeared = false;

			if (!fn) {

				//trigger the custom event
				t.trigger('appear', settings.data);
				return;
			}

			var w = $(window);

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
					var i = $.inArray(check, $.fn.appear.checks);
					if (i >= 0) $.fn.appear.checks.splice(i, 1);
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
			$.fn.appear.checks.push(check);

			//check now
			(check)();
		});
	};

	// Keep a queue of appearance checks
	$.Extend($.fn.appear, {

		checks: [],
		timeout: null,

		//process the queue
		checkAll: function () {
			var length = $.fn.appear.checks.length;
			if (length > 0)
				while (length--)($.fn.appear.checks[length])();
		},

		//check the queue asynchronously
		run: function () {
			if ($.fn.appear.timeout) clearTimeout($.fn.appear.timeout);
			$.fn.appear.timeout = setTimeout($.fn.appear.checkAll, 20);
		}
	});

	// Run checks when these methods are called
	$.each(['append', 'prepend', 'after', 'before',
		'attr', 'removeAttr', 'addClass', 'removeClass',
		'toggleClass', 'remove', 'css', 'show', 'hide'
	], function (i, n) {
		var old = $.fn[n];

		if (old) {
			$.fn[n] = function () {
				var r = old.apply(this, arguments);

				$.fn.appear.run();

				return r;
			}
		}
	});

	//---

	$.fn.swipe = function (options) {
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
				$self = $(this),
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

	$.fn.visible = function (visibility) {
		// return this.each(function (index, item) {
		return this.each(function () {
			var yEl = $(this);
			yEl.css('visibility', visibility ? '' : 'hidden');
		});
	};

	//---

	$.fn.resizeText = function (value) {
		// return this.each(function (index, item) {
		return this.each(function () {
			var yEl = $(this);

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

			// console.log(['w', w, 'h', h, 'fontStr', fontStr, 'fontNumStr', fontNumStr, 'fontSize', fontSize, 'fontSuffix', fontSuffix].join(':'));

			yEl.html(value);

			do {
				yEl.css('font-size', fontSize + fontSuffix);
				fontSize -= .5;
			} while ((yEl.width() > w || yEl.height() > h) && fontSize > 0);
		});
	};

	//---

	/** 
	 * If no touch events are available map touch events to corresponding mouse events.
	 **/
	// try {
	// 	document.createEvent('TouchEvent');
	// } catch (e) {
	// 	var _fakeCallbacks = {}, // Store the faked callbacks so that they can be unbound
	// 		eventmap = {
	// 			'touchstart': 'mousedown',
	// 			'touchend': 'mouseup',
	// 			'touchmove': 'mousemove'
	// 		};

	// 	function touch2mouse(type, callback, context) {
	// 		if ((typeof type) == 'object') {
	// 			// Assume we have been called with an event object.
	// 			// Do not map the event.
	// 			// TODO: Should this still try and map the event.
	// 			return [type]
	// 		}

	// 		// remove the extra part after the .
	// 		var p = type.match(/([^.]*)(\..*|$)/),
	// 			// orig = p[0],
	// 			type = p[1],
	// 			extra = p[2],
	// 			mappedevent = eventmap[type];

	// 		result = [(mappedevent || type) + extra]
	// 		if (arguments.length > 1) {
	// 			if (mappedevent) {
	// 				callback = fakeTouches(type, callback, context);
	// 			}

	// 			result.push(callback);
	// 		}


	// 		return result;
	// 	}

	// 	function fakeTouches(type, callback, context) {
	// 		// wrap the callback with a function that adds a fake 
	// 		// touches property to the event.

	// 		return _fakeCallbacks[callback] = function (event) {
	// 			if (event.button) {
	// 				return false;
	// 			}
	// 			event.touches = [{
	// 				length: 1, // 1 mouse (finger)
	// 				clientX: event.clientX,
	// 				clientY: event.clienty,
	// 				pageX: event.pageX,
	// 				pageY: event.pageY,
	// 				screenX: event.screenX,
	// 				screenY: event.screenY,
	// 				target: event.target
	// 			}]

	// 			event.touchtype = type;

	// 			return callback.apply(context, [event]);
	// 		}
	// 	}

	// 	var _bind = $.fn.bind;

	// 	$.fn.bind = function (event, callback) {
	// 		return _bind.apply(this, touch2mouse(event, callback, this));
	// 	};

	// 	var _unbind = $.fn.unbind;

	// 	$.fn.unbind = function (event, callback) {
	// 		if (!event) {
	// 			_unbind.apply(this);
	// 			return;
	// 		}
	// 		var result = _unbind.apply(this, touch2mouse(event).concat([_fakeCallbacks[callback] || callback]));
	// 		delete(_fakeCallbacks[callback]);
	// 		return result;
	// 	};

	// 	var _one = $.fn.one;

	// 	$.fn.one = function (event, callback) {
	// 		return _one.apply(this, touch2mouse(event, callback, this));
	// 	};

	// 	var _delegate = $.fn.delegate;

	// 	$.fn.delegate = function (selector, event, callback) {
	// 		return _delegate.apply(this, [selector].concat(touch2mouse(event, callback, this)));
	// 	};

	// 	var _undelegate = $.fn.undelegate;

	// 	$.fn.undelegate = function (selector, event, callback) {
	// 		var result = _undelegate.apply(this, [selector].concat(touch2mouse(event), [_fakeCallbacks[callback] || callback]));
	// 		delete(_fakeCallbacks[callback]);
	// 		return result;
	// 	};

	// 	var _live = $.fn.live;

	// 	$.fn.live = function (event, callback) {
	// 		return _live.apply(this, touch2mouse(event, callback, this));
	// 	};

	// 	var _die = $.fn.die;

	// 	$.fn.die = function (event, callback) {
	// 		var result = _die.apply(this, touch2mouse(event).concat([_fakeCallbacks[callback] || callback]));
	// 		delete(_fakeCallbacks[callback]);
	// 		return result;
	// 	};

	// 	var _trigger = $.fn.trigger;

	// 	$.fn.trigger = function (event, data) {
	// 		return _trigger.apply(this, touch2mouse(event).concat([data]));
	// 	};

	// 	var _triggerHandler = $.fn.triggerHandler;

	// 	$.fn.triggerHandler = function (event, data) {
	// 		return _triggerHandler.apply(this, touch2mouse(event).concat([data]));
	// 	};
	// };

	//---

	window.cordova = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

	if (window.cordova === false) {
		$(function () {
			$(document).trigger('deviceready');
		});
	}
})(Yaex)


/**
 * HashChange - Cross browser event implementation using Yaex's API for special events
 *
 *
 * @depends: Yaex.js | Core, Event, Extra
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function ($, window, document) {
	'use strict';

	var type = 'hashchange';
	var undefined;
	var initialized = false;

	// On IE-8 in compatMode to IE-7 is onhashchange not supported
	var support = 'on' + type in window && (document.documentMode === undefined || document.documentMode > 7);

	$.fn.hashchange = function (callback) {
		return callback ? this.bind(type, callback) : this.trigger(type, callback);
	};

	// Do the whole stuff only the event is not supported
	if (support) {
		return;
	}

	function setup(data /*, namespaces, callback*/) {
		if (!initialized) {
			initialized = true;

			var trigger = function () {
				$.Event.trigger(type, data);
			};

			if ($.Browser.IE) {
				iframe.init(trigger);
			} else {
				loopCheck.init(trigger);
			}
		}
	}

	function teardown() {
		if (initialized) {
			iframe.destroy();
			loopCheck.destroy();
			initialized = false;
		}
	}

	/**
	 * For all browser without hashchange support and not IE
	 */
	var loopCheck = (function () {
		var hash, timeout,
			callback;

		function init(_callback) {
			callback = _callback;
			check();
		}

		function check() {
			if ($.location.hash !== hash) {
				hash = $.location.hash;
				callback();
			}

			timeout = window.setTimeout(check, 50);
		}

		function destroy() {
			window.clearTimeout(timeout);
		}

		return {
			init: init,
			destroy: destroy
		};
	})();

	/**
	 * Only for IE6-7
	 * Check if iframe hash the same as document
	 */
	var iframe = (function () {
		var $iframe,
			timeout, callback,
			iHash, hash,
			iHashNew, hashNew;

		function init(_callback) {
			callback = _callback;
			$(function () {
				$iframe = $('<iframe style="display: none;" class="hashchange-iframe"/>').appendTo(document.body);
				hash = location.hash;
				iHash = iDoc().location.hash;
				check();
			});
		}

		function destroy() {
			window.clearTimeout(timeout);
			$iframe && $iframe.remove();
		}

		function check() {
			iHashNew = iDoc().location.hash;
			hashNew = location.hash;

			// Changed using navigation buttons
			if (iHashNew !== iHash) {
				iHash = iHashNew;
				hash = iHash;
				location.hash = iHash.substr(1);
				callback();
				// changed using link or add method
			} else if (hashNew !== hash) {
				hash = hashNew;
				updateIFrame(hash);
			}

			timeout = setTimeout(check, 50);
		}

		// Get the document of the iframe

		function iDoc() {
			return $iframe[0].contentWindow.document;
		}

		// Save value to the iframe

		function updateIFrame(value) {
			iDoc().open();
			iDoc().close();
			iDoc().location.hash = value;
		}

		return {
			init: init,
			destroy: destroy
		};
	})();

	// Expose special event
	$.Yaex.Event.special[type] = {
		setup: setup,
		teardown: teardown
	};
})(Yaex, window, document)


/**
 * OnPress - Cross browser onpress event implementation using Yaex's API for special events
 *
 *
 * @depends: Yaex.js | Core, Event, Extra
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function ($) {
	'use strict';

	$.UserAgent.Touch = !(typeof window.ontouchstart === 'undefined');

	var ghostsLifeTime = 1000;

	var normalizeArgs = function (args) {
		var callback,
			selector;

		if (typeof args[0] === 'function') {
			callback = args[0];
		} else {
			selector = args[0];
			callback = args[1];
		}

		return [selector, callback];
	};

	if ($.UserAgent.Touch) {
		var ghosts = [],
			callbacks = [],
			handlers = [],
			$doc = $(document);

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

		$doc.on('click', handleGhosts);

		$.fn.onpress = function () {
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

				$doc.on('touchmove.onpress', handleTouchMove);

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
				$doc.off('touchmove.onpress', handleTouchMove);
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

		$.fn.offpress = function () {
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
		$.fn.onpress = function () {
			var args = normalizeArgs(arguments);
			if (args[0]) {
				this.on('click.onpress', args[0], args[1]);
				this.on('press.onpress', args[0], args[1]);
			} else {
				this.on('click.onpress', args[1]);
				this.on('press.onpress', args[1]);
			}
		};
		$.fn.offpress = function () {
			var args = normalizeArgs(arguments);
			args[0] ? this.off('.onpress', args[0], args[1]) : this.off('.onpress', args[1]);
		};
	}
})(Yaex)


/**
 * OnShake - Cross browser onshake event implementation using Yaex's API for special events
 *
 *
 * @depends: Yaex.js | Core, Event, Extra
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function ($) {
	'use strict';

	if (typeof window.DeviceMotionEvent !== 'undefined') {
		$.onshake = function (callb, sens) {
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
		$.onshake = function () {};
	}
	
})(Yaex)


/**
 * Router - Cross browser hash router implementation using Yaex's API
 *
 *
 * @depends: Yaex.js | Core, Event, Extra, HashChange
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function ($) {
	'use strict';

	// Routes array
	var Routes = [];

	var location = $.Location;

	var DefaultOptions = {
		DefaultPath: '/',
		Before: $.Noop,
		On: $.Noop,
		NotFound: $.Noop
	}; // END OF DefaultOptions CLASS

	var Router = {
		current: null,
		previous: null,
		config: function (options) {
			for (var option in options) {
				if (options.hasOwnProperty(option)) {
					DefaultOptions[option] = options[option];
				} // END if
			} // END for

			return Router;
		},
		add: function (path, name, fn) {
			if (path && name) {
				if ($.isFunction(name)) {
					fn = name;
					name = null;
				} // END if

				Routes.push({
					path: path,
					name: name,
					fn: fn || function () {}
				});
			} // END if

			return Router;
		},
		go: function (path) {
			location.hash = path;

			return Router;
		},
		back: function (path) {
			// Only 1-step back
			if (Router.previous) {
				history.back();
				Router.previous = null;
				// Fallback if can't go back
			} else if (path) {

				location.hash = path;
			} // END if

			return Router;
		}
	}; // END OF Router CLASS

	var HashChange = function () {
		var hash = location.hash.slice(1);
		var found = false;
		var current = Router.current;

		if (!hash) {
			hash = DefaultOptions.DefaultPath;
		} // END if

		if (current && current != Router.previous) {
			Router.previous = current;
		} // END if

		Router.current = hash;

		for (var x = 0, l = Routes.length; x < l && !found; x++) {
			var route = Routes[x];
			var path = route.path;
			var name = route.name;
			var fn = route.fn;

			if (typeof path == 'string') {

				if (path.toLowerCase() == hash.toLowerCase()) {

					DefaultOptions.Before.call(Router, path, name);
					fn.call(Router);
					DefaultOptions.On.call(Router, path, name);
					found = true;
				} // END if
				// regex
			} else {
				var matches = hash.match(path);

				if (matches) {

					DefaultOptions.Before.call(Router, path, name, matches);
					fn.apply(Router, matches);
					DefaultOptions.On.call(Router, path, name, matches);
					found = true;
				} // END if
			} // END if
		} // END for

		if (!found) {
			DefaultOptions.NotFound.call(Router);
		} // END if

		return Router;
	}; // END OF HashChange FUNCTION

	Router.init = function () {
		// window.addEventListener('hashchange', HashChange);

		$(window).hashchange(HashChange);

		return HashChange();
	}; // END OF init FUNCTION

	Router.reload = HashChange();

	// Assign the Router class to Window global for external use
	// window.router = Router;

	// Assign the Router class to Yaex's global
	$.router = Router;
	// })(Yaex, window, document)
})(Yaex)


+(function ($) {
	'use strict';
	var touch = {};
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
			touch = {};
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
		touch = {};
	}

	function isPrimaryTouch(event) {
		return (event.pointerType == 'touch' || event.pointerType == event.MSPOINTER_TYPE_TOUCH) && event.isPrimary;
	}

	function isPointerEventType(e, type) {
		return (e.type == 'pointer' + type || e.type.toLowerCase() == 'mspointer' + type);
	}

	$(document).ready(function () {
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

		$(document)
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
				touch.el = $('tagName' in firstTouch.target ? firstTouch.target : firstTouch.target.parentNode);
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
						touch = {};
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
							var event = $.Event('tap');
							event.cancelTouch = cancelAll;
							touch.el.trigger(event);

							// trigger double tap immediately
							if (touch.isDoubleTap) {
								if (touch.el) touch.el.trigger('doubleTap');
								touch = {};
							}

							// trigger single tap after 250ms of inactivity
							else {
								touchTimeout = setTimeout(function () {
									touchTimeout = null;
									if (touch.el) touch.el.trigger('singleTap');
									touch = {};
								}, 250);
							}
						}, 0);
					} else {
						touch = {};
					}
				deltaX = deltaY = 0;

			})
		// when the browser window loses focus,
		// for example when a modal dialog is shown,
		// cancel all ongoing events
		.on('touchcancel MSPointerCancel pointercancel', cancelAll);

		// scrolling the window indicates intention of the user
		// to scroll, not tap or swipe, so cancel all ongoing events
		$(window).on('scroll', cancelAll);
	});

	['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown', 'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function (eventName) {
		$.fn[eventName] = function (callback) {
			return this.bind(eventName, callback);
		};
	});
})(Yaex)


+(function () {
	'use strict';
	$.fn.end = function () {
		return this.prevObject || $(null);
	};

	$.fn.andSelf = function () {
		return this.add(this.prevObject || $(null));
	};

	'filter,add,not,eq,first,last,find,closest,parents,parent,children,siblings'.split(',').forEach(function (property) {
		var fn = $.fn[property];
		$.fn[property] = function () {
			var ret = fn.apply(this, arguments);
			ret.prevObject = this;
			return ret;
		};
	});
})(Yaex)




+(function (undefined) {
	if (String.prototype.trim === undefined) { // fix for iOS 3.2
		String.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/g, '');
		}
	}

	// For iOS 3.x
	// from https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
	if (Array.prototype.reduce === undefined) {
		Array.prototype.reduce = function (fun) {
			if (this === void 0 || this === null) {
				throw new TypeError();
			}

			var t = Object(this),
				len = t.length >>> 0,
				k = 0,
				accumulator;

			if (typeof fun != 'function') throw new TypeError()
			if (len == 0 && arguments.length == 1) throw new TypeError()

			if (arguments.length >= 2)
				accumulator = arguments[1]
			else
				do {
					if (k in t) {
						accumulator = t[k++]
						break
					}
					if (++k >= len) throw new TypeError()
				} while (true)

				while (k < len) {
					if (k in t) accumulator = fun.call(undefined, accumulator, t[k], k, t)
					k++
				}
			return accumulator
		}
	}
})()


+(function ($) {
	'use strict';
	// CSS TRANSITION SUPPORT (http://www.modernizr.com/)
	function transitionEnd() {
		var el = document.createElement('yaex');

		var transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd otransitionend',
			'transition': 'transitionend'
		};

		for (var name in transEndEventNames) {
			if (el.style[name] !== undefined) {
				return {
					end: transEndEventNames[name]
				};
			}
		}
	}

	// http://blog.alexmaccaw.com/css-transitions
	$.fn.emulateTransitionEnd = function (duration) {
		var called = false;
		var $el = this;

		$(this).one($.Support.transition.end, function () {
			called = true
		});

		var callback = function () {
			if (!called) $($el).trigger($.Support.transition.end)
		};

		setTimeout(callback, duration);

		return this;
	};

	$(function () {
		$.Support.transition = transitionEnd();
	})
})(Yaex)


+(function ($) {
	'use strict';

	// ALERT CLASS DEFINITION
	var dismiss = '[data-dismiss="alert"]';
	var Alert = function (el) {
		$(el).on('click', dismiss, this.close);
	};

	Alert.prototype.close = function (e) {
		var $this = $(this);
		var selector = $this.attr('data-target');

		if (!selector) {
			selector = $this.attr('href');
			// strip for ie7
			selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');
		}

		var $parent = $(selector);

		if (e) e.preventDefault();

		if (!$parent.length) {
			$parent = $this.hasClass('alert') ? $this : $this.parent();
		}

		$parent.trigger(e = $.Event('close.yaex.alert'));

		if (e.isDefaultPrevented()) return;

		$parent.removeClass('in');

		function removeElement() {
			$parent.trigger('closed.yaex.alert').remove();
		}

		$.Support.transition && $parent.hasClass('fade') ?
			$parent
			.one($.Support.transition.end, removeElement)
			.emulateTransitionEnd(150) :
			removeElement();
	};

	// ALERT PLUGIN DEFINITION
	// var old = $.fn.alert;

	$.fn.alert = function (option) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('yaex.alert');

			if (!data) $this.data('yaex.alert', (data = new Alert(this)));
			if (typeof option == 'string') data[option].call($this);
		});
	};

	$.fn.alert.Constructor = Alert;

	// ALERT NO CONFLICT
	// $.fn.alert.noConflict = function () {
	// 	$.fn.alert = old;
	// 	return this;
	// };

	// ALERT DATA-API
	$(document).on('click.yaex.alert.data-api', dismiss, Alert.prototype.close);
})(Yaex)


+(function ($) {
	'use strict';

	var settings = {
		inEffect: {
			opacity: 'show'
		}, // in effect
		inEffectDuration: 600, // in effect duration in miliseconds
		stayTime: 3000, // time in miliseconds before the item has to disappear
		text: '', // content of the item. Might be a string or a jQuery object. Be aware that any jQuery object which is acting as a message will be deleted when the toast is fading away.
		sticky: false, // should the toast item sticky or not?
		type: 'notice', // notice, warning, error, success
		position: 'top-right', // top-left, top-center, top-right, middle-left, middle-center, middle-right ... Position of the toast container holding different toast. Position can be set only once at the very first call, changing the position after the first call does nothing
		closeText: '<i class="fa fa-times-circle"></i>', // text which will be shown as close button, set to '' when you want to introduce an image via css
		close: null // callback function when the toastMessage is closed
	};

	var methods = {
		init: function (options) {
			if (options) {
				$.Extend(settings, options);
			}

		},
		showToast: function (options) {
			var localSettings = {};

			$.Extend(localSettings, settings, options);

			// declare variables
			var toastWrapAll;
			var toastItemOuter;
			var toastItemInner;
			var toastItemClose;
			var toastItemImage;

			if (!$('.toast-container').size()) {
				toastWrapAll = $('<div class="toast-container "></div>').addClass('toast-position-' + localSettings.position).appendTo('body');
			} else {
				toastWrapAll = $('.toast-container');
			}

			/*toastWrapAll = (!$('.toast-container').size) ? $('<div></div>').
				addClass('toast-container').addClass('toast-position-' + 
				localSettings.position).appendTo('body') : $('.toast-container');*/

			toastItemOuter = $('<div class="toast-item-wrapper"></div>');

			//toastItemInner = $('<div></div>').hide().addClass('toast-item toast-type-' + localSettings.type).appendTo(toastWrapAll).html($('<p>').append(localSettings.text)).animate(localSettings.inEffect, localSettings.inEffectDuration).wrap(toastItemOuter);
			//toastItemInner = $('<div class="' + 'toast-item toast-type-' + localSettings.type + '"></div>').hide().appendTo(toastWrapAll).html($('<p>').append(localSettings.text)).animate(localSettings.inEffect, localSettings.inEffectDuration).wrap(toastItemOuter);
			toastItemInner = $('<div class="' + 'toast-item toast-type-' + localSettings.type + '"></div>').show('slow').appendTo(toastWrapAll).html($('<p>').append(localSettings.text)).animate(localSettings.inEffect, localSettings.inEffectDuration).wrap(toastItemOuter);

			//console.log(toastItemInner);

			//			toastItemClose = $('<div class="toast-item-close"></div>').prependTo(toastItemInner).html(localSettings.closeText).click(function() {
			//				$().toastMessage('removeToast', toastItemInner, localSettings);
			//			});


			toastItemClose = $('<div class="toast-item-close"></div>').prependTo(toastItemInner).html(localSettings.closeText).click(function () {
				$().toastMessage('removeToast', toastItemInner, localSettings);
			});

			//			toastItemImage = $('<div class="toast-item-image"></div>').addClass('toast-item-image-' + localSettings.type).prependTo(toastItemInner);

			var iconAw = '';

			switch (localSettings.type) {
			case 'notice':
				iconAw = 'info-circle iconAwblue';
				break;
			case 'success':
				iconAw = 'check-circle iconAwgreen';
				break;
			case 'warning':
				iconAw = 'exclamation-triangle iconAwyellow';
				break;
			case 'error':
				iconAw = 'exclamation-circle iconAwred';
				break;
			}

			toastItemImage = $('<div class="toast-item-image"></div>').html('<i class="fa fa-' + iconAw + '"></i>').prependTo(toastItemInner);

			if (navigator.userAgent.match(/MSIE 6/i)) {
				toastWrapAll.css({
					top: document.documentElement.scrollTop
				});
			}

			if (!localSettings.sticky) {
				setTimeout(function () {
					$().toastMessage('removeToast', toastItemInner, localSettings);
				}, localSettings.stayTime);
			}

			return toastItemInner;
		},
		showNoticeToast: function (message) {
			var options = {
				text: message,
				type: 'notice'
			};
			return $().toastMessage('showToast', options);
		},
		showSuccessToast: function (message) {
			var options = {
				text: message,
				type: 'success'
			};
			return $().toastMessage('showToast', options);
		},
		showErrorToast: function (message) {
			var options = {
				text: message,
				type: 'error'
			};
			return $().toastMessage('showToast', options);
		},
		showWarningToast: function (message) {
			var options = {
				text: message,
				type: 'warning'
			};
			return $().toastMessage('showToast', options);
		},
		removeToast: function (obj, options) {
			//console.log(obj);

			obj.animate({
				opacity: '0'
			}, 600, function () {
				obj.parent().animate({
					height: '0px'
				}, 300, function () {
					obj.parent().remove();
				});
			});

			// callback
			if (options && options.close !== null) {
				options.close();
			}
		}
	};

	$.fn.toastMessage = function (method) {
		// Method calling logic
		//console.log(Array.prototype.slice.call(arguments, 1));
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if ($.isObject(method) || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.toastMessage');
		}
	};
})(Yaex)


+(function ($) {
	'use strict';

	// BUTTON PUBLIC CLASS DEFINITION
	var Button = function (element, options) {
		this.$element = $(element);
		this.options = $.Extend({}, Button.DEFAULTS, options);
	};

	Button.DEFAULTS = {
		loadingText: 'loading...'
	};

	Button.prototype.setState = function (state) {
		var d = 'disabled';
		var $el = this.$element;
		var val = $el.is('input') ? 'val' : 'html';
		var data = $el.data();

		state = state + 'Text';

		if (!data.resetText) $el.data('resetText', $el[val]());

		$el[val](data[state] || this.options[state]);

		// push to event loop to allow forms to submit
		setTimeout(function () {
			state == 'loadingText' ?
				$el.addClass(d).attr(d, d) :
				$el.removeClass(d).removeAttr(d);
		}, 0);
	};

	Button.prototype.toggle = function () {
		var $parent = this.$element.closest('[data-toggle="buttons"]');
		var changed = true;

		if ($parent.length) {
			var $input = this.$element.find('input');

			if ($input.prop('type') === 'radio') {
				// see if clicking on current one
				if ($input.prop('checked') && this.$element.hasClass('active'))
					changed = false;
				else
					$parent.find('.active').removeClass('active');
			}

			if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change');
		}

		if (changed) this.$element.toggleClass('active');
	};

	// BUTTON PLUGIN DEFINITION
	// var old = $.fn.button

	$.fn.button = function (option) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('yaex.button');
			var options = typeof option == 'object' && option;

			if (!data) $this.data('yaex.button', (data = new Button(this, options)));

			if (option == 'toggle') data.toggle();
			else if (option) data.setState(option);
		});
	};

	$.fn.button.Constructor = Button;

	// BUTTON NO CONFLICT
	// $.fn.button.noConflict = function () {
	// 	$.fn.button = old;
	// 	return this;
	// };

	// BUTTON DATA-API
	$(document).on('click.yaex.button.data-api', '[data-toggle^=button]', function (e) {
		var $btn = $(e.target);
		if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn');
		$btn.button('toggle');
		e.preventDefault();
	});
})(Yaex)


/**
 * Scroller - Cross browser scrollbars implementation using Yaex's API
 *
 *
 * @depends: Yaex.js | Core, Selector, Data, Event, Extra, MouseWheel
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function ($) {
	'use strict';

	// The default settings for the plugin
	var defaultSettings = {
		wheelSpeed: 10,
		wheelPropagation: false,
		minScrollbarLength: null,
		useBothWheelAxes: false,
		useKeyboard: true,
		suppressScrollX: false,
		suppressScrollY: false,
		scrollXMarginOffset: 0,
		scrollYMarginOffset: 0
	};

	var getEventClassName = (function () {
		var incrementingId = 0;
		return function () {
			var id = incrementingId;
			incrementingId += 1;
			return '.fas-scrollbar-' + id;
		};
	}());

	$.fn.Scrollbar = function (SuppliedSettings, option) {

		return this.each(function () {
			// Use the default settings
			var settings = $.Extend(true, {}, defaultSettings),
				$this = $(this);

			if (typeof SuppliedSettings === 'object') {
				// But over-ride any supplied
				$.Extend(true, settings, SuppliedSettings);
			} else {
				// If no settings were supplied, then the first param must be the option
				option = SuppliedSettings;
			}

			// Catch options

			if (option === 'update') {
				if ($this.data('fas-scrollbar-update')) {
					$this.data('fas-scrollbar-update')();
				}
				return $this;
			} else if (option === 'destroy') {
				if ($this.data('fas-scrollbar-destroy')) {
					$this.data('fas-scrollbar-destroy')();
				}
				return $this;
			}

			if ($this.data('fas-scrollbar')) {
				// if there's already fas-scrollbar
				return $this.data('fas-scrollbar');
			}


			// Or generate new fasScrollbar

			// Set class to the container
			$this.addClass('fas-container');

			var $scrollbarXRail = $("<div class='fas-scrollbar-x-rail'></div>").appendTo($this),
				$scrollbarYRail = $("<div class='fas-scrollbar-y-rail'></div>").appendTo($this),
				$scrollbarX = $("<div class='fas-scrollbar-x'></div>").appendTo($scrollbarXRail),
				$scrollbarY = $("<div class='fas-scrollbar-y'></div>").appendTo($scrollbarYRail),
				scrollbarXActive,
				scrollbarYActive,
				containerWidth,
				containerHeight,
				contentWidth,
				contentHeight,
				scrollbarXWidth,
				scrollbarXLeft,
				scrollbarXBottom = parseInt($scrollbarXRail.css('bottom'), 10),
				scrollbarYHeight,
				scrollbarYTop,
				scrollbarYRight = parseInt($scrollbarYRail.css('right'), 10),
				eventClassName = getEventClassName();

			var updateContentScrollTop = function (currentTop, deltaY) {
				var newTop = currentTop + deltaY,
					maxTop = containerHeight - scrollbarYHeight;

				if (newTop < 0) {
					scrollbarYTop = 0;
				} else if (newTop > maxTop) {
					scrollbarYTop = maxTop;
				} else {
					scrollbarYTop = newTop;
				}

				var scrollTop = parseInt(scrollbarYTop * (contentHeight - containerHeight) / (containerHeight - scrollbarYHeight), 10);
				$this.scrollTop(scrollTop);
				$scrollbarXRail.css({
					bottom: scrollbarXBottom - scrollTop
				});
			};

			var updateContentScrollLeft = function (currentLeft, deltaX) {
				var newLeft = currentLeft + deltaX,
					maxLeft = containerWidth - scrollbarXWidth;

				if (newLeft < 0) {
					scrollbarXLeft = 0;
				} else if (newLeft > maxLeft) {
					scrollbarXLeft = maxLeft;
				} else {
					scrollbarXLeft = newLeft;
				}

				var scrollLeft = parseInt(scrollbarXLeft * (contentWidth - containerWidth) / (containerWidth - scrollbarXWidth), 10);
				$this.scrollLeft(scrollLeft);
				$scrollbarYRail.css({
					right: scrollbarYRight - scrollLeft
				});
			};

			var getSettingsAdjustedThumbSize = function (thumbSize) {
				if (settings.minScrollbarLength) {
					thumbSize = Math.max(thumbSize, settings.minScrollbarLength);
				}
				return thumbSize;
			};

			var updateScrollbarCss = function () {
				$scrollbarXRail.css({
					left: $this.scrollLeft(),
					bottom: scrollbarXBottom - $this.scrollTop(),
					width: containerWidth,
					display: scrollbarXActive ? "inherit" : "none"
				});
				$scrollbarYRail.css({
					top: $this.scrollTop(),
					right: scrollbarYRight - $this.scrollLeft(),
					height: containerHeight,
					display: scrollbarYActive ? "inherit" : "none"
				});
				$scrollbarX.css({
					left: scrollbarXLeft,
					width: scrollbarXWidth
				});
				$scrollbarY.css({
					top: scrollbarYTop,
					height: scrollbarYHeight
				});
			};

			var updateBarSizeAndPosition = function () {
				containerWidth = $this.width();
				containerHeight = $this.height();
				contentWidth = $this.prop('scrollWidth');
				contentHeight = $this.prop('scrollHeight');

				if (!settings.suppressScrollX && containerWidth + settings.scrollXMarginOffset < contentWidth) {
					scrollbarXActive = true;
					scrollbarXWidth = getSettingsAdjustedThumbSize(parseInt(containerWidth * containerWidth / contentWidth, 10));
					scrollbarXLeft = parseInt($this.scrollLeft() * (containerWidth - scrollbarXWidth) / (contentWidth - containerWidth), 10);
				} else {
					scrollbarXActive = false;
					scrollbarXWidth = 0;
					scrollbarXLeft = 0;
					$this.scrollLeft(0);
				}

				if (!settings.suppressScrollY && containerHeight + settings.scrollYMarginOffset < contentHeight) {
					scrollbarYActive = true;
					scrollbarYHeight = getSettingsAdjustedThumbSize(parseInt(containerHeight * containerHeight / contentHeight, 10));
					scrollbarYTop = parseInt($this.scrollTop() * (containerHeight - scrollbarYHeight) / (contentHeight - containerHeight), 10);
				} else {
					scrollbarYActive = false;
					scrollbarYHeight = 0;
					scrollbarYTop = 0;
					$this.scrollTop(0);
				}

				if (scrollbarYTop >= containerHeight - scrollbarYHeight) {
					scrollbarYTop = containerHeight - scrollbarYHeight;
				}
				if (scrollbarXLeft >= containerWidth - scrollbarXWidth) {
					scrollbarXLeft = containerWidth - scrollbarXWidth;
				}

				updateScrollbarCss();
			};

			var bindMouseScrollXHandler = function () {
				var currentLeft,
					currentPageX;

				$scrollbarX.bind('mousedown' + eventClassName, function (e) {
					currentPageX = e.pageX;
					currentLeft = $scrollbarX.position().left;
					$scrollbarXRail.addClass('in-scrolling');
					e.stopPropagation();
					e.preventDefault();
				});

				$(document).bind('mousemove' + eventClassName, function (e) {
					if ($scrollbarXRail.hasClass('in-scrolling')) {
						updateContentScrollLeft(currentLeft, e.pageX - currentPageX);
						e.stopPropagation();
						e.preventDefault();
					}
				});

				$(document).bind('mouseup' + eventClassName, function (e) {
					if ($scrollbarXRail.hasClass('in-scrolling')) {
						$scrollbarXRail.removeClass('in-scrolling');
					}
				});

				currentLeft =
					currentPageX = null;
			};

			var bindMouseScrollYHandler = function () {
				var currentTop,
					currentPageY;

				$scrollbarY.bind('mousedown' + eventClassName, function (e) {
					currentPageY = e.pageY;
					currentTop = $scrollbarY.position().top;
					$scrollbarYRail.addClass('in-scrolling');
					e.stopPropagation();
					e.preventDefault();
				});

				$(document).bind('mousemove' + eventClassName, function (e) {
					if ($scrollbarYRail.hasClass('in-scrolling')) {
						updateContentScrollTop(currentTop, e.pageY - currentPageY);
						e.stopPropagation();
						e.preventDefault();
					}
				});

				$(document).bind('mouseup' + eventClassName, function (e) {
					if ($scrollbarYRail.hasClass('in-scrolling')) {
						$scrollbarYRail.removeClass('in-scrolling');
					}
				});

				currentTop =
					currentPageY = null;
			};

			// check if the default scrolling should be prevented.
			var shouldPreventDefault = function (deltaX, deltaY) {
				var scrollTop = $this.scrollTop();
				if (deltaX === 0) {
					if (!scrollbarYActive) {
						return false;
					}
					if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= contentHeight - containerHeight && deltaY < 0)) {
						return !settings.wheelPropagation;
					}
				}

				var scrollLeft = $this.scrollLeft();
				if (deltaY === 0) {
					if (!scrollbarXActive) {
						return false;
					}
					if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= contentWidth - containerWidth && deltaX > 0)) {
						return !settings.wheelPropagation;
					}
				}
				return true;
			};

			// bind handlers
			var bindMouseWheelHandler = function () {
				var shouldPrevent = false;
				
				$this.bind('wheel' + eventClassName, function (e, deprecatedDelta, deprecatedDeltaX, deprecatedDeltaY) {
					var deltaX = e.deltaX ? e.deltaX / 10 : deprecatedDeltaX,
						deltaY = e.deltaY ? e.deltaY / 10 : deprecatedDeltaY,
						WheelSpeed = ($.Browser.Firefox ? 60 : settings.wheelSpeed);

					if (!settings.useBothWheelAxes) {
						// deltaX will only be used for horizontal scrolling and deltaY will
						// only be used for vertical scrolling - this is the default
						$this.scrollTop($this.scrollTop() + (deltaY * WheelSpeed));
						$this.scrollLeft($this.scrollLeft() - (deltaX * WheelSpeed));
					} else if (scrollbarYActive && !scrollbarXActive) {
						// only vertical scrollbar is active and useBothWheelAxes option is
						// active, so let's scroll vertical bar using both mouse wheel axes
						if (deltaY) {
							$this.scrollTop($this.scrollTop() - (deltaY * WheelSpeed));
						} else {
							$this.scrollTop($this.scrollTop() + (deltaX * WheelSpeed));
						}
					} else if (scrollbarXActive && !scrollbarYActive) {
						// useBothWheelAxes and only horizontal bar is active, so use both
						// wheel axes for horizontal bar
						if (deltaX) {
							$this.scrollLeft($this.scrollLeft() + (deltaX * WheelSpeed));
						} else {
							$this.scrollLeft($this.scrollLeft() - (deltaY * WheelSpeed));
						}
					}

					// update bar position
					updateBarSizeAndPosition();

					shouldPrevent = shouldPreventDefault(deltaX, deltaY);
					if (shouldPrevent) {
						e.preventDefault();
					}
				});

				// fix Firefox scroll problem
				$this.bind('MozMousePixelScroll' + eventClassName, function (e) {
					console.log(e);
					if (shouldPrevent) {
						e.preventDefault();
					}
				});
			};

			var bindKeyboardHandler = function () {
				var hovered = false;
				$this.bind('mouseenter' + eventClassName, function (e) {
					hovered = true;
				});
				$this.bind('mouseleave' + eventClassName, function (e) {
					hovered = false;
				});

				var shouldPrevent = false;
				$(document).bind('keydown' + eventClassName, function (e) {
					if (!hovered) {
						return;
					}

					var deltaX = 0,
						deltaY = 0;

					switch (e.which) {
					case 37: // left
						deltaX = -3;
						break;
					case 38: // up
						deltaY = 3;
						break;
					case 39: // right
						deltaX = 3;
						break;
					case 40: // down
						deltaY = -3;
						break;
					case 33: // page up
						deltaY = 9;
						break;
					case 32: // space bar
					case 34: // page down
						deltaY = -9;
						break;
					case 35: // end
						deltaY = -containerHeight;
						break;
					case 36: // home
						deltaY = containerHeight;
						break;
					default:
						return;
					}

					$this.scrollTop($this.scrollTop() - (deltaY * settings.wheelSpeed));
					$this.scrollLeft($this.scrollLeft() + (deltaX * settings.wheelSpeed));

					shouldPrevent = shouldPreventDefault(deltaX, deltaY);
					if (shouldPrevent) {
						e.preventDefault();
					}
				});
			};

			var bindRailClickHandler = function () {
				var stopPropagation = function (e) {
					e.stopPropagation();
				};

				$scrollbarY.bind('click' + eventClassName, stopPropagation);
				$scrollbarYRail.bind('click' + eventClassName, function (e) {
					var halfOfScrollbarLength = parseInt(scrollbarYHeight / 2, 10),
						positionTop = e.pageY - $scrollbarYRail.offset().top - halfOfScrollbarLength,
						maxPositionTop = containerHeight - scrollbarYHeight,
						positionRatio = positionTop / maxPositionTop;

					if (positionRatio < 0) {
						positionRatio = 0;
					} else if (positionRatio > 1) {
						positionRatio = 1;
					}

					$this.scrollTop((contentHeight - containerHeight) * positionRatio);
				});

				$scrollbarX.bind('click' + eventClassName, stopPropagation);
				$scrollbarXRail.bind('click' + eventClassName, function (e) {
					var halfOfScrollbarLength = parseInt(scrollbarXWidth / 2, 10),
						positionLeft = e.pageX - $scrollbarXRail.offset().left - halfOfScrollbarLength,
						maxPositionLeft = containerWidth - scrollbarXWidth,
						positionRatio = positionLeft / maxPositionLeft;

					if (positionRatio < 0) {
						positionRatio = 0;
					} else if (positionRatio > 1) {
						positionRatio = 1;
					}

					$this.scrollLeft((contentWidth - containerWidth) * positionRatio);
				});
			};

			// bind mobile touch handler
			var bindMobileTouchHandler = function () {
				var applyTouchMove = function (differenceX, differenceY) {
					$this.scrollTop($this.scrollTop() - differenceY);
					$this.scrollLeft($this.scrollLeft() - differenceX);

					// update bar position
					updateBarSizeAndPosition();
				};

				var startCoords = {},
					startTime = 0,
					speed = {},
					breakingProcess = null,
					inGlobalTouch = false;

				$(window).bind("touchstart" + eventClassName, function (e) {
					inGlobalTouch = true;
				});
				$(window).bind("touchend" + eventClassName, function (e) {
					inGlobalTouch = false;
				});

				$this.bind("touchstart" + eventClassName, function (e) {
					var touch = e.originalEvent.targetTouches[0];

					startCoords.pageX = touch.pageX;
					startCoords.pageY = touch.pageY;

					startTime = (new Date()).getTime();

					if (breakingProcess !== null) {
						clearInterval(breakingProcess);
					}

					e.stopPropagation();
				});
				$this.bind("touchmove" + eventClassName, function (e) {
					if (!inGlobalTouch && e.originalEvent.targetTouches.length === 1) {
						var touch = e.originalEvent.targetTouches[0];

						var currentCoords = {};
						currentCoords.pageX = touch.pageX;
						currentCoords.pageY = touch.pageY;

						var differenceX = currentCoords.pageX - startCoords.pageX,
							differenceY = currentCoords.pageY - startCoords.pageY;

						applyTouchMove(differenceX, differenceY);
						startCoords = currentCoords;

						var currentTime = (new Date()).getTime();

						var timeGap = currentTime - startTime;
						if (timeGap > 0) {
							speed.x = differenceX / timeGap;
							speed.y = differenceY / timeGap;
							startTime = currentTime;
						}

						e.preventDefault();
					}
				});
				$this.bind("touchend" + eventClassName, function (e) {
					clearInterval(breakingProcess);
					breakingProcess = setInterval(function () {
						if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
							clearInterval(breakingProcess);
							return;
						}

						applyTouchMove(speed.x * 30, speed.y * 30);

						speed.x *= 0.8;
						speed.y *= 0.8;
					}, 10);
				});
			};

			var bindScrollHandler = function () {
				$this.bind('scroll' + eventClassName, function (e) {
					updateBarSizeAndPosition();
				});
			};

			var destroy = function () {
				$this.unbind(eventClassName);
				$(window).unbind(eventClassName);
				$(document).unbind(eventClassName);
				$this.data('fas-scrollbar', null);
				$this.data('fas-scrollbar-update', null);
				$this.data('fas-scrollbar-destroy', null);
				$scrollbarX.remove();
				$scrollbarY.remove();
				$scrollbarXRail.remove();
				$scrollbarYRail.remove();

				// clean all variables
				$scrollbarX =
					$scrollbarY =
					containerWidth =
					containerHeight =
					contentWidth =
					contentHeight =
					scrollbarXWidth =
					scrollbarXLeft =
					scrollbarXBottom =
					scrollbarYHeight =
					scrollbarYTop =
					scrollbarYRight = null;
			};

			var ieSupport = function (version) {
				$this.addClass('ie').addClass('ie' + version);

				var bindHoverHandlers = function () {
					var mouseenter = function () {
						$(this).addClass('hover');
					};
					var mouseleave = function () {
						$(this).removeClass('hover');
					};
					$this.bind('mouseenter' + eventClassName, mouseenter).bind('mouseleave' + eventClassName, mouseleave);
					$scrollbarXRail.bind('mouseenter' + eventClassName, mouseenter).bind('mouseleave' + eventClassName, mouseleave);
					$scrollbarYRail.bind('mouseenter' + eventClassName, mouseenter).bind('mouseleave' + eventClassName, mouseleave);
					$scrollbarX.bind('mouseenter' + eventClassName, mouseenter).bind('mouseleave' + eventClassName, mouseleave);
					$scrollbarY.bind('mouseenter' + eventClassName, mouseenter).bind('mouseleave' + eventClassName, mouseleave);
				};

				var fixIe6ScrollbarPosition = function () {
					updateScrollbarCss = function () {
						$scrollbarX.css({
							left: scrollbarXLeft + $this.scrollLeft(),
							bottom: scrollbarXBottom,
							width: scrollbarXWidth
						});
						$scrollbarY.css({
							top: scrollbarYTop + $this.scrollTop(),
							right: scrollbarYRight,
							height: scrollbarYHeight
						});
						$scrollbarX.hide().show();
						$scrollbarY.hide().show();
					};
				};

				if (version === 6) {
					bindHoverHandlers();
					fixIe6ScrollbarPosition();
				}
			};

			var supportsTouch = (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);

			var initialize = function () {
				// var ieMatch = navigator.userAgent.toLowerCase().match(/(msie) ([\w.]+)/);
				// if (ieMatch && ieMatch[1] === 'msie') {
				// 	// must be executed at first, because 'ieSupport' may addClass to the container
				// 	ieSupport(parseInt(ieMatch[2], 10));
				// }

				updateBarSizeAndPosition();
				bindScrollHandler();
				bindMouseScrollXHandler();
				bindMouseScrollYHandler();
				bindRailClickHandler();

				if (supportsTouch) {
					bindMobileTouchHandler();
				}

				if ($this.wheel) {
					bindMouseWheelHandler();
				}

				if (settings.useKeyboard) {
					bindKeyboardHandler();
				}

				$this.data('fas-scrollbar', $this);
				$this.data('fas-scrollbar-update', updateBarSizeAndPosition);
				$this.data('fas-scrollbar-destroy', destroy);
			};

			// initialize
			initialize();

			return $this;
		});
	};
})(Yaex)


+(function ($) {
	'use strict';

	// TOOLTIP PUBLIC CLASS DEFINITION
	var Tooltip = function (element, options) {
		this.type =
			this.options =
			this.enabled =
			this.timeout =
			this.hoverState =
			this.$element = null;

		this.init('tooltip', element, options);
	};

	Tooltip.DEFAULTS = {
		animation: true,
		placement: 'top',
		selector: false,
		template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
		trigger: 'hover focus',
		title: '',
		delay: 0,
		html: false,
		container: false
	};

	Tooltip.prototype.init = function (type, element, options) {
		this.enabled = true;
		this.type = type;
		this.$element = $(element);
		this.options = this.getOptions(options);

		var triggers = this.options.trigger.split(' ');

		for (var i = triggers.length; i--;) {
			var trigger = triggers[i];

			if (trigger == 'click') {
				this.$element.bind('click.' + this.type, this.options.selector, $.Proxy(this.toggle, this));
			} else if (trigger !== 'manual') {
				var eventIn;
				var eventOut;

				if (trigger == 'hover') {
					eventIn = 'mouseenter';
					eventOut = 'mouseleave';
				} else {
					eventIn = 'focus';
					eventOut = 'blur';
				}

				this.$element.on(eventIn + '.' + this.type, this.options.selector, null, $.Proxy(this.enter, this));
				this.$element.on(eventOut + '.' + this.type, this.options.selector, null, $.Proxy(this.leave, this));
			}
		}

		this.options.selector ?
			(this._options = $.Extend({}, this.options, {
				trigger: 'manual',
				selector: ''
			})) :
			this.fixTitle();
	};

	Tooltip.prototype.getDefaults = function () {
		return Tooltip.DEFAULTS;
	};

	Tooltip.prototype.getOptions = function (options) {
		options = $.Extend({}, this.getDefaults(), this.$element.data(), options);

		if (options.delay && typeof options.delay == 'number') {
			options.delay = {
				show: options.delay,
				hide: options.delay
			};
		}

		return options;
	};

	Tooltip.prototype.getDelegateOptions = function () {
		var options = {};
		var defaults = this.getDefaults();

		this._options && $.Each(this._options, function (key, value) {
			if (defaults[key] != value) options[key] = value;
		});

		return options;
	};

	Tooltip.prototype.enter = function (obj) {
		var self = obj instanceof this.constructor ?
			obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('yaex.' + this.type);
			
		clearTimeout(self.timeout);

		self.hoverState = 'in';

		if (!self.options.delay || !self.options.delay.show) return self.show();

		self.timeout = setTimeout(function () {
			if (self.hoverState == 'in') self.show();
		}, self.options.delay.show);
	}

	Tooltip.prototype.leave = function (obj) {
		var self = obj instanceof this.constructor ?
			obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('yaex.' + this.type);

		clearTimeout(self.timeout);

		self.hoverState = 'out';

		if (!self.options.delay || !self.options.delay.hide) return self.hide();

		self.timeout = setTimeout(function () {
			if (self.hoverState == 'out') self.hide();
		}, self.options.delay.hide);
	};

	Tooltip.prototype.show = function () {
		var e = $.Event('show.yaex.' + this.type);

		if (this.hasContent() && this.enabled) {
			this.$element.trigger(e);

			if (e.isDefaultPrevented()) return;

			var $tip = this.tip();

			this.setContent();

			if (this.options.animation) $tip.addClass('fade');

			var placement = typeof this.options.placement == 'function' ?
				this.options.placement.call(this, $tip[0], this.$element[0]) :
				this.options.placement;

			var autoToken = /\s?auto?\s?/i;
			var autoPlace = autoToken.test(placement);
			if (autoPlace) placement = placement.replace(autoToken, '') || 'top';


			$tip
				.detach()
				.css({
					top: 0,
					left: 0,
					display: 'block'
				})
				.addClass(placement);

			this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);
			// this.options.container ? $tip.appendTo(this.options.container) : $tip.insertBefore(this.$element);

			var pos = this.getPosition();
			var actualWidth = $tip[0].offsetWidth;
			var actualHeight = $tip[0].offsetHeight;

			if (autoPlace) {
				var $parent = this.$element.parent();

				var orgPlacement = placement;
				var docScroll = document.documentElement.scrollTop || document.body.scrollTop;
				var parentWidth = this.options.container == 'body' ? window.innerWidth : $parent.outerWidth();
				var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight();
				var parentLeft = this.options.container == 'body' ? 0 : $parent.offset().left;

				placement = placement == 'bottom' && pos.top + pos.height + actualHeight - docScroll > parentHeight ? 'top' :
					placement == 'top' && pos.top - docScroll - actualHeight < 0 ? 'bottom' :
					placement == 'right' && pos.right + actualWidth > parentWidth ? 'left' :
					placement == 'left' && pos.left - actualWidth < parentLeft ? 'right' :
					placement;

				$tip.removeClass(orgPlacement).addClass(placement);
			}

			var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

			this.applyPlacement(calculatedOffset, placement);
			this.$element.trigger('shown.yaex.' + this.type);
		}
	}

	Tooltip.prototype.applyPlacement = function (offset, placement) {
		var replace;
		var $tip = this.tip();
		var width = $tip[0].offsetWidth;
		var height = $tip[0].offsetHeight;

		// manually read margins because getBoundingClientRect includes difference
		var marginTop = parseInt($tip.css('margin-top'), 10);
		var marginLeft = parseInt($tip.css('margin-left'), 10);

		// we must check for NaN for ie 8/9
		if (isNaN(marginTop)) marginTop = 0;
		if (isNaN(marginLeft)) marginLeft = 0;

		offset.top = offset.top + marginTop;
		offset.left = offset.left + marginLeft;

		$tip.offset(offset).addClass('in');

		// check to see if placing tip in new offset caused the tip to resize itself
		var actualWidth = $tip[0].offsetWidth;
		var actualHeight = $tip[0].offsetHeight;

		if (placement == 'top' && actualHeight != height) {
			replace = true;
			offset.top = offset.top + height - actualHeight;
		}

		if (/bottom|top/.test(placement)) {
			var delta = 0;

			if (offset.left < 0) {
				delta = offset.left * -2;
				offset.left = 0;

				$tip.offset(offset);

				actualWidth = $tip[0].offsetWidth;
				actualHeight = $tip[0].offsetHeight;
			}

			this.replaceArrow(delta - width + actualWidth, actualWidth, 'left');
		} else {
			this.replaceArrow(actualHeight - height, actualHeight, 'top');
		}

		if (replace) {
			$tip.offset(offset);
		}
	};

	Tooltip.prototype.replaceArrow = function (delta, dimension, position) {
		this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '');
	};

	Tooltip.prototype.setContent = function () {
		var $tip = this.tip();
		var title = this.getTitle();

		$tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
		$tip.removeClass('fade in top bottom left right');
	};

	Tooltip.prototype.hide = function () {
		var that = this;
		var $tip = this.tip();
		var e = $.Event('hide.yaex.' + this.type);

			function complete() {
				if (that.hoverState != 'in') {
					$tip.detach();
				}
			}

		this.$element.trigger(e);

		if (e.isDefaultPrevented()) return;

		$tip.removeClass('in');

		$.Support.transition && this.$tip.hasClass('fade') ?
			$tip.one($.Support.transition.end, complete)
				.emulateTransitionEnd(350) :
				complete();

		this.$element.trigger('hidden.yaex.' + this.type);

		return this;
	};

	Tooltip.prototype.fixTitle = function () {
		var $e = this.$element;

		if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
			$e.attr('data-original-title', $e.attr('title') || '').attr('title', '');
		}
	};

	Tooltip.prototype.hasContent = function () {
		return this.getTitle();
	};

	Tooltip.prototype.getPosition = function () {
		var el = this.$element[0];
		return $.Extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
			width: el.offsetWidth,
			height: el.offsetHeight
		}, this.$element.offset());
	};

	Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
		return placement == 'bottom' ? {
			top: pos.top + pos.height,
			left: pos.left + pos.width / 2 - actualWidth / 2
		} :
			placement == 'top' ? {
				top: pos.top - actualHeight,
				left: pos.left + pos.width / 2 - actualWidth / 2
		} :
			placement == 'left' ? {
				top: pos.top + pos.height / 2 - actualHeight / 2,
				left: pos.left - actualWidth
		} :
		/* placement == 'right' */
		{
			top: pos.top + pos.height / 2 - actualHeight / 2,
			left: pos.left + pos.width
		};
	};

	Tooltip.prototype.getTitle = function () {
		var title;
		var $e = this.$element;
		var o = this.options;

		title = $e.attr('data-original-title') || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title);

		return title;
	};

	Tooltip.prototype.tip = function () {
		return this.$tip = this.$tip || $(this.options.template);
	};

	Tooltip.prototype.arrow = function () {
		return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow');
	};

	Tooltip.prototype.validate = function () {
		if (!this.$element[0].parentNode) {
			this.hide();
			this.$element = null;
			this.options = null;
		}
	};

	Tooltip.prototype.enable = function () {
		this.enabled = true;
	};

	Tooltip.prototype.disable = function () {
		this.enabled = false;
	};

	Tooltip.prototype.toggleEnabled = function () {
		this.enabled = !this.enabled;
	};

	Tooltip.prototype.toggle = function (e) {
		var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('yaex.' + this.type) : this
		self.tip().hasClass('in') ? self.leave(self) : self.enter(self);
	};

	Tooltip.prototype.destroy = function () {
		this.hide().$element.off('.' + this.type).removeData('yaex.' + this.type);
	};

	$.fn.tooltip = function (option) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('yaex.tooltip');
			var options = typeof option == 'object' && option;

			if (!data) $this.data('yaex.tooltip', (data = new Tooltip(this, options)));
			if (typeof option == 'string') data[option]();
		});
	};

	$.fn.tooltip.constructor = Tooltip;
})(Yaex)


+(function ($) {
	'use strict';

	// POPOVER PUBLIC CLASS DEFINITION
	var Popover = function (element, options) {
		this.init('popover', element, options);
	};

	if (!$.fn.tooltip) throw new Error('Popover requires Tooltip.js');

	Popover.DEFAULTS = $.Extend({}, $.fn.tooltip.constructor.DEFAULTS, {
		placement: 'right',
		trigger: 'click',
		content: '',
		template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
	});

	// NOTE: POPOVER EXTENDS Tooltip.js
	Popover.prototype = $.Extend({}, $.fn.tooltip.constructor.prototype);

	Popover.prototype.constructor = Popover;

	Popover.prototype.getDefaults = function () {
		return Popover.DEFAULTS;
	};

	Popover.prototype.setContent = function () {
		var $tip = this.tip();
		var title = this.getTitle();
		var content = this.getContent();

		$tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title);
		$tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content);

		$tip.removeClass('fade top bottom left right in');

		// IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
		// this manually by checking the contents.
		if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide();
	};

	Popover.prototype.hasContent = function () {
		return this.getTitle() || this.getContent();
	};

	Popover.prototype.getContent = function () {
		var $e = this.$element;
		var o = this.options;

		return $e.attr('data-content') || (typeof o.content == 'function' ?
			o.content.call($e[0]) :
			o.content);
	};

	Popover.prototype.arrow = function () {
		return this.$arrow = this.$arrow || this.tip().find('.arrow');
	};

	Popover.prototype.tip = function () {
		if (!this.$tip) this.$tip = $(this.options.template);
		return this.$tip;
	};

	$.fn.popover = function (option) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('yaex.popover');
			var options = typeof option == 'object' && option;

			if (!data) $this.data('yaex.popover', (data = new Popover(this, options)));
			if (typeof option == 'string') data[option]();
		});
	};

	$.fn.popover.constructor = Popover;
})(Yaex)


+(function ($) {
	var defaults = {
		customOffset: true,
		manual: true,
		onlyInContainer: true
	};

	$.fn.AutoFix = function (options) {
		var settings = $.Extend({}, defaults, options),
			el = $(this),
			curpos = el.position(),
			offset = settings.customOffset,
			pos = el.offset();

		el.addClass('YaexAutoFix');

		$.fn.ManualFix = function () {
			var el = $(this),
				pos = el.offset();

			if (el.hasClass('_Fixed')) {
				el.removeClass('_Fixed');
			} else {
				el.addClass('_Fixed').css({
					top: 0,
					left: pos.left,
					right: 'auto',
					bottom: 'auto'
				});
			}
		};

		fixAll = function (el, settings, curpos, pos) {
			if (settings.customOffset == false) offset = el.parent().offset().top;
			if ($(document).scrollTop() > offset && $(document).scrollTop() <= (el.parent().height() + (offset - $(window).height()))) {
				el.removeClass('_Bottom').addClass('_Fixed').css({
					top: 0,
					left: pos.left,
					right: 'auto',
					bottom: 'auto'
				});
			} else {
				if ($(document).scrollTop() > offset) {
					if (settings.onlyInContainer == true) {
						if ($(document).scrollTop() > (el.parent().height() - $(window).height())) {
							el.addClass('_Bottom _Fixed').removeAttr('style').css({
								left: curpos.left
							});
						} else {
							el.removeClass('_Bottom _Fixed').removeAttr('style');

						}
					}
				} else {
					el.removeClass('_Bottom _Fixed').removeAttr('style');
				}
			}
		};

		if (settings.manual == false) {
			$(window).scroll(function () {
				fixAll(el, settings, curpos, pos);
			});
		}
	};
})(Yaex)


