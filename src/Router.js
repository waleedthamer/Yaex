/**
 * Router - Cross browser hash router implementation using Yaex's API
 *
 *
 * @depends: Yaex.js | Core, Event, Extra, HashChange
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function ($) {
	'use strict';

	// Routes array
	var Routes = [];

	var location = $.location;

	var DefaultOptions = {
		DefaultPath: '/',
		Before: $.noop,
		On: $.noop,
		NotFound: $.noop
	}; // END OF DefaultOptions CLASS

	var Router = {
		current: null,
		previous: null,
		config: function (options) {
			for (var option in options) {
				if (options.hasOwnProperty(option)) {
					DefaultOptions[option] = options[option];
				} // END if
			} // END for

			return Router;
		},
		add: function (path, name, fn) {
			if (path && name) {
				if ($.isFunction(name)) {
					fn = name;
					name = null;
				} // END if

				Routes.push({
					path: path,
					name: name,
					fn: fn || function () {}
				});
			} // END if

			return Router;
		},
		go: function (path) {
			location.hash = path;

			return Router;
		},
		back: function (path) {
			// Only 1-step back
			if (Router.previous) {
				history.back();
				Router.previous = null;
				// Fallback if can't go back
			} else if (path) {

				location.hash = path;
			} // END if

			return Router;
		}
	}; // END OF Router CLASS

	var HashChange = function () {
		var hash = location.hash.slice(1);
		var found = false;
		var current = Router.current;

		if (!hash) {
			hash = DefaultOptions.DefaultPath;
		} // END if

		if (current && current != Router.previous) {
			Router.previous = current;
		} // END if

		Router.current = hash;

		for (var x = 0, l = Routes.length; x < l && !found; x++) {
			var route = Routes[x];
			var path = route.path;
			var name = route.name;
			var fn = route.fn;

			if (typeof path == 'string') {

				if (path.toLowerCase() == hash.toLowerCase()) {

					DefaultOptions.Before.call(Router, path, name);
					fn.call(Router);
					DefaultOptions.On.call(Router, path, name);
					found = true;
				} // END if
				// regex
			} else {
				var matches = hash.match(path);

				if (matches) {

					DefaultOptions.Before.call(Router, path, name, matches);
					fn.apply(Router, matches);
					DefaultOptions.On.call(Router, path, name, matches);
					found = true;
				} // END if
			} // END if
		} // END for

		if (!found) {
			DefaultOptions.NotFound.call(Router);
		} // END if

		return Router;
	}; // END OF HashChange FUNCTION

	Router.init = function () {
		// window.addEventListener('hashchange', HashChange);

		$(window).hashchange(HashChange);

		return HashChange();
	}; // END OF init FUNCTION

	Router.reload = HashChange();

	// Assign the Router class to Window global for external use
	// window.router = Router;

	// Assign the Router class to Yaex's global
	$.router = Router;
	// })(Yaex, window, document)
})(Yaex)
