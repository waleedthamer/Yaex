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
 * Core - Yaex's Core
 *
 *
 * @depends: None
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

('Yaex', function (window, document, undefined) {

	'use strict';

	var OldYaex = window.Yaex;

	var Yaex = new Object;

	Yaex.Version = '0.12';
	Yaex.BuildNumber = '1077';
	Yaex.DevStatus = 'dev';
	Yaex.CodeName = 'Karmen';

	/**
	 * Yaex.Global
	 */
	Yaex.Global = new Object;

	/**
	 * Yaex.Mixin
	 */
	Yaex.Mixin = new Object;

	// Define Yaex for Node module pattern loaders, including Browserify
	if (typeof (module) === 'object' && typeof (module.exports) === 'object') {
		module.exports = Yaex;
		// Define Yaex as an AMD module
	} else if (typeof (define) === 'function' && define.amd) {
		define(Yaex);
	}

	// Define Yaex as a global Yaex variable, saving the original Yaex to restore later if needed
	Yaex.noConflict = function () {
		window.Yaex = OldYaex;
		return this;
	};

	//---

	window.Yaex = Yaex;

	//---

	/**
	 * Yaex.Global
	 */
	Yaex.Global = new Object;

	/**
	 * Yaex.Mixin
	 */
	Yaex.Mixin = new Object;

	var EmptyArray = new Array;

	var Filter = EmptyArray.filter;

	// [[Class]] -> Type Pairs
	var ClassToType = {};

	//---

	// Yaex.hasOwnProperty = ({}).hasOwnProperty;
	// Yaex.toString = ({}).toString;
	// Yaex.reContainsWordChar = null;
	// Yaex.reGetFunctionBody = null;
	// Yaex.reRemoveCodeComments = null;

	// BEGIN OF [Private Functions]

	/**
	 * Type
	 *
	 * Get the type of Object
	 *
	 * @param 	Mix object Variable to get type
	 * @return 	string The object type
	 */

	function Type(object) {
		var type;
		var _toString;

		// if (object === null) {
		// 	type = String(object);
		// } else if (({})[Yaex.toString.call(object)]) {
		// 	type = Yaex.toString.call(object);
		// } else {
		// 	type = typeof (object);
		// }

		_toString = ClassToType.toString;

		if (object === null) {
			type = String(object);
		} else if (({})[_toString.call(object)]) {
			// type = toString.call(object);
			type = ClassToType[_toString.call(object)];
		} else {
			type = typeof (object);
		}

		return type;
	}

	/**
	 * isString
	 *
	 * Checks if the given object is a String
	 *
	 * @param 	Mix object Variable to check
	 * @return 	boolean TRUE|FALSE
	 */

	function isString(object) {
		return Type(object) === 'string';
	}

	/**
	 * isObject
	 *
	 * Checks if the given object is an Object
	 *
	 * @param 	Mix object Variable to check
	 * @return 	boolean TRUE|FALSE
	 */

	function isObject(object) {
		return Type(object) === 'object';
	}

	/**
	 * isPlainObject
	 *
	 * Checks if the given object is a Plain Object
	 *
	 * @param 	Mix object Variable to check
	 * @return 	boolean TRUE|FALSE
	 */

	function isPlainObject(object) {
		return isObject(object) && !isWindow(object) && Object.getPrototypeOf(object) === Object.prototype;
	}

	/**
	 * isArray
	 *
	 * Checks if the given object is an Array
	 *
	 * @param 	Mix object Variable to check
	 * @return 	boolean TRUE|FALSE
	 */

	function isArray(object) {
		return Array.isArray(object);
	}

	/**
	 * isFunction
	 *
	 * Checks if the given object is a Function
	 *
	 * @param 	Mix object Variable to check
	 * @return 	boolean TRUE|FALSE
	 */

	function isFunction(object) {
		if (Type(object) === 'function') {
			return true;
		}

		return false;
	}

	/**
	 * isWindow
	 *
	 * Checks if the given object is a Window Object
	 *
	 * @param 	Mix object Variable to check
	 * @return 	boolean TRUE|FALSE
	 */

	function isWindow(object) {
		return object !== null && object === object.window;
	}

	/**
	 * isDocument
	 *
	 * Checks if the given object is a Window Document Object
	 *
	 * @param 	Mix object Variable to check
	 * @return 	boolean TRUE|FALSE
	 */

	function isDocument(object) {
		return object !== null && object.nodeType === object.DOCUMENT_NODE;
	}

	/**
	 * isNumber
	 *
	 * Checks if the given object is a Number
	 *
	 * @param 	Mix object Variable to check
	 * @return 	boolean TRUE|FALSE
	 */

	function isNumber(object) {
		return !isNaN(parseFloat(object)) && isFinite(object);
	}

	/**
	 * isUndefined
	 *
	 * Checks if the given object is Undefined
	 *
	 * @param 	Mix object Variable to check
	 * @return 	boolean if TRUE| string object type if FALSE
	 */

	function isUndefined(object) {
		return Type(object) === Type();
	}

	/**
	 * isDefined
	 *
	 * Checks if the given object is Undefined
	 *
	 * @param 	Mix object Variable to check
	 * @return 	boolean if TRUE| string object type if FALSE
	 */

	function isDefined(object) {
		return Type(object) !== 'undefined';
	}

	/**
	 * likeArray
	 *
	 * Checks if the given object is an Array like Object
	 *
	 * @param 	Mix object Variable to check
	 * @return 	boolean TRUE|FALSE
	 */

	function likeArray(object) {
		return Type(object.length) === 'number';
	}

	/**
	 * isArraylike
	 *
	 * Checks if the given object is an Array like Object
	 *
	 * @param 	Mix object Variable to check
	 * @return 	boolean TRUE|FALSE
	 */

	function isArraylike(object) {
		var length = object.length;

		if (isWindow(object)) {
			return false;
		}

		if (object.nodeType === 1 && length) {
			return true;
		}

		return isArray(object) || !isFunction(object) &&
			(length === 0 || isNumber(length) && length > 0 && (length - 1) in object);
	}

	/**
	 * isNull
	 *
	 * Checks if the given object is Null
	 *
	 * @param 	Mix object Variable to check
	 * @return 	boolean TRUE|FALSE
	 */

	function isNull(object) {
		return Type(object) === Type(null);
	}

	/**
	 * isObjectEmpty
	 *
	 * Checks if the given object is an empty Object
	 *
	 * @param 	Mix object Variable to check
	 * @return 	boolean TRUE|FALSE
	 */

	function isObjectEmpty(object) {
		for (var name in object) {
			if (object.hasOwnProperty(name)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * isFunctionEmpty
	 *
	 * Checks if the given object is an empty Function
	 *
	 * @param 	Mix object Variable to check
	 * @return 	boolean TRUE|FALSE
	 */

	function isFunctionEmpty(object) {
		// Only get RegExs when needed
		var array = getGetFunctionBodyRegEx().exec(object);

		if (array && array.length > 1 && array[1] !== undefined) {

			var body = array[1].replace(getRemoveCodeCommentsRegEx(), '');

			if (body && getContainsWordCharRegEx().test(body)) {
				return false;
			}
		}

		return true;
	}

	/**
	 * isBool
	 *
	 * Checks if the given object is Boolean
	 *
	 * @param 	Mix object Variable to check
	 * @return 	boolean TRUE|FALSE
	 */

	function isBool(object) {
		if (Type(object) === 'boolean') {
			return true;
		}

		return false;
	}

	/**
	 * isEmpty
	 *
	 * Checks if the given value is Empty
	 *
	 * @param 	Mix object Variable to check
	 * @return 	boolean TRUE|FALSE
	 */

	function isEmpty(value) {
		var empty = [null, '', 0, false, undefined];

		var isEmpty = false;

		if (Array.isArray(value) && value.length === 0) {
			isEmpty = true;
		} else if (isFunction(value) && isFunctionEmpty(value)) {
			isEmpty = true;
		} else if (isObject(value) && isObjectEmpty(value)) {
			isEmpty = true;
		} else if (Type(value) === 'number' && isNaN(value)) {
			isEmpty = (value === Number.NEGATIVE_INFINITY || value === Number.POSITIVE_INFINITY) ? false : true;
		} else {
			for (var x = empty.length; x > 0; x--) {
				if (empty[x - 1] === value) {
					isEmpty = true;
					break;
				}
			}
		}

		return isEmpty;
	}

	/**
	 * inArray
	 *
	 * @return 	array
	 */

	function inArray(element, array, number) {
		return array === null ? -1 : EmptyArray.indexOf.call(array, element, number);
	}

	/**
	 * getContainsWordCharRegEx
	 *
	 * @return 	string
	 */

	function getContainsWordCharRegEx() {
		if (!Yaex.reContainsWordChar) {
			Yaex.reContainsWordChar = new RegExp('\\S+', 'g');
		}

		return Yaex.reContainsWordChar;
	}

	/**
	 * getGetFunctionBodyRegEx
	 *
	 * @return 	string
	 */

	function getGetFunctionBodyRegEx() {
		if (!Yaex.reGetFunctionBody) {
			Yaex.reGetFunctionBody = new RegExp('{((.|\\s)*)}', 'm');
		}

		return Yaex.reGetFunctionBody;
	};

	/**
	 * getRemoveCodeCommentsRegEx
	 *
	 * @return 	string
	 */

	function getRemoveCodeCommentsRegEx() {
		if (!Yaex.reRemoveCodeComments) {
			Yaex.reRemoveCodeComments = new RegExp("(\\/\\*[\\w\\'\\s\\r\\n\\*]*\\*\\/)|(\\/\\/[\\w\\s\\']*)", 'g');
		}

		return Yaex.reRemoveCodeComments;
	}

	/**
	 * _Error
	 *
	 * Throws an Error message
	 *
	 * @param 	Mix object Variable to check
	 * @return 	void
	 */

	function _Error(message) {
		if (console) {
			console.error(message);
		} else {
			throw new Error(message);
		}

		// throw new Error(message);
	}

	/**
	 * Delay
	 *
	 * A sleep() like function
	 *
	 * @param 	int milliseconds Time in milliseconds
	 * @return 	void
	 */

	function Delay(milliseconds) {
		// milliseconds = milliseconds * 1000;

		milliseconds = milliseconds;

		var start = new Date().getTime();

		for (var i = 0; i < 1e7; i++) {
			if ((new Date().getTime() - start) > milliseconds) {
				break;
			}
		}
	}

	/**
	 * Dasherise
	 *
	 * Add dashes to string.
	 *
	 * @param 	string string String to dasherise
	 * @return 	string The dasherised string
	 */

	function Dasherise(string) {
		return string.replace(/::/g, '/')
			.replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
			.replace(/([a-z\d])([A-Z])/g, '$1_$2')
			.replace(/_/g, '-')
			.toLowerCase();
	}

	/**
	 * arrayToObject
	 *
	 * Convert a given array to an Object
	 *
	 * @param 	array array The array to convert
	 * @param 	Mix data The data to insert
	 * @return 	void
	 */

	function arrayToObject(array, type, data) {
		var _tmp_ = new Object;

		if (type && isNumber(type) && type === 1 && !data) {
			for (var x = 0; x < array.length; ++x) {
				if (!isUndefined(array[x]) && !isUndefined(array[x][0]) && !isUndefined(array[x][1])) {
					_tmp_[(array[x][0]).toString()] = array[x][1];
				}
			}
		} else {
			for (var x = 0; x < array.length; ++x) {
				if (!isUndefined(array[x])) {
					//_tmp_[x] = array[x];
					if (!isNull(data)) {
						// _tmp_[array[x]] = data;
						// _tmp_[x] = array[x];
						// _tmp_[x] = array[x];
						// console.log((array[x][0]).toString());
						// console.log(array[x][1]);
						_tmp_[(array[x][0]).toString()] = array[x][1];
						// console.log(array[x][0]);
						// _tmp_[x] = array[x];
					} else {
						_tmp_[array[x]] = null;
					}
				}
			}
		}

		return _tmp_;
	}

	/**
	 * intoArray
	 *
	 * Insert data into a given Array
	 *
	 * @param 	array array Array to insert data to
	 * @param 	mix data The data to insert
	 * @return 	void
	 */

	function intoArray(array, data) {
		var _tmp_ = new Array;

		for (var i = 0; i < array.length; ++i) {
			if (array[i] !== undefined) {
				//_tmp_[i] = array[$i];
				if (data !== null) {
					//_tmp_['\'' + array[i] + '\''] = data;
					_tmp_[array[i]] = data;
				} else {
					_tmp_[array[i]] = null;
				}
			}
		}

		return _tmp_;
	}

	/**
	 * objectToArray
	 *
	 * Convert a given object to an Array
	 *
	 * @param 	object object The object to convert
	 * @param 	int type If 1 returns the Array as [name, value], If not set 1 returns the Array as [name]
	 * @return 	void
	 */

	function objectToArray(object, type) {
		var _tmp_ = [];

		if (type && isNumber(type) && type === 1) {
			for (var x in object) {
				if (object.hasOwnProperty(x)) {
					_tmp_.push([x, object[x]]);
				}
			}
		} else {
			for (var x in object) {
				if (object.hasOwnProperty(x)) {
					_tmp_.push(object[x]);
				}
			}
		}

		return _tmp_;
	};

	/**
	 * deserialiseValue
	 *
	 * Deserialise a given value
	 *
	 * "true" 	=> true
	 * "false" 	=> false
	 * "null" 	=> null
	 * "42" 	=> 42
	 * "42.5" 	=> 42.5
	 * "08" 	=> "08"
	 * JSON 	=> parse if valid
	 * String 	=> self
	 *
	 * @param 	Mix value The value to Deserialise
	 * @return 	string The deserialised value
	 */

	function deserialiseValue(value) {
		var num;

		try {
			return value ?
				value === 'true' ||
				(value === 'false' ? false :
				value === 'null' ? null : !isNaN(num = Number(value)) && (num + '') === value ? num :
				/^[\[\{]/.test(value) ? JSON.parse(value) :
				value) : value;
		} catch (e) {
			return value;
		}
	}

	/**
	 * variableDump
	 *
	 * Dump variables as text
	 *
	 * @param 	Object/Array object Object to dump
	 * @param 	int level Level padding
	 * @return 	string The dumped text
	 */

	function variableDump(object, level) {
		var dumpedText = '';

		if (!level) {
			level = 0;
		}

		// The padding given at the beginning of the line.
		var levelPadding = ' ';

		for (var j = 0; j < level + 1; j++) {
			levelPadding += '    ';
		}

		// Array/Hashes/Objects
		if (isObject(object)) {
			for (var item in object) {
				var value = object[item];

				// If it is an array,
				if (isObject(value)) {
					dumpedText += levelPadding + "'" + item + "' ...\n";
					dumpedText += variableDump(value, level + 1);
				} else {
					dumpedText += levelPadding + "'" + item + "' => \"" + value + "\"\n";
				}
			}
			// Stings/Chars/Numbers etc.
		} else {
			dumpedText = '===>' + object + '<===(' + Type(object) + ')';
		}

		return dumpedText;
	}

	function Compact(array) {
		return Filter.call(array, function (item) {
			return item !== null;
		});
	}

	function Merge(first, second) {
		var l = second.length;
		var i = first.length;
		var j = 0;

		if (typeof (l) === 'number') {
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

	function Unique(array) {
		return Filter.call(array, function (item, index) {
			return array.indexOf(item) === index;
		});
	}

	function Camelise(string) {
		return string.replace(/-+(.)?/g, function (match, char) {
			return char ? char.toUpperCase() : '';
		});
	}

	function randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function Grep(elements, callback) {
		return Filter.call(elements, callback);
	}

	function Each(elements, callback) {
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
	}

	function Extend() {
		var options;
		var name;
		var source;
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
		if (typeof (target) !== 'object' && !Yaex.Global.isFunction(target)) {
			target = {};
		}

		// Extend Yaex itself if only one argument is passed
		if (length === i) {
			target = this;
			--i;
		}

		for (; i < length; i++) {
			// Only deal with non-null/undefined values
			if ((options = arguments[i]) !== null) {
				// Extend the base object
				for (name in options) {
					source = target[name];
					copy = options[name];

					// Prevent never-ending loop
					if (target === copy) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (Yaex.Global.isPlainObject(copy) || (copyIsArray = Yaex.Global.isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = source && Yaex.Global.isArray(source) ? source : [];

						} else {
							clone = source && Yaex.Global.isPlainObject(source) ? source : {};
						}

						// Never move original objects, clone them
						target[name] = Yaex.Utility.Extend(deep, clone, copy);

						// Don't bring in undefined values
					} else if (copy !== undefined) {
						target[name] = copy;
					}
				}
			}
		}
	}

	// END OF [Private Functions]

	//---

	// Populate the ClassToType map
	// Each('Boolean Number String Function Array Date RegExp Object Error global HTMLDocument'.split(' '), function (x, name) {
	Each('Boolean Number String Function Array Date RegExp Object Error global HTMLDocument'.split(' '), function (x, name) {
		ClassToType['[object ' + name + ']'] = name.toLowerCase();
		// ClassToType['[Object ' + name + ']'] = name;
	});

	//---

	Extend(Yaex, {
		parseJSON: JSON.parse,

		// Cross-browser XML parsing
		parseXML: function (data) {
			var xml;
			var tmp;

			if (!data || !Yaex.Global.isString(data)) {
				return null;
			}

			// Support: IE9
			try {
				tmp = new DOMParser();
				xml = tmp.parseFromString(data, 'text/xml');
			} catch (e) {
				xml = undefined;
				Yaex.Error(e);
			}

			if (!xml || xml.getElementsByTagName('parsererror').length) {
				Yaex.Error('Invalid XML: ' + data);
			}

			return xml;
		},

		// Evaluates a script in a global context
		Evaluate: function (code) {
			var script;
			var indirect = eval;

			code = Yaex.Trim(code);

			if (code) {
				// If the code includes a valid, prologue position
				// strict mode pragma, execute code by injecting a
				// script tag into the document.
				if (code.indexOf('use strict') === 1) {
					script = document.createElement('script');
					script.text = code;
					document.head.appendChild(script).parentNode.removeChild(script);
				} else {
					// Otherwise, avoid the DOM node creation, insertion
					// and removal by using an indirect global eval
					indirect(code);
				}
			}
		},

		Delay: Delay,

		Grep: Grep,

		Each: Each,

		Merge: Merge,

		Error: _Error,

		classToType: ClassToType,

		hasOwnProperty: ({}).hasOwnProperty,

		toString: ({}).toString,

		reContainsWordChar: null,

		reGetFunctionBody: null,

		reRemoveCodeComments: null,

		Now: Date.now(),

		Date: Date(),

	})

	//---

	// Shortcuts for most used Utility functions
	if (window.JSON) {
		Yaex.parseJSON = JSON.parse;
	}

	//---

	// Shortcuts for global functions
	Extend(Yaex.Global, {
		variableDump: variableDump,

		Type: Type,

		type: Type,

		isArray: isArray,

		isArraylike: isArraylike,

		isObject: isObject,

		isFunction: isFunction,

		isWindow: isWindow,

		isDocument: isDocument,

		isString: isString,

		isPlainObject: isPlainObject,

		isUndefined: isUndefined,

		isDefined: isDefined,

		likeArray: likeArray,

		isNull: isNull,

		isEmpty: isEmpty,

		isObjectEmpty: isObjectEmpty,

		isFunctionEmpty: isFunctionEmpty,

		isBool: isBool,

		isNumber: isNumber,

		isNumeric: isNumber,

		inArray: inArray,

		Unique: Unique,

		Compact: Compact,

		Camelise: Camelise,

		randomNumber: randomNumber,

		Dasherise: Dasherise,

		deserialiseValue: deserialiseValue,

		arrayToObject: arrayToObject,

		objectToArray: objectToArray,

		intoArray: intoArray,


	});

	//---


}(window, document));

//---


/**
 * Global - Global Yaex's functions and shortcuts [CORE]
 *
 *
 * @depends: Yaex.js | Core
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	//---

	// Shortcuts global functions

	// Number of active Ajax requests
	Yaex.AjaxActive = 0;

	//---

	/**
	 * Yaex.Global.Options
	 */
	Yaex.Global.Options = {
		CoreAllowAjax: true,
		CoreAllowDeferred: true,
		CoreAllowCallbacks: true,
		CoreAllowEvents: true,
	};

	//---

})(Yaex);

//---

/**
 * Global - Global Yaex's functions and shortcuts [CORE]
 *
 *
 * @depends: Yaex.js | Core
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	var Escape = encodeURIComponent;

	//---

	// BEGIN OF [Private Functions]

	//...

	// END OF [Private Functions]

	/**
	 * Yaex.Utility contains various utility functions used throughout Yaex code.
	 */
	Yaex.Utility = {
		//
		MODINFO: {
			NAME: 'Utility',
			VERSION: '0.10',
			DEPS: 'None'
		},

		// 
		LastUID: 0,

		// [Simple] Extend an object with properties of one or more other objects
		simpleExtend: function (destination) {
			var sources = Array.prototype.slice.call(arguments, 1);
			var x;
			var y;
			var length;
			var source;

			for (y = 0, length = sources.length; y < length; y++) {
				source = sources[y];

				for (x in source) {
					destination[x] = source[x];
				}
			}

			return destination;
		},

		// [Advanced] Extend an object with properties of one or more other objects
		Extend: function () {
			var options;
			var name;
			var source;
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
			if (typeof (target) !== 'object' && !Yaex.Global.isFunction(target)) {
				target = {};
			}

			// Extend Yaex itself if only one argument is passed
			if (length === i) {
				target = this;
				--i;
			}

			for (; i < length; i++) {
				// Only deal with non-null/undefined values
				if ((options = arguments[i]) !== null) {
					// Extend the base object
					for (name in options) {
						source = target[name];
						copy = options[name];

						// Prevent never-ending loop
						if (target === copy) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (Yaex.Global.isPlainObject(copy) || (copyIsArray = Yaex.Global.isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = source && Yaex.Global.isArray(source) ? source : [];

							} else {
								clone = source && Yaex.Global.isPlainObject(source) ? source : {};
							}

							// Never move original objects, clone them
							target[name] = Yaex.Utility.Extend(deep, clone, copy);

							// Don't bring in undefined values
						} else if (copy !== undefined) {
							target[name] = copy;
						}
					}
				}
			}
		},

		// Create an object from a given prototype
		Create: Object.create || (function () {
			function tempFunction() {}

			return function (_Prototype_) {
				tempFunction.prototype = _Prototype_;
				return new tempFunction();
			};
		})(),

		// Return unique ID of an object
		Stamp: function (object) {
			// jshint camelcase: false
			object._yaex_uid = object._yaex_uid || ++Yaex.Utility.LastUID;

			return object._yaex_uid;
		},

		// Bind a function to be called with a given context
		Bind: function (_function, object) {
			var Slice = Array.prototype.slice;

			if (_function.bind) {
				return _function.bind.apply(_function, Slice.call(arguments, 1));
			}

			var args = Slice.call(arguments, 2);

			return function () {
				return _function.apply(object, args.length ? args.concat(Slice.call(arguments)) : arguments);
			};
		},

		// Return a function that won't be called more often than the given interval
		Throttle: function (_function, time, context) {
			var lock;
			var args;
			var wrapperFunction;
			var later;

			later = function () {
				// Reset lock and call if queued
				lock = false;

				if (args) {
					wrapperFunction.apply(context, args);
					args = false;
				}
			};

			wrapperFunction = function () {
				if (lock) {
					// Called too soon, queue to call later
					args = arguments;

				} else {
					// Call and lock until later
					_function.apply(context, arguments);
					setTimeout(later, time);
					lock = true;
				}
			};

			return wrapperFunction;
		},

		// Do nothing (used as a Noop throughout the code)
		Noop: function () {
			return false;
		},

		// Trim whitespace from both sides of a string
		Trim: function (string) {
			return string.trim ? string.trim() : string.replace(/^\s+|\s+$/g, '');
		},

		// Split a string into words
		splitWords: function (string) {
			return Yaex.Utility.Trim(string).split(/\s+/);
		},

		// Set options to an object, inheriting parent's options as well
		setOptions: function (object, options) {
			if (!object.hasOwnProperty('options')) {
				object.options = object.options ? Yaex.Utility.Create(object.options) : {};
			}

			for (var x in options) {
				object.options[x] = options[x];
			}

			return object.options;
		},

		isArray: Array.isArray || function (object) {
			return (Object.prototype.toString.call(object) === '[object Array]');
		},

		// Minimal image URI, set to an image when disposing to flush memory
		emptyImageUrl: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',

		jsonStringify: function (object, level) {
			var result = '';
			var i;

			level = Yaex.Global.isUndefined(level) ? 1 : level;

			var type = Yaex.Global.Type(object);

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
							result += Yaex.Utility.jsonStringify(object[i], level + 1);
						}
						result += Yaex.Utility.jsonStringify(object[len - 1], level + 1) + ']';
					} else {
						result += '{';
						for (var property in object) {
							if (object.hasOwnProperty(property)) {
								result += '"' + property + '":' +
									Yaex.Utility.jsonStringify(object[property], level + 1);
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
		},

		Serialise: function(parameter, object, traditional, scope) {
			var type;
			var array = Yaex.Global.isArray(object);

			Yaex.Each(object, function (key, value) {
				type = Yaex.Global.Type(value);

				if (scope) {
					key = traditional ? scope : scope + '[' + (array ? '' : key) + ']';
				}

				// Handle data in serializeArray() format
				if (!scope && array) {
					parameter.add(value.name, value.value);
				}
				// Recurse into nested objects
				else if (Yaex.Global.isArray(type) || (!traditional && Yaex.Global.isObject(type))) {
					Yaex.Utility.Serialise(parameter, value, traditional, key);
				} else {
					parameter.add(key, value);
				}
			});
		},

		Parameters: function (object, traditional) {
			var parameter = [];

			parameter.add = function (key, value) {
				this.push(Escape(key) + '=' + Escape(value));
			};

			Yaex.Utility.Serialise(parameter, object, traditional);
			
			return parameter.join('&').replace(/%20/g, '+');
		},


	}; // END OF Yaex.Utility OBJECT

	//---

	('Yaex', function () {
		var lastTime = 0;

		// Inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

		function getPrefixed(name) {
			return window['webkit' + name] || window['moz' + name] || window['ms' + name];
		}

		// Fallback for IE 7-8

		function timeoutDefer(_function) {
			var time = +new Date();
			var timeToCall = Math.max(0, 16 - (time - lastTime));

			lastTime = time + timeToCall;

			return window.setTimeout(_function, timeToCall);
		}

		var requestFunction = window.requestAnimationFrame ||
			getPrefixed('RequestAnimationFrame') ||
			timeoutDefer;

		var cancelFunction = window.cancelAnimationFrame ||
			getPrefixed('CancelAnimationFrame') ||
			getPrefixed('CancelRequestAnimationFrame') ||
				function (id) {
					window.clearTimeout(id);
			};

		Yaex.Utility.requestAnimationFrame = function (_function, context, immediate, element) {
			if (immediate && requestFunction === timeoutDefer) {
				_function.call(context);
			} else {
				return requestFunction.call(window, Yaex.Bind(_function, context), element);
			}
		};

		Yaex.Utility.cancelAnimationFrame = function (id) {
			if (id) {
				cancelFunction.call(window, id);
			}
		};
	})();

	//---

	// Shortcuts for most used Utility functions
	Yaex.Extend = Yaex.Utility.Extend;
	Yaex.Bind = Yaex.Utility.Bind;
	Yaex.Stamp = Yaex.Utility.Stamp;
	Yaex.setOptions = Yaex.Utility.setOptions;
	Yaex.Noop = Yaex.Utility.Noop;

	Yaex.Global.Trim = Yaex.Utility.Trim;

	//---

})(Yaex);

//---

/**
 * Class - Powers the OOP facilities of Yaex's [CORE]
 *
 *
 * @depends: Yaex.js | Core
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	//---

	/**
	 * Yaex.Class powers the OOP facilities of the library.
	 */
	Yaex.Class = function () {
		//...
	}; // END OF Yaex.Class OBJECT

	//---

	Yaex.Class.Extend = function (properties) {
		// Extended class with the new prototype
		var NewClass = function () {
			// Call the constructor
			if (this.initialise) {
				this.initialise.apply(this, arguments);
			}

			// Call all constructor hooks
			if (this._initialHook.length) {
				this.callInitialHooks();
			}
		};

		// jshint camelcase: false
		var parentPrototype = NewClass.__super__ = this.prototype;

		var _Prototype_ = Yaex.Utility.Create(parentPrototype);

		_Prototype_.constructor = NewClass;

		NewClass.prototype = _Prototype_;

		// Inherit parent's statics
		for (var x in this) {
			if (this.hasOwnProperty(x) && x !== 'prototype') {
				NewClass[x] = this[x];
			}
		}

		// Mix static properties into the class
		if (properties.statics) {
			Yaex.Extend(NewClass, properties.statics);
			delete properties.statics;
		}

		// Mix includes into the prototype
		if (properties.includes) {
			Yaex.Utility.Extend.apply(null, [_Prototype_].concat(properties.includes));
			delete properties.includes;
		}

		// Merge options
		if (_Prototype_.options) {
			properties.options = Yaex.Utility.Extend(Yaex.Utility.Create(_Prototype_.options), properties.options);
		}

		// Mix given properties into the prototype
		Yaex.Extend(_Prototype_, properties);

		_Prototype_._initialHook = [];

		// Add method for calling all hooks
		_Prototype_.callInitialHooks = function () {
			if (this._initialHookCalled) {
				return;
			}

			if (parentPrototype.callInitialHooks) {
				parentPrototype.callInitialHooks.call(this);
			}

			this._initialHookCalled = true;

			for (var x = 0, len = _Prototype_._initialHook.length; x < len; x++) {
				_Prototype_._initialHook[x].call(this);
			}
		};

		return NewClass;
	};

	//---

	// Method for adding properties to prototype
	Yaex.Class.Include = function (properties) {
		Yaex.Extend(this.prototype, properties);
	};

	//---

	// Merge new default options to the Class
	Yaex.Class.mergeOptions = function (options) {
		Yaex.Extend(this.prototype.options, options);
	};

	//---

	// Add a constructor hook
	Yaex.Class.addInitialHook = function (_function) { // (Function) || (String, args...)
		var args = Array.prototype.slice.call(arguments, 1);
		var init;

		if (Yaex.Global.isFunction(_function)) {
			init = _function;
		} else {
			init = function () {
				this[_function].apply(this, args);
			};
		}

		this.prototype._initialHook = this.prototype._initialHook || [];
		this.prototype._initialHook.push(init);
	};

	//---

	// Yaex.Class.constructor = function () {

	// };

	//---

})(Yaex);

//---

/**
 * Detect - Cross browser detector implementation using Yaex's API [CORE]
 *
 *
 * @depends: Yaex.js | Core []
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {
	// 
	'use strict';

	Yaex.Extend({
		UserAgent: {},
	});

	/**
	 * Detect Suite
	 *
	 * Tests the client against a variety of modern browser features. 
	 * These tests are primarily from Mark Pilgrim's "Dive Into HTML5" section 
	 * "The All-In-One Almost-Alphabetical No-Bullshit Guide to Detecting Everything."
	 *
	 * You can find "Dive Into HTML5" here: http://www.diveintohtml5.net/
	 *
	 * "Dive Into HTML5" is protected by (CC BY 3.0):
	 * http://creativecommons.org/licenses/by/3.0/
	 */

	/**
	 * testInput
	 *
	 * Detects the user agent.
	 *
	 * @param 	Mix object Variable to check
	 * @return 	boolean TRUE|FALSE Whether or not the client supports a given feature.
	 */
	function testInput(type) {
		var _tmp_ = document.createElement('input');

		_tmp_.setAttribute('type', type);

		return _tmp_.type !== 'text';
	}

	//---

	var retina = 'devicePixelRatio' in window && window.devicePixelRatio > 1;

	if (!retina && 'matchMedia' in window) {
		// var matches = window.matchMedia('(min-resolution:144dpi)');
		var matches = window.matchMedia('(min-resolution:144dppx)');
		retina = matches && matches.matches;
	}

	// var ua = navigator.userAgent.toLowerCase();

	// var phantomjs = ua.indexOf('phantom') !== -1;

	var msPointer = navigator.msPointerEnabled && navigator.msMaxTouchPoints && !window.PointerEvent;

	var pointer = (window.PointerEvent && navigator.pointerEnabled && navigator.maxTouchPoints) || msPointer;

	//---

	/**
	 * Detect
	 *
	 * Detects the user agent
	 *
	 * @param 	string useragent The user agent string
	 * @return 	void
	 */
	function Detect(useragent) {
		var OS = this.OS = {};
		var Browser = this.Browser = {};

		var platform = useragent.match(/Linux/) || 
			useragent.match(/Windows/) || 
			useragent.match(/iOS/) || 
			useragent.match(/Android/) || 
			'Unknown';

		var webkit = useragent.match(/Web[kK]it[\/]{0,1}([\d.]+)/);
		var gecko = useragent.match(/Gecko[\/]{0,1}([\d.]+)/);
		var android = useragent.match(/(Android);?[\s\/]+([\d.]+)?/);
		var ipad = useragent.match(/(iPad).*OS\s([\d_]+)/);
		var ipod = useragent.match(/(iPod)(.*OS\s([\d_]+))?/);
		var iphone = !ipad && useragent.match(/(iPhone\sOS)\s([\d_]+)/);
		var webos = useragent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/);
		var touchpad = webos && useragent.match(/TouchPad/);
		var kindle = useragent.match(/Kindle\/([\d.]+)/);
		var silk = useragent.match(/Silk\/([\d._]+)/);
		var blackberry = useragent.match(/(BlackBerry).*Version\/([\d.]+)/);
		var bb10 = useragent.match(/(BB10).*Version\/([\d.]+)/);
		var rimtabletos = useragent.match(/(RIM\sTablet\sOS)\s([\d.]+)/);
		var playbook = useragent.match(/PlayBook/);
		var chrome = useragent.match(/Chrome\/([\d.]+)/) || useragent.match(/CriOS\/([\d.]+)/);
		var firefox = useragent.match(/Firefox\/([\d.]+)/);
		var ie = useragent.match(/MSIE ([\d.]+)/);
		var safari = webkit && useragent.match(/Mobile\//) && !chrome;
		var webview = useragent.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/) && !chrome;

		ie = useragent.match(/MSIE\s([\d.]+)/);

		// TODO: clean this up with a better OS/Browser separation:
		// - discern (more) between multiple browsers on android
		// - decide if kindle fire in silk mode is android or not
		// - Firefox on Android doesn't specify the Android version
		// - possibly divide in OS, device and Browser hashes

		if (Browser.Webkit = !! webkit) {
			Browser.Version = webkit[1];
		}

		if (Browser.Gecko = !! gecko) {
			Browser.Version = gecko[1];
		}

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

		if (!silk && OS.Android && useragent.match(/Kindle Fire/)) {
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

		if (safari && (useragent.match(/Safari/) || !! OS.iOS)) {
			Browser.Safari = true;
		}

		if (webview) {
			Browser.WebView = true;
		}

		if (ie) {
			Browser.IE = true;
			Browser.Version = ie[1];
		}

		OS.Tablet = !! (ipad || playbook || (android && !useragent.match(/Mobile/)) || (firefox && useragent.match(/Tablet/)) || (ie && !useragent.match(/Phone/) && useragent.match(/Touch/)));
		OS.Phone = !! (!OS.Tablet && !OS.iPod && (android || iphone || webos || blackberry || bb10 || (chrome && useragent.match(/Android/)) || (chrome && useragent.match(/CriOS\/([\d.]+)/)) || (firefox && useragent.match(/Mobile/)) || (ie && useragent.match(/Touch/))));
		OS.Desktop = !! Browser.IE || Browser.Firefox || Browser.Safari || Browser.Chrome;

		OS.Platform = platform[0];
	}

	Detect.call(Yaex.UserAgent, navigator.userAgent);

	Yaex.Extend(Yaex.UserAgent, {
		Features: {
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
			Retina: retina,
			Pointer: Yaex.Global.isUndefined(pointer) ? false : pointer,
			MicrosoftPointer: Yaex.Global.isUndefined(msPointer) ? false : msPointer,


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
			ScrollTop: ('pageXOffset' in window || 'scrollTop' in document.documentElement) && !Yaex.UserAgent.OS.webOS,

			// Propietary features
			Standalone: 'standalone' in window.navigator && window.navigator.standalone
		}
	});

	// Return (boolean) of likely client device classifications.
	// Yaex.Extend(Yaex.UserAgent, {
	// 	Type: {
	// 		Mobile: (screen.width < 768),
	// 		Tablet: (screen.width >= 768 && Yaex.UserAgent.Features.Orientation),
	// 		Desktop: (screen.width >= 800 && !Yaex.UserAgent.Features.Orientation)
	// 	}
	// });
	
})(Yaex);

