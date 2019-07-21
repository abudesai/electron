
const electron = require("electron");
const { Tray, app, Menu } = electron;

class TimerTray extends Tray {

	constructor(iconPath, mainWindow){
		super(iconPath);
		this.mainWindow = mainWindow;
		this.setToolTip('Timer App');
		this.on('click', this.onClick.bind(this));
		this.on('right-click', this.onRightClick.bind(this));
	}

	onClick(event, bounds){

		// click event bounds
		const { x, y } = bounds;
		// console.log('click event bounds (position):', x, y);

		// get overall our main app window dimensions
		const { height, width } = this.mainWindow.getBounds();
		// console.log('window dimensions: ', height, width)
		
		if (this.mainWindow.isVisible()) {
			this.mainWindow.hide();
		} else {
		
			if (this.mainWindow.just_blurred === false) {
				// set position of the window
				this.mainWindow.setBounds({
					x: x - width/2,
					y: process.platform === 'win32' ? y - height : y,
					height,
					width
				});
				this.mainWindow.show();
			};
			
		}
		this.mainWindow.just_blurred = false;
	}

	onRightClick(){
		const menuConfig = Menu.buildFromTemplate([
			{ 
				label: 'Quit',
				click: () => {
					app.quit();
				}
			}
		]);
		this.popUpContextMenu(menuConfig);
	}
}

module.exports = TimerTray;