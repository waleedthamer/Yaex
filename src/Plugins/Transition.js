+(function ($) {
	'use strict';
	// CSS TRANSITION SUPPORT (http://www.modernizr.com/)
	function transitionEnd() {
		var el = document.createElement('yaex');

		var transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd otransitionend',
			'transition': 'transitionend'
		};

		for (var name in transEndEventNames) {
			if (el.style[name] !== undefined) {
				return {
					end: transEndEventNames[name]
				};
			}
		}
	}

	// http://blog.alexmaccaw.com/css-transitions
	$.fn.emulateTransitionEnd = function (duration) {
		var called = false;
		var $el = this;

		$(this).one($.Support.transition.end, function () {
			called = true
		});

		var callback = function () {
			if (!called) $($el).trigger($.Support.transition.end)
		};

		setTimeout(callback, duration);

		return this;
	};

	$(function () {
		$.Support.transition = transitionEnd();
	})
})(Yaex)
