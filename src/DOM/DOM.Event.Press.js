/**
 * DOM.Press - Cross browser press event implementation using Yaex.DOM's API
 *
 *
 * @depends: Yaex.js | Core, DOM, Selector, Event
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	// Yaex.UserAgent.Features.Touch = !(typeof window.ontouchstart === 'undefined');

	var ghostsLifeTime = 1000;

	var normalizeArgs = function (args) {
		var callback,
			selector;

		if (Yaex.Global.isFunction(args[0])) {
			callback = args[0];
		} else {
			selector = args[0];
			callback = args[1];
		}

		return [selector, callback];
	};

	if (Yaex.UserAgent.Features.Touch) {
		var ghosts = [],
			callbacks = [],
			handlers = [],
			doc = Yaex.DOM(document);

		var removeGhosts = function () {
			ghosts.splice(0, 2);
		};

		var handleGhosts = function (e) {
			for (var i = 0, l = ghosts.length; i < l; i += 2) {
				if (Math.abs(e.pageX - ghosts[i]) < 25 && Math.abs(e.pageY - ghosts[i + 1]) < 25) {
					e.stopPropagation();
					e.preventDefault();
				}
			}
		};

		doc.on('click', handleGhosts);

		Yaex.DOM.Function.onpress = function () {
			// Passing empty selectors, empty arguments list or a document node cause bugs on android/iOS
			// Just to be on the safe side allowing only element and document fragment nodes to be used
			if (!arguments.length || !this.length || !this[0].nodeType || (this[0].nodeType !== 1 && this[0].nodeType !== 11)) {
				return;
			}

			var touches = [],
				that = this;

			var args = normalizeArgs(arguments);

			var handleTouchStart = function (e) {
				e.stopPropagation();
				var coords = e.touches ? e.touches[0] : e; // Android weirdness fix

				touches[0] = coords.pageX;
				touches[1] = coords.pageY;

				doc.on('touchmove.onpress', handleTouchMove);

				args[0] ? that.on('touchend.onpress', args[0], handleTouchEnd) : that.on('touchend.onpress', handleTouchEnd);
			};

			var handleTouchMove = function (e) {
				if (Math.abs(e.touches[0].pageX - touches[0]) > 10 || Math.abs(e.touches[0].pageY - touches[1]) > 10) {
					resetHandlers();
				}
			};

			var handleTouchEnd = function (e) {
				resetHandlers();

				args[1].call(this, e);

				if (e.type === 'touchend') {
					ghosts.push(touches[0], touches[1]);
					window.setTimeout(removeGhosts, ghostsLifeTime);
				}
			};

			var resetHandlers = function () {
				doc.off('touchmove.onpress', handleTouchMove);
				args[0] ? that.off('touchend.onpress', args[0], handleTouchEnd) : that.off('touchend.onpress', handleTouchEnd);
			};

			callbacks.push(args[1]);

			handlers.push(handleTouchStart);

			if (args[0]) {
				this.on('touchstart.onpress', args[0], handleTouchStart);
				// this.on('click', args[0], handleTouchStart);
				this.on('press.onpress', args[0], args[1]);
			} else {
				this.on('touchstart.onpress', handleTouchStart);
				// this.on('click', handleTouchStart);
				this.on('press.onpress', args[1]);
			}
		};

		Yaex.DOM.Function.offpress = function () {
			var args = normalizeArgs(arguments),
				i;

			if (args[1]) {
				i = callbacks.indexOf(args[1]);

				if (i < 0) { // Something went terribly wrong and there is no associated callback/handler
					return;
				}

				if (args[0]) {
					this.off('touchstart.onpress', args[0], handlers[i]);
					//this.off('click.onpress', args[0], handlers[i]);
					this.off('press.onpress', args[0], args[1]);
				} else {
					this.off('touchstart.onpress', handlers[i]);
					//this.off('click.onpress', handlers[i]);
					this.off('press.onpress', args[1]);
				}
				callbacks.splice(i, 1);
				handlers.splice(i, 1);
			} else {
				if (args[0]) {
					this.off('touchstart.onpress', args[0]);
					//this.off('click.onpress', args[0]);
					this.off('press.onpress', args[0]);
				} else {
					this.off('touchstart.onpress');
					//this.off('click.onpress');
					this.off('press.onpress');
				}
			}
		}
	} else {
		Yaex.DOM.Function.onpress = function () {
			var args = normalizeArgs(arguments);
			if (args[0]) {
				this.on('click.onpress', args[0], args[1]);
				this.on('press.onpress', args[0], args[1]);
			} else {
				this.on('click.onpress', args[1]);
				this.on('press.onpress', args[1]);
			}
		};
		Yaex.DOM.Function.offpress = function () {
			var args = normalizeArgs(arguments);
			args[0] ? this.off('.onpress', args[0], args[1]) : this.off('.onpress', args[1]);
		};
	}

	//---

})(Yaex.DOM);

//---
