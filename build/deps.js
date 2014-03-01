var deps = {
	Core: {
		src: [
			'Core/Core.js',
			'Core/Global.js',
			'Core/Utility.js',
			'Core/Class.js',
			'Core/Detect.js',
			'Core/Deferred.js',
			'Core/Callbacks.js',
			'Core/Events.js',
			'Core/ObjectOriented.js',
			'Core/Logger.js',
			'Core/Queue.js',
			'Core/Handler.js',
			'Core/Data.js'
		],
		
		desc: 'Yaex Core Library.'
	},

	DOM: {
		src: [
			'DOM/DOM.js',
			'DOM/Selector.js',
			'DOM/Data.js',
			'DOM/DOM.Event.js',
			'DOM/Draggable.js',
			'DOM/FX.js',
			'DOM/FX.Methods.js',
			'DOM/Ajax.js',
			'DOM/Form.js',
			'DOM/DOM.Extra.js',
			'DOM/DOM.Event.Gesture.js',
			'DOM/DOM.Event.Press.js',
			'DOM/DOM.Event.Shake.js',
			'DOM/DOM.Event.Touch.js',
			'DOM/Stack.js',
			'DOM/Assets.js',

			'Support/InternetExplorer.js',
			'Support/IOS3.js',
			'Support/Cordova.js',
		],
		
		desc: 'Yaex DOM Module.'
	},
	
	// All: {
	// 	src: [
	// 		'Core/Core.js',
	// 		'Core/Global.js',
	// 		'Core/Utility.js',
	// 		'Core/Class.js',
	// 		'Core/Detect.js',
	// 		'Core/Deferred.js',
	// 		'Core/Callbacks.js',
	// 		'Core/Events.js',
	// 		'Core/ObjectOriented.js',
	// 		'Core/Logger.js',
	// 		'Core/Queue.js',
	// 		'Core/Handler.js',
	// 		'Core/Data.js',

	// 		'DOM/DOM.js',
	// 		'DOM/Selector.js',
	// 		'DOM/Data.js',
	// 		'DOM/DOM.Event.js',
	// 		'DOM/Draggable.js',
	// 		'DOM/FX.js',
	// 		'DOM/FX.Methods.js',
	// 		'DOM/Ajax.js',
	// 		'DOM/Form.js',
	// 		'DOM/DOM.Extra.js',
	// 		'DOM/DOM.Event.Gesture.js',
	// 		'DOM/DOM.Event.Press.js',
	// 		'DOM/DOM.Event.Shake.js',
	// 		'DOM/DOM.Event.Touch.js',
	// 		'DOM/Stack.js',
	// 		'DOM/Assets.js',

	// 		'Support/InternetExplorer.js',
	// 		'Support/IOS3.js',
	// 		'Support/Cordova.js',
	// 	],
		
	// 	desc: 'Yaex Library with DOM.'
	// },

	Plugins: {
		src: [
			'Plugins/Transition.js',
			'Plugins/Alert.js',
			'Plugins/ToastMessage.js',
			'Plugins/Button.js',
			'Plugins/Scroller.js',
			'Plugins/Tooltip.js',
			'Plugins/Popover.js',
			'Plugins/AutoFix.js',
			'Plugins/HashRouter.js',
		],
		
		desc: 'Yaex Plugins.',
	}
};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}
