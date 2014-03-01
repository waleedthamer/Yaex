/**
 * Assets - Clear iOS <IMG> implementation using Yaex.DOM's API [DOM]
 *
 *
 * @depends: Yaex.js | Core, DOM
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {
	
	'use strict';

	var cache = new Array;
	var timeout;

	Yaex.DOM.Function.remove = function () {
		return this.each(function () {
			if (this.parentNode) {
				if (this.tagName === 'IMG') {
					cache.push(this);

					this.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

					if (timeout) {
						clearTimeout(timeout);
					}

					timeout = setTimeout(function () {
						cache = [];
					}, 60000);
				}
				
				this.parentNode.removeChild(this);
			}
		});
	};

	//---

})(Yaex.DOM);

//---
