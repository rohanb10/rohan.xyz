const COLOUR_SCHEMES = [
	['rgb( 76,187,185)', 'rgb(255,190,105)', 'rgb(152,214,234)', 'rgb(255, 99, 99)', 'rgb(133,102,170)'],
	['rgb(240, 92,136)', 'rgb(111,125,246)', 'rgb(119,203,249)', 'rgb(255,168,  5)', 'rgb( 66,199,153)'],
	['rgb(239,194,184)', 'rgb(149,187,217)', 'rgb(188,220,150)', 'rgb(238,222,151)', 'rgb(214,217,253)'],
	// ['rgb(  6,140,175)', 'rgb( 17,183,158)', 'rgb(233,178,188)', 'rgb(219,188,118)', 'rgb(146,129,161)'],
	['rgb(254,138,138)', 'rgb(127,102,152)', 'rgb(250,210,109)', 'rgb(127,182,161)', 'rgb(139,197,217)'],
	['rgb(145, 48, 48)', 'rgb( 39, 90,119)', 'rgb( 36,107, 80)', 'rgb(194,129, 71)', 'rgb(112, 72,111)'],
];

// Manually set the colour scheme
function changeColours(c){
	var returnString = 'New Colours: '
	c.forEach((hex,i) => {
		hex = `rgb(${+`0x${hex[1]}${hex[2]}`},${+`0x${hex[3]}${hex[4]}`},${+`0x${hex[5]}${hex[6]}`})`
		document.documentElement.style.setProperty(`--c-${i}`, hex);
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
var schemeAnimation;
function transitionColourScheme(index, shuffle = true, callback) {
	var scheme = shuffle ? shuffleArray(COLOUR_SCHEMES[index]) : COLOUR_SCHEMES[index];
	var root = document.documentElement.style
	var next = scheme.map(s => rgbArray(s)), current = scheme.map((s, i) => rgbArray(root.getPropertyValue(`--c-${i}`)));

	var paint = _ => {
		var paintAgain = false
		current.forEach((rgb, i) => {
			rgb.forEach((c,j) => rgb[j] = c + Math.ceil(Math.abs(c - next[i][j]) / 50) * (c <= next[i][j] ? 1 : -1));
			root.setProperty(`--c-${i}`, `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`);
			if (!paintAgain && (rgb[0] !== next[i][0] || rgb[1] !== next[i][1] || rgb[2] !== next[i][2])) paintAgain = true;
		});
		if (paintAgain) return schemeAnimation = requestAnimationFrame(paint)
		setDarkClassForSections(scheme);
		ripple();
		resetBucket();
	}
	schemeAnimation = requestAnimationFrame(paint)
}

// Instantly change colour scheme
function changeColourScheme(index, shuffle = true, callback) {
	if (index < 0 || index >= COLOUR_SCHEMES.length) return 'Please enter a valid index';

	var scheme = COLOUR_SCHEMES[index || currentScheme];
	if (shuffle) scheme = shuffleArray(scheme);

	var root = document.documentElement;
	scheme.forEach((c,i) => root.style.setProperty(`--c-${i}`, c));
	setDarkClassForSections(scheme);
	startWave(1);
	resetBucket();
}

function setDarkClassForSections(scheme) {
	document.querySelectorAll('.section').forEach((s,i) => s.classList.toggle('is-dark', isDark(scheme[i])));
}

function nextColourSchemeID() {
	return (currentScheme + 1) % COLOUR_SCHEMES.length;
}

function isDark(color) {
	var rgb = rgbArray(color);
	return (((rgb[0] * 299) + (rgb[1] * 587) + (rgb[2] * 114)) / 1000) < 142;
}

function bucket(el) {
	var b = document.querySelector('.bucket');
	if (b.classList.contains('changing')) return;

	var nextScheme = nextColourSchemeID();
	// force change in darkMode for certain colour schemes
	if (nextScheme === 2) darkMode(true);
	if (nextScheme === 4) darkMode(false);
	document.body.setAttribute('data-bucket', nextScheme);

	b.classList.add('changing');
	
	if (active_section !== null) {
		transitionColourScheme(nextScheme);
	} else {
		var isWavy = navbar.querySelector('.section-title.wave');
		killWave();
		setTimeout(_ => changeColourScheme(nextScheme), isWavy ? 450 : 0);
	}

	currentScheme = nextScheme;
	trackEvent('Spill', 'bucket', 'Colours changed', currentScheme);
}
function resetBucket() {
	setTimeout(_ => {
		document.querySelector('.bucket').classList.remove('changing');
		changeBucketColours(nextColourSchemeID());
		checkMapLayerColor();
	}, 1200); // 1200 is time it takes to complete a wave.
}

function changeBucketColours(schemeID) {
	var bucket = document.querySelector('.bucket');
	COLOUR_SCHEMES[schemeID].forEach((c,i) => bucket.style.setProperty(`--nc-${i}`, c));
}

var currentScheme = 0;
changeColourScheme(currentScheme)
changeBucketColours(nextColourSchemeID());