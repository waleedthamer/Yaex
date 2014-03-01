/**
 * Detect - Cross browser detector implementation using Yaex's API [CORE]
 *
 *
 * @depends: Yaex.js | Core []
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

//---

+ ('Yaex', function (window, document, undefined) {
	// 
	'use strict';

	Yaex.Extend({
		UserAgent: {},
	});

	/**
	 * Detect Suite
	 *
	 * Tests the client against a variety of modern browser features. 
	 * These tests are primarily from Mark Pilgrim's "Dive Into HTML5" section 
	 * "The All-In-One Almost-Alphabetical No-Bullshit Guide to Detecting Everything."
	 *
	 * You can find "Dive Into HTML5" here: http://www.diveintohtml5.net/
	 *
	 * "Dive Into HTML5" is protected by (CC BY 3.0):
	 * http://creativecommons.org/licenses/by/3.0/
	 */

	/**
	 * testInput
	 *
	 * Detects the user agent.
	 *
	 * @param 	Mix object Variable to check
	 * @return 	boolean TRUE|FALSE Whether or not the client supports a given feature.
	 */
	function testInput(type) {
		var _tmp_ = document.createElement('input');

		_tmp_.setAttribute('type', type);

		return _tmp_.type !== 'text';
	}

	//---

	var retina = 'devicePixelRatio' in window && window.devicePixelRatio > 1;

	if (!retina && 'matchMedia' in window) {
		// var matches = window.matchMedia('(min-resolution:144dpi)');
		var matches = window.matchMedia('(min-resolution:144dppx)');
		retina = matches && matches.matches;
	}

	var ua = navigator.userAgent.toLowerCase();

	var phantomjs = ua.indexOf('phantom') !== -1;

	var msPointer = navigator.msPointerEnabled && navigator.msMaxTouchPoints && !window.PointerEvent;

	var pointer = (window.PointerEvent && navigator.pointerEnabled && navigator.maxTouchPoints) || msPointer;

	//---

	/**
	 * Detect
	 *
	 * Detects the user agent
	 *
	 * @param 	string useragent The user agent string
	 * @return 	void
	 */
	function Detect(useragent) {
		var OS = this.OS = {};
		var Browser = this.Browser = {};

		var platform = useragent.match(/Linux/) || 
			useragent.match(/Windows/) || 
			useragent.match(/iOS/) || 
			useragent.match(/Android/) || 
			'Unknown';

		var webkit = useragent.match(/Web[kK]it[\/]{0,1}([\d.]+)/);
		var gecko = useragent.match(/Gecko[\/]{0,1}([\d.]+)/);
		var android = useragent.match(/(Android);?[\s\/]+([\d.]+)?/);
		var ipad = useragent.match(/(iPad).*OS\s([\d_]+)/);
		var ipod = useragent.match(/(iPod)(.*OS\s([\d_]+))?/);
		var iphone = !ipad && useragent.match(/(iPhone\sOS)\s([\d_]+)/);
		var webos = useragent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/);
		var touchpad = webos && useragent.match(/TouchPad/);
		var kindle = useragent.match(/Kindle\/([\d.]+)/);
		var silk = useragent.match(/Silk\/([\d._]+)/);
		var blackberry = useragent.match(/(BlackBerry).*Version\/([\d.]+)/);
		var bb10 = useragent.match(/(BB10).*Version\/([\d.]+)/);
		var rimtabletos = useragent.match(/(RIM\sTablet\sOS)\s([\d.]+)/);
		var playbook = useragent.match(/PlayBook/);
		var chrome = useragent.match(/Chrome\/([\d.]+)/) || useragent.match(/CriOS\/([\d.]+)/);
		var firefox = useragent.match(/Firefox\/([\d.]+)/);
		var ie = useragent.match(/MSIE ([\d.]+)/);
		var safari = webkit && useragent.match(/Mobile\//) && !chrome;
		var webview = useragent.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/) && !chrome;

		ie = useragent.match(/MSIE\s([\d.]+)/);

		// TODO: clean this up with a better OS/Browser separation:
		// - discern (more) between multiple browsers on android
		// - decide if kindle fire in silk mode is android or not
		// - Firefox on Android doesn't specify the Android version
		// - possibly divide in OS, device and Browser hashes

		if (Browser.Webkit = !! webkit) {
			Browser.Version = webkit[1];
		}

		if (Browser.Gecko = !! gecko) {
			Browser.Version = gecko[1];
		}

		if (android) {
			OS.Android = true;
			OS.Version = android[2];
		}

		if (iphone && !ipod) {
			OS.iOS = OS.iPhone = true;
			OS.Version = iphone[2].replace(/_/g, '.');
		}

		if (ipad) {
			OS.iOS = OS.iPad = true;
			OS.Version = ipad[2].replace(/_/g, '.');
		}

		if (ipod) {
			OS.iOS = OS.iPod = true;
			OS.Version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
		}

		if (webos) {
			OS.webOS = true;
			OS.Version = webos[2];
		}

		if (touchpad) {
			OS.Touchpad = true;
		}

		if (blackberry) {
			OS.Blackberry = true;
			OS.Version = blackberry[2];
		}

		if (bb10) {
			OS.BB10 = true;
			OS.Version = bb10[2];
		}

		if (rimtabletos) {
			OS.Rimtabletos = true;
			OS.Version = rimtabletos[2];
		}

		if (playbook) {
			Browser.Playbook = true;
		}

		if (kindle) {
			OS.Kindle = true;
			OS.Version = kindle[1];
		}

		if (silk) {
			Browser.Silk = true;
			Browser.Version = silk[1];
		}

		if (!silk && OS.Android && useragent.match(/Kindle Fire/)) {
			Browser.Silk = true;
		}

		if (chrome) {
			Browser.Chrome = true;
			Browser.Version = chrome[1];
		}

		if (firefox) {
			Browser.Firefox = true;
			Browser.Version = firefox[1];
		}

		if (ie) {
			Browser.IE = true;
			Browser.Version = ie[1];
		}

		if (safari && (useragent.match(/Safari/) || !! OS.iOS)) {
			Browser.Safari = true;
		}

		if (webview) {
			Browser.WebView = true;
		}

		if (ie) {
			Browser.IE = true;
			Browser.Version = ie[1];
		}

		OS.Tablet = !! (ipad || playbook || (android && !useragent.match(/Mobile/)) || (firefox && useragent.match(/Tablet/)) || (ie && !useragent.match(/Phone/) && useragent.match(/Touch/)));
		OS.Phone = !! (!OS.Tablet && !OS.iPod && (android || iphone || webos || blackberry || bb10 || (chrome && useragent.match(/Android/)) || (chrome && useragent.match(/CriOS\/([\d.]+)/)) || (firefox && useragent.match(/Mobile/)) || (ie && useragent.match(/Touch/))));
		OS.Desktop = !! Browser.IE || Browser.Firefox || Browser.Safari || Browser.Chrome;

		OS.Platform = platform[0];
	}

	Detect.call(Yaex.UserAgent, navigator.userAgent);

	Yaex.Extend(Yaex.UserAgent, {
		Features: {
			// Elements
			Audio: !! document.createElement('audio').canPlayType,
			Canvas: !! document.createElement('canvas').getContext,
			Command: 'type' in document.createElement('command'),
			Time: 'valueAsDate' in document.createElement('time'),
			Video: !! document.createElement('video').canPlayType,

			// Features and Attributes
			Offline: navigator.hasOwnProperty('onLine') && navigator.onLine,
			ApplicationCache: !! window.applicationCache,
			ContentEditable: 'isContentEditable' in document.createElement('span'),
			DragDrop: 'draggable' in document.createElement('span'),
			Geolocation: !! navigator.geolocation,
			History: !! (window.history && window.history.pushState),
			WebSockets: !! window.WebSocket,
			WebWorkers: !! window.Worker,
			Retina: retina,
			Pointer: Yaex.Global.isUndefined(pointer) ? false : pointer,
			MicrosoftPointer: Yaex.Global.isUndefined(msPointer) ? false : msPointer,


			// Forms
			Autofocus: 'autofocus' in document.createElement('input'),
			InputPlaceholder: 'placeholder' in document.createElement('input'),
			TextareaPlaceholder: 'placeholder' in document.createElement('textarea'),
			InputTypeEmail: testInput('email'),
			InputTypeNumber: testInput('number'),
			InputTypeSearch: testInput('search'),
			InputTypeTel: testInput('tel'),
			InputTypeUrl: testInput('url'),

			// Storage
			IndexDB: !! window.indexedDB,
			LocalStorage: 'localStorage' in window && window['localStorage'] !== null,
			WebSQL: !! window.openDatabase,

			// Touch and orientation capabilities.
			Orientation: 'orientation' in window,
			Touch: 'ontouchend' in document,
			ScrollTop: ('pageXOffset' in window || 'scrollTop' in document.documentElement) && !Yaex.UserAgent.OS.webOS,

			// Propietary features
			Standalone: 'standalone' in window.navigator && window.navigator.standalone
		}
	});

	// Return (boolean) of likely client device classifications.
	// Yaex.Extend(Yaex.UserAgent, {
	// 	Type: {
	// 		Mobile: (screen.width < 768),
	// 		Tablet: (screen.width >= 768 && Yaex.UserAgent.Features.Orientation),
	// 		Desktop: (screen.width >= 800 && !Yaex.UserAgent.Features.Orientation)
	// 	}
	// });
	
})(window, document);

//---
