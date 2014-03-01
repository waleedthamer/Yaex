+(function ($) {
	var defaults = {
		customOffset: true,
		manual: true,
		onlyInContainer: true
	};

	$.fn.AutoFix = function (options) {
		var settings = Yaex.Utility.simpleExtend({}, defaults, options),
			el = $(this),
			curpos = el.position(),
			offset = settings.customOffset,
			pos = el.offset();

		el.addClass('YaexAutoFix');

		$.fn.ManualFix = function () {
			var el = $(this),
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
			if ($(document).scrollTop() > offset && $(document).scrollTop() <= (el.parent().height() + (offset - $(window).height()))) {
				el.removeClass('_Bottom').addClass('_Fixed').css({
					top: 0,
					left: pos.left,
					right: 'auto',
					bottom: 'auto'
				});
			} else {
				if ($(document).scrollTop() > offset) {
					if (settings.onlyInContainer == true) {
						if ($(document).scrollTop() > (el.parent().height() - $(window).height())) {
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
			$(window).scroll(function () {
				fixAll(el, settings, curpos, pos);
			});
		}
	};
})($);
