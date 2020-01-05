var sections, wave, navbar, active_section = '', active_work = '';
const NUMBER_OF_PHOTOS = 30;

document.addEventListener('DOMContentLoaded', function() {
	navbar = document.getElementById('navigation');
	sections = navbar.querySelectorAll('.section-title');
	ripple();
	startWave();
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
}, false);

// Wave
	function ripple() {
		for (var i = 0; i < sections.length; i++) {
			setTimeout(rippleUp, 150 * i, sections[i]);
			setTimeout(rippleDown, (sections.length * 150) + (200 * i), sections[i]);
		}
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
		navbar.classList = [];
		killWave();
		//if section is section open, close it
		if (!element.classList.contains('focused')) {
			showSection(sectionName);
			// change background colour
			navbar.classList.add(element.classList[1]);
			// reset text colour
			for (var i = 0; i < sections.length; i++) {
				sections[i].classList.remove('focused');
			}
			element.classList.add('focused');
		} else {
			hideSection();
			startWave();
			element.classList.remove('focused');
		}
	}

	function hideSection() {
		//scroll to top before hiding div
		fadeOut('#' + active_section);
		fadeIn('#hero', function() {
			window.scrollTo({top: 0});
		});
		active_section = '';
	}

	function showSection(sectionName) {
		
		if(sectionName === 'photos') {
			genThumbnails();
		}
		//Close currently active section
		if (active_section !== '') {
			document.getElementById(active_section).classList.add('hidden');
			active_section = '';
		}
		//Open new section
		fadeIn('#' + sectionName, function() {
			document.getElementById('hero').classList.add('hidden');
		});
		
		
		active_section = sectionName;
	}

// Work
	function workPicker(element, workName) {
		var card = document.getElementById(workName);

		// remove current work card / active btn
		if (active_work !== '') {
			document.querySelector('.work.active').classList.remove('active');
			document.querySelector('#' + active_work).classList.add('hidden');
			active_work = '';
		}

		// add new workcard / active btn
		element.classList.add('active')
		fadeIn('#' + workName);
		active_work = workName;

		if (window.innerWidth <= 640) {
			card.parentElement.scrollIntoView({
				behavior: 'smooth',
			});	
		}
		
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
		for (var i = 0; i < thumbNames.length; i++) {
			var t = '<div class="thumb" onClick="openPhotoModal(this, ' + thumbNames[i].index + ')"><img src="' + thumbNames[i].thumb + '"></div>';
			thumbContainer.innerHTML += t;
		}
	}

	function openPhotoModal(thumb, photoNumber) {
		//show spinner
		//preload image
		document.querySelector('.photo-container').style.backgroundImage = "url('assets/photos/" + photoNumber + ".jpg')";
		//onload
		document.querySelector('.caption').innerHTML = wrapCaption(CAPTIONS[photoNumber]);
		//hide spinner
		//open modal
		var modal = document.querySelector('.photo-modal');
		fadeIn('.photo-modal');

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
		fadeOut('.photo-modal', function() {
			document.querySelector('.caption').innerHTML = ''
		});
	}

// Fade functions
	function fadeOut(elementName, callback) {
		var el = document.querySelector(elementName);
		el.classList.add('fade-out-bottom');
		setTimeout(function() {
			el.classList.remove('fade-out-bottom');
			el.classList.add('hidden');
			if (callback) {
				callback();
			}
		}, 500, el, callback);
	}

	function fadeIn(elementName, callback) {
		var el = document.querySelector(elementName);
		el.classList.remove('hidden');
		el.classList.add('fade-in-bottom');
		setTimeout(function() {
			el.classList.remove('fade-in-bottom');
		}, 500, el);
		if (callback) {
			callback();
		}
	}
