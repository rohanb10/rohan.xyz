var navbar, navbarSections, names, active_section = null, active_work = '', active_photo = null;

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
var wave, crests = [];
function ripple(interval = 0) {
	setTimeout(function () {
		navbarSections.forEach((s, i, sections) => {
			crests[i] = setTimeout(rippleUp, 150 * i, s, names[i]);
			setTimeout(rippleDown, (sections.length * 150) + (200 * i), s, names[i]);
		});
	}, interval);
}

function rippleUp(section, name) {
	section.classList.add('wave');
	name.classList.add('wave');
}
function rippleDown(section, name) {
	section.classList.remove('wave');
	name.classList.remove('wave');
}

function startWave() {
	clearInterval(wave);
	wave = setInterval(ripple, 4000);
}

function killWave() {
	clearInterval(wave);
	navbarSections.forEach((s,i) => {
		clearTimeout(crests[i]);
		rippleDown(s, names[i]);
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

// analytics
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

var debounced;
function mobileViewportHack() {
	document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
window.addEventListener('resize', () => {
	clearTimeout(debounced);
	debounced = setTimeout(mobileViewportHack, 1000);
});
mobileViewportHack();

document.addEventListener('DOMContentLoaded', () => {
	navbar = document.getElementById('navigation');
	navbarSections = navbar.querySelectorAll('.section-title');
	names = document.querySelectorAll('#hero span span');
	navbarSections.forEach((span,i) => {
		span.addEventListener('mousemove', () => {names[i].classList.add('wave')});
		span.addEventListener('mouseout', () => {names[i].classList.remove('wave')});
	});
	
	navbarSections.forEach(section => {
		section.onmouseover = () => killWave();
		section.onmouseout = () => { if (active_section === null) startWave() }
	});
	ripple(1000);
	startWave();
}, false);