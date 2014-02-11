(function ($) {
	'use strict';

	$.fn.AudioPlayer = function () {
		// Global vars
		var dictionary = [];
		var html5 = checkMedia('audio');
		// var $this = $('.cj-music-player');
		var $this = this;
		var agent = navigator.userAgent.toLowerCase();
		var isIE = agent.search('msie') !== -1;
		var blank = agent.search('firefox') !== -1 ? '' : 'about:blank';
		var android = agent.search('android') !== -1 && agent.search('chrome') === -1 && agent.search('firefox') === -1;
		var multiList = false;

		if ($this.length) {
			// iterate through each instance of the plugin found on the page
			$this.each(function () {
				var $this = $(this),
					audio = $this.find('.cj-audio'),
					songList = $this.find('.cj-song-list');
				if (!audio.length || !songList.length) return;

				var vol, numbers, isPlaying, usingText, wasPlaying, numberText,
					usingArrows, usingNumbers, usingPlayPause, hasContainer,
					changedSong, usingButton, titleStop, tweenText,
					startOpen, playTimer, firstRun, tweenPos, songText,
					isActive, fallback, fadeTime, controls, toRight, marLeft,
					isOver, button, cWidth, titles, timer, toAdd, music, pause,
					right, auto, iLeg, urls, isOn, left, play, ids, leg, list = [],
					mList = {};

				// loop through the list of songs
				if (multiList == false) {
					songList.children('li').each(function (i) {
						list[i] = {
							title: $.trim($(this).text()) !== '' ? $(this).html() : '',
							url: $(this).attr('data-song')
						};
					});
				} else {

				}

				// console.log(list);

				if (list.length) {
					init();
				}

				// Activates the player
				function init() {
					isOn = 0;
					urls = [];
					titles = [];
					toRight = 0;
					fadeTime = 300;
					leg = list.length;
					iLeg = leg - 1;
					firstRun = changedSong = true;
					isPlaying = isActive = isOver = false;
					ids = $this.attr('id') ? $this.attr('id') : null;

					fallback = $this.find('object');
					songText = $this.find('.cj-song-text');
					button = $this.find('.cj-music-button');
					controls = $this.find('.cj-music-container');
					auto = convert($this.attr('data-autoplay').toString());
					startOpen = convert($this.attr('data-startopen').toString());
					vol = $this.attr('data-volume') ? $this.attr('data-volume') * 0.01 : 0.75;

					var toGet = $this.attr('class').split('-');
					toAdd = 'cj-music-btn-active-' + toGet[toGet.length - 2];

					dictionary[dictionary.length] = {
						checkPause: pauseCheck,
						flash: changeFlash,
						toggle: toggleMusic,
						change: changeSong,
						next: nextSong,
						id: ids,
						destroy: destroy
					};

					// randomizes the songs
					if (convert($this.attr('data-randomize').toString())) {

						var shuf = [],
							placer;

						for (var i = 0; i < leg; i++) shuf[i] = list[i];

						list = [];

						while (shuf.length > 0) {
							placer = (Math.random() * shuf.length) | 0;
							list[list.length] = shuf[placer];
							shuf.splice(placer, 1);
						}

					}

					for (var j = 0; j < leg; j++) {
						urls[j] = list[j].url;
						titles[j] = list[j].title;
					}

					// if the browser supports HTML5 Audio
					if (html5) {
						$('<source />').attr('src', urls[0]).attr('type', 'audio/mpeg').prependTo(audio);
						$('<source />').attr('src', urls[0].split('mp3').join('ogg')).attr('type', 'audio/ogg').prependTo(audio);

						if (leg === 1) audio.attr('loop', 'loop');

						music = audio[0];
						music.volume = vol;
						music.addEventListener('ended', audioEnded, false);
					// if we need to use the Flash backup
					} else if (fallback.length) {
						fallback = fallback.attr('id');

						try {
							thisMovie().storeVars(vol, urls, ids);
						} catch (event) {}
					}

					play = $this.find('.cj-music-play');
					pause = $this.find('.cj-music-pause');
					numbers = $this.find('.cj-music-numbers');
					left = $this.find('.cj-music-left').data('isArrow', true);
					right = $this.find('.cj-music-right').data({
						isArrow: true,
						isRight: true
					});
					usingText = $this.find('.cj-current-song').length && songText.length ? true : false;
					usingPlayPause = play.length && pause.length ? true : false;
					usingArrows = left.length && right.length ? true : false;
					hasContainer = controls.length ? true : false;
					usingButton = button.length ? true : false;

					// begin to check what assets are being used and which ones are not
					if (numbers.length) {
						usingNumbers = true;
						numberText = numbers.html();
					} else {
						usingNumbers = false;
					}

					if (usingPlayPause && !auto) {
						pause.css('display', 'none');
						play.css('display', 'inline-block');
					}

					if (usingArrows && leg > 1) {
						left.click(handleArrows);
						right.click(handleArrows);
					} else {
						if (left.length) left.hide();
						if (right.length) right.hide();
					}

					if (usingPlayPause) {
						play.click(handlePlayPause);
						pause.click(handlePlayPause);
					} else {
						if (play.length) play.hide();
						if (pause.length) pause.hide();
					}

					if (usingButton) {
						button.click(toggleControls);
					} else if (hasContainer) {
						controls.addClass('cj-music-no-button');
					}

					if (usingText) songText.html(titles[isOn]).mouseover(tOver).mouseout(tOut).click(pauseOthers);
					if (usingNumbers) numbers.html((isOn + 1).toString() + numberText + leg.toString());

					(auto || startOpen) ? toggleControls() : firstRun = false;

					list = null;
				}

				// big button mouse click
				function toggleControls(event) {
					if (event) event.stopPropagation();

					// if we are going to open the player
					if (!isActive) {

						button.addClass(toAdd);

						if (toRight === 0 && hasContainer) {

							cWidth = controls.outerWidth();
							controls.css('display', 'block').width(0);
							marLeft = parseInt(controls.css('left'), 10);
							toRight = cWidth - parseInt(button.css('width'), 10) + 1;

						}

						if (!firstRun) {

							handlePlayPause();
							if (hasContainer) openClose(true);

						} else {

							if (auto) handlePlayPause();

							if (startOpen) {

								button.css('left', toRight);
								if (hasContainer) controls.css({
									left: 0,
									width: cWidth
								});
								if (auto) tweenTitle();

							} else if (auto && hasContainer) {

								openClose(true);

							}

						}

					}

					// if the player is going to be closed
					else {

						button.removeClass(toAdd);

						isPlaying = true;
						handlePlayPause();
						if (hasContainer) openClose(true);

					}

					isActive = !isActive;
					firstRun = false;

				}

				// toggles the player open and closed
				function openClose(opens) {
					if (opens) {
						button.stop(true).animate({
							left: toRight
						}, 750, 'easeOutQuint');
						controls.stop(true).animate({
							left: 0,
							width: cWidth
						}, 750, 'easeOutQuint', tweenTitle);
					} else {
						if (tweenText) clearInterval(tweenText);
						if (timer) clearTimeout(timer);

						button.stop(true).animate({
							left: 0
						}, 750, 'easeOutQuint');
						controls.stop(true).animate({
							left: marLeft,
							width: 0
						}, 750, 'easeOutQuint', updateTitle);

						startOpen = false;
					}
				}

				// text mouse over, pauses song text movement
				function tOver(event) {
					event.stopPropagation();
					isOver = true;
				}

				// text mouse out, restarts song text movement
				function tOut(event) {
					event.stopPropagation();
					isOver = false;
				}

				// updates the song text position
				function updateTitle() {
					if (usingText) {
						songText.css('margin-left', 0);
						tweenPos = 0;
					}
				}

				// prepares the song text for movement

				function tweenTitle(useDelay) {
					if (!usingText) return;

					if (changedSong) {
						titleStop = -(getWidth(titles[isOn]));

						tweenPos = 0;
						songText.css('margin-left', tweenPos);
						songText.html(titles[isOn] + titles[isOn]);
					}

					(!useDelay) ? fireTween() : timer = setTimeout(fireTween, 500);

					changedSong = false;
				}

				// starts text tweening
				function fireTween() {
					tweenText = setInterval(textTween, 50);
				}

				// animates the the text
				function textTween() {
					if (isOver) return;
					(tweenPos > titleStop) ? tweenPos -= 1 : tweenPos = 0;
					songText.css('margin-left', tweenPos);
				}

				// calculates the total width of the song text
				function getWidth(st) {
					var span = $('<span />').html(st).css('display', 'none').appendTo($this),
						wid = span.width();
					
					span.remove();
					
					return wid === wid | 0 ? wid : (wid | 0) + 1;
				}

				// fires when a song ends
				function audioEnded(event) {
					event.stopPropagation();
					isPlaying = false;
					handleArrows(null);
				}

				// previous song, next song click

				function handleArrows(event) {

					clearTimeout(playTimer);
					if (timer) clearTimeout(timer);
					if (tweenText) clearInterval(tweenText);

					var goingRight;
					pauseOthers(ids);
					changedSong = true;

					if (event !== null) {

						if ($(this).data('isArrow')) {

							goingRight = $(this).data('isRight') ? true : false;

							if (goingRight) {

								(isOn < iLeg) ? isOn++ : isOn = 0;

							} else {

								(isOn > 0) ? isOn-- : isOn = iLeg;

							}

						} else {

							goingRight = true;

						}

					} else {

						(isOn < iLeg) ? isOn++ : isOn = 0;

						goingRight = true;

					}

					// if the browser supports HTML5 Audio
					if (html5) {

						music.removeEventListener('ended', audioEnded, false);
						music.pause();

						if (!isIE) {

							music.src = blank;
							music.src = checkType('audio', 'audio/mpeg;') ? urls[isOn] : urls[isOn].split('mp3').join('ogg');

						} else {

							audio.children('source').each(function () {

								$(this).attr('src', urls[isOn]);

							});

						}

						music.volume = vol;
						music.load();

						// needed for Android stock browser
						playTimer = setTimeout(function () {

							music.play();
							music.addEventListener('ended', audioEnded, false);

						}, !android ? 100 : 500);

					}
					// if we need to use the Flash backup
					else {

						try {
							thisMovie().changeSong(goingRight);
						} catch (evt) {}

					}

					if (usingText) songText.html(titles[isOn]);
					if (usingNumbers) numbers.html((isOn + 1).toString() + numberText + leg.toString());

					if (usingPlayPause) {

						play.css('display', 'none');
						pause.css('display', 'inline-block');

					}

					isPlaying = true;
					tweenTitle(true);

				}

				// pauses the player because another instance of the plugin has begun to play

				function pauseCheck() {

					if (usingButton) {

						if (isActive) toggleControls();

					} else {

						isPlaying = true;
						handlePlayPause();

					}

				}

				// play, pause button click event

				function handlePlayPause(event) {

					clearTimeout(playTimer);
					if (event) event.stopPropagation();

					// if the music should pause
					if (isPlaying) {

						if (timer) clearTimeout(timer);
						if (tweenText) clearInterval(tweenText);

						if (html5) {

							music.pause();

						} else {

							try {
								thisMovie().togglePlayPause(false);
							} catch (evt) {}

						}

						if (usingPlayPause) {

							pause.css('display', 'none');
							play.css('display', 'inline-block');

						}

						isPlaying = false;

					}
					// if the music should play
					else {

						pauseOthers(ids);

						if (html5) {

							music.play();

						} else {

							try {
								thisMovie().togglePlayPause(true);
							} catch (evt) {}

						}

						if (event && usingText) tweenTitle();

						if (usingPlayPause) {

							play.css('display', 'none');
							pause.css('display', 'inline-block');

						}

						isPlaying = true;

					}

				}

				// API method, toggles the music on and off

				function toggleMusic(pauseIt) {

					if (typeof pauseIt !== 'undefined') {

						if (pauseIt) {

							if (isPlaying) {

								wasPlaying = true;
								handlePlayPause();

							} else {

								wasPlaying = false;

							}

						} else if (wasPlaying) {

							wasPlaying = false;
							handlePlayPause();

						}

					}

				}

				// API method, changes the song to a specific index

				function changeSong(index) {

					console.log(index);
					console.log(leg);

					if (typeof index !== 'undefined') {

						if (index > -1 && index < leg) {

							isOn = index;
							handleArrows(true);

						}

					}

				}

				// API method to complete destroy the instance of the plugin

				function destroy() {
					if (music && html5) {
						music.pause();
						music.removeEventListener('ended', audioEnded, false);
						music.src = blank;
					}

					if (timer) clearTimeout(timer);
					if (tweenText) clearInterval(tweenText);

					clean($this);
					$this = audio = songList = numbers = numberText = titles = music = pause = right = urls = left = play = button = controls = list = songText = tweenText = timer = null;
				}

				// A recursive function (called from 'destroy' API method) that loops through and cleans up all children

				function clean(obj) {
					var it;
					while (obj.children().length) {
						// it = obj.children(':eq(0)').stop(true).unbind().remove();
						it = obj.children().eq(0).stop(true).unbind().remove();
						clean(it);
					}
				}

				// API method, plays the next song

				function nextSong() {
					handleArrows(null);
				}

				// grabs the Flash object for passing information to the swf

				function thisMovie() {
					return !isIE ? document[fallback] : window[fallback];
				}

				// Called from Flash, the song has ended and we need to update the song number/text

				function changeFlash() {
					isPlaying = false;
					handleArrows(null);
				}
			});
		}

		// checks to see if html5 media is supported

		function checkMedia(media, returnMedia) {

			var md = document.getElementsByTagName(media)[0],
				h5 = false;

			if (typeof md !== 'undefined') h5 = md.canPlayType ? true : false;

			if (!returnMedia) {

				return h5;

			} else {

				return md;

			}

		}

		// checks to see if a media's file type is supported

		function checkType(media, type) {

			return checkMedia(media, true).canPlayType(type);

		}

		// string to boolean conversion

		function convert(st) {

			return st === 'true' ? true : false;

		}

		// loops through all instances of the plugin found on the web page and pauses the ones that are not currently active

		function pauseOthers(id) {

			if (dictionary.length) {

				var i = dictionary.length;

				while (i--) {

					if (dictionary[i].id) {

						if (dictionary[i].id !== id) dictionary[i].checkPause();

					}

				}

			}

		}

		// The way to access the API, params are: 
		/*
			type = the method to call, 
			id = the div selector, 
			arg = optional arguments (play/pause, etc.)
			
		*/
		$.fn.AudioPlayer.API = function (type, id, arg) {

			if (dictionary.length) {

				var i = dictionary.length,
					j = -1;

				// here we find the correct instance of the plugin
				while (i--) {

					if (dictionary[i].id) {

						if (dictionary[i].id === id) {

							j = i;
							break;
						}
					}
				}

				// if the instance is found, let's call an API method
				if (j !== -1) {
					switch (type) {
					// reserved for Flash backup
					case 'flash':
						dictionary[j].flash();
						break;
					// toggle the music on and off
					case 'toggleMusic':
						dictionary[j].toggle(arg);
						break;
					// change the song to a particular song index (starting with 0)
					case 'changeSong':
						dictionary[j].change(arg);
						break;
					// change the song to a particular song index (starting with 0)
					case 'playSong':
						dictionary[j].change(arg);
						break;
					// play the next song
					case 'nextSong':
						dictionary[j].next();
						break;
					// destroy the player
					case 'destroy':
						dictionary[j].destroy();
						dictionary.splice(j, 1);
						break;
					}
				}
			}
		};
	};
})(Yaex);

// Global function called from Flash backup if backup is used

function cjFromFlash(id) {
	$.fn.AudioPlayer.API('flash', id);
}
