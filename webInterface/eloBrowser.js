var ws = new WebSocket((useSSL ? "wss://" : "ws://") + window.location.host + "/randomImageBrowserWebSocket");

var username = "likedSavedBrowserClient";

var currentOpacity = 0.3;

var infiniteScroll = false;

//Define the portion of the screen that has to be swiped through for it to count as a swipe
var SWIPE_TOLERANCE = 0.4;
//Variable that stores start of swipe location
var xDown = null; 

function sendMessage(message) {
	if (!ws) {
		console.log("No websocket");
		return;
	}
	
    var payload = {
        "command": message,
        "user": username
    }

    // Make the request to the WebSocket.
    ws.send(JSON.stringify(payload));
}

function handleSetImage(messageDict) {
	//document.getElementById("message").innerHTML = messageDict.serverImagePath + " (" + messageDict.responseToCommand + ")";

	if (infiniteScroll) {
		var infiniteScrollContainer = document.getElementById("infiniteScrollContainer");
		var imageElement = document.createElement("img");
		imageElement.src = '/' + messageDict.serverImagePath;
		imageElement.className = "infiniteScrollImage";
		infiniteScrollContainer.appendChild(imageElement);
		// var infiniteScrollContainer = document.getElementById("infiniteScrollContainer");
		// var imageElement = document.createElement("div");
		// imageElement.style.backgroundImage = "url('/" + messageDict.serverImagePath + "')";
		// imageElement.style.backgroundSize = "contain";
		// imageElement.style.backgroundRepeat = "no-repeat";
		// imageElement.className = "infiniteScrollImage";
		// infiniteScrollContainer.appendChild(imageElement);
	} else {
		// Clear previous media
		var mediaContainer = document.getElementById("mediaContainer");
        //Insert image
		mediaContainer.innerHTML = '<img class="finiteImage" src="/' + messageDict.serverImagePath + '" alt="' + messageDict.serverImagePath + '">';
	}
}

function handleSetVideo(messageDict) {
	//document.getElementById("message").innerHTML = messageDict.serverImagePath + " (" + messageDict.responseToCommand + ")";

	if (infiniteScroll) {
		var infiniteScrollContainer = document.getElementById("infiniteScrollContainer");
		var videoElement = document.createElement("video");
        videoElement.className = "infiniteScrollVideo";
        videoElement.controls = true;

        var sourceElement = document.createElement("source");
        sourceElement.src = '/' + messageDict.serverImagePath;
        
        videoElement.appendChild(sourceElement);
        infiniteScrollContainer.appendChild(videoElement);
	} else {
        // Clear previous media
		var mediaContainer = document.getElementById("mediaContainer");
        //Insert video
        //You could enable controls for the video, but they would be inacessible behind the buttons
        mediaContainer.innerHTML = '<video class="finiteVideo" autoplay controls loop><source src="/' + messageDict.serverImagePath + '"></video>'
	}
}

ws.onmessage = function(evt) {
    var messageDict = JSON.parse(evt.data);


    if (messageDict.action == "setImage") {
        handleSetImage(messageDict);
    }

    if (messageDict.action == "setVideo") {
        handleSetVideo(document.getElementById("mediaContainer").children[0]);
    }

    listenSwipes(mediaContainer)

    if (messageDict.action == "sendDirectory") {
        var directoryListOut = document.getElementById("directoryListContainer");

        // Clear previous list
        while (directoryListOut.firstChild) {
            directoryListOut.removeChild(directoryListOut.firstChild);
        }

        for (var i = 0; i < messageDict.directoryList.length; i++) {
            // Not sure where the leading space is coming from here
            var path = messageDict.directoryList[i].path;

            var newButton = document.createElement("button");
            newButton.classList.add("directoryOrFileButton");
            newButton.classList.add("affectOpacity");
            newButton.classList.add("directoryButton_" + messageDict.directoryList[i].type);
            newButton.onclick = directoryOrFileOnClick(path, messageDict.directoryList[i].serverPath,
                messageDict.directoryList[i].type);
            newButton.innerHTML = path;
            newButton.style.opacity = currentOpacity;

            directoryListOut.appendChild(newButton);
        }
    }
};

// As soon as the websocket opens, request the initial image
ws.onopen = function(event) {
    //var serverStatus = document.getElementById("serverStatus");
    // Hide it if the socket is open, so it doesn't get in the way
    //.innerHTML = "";
    sendMessage("nextImage");
    sendMessage("listCurrentDirectory")
}

// As soon as the websocket opens, request the initial image
ws.onclose = function(event) {
    //var serverStatus = document.getElementById("serverStatus");
    // Hide it if the socket is open, so it doesn't get in the way
    //serverStatus.innerHTML = "Connection to server lost. Reload the page to attempt to reconnect.";
}



// user_choice is an arbitrary string label or int. 
function result(user_choice) {
    console.log("Drag result: ", user_choice);
    if (user_choice == 1) {
        sendMessage('nextImage')
    } else if (user_choice == -1) {
        sendMessage('previousImage')
    }
}


function listenSwipes(element) {
    console.log("listening")
    // Simple click
    //element.addEventListener('click', function(){result(0);}, false);

    // Click and drag (non-touch-screen)
    element.addEventListener('mousedown', handleDragStart, false);
    element.addEventListener('mouseup', handleDragEnd, false);

    // On mobile swipe action
    element.addEventListener('touchstart', handleTouchStart, false);
    element.addEventListener('touchend', handleTouchEnd, false);
}

                                                       
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
    if ( xDiff > SWIPE_TOLERANCE * window.innerWidth) result(1);
    else if ( xDiff < -1 * SWIPE_TOLERANCE * window.innerWidth) result(-1);  
    //else result(0);
    xDown = null;
};