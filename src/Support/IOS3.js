/**
 * IOS3 - Apple's iOS3 fix/support using Yaex's API [Support]
 *
 *
 * @depends: Yaex.js | Core
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function (undefined) {

	// Fix for iOS 3.2
	if (String.prototype.trim === undefined) {
		String.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/g, '');
		}
	}

	// For iOS 3.x
	// From https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
	if (Array.prototype.reduce === undefined) {
		Array.prototype.reduce = function (callback) {
			if (this === void 0 || this === null) {
				throw new TypeError();
			}

			var t = Object(this),
				len = t.length >>> 0,
				k = 0,
				accumulator;

			if (typeof callback != 'function') throw new TypeError()
			if (len == 0 && arguments.length == 1) throw new TypeError()

			if (arguments.length >= 2) {
				accumulator = arguments[1]
			} else {
				do {
					if (k in t) {
						accumulator = t[k++];
						break;
					}

					if (++k >= len) {
						throw new TypeError();
					}
				} while (true);

				while (k < len) {
					if (k in t) {
						accumulator = callback.call(undefined, accumulator, t[k], k, t);
					}

					k++;
				}
			}

			return accumulator;
		}
	}

})();

//---

