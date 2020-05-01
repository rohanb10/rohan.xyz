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

function rgbArray(rgb) {
	rgb = rgb.substr(4).split(')')[0].split(',');
	return [parseInt(rgb[0]),parseInt(rgb[1]),parseInt(rgb[2])];
}

function transitionColorScheme(schemeID, callback) {
	var root = document.documentElement.style;
	var nextColors = [], currentColors = [], colorTimers = [], done=0;

	var scheme = COLOR_SCHEMES[schemeID].sort(() => {return 0.5 - Math.random()});
	scheme.forEach((c,i) => {
		nextColors.push(rgbArray(c));
		currentColors.push(rgbArray(root.getPropertyValue(`--color-${i+1}`)));
	});

	currentColors.forEach((rgb, i) => {
		colorTimers[i] = setInterval(()=> {
			rgb.forEach((cc,j) => {
				rgb[j] = cc > nextColors[i][j] ? cc - 1 : cc < nextColors[i][j] ? cc + 1 : cc;
			})
			root.setProperty(`--color-${i+1}`, `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`);
			if (rgb[0] === nextColors[i][0] && rgb[1] === nextColors[i][1] && rgb[2] === nextColors[i][2]) {
				clearInterval(colorTimers[i]);
				if (++done >= 4 && callback) callback();
			}
		}, 1);
	});
}

const COLOR_SCHEMES = {
	1: ['rgb(247,200, 59)', 'rgb( 48,176,106)', 'rgb(109,193,197)', 'rgb(234, 67, 71)'],
	2: ['rgb(240, 92,136)', 'rgb(111,125,246)', 'rgb(119,203,249)', 'rgb(255,168,  5)'],
	3: ['rgb(222, 94, 94)', 'rgb( 69,182,239)', 'rgb( 66,179, 98)', 'rgb(223,168,255)'],
	4: ['rgb(218, 73,107)', 'rgb( 77, 99,209)', 'rgb( 98,147, 55)', 'rgb(245,126,  9)'],
	5: ['rgb(239,194,184)', 'rgb(149,187,217)', 'rgb(188,220,150)', 'rgb(238,222,151)'],
	6: ['rgb(145, 48, 48)', 'rgb( 39, 90,119)', 'rgb( 36,107, 80)', 'rgb(194,129, 71)'],
}

function changeColorScheme(index = -1, shuffle = true) {
	if (index <= 0 || index > Object.keys(COLOR_SCHEMES).length) return 'Please enter a valid index';

	// check if manually set or pick from random
	index = index || (Math.floor(Math.random() * Object.keys(COLOR_SCHEMES).length + 1));

	// get from array and maybe shuffle
	var scheme = COLOR_SCHEMES[index];
	scheme = shuffle ? scheme.sort(() => {return 0.5 - Math.random()}) : scheme;

	// apply it to the css variables
	var root = document.documentElement;
	root.style.setProperty('--color-1', scheme[0]);
	root.style.setProperty('--color-2', scheme[1]);
	root.style.setProperty('--color-3', scheme[2]);
	root.style.setProperty('--color-4', scheme[3]);
	return index;
}
var currentSchemeIndex = changeColorScheme(1);

// Manually set the colour scheme through the console
function changeColours(c){
	var root = document.documentElement;
	var returnString = 'New Colours: '
	c.forEach((hex,i) => {
		hex = `rgb(${+`0x${hex[1]}${hex[2]}`},${+`0x${hex[3]}${hex[4]}`},${+`0x${hex[5]}${hex[6]}`})`
		root.style.setProperty(`--color-${i+1}`, hex);
		returnString += hex + ', ';
	});
	currentSchemeIndex = -1;
	return returnString;
}
console.log(`changeColours(['#AAAAAA', '#BBBBBB', '#CCCCCC', '#DDDDDD'])`);

function bucket(el) {
	if (el.parentElement.classList.contains('changing')) return;

	var nextSchemeIndex = currentSchemeIndex;
	while (nextSchemeIndex === currentSchemeIndex) {
		nextSchemeIndex = (Math.floor(Math.random() * Object.keys(COLOR_SCHEMES).length)) + 1;
	}

	// show / modify tooltip
	el.parentElement.classList.add('changing');
	setTimeout(() => {el.parentElement.classList.remove('changing')}, 1500);

	if (active_section !== null) {
		transitionColorScheme(nextSchemeIndex, () => {
			ripple();
		});
	} else {
		var isWavy = navbar.querySelector('.section-title.wave');
		killWave();
		setTimeout(() => {
			currentSchemeIndex = changeColorScheme(nextSchemeIndex);
			ripple();
			startWave();
		}, isWavy ? 400 : 0);
	}
	currentSchemeIndex = nextSchemeIndex;
	track(`Colour Changed: ${nextSchemeIndex}`, '#bucket');
}

