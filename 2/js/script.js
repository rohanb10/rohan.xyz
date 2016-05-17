var character = 0, current=0, next, current_width, current_work;
var roles = ["web developer","software engineer", "designer", "problem solver"];

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
	//backups
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

//intro animation control
function firstPanel() {
	$(".sk-cube-grid").hide('fade',500);
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

function showGoogleMaps(lat,long) {	
	var latLng = new google.maps.LatLng(lat, long);

	var mapOptions = {
		zoom: 12, 
		scrollwheel: false,
		navigationControl: false,
		mapTypeControl: false,
		scaleControl: false,
		draggable: false,
		disableDefaultUI: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		center: latLng
	};

	map = new google.maps.Map(document.getElementById('googlemaps'),
		mapOptions);
	$("#googlemaps, #bg-filter").show('fade',1000);
}

$(".exp-btn").click(function(event) {
	//load experience description
	var work = $(this).data('work');
	if(work!=current_work){
		if(work=="zappos"){
			$(".img-exp").attr('src', 'img/'+work+".jpg");
			$(".exp-title").html("Zappos.com");
			$(".exp-position").html("Front-End Developer Intern");
			$(".exp-date").html("June - August 2016");
			$(".exp-text").html("Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in.<br><ul><li>TBD</li><li>TBD</li><li>TBD</li><li>TBD</li><li>TBD</li><li>TBD</li></ul>");
		}
		if(work=="wustl"){
			$(".img-exp").attr('src', 'img/'+work+".jpg");
			$(".exp-title").html("Washington Univeristy in St. Louis");
			$(".exp-position").html("Teaching Assistant");
			$(".exp-date").html("6 semesters");
			$(".exp-text").html("");
		}
		if(work=="sl"){
			$(".img-exp").attr('src', 'img/'+work+".jpg");
			$(".exp-title").html("Student Life");
			$(".exp-position").html("Senior Online Editor");
			$(".exp-date").html("August 2014 - Present");
			$(".exp-text").html("<ul><li>Assisted in redevelopment of website to be responsive</li><li>Performed regular maintenance of servers, backups and archives</li><li>Designed specific webpages as exclusive online content</li><li>Technology used: HTML, CSS, PHP, JavaScript, WordPress</li></ul>");
		}
		if(work=="ef"){
			$(".img-exp").attr('src', 'img/'+work+".jpg");
			$(".exp-title").html("EazyFriday");
			$(".exp-position").html("Software Developer Intern");
			$(".exp-date").html("May - July 2015");
			$(".exp-text").html("<ul><li>Developed a dynamic user access system for retailers and administrators</li><li>Built a retail management dashboard to control outlet operations</li><li>Designed the interface for back-end administrative controls for the website</li><li>Created hooks for an API to be used in mobile apps</li><li>Technology used: MeteorJS, HTML, CSS, JavaScript, jQuery, MongoDB, Git</li><li>TBD</li></ul>");
		}
		$(".exp-overlay span").css({
			'background-color':'rgba(49,48,43,0.7)',
			'color': '#F3F3F3' 
		});
		$(".exp-overlay a").css('color','#F3F3F3');
		$(".exp-body").show('fade',1000);
		showGoogleMaps($(this).data('lat'),$(this).data('long'));
		$("#googlemaps").css('height', parseInt($(".panel-exp").css('height'),10)+15+"px");
		$("#bg-filter").css('height', parseInt($(".panel-exp").css('height'),10)+16+"px");
		current_work = work;
	}
});

//project screen control
$(".project-list a").click(function() {

	//get new project
	var project = $(this).data("project");
	if(project != $(".laptop-screen").data("screen")) {
		
		//preload images
		(new Image()).src = "img/img-container/"+project+"-laptop.jpg";
		(new Image()).src = "img/img-container/"+project+"-iphone.jpg";

		//hide current screen
		$(".iphone-screen").hide('slide', { direction: "left"},1000);
		$(".laptop-screen").hide('slide', { direction: "left"},1000);
		$(".project-description").hide('fade',1050);
		var btn = $(this);

		//remove old button
		$(".project-btn a").css('box-shadow', 'inset 0 0 0 0 #31302B');
		$(".project-btn a").css('color', '#31302B');
		$(".project-btn a").removeClass('active');

		//update data
		$(".laptop-screen").data("screen",project);

		setTimeout(function() {
			//chnage screen source
			$(".iphone-screen").attr("src", "img/img-container/"+project+"-iphone.jpg");
			$(".laptop-screen").attr("src", "img/img-container/"+project+"-laptop.jpg");
			//show new screen
			$(".iphone-screen").show('slide', { direction: "left"},1000);
			$(".laptop-screen").show('slide', { direction: "left"},1000);
			//change to new button
			btn.css('box-shadow', 'inset 250px 0 0 0 #31302B');
			btn.css('color', '#F3F3F3');
			btn.addClass('active')
			
			//change descriptions
			$(".project-description").show('fade',1000);
			if(project == "ef") {
				$(".project-description").html("As an intern for this Mumbai based startup, I worked on building the vendor facing administrative dashboard. I am not permitted to share the code I worked on, but you can view the website below. The website was built using <a href='http://meteor.com' target='_blank'>Meteor</a>.");
				$(".project-url").attr("href","http://eazyfriday.com");
				$(".project-github").hide('fade',1000);
			}
			else{
				$(".project-github").show('fade',1000);
				if(project == "sl") {
					$(".project-description").text("I run the website for Student Life. Built using the LAMP stack with Wordpress, it recieves 100,000+ page views from 45,000+ views every month.");
					$(".project-url").attr("href","http://studlife.com");
					$(".project-github").attr("href","http://github.com/rohanb10/studlife");
				}
				if(project == "sl-housing") {
					$(".project-description").text("A comprehensive housing guide for all official campus living options for Washington Univeristy. Check out the website and source code below.");
					$(".project-url").attr("href","http://studlife.com/housing");
					$(".project-github").attr("href","http://github.com/rohanb10/studlife");
				}
				if(project == "sl-whowon") {
					$(".project-description").text("An end of year bracket recapping the 32 most notable events on WUSTL's campus in 2015-16. This piece was split into 5 parts, and had a staggered release on the website over the course of a week.");
					$(".project-url").attr("href","http://studlife.com/whowon1516");
					$(".project-github").attr("href","http://github.com/rohanb10/studlife");
				}
				if(project == "llinder") {
					$(".project-description").text("A simple one page responsive website I built for a job application in Fall 2015. The site features pure css parallax scrolling. Check out the website and source code below.");
					$(".project-url").attr("href","http://rohanb10.github.io/Llinder");
					$(".project-github").attr("href","http://github.com/rohanb10/Llinder");
				}
			}
		},1000);
	}
	return false;
});


//scroll to div
function scroll(classname){
	$('html,body').animate({
		scrollTop: $(classname).offset().top
	}, 1000);
}

//skill panel, img hover
$(".img-skill").hover(function() {
	$(".skill-hover").html($(this).attr('alt'));
	$(".skill-hover").css('opacity', '1');
}, function() {
	$(".skill-hover").css('opacity', '0');
});

//resize function called when orientation changed
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
	setTimeout(firstPanel,1000);
	$(".active").css("box-shadow","inset 300px 0 0 0 #31302B");
	$(".active").css("color","#F3F3F3");
	$(".iphone").css("max-height",(parseInt($(".laptop").css('height'),10)-8)+"px");
};