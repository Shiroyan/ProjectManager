import { app, BrowserWindow, Menu, ipcMain } from 'electron' // eslint-disable-line
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  Menu.setApplicationMenu(null);
  mainWindow = new BrowserWindow({
    height: 768,
    useContentSize: true,
    width: 1366,
    autoHideMenuBar: true,
    title: '项目管理系统',
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  mainWindow.openDevTools();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});


/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */


autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.autoDownload = false;


function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('UPDATE_LOG', text);
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('正在检查可用的更新 (￣▽￣)／');
});

autoUpdater.on('update-available', (info) => {
  mainWindow.webContents.send('VERSION_INFO', info);
  sendStatusToWindow('发现新版本 ( • ̀ω•́ )✧');
});

autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('没有可用的更新 (｡･ω･｡)');
});

autoUpdater.on('error', (err) => {
  sendStatusToWindow(`在自动更新中发生了错误. !!!∑(ﾟДﾟノ)ノ' 
  ${err}`);
  mainWindow.webContents.send('UPDATE_ERROR', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  let dowloadInfo = {
    speed: progressObj.bytesPerSecond,
    percent: progressObj.percent,
    size: progressObj.total,
  };
  mainWindow.webContents.send('DOWNLOAD_MESSAGE', dowloadInfo);
  sendStatusToWindow(JSON.stringify(dowloadInfo));
});

autoUpdater.on('update-downloaded', (info) => {
  mainWindow.webContents.send('DOWNLOADED');
  sendStatusToWindow('新的安装包已下载好了, 请重启以更新 (≧∇≦)');
});

ipcMain.on('DOWNLOAD', async (event, arg) => {
  await autoUpdater.doDownloadUpdate();
});

ipcMain.on('QUIT_AND_INSTALL', (event, arg) => {
  autoUpdater.quitAndInstall();
});

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') {
    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 60000);
  }
});
