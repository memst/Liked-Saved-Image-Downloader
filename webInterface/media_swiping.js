/*
  Script that allows you to swipe on media as a replacement for 'next' and 'previous' buttons
  Initial code copied from https://github.com/mtyka/swipelabel
*/


// user_choice is an arbitrary string label or int. 
function result(user_choice) {
  console.log(user_choice);
}

//get mediaContianer
var mediaContianer = document.getElementById("mediaContainer");

// Simple click
mediaContianer.addEventListener('click', function(){result(0);}, false);        

// Click and drag (non-touch-screen)
mediaContianer.addEventListener('dragstart', handleDragStart, false);
mediaContianer.addEventListener('dragend', handleDragEnd, false);

// On mobile swipe action
mediaContianer.addEventListener('touchstart', handleTouchStart, false);        
mediaContianer.addEventListener('touchmove', handleTouchEnd, false);

var xDown = null;                                                        
function handleDragStart(evt) {                                         
  xDown = evt.clientX;                                      
};                                                
function handleTouchStart(evt) {                                         
  xDown = evt.touches[0].clientX;                                      
};                                                
function handleTouchEnd(evt) {
  handleEnd(evt.touches[0].clientX);
}
function handleDragEnd(evt) {
  handleEnd(evt.clientX);
}
function handleEnd(xUp) {
  if ( !xDown ) { return; }
  var xDiff = xDown - xUp;
  if ( xDiff > 2 ) result(1);   
  if ( xDiff < -2 ) result(-1);   
  xDown = null;
};