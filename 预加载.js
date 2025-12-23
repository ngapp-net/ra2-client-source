const { contextBridge, ipcRenderer } = require('electron')
const 主进程接口 = require('./接口/主进程接口.js');
const 渲染进程接口 = require('./接口/渲染进程接口.js');
var 所有接口 = {};

function 添加主进程接口(名字) {
    所有接口[名字] = (...参数) => {
        return ipcRenderer.invoke(名字, ...参数);
    }
}

function 添加渲染进程接口(名字) {
    所有接口[名字] = (...参数) => {
        return 渲染进程接口[名字](...参数);
    }
}
for (var 名字 in 主进程接口) {
    添加主进程接口(名字);
}

for (var 名字 in 渲染进程接口) {
    添加渲染进程接口(名字);
}

所有接口['主进程'] = (接口名称, ...参数) => {
    return ipcRenderer.invoke(接口名称, ...参数);
};

contextBridge.exposeInMainWorld('接口', 所有接口);
