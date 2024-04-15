import { app, BrowserWindow, dialog, ipcMain, screen, shell } from 'electron';
import path from 'node:path';
import { connectDB } from './mongodb';
import { setUpIpcListeners } from './setupListeners';

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
const isMac = process.platform === 'darwin';
const isProd = process.env.NODE_ENV === 'production' || app.isPackaged;

function createWindow() {
  console.log('is mac:', isMac, 'is production', isProd);
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'icon.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'));
  }

  // The following is optional and will open the app on a different screen
  const displays = screen.getAllDisplays();
  let display;

  // when in development mode, use the 'dev' monitor. Windows: DELL U2518D, Mac: Built-in Retina display
  if (!isProd) {
    // open the dev tools
    win.webContents.openDevTools();
    const devMonitorLabel = isMac ? 'Built-in Retina display' : 'DELL U2518D';
    console.log('devMonitorLabel:', devMonitorLabel);
    console.log('displays:', displays);
    display = displays.find((display) => {
      return display.label
        .toLowerCase()
        .includes(devMonitorLabel.toLowerCase());
    });
    console.log('Found dev monitor:', display ? display : 'none found');
  } else {
    console.log('In production mode. Using default monitor.');
    // when in production mode, use the default monitor
    display = screen.getPrimaryDisplay();
  }

  if (display) {
    win.setBounds(display.bounds);
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

/*
  ========================================
  DEEP LINKING
  ========================================
*/
// register the application to handla all "electron-mongo://" protocols
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('electron-mongo', process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient('electron-mongo');
}

// Windows and Linux code:
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, commandLine) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
    // the commandLine is array of strings in which last element is deep link url
    dialog.showErrorBox(
      'Welcome Back',
      `You arrived from: ${commandLine.pop()}`
    );
  });

  // Create win, load the rest of the app, etc...
  app.whenReady().then(createWindow).then(connectDB);

  // Mac code:
  app.on('open-url', (event, url) => {
    event.preventDefault();
    dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`);
  });
}

// Handle window controls via IPC
ipcMain.on('shell:open', () => {
  const pageDirectory = __dirname.replace('app.asar', 'app.asar.unpacked');
  const pagePath = path.join('file://', pageDirectory, 'index.html');
  shell.openExternal(pagePath);
});

setUpIpcListeners();

// test

ipcMain.handle('test:test', () => {
  return [
    {
      name: 'test',
      value: 'test',
    },
  ];
});
