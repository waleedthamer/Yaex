+(function ($) {
	'use strict';
	var jsonpID = 0;
	var document = window.document;
	var key;
	var name;
	var rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	var scriptTypeRE = /^(?:text|application)\/javascript/i;
	var xmlTypeRE = /^(?:text|application)\/xml/i;
	var jsonType = 'application/json';
	var htmlType = 'text/html';
	var blankRE = /^\s*$/;
	var _load = $.fn.load;

	// trigger a custom event and return false if it was cancelled

	function triggerAndReturn(context, eventName, data) {
		var event = $.Event(eventName);

		$(context).trigger(event, data);

		return !event.defaultPrevented;
	}

	// trigger an Ajax "global" event

	function triggerGlobal(settings, context, eventName, data) {
		if (settings.global) {
			return triggerAndReturn(context || document, eventName, data);
		}
	}

	// Number of active Ajax requests
	$.active = 0;

	function ajaxStart(settings) {
		if (settings.global && $.active++ === 0) {
			triggerGlobal(settings, null, 'ajaxStart');
		}
	}

	function ajaxStop(settings) {
		if (settings.global && !(--$.active)) {
			triggerGlobal(settings, null, 'ajaxStop');
		}
	}

	// triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable

	function ajaxBeforeSend(xhr, settings) {
		var context = settings.context;

		if (settings.beforeSend.call(context, xhr, settings) === false || triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false) {
			return false;
		}

		triggerGlobal(settings, context, 'ajaxSend', [xhr, settings]);
	}

	function ajaxSuccess(data, xhr, settings, deferred) {
		var context = settings.context;
		var status = 'success';

		settings.success.call(context, data, status, xhr);
		if (deferred) deferred.resolveWith(context, [data, status, xhr]);
		triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data]);

		ajaxComplete(status, xhr, settings);
	}

	// type: "timeout", "error", "abort", "parsererror"

	function ajaxError(error, type, xhr, settings, deferred) {
		var context = settings.context;

		settings.error.call(context, xhr, type, error);
		if (deferred) deferred.rejectWith(context, [xhr, type, error]);
		triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error]);

		ajaxComplete(type, xhr, settings);
	}

	// status: "success", "notmodified", "error", "timeout", "abort", "parsererror"

	function ajaxComplete(status, xhr, settings) {
		var context = settings.context;

		settings.complete.call(context, xhr, status);
		triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings]);

		ajaxStop(settings);
	}

	// Empty function, used as default callback

	function empty() {}

	$.ajaxJSONP = function (options, deferred) {
		if (!('type' in options)) {
			return $.ajax(options);
		}

		//var callbackName = 'jsonp' + (++jsonpID);
		var _callbackName = options.jsonpCallback;

		var callbackName = ($.isFunction(_callbackName) ? _callbackName() : _callbackName) || ('jsonp' + (++jsonpID));

		var script = document.createElement('script');

		var originalCallback = window[callbackName];

		var responseData;

		var abort = function (errorType) {
			$(script).triggerHandler('error', errorType || 'abort')
		};

		var xhr = {
			abort: abort
		};

		var abortTimeout;

		if (deferred) deferred.promise(xhr);

		// console.log($(script));

		// $(script).on('load error', function(e, errorType) {
		$(script).on('load error', function (e, errorType) {
			clearTimeout(abortTimeout);
			// $(script).off().remove();
			$(script).off('load error');
			$(script).remove();

			if (e.type == 'error' || !responseData) {
				ajaxError(null, errorType || 'error', xhr, options, deferred);
			} else {
				ajaxSuccess(responseData[0], xhr, options, deferred)
			}

			window[callbackName] = function (data) {
				// cleanup();
				ajaxSuccess(data, xhr, options);
			};

			originalCallback = responseData = undefined;
		});

		if (ajaxBeforeSend(xhr, options) === false) {
			abort('abort');
			return xhr;
		}

		window[callbackName] = function () {
			responseData = arguments;
		};

		script.onerror = function () {
			abort('error');
		};

		script.src = options.url.replace(/=\?/, '=' + callbackName);
		document.head.appendChild(script);

		if (options.timeout > 0) {
			abortTimeout = setTimeout(function () {
				abort('timeout');
			}, options.timeout);
		}

		return xhr;
	};

	/*
	 * Retrieves the value of a cookie by the given key.
	 *
	 * @param key, (string) Name of the cookie to retrieve.
	 * @return (string) Value of the given key or null.
	 **/

	function getCookie(key) {
		var result = (
			new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)')
		).exec(document.cookie);

		return result ? result[1] : null;
	}

	/*
	 * Checks if our host matches the request's host.
	 *
	 * @param url, (string) URL of request.
	 * @return (boolean) Request is to origin.
	 **/

	function sameOrigin(url) {
		// Url could be relative or scheme relative or absolute
		var sr_origin = '//' + document.location.host,
			origin = document.location.protocol + sr_origin;

		// Allow absolute or scheme relative URLs to same origin
		return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
			(url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
		// or any other URL that isn't scheme relative or absolute i.e relative.
		!(/^(\/\/|http:|https:).*/.test(url));
	}

	$.ajaxSettings = {
		// Default type of request
		type: 'GET',
		// Callback that is executed before request
		beforeSend: empty,
		// Callback that is executed if the request succeeds
		success: empty,
		// Callback that is executed the the server drops error
		error: empty,
		// Callback that is executed on request complete (both: error and success)
		complete: empty,
		// The context for the callbacks
		context: null,
		// Whether to trigger "global" Ajax events
		global: true,
		// Transport
		xhr: function () {
			return new window.XMLHttpRequest();
		},
		// MIME types mapping
		accepts: {
			script: 'text/javascript, application/javascript, application/x-javascript',
			json: jsonType,
			xml: 'application/xml, text/xml',
			html: htmlType,
			text: 'text/plain'
		},
		// Whether the request is to another domain
		crossDomain: false,
		// Default timeout
		timeout: 0,
		// Whether data should be serialized to string
		processData: true,
		// Whether the browser should be allowed to cache GET responses
		cache: true
	};

	function mimeToDataType(mime) {
		if (mime) {
			mime = mime.split(';', 2)[0];
		}
		return mime && (mime === htmlType ? 'html' :
			mime === jsonType ? 'json' :
			scriptTypeRE.test(mime) ? 'script' :
			xmlTypeRE.test(mime) && 'xml') || 'text';
	}

	function appendQuery(url, query) {
		// console.log(query);
		return (url + '&' + query).replace(/[&?]{1,2}/, '?');
	}

	// serialize payload and append it to the URL for GET requests

	function serializeData(options) {
		if (options.processData && options.data && $.type(options.data) !== "string") {
			options.data = $.param(options.data, options.traditional);
		}

		if (options.data && (!options.type || options.type.toUpperCase() === 'GET')) {
			options.url = appendQuery(options.url, options.data);
			options.data = undefined;
		}
	}

	$.ajax = function (options) {
		var settings = $.Extend({}, options || {});
		var deferred = $.Deferred && $.Deferred();

		for (key in $.ajaxSettings) {
			if (settings[key] === undefined) {
				settings[key] = $.ajaxSettings[key];
			}
		}

		ajaxStart(settings);

		if (!settings.crossDomain) {
			settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 !== window.location.host;
		}

		if (!settings.url) {
			settings.url = window.location.toString();
		}

		serializeData(settings);

		if (settings.cache === false) {
			settings.url = appendQuery(settings.url, '_=' + Date.now());
		}

		var dataType = settings.dataType;

		var hasPlaceholder = /=\?/.test(settings.url);

		if (dataType == 'jsonp' || hasPlaceholder) {
			if (!hasPlaceholder) {
				settings.url = appendQuery(settings.url, settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?');
			}

			return $.ajaxJSONP(settings, deferred);
		}

		var mime = settings.accepts[dataType];
		var headers = {};
		var setHeader = function (name, value) {
			headers[name.toLowerCase()] = [name, value]
		};
		var protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;
		var xhr = settings.xhr();
		var nativeSetHeader = xhr.setRequestHeader;
		var abortTimeout;

		if (deferred) deferred.promise(xhr);

		if (!settings.crossDomain) {
			setHeader('X-Requested-With', 'XMLHttpRequest');
		}

		setHeader('Accept', mime || '*/*');

		if (mime = settings.mimeType || mime) {
			if (mime.indexOf(',') > -1) {
				mime = mime.split(',', 2)[0];
			}
			xhr.overrideMimeType && xhr.overrideMimeType(mime);
		}

		if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() !== 'GET')) {
			setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');
		}

		if (settings.headers)
			for (name in settings.headers) setHeader(name, settings.headers[name]);

		xhr.setRequestHeader = setHeader;

		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				xhr.onreadystatechange = empty;
				clearTimeout(abortTimeout);

				var result;
				var error = false;

				if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
					dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'));
					result = xhr.responseText;
					try {
						// http://perfectionkills.com/global-eval-what-are-the-options/
						if (dataType == 'script') {
							(1, eval)(result);
						} else if (dataType == 'xml') {
							result = xhr.responseXML;
						} else if (dataType == 'json') {
							result = blankRE.test(result) ? null : $.parseJSON(result);
							// console.log(result);
						}
					} catch (e) {
						error = e;
					}

					if (error) {
						ajaxError(error, 'parsererror', xhr, settings, deferred);
					} else {
						ajaxSuccess(result, xhr, settings, deferred);
					}
				} else {
					ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred);
				}
			}
		};

		if (ajaxBeforeSend(xhr, settings) === false) {
			xhr.abort();
			ajaxError(null, 'abort', xhr, settings, deferred);
			return xhr;
		}

		if (settings.xhrFields) {
			for (name in settings.xhrFields) {
				xhr[name] = settings.xhrFields[name];
			}
		}

		var async = 'async' in settings ? settings.async : true;

		xhr.open(settings.type, settings.url, async, settings.username, settings.password);

		for (name in headers) {
			nativeSetHeader.apply(xhr, headers[name]);
		}

		if (settings.timeout > 0) {
			abortTimeout = setTimeout(function () {
				xhr.onreadystatechange = empty;
				xhr.abort();
				ajaxError(null, 'timeout', xhr, settings, deferred);
			}, settings.timeout);
		}

		// avoid sending empty string (#319)
		xhr.send(settings.data ? settings.data : null);

		return xhr;
	};

	// handle optional data/success arguments

	function parseArguments(url, data, success, dataType) {
		var hasData = !$.isFunction(data);
		return {
			url: url,
			data: hasData ? data : undefined,
			success: !hasData ? data : $.isFunction(success) ? success : undefined,
			dataType: hasData ? dataType || success : success
		};
	}

	$.get = function () {
		return $.ajax(parseArguments.apply(null, arguments));
	};

	$.post = function () {
		var options = parseArguments.apply(null, arguments);
		options.type = 'POST';
		return $.ajax(options);
	};

	$.getJSON = function () {
		var options = parseArguments.apply(null, arguments);
		options.dataType = 'json';
		return $.ajax(options);
	};

	$.fn.load = function (url, data, success) {
		if (!this.length) {
			return this;
		}

		var self = this;
		var parts = url.split(/\s/);
		var selector;
		var options = parseArguments(url, data, success);
		var callback = options.success;

		if (parts.length > 1) {
			options.url = parts[0];
			selector = parts[1];
		}

		options.success = function (response) {
			self.html(selector ? $('<div>').html(response.replace(rscript, "")).find(selector) : response);
			callback && callback.apply(self, arguments);
		};

		$.ajax(options);

		return this;
	};

	$.fn.load = function (url, params, callback) {
		if (typeof url !== "string" && _load) {
			return _load.apply(this, arguments);
		}

		var selector;
		var type;
		var response
		var self = this;
		var off = url.indexOf(' ');

		if (off >= 0) {
			selector = url.slice(off);
			url = url.slice(0, off);
		}

		// If it's a function
		if ($.isFunction(params)) {
			// We assume that it's the callback
			callback = params;
			params = undefined;

			// Otherwise, build a param string
		} else if (params && $.isObject(params)) {
			type = 'POST';
		}

		// If we have elements to modify, make the request
		if (self.length > 0) {
			$.ajax({
				url: url,
				// if "type" variable is undefined, then "GET" method will be used
				type: type,
				dataType: htmlType,
				data: params
			}).success(function (responseText) {

				// Save response for use in complete callback
				response = arguments;

				self.html(selector ?
					// If a selector was specified, locate the right elements in a dummy div
					// Exclude scripts to avoid IE 'Permission Denied' errors
					$('<div>').append($.ParseHTML(responseText)).find(selector) :
					// Otherwise use the full result
					responseText);

			}).complete(callback && function (jqXHR, status) {
				self.each(callback, response || [jqXHR.responseText, status, jqXHR]);
			});
		}

		return this;
	}

	$.JSON_Stringify = function (object, level) {
		var result = '';
		var i;

		level = level === undefined ? 1 : level;

		var type = typeof object;

		switch (type) {
		case 'function':
			result += object;
			break;
		case 'boolean':
			result += object ? 'true' : 'false';
			break;
		case 'object':
			if (object === null) {
				result += 'null';
			} else if (object instanceof Array) {
				result += '[';
				var len = object.length;
				for (i = 0; i < len - 1; ++i) {
					result += $.JSON_Stringify(object[i], level + 1);
				}
				result += $.JSON_Stringify(object[len - 1], level + 1) + ']';
			} else {
				result += '{';
				for (var property in object) {
					if (object.hasOwnProperty(property)) {
						result += '"' + property + '":' +
							$.JSON_Stringify(object[property], level + 1);
					}
				}
				result += '}';
			}
			break;
		case 'string':
			var str = object;
			var repl = {
				'\\\\': '\\\\',
				'"': '\\"',
				'/': '\\/',
				'\\n': '\\n',
				'\\r': '\\r',
				'\\t': '\\t'
			};
			for (i in repl) {
				if (repl.hasOwnProperty(i)) {
					str = str.replace(new RegExp(i, 'g'), repl[i]);
				}
			}
			result += '"' + str + '"';
			break;
		case 'number':
			result += String(object);
			break;
		}

		result += (level > 1 ? ',' : '');

		// Quick hacks below
		if (level === 1) {
			// fix last comma
			result = result.replace(/,([\]}])/g, '$1');
		}

		// Fix comma before array or object
		return result.replace(/([\[{]),/g, '$1');
	};

	var escape = encodeURIComponent;

	function serialize(params, obj, traditional, scope) {
		var type, array = $.isArray(obj);
		$.each(obj, function (key, value) {
			type = $.type(value);

			if (scope) {
				key = traditional ? scope : scope + '[' + (array ? '' : key) + ']';
			}

			// handle data in serializeArray() format
			if (!scope && array) {
				params.add(value.name, value.value);
			}

			// recurse into nested objects
			else if (type === "array" || (!traditional && type === "object")) {
				serialize(params, value, traditional, key);
			} else {
				params.add(key, value);
			}
		});
	}

	$.param = function (obj, traditional) {
		var params = [];
		params.add = function (k, v) {
			this.push(escape(k) + '=' + escape(v));
		};
		serialize(params, obj, traditional);
		return params.join('&').replace(/%20/g, '+');
	};

	/**
	 * Extend Yaex's AJAX beforeSend method by setting an X-CSRFToken on any
	 * 'unsafe' request methods.
	 **/
	$.Extend($.ajaxSettings, {
		beforeSend: function (xhr, settings) {
			// console.log(settings);
			if (!(/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type)) && sameOrigin(settings.url)) {
				xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
			}
		}
	});
	
})(Yaex)
