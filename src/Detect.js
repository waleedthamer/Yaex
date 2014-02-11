+(function ($) {
	'use strict';

	/*
	 * Detect Suite
	 *
	 * Tests the client against a variety of modern browser features.
	 * These tests are primarily from Mark Pilgrim's "Dive Into HTML5" section
	 * "The All-In-One Almost-Alphabetical No-Bullshit Guide to Detecting
	 * Everything."
	 *
	 * You can find "Dive Into HTML5" here: http://www.diveintohtml5.net/
	 *
	 * "Dive Into HTML5" is protected by (CC BY 3.0):
	 * http://creativecommons.org/licenses/by/3.0/
	 *
	 * @return (boolean) Whether or not the client supports a given feature.
	 **/

	function testInput(inputType) {
		var i = document.createElement('input');

		i.setAttribute('type', inputType);

		return i.type !== 'text';
	}

	function detect(user_agent) {
		var OS = this.OS = {};
		var Browser = this.Browser = {};

		// console.log(user_agent);

		var platform = user_agent.match(/Linux/) || user_agent.match(/Windows/) || user_agent.match(/iOS/) || user_agent.match(/Android/) || 'Unknown';

		var webkit = user_agent.match(/Web[kK]it[\/]{0,1}([\d.]+)/);
		// var gecko = user_agent.match(/Gecko[\/]{0,1}([\d.]+)/);
		var android = user_agent.match(/(Android);?[\s\/]+([\d.]+)?/);
		var ipad = user_agent.match(/(iPad).*OS\s([\d_]+)/);
		var ipod = user_agent.match(/(iPod)(.*OS\s([\d_]+))?/);
		var iphone = !ipad && user_agent.match(/(iPhone\sOS)\s([\d_]+)/);
		var webos = user_agent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/);
		var touchpad = webos && user_agent.match(/TouchPad/);
		var kindle = user_agent.match(/Kindle\/([\d.]+)/);
		var silk = user_agent.match(/Silk\/([\d._]+)/);
		var blackberry = user_agent.match(/(BlackBerry).*Version\/([\d.]+)/);
		var bb10 = user_agent.match(/(BB10).*Version\/([\d.]+)/);
		var rimtabletos = user_agent.match(/(RIM\sTablet\sOS)\s([\d.]+)/);
		var playbook = user_agent.match(/PlayBook/);
		var chrome = user_agent.match(/Chrome\/([\d.]+)/) || user_agent.match(/CriOS\/([\d.]+)/);
		var firefox = user_agent.match(/Firefox\/([\d.]+)/);
		var ie = user_agent.match(/MSIE ([\d.]+)/);
		var safari = webkit && user_agent.match(/Mobile\//) && !chrome;
		var webview = user_agent.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/) && !chrome;

		ie = user_agent.match(/MSIE\s([\d.]+)/);

		//---

		// TODO: clean this up with a better OS/Browser seperation:
		// - discern (more) between multiple browsers on android
		// - decide if kindle fire in silk mode is android or not
		// - Firefox on Android doesn't specify the Android version
		// - possibly devide in OS, device and Browser hashes

		if (Browser.Webkit = !! webkit) {
			Browser.Version = webkit[1];
		}

		// if (Browser.Gecko = !! gecko) {
		// 	Browser.Version = gecko[1];
		// }

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

		if (!silk && OS.Android && user_agent.match(/Kindle Fire/)) {
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

		if (safari && (user_agent.match(/Safari/) || !! OS.iOS)) {
			Browser.Safari = true;
		}

		if (webview) {
			Browser.WebView = true;
		}

		if (ie) {
			Browser.IE = true;
			Browser.Version = ie[1];
		}

		OS.Tablet = !! (ipad || playbook || (android && !user_agent.match(/Mobile/)) || (firefox && user_agent.match(/Tablet/)) || (ie && !user_agent.match(/Phone/) && user_agent.match(/Touch/)));
		OS.Phone = !! (!OS.Tablet && !OS.iPod && (android || iphone || webos || blackberry || bb10 || (chrome && user_agent.match(/Android/)) || (chrome && user_agent.match(/CriOS\/([\d.]+)/)) || (firefox && user_agent.match(/Mobile/)) || (ie && user_agent.match(/Touch/))));
		OS.Desktop = !! Browser.IE || Browser.Firefox || Browser.Safari || Browser.Chrome;
		OS.Platform = platform[0];
	}

	//---

	detect.call($, navigator.userAgent);

	// Make available to unit tests
	$._Detect = detect;

	//---

	$.Extend({
		Detect: {
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
			ScrollTop: ('pageXOffset' in window || 'scrollTop' in document.documentElement) && !$.OS.webOS,

			// Propietary features
			Standalone: 'standalone' in window.navigator && window.navigator.standalone
		}
	});

	/*
	 * Return (boolean) of likely client device classifications.
	 **/
	$.Extend({
		Device: {
			Mobile: (screen.width < 768),
			Tablet: (screen.width >= 768 && $.Detect.Orientation),
			Desktop: (screen.width >= 800 && !$.Detect.Orientation)
		}
	});
})(Yaex)
