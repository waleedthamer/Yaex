+(function (window, document, undefined) {
	// Extension information
	var ExtensionInformation = {
		Package: '',
		Description: '',
		Author: '',
		URL: '',
		Version: '',
		Date: '',
		Time: '',
		Status: 'Stable'
	};

	// Default options for the extension
	var DefaultOptions = {
		//...
	};

	function Extension(element, options) {
		this.Element = element;

		// Merge the options given by the user with the defaults
		this.Options = $.Extend({}, DefaultOptions, options);

		this.$el = $(el);
		this.$el.data(name, this);

		this.DefaultOptions = {};

		var Meta = this.$el.data(name + '-opts');

		this.init();
	}

	Extension.prototype.init = function () {
		// You have access to this.Options and this.Element
	};

	$.fn.Extension = function (defaults) {
		Settings = $.Extend({}, $.fn.Extension.DefaultOptions, defaults);

		return this.each(function () {
			var element = this;
			var paragraph = $(this);

			new Extension(this, options);
		});
	};
})(window, document)
