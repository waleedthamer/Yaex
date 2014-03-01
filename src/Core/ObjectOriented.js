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
	 * @usage $.ObjectOriented.create('className', classMembers);
	 * @param className{string} required, Named oo-class.
	 * @param classMembers{object} required,
	 */

	/**
	 * inherit class, overloaded createClass.
	 * @usage $.ObjectOriented.create(className, baseClass, classMembers);
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

