var deps = {
	Core: {
		src: [
			'Yaex.js',
			'Core.js', 
			'Event.js', 
			'Ajax.js', 
			'Form.js', 
			'IE.js'
		],
		
		desc: 'Yaex core library'
	},
	
	All: {
		src: [
			'Yaex.js',
			'Core.js', 
			'ObjectOriented.js', 
			'Assets.js', 
			'Detect.js', 
			'IE.js', 
			'Selector.js', 
			'Data.js', 
			'Callbacks.js', 
			'Deferred.js', 
			'Extra.js', 
			'Event.js', 
			'HashChange.js', 
			'MouseWheel.js', 
			'OnPress.js', 
			'OnShake.js', 
			'Ajax.js', 
			'Router.js', 
			'FX.js', 
			'FX.Methods.js', 
			'Form.js', 
			'Touch.js', 
			'Stack.js', 
			'Logger.js', 
			'IOS.js'
		],
		
		desc: 'Yaex full library'
	},

	Plugins: {
		src: [
			'Plugins/Transition.js',
			'Plugins/Sound.js',
			'Plugins/Tab.js',
			'Plugins/Alert.js',
			'Plugins/ToastMessage.js',
			'Plugins/Button.js',
			'Plugins/Dropdown.js',
			'Plugins/Scroller.js',
			'Plugins/Tooltip.js',
			'Plugins/Popover.js',
			'Plugins/AutoFix.js',
			'Plugins/AudioPlayer.js'
		],
		
		desc: 'The library Plugins.',
	}
};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}
