+ ('Yaex', function (window, document, undefined) {
	'use strict';

	// Plugin information
	var PluginInfo = {
		Package: '',
		Description: '',
		Author: '',
		URL: '',
		Version: '',
		Date: '',
		Time: '',
		Status: 'Stable'
	};

	// Default options for the Plugin
	var PluginOptions = {
		//...
	};

	function Plugin(element, options) {
		this.Element = element;

		// Merge the options given by the user with the defaults
		this.Options = Yaex.Utility.simpleExtend({}, PluginOptions, options);

		this.$el = Yaex.DOM(el);
		this.$el.data(name, this);

		this.PluginOptions = {};

		var Meta = this.$el.data(name + '-opts');

		this.init();
	}

	Plugin.prototype.init = function () {
		// You have access to this.Options and this.Element
	};

	Yaex.DOM.Function.Plugin = function (defaults) {
		Settings = Yaex.Utility.simpleExtend({}, Yaex.DOM.Function.Plugin.PluginOptions, defaults);

		return this.each(function () {
			var element = this;
			var paragraph = Yaex.DOM(this);

			new Plugin(this, options);
		});
	};

})($);
