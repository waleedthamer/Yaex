/**
 * Ajax - Ajax implementation using Yaex.DOM's API [DOM]
 *
 *
 * @depends: Yaex.js | Core, DOM, Event, Deferred
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	var jsonpID = 0;
	var document = window.document;
	var key;
	var name;
	var scriptReplacement = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
	var scriptTypeReplacement = /^(?:text|application)\/javascript/i;
	var xmlTypeReplacement = /^(?:text|application)\/xml/i;
	var jsonType = 'application/json';
	var htmlType = 'text/html';
	var blankReplacement = /^\s*$/;

	//---

	// BEGIN OF [Private Functions]

	/**
	 * Empty
	 *
	 * Used as default callback
	 *
	 * @return 	void
	 */

	function Empty() {}

	// Trigger a custom event and return false if it was cancelled

	function triggerAndReturn(context, event, data) {
		var eventName = Yaex.DOM.Event(event);

		Yaex.DOM(context).trigger(eventName, data);

		return !eventName.defaultPrevented;
	}

	// Trigger an Ajax "Global" event

	function triggerGlobal(settings, context, event, data) {
		if (settings.global) {
			return triggerAndReturn(context || document, event, data);
		}
	}

	function ajaxStart(settings) {
		if (settings.global && Yaex.AjaxActive++ === 0) {
			triggerGlobal(settings, null, 'ajaxStart');
		}
	}

	function ajaxStop(settings) {
		if (settings.global && !(--Yaex.AjaxActive)) {
			triggerGlobal(settings, null, 'ajaxStop');
		}
	}

	// Triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable

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

		if (deferred) {
			deferred.resolveWith(context, [data, status, xhr]);
		}

		triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data]);

		ajaxComplete(status, xhr, settings);
	}

	// Type: "timeout", "error", "abort", "parsererror"

	function ajaxError(error, type, xhr, settings, deferred) {
		var context = settings.context;

		settings.error.call(context, xhr, type, error);

		if (deferred) {
			deferred.rejectWith(context, [xhr, type, error]);
		}

		triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error]);

		ajaxComplete(type, xhr, settings);
	}

	// Status: "success", "notmodified", "error", "timeout", "abort", "parsererror"

	function ajaxComplete(status, xhr, settings) {
		var context = settings.context;

		settings.complete.call(context, xhr, status);

		triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings]);

		ajaxStop(settings);
	}

	//---

	/**
	 * Retrieves the value of a cookie by the given key.
	 *
	 * @param key, (string) Name of the cookie to retrieve.
	 * @return (string) Value of the given key or null.
	 */

	function getCookie(key) {
		var result = (
			new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)')
		).exec(document.cookie);

		return result ? result[1] : null;
	}

	/**
	 * Checks if our host matches the request's host.
	 *
	 * @param url, (string) URL of request.
	 * @return (boolean) Request is to origin.
	 */

	function sameOrigin(url) {
		// Url could be relative or scheme relative or absolute
		var sr_origin = '//' + document.location.host;
		var origin = document.location.protocol + sr_origin;

		// Allow absolute or scheme relative URLs to same origin
		return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
			(url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
		// or any other URL that isn't scheme relative or absolute i.e relative.
		!(/^(\/\/|http:|https:).*/.test(url));
	}


	function mimeToDataType(mime) {
		if (mime) {
			mime = mime.split(';', 2)[0];
		}

		return mime && (mime === htmlType ? 'html' :
			mime === jsonType ? 'json' :
			scriptTypeReplacement.test(mime) ? 'script' :
			xmlTypeReplacement.test(mime) && 'xml') || 'text';
	}

	function appendQuery(url, query) {
		return (url + '&' + query).replace(/[&?]{1,2}/, '?');
	}

	// Serialise payload and append it to the URL for GET requests

	function serialiseData(options) {
		if (options.processData && options.data && !Yaex.Global.isString(options.data)) {
			options.data = Yaex.Utility.Parameters(options.data, options.traditional);
		}

		if (options.data && (!options.type || options.type.toUpperCase() === 'GET')) {
			options.url = appendQuery(options.url, options.data);
			options.data = undefined;
		}
	}

	// Handle optional data/success arguments

	function parseArguments(url, data, success, dataType) {
		var hasData = !Yaex.Global.isFunction(data);

		return {
			url: url,
			data: hasData ? data : undefined,
			success: !hasData ? data : Yaex.Global.isFunction(success) ? success : undefined,
			dataType: hasData ? dataType || success : success
		};
	}

	// END OF [Private Functions]

	//---

	Yaex.Utility.Extend(Yaex.DOM, {
		AjaxSettings: {
			// Default type of request
			type: 'GET',
			// Callback that is executed before request
			beforeSend: Empty,
			// Callback that is executed if the request succeeds
			success: Empty,
			// Callback that is executed the the server drops error
			error: Empty,
			// Callback that is executed on request complete (both: error and success)
			complete: Empty,
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
		},
	});

	//---

	Yaex.Utility.Extend(Yaex.DOM, {
		AjaxJSONP: function (options, deferred) {
			if (!('type' in options)) {
				return this.Ajax(options);
			}

			//var callbackName = 'jsonp' + (++jsonpID);
			var _callbackName = options.jsonpCallback;

			var callbackName = (Yaex.Global.isFunction(_callbackName) ? _callbackName() : _callbackName) || ('jsonp' + (++jsonpID));

			var script = document.createElement('script');

			var originalCallback = window[callbackName];

			var responseData;

			var abort = function (errorType) {
				Yaex.DOM(script).triggerHandler('error', errorType || 'abort')
			};

			var xhr = {
				abort: abort
			};

			var abortTimeout;

			if (deferred) {
				deferred.promise(xhr);
			}

			// Yaex.DOM(script).on('load error', function(e, errorType) {
			Yaex.DOM(script).on('load error', function (e, errorType) {
				clearTimeout(abortTimeout);

				Yaex.DOM(script).off('load error');
				Yaex.DOM(script).remove();

				console.log(e);

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
		},

		Ajax: function (options) {
			var settings = Yaex.Utility.simpleExtend({}, options || {});
			var deferred = Yaex.Global.Deferred && Yaex.Global.Deferred();

			for (key in this.AjaxSettings) {
				if (settings[key] === undefined) {
					settings[key] = this.AjaxSettings[key];
				}
			}

			ajaxStart(settings);

			if (!settings.crossDomain) {
				settings.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(settings.url) && RegExp.$2 !== window.location.host;
			}

			if (!settings.url) {
				settings.url = window.location.toString();
			}

			serialiseData(settings);

			if (settings.cache === false) {
				settings.url = appendQuery(settings.url, '_=' + Date.now());
			}

			var dataType = settings.dataType;

			var hasPlaceholder = /\?.+=\?/.test(settings.url);

			if (dataType == 'jsonp' || hasPlaceholder) {
				if (!hasPlaceholder) {
					settings.url = appendQuery(settings.url, settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?');
				}

				return this.AjaxJSONP(settings, deferred);
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

			if (deferred) {
				deferred.promise(xhr);
			}

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

			if (settings.headers) {
				for (name in settings.headers) {
					setHeader(name, settings.headers[name]);
				}
			}

			xhr.setRequestHeader = setHeader;

			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					xhr.onreadystatechange = Empty;

					clearTimeout(abortTimeout);

					var result;

					var error = false;

					if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304 || (xhr.status === 0 && protocol == 'file:')) {
						dataType = dataType || mimeToDataType(xhr.getResponseHeader('content-type'));

						result = xhr.responseText;

						try {
							// http://perfectionkills.com/global-eval-what-are-the-options/
							if (dataType == 'script') {
								(1, eval)(result);
							}

							if (dataType == 'xml') {
								result = xhr.responseXML;
							}

							if (dataType == 'json') {
								result = blankReplacement.test(result) ? null : Yaex.parseJSON(result);
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
					xhr.onreadystatechange = Empty;
					xhr.abort();
					ajaxError(null, 'timeout', xhr, settings, deferred);
				}, settings.timeout);
			}

			// avoid sending Empty string (#319)
			xhr.send(settings.data ? settings.data : null);

			return xhr;
		},

		Get: function () {
			return this.Ajax(parseArguments.apply(null, arguments));
		},

		Post: function () {
			var options = parseArguments.apply(null, arguments);
			options.type = 'POST';
			return this.Ajax(options);
		},

		getJSON: function () {
			var options = parseArguments.apply(null, arguments);
			options.dataType = 'json';
			return this.Ajax(options);
		},

	});

	//---

	Yaex.DOM.Function.load = function (url, data, success) {
		if (!this.length) {
			return this;
		}

		if (Yaex.Global.isWindow(this[0])) {
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
			self.html(selector ? Yaex.DOM('<div>').html(response.replace(scriptReplacement, '')).find(selector) : response);
			callback && callback.apply(self, arguments);
		};

		Yaex.DOM.Ajax(options);

		return this;
	};

	//---

	// Yaex.DOM.Function.load = function (url, data, success) {
	// 	if (!this.length) {
	// 		return this;
	// 	}

	// 	if (Yaex.Global.isWindow(this[0])) {
	// 		return this;
	// 	}

	// 	var self = this;

	// 	var parts = url.split(/\s/);

	// 	var selector;

	// 	var options = parseArguments(url, data, success);

	// 	var callback = options.success;

	// 	if (parts.length > 1) {
	// 		options.url = parts[0];
	// 		selector = parts[1];
	// 	}

	// 	options.success = function (response) {
	// 		self.html(selector ? Yaex.DOM('<div>').html(response.replace(scriptReplacement, '')).find(selector) : response);
	// 		callback && callback.apply(self, arguments);
	// 	};

	// 	Yaex.DOM.Ajax(options);

	// 	return this;
	// };

	//---

	/**
	 * Extend Yaex's AJAX beforeSend method by setting an X-CSRFToken on any
	 * 'unsafe' request methods.
	 **/
	Yaex.Utility.Extend(Yaex.DOM.AjaxSettings, {
		beforeSend: function (xhr, settings) {
			if (!(/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type)) && sameOrigin(settings.url)) {
				xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
			}
		}
	});

	//---

})(Yaex.DOM);

//---
