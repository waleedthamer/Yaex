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