//---


/**
 * Deferred - Deferred implementation using Yaex's API [CORE]
 *
 *
 * @depends: Yaex.js | Core
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	var slice = Array.prototype.slice;

	function Deferred(callback) {
		var tuples = [
			// action, add listener, listener list, final state
			['resolve', 'done', Yaex.Callbacks({
				once: 1,
				memory: 1
			}), 'resolved'],
			['reject', 'fail', Yaex.Callbacks({
				once: 1,
				memory: 1
			}), 'rejected'],
			['notify', 'progress', Yaex.Callbacks({
				memory: 1
			})]
		];

		var state = 'pending';

		var promise = {
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
					Yaex.Each(tuples, function (i, tuple) {
						var fn = Yaex.Global.isFunction(fns[i]) && fns[i];
						deferred[tuple[1]](function () {
							var returned = fn && fn.apply(this, arguments);
							if (returned && Yaex.Global.isFunction(returned.promise)) {
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
				return obj !== null ? Yaex.Extend(obj, promise) : promise;
			}
		};

		var deferred = new Object;

		Yaex.Each(tuples, function (i, tuple) {
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

		if (callback) {
			callback.call(deferred, deferred);
		}

		return deferred;
	}

	//---

	Yaex.Global.When = function (sub) {
		var resolveValues = slice.call(arguments);
		var len = resolveValues.length;
		var i = 0;
		var remain = len !== 1 || (sub && Yaex.Global.isFunction(sub.promise)) ? len : 0;
		var deferred = remain === 1 ? sub : Deferred();
		var progressValues, progressContexts, resolveContexts;
		var updateFn = function (i, ctx, val) {
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
				if (resolveValues[i] && Yaex.Global.isFunction(resolveValues[i].promise)) {
					resolveValues[i].promise()
						.done(updateFn(i, resolveContexts, resolveValues))
						.fail(deferred.reject)
						.progress(updateFn(i, progressContexts, progressValues));
				} else {
					--remain;
				}
			}
		}

		if (!remain) {
			deferred.resolveWith(resolveContexts, resolveValues);
		}

		return deferred.promise();
	};

	Yaex.Global.Deferred = Deferred;

	//---

})(Yaex);

//---


/**
 * Callbacks - Callbacks implementation using Yaex's API [CORE]
 *
 *
 * @depends: Yaex.js | Core
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function (window, document, undefined) {

	'use strict';

	// Create a collection of callbacks to be fired in a sequence, with configurable behaviour
	// Option flags:
	//   - once: Callbacks fired at most one time.
	//   - memory: Remember the most recent context and arguments
	//   - stopOnFalse: Cease iterating over callback list
	//   - unique: Permit adding at most one instance of the same callback

	/**
	 * Yaex.Callbacks
	 */
	Yaex.Callbacks = function (options) {
		options = Yaex.Utility.simpleExtend({}, options);

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
						Yaex.Each(args, function (_, arg) {
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
					Yaex.Each(arguments, function (_, arg) {
						var index;
						while ((index = Yaex.Global.inArray(arg, list, index)) > -1) {
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
				return !!(list && (fn ? Yaex.Global.inArray(fn, list) > -1 : list.length));
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
	}; // END OF Yaex.Callbacks FUNCTION

	//---

})(window, document);

//---


/**
 * Events - Events implementation using Yaex's API
 *
 *
 * @depends: Yaex.js | Core
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	/**
	 * Yaex.Events is a base class that Yaex classes inherit from to 
	 * handle custom events.
	 */
	Yaex.Evented = Yaex.Class.Extend({
		on: function (types, callback, context) {
			// Types can be a map of types/handlers
			if (typeof types === 'object') {
				for (var type in types) {
					// We don't process space-separated events here for performance;
					// It's a hot path since Layer uses the on(obj) syntax
					this._on(type, types[type], callback);
				}

			} else {
				// types can be a string of space-separated words
				types = Yaex.Utility.splitWords(types);

				for (var i = 0, len = types.length; i < len; i++) {
					this._on(types[i], callback, context);
				}
			}

			return this;
		},

		off: function (types, callback, context) {
			if (!types) {
				// Clear all listeners if called without arguments
				delete this._events;
			} else if (typeof types === 'object') {
				for (var type in types) {
					this._off(type, types[type], callback);
				}
			} else {
				types = Yaex.Utility.splitWords(types);

				for (var i = 0, len = types.length; i < len; i++) {
					this._off(types[i], callback, context);
				}
			}

			return this;
		},

		// Attach listener (without syntactic sugar now)
		_on: function (type, callback, context) {
			var events = this._events = this._events || {},
			    contextId = context && context !== this && Yaex.Stamp(context);

			if (contextId) {
				// Store listeners with custom context in a separate hash (if it has an id);
				// gives a major performance boost when firing and removing events (e.g. on map object)

				var indexKey = type + '_idx',
				    indexLenKey = type + '_len',
				    typeIndex = events[indexKey] = events[indexKey] || {},
				    id = Yaex.Stamp(callback) + '_' + contextId;

				if (!typeIndex[id]) {
					typeIndex[id] = {callback: callback, ctx: context};

					// Keep track of the number of keys in the index to quickly check if it's empty
					events[indexLenKey] = (events[indexLenKey] || 0) + 1;
				}

			} else {
				// Individual layers mostly use "this" for context and don't fire listeners too often
				// so simple array makes the memory footprint better while not degrading performance
				events[type] = events[type] || [];
				events[type].push({callback: callback});
			}
		},

		_off: function (type, callback, context) {
			var events = this._events,
			    indexKey = type + '_idx',
			    indexLenKey = type + '_len';

			if (!events) { return; }

			if (!callback) {
				// Clear all listeners for a type if function isn't specified
				delete events[type];
				delete events[indexKey];
				delete events[indexLenKey];
				return;
			}

			var contextId = context && context !== this && Yaex.Stamp(context),
			    listeners, i, len, listener, id;

			if (contextId) {
				id = Yaex.Stamp(callback) + '_' + contextId;
				listeners = events[indexKey];

				if (listeners && listeners[id]) {
					listener = listeners[id];
					delete listeners[id];
					events[indexLenKey]--;
				}

			} else {
				listeners = events[type];

				for (i = 0, len = listeners.length; i < len; i++) {
					if (listeners[i].callback === callback) {
						listener = listeners[i];
						listeners.splice(i, 1);
						break;
					}
				}
			}

			// Set the removed listener to noop so that's not called if remove happens in fire
			if (listener) {
				listener.callback = Yaex.Noop;
			}
		},

		fire: function (type, data, propagate) {
			if (!this.listens(type, propagate)) {
				return this;
			}

			var event = Yaex.Utility.Extend({}, data, {type: type, target: this}),
			    events = this._events;

			if (events) {
			    var typeIndex = events[type + '_idx'],
			        i, len, listeners, id;

				if (events[type]) {
					// Make sure adding/removing listeners inside other listeners won't cause infinite loop
					listeners = events[type].slice();

					for (i = 0, len = listeners.length; i < len; i++) {
						listeners[i].callback.call(this, event);
					}
				}

				// Fire event for the context-indexed listeners as well
				for (id in typeIndex) {
					typeIndex[id].callback.call(typeIndex[id].ctx, event);
				}
			}

			if (propagate) {
				// Propagate the event to parents (set with addEventParent)
				this._propagateEvent(event);
			}

			return this;
		},

		listens: function (type, propagate) {
			var events = this._events;

			if (events && (events[type] || events[type + '_len'])) {
				return true;
			}

			if (propagate) {
				// Also check parents for listeners if event propagates
				for (var id in this._eventParents) {
					if (this._eventParents[id].listens(type)) { return true; }
				}
			}
			return false;
		},

		once: function (types, callback, context) {
			if (typeof types === 'object') {
				for (var type in types) {
					this.once(type, types[type], callback);
				}
				return this;
			}

			var handler = Yaex.Bind(function () {
				this
				    .off(types, callback, context)
				    .off(types, handler, context);
			}, this);

			// Add a listener that's executed once and removed after that
			return this
			    .on(types, callback, context)
			    .on(types, handler, context);
		},

		// Adds a parent to propagate events to (when you fire with true as a 3rd argument)
		addEventParent: function (obj) {
			this._eventParents = this._eventParents || {};
			this._eventParents[Yaex.Stamp(obj)] = obj;
			return this;
		},

		removeEventParent: function (obj) {
			if (this._eventParents) {
				delete this._eventParents[Yaex.Stamp(obj)];
			}
			return this;
		},

		_propagateEvent: function (e) {
			for (var id in this._eventParents) {
				this._eventParents[id].fire(e.type, Yaex.Extend({layer: e.target}, e));
			}
		}
	}); // END OF Yaex.Evented CLASS

	//---

	var _Prototype_ = Yaex.Evented.prototype;

	// Aliases; we should ditch those eventually
	_Prototype_.addEventListener = _Prototype_.on;
	_Prototype_.removeEventListener = _Prototype_.clearAllEventListeners = _Prototype_.off;
	_Prototype_.addOneTimeEventListener = _Prototype_.once;
	_Prototype_.fireEvent = _Prototype_.fire;
	_Prototype_.hasEventListeners = _Prototype_.listens;

	Yaex.Mixin.Events = _Prototype_;

})(Yaex);

//---



/**
 * ObjectOriented - Object oriented implementation using Yaex's API [CORE]
 *
 *
 * @depends: Yaex.js | Core
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

////// ECMAScript 5 style notation
if (Object.prototype.__defineGetter__ && !Object.defineProperty) {
	Object.defineProperty = function (obj, prop, desc) {
		if ("get" in desc) obj.__defineGetter__(prop, desc.get);
		if ("set" in desc) obj.__defineSetter__(prop, desc.set);
	}
}

//---

// Check dependence files
if (typeof (Yaex) !== 'object' || !! !window.Yaex) {
	throw 'Yaex.ObjectOriented: not found Yaex. Please ensure `yaex.js` is referenced before the `ObjectOriented.js` file.';
}

//---

+ ('Yaex', function (window, document, undefined) {

	'use strict';

	var global = this; // [Window object]
	var slice = [].slice;

	// Yaex Module : 
	Yaex.Global.isString = Yaex.Global.isString || function (string) {
		return Yaex.Global.Type(string);
	};

	Yaex.Global.isDefined = Yaex.Global.isDefined || function (object) {
		Yaex.Global.Type(object) !== 'undefined';
	};

	// Yaex.Global.akimana = Yaex.Global.akimana || {};
	// Yaex.Global.akimana.app = Yaex.Global.akimana.app || {};

	/**
	 * Set accessor like a ES5
	 * @param object{object} required,
	 * @param object{object} required, {prop:{set:<function>, get:<function>}, ... }
	 */
	function setAccessor(object, properties) {
		if (Yaex.Global.isObject(object) && Yaex.Global.isObject(properties)) {
			// Define setter and getter
			(function (_object, properties) {
				for (var name in properties) {
					Object.defineProperty(_object, name, properties[name]);
				}
			})(object, properties);
		}
	}

	/**
	 * createClass, Class builder for OOP
	 * implemented `new` operator checker : throw error message when not use `new`.
	 *
	 * @usage Yaex.ObjectOriented.create('className', classMembers);
	 * @param className{string} required, Named oo-class.
	 * @param classMembers{object} required,
	 */

	/**
	 * inherit class, overloaded createClass.
	 * @usage Yaex.ObjectOriented.create(className, baseClass, classMembers);
	 * @param className{string} required, Named oo-subclass.
	 * @param baseClass{function} required, superclass created with createClass method.
	 * @param classMembers{string} required, oo-subclass members.
	 */
	function createClass() {
		var len;
		var objectOrientedClassName;
		var baseClass;
		var members;
		var klass;

		len = arguments.length;

		objectOrientedClassName = arguments[0];

		baseClass = arguments[1];

		members = arguments[len - 1];

		// Check arguments type
		if (!Yaex.Global.isString(objectOrientedClassName) && Yaex.Global.Trim(objectOrientedClassName) !== '') {
			Yaex.Error('not defined Yaex.ObjectOriented ClassName in 1st argument, must be {string}.');
			// throw TypeError('not defined Yaex.ObjectOriented ClassName in 1st argument, must be {string}.');
		}

		if (!(len === 2 && Yaex.Global.isObject(members)) && !(len === 3 && Yaex.Global.isFunction(baseClass) && Yaex.Global.isObject(members))) {
			Yaex.Error('wrong arguments.');
			// throw TypeError('wrong arguments.');
		}

		if ( !! !members.initialize && !Yaex.Global.isFunction(members.initialize)) {
			Yaex.Error('not defined initialize method in member object.');
			// throw TypeError('not defined initialize method in member object.');
		}
		
		// Implement `new` operator error check.
		eval('klass=function ' + objectOrientedClassName + '(){try {this.initialize.apply(this, arguments)}catch(e){console.log(e.stack);throw "required `new` operator in `' + objectOrientedClassName + '`."}}');
		
		// Inherit
		if (len === 3) {
			klass.prototype = new baseClass;
			klass.prototype.constructor = klass;
		}

		Yaex.Utility.Extend(klass.prototype, members);

		return klass;
	}

	/**
	 * check `is-a` utility.
	 * @param a{ObjectOrientedClass} subClass
	 * @param b{ObjectOrientedClass} superClass
	 */
	function isA(a, b) {
		var tmp = (Yaex.Global.isFunction(a)) ? new a : a;

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

	Yaex.ObjectOriented = {
		accessor: setAccessor,
		create: createClass,
		isA: isA
	};

})(window, document);

//---









	//---

	/**
	 * Yaex.Handler is a base class for handler classes that are used internally 
	 * to inject interaction features.
	 */
	Yaex.Handler = Yaex.Class.Extend({

		//
		Initialise: function (map) {
			this._map = map;
		},

		Enable: function () {
			if (this._Enabled) {
				return;
			}

			this._Enabled = true;

			this.addHooks();
		},

		Disable: function () {
			if (!this._Enabled) {
				return;
			}

			this._Enabled = false;

			this.removeHooks();
		},

		Enabled: function () {
			return !!this._Enabled;
		}
	}); // END OF Yaex.Handler OBJECT

	//---





