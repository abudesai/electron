
const electron = require("electron");
const {app, BrowserWindow, ipcMain} = electron;
const ffmpeg = require('fluent-ffmpeg');


// // Enable live reload for content
require('electron-reload')(__dirname);

let mainWindow;

const bootFunc = () => {
	// console.log('app is now ready');
	mainWindow = new BrowserWindow({
		webPreferences: {  nodeIntegration: true },
		width: 1500,
		height: 900
	});
	mainWindow.loadURL(`file://${__dirname}/index.html`);

	// this will automatically open dev tools when the window is created. Just for convenience
	mainWindow.webContents.openDevTools();
}

// app.on( 'event we are listening for', 'func to run when event occurs')
app.on('ready', bootFunc);

// IPC - listen for video path submission from the main window
ipcMain.on('video:submit', (event, videoFilePath) => {
	// console.log('received path: ', videoFilePath);

	ffmpeg.ffprobe(videoFilePath, (err, metadata) => {
		// console.log(`Sending video duration: ${metadata.format.duration.toFixed(2)} seconds`);
		mainWindow.webContents.send('videoDuration:send', metadata.format.duration.toFixed(1));
	});
});