
const electron = require("electron");
const {app, BrowserWindow, Menu, ipcMain} = electron;

// // Enable live reload for content
require('electron-reload')(__dirname);

// --------------------------------------------------------------------------------------
// Create the main window

let mainWindow;

const bootFunc = () => {
	console.log('app is now ready');
	mainWindow = new BrowserWindow({
		webPreferences: {  nodeIntegration: true },
		width: 1200,
		height: 800
	});
	mainWindow.loadURL(`file://${__dirname}/main.html`);

	// We are doing this in case the user closed the main window while the add-todo window is open
	mainWindow.on('closed', () => app.quit());

	const mainMenu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(mainMenu);

	// this will automatically open dev tools when the window is created. Just for convenience
	// mainWindow.webContents.openDevTools();
}

// app.on( 'event we are listening for', 'func to run when event occurs')
app.on('ready', bootFunc);


// --------------------------------------------------------------------------------------
// Create add todo window

let addWindow;
function createAddWindow(){
	addWindow = new BrowserWindow({
		webPreferences: {  nodeIntegration: true },
		width: 400,
		height: 200, 
		title: 'Add New Todo'
	});
	addWindow.loadURL(`file://${__dirname}/add.html`);
	addWindow.on('closed', () => addWindow = null); //for garbage collection
}

// IPC - listen for video path submission from the main window
ipcMain.on('todo:add', (event, todo) => {
	// console.log('received todo: ', todo);
	mainWindow.webContents.send('todo:add', todo);
	addWindow.close();
});
// --------------------------------------------------------------------------------------
function clearTodos(){
	// console.log('clear todos clicked!')
	mainWindow.webContents.send('todos:clear');
}

// --------------------------------------------------------------------------------------

const menuTemplate = [
	{
		label: 'File',
		submenu: [
			{ label: 'New Todo', 
				click(){ createAddWindow(); }
			},
			{ label: 'Clear Todos',
				click() { clearTodos(); } 
			},
			{ label: 'Quit',
				accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click() { app.quit(); } 
			}
		]
	}
];

// menu template works a little differently on macos
// macos shows 'darwin'. windows shows 'win32'
if (process.platform ==='darwin') {
	menuTemplate.unshift({})
}

/*
Check if we are in dev mode or production mode
if in dev mode, we will allow the user to open dev tools
but won't allow it if in production mode
NODE_ENV has 3 values: production, development, staging
Sometimes there may be a 4th value: test
*/

if (process.env.NODE_ENV !== 'production') {
	menuTemplate.push({
		label: 'DEVELOPER!!!', /*make it really obvious that this shouldn't be there in prod mode*/
		submenu: [
			{ role: 'reload' },
			{
				label: 'Toggle Dev Tools',
				accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
				click(item, focusedWindow){
					focusedWindow.toggleDevTools();
				}
			}
		]
	})
}