const PHOTOS = [
	{index: 0, bg: "#89979A", caption: "Kangchendzonga National Park, Sikkim, India"},
	{index: 1, bg: "#6D86B8", caption: "Half Dome from Glacier Point, Yosemite National Park, California"},
	{index: 2, bg: "#82B0D8", caption: "Blue Lake, Inyo National Forest, California"},
	{index: 3, bg: "#B36F3C", caption: "Lakes Trail, Kings Canyon National Park, California"},
	{index: 4, bg: "#2F343B", caption: "Horsetooth Mountain, Fort Collins, Colorado"},
	{index: 5, bg: "#B8C9CC", caption: "Dolores Park, Mission, San Francisco, California"},
	{index: 6, bg: "#8B6151", caption: "Kaibab National Forest, Grand Canyon, Arizona"},
	{index: 7, bg: "#6C7971", caption: "Perugia, Cambria, Italy"},
	{index: 8, bg: "#B26542", caption: "Alghero, Sardinia, Italy"},
	{index: 9, bg: "#5E6C3C", caption: "Rifugio Menaggio, Lake Como, Italy"},
	{index: 10, bg: "#5575C0", caption: "Puez-Geisler National Park, South Tyrol, Italy"},
	{index: 11, bg: "#486BA1", caption: "Peak of Monte Grona, Lake Como, Italy"},
	{index: 12, bg: "#7082A2", caption: "Puez-Geisler National Park, South Tyrol, Italy"},
	{index: 13, bg: "#ADB9D1", caption: "Vembanad Lake, Cochin, Kerala, India"},
	{index: 14, bg: "#6A723E", caption: "Angel Island State Park, San Francisco Bay, California"},
	{index: 15, bg: "#8A7C4C", caption: "Soberanes Point, Carmel, Monterey, California"},
	{index: 16, bg: "#EC965C", caption: "West Point Lighthouse, Discovery Park, Seattle, Washington"},
	{index: 17, bg: "#D6D3CE", caption: "Wallace Falls State Park, Snohomish County, Washington"},
	{index: 18, bg: "#9C7E52", caption: "Laguna Creek Beach, Santa Cruz, California"},
	{index: 19, bg: "#CBAC86", caption: "Tent Rocks National Monument, Sandoval County, New Mexico"},
	{index: 20, bg: "#454934", caption: "Gennargentu National Park, Cala Ganone, Sardinia, Italy"},
	{index: 21, bg: "#94ABBD", caption: "McLaren Park, San Francisco, California"},
	{index: 22, bg: "#2F3411", caption: "Angel Island State Park, San Francisco Bay, California"},
	{index: 23, bg: "#A73E28", caption: "Prewitt Ridge, Big Sur, California"},
	{index: 24, bg: "#536C8B", caption: "Yosemite Falls Trail, Yosemite National Park, California"},
	{index: 25, bg: "#808B63", caption: "Kangchendzonga National Park, Sikkim, India"},
	{index: 26, bg: "#546420", caption: "Briones Regional Park, Lafayette, California"},
	{index: 27, bg: "#D8DEE0", caption: "Mendocino Headlands State Park, Mendocino, California"},
	{index: 28, bg: "#709BC3", caption: "Four Mile Trail, Yosemite National Park, California"},
	{index: 29, bg: "#E9906E", caption: "Shilshole Bay, Ballard, Seattle, Washington"}
];

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
		if (e.keyCode === 39) nextPhoto();
		if (e.keyCode === 37) prevPhoto();
		if (e.keyCode === 27) {
			closePhotoModal();
			document.removeEventListener('keydown', _close);
		}
	});
}

function closePhotoModal() {
	animateOut('.photo-modal', 'slide-out-bottom', () => {
		document.querySelector('.photo-container').style.backgroundImage = '';
		document.querySelector('.caption').innerHTML = '';
		startLoadingAnimation();
	});
	history.pushState('', '', '#photos');
}

 
function nextPhoto() {
	if (active_photo + 1 >= PHOTOS.length || !document.querySelector('.bar:last-of-type').classList.contains('done')) return;
	active_photo++;
	startLoadingAnimation(true);
	loadPhoto(active_photo, 500);
}

function prevPhoto() {
	if (active_photo <= 0 || !document.querySelector('.bar:last-of-type').classList.contains('done')) return;
	active_photo--;
	startLoadingAnimation(true);
	loadPhoto(active_photo, 500);
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


// Animate the loading bars out and then fadeout the overlay
function endLoadingAnimation() {
	var modalDiv = document.querySelector('.modal-content')
	var bars = modalDiv.querySelectorAll('.bars div');
	var animationCount = bars.length;
	var completedAnimations = 0;

	bars.forEach((bar, i) => {
		bar.addEventListener('animationiteration', function _listener(e) {
			if (i === 0 || completedAnimations > 0){
				e.target.classList.add('done');
				completedAnimations++;
				bar.removeEventListener('animationiteration', _listener);
			}
			if (completedAnimations >= animationCount) {
				setTimeout(() => {
					modalDiv.classList.add('loaded');
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

	modalDiv.querySelectorAll('.bars div').forEach((bar, i) => {
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
