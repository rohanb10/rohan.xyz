var sections, wave, navbar;
const NUMBER_OF_PHOTOS = 30;

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
		wave = setInterval(ripple, 4000);
	}

	function killWave() {
		clearInterval(wave);
		for (var i = 0; i < sections.length; i++) {
			sections[i].classList.remove('wave');
		}
	}

function sectionPicker(element, sectionName) {
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
	if(sectionName === 'photos') {
		genThumbnails();
	}
	document.getElementById(sectionName).classList.add('active');
	navbar.scrollIntoView({ 
		behavior: 'smooth'
	});
}

// work stuff

function workPicker(element, workName) {
	var card = document.getElementById(workName);
	var workNames = document.querySelectorAll('.card.active, .work-container.active');
	for (var i = 0; workNames.length > 0 &&  i < workNames.length; i++) {
		workNames[i].classList.remove('active');
	}
	element.classList.add('active')
	document.getElementById(workName).classList.add('active')
	document.getElementById(workName).parentElement.scrollIntoView({
		behavior: 'smooth',
	});
}

// photos stuff

function genThumbnails() {
	const thumbContainer = document.getElementById('thumbnail-container');
	thumbContainer.innerHTML = "";
	var thumbNames = [];
	for (var i = 0; i < NUMBER_OF_PHOTOS; i++) {
		thumbNames.push({'index': i, 'thumb': 'assets/photos/thumb/' + i + '.jpg'});
	}
	//Shuffle array
	thumbNames.sort(function() { return 0.5 - Math.random() });
	for (var i = 0; i < thumbNames.length; i++) {
		// var t = document.createElement('div');
		// t.classList.add('thumb');
		// t.onclick = function() {
		// 	openPhotoModal(this, i);
		// }
		// var img = document.createElement('img');
		// img.src = 'assets/photos/thumb/' + thumbNames[i];
		// t.appendChild(img);
		// thumbContainer.appendChild(t);
		var t = '<div class="thumb" onClick="openPhoto(this, ' + thumbNames[i].index + ')"><img src="' + thumbNames[i].thumb + '"></div>';
		thumbContainer.innerHTML += t;
	}
}

function openPhoto(thumb, photoNumber) {
	console.log(thumb, photoNumber)
	var img = document.getElementById('photo');
	//show spinner
	//preload image
	//onload
	img.onload = function() {
		var el = document.querySelector('.img-container');
		var pz = new PinchZoom(el, {});
	}
	img.src = 'assets/photos/' + photoNumber + '.jpg';
	document.querySelector('.caption').innerHTML = CAPTIONS[photoNumber];
	//hide spinner
	//pinchzoom
	//open modal
	var modal = document.querySelector('.photo-modal');
	// modal.style.top = window.pageYOffset;
	modal.classList.remove('hidden');
	document.onkeydown = function(evt) {
    	evt = evt || window.event;
	    if (evt.keyCode == 27) {
	        closeModal();
	    }
	};

}

function closeModal() {
	document.querySelector('.photo-modal').classList.add('hidden');
	document.querySelector('.caption').innerHTML = ""
	document.getElementById('photo').src = "";
}
