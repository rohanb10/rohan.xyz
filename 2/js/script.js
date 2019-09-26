var screenWidth = window.innerWidth, currentWork;

function fadeIn(el) {
  el.style.display = 'block';
  setTimeout(function(){
    el.style.opacity = 1;
  },1);
}

function fadeOut(el){
  el.style.opacity = 0;
	setTimeout(function(){
		el.style.display = 'none';
	},1000);
}

function slideIn(el) {
  el.style.display = "block";
  el.style.clip = "rect(0,"+getComputedStyle(el).width+",1000px,0)";
}

function slideOut(el) {
  el.style.clip = "rect(0,0,"+getComputedStyle(el).height+",0)";
  setTimeout(function(){
    el.style.display = "none";
  },1000);
}

/*	resize function called when orientation changed
		caluclate device width and height in px instead of using 100vh to provide better user experience
		this is a workaround to fix a bug where the viewport constantly changes on mobile browsers
		More details here: http://stackoverflow.com/questions/24944925/background-image-jumps-when-address-bar-hides-ios-android-mobile-chrome
*/
function css_resize(){
	screenWidth = window.innerWidth;
	var height = window.innerHeight;
	document.getElementsByClassName('panel')[0].style.minHeight = height+"px";
	document.getElementsByClassName('half-panel')[0].style.minHeight = height/2+"px";
	document.getElementsByClassName('quarter-panel')[0].style.minHeight = height/4+"px";
	document.getElementsByClassName('arrow-intro')[0].style.minHeight = height*.9+"px";
}

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

//project panel controller
var projectButtons = document.querySelectorAll(".project-list a");
for(i=0;i<projectButtons.length;i++){
  projectButtons[i].addEventListener('click',function(){
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
}

//project panel helper
function projectSwitch(project,btn){
	var laptopScreen = document.getElementsByClassName('laptop-screen')[0];
  var iphoneScreen = document.getElementsByClassName('iphone-screen')[0];
  var description = document.getElementsByClassName('project-description')[0];
  var url = document.getElementsByClassName('project-url')[0];
  var github = document.getElementsByClassName('project-github')[0];
	//preload images
	(new Image()).src = "img/img-container/"+project+"-laptop.jpg";
	(new Image()).src = "img/img-container/"+project+"-iphone.jpg";

  slideOut(laptopScreen);
  slideOut(iphoneScreen);
	fadeOut(description);
  fadeOut(url);
  fadeOut(github);

	var buttons = document.querySelectorAll(".project-btn a");
	for(i=0;i<buttons.length;i++){
		buttons[i].classList.remove('active');
	}
	laptopScreen.dataset.screen=project;
	setTimeout(function() {
    var activeProject = [];
		for(i=0;i<projectList.length;i++){
			if(projectList[i].id==project){
				activeProject = projectList[i];
			}
		}
		description.innerHTML = activeProject.desription;
		if(activeProject.url!=""){
      url.href = activeProject.url;
      fadeIn(url);
    }
    if(activeProject.github!=""){
      github.href = activeProject.github;
      fadeIn(github);
    }

		laptopScreen.src = "img/img-container/"+project+"-laptop.jpg";
		iphoneScreen.src = "img/img-container/"+project+"-iphone.jpg";

    slideIn(laptopScreen);
    slideIn(iphoneScreen);
		fadeIn(description);
    btn.classList.add('active');
	},1000);
}

//hover over skill image animations
var skills = document.querySelectorAll(".img-skill");
var skillContainer = document.getElementsByClassName("skill-hover")[0];
for (i=0;i<skills.length;i++){
	skills[i].addEventListener("mouseover", function(){
		skillContainer.innerHTML = this.getAttribute('alt');
		skillContainer.style.opacity = 1;
	},false);
	skills[i].addEventListener("mouseout", function(){
		skillContainer.style.opacity = 0;
	},false);
}

//experience panel controller
var expButtons = document.getElementsByClassName("exp-btn");
for (i=0;i<expButtons.length;i++){
  expButtons[i].addEventListener('click',function(){
    var work = this.dataset.work;
  	if(work!=currentWork){
  		var location = [this.dataset.lat,this.dataset.long];
  		//preload image for smooth transition
  		(new Image()).src = "img/"+work+".jpg";
  		if(document.getElementsByClassName('exp-before')[0].style.display!='none'){
  			var script = document.createElement('script');
  			// script.src = "http://maps.googleapis.com/maps/api/js?sensor=false";
  			script.src = "http://maps.googleapis.com/maps/api/js?key=AIzaSyCl4fBFahd6vX-FDkSoaLzhPihOjsAWQBc";
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
}

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
		var panelHeight = getComputedStyle(document.getElementsByClassName('panel-exp')[0]).height;
    document.getElementById('googlemaps').style.height = parseInt(panelHeight)+18+"px";
    document.getElementById('bg-filter').style.height = parseInt(panelHeight)+20+"px";
		showGoogleMaps(location);
	},50);
	currentWork = work;
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

document.addEventListener('DOMContentLoaded',css_resize(),false);

//recalculate 100vh size if orientation is changed
window.addEventListener("resize",function() {
	(window.innerWidth != screenWidth) ? css_resize() : "";
},false);

window.onload = function(){
  setTimeout(function(){
		document.getElementsByClassName('text-copy-first')[0].style.fill = "rgb(49, 48, 43)";
		document.getElementsByClassName('text-copy-last')[0].style.fill = "rgb(49, 48, 43)";
		fadeIn(document.getElementsByClassName('arrow')[0]);
	},6100);
}
