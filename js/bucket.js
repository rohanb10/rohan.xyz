const COLOUR_SCHEMES = [
	['rgb( 76,187,185)', 'rgb(255,190,105)', 'rgb(152,214,234)', 'rgb(255, 99, 99)', 'rgb(133,102,170)'],
	['rgb(239,194,184)', 'rgb(149,187,217)', 'rgb(188,220,150)', 'rgb(238,222,151)', 'rgb(214,217,253)'],
	['rgb(240, 92,136)', 'rgb(111,125,246)', 'rgb(119,203,249)', 'rgb(255,168,  5)', 'rgb( 66,199,153)'],
	['rgb(  6,140,175)', 'rgb( 17,183,158)', 'rgb(233,178,188)', 'rgb(219,188,118)', 'rgb(146,129,161)'],
	['rgb(254,138,138)', 'rgb(127,102,152)', 'rgb(250,210,109)', 'rgb(127,182,161)', 'rgb(139,197,217)'],
	['rgb(145, 48, 48)', 'rgb( 39, 90,119)', 'rgb( 36,107, 80)', 'rgb(194,129, 71)', 'rgb(112, 72,111)'],
];

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

	var scheme = COLOUR_SCHEMES[index];
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
			});
			root.setProperty(`--c-${i}`, `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`);
			if (rgb[0] === nextColours[i][0] && rgb[1] === nextColours[i][1] && rgb[2] === nextColours[i][2]) {
				clearInterval(colourTimers[i]);
				if (++done >= nextColours.length && callback) callback();
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

function isDark(color) {
	var rgb = rgbArray(color);
	return (rgb[0] * 0.299) + (rgb[1] * 0.587) + (rgb[2] * 0.114) <= 186;
}

// clicking of the bucket
function bucket(el) {
	if (el.parentElement.classList.contains('changing')) return;

	var nextScheme = nextColourSchemeID();

	el.parentElement.classList.add('changing');
	var resetBucket = (() => {
		checkMapLayerColor();
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
				startWave(1);
				resetBucket();
			});
		}, isWavy ? 450 : 0);
	}

	currentScheme = nextScheme;

	track(`Colour Changed: ${currentScheme}`, '#bucket');
}

function changeBucketColours(schemeID) {
	var bucket = document.querySelector('.bucket');
	COLOUR_SCHEMES[schemeID].forEach((c,i) => {
		bucket.style.setProperty(`--nc-${i}`, c);
	});
}

var currentScheme = 0;
changeColourScheme(currentScheme)
changeBucketColours(nextColourSchemeID());