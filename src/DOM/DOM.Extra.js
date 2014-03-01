/**
 * DOM.Extra - Cross browser DOM utilities using Yaex's API [DOM]
 *
 *
 * @depends: Yaex.js | Core, DOM, Selector, Event
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	// Map object to object
	Yaex.DOM.mapObjectToObject = function (obj, callback) {
		var result = {};

		Yaex.Each(obj, function (key, value) {
			result[key] = callback.call(obj, key, value);
		});

		return result;
	};

	//---

	// Storage Module
	// Private data
	var isLocalStorage = typeof window.localStorage !== 'undefined';

	// Private functions
	function WriteToLocalStorage(name, value) {
		var key;

		if (Yaex.Global.isString(name) && Yaex.Global.isString(value)) {
			localStorage[name] = value;
			return true;
		// } else if (Yaex.Global.isObject(name) && typeof value === 'undefined') {
		} else if (Yaex.Global.isObject(name) && Yaex.Global.isUndefined(value)) {
			for (key in name) {
				if (name.hasOwnProperty(key)) {
					localStorage[key] = name[key];
				}
			}

			return true;
		}

		return false;
	}

	function ReadFromLocalStorage(name) {
		return localStorage[name];
	}

	function DeleteFromLocalStorage(name) {
		return delete localStorage[name];
	}

	function WriteCookie(name, value) {
		var date;
		var expire;
		var key;

		date = new Date();
		date.setTime(date.getTime() + 31536000000);

		expire = '; expires=' + date.toGMTString();

		if (Yaex.Global.isString(name) && Yaex.Global.isString(value)) {
			document.cookie = name + '=' + value + expire + '; path=/';
			return true;
		// } else if (typeof n === 'object' && typeof v === 'undefined') {
		} else if (Yaex.Global.isObject(name) && Yaex.Global.isUndefined(value)) {
			for (key in name) {
				if (name.hasOwnProperty(key)) {
					document.cookie = key + '=' + name[key] + expire + '; path=/';
				}
			}

			return true;
		}

		return false;
	}

	function ReadCookie(name) {
		var newName;
		var cookieArray;
		var x;
		var cookie;

		newName = name + '=';
		cookieArray = document.cookie.split(';');

		for (x = 0; x < cookieArray.length; x++) {
			cookie = cookieArray[x];

			while (cookie.charAt(0) === ' ') {
				cookie = cookie.substring(1, cookie.length);
			}

			if (cookie.indexOf(newName) === 0) {
				return cookie.substring(newName.length, cookie.length);
			}
		}

		return null;
	}

	function DeleteCookie(name) {
		return WriteCookie(name, '', -1);
	}

	/**
	 * Public API
	 * $.Storage.Set('name', 'value')
	 * $.Storage.Set({'name1':'value1', 'name2':'value2', etc})
	 * $.Storage.Get('name')
	 * $.Storage.Remove('name')
	 */
	Yaex.Extend(Yaex.DOM, {
		Storage: {
			Set: isLocalStorage ? WriteToLocalStorage : WriteCookie,
			Get: isLocalStorage ? ReadFromLocalStorage : ReadCookie,
			Remove: isLocalStorage ? DeleteFromLocalStorage : DeleteCookie
		}
	});

	//---

	// Yaex Timers
	Yaex.DOM.Function.extend({
		everyTime: function (interval, label, fn, times, belay) {
			//console.log(this);
			return this.each(function () {
				Yaex.DOM.timer.add(this, interval, label, fn, times, belay);
			});
		},
		oneTime: function (interval, label, fn) {
			return this.each(function () {
				Yaex.DOM.timer.add(this, interval, label, fn, 1);
			});
		},
		stopTime: function (label, fn) {
			return this.each(function () {
				Yaex.DOM.timer.remove(this, label, fn);
			});
		}
	});

	Yaex.Extend(Yaex.DOM, {
		timer: {
			GUID: 1,
			global: {},
			regex: /^([0-9]+)\s*(.*s)?$/,
			powers: {
				// Yeah this is major overkill...
				'ms': 1,
				'cs': 10,
				'ds': 100,
				's': 1000,
				'das': 10000,
				'hs': 100000,
				'ks': 1000000
			},
			timeParse: function (value) {
				if (value === undefined || value === null) {
					return null;
				}
				var result = this.regex.exec(Yaex.Global.Trim(value.toString()));
				if (result[2]) {
					var num = parseInt(result[1], 10);
					var mult = this.powers[result[2]] || 1;
					return num * mult;
				} else {
					return value;
				}
			},
			add: function (element, interval, label, fn, times, belay) {
				var counter = 0;

				if (Yaex.Global.isFunction(label)) {
					if (!times) {
						times = fn;
					}
					fn = label;
					label = interval;
				}

				interval = Yaex.DOM.timer.timeParse(interval);

				if (typeof interval !== 'number' ||
					isNaN(interval) ||
					interval <= 0) {
					return;
				}
				if (times && times.constructor !== Number) {
					belay = !! times;
					times = 0;
				}

				times = times || 0;
				belay = belay || false;

				if (!element.$timers) {
					element.$timers = {};
				}
				if (!element.$timers[label]) {
					element.$timers[label] = {};
				}
				fn.$timerID = fn.$timerID || this.GUID++;

				var handler = function () {
					if (belay && handler.inProgress) {
						return;
					}
					handler.inProgress = true;
					if ((++counter > times && times !== 0) ||
						fn.call(element, counter) === false) {
						Yaex.DOM.timer.remove(element, label, fn);
					}
					handler.inProgress = false;
				};

				handler.$timerID = fn.$timerID;

				if (!element.$timers[label][fn.$timerID]) {
					element.$timers[label][fn.$timerID] = window.setInterval(handler, interval);
				}

				if (!this.global[label]) {
					this.global[label] = [];
				}
				this.global[label].push(element);

			},
			remove: function (element, label, fn) {
				var timers = element.$timers,
					ret;

				if (timers) {

					if (!label) {
						for (var lab in timers) {
							if (timers.hasOwnProperty(lab)) {
								this.remove(element, lab, fn);
							}
						}
					} else if (timers[label]) {
						if (fn) {
							if (fn.$timerID) {
								window.clearInterval(timers[label][fn.$timerID]);
								delete timers[label][fn.$timerID];
							}
						} else {
							for (var _fn in timers[label]) {
								if (timers[label].hasOwnProperty(_fn)) {
									window.clearInterval(timers[label][_fn]);
									delete timers[label][_fn];
								}
							}
						}

						for (ret in timers[label]) {
							if (timers[label].hasOwnProperty(ret)) {
								break;
							}
						}
						if (!ret) {
							ret = null;
							delete timers[label];
						}
					}

					for (ret in timers) {
						if (timers.hasOwnProperty(ret)) {
							break;
						}
					}
					if (!ret) {
						element.$timers = null;
					}
				}
			}
		}
	});

	//---

	Yaex.Extend(Yaex.DOM, {
		queue: function (elem, type, data) {
			var queue;

			if (elem) {
				type = (type || 'fx') + 'queue';
				queue = Yaex.DOM.dataPrivative.get(elem, type);

				// Speed up dequeue by getting out quickly if this is just a lookup
				if (data) {
					if (!queue || Yaex.Global.isArray(data)) {
						queue = Yaex.DOM.dataPrivative.access(elem, type, Yaex.DOM.makeArray(data));
					} else {
						queue.push(data);
					}
				}
				return queue || [];
			}
		},

		dequeue: function (elem, type) {
			type = type || 'fx';

			var queue = Yaex.DOM.queue(elem, type),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = Yaex.DOM._queueHooks(elem, type),
				next = function () {
					Yaex.DOM.dequeue(elem, type);
				};

			// If the fx queue is dequeued, always remove the progress sentinel
			if (fn === 'inprogress') {
				fn = queue.shift();
				startLength--;
			}

			if (fn) {

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if (type === 'fx') {
					queue.unshift('inprogress');
				}

				// clear up the last queue stop function
				delete hooks.stop;
				fn.call(elem, next, hooks);
			}

			if (!startLength && hooks) {
				hooks.empty.fire();
			}
		},

		// not intended for public consumption - generates a queueHooks object, or returns the current one
		_queueHooks: function (elem, type) {
			var key = type + 'queueHooks';
			return Yaex.DOM.dataPrivative.get(elem, key) || Yaex.DOM.dataPrivative.access(elem, key, {
				empty: Yaex.Callbacks('once memory').add(function () {
					Yaex.DOM.dataPrivative.remove(elem, [type + 'queue', key]);
				})
			});
		}
	});

	//---

	Yaex.DOM.Function.extend({
		queue: function (type, data) {
			var setter = 2;

			if (typeof type !== 'string') {
				data = type;
				type = 'fx';
				setter--;
			}

			if (arguments.length < setter) {
				return Yaex.DOM.queue(this[0], type);
			}

			return data === undefined ?
				this :
				this.each(function () {
					var queue = Yaex.DOM.queue(this, type, data);

					// ensure a hooks for this queue
					Yaex.DOM._queueHooks(this, type);

					if (type === 'fx' && queue[0] !== 'inprogress') {
						Yaex.DOM.dequeue(this, type);
					}
				});
		},
		dequeue: function (type) {
			return this.each(function () {
				Yaex.DOM.dequeue(this, type);
			});
		},
		// Based off of the plugin by Clint Helfers, with permission.
		// http://blindsignals.com/index.php/2009/07/jquery-delay/
		delay: function (time, type) {
			time = $.fx ? $.fx.speeds[time] || time : time;
			type = type || 'fx';

			return this.queue(type, function (next, hooks) {
				var timeout = setTimeout(next, time);
				hooks.stop = function () {
					clearTimeout(timeout);
				};
			});
		},
		clearQueue: function (type) {
			return this.queue(type || 'fx', []);
		},
		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function (type, obj) {
			var tmp,
				count = 1,
				defer = Yaex.Global.Deferred(),
				elements = this,
				i = this.length,
				resolve = function () {
					if (!(--count)) {
						defer.resolveWith(elements, [elements]);
					}
				};

			if (typeof type !== 'string') {
				obj = type;
				type = undefined;
			}
			type = type || 'fx';

			while (i--) {
				tmp = dataPrivative.get(elements[i], type + 'queueHooks');
				if (tmp && tmp.empty) {
					count++;
					tmp.empty.add(resolve);
				}
			}
			resolve();
			return defer.promise(obj);
		}
	});

	//---

	Yaex.DOM.Function.appear = function (fn, options) {
		var settings = Yaex.Extend({
			//arbitrary data to pass to fn
			data: undefined,

			//call fn only on the first appear?
			one: true
		}, options);

		return this.each(function () {
			var t = Yaex.DOM(this);

			//whether the element is currently visible
			t.appeared = false;

			if (!fn) {

				//trigger the custom event
				t.trigger('appear', settings.data);
				return;
			}

			var w = Yaex.DOM(window);

			//fires the appear event when appropriate
			var check = function () {

				//is the element hidden?
				if (!t.is(':visible')) {

					//it became hidden
					t.appeared = false;
					return;
				}

				//is the element inside the visible window?
				var a = window.scrollX;
				var b = window.scrollY;
				var o = t.offset();
				var x = o.left;
				var y = o.top;

				if (y + t.height() >= b &&
					y <= b + w.height() &&
					x + t.width() >= a &&
					x <= a + w.width()) {

					//trigger the custom event
					if (!t.appeared) t.trigger('appear', settings.data);
				} else {

					//it scrolled out of view
					t.appeared = false;
				}
			};

			//create a modified fn with some additional logic
			var modifiedFn = function () {

				//mark the element as visible
				t.appeared = true;

				//is this supposed to happen only once?
				if (settings.one) {

					//remove the check
					w.unbind('scroll', check);
					var i = Yaex.Global.inArray(check, Yaex.DOM.Function.appear.checks);
					if (i >= 0) Yaex.DOM.Function.appear.checks.splice(i, 1);
				}

				//trigger the original fn
				fn.apply(this, arguments);
			};

			//bind the modified fn to the element
			if (settings.one) t.one('appear', modifiedFn);
			else t.bind('appear', modifiedFn);

			//check whenever the window scrolls
			w.scroll(check);

			//check whenever the dom changes
			Yaex.DOM.Function.appear.checks.push(check);

			//check now
			(check)();
		});
	};

	// Keep a queue of appearance checks
	Yaex.Extend(Yaex.DOM.Function.appear, {

		checks: [],
		timeout: null,

		//process the queue
		checkAll: function () {
			var length = Yaex.DOM.Function.appear.checks.length;
			if (length > 0)
				while (length--)(Yaex.DOM.Function.appear.checks[length])();
		},

		//check the queue asynchronously
		run: function () {
			if (Yaex.DOM.Function.appear.timeout) clearTimeout(Yaex.DOM.Function.appear.timeout);
			Yaex.DOM.Function.appear.timeout = setTimeout(Yaex.DOM.Function.appear.checkAll, 20);
		}
	});

	// Run checks when these methods are called
	Yaex.Each(['append', 'prepend', 'after', 'before',
		'attr', 'removeAttr', 'addClass', 'removeClass',
		'toggleClass', 'remove', 'css', 'show', 'hide'
	], function (i, n) {
		var old = Yaex.DOM.Function[n];

		if (old) {
			Yaex.DOM.Function[n] = function () {
				var r = old.apply(this, arguments);

				Yaex.DOM.Function.appear.run();

				return r;
			}
		}
	});

	//---

	Yaex.DOM.Function.swipe = function (options) {
		if (!this) return false;
		var touchable = 'ontouchstart' in window,
			START = 'start',
			MOVE = 'move',
			END = 'end',
			CANCEL = 'cancel',
			LEFT = 'left',
			RIGHT = 'right',
			UP = 'up',
			DOWN = 'down',
			phase = START;

		return this.each(function () {
			var self = this,
				$self = Yaex.DOM(this),
				start = {
					x: 0,
					y: 0
				},
				end = {
					x: 0,
					y: 0
				},
				delta = {
					x: 0,
					y: 0
				},
				distance = {
					x: 0,
					y: 0
				},
				direction = undefined,
				touches = 0;

			function validate(event) {
				var evt = touchable ? event.touches[0] : event;
				distance.x = evt.pageX - start.x;
				distance.y = evt.pageY - start.y;
				delta.x = evt.pageX - end.x;
				delta.y = evt.pageY - end.y;
				end.x = evt.pageX;
				end.y = evt.pageY;

				var angle = Math.round(Math.atan2(end.y - start.y, start.x - end.x) * 180 / Math.PI);
				if (angle < 0) angle = 360 - Math.abs(angle);
				if ((angle <= 360) && (angle >= 315) || (angle <= 45) && (angle >= 0)) {
					direction = LEFT;
				} else if ((angle <= 225) && (angle >= 135)) {
					direction = RIGHT;
				} else if ((angle < 135) && (angle > 45)) {
					direction = DOWN;
				} else {
					direction = UP;
				}
			}

			function swipeStart(event) {
				var evt = touchable ? event.touches[0] : event;
				if (touchable) touches = event.touches.length;
				phase = START;
				start.x = evt.pageX;
				start.y = evt.pageY;
				validate(event);

				self.addEventListener((touchable) ? 'touchmove' : 'mousemove', swipeMove, false);
				self.addEventListener((touchable) ? 'touchend' : 'mouseup', swipeEnd, false);

				if (options.status) options.status.call($self, event, phase, direction, distance);
			}

			function swipeMove(event) {
				if (phase === END) return;
				phase = MOVE;
				validate(event);
				//todo implement page scrolling
				if (direction === LEFT || direction === RIGHT)
					event.preventDefault();
				if (options.status) options.status.call($self, event, phase, direction, distance);
			}

			function swipeEnd(event) {
				phase = END;
				if (options.status) options.status.call($self, event, phase, direction, distance);
			}

			function swipeCancel(event) {
				phase = CANCEL;
				if (options.status) options.status.call($self, event, phase);
				start = {
					x: 0,
					y: 0
				}, end = {
					x: 0,
					y: 0
				}, delta = {
					x: 0,
					y: 0
				}, distance = {
					x: 0,
					y: 0
				}, direction = undefined, touches = 0;
			}

			self.addEventListener((touchable) ? 'touchstart' : 'mousedown', swipeStart, false);
			self.addEventListener('touchcancel', swipeCancel, false);
		});
	};

	//---

	Yaex.DOM.Function.visible = function (visibility) {
		// return this.each(function (index, item) {
		return this.each(function () {
			var yEl = Yaex.DOM(this);
			yEl.css('visibility', visibility ? '' : 'hidden');
		});
	};

	//---

	Yaex.DOM.Function.resizeText = function (value) {
		// return this.each(function (index, item) {
		return this.each(function () {
			var yEl = Yaex.DOM(this);

			var current = yEl.html();

			//don't bother if the text we're setting is the same as the current contents
			if (value == current) return;

			//set the content so we get something for the height
			yEl.html('&nbsp;');

			//remove any previous font-size from style attribute
			yEl.css('font-size', '');

			var w = yEl.width();
			var h = yEl.height();

			var fontStr = yEl.css('font-size');
			var fontNumStr = fontStr.replace(/[a-z ]/gi, '');
			var fontSize = parseFloat(fontNumStr);

			var fontSuffix = fontStr.split(fontNumStr).join('');

			yEl.html(value);

			do {
				yEl.css('font-size', fontSize + fontSuffix);
				fontSize -= .5;
			} while ((yEl.width() > w || yEl.height() > h) && fontSize > 0);
		});
	};

	//---

})(Yaex.DOM);

//---
