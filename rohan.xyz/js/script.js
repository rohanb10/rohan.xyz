function isMobile(){
	if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		return true;
	}
	else {
		return false;
	}
}
$(window).load(function() {
	
	if(isMobile()){
		$(".iphone-container").css("display","none");
		$(".project-btn a").css('min-width', '150px');
	}
	else{
		var newHeight= parseInt($(".laptop").css('height'),10);
		newHeight = Math.round(newHeight);
		$(".iphone").css("max-height",newHeight-4);
		console.log("resized iphone");
	}
	$(".iphone-screen-2").hide();
	$(".laptop-screen-2").hide();

	//active project
	$(".active").first().css('box-shadow', 'inset 250px 0 0 0 #31302B');
	$(".active").first().css('color', '#FFFFFF');
});

$(".project-list a").click(function(){
	//get new project
	var project = $(this).data("project");
	if(project!=$(".laptop-screen").data("screen")){

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
		$(".project-github").show();
		if(project=="sl"){
			$(".project-description").text("Designer");
			$(".project-url").attr("href","http://studlife.com");
			$(".project-github").attr("href","http://github.com/rohanb10/studlife");
		}
		if(project=="sl-housing"){
			$(".project-description").text("hey2");
			$(".project-url").attr("href","http://studlife.com/housing");
			$(".project-github").attr("href","http://github.com/rohanb10/studlife");
		}
		if(project=="sl-whowon"){
			$(".project-description").text("hey3");
			$(".project-url").attr("href","http://studlife.com/whowon1516");
			$(".project-github").attr("href","http://github.com/rohanb10/studlife");
		}
		if(project=="ef"){
			$(".project-description").text("hey4");
			$(".project-url").attr("href","http://eazyfriday.com");
			$(".project-github").hide();
		}
		if(project=="llinder"){
			$(".project-description").text("hey5");
			$(".project-url").attr("href","http://rohanb10.github.io/Llinder");
			$(".project-github").attr("href","http://github.com/rohanb10/Llinder");
		}
		setTimeout(function(){
			// $(".iphone-screen").css('display', 'inline');
			// $(".laptop-screen").css('display', 'inline');
		},1602);
	}
	return false;
});