// Wave
var wave, crests = [];
function ripple(interval = 0) {
	setTimeout(function () {
		navbarSections.forEach((s, i, sections) => {
			crests[i] = setTimeout(rippleUp, 150 * i, s);
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

function startWave() {
	clearInterval(wave);
	wave = setInterval(ripple, 4000);
}

function killWave() {
	clearInterval(wave);
	navbarSections.forEach((s,i) => {
		clearTimeout(crests[i]);
		rippleDown(s);
	});
}

// Navbar
function sectionPicker(navButton) {
	var sectionID = navButton.querySelector('span').getAttribute('data-section-id');
	var sectionName = navButton.querySelector('span').getAttribute('data-section-name');
	killWave();

	//reset navbar bg and buttons
	navbar.classList.remove('active');
	navbarSections.forEach((s) => {
		s.classList.remove('active');
	});

	//if selected section is already open, shut it down
	if (sectionID === active_section) {
		hideAllSections();
		track('Back to Home', '#Home');
	} else{
		// open section
		showSection(sectionID);
		//change navbar bg colour and .active
		navbar.setAttribute('data-bg-color', navButton.getAttribute('data-bg-color'));
		navbar.setAttribute('data-open', 'true');
		navbar.classList.add('active');
		navButton.classList.add('active');
		document.getElementById('section-container').classList.add('active');
		
		history.pushState('', '', `#${sectionName}`);
		track(sectionName);
	}
}

function hideAllSections() {
	navbar.setAttribute('data-open', 'false');
	document.getElementById('section-container').classList.remove('active');
	
	document.getElementById('hero').classList.remove('minimize');
	killWave();
	ripple(1000);
	startWave();

	history.pushState(null, null, window.location.pathname);

	animateOut('#' + active_section, 'fade-out-bottom');
	active_section = null;
}

function showSection(sectionID) {
	// pre-loading
	switch(sectionID) {
		case 'id-work':
			if (active_work === '') break;
			document.querySelector('.work.active').classList.remove('active');
			document.getElementById(active_work).classList.add('hidden');
			active_work = '';
			break;

		case 'id-skills':
			document.querySelectorAll('.img-skill').forEach((img) => {img.src = img.getAttribute('data-src')});
			break;

		case 'id-photos':
			closePhotoModal();
			genThumbnails();
			break;

		case 'id-about':
			document.getElementById('me-jpg').src = 'assets/me.jpg';
			document.getElementById('me-gif').src = 'assets/me.gif';
			break;
	}

	// if no section is open
	if (active_section === null){
		document.getElementById('hero').classList.add('minimize');
		//wait for minimize to complete
		setTimeout(() => {
			document.getElementById(sectionID).classList.remove('hidden');
		}, 1000);
	} else {
		// changing sections
		window.scroll({ top: 0, left: 0, behavior: 'smooth' });
		animateOut(`#${active_section}`, 'fade-out-bottom', () => {
			document.getElementById(sectionID).classList.remove('hidden');
		});
	}
	active_section = sectionID;
}

// Work
function workPicker(element, workName) {
	// cancel if already open
	if (active_work === workName) return;

	var card = document.getElementById(workName);
	if (active_work === '') {
		card.classList.remove('hidden');
	} else {
		// hide preivous card if one is open
		document.querySelector('.work.active').classList.remove('active');
		animateOut(`#${active_work}`, 'fade-out-right', () => {
			card.classList.remove('hidden');
		});
	}
	element.classList.add('active');
	active_work = workName;
	//  Scroll down to card if mobile device (40em)
	if (window.innerWidth <= 640) {
		window.scroll({ top: document.querySelector(`#${active_section} .left-col`).scrollHeight, left: 0, behavior: 'smooth' });
	}
	history.pushState('', '', `#work?${workName}`);
	track(`Work - ${workName}`);
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
				img.addEventListener('mousemove', panZoom, false, this);
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

	// ESC key to close modal
	document.addEventListener('keydown', function _close(e) {
		if (e.keyCode === 27) {
			closePhotoModal();
			document.removeEventListener('keydown', _close);
		}
	});
}

function loadPhoto(i, delay = 0) {
	// Load image in background before showing in div
	Object.assign(document.createElement('img'), {
		src: `assets/photos/${PHOTOS[i].index}.jpg`,
		onload: () => {
			setTimeout(() => {
				document.querySelector('.photo-container').style.backgroundImage = `url('assets/photos/${PHOTOS[i].index}.jpg')`;
				endLoadingAnimation();
				track(identifyPhoto(PHOTOS[i].caption));
			}, delay);
		},
		onerror: () => {endLoadingAnimation()},
	});
	history.pushState('', '', `#photos?${i+1}`);
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

	// fallback for shit browsers
	var barTimers = []
	var fallback = setTimeout(() => {
		bars.forEach((bar, i) => {
			barTimers[i] = setTimeout(()=>{bar.classList.add('done')}, i*100);
		});
		setTimeout(()=>{modalDiv.classList.add('loaded')},500);
	}, 3000);

	bars.forEach((bar, i) => {
		bar.addEventListener('animationiteration', function _listener(e) {
			if (i === 0 || completedAnimations > 0){
				e.target.classList.add('done');
				completedAnimations++;
				bar.removeEventListener('animationiteration', _listener);
				clearTimeout(barTimers[i]);
			}
			if (completedAnimations >= animationCount) {
				setTimeout(() => {
					modalDiv.classList.add('loaded');
					clearTimeout(fallback);
				}, 500);
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
		setTimeout(() => {bar.classList.remove('done')}, i * 100);
	});
}

function formatCaptions(c) {
	var locationIndex = c.lastIndexOf(',', c.lastIndexOf(',') - 1) + 1;
	return c.substr(0, locationIndex) + '<br>' + c.substr(locationIndex);
}

function identifyPhoto(c) {
	if (c.substr(0, c.indexOf(',')).indexOf('Park') >= 0 || c.indexOf(',') <= 12) return c.substr(0, c.indexOf(','));
	var stop = c.indexOf(' ');
	while (stop < 12) {
		stop = c.indexOf(' ', stop + 1);
		if (c.indexOf(',') <= stop) return c.substr(0, c.indexOf(','));
	}
	return c.substr(0, stop);
}

function closePhotoModal() {
	animateOut('.photo-modal', 'slide-out-bottom', () => {
		document.querySelector('.photo-container').style.backgroundImage = '';
		document.querySelector('.caption').innerHTML = '';
		startLoadingAnimation();
	});
	history.pushState('', '', '#photos');
}

function track(name, el = false) {
	if (typeof clicky === 'undefined') return;
	clicky.log(el ? el : window.location.hash, name)
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

