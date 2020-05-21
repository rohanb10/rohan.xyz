var navbar, navbarSections, names, mapContainer, active_section = null, active_work = '', active_photo = null;

// clear hash on page load
history.pushState(null, null, window.location.pathname);

// back button fail safe
window.addEventListener('popstate', () => {
	navbarSections.forEach((s) => {
		s.classList.remove('active');
	});
	hideAllSections();
});

// Wave
var wave, swell, tide, crests = [], troughs = [];
function ripple(delay = 0) {
	clearTimeout(swell);
	swell = setTimeout(function () {
		navbarSections.forEach((s, i, sections) => {
			crests[i] = setTimeout(rippleUp, 150 * i, s, names[i]);
			troughs[i] = setTimeout(rippleDown, (sections.length * 150) + (200 * i), s, names[i]);
		});
	}, delay);
}

function rippleUp(section, name) {
	section.classList.add('wave');
	if (name) name.classList.add('wave');
}
function rippleDown(section, name) {
	section.classList.remove('wave');
	if (name) name.classList.remove('wave');
}

function startWave(rippleDelay = 0) {
	if (rippleDelay > 0) ripple(rippleDelay);
	clearInterval(wave);
	clearTimeout(tide);
	tide = setTimeout(() => {wave = setInterval(ripple, 4000)}, rippleDelay);
}

function killWave(except) {
	clearTimeout(tide);
	clearTimeout(swell);
	clearInterval(wave);
	navbarSections.forEach((s,i) => {
		// kill all rippleUps
		clearTimeout(crests[i]);
		// kill all rippleDowns except i
		if (i === except) {
			clearTimeout(troughs[i]);
		} else {	
			rippleDown(s, names[i]);
		}
	});
}

// Navbar
function navControl(navButton) {
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

var mapFilesLoadedCount = 0;
function showSection(sectionID) {
	// pre-loading
	switch(sectionID) {
		case 'id-work':
			loadFile('smoothscroll', 'js')
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

		case 'id-maps':
			mapContainer.classList.remove('fade-in');
			// mapContainer.style.opacity = 0;
			mapFilesLoadedCount = 0;
			loadFile('rides', 'js');
			loadFile('mapbox', 'js', 'https://api.mapbox.com/mapbox.js/v3.3.1/mapbox.js');
			loadFile('mapbox', 'css', 'https://api.mapbox.com/mapbox.js/v3.3.1/mapbox.css');
			setTimeout(() => {
				var allFilesLoaded = setInterval(() => {
					if (mapFilesLoadedCount >= 3) {
						if (map === undefined) initializeMap();
						mapContainer.classList.add('fade-in');
						// mc.style.opacity = 1;
						clearTimeout(allFilesLoaded);
					}
				}, 250)
			}, 1500);
			break;
		case 'id-about':
			document.getElementById('me-jpg').src = 'assets/me.jpg';
			document.getElementById('me-gif').src = 'assets/me.gif';
			break;
	}

	// if no section is open
	if (active_section === null){
		toggleHero();
		// document.getElementById('hero').classList.add('minimise');
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
function toggleHero() {
	var hero = document.querySelector('#hero');
	if (hero.style.height === `0px`){ hero.style.height = `calc(var(--vh, 1vh) * 60)`;}
	else {hero.style.height = '0px'}
}

function loadFile(name, type, url) {
	// Check that script hasnt been loaded already
	if(document.querySelectorAll(`.${type}-${name}`).length > 0){
		mapFilesLoadedCount ++;
		return;
	};
	var tag = Object.assign(document.createElement(type === 'js' ? 'script' : 'link'), {
		... type === 'js' && url === undefined ? {src: `js/${name}.js`} : {},
		... type === 'js' && url !== undefined ? {src: url} : {},
		... type === 'css' ? {rel: 'stylesheet'} : {},
		... type === 'css' && url === undefined ? {href: `css/${name}.css`} : {},
		... type === 'css' && url !== undefined ? {href: url} : {},
		className: `${type}-${name}`
	});
	tag.onload = () => {mapFilesLoadedCount ++}
	if (type === 'js') document.body.appendChild(tag);
	if (type === 'css') document.head.appendChild(tag);
}

function hideAllSections() {
	navbar.setAttribute('data-open', 'false');
	document.getElementById('section-container').classList.remove('active');
	
	// document.getElementById('hero').classList.remove('minimize');
	toggleHero();
	killWave();
	startWave(1500);

	history.pushState(null, null, window.location.pathname);

	animateOut('#' + active_section, 'fade-out-bottom');
	active_section = null;
	track('Back to Home', '#home');
}

function fillWave() {
	killWave()
	navbarSections.forEach((s, i, sections) => {
			setTimeout(rippleUp, 150 * i, s, names[i]);
		});
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
		card.parentElement.scrollIntoView({behavior:'smooth'});
	}
	history.pushState('', '', `#work?${workName}`);
	track(`Work - ${workName}`);
}

// analytics
function track(name, el = false) {
	if (window.location.protocol == 'file:'){console.log(`Clicky | ${el ? el : window.location.hash} | ${name}`);return}
	if (typeof clicky === 'undefined') return;
	clicky.log(el ? el : window.location.hash, name)
}

function stopTracking() {
	track = () => {return};
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

var debounced;
function mobileViewportHack() {
	document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
var window_height = window.innerHeight
window.addEventListener('resize', (e) => {
	if (window.innerHeight === window_height) return;
	clearTimeout(debounced);
	debounced = setTimeout(mobileViewportHack, 100);
});
mobileViewportHack();

window.addEventListener('orientationchange', mobileViewportHack);

document.querySelectorAll('.social a').forEach(s => {
	s.addEventListener('click', () => {
		track(`Social clicked - ${s.getAttribute('data-name') ? s.getAttribute('data-name') : s.hostname}`);
	})
})

document.addEventListener('DOMContentLoaded', () => {
	navbar = document.getElementById('navigation');
	navbarSections = navbar.querySelectorAll('.section-title');
	names = document.querySelectorAll('#hero span span');
	mapContainer = document.querySelector('.map-container');
	navbarSections.forEach((span,i) => {
		span.addEventListener('mouseover', () => {killWave(i);if (active_section === null) names[i].classList.add('wave')});
		span.addEventListener('mousemove', () => {if (active_section === null) names[i].classList.add('wave')});
		span.addEventListener('mouseout', () => {killWave(); if (active_section === null) startWave(1500)});
	});
	startWave(1000);
}, false);