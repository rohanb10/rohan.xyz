var sections, wave, navbar;

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

// WAVES
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
		wave = setInterval(ripple, 5000);
	}

	function killWave() {
		clearInterval(wave);
		for (var i = 0; i < sections.length; i++) {
			sections[i].classList.remove('wave');
		}
	}

function toggleNav(element, sectionName) {
	navbar.classList = [];
	killWave();
	//if section is section open, close it
	if (!element.classList.contains('focused')) {
		showContent(sectionName);
		// change background colour
		navbar.classList.add(element.classList[1]);
		// reset text colour
		for (var i = 0; i < sections.length; i++) {
			sections[i].classList.remove('focused');
		}
		element.classList.add('focused');
	} else {
		hideContent();
		startWave();
		element.classList.remove('focused');
	}
}

function hideContent() {
	//scroll to top before hiding div
	document.getElementById('hero').scrollIntoView({
		behavior: 'smooth'
	});
	setTimeout(function() {
		const activeSection = document.querySelector('.active');
		if (activeSection !== null) {
			activeSection.classList.remove('active');
		}
	}, 500)
}

//REFACTOR activeSections into a reusable method

function showContent(sectionName) {
	//Close currently active section
	const activeSection = document.querySelector('.active');
	if (activeSection !== null) {
		activeSection.classList.remove('active');
	}
	document.getElementById(sectionName).classList.add('active');
	navbar.scrollIntoView({ 
		behavior: 'smooth'
	});
}

// work stuff

function workPicker(workName) {
	var workNames = document.querySelectorAll('.card.active');
	console.log(workNames)
	for (var i = 0; workNames.length > 0 &&  i < workNames.length; i++) {
		workNames[i].classList.remove('active');
	}
	document.getElementById(workName).classList.add('active');
}
