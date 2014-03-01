/**
 * Global - Global Yaex's functions and shortcuts [CORE]
 *
 *
 * @depends: Yaex.js | Core
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function (window, document, undefined) {

	'use strict';

	//---

	// Shortcuts global functions

	// Number of active Ajax requests
	Yaex.AjaxActive = 0;

	//---

	/**
	 * Yaex.Global.Options
	 */
	Yaex.Global.Options = {
		CoreAllowAjax: true,
		CoreAllowDeferred: true,
		CoreAllowCallbacks: true,
		CoreAllowEvents: true,
	};

	//---

})(window, document);

//---