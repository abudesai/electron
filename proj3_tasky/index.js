
const path = require('path');
const electron = require("electron");
const {app, BrowserWindow, Tray} = electron;
let trayItem; 

// // Enable live reload for content
require('electron-reload')(__dirname);

let mainWindow;
const bootFunc = () => {
	
	console.log('app is now ready');
	mainWindow = new BrowserWindow({
		webPreferences: {  nodeIntegration: true },
		width: 300,
		height: 500, 
		frame:false,
		resizable:false,
		show:false
	});
	mainWindow.loadURL(`file://${__dirname}/src/index.html`);

	// this will automatically open dev tools when the window is created. Just for convenience
	// mainWindow.webContents.openDevTools();

	// Tray object
	const iconName = process.platform === 'win32' ? 'windows-icon.png' : 'iconTemplate.png';
	const iconPath = path.join(__dirname, `./src/assets/${iconName}`);
	// console.log('path:', iconPath);

	
	trayItem = new Tray(iconPath); 

	trayItem.on('click', (event, bounds) => {

		// click event bounds
		const { x, y } = bounds;
		// console.log('click event bounds (position):', x, y);

		// get overall our main app window dimensions
		const { height, width } = mainWindow.getBounds();
		// console.log('window dimensions: ', height, width)
		
		if (mainWindow.isVisible()) {
			mainWindow.hide();
		} else {
			// set position of the window
			mainWindow.setBounds({
				x: x - width/2,
				y: process.platform === 'win32' ? y - height : y,
				height,
				width
			});
			mainWindow.show();
		}	
	})
	// trayItem.setHighlightMode('always');
}

// app.on( 'event we are listening for', 'func to run when event occurs')
app.on('ready', bootFunc);