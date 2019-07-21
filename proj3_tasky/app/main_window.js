const electron = require("electron");
const { BrowserWindow } = electron;

class MainWindow extends BrowserWindow {

	constructor(options){
		super(options);		

		// hide the window whenever the user clicks away from the window
		// that's the default behavior of all status bar apps
		this.on('blur', this.onBlur.bind(this));
		this.just_blurred = false;
	}

	onBlur(){
		// console.log('\nsetting just_blurred to true');
		this.just_blurred = true;
		this.hide();
		setTimeout( this.setJustBlurredOff.bind(this), 200);
	}

	setJustBlurredOff(){
		this.just_blurred = false;
		// console.log('setting just_blurred to false');
	}

}

module.exports = MainWindow;