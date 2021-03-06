'use strict';

const electron = require('electron');
const ipcMain = require('electron').ipcMain;
const shell = require('electron').shell;
const fs = require('fs');

// Module to control application life.
const app = electron.app;

var handleStartupEvent = function() {
  if (process.platform !== 'win32') {
    return false;
  }

  var squirrelCommand = process.argv[1];
  switch (squirrelCommand) {
    case '--squirrel-install':
    case '--squirrel-updated':

      // Optionally do things such as:
      //
      // - Install desktop and start menu shortcuts
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Always quit when done
      app.quit();

      return true;
    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Always quit when done
      app.quit();

      return true;
    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated
      app.quit();
      return true;
  }
};

if (handleStartupEvent()) {
  return;
}

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let selectWindow;
let secondWindow;
let settingsWindow;

function createSelectWindow () {
  
  
  // Create the browser window.
  selectWindow = new BrowserWindow({width: 400, height: 400, autoHideMenuBar: true});
  //selectWindow.webContents.openDevTools();
  
  // and load the index.html of the app.
  selectWindow.loadURL('file://' + __dirname + '/select.html');
}

function createWindow () {
  
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600, autoHideMenuBar: true, frame: false});
  
  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/dashboard.html');
  
  // Open the DevTools.
  mainWindow.maximize();
//mainWindow.webContents.openDevTools();


  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    if (secondWindow != undefined) {
      secondWindow.close();
    }
    if (addWidgetWindow != undefined) {
      addWidgetWindow.close();
    }    
    if (settingsWindow != undefined) {
      settingsWindow.close();
    }
    mainWindow = null;
  });
}

function createSecondWindow(callback) {
  if (secondWindow == undefined) {
    secondWindow = new BrowserWindow({width: 800, height: 600, resizable: true, autoHideMenuBar: true});
    secondWindow.loadURL('file://' + __dirname + '/viewport.html');

    secondWindow.on('closed', function() {
      secondWindow = null;
    });

    
  //secondWindow.webContents.openDevTools();
    mainWindow.webContents.send('viewport-change', secondWindow.getBounds())  

    secondWindow.webContents.on('did-finish-load', function() {
      callback();
    });
    secondWindow.on('resize', function(e, cmd) {
      mainWindow.webContents.send('viewport-change', secondWindow.getBounds()) 
      secondWindow.webContents.send('viewport-change', secondWindow.getBounds())  
    });
  } else {
    callback();
  }
}

ipcMain.on('openMainWindow', function(event, arg) {
  createWindow(function() {});
});

ipcMain.on('openSecondWindow', function(event, arg) {
  createSecondWindow(function() {});
});

ipcMain.on('asynchronous-message', function(event, arg) {
  createSecondWindow(function() {
    secondWindow.webContents.send('toggle-image-reply', {"display": "none"})
    secondWindow.webContents.send('asynchronous-reply', arg)  
  });
});

ipcMain.on('image-message', function(event, arg) {
  createSecondWindow(function() {
    mainWindow.webContents.send('viewport-change', secondWindow.getBounds()) 
    secondWindow.webContents.send('image-reply', arg)
  });
});

ipcMain.on('toggle-image', function(event, arg) {
    createSecondWindow(function() {
      secondWindow.webContents.send('toggle-image-reply', arg)
    });
});

ipcMain.on('image-change', function(event, arg) {
    createSecondWindow(function() {
      secondWindow.webContents.send('image-change-reply', arg)
    });    
});

ipcMain.on('fogOfWar-draw-erase', function(event, arg) {
    createSecondWindow(function() {
      secondWindow.webContents.send('fogOfWar-draw-erase-reply', arg)
    });    
});

ipcMain.on('fogOfWar-change', function(event, arg) {
    createSecondWindow(function() {
      secondWindow.webContents.send('fogOfWar-change-reply', arg)
    });    
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createSelectWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
