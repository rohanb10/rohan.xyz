var PHOTOS=[{index:0,bg:"#89979A",caption:"Kangchendzonga National Park, Sikkim, India"},{index:1,bg:"#6D86B8",caption:"Half Dome from Glacier Point, Yosemite National Park, California"},{index:2,bg:"#82B0D8",caption:"Blue Lake, John Muir Wilderness, Inyo National Forest, California"},{index:3,bg:"#B36F3C",caption:"Emerald Lake, Lakes Trail, Kings Canyon National Park, California"},{index:4,bg:"#2F343B",caption:"Horsetooth Mountain, Fort Collins, Colorado"},{index:5,bg:"#B8C9CC",caption:"Dolores Park, Mission, San Francisco, California"},{index:6,bg:"#8B6151",caption:"Kaibab National Forest, Grand Canyon, Arizona"},{index:7,bg:"#6C7971",caption:"Perugia, Cambria, Italy"},{index:8,bg:"#B26542",caption:"Alghero, Sardinia, Italy"},{index:9,bg:"#5E6C3C",caption:"Rifugio Menaggio, Lake Como, Italy"},{index:10,bg:"#5575C0",caption:"Puez-Geisler National Park, South Tyrol, Italy"},{index:11,bg:"#486BA1",caption:"Peak of Monte Grona, Lake Como, Italy"},{index:12,bg:"#7082A2",caption:"Puez-Geisler National Park, South Tyrol, Italy"},{index:13,bg:"#ADB9D1",caption:"Vembanad Lake, Cochin, Kerala, India"},{index:14,bg:"#6A723E",caption:"Angel Island State Park, San Francisco Bay, California"},{index:15,bg:"#8A7C4C",caption:"Soberanes Point, Carmel, Monterey, California"},{index:16,bg:"#EC965C",caption:"West Point Lighthouse, Discovery Park, Seattle, Washington"},{index:17,bg:"#D6D3CE",caption:"Wallace Falls State Park, Snohomish County, Washington"},{index:18,bg:"#9C7E52",caption:"Laguna Creek Beach, Santa Cruz, California"},{index:19,bg:"#CBAC86",caption:"Tent Rocks National Monument, Sandoval County, New Mexico"},{index:20,bg:"#454934",caption:"Gennargentu National Park, Cala Ganone, Sardinia, Italy"},{index:21,bg:"#94ABBD",caption:"McLaren Park, San Francisco, California"},{index:22,bg:"#2F3411",caption:"Angel Island State Park, San Francisco Bay, California"},{index:23,bg:"#A73E28",caption:"Prewitt Ridge, Big Sur, California"},{index:24,bg:"#536C8B",caption:"Yosemite Falls Trail, Yosemite National Park, California"},{index:25,bg:"#808B63",caption:"Kangchendzonga National Park, Sikkim, India"},{index:26,bg:"#546420",caption:"Briones Regional Park, Lafayette, California"},{index:27,bg:"#D8DEE0",caption:"Mendocino Headlands State Park, Mendocino, California"},{index:28,bg:"#709BC3",caption:"Four Mile Trail, Yosemite National Park, California"},{index:29,bg:"#E9906E",caption:"Shilshole Bay, Ballard, Seattle, Washington"}];const photosSection=document.getElementById("id-photos");const thumbs=document.querySelector(".thumbnails");const modal=document.querySelector(".photo-modal");function genThumbnails(){const e=2500;if(thumbs.innerHTML!==""){var t=shuffleArray(Array.from(thumbs.querySelectorAll(".thumb-container")));thumbs.innerHTML="";t.forEach((t,a)=>{t.className=`thumb-container fade-in delay-${a<18?e+parseInt(a*100):0}`;thumbs.appendChild(t)});return}PHOTOS=shuffleArray(PHOTOS);PHOTOS.forEach((t,a)=>{var n=Object.assign(document.createElement("div"),{className:`thumb-container fade-in delay-${a<18?e+parseInt(a*100):0}`,onclick:e=>openPhotoModal(t.index)});n.setAttribute("data-photo-id",t.index);var o=Object.assign(document.createElement("img"),{className:"placeholder",src:`/assets/photos/thumb/placeholder/${t.index}.svg`,style:`background-color: ${t.bg}`});n.appendChild(o);var i=Object.assign(document.createElement("img"),{className:"thumb",src:`/assets/photos/thumb/${t.index}.jpg`});var r=e=>{setTimeout(e=>{o.style.opacity="0";i.style.filter="blur(0)"},1e3);setTimeout(e=>o.style.display="none",1500)};if(i.complete)r();i.onload=r;n.appendChild(i);thumbs.appendChild(n)})}function modalKeyboardShortcuts(e){if(active_photo===-1)return;if(e.keyCode===39)nextPhoto();if(e.keyCode===37)prevPhoto();if(e.keyCode===27)closePhotoModal()}function openPhotoModal(e,t=true){loadPhoto(e);animateIn(".photo-modal","slide-in-up",null,500);document.addEventListener("keydown",modalKeyboardShortcuts);if(t)trackEvent("Photo modal opened",window.location.pathname,identifyPhoto(PHOTOS[e]),e)}function closePhotoModal(e=0){modal.classList.remove("loaded");animateOut(".photo-modal","slide-out-bottom",e=>{modal.querySelector(".photo-container").style.backgroundImage="";modal.querySelector(".caption").innerHTML="";startLoadingAnimation()});document.removeEventListener("keydown",modalKeyboardShortcuts);history.pushState("","",`${window.location.origin}/photos`);trackEvent("Photo modal closed",window.location.pathname);active_photo=-1}function nextPhoto(){if(active_photo+1>=PHOTOS.length||!modal.querySelector(".bar:last-of-type").classList.contains("done"))return;startLoadingAnimation();loadPhoto(PHOTOS[++active_photo].index,500);trackEvent("Next Photo",window.location.pathname,identifyPhoto(PHOTOS[active_photo]),active_photo)}function prevPhoto(){if(active_photo<=0||!modal.querySelector(".bar:last-of-type").classList.contains("done"))return;startLoadingAnimation();loadPhoto(PHOTOS[--active_photo].index,500);trackEvent("Prev Photo",window.location.pathname,identifyPhoto(PHOTOS[active_photo]),active_photo)}function loadPhoto(e,t=0){Object.assign(document.createElement("img"),{src:`/assets/photos/${e}.jpg`,onload:a=>{setTimeout(t=>{modal.querySelector(".photo-container").style.backgroundImage=`url('/assets/photos/${e}.jpg')`;endLoadingAnimation()},t)},onerror:endLoadingAnimation});var a=PHOTOS.find(t=>t.index===e);document.title=`${a.caption.substr(0,a.caption.lastIndexOf(",",a.caption.lastIndexOf(",")-1)).toLowerCase()} | photos | rohan bhansali`;history.pushState("","",`/photos/${e}`);modal.querySelector(".caption").innerHTML=formatCaptions(a.caption);active_photo=PHOTOS.findIndex(t=>t.index===e);modal.querySelector(".modal-next-btn").classList.toggle("disabled",active_photo+1>=PHOTOS.length);modal.querySelector(".modal-prev-btn").classList.toggle("disabled",active_photo<=0)}function endLoadingAnimation(){var e=modal.querySelectorAll(".bars div");var t=e.length;var a=0;e.forEach((e,n)=>{e.addEventListener("animationiteration",(function o(i){if(n===0||a>0){i.target.classList.add("done");a++;e.removeEventListener("animationiteration",o)}if(a>=t&&!modal.classList.contains(...["hidden","slide-in-up","slide-out-bottom"])){modal.classList.add("loaded")}}))});setTimeout(e=>{if(!modal.classList.contains(...["hidden","slide-in-up","slide-out-bottom"]))modal.classList.add("loaded")},2e3)}function startLoadingAnimation(){modal.classList.remove("loaded");modal.querySelectorAll(".bars div").forEach((e,t)=>setTimeout(t=>e.classList.remove("done"),t*100))}function formatCaptions(e){var t=e.lastIndexOf(",",e.lastIndexOf(",")-1)+1;return e.substr(0,t)+"<br>"+e.substr(t)}function identifyPhoto(e){return`${e.index}.jpg - ${e.caption.substr(0,e.caption.lastIndexOf(",",e.caption.lastIndexOf(",")-1))}`}var xDown,yDown;(function(){var e=e=>{xDown=e.touches[0].clientX;yDown=e.touches[0].clientY};var t=e=>{if(!xDown||!yDown)return;var t=xDown-e.touches[0].clientX;var a=yDown-e.touches[0].clientY;if(Math.abs(a)+Math.abs(t)<150)return;if(Math.abs(a)>Math.abs(t)&&a<0)closePhotoModal(a);if(Math.abs(t)>Math.abs(a))t<0?prevPhoto():nextPhoto();xDown=null;yDown=null};modal.addEventListener("touchstart",e,{passive:true});modal.addEventListener("touchmove",t,{passive:true})})();var map,currentLayer="light",animation,sources=[],dist=document.getElementById("distance");var active_city=document.querySelector("h2.active").getAttribute("data-city");const CITIES={SF:[37.791,-122.448],BOM:[18.982,72.833]};const MAP_LAYERS={light:"mapbox://styles/mapbox/light-v10",dark:"mapbox://styles/mapbox/dark-v10"};function initializeMap(){setTimeout(e=>document.querySelector("#id-maps .latest-container").classList.remove("not-yet"),4500);mapboxgl.accessToken="pk.eyJ1Ijoicm9oYW5iMTAiLCJhIjoiY2thaDZxaHFvMGRoaDJzbzBtczM3YjNneiJ9.Wza5G0LIJQ8hZjAYsFobYg";map=new mapboxgl.Map({container:"map",style:MAP_LAYERS[currentLayer],center:flip(CITIES[active_city]),zoom:12,maxZoom:16,minZoom:9,attributionControl:false});checkMapLayerColor();setTimeout(e=>map.resize(),2e3)}function updateMap(e){document.querySelector("#id-maps .latest-container").classList.remove("active");if(map)map.resize();var t=e.getAttribute("data-city"),a=e.getAttribute("data-ride-id");if(!t||!a)return;changeCity(t,n=>{if(a==="random"){var o=getRandomPathID();e.setAttribute("data-random-id",o);a=o}drawSingle(a);trackEvent("Map Changed",window.location.pathname,t+" - "+e.nextElementSibling.innerText,a)})}function clearSources(){if(!map)return;sources.forEach(e=>{try{map.removeLayer(e)}catch{}try{map.removeSource(e)}catch{}});cancelAnimationFrame(animation);sources=[];resetDistanceContainer()}function addStyleLayer(e,t=.75){if(!e||!map.getSource(e))return;map.addLayer({id:e,type:"line",source:e,paint:{"line-color":document.documentElement.style.getPropertyValue("--c-3"),"line-width":3,"line-opacity":t}})}function drawSingle(e,t){if(e==="all")return drawAll(t);if(!map||!RIDES[e])return;clearSources();dist.parentElement.classList.remove("hidden");var a=1,n=0,o=flip(decodePath(RIDES[e])),i=buildGeoJSON(o[0]);for(var r=a;t&&r<o.length;r++)i.features[0].geometry.coordinates.push(o[r]);map.fitBounds(o.reduce((e,t)=>e.extend(t),new mapboxgl.LngLatBounds(o[0],o[0])),{padding:50});sources.push("active-snake");map.addSource("active-snake",{type:"geojson",data:i});addStyleLayer("active-snake");if(t)return dist.innerText=(getDistance(e)/1e3).toFixed(1);var s=e=>{i.features[0].geometry.coordinates.push(o[a]);map.getSource("active-snake").setData(i);n+=distance(o[a-1],o[a]);dist.innerText=(n/1e3).toFixed(1);a++;if(a<o.length)animation=requestAnimationFrame(s)};map.once("moveend",e=>{animation=requestAnimationFrame(s)})}function drawAll(e){if(!map)return;clearSources();dist.parentElement.classList.remove("hidden");map.flyTo({center:flip(CITIES[active_city]),zoom:11});var t=0,a=0,n=Object.keys(RIDES).filter(isInActiveCity);var o=e?n.length:Math.ceil(n.length/100);var i=buildGeoJSON();sources.push("active-all");map.addSource("active-all",{type:"geojson",data:i});addStyleLayer("active-all",.3);var r=e=>{for(var s=0;s<o&&t<n.length;s++){i.features.push(makeFeatureFromCords(flip(decodePath(RIDES[n[t]]))));a+=getDistance(n[t]);t++}map.getSource("active-all").setData(i);dist.innerText=(a/1e3).toFixed(1);if(t<n.length)animation=requestAnimationFrame(r)};map.once("moveend",e=>{animation=requestAnimationFrame(r)})}function drawRandomAgain(e){map.resize();e.classList.add("spin");e.addEventListener("animationend",t=>e.classList.remove("spin"),{once:true});var t=getRandomPathID();trackEvent("Map Changed",window.location.pathname,"Random",t);drawSingle(t)}function getRandomPathID(){if(!map)return;var e,t=0;var a=Math.random()<.2?5e3:Math.random<.4?7e3:Math.random<.6?9e3:12e3;var n=Array.from(document.querySelectorAll('.control input[type="radio"]')).map(e=>e.getAttribute("data-ride-id"));var o=shuffleArray(Object.keys(RIDES)).filter(e=>isInActiveCity(e)&&!n.includes(e));while(t<a){e=o[o.length*Math.random()<<0];t=getDistance(e)}return e}function isInActiveCity(e){if(active_city==="SF")return e<35e8;if(active_city==="BOM")return e>35e8;return false}function changeCity(e,t=clearSources){if(active_city===e)return t();active_city=e;document.querySelectorAll(`#id-maps input[type=radio]:checked`).forEach(e=>e.checked=false);document.querySelectorAll(`#id-maps h2`).forEach(t=>t.classList.toggle("active",t.getAttribute("data-city")===e));document.querySelectorAll(`#id-maps .map-controls`).forEach(t=>t.classList.toggle("active",t.getAttribute("data-city")===e));if(!map)return;resetDistanceContainer();map.flyTo({center:flip(CITIES[e]),zoom:11});map.once("moveend",t)}function getDistance(e){var t=flip(decodePath(RIDES[e]));var a=0,n=t[0];t.forEach(e=>{a+=distance(n,e);n=e});return Math.round(a)}function distance(e,t){return new mapboxgl.LngLat(e[0],e[1]).distanceTo(new mapboxgl.LngLat(t[0],t[1]))}function resetDistanceContainer(e){dist.parentElement.classList.add("hidden");dist.innerText="0.0"}function checkMapLayerColor(){if(!map)return;var e=document.documentElement.style.getPropertyValue("--c-3");var t=isDark(e)?"light":"dark";if(t===currentLayer)return sources.filter(e=>map.getSource(e)).forEach(t=>map.setPaintProperty(t,"line-color",e));var a=document.querySelector('input[name="rides"]:checked');var n=a?a.getAttribute("data-random-id")||a.getAttribute("data-ride-id"):undefined;mapContainer.classList.remove(currentLayer);mapContainer.classList.add(t);clearSources();map.setStyle(MAP_LAYERS[t]);map.once("styledataloading",e=>map.once("styledata",e=>drawSingle(n,true)));currentLayer=t}function getLatestRideFromStrava(){fetchRefreshToken().then(fetchAccessToken).then(fetchLastRideID).then(fetchLastRideDetails).then(showLatestContainer).catch(e=>{console.log("Error pulling from Strava - ",e)})}async function fetchRefreshToken(){if(!firebase)throw"Unable to connect to Firebase";firebase.initializeApp({apiKey:"AIzaSyCCUMGIJk8LwLC5_FMY0B2o8Sh0aegCsds",authDomain:"strava-xyz.firebaseapp.com",databaseURL:"https://strava-xyz.firebaseio.com",projectId:"strava-xyz",storageBucket:"strava-xyz.appspot.com",messagingSenderId:"974189997715",appId:"1:974189997715:web:44d445b481d57fc310a766"});return await firebase.storage().ref().child("refresh.json").getDownloadURL().then(e=>fetch(e).then(e=>e.text().then(e=>JSON.parse(e))))}async function fetchAccessToken(e){if(!e||!e.refresh_token)throw"No refresh_token found in refresh.json";var t=`https://www.strava.com/oauth/token?${new URLSearchParams(e).toString()}`;return await fetch(t,{method:"POST"}).then(t=>t.text().then(t=>{var a=JSON.parse(t);if(a.refresh_token!==e.refresh_token){e.refresh_token=a.refresh_token;firebase.storage().ref().child("refresh.json").put(new File([JSON.stringify(e)],"refresh.json",{type:"application/json"})).then(e=>console.log("refresh_token updated and saved to Firebase."))}return a}))}async function fetchLastRideID(e){if(!e||!e.access_token)throw"Unable to get valid access_token";var t={headers:{Authorization:`${e.token_type} ${e.access_token}`}};var a={per_page:1};var n=`https://www.strava.com/api/v3/athlete/activities?${new URLSearchParams(a).toString()}`;return await fetch(n,t).then(e=>e.text().then(e=>{var a=JSON.parse(e);if(a.length!==1)throw"Unable to get list of rides using access token";return{rideId:a[0].id,options:t}}))}async function fetchLastRideDetails(e){if(!e||!e.rideId||!e.options)throw"Inavlid RideID";var t={include_all_efforts:false};var a=`https://www.strava.com/api/v3/activities/${e.rideId}`;return await fetch(a,e.options).then(e=>e.text().then(e=>JSON.parse(e)))}function showLatestContainer(e){if(!e||!e.id||!e.map.polyline)throw"Inavlid ride object";if(RIDES.length!==0)RIDES[e.id]=e.map.polyline;var t=document.querySelector("#id-maps .latest-container");var a=new Intl.DateTimeFormat("en-IN",{day:"numeric",month:"short",year:"numeric"}).format(new Date(e.start_date));var n=new Intl.DateTimeFormat("en-IN",{hour:"numeric",minute:"numeric"}).format(new Date(e.start_date));t.querySelector(".latest-title span").innerText=`- ${n} on ${a}`;t.querySelector(".latest-title a").href=`https://www.strava.com/activities/${e.id}`;var o=Object.assign(document.createElement("div"),{className:"control"});var i=Object.assign(document.createElement("input"),{type:"radio",name:"rides",id:"ride-latest"});i.setAttribute("data-city","BOM");i.setAttribute("data-ride-id",e.id);i.onchange=e=>{updateMap(i);t.classList.add("active")};var r=Object.assign(document.createElement("label"),{innerText:e.name});r.setAttribute("for","ride-latest");o.append(i,r);t.append(o);t.classList.add("success");t.style.height=t.scrollHeight+"px";RIDES[e.id]=e.map.polyline;console.log("ride "+e.id+" succesfully fetched from strava")}function flip(e){var t=e=>e.slice().reverse();if(e[0].length)return e.map(t);return t(e)}function decodePath(e){var t=0,a=0,n=0,o=[],i=0,r=0,s=null,c,l,d=1e5;while(t<e.length){s=null;i=0;r=0;do{s=e.charCodeAt(t++)-63;r|=(s&31)<<i;i+=5}while(s>=32);c=r&1?~(r>>1):r>>1;i=r=0;do{s=e.charCodeAt(t++)-63;r|=(s&31)<<i;i+=5}while(s>=32);l=r&1?~(r>>1):r>>1;a+=c;n+=l;o.push([a/d,n/d])}return o}function buildGeoJSON(e){var t={type:"FeatureCollection",features:[]};if(e&&e.length&&e.length>0)t.features.push(makeFeatureFromCords([e]));return t}function makeFeatureFromCords(e){return{type:"Feature",geometry:{type:"LineString",coordinates:e}}}const COLOUR_SCHEMES=[["rgb( 76,187,185)","rgb(255,190,105)","rgb(152,214,234)","rgb(255, 99, 99)","rgb(133,102,170)"],["rgb(240, 92,136)","rgb(111,125,246)","rgb(119,203,249)","rgb(255,168,  5)","rgb( 66,199,153)"],["rgb(239,194,184)","rgb(149,187,217)","rgb(188,220,150)","rgb(238,222,151)","rgb(214,217,253)"],["rgb(254,138,138)","rgb(127,102,152)","rgb(250,210,109)","rgb(127,182,161)","rgb(139,197,217)"],["rgb(145, 48, 48)","rgb( 39, 90,119)","rgb( 36,107, 80)","rgb(194,129, 71)","rgb(112, 72,111)"]];function changeColours(e){var t=document.documentElement;var a="New Colours: ";e.forEach((e,n)=>{e=`rgb(${+`0x${e[1]}${e[2]}`},${+`0x${e[3]}${e[4]}`},${+`0x${e[5]}${e[6]}`})`;t.style.setProperty(`--c-${n}`,e);a+=e+", "});currentScheme=-1;return a}function rgbArray(e){e=e.substr(4).split(")")[0].split(",");return[parseInt(e[0]),parseInt(e[1]),parseInt(e[2])]}function transitionColourScheme(e,t=true,a){if(e<0||e>=COLOUR_SCHEMES.length)return"Please enter a valid index";var n=[],o=[],i=[],r=0;var s=COLOUR_SCHEMES[e];if(t)s=shuffleArray(s);var c=document.documentElement.style;s.forEach((e,t)=>{n.push(rgbArray(e));o.push(rgbArray(c.getPropertyValue(`--c-${t}`)))});o.forEach((e,t)=>{i[t]=setInterval(o=>{e.forEach((a,o)=>e[o]=a>n[t][o]?a-1:a<n[t][o]?a+1:a);c.setProperty(`--c-${t}`,`rgb(${e[0]},${e[1]},${e[2]})`);if(e[0]===n[t][0]&&e[1]===n[t][1]&&e[2]===n[t][2]){clearInterval(i[t]);setDarkClassForSections(s);if(++r>=n.length&&a)a()}},1)})}function changeColourScheme(e,t=true,a){if(e<0||e>=COLOUR_SCHEMES.length)return"Please enter a valid index";var n=COLOUR_SCHEMES[e||currentScheme];if(t)n=shuffleArray(n);var o=document.documentElement;n.forEach((e,t)=>o.style.setProperty(`--c-${t}`,e));setDarkClassForSections(n);if(a)a()}function setDarkClassForSections(e){document.querySelectorAll(".section").forEach((t,a)=>t.classList.toggle("is-dark",isDark(e[a])))}function nextColourSchemeID(){return(currentScheme+1)%COLOUR_SCHEMES.length}function isDark(e){var t=rgbArray(e);return(t[0]*299+t[1]*587+t[2]*114)/1e3<142}function bucket(e){if(e.parentElement.classList.contains("changing"))return;var t=nextColourSchemeID();if(t===2)darkMode(true);if(t===4)darkMode(false);document.body.setAttribute("data-bucket",`${t}`);e.parentElement.classList.add("changing");var a=t=>setTimeout(t=>{e.parentElement.classList.remove("changing");changeBucketColours(nextColourSchemeID());checkMapLayerColor()},1200);if(active_section!==null){transitionColourScheme(t,true,e=>{ripple();a()})}else{var n=navbar.querySelector(".section-title.wave");killWave();setTimeout(e=>{changeColourScheme(t,true,e=>{startWave(1);a()})},n?450:0)}currentScheme=t;trackEvent("Spill","bucket","Colours changed",currentScheme)}function changeBucketColours(e){var t=document.querySelector(".bucket");COLOUR_SCHEMES[e].forEach((e,a)=>t.style.setProperty(`--nc-${a}`,e))}var currentScheme=0;changeColourScheme(currentScheme);changeBucketColours(nextColourSchemeID());var navbar,navbarSections,names,mapContainer,active_section=null,active_work="",active_photo=-1;function darkMode(e){document.documentElement.classList.toggle("dark-mode",e)}if(window.matchMedia)window.matchMedia("(prefers-color-scheme: dark)").addListener(e=>darkMode(e.matches));function redirectToSection(e){history.pushState(null,null,"/");if(e.length===0)return;var t=e.match(/\?[a-z]+/)[0].substring(1);if(!Array.from(document.querySelectorAll(".section-nav span[data-section-name]")).map(e=>e.getAttribute("data-section-name")).includes(t))return;var a=e.split("/").length>1?e.split("/")[1].replace(/[^a-z0-9]/,""):"";document.querySelector(`#id-${t} .text`).addEventListener("animationend",e=>{if(t==="work"&&Array.from(document.querySelectorAll("#id-work .card")).map(e=>e.getAttribute("id")).includes(a))workPicker(a);if(t==="photos"&&0<=parseInt(a)&&parseInt(a)<PHOTOS.length)openPhotoModal(parseInt(a),false);document.body.classList.remove("no-touching")},{once:true});document.body.classList.add("no-touching");setTimeout(e=>trackEvent(`Navigating directly to section: /${t}/${a}`,window.location.pathname),900);setTimeout(e=>navControl(t),1e3)}window.addEventListener("popstate",e=>{navbarSections.forEach(e=>e.classList.remove("active"));hideAllSections();trackEvent("Back button clicked",window.location.pathname,"Home")});var wave,swell,tide,crests=[],troughs=[];function ripple(e=0){clearTimeout(swell);swell=setTimeout((function(){navbarSections.forEach((e,t,a)=>{crests[t]=setTimeout(rippleUp,150*t,e,names[t]);troughs[t]=setTimeout(rippleDown,a.length*150+200*t,e,names[t])})}),e)}function rippleUp(e,t){e.classList.add("wave");if(t)t.classList.add("wave")}function rippleDown(e,t){e.classList.remove("wave");if(t)t.classList.remove("wave")}function startWave(e=0){if(e>0)ripple(e);clearInterval(wave);clearTimeout(tide);tide=setTimeout(e=>wave=setInterval(ripple,4e3),e)}function killWave(e){clearTimeout(tide);clearTimeout(swell);clearInterval(wave);navbarSections.forEach((t,a)=>{clearTimeout(crests[a]);if(a===e){clearTimeout(troughs[a])}else{rippleDown(t,names[a])}})}function highTide(){killWave();navbarSections.forEach((e,t,a)=>setTimeout(rippleUp,150*t,e,names[t]))}function navControl(e){if(!typeof e==="string"||e.length===0)return;var t=navbar.querySelector(`span[data-section-name="${e}"]`);if(!t||!t.parentElement)return;var a=t.parentElement;var n=`id-${e}`;killWave();navbar.classList.remove("active");navbarSections.forEach(e=>e.classList.remove("active"));if(n===active_section){hideAllSections();trackEvent("Section Closed","navbar","Home")}else{showSection(n);navbar.setAttribute("data-bg-color",a.getAttribute("data-bg-color"));navbar.setAttribute("data-open","true");navbar.classList.add("active");a.classList.add("active");document.getElementById("section-container").classList.add("active");document.title=`${e} | rohan bhansali`;history.pushState(null,null,`/${e}`);trackEvent("Section Changed","navbar",e)}}var mapFilesLoadedCount=0;function showSection(e){switch(e){case"id-work":document.querySelectorAll(".card .logo img, .badges img").forEach(e=>e.src=e.getAttribute("data-src"));if(active_work==="")break;document.querySelector(".work.active").classList.remove("active");document.getElementById(active_work).classList.add("hidden");active_work="";break;case"id-skills":loadSkills();break;case"id-photos":if(active_photo!==-1){active_photo=-1;closePhotoModal(false)}genThumbnails();break;case"id-maps":var t=document.querySelector("#id-maps .latest-container img");t.src=t.getAttribute("data-src");loadFile("mapbox","css","https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css");loadFile("mapbox","js","https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.js",initializeMap);loadFile("rides","js","js/rides.js",e=>{loadFile("firebase-app","js","https://www.gstatic.com/firebasejs/7.19.0/firebase-app.js",e=>{loadFile("firebase-storage","js","https://www.gstatic.com/firebasejs/7.19.0/firebase-storage.js")})});break;case"id-about":document.getElementById("me-jpg").src="assets/me.jpg";document.getElementById("me-gif").src="assets/me.gif";break}if(active_section===null){toggleHero();setTimeout(t=>document.getElementById(e).classList.remove("hidden"),1e3)}else{window.scroll({top:0,left:0,behavior:"smooth"});animateOut(`#${active_section}`,"fade-out-bottom",t=>document.getElementById(e).classList.remove("hidden"))}active_section=e}function toggleHero(){var e=document.getElementById("hero");e.style.height=e.style.height===`0px`?`calc(var(--vh, 1vh) * 60)`:`0px`}function loadFile(e,t,a,n=(e=>{})){if(!e||e.length===0||!["css","js"].includes(t)||!a||a.length===0||document.querySelector(`.${t}-${e}`))return;var o=Object.assign(document.createElement(t==="js"?"script":"link"),{...t==="js"?{src:a}:{},...t==="css"?{rel:"stylesheet",href:a}:{},className:`${t}-${e}`,onload:n});document[t==="js"?"body":"head"].appendChild(o)}function hideAllSections(){navbar.setAttribute("data-open","false");navbar.classList.remove("active");document.getElementById("section-container").classList.remove("active");toggleHero();killWave();startWave(1500);document.title=`rohan bhansali`;history.pushState(null,null,"/");animateOut("#"+active_section,"fade-out-bottom");active_section=null}function workPicker(e){if(typeof e!=="string"||e.length===0)return;var t=document.querySelector(`.work[data-work-name="${e}"]`);if(!t)return;if(active_work===e)return;var a=document.getElementById(e);if(active_work===""){a.classList.remove("hidden")}else{document.querySelector(".work.active").classList.remove("active");animateOut(`#${active_work}`,"fade-out-right",e=>a.classList.remove("hidden"))}t.classList.add("active");active_work=e;document.querySelectorAll(".arrow span").forEach(e=>{e.classList.add("fade-down-twice");e.addEventListener("animationend",t=>e.classList.remove("fade-down-twice"),{once:true})});document.title=`${t.querySelector(".work-name").innerText.toLowerCase()} | work | rohan bhansali`;history.pushState("","",`/work/${e}`);trackEvent("Work Clicked",window.location.pathname,e)}var skills,skillCycle,currentHover,pedal;function loadSkills(){skills=document.querySelectorAll(".skill");skills.forEach(e=>{var t=e.firstElementChild;t.src=`/assets/skills/${t.getAttribute("data-src")}.png`;e.onmouseover=e=>killSkillCycle();e.onmouseout=e=>startSkillCycle(1500);e.prepend(document.createElement("div"))});currentHover=0;startSkillCycle(3500)}function killSkillCycle(){clearInterval(skillCycle);clearTimeout(pedal);var e=document.querySelector(".skill.hovered");if(e)e.classList.remove("hovered")}function startSkillCycle(e=0){killSkillCycle();pedal=setTimeout(e=>{skillCycle=setInterval(e=>{var t=document.querySelector(".skill.hovered");if(t)t.classList.remove("hovered");skills[currentHover].classList.add("hovered");currentHover++;if(currentHover>=skills.length)currentHover=0},1500)},e)}function trackEvent(e="click",t="Not Specified",a,n){galite("send","event",t,e,a,n)}function animateOut(e,t,a,n=500){var o=document.querySelector(e);o.classList.add(t);setTimeout(e=>{o.classList.remove(t);o.classList.add("hidden");if(a)a()},n,o,t,a)}function animateIn(e,t,a,n=500){var o=document.querySelector(e);o.classList.remove("hidden");o.classList.add(t);setTimeout(e=>o.classList.remove(t),n,o);if(a)a()}function shuffleArray(e){return e.map(e=>[Math.random(),e]).sort((e,t)=>e[0]-t[0]).map(e=>e[1])}function mobileViewportHack(){document.documentElement.style.setProperty("--vh",`${window.innerHeight*.01}px`)}mobileViewportHack();var debounced,window_height=window.innerHeight;window.addEventListener("resize",e=>{clearTimeout(debounced);debounced=setTimeout(e=>{if(map&&map.resize)map.resize();if(window.innerHeight===window_height)return;window_height=window.innerHeight;mobileViewportHack()},100)});window.addEventListener("orientationchange",mobileViewportHack);document.querySelectorAll("a").forEach(e=>{e.addEventListener("click",t=>{trackEvent("url clicked",window.location.pathname,e.getAttribute("data-name")?e.getAttribute("data-name"):e.hostname)})});document.addEventListener("DOMContentLoaded",e=>{redirectToSection(window.location.search);navbar=document.getElementById("navigation");navbarSections=navbar.querySelectorAll(".section-title");names=document.querySelectorAll("#hero span span");mapContainer=document.querySelector(".map-container");navbarSections.forEach((e,t)=>{e.addEventListener("mouseover",e=>{killWave(t);if(active_section===null)names[t].classList.add("wave")});e.addEventListener("mousemove",e=>{if(active_section===null)names[t].classList.add("wave")});e.addEventListener("mouseout",e=>{killWave();if(active_section===null)startWave(1500)})});startWave(1e3)},{once:true});