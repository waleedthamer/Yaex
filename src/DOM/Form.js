/**
 * DOM.Form - Cross browser form implementation using Yaex.DOM's API
 *
 *
 * @depends: Yaex.js | Core, DOM, DOM.Selector DOM.Events
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {
	
	'use strict';

	Yaex.DOM.Function.serialiseArray = function () {
		var result = [];
		var el;

		Yaex.DOM([].slice.call(this.get(0).elements)).each(function () {
			el = Yaex.DOM(this);

			var type = el.attr('type');

			if (this.nodeName.toLowerCase() != 'fieldset' && 
				!this.disabled && type != 'submit' && type != 'reset' && 
				type != 'button' && ((type != 'radio' && type != 'checkbox') || this.checked)) {
				result.push({
					name: el.attr('name'),
					value: el.val()
				});
			}
		});

		return result;
	};

	Yaex.DOM.Function.serialise = function () {
		var result = [];

		this.serialiseArray().forEach(function (elm) {
			result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value));
		});

		return result.join('&');
	};

	Yaex.DOM.Function.submit = function (callback) {
		if (callback) {
			this.bind('submit', callback);
		} else if (this.length) {
			var event = Yaex.DOM.Event('submit');

			this.eq(0).trigger(event);

			if (!event.defaultPrevented) {
				this.get(0).submit();
			}
		}

		return this;
	};
	
})(Yaex.DOM);

//---