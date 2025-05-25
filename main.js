const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 450,
        height: 400,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        // 通知渲染进程应用即将退出
        if (mainWindow) {
            mainWindow.webContents.send('app-quit');
            setTimeout(() => {
                app.quit();
            }, 500);
        } else {
            app.quit();
        }
    }
});

// 确保应用在退出时清理资源
app.on('before-quit', () => {
    if (mainWindow) {
        mainWindow.webContents.send('app-quit');
    }
});
    