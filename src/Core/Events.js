/**
 * DOM.Event - Cross browser events implementation using Yaex.DOM's API
 *
 *
 * @depends: Yaex.js | Core, DOM, Selector
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function (window, document, undefined) {

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

})(window, document);

//---

