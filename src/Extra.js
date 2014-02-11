/**
 * Extra - Extra functionalities for Yaex
 *
 *
 * @depends: Yaex.js | Core, Selector, Data, Event, Extra
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function ($) {
	'use strict';

	// Map object to object
	$.MapObjectToObject = function (obj, callback) {
		var result = {};

		$.each(obj, function (key, value) {
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

		if ($.isString(name) && $.isString(value)) {
			localStorage[name] = value;
			return true;
		// } else if ($.isObject(name) && typeof value === 'undefined') {
		} else if ($.isObject(name) && $.isUndefined(value)) {
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

		if ($.isString(name) && $.isString(value)) {
			document.cookie = name + '=' + value + expire + '; path=/';
			return true;
		// } else if (typeof n === 'object' && typeof v === 'undefined') {
		} else if ($.isObject(name) && $.isUndefined(value)) {
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
	$.Extend({
		Storage: {
			Set: isLocalStorage ? WriteToLocalStorage : WriteCookie,
			Get: isLocalStorage ? ReadFromLocalStorage : ReadCookie,
			Remove: isLocalStorage ? DeleteFromLocalStorage : DeleteCookie
		}
	});

	//---

	// Local storage Implementation 
	// $.map(['localStorage', 'sessionStorage'], function (method) {
	// 	var defaults = {
	// 		cookiePrefix: 'fallback:' + method + ':',
	// 		cookieOptions: {
	// 			path: '/',
	// 			domain: document.domain,
	// 			expires: ('localStorage' === method) ? {
	// 				expires: 365
	// 			} : undefined
	// 		}
	// 	};

	// 	try {
	// 		$.Support[method] = method in window && window[method] !== null;
	// 	} catch (e) {
	// 		$.Support[method] = false;
	// 	}

	// 	$[method] = function (key, value) {
	// 		var options = $.Extend({}, defaults, $[method].options);

	// 		this.getItem = function (key) {
	// 			var returns = function (key) {
	// 				return JSON.parse($.Support[method] ? window[method].getItem(key) : $.cookie(options.cookiePrefix + key));
	// 			};
	// 			if (typeof key === 'string') return returns(key);

	// 			var arr = [],
	// 				i = key.length;
	// 			while (i--) arr[i] = returns(key[i]);
	// 			return arr;
	// 		};

	// 		this.setItem = function (key, value) {
	// 			value = JSON.stringify(value);
	// 			return $.Support[method] ? window[method].setItem(key, value) : $.cookie(options.cookiePrefix + key, value, options.cookieOptions);
	// 		};

	// 		this.removeItem = function (key) {
	// 			return $.Support[method] ? window[method].removeItem(key) : $.cookie(options.cookiePrefix + key, null, $.Extend(options.cookieOptions, {
	// 				expires: -1
	// 			}));
	// 		};

	// 		this.clear = function () {
	// 			if ($.Support[method]) {
	// 				return window[method].clear();
	// 			} else {
	// 				var reg = new RegExp('^' + options.cookiePrefix, ''),
	// 					opts = $.Extend(options.cookieOptions, {
	// 						expires: -1
	// 					});

	// 				if (document.cookie && document.cookie !== '') {
	// 					$.map(document.cookie.split(';'), function (cookie) {
	// 						if (reg.test(cookie = $.trim(cookie))) {
	// 							$.cookie(cookie.substr(0, cookie.indexOf('=')), null, opts);
	// 						}
	// 					});
	// 				}
	// 			}
	// 		};

	// 		if (typeof key !== 'undefined') {
	// 			return typeof value !== 'undefined' ? (value === null ? this.removeItem(key) : this.setItem(key, value)) : this.getItem(key);
	// 		}

	// 		return this;
	// 	};

	// 	$[method].options = defaults;
	// });

	//---

	// Yaex Timers
	$.fn.extend({
		everyTime: function (interval, label, fn, times, belay) {
			//console.log(this);
			return this.each(function () {
				$.timer.add(this, interval, label, fn, times, belay);
			});
		},
		oneTime: function (interval, label, fn) {
			return this.each(function () {
				$.timer.add(this, interval, label, fn, 1);
			});
		},
		stopTime: function (label, fn) {
			return this.each(function () {
				$.timer.remove(this, label, fn);
			});
		}
	});

	$.Extend({
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
				var result = this.regex.exec($.trim(value.toString()));
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

				if ($.isFunction(label)) {
					if (!times) {
						times = fn;
					}
					fn = label;
					label = interval;
				}

				interval = $.timer.timeParse(interval);

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
						$.timer.remove(element, label, fn);
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

	$.Extend({
		queue: function (elem, type, data) {
			var queue;

			if (elem) {
				type = (type || 'fx') + 'queue';
				queue = $.data_priv.get(elem, type);

				// Speed up dequeue by getting out quickly if this is just a lookup
				if (data) {
					if (!queue || $.isArray(data)) {
						queue = $.data_priv.access(elem, type, $.makeArray(data));
					} else {
						queue.push(data);
					}
				}
				return queue || [];
			}
		},

		dequeue: function (elem, type) {
			type = type || 'fx';

			var queue = $.queue(elem, type),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = $._queueHooks(elem, type),
				next = function () {
					$.dequeue(elem, type);
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
			return $.data_priv.get(elem, key) || $.data_priv.access(elem, key, {
				empty: $.Callbacks('once memory').add(function () {
					$.data_priv.remove(elem, [type + 'queue', key]);
				})
			});
		}
	});

	//---

	$.fn.extend({
		queue: function (type, data) {
			var setter = 2;

			if (typeof type !== 'string') {
				data = type;
				type = 'fx';
				setter--;
			}

			if (arguments.length < setter) {
				return $.queue(this[0], type);
			}

			return data === undefined ?
				this :
				this.each(function () {
					var queue = $.queue(this, type, data);

					// ensure a hooks for this queue
					$._queueHooks(this, type);

					if (type === 'fx' && queue[0] !== 'inprogress') {
						$.dequeue(this, type);
					}
				});
		},
		dequeue: function (type) {
			return this.each(function () {
				$.dequeue(this, type);
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
				defer = $.Deferred(),
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
				tmp = data_priv.get(elements[i], type + 'queueHooks');
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

	$.fn.appear = function (fn, options) {
		var settings = $.Extend({
			//arbitrary data to pass to fn
			data: undefined,

			//call fn only on the first appear?
			one: true
		}, options);

		return this.each(function () {
			var t = $(this);

			//whether the element is currently visible
			t.appeared = false;

			if (!fn) {

				//trigger the custom event
				t.trigger('appear', settings.data);
				return;
			}

			var w = $(window);

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
					var i = $.inArray(check, $.fn.appear.checks);
					if (i >= 0) $.fn.appear.checks.splice(i, 1);
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
			$.fn.appear.checks.push(check);

			//check now
			(check)();
		});
	};

	// Keep a queue of appearance checks
	$.Extend($.fn.appear, {

		checks: [],
		timeout: null,

		//process the queue
		checkAll: function () {
			var length = $.fn.appear.checks.length;
			if (length > 0)
				while (length--)($.fn.appear.checks[length])();
		},

		//check the queue asynchronously
		run: function () {
			if ($.fn.appear.timeout) clearTimeout($.fn.appear.timeout);
			$.fn.appear.timeout = setTimeout($.fn.appear.checkAll, 20);
		}
	});

	// Run checks when these methods are called
	$.each(['append', 'prepend', 'after', 'before',
		'attr', 'removeAttr', 'addClass', 'removeClass',
		'toggleClass', 'remove', 'css', 'show', 'hide'
	], function (i, n) {
		var old = $.fn[n];

		if (old) {
			$.fn[n] = function () {
				var r = old.apply(this, arguments);

				$.fn.appear.run();

				return r;
			}
		}
	});

	//---

	$.fn.swipe = function (options) {
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
				$self = $(this),
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

	$.fn.visible = function (visibility) {
		// return this.each(function (index, item) {
		return this.each(function () {
			var yEl = $(this);
			yEl.css('visibility', visibility ? '' : 'hidden');
		});
	};

	//---

	$.fn.resizeText = function (value) {
		// return this.each(function (index, item) {
		return this.each(function () {
			var yEl = $(this);

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

			// console.log(['w', w, 'h', h, 'fontStr', fontStr, 'fontNumStr', fontNumStr, 'fontSize', fontSize, 'fontSuffix', fontSuffix].join(':'));

			yEl.html(value);

			do {
				yEl.css('font-size', fontSize + fontSuffix);
				fontSize -= .5;
			} while ((yEl.width() > w || yEl.height() > h) && fontSize > 0);
		});
	};

	//---

	// $.Extend($.fn, {
	$.Extend({
		Extra: {
			/*
			 * @method
			 * @id Extra.isEmpty
			 * @alias Yaex.fn.Extra.isEmpty
			 * @memberOf Yaex.fn.Extra
			 * @param {Object} Object to test
			 * @return boolean
			 */
			isEmpty: function (val) {
				var empty = [null, '', 0, false, undefined],
					isEmpty = false;
				if (Array.isArray(val) && val.length === 0) {
					isEmpty = true;
				} else if (Yaex.fn.Extra.isFunction(val) && Yaex.fn.Extra.isFunctionEmpty(val)) {
					isEmpty = true;
				} else if (Yaex.fn.Extra.isObject(val) && Yaex.fn.Extra.isObjectEmpty(val)) {
					isEmpty = true;
				} else if (Yaex.fn.Extra.type(val) === 'number' && isNaN(val)) {
					isEmpty = (val === Number.NEGATIVE_INFINITY || val === Number.POSITIVE_INFINITY) ? false : true;
				} else {
					for (var i = empty.length; i > 0; i--) {
						if (empty[i - 1] === val) {
							isEmpty = true;
							break;
						}
					}
				}
				return isEmpty;
			},

			/*
			 * @method
			 * @id Extra.isFunctionEmpty
			 * @alias Yaex.fn.Extra.isFunctionEmpty
			 * @memberOf Yaex.fn.Extra
			 * @param {Object} obj to test
			 * @return boolean
			 */
			isFunctionEmpty: function (obj) {
				// only get RegExs when needed
				var arr = Yaex.fn.Extra.getGetFunctionBodyRegEx().exec(obj);
				if (arr && arr.length > 1 && arr[1] !== undefined) {
					var body = arr[1].replace(Yaex.fn.Extra.getRemoveCodeCommentsRegEx(), '');
					if (body && Yaex.fn.Extra.getContainsWordCharRegEx().test(body)) {
						return false;
					}
				}
				return true;
			},

			/*
			 * @method
			 * @id Extra.isFunction
			 * @alias Yaex.fn.Extra.isFunction
			 * @memberOf Yaex.fn.Extra
			 * @param {Object} obj to test
			 * @return boolean
			 */
			isFunction: function (obj) {
				if (Yaex.fn.Extra.type(obj) === 'function') {
					return true;
				}
				return false;
			},

			/*
			 * @method
			 * @id Extra.isObjectEmpty
			 * @alias Yaex.fn.Extra.isObjectEmpty
			 * @memberOf Yaex.fn.Extra
			 * @param {Object} obj to test
			 * @return boolean
			 */
			isObjectEmpty: function (obj) {
				for (var name in obj) {
					if (obj.hasOwnProperty(name)) {
						return false;
					}
				}
				return true;
			},

			/*
			 * @method
			 * @id Extra.isObject
			 * @alias Yaex.fn.Extra.isObject
			 * @memberOf Yaex.fn.Extra
			 * @param {Object} obj to test if it's a basic simple object,
			 * @return boolean
			 */
			isObject: function (obj) {
				var key;
				if (!obj || typeof obj !== 'object' || obj.getElementById || obj.getComputedStyle) {
					return false;
				}
				if (obj.constructor) {
					return true;
				}
				for (key in obj) {}
				return key === undefined || Yaex.fn.Extra.hasOwnProperty.call(obj, key) || false;
			},

			/*
			 * @method
			 * @id Extra.isArray
			 * @alias Yaex.fn.Extra.isArray
			 * @memberOf Yaex.fn.Extra
			 * @param {Object} obj to test
			 * @return boolean
			 */
			isArray: function (obj) {
				return Array.isArray(obj);
			},

			/*
			 * @method
			 * @id Extra.isNull
			 * @alias Yaex.fn.Extra.isNull
			 * @memberOf Yaex.fn.Extra
			 * @param {Object} obj to test
			 * @return boolean
			 */
			isNull: function (obj) {
				return Yaex.fn.Extra.type(obj) === Yaex.fn.Extra.type(null);
			},

			/*
			 * @method
			 * @id Extra.isUndefined
			 * @alias Yaex.fn.Extra.isUndefined
			 * @memberOf Yaex.fn.Extra
			 * @param {Object} obj to test
			 * @return boolean
			 */
			isUndefined: function (obj) {
				return Yaex.fn.Extra.type(obj) === Yaex.fn.Extra.type();
			},

			/*
			 * @method
			 * @id Extra.type
			 * @alias Yaex.fn.Extra.type
			 * @memberOf Yaex.fn.Extra
			 * @param {Object} obj to test, add null to usual object types
			 * @return string
			 */
			type: function (obj) {
				var t;
				if (obj == null) {
					t = String(obj);
					/*} else if (({})[ Yaex.fn.Extra.toString.call(obj) ]){
					t = Yaex.fn.Extra.toString.call(obj)*/
				} else {
					t = typeof obj;
				}
				return t;
			},

			/*
			 * @method
			 * @id Extra.getContainsWordCharRegEx
			 * @alias Yaex.fn.Extra.getContainsWordCharRegEx
			 * @memberOf Yaex.fn.Extra
			 * @return RegEx
			 */
			getContainsWordCharRegEx: function () {
				if (!Yaex.fn.Extra.reContainsWordChar) {
					Yaex.fn.Extra.reContainsWordChar = new RegExp('\\S+', 'g');
				}
				return Yaex.fn.Extra.reContainsWordChar;
			},

			/*
			 * @method
			 * @id Extra.getGetFunctionBodyRegEx
			 * @alias Yaex.fn.Extra.getGetFunctionBodyRegEx
			 * @memberOf Yaex.fn.Extra
			 * @return RegEx
			 */
			getGetFunctionBodyRegEx: function () {
				if (!Yaex.fn.Extra.reGetFunctionBody) {
					Yaex.fn.Extra.reGetFunctionBody = new RegExp('{((.|\\s)*)}', 'm');
				}
				return Yaex.fn.Extra.reGetFunctionBody;
			},

			/*
			 * @method
			 * @id Extra.getRemoveCodeCommentsRegEx
			 * @alias Yaex.fn.Extra.getRemoveCodeCommentsRegEx
			 * @memberOf Yaex.fn.Extra
			 * @return RegEx
			 */
			getRemoveCodeCommentsRegEx: function () {
				if (!Yaex.fn.Extra.reRemoveCodeComments) {
					Yaex.fn.Extra.reRemoveCodeComments = new RegExp("(\\/\\*[\\w\\'\\s\\r\\n\\*]*\\*\\/)|(\\/\\/[\\w\\s\\']*)", 'g');
				}
				return Yaex.fn.Extra.reRemoveCodeComments;
			},

			hasOwnProperty: ({}).hasOwnProperty,
			toString: ({}).toString,
			reContainsWordChar: null,
			reGetFunctionBody: null,
			reRemoveCodeComments: null
		}
	});

	//---

	/** 
	 * If no touch events are available map touch events to corresponding mouse events.
	 **/
	// try {
	// 	document.createEvent('TouchEvent');
	// } catch (e) {
	// 	var _fakeCallbacks = {}, // Store the faked callbacks so that they can be unbound
	// 		eventmap = {
	// 			'touchstart': 'mousedown',
	// 			'touchend': 'mouseup',
	// 			'touchmove': 'mousemove'
	// 		};

	// 	function touch2mouse(type, callback, context) {
	// 		if ((typeof type) == 'object') {
	// 			// Assume we have been called with an event object.
	// 			// Do not map the event.
	// 			// TODO: Should this still try and map the event.
	// 			return [type]
	// 		}

	// 		// remove the extra part after the .
	// 		var p = type.match(/([^.]*)(\..*|$)/),
	// 			// orig = p[0],
	// 			type = p[1],
	// 			extra = p[2],
	// 			mappedevent = eventmap[type];

	// 		result = [(mappedevent || type) + extra]
	// 		if (arguments.length > 1) {
	// 			if (mappedevent) {
	// 				callback = fakeTouches(type, callback, context);
	// 			}

	// 			result.push(callback);
	// 		}


	// 		return result;
	// 	}

	// 	function fakeTouches(type, callback, context) {
	// 		// wrap the callback with a function that adds a fake 
	// 		// touches property to the event.

	// 		return _fakeCallbacks[callback] = function (event) {
	// 			if (event.button) {
	// 				return false;
	// 			}
	// 			event.touches = [{
	// 				length: 1, // 1 mouse (finger)
	// 				clientX: event.clientX,
	// 				clientY: event.clienty,
	// 				pageX: event.pageX,
	// 				pageY: event.pageY,
	// 				screenX: event.screenX,
	// 				screenY: event.screenY,
	// 				target: event.target
	// 			}]

	// 			event.touchtype = type;

	// 			return callback.apply(context, [event]);
	// 		}
	// 	}

	// 	var _bind = $.fn.bind;

	// 	$.fn.bind = function (event, callback) {
	// 		return _bind.apply(this, touch2mouse(event, callback, this));
	// 	};

	// 	var _unbind = $.fn.unbind;

	// 	$.fn.unbind = function (event, callback) {
	// 		if (!event) {
	// 			_unbind.apply(this);
	// 			return;
	// 		}
	// 		var result = _unbind.apply(this, touch2mouse(event).concat([_fakeCallbacks[callback] || callback]));
	// 		delete(_fakeCallbacks[callback]);
	// 		return result;
	// 	};

	// 	var _one = $.fn.one;

	// 	$.fn.one = function (event, callback) {
	// 		return _one.apply(this, touch2mouse(event, callback, this));
	// 	};

	// 	var _delegate = $.fn.delegate;

	// 	$.fn.delegate = function (selector, event, callback) {
	// 		return _delegate.apply(this, [selector].concat(touch2mouse(event, callback, this)));
	// 	};

	// 	var _undelegate = $.fn.undelegate;

	// 	$.fn.undelegate = function (selector, event, callback) {
	// 		var result = _undelegate.apply(this, [selector].concat(touch2mouse(event), [_fakeCallbacks[callback] || callback]));
	// 		delete(_fakeCallbacks[callback]);
	// 		return result;
	// 	};

	// 	var _live = $.fn.live;

	// 	$.fn.live = function (event, callback) {
	// 		return _live.apply(this, touch2mouse(event, callback, this));
	// 	};

	// 	var _die = $.fn.die;

	// 	$.fn.die = function (event, callback) {
	// 		var result = _die.apply(this, touch2mouse(event).concat([_fakeCallbacks[callback] || callback]));
	// 		delete(_fakeCallbacks[callback]);
	// 		return result;
	// 	};

	// 	var _trigger = $.fn.trigger;

	// 	$.fn.trigger = function (event, data) {
	// 		return _trigger.apply(this, touch2mouse(event).concat([data]));
	// 	};

	// 	var _triggerHandler = $.fn.triggerHandler;

	// 	$.fn.triggerHandler = function (event, data) {
	// 		return _triggerHandler.apply(this, touch2mouse(event).concat([data]));
	// 	};
	// };

	//---

	window.cordova = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

	if (window.cordova === false) {
		$(function () {
			$(document).trigger('deviceready');
		});
	}

	//---

})(Yaex)
