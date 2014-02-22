/**
 * MouseWheel - Cross browser event implementation using Yaex's API for special events
 *
 *
 * @depends: Yaex.js | Core, Event, Extra
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function ($) {
	'use strict';

	var type = 'mousewheel';
	var initialized = false;
	var undefined;

	var toFix = ['wheel', type, 'DOMMouseScroll', 'MozMousePixelScroll'];
	var toBind = ('onwheel' in document || document.documentMode >= 9) ? ['wheel'] : [type, 'DomMouseScroll', 'MozMousePixelScroll'];
	var slice = Array.prototype.slice;
	var nullLowestDeltaTimeout;
	var lowestDelta;

	$.fn.mousewheel = function (callback) {
		return callback ? this.bind(type, callback) : this.trigger(type, callback);
	};

	$.fn.unmousewheel = function (callback) {
		return this.unbind(type, callback);
	};


	if ($.Yaex.Event.fixHooks) {
		for (var i = toFix.length; i;) {
			$.Yaex.Event.fixHooks[toFix[--i]] = $.Yaex.Event.mouseHooks;
		}
	}

	function getLineHeight(elem) {
		return parseInt($(elem)['offsetParent' in $.fn ? 'offsetParent' : 'parent']().css('fontSize'), 10);
	}

	function getPageHeight(elem) {
		return $(elem).height();
	}

	function setup() {
		if (!initialized) {
			initialized = true;

			var trigger = function () {
				$.Event.trigger(type);
			};

			if (this.addEventListener) {
				for (var i = toBind.length; i;) {
					this.addEventListener(toBind[--i], handler, false);
				}
			} else {
				this.onmousewheel = handler;
			}

			// Store the line height and page height for this particular element
			// $.data(this, type + '-line-height', getLineHeight(this));
			// $.data(this, type + '-page-height', getPageHeight(this));

		}
	}

	function teardown() {
		if (initialized) {
			if (this.removeEventListener) {
				for (var i = toBind.length; i;) {
					this.removeEventListener(toBind[--i], handler, false);
				}
			} else {
				this.onmousewheel = null;
			}

			initialized = false;
		}
	}

	function handler(event) {
		var orgEvent = event || window.event;
		var args = slice.call(arguments, 1);
		var delta = 0;
		var deltaX = 0;
		var deltaY = 0;
		var absDelta = 0;

		event.type = type;

		// Old school scrollwheel delta
		if ('detail' in orgEvent) {
			deltaY = orgEvent.detail * -1;
		}
		if ('wheelDelta' in orgEvent) {
			deltaY = orgEvent.wheelDelta;
		}
		if ('wheelDeltaY' in orgEvent) {
			deltaY = orgEvent.wheelDeltaY;
		}
		if ('wheelDeltaX' in orgEvent) {
			deltaX = orgEvent.wheelDeltaX * -1;
		}

		// Firefox < 17 horizontal scrolling related to DOMMouseScroll event
		if ('axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS) {
			deltaX = deltaY * -1;
			deltaY = 0;
		}

		// Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
		delta = deltaY === 0 ? deltaX : deltaY;

		// New school wheel delta (wheel event)
		if ('deltaY' in orgEvent) {
			deltaY = orgEvent.deltaY * -1;
			delta = deltaY;
		}
		if ('deltaX' in orgEvent) {
			deltaX = orgEvent.deltaX;
			if (deltaY === 0) {
				delta = deltaX * -1;
			}
		}

		// No change actually happened, no reason to go any further
		if (deltaY === 0 && deltaX === 0) {
			return;
		}

		// Need to convert lines and pages to pixels if we aren't already in pixels
		// There are three delta modes:
		//   * deltaMode 0 is by pixels, nothing to do
		//   * deltaMode 1 is by lines
		//   * deltaMode 2 is by pages
		if (orgEvent.deltaMode === 1) {
			var lineHeight = $.data(this, type + '-line-height');
			delta *= lineHeight;
			deltaY *= lineHeight;
			deltaX *= lineHeight;
		} else if (orgEvent.deltaMode === 2) {
			var pageHeight = $.data(this, type + '-page-height');
			delta *= pageHeight;
			deltaY *= pageHeight;
			deltaX *= pageHeight;
		}

		// Store lowest absolute delta to normalize the delta values
		absDelta = Math.max(Math.abs(deltaY), Math.abs(deltaX));

		if (!lowestDelta || absDelta < lowestDelta) {
			lowestDelta = absDelta;

			// Adjust older deltas if necessary
			if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
				lowestDelta /= 40;
			}
		}

		// Adjust older deltas if necessary
		if (shouldAdjustOldDeltas(orgEvent, absDelta)) {
			// Divide all the things by 40!
			delta /= 40;
			deltaX /= 40;
			deltaY /= 40;
		}

		// Get a whole, normalized value for the deltas
		delta = Math[delta >= 1 ? 'floor' : 'ceil'](delta / lowestDelta);
		deltaX = Math[deltaX >= 1 ? 'floor' : 'ceil'](deltaX / lowestDelta);
		deltaY = Math[deltaY >= 1 ? 'floor' : 'ceil'](deltaY / lowestDelta);

		// Add information to the event object
		event.deltaX = deltaX;
		event.deltaY = deltaY;
		event.deltaFactor = lowestDelta;
		// Go ahead and set deltaMode to 0 since we converted to pixels
		// Although this is a little odd since we overwrite the deltaX/Y
		// properties with normalized deltas.
		event.deltaMode = 0;

		// Add event and delta to the front of the arguments
		args.unshift(event, delta, deltaX, deltaY);

		// Clearout lowestDelta after sometime to better
		// handle multiple device types that give different
		// a different lowestDelta
		// Ex: trackpad = 3 and mouse wheel = 120
		if (nullLowestDeltaTimeout) {
			clearTimeout(nullLowestDeltaTimeout);
		}

		nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

		console.log(this);

		// return ($.Yaex.Event.dispatch || $.Event.handle).apply(this, args);
	}

	function nullLowestDelta() {
		lowestDelta = null;
	}

	// Expose special event
	$.Yaex.Event.special[type] = {
		setup: setup,
		teardown: teardown,
		settings: {
			adjustOldDeltas: true
		}
	};

	$.Yaex.Event.special[type].setup();

	function shouldAdjustOldDeltas(orgEvent, absDelta) {
		// If this is an older event and the delta is divisable by 120,
		// then we are assuming that the browser is treating this as an
		// older mouse wheel event and that we should divide the deltas
		// by 40 to try and get a more usable deltaFactor.
		// Side note, this actually impacts the reported scroll distance
		// in older browsers and can cause scrolling to be slower than native.
		// Turn this off by setting $.Yaex.Event.special.mousewheel.settings.adjustOldDeltas to false.
		return $.Yaex.Event.special[type].settings.adjustOldDeltas && orgEvent.type === type && absDelta % 120 === 0;
	}
})(Yaex)
