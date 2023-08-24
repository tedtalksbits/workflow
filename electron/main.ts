import { app, BrowserWindow, screen } from 'electron';
import path from 'node:path';

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
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;
const isMac = process.platform === 'darwin';
const isProd = process.env.NODE_ENV === 'production' || app.isPackaged;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
  let display = null;
  const displays = screen.getAllDisplays();
  if (!isProd) {
    const devMonitorLabel = isMac ? 'Built-in Retina Display' : 'DELL U2518D';
    display = displays.find((display) =>
      display.label.includes(devMonitorLabel)
    );
  } else {
    display = displays.find(
      (display) => display.bounds.x === 0 && display.bounds.y === 0
    );
  }
  const { width, height } =
    display?.workAreaSize || screen.getPrimaryDisplay().bounds;

  win = new BrowserWindow({
    icon: path.join(process.env.PUBLIC, 'icon.svg'),
    width,
    height,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (!isProd) {
    win.webContents.openDevTools();
  }

  win.setPosition(display?.bounds.x || 0, display?.bounds.y || 0);

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
}

app.on('window-all-closed', () => {
  win = null;
});

app.whenReady().then(createWindow);
