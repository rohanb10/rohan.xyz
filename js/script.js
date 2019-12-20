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
		navbar.classList.add(element.classList[1]);
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
		document.getElementById('section-container').classList.add('hidden');
	}, 500)
}

function showContent(sectionName) {
	document.getElementById('section-container').classList.remove('hidden');
	navbar.scrollIntoView({ 
		behavior: 'smooth' 
	});
}


// Skill hover
var skills = document.querySelectorAll(".img-skill");
for (i=0;i<skills.length;i++){
	skills[i].addEventListener("mouseover", function(){
		this.nextSibling.classList.remove('hidden');
		// skillContainer.style.opacity = 1;
	},false);
	skills[i].addEventListener("mouseout", function(){
		this.nextSibling.classList.add('hidden');
		// skillContainer.style.opacity = 0;
	},false);
}
