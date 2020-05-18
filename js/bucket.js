const COLOUR_SCHEMES = [
	['rgb(247,200, 59)', 'rgb( 48,176,106)', 'rgb(109,193,197)', 'rgb(234, 67, 71)'],
	['rgb(240, 92,136)', 'rgb(111,125,246)', 'rgb(119,203,249)', 'rgb(255,168,  5)'],
	['rgb(239,194,184)', 'rgb(149,187,217)', 'rgb(188,220,150)', 'rgb(238,222,151)'],
	['rgb(218, 73,107)', 'rgb( 77, 99,209)', 'rgb( 98,147, 55)', 'rgb(245,126,  9)'],
	['rgb(160,106,180)', 'rgb(255,215, 67)', 'rgb(  7,187,156)', 'rgb(215,115,162)'],
	['rgb(145, 48, 48)', 'rgb( 39, 90,119)', 'rgb( 36,107, 80)', 'rgb(194,129, 71)'],
]

// Manually set the colour scheme
function changeColours(c){
	var root = document.documentElement;
	var returnString = 'New Colours: '
	c.forEach((hex,i) => {
		hex = `rgb(${+`0x${hex[1]}${hex[2]}`},${+`0x${hex[3]}${hex[4]}`},${+`0x${hex[5]}${hex[6]}`})`
		root.style.setProperty(`--c-${i}`, hex);
		returnString += hex + ', ';
	});
	currentScheme = -1;
	return returnString;
}

function rgbArray(rgb) {
	rgb = rgb.substr(4).split(')')[0].split(',');
	return [parseInt(rgb[0]),parseInt(rgb[1]),parseInt(rgb[2])];
}

// Transition to new colour scheme
function transitionColourScheme(index, shuffle = true, callback) {
	if (index < 0 || index >= COLOUR_SCHEMES.length) return 'Please enter a valid index';
	var nextColours = [], currentColours = [], colourTimers = [], done=0;

	var scheme = COLOUR_SCHEMES[index || currentScheme];
	if (shuffle) scheme.sort(() => {return 0.5 - Math.random()});

	var root = document.documentElement.style;
	scheme.forEach((c,i) => {
		nextColours.push(rgbArray(c));
		currentColours.push(rgbArray(root.getPropertyValue(`--c-${i}`)));
	});

	currentColours.forEach((rgb, i) => {
		colourTimers[i] = setInterval(()=> {
			rgb.forEach((cc,j) => {
				rgb[j] = cc > nextColours[i][j] ? cc - 1 : cc < nextColours[i][j] ? cc + 1 : cc;
			})
			root.setProperty(`--c-${i}`, `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`);
			if (rgb[0] === nextColours[i][0] && rgb[1] === nextColours[i][1] && rgb[2] === nextColours[i][2]) {
				clearInterval(colourTimers[i]);
				if (++done >= 4 && callback) callback();
			}
		}, 1);
	});
}

// Instantly change colour scheme
function changeColourScheme(index, shuffle = true, callback) {
	if (index < 0 || index >= COLOUR_SCHEMES.length) return 'Please enter a valid index';

	var scheme = COLOUR_SCHEMES[index || currentScheme];
	if (shuffle) scheme.sort(() => {return 0.5 - Math.random()});

	var root = document.documentElement;
	scheme.forEach((c,i) => {
		root.style.setProperty(`--c-${i}`, c);
	});
	if (callback) callback();
}

function nextColourSchemeID() {
	return currentScheme + 1 < COLOUR_SCHEMES.length ? currentScheme + 1 : 0;
}

// clicking of the bucket
function bucket(el) {
	if (el.parentElement.classList.contains('changing')) return;

	var nextScheme = nextColourSchemeID();

	el.parentElement.classList.add('changing');
	var resetBucket = (() => {
		setTimeout(() => {
			el.parentElement.classList.remove('changing');
			changeBucketColours(nextColourSchemeID());
		}, 1200);
	})
	// 1200 is time the last wave is completed
	if (active_section !== null) {
		transitionColourScheme(nextScheme, true, () => {
			ripple();
			resetBucket();
		});
	} else {
		var isWavy = navbar.querySelector('.section-title.wave');
		killWave();
		setTimeout(() => {
			changeColourScheme(nextScheme, true, () => {
				ripple();
				startWave();
				resetBucket();
			});
		}, isWavy ? 400 : 0);
	}

	currentScheme = nextScheme;

	track(`Colour Changed: ${currentScheme}`, '#bucket');
}

function changeBucketColours(schemeID) {
	var bucket = document.querySelector('.bucket');
	nextScheme = COLOUR_SCHEMES[schemeID].sort(() => {return 0.5 - Math.random()});
	nextScheme.forEach((c,i) => {
		bucket.style.setProperty(`--nc-${i}`, c);
	});
}

var currentScheme = 0;
changeColourScheme(currentScheme)
changeBucketColours(nextColourSchemeID());