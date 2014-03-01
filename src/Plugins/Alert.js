+(function ($) {
	'use strict';

	// ALERT CLASS DEFINITION
	var dismiss = '[data-dismiss="alert"]';
	var Alert = function (el) {
		Yaex.DOM(el).on('click', dismiss, this.close);
	};

	Alert.prototype.close = function (e) {
		var $this = Yaex.DOM(this);
		var selector = $this.attr('data-target');

		if (!selector) {
			selector = $this.attr('href');
			// strip for ie7
			selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');
		}

		var $parent = Yaex.DOM(selector);

		if (e) e.preventDefault();

		if (!$parent.length) {
			$parent = $this.hasClass('alert') ? $this : $this.parent();
		}

		$parent.trigger(e = Yaex.DOM.Event('close.yaex.alert'));

		if (e.isDefaultPrevented()) return;

		$parent.removeClass('in');

		function removeElement() {
			$parent.trigger('closed.yaex.alert').remove();
		}

		Yaex.DOM.Support.transition && $parent.hasClass('fade') ?
			$parent
			.one(Yaex.DOM.Support.transition.end, removeElement)
			.emulateTransitionEnd(150) :
			removeElement();
	};

	// ALERT PLUGIN DEFINITION
	// var old = Yaex.DOM.Function.alert;

	Yaex.DOM.Function.alert = function (option) {
		return this.each(function () {
			var $this = Yaex.DOM(this);
			var data = $this.data('yaex.alert');

			if (!data) $this.data('yaex.alert', (data = new Alert(this)));
			if (typeof option == 'string') data[option].call($this);
		});
	};

	Yaex.DOM.Function.alert.Constructor = Alert;

	// ALERT NO CONFLICT
	// Yaex.DOM.Function.alert.noConflict = function () {
	// 	Yaex.DOM.Function.alert = old;
	// 	return this;
	// };

	// ALERT DATA-API
	Yaex.DOM(document).on('click.yaex.alert.data-api', dismiss, Alert.prototype.close);
})($);
