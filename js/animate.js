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

//autoscroll to trigger animations
$(document).ready(function(){
	window.scroll(0,1);
});

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
});