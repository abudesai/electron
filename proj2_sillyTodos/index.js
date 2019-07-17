
const electron = require("electron");
const {app, BrowserWindow, Menu} = electron;

// // Enable live reload for content
require('electron-reload')(__dirname);

let mainWindow;
const bootFunc = () => {
	console.log('app is now ready');
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800
	});
	mainWindow.loadURL(`file://${__dirname}/main.html`);

	const mainMenu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(mainMenu);

	// this will automatically open dev tools when the window is created. Just for convenience
	mainWindow.webContents.openDevTools();
}

// app.on( 'event we are listening for', 'func to run when event occurs')
app.on('ready', bootFunc);

const menuTemplate = [
{},
	{
		label: 'File',
		submenu: [
			{
				label: 'New Todo'
			}
		]
	}
];