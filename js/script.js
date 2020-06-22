var navbar, navbarSections, names, mapContainer, active_section = null, active_work = '', active_photo = -1;

// clear hash on page load
history.pushState(null, null, window.location.pathname);

// back button fail safe
window.addEventListener('popstate', _ => {
	navbarSections.forEach(s => s.classList.remove('active'));
	hideAllSections();
	track('Back button clicked', 'browser', 'Home')
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
	tide = setTimeout(_ => wave = setInterval(ripple, 4000), rippleDelay);
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

function highTide() {
	killWave();
	navbarSections.forEach((s, i, sections) => setTimeout(rippleUp, 150 * i, s, names[i]));
}

// Navbar
function navControl(navButton) {
	var sectionID = navButton.querySelector('span').getAttribute('data-section-id');
	var sectionName = navButton.querySelector('span').getAttribute('data-section-name');
	killWave();

	//reset navbar bg and buttons
	navbar.classList.remove('active');
	navbarSections.forEach(s => s.classList.remove('active'));

	//if selected section is already open, shut it down
	if (sectionID === active_section) {
		hideAllSections();
		track('Sections Closed', 'navbar', 'Home');
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
		track('Section Changed', 'navbar', sectionName)
	}
}

var mapFilesLoadedCount = 0;
function showSection(sectionID) {
	// pre-loading
	switch(sectionID) {
		case 'id-work':
			document.querySelectorAll('.card .logo img').forEach(l => l.src = l.getAttribute('data-src'));
			if (active_work === '') break;
			document.querySelector('.work.active').classList.remove('active');
			document.getElementById(active_work).classList.add('hidden');
			active_work = '';
			break;

		case 'id-skills':
			loadSkills();
			break;

		case 'id-photos':
			if (active_photo !== -1) {
				active_photo = -1;
				closePhotoModal(false);
			}
			genThumbnails();
			break;

		case 'id-maps':
			mapContainer.classList.remove('fade-in');
			mapFilesLoadedCount = 0;
			loadFile('rides', 'js');
			loadFile('mapbox', 'js', 'https://api.mapbox.com/mapbox.js/v3.3.1/mapbox.js');
			loadFile('mapbox', 'css', 'https://api.mapbox.com/mapbox.js/v3.3.1/mapbox.css');
			setTimeout(_ => {
				var allFilesLoaded = setInterval(_ => {
					if (mapFilesLoadedCount >= 3) {
						if (map === undefined) initializeMap();
						mapContainer.classList.add('fade-in');
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
		//wait for minimize to complete
		setTimeout(_ => document.getElementById(sectionID).classList.remove('hidden'), 1000);
	} else {
		// changing sections
		window.scroll({ top: 0, left: 0, behavior: 'smooth' });
		animateOut(`#${active_section}`, 'fade-out-bottom', _ => document.getElementById(sectionID).classList.remove('hidden'));
	}
	active_section = sectionID;
}
function toggleHero() {
	var hero = document.getElementById('hero');
	hero.style.height = hero.style.height === `0px` ? `calc(var(--vh, 1vh) * 60)` : `0px`;
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
	tag.onload = _ => mapFilesLoadedCount ++
	if (type === 'js') document.body.appendChild(tag);
	if (type === 'css') document.head.appendChild(tag);
}

function hideAllSections() {
	navbar.setAttribute('data-open', 'false');
	document.getElementById('section-container').classList.remove('active');
	
	toggleHero();
	killWave();
	startWave(1500);

	history.pushState(null, null, window.location.pathname);

	animateOut('#' + active_section, 'fade-out-bottom');
	active_section = null;
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
		animateOut(`#${active_work}`, 'fade-out-right', _ => card.classList.remove('hidden'));
	}
	element.classList.add('active');
	active_work = workName;

	var arrow = document.querySelector('.arrow');
	arrow.classList.add('fade-down-twice')
	arrow.addEventListener('animationend', _ => arrow.classList.remove('fade-down-twice'), {once: true});

	history.pushState('', '', `#work?${workName}`);
	track('Work Clicked', 'work', workName)
}

// skills
var skills, skillCycle, currentHover, pedal;
function loadSkills() {
	skills = document.querySelectorAll('.img-skill');
	skills.forEach(img => {
		img.src = img.getAttribute('data-src');
		img.onmouseover = _ => killSkillCycle()
		img.onmouseout = _ => startSkillCycle(1500)
	});
	currentHover = 0;
	startSkillCycle(3500);
}

function killSkillCycle() {
	clearInterval(skillCycle);
	clearTimeout(pedal);
	var prev = document.querySelector('.img-skill.hovered');
	if (prev) prev.classList.remove('hovered');
}

function startSkillCycle(intialDelay = 0) {
	killSkillCycle();
	pedal = setTimeout(_ => {
		skillCycle = setInterval(_ => {
			var prev = document.querySelector('.img-skill.hovered');
			if (prev) prev.classList.remove('hovered');
			skills[currentHover].classList.add('hovered');
			currentHover++;
			if (currentHover >= skills.length) currentHover = 0;
		}, 1500);
	}, intialDelay);
}

// analytics
function track(eventName = 'click', eventCategory = 'Undefined', eventLabel = undefined, eventValue = undefined) {
	var args = {category: eventCategory}
	if (eventLabel !== undefined) args.label = eventLabel;
	if (eventValue !== undefined) args.value = eventValue;
	// console.log('Tracking', eventName, args);
	analytics.track(eventName, args);
}

function doNotTrack() {
	track = _ => {return};
}

// Animate functions
function animateOut(elementName, animationName, callback, animationDuration = 500) {
	var el = document.querySelector(elementName);
	el.classList.add(animationName);
	setTimeout(_ => {
		el.classList.remove(animationName);
		el.classList.add('hidden');
		if (callback) callback();
	}, animationDuration, el, animationName, callback);
}

function animateIn(elementName, animationName, callback, animationDuration = 500) {
	var el = document.querySelector(elementName);
	el.classList.remove('hidden');
	el.classList.add(animationName);
	setTimeout(_ => el.classList.remove(animationName), animationDuration, el);
	if (callback) callback();
}

function shuffleArray(array) {
	return array.map(a => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1])
}

var debounced;
function mobileViewportHack() {
	document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
var window_height = window.innerHeight
window.addEventListener('resize', e => {
	if (window.innerHeight === window_height) return;
	clearTimeout(debounced);
	debounced = setTimeout(mobileViewportHack, 100);
});
mobileViewportHack();

window.addEventListener('orientationchange', mobileViewportHack);

document.querySelectorAll('a').forEach(link => {
	link.addEventListener('click', _ => {
		track('URL Clicked', active_section.substr(active_section.indexOf('-')+1), link.getAttribute('data-name') ? link.getAttribute('data-name') : link.hostname)
	})
})

document.addEventListener('DOMContentLoaded', _ => {
	navbar = document.getElementById('navigation');
	navbarSections = navbar.querySelectorAll('.section-title');
	names = document.querySelectorAll('#hero span span');
	mapContainer = document.querySelector('.map-container');
	navbarSections.forEach((span,i) => {
		span.addEventListener('mouseover', _ => {killWave(i);if (active_section === null) names[i].classList.add('wave')});
		span.addEventListener('mousemove', _ => {if (active_section === null) names[i].classList.add('wave')});
		span.addEventListener('mouseout', _ => {killWave(); if (active_section === null) startWave(1500)});
	});
	startWave(1000);
}, {once: true});