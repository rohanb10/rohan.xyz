var sections, wave, navbar, active_section = '', active_work = '';
const NUMBER_OF_PHOTOS = 30;

document.addEventListener('DOMContentLoaded', function() {
	navbar = document.getElementById('navigation');
	sections = navbar.querySelectorAll('.section-title');
	for (var i = 0; i < sections.length; i++){
		sections[i].onmouseover = function() {
			killWave();
		}
		sections[i].onmouseout = function() {
			if (navbar.classList.length === 0) {
				startWave();
			}
		}
	}
	ripple(1000);
	startWave();
}, false);

// Wave
	function ripple(delay) {
		delay = delay === undefined ? 0 : delay;
		setTimeout(function () {
			for (var i = 0; i < sections.length; i++) {
				setTimeout(rippleUp, 150 * i, sections[i]);
				setTimeout(rippleDown, (sections.length * 150) + (200 * i), sections[i]);
			}
		}, delay)
	}

	function rippleUp(section) {
		section.classList.add('wave');
	}
	function rippleDown(section) {
		section.classList.remove('wave');
	}
	function startWave() {
		clearInterval(wave);
		wave = setInterval(ripple, 4000);
	}

	function killWave() {
		clearInterval(wave);
		for (var i = 0; i < sections.length; i++) {
			sections[i].classList.remove('wave');
		}
	}

// Navbar
	function sectionPicker(element, sectionName) {
		//remove current navbar bg colour
		navbar.classList = [];
		killWave();

		//if section is already open, close it
		if (element.classList.contains('focused')) {
			hideAllSections();
			startWave();
			element.classList.remove('focused');
		} else{
			// change open section to sectionName
			showSection(sectionName);

			// change navbar colour to new section
			navbar.classList.add(element.classList[1]);

			// remove .focused class and reset text
			for (var i = 0; i < sections.length; i++) {
				sections[i].classList.remove('focused');
			}
			element.classList.add('focused');
		}
	}

	function hideAllSections() {
		fadeOut('#' + active_section, 'bottom');
		fadeIn('#hero', function() {
			// window.scrollTo({top: 0});
			ripple(1000);
		});
		active_section = '';
	}

	function showSection(sectionName) {
		// pre-loading
		if(sectionName === 'work') {
			console.log(active_work);
			if (active_work !== ''){
				console.log('hello');
				document.querySelector('.work.active').classList.remove('active');
				document.getElementById(active_work).classList.add('hidden');
				active_work = '';
			}
		} else if(sectionName === 'photos') {
			genThumbnails();
		} else if (sectionName === 'about') {
			var img = new Image();
			img.src = 'assets/me.jpg';
			img.src = 'assets/me.gif';
		}

		//Close currently active section, and open new one after
		if (active_section !== '') {
			fadeOut('#'+ active_section, 'bottom', function() {
				fadeIn('#'+sectionName);
				active_section = sectionName;
			});
			// active_section = '';
		} else {

			//Open new section
			fadeIn('#' + sectionName, function() {
				document.getElementById('hero').classList.add('hidden');
			});
			active_section = sectionName;
		}
	}

// Work
	function workPicker(element, workName) {
		var card = document.getElementById(workName);

		// remove current work card / active btn
		if (active_work !== '') {
			document.querySelector('.work.active').classList.remove('active');
			fadeOut('#' + active_work, 'right', function() {
				card.classList.remove('hidden');
			});
		} else {
			card.classList.remove('hidden');
		}
		element.classList.add('active');
		active_work = workName;

		//  Scroll down to card if mobile device (40em)
		if (window.innerWidth <= 640) {
			card.parentElement.scrollIntoView({
				behavior: 'smooth',
			});	
		}
	}

	// helper
	function showWorkCard(card) {
		card.classList.remove('hidden');
	}

// Photos
	function genThumbnails() {
		const thumbContainer = document.getElementById('thumbnail-container');
		// Reset container
		thumbContainer.innerHTML = '';
		var thumbNames = [];
		// Gen thumbarray
		for (var i = 0; i < NUMBER_OF_PHOTOS; i++) {
			thumbNames.push({'index': i, 'thumb': 'assets/photos/thumb/' + i + '.jpg'});
		}
		// Shuffle array
		thumbNames.sort(function() { return 0.5 - Math.random() });

		// Dump onto page
		var delay = 3000;
		for (var i = 0; i < thumbNames.length; i++) {
			// delay the first 12 images for cool animated effect, display the ones after without delay for better peformace
			thumbDelay = (i < 12) ? delay + parseInt(i * 100) : 0;
			var t = '<div class="thumb fade-up" style="animation-delay: ' + thumbDelay + 'ms" onClick="openPhotoModal(this, ' + thumbNames[i].index + ')"><img src="' + thumbNames[i].thumb + '"></div>';
			thumbContainer.innerHTML += t;
		}
	}

	function openPhotoModal(thumb, photoNumber) {
		//preload image
		document.querySelector('.photo-container').style.backgroundImage = "url('assets/photos/" + photoNumber + ".jpg')";
		//onload
		document.querySelector('.caption').innerHTML = wrapCaption(CAPTIONS[photoNumber]);
		//show modal
		document.querySelector('.photo-modal').classList.remove('hidden');
		fadeIn('.modal-content');

		// ESC key to close modal
		document.onkeydown = function(evt) {
	    	evt = evt || window.event;
		    if (evt.keyCode == 27) {
		        closePhotoModal();
		    }
		};
	}

	// Wrap caption locations on to next line
	function wrapCaption(caption) {
		var locationIndex = caption.lastIndexOf(',', caption.lastIndexOf(',')-1) + 1;
		return caption.substr(0, locationIndex) + '<br>' + caption.substr(locationIndex);
	}

	function closePhotoModal() {
		fadeOut('.modal-content', 'bottom', function() {
			document.querySelector('.photo-modal').classList.add('hidden');
			document.querySelector('.caption').innerHTML = ''
		});
	}

// Fade functions
	function fadeOut(elementName, direction, callback) {
		var el = document.querySelector(elementName);
		var fadeClassName = 'fade-out-' + direction;
		el.classList.add(fadeClassName);
		setTimeout(function() {
			el.classList.remove(fadeClassName);
			el.classList.add('hidden');
			if (callback) {
				callback();
			}
		}, 500, el, fadeClassName, callback);
	}

	function fadeIn(elementName, callback) {
		var el = document.querySelector(elementName);
		el.classList.remove('hidden');
		el.classList.add('fade-in');
		setTimeout(function() {
			el.classList.remove('fade-in');
		}, 500, el);
		if (callback) {
			callback();
		}
	}

