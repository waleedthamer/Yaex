/**
 * DOM.Gesture - Cross browser gesture event implementation using Yaex.DOM's API
 *
 *
 * @depends: Yaex.js | Core, DOM, Selector, Event
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	function parentIfText(node) {
		return 'tagName' in node ? node : node.parentNode;
	}

	if (Yaex.UserAgent.OS.iOS) {
		var gesture = new Object;
		var gestureTimeout;

		Yaex.DOM(document).bind('gesturestart', function (e) {
			var now = Yaex.Now;
			var delta = now - (gesture.last || now);
			gesture.target = parentIfText(e.target);
			gestureTimeout && clearTimeout(gestureTimeout);
			gesture.e1 = e.scale;
			gesture.last = now;
		}).bind('gesturechange', function (e) {
			gesture.e2 = e.scale;
		}).bind('gestureend', function (e) {
			if (gesture.e2 > 0) {
				Math.abs(gesture.e1 - gesture.e2) !== 0 && 
					Yaex.DOM(gesture.target).trigger('pinch') && 
					Yaex.DOM(gesture.target).trigger('pinch' + (gesture.e1 - gesture.e2 > 0 ? 'In' : 'Out'));
				gesture.e1 = gesture.e2 = gesture.last = 0;
			} else if ('last' in gesture) {
				gesture = {};
			}
		});
		
		('pinch pinchIn pinchOut').split(' ').forEach(function (event) {
			Yaex.DOM.Function[event] = function (callback) {
				return this.bind(event, callback);
			};
		});
	}

	//---

})(Yaex.DOM);

//---
