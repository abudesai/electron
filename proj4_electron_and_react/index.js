
const electron = require("electron");
const {app, BrowserWindow, ipcMain, shell} = electron;
const ffmpeg = require('fluent-ffmpeg');


// // Enable live reload for content
require('electron-reload')(__dirname);

let mainWindow;

const bootFunc = () => {

	mainWindow = new BrowserWindow({
		webPreferences: {  
			nodeIntegration: true
		},
		width: 1500,
		height: 900
	});
	mainWindow.loadURL(`file://${__dirname}/src/index.html`);

	// this will automatically open dev tools when the window is created. Just for convenience
	mainWindow.webContents.openDevTools();
}

// app.on( 'event we are listening for', 'func to run when event occurs')
app.on('ready', bootFunc);


ipcMain.on("videos:added", (event, videos) => {
	// console.log("Received videos", videos);

	const promises = videos.map( video => {
		return new Promise( (resolve, reject) => {
			ffmpeg.ffprobe(video.path, (err, metadata) => {
				resolve( {
					...video,
					duration: metadata.format.duration,
					format: 'avi'
				} );
			});
		});
	});

	Promise.all(promises)
		.then( results => {
			// results.forEach( result => {
			// 	console.log(`video duration: ${result.duration} seconds`);
			// });

			// console.log("sending results back to mainWindow", results);
			mainWindow.webContents.send("metadata:complete", results);
		});

});



ipcMain.on("conversion:start", (event, videos) => {

	// console.log("Received videos from MainWindow for format conversion", videos);

	videos.forEach( video => {
		const outputDir = video.path.split(video.name)[0];
		const outputFileName = video.name.split('.')[0];
		const outputPath = `${outputDir}${outputFileName}.${video.format}`
		// console.log("outputDir: ", outputDir);
		// console.log("outputFileName: ", outputFileName);
		// console.log("outputPath: ", outputPath);

		ffmpeg(video.path)
			.output(outputPath)
			.on( 'progress', ( {timemark} ) => mainWindow.webContents.send( "conversion:progress", { video, timemark } ) )
			.on( 'end', () => mainWindow.webContents.send( "conversion:end", { video, outputPath } ) )
			.run();
	});
	
});

ipcMain.on("folder:open", (event, outputPath) => {
	shell.showItemInFolder(outputPath);
});