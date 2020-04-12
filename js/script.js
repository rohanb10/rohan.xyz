var navbar, navbarSections, active_section = null, active_work = '';
const NUMBER_OF_PHOTOS = 30;

// clear hash on page load
history.pushState(null, null, window.location.pathname);

// back button fail safe
window.addEventListener('popstate', function() {
	navbarSections.forEach((s) => {
		s.classList.remove('active');
	});
	hideAllSections();
});

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

const COLOR_SCHEMES = {
	1: ['#EA4347', '#6DC1C5', '#30B06A', '#F7C83B'],
	2: ['#F05C88', '#6F7DF6', '#77CBF9' ,'#FFA805'],
	3: ['#DE5E5E', '#B8EF45' ,'#42B362' ,'#DFA8FF'],
	4: ['#DA496B', '#4D63D1' ,'#629337' ,'#F57E09'],
	5: ['#EFC2B8', '#95BBD9' ,'#BCDC96' ,'#EEDE97'],
	6: ['#913030', '#214C63' ,'#246B50' ,'#C28147'],
}

function changeColorScheme(index = false, shuffle = true) {
	// check if manually set or pick from random
	index = index || (Math.floor(Math.random() * Object.keys(COLOR_SCHEMES).length + 1));

	// get from array and maybe shuffle
	var scheme = COLOR_SCHEMES[index];
	scheme = shuffle ? scheme.sort(() => {return 0.5 - Math.random()}) : scheme;

	// apply it to the css variables
	var root = document.documentElement;
	root.style.setProperty('--color-one', scheme[0]);
	root.style.setProperty('--color-two', scheme[1]);
	root.style.setProperty('--color-three', scheme[2]);
	root.style.setProperty('--color-four', scheme[3]);
	return index;
}
var currentSchemeIndex = changeColorScheme(1);

function bucket(el) {
	killWave();
	var numberOfSchemes = Object.keys(COLOR_SCHEMES).length;
	var nextSchemeIndex = currentSchemeIndex;
	while (nextSchemeIndex === currentSchemeIndex) {
		nextSchemeIndex = (Math.floor(Math.random() * numberOfSchemes)) + 1;
	}
	// show / modify tooltip
	el.classList.remove('default-colors');
	document.querySelector('bucket-tooltip-action');
	animateIn('.bucket-tooltip-action', 'fade-in', function() {
		animateOut('.bucket-tooltip-action', 'fade-out', null, 1500);
	}, 1);

	currentSchemeIndex = changeColorScheme(nextSchemeIndex);
	// replay animations
	if (navbar.classList.length === 0) {
		ripple(500);
		startWave();
	} else {
		ripple();
	}
}

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
	navbarSections.forEach((s) => {
		s.classList.remove('wave');
	});
}

// Navbar
function sectionPicker(navButton) {
	var sectionName = navButton.querySelector('span').getAttribute('data-content');
	killWave();

	//reset navbar bg and buttons
	navbar.setAttribute('data-bg-color', '');
	navbar.classList.remove('active');
	navbarSections.forEach((s) => {
		s.classList.remove('active');
	});

	//if selected section is already open, shut it down
	if (sectionName === active_section) {
		hideAllSections();
	} else{
		// open section
		showSection(sectionName);

		//change navbar bg colour and .active
		navbar.setAttribute('data-bg-color', navButton.getAttribute('data-bg-color'));
		navbar.classList.add('active');
		navButton.classList.add('active');
		document.getElementById('section-container').classList.add('active');
		
		history.pushState('', '', '#');
	}
}

function hideAllSections() {
	navbar.setAttribute('data-bg-color', '');
	document.getElementById('section-container').classList.remove('active');
	animateOut('#' + active_section, 'fade-out-bottom');
	animateIn('#hero', 'fade-in', function() {
		ripple(1000);
		startWave();
	}, 500);

	history.pushState(null, null, window.location.pathname);
	active_section = null;
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
	if (active_section === null){
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
	thumbNames.sort(() => {return 0.5 - Math.random()});

	// Dump onto page
	var delay = 3000;
	for (var i = 0; i < thumbNames.length; i++) {
		// delay the first 15 images for cool animated effect, display the ones after normally for better peformance
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

// Animate functions
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

