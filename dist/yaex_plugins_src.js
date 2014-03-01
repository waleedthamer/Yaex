/**
 * Yaex
 *
 * Yet another simple Javascript library.
 *
 * NOTICE OF LICENSE
 *
 * Licensed under the MIT License
 *
 * @author Xeriab Nabil (aka KodeBurner) <kodeburner@gmail.com> <xeriab@mefso.org>
 * @copyright Copyright (C) 2013 - 2014, MEFSO, Inc. (http://mefso.org/)
 * @license http://opensource.org/licenses/MIT The MIT License (MIT)
 * @link http://mefso.org/en-GB/projects/yaex
 * @since Version 0.14-dev Beta 1
 */

 + ('Yaex', function () {

	'use strict';

	// CSS TRANSITION SUPPORT (http://www.modernizr.com/)
	function transitionEnd() {
		var el = document.createElement('yaex');

		var transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd otransitionend',
			'transition': 'transitionend'
		};

		for (var name in transEndEventNames) {
			if (el.style[name] !== undefined) {
				return {
					end: transEndEventNames[name]
				};
			}
		}
	}

	// http://blog.alexmaccaw.com/css-transitions
	Yaex.DOM.Function.emulateTransitionEnd = function (duration) {
		var called = false;
		var el = this;

		Yaex.DOM(this).one(Yaex.DOM.Support.transition.end, function () {
			called = true;
		});

		var callback = function () {
			if (!called) {
				Yaex.DOM(el).trigger(Yaex.DOM.Support.transition.end);
			}
		};

		setTimeout(callback, duration);

		return this;
	};

	Yaex.DOM(function () {
		Yaex.DOM.Support.transition = transitionEnd();
	});

	//---
	
})(Yaex.DOM);

//---



+(function ($) {
	'use strict';

	// ALERT CLASS DEFINITION
	var dismiss = '[data-dismiss="alert"]';
	var Alert = function (el) {
		Yaex.DOM(el).on('click', dismiss, this.close);
	};

	Alert.prototype.close = function (e) {
		var $this = Yaex.DOM(this);
		var selector = $this.attr('data-target');

		if (!selector) {
			selector = $this.attr('href');
			// strip for ie7
			selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '');
		}

		var $parent = Yaex.DOM(selector);

		if (e) e.preventDefault();

		if (!$parent.length) {
			$parent = $this.hasClass('alert') ? $this : $this.parent();
		}

		$parent.trigger(e = Yaex.DOM.Event('close.yaex.alert'));

		if (e.isDefaultPrevented()) return;

		$parent.removeClass('in');

		function removeElement() {
			$parent.trigger('closed.yaex.alert').remove();
		}

		Yaex.DOM.Support.transition && $parent.hasClass('fade') ?
			$parent
			.one(Yaex.DOM.Support.transition.end, removeElement)
			.emulateTransitionEnd(150) :
			removeElement();
	};

	// ALERT PLUGIN DEFINITION
	// var old = Yaex.DOM.Function.alert;

	Yaex.DOM.Function.alert = function (option) {
		return this.each(function () {
			var $this = Yaex.DOM(this);
			var data = $this.data('yaex.alert');

			if (!data) $this.data('yaex.alert', (data = new Alert(this)));
			if (typeof option == 'string') data[option].call($this);
		});
	};

	Yaex.DOM.Function.alert.Constructor = Alert;

	// ALERT NO CONFLICT
	// Yaex.DOM.Function.alert.noConflict = function () {
	// 	Yaex.DOM.Function.alert = old;
	// 	return this;
	// };

	// ALERT DATA-API
	Yaex.DOM(document).on('click.yaex.alert.data-api', dismiss, Alert.prototype.close);
})($);


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

			if (!Yaex.DOM('.toast-container').size()) {
				toastWrapAll = Yaex.DOM('<div class="toast-container "></div>').addClass('toast-position-' + localSettings.position).appendTo('body');
			} else {
				toastWrapAll = Yaex.DOM('.toast-container');
			}

			/*toastWrapAll = (!Yaex.DOM('.toast-container').size) ? Yaex.DOM('<div></div>').
				addClass('toast-container').addClass('toast-position-' + 
				localSettings.position).appendTo('body') : Yaex.DOM('.toast-container');*/

			toastItemOuter = Yaex.DOM('<div class="toast-item-wrapper"></div>');

			//toastItemInner = Yaex.DOM('<div></div>').hide().addClass('toast-item toast-type-' + localSettings.type).appendTo(toastWrapAll).html(Yaex.DOM('<p>').append(localSettings.text)).animate(localSettings.inEffect, localSettings.inEffectDuration).wrap(toastItemOuter);
			//toastItemInner = Yaex.DOM('<div class="' + 'toast-item toast-type-' + localSettings.type + '"></div>').hide().appendTo(toastWrapAll).html(Yaex.DOM('<p>').append(localSettings.text)).animate(localSettings.inEffect, localSettings.inEffectDuration).wrap(toastItemOuter);
			toastItemInner = Yaex.DOM('<div class="' + 'toast-item toast-type-' + localSettings.type + '"></div>').show('slow').appendTo(toastWrapAll).html(Yaex.DOM('<p>').append(localSettings.text)).animate(localSettings.inEffect, localSettings.inEffectDuration).wrap(toastItemOuter);

			//console.log(toastItemInner);

			//			toastItemClose = Yaex.DOM('<div class="toast-item-close"></div>').prependTo(toastItemInner).html(localSettings.closeText).click(function() {
			//				Yaex.DOM().toastMessage('removeToast', toastItemInner, localSettings);
			//			});


			toastItemClose = Yaex.DOM('<div class="toast-item-close"></div>').prependTo(toastItemInner).html(localSettings.closeText).click(function () {
				Yaex.DOM().toastMessage('removeToast', toastItemInner, localSettings);
			});

			//			toastItemImage = Yaex.DOM('<div class="toast-item-image"></div>').addClass('toast-item-image-' + localSettings.type).prependTo(toastItemInner);

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

			toastItemImage = Yaex.DOM('<div class="toast-item-image"></div>').html('<i class="fa fa-' + iconAw + '"></i>').prependTo(toastItemInner);

			if (navigator.userAgent.match(/MSIE 6/i)) {
				toastWrapAll.css({
					top: document.documentElement.scrollTop
				});
			}

			if (!localSettings.sticky) {
				setTimeout(function () {
					Yaex.DOM().toastMessage('removeToast', toastItemInner, localSettings);
				}, localSettings.stayTime);
			}

			return toastItemInner;
		},
		showNoticeToast: function (message) {
			var options = {
				text: message,
				type: 'notice'
			};
			return Yaex.DOM().toastMessage('showToast', options);
		},
		showSuccessToast: function (message) {
			var options = {
				text: message,
				type: 'success'
			};
			return Yaex.DOM().toastMessage('showToast', options);
		},
		showErrorToast: function (message) {
			var options = {
				text: message,
				type: 'error'
			};
			return Yaex.DOM().toastMessage('showToast', options);
		},
		showWarningToast: function (message) {
			var options = {
				text: message,
				type: 'warning'
			};
			return Yaex.DOM().toastMessage('showToast', options);
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

	Yaex.DOM.Function.toastMessage = function (method) {
		// Method calling logic
		//console.log(Array.prototype.slice.call(arguments, 1));
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (Yaex.DOM.isObject(method) || !method) {
			return methods.init.apply(this, arguments);
		} else {
			Yaex.DOM.error('Method ' + method + ' does not exist on jQuery.toastMessage');
		}
	};
})($);


