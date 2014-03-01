/**
 * Cordova - Apache's Cordova support using Yaex's API [Support]
 *
 *
 * @depends: Yaex.js | Core, DOM, Selector, Event
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function () {

	'use strict';

	window.cordova = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

	if (window.cordova === false) {
		Yaex.DOM(function () {
			Yaex.DOM(document).trigger('deviceready');
		});
	}

})(Yaex.DOM);

//---
