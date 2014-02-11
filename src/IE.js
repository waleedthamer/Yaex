+(function (window, undefined) {
	// __proto__ doesn't exist on IE<11, so redefine
	// the X function to use object extension instead
	if (!('__proto__' in {})) {
		$.Extend({
			Y: function (dom, selector) {
				dom = dom || [];
				$.Extend(dom, $.fn);
				dom.selector = selector || '';
				dom.__Y = true;
				return dom;
			},
			// this is a kludge but works
			isYaex: function (object) {
				return $.type(object) === 'array' && '__Y' in object;
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
})(this)
