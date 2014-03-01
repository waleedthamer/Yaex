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
