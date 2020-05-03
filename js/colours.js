const COLOR_SCHEMES = [
	['rgb(247,200, 59)', 'rgb( 48,176,106)', 'rgb(109,193,197)', 'rgb(234, 67, 71)'],
	['rgb(240, 92,136)', 'rgb(111,125,246)', 'rgb(119,203,249)', 'rgb(255,168,  5)'],
	['rgb(239,194,184)', 'rgb(149,187,217)', 'rgb(188,220,150)', 'rgb(238,222,151)'],
	['rgb(222, 94, 94)', 'rgb( 69,182,239)', 'rgb( 66,179, 98)', 'rgb(223,168,255)'],
	['rgb(218, 73,107)', 'rgb( 77, 99,209)', 'rgb( 98,147, 55)', 'rgb(245,126,  9)'],
	['rgb(145, 48, 48)', 'rgb( 39, 90,119)', 'rgb( 36,107, 80)', 'rgb(194,129, 71)'],
]

// Manually set the colour scheme through the console
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
console.log(`changeColours(['#AAAAAA', '#BBBBBB', '#CCCCCC', '#DDDDDD'])`);

function rgbArray(rgb) {
	rgb = rgb.substr(4).split(')')[0].split(',');
	return [parseInt(rgb[0]),parseInt(rgb[1]),parseInt(rgb[2])];
}

// Transition to new colour scheme
function transitionColorScheme(index, callback) {
	var root = document.documentElement.style;
	var nextColors = [], currentColors = [], colorTimers = [], done=0;

	//shuffle
	var scheme = COLOR_SCHEMES[index].sort(() => {return 0.5 - Math.random()});
	scheme.forEach((c,i) => {
		nextColors.push(rgbArray(c));
		currentColors.push(rgbArray(root.getPropertyValue(`--color-${i}`)));
	});

	currentColors.forEach((rgb, i) => {
		colorTimers[i] = setInterval(()=> {
			rgb.forEach((cc,j) => {
				rgb[j] = cc > nextColors[i][j] ? cc - 1 : cc < nextColors[i][j] ? cc + 1 : cc;
			})
			root.setProperty(`--color-${i+1}`, `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`);
			if (rgb[0] === nextColors[i][0] && rgb[1] === nextColors[i][1] && rgb[2] === nextColors[i][2]) {
				clearInterval(colorTimers[i]);
				if (++done >= 4 && callback) callback();
			}
		}, 1);
	});
}

// Instantly change color scheme
function changeColorScheme(index, shuffle = true) {
	if (index < 0 || index >= COLOR_SCHEMES.length) return 'Please enter a valid index';
	// check if manually set or pick from random
	index = index || currentScheme;

	var scheme = COLOR_SCHEMES[index];
	if (shuffle) scheme.sort(() => {return 0.5 - Math.random()});

	var root = document.documentElement;
	scheme.forEach((c,i) => {
		root.style.setProperty(`--color-${i}`, c);
	})
}

// clicking of the bucket
function bucket(el) {
	if (el.parentElement.classList.contains('changing')) return;

	var nextScheme = currentScheme + 1 < Object.keys(COLOR_SCHEMES).length ? currentScheme + 1 : 0;
	// show / modify tooltip
	el.parentElement.classList.add('changing');
	setTimeout(() => {el.parentElement.classList.remove('changing')}, 1500);

	if (active_section !== null) {
		transitionColorScheme(nextScheme, () => {
			ripple();
		});
	} else {
		var isWavy = navbar.querySelector('.section-title.wave');
		killWave();
		setTimeout(() => {
			changeColorScheme(nextScheme);
			ripple();
			startWave();
		}, isWavy ? 400 : 0);
	}
	currentScheme = nextScheme
	track(`Colour Changed: ${nextScheme}`, '#bucket');
}

var currentScheme = 0;
changeColorScheme();