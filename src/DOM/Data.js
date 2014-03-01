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

