var map, currentMapLayer, currentMapLayerName = 'light', paths = [], dist = document.getElementById('distance');
var active_city = document.querySelector('h2.active').getAttribute('data-city');
const CITIES = {
	SF: {
		allFocusPt: [37.791, -122.448],
		rideCount: 552,
		totalDistance: 4267
	}, 
	BOM: {
		allFocusPt: [18.982, 72.833],
		rideCount: 51,
		totalDistance: 1004
	}
};

const MAP_LAYERS = {
	light: 'mapbox://styles/mapbox/light-v10',
	dark: 'mapbox://styles/mapbox/dark-v10'
	// light: 'mapbox://styles/rohanb10/ckajqcqca24th1ir1ft2nbipc/draft',
	// dark: 'mapbox://styles/rohanb10/ckajpbf1v1cys1imwamc8isy6/draft'
}

const MONTHS = ['Jan', 'Feb', 'March', 'April', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function initializeMap() {
	document.querySelector('#id-maps .control.last-animation').addEventListener('animationend', _ => {
		document.querySelector('#id-maps .latest-container').classList.remove('not-yet')
	}, {once: true});
	// return
	L.mapbox.accessToken = 'pk.eyJ1Ijoicm9oYW5iMTAiLCJhIjoiY2thaDZxaHFvMGRoaDJzbzBtczM3YjNneiJ9.Wza5G0LIJQ8hZjAYsFobYg'; // production
	map = L.mapbox.map('map')
		.setView(CITIES[active_city].allFocusPt, 13)
		.setMaxZoom(15).setMinZoom(10)
	currentMapLayer = L.mapbox.styleLayer(MAP_LAYERS[currentMapLayerName]);
	map.addLayer(currentMapLayer);
	checkMapLayerColor();
	map.attributionControl.remove();
	setTimeout(_ => map.invalidateSize(), 3000);
}

function updateMap(btn){
	document.querySelector('#id-maps .latest-container').classList.remove('active');
	map.invalidateSize();
	var rideID = btn.getAttribute('data-ride-id')
	changeCity(btn.getAttribute('data-city'), _ => {
		if (rideID === 'all') {
			drawAll();
			enableMapInteractions();
			trackEvent('Map Changed', window.location.pathname, 'All');
			return;
		} else if (rideID === 'random') {
			var p = getRandomPathID();
			drawSnake(p);
			trackEvent('Map Changed', window.location.pathname, 'Random', p);
			return;
		} else if (RIDES[rideID] === undefined) {
			return;
		}
		drawSnake(rideID);
		trackEvent('Map Changed', window.location.pathname, btn.nextElementSibling? btn.nextElementSibling.innerText : 'Single Ride', rideID);
	});
}

function clearPaths(newPathIncoming = false) {
	if (!map) return;
	paths.forEach(p => p.remove(map));
	paths = [];
	clearTimeout(drawTimeout);
	resetDistanceContainer(newPathIncoming);
}

function drawSnake(pathID) {
	if (!map) return;
	clearPaths(true);
	var p = L.polyline(decodePath(RIDES[pathID]), {className: 'path-single', color: '--var(--c-3)'});
	paths.push(p);
	dist.parentElement.classList.remove('hidden');

	map.fitBounds(p.getBounds(), {padding: [10,10],animate: true,pan: {duration: 1}});

	// wait for pan to complete
	map.once('moveend', _ => {
		p.addTo(map);
		var totalLength = p._path.getTotalLength();
		Object.assign(p._path.style, {
			opacity: 0,
			transitionProperty: 'stroke-dashoffset',
			transitionDuration: '1ms',
			transitionTimingFunction: 'linear',
			strokeDashoffset: totalLength,
			strokeDasharray: totalLength,
		});
		drawTimeout = setTimeout(_ => {
			Object.assign(p._path.style, {
				opacity: .7,
				transitionDuration: `${getTransitionDuration(p)}s`,
				strokeDashoffset: 0,
			});
			startDistanceCountUp(p);
			disableMapInteractions();
			p._path.addEventListener('transitionend', _ => {
				p._path.style.strokeDasharray = 'unset';
				enableMapInteractions();
			}, {once: true});
		}, 150);
	});
}

function drawAll() {
	clearPaths();
	map.flyTo(CITIES[active_city].allFocusPt, 12);
	map.once('moveend', _ => {
		Object.keys(RIDES).filter(r => isInActiveCity(r)).forEach((rideID, i) => {
			var p = L.polyline(decodePath(RIDES[rideID]), {
				className: 'path-all',
				color: COLOUR_SCHEMES[currentScheme][3],
			});
			p.on('click', _ => console.log(rideID))
			allTimeouts[i] = setTimeout(_ => {
				p.addTo(map);
				paths.push(p);
			}, 20 * i * (active_city === 'BOM' ? 2.5:1));
		});
		dist.parentElement.classList.remove('hidden');
		updateDistance(0, CITIES[active_city].totalDistance / 51.97, CITIES[active_city].totalDistance);
	});
}

function drawRandom(el) {
	el.classList.add('spin')
	el.addEventListener('animationend', _ => el.classList.remove('spin'), {once: true});
	var p = getRandomPathID();
	trackEvent('Map Changed', window.location.pathname, 'Random', p);
	drawSnake(p);
}

function getRandomPathID() {
	if (!map) return;
	var pathID, pathDistance = 0;
	var minimumDistance = Math.random() < .2 ? 5000 : Math.random < .4 ? 7000 : Math.random < .6 ? 9000 : 11000;
	var blockedKeys = Array.from(document.querySelectorAll('.control input[type="radio"]')).map(el => el.getAttribute('data-ride-id'))
	var keys = shuffleArray(Object.keys(RIDES)).filter(k => isInActiveCity(k) && !blockedKeys.includes(k))
	while (pathDistance < minimumDistance) {
		pathID = keys[keys.length * Math.random() << 0];
		pathDistance = calcDistance(L.polyline(decodePath(RIDES[pathID])));
	}
	return pathID;
}

function isInActiveCity(key) {
	if (active_city === 'SF') return key < 3500000000;
	if (active_city === 'BOM') return key > 3500000000;
	return false
}

function changeCity(name, callback = clearPaths) {
	if (active_city === name) {callback();return}

	active_city = name;
	document.querySelectorAll(`#id-maps input[type=radio]:checked`).forEach(r => r.checked = false);
	document.querySelectorAll(`#id-maps h2`).forEach(h => h.classList.toggle('active', h.getAttribute('data-city') === name))
	document.querySelectorAll(`#id-maps .map-controls`).forEach(h => h.classList.toggle('active', h.getAttribute('data-city') === name))

	if (!map) return;
	resetDistanceContainer();
	map.flyTo(CITIES[name].allFocusPt, 12)
	map.once('moveend', callback);
}

function calcDistance(polyline) {
	if (!map) return;
	var point = polyline._latlngs[0];
	var totalDistance = 0;
	polyline._latlngs.forEach(ll => {
		totalDistance += point.distanceTo(ll);
		point = ll;
	});
	return parseInt(totalDistance);
}

function getTransitionDuration(p) {
	var t = calcDistance(p) / 2000;
	return t <= 10 ? 10 : t; 
}

var drawTimeout, distanceTimeout, allTimeouts = [];
function resetDistanceContainer(newPathIncoming) {
	dist.parentElement.classList.add('hidden');
	clearTimeout(distanceTimeout);
	allTimeouts.forEach(clearTimeout)
	allTimeouts = [];
	setTimeout(_ => dist.innerText = "0.0", newPathIncoming ? 0 : 305);
}

function startDistanceCountUp(p) {
	var target = calcDistance(p);
	// total distance / time x setTimeout duration in seconds
	var increment = (target / getTransitionDuration(p)) * (50 / 1000);
	updateDistance(0, increment/1000, target/1000);
}

function updateDistance(current, increment, target) {
	// minimum interval between timers is 50ms (-1ms for browser delay)
	current += increment;
	dist.innerText = current.toFixed(1);
	if (current < target) distanceTimeout = setTimeout(_ => updateDistance(current, increment, target), 49);
}

function disableMapInteractions() {
	if (!map) return;
	mapContainer.classList.add('waiting');
	map.dragging.disable();
	map.touchZoom.disable();
	map.doubleClickZoom.disable();
	map.scrollWheelZoom.disable();
	map.keyboard.disable();
	if (map.tap) map.tap.disable();
}

function enableMapInteractions() {
	if (!map) return;
	mapContainer.classList.remove('waiting');
	map.dragging.enable();
	map.touchZoom.enable();
	map.doubleClickZoom.enable();
	map.scrollWheelZoom.enable();
	map.keyboard.enable();
	if (map.tap) map.tap.enable();
}

function changeMapLayer(styleURL) {
	nextMapLayer = L.mapbox.styleLayer(styleURL);
	currentMapLayerName = 'custom';
	map.addLayer(nextMapLayer).removeLayer(currentMapLayer);
	currentMapLayer = nextMapLayer;
}

function checkMapLayerColor() {
	if (!map) return;
	if (currentMapLayerName === 'custom') return;
	// nextLayer must be opposite of --c-3
	var nextMapLayerName = isDark(document.documentElement.style.getPropertyValue('--c-3')) ? 'light' : 'dark';
	if (nextMapLayerName === currentMapLayerName) return;

	if (currentMapLayerName.length > 1) mapContainer.classList.remove(currentMapLayerName);

	var nextMapLayer = L.mapbox.styleLayer(MAP_LAYERS[nextMapLayerName])
	map.addLayer(nextMapLayer).removeLayer(currentMapLayer);

	mapContainer.classList.add(nextMapLayerName);
	currentMapLayer = nextMapLayer;
	currentMapLayerName = nextMapLayerName;
}

// Strava functions

function getLatestRideFromStrava() {
	fetchRefreshToken().then(fetchAccessToken).then(fetchLastRideID).then(fetchLastRideDetails).then(showLatestContainer).catch(failure)
}

async function fetchRefreshToken(){
	if (!firebase) throw ('Unable to load Firebase');
	firebase.initializeApp({
		apiKey: "AIzaSyCCUMGIJk8LwLC5_FMY0B2o8Sh0aegCsds",
		authDomain: "strava-xyz.firebaseapp.com",
		databaseURL: "https://strava-xyz.firebaseio.com",
		projectId: "strava-xyz",
		storageBucket: "strava-xyz.appspot.com",
		messagingSenderId: "974189997715",
		appId: "1:974189997715:web:44d445b481d57fc310a766"
	});
	return await firebase.storage().ref().child('refresh.json').getDownloadURL().then(url => {
		return fetch(url).then(response => response.text().then(text => JSON.parse(text)))
	})
}

async function fetchAccessToken(paramJSON) {
	if (!paramJSON || !paramJSON.refresh_token) throw ('No refresh token found in refresh.json file')
	var url = `https://www.strava.com/oauth/token?${(new URLSearchParams(paramJSON)).toString()}`;
	return await fetch(url, {method: 'POST'}).then(response => response.text().then(text => {
		var tokenObject = JSON.parse(text);
		// if refresh tokens are different, write the newerone back to firebase
		if (tokenObject.refresh_token !== paramJSON.refresh_token) {
			paramJSON.refresh_token = tokenObject.refresh_token;
			firebase.storage().ref().child('refresh.json').put(new File([JSON.stringify(paramJSON)], 'refresh.json', {type: 'application/json'}))
		}
		return tokenObject;
	}))
}

async function fetchLastRideID(tokenJSON) {
	if (!tokenJSON || !tokenJSON.access_token) throw ('Unable to get valid Strava access token')
	var options = {headers: {'Authorization': `${tokenJSON.token_type} ${tokenJSON.access_token}`}}
	var params = {per_page: 1}
	var url = `https://www.strava.com/api/v3/athlete/activities?${(new URLSearchParams(params)).toString()}`;
	return await fetch(url, options).then(r => r.text().then(t => {
		var rides = JSON.parse(t);
		if (rides.length !== 1) throw ('Unable to get list of rides using access token');
		return {rideId: rides[0].id, options: options}
	}));
}

async function fetchLastRideDetails(paramJSON) {
	if (!paramJSON || !paramJSON.rideId || !paramJSON.options) throw 'Inavlid RideID';
	var params = {include_all_efforts: false}
	var url = `https://www.strava.com/api/v3/activities/${paramJSON.rideId}`;
	return await fetch(url, paramJSON.options).then(r => r.text().then(t => JSON.parse(t)))
}

function showLatestContainer(activity) {
	if (!activity || !activity.id || !activity.map.polyline) throw 'Inavlid Ride object';

	RIDES[activity.id] = activity.map.polyline;
	var container = document.querySelector('#id-maps .latest-container');
	var rideDate = new Date(activity.start_date_local);
	container.querySelector('.latest-title span').innerText = `- ${rideDate.getDate()} ${MONTHS[rideDate.getMonth()-1]} ${rideDate.getYear()}`

	var control = Object.assign(document.createElement('div'), {
		className: 'control'
	});

	var input = Object.assign(document.createElement('input'), {
		type: 'radio',
		name: 'rides',
		id: 'ride-latest',
	});
	input.setAttribute('data-city', 'BOM');
	input.setAttribute('data-ride-id', activity.id);
	input.onchange = _ => {
		updateMap(input);
		container.classList.add('active');
	}

	var label = Object.assign(document.createElement('label'), {
		innerText: activity.name
	});
	label.setAttribute('for', 'ride-latest')

	control.appendChild(input);
	control.appendChild(label);
	container.appendChild(control);

	container.classList.add('success');
	
	RIDES[activity.id] = activity.map.polyline;
	console.log('ride ' + activity.id + ' succesfully fetched from strava');
	console.log('https://www.strava.com/activities/' + activity.id);
}

function failure(err) {
	console.log('Error pulling from Strava - ', err);
}


// decode polylines
function decodePath(str) {
	var index = 0, lat = 0, lng = 0, coordinates = [], shift = 0, result = 0,byte = null, lat_change, lng_change, factor = 100000;
	while (index < str.length) {
		byte = null;shift = 0;result = 0;
		do {
			byte = str.charCodeAt(index++) - 63;
			result |= (byte & 0x1f) << shift;
			shift += 5;
		} while (byte >= 0x20);
		lat_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
		shift = result = 0;
		do {
			byte = str.charCodeAt(index++) - 63;
			result |= (byte & 0x1f) << shift;
			shift += 5;
		} while (byte >= 0x20);
		lng_change = ((result & 1) ? ~(result >> 1) : (result >> 1));
		lat += lat_change;lng += lng_change;
		coordinates.push([lat / factor, lng / factor]);
	}
	return coordinates;
};