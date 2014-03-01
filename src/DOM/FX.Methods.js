/**
 * FX.Methods - Cross browser animations implementation using Yaex.DOM's API [DOM]
 *
 *
 * @depends: Yaex.js | Core, DOM, Selector, FX
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	var origShow = Yaex.DOM.Function.show;
	var origHide = Yaex.DOM.Function.hide;
	var origToggle = Yaex.DOM.Function.toggle;

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
			el.css(Yaex.DOM.fx.cssPrefix + 'transform-origin', '0 0');
		}
		return el.animate(props, speed, null, callback);
	}

	function hide(el, speed, scale, callback) {
		return anim(el, speed, 0, scale, function () {
			origHide.call(Yaex.DOM(this));
			callback && callback.call(this);
		});
	}

	Yaex.DOM.Function.show = function (speed, callback) {
		origShow.call(this);
		if (speed === undefined) speed = 0;
		else this.css('opacity', 0);
		return anim(this, speed, 1, '1,1', callback);
	};

	Yaex.DOM.Function.hide = function (speed, callback) {
		if (speed === undefined) return origHide.call(this);
		else return hide(this, speed, '0,0', callback);
	};

	Yaex.DOM.Function.toggle = function (speed, callback) {
		if (speed === undefined || typeof speed == 'boolean')
			return origToggle.call(this, speed);
		else return this.each(function () {
			var el = Yaex.DOM(this);
			el[el.css('display') == 'none' ? 'show' : 'hide'](speed, callback);
		});
	};

	Yaex.DOM.Function.fadeTo = function (speed, opacity, callback) {
		return anim(this, speed, opacity, null, callback);
	};

	Yaex.DOM.Function.fadeIn = function (speed, callback) {
		var target = this.css('opacity');
		if (target > 0) this.css('opacity', 0);
		else target = 1;
		return origShow.call(this).fadeTo(speed, target, callback);
	};

	Yaex.DOM.Function.fadeOut = function (speed, callback) {
		return hide(this, speed, null, callback);
	};

	Yaex.DOM.Function.fadeToggle = function (speed, callback) {
		return this.each(function () {
			var el = Yaex.DOM(this);
			el[(el.css('opacity') === 0 || el.css('display') === 'none') ? 'fadeIn' : 'fadeOut'](speed, callback);
		});
	};

	Yaex.DOM.Function.stop = function (type, clearQueue, gotoEnd) {
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
				timers = Yaex.DOM.Timers,
				data = Yaex.DOM.dataPrivative.get(this);

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
				Yaex.DOM.dequeue(this, type);
			}
		});
	};

})(Yaex.DOM);

//---

