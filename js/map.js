var map, currentLayer = 'light', mapAnimation, sources = [], dist = document.getElementById('distance');
var active_city = document.querySelector('h2.active').getAttribute('data-city');
const CITIES = {
	SF: [37.791, -122.448],
	BOM: [18.982, 72.833],
};

const MAP_LAYERS = {
	light: 'mapbox://styles/mapbox/light-v10',
	dark: 'mapbox://styles/mapbox/dark-v10'
	// light: 'mapbox://styles/rohanb10/ckajqcqca24th1ir1ft2nbipc/draft',
	// dark: 'mapbox://styles/rohanb10/ckajpbf1v1cys1imwamc8isy6/draft'
}

function initializeMap() {
	setTimeout(_ => document.querySelector('#id-maps .latest-container').classList.remove('not-yet'), 4500);
	// return
	mapboxgl.accessToken = 'pk.eyJ1Ijoicm9oYW5iMTAiLCJhIjoiY2thaDZxaHFvMGRoaDJzbzBtczM3YjNneiJ9.Wza5G0LIJQ8hZjAYsFobYg';
	map = new mapboxgl.Map({
		container: 'map',
		style: MAP_LAYERS[currentLayer],
		center: flip(CITIES[active_city]),
		zoom: 12,
		maxZoom: 16,
		minZoom: 9,
		attributionControl: false,
	});
	checkMapLayerColor();
	setTimeout(_ => map.resize(), 2000);
}

function updateMap(btn){
	document.querySelector('#id-maps .latest-container').classList.remove('active');
	if (map) map.resize();
	var city = btn.getAttribute('data-city'), rideID = btn.getAttribute('data-ride-id');
	if (!city || !rideID) return;
	changeCity(city, _ => {
		if (rideID === 'random') {
			var randID = getRandomPathID();
			btn.setAttribute('data-random-id', randID);
			rideID = randID
		}
		drawSingle(rideID);
		trackEvent('Map Changed', window.location.pathname, city + ' - ' +btn.nextElementSibling.innerText , rideID);
	});
}

function clearSources() {
	if (!map) return;
	cancelAnimationFrame(mapAnimation);
	sources.forEach(s => {
		try {map.removeLayer(s)} catch {}
		try {map.removeSource(s)} catch {}
	});
	sources = [];
	resetDistanceContainer();
}

function addStyleLayer(name, opacity) {
	if (!name || !map.getSource(name)) return;
	map.addLayer({
		id: name,
		type: 'line',
		source: name,
		paint: {
			'line-color': document.documentElement.style.getPropertyValue('--c-3'),
			'line-width': ['interpolate', ['linear'], ['zoom'], 11, 1, 12, 3],
			'line-opacity': opacity || ['interpolate', ['linear'], ['zoom'], 11, .3, 16, .8]
		}
	});
}

function drawSingle(pathID, noAnimation) {
	if (pathID === 'all') return drawAll(noAnimation);
	if (!map || !RIDES[pathID]) return;

	clearSources();
	dist.parentElement.classList.remove('hidden');

	var nextCord = 1, currentDistance = 0, cords = flip(decodePath(RIDES[pathID])), geo = buildGeoJSON(cords[0]);

	for (var i = nextCord; noAnimation && i < cords.length; i++) geo.features[0].geometry.coordinates.push(cords[i])

	map.fitBounds(cords.reduce((b, c) => b.extend(c), new mapboxgl.LngLatBounds(cords[0], cords[0])), {padding: 50});
	
	sources.push('active-snake')
	map.addSource('active-snake', {type: 'geojson', data: geo});
	addStyleLayer('active-snake', .9);

	if (noAnimation) return dist.innerText = (getDistance(pathID)/1000).toFixed(1);

	var snake = _ => {
		geo.features[0].geometry.coordinates.push(cords[nextCord])
		map.getSource('active-snake').setData(geo);

		currentDistance += distance(cords[nextCord-1], cords[nextCord]);
		dist.innerText = (currentDistance / 1000).toFixed(1)
		
		nextCord++;
		if (nextCord < cords.length) mapAnimation = requestAnimationFrame(snake)
	}
	map.once('moveend', _ => {mapAnimation = requestAnimationFrame(snake)});
}

