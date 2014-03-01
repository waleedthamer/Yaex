/**
 * Deferred - Deferred implementation using Yaex's API [CORE]
 *
 *
 * @depends: Yaex.js | Core
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	var slice = Array.prototype.slice;

	function Deferred(callback) {
		var tuples = [
			// action, add listener, listener list, final state
			['resolve', 'done', Yaex.Callbacks({
				once: 1,
				memory: 1
			}), 'resolved'],
			['reject', 'fail', Yaex.Callbacks({
				once: 1,
				memory: 1
			}), 'rejected'],
			['notify', 'progress', Yaex.Callbacks({
				memory: 1
			})]
		];

		var state = 'pending';

		var promise = {
			state: function () {
				return state;
			},

			always: function () {
				deferred.done(arguments).fail(arguments);
				return this;
			},

			then: function ( /* fnDone [, fnFailed [, fnProgress]] */ ) {
				var fns = arguments;

				return Deferred(function (defer) {
					Yaex.Each(tuples, function (i, tuple) {
						var fn = Yaex.Global.isFunction(fns[i]) && fns[i];
						deferred[tuple[1]](function () {
							var returned = fn && fn.apply(this, arguments);
							if (returned && Yaex.Global.isFunction(returned.promise)) {
								returned.promise()
									.done(defer.resolve)
									.fail(defer.reject)
									.progress(defer.notify);
							} else {
								var context = this === promise ? defer.promise() : this,
									values = fn ? [returned] : arguments;
								defer[tuple[0] + 'With'](context, values);
							}
						});
					});

					fns = null;

				}).promise();
			},

			promise: function (obj) {
				return obj !== null ? Yaex.Extend(obj, promise) : promise;
			}
		};

		var deferred = new Object;

		Yaex.Each(tuples, function (i, tuple) {
			var list = tuple[2],
				stateString = tuple[3];

			promise[tuple[1]] = list.add;

			if (stateString) {
				list.add(function () {
					state = stateString;
				}, tuples[i ^ 1][2].disable, tuples[2][2].lock);
			}

			deferred[tuple[0]] = function () {
				deferred[tuple[0] + 'With'](this === deferred ? promise : this, arguments);
				return this;
			};
			deferred[tuple[0] + 'With'] = list.fireWith;
		});

		promise.promise(deferred);

		if (callback) {
			callback.call(deferred, deferred);
		}

		return deferred;
	}

	//---

	Yaex.Global.When = function (sub) {
		var resolveValues = slice.call(arguments);
		var len = resolveValues.length;
		var i = 0;
		var remain = len !== 1 || (sub && Yaex.Global.isFunction(sub.promise)) ? len : 0;
		var deferred = remain === 1 ? sub : Deferred();
		var progressValues, progressContexts, resolveContexts;
		var updateFn = function (i, ctx, val) {
			return function (value) {
				ctx[i] = this;
				val[i] = arguments.length > 1 ? slice.call(arguments) : value;
				if (val === progressValues) {
					deferred.notifyWith(ctx, val);
				} else if (!(--remain)) {
					deferred.resolveWith(ctx, val);
				}
			};
		};

		if (len > 1) {
			progressValues = new Array(len);
			progressContexts = new Array(len);
			resolveContexts = new Array(len);
			for (; i < len; ++i) {
				if (resolveValues[i] && Yaex.Global.isFunction(resolveValues[i].promise)) {
					resolveValues[i].promise()
						.done(updateFn(i, resolveContexts, resolveValues))
						.fail(deferred.reject)
						.progress(updateFn(i, progressContexts, progressValues));
				} else {
					--remain;
				}
			}
		}

		if (!remain) {
			deferred.resolveWith(resolveContexts, resolveValues);
		}

		return deferred.promise();
	};

	Yaex.Global.Deferred = Deferred;

	//---

})(Yaex);

//---
