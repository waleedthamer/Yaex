/**
 * InternetExplorer - Microsoft's Internet Explorer fix/support using Yaex's API [Support]
 *
 *
 * @depends: Yaex.js | Core
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function (window, undefined) {

	// __proto__ doesn't exist on IE<11, so redefine
	// the X function to use object extension instead
	if (!('__proto__' in {})) {
		Yaex.Extend(Yaex.DOM, {
			Y: function (dom, selector) {
				dom = dom || [];
				Yaex.Extend(dom, Yaex.DOM.Function);
				dom.selector = selector || '';
				dom._Y_ = true;
				dom.uid = 'YAEX' + Yaex.Now;
				return dom;
			},

			// This is a kludge but works
			isY: function (object) {
				return Yaex.Global.Type(object) === 'array' && '_Y_' in object;
			}
		});
	}

	// getComputedStyle shouldn't freak out when called
	// without a valid element as argument
	try {
		getComputedStyle(undefined);
	} catch (e) {
		var nativeGetComputedStyle = getComputedStyle;
		window.getComputedStyle = function (element) {
			try {
				return nativeGetComputedStyle(element);
			} catch (e) {
				return null;
			}
		};
	}

})(this);

//---

