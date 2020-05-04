const COLOR_SCHEMES = [
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
		root.style.setProperty(`--color-${i}`, hex);
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
function transitionColorScheme(index, shuffle = true, callback) {
	if (index < 0 || index >= COLOR_SCHEMES.length) return 'Please enter a valid index';
	var nextColors = [], currentColors = [], colorTimers = [], done=0;

	var scheme = COLOR_SCHEMES[index || currentScheme];
	if (shuffle) scheme.sort(() => {return 0.5 - Math.random()});

	var root = document.documentElement.style;
	scheme.forEach((c,i) => {
		nextColors.push(rgbArray(c));
		currentColors.push(rgbArray(root.getPropertyValue(`--color-${i}`)));
	});

	currentColors.forEach((rgb, i) => {
		colorTimers[i] = setInterval(()=> {
			rgb.forEach((cc,j) => {
				rgb[j] = cc > nextColors[i][j] ? cc - 1 : cc < nextColors[i][j] ? cc + 1 : cc;
			})
			root.setProperty(`--color-${i}`, `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`);
			if (rgb[0] === nextColors[i][0] && rgb[1] === nextColors[i][1] && rgb[2] === nextColors[i][2]) {
				clearInterval(colorTimers[i]);
				if (++done >= 4 && callback) callback();
			}
		}, 1);
	});
}

// Instantly change color scheme
function changeColorScheme(index, shuffle = true, callback) {
	if (index < 0 || index >= COLOR_SCHEMES.length) return 'Please enter a valid index';

	var scheme = COLOR_SCHEMES[index || currentScheme];
	if (shuffle) scheme.sort(() => {return 0.5 - Math.random()});

	var root = document.documentElement;
	scheme.forEach((c,i) => {
		root.style.setProperty(`--color-${i}`, c);
	});
	if (callback) callback();
}

function nextColorSchemeID() {
	return currentScheme + 1 < COLOR_SCHEMES.length ? currentScheme + 1 : 0;
}

// clicking of the bucket
function bucket(el) {
	if (el.parentElement.classList.contains('changing')) return;

	var nextScheme = nextColorSchemeID();

	el.parentElement.classList.add('changing');
	setTimeout(() => {el.parentElement.classList.remove('changing')}, 1500);

	if (active_section !== null) {
		transitionColorScheme(nextScheme, true, () => {
			ripple();
		});
	} else {
		var isWavy = navbar.querySelector('.section-title.wave');
		killWave();
		setTimeout(() => {
			changeColorScheme(nextScheme, true, () => {
				ripple();
				startWave();
			});
		}, isWavy ? 400 : 0);
	}

	currentScheme = nextScheme;
	changeDropletColor(nextColorSchemeID());

	track(`Colour Changed: ${nextScheme}`, '#bucket');
}

function changeDropletColor(schemeID) {
	var root = document.documentElement;
	nextScheme = COLOR_SCHEMES[schemeID].sort(() => {return 0.5 - Math.random()});
	nextScheme.forEach((c,i) => {
		root.style.setProperty(`--next-color-${i}`, c);
	});
}

var currentScheme = 0;
changeColorScheme(currentScheme)
changeDropletColor(nextColorSchemeID());