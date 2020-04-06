var navbar, navbarSections;
var active_section = '', active_work = '';
const NUMBER_OF_PHOTOS = 30;

document.addEventListener('DOMContentLoaded', function() {
	navbar = document.getElementById('navigation');
	navbarSections = navbar.querySelectorAll('.section-title');
	for (var i = 0; i < navbarSections.length; i++){
		navbarSections[i].onmouseover = function() {
			killWave();
		}
		navbarSections[i].onmouseout = function() {
			if (navbar.classList.length === 0) {
				startWave();
			}
		}
	}
	ripple(1000);
	startWave();
}, false);

// Wave
function ripple(interval = 0) {
	setTimeout(function () {
		for (var i = 0; i < navbarSections.length; i++) {
			setTimeout(rippleUp, 150 * i, navbarSections[i]);
			setTimeout(rippleDown, (navbarSections.length * 150) + (200 * i), navbarSections[i]);
		}
	}, interval);
}

function rippleUp(section) {
	section.classList.add('wave');
}
function rippleDown(section) {
	section.classList.remove('wave');
}

var wave;
function startWave() {
	clearInterval(wave);
	wave = setInterval(ripple, 4000);
}

function killWave() {
	clearInterval(wave);
	for (var i = 0; i < navbarSections.length; i++) {
		navbarSections[i].classList.remove('wave');
	}
}
var goop;
// Navbar
function sectionPicker(element, sectionName) {
	killWave();
	//remove current navbar bg colour
	navbar.classList = [];

	//if selected section is already open, shut it down
	if (element.classList.contains('active')) {
		element.classList.remove('active');
		navbar.setAttribute('data-bg-color', '');
		hideAllSections();
	} else{
		// change open section to sectionName
		showSection(sectionName);

		//change navbar bg colour
		navbar.classList.add('active');
		navbar.setAttribute('data-bg-color', element.getAttribute('data-bg-color'));

		// remove .active class and reset text
		for (var i = 0; i < navbarSections.length; i++) {
			navbarSections[i].classList.remove('active');
		}
		element.classList.add('active');
	}
}

function hideAllSections() {
	animateOut('#' + active_section, 'fade-out-bottom');
	animateIn('#hero', 'fade-in', function() {
		ripple(1000);
		startWave();
	}, 500);
	active_section = '';
}

function showSection(sectionName) {
	// pre-loading
	if(active_work !== '' && sectionName !== 'work') {
		document.querySelector('.work.active').classList.remove('active');
		document.getElementById(active_work).classList.add('hidden');
		active_work = '';
	} else if(sectionName === 'photos') {
		genThumbnails();
	} else if (sectionName === 'about') {
		var img = new Image();
		img.src = 'assets/me.jpg';
		img.src = 'assets/me.gif';
	}

	// if no section is open
	if (active_section === ''){
		document.getElementById('hero').classList.add('hidden');
		document.getElementById(sectionName).classList.remove('hidden');
		active_section = sectionName;
	} else {
		animateOut('#'+ active_section, 'fade-out-bottom', function() {
			document.getElementById(sectionName).classList.remove('hidden');
			active_section = sectionName;
		});
	}
}

// Work
function workPicker(element, workName) {
	var card = document.getElementById(workName);

	// remove current work card / active btn
	if (active_work !== '' && active_work != workName) {
		document.querySelector('.work.active').classList.remove('active');
		animateOut('#' + active_work, 'fade-out-right', function() {
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
		// delay the first 12 images for cool animated effect, display the ones after normally for better peformance
		thumbDelay = (i < 15) ? delay + parseInt(i * 100) : 0;
		var t = '<div class="thumb fade-in-up" style="animation-delay: ' + thumbDelay + 'ms" onClick="openPhotoModal(this, ' + thumbNames[i].index + ')"><img src="' + thumbNames[i].thumb + '"></div>';
		thumbContainer.innerHTML += t;
	}
}

function openPhotoModal(thumb, photoNumber) {
	//preload image/caption
	document.querySelector('.photo-container').style.backgroundImage = 'url("assets/photos/' + photoNumber + '.jpg")';
	document.querySelector('.caption').innerHTML = wrapCaption(CAPTIONS[photoNumber]);
	//show modal
	animateIn('.photo-modal', 'slide-in-up', null, 500);

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
	animateOut('.photo-modal', 'slide-out-bottom', function() {
		document.querySelector('.photo-container').style.backgroundImage = '';
		document.querySelector('.caption').innerHTML = '';
	});
}

// Fade functions
function animateOut(elementName, animationName, callback, animationDuration = 500) {
	var el = document.querySelector(elementName);
	el.classList.add(animationName);
	setTimeout(function() {
		el.classList.remove(animationName);
		el.classList.add('hidden');
		if (callback) {
			callback();
		}
	}, animationDuration, el, animationName, callback);
}

function animateIn(elementName, animationName, callback, animationDuration = 500) {
	var el = document.querySelector(elementName);
	el.classList.remove('hidden');
	el.classList.add(animationName);
	setTimeout(function() {
		el.classList.remove(animationName);
	}, animationDuration, el);
	if (callback) {
		callback();
	}
}

