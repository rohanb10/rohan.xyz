function goToPage(e, pageName) {
	// page transition
	e.classList.add('slide-off-screen');
	//redirect
	setTimeout(function() {
		window.location.href = './' + pageName + '/index.html';	
	}, 1000);
	
}