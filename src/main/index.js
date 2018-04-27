import { app, BrowserWindow, Menu, ipcMain, shell, dialog } from 'electron' // eslint-disable-line
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

const template = [
  {
    label: '编辑',
    submenu: [
      {
        label: '撤销',
        role: 'undo',
        accelerator: 'CmdOrCtrl+Z',
      },
      {
        label: '剪切',
        role: 'cut',
        accelerator: 'CmdOrCtrl+X',
      },
      {
        label: '复制',
        role: 'copy',
        accelerator: 'CmdOrCtrl+C',
      },
      {
        label: '粘贴',
        role: 'paste',
        accelerator: 'CmdOrCtrl+V',
      },
      {
        label: '全选',
        role: 'selectall',
        accelerator: 'CmdOrCtrl+A',
      },
    ],
  },
  {
    label: '帮助',
    submenu: [
      {
        label: '使用手册',
        click() {
          shell.openExternal('https://shiroyan.github.io/DLManager');
        },
      },
      {
        label: '刷新',
        role: 'reload',
        accelerator: 'F5',
      },
      {
        label: '重载',
        role: 'forcereload',
        accelerator: 'CmdOrCtrl+R',
      },
      {
        label: '切换开发人员工具',
        role: 'toggledevtools',
        accelerator: 'F12',
      },
      {
        label: '全屏',
        role: 'togglefullscreen',
        accelerator: 'F11',
      },
      {
        label: '关于',
        click() {
          dialog.showMessageBox({
            type: 'info',
            title: '版本信息',
            message: 'DLManager',
            detail: `版本: ${app.getVersion()}\n作者: Shiroyan<shiroyan@qq.com>`,
          });
        },
      },
      {
        label: '检查更新',
        click() {
          autoUpdater.checkForUpdates();
        },
      },
    ],
  },
];

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 768,
    useContentSize: true,
    width: 1366,
    autoHideMenuBar: true,
    show: false,
    title: `项目管理系统 @${app.getVersion()}`,
  });
  //  Set Menu
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.loadURL(winURL);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
  // mainWindow.openDevTools();
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
    speed: +(progressObj.bytesPerSecond / 1024).toFixed(2),
    percent: +progressObj.percent.toFixed(2),
    size: +(progressObj.total / 1024 / 1024).toFixed(2),
  };
  mainWindow.webContents.send('DOWNLOAD_MESSAGE', dowloadInfo);
  // sendStatusToWindow(JSON.stringify(dowloadInfo));
});

autoUpdater.on('update-downloaded', (info) => {
  mainWindow.webContents.send('DOWNLOADED');
  sendStatusToWindow('新的安装包已下载好了, 请重启以更新 (≧∇≦)');
});

ipcMain.on('CANCEL_UPDATE', (event, arg) => {
});

ipcMain.on('DOWNLOAD', (event, arg) => {
  console.log('开始下载..');
  autoUpdater.autoDownload = true;
  autoUpdater.checkForUpdates();
});

ipcMain.on('QUIT_AND_INSTALL', (event, arg) => {
  autoUpdater.quitAndInstall();
});

ipcMain.on('INSTALL_AFTER_QUIT', (event, arg) => {
  app.on('before-quit', () => {
    autoUpdater.quitAndInstall();
  });
});

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') {
    autoUpdater.checkForUpdates();
  }
});
