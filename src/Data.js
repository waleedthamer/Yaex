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
