/*
Script that allows you to swipe on media as a replacement for 'next' and 'previous' buttons
Initial code copied from https://github.com/mtyka/swipelabel
*/

//Define the portion of the screen that has to be swiped through for it to count as a swipe
var TOLERANCE = 0.1;
var swipeCategory = "Image";


// user_choice is an arbitrary string label or int. 
function result(user_choice) {
	console.log("Drag result: ", user_choice);

	if (user_choice == 1) {
		sendMessage('next' + swipeCategory);
	} else if (user_choice == -1) {
		sendMessage('previous' + swipeCategory);
	}
}

function setSwipeCategory(category) {
	swipeCategory = category;
}


function listenSwipes(element) {
	// Simple click
	//element.addEventListener('click', function(){result(0);}, false);

	// Click and drag (non-touch-screen)
	element.addEventListener('mousedown', handleDragStart, false);
	element.addEventListener('mouseup', handleDragEnd, false);

	// On mobile swipe action
	element.addEventListener('touchstart', handleTouchStart, false);
	element.addEventListener('touchend', handleTouchEnd, false);
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
	//return if no drag start detected
	if ( !xDown ) { 
		return; 
	}

	var xDiff = xDown - xUp;
	console.log("Drag width: ", xDiff)
	if ( xDiff > TOLERANCE * window.innerWidth) result(1);
	else if ( xDiff < -1 * TOLERANCE * window.innerWidth) result(-1);  
	//else result(0);
	xDown = null;
};