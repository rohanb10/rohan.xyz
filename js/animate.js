(function($) {

  /**
   * Copyright 2012, Digital Fusion
   * Licensed under the MIT license.
   * http://teamdf.com/jquery-plugins/license/
   *
   * @author Sam Sehnert
   * @desc A small plugin that checks whether elements are within
   *     the user visible viewport of a web browser.
   *     only accounts for vertical position, not horizontal.
   */

   $.fn.visible = function(partial) {

   	var $t            = $(this),
   	$w            = $(window),
   	viewTop       = $w.scrollTop(),
   	viewBottom    = viewTop + $w.height(),
   	_top          = $t.offset().top,
   	_bottom       = _top + $t.height(),
   	compareTop    = partial === true ? _bottom : _top,
   	compareBottom = partial === true ? _top : _bottom;

   	return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

   };

})(jQuery);

// Beginning of rohanb10 code

//close navbar after link selected
$('.nav a').on('click', function(){
	$('.navbar-toggle').click()
});

//scrollspy activate
$('body').scrollspy({
	target: '#navbar' 
});

//scrollspy refresh
$('[data-spy="scroll"]').each(function(){
	var $spy = $(this).scrollspy('refresh');
});

//remove animations on mobile to prevent scrolling breaking
$(document).ready(function(){
	if( /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		$('.animate-left, .animate-right, .animate-zoom').each(function(i, e) {
			$(e).css('visibility', 'visible');
			$(e).addClass('animated zoomIn');
		});
	}
});

//smooth scroll
$(".scroll").click(function(event) {
	if($(this).data('scroll')){
		$('.animate-zoom').each(function(i, e) {
			$(e).css('visibility','visible');
			$(e).addClass('animated zoomIn');
	});
	}
	$('html, body').animate({
		scrollTop: $($(this).data('href')).offset().top
	}, $(this).data('scroll'));
});

//trigger animations
$(window).scroll(function(event) {
	$('.animate-left').each(function(i, e) {
		if ($(e).visible(true)) {
			$(e).css('visibility','visible');
			$(e).addClass('animated fadeInLeft');
		}
	});

	$('.animate-right').each(function(i, e) {
		if ($(e).visible(true)) {
			$(e).css('visibility','visible');
			$(e).addClass('animated fadeInRight');
		} 
	});

	$('.animate-zoom').each(function(i, e) {
		if ($(e).visible(true)) {
			$(e).css('visibility','visible');
			$(e).addClass('animated zoomIn');
		} 
	});
	if ($('.container').offset().top < $(this).scrollTop()) {
		$('.navbar').css('visibility', 'visible');
	}
	else{
		$('.navbar').css('visibility', 'hidden');
	}
});