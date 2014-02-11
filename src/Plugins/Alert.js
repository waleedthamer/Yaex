+(function ($) {
	'use strict';

	// ALERT CLASS DEFINITION
	var dismiss = '[data-dismiss="alert"]';
	var Alert = function (el) {
		$(el).on('click', dismiss, this.close);
	};

	Alert.prototype.close = function (e) {
		var $this = $(this);
		var selector = $this.attr('data-target');

		if (!selector) {
			selector = $this.attr('href');
			selector = selector && selector.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
		}

		var $parent = $(selector);

		if (e) e.preventDefault();

		if (!$parent.length) {
			$parent = $this.hasClass('alert') ? $this : $this.parent();
		}

		$parent.trigger(e = $.Event('close.yaex.alert'));

		if (e.isDefaultPrevented()) return;

		$parent.removeClass('in');

		function removeElement() {
			$parent.trigger('closed.yaex.alert').remove();
		}

		$.Support.transition && $parent.hasClass('fade') ?
			$parent
			.one($.Support.transition.end, removeElement)
			.emulateTransitionEnd(150) :
			removeElement();
	};

	// ALERT PLUGIN DEFINITION
	// var old = $.fn.alert;

	$.fn.alert = function (option) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('yaex.alert');

			if (!data) $this.data('yaex.alert', (data = new Alert(this)));
			if (typeof option == 'string') data[option].call($this);
		});
	};

	$.fn.alert.Constructor = Alert;

	// ALERT NO CONFLICT
	// $.fn.alert.noConflict = function () {
	// 	$.fn.alert = old;
	// 	return this;
	// };

	// ALERT DATA-API
	$(document).on('click.yaex.alert.data-api', dismiss, Alert.prototype.close);
})(Yaex)
