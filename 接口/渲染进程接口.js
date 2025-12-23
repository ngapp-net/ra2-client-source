var 接口 = {
    监听事件: (事件名, 回调函数) => {
        require('electron').ipcRenderer.on(事件名, (event, 数据) => 回调函数(数据));
    }
};
module.exports = 接口;