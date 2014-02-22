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
		return new Yaex.init($selector, $context);
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