function drawAll(noAnimation) {
	if (!map) return;

	clearSources();
	dist.parentElement.classList.remove('hidden');

	map.flyTo({center: flip(CITIES[active_city]), zoom: 11});

	var next = 0, currentDistance = 0, keys = Object.keys(RIDES).filter(isInActiveCity);
	var featuresPerFrame = noAnimation ? keys.length : Math.ceil(keys.length / 100);

	var geo = buildGeoJSON();
	sources.push('active-all')
	map.addSource('active-all', {type: 'geojson', data: geo});
	addStyleLayer('active-all')

	var draw = _ => {
		for (var f = 0; f < featuresPerFrame && next < keys.length; f++) {
			geo.features.push(makeFeatureFromCords(flip(decodePath(RIDES[keys[next]]))))
			currentDistance += getDistance(keys[next]);
			next++;
		}
		map.getSource('active-all').setData(geo);

		dist.innerText = (currentDistance / 1000).toFixed(1)
		if (next < keys.length) mapAnimation = requestAnimationFrame(draw)
	}
	map.once('moveend', _ => {mapAnimation = requestAnimationFrame(draw)});
}

function drawRandomAgain(el) {
	map.resize();
	el.classList.add('spin')
	el.addEventListener('animationend', _ => el.classList.remove('spin'), {once: true});
	var p = getRandomPathID();
	trackEvent('Map Changed', window.location.pathname, 'Random', p);
	drawSingle(p);
}

function getRandomPathID() {
	if (!map) return;
	var pathID, pathDistance = 0;
	var minimumDistance = Math.random() < .2 ? 5000 : Math.random < .4 ? 7000 : Math.random < .6 ? 9000 : 12000;
	var blockedKeys = Array.from(document.querySelectorAll('.control input[type="radio"]')).map(el => el.getAttribute('data-ride-id'))
	var keys = shuffleArray(Object.keys(RIDES)).filter(k => isInActiveCity(k) && !blockedKeys.includes(k))
	while (pathDistance < minimumDistance) {
		pathID = keys[keys.length * Math.random() << 0];
		pathDistance = getDistance(pathID);
	}
	return pathID;
}

function isInActiveCity(key) {
	if (active_city === 'SF') return key < 3500000000;
	if (active_city === 'BOM') return key > 3500000000;
	return false;
}

function changeCity(name, callback = clearSources) {
	if (active_city === name) return callback();

	active_city = name;
	document.querySelectorAll(`#id-maps input[type=radio]:checked`).forEach(r => r.checked = false);
	document.querySelectorAll(`#id-maps h2`).forEach(h => h.classList.toggle('active', h.getAttribute('data-city') === name))
	document.querySelectorAll(`#id-maps .map-controls`).forEach(h => h.classList.toggle('active', h.getAttribute('data-city') === name))

	if (!map) return;
	resetDistanceContainer();
	map.flyTo({center: flip(CITIES[name]), zoom: 11})
	map.once('moveend', callback);
}

function getDistance(pathID) {
	var cords = flip(decodePath(RIDES[pathID]));
	var total = 0, current = cords[0];
	cords.forEach(c => {
		total += distance(current, c);
		current = c;
	});
	return Math.round(total);
}

function distance(a, b) {
	return (new mapboxgl.LngLat(a[0], a[1])).distanceTo(new mapboxgl.LngLat(b[0], b[1]))
}

function resetDistanceContainer() {
	dist.parentElement.classList.add('hidden');
	dist.innerText = '0.0'
}

function checkMapLayerColor() {
	if (!map) return;
	// nextLayer must be opposite of --c-3
	var sectionColor = document.documentElement.style.getPropertyValue('--c-3');
	var nextLayer = isDark(sectionColor) ? 'light' : 'dark';

	if (nextLayer === currentLayer) return sources.filter(s => map.getSource(s)).forEach(s => map.setPaintProperty(s, 'line-color', sectionColor));

	var currentBtn = document.querySelector('input[name="rides"]:checked');
	var currentID = currentBtn ? (currentBtn.getAttribute('data-random-id') || currentBtn.getAttribute('data-ride-id')) : undefined

	mapContainer.classList.remove(currentLayer);
	mapContainer.classList.add(nextLayer)
	
	clearSources();
	map.setStyle(MAP_LAYERS[nextLayer])
	if (currentID) map.once('styledataloading', _ => map.once('styledata', _ => drawSingle(currentID, true)))
	currentLayer = nextLayer;
}

