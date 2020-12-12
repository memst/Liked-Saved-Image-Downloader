var ws = new WebSocket((useSSL ? "wss://" : "ws://") + window.location.host + "/randomImageBrowserWebSocket");

var username = "likedSavedBrowserClient";

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
	clearMedia();
	// Clear previous media
	var mediaContainer = document.getElementById("mediaContainer");
	mediaContainer.className = "imageContainer";
	//Insert image
	mediaContainer.innerHTML = '<img class="finiteImage" src="/' + messageDict.serverImagePath + '" alt="' + messageDict.serverImagePath + '">';
}

function handleSetVideo(messageDict) {
	clearMedia();
	// Clear previous media
	var mediaContainer = document.getElementById("mediaContainer");
	mediaContainer.className = "videoContainer";
	//Insert video
	//You could enable controls for the video, but they would be inacessible behind the buttons
	mediaContainer.innerHTML = '<video id="video" class="finiteVideo" autoplay controls loop><source src="/' + messageDict.serverImagePath + '"></video>';
	addVideoControls();

}

function clearMedia() {
	var mediaContainer = document.getElementById("mediaContainer");
	mediaContainer.className = "";

	var videoControls = document.getElementById('video-controls');
	videoControls.setAttribute('data-state', 'hidden');
	videoControls.innerHTML = "";
}

function addVideoControls() {
	'use strict';

	// Does the browser actually support the video element?
	var supportsVideo = !!document.createElement('video').canPlayType;

	if (supportsVideo) {
		var videoControls = document.getElementById('video-controls');
		videoControls.innerHTML = '<div class="progress"><progress id="progress" value="0" min="0"><span id="progress-bar"></span></progress></div>';

		// Obtain handles to main elements
		var videoContainer = document.getElementById('videoContainer');
		var video = document.getElementById('video');

		// Hide the default controls
		video.controls = false;
		
		// Display the user defined video controls
		videoControls.setAttribute('data-state', 'visible');

		// Obtain handles to buttons and other elements
		var progress = document.getElementById('progress');
		var progressBar = document.getElementById('progress-bar');

		// If the browser doesn't support the progress element, set its state for some different styling
		var supportsProgress = (document.createElement('progress').max !== undefined);
		if (!supportsProgress) progress.setAttribute('data-state', 'fake');

		// Only add the events if addEventListener is supported (IE8 and less don't support it, but that will use Flash anyway)
		if (document.addEventListener) {
			// Wait for the video's meta data to be loaded, then set the progress bar's max value to the duration of the video
			video.addEventListener('loadedmetadata', function() {
				progress.setAttribute('max', video.duration);
			});

			// As the video is playing, update the progress bar
			video.addEventListener('timeupdate', function() {
				// For mobile browsers, ensure that the progress element's max attribute is set
				if (!progress.getAttribute('max')) progress.setAttribute('max', video.duration);
				progress.value = video.currentTime;
				progressBar.style.width = Math.floor((video.currentTime / video.duration) * 100) + '%';
			});

			// React to the user clicking within the progress bar
			progress.addEventListener('click', function(e) {
				//var pos = (e.pageX  - this.offsetLeft) / this.offsetWidth; // Also need to take the parent into account here as .controls now has position:relative
				var pos = (e.pageX  - (this.offsetLeft + this.offsetParent.offsetLeft)) / this.offsetWidth;
				video.currentTime = pos * video.duration;
			});
		}
	 }
}

ws.onmessage = function(evt) {
	var messageDict = JSON.parse(evt.data);


	if (messageDict.action == "setImage") {
		handleSetImage(messageDict);
	}

	if (messageDict.action == "setVideo") {
		handleSetVideo(messageDict);
	}

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

