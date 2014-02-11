////// ECMAScript 5 style notation
if (Object.prototype.__defineGetter__ && !Object.defineProperty) {
	Object.defineProperty = function (obj, prop, desc) {
		if ("get" in desc) obj.__defineGetter__(prop, desc.get);
		if ("set" in desc) obj.__defineSetter__(prop, desc.set);
	}
}

// Check dependence files
if (typeof ($) !== 'function' || !! !window.Yaex) {
	throw 'ObjectOriented: not found Yaex. Please ensure `Yaex.js` is referenced before the `ObjectOriented.js` file.';
}

/**
 * ObjectOriented - Object oriented implementation using Yaex's API
 *
 *
 * @depends: Yaex.js | Core
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function ($) {
	'use strict';

	var global = this; // [Window object]
	var slice = [].slice;

	// Yaex Module : 
	$.isString = $.isString || function (s) {
		return typeof s === 'string';
	};

	$.isDefined = $.isDefined || function (o) {
		return typeof o !== 'undefined';
	};

	$.akimana = $.akimana || {};
	$.akimana.app = $.akimana.app || {};

	/**
	 * set accessor like a ES5
	 * @param object{object} required,
	 * @param object{object} required, {prop:{set:<function>, get:<function>}, ... }
	 */
	function setAccessor(object, props) {
		if ($.isObject(object) && $.isObject(props)) {
			// define setter and getter
			(function (obj, props) {
				for (var name in props) {
					Object.defineProperty(obj, name, props[name]);
				}
			})(object, props);
		}
	}

	/**
	 * createClass, Class builder for OOP
	 * implemented `new` operator checker : throw error message when not use `new`.
	 *
	 * @usage $.OO.create('className', classMembers);
	 * @param className{string} required, Named oo-class.
	 * @param classMembers{object} required,
	 */

	/**
	 * inherit class, overloaded createClass.
	 * @usage $.OO.create(className, baseClass, classMembers);
	 * @param className{string} required, Named oo-subclass.
	 * @param baseClass{function} required, superclass created with createClass method.
	 * @param classMembers{string} required, oo-subclass members.
	 */
	function createClass() {
		var len, objectOrientedClassName, baseClass, members, klass;

		len = arguments.length;
		objectOrientedClassName = arguments[0];
		baseClass = arguments[1];
		members = arguments[len - 1];

		// Check arguments type
		if (!$.isString(objectOrientedClassName) && $.trim(objectOrientedClassName) !== '') {
			throw TypeError('not defined $.OO ClassName in 1st argument, must be {string}.');
		}
		if (!(len === 2 && $.isObject(members)) && !(len === 3 && $.isFunction(baseClass) && $.isObject(members))) {
			throw TypeError('wrong arguments.');
		}
		if ( !! !members.initialize && !$.isFunction(members.initialize)) {
			throw TypeError('not defined initialize method in member object.');
		}
		
		// Implement `new` operator error check.
		eval('klass=function ' + objectOrientedClassName + '(){try {this.initialize.apply(this, arguments)}catch(e){console.log(e.stack);throw "required `new` operator in `' + objectOrientedClassName + '`."}}');
		
		// Inherit
		if (len === 3) {
			klass.prototype = new baseClass;
			klass.prototype.constructor = klass;
		}

		$.Extend(klass.prototype, members);

		return klass;
	}

	/**
	 * check `is-a` utility.
	 * @param a{ObjectOrientedClass} subClass
	 * @param b{ObjectOrientedClass} superClass
	 */
	function isA(a, b) {
		var tmp = ($.isFunction(a)) ? new a : a;

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

	$.OO = {
		accessor: setAccessor,
		create: createClass,
		isA: isA
	};
})(Yaex)
