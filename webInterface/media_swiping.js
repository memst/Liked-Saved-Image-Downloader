/*
Script that allows you to swipe on media as a replacement for 'next' and 'previous' buttons
Initial code copied from https://github.com/mtyka/swipelabel
*/


// user_choice is an arbitrary string label or int. 
function result(user_choice) {
	console.log("Drag result: ", user_choice);
	if (user_choice == 1) {
		sendMessage('nextImage')
	} else if (user_choice == -1) {
		sendMessage('previousImage')
	}
}

//get mediaContianer
var mediaContianer = document.getElementById("mediaContainer");

// Simple click
//mediaContianer.addEventListener('click', function(){result(0);}, false);

// Click and drag (non-touch-screen)
mediaContianer.addEventListener('mousedown', handleDragStart, false);
mediaContianer.addEventListener('mouseup', handleDragEnd, false);

// On mobile swipe action
mediaContianer.addEventListener('touchstart', handleTouchStart, false);
mediaContianer.addEventListener('touchend', handleTouchEnd, false);


var xDown = null;                                                        
function handleDragStart(evt) {
	xDown = evt.clientX;
};
function handleDragEnd(evt) {
	handleEnd(evt.clientX);
}; 
function handleTouchStart(evt) {
	xDown = evt.touches[0].clientX;
};
function handleTouchEnd(evt) {
	handleEnd(evt.changedTouches[0].clientX);
};

function handleEnd(xUp) {
	if ( !xDown ) { return; }
	var xDiff = xDown - xUp;
	if ( xDiff > 20 ) result(1);
	else if ( xDiff < -20 ) result(-1);  
	else result(0);
	xDown = null;
};