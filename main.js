const { app, BrowserWindow, screen, ipcMain, session } = require('electron');
const path = require('node:path');
const 接口 = require('./接口/主进程接口.js');
const 交互_下载文件 = require('./交互/下载文件.js');
const { maxHeaderSize } = require('node:http');
const 创建主窗口 = () => {
    const 主窗口 = new BrowserWindow({
        width: 1000,
        height: 800,
        frame: false,
        resizable: false,
        maximizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, '预加载.js')
        }
    })
    主窗口.menuBarVisible = false;
    主窗口.loadFile('index.html');
    // global.主窗口 = 主窗口;
    交互_下载文件.初始化(主窗口);
}

function 注册接口(名字, 方法) {
    ipcMain.handle(名字, (event, ...args) => {
        return 方法(...args);
    });
}
app.whenReady().then(() => {
    console.log('加载完成');

    const 主显示器 = screen.getPrimaryDisplay();
    global.screen = { width, height } = 主显示器.size;
    for (var 名字 in 接口) {
        注册接口(名字, 接口[名字]);
    }



    创建主窗口();
});