+(function ($) {
	if ($.Sound) {
		return;
	}

	//---

	// Module information
	var Module = {
		Name: 'Sound',
		Description: '',
		Author: '',
		URL: '',
		Version: '0.10-dev',
		Date: 'Jan-19-2014',
		Time: '10:51 PM',
		Status: 'Alpha'
	};

	//---

	// Default options for the Module
	var DefaultOptions = {};

	//---

	var SoundsNumber;
	var SupportMP3;
	var URL;
	var Sounds = {};
	var Playing;

	//---

	var CreateSound = function (SoundInformation) {
		var name;
		var volume;

		if (SoundInformation.indexOf(":") !== -1) {
			name = SoundInformation.split(":")[0];
			volume = SoundInformation.split(":")[1];
		} else {
			name = SoundInformation;
		}

		Sounds[name] = new Audio();
		SupportMP3 = Sounds[name].canPlayType('audio/mp3');

		if (SupportMP3 === 'probably' || SupportMP3 === 'maybe') {
			URL = DefaultOptions.Path + name + ".mp3";
		} else {
			URL = DefaultOptions.Path + name + ".ogg";
		}

		// console.log(Sounds[name]);
		// $(document.body).append($(Sounds[name]).prop('src', URL));

		$(Sounds[name]).prop('src', URL);

		Sounds[name].load();
		Sounds[name].preload = 'auto';

		Sounds[name].volume = volume || DefaultOptions.Volume;
	};

	//---

	var PlaySound = function (Information) {
		var $Sound;
		var name;
		var volume;
		var playing_int;

		if (Information.indexOf(":") !== -1) {
			name = Information.split(":")[0];
			volume = Information.split(":")[1];
		} else {
			name = Information;
		}

		$Sound = Sounds[name];

		if (typeof $Sound !== 'object' || $Sound === null) {
			return;
		}


		if (volume) {
			$Sound.volume = volume;
		}

		if (!DefaultOptions.MultiPlay && !Playing) {
			$Sound.play();
			Playing = true;
			playing_int = setInterval(function () {
				if ($Sound.ended) {
					clearInterval(playing_int);
					Playing = false;
				}
			}, 250);
		} else if (DefaultOptions.MultiPlay) {
			if ($Sound.ended) {
				$Sound.play();
			} else {
				try {
					$Sound.currentTime = 0;
				} catch (e) {}

				$Sound.play();
			}
		}
	};

	//---

	var StopSound = function (Name) {
		var $Sound = Sounds[Name];

		if (typeof $Sound !== 'object' || $Sound === null) {
			return;
		}

		$Sound.pause();

		try {
			$Sound.currentTime = 0;
		} catch (e) {}
	};


	var KillSound = function (Name) {
		var $Sound = Sounds[Name];

		if (typeof $Sound !== 'object' || $Sound === null) {
			return;
		}

		try {
			Sounds[Name].src = '';
		} catch (e) {}

		Sounds[Name] = null;
	};

	// Module Methods

	$.Sound = function (Options) {
		DefaultOptions = $.Extend({
			Sounds: [
				'water_droplet'
			],
			Path: 'static/sounds/',
			MultiPlay: true,
			Volume: "0.5"
		}, Options);

		SoundsNumber = DefaultOptions.Sounds.length;

		if (typeof Audio === 'function' || typeof Audio === 'object') {
			for (var x = 0; x < SoundsNumber; x += 1) {
				CreateSound(DefaultOptions.Sounds[x]);
			}
		}

		$.Sound.Play = function (Name) {
			PlaySound(Name);
		};

		$.Sound.Stop = function (Name) {
			stopSound(Name);
		};

		$.Sound.Kill = function (Name) {
			KillSound(Name);
		};
	};

	$.Sound.Destroy = function () {
		for (var x = 0; x < SoundsNumber; x += 1) {
			Sounds[DefaultOptions.Sounds[x]] = null;
		}

		SoundsNumber = 0;

		$.Sound.Play = function () {};
		$.Sound.Stop = function () {};
		$.Sound.Kill = function () {};
	};
})(Yaex)
