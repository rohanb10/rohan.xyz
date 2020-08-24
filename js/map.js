var map, currentMapLayer, currentMapLayerName, paths = [], dist = document.getElementById('distance');
var active_city = 'SF';
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
function initializeMap() {
	L.mapbox.accessToken = 'pk.eyJ1Ijoicm9oYW5iMTAiLCJhIjoiY2thaDZxaHFvMGRoaDJzbzBtczM3YjNneiJ9.Wza5G0LIJQ8hZjAYsFobYg'; // production
	map = L.mapbox.map('map')
		.setView([37.7906, -122.4482], 12)
		.setMaxZoom(15).setMinZoom(10)
	currentMapLayerName = 'light';
	currentMapLayer = L.mapbox.styleLayer(mapLayers[currentMapLayerName]);
	map.addLayer(currentMapLayer);
	checkMapLayerColor();
	map.attributionControl.remove();
}

function updateMap(btn){
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

var mapLayers = {
	light: 'mapbox://styles/mapbox/light-v10',
	dark: 'mapbox://styles/mapbox/dark-v10'
	// light: 'mapbox://styles/rohanb10/ckajqcqca24th1ir1ft2nbipc/draft',
	// dark: 'mapbox://styles/rohanb10/ckajpbf1v1cys1imwamc8isy6/draft'
}

function checkMapLayerColor() {
	if (!map) return;
	if (currentMapLayerName === 'custom') return;
	// nextLayer must be opposite of --c-3
	var nextMapLayerName = isDark(document.documentElement.style.getPropertyValue('--c-3')) ? 'light' : 'dark';
	if (nextMapLayerName === currentMapLayerName) return;

	if (currentMapLayerName.length > 1) mapContainer.classList.remove(currentMapLayerName);

	var nextMapLayer = L.mapbox.styleLayer(mapLayers[nextMapLayerName])
	map.addLayer(nextMapLayer).removeLayer(currentMapLayer);

	mapContainer.classList.add(nextMapLayerName);
	currentMapLayer = nextMapLayer;
	currentMapLayerName = nextMapLayerName;

	return ;
}

function clearPaths(newPathIncoming = false) {
	if (!map) return;
	paths.forEach(p => p.remove(map));
	paths = [];
	resetDistanceContainer(newPathIncoming);
}

function drawSnake(pathID) {
	if (!map) return;
	clearPaths(true);
	var p = L.polyline(decodePath(RIDES[pathID]), {className: 'path-single', color: '--var(--c-3)'});
	paths.push(p);
	dist.parentElement.classList.remove('hidden');

	map.fitBounds(p.getBounds(), {
		padding: [10,10],
		animate: true,
		pan: {
			duration: 1
		}
	});

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
		setTimeout(_ => {
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
	// var drawInterval = CITIES[active_city].totalDistance / CITIES[active_city].rideCount * 12.5
	map.once('moveend', _ => {
		Object.keys(RIDES).filter(r => isInActiveCity(r)).forEach((rideID, i) => {
			var p = L.polyline(decodePath(RIDES[rideID]), {
				className: 'path-all',
				color: COLOUR_SCHEMES[currentScheme][3],
			});
			p.on('click', _ => console.log(rideID))
			setTimeout(_ => {
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
	var minimumDistance = Math.random() < .75 ? 10000 : Math.random() < .67 ? 7500 : 5000;
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

function changeCity(name, callback) {
	if (callback === undefined) {
		callback = _ => {
			document.querySelectorAll(`#id-maps input[type=radio]:checked`).forEach(r => r.checked = false);
			clearPaths();
		}
	}
	if (active_city === name) {callback();return}
	active_city = name;
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

var distanceTimeout;
function resetDistanceContainer(newPathIncoming) {
	dist.parentElement.classList.add('hidden');
	clearTimeout(distanceTimeout);
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