// Strava functions

function getLatestRideFromStrava() {
	fetchRefreshToken().then(fetchAccessToken).then(fetchLastRideID).then(fetchLastRideDetails).then(showLatestContainer).catch(e => {
		console.log('Error pulling from Strava - ', e);
	})
}

async function fetchRefreshToken(){
	if (!firebase) throw ('Unable to connect to Firebase');
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

async function fetchAccessToken(params) {
	if (!params || !params.refresh_token) throw ('No refresh_token found in refresh.json')
	var url = `https://www.strava.com/oauth/token?${(new URLSearchParams(params)).toString()}`;
	return await fetch(url, {method: 'POST'}).then(response => response.text().then(text => {
		var tokenObject = JSON.parse(text);
		// if refresh tokens are different, write the newer one back to firebase
		if (tokenObject.refresh_token !== params.refresh_token) {
			params.refresh_token = tokenObject.refresh_token;
			firebase.storage().ref().child('refresh.json').put(new File([JSON.stringify(params)], 'refresh.json', {type: 'application/json'})).then(_ => console.log('refresh_token updated and saved to Firebase.'))
		}
		return tokenObject;
	}))
}

async function fetchLastRideID(tokenJSON) {
	if (!tokenJSON || !tokenJSON.access_token) throw ('Unable to get valid access_token')
	var options = {headers: {'Authorization': `${tokenJSON.token_type} ${tokenJSON.access_token}`}}
	var params = {per_page: 1}
	var url = `https://www.strava.com/api/v3/athlete/activities?${(new URLSearchParams(params)).toString()}`;
	return await fetch(url, options).then(r => r.text().then(t => {
		var rides = JSON.parse(t);
		if (rides.length !== 1) throw ('Unable to get list of rides using access token');
		return {rideId: rides[0].id, options: options}
	}));
}

async function fetchLastRideDetails(params) {
	if (!params || !params.rideId || !params.options) throw 'Inavlid RideID';
	var url = `https://www.strava.com/api/v3/activities/${params.rideId}?include_all_efforts=false`;
	return await fetch(url, params.options).then(r => r.text().then(t => JSON.parse(t)))
}

function showLatestContainer(activity) {
	if (!activity || !activity.id || !activity.map.polyline || !RIDES || RIDES.length === 0) throw 'Inavlid ride object';

	RIDES[activity.id] = activity.map.polyline;
	var container = document.querySelector('#id-maps .latest-container');
	var rideDate = new Intl.DateTimeFormat('en-IN',{day:'numeric', month:'short', year:'numeric'}).format(new Date(activity.start_date));
	var rideTime = new Intl.DateTimeFormat('en-IN',{hour:'numeric', minute:'numeric'}).format(new Date(activity.start_date));
	container.querySelector('.latest-title span').innerText = `- ${rideTime} on ${rideDate}`;
	container.querySelector('.latest-title a').href= `https://www.strava.com/activities/${activity.id}`;

	var control = Object.assign(document.createElement('div'), {className: 'control'});

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

	var label = Object.assign(document.createElement('label'), {innerText: activity.name});
	label.setAttribute('for', 'ride-latest')

	control.append(input, label);
	container.append(control);
	container.classList.add('success');
	container.style.height = container.scrollHeight + 'px';
	
	RIDES[activity.id] = activity.map.polyline;
	console.log('ride ' + activity.id + ' succesfully fetched from strava');
}

function flip(a) {
	var reverse = b => b.slice().reverse()
	return a[0].length ? a.map(reverse) : reverse(a);
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
}
function buildGeoJSON(initialCords) {
	var geojson = {type: 'FeatureCollection', features: []}
	if (initialCords && initialCords.length && initialCords.length > 0) geojson.features.push(makeFeatureFromCords([initialCords]));
	return geojson;
}
function makeFeatureFromCords(cords) {
	return { type: 'Feature', geometry: {type: 'LineString', coordinates: cords} }
}