//global variables
var current_width = window.innerWidth, current_work;

function fadeIn(el) {
  el.style.opacity = 0;
  var last = +new Date();
	el.style.display = 'block';
  var tick = function() {
    el.style.opacity = +el.style.opacity + (new Date() - last) / 1000;
    last = +new Date();
    if (+el.style.opacity < 1) {
      setTimeout(tick, 16);
    }
  };
  tick();
}

function fadeOut(el) {
  el.style.opacity = 1;
  var last = +new Date();
  var tick = function() {
    el.style.opacity = +el.style.opacity - (new Date() - last) / 1000;
    last = +new Date();
    if (+el.style.opacity >= 0) {
      setTimeout(tick, 16);
    }
  };
  tick();
	setTimeout(function(){
		el.style.display = 'none';
	},1000);
}

/*	resize function called when orientation changed
		caluclate device width and height in px instead of using 100vh to provide better user experience
		this is a workaround to fix a bug where the viewport constantly changes on mobile browsers
		More details here: http://stackoverflow.com/questions/24944925/background-image-jumps-when-address-bar-hides-ios-android-mobile-chrome
*/
function css_resize(){
	current_width = window.innerWidth;
	var height = window.innerHeight;
	document.getElementsByClassName('panel')[0].style.minHeight = height+"px";
	document.getElementsByClassName('half-panel')[0].style.minHeight = height/2+"px";
	document.getElementsByClassName('quarter-panel')[0].style.minHeight = height/4+"px";
	document.getElementsByClassName('arrow-intro')[0].style.minHeight = height*.9+"px";
}

//generate and display google maps as background for experience panel
function showGoogleMaps(location) {
	var latLng = new google.maps.LatLng(location[0],location[1]);
	map = new google.maps.Map(document.getElementById('googlemaps'),{
		zoom: 13,
		scrollwheel: false,
		navigationControl: false,
		mapTypeControl: false,
		scaleControl: false,
		draggable: false,
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: latLng
	});
  fadeIn(document.getElementById('googlemaps'));
  fadeIn(document.getElementById('bg-filter'));
}

// FIXME
//experience panel helper
function loadWorkplace(work,location){
	var activeWorkplace = [];
	for(i=0;i<jobList.length;i++){
		if(jobList[i].id==work){
			activeWorkplace = jobList[i];
		}
	}
	document.getElementsByClassName('img-exp')[0].src = activeWorkplace.image;
	document.getElementsByClassName('exp-title')[0].innerHTML = activeWorkplace.name;
	document.getElementsByClassName('exp-position')[0].innerHTML = activeWorkplace.position;
	document.getElementsByClassName('exp-date')[0].innerHTML = activeWorkplace.date;
	document.getElementsByClassName('exp-text')[0].innerHTML = activeWorkplace.text;
  document.querySelector(".exp-header span").classList.add('flipped');
  var buttons = document.querySelectorAll(".exp-btn a");
  for(i = 0;i<buttons.length;i++){
    buttons[i].classList.add("flipped");
  }
  fadeIn(document.getElementsByClassName('exp-body')[0]);

	//call to display and resize google maps background
	setTimeout(function(){
		// var panelHeight = document.getElementsByClassName('panel-exp')[0].style.height;
    // console.log(panelHeight);
    // $("#googlemaps").show();
		$("#googlemaps").css('height', parseInt($(".panel-exp").css('height'),10)+18+"px");
		$("#bg-filter").css('height', parseInt($(".panel-exp").css('height'),10)+20+"px");
		showGoogleMaps(location);
	},100);
	current_work = work;
}

// FIXME
//experience panel controller
$(".exp-btn").click(function(event) {
	var work = $(this).data('work');
	if(work!=current_work){
		var location = [$(this).data('lat'),$(this).data('long')];
		//preload image for smooth transition
		(new Image()).src = "img/"+work+".jpg";
		if(document.getElementsByClassName('exp-before')[0].style.display!='none'){
			var script = document.createElement('script');
			script.src = "http://maps.googleapis.com/maps/api/js?sensor=false";
			// script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyCl4fBFahd6vX-FDkSoaLzhPihOjsAWQBc&sensor=false";
			document.getElementsByTagName('head')[0].appendChild(script);
			fadeOut(document.getElementsByClassName('exp-before')[0])
		}
		else{
			fadeOut(document.getElementsByClassName('exp-body')[0])
		}
		setTimeout(function(){
			loadWorkplace(work,location);
		},1020);
	}
});

