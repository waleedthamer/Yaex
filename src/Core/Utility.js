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