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

	var undefined;

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
		if (!$.isString(events)) {
			$.Each(events, iterator);
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

			$.Each(eventMethods, function (name, predicate) {
				var sourceMethod = source[name];

				event[name] = function () {
					this[predicate] = returnTrue;
					return sourceMethod && sourceMethod.apply(source, arguments);
				};

				event[predicate] = returnFalse;
			});

			if (!$.isUndefined(source.defaultPrevented) ? source.defaultPrevented :
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
			if (!ignoreProperties.test(key) && !$.isUndefined(event[key])) {
				proxy[key] = event[key];
			}
		}

		return compatible(proxy, event);
	}

	$.Yaex.Event = {};


	$.Yaex.Event = {
		add: function (element, events, fn, data, selector, delegator, capture) {
			// var id = yid(element);
			var set = _handlers(element);
			// var _set = (handlers[id] || (handlers[id] = []));

			// var type;

			events.split(/\s/).forEach(function (event) {
				if (event == 'ready') {
					return $(document).ready(fn);
				}

				var handler = parse(event);

				handler.fn = fn;
				handler.sel = selector;

				// emulate mouseenter, mouseleave
				if (handler.e in hover) {
					fn = function (e) {
						var related = e.relatedTarget;

						if (!related || (related !== this && !$.Contains(this, related))) {
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
					element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
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
						element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture));
					}
				});
			});
		}
	};

	$.Extend({
		dispacher: function (eventType, obj) {
			var dispatcher = function (event, event_type, handler) {
				try {
					var classes = [];
					var clsStr = $(event.target || event.srcElement).attr('class');

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
				$('body')[eventTypes[x]]((function (evt) {
					return function (e) {
						dispatcher(e, evt, obj);
					}
				})(eventTypes[x]));
			}
		}
	});

	$.proxy = $.Proxy = function (callback, context) {
		if ($.isFunction(callback)) {
			var proxyFn = function () {
				return callback.apply(context, arguments);
			};

			proxyFn.YID = yid(callback);

			return proxyFn;
		} else if ($.isString(context)) {
			return $.proxy(callback[context], callback);
		} else {
			throw new TypeError('expected function');
		}
	};

	$.fn.bind = function (event, data, callback) {
		return this.on(event, data, callback);
	};

	$.fn.unbind = function (event, callback) {
		return this.off(event, callback)
	};

	$.fn.one = function (event, selector, data, callback) {
		return this.on(event, selector, data, callback, 1);
	};

	$.fn.delegate = function (selector, event, callback) {
		return this.on(event, selector, callback);
	};

	$.fn.undelegate = function (selector, event, callback) {
		return this.off(event, selector, callback);
	};

	$.fn.live = function (event, callback) {
		$(document.body).delegate(this.selector, event, callback);
		return this;
	};

	$.fn.die = function (event, callback) {
		$(document.body).undelegate(this.selector, event, callback);
		return this;
	};

	$.fn.on = function (event, selector, data, callback, one) {
		var autoRemove;
		var delegator;
		var $this = this;

		if (event && !$.isString(event)) {
			$.Each(event, function (type, fn) {
				$this.on(type, selector, data, fn, one);
			});

			return $this;
		}

		if (!$.isString(selector) && !$.isFunction(callback) && callback !== false) {
			callback = data;
			data = selector;
			selector = undefined;
		}

		if ($.isFunction(data) || data === false) {
			callback = data;
			data = undefined;
		}

		if (callback === false) {
			callback = returnFalse;
		}

		return $this.each(function (_, element) {
			if (one) {
				autoRemove = function (e) {
					$.Yaex.Event.remove(element, e.type, callback);
					return callback.apply(this, arguments);
				}
			}

			if (selector) {
				delegator = function (e) {
					var evt;
					var match = $(e.target).closest(selector, element).get(0);

					if (match && match !== element) {
						evt = $.Extend(createProxy(e), {
							currentTarget: match,
							liveFired: element
						});

						return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)));
					}
				};
			}

			$.Yaex.Event.add(element, event, callback, data, selector, delegator || autoRemove);
		});
	};

	$.fn.off = function (event, selector, callback) {
		var $this = this;

		if (event && !$.isString(event)) {
			$.Each(event, function (type, fn) {
				$this.off(type, selector, fn);
			});

			return $this;
		}

		if (!$.isString(selector) && !$.isFunction(callback) && callback !== false) {
			callback = selector;
			selector = undefined;
		}

		if (callback === false) {
			callback = returnFalse;
		}

		return $this.each(function () {
			$.Yaex.Event.remove(this, event, callback, selector);
		});
	};

	$.fn.trigger = function (event, args) {
		if ($.isString(event) || $.isPlainObject(event)) {
			event = $.Event(event);
		} else {
			event = compatible(event);
		}

		event._args = args;

		return this.each(function () {
			// items in the collection might not be DOM elements
			if ('dispatchEvent' in this) {
				this.dispatchEvent(event);
			} else {
				$(this).triggerHandler(event, args);
			}
		});
	};

	// triggers event handlers on current element just as if an event occurred,
	// doesn't trigger an actual event, doesn't bubble
	$.fn.triggerHandler = function (event, args) {
		var e;
		var result;

		this.each(function (i, element) {
			e = createProxy($.isString(event) ? $.Event(event) : event);
			e._args = args;
			e.target = element;

			$.Each(findHandlers(element, event.type || event), function (i, handler) {
				result = handler.proxy(e);

				if (e.isImmediatePropagationStopped()) {
					return false
				}
			});
		});

		return result;
	};

	// shortcut methods for `.bind(event, fn)` for each event type
	('focusin focusout load resize scroll unload click dblclick ' +
		'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave ' +
		'change select submit keydown keypress keyup error contextmenu wheel').split(' ').forEach(function (event) {
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

	// Generate extended `remove` and `empty` functions
	['remove', 'empty'].forEach(function (method) {
		var origFn = $.fn[method];

		$.fn[method] = function () {
			var elements = this.find('*');

			if (method === 'remove') {
				elements = elements.add(this);
			}

			elements.forEach(function (elem) {
				$.Yaex.Event.remove(elem);
			});

			return origFn.call(this);
		};
	});

	$.Event = function (type, props) {
		if (!$.isString(type)) {
			props = type;
			type = props.type;
		}

		var event = document.createEvent(specialEvents[type] || 'Events');

		var bubbles = true;

		if (props) {
			for (var name in props) {
				(name == 'bubbles') ? (bubbles = !! props[name]) : (event[name] = props[name]);
			}
		}

		event.initEvent(type, bubbles, true);

		return compatible(event);
	};
})(Yaex)
