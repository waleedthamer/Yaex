/**
 * FX.Methods - Extra animation methods for Yaex
 *
 *
 * @depends: Yaex.js | Core, Selector, Data, Event, Extra, FX
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function ($, undefined) {
	'use strict';
	var origShow = $.fn.show;
	var origHide = $.fn.hide;
	var origToggle = $.fn.toggle;

	function anim(el, speed, opacity, scale, callback) {
		if (typeof speed == 'function' && !callback) {
			callback = speed;
			speed = undefined;
		}

		var props = {
			opacity: opacity
		};

		if (scale) {
			props.scale = scale;
			el.css($.fx.cssPrefix + 'transform-origin', '0 0');
		}
		return el.animate(props, speed, null, callback);
	}

	function hide(el, speed, scale, callback) {
		return anim(el, speed, 0, scale, function () {
			origHide.call($(this));
			callback && callback.call(this);
		});
	}

	$.fn.show = function (speed, callback) {
		origShow.call(this);
		if (speed === undefined) speed = 0;
		else this.css('opacity', 0);
		return anim(this, speed, 1, '1,1', callback);
	};

	$.fn.hide = function (speed, callback) {
		if (speed === undefined) return origHide.call(this);
		else return hide(this, speed, '0,0', callback);
	};

	$.fn.toggle = function (speed, callback) {
		if (speed === undefined || typeof speed == 'boolean')
			return origToggle.call(this, speed);
		else return this.each(function () {
			var el = $(this);
			el[el.css('display') == 'none' ? 'show' : 'hide'](speed, callback);
		});
	};

	$.fn.fadeTo = function (speed, opacity, callback) {
		return anim(this, speed, opacity, null, callback);
	};

	$.fn.fadeIn = function (speed, callback) {
		var target = this.css('opacity');
		if (target > 0) this.css('opacity', 0);
		else target = 1;
		return origShow.call(this).fadeTo(speed, target, callback);
	};

	$.fn.fadeOut = function (speed, callback) {
		return hide(this, speed, null, callback);
	};

	$.fn.fadeToggle = function (speed, callback) {
		return this.each(function () {
			var el = $(this);
			el[(el.css('opacity') === 0 || el.css('display') === 'none') ? 'fadeIn' : 'fadeOut'](speed, callback);
		});
	};

	$.fn.stop = function (type, clearQueue, gotoEnd) {
		var stopQueue = function (hooks) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop(gotoEnd);
		};

		if (typeof type !== 'string') {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		
		if (clearQueue && type !== false) {
			this.queue(type || 'fx', []);
		}

		return this.each(function () {
			var dequeue = true,
				index = type != null && type + 'queueHooks',
				timers = $.timers,
				data = $.data_priv.get(this);

			console.log(timers);

			if (index) {
				if (data[index] && data[index].stop) {
					stopQueue(data[index]);
				}
			} else {
				for (index in data) {
					if (data[index] && data[index].stop && rrun.test(index)) {
						stopQueue(data[index]);
					}
				}
			}

			for (index = timers.length; index--;) {
				if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
					timers[index].anim.stop(gotoEnd);
					dequeue = false;
					timers.splice(index, 1);
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if (dequeue || !gotoEnd) {
				$.dequeue(this, type);
			}
		});
	};
})(Yaex)
