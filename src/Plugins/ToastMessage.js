+(function ($) {
	'use strict';

	var settings = {
		inEffect: {
			opacity: 'show'
		}, // in effect
		inEffectDuration: 600, // in effect duration in miliseconds
		stayTime: 3000, // time in miliseconds before the item has to disappear
		text: '', // content of the item. Might be a string or a jQuery object. Be aware that any jQuery object which is acting as a message will be deleted when the toast is fading away.
		sticky: false, // should the toast item sticky or not?
		type: 'notice', // notice, warning, error, success
		position: 'top-right', // top-left, top-center, top-right, middle-left, middle-center, middle-right ... Position of the toast container holding different toast. Position can be set only once at the very first call, changing the position after the first call does nothing
		closeText: '<i class="fa fa-times-circle"></i>', // text which will be shown as close button, set to '' when you want to introduce an image via css
		close: null // callback function when the toastMessage is closed
	};

	var methods = {
		init: function (options) {
			if (options) {
				Yaex.Utility.simpleExtend(settings, options);
			}

		},
		showToast: function (options) {
			var localSettings = {};

			Yaex.Utility.simpleExtend(localSettings, settings, options);

			// declare variables
			var toastWrapAll;
			var toastItemOuter;
			var toastItemInner;
			var toastItemClose;
			var toastItemImage;

			if (!$('.toast-container').size()) {
				toastWrapAll = $('<div class="toast-container "></div>').addClass('toast-position-' + localSettings.position).appendTo('body');
			} else {
				toastWrapAll = $('.toast-container');
			}

			/*toastWrapAll = (!$('.toast-container').size) ? $('<div></div>').
				addClass('toast-container').addClass('toast-position-' + 
				localSettings.position).appendTo('body') : $('.toast-container');*/

			toastItemOuter = $('<div class="toast-item-wrapper"></div>');

			//toastItemInner = $('<div></div>').hide().addClass('toast-item toast-type-' + localSettings.type).appendTo(toastWrapAll).html($('<p>').append(localSettings.text)).animate(localSettings.inEffect, localSettings.inEffectDuration).wrap(toastItemOuter);
			//toastItemInner = $('<div class="' + 'toast-item toast-type-' + localSettings.type + '"></div>').hide().appendTo(toastWrapAll).html($('<p>').append(localSettings.text)).animate(localSettings.inEffect, localSettings.inEffectDuration).wrap(toastItemOuter);
			toastItemInner = $('<div class="' + 'toast-item toast-type-' + localSettings.type + '"></div>').show('slow').appendTo(toastWrapAll).html($('<p>').append(localSettings.text)).animate(localSettings.inEffect, localSettings.inEffectDuration).wrap(toastItemOuter);

			//console.log(toastItemInner);

			//			toastItemClose = $('<div class="toast-item-close"></div>').prependTo(toastItemInner).html(localSettings.closeText).click(function() {
			//				$().toastMessage('removeToast', toastItemInner, localSettings);
			//			});


			toastItemClose = $('<div class="toast-item-close"></div>').prependTo(toastItemInner).html(localSettings.closeText).click(function () {
				$().toastMessage('removeToast', toastItemInner, localSettings);
			});

			//			toastItemImage = $('<div class="toast-item-image"></div>').addClass('toast-item-image-' + localSettings.type).prependTo(toastItemInner);

			var iconAw = '';

			switch (localSettings.type) {
			case 'notice':
				iconAw = 'info-circle iconAwblue';
				break;
			case 'success':
				iconAw = 'check-circle iconAwgreen';
				break;
			case 'warning':
				iconAw = 'exclamation-triangle iconAwyellow';
				break;
			case 'error':
				iconAw = 'exclamation-circle iconAwred';
				break;
			}

			toastItemImage = $('<div class="toast-item-image"></div>').html('<i class="fa fa-' + iconAw + '"></i>').prependTo(toastItemInner);

			if (navigator.userAgent.match(/MSIE 6/i)) {
				toastWrapAll.css({
					top: document.documentElement.scrollTop
				});
			}

			if (!localSettings.sticky) {
				setTimeout(function () {
					$().toastMessage('removeToast', toastItemInner, localSettings);
				}, localSettings.stayTime);
			}

			return toastItemInner;
		},
		showNoticeToast: function (message) {
			var options = {
				text: message,
				type: 'notice'
			};
			return $().toastMessage('showToast', options);
		},
		showSuccessToast: function (message) {
			var options = {
				text: message,
				type: 'success'
			};
			return $().toastMessage('showToast', options);
		},
		showErrorToast: function (message) {
			var options = {
				text: message,
				type: 'error'
			};
			return $().toastMessage('showToast', options);
		},
		showWarningToast: function (message) {
			var options = {
				text: message,
				type: 'warning'
			};
			return $().toastMessage('showToast', options);
		},
		removeToast: function (obj, options) {
			//console.log(obj);

			obj.animate({
				opacity: '0'
			}, 600, function () {
				obj.parent().animate({
					height: '0px'
				}, 300, function () {
					obj.parent().remove();
				});
			});

			// callback
			if (options && options.close !== null) {
				options.close();
			}
		}
	};

	$.fn.toastMessage = function (method) {
		// Method calling logic
		//console.log(Array.prototype.slice.call(arguments, 1));
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if ($.isObject(method) || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.toastMessage');
		}
	};
})($);
