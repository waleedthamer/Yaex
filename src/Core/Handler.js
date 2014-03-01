

	//---

	/**
	 * Yaex.Handler is a base class for handler classes that are used internally 
	 * to inject interaction features.
	 */
	Yaex.Handler = Yaex.Class.Extend({

		//
		Initialise: function (map) {
			this._map = map;
		},

		Enable: function () {
			if (this._Enabled) {
				return;
			}

			this._Enabled = true;

			this.addHooks();
		},

		Disable: function () {
			if (!this._Enabled) {
				return;
			}

			this._Enabled = false;

			this.removeHooks();
		},

		Enabled: function () {
			return !!this._Enabled;
		}
	}); // END OF Yaex.Handler OBJECT

	//---

