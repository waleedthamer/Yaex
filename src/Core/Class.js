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