
const path = require('path');
const electron = require("electron");
const { app, ipcMain } = electron;
const TimerTray = require("./app/timer_tray");
const MainWindow = require("./app/main_window")

// // Enable live reload for content
require('electron-reload')(__dirname);

let mainWindow;
let timerTray;

const bootFunc = () => {

	console.log('app is now ready');

	const options = {
		webPreferences: {  
			nodeIntegration: true,
			backgroundThrottling: false  //doesn't work as advertised
		},
		width: 300,
		height: 500, 
		frame:false,
		resizable:false,
		show:false,
		skipTaskbar: true
	};

	mainWindow = new MainWindow(options);
	mainWindow.loadURL(`file://${__dirname}/src/index.html`);

	// Tray object
	const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
	const iconPath = path.join(__dirname, `./src/assets/${iconName}`);
	// console.log('path:', iconPath);
	
	timerTray = new TimerTray(iconPath, mainWindow); 
}

// app.on( 'event we are listening for', 'func to run when event occurs')
app.on('ready', bootFunc);

ipcMain.on('update-timer', (event, title) => {
	// title is the time left
	console.log('tray title', title);

	// setTitle not supported on Windows. So this doesn't work. 
	timerTray.setTitle(title);
});