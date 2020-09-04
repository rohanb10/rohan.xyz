var PHOTOS=[{index:0,bg:"#89979A",caption:"Kangchendzonga National Park, Sikkim, India"},{index:1,bg:"#6D86B8",caption:"Half Dome from Glacier Point, Yosemite National Park, California"},{index:2,bg:"#82B0D8",caption:"Blue Lake, John Muir Wilderness, Inyo National Forest, California"},{index:3,bg:"#B36F3C",caption:"Emerald Lake, Lakes Trail, Kings Canyon National Park, California"},{index:4,bg:"#2F343B",caption:"Horsetooth Mountain, Fort Collins, Colorado"},{index:5,bg:"#B8C9CC",caption:"Dolores Park, Mission, San Francisco, California"},{index:6,bg:"#8B6151",caption:"Kaibab National Forest, Grand Canyon, Arizona"},{index:7,bg:"#6C7971",caption:"Perugia, Cambria, Italy"},{index:8,bg:"#B26542",caption:"Alghero, Sardinia, Italy"},{index:9,bg:"#5E6C3C",caption:"Rifugio Menaggio, Lake Como, Italy"},{index:10,bg:"#5575C0",caption:"Puez-Geisler National Park, South Tyrol, Italy"},{index:11,bg:"#486BA1",caption:"Peak of Monte Grona, Lake Como, Italy"},{index:12,bg:"#7082A2",caption:"Puez-Geisler National Park, South Tyrol, Italy"},{index:13,bg:"#ADB9D1",caption:"Vembanad Lake, Cochin, Kerala, India"},{index:14,bg:"#6A723E",caption:"Angel Island State Park, San Francisco Bay, California"},{index:15,bg:"#8A7C4C",caption:"Soberanes Point, Carmel, Monterey, California"},{index:16,bg:"#EC965C",caption:"West Point Lighthouse, Discovery Park, Seattle, Washington"},{index:17,bg:"#D6D3CE",caption:"Wallace Falls State Park, Snohomish County, Washington"},{index:18,bg:"#9C7E52",caption:"Laguna Creek Beach, Santa Cruz, California"},{index:19,bg:"#CBAC86",caption:"Tent Rocks National Monument, Sandoval County, New Mexico"},{index:20,bg:"#454934",caption:"Gennargentu National Park, Cala Ganone, Sardinia, Italy"},{index:21,bg:"#94ABBD",caption:"McLaren Park, San Francisco, California"},{index:22,bg:"#2F3411",caption:"Angel Island State Park, San Francisco Bay, California"},{index:23,bg:"#A73E28",caption:"Prewitt Ridge, Big Sur, California"},{index:24,bg:"#536C8B",caption:"Yosemite Falls Trail, Yosemite National Park, California"},{index:25,bg:"#808B63",caption:"Kangchendzonga National Park, Sikkim, India"},{index:26,bg:"#546420",caption:"Briones Regional Park, Lafayette, California"},{index:27,bg:"#D8DEE0",caption:"Mendocino Headlands State Park, Mendocino, California"},{index:28,bg:"#709BC3",caption:"Four Mile Trail, Yosemite National Park, California"},{index:29,bg:"#E9906E",caption:"Shilshole Bay, Ballard, Seattle, Washington"}];const thumbs=document.querySelector(".thumbnails"),modal=document.querySelector(".photo-modal");function genThumbnails(){if(""!==thumbs.innerHTML){var e=shuffleArray(Array.from(thumbs.querySelectorAll(".thumb-container")));return thumbs.innerHTML="",void e.forEach((e,t)=>{e.className="thumb-container fade-in delay-"+(t<18?2500+parseInt(100*t):0),thumbs.appendChild(e)})}(PHOTOS=shuffleArray(PHOTOS)).forEach((e,t)=>{var a=Object.assign(document.createElement("div"),{className:"thumb-container fade-in delay-"+(t<18?2500+parseInt(100*t):0),onclick:t=>openPhotoModal(e.index)});a.setAttribute("data-photo-id",e.index);var o=Object.assign(document.createElement("img"),{className:"placeholder",src:`/assets/photos/thumb/placeholder/${e.index}.svg`,style:"background-color: "+e.bg});a.appendChild(o);var n=Object.assign(document.createElement("img"),{className:"thumb",src:`/assets/photos/thumb/${e.index}.jpg`});a.appendChild(n),thumbs.appendChild(a)}),setTimeout(e=>{thumbs.querySelectorAll(".thumb-container").forEach(e=>{var t=e.querySelector(".placeholder"),a=e.querySelector(".thumb"),o=e=>{setTimeout(e=>{t.style.opacity=0,a.style.filter="blur(0px)"},1e3),setTimeout(e=>t.style.display="none",1500)};a.complete?o():a.onload=e=>o})},3500)}function openPhotoModal(e,t=!0){loadPhoto(e),animateIn(".photo-modal","slide-in-up",null,500),document.addEventListener("keydown",(function e(t){-1!==active_photo&&(39===t.keyCode&&nextPhoto(),37===t.keyCode&&prevPhoto(),27===t.keyCode&&(closePhotoModal(),document.removeEventListener("keydown",e)))})),t&&trackEvent("Photo modal opened",window.location.pathname,identifyPhoto(PHOTOS[e]),e)}function closePhotoModal(){modal.classList.remove("loaded"),animateOut(".photo-modal","slide-out-bottom",e=>{modal.querySelector(".photo-container").style.backgroundImage="",modal.querySelector(".caption").innerHTML="",startLoadingAnimation()}),history.replaceState("","",window.location.origin+"/photos"),trackEvent("Photo modal closed",window.location.pathname),active_photo=-1}function nextPhoto(){active_photo+1>=PHOTOS.length||!modal.querySelector(".bar:last-of-type").classList.contains("done")||(startLoadingAnimation(),loadPhoto(PHOTOS[++active_photo].index,500),trackEvent("Next Photo",window.location.pathname,identifyPhoto(PHOTOS[active_photo]),active_photo))}function prevPhoto(){active_photo<=0||!modal.querySelector(".bar:last-of-type").classList.contains("done")||(startLoadingAnimation(),loadPhoto(PHOTOS[--active_photo].index,500),trackEvent("Prev Photo",window.location.pathname,identifyPhoto(PHOTOS[active_photo]),active_photo))}function loadPhoto(e,t=0){Object.assign(document.createElement("img"),{src:`/assets/photos/${e}.jpg`,onload:a=>{setTimeout(t=>{modal.querySelector(".photo-container").style.backgroundImage=`url('/assets/photos/${e}.jpg')`,endLoadingAnimation()},t)},onerror:endLoadingAnimation});var a=PHOTOS.find(t=>t.index===e);document.title=a.caption.substr(0,a.caption.lastIndexOf(",",a.caption.lastIndexOf(",")-1)).toLowerCase()+" | photos | rohan bhansali",history.replaceState("","","/photos/"+e),modal.querySelector(".caption").innerHTML=formatCaptions(a.caption),active_photo=PHOTOS.findIndex(t=>t.index===e),modal.querySelector(".modal-next-btn").classList.toggle("disabled",active_photo+1>=PHOTOS.length),modal.querySelector(".modal-prev-btn").classList.toggle("disabled",active_photo<=0)}function endLoadingAnimation(){var e=modal.querySelectorAll(".bars div"),t=e.length,a=0;e.forEach((e,o)=>{e.addEventListener("animationiteration",(function n(i){(0===o||a>0)&&(i.target.classList.add("done"),a++,e.removeEventListener("animationiteration",n)),a>=t&&!modal.classList.contains("hidden","slide-in-up","slide-out-bottom")&&modal.classList.add("loaded")}))}),setTimeout(e=>{modal.classList.contains("hidden","slide-in-up","slide-out-bottom")||modal.classList.add("loaded")},2e3)}function startLoadingAnimation(){modal.classList.remove("loaded"),modal.querySelectorAll(".bars div").forEach((e,t)=>setTimeout(t=>e.classList.remove("done"),100*t))}function formatCaptions(e){var t=e.lastIndexOf(",",e.lastIndexOf(",")-1)+1;return e.substr(0,t)+"<br>"+e.substr(t)}function identifyPhoto(e){return`${e.index}.jpg - ${e.caption.substr(0,e.caption.lastIndexOf(",",e.caption.lastIndexOf(",")-1))}`}var map,currentMapLayer,currentMapLayerName="light",paths=[],dist=document.getElementById("distance"),active_city=document.querySelector("h2.active").getAttribute("data-city");const CITIES={SF:{allFocusPt:[37.791,-122.448],rideCount:552,totalDistance:4267},BOM:{allFocusPt:[18.982,72.833],rideCount:51,totalDistance:1004}},MAP_LAYERS={light:"mapbox://styles/mapbox/light-v10",dark:"mapbox://styles/mapbox/dark-v10"};function initializeMap(){setTimeout(e=>document.querySelector("#id-maps .latest-container").classList.remove("not-yet"),4500),L.mapbox.accessToken="pk.eyJ1Ijoicm9oYW5iMTAiLCJhIjoiY2thaDZxaHFvMGRoaDJzbzBtczM3YjNneiJ9.Wza5G0LIJQ8hZjAYsFobYg",map=L.mapbox.map("map").setView(CITIES[active_city].allFocusPt,13).setMaxZoom(15).setMinZoom(10),currentMapLayer=L.mapbox.styleLayer(MAP_LAYERS[currentMapLayerName]),map.addLayer(currentMapLayer),checkMapLayerColor(),map.attributionControl.remove(),setTimeout(e=>map.invalidateSize(),3e3)}function updateMap(e){document.querySelector("#id-maps .latest-container").classList.remove("active"),map&&map.invalidateSize();var t=e.getAttribute("data-ride-id");changeCity(e.getAttribute("data-city"),a=>{if("all"===t)return drawAll(),enableMapInteractions(),void trackEvent("Map Changed",window.location.pathname,"All");if("random"===t){var o=getRandomPathID();return drawSnake(o),void trackEvent("Map Changed",window.location.pathname,"Random",o)}void 0!==RIDES[t]&&(drawSnake(t),trackEvent("Map Changed",window.location.pathname,e.nextElementSibling?e.nextElementSibling.innerText:"Single Ride",t))})}function clearPaths(e=!1){map&&(paths.forEach(e=>e.remove(map)),paths=[],clearTimeout(drawTimeout),resetDistanceContainer(e))}function drawSnake(e){if(map){clearPaths(!0);var t=L.polyline(decodePath(RIDES[e]),{className:"path-single",color:"--var(--c-3)"});paths.push(t),dist.parentElement.classList.remove("hidden"),map.fitBounds(t.getBounds(),{padding:[10,10],animate:!0,pan:{duration:1}}),map.once("moveend",e=>{t.addTo(map);var a=t._path.getTotalLength();Object.assign(t._path.style,{opacity:0,transitionProperty:"stroke-dashoffset",transitionDuration:"1ms",transitionTimingFunction:"linear",strokeDashoffset:a,strokeDasharray:a}),drawTimeout=setTimeout(e=>{Object.assign(t._path.style,{opacity:.7,transitionDuration:getTransitionDuration(t)+"s",strokeDashoffset:0}),startDistanceCountUp(t),disableMapInteractions(),t._path.addEventListener("transitionend",e=>{t._path.style.strokeDasharray="unset",enableMapInteractions()},{once:!0})},150)})}}function drawAll(){clearPaths(),map.flyTo(CITIES[active_city].allFocusPt,12),map.once("moveend",e=>{Object.keys(RIDES).filter(e=>isInActiveCity(e)).forEach((e,t)=>{var a=L.polyline(decodePath(RIDES[e]),{className:"path-all",color:COLOUR_SCHEMES[currentScheme][3]});a.on("click",t=>console.log(e)),allTimeouts[t]=setTimeout(e=>{a.addTo(map),paths.push(a)},20*t*("BOM"===active_city?2.5:1))}),dist.parentElement.classList.remove("hidden"),updateDistance(0,CITIES[active_city].totalDistance/51.97,CITIES[active_city].totalDistance)})}function drawRandom(e){e.classList.add("spin"),e.addEventListener("animationend",t=>e.classList.remove("spin"),{once:!0});var t=getRandomPathID();trackEvent("Map Changed",window.location.pathname,"Random",t),drawSnake(t)}function getRandomPathID(){if(map){for(var e,t=0,a=Math.random()<.2?5e3:Math.random<.4?7e3:Math.random<.6?9e3:11e3,o=Array.from(document.querySelectorAll('.control input[type="radio"]')).map(e=>e.getAttribute("data-ride-id")),n=shuffleArray(Object.keys(RIDES)).filter(e=>isInActiveCity(e)&&!o.includes(e));t<a;)e=n[n.length*Math.random()<<0],t=calcDistance(L.polyline(decodePath(RIDES[e])));return e}}function isInActiveCity(e){return"SF"===active_city?e<35e8:"BOM"===active_city&&e>35e8}function changeCity(e,t=clearPaths){active_city!==e?(active_city=e,document.querySelectorAll("#id-maps input[type=radio]:checked").forEach(e=>e.checked=!1),document.querySelectorAll("#id-maps h2").forEach(t=>t.classList.toggle("active",t.getAttribute("data-city")===e)),document.querySelectorAll("#id-maps .map-controls").forEach(t=>t.classList.toggle("active",t.getAttribute("data-city")===e)),map&&(resetDistanceContainer(),map.flyTo(CITIES[e].allFocusPt,12),map.once("moveend",t))):t()}function calcDistance(e){if(map){var t=e._latlngs[0],a=0;return e._latlngs.forEach(e=>{a+=t.distanceTo(e),t=e}),parseInt(a)}}function getTransitionDuration(e){var t=calcDistance(e)/2e3;return t<=10?10:t}var drawTimeout,distanceTimeout,allTimeouts=[];function resetDistanceContainer(e){dist.parentElement.classList.add("hidden"),clearTimeout(distanceTimeout),allTimeouts.forEach(clearTimeout),allTimeouts=[],setTimeout(e=>dist.innerText="0.0",e?0:305)}function startDistanceCountUp(e){var t=calcDistance(e);updateDistance(0,t/getTransitionDuration(e)*.05/1e3,t/1e3)}function updateDistance(e,t,a){e+=t,dist.innerText=e.toFixed(1),e<a&&(distanceTimeout=setTimeout(o=>updateDistance(e,t,a),49))}function disableMapInteractions(){map&&(mapContainer.classList.add("waiting"),map.dragging.disable(),map.touchZoom.disable(),map.doubleClickZoom.disable(),map.scrollWheelZoom.disable(),map.keyboard.disable(),map.tap&&map.tap.disable())}function enableMapInteractions(){map&&(mapContainer.classList.remove("waiting"),map.dragging.enable(),map.touchZoom.enable(),map.doubleClickZoom.enable(),map.scrollWheelZoom.enable(),map.keyboard.enable(),map.tap&&map.tap.enable())}function changeMapLayer(e){nextMapLayer=L.mapbox.styleLayer(e),currentMapLayerName="custom",map.addLayer(nextMapLayer).removeLayer(currentMapLayer),currentMapLayer=nextMapLayer}function checkMapLayerColor(){if(map&&"custom"!==currentMapLayerName){var e=isDark(document.documentElement.style.getPropertyValue("--c-3"))?"light":"dark";if(e!==currentMapLayerName){currentMapLayerName.length>1&&mapContainer.classList.remove(currentMapLayerName);var t=L.mapbox.styleLayer(MAP_LAYERS[e]);map.addLayer(t).removeLayer(currentMapLayer),mapContainer.classList.add(e),currentMapLayer=t,currentMapLayerName=e,map.invalidateSize()}}}function getLatestRideFromStrava(){fetchRefreshToken().then(fetchAccessToken).then(fetchLastRideID).then(fetchLastRideDetails).then(showLatestContainer).catch(failure)}async function fetchRefreshToken(){if(!firebase)throw"Unable to connect to Firebase";return firebase.initializeApp({apiKey:"AIzaSyCCUMGIJk8LwLC5_FMY0B2o8Sh0aegCsds",authDomain:"strava-xyz.firebaseapp.com",databaseURL:"https://strava-xyz.firebaseio.com",projectId:"strava-xyz",storageBucket:"strava-xyz.appspot.com",messagingSenderId:"974189997715",appId:"1:974189997715:web:44d445b481d57fc310a766"}),await firebase.storage().ref().child("refresh.json").getDownloadURL().then(e=>fetch(e).then(e=>e.text().then(e=>JSON.parse(e))))}async function fetchAccessToken(e){if(!e||!e.refresh_token)throw"No refresh_token found in refresh.json";var t="https://www.strava.com/oauth/token?"+new URLSearchParams(e).toString();return await fetch(t,{method:"POST"}).then(t=>t.text().then(t=>{var a=JSON.parse(t);return a.refresh_token!==e.refresh_token&&(e.refresh_token=a.refresh_token,firebase.storage().ref().child("refresh.json").put(new File([JSON.stringify(e)],"refresh.json",{type:"application/json"})).then(e=>console.log("refresh_token updated and saved to Firebase."))),a}))}async function fetchLastRideID(e){if(!e||!e.access_token)throw"Unable to get valid access_token";var t={headers:{Authorization:`${e.token_type} ${e.access_token}`}},a="https://www.strava.com/api/v3/athlete/activities?"+new URLSearchParams({per_page:1}).toString();return await fetch(a,t).then(e=>e.text().then(e=>{var a=JSON.parse(e);if(1!==a.length)throw"Unable to get list of rides using access token";return{rideId:a[0].id,options:t}}))}async function fetchLastRideDetails(e){if(!e||!e.rideId||!e.options)throw"Inavlid RideID";var t="https://www.strava.com/api/v3/activities/"+e.rideId;return await fetch(t,e.options).then(e=>e.text().then(e=>JSON.parse(e)))}function showLatestContainer(e){if(!e||!e.id||!e.map.polyline)throw"Inavlid ride object";RIDES[e.id]=e.map.polyline;var t=document.querySelector("#id-maps .latest-container"),a=new Intl.DateTimeFormat("en-IN",{day:"numeric",month:"short",year:"numeric"}).format(new Date(e.start_date_local));t.querySelector(".latest-title span").innerText="- "+a,t.querySelector(".latest-title a").href="https://www.strava.com/activities/"+e.id;var o=Object.assign(document.createElement("div"),{className:"control"}),n=Object.assign(document.createElement("input"),{type:"radio",name:"rides",id:"ride-latest"});n.setAttribute("data-city","BOM"),n.setAttribute("data-ride-id",e.id),n.onchange=e=>{updateMap(n),t.classList.add("active")};var i=Object.assign(document.createElement("label"),{innerText:e.name});i.setAttribute("for","ride-latest"),o.appendChild(n),o.appendChild(i),t.appendChild(o),t.classList.add("success"),RIDES[e.id]=e.map.polyline,console.log("ride "+e.id+" succesfully fetched from strava")}function failure(e){console.log("Error pulling from Strava - ",e)}function decodePath(e){for(var t,a=0,o=0,n=0,i=[],r=0,s=0,c=null,l=1e5;a<e.length;){c=null,r=0,s=0;do{s|=(31&(c=e.charCodeAt(a++)-63))<<r,r+=5}while(c>=32);t=1&s?~(s>>1):s>>1,r=s=0;do{s|=(31&(c=e.charCodeAt(a++)-63))<<r,r+=5}while(c>=32);o+=t,n+=1&s?~(s>>1):s>>1,i.push([o/l,n/l])}return i}const COLOUR_SCHEMES=[["rgb( 76,187,185)","rgb(255,190,105)","rgb(152,214,234)","rgb(255, 99, 99)","rgb(133,102,170)"],["rgb(240, 92,136)","rgb(111,125,246)","rgb(119,203,249)","rgb(255,168,  5)","rgb( 66,199,153)"],["rgb(239,194,184)","rgb(149,187,217)","rgb(188,220,150)","rgb(238,222,151)","rgb(214,217,253)"],["rgb(254,138,138)","rgb(127,102,152)","rgb(250,210,109)","rgb(127,182,161)","rgb(139,197,217)"],["rgb(145, 48, 48)","rgb( 39, 90,119)","rgb( 36,107, 80)","rgb(194,129, 71)","rgb(112, 72,111)"]];function changeColours(e){var t=document.documentElement,a="New Colours: ";return e.forEach((e,o)=>{e=`rgb(${+`0x${e[1]}${e[2]}`},${+`0x${e[3]}${e[4]}`},${+`0x${e[5]}${e[6]}`})`,t.style.setProperty("--c-"+o,e),a+=e+", "}),currentScheme=-1,a}function rgbArray(e){return e=e.substr(4).split(")")[0].split(","),[parseInt(e[0]),parseInt(e[1]),parseInt(e[2])]}function transitionColourScheme(e,t=!0,a){if(e<0||e>=COLOUR_SCHEMES.length)return"Please enter a valid index";var o=[],n=[],i=[],r=0,s=COLOUR_SCHEMES[e];t&&(s=shuffleArray(s));var c=document.documentElement.style;s.forEach((e,t)=>{o.push(rgbArray(e)),n.push(rgbArray(c.getPropertyValue("--c-"+t)))}),n.forEach((e,t)=>{i[t]=setInterval(n=>{e.forEach((a,n)=>e[n]=a>o[t][n]?a-1:a<o[t][n]?a+1:a),c.setProperty("--c-"+t,`rgb(${e[0]},${e[1]},${e[2]})`),e[0]===o[t][0]&&e[1]===o[t][1]&&e[2]===o[t][2]&&(clearInterval(i[t]),setDarkClassForSections(s),++r>=o.length&&a&&a())},1)})}function changeColourScheme(e,t=!0,a){if(e<0||e>=COLOUR_SCHEMES.length)return"Please enter a valid index";var o=COLOUR_SCHEMES[e||currentScheme];t&&(o=shuffleArray(o));var n=document.documentElement;o.forEach((e,t)=>n.style.setProperty("--c-"+t,e)),setDarkClassForSections(o),a&&a()}function setDarkClassForSections(e){document.querySelectorAll(".section").forEach((t,a)=>t.classList.toggle("is-dark",isDark(e[a])))}function nextColourSchemeID(){return currentScheme+1<COLOUR_SCHEMES.length?currentScheme+1:0}function isDark(e){var t=rgbArray(e);return(299*t[0]+587*t[1]+114*t[2])/1e3<142}function bucket(e){if(!e.parentElement.classList.contains("changing")){var t=nextColourSchemeID();2===t&&darkMode(!0),4===t&&darkMode(!1),e.parentElement.classList.add("changing");var a=t=>{checkMapLayerColor(),setTimeout(t=>{e.parentElement.classList.remove("changing"),changeBucketColours(nextColourSchemeID())},1200)};if(null!==active_section)transitionColourScheme(t,!0,e=>{ripple(),a()});else{var o=navbar.querySelector(".section-title.wave");killWave(),setTimeout(e=>{changeColourScheme(t,!0,e=>{startWave(1),a()})},o?450:0)}trackEvent("Spill","bucket","Colours changed",currentScheme=t)}}function changeBucketColours(e){var t=document.querySelector(".bucket");COLOUR_SCHEMES[e].forEach((e,a)=>t.style.setProperty("--nc-"+a,e))}var currentScheme=0;changeColourScheme(currentScheme),changeBucketColours(nextColourSchemeID());var navbar,navbarSections,names,mapContainer,active_section=null,active_work="",active_photo=-1;function darkMode(e){document.documentElement.classList.toggle("dark-mode",e)}function redirectToSection(e){if(history.replaceState(null,null,"/"),0!==e.length){var t=e.match(/\?[a-z]+/)[0].substring(1);if(Array.from(document.querySelectorAll(".section-nav span[data-section-name]")).map(e=>e.getAttribute("data-section-name")).includes(t)){var a=e.split("/").length>1?e.split("/")[1].replace(/[^a-z0-9]/,""):"";document.querySelector(`#id-${t} .text`).addEventListener("animationend",e=>{"work"===t&&Array.from(document.querySelectorAll("#id-work .card")).map(e=>e.getAttribute("id")).includes(a)&&workPicker(a),"photos"===t&&0<=parseInt(a)&&parseInt(a)<PHOTOS.length&&openPhotoModal(parseInt(a),!1),document.body.classList.remove("no-touching")},{once:!0}),document.body.classList.add("no-touching"),setTimeout(e=>trackEvent(`Navigating directly to section: /${t}/${a}`,window.location.pathname),900),setTimeout(e=>navControl(t),1e3)}}}window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches&&darkMode(),window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").addListener(e=>darkMode(e.matches)),window.addEventListener("popstate",e=>{navbarSections.forEach(e=>e.classList.remove("active")),hideAllSections(),trackEvent("Back button clicked",window.location.pathname,"Home")});var wave,swell,tide,crests=[],troughs=[];function ripple(e=0){clearTimeout(swell),swell=setTimeout((function(){navbarSections.forEach((e,t,a)=>{crests[t]=setTimeout(rippleUp,150*t,e,names[t]),troughs[t]=setTimeout(rippleDown,150*a.length+200*t,e,names[t])})}),e)}function rippleUp(e,t){e.classList.add("wave"),t&&t.classList.add("wave")}function rippleDown(e,t){e.classList.remove("wave"),t&&t.classList.remove("wave")}function startWave(e=0){e>0&&ripple(e),clearInterval(wave),clearTimeout(tide),tide=setTimeout(e=>wave=setInterval(ripple,4e3),e)}function killWave(e){clearTimeout(tide),clearTimeout(swell),clearInterval(wave),navbarSections.forEach((t,a)=>{clearTimeout(crests[a]),a===e?clearTimeout(troughs[a]):rippleDown(t,names[a])})}function highTide(){killWave(),navbarSections.forEach((e,t,a)=>setTimeout(rippleUp,150*t,e,names[t]))}function navControl(e){if(0!==e.length){var t=navbar.querySelector(`span[data-section-name="${e}"]`);if(t&&t.parentElement){var a=t.parentElement,o="id-"+e;killWave(),navbar.classList.remove("active"),navbarSections.forEach(e=>e.classList.remove("active")),o===active_section?(hideAllSections(),trackEvent("Section Closed","navbar","Home")):(showSection(o),navbar.setAttribute("data-bg-color",a.getAttribute("data-bg-color")),navbar.setAttribute("data-open","true"),navbar.classList.add("active"),a.classList.add("active"),document.getElementById("section-container").classList.add("active"),document.title=e+" | rohan bhansali",history.replaceState(null,null,"/"+e),trackEvent("Section Changed","navbar",e))}}}var skills,skillCycle,currentHover,pedal,debounced,mapFilesLoadedCount=0;function showSection(e){switch(e){case"id-work":if(document.querySelectorAll(".card .logo img, .badges img").forEach(e=>e.src=e.getAttribute("data-src")),""===active_work)break;document.querySelector(".work.active").classList.remove("active"),document.getElementById(active_work).classList.add("hidden"),active_work="";break;case"id-skills":loadSkills();break;case"id-photos":-1!==active_photo&&(active_photo=-1,closePhotoModal(!1)),genThumbnails();break;case"id-maps":var t=document.querySelector("#id-maps .latest-container img");t.src=t.getAttribute("data-src"),loadFile("mapbox","css","https://api.mapbox.com/mapbox.js/v3.3.1/mapbox.css"),loadFile("mapbox","js","https://api.mapbox.com/mapbox.js/v3.3.1/mapbox.js",initializeMap),loadFile("rides","js"),loadFile("firebase-app","js","https://www.gstatic.com/firebasejs/7.19.0/firebase-app.js",e=>{loadFile("firebase-storage","js","https://www.gstatic.com/firebasejs/7.19.0/firebase-storage.js",getLatestRideFromStrava)});break;case"id-about":document.getElementById("me-jpg").src="assets/me.jpg",document.getElementById("me-gif").src="assets/me.gif"}null===active_section?(toggleHero(),setTimeout(t=>document.getElementById(e).classList.remove("hidden"),1e3)):(window.scroll({top:0,left:0,behavior:"smooth"}),animateOut("#"+active_section,"fade-out-bottom",t=>document.getElementById(e).classList.remove("hidden"))),active_section=e}function toggleHero(){var e=document.getElementById("hero");e.style.height="0px"===e.style.height?"calc(var(--vh, 1vh) * 60)":"0px"}function loadFile(e,t,a,o=(e=>{})){if(!(document.querySelectorAll(`.${t}-${e}`).length>0)){var n=Object.assign(document.createElement("js"===t?"script":"link"),{..."js"===t&&void 0===a?{src:`js/${e}.js`}:{},..."js"===t&&void 0!==a?{src:a}:{},..."css"===t?{rel:"stylesheet"}:{},..."css"===t&&void 0===a?{href:`css/${e}.css`}:{},..."css"===t&&void 0!==a?{href:a}:{},className:`${t}-${e}`});n.onload=o,"js"===t&&document.body.appendChild(n),"css"===t&&document.head.appendChild(n)}}function hideAllSections(){navbar.setAttribute("data-open","false"),navbar.classList.remove("active"),document.getElementById("section-container").classList.remove("active"),toggleHero(),killWave(),startWave(1500),document.title="rohan bhansali",history.replaceState(null,null,"/"),animateOut("#"+active_section,"fade-out-bottom"),active_section=null}function workPicker(e){if("string"==typeof e&&0!==e.length){var t=document.querySelector(`.work[data-work-name="${e}"]`);if(t&&active_work!==e){var a=document.getElementById(e);""===active_work?a.classList.remove("hidden"):(document.querySelector(".work.active").classList.remove("active"),animateOut("#"+active_work,"fade-out-right",e=>a.classList.remove("hidden"))),t.classList.add("active"),active_work=e,document.querySelectorAll(".arrow span").forEach(e=>{e.classList.add("fade-down-twice"),e.addEventListener("animationend",t=>e.classList.remove("fade-down-twice"),{once:!0})}),document.title=t.querySelector(".work-name").innerText.toLowerCase()+" | work | rohan bhansali",history.replaceState("","","/work/"+e),trackEvent("Work Clicked",window.location.pathname,e)}}}function loadSkills(){(skills=document.querySelectorAll(".skill")).forEach(e=>{var t=e.firstElementChild;t.src=`/assets/skills/${t.getAttribute("data-src")}.png`,e.onmouseover=e=>killSkillCycle(),e.onmouseout=e=>startSkillCycle(1500),e.prepend(document.createElement("div"))}),currentHover=0,startSkillCycle(3500)}function killSkillCycle(){clearInterval(skillCycle),clearTimeout(pedal);var e=document.querySelector(".skill.hovered");e&&e.classList.remove("hovered")}function startSkillCycle(e=0){killSkillCycle(),pedal=setTimeout(e=>{skillCycle=setInterval(e=>{var t=document.querySelector(".skill.hovered");t&&t.classList.remove("hovered"),skills[currentHover].classList.add("hovered"),++currentHover>=skills.length&&(currentHover=0)},1500)},e)}function trackEvent(e="click",t="Not Specified",a,o){galite("send","event",t,e,a,o)}function animateOut(e,t,a,o=500){var n=document.querySelector(e);n.classList.add(t),setTimeout(e=>{n.classList.remove(t),n.classList.add("hidden"),a&&a()},o,n,t,a)}function animateIn(e,t,a,o=500){var n=document.querySelector(e);n.classList.remove("hidden"),n.classList.add(t),setTimeout(e=>n.classList.remove(t),o,n),a&&a()}function shuffleArray(e){return e.map(e=>[Math.random(),e]).sort((e,t)=>e[0]-t[0]).map(e=>e[1])}function mobileViewportHack(){document.documentElement.style.setProperty("--vh",.01*window.innerHeight+"px")}var window_height=window.innerHeight;window.addEventListener("resize",e=>{window.innerHeight!==window_height&&(clearTimeout(debounced),debounced=setTimeout(mobileViewportHack,100))}),mobileViewportHack(),window.addEventListener("orientationchange",mobileViewportHack),document.querySelectorAll("a").forEach(e=>{e.addEventListener("click",t=>{trackEvent("url clicked",window.location.pathname,e.getAttribute("data-name")?e.getAttribute("data-name"):e.hostname)})}),document.addEventListener("DOMContentLoaded",e=>{redirectToSection(window.location.search),navbar=document.getElementById("navigation"),navbarSections=navbar.querySelectorAll(".section-title"),names=document.querySelectorAll("#hero span span"),mapContainer=document.querySelector(".map-container"),navbarSections.forEach((e,t)=>{e.addEventListener("mouseover",e=>{killWave(t),null===active_section&&names[t].classList.add("wave")}),e.addEventListener("mousemove",e=>{null===active_section&&names[t].classList.add("wave")}),e.addEventListener("mouseout",e=>{killWave(),null===active_section&&startWave(1500)})}),startWave(1e3)},{once:!0});