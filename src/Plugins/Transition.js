+ ('Yaex', function () {

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
	Yaex.DOM.Function.emulateTransitionEnd = function (duration) {
		var called = false;
		var el = this;

		Yaex.DOM(this).one(Yaex.DOM.Support.transition.end, function () {
			called = true;
		});

		var callback = function () {
			if (!called) {
				Yaex.DOM(el).trigger(Yaex.DOM.Support.transition.end);
			}
		};

		setTimeout(callback, duration);

		return this;
	};

	Yaex.DOM(function () {
		Yaex.DOM.Support.transition = transitionEnd();
	});

	//---
	
})(Yaex.DOM);

//---

