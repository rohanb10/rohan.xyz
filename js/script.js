//global variables
var character = 0, current=0, next, current_width, current_work, exp_loaded = false;
//roles to cycle through for intro panel
var roles = ["web developer","software engineer", "designer", "problem solver"];

//check for a mobile device
function isMobile() {
	return (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

//type into view
function type(message, div) {
	$(div).append(message[character]);
	character++;
	if (character < message.length) {
		setTimeout(function () {
			type(message, div);
		}, 80);
	}
	else{
		character = 0;
	}
}

//delete old role from view
function backspace() {
	var check = "";
	$('.name-role').html(function (_,txt) {
		check = txt.slice(0, -1);
		return check;
	});
	if(check.length>0) {
		setTimeout(function() {
			backspace();
		}, 60);
	}
	else return;
}

//cycle through roles array
function cycle() {
	//backups in case js fails
	$(".name-hello").text('Hello');
	$(".name-rohan").text('I am Rohan Bhansali');
	$(".name-i-am").text('I am a ');

	next = (current+1)%roles.length;
	setTimeout(function() {
		backspace();
		setTimeout(function() {
			$(".name-role").html("");
			type(roles[next], ".name-role");
		},2000);
	},2000);
	setTimeout(function() {
		current = next;
	},4000);
}

//panel-intro animation control
function firstPanel() {
	$(".spinner").hide('fade',500);
	$("html,body").css('position', 'initial');
	setTimeout(function() {
		$(".name-intro").show();
	},501);
	setTimeout(function() {
		type("Hello",".name-hello");
		setTimeout(function() {
			type("I am Rohan Bhansali",".name-rohan");
			setTimeout(function() {
				type("I am a ",".name-i-am");
				setTimeout(function() {
					type("full-stack developer",".name-role");
					setTimeout(function() {
						cycle();
						setInterval(cycle,5000);
					}, 1500);
					setTimeout(function() {
						$(".arrow-intro").show('fade',500);
					},2500);
				},600);
			},2500);
		},2000);
	},1000);
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
	$("#googlemaps, #bg-filter").show('fade',1000);
}

function loadWorkPlace(work,location){
	if(work=="zappos"){
		$(".img-exp").attr('src', 'img/'+work+".jpg");
		$(".exp-title").html("Zappos.com");
		$(".exp-position").html("Front-End Developer Intern");
		$(".exp-date").html("Summer 2016");
		$(".exp-text").html("<div>I will be working as an intern at Zappos.com in Las Vegas, NV this summer.</div><div>I will be working on the FEZ (Front End Zappos) team.</div><div>Details TBD.</div>");
	}
	if(work=="wustl"){
		$(".img-exp").attr('src', 'img/'+work+".png");
		$(".exp-title").html("Washington University in St. Louis");
		$(".exp-position").html("Teaching Assistant");
		$(".exp-date").html("6 semesters");
		$(".exp-text").html("<div><strong>CSE 131 - Computer Science 1</strong></div><div>This course is introductory Computer Science course taught to over 500 students every semester. It covers many fundamental programming concepts including algorithms, iteration and recursion, inheritance, object oriented programming and some simple data structures. It is taught in Java. As a TA for this course, my duties include:</div><ul><li>Holding weekly lab and studio sessions for around 40 students</li><li>Conducting weekly office hours for more individualized help</li><li>Grading of labs, studios and extensions</li><li>Proctoring and grading three exams every semester</li></ul>");
	}
	if(work=="sl"){
		$(".img-exp").attr('src', 'img/'+work+".jpg");
		$(".exp-title").html("Student Life");
		$(".exp-position").html("Senior Online Editor");
		$(".exp-date").html("August 2014 - Present");
		$(".exp-text").html("<div>Student Life is Washington University's only independent newspaper.<br>As Senior Online Editor, my duties include:</div><ul><li>Working with the editorial staff to design attractive, responsive web pages for their articles</li><li>Performing regular maintenance of servers, backups and archives</li><li>Resolve database errors due to heavy traffic or other unforeseen circumstances</li></ul><div>In the past, I assisted with redesign of the website to make it responsive. You can view the site <a href='http://studlife.com' target='_blank'>here</a> and view our special online projects <a href='https://github.com/rohanb10/studlife' target='_blank'>here</a>.</div>");
	}
	if(work=="ef"){
		$(".exp-title").html("EazyFriday");
		$(".img-exp").attr('src', 'img/'+work+".jpg");
		$(".exp-position").html("Software Developer Intern");
		$(".exp-date").html("Summer 2015");
		$(".exp-text").html("<div>EazyFriday is a Mumbai based software startup. Its goal is to allow users to request home services like electricians and plumbers through a web service and companion apps.</div><div>As an intern, I performed these tasks:</div><ul><li>Developed a dynamic user authorization system for retailers and administrators</li><li>Designed and built a retail management dashboard to control outlet operations</li><li>Designed and built the interface for back-end administrative controls for retailers</li><li>Created an API to be used by the mobile apps</li></ul>You can view their website <a href='http://eazyfriday.com' target='_blank'>here</a>.");
	}
	$(".exp-header span").css({
		'background-color':'rgba(49,48,43,0.7)',
		'color': '#F3F3F3',
	});
	$(".exp-btn a").css({
		'border': '3px solid rgba(49,48,43,0.1)',
		'color': '#F3F3F3',
		'background-color': 'rgba(49,48,43,0.7)'
	});
	$(".exp-body").show('fade',1000);
	exp_loaded = true;
	//call to display correct google maps background
	setTimeout(function(){
		$("#googlemaps").css('height', parseInt($(".panel-exp").css('height'),10)+15+"px");
		$("#bg-filter").css('height', parseInt($(".panel-exp").css('height'),10)+16+"px");
	},100);
	
	showGoogleMaps(location);
	current_work = work;

}

//experience panel controller
$(".exp-btn").click(function(event) {
	var work = $(this).data('work');
	if(work!=current_work){
		var location = [$(this).data('lat'),$(this).data('long')];
		//preload image for smooth transition
		(new Image()).src = "img/"+work+".jpg";
		if(exp_loaded){
			$(".exp-body").hide('fade',1000);
			setTimeout(function(){
				loadWorkPlace(work,location);
			},1020)
		}
		else{
			$.getScript("http://maps.googleapis.com/maps/api/js?key=AIzaSyCl4fBFahd6vX-FDkSoaLzhPihOjsAWQBc&sensor=false");
			$(".exp-before").hide('fade',1000);
			setTimeout(function(){
				loadWorkPlace(work,location);
			},1020);
		}
	}
});

function projectSwitch(project,btn){
	//only if selected project is different
	if(project != $(".laptop-screen").data("screen")) {
		
		//preload images
		(new Image()).src = "img/img-container/"+project+"-laptop.jpg";
		(new Image()).src = "img/img-container/"+project+"-iphone.jpg";

		$(".iphone-screen").hide('slide', { direction: "left"},1000);
		$(".laptop-screen").hide('slide', { direction: "left"},1000);
		$(".project-description").hide('fade',1050);

		$(".project-btn a").css('box-shadow', 'inset 0 0 0 0 #31302B');
		$(".project-btn a").css('color', '#31302B');
		$(".project-btn a").removeClass('active');

		$(".laptop-screen").data("screen",project);

		setTimeout(function() {
			//update front end data 
			$(".iphone-screen").attr("src", "img/img-container/"+project+"-iphone.jpg");
			$(".laptop-screen").attr("src", "img/img-container/"+project+"-laptop.jpg");
			$(".iphone-screen").show('slide', { direction: "left"},1000);
			$(".laptop-screen").show('slide', { direction: "left"},1000);
			btn.css('box-shadow', 'inset 250px 0 0 0 #31302B');
			btn.css('color', '#F3F3F3');
			btn.addClass('active');

			//change descriptions / buttons
			$(".project-description, .project-url").show('fade',1000);

			if(project == "ks") {
				$(".project-description").html("An app that estimates the number of people at dining halls on WUSTL's campus at any given time. Data is gathered from wifi routers across campus and an iPhone app. This project is still under active development");
				$(".project-url").attr("href","http://eazyfriday.com");
				$(".project-github").attr("href","https://github.com/yashdalal/kraudesorce");
				$(".project-url").hide('fade',1000);
			}
			if(project == "sl") {
				$(".project-description").text("I run the website for Student Life. Built using the LAMP stack with Wordpress, it recieves 100,000+ page views from 45,000+ views every month.");
				$(".project-url").attr("href","http://studlife.com");
				$(".project-github").attr("href","https://github.com/rohanb10/studlife");
			}
			if(project == "sl-housing") {
				$(".project-description").text("A comprehensive housing guide for all official campus living options for Washington University. Check out the website and source code below.");
				$(".project-url").attr("href","http://studlife.com/housing");
				$(".project-github").attr("href","https://github.com/rohanb10/studlife");
			}
			if(project == "sl-whowon") {
				$(".project-description").text("An end of year bracket recapping the 32 most notable events on WUSTL's campus in 2015-16. This piece was split into 5 parts, and had a staggered release on the website over the course of a week.");
				$(".project-url").attr("href","http://studlife.com/whowon1516");
				$(".project-github").attr("href","https://github.com/rohanb10/studlife");
			}
			if(project == "llinder") {
				$(".project-description").text("A simple one page responsive website I built for a job application in Fall 2015. The site features pure css parallax scrolling. Check out the website or view the Github for more information.");
				$(".project-url").attr("href","http://rohanb10.github.io/Llinder");
				$(".project-github").attr("href","https://github.com/rohanb10/Llinder");
			}
			if(project == "personal") {
				$(".project-description").html("I redesigned my personal website from scratch over the summer of 2016. Check out the source code at my GitHub or just inspect element instead. Don't forget the <a href='404.html'>404 page.</a>");
				$(".project-url").attr("href","http://rohan.xyz");
				$(".project-github").attr("href","https://github.com/rohanb10/resume");
			}
		},1000);
	}
}

//project panel controller
$(".project-list a").click(function() {
	var project = $(this).data("project");
	var btn = $(this);
	if($(".project-before").css('display')!="none"){
		$(".project-before").hide('fade',1000);
		setTimeout(function(){
			$(".project-container").show('fade',1000);
			projectSwitch(project,btn);
		},1000);
	}
	else{
		projectSwitch(project,btn);
	}
});


//scroll to specified div
function scroll(classname){
	$('html,body').animate({
		scrollTop: $(classname).offset().top
	}, 1000);
}

//hover over skill image animations
$(".img-skill").hover(function() {
	$(".skill-hover").html($(this).attr('alt'));
	$(".skill-hover").css('opacity', '1');
}, function() {
	$(".skill-hover").css('opacity', '0');
});

//resize function called when orientation changed
//caluclate device width and height in px instead of using 100vh to provide better user experience
//this fixes the bug where css vh keep changing on Safari for iOS and Chrome for Android because of the address bar auto-hide
function css_resize(){
	current_width = window.innerWidth;
	$(".panel").css('min-height', window.innerHeight+"px");
	$(".half-panel").css('min-height', (window.innerHeight/2)+"px");
	$(".quarter-panel").css('min-height', (window.innerHeight/4)+"px");
	$(".arrow-intro").css('top', (window.innerHeight*.90)+"px");
}

$(document).ready(function() {
	css_resize();
});

//recalculate 100vh size if orientation is changed
$(window).resize(function() {
	(window.innerWidth != current_width) ? css_resize() : console.log();
});

window.onload = function() {
	//start animating intro panel after 1s
	setTimeout(firstPanel,1000);
	$(".iphone").css("max-height",(parseInt($(".laptop").css('height'),10)-8)+"px");
	$(".project-container").hide();
};