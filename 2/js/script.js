var position;
function isMobile() {
	if(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		return true;
	}
	return false;
}

function type(message) {
	$('.name-intro').append(message[position]);
	position++;
	if (position < message.length) {
		setTimeout(function () {
			type(message);
		}, 70);
	}
}

function firstPanel() {
	position = 0;
	var msg = "Hi, my name is Rohan Bhansali";
	var time = (msg.length*70)+1000;
	type(msg);
	setTimeout(function(){
		position = 0;
		msg="I'm a web developer";
		$('.name-intro').append('<br><br>')
		type(msg);
		time = (msg.length*70)+1000;
		setTimeout(function(){
			$(".panel-intro").css({
				'background-color': '#31302B',
				'color':'#F3F3F3'
			});
		},time);
	},time);
}

$(document).ready(function() {
	setTimeout(firstPanel,1000);	
});

$(window).load(function() {
	if(isMobile()) {
		$(".iphone-container").css("display","none");
		$(".project-btn a").css('min-width', '150px');
		$(".panel-me").css('min-height', '100vh');
		$(".name-intro").css('font-size', '2.7em');
		$(".my-container").css({
			'max-width': '60%',
			'border-width': '5px'
		});
	}
	else{
		var newHeight= parseInt($(".laptop").css('height'),10);
		newHeight = Math.round(newHeight);
		$(".iphone").css("max-height",newHeight-4);
		console.log("resized iphone shell");
	}
	$(".iphone-screen-2").hide();
	$(".laptop-screen-2").hide();

	//set active project
	$(".active").first().css('box-shadow', 'inset 250px 0 0 0 #31302B');
	$(".active").first().css('color', '#FFFFFF');
	
});

//project control
$(".project-list a").click(function(){
	//get new project
	var project = $(this).data("project");
	if(project != $(".laptop-screen").data("screen")){

		//change screens
		var iphone = "img/img-container/"+project+"-iphone.png";
		var laptop = "img/img-container/"+project+"-laptop.png";
		//set second screen to project
		$(".iphone-screen-2").attr("src", iphone);
		$(".laptop-screen-2").attr("src", laptop);
		//hide first screen, show second
		$(".iphone-screen").hide('slide', { direction: "left"},800);
		$(".laptop-screen").hide('slide', { direction: "left"},800);
		$(".iphone-screen-2").show('slide',{ direction: "right"},800);
		$(".laptop-screen-2").show('slide',{ direction: "right"},800);
		//update data
		$(".laptop-screen").data("screen",project);

		window.setTimeout(function(){
			$(".iphone-screen").attr("src", iphone);
			$(".laptop-screen").attr("src", laptop);
			$(".iphone-screen").css('display', 'inline');
			$(".laptop-screen").css('display', 'inline');
			$(".iphone-screen-2").css('display', 'none');
			$(".laptop-screen-2").css('display', 'none');
		},801);
		
		//change active button
		$(".project-btn a").css('box-shadow', 'inset 0 0 0 0 #31302B');
		$(".project-btn a").css('color', '#31302B');
		// $(".project-btn").removeClass('active');
		$(this).css('box-shadow', 'inset 250px 0 0 0 #31302B');
		$(this).css('color', '#FFFFFF');

		//change descriptions
		$(".project-github").css('opacity', '1');
		if(project == "sl"){
			$(".project-description").text("I run the website for Student Life. Built using the LAMP stack with Wordpress, it recieves 100,000+ page views from 45,000+ views every month.");
			$(".project-url").attr("href","http://studlife.com");
			$(".project-github").attr("href","http://github.com/rohanb10/studlife");
		}
		if(project == "sl-housing"){
			$(".project-description").text("A comprehensive housing guide for all official campus living options for Washington Univeristy. Check out the website and source code below.");
			$(".project-url").attr("href","http://studlife.com/housing");
			$(".project-github").attr("href","http://github.com/rohanb10/studlife");
		}
		if(project == "sl-whowon"){
			$(".project-description").text("An end of year bracket recapping the 32 most notable events on WUSTL's campus in 2015-16. This piece was split into 5 parts, and had a staggered release on the website over the course of a week.");
			$(".project-url").attr("href","http://studlife.com/whowon1516");
			$(".project-github").attr("href","http://github.com/rohanb10/studlife");
		}
		if(project == "ef"){
			$(".project-description").html("As an intern for this Mumbai based startup, I worked on building the vendor facing administrative dashboard. I am not permitted to share the code I worked on, but you can view the website below. The website was built using <a href='http://meteor.com' target='_blank'>Meteor</a>.");
			$(".project-url").attr("href","http://eazyfriday.com");
			$(".project-github").css('opacity', '0');
		}
		if(project == "llinder"){
			$(".project-description").text("A simple one page responsive website I built for a job application in Fall 2015. The site features pure css parallax scrolling. Check out the website and source code below.");
			$(".project-url").attr("href","http://rohanb10.github.io/Llinder");
			$(".project-github").attr("href","http://github.com/rohanb10/Llinder");
		}
	}
	return false;
});