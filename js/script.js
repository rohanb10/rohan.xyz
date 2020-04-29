var navbar, navbarSections, active_section = null, active_work = '', active_photo = null;

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
	3: ['#DE5E5E', '#45B6EF' ,'#42B362' ,'#DFA8FF'],
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
		navbar.setAttribute('data-open', 'true');
		navbar.classList.add('active');
		navButton.classList.add('active');
		document.getElementById('section-container').classList.add('active');
		
		history.pushState('', '', '#');
	}
}

function hideAllSections() {
	navbar.setAttribute('data-open', 'false');
	document.getElementById('section-container').classList.remove('active');
	
	document.getElementById('hero').classList.remove('minimize');
	ripple(1000);
	startWave();

	history.pushState(null, null, window.location.pathname);

	animateOut('#' + active_section, 'fade-out-bottom');
	active_section = null;
	
}

function showSection(sectionName) {
	// pre-loading
	if (sectionName === 'work' && active_work !== '') {
		document.querySelector('.work.active').classList.remove('active');
		document.getElementById(active_work).classList.add('hidden');
		active_work = '';
	} else if (sectionName === 'photos') {
		genThumbnails();
	} else if (sectionName === 'about') {
		var img = new Image();
		img.src = 'assets/me.jpg';
		img.src = 'assets/me.gif';
	}

	// if no section is open
	if (active_section === null){
		// document.getElementById('hero').classList.add('hidden');
		document.getElementById('hero').classList.add('minimize');
		//wait for minimize to complete
		setTimeout(() => {
			document.getElementById(sectionName).classList.remove('hidden');
		}, 1000);
	} else {
		animateOut(`#${active_section}`, 'fade-out-bottom', () => {
			document.getElementById(sectionName).classList.remove('hidden');
		});
	}
	active_section = sectionName;
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

function genThumbnails() {
	const thumbContainer = document.getElementById('thumbnail-container');
	const delay = 2000;
	var thumbs = [];

	// Reset container
	thumbContainer.innerHTML = '';

	// Shuffle array
	PHOTOS.sort(() => {return 0.5 - Math.random()});
	
	// Build each thumbnail DOMobject, loading placeholder and zoom
	PHOTOS.forEach((t, i) => {
		var thumb = Object.assign(document.createElement('div'), {
			className: 'thumb fade-in-up',
			// className: 'thumb',
			style: `animation-delay: ${((i < 15) ? delay + parseInt(i * 100) : 0)}ms`,
			onclick: () => openPhotoModal(i),
		});

		var placeholder = Object.assign(document.createElement('div'), {
			className: 'placeholder',
			style: `background-color: ${t.bg}`,
		});
		thumb.appendChild(placeholder);

		var img = Object.assign(document.createElement('img'), {
			src: `assets/photos/thumb/${t.index}.jpg`,
			onload: () => {
				placeholder.style.opacity = 0;
				setTimeout(() => {placeholder.style.display = 'none'}, 500);
			},
			onerror: () => {placeholder.style.display = 'none'},
		});
		img.onmouseover = () => {
			setTimeout(() => {
				this.addEventListener('mousemove', panZoom, false, this);
			}, 300);
		}
		img.onmouseout = () => {
			img.removeEventListener('mousemove', panZoom);
		}
		thumb.appendChild(img);

		thumbContainer.appendChild(thumb);
	})
}

function panZoom(e){
	e.target.style.transformOrigin = `${e.offsetX}px ${e.offsetY}px`
}

function openPhotoModal(i) {
	loadPhoto(i);
	animateIn('.photo-modal', 'slide-in-up', null, 500);
	document.addEventListener('keydown', escapeToClose);
}

function loadPhoto(i, delay = 0) {
	// Load image in background before showing in div
	Object.assign(document.createElement('img'), {
		src: `assets/photos/${PHOTOS[i].index}.jpg`,
		onload: () => {
			setTimeout(() => {
				document.querySelector('.photo-container').style.backgroundImage = `url('assets/photos/${PHOTOS[i].index}.jpg')`;
				endLoadingAnimation();
			}, delay);
		},
		onerror: () => {endLoadingAnimation()},
	});

	document.querySelector('.caption').innerHTML = formatCaptions(PHOTOS[i].caption);
	active_photo = i;

	var next = document.querySelector('.modal-next-btn');
	var prev = document.querySelector('.modal-prev-btn');
	if (active_photo + 1 >= PHOTOS.length) {
		next.classList.add('disabled');
	} else if (active_photo <= 0) {
		prev.classList.add('disabled');
	} else {
		next.classList.remove('disabled');
		prev.classList.remove('disabled');
	}
}

function nextPhoto() {
	if (active_photo + 1 >= PHOTOS.length) return;
	active_photo++;
	startLoadingAnimation(true);
	loadPhoto(active_photo, 500);
}

function prevPhoto() {
	if (active_photo <= 0) return;
	active_photo--;
	startLoadingAnimation(true);
	loadPhoto(active_photo, 500);
}

// Animate the loading bars out and then fadeout the overlay
function endLoadingAnimation() {
	var modalDiv = document.querySelector('.modal-content')
	var bars = modalDiv.querySelectorAll('.bar');
	var animationCount = bars.length;
	var completedAnimations = 0;
	bars.forEach((bar, i) => {
		bar.addEventListener('animationiteration', function _listener(e) {
			e.target.classList.add('done');
			completedAnimations++;
			bar.removeEventListener('animationiteration', _listener);
			if (completedAnimations >= animationCount) {
				setTimeout(() => {modalDiv.classList.add('loaded')}, 500);
			}
		});
	});
}

function startLoadingAnimation(alreadyOpen = false) {
	var modalDiv = document.querySelector('.modal-content');
	modalDiv.classList.remove('loaded');
	if (alreadyOpen) {
		modalDiv.classList.add('no-staggered-delays');	
	} else {
		modalDiv.classList.remove('no-staggered-delays');
	}

	modalDiv.querySelectorAll('.bar').forEach((bar, i) => {
		setTimeout(() => {bar.classList.remove('done')}, i*100);
	});
}

function formatCaptions(c) {
	var locationIndex = c.lastIndexOf(',', c.lastIndexOf(',') - 1) + 1;
	return c.substr(0, locationIndex) + '<br>' + c.substr(locationIndex);
}

// ESC key to close modal
function escapeToClose(e) {
	if (e.keyCode === 27) {
		closePhotoModal();
	}
}

function closePhotoModal() {
	animateOut('.photo-modal', 'slide-out-bottom', () => {
		document.querySelector('.photo-container').style.backgroundImage = '';
		document.querySelector('.caption').innerHTML = '';
		startLoadingAnimation();
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
		if (callback) callback();
	}, animationDuration, el, animationName, callback);
}

function animateIn(elementName, animationName, callback, animationDuration = 500) {
	var el = document.querySelector(elementName);
	el.classList.remove('hidden');
	el.classList.add(animationName);
	setTimeout(() => {
		el.classList.remove(animationName);
	}, animationDuration, el);
	if (callback) callback();
}