+ (function ($) {
	'use strict';

	// BUTTON PUBLIC CLASS DEFINITION
	var Button = function (element, options) {
		this.$element = Yaex.DOM(element);
		this.options = Yaex.Utility.simpleExtend({}, Button.DEFAULTS, options);
	};

	Button.DEFAULTS = {
		loadingText: 'loading...'
	};

	Button.prototype.setState = function (state) {
		var d = 'disabled';
		var $el = this.$element;
		var val = $el.is('input') ? 'val' : 'html';
		var data = $el.data();

		state = state + 'Text';

		if (!data.resetText) $el.data('resetText', $el[val]());

		$el[val](data[state] || this.options[state]);

		// push to event loop to allow forms to submit
		setTimeout(function () {
			state == 'loadingText' ?
				$el.addClass(d).attr(d, d) :
				$el.removeClass(d).removeAttr(d);
		}, 0);
	};

	Button.prototype.toggle = function () {
		var $parent = this.$element.closest('[data-toggle="buttons"]');
		var changed = true;

		if ($parent.length) {
			var $input = this.$element.find('input');

			if ($input.prop('type') === 'radio') {
				// see if clicking on current one
				if ($input.prop('checked') && this.$element.hasClass('active'))
					changed = false;
				else
					$parent.find('.active').removeClass('active');
			}

			if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change');
		}

		if (changed) this.$element.toggleClass('active');
	};

	// BUTTON PLUGIN DEFINITION
	// var old = Yaex.DOM.Function.button

	Yaex.DOM.Function.button = function (option) {
		return this.each(function () {
			var $this = Yaex.DOM(this);
			var data = $this.data('yaex.button');
			var options = typeof option == 'object' && option;

			if (!data) $this.data('yaex.button', (data = new Button(this, options)));

			if (option == 'toggle') data.toggle();
			else if (option) data.setState(option);
		});
	};

	Yaex.DOM.Function.button.Constructor = Button;

	// BUTTON NO CONFLICT
	// Yaex.DOM.Function.button.noConflict = function () {
	// 	Yaex.DOM.Function.button = old;
	// 	return this;
	// };

	// BUTTON DATA-API
	Yaex.DOM(document).on('click.yaex.button.data-api', '[data-toggle^=button]', function (e) {
		var $btn = Yaex.DOM(e.target);
		if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn');
		$btn.button('toggle');
		e.preventDefault();
	});
})($);


