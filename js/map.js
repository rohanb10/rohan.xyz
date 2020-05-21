var map, currentMapLayer, currentMapLayerName, paths = [];
function initializeMap() {
	// return;
	L.mapbox.accessToken = 'pk.eyJ1Ijoicm9oYW5iMTAiLCJhIjoiY2thaDZxaHFvMGRoaDJzbzBtczM3YjNneiJ9.Wza5G0LIJQ8hZjAYsFobYg';
	map = L.mapbox.map('map')
		.setView([37.7906, -122.4482], 12)
		.setMaxZoom(14)
		.setMinZoom(10)
		.setMaxBounds([[[37.296, -121.809],[38.125, -122.986]]]);
	currentMapLayerName = 'light';
	currentMapLayer = L.mapbox.styleLayer(mapLayers[currentMapLayerName]);
	map.addLayer(currentMapLayer);
	checkMapLayerColor();
	map.attributionControl.remove();
}

function updateMap(btn){
	var rideID = btn.getAttribute('data-ride-id')
	if (rideID === 'all') {
		drawAll();
		track(`Maps - all selected`);
		return;
	} else if (rideID === 'random') {
		drawSnake(getRandomPath());
		return;
	} else if (allRides[rideID] === undefined) {
		return;
	}
	drawSnake(rideID);
}

var mapLayers = {
	light: 'mapbox://styles/mapbox/light-v10',
	dark: 'mapbox://styles/mapbox/dark-v10'
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

function clearPaths() {
	if (!map) return;
	paths.forEach(p => {p.remove(map)});
	paths = [];
}

function drawSnake(pathID) {
	if (!map) return;
	clearPaths();
	var p = L.polyline(decodePath(allRides[pathID]), {className: 'path-single'});
	paths.push(p);

	map.fitBounds(p.getBounds(), {
		padding: [10,10],
		animate: true,
		pan: {
			duration: 1
		}
	});

	// wait for pan to complete
	map.once('moveend', () => {
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
		setTimeout(() => {
			Object.assign(p._path.style, {
				opacity: .7,
				transitionDuration: `${getTransitionDuration(p)}s`,
				strokeDashoffset: 0,
			});
			disableMapInteractions();
			p._path.addEventListener('transitionend', () => {
				p._path.style.strokeDasharray = 'unset';
				enableMapInteractions();
			});
		}, 150);
	});
}

function drawAll() {
	clearPaths();
	map.flyTo([37.7906, -122.4482], 12);
	map.once('moveend', () => {
		for (var rideID of Object.keys(allRides)) {
			var p = L.polyline(decodePath(allRides[rideID]), {
				className: 'path-all'
			});
			p.addTo(map);
			paths.push(p);
		}
	});
}

function getRandomPath() {
	if (!map) return;
	var pathID, minimumDistance = 10000, pathDistance = 0;
	var keys = Object.keys(allRides);
	while (pathDistance < minimumDistance) {
		pathID = keys[keys.length * Math.random() << 0];
		pathDistance = calcDistance(L.polyline(decodePath(allRides[pathID])));
	}
	return pathID;
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
	var t = calcDistance(p) / 2500;
	return t <= 5 ? 5 : t; 
}

function disableMapInteractions() {
	if (!map) return;
	map.dragging.disable();
	map.touchZoom.disable();
	map.doubleClickZoom.disable();
	map.scrollWheelZoom.disable();
	map.keyboard.disable();
	if (map.tap) map.tap.disable();
}

function enableMapInteractions() {
	if (!map) return;
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