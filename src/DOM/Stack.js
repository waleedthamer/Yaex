/**
 * DOM.Stack - Stack implementation using Yaex.DOM's API
 *
 *
 * @depends: Yaex.js | Core, DOM, DOM.Selector DOM.Events
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {
	
	'use strict';

	Yaex.DOM.Function.end = function () {
		return this.prevObject || Yaex.DOM(null);
	};

	Yaex.DOM.Function.andSelf = function () {
		return this.add(this.prevObject || Yaex.DOM(null));
	};

	('filter add not eq first last find closest ' +
		'parents parent children siblings').split(' ').forEach(function (property) {
		var callback = Yaex.DOM.Function[property];
		
		Yaex.DOM.Function[property] = function () {
			var ret = callback.apply(this, arguments);
			ret.prevObject = this;
			return ret;
		};
	});

})(Yaex.DOM);

//---