/**
 * Scroller - Cross browser scrollbars implementation using Yaex's API
 *
 *
 * @depends: Yaex.js | Core, Selector, Data, Event, Extra, MouseWheel
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function (window, document, undefined) {
	'use strict';

	// The default settings for the plugin
	var defaultSettings = {
		wheelSpeed: 10,
		wheelPropagation: false,
		minScrollbarLength: null,
		useBothWheelAxes: false,
		useKeyboard: true,
		suppressScrollX: false,
		suppressScrollY: false,
		scrollXMarginOffset: 0,
		scrollYMarginOffset: 0
	};

	var getEventClassName = (function () {
		var incrementingId = 0;
		return function () {
			var id = incrementingId;
			incrementingId += 1;
			return '.fas-scrollbar-' + id;
		};
	}());

	Yaex.DOM.Function.Scrollbar = function (SuppliedSettings, option) {

		return this.each(function () {
			// Use the default settings
			var settings = Yaex.Utility.simpleExtend(true, {}, defaultSettings),
				$this = Yaex.DOM(this);

			if (typeof SuppliedSettings === 'object') {
				// But over-ride any supplied
				Yaex.Utility.simpleExtend(true, settings, SuppliedSettings);
			} else {
				// If no settings were supplied, then the first param must be the option
				option = SuppliedSettings;
			}

			// Catch options

			if (option === 'update') {
				if ($this.data('fas-scrollbar-update')) {
					$this.data('fas-scrollbar-update')();
				}
				return $this;
			} else if (option === 'destroy') {
				if ($this.data('fas-scrollbar-destroy')) {
					$this.data('fas-scrollbar-destroy')();
				}
				return $this;
			}

			if ($this.data('fas-scrollbar')) {
				// if there's already fas-scrollbar
				return $this.data('fas-scrollbar');
			}


			// Or generate new fasScrollbar

			// Set class to the container
			$this.addClass('fas-container');

			var $scrollbarXRail = Yaex.DOM("<div class='fas-scrollbar-x-rail'></div>").appendTo($this),
				$scrollbarYRail = Yaex.DOM("<div class='fas-scrollbar-y-rail'></div>").appendTo($this),
				$scrollbarX = Yaex.DOM("<div class='fas-scrollbar-x'></div>").appendTo($scrollbarXRail),
				$scrollbarY = Yaex.DOM("<div class='fas-scrollbar-y'></div>").appendTo($scrollbarYRail),
				scrollbarXActive,
				scrollbarYActive,
				containerWidth,
				containerHeight,
				contentWidth,
				contentHeight,
				scrollbarXWidth,
				scrollbarXLeft,
				scrollbarXBottom = parseInt($scrollbarXRail.css('bottom'), 10),
				scrollbarYHeight,
				scrollbarYTop,
				scrollbarYRight = parseInt($scrollbarYRail.css('right'), 10),
				eventClassName = getEventClassName();

			var updateContentScrollTop = function (currentTop, deltaY) {
				var newTop = currentTop + deltaY,
					maxTop = containerHeight - scrollbarYHeight;

				if (newTop < 0) {
					scrollbarYTop = 0;
				} else if (newTop > maxTop) {
					scrollbarYTop = maxTop;
				} else {
					scrollbarYTop = newTop;
				}

				var scrollTop = parseInt(scrollbarYTop * (contentHeight - containerHeight) / (containerHeight - scrollbarYHeight), 10);
				$this.scrollTop(scrollTop);
				$scrollbarXRail.css({
					bottom: scrollbarXBottom - scrollTop
				});
			};

			var updateContentScrollLeft = function (currentLeft, deltaX) {
				var newLeft = currentLeft + deltaX,
					maxLeft = containerWidth - scrollbarXWidth;

				if (newLeft < 0) {
					scrollbarXLeft = 0;
				} else if (newLeft > maxLeft) {
					scrollbarXLeft = maxLeft;
				} else {
					scrollbarXLeft = newLeft;
				}

				var scrollLeft = parseInt(scrollbarXLeft * (contentWidth - containerWidth) / (containerWidth - scrollbarXWidth), 10);
				$this.scrollLeft(scrollLeft);
				$scrollbarYRail.css({
					right: scrollbarYRight - scrollLeft
				});
			};

			var getSettingsAdjustedThumbSize = function (thumbSize) {
				if (settings.minScrollbarLength) {
					thumbSize = Math.max(thumbSize, settings.minScrollbarLength);
				}
				return thumbSize;
			};

			var updateScrollbarCss = function () {
				$scrollbarXRail.css({
					left: $this.scrollLeft(),
					bottom: scrollbarXBottom - $this.scrollTop(),
					width: containerWidth,
					display: scrollbarXActive ? "inherit" : "none"
				});
				$scrollbarYRail.css({
					top: $this.scrollTop(),
					right: scrollbarYRight - $this.scrollLeft(),
					height: containerHeight,
					display: scrollbarYActive ? "inherit" : "none"
				});
				$scrollbarX.css({
					left: scrollbarXLeft,
					width: scrollbarXWidth
				});
				$scrollbarY.css({
					top: scrollbarYTop,
					height: scrollbarYHeight
				});
			};

			var updateBarSizeAndPosition = function () {
				containerWidth = $this.width();
				containerHeight = $this.height();
				contentWidth = $this.prop('scrollWidth');
				contentHeight = $this.prop('scrollHeight');

				if (!settings.suppressScrollX && containerWidth + settings.scrollXMarginOffset < contentWidth) {
					scrollbarXActive = true;
					scrollbarXWidth = getSettingsAdjustedThumbSize(parseInt(containerWidth * containerWidth / contentWidth, 10));
					scrollbarXLeft = parseInt($this.scrollLeft() * (containerWidth - scrollbarXWidth) / (contentWidth - containerWidth), 10);
				} else {
					scrollbarXActive = false;
					scrollbarXWidth = 0;
					scrollbarXLeft = 0;
					$this.scrollLeft(0);
				}

				if (!settings.suppressScrollY && containerHeight + settings.scrollYMarginOffset < contentHeight) {
					scrollbarYActive = true;
					scrollbarYHeight = getSettingsAdjustedThumbSize(parseInt(containerHeight * containerHeight / contentHeight, 10));
					scrollbarYTop = parseInt($this.scrollTop() * (containerHeight - scrollbarYHeight) / (contentHeight - containerHeight), 10);
				} else {
					scrollbarYActive = false;
					scrollbarYHeight = 0;
					scrollbarYTop = 0;
					$this.scrollTop(0);
				}

				if (scrollbarYTop >= containerHeight - scrollbarYHeight) {
					scrollbarYTop = containerHeight - scrollbarYHeight;
				}
				if (scrollbarXLeft >= containerWidth - scrollbarXWidth) {
					scrollbarXLeft = containerWidth - scrollbarXWidth;
				}

				updateScrollbarCss();
			};

			var bindMouseScrollXHandler = function () {
				var currentLeft,
					currentPageX;

				$scrollbarX.bind('mousedown' + eventClassName, function (e) {
					currentPageX = e.pageX;
					currentLeft = $scrollbarX.position().left;
					$scrollbarXRail.addClass('in-scrolling');
					e.stopPropagation();
					e.preventDefault();
				});

				Yaex.DOM(document).bind('mousemove' + eventClassName, function (e) {
					if ($scrollbarXRail.hasClass('in-scrolling')) {
						updateContentScrollLeft(currentLeft, e.pageX - currentPageX);
						e.stopPropagation();
						e.preventDefault();
					}
				});

				Yaex.DOM(document).bind('mouseup' + eventClassName, function (e) {
					if ($scrollbarXRail.hasClass('in-scrolling')) {
						$scrollbarXRail.removeClass('in-scrolling');
					}
				});

				currentLeft =
					currentPageX = null;
			};

			var bindMouseScrollYHandler = function () {
				var currentTop,
					currentPageY;

				$scrollbarY.bind('mousedown' + eventClassName, function (e) {
					currentPageY = e.pageY;
					currentTop = $scrollbarY.position().top;
					$scrollbarYRail.addClass('in-scrolling');
					e.stopPropagation();
					e.preventDefault();
				});

				Yaex.DOM(document).bind('mousemove' + eventClassName, function (e) {
					if ($scrollbarYRail.hasClass('in-scrolling')) {
						updateContentScrollTop(currentTop, e.pageY - currentPageY);
						e.stopPropagation();
						e.preventDefault();
					}
				});

				Yaex.DOM(document).bind('mouseup' + eventClassName, function (e) {
					if ($scrollbarYRail.hasClass('in-scrolling')) {
						$scrollbarYRail.removeClass('in-scrolling');
					}
				});

				currentTop =
					currentPageY = null;
			};

			// check if the default scrolling should be prevented.
			var shouldPreventDefault = function (deltaX, deltaY) {
				var scrollTop = $this.scrollTop();
				if (deltaX === 0) {
					if (!scrollbarYActive) {
						return false;
					}
					if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= contentHeight - containerHeight && deltaY < 0)) {
						return !settings.wheelPropagation;
					}
				}

				var scrollLeft = $this.scrollLeft();
				if (deltaY === 0) {
					if (!scrollbarXActive) {
						return false;
					}
					if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= contentWidth - containerWidth && deltaX > 0)) {
						return !settings.wheelPropagation;
					}
				}
				return true;
			};

			// bind handlers
			var bindMouseWheelHandler = function () {
				var shouldPrevent = false;
				
				$this.bind('wheel' + eventClassName, function (e, deprecatedDelta, deprecatedDeltaX, deprecatedDeltaY) {
					var deltaX = e.deltaX ? e.deltaX / 10 : deprecatedDeltaX,
						deltaY = e.deltaY ? e.deltaY / 10 : deprecatedDeltaY,
						WheelSpeed = (Yaex.DOM.Browser.Firefox ? 60 : settings.wheelSpeed);

					if (!settings.useBothWheelAxes) {
						// deltaX will only be used for horizontal scrolling and deltaY will
						// only be used for vertical scrolling - this is the default
						$this.scrollTop($this.scrollTop() + (deltaY * WheelSpeed));
						$this.scrollLeft($this.scrollLeft() - (deltaX * WheelSpeed));
					} else if (scrollbarYActive && !scrollbarXActive) {
						// only vertical scrollbar is active and useBothWheelAxes option is
						// active, so let's scroll vertical bar using both mouse wheel axes
						if (deltaY) {
							$this.scrollTop($this.scrollTop() - (deltaY * WheelSpeed));
						} else {
							$this.scrollTop($this.scrollTop() + (deltaX * WheelSpeed));
						}
					} else if (scrollbarXActive && !scrollbarYActive) {
						// useBothWheelAxes and only horizontal bar is active, so use both
						// wheel axes for horizontal bar
						if (deltaX) {
							$this.scrollLeft($this.scrollLeft() + (deltaX * WheelSpeed));
						} else {
							$this.scrollLeft($this.scrollLeft() - (deltaY * WheelSpeed));
						}
					}

					// update bar position
					updateBarSizeAndPosition();

					shouldPrevent = shouldPreventDefault(deltaX, deltaY);
					if (shouldPrevent) {
						e.preventDefault();
					}
				});

				// fix Firefox scroll problem
				$this.bind('MozMousePixelScroll' + eventClassName, function (e) {
					console.log(e);
					if (shouldPrevent) {
						e.preventDefault();
					}
				});
			};

			var bindKeyboardHandler = function () {
				var hovered = false;
				$this.bind('mouseenter' + eventClassName, function (e) {
					hovered = true;
				});
				$this.bind('mouseleave' + eventClassName, function (e) {
					hovered = false;
				});

				var shouldPrevent = false;
				Yaex.DOM(document).bind('keydown' + eventClassName, function (e) {
					if (!hovered) {
						return;
					}

					var deltaX = 0,
						deltaY = 0;

					switch (e.which) {
					case 37: // left
						deltaX = -3;
						break;
					case 38: // up
						deltaY = 3;
						break;
					case 39: // right
						deltaX = 3;
						break;
					case 40: // down
						deltaY = -3;
						break;
					case 33: // page up
						deltaY = 9;
						break;
					case 32: // space bar
					case 34: // page down
						deltaY = -9;
						break;
					case 35: // end
						deltaY = -containerHeight;
						break;
					case 36: // home
						deltaY = containerHeight;
						break;
					default:
						return;
					}

					$this.scrollTop($this.scrollTop() - (deltaY * settings.wheelSpeed));
					$this.scrollLeft($this.scrollLeft() + (deltaX * settings.wheelSpeed));

					shouldPrevent = shouldPreventDefault(deltaX, deltaY);
					if (shouldPrevent) {
						e.preventDefault();
					}
				});
			};

			var bindRailClickHandler = function () {
				var stopPropagation = function (e) {
					e.stopPropagation();
				};

				$scrollbarY.bind('click' + eventClassName, stopPropagation);
				$scrollbarYRail.bind('click' + eventClassName, function (e) {
					var halfOfScrollbarLength = parseInt(scrollbarYHeight / 2, 10),
						positionTop = e.pageY - $scrollbarYRail.offset().top - halfOfScrollbarLength,
						maxPositionTop = containerHeight - scrollbarYHeight,
						positionRatio = positionTop / maxPositionTop;

					if (positionRatio < 0) {
						positionRatio = 0;
					} else if (positionRatio > 1) {
						positionRatio = 1;
					}

					$this.scrollTop((contentHeight - containerHeight) * positionRatio);
				});

				$scrollbarX.bind('click' + eventClassName, stopPropagation);
				$scrollbarXRail.bind('click' + eventClassName, function (e) {
					var halfOfScrollbarLength = parseInt(scrollbarXWidth / 2, 10),
						positionLeft = e.pageX - $scrollbarXRail.offset().left - halfOfScrollbarLength,
						maxPositionLeft = containerWidth - scrollbarXWidth,
						positionRatio = positionLeft / maxPositionLeft;

					if (positionRatio < 0) {
						positionRatio = 0;
					} else if (positionRatio > 1) {
						positionRatio = 1;
					}

					$this.scrollLeft((contentWidth - containerWidth) * positionRatio);
				});
			};

			// bind mobile touch handler
			var bindMobileTouchHandler = function () {
				var applyTouchMove = function (differenceX, differenceY) {
					$this.scrollTop($this.scrollTop() - differenceY);
					$this.scrollLeft($this.scrollLeft() - differenceX);

					// update bar position
					updateBarSizeAndPosition();
				};

				var startCoords = {},
					startTime = 0,
					speed = {},
					breakingProcess = null,
					inGlobalTouch = false;

				Yaex.DOM(window).bind("touchstart" + eventClassName, function (e) {
					inGlobalTouch = true;
				});
				Yaex.DOM(window).bind("touchend" + eventClassName, function (e) {
					inGlobalTouch = false;
				});

				$this.bind("touchstart" + eventClassName, function (e) {
					var touch = e.originalEvent.targetTouches[0];

					startCoords.pageX = touch.pageX;
					startCoords.pageY = touch.pageY;

					startTime = (new Date()).getTime();

					if (breakingProcess !== null) {
						clearInterval(breakingProcess);
					}

					e.stopPropagation();
				});
				$this.bind("touchmove" + eventClassName, function (e) {
					if (!inGlobalTouch && e.originalEvent.targetTouches.length === 1) {
						var touch = e.originalEvent.targetTouches[0];

						var currentCoords = {};
						currentCoords.pageX = touch.pageX;
						currentCoords.pageY = touch.pageY;

						var differenceX = currentCoords.pageX - startCoords.pageX,
							differenceY = currentCoords.pageY - startCoords.pageY;

						applyTouchMove(differenceX, differenceY);
						startCoords = currentCoords;

						var currentTime = (new Date()).getTime();

						var timeGap = currentTime - startTime;
						if (timeGap > 0) {
							speed.x = differenceX / timeGap;
							speed.y = differenceY / timeGap;
							startTime = currentTime;
						}

						e.preventDefault();
					}
				});
				$this.bind("touchend" + eventClassName, function (e) {
					clearInterval(breakingProcess);
					breakingProcess = setInterval(function () {
						if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
							clearInterval(breakingProcess);
							return;
						}

						applyTouchMove(speed.x * 30, speed.y * 30);

						speed.x *= 0.8;
						speed.y *= 0.8;
					}, 10);
				});
			};

			var bindScrollHandler = function () {
				$this.bind('scroll' + eventClassName, function (e) {
					updateBarSizeAndPosition();
				});
			};

			var destroy = function () {
				$this.unbind(eventClassName);
				Yaex.DOM(window).unbind(eventClassName);
				Yaex.DOM(document).unbind(eventClassName);
				$this.data('fas-scrollbar', null);
				$this.data('fas-scrollbar-update', null);
				$this.data('fas-scrollbar-destroy', null);
				$scrollbarX.remove();
				$scrollbarY.remove();
				$scrollbarXRail.remove();
				$scrollbarYRail.remove();

				// clean all variables
				$scrollbarX =
					$scrollbarY =
					containerWidth =
					containerHeight =
					contentWidth =
					contentHeight =
					scrollbarXWidth =
					scrollbarXLeft =
					scrollbarXBottom =
					scrollbarYHeight =
					scrollbarYTop =
					scrollbarYRight = null;
			};

			var ieSupport = function (version) {
				$this.addClass('ie').addClass('ie' + version);

				var bindHoverHandlers = function () {
					var mouseenter = function () {
						Yaex.DOM(this).addClass('hover');
					};
					var mouseleave = function () {
						Yaex.DOM(this).removeClass('hover');
					};
					$this.bind('mouseenter' + eventClassName, mouseenter).bind('mouseleave' + eventClassName, mouseleave);
					$scrollbarXRail.bind('mouseenter' + eventClassName, mouseenter).bind('mouseleave' + eventClassName, mouseleave);
					$scrollbarYRail.bind('mouseenter' + eventClassName, mouseenter).bind('mouseleave' + eventClassName, mouseleave);
					$scrollbarX.bind('mouseenter' + eventClassName, mouseenter).bind('mouseleave' + eventClassName, mouseleave);
					$scrollbarY.bind('mouseenter' + eventClassName, mouseenter).bind('mouseleave' + eventClassName, mouseleave);
				};

				var fixIe6ScrollbarPosition = function () {
					updateScrollbarCss = function () {
						$scrollbarX.css({
							left: scrollbarXLeft + $this.scrollLeft(),
							bottom: scrollbarXBottom,
							width: scrollbarXWidth
						});
						$scrollbarY.css({
							top: scrollbarYTop + $this.scrollTop(),
							right: scrollbarYRight,
							height: scrollbarYHeight
						});
						$scrollbarX.hide().show();
						$scrollbarY.hide().show();
					};
				};

				if (version === 6) {
					bindHoverHandlers();
					fixIe6ScrollbarPosition();
				}
			};

			var supportsTouch = (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch);

			var initialize = function () {
				// var ieMatch = navigator.userAgent.toLowerCase().match(/(msie) ([\w.]+)/);
				// if (ieMatch && ieMatch[1] === 'msie') {
				// 	// must be executed at first, because 'ieSupport' may addClass to the container
				// 	ieSupport(parseInt(ieMatch[2], 10));
				// }

				updateBarSizeAndPosition();
				bindScrollHandler();
				bindMouseScrollXHandler();
				bindMouseScrollYHandler();
				bindRailClickHandler();

				if (supportsTouch) {
					bindMobileTouchHandler();
				}

				if ($this.wheel) {
					bindMouseWheelHandler();
				}

				if (settings.useKeyboard) {
					bindKeyboardHandler();
				}

				$this.data('fas-scrollbar', $this);
				$this.data('fas-scrollbar-update', updateBarSizeAndPosition);
				$this.data('fas-scrollbar-destroy', destroy);
			};

			// initialize
			initialize();

			return $this;
		});
	};
})(Yaex)


+(function ($) {
	'use strict';

	// TOOLTIP PUBLIC CLASS DEFINITION
	var Tooltip = function (element, options) {
		this.type =
			this.options =
			this.enabled =
			this.timeout =
			this.hoverState =
			this.$element = null;

		this.init('tooltip', element, options);
	};

	Tooltip.DEFAULTS = {
		animation: true,
		placement: 'top',
		selector: false,
		template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
		trigger: 'hover focus',
		title: '',
		delay: 0,
		html: false,
		container: false
	};

	Tooltip.prototype.init = function (type, element, options) {
		this.enabled = true;
		this.type = type;
		this.$element = Yaex.DOM(element);
		this.options = this.getOptions(options);

		var triggers = this.options.trigger.split(' ');

		for (var i = triggers.length; i--;) {
			var trigger = triggers[i];

			if (trigger == 'click') {
				this.$element.bind('click.' + this.type, this.options.selector, Yaex.DOM.proxy(this.toggle, this));
			} else if (trigger !== 'manual') {
				var eventIn;
				var eventOut;

				if (trigger == 'hover') {
					eventIn = 'mouseenter';
					eventOut = 'mouseleave';
				} else {
					eventIn = 'focus';
					eventOut = 'blur';
				}

				this.$element.on(eventIn + '.' + this.type, this.options.selector, null, Yaex.DOM.proxy(this.enter, this));
				this.$element.on(eventOut + '.' + this.type, this.options.selector, null, Yaex.DOM.proxy(this.leave, this));
			}
		}

		this.options.selector ?
			(this._options = Yaex.Utility.simpleExtend({}, this.options, {
				trigger: 'manual',
				selector: ''
			})) :
			this.fixTitle();
	};

	Tooltip.prototype.getDefaults = function () {
		return Tooltip.DEFAULTS;
	};

	Tooltip.prototype.getOptions = function (options) {
		options = Yaex.Utility.simpleExtend({}, this.getDefaults(), this.$element.data(), options);

		if (options.delay && typeof options.delay == 'number') {
			options.delay = {
				show: options.delay,
				hide: options.delay
			};
		}

		return options;
	};

	Tooltip.prototype.getDelegateOptions = function () {
		var options = {};
		var defaults = this.getDefaults();

		this._options && Yaex.DOM.Each(this._options, function (key, value) {
			if (defaults[key] != value) options[key] = value;
		});

		return options;
	};

	Tooltip.prototype.enter = function (obj) {
		var self = obj instanceof this.constructor ?
			obj : Yaex.DOM(obj.currentTarget)[this.type](this.getDelegateOptions()).data('yaex.' + this.type);
			
		clearTimeout(self.timeout);

		self.hoverState = 'in';

		if (!self.options.delay || !self.options.delay.show) return self.show();

		self.timeout = setTimeout(function () {
			if (self.hoverState == 'in') self.show();
		}, self.options.delay.show);
	}

	Tooltip.prototype.leave = function (obj) {
		var self = obj instanceof this.constructor ?
			obj : Yaex.DOM(obj.currentTarget)[this.type](this.getDelegateOptions()).data('yaex.' + this.type);

		clearTimeout(self.timeout);

		self.hoverState = 'out';

		if (!self.options.delay || !self.options.delay.hide) return self.hide();

		self.timeout = setTimeout(function () {
			if (self.hoverState == 'out') self.hide();
		}, self.options.delay.hide);
	};

	Tooltip.prototype.show = function () {
		var e = Yaex.DOM.Event('show.yaex.' + this.type);

		if (this.hasContent() && this.enabled) {
			this.$element.trigger(e);

			if (e.isDefaultPrevented()) return;

			var $tip = this.tip();

			this.setContent();

			if (this.options.animation) $tip.addClass('fade');

			var placement = typeof this.options.placement == 'function' ?
				this.options.placement.call(this, $tip[0], this.$element[0]) :
				this.options.placement;

			var autoToken = /\s?auto?\s?/i;
			var autoPlace = autoToken.test(placement);
			if (autoPlace) placement = placement.replace(autoToken, '') || 'top';


			$tip
				.detach()
				.css({
					top: 0,
					left: 0,
					display: 'block'
				})
				.addClass(placement);

			this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);
			// this.options.container ? $tip.appendTo(this.options.container) : $tip.insertBefore(this.$element);

			var pos = this.getPosition();
			var actualWidth = $tip[0].offsetWidth;
			var actualHeight = $tip[0].offsetHeight;

			if (autoPlace) {
				var $parent = this.$element.parent();

				var orgPlacement = placement;
				var docScroll = document.documentElement.scrollTop || document.body.scrollTop;
				var parentWidth = this.options.container == 'body' ? window.innerWidth : $parent.outerWidth();
				var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight();
				var parentLeft = this.options.container == 'body' ? 0 : $parent.offset().left;

				placement = placement == 'bottom' && pos.top + pos.height + actualHeight - docScroll > parentHeight ? 'top' :
					placement == 'top' && pos.top - docScroll - actualHeight < 0 ? 'bottom' :
					placement == 'right' && pos.right + actualWidth > parentWidth ? 'left' :
					placement == 'left' && pos.left - actualWidth < parentLeft ? 'right' :
					placement;

				$tip.removeClass(orgPlacement).addClass(placement);
			}

			var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);

			this.applyPlacement(calculatedOffset, placement);
			this.$element.trigger('shown.yaex.' + this.type);
		}
	}

	Tooltip.prototype.applyPlacement = function (offset, placement) {
		var replace;
		var $tip = this.tip();
		var width = $tip[0].offsetWidth;
		var height = $tip[0].offsetHeight;

		// manually read margins because getBoundingClientRect includes difference
		var marginTop = parseInt($tip.css('margin-top'), 10);
		var marginLeft = parseInt($tip.css('margin-left'), 10);

		// we must check for NaN for ie 8/9
		if (isNaN(marginTop)) marginTop = 0;
		if (isNaN(marginLeft)) marginLeft = 0;

		offset.top = offset.top + marginTop;
		offset.left = offset.left + marginLeft;

		$tip.offset(offset).addClass('in');

		// check to see if placing tip in new offset caused the tip to resize itself
		var actualWidth = $tip[0].offsetWidth;
		var actualHeight = $tip[0].offsetHeight;

		if (placement == 'top' && actualHeight != height) {
			replace = true;
			offset.top = offset.top + height - actualHeight;
		}

		if (/bottom|top/.test(placement)) {
			var delta = 0;

			if (offset.left < 0) {
				delta = offset.left * -2;
				offset.left = 0;

				$tip.offset(offset);

				actualWidth = $tip[0].offsetWidth;
				actualHeight = $tip[0].offsetHeight;
			}

			this.replaceArrow(delta - width + actualWidth, actualWidth, 'left');
		} else {
			this.replaceArrow(actualHeight - height, actualHeight, 'top');
		}

		if (replace) {
			$tip.offset(offset);
		}
	};

	Tooltip.prototype.replaceArrow = function (delta, dimension, position) {
		this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '');
	};

	Tooltip.prototype.setContent = function () {
		var $tip = this.tip();
		var title = this.getTitle();

		$tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title);
		$tip.removeClass('fade in top bottom left right');
	};

	Tooltip.prototype.hide = function () {
		var that = this;
		var $tip = this.tip();
		var e = Yaex.DOM.Event('hide.yaex.' + this.type);

			function complete() {
				if (that.hoverState != 'in') {
					$tip.detach();
				}
			}

		this.$element.trigger(e);

		if (e.isDefaultPrevented()) return;

		$tip.removeClass('in');

		Yaex.DOM.Support.transition && this.$tip.hasClass('fade') ?
			$tip.one(Yaex.DOM.Support.transition.end, complete)
				.emulateTransitionEnd(350) :
				complete();

		this.$element.trigger('hidden.yaex.' + this.type);

		return this;
	};

	Tooltip.prototype.fixTitle = function () {
		var $e = this.$element;

		if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
			$e.attr('data-original-title', $e.attr('title') || '').attr('title', '');
		}
	};

	Tooltip.prototype.hasContent = function () {
		return this.getTitle();
	};

	Tooltip.prototype.getPosition = function () {
		var el = this.$element[0];
		return Yaex.Utility.simpleExtend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
			width: el.offsetWidth,
			height: el.offsetHeight
		}, this.$element.offset());
	};

	Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
		return placement == 'bottom' ? {
			top: pos.top + pos.height,
			left: pos.left + pos.width / 2 - actualWidth / 2
		} :
			placement == 'top' ? {
				top: pos.top - actualHeight,
				left: pos.left + pos.width / 2 - actualWidth / 2
		} :
			placement == 'left' ? {
				top: pos.top + pos.height / 2 - actualHeight / 2,
				left: pos.left - actualWidth
		} :
		/* placement == 'right' */
		{
			top: pos.top + pos.height / 2 - actualHeight / 2,
			left: pos.left + pos.width
		};
	};

	Tooltip.prototype.getTitle = function () {
		var title;
		var $e = this.$element;
		var o = this.options;

		title = $e.attr('data-original-title') || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title);

		return title;
	};

	Tooltip.prototype.tip = function () {
		return this.$tip = this.$tip || Yaex.DOM(this.options.template);
	};

	Tooltip.prototype.arrow = function () {
		return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow');
	};

	Tooltip.prototype.validate = function () {
		if (!this.$element[0].parentNode) {
			this.hide();
			this.$element = null;
			this.options = null;
		}
	};

	Tooltip.prototype.enable = function () {
		this.enabled = true;
	};

	Tooltip.prototype.disable = function () {
		this.enabled = false;
	};

	Tooltip.prototype.toggleEnabled = function () {
		this.enabled = !this.enabled;
	};

	Tooltip.prototype.toggle = function (e) {
		var self = e ? Yaex.DOM(e.currentTarget)[this.type](this.getDelegateOptions()).data('yaex.' + this.type) : this
		self.tip().hasClass('in') ? self.leave(self) : self.enter(self);
	};

	Tooltip.prototype.destroy = function () {
		this.hide().$element.off('.' + this.type).removeData('yaex.' + this.type);
	};

	Yaex.DOM.Function.tooltip = function (option) {
		return this.each(function () {
			var $this = Yaex.DOM(this);
			var data = $this.data('yaex.tooltip');
			var options = typeof option == 'object' && option;

			if (!data) $this.data('yaex.tooltip', (data = new Tooltip(this, options)));
			if (typeof option == 'string') data[option]();
		});
	};

	Yaex.DOM.Function.tooltip.constructor = Tooltip;
})($);


+(function ($) {
	'use strict';

	// POPOVER PUBLIC CLASS DEFINITION
	var Popover = function (element, options) {
		this.init('popover', element, options);
	};

	if (!Yaex.DOM.Function.tooltip) throw new Error('Popover requires Tooltip.js');

	Popover.DEFAULTS = Yaex.Utility.simpleExtend({}, Yaex.DOM.Function.tooltip.constructor.DEFAULTS, {
		placement: 'right',
		trigger: 'click',
		content: '',
		template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
	});

	// NOTE: POPOVER EXTENDS Tooltip.js
	Popover.prototype = Yaex.Utility.simpleExtend({}, Yaex.DOM.Function.tooltip.constructor.prototype);

	Popover.prototype.constructor = Popover;

	Popover.prototype.getDefaults = function () {
		return Popover.DEFAULTS;
	};

	Popover.prototype.setContent = function () {
		var $tip = this.tip();
		var title = this.getTitle();
		var content = this.getContent();

		$tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title);
		$tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content);

		$tip.removeClass('fade top bottom left right in');

		// IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
		// this manually by checking the contents.
		if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide();
	};

	Popover.prototype.hasContent = function () {
		return this.getTitle() || this.getContent();
	};

	Popover.prototype.getContent = function () {
		var $e = this.$element;
		var o = this.options;

		return $e.attr('data-content') || (typeof o.content == 'function' ?
			o.content.call($e[0]) :
			o.content);
	};

	Popover.prototype.arrow = function () {
		return this.$arrow = this.$arrow || this.tip().find('.arrow');
	};

	Popover.prototype.tip = function () {
		if (!this.$tip) this.$tip = Yaex.DOM(this.options.template);
		return this.$tip;
	};

	Yaex.DOM.Function.popover = function (option) {
		return this.each(function () {
			var $this = Yaex.DOM(this);
			var data = $this.data('yaex.popover');
			var options = typeof option == 'object' && option;

			if (!data) $this.data('yaex.popover', (data = new Popover(this, options)));
			if (typeof option == 'string') data[option]();
		});
	};

	Yaex.DOM.Function.popover.constructor = Popover;
})($);


+(function ($) {
	var defaults = {
		customOffset: true,
		manual: true,
		onlyInContainer: true
	};

	Yaex.DOM.Function.AutoFix = function (options) {
		var settings = Yaex.Utility.simpleExtend({}, defaults, options),
			el = Yaex.DOM(this),
			curpos = el.position(),
			offset = settings.customOffset,
			pos = el.offset();

		el.addClass('YaexAutoFix');

		Yaex.DOM.Function.ManualFix = function () {
			var el = Yaex.DOM(this),
				pos = el.offset();

			if (el.hasClass('_Fixed')) {
				el.removeClass('_Fixed');
			} else {
				el.addClass('_Fixed').css({
					top: 0,
					left: pos.left,
					right: 'auto',
					bottom: 'auto'
				});
			}
		};

		fixAll = function (el, settings, curpos, pos) {
			if (settings.customOffset == false) offset = el.parent().offset().top;
			if (Yaex.DOM(document).scrollTop() > offset && Yaex.DOM(document).scrollTop() <= (el.parent().height() + (offset - Yaex.DOM(window).height()))) {
				el.removeClass('_Bottom').addClass('_Fixed').css({
					top: 0,
					left: pos.left,
					right: 'auto',
					bottom: 'auto'
				});
			} else {
				if (Yaex.DOM(document).scrollTop() > offset) {
					if (settings.onlyInContainer == true) {
						if (Yaex.DOM(document).scrollTop() > (el.parent().height() - Yaex.DOM(window).height())) {
							el.addClass('_Bottom _Fixed').removeAttr('style').css({
								left: curpos.left
							});
						} else {
							el.removeClass('_Bottom _Fixed').removeAttr('style');

						}
					}
				} else {
					el.removeClass('_Bottom _Fixed').removeAttr('style');
				}
			}
		};

		if (settings.manual == false) {
			Yaex.DOM(window).scroll(function () {
				fixAll(el, settings, curpos, pos);
			});
		}
	};
})($);


