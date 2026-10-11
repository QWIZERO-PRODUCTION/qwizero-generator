const { app, BrowserWindow, shell } = require('electron');

if (!app.requestSingleInstanceLock()) app.quit();

let win;
function createWindow() {
  win = new BrowserWindow({
    width: 1280, height: 860, minWidth: 720, minHeight: 600,
    backgroundColor: '#01040b', autoHideMenuBar: true, show: false,
    title: 'Qwizero Generator',
    webPreferences: { contextIsolation: true, sandbox: true, spellcheck: false }
  });
  win.once('ready-to-show', () => win.show());
  win.loadFile('index.html');
  // never navigate away (e.g. a file dropped outside the drop zone)
  win.webContents.on('will-navigate', e => e.preventDefault());
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https:\/\//.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  win.webContents.on('render-process-gone', () => win.reload());
}
app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
