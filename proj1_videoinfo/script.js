
// console.log('connected');

const electron = require("electron");
const { ipcRenderer } = electron;

const form = document.querySelector('form');
const duration_h1 =  document.getElementById('duration');

form.addEventListener('submit', (e) => {
	e.preventDefault();
	// console.log('clicked!!');

	const file = document.querySelector('input').files[0];
	const videoFilePath = file.path;
	// console.log('videoFilePath in renderer', videoFilePath);

	// video:submit using backbone notation for naming 
	// noun:verb. 
	// specify the object, and what we are doing with it
	// we could have named it anything
	ipcRenderer.send('video:submit', videoFilePath);
});


// IPC - listen for video duration transmission from Electron after video path was sent
ipcRenderer.on('videoDuration:send', (event, videoDuration) => {
	console.log(`Received video duration: ${videoDuration}`);	
	duration_h1.innerHTML = `Video duration is ${videoDuration} seconds`;
});