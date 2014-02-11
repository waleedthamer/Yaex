/**
 * Event - Cross browser events implementation using Yaex's API
 *
 *
 * @depends: Yaex.js | Core
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function ($) {
	'use strict';

	var handlers = {};
	var YID = 1;
	var hover = {
		mouseenter: 'mouseover',
		mouseleave: 'mouseout'
	};

	var ignoreProperties = /^([A-Z]|layer[XY]$)/;

	var eventMethods = {
		preventDefault: 'isDefaultPrevented',
		stopImmediatePropagation: 'isImmediatePropagationStopped',
		stopPropagation: 'isPropagationStopped'
	};

	function yid(element) {
		return element.YID || (element.YID = YID++);
	}

	function findHandlers(element, event, fn, selector) {
		event = parse(event);

		if (event.ns) {
			var matcher = matcherFor(event.ns);
		}

		return (handlers[yid(element)] || []).filter(function (handler) {
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
		if (!$.isString(events)) {
			$.each(events, iterator);
		} else {
			events.split(/\s/).forEach(function (type) {
				iterator(type, fn);
			});
		}
	}

	function eventCapture(handler, captureSetting) {
		return handler.del &&
			(handler.e == 'focus' || handler.e == 'blur') || !! captureSetting;
	}

	function realEvent(type) {
		return hover[type] || type;
	}

	$.Yaex.Event = {
		add: function(element, events, fn, selector, getDelegate, capture) {
			var id = yid(element);
			var set = (handlers[id] || (handlers[id] = []));
			var type;

			eachEvent(events, fn, function (event, fn) {
				var handler = parse(event);
				handler.fn = fn;
				handler.sel = selector;

				// emulate mouseenter, mouseleave
				if (handler.e in hover) {
					fn = function (e) {
						var related = e.relatedTarget;

						if (!related || (related !== this && !$.contains(this, related))) {
							return handler.fn.apply(this, arguments);
						}
					}
				}

				handler.del = getDelegate && getDelegate(fn, event);

				var callback = handler.del || fn;

				handler.proxy = function (e) {
					var result = callback.apply(element, [e].concat(e.data));

					if (result === false) {
						e.preventDefault(), e.stopPropagation();
					}

					return result;
				};

				handler.i = set.length;

				set.push(handler);

				if ('addEventListener' in element) {
					element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
				}
			})
		},

		remove: function(element, events, fn, selector, capture) {
			var id = yid(element);

			eachEvent(events || '', fn, function (event, fn) {
				findHandlers(element, event, fn, selector).forEach(function (handler) {
					delete handlers[id][handler.i];

					if ('removeEventListener' in element) {
						element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
					}
				});
			});
		},

		special: {},

		fix: function(event) {
			if (!('defaultPrevented' in event)) {
				event.defaultPrevented = false;
				var prevent = event.preventDefault;
				event.preventDefault = function () {
					event.defaultPrevented = true;
					prevent.call(event);
				};
			}
		},
	};

	$.Yaex.Event.special.click = $.Yaex.Event.special.mousedown = $.Yaex.Event.special.mouseup = $.Yaex.Event.special.mousemove = 'MouseEvents';

	$.proxy = function (fn, context) {
		if ($.isFunction(fn)) {
			var proxyFn = function () {
				return fn.apply(context, arguments);
			};

			proxyFn.YID = yid(fn);

			return proxyFn;
		} else if (typeof context == 'string') {
			return $.proxy(fn[context], fn);
		} else {
			throw new TypeError("expected function");
		}
	};

	$.fn.bind = function (event, callback) {
		return this.each(function () {
			$.Yaex.Event.add(this, event, callback);
		});
	};
	$.fn.unbind = function (event, callback) {
		return this.each(function () {
			$.Yaex.Event.remove(this, event, callback);
		});
	};
	$.fn.one = function (event, callback) {
		return this.each(function (i, element) {
			$.Yaex.Event.add(this, event, callback, null, function (fn, type) {
				return function () {
					var result = fn.apply(element, arguments);
					$.Yaex.Event.remove(element, type, fn);
					return result;
				};
			});
		});
	};

	var returnTrue = function () {
		return true;
	};

	var returnFalse = function () {
		return false;
	};

	function createProxy(event) {
		$.Yaex.Event.fix(event);

		var key;

		var proxy = {
			originalEvent: event
		};

		for (key in event) {
			if (!ignoreProperties.test(key) && event[key] !== undefined) {
				proxy[key] = event[key];
			}
		}

		$.each(eventMethods, function (name, predicate) {
			proxy[name] = function () {
				this[predicate] = returnTrue;
				return event[name].apply(event, arguments);
			};

			proxy[predicate] = returnFalse;
		});

		return proxy;
	}

	$.fn.delegate = function (selector, event, callback) {
		return this.each(function (i, element) {
			$.Yaex.Event.add(element, event, callback, selector, function (fn) {
				return function (e) {
					var evt;
					var match = $(e.target).closest(selector, element).get(0);

					if (match) {
						evt = $.Extend(createProxy(e), {
							currentTarget: match,
							liveFired: element
						});

						return fn.apply(match, [evt].concat([].slice.call(arguments, 1)));
					}
				};
			});
		});
	};

	$.fn.undelegate = function (selector, event, callback) {
		return this.each(function () {
			$.Yaex.Event.remove(this, event, callback, selector);
		})
	};

	$.fn.live = function (event, callback) {
		$(document.body).delegate(this.selector, event, callback);
		return this;
	};

	$.fn.die = function (event, callback) {
		$(document.body).undelegate(this.selector, event, callback);
		return this;
	};

	$.fn.on = function (event, selector, callback) {
		return !selector || $.isFunction(selector) ?
			this.bind(event, selector || callback) : this.delegate(selector, event, callback);
	};

	$.fn.off = function (event, selector, callback) {
		return !selector || $.isFunction(selector) ?
			this.unbind(event, selector || callback) : this.undelegate(selector, event, callback);
	};

	$.fn.trigger = function (event, data) {
		if ($.isString(event) || $.isPlainObject(event)) {
			event = $.Event(event);
		}

		$.Yaex.Event.fix(event);

		event.data = data;

		return this.each(function () {
			// items in the collection might not be DOM elements
			if ('dispatchEvent' in this) {
				this.dispatchEvent(event);
			} else {
				$(this).triggerHandler(event, data);
			}
		});
	};

	// triggers event handlers on current element just as if an event occurred,
	// doesn't trigger an actual event, doesn't bubble
	$.fn.triggerHandler = function (event, data) {
		var e;
		var result;
		this.each(function (i, element) {
			e = createProxy($.isString(event) ? $.Event(event) : event);
			e.data = data;
			e.target = element;

			$.each(findHandlers(element, event.type || event), function (i, handler) {
				result = handler.proxy(e);

				if (e.isImmediatePropagationStopped()) {
					return false;
				}
			});
		});

		return result;
	};

	// shortcut methods for `.bind(event, fn)` for each event type
	('focusin focusout load resize scroll unload click dblclick wheel ' +
		'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
		'change select keydown keypress keyup error').split(' ').forEach(function (event) {
		$.fn[event] = function (callback) {
			return callback ?
				this.bind(event, callback) :
				this.trigger(event);
		};
	});

	['focus', 'blur'].forEach(function (name) {
		$.fn[name] = function (callback) {
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

	$.Event = function (type, props) {
		if ($.isString(type)) {
			props = type;
			type = props.type;
		}

		var event = document.createEvent($.Yaex.Event.special[type] || 'Events');

		var bubbles = true;

		if (props) {
			for (var name in props) {
				(name == 'bubbles') ? (bubbles = !! props[name]) : (event[name] = props[name]);
			}
		}

		event.initEvent(type, bubbles, true);

		event.isDefaultPrevented = function () {
			return event.defaultPrevented;
		};

		return event;
	};
})(Yaex)