+(function ($) {
	'use strict';

	// POPOVER PUBLIC CLASS DEFINITION
	var Popover = function (element, options) {
		this.init('popover', element, options);
	};

	if (!Yaex.DOM.Function.tooltip) throw new Error('Popover requires Tooltip.js');

	Popover.DEFAULTS = Yaex.Utility.simpleExtend({}, Yaex.DOM.Function.tooltip.constructor.DEFAULTS, {
		placement: 'right',
		trigger: 'click',
		content: '',
		template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
	});

	// NOTE: POPOVER EXTENDS Tooltip.js
	Popover.prototype = Yaex.Utility.simpleExtend({}, Yaex.DOM.Function.tooltip.constructor.prototype);

	Popover.prototype.constructor = Popover;

	Popover.prototype.getDefaults = function () {
		return Popover.DEFAULTS;
	};

	Popover.prototype.setContent = function () {
		var $tip = this.tip();
		var title = this.getTitle();
		var content = this.getContent();

		$tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title);
		$tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content);

		$tip.removeClass('fade top bottom left right in');

		// IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
		// this manually by checking the contents.
		if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide();
	};

	Popover.prototype.hasContent = function () {
		return this.getTitle() || this.getContent();
	};

	Popover.prototype.getContent = function () {
		var $e = this.$element;
		var o = this.options;

		return $e.attr('data-content') || (typeof o.content == 'function' ?
			o.content.call($e[0]) :
			o.content);
	};

	Popover.prototype.arrow = function () {
		return this.$arrow = this.$arrow || this.tip().find('.arrow');
	};

	Popover.prototype.tip = function () {
		if (!this.$tip) this.$tip = Yaex.DOM(this.options.template);
		return this.$tip;
	};

	Yaex.DOM.Function.popover = function (option) {
		return this.each(function () {
			var $this = Yaex.DOM(this);
			var data = $this.data('yaex.popover');
			var options = typeof option == 'object' && option;

			if (!data) $this.data('yaex.popover', (data = new Popover(this, options)));
			if (typeof option == 'string') data[option]();
		});
	};

	Yaex.DOM.Function.popover.constructor = Popover;
})($);
