+(function ($) {
	var defaults = {
		customOffset: true,
		manual: true,
		onlyInContainer: true
	};

	Yaex.DOM.Function.AutoFix = function (options) {
		var settings = Yaex.Utility.simpleExtend({}, defaults, options),
			el = Yaex.DOM(this),
			curpos = el.position(),
			offset = settings.customOffset,
			pos = el.offset();

		el.addClass('YaexAutoFix');

		Yaex.DOM.Function.ManualFix = function () {
			var el = Yaex.DOM(this),
				pos = el.offset();

			if (el.hasClass('_Fixed')) {
				el.removeClass('_Fixed');
			} else {
				el.addClass('_Fixed').css({
					top: 0,
					left: pos.left,
					right: 'auto',
					bottom: 'auto'
				});
			}
		};

		fixAll = function (el, settings, curpos, pos) {
			if (settings.customOffset == false) offset = el.parent().offset().top;
			if (Yaex.DOM(document).scrollTop() > offset && Yaex.DOM(document).scrollTop() <= (el.parent().height() + (offset - Yaex.DOM(window).height()))) {
				el.removeClass('_Bottom').addClass('_Fixed').css({
					top: 0,
					left: pos.left,
					right: 'auto',
					bottom: 'auto'
				});
			} else {
				if (Yaex.DOM(document).scrollTop() > offset) {
					if (settings.onlyInContainer == true) {
						if (Yaex.DOM(document).scrollTop() > (el.parent().height() - Yaex.DOM(window).height())) {
							el.addClass('_Bottom _Fixed').removeAttr('style').css({
								left: curpos.left
							});
						} else {
							el.removeClass('_Bottom _Fixed').removeAttr('style');

						}
					}
				} else {
					el.removeClass('_Bottom _Fixed').removeAttr('style');
				}
			}
		};

		if (settings.manual == false) {
			Yaex.DOM(window).scroll(function () {
				fixAll(el, settings, curpos, pos);
			});
		}
	};
})($);
