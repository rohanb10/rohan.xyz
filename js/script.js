var navbar, navbarSections, active_section = null, active_work = '';

// clear hash on page load
history.pushState(null, null, window.location.pathname);

// back button fail safe
window.addEventListener('popstate', () => {
	navbarSections.forEach((s) => {
		s.classList.remove('active');
	});
	hideAllSections();
});

document.addEventListener('DOMContentLoaded', () => {
	navbar = document.getElementById('navigation');
	navbarSections = navbar.querySelectorAll('.section-title');
	navbarSections.forEach(section => {
		section.onmouseover = () => killWave();
		section.onmouseout = () => { if (active_section === null) startWave() }
	});
	ripple(1000);
	startWave();
}, false);

const COLOR_SCHEMES = {
	1: ['#EA4347', '#6DC1C5', '#30B06A', '#F7C83B'],
	2: ['#F05C88', '#6F7DF6', '#77CBF9' ,'#FFA805'],
	3: ['#DE5E5E', '#B8EF45' ,'#42B362' ,'#DFA8FF'],
	4: ['#DA496B', '#4D63D1' ,'#629337' ,'#F57E09'],
	5: ['#EFC2B8', '#95BBD9' ,'#BCDC96' ,'#EEDE97'],
	6: ['#913030', '#275A77' ,'#246B50' ,'#C28147'],
}

function changeColorScheme(index = -1, shuffle = true) {
	if (index <= 0 || index > Object.keys(COLOR_SCHEMES).length) {
		return 'Please enter a valid index';
	}
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

// Manually set the colour scheme through the console
function changeColours(c1, c2, c3, c4){
	var root = document.documentElement;
	root.style.setProperty('--color-one', c1);
	root.style.setProperty('--color-two', c2);
	root.style.setProperty('--color-three', c3);
	root.style.setProperty('--color-four', c4);
	currentSchemeIndex = -1;
	return 'New Colours: ' + c1 + ', ' + c2 + ', ' + c3 + ', ' + c4;
}
console.log(`changeColours('#AAAAAA', '#BBBBBB', '#CCCCCC', '#DDDDDD')`);

var isWavy = (section) => section.classList.contains('wave');
function bucket(el) {
	// check if wave is active
	var isWavy = Array.prototype.slice.call(navbarSections).some((section) => section.classList.contains('wave'));
	var numberOfSchemes = Object.keys(COLOR_SCHEMES).length;
	var nextSchemeIndex = currentSchemeIndex;
	while (nextSchemeIndex === currentSchemeIndex) {
		nextSchemeIndex = (Math.floor(Math.random() * numberOfSchemes)) + 1;
	}
	// show / modify tooltip
	el.parentElement.classList.remove('default-colors');
	el.parentElement.classList.add('changed');
	document.querySelector('bucket-tooltip-action');
	animateIn('.bucket-tooltip-action', 'fade-in', () => {
		animateOut('.bucket-tooltip-action', 'fade-out', null, 1500);
	}, 1);

	if (isWavy) {
		killWave();
		setTimeout(() => {
			currentSchemeIndex = changeColorScheme(nextSchemeIndex);
			ripple();
			if (active_section === null) startWave();
		}, 400);
	} else  {
		currentSchemeIndex = changeColorScheme(nextSchemeIndex);
		ripple();
	}
}

// Wave
function ripple(interval = 0) {
	setTimeout(function () {
		navbarSections.forEach((s, i, sections) => {
			setTimeout(rippleUp, 150 * i, s);
			setTimeout(rippleDown, (sections.length * 150) + (200 * i), s);
		});
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
	animateIn('#hero', 'fade-in', () => {
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
		animateOut(`#${active_section}`, 'fade-out-bottom', () => {
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
		animateOut(`#${active_work}`, 'fade-out-right', () => {
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
	const DELAY = 3000;
	var thumbs = [];

	// Reset container
	thumbContainer.innerHTML = '';

	// Gen thumbarray
	for (var i = 0; i < Object.keys(PHOTOS).length; i++) {
		thumbs.push({index: i, path: `assets/photos/thumb/${i}.jpg`, bg: PHOTOS[i].dominantColor});
	}
	// Shuffle array
	thumbs.sort(() => {return 0.5 - Math.random()});
	
	// Build each thumbnail, loading overlay and zoom
	thumbs.forEach((t, i) => {
		var thumb = Object.assign(document.createElement('div'), {
			className: 'thumb fade-in-up',
			style: `animation-delay: ${DELAY + parseInt(i * 150)}ms`,
			onclick: () => openPhotoModal(t.index),
		});

		var overlay = Object.assign(document.createElement('div'), {
			className: 'loading-overlay',
			style: `background-color: ${t.bg}`,
		});
		thumb.appendChild(overlay);
		var hoverTimeout;
		var img = Object.assign(document.createElement('img'), {
			src: t.path,
			onload: () => {
				overlay.style.opacity = 0;
				setTimeout(() => {overlay.style.display = 'none'}, 500);
			},
			onerror: () => {overlay.style.display = 'none'},
			onmousemove: (e) => {img.style.transformOrigin = `${e.offsetX}px ${e.offsetY}px`},
		});
		thumb.appendChild(img);

		thumbContainer.appendChild(thumb);
	})
}

function helper(el) {
	console.log(el);
}

function openPhotoModal(index) {
	// load image/caption
	document.querySelector('.photo-container').style.backgroundImage = `url('assets/photos/${index}.jpg')`;
	document.querySelector('.caption').innerHTML = wrapCaption(PHOTOS[index].caption);

	//show modal
	animateIn('.photo-modal', 'slide-in-up', null, 500);

	document.addEventListener('keydown', escapeToClose);
}

// Wrap caption locations on to next line
function wrapCaption(caption) {
	var locationIndex = caption.lastIndexOf(',', caption.lastIndexOf(',') - 1) + 1;
	return caption.substr(0, locationIndex) + '<br>' + caption.substr(locationIndex);
}

// ESC key to close modal
function escapeToClose(e) {
	console.log(e.keyCode);
	if (e.keyCode === 27) {
		closePhotoModal();
	}
}

function closePhotoModal() {
	animateOut('.photo-modal', 'slide-out-bottom', () => {
		document.querySelector('.photo-container').style.backgroundImage = '';
		document.querySelector('.caption').innerHTML = '';
	});
	document.removeEventListener('keydown', escapeToClose);
}

// Animate functions
function animateOut(elementName, animationName, callback, animationDuration = 500) {
	var el = document.querySelector(elementName);
	el.classList.add(animationName);
	setTimeout(() => {
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
	setTimeout(() => {
		el.classList.remove(animationName);
	}, animationDuration, el);
	if (callback) {
		callback();
	}
}

