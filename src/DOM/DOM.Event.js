/**
 * DOM.Event - Cross browser events implementation using Yaex.DOM's API
 *
 *
 * @depends: Yaex.js | Core, DOM, Selector
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	var YID = 1;

	var hover = {
		mouseenter: 'mouseover',
		mouseleave: 'mouseout'
	};

	var focus = {
		focus: 'focusin',
		blur: 'focusout'
	};

	var handlers = [];

	var slice = Array.prototype.slice;

	var rkeyEvent = /^key/;

	var rmouseEvent = /^(?:mouse|contextmenu)|click/;

	var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

	var rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

	var ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/;

	var focusinSupported = 'onfocusin' in window;

	var eventMethods = {
		preventDefault: 'isDefaultPrevented',
		stopImmediatePropagation: 'isImmediatePropagationStopped',
		stopPropagation: 'isPropagationStopped'
	};

	var specialEvents = {}

	specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents';

	//---

	// BEGIN OF [Private Functions]

	function yid(element) {
		return element.YID || (element.YID = YID++);
	}

	function findHandlers(element, event, fn, selector) {
		event = parse(event);
		
		if (event.ns) {
			var matcher = matcherFor(event.ns);
		}

		// return (handlers[yid(element)] || []).filter(function (handler) {
		return (_handlers(element) || []).filter(function (handler) {
			return handler && (!event.e || handler.e == event.e) && (!event.ns || matcher.test(handler.ns)) && (!fn || yid(handler.fn) === yid(fn)) && (!selector || handler.sel == selector);
		});
	}

	function parse(event) {
		var parts = ('' + event).split('.');

		return {
			e: parts[0],
			ns: parts.slice(1).sort().join(' ')
		};
	}

	function matcherFor(ns) {
		return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
	}

	function eachEvent(events, fn, iterator) {
		if (!Yaex.Global.isString(events)) {
			Yaex.Each(events, iterator);
		} else {
			events.split(/\s/).forEach(function (type) {
				iterator(type, fn);
			});
		}
	}

	function _handlers(elem) {
		return elem._yhandlers || (elem._yhandlers = []);
	}

	function eventCapture(handler, captureSetting) {
		return handler.del &&
			(!focusinSupported && (handler.e in focus)) || !! captureSetting;
	}

	function realEvent(type) {
		return hover[type] || (focusinSupported && focus[type]) || type;
	}

	function compatible(event, source) {
		if (source || !event.isDefaultPrevented) {
			source || (source = event);

			Yaex.Each(eventMethods, function (name, predicate) {
				var sourceMethod = source[name];

				event[name] = function () {
					this[predicate] = returnTrue;
					return sourceMethod && sourceMethod.apply(source, arguments);
				};

				event[predicate] = returnFalse;
			});

			if (!Yaex.Global.isUndefined(source.defaultPrevented) ? source.defaultPrevented :
				'returnValue' in source ? source.returnValue === false :
				source.getPreventDefault && source.getPreventDefault()) {
				event.isDefaultPrevented = returnTrue;
			}
		}

		return event;
	}

	var returnTrue = function () {
		return true;
	};

	var returnFalse = function () {
		return false;
	};

	function createProxy(event) {
		var key;
		var proxy = {
			originalEvent: event
		};

		for (key in event) {
			if (!ignoreProperties.test(key) && !Yaex.Global.isUndefined(event[key])) {
				proxy[key] = event[key];
			}
		}

		return compatible(proxy, event);
	}

	// END OF [Private Functions]

	//---

	Yaex.DOM.Event = function (type, props) {
		if (!Yaex.Global.isString(type)) {
			props = type;
			type = props.type;
		}

		var event = window.document.createEvent(specialEvents[type] || 'Events');

		var bubbles = true;

		if (props) {
			for (var name in props) {
				(name == 'bubbles') ? (bubbles = !! props[name]) : (event[name] = props[name]);
			}
		}

		event.initEvent(type, bubbles, true);

		return compatible(event);
	};

	//---

	//---

	var eventsKey = '_yaex_events';

	/**
	 * Yaex.DOM.Event contains functions for working with DOM events.
	 */
	Yaex.Utility.Extend(Yaex.DOM.Event, {
		// Inspired by John Resig, Dean Edwards and YUI addEvent implementations 
		addListener: function (object, type, callback, context) {

			var id = type + Yaex.Stamp(callback) + (context ? '_' + Yaex.Stamp(context) : '');

			// console.log(object);

			if (object[eventsKey] && object[eventsKey][id]) {
				return this;
			}

			var handler = function (e) {
				return callback.call(context || object, e || window.event);
			};

			var originalHandler = handler;

			if (Yaex.UserAgent.Features.Pointer && typevent.indexOf('touch') === 0) {
				return this.addPointerListener(object, type, handler, id);
			}

			if (Yaex.UserAgent.Features.Touch && (type === 'dblclick') && this.addDoubleTapListener) {
				this.addDoubleTapListener(object, handler, id);
			}

			if (('addEventListener' in object)) {
				if (type === 'mousewheel') {
					object.addEventListener('DOMMouseScroll', handler, false);
					object.addEventListener(type, handler, false);
				} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
					handler = function (e) {
						e = e || window.event;
						if (!Yaex.DOM.Event._checkMouse(object, e)) { return; }
						return originalHandler(e);
					};

					object.addEventListener(type === 'mouseenter' ? 'mouseover' : 'mouseout', handler, false);

				} else {
					if (type === 'click' && Yaex.UserAgent.OS.Android) {
						handler = function (e) {
							return Yaex.DOM.Event._filterClick(e, originalHandler);
						};
					}

					object.addEventListener(type, handler, false);
				}
			} else if ('attachEvent' in object) {
				object.attachEvent('on' + type, handler);
			}

			object[eventsKey] = object[eventsKey] || {};
			object[eventsKey][id] = handler;

			return this;
		},

		removeListener: function (object, type, callback, context) {
			var id = type + Yaex.Stamp(callback) + (context ? '_' + Yaex.Stamp(context) : '');
			var handler = object[eventsKey] && object[eventsKey][id];

			if (!handler) {
				return this;
			}

			if (Yaex.UserAgent.Features.Pointer && typevent.indexOf('touch') === 0) {
				this.removePointerListener(object, type, id);
			} else if (Yaex.UserAgent.Features.Touch && (type === 'dblclick') && this.removeDoubleTapListener) {
				this.removeDoubleTapListener(object, id);
			} else if ('removeEventListener' in object) {
				if (type === 'mousewheel') {
					object.removeEventListener('DOMMouseScroll', handler, false);
					object.removeEventListener(type, handler, false);

				} else {
					object.removeEventListener(
						type === 'mouseenter' ? 'mouseover' :
						type === 'mouseleave' ? 'mouseout' : type, handler, false);
				}

			} else if ('detachEvent' in object) {
				object.detachEvent('on' + type, handler);
			}

			object[eventsKey][id] = null;

			return this;
		},

		stopPropagation: function (event) {
			if (event.stopPropagation) {
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}
			Yaex.DOM.Event._skipped(event);

			return this;
		},

		disableScrollPropagation: function (el) {
			var stop = Yaex.DOM.Event.stopPropagation;

			return Yaex.DOM.Event
				.on(el, 'mousewheel', stop)
				.on(el, 'MozMousePixelScroll', stop);
		},

		disableClickPropagation: function (el) {
			var stop = Yaex.DOM.Event.stopPropagation;

			for (var i = L.Draggablevent.START.length - 1; i >= 0; i--) {
				Yaex.DOM.Event.on(el, L.Draggablevent.START[i], stop);
			}

			return Yaex.DOM.Event
				.on(el, 'click', Yaex.DOM.Event._fakeStop)
				.on(el, 'dblclick', stop);
		},

		preventDefault: function (event) {
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}

			return this;
		},

		stop: function (event) {
			return Yaex.DOM.Event
				.preventDefault(event)
				.stopPropagation(event);
		},

		getMousePosition: function (event, container) {
			var body = document.body,
			    docEl = document.documentElement,

			    // Gecko makes scrollLeft more negative as you scroll in rtl, other browsers don't
				// ref: https://code.google.com/p/closure-library/source/browse/closure/goog/style/bidi.js
				x = event.pageX ? event.pageX - body.scrollLeft -
						docEl.scrollLeft * (Yaex.DOM.documentIsLtr() || Yaex.UserAgent.Browser.Gecko ? 1 : -1) : event.clientX,
			    y = event.pageY ? event.pageY - body.scrollTop - docEl.scrollTop : event.clientY,

			    pos = new L.Point(x, y);

			if (!container) {
				return pos;
			}

			var rect = container.getBoundingClientRect(),
			    left = rect.left - container.clientLeft,
			    top = rect.top - container.clientTop;

			return pos._subtract(new L.Point(left, top));
		},

		getWheelDelta: function (e) {
			var delta = 0;

			if (event.wheelDelta) {
				delta = event.wheelDelta / 120;
			}

			if (event.detail) {
				delta = -event.detail / 3;
			}

			return delta;
		},

		_skipEvents: {},

		_fakeStop: function (e) {
			// fakes stopPropagation by setting a special event flag, checked/reset with Yaex.DOM.Event._skipped(e)
			Yaex.DOM.Event._skipEvents[event.type] = true;
		},

		_skipped: function (e) {
			var skipped = this._skipEvents[event.type];
			// reset when checking, as it's only used in map container and propagates outside of the map
			this._skipEvents[event.type] = false;
			return skipped;
		},

		// check if element really left/entered the event target (for mouseenter/mouseleave)
		_checkMouse: function (el, e) {
			var related = event.relatedTarget;

			if (!related) { return true; }

			try {
				while (related && (related !== el)) {
					related = related.parentNode;
				}
			} catch (err) {
				return false;
			}
			return (related !== el);
		},

		// this is a horrible workaround for a bug in Android where a single touch triggers two click events
		_filterClick: function (e, handler) {
			var timeStamp = (event.timeStamp || event.originalEvent.timeStamp),
				elapsed = Yaex.DOM.Event._lastClick && (timeStamp - Yaex.DOM.Event._lastClick);

			// are they closer together than 1000ms yet more than 100ms?
			// Android typically triggers them ~300ms apart while multiple listeners
			// on the same event should be triggered far faster;
			// or check if click is simulated on the element, and if it is, reject any non-simulated events

			if ((elapsed && elapsed > 100 && elapsed < 1000) || (event.target._simulatedClick && !event._simulated)) {
				Yaex.DOM.Event.stop(e);
				return;
			}

			Yaex.DOM.Event._lastClick = timeStamp;

			return handler(e);
		}, 


	});

	//---

	Yaex.DOM.Event.on = Yaex.DOM.Event.addListener;
	Yaex.DOM.Event.off = Yaex.DOM.Event.removeListener;

	//---

	Yaex.Utility.Extend(Yaex.DOM.Event, {
		add: function (element, events, fn, data, selector, delegator, capture) {
			// var id = yid(element);
			var set = _handlers(element);
			// var _set = (handlers[id] || (handlers[id] = []));
			// var type;

			events.split(/\s/).forEach(function (event) {
				if (event == 'ready') {
					return Yaex.DOM(document).ready(fn);
				}

				var handler = parse(event);

				handler.fn = fn;
				handler.sel = selector;

				// console.log((handler.e in hover));

				// Emulate mouseenter, mouseleave
				if (handler.e in hover) {
					fn = function (e) {
						var related = e.relatedTarget;

						if (!related || (related !== this && !Yaex.DOM.Contains(this, related))) {
							return handler.fn.apply(this, arguments);
						}
					}
				}

				handler.del = delegator;

				var callback = delegator || fn;
				
				handler.proxy = function (e) {
					e = compatible(e);

					if (e.isImmediatePropagationStopped()) {
						return;
					}

					e.data = data;

					var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args));

					if (result === false) {
						e.preventDefault(), e.stopPropagation();
					}

					return result;
				};

				handler.i = set.length;

				set.push(handler);

				if ('addEventListener' in element) {
					// element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
					Yaex.DOM.Event.on(element, realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
				}
			});
		},

		remove: function (element, events, fn, selector, capture) {
			// var id = yid(element);

			(events || '').split(/\s/).forEach(function (event) {
				findHandlers(element, event, fn, selector).forEach(function (handler) {
					// delete handlers[id][handler.i];
					delete _handlers(element)[handler.i];

					if ('removeEventListener' in element) {
						// element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
						Yaex.DOM.Event.off(element, realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
					}
				});
			});
		},

		dispacher: function (eventType, object) {
			var dispatcher = function (event, event_type, handler) {
				try {
					var classes = [];
					var clsStr = Yaex.DOM(event.target || event.srcElement).attr('class');

					if (clsStr.indexOf(' ') > -1) {
						classes = clsStr.split(' ');
					} else {
						classes = [clsStr];
					}

					for (var x in classes) {
						var hname = classes[x].replace(/com_/, '');

						if (handler[hname]) {
							if (handler[hname][event_type]) {
								handler[hname][event_type](event, event_type);
							}
						}
					}
				} catch (e) {
					//...
				}
			};

			var eventTypes;

			if (eventType.indexOf(',') > -1) {
				eventTypes = eventType.split(',');
			} else if (eventType.indexOf(', ') > -1) {
				eventTypes = eventType.split(', ');
			} else if (eventType.indexOf(' , ') > -1) {
				eventTypes = eventType.split(' , ');
			} else if (eventType.indexOf(' ,') > -1) {
				eventTypes = eventType.split(' ,');
			} else {
				eventTypes = [eventType];
			}

			for (var x in eventTypes) {
				Yaex.DOM('body')[eventTypes[x]]((function (evt) {
					return function (e) {
						dispatcher(e, evt, object);
					}
				})(eventTypes[x]));
			}
		}
	});

	//---

	$.proxy = $.Proxy = function (callback, context) {
		if (Yaex.Global.isFunction(callback)) {
			var proxyFn = function () {
				return callback.apply(context, arguments);
			};

			proxyFn.YID = yid(callback);

			return proxyFn;
		} else if (Yaex.Global.isString(context)) {
			return Yaex.DOM.Proxy(callback[context], callback);
		} else {
			throw new TypeError('expected function');
		}
	};

	Yaex.DOM.Function.bind = function (event, data, callback) {
		return this.on(event, data, callback);
	};

	Yaex.DOM.Function.unbind = function (event, callback) {
		return this.off(event, callback)
	};

	Yaex.DOM.Function.one = function (event, selector, data, callback) {
		return this.on(event, selector, data, callback, 1);
	};

	Yaex.DOM.Function.delegate = function (selector, event, callback) {
		return this.on(event, selector, callback);
	};

	Yaex.DOM.Function.undelegate = function (selector, event, callback) {
		return this.off(event, selector, callback);
	};

	Yaex.DOM.Function.live = function (event, callback) {
		Yaex.DOM(document.body).delegate(this.selector, event, callback);
		return this;
	};

	Yaex.DOM.Function.die = function (event, callback) {
		Yaex.DOM(document.body).undelegate(this.selector, event, callback);
		return this;
	};

	Yaex.DOM.Function.on = function (event, selector, data, callback, one) {
		var autoRemove;
		var delegator;
		var $this = this;

		if (event && !Yaex.Global.isString(event)) {
			Yaex.Each(event, function (type, fn) {
				$this.on(type, selector, data, fn, one);
			});

			return $this;
		}

		if (!Yaex.Global.isString(selector) && !Yaex.Global.isFunction(callback) && callback !== false) {
			callback = data;
			data = selector;
			selector = undefined;
		}

		if (Yaex.Global.isFunction(data) || data === false) {
			callback = data;
			data = undefined;
		}

		if (callback === false) {
			callback = returnFalse;
		}

		return $this.each(function (_, element) {
			if (one) {
				autoRemove = function (e) {
					Yaex.DOM.Event.remove(element, e.type, callback);
					return callback.apply(this, arguments);
				}
			}

			if (selector) {
				delegator = function (e) {
					var evt;
					var match = Yaex.DOM(e.target).closest(selector, element).get(0);

					if (match && match !== element) {
						evt = Yaex.Extend(createProxy(e), {
							currentTarget: match,
							liveFired: element
						});

						return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)));
					}
				};
			}

			Yaex.DOM.Event.add(element, event, callback, data, selector, delegator || autoRemove);
		});
	};

	Yaex.DOM.Function.off = function (event, selector, callback) {
		var $this = this;

		if (event && !Yaex.Global.isString(event)) {
			Yaex.Each(event, function (type, fn) {
				$this.off(type, selector, fn);
			});

			return $this;
		}

		if (!Yaex.Global.isString(selector) && !Yaex.Global.isFunction(callback) && callback !== false) {
			callback = selector;
			selector = undefined;
		}

		if (callback === false) {
			callback = returnFalse;
		}

		return $this.each(function () {
			Yaex.DOM.Event.remove(this, event, callback, selector);
		});
	};

	Yaex.DOM.Function.trigger = function (event, args) {
		if (Yaex.Global.isString(event) || Yaex.Global.isPlainObject(event)) {
			event = Yaex.DOM.Event(event);
		} else {
			event = compatible(event);
		}

		event._args = args;

		return this.each(function () {
			// items in the collection might not be DOM elements
			if ('dispatchEvent' in this) {
				this.dispatchEvent(event);
			} else {
				Yaex.DOM(this).triggerHandler(event, args);
			}
		});
	};

	// triggers event handlers on current element just as if an event occurred,
	// doesn't trigger an actual event, doesn't bubble
	Yaex.DOM.Function.triggerHandler = function (event, args) {
		var e;
		var result;

		this.each(function (i, element) {
			e = createProxy(Yaex.Global.isString(event) ? Yaex.Event.Create(event) : event);
			e._args = args;
			e.target = element;

			Yaex.Each(findHandlers(element, event.type || event), function (i, handler) {
				result = handler.proxy(e);

				if (e.isImmediatePropagationStopped()) {
					return false
				}
			});
		});

		return result;
	};


	// shortcut methods for `.bind(event, fn)` for each event type
	('focusin focusout load resize scroll unload click dblclick hashchange ' +
		'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
		'change select submit keydown keypress keyup error contextmenu').split(' ').forEach(function (event) {
		Yaex.DOM.Function[event] = function (callback) {
			return callback ?
				this.bind(event, callback) :
				this.trigger(event);
		};
	});

	Yaex.DOM.Function.hashchange = function (callback) {
		return callback ? this.bind('hashchange', callback) : this.trigger('hashchange', callback);
	};

	['focus', 'blur'].forEach(function (name) {
		Yaex.DOM.Function[name] = function (callback) {
			if (callback) {
				this.bind(name, callback);
			} else {
				this.each(function () {
					try {
						this[name]();
					} catch (e) {
						//...
					}
				});
			}

			return this;
		};
	});

	// Generate extended `remove` and `empty` functions
	['remove', 'empty'].forEach(function (method) {
		var origFn = Yaex.DOM.Function[method];

		Yaex.DOM.Function[method] = function () {
			var elements = this.find('*');

			if (method === 'remove') {
				elements = elements.add(this);
			}

			elements.forEach(function (elem) {
				Yaex.DOM.Event.remove(elem);
			});

			return origFn.call(this);
		};
	});

	//---

})(Yaex.DOM);

//---
