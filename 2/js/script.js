var character = 0, current=0, next;
var roles = ["web developer","software engineer", "designer", "problem solver"];

function isMobile() {
	return (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

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

function cycle() {
	next = (current+1)%roles.length;
	setTimeout(function() {
		backspace();
		setTimeout(function() {
			type(roles[next], ".name-role");
		},2000);
	},2000);
	setTimeout(function() {
		current = next;
	},4000);
}

function firstPanel() {
	type("Hello",".name-hello");
	setTimeout(function() {
		type("I am Rohan Bhansali",".name-rohan");
		setTimeout(function() {
			type("I am a ",".name-i-am");
			setTimeout(function() {
				type("full-stack developer",".name-role");
				setTimeout(function() {
					//backups
					$(".name-hello").text('Hello');
					$(".name-rohan").text('I am Rohan Bhansali');
					$(".name-i-am").text('I am a ');
					cycle();
					setInterval(cycle,5000);
				},3000);
			},600);
		},2500);
	},2000);
}

//project control
$(".project-list a").click(function() {

	//get new project
	var project = $(this).data("project");
	if(project != $(".laptop-screen").data("screen")) {
		//preload images
		(new Image()).src = "img/img-container/"+project+"-laptop.jpg";
		if(isMobile()){
			(new Image()).src = "img/img-container/"+project+"-iphone.jpg";
		}

		//hide current screen
		$(".iphone-screen").hide('slide', { direction: "left"},1000);
		$(".laptop-screen").hide('slide', { direction: "left"},1000);
		$(".project-description").hide('fade',1050);
		var btn = $(this);

		//remove old button
		$(".project-btn a").css('box-shadow', 'inset 0 0 0 0 #31302B');
		$(".project-btn a").css('color', '#31302B');

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

$(".img-skill").hover(function() {
	$(".skill-hover").html($(this).attr('alt'));
	$(".skill-hover").css('opacity', '1');
}, function() {
	$(".skill-hover").css('opacity', '0');
});

function css_resize(){

	$(".panel").css('min-height', window.innerHeight+"px");
	$(".half-panel").css('min-height', (window.innerHeight/2)+"px");
	$(".quarter-panel").css('min-height', (window.innerHeight/4)+"px");
	$(".arrow-intro").css('top', (window.innerHeight*.85)+"px");
}

$(document).ready(function() {
	setTimeout(firstPanel,1000);
	(window.innerWidth > window.innerHeight_) ? css_resize() :console.log() ;
});

$(window).resize(function() {
	
});

$(window).load(function() {
	$(".active").css("box-shadow","inset 300px 0 0 0 #31302B");
	$(".active").css("color","#F3F3F3");
	$(".iphone").css("max-height",(parseInt($(".laptop").css('height'),10)-8)+"px");
});
