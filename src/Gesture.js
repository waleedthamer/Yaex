+(function ($) {
	'use strict';

	function parentIfText(node) {
		return 'tagName' in node ? node : node.parentNode;
	}

	// if ($.UserAgent.iOS) {
	if ($.UserAgent.iOS) {
		var gesture = {};
		var gestureTimeout;

		$(document).bind('gesturestart', function (e) {
			var now = Date.now();
			var delta = now - (gesture.last || now);
			gesture.target = parentIfText(e.target);
			gestureTimeout && clearTimeout(gestureTimeout);
			gesture.e1 = e.scale;
			gesture.last = now;
		}).bind('gesturechange', function (e) {
			gesture.e2 = e.scale;
		}).bind('gestureend', function (e) {
			if (gesture.e2 > 0) {
				Math.abs(gesture.e1 - gesture.e2) !== 0 && $(gesture.target).trigger('pinch') && $(gesture.target).trigger('pinch' + (gesture.e1 - gesture.e2 > 0 ? 'In' : 'Out'));
				gesture.e1 = gesture.e2 = gesture.last = 0;
			} else if ('last' in gesture) {
				gesture = {};
			}
		});

		// ['pinch', 'pinchIn', 'pinchOut'].forEach(function (m) {
		// 	$.fn[m] = function (callback) {
		// 		return this.bind(m, callback);
		// 	};
		// });

		$.each(('pinch pinchIn pinchOut').split(' '), function (i, name) {
			$.fn[name] = function (data, callback) {
				return arguments.length > 0 ?
					this.on(name, null, data, callback) :
					this.trigger(name);
			};
		});
	}
})(Yaex)