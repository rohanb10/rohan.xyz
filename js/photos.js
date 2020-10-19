var PHOTOS = [
	{index: 0, bg: "#89979A", caption: "Kangchendzonga National Park, Sikkim, India"},
	{index: 1, bg: "#6D86B8", caption: "Half Dome from Glacier Point, Yosemite National Park, California"},
	{index: 2, bg: "#82B0D8", caption: "Blue Lake, John Muir Wilderness, Inyo National Forest, California"},
	{index: 3, bg: "#B36F3C", caption: "Emerald Lake, Lakes Trail, Kings Canyon National Park, California"},
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

const photosSection = document.getElementById('id-photos');
const thumbs = document.querySelector('.thumbnails');
const modal = document.querySelector('.photo-modal');
function genThumbnails() {
	const delay = 2500;

	// Only shuffle if thumbnails have been loaded before.
	if (thumbs.innerHTML !== '') {
		var t = shuffleArray(Array.from(thumbs.querySelectorAll('.thumb-container')));
		thumbs.innerHTML = '';
		t.forEach((thumbContainer, i) => {
			thumbContainer.className = `thumb-container fade-in delay-${((i < 18) ? delay + parseInt(i * 100) : 0)}`;
			thumbs.appendChild(thumbContainer);
		});
		return;
	}

	// Shuffle array
	PHOTOS = shuffleArray(PHOTOS);

	// Build each thumbnail DOMobject, loading placeholder and zoom
	PHOTOS.forEach((t, i) => {
		var thumbContainer = Object.assign(document.createElement('div'), {
			className: `thumb-container fade-in delay-${((i < 18) ? delay + parseInt(i * 100) : 0)}`,
			onclick: _ => openPhotoModal(t.index),
		});
		thumbContainer.setAttribute('data-photo-id', t.index);

		var placeholder = Object.assign(document.createElement('img'), {
			className: 'placeholder',
			src: `/assets/photos/thumb/placeholder/${t.index}.svg`,
			style: `background-color: ${t.bg}`
		});
		thumbContainer.appendChild(placeholder);

		var img = Object.assign(document.createElement('img'), {
			className: 'thumb',
			src: `/assets/photos/thumb/${t.index}.jpg`,
		});/*
		thumbContainer.onmouseover = (e) => {
			img.style.transformOrigin = `${e.offsetX}px ${e.offsetY}px`;
			setTimeout(()=> {img.style.transform = 'scale(1.1)'}, 100);
		}
		thumbContainer.onmousemove = e => {
			img.style.transformOrigin = `${e.offsetX}px ${e.offsetY}px`;
		}
		thumbContainer.onmouseout = () => {
			setTimeout(()=> {img.style.transform = 'scale(1)'}, 150);
		}*/
		thumbContainer.appendChild(img);

		thumbs.appendChild(thumbContainer);
	});

	// remove placeholders
	setTimeout(_ => {
		thumbs.querySelectorAll('.thumb-container').forEach(tc => {
			var p = tc.querySelector('.placeholder');
			var img = tc.querySelector('.thumb');
			var removeP = (_ => {
				setTimeout(_ => {p.style.opacity = 0;img.style.filter = 'blur(0px)'}, 1000);
				setTimeout(_ => p.style.display = 'none', 1500);
			});
			if (img.complete) {
				removeP();
			} else {
				img.onload = _ => removeP;
			}
		});
	}, delay + 1000);
}
function modalKeyboardShortcuts(e) {
	if (active_photo === -1) return;
	if (e.keyCode === 39) nextPhoto();
	if (e.keyCode === 37) prevPhoto();
	if (e.keyCode === 27) closePhotoModal();
}

function openPhotoModal(i, shouldTrack = true) {
	loadPhoto(i);
	animateIn('.photo-modal', 'slide-in-up', null, 500);
	document.addEventListener('keydown', modalKeyboardShortcuts)

	// prevent scroll in thumbnail view
	photosSection.style.top = `-${window.scrollY - 40}px`;
	photosSection.style.position = 'fixed';
	
	if (shouldTrack) trackEvent('Photo modal opened', window.location.pathname, identifyPhoto(PHOTOS[i]), i);
}

function closePhotoModal(swipeDistance = 0) {
	modal.classList.remove('loaded');
	document.removeEventListener('keydown', modalKeyboardShortcuts);

	// allow scroll in thumbnail view
	var thumbnailsYPos = photosSection.style.top;
	photosSection.style.position = '';
	window.scrollTo(0, (parseInt(thumbnailsYPos || 0) - 40 + swipeDistance) * -1);

	animateOut('.photo-modal', 'slide-out-bottom', _ => {
		modal.querySelector('.photo-container').style.backgroundImage = '';
		modal.querySelector('.caption').innerHTML = '';
		startLoadingAnimation();
	});
	history.replaceState('', '', `${window.location.origin}/photos`);
	trackEvent('Photo modal closed', window.location.pathname);
	active_photo = -1;
}
 
function nextPhoto() {
	if (active_photo + 1 >= PHOTOS.length || !modal.querySelector('.bar:last-of-type').classList.contains('done')) return;
	startLoadingAnimation();
	loadPhoto(PHOTOS[++active_photo].index, 500);
	trackEvent('Next Photo', window.location.pathname, identifyPhoto(PHOTOS[active_photo]), active_photo);
}

function prevPhoto() {
	if (active_photo <= 0 || !modal.querySelector('.bar:last-of-type').classList.contains('done')) return;
	startLoadingAnimation();
	loadPhoto(PHOTOS[--active_photo].index, 500);
	trackEvent('Prev Photo', window.location.pathname, identifyPhoto(PHOTOS[active_photo]), active_photo);
}

function loadPhoto(i, delay = 0) {
	// Load image in background before showing in div
	// console.log('Photo: ' +i, PHOTOS.findIndex(p => p.index === i));
	Object.assign(document.createElement('img'), {
		src: `/assets/photos/${i}.jpg`,
		onload: _ => {
			setTimeout(_ => {
				modal.querySelector('.photo-container').style.backgroundImage = `url('/assets/photos/${i}.jpg')`;
				endLoadingAnimation();
			}, delay);
		},
		onerror: endLoadingAnimation,
	});
	var p = PHOTOS.find(p => p.index === i);
	document.title = `${p.caption.substr(0, p.caption.lastIndexOf(',', p.caption.lastIndexOf(',') - 1)).toLowerCase()} | photos | rohan bhansali`
	history.replaceState('', '', `/photos/${i}`);
	modal.querySelector('.caption').innerHTML = formatCaptions(p.caption);
	active_photo = PHOTOS.findIndex(el => el.index === i);

	modal.querySelector('.modal-next-btn').classList.toggle('disabled', active_photo + 1 >= PHOTOS.length);
	modal.querySelector('.modal-prev-btn').classList.toggle('disabled', active_photo <= 0);
}

// Animate the loading bars out and then fadeout the overlay
function endLoadingAnimation() {
	var bars = modal.querySelectorAll('.bars div');
	var animationCount = bars.length;
	var completedAnimations = 0;

	bars.forEach((bar, i) => {
		bar.addEventListener('animationiteration', function _listener(e) {
			if (i === 0 || completedAnimations > 0){
				e.target.classList.add('done');
				completedAnimations++;
				bar.removeEventListener('animationiteration', _listener);
			}
			if (completedAnimations >= animationCount && !modal.classList.contains(...['hidden', 'slide-in-up', 'slide-out-bottom'])) {
				modal.classList.add('loaded');
			}
		});
	});
	// fallback
	setTimeout(_ => {if (!modal.classList.contains(...['hidden', 'slide-in-up', 'slide-out-bottom'])) modal.classList.add('loaded')}, 2000);
}

function startLoadingAnimation() {
	modal.classList.remove('loaded');
	modal.querySelectorAll('.bars div').forEach((bar, i) => setTimeout(_ => bar.classList.remove('done'), i * 100));
}

function formatCaptions(c) {
	var locationIndex = c.lastIndexOf(',', c.lastIndexOf(',') - 1) + 1;
	return c.substr(0, locationIndex) + '<br>' + c.substr(locationIndex);
}

function identifyPhoto(p) {
	return `${p.index}.jpg - ${p.caption.substr(0, p.caption.lastIndexOf(',', p.caption.lastIndexOf(',') - 1))}`;
}

// swipe controls
var xDown, yDown
(function() {
	var startSwipe = e => {
		xDown = e.touches[0].clientX;
		yDown = e.touches[0].clientY;
	}
	var moveSwipe = e => {
		if (!xDown || !yDown) return;
		var xDiff = xDown - e.touches[0].clientX;
		var yDiff = yDown - e.touches[0].clientY;
		if (Math.abs(yDiff) + Math.abs(xDiff) < 150) return;
		if (Math.abs(yDiff) > Math.abs(xDiff) && yDiff < 0) closePhotoModal(yDiff);
		if (Math.abs(xDiff) > Math.abs(yDiff)) xDiff < 0 ? prevPhoto() : nextPhoto();
		xDown = null;
		yDown = null;
	}
	modal.addEventListener('touchstart', startSwipe)
	modal.addEventListener('touchmove', moveSwipe)
})();