/**
 * HashRouter - Cross browser hash router implementation using Yaex.DOM's API
 *
 *
 * @depends: Yaex.js | Core, Event, Extra
 * @version 0.10
 * @license Dual licensed under the MIT and GPL licenses.
 */

+ ('Yaex', function () {

	'use strict';

	// Routes array
	var HashRoutes = new Array;

	var location = Yaex.DOM.Location;

	var DefaultOptions = {
		DefaultPath: '/',
		Before: Yaex.Noop,
		On: Yaex.Noop,
		NotFound: Yaex.Noop
	}; // END OF DefaultOptions CLASS

	var Router = {
		current: null,
		previous: null,
		config: function (options) {
			for (var option in options) {
				if (options.hasOwnProperty(option)) {
					DefaultOptions[option] = options[option];
				} // END if
			} // END for

			return Router;
		},
		add: function (path, name, fn) {
			if (path && name) {
				if (Yaex.Global.isFunction(name)) {
					fn = name;
					name = null;
				} // END if

				HashRoutes.push({
					path: path,
					name: name,
					fn: fn || function () {}
				});
			} // END if

			return Router;
		},
		go: function (path) {
			location.hash = path;

			return Router;
		},
		back: function (path) {
			// Only 1-step back
			if (Router.previous) {
				history.back();
				Router.previous = null;
				// Fallback if can't go back
			} else if (path) {

				location.hash = path;
			} // END if

			return Router;
		}
	}; // END OF Router CLASS

	var HashChange = function () {
		var hash = location.hash.slice(1);
		var found = false;
		var current = Router.current;

		if (!hash) {
			hash = DefaultOptions.DefaultPath;
		} // END if

		if (current && current != Router.previous) {
			Router.previous = current;
		} // END if

		Router.current = hash;

		for (var x = 0, l = HashRoutes.length; x < l && !found; x++) {
			var route = HashRoutes[x];
			var path = route.path;
			var name = route.name;
			var fn = route.fn;

			if (typeof path == 'string') {

				if (path.toLowerCase() == hash.toLowerCase()) {

					DefaultOptions.Before.call(Router, path, name);
					fn.call(Router);
					DefaultOptions.On.call(Router, path, name);
					found = true;
				} // END if
				// regex
			} else {
				var matches = hash.match(path);

				if (matches) {

					DefaultOptions.Before.call(Router, path, name, matches);
					fn.apply(Router, matches);
					DefaultOptions.On.call(Router, path, name, matches);
					found = true;
				} // END if
			} // END if
		} // END for

		if (!found) {
			DefaultOptions.NotFound.call(Router);
		} // END if

		return Router;
	}; // END OF HashChange FUNCTION

	Router.init = function () {
		// window.addEventListener('hashchange', HashChange);

		Yaex.DOM(window).hashchange(HashChange);

		return HashChange();
	}; // END OF init FUNCTION

	Router.reload = HashChange();

	// Assign the Router class to Window global for external use
	// window.router = Router;

	// Assign the Router class to Yaex's global
	Yaex.DOM.HashRouter = Router;

	//---
	
})(Yaex.DOM);

//---

