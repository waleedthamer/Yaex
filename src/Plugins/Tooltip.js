+(function ($) {
	'use strict';

	// TOOLTIP PUBLIC CLASS DEFINITION
	var Tooltip = function (element, options) {
		this.type =
			this.options =
			this.enabled =
			this.timeout =
			this.hoverState =
			this.$element = null;

		this.init('tooltip', element, options);
	};

	Tooltip.DEFAULTS = {
		animation: true,
		placement: 'top',
		selector: false,
		template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
		trigger: 'hover focus',
		title: '',
		delay: 0,
		html: false,
		container: false
	};

	Tooltip.prototype.init = function (type, element, options) {
		this.enabled = true;
		this.type = type;
		this.$element = $(element);
		this.options = this.getOptions(options);

		var triggers = this.options.trigger.split(' ');

		for (var i = triggers.length; i--;) {
			var trigger = triggers[i];

			if (trigger == 'click') {
				this.$element.bind('click.' + this.type, this.options.selector, $.proxy(this.toggle, this));
			} else if (trigger !== 'manual') {
				var eventIn;
				var eventOut;

				if (trigger == 'hover') {
					eventIn = 'mouseenter';
					eventOut = 'mouseleave';
				} else {
					eventIn = 'focus';
					eventOut = 'blur';
				}

				this.$element.on(eventIn + '.' + this.type, this.options.selector, null, $.proxy(this.enter, this));
				this.$element.on(eventOut + '.' + this.type, this.options.selector, null, $.proxy(this.leave, this));
			}
		}

		this.options.selector ?
			(this._options = Yaex.Utility.simpleExtend({}, this.options, {
				trigger: 'manual',
				selector: ''
			})) :
			this.fixTitle();
	};

	Tooltip.prototype.getDefaults = function () {
		return Tooltip.DEFAULTS;
	};

	Tooltip.prototype.getOptions = function (options) {
		options = Yaex.Utility.simpleExtend({}, this.getDefaults(), this.$element.data(), options);

		if (options.delay && typeof options.delay == 'number') {
			options.delay = {
				show: options.delay,
				hide: options.delay
			};
		}

		return options;
	};

	Tooltip.prototype.getDelegateOptions = function () {
		var options = {};
		var defaults = this.getDefaults();

		this._options && $.Each(this._options, function (key, value) {
			if (defaults[key] != value) options[key] = value;
		});

		return options;
	};

	Tooltip.prototype.enter = function (obj) {
		var self = obj instanceof this.constructor ?
			obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('yaex.' + this.type);
			
		clearTimeout(self.timeout);

		self.hoverState = 'in';

		if (!self.options.delay || !self.options.delay.show) return self.show();

		self.timeout = setTimeout(function () {
			if (self.hoverState == 'in') self.show();
		}, self.options.delay.show);
	}

	Tooltip.prototype.leave = function (obj) {
		var self = obj instanceof this.constructor ?
			obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('yaex.' + this.type);

		clearTimeout(self.timeout);

		self.hoverState = 'out';

		if (!self.options.delay || !self.options.delay.hide) return self.hide();

		self.timeout = setTimeout(function () {
			if (self.hoverState == 'out') self.hide();
		}, self.options.delay.hide);
	};

	Tooltip.prototype.show = function () {
		var e = $.Event('show.yaex.' + this.type);

		if (this.hasContent() && this.enabled) {
			this.$element.trigger(e);

			if (e.isDefaultPrevented()) return;

			var $tip = this.tip();

			this.setContent();

			if (this.options.animation) $tip.addClass('fade');

			var placement = typeof this.options.placement == 'function' ?
				this.options.placement.call(this, $tip[0], this.$element[0]) :
				this.options.placement;

			var autoToken = /\s?auto?\s?/i;
			var autoPlace = autoToken.test(placement);
			if (autoPlace) placement = placement.replace(autoToken, '') || 'top';


			$tip
				.detach()
				.css({
					top: 0,
					left: 0,
					display: 'block'
				})
				.addClass(placement);

			this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);
			// this.options.container ? $tip.appendTo(this.options.container) : $tip.insertBefore(this.$element);

			var pos = this.getPosition();
			var actualWidth = $tip[0].offsetWidth;
			var actualHeight = $tip[0].offsetHeight;

			if (autoPlace) {
				var $parent = this.$element.parent();

				var orgPlacement = placement;
				var docScroll = document.documentElement.scrollTop || document.body.scrollTop;
				var parentWidth = this.options.container == 'body' ? window.innerWidth : $parent.outerWidth();
				var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight();
				var parentLeft = this.options.container == 'body' ? 0 : $parent.offset().left;

				placement = placement == 'bottom' && pos.top + pos.height + actualHeight - docScroll > parentHeight ? 'top' :
					placement == 'top' && pos.top - docScroll - actualHeight < 0 ? 'bottom' :
					placement == 'right' && pos.right + actualWidth > parentWidth ? 'left' :
					placement == 'left' && pos.left - actualWidth < parentLeft ? 'right' :
					placement;

				$tip.removeClass(orgPlacement).addClass(placement);
			}

			var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

			this.applyPlacement(calculatedOffset, placement);
			this.$element.trigger('shown.yaex.' + this.type);
		}
	}

	Tooltip.prototype.applyPlacement = function (offset, placement) {
		var replace;
		var $tip = this.tip();
		var width = $tip[0].offsetWidth;
		var height = $tip[0].offsetHeight;

		// manually read margins because getBoundingClientRect includes difference
		var marginTop = parseInt($tip.css('margin-top'), 10);
		var marginLeft = parseInt($tip.css('margin-left'), 10);

		// we must check for NaN for ie 8/9
		if (isNaN(marginTop)) marginTop = 0;
		if (isNaN(marginLeft)) marginLeft = 0;

		offset.top = offset.top + marginTop;
		offset.left = offset.left + marginLeft;

		$tip.offset(offset).addClass('in');

		// check to see if placing tip in new offset caused the tip to resize itself
		var actualWidth = $tip[0].offsetWidth;
		var actualHeight = $tip[0].offsetHeight;

		if (placement == 'top' && actualHeight != height) {
			replace = true;
			offset.top = offset.top + height - actualHeight;
		}

		if (/bottom|top/.test(placement)) {
			var delta = 0;

			if (offset.left < 0) {
				delta = offset.left * -2;
				offset.left = 0;

				$tip.offset(offset);

				actualWidth = $tip[0].offsetWidth;
				actualHeight = $tip[0].offsetHeight;
			}

			this.replaceArrow(delta - width + actualWidth, actualWidth, 'left');
		} else {
			this.replaceArrow(actualHeight - height, actualHeight, 'top');
		}

		if (replace) {
			$tip.offset(offset);
		}
	};

	Tooltip.prototype.replaceArrow = function (delta, dimension, position) {
		this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '');
	};

	Tooltip.prototype.setContent = function () {
		var $tip = this.tip();
		var title = this.getTitle();

		$tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
		$tip.removeClass('fade in top bottom left right');
	};

	Tooltip.prototype.hide = function () {
		var that = this;
		var $tip = this.tip();
		var e = $.Event('hide.yaex.' + this.type);

			function complete() {
				if (that.hoverState != 'in') {
					$tip.detach();
				}
			}

		this.$element.trigger(e);

		if (e.isDefaultPrevented()) return;

		$tip.removeClass('in');

		$.Support.transition && this.$tip.hasClass('fade') ?
			$tip.one($.Support.transition.end, complete)
				.emulateTransitionEnd(350) :
				complete();

		this.$element.trigger('hidden.yaex.' + this.type);

		return this;
	};

	Tooltip.prototype.fixTitle = function () {
		var $e = this.$element;

		if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
			$e.attr('data-original-title', $e.attr('title') || '').attr('title', '');
		}
	};

	Tooltip.prototype.hasContent = function () {
		return this.getTitle();
	};

	Tooltip.prototype.getPosition = function () {
		var el = this.$element[0];
		return Yaex.Utility.simpleExtend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
			width: el.offsetWidth,
			height: el.offsetHeight
		}, this.$element.offset());
	};

	Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
		return placement == 'bottom' ? {
			top: pos.top + pos.height,
			left: pos.left + pos.width / 2 - actualWidth / 2
		} :
			placement == 'top' ? {
				top: pos.top - actualHeight,
				left: pos.left + pos.width / 2 - actualWidth / 2
		} :
			placement == 'left' ? {
				top: pos.top + pos.height / 2 - actualHeight / 2,
				left: pos.left - actualWidth
		} :
		/* placement == 'right' */
		{
			top: pos.top + pos.height / 2 - actualHeight / 2,
			left: pos.left + pos.width
		};
	};

	Tooltip.prototype.getTitle = function () {
		var title;
		var $e = this.$element;
		var o = this.options;

		title = $e.attr('data-original-title') || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title);

		return title;
	};

	Tooltip.prototype.tip = function () {
		return this.$tip = this.$tip || $(this.options.template);
	};

	Tooltip.prototype.arrow = function () {
		return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow');
	};

	Tooltip.prototype.validate = function () {
		if (!this.$element[0].parentNode) {
			this.hide();
			this.$element = null;
			this.options = null;
		}
	};

	Tooltip.prototype.enable = function () {
		this.enabled = true;
	};

	Tooltip.prototype.disable = function () {
		this.enabled = false;
	};

	Tooltip.prototype.toggleEnabled = function () {
		this.enabled = !this.enabled;
	};

	Tooltip.prototype.toggle = function (e) {
		var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('yaex.' + this.type) : this
		self.tip().hasClass('in') ? self.leave(self) : self.enter(self);
	};

	Tooltip.prototype.destroy = function () {
		this.hide().$element.off('.' + this.type).removeData('yaex.' + this.type);
	};

	$.fn.tooltip = function (option) {
		return this.each(function () {
			var $this = $(this);
			var data = $this.data('yaex.tooltip');
			var options = typeof option == 'object' && option;

			if (!data) $this.data('yaex.tooltip', (data = new Tooltip(this, options)));
			if (typeof option == 'string') data[option]();
		});
	};

	$.fn.tooltip.constructor = Tooltip;
})($);