// FIXME
//project panel helper
function projectSwitch(project,btn){
	var laptopScreen = document.getElementsByClassName('laptop-screen')[0];

	//preload images
	(new Image()).src = "img/img-container/"+project+"-laptop.jpg";
	(new Image()).src = "img/img-container/"+project+"-iphone.jpg";

	$(".iphone-screen").hide('slide', { direction: "left"},1000);
	$(".laptop-screen").hide('slide', { direction: "left"},1000);
	fadeOut(document.getElementsByClassName('project-description')[0]);
	var buttons = document.querySelectorAll(".project-btn a");
	for(i=0;i<buttons.length;i++){
		buttons[i].classList.remove('active');
	}

	laptopScreen.dataset.screen=project;

	setTimeout(function() {
		//update front end data
		laptopScreen.src = "img/img-container/"+project+"-laptop.jpg";
		document.getElementsByClassName('iphone-screen')[0].src = "img/img-container/"+project+"-iphone.jpg";
		$(".iphone-screen").show('slide', { direction: "left"},1000);
		$(".laptop-screen").show('slide', { direction: "left"},1000);
		btn.classList.add('active');

		//change descriptions / buttons
		fadeIn(document.getElementsByClassName('project-description')[0]);
		var activeProject = [];
		for(i=0;i<projectList.length;i++){
			if(projectList[i].id==project){
				activeProject = projectList[i];
			}
		}
		document.getElementsByClassName('project-description')[0].innerHTML = activeProject.desription;
		document.getElementsByClassName('project-url')[0].href = activeProject.url;
		document.getElementsByClassName('project-github')[0].href = activeProject.github;
	},1000);
}

//project panel controller
$(".project-list a").click(function() {
	var project = this.dataset.project;
	//only if selected project is different
	if(project != document.getElementsByClassName('laptop-screen')[0]) {
		var btn = this;
		if(document.getElementsByClassName('project-before')[0].style.display != "none"){
			fadeOut(document.getElementsByClassName('project-before')[0]);
			setTimeout(function(){
				fadeIn(document.getElementsByClassName('project-container')[0])
				projectSwitch(project,btn);
			},1000);
		}
		else{
			projectSwitch(project,btn);
		}
	}
});

//scroll to specified div
function scroll(classname){
	scrollTo(document.body,document.getElementsByClassName(classname)[0].offsetTop,1000);
}
//recursive helper
function scrollTo(e, t, duration) {
  if (duration <= 0) return;
  setTimeout(function() {
    e.scrollTop = e.scrollTop + (t - e.scrollTop)/ duration * 10;
    if (e.scrollTop === t) return;
    scrollTo(e, t, duration - 10);
  }, 10);
}

//hover over skill image animations
var skills = document.querySelectorAll(".img-skill");
var skill_container = document.getElementsByClassName("skill-hover")[0];
for (i=0;i<skills.length;i++){
	skills[i].addEventListener("mouseover", function(){
		skill_container.innerHTML = this.getAttribute('alt');
		skill_container.style.opacity = 1;
	},false);
	skills[i].addEventListener("mouseout", function(){
		skill_container.style.opacity = 0;
	},false);
}

document.addEventListener('DOMContentLoaded',function(){
	css_resize();
	setTimeout(function(){
		document.getElementsByClassName('text-copy-first')[0].style.fill = "rgb(49, 48, 43)";
		document.getElementsByClassName('text-copy-last')[0].style.fill = "rgb(49, 48, 43)";
		document.getElementsByClassName('arrow')[0].style.display="block";
	},6100);
	$(".iphone").css("max-height",(parseInt($(".laptop").css('height'),10)-8)+"px");
},false);

//recalculate 100vh size if orientation is changed
window.addEventListener("resize",function() {
	(window.innerWidth != current_width) ? css_resize() : "";
},false);
