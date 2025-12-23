const { session, ipcMain } = require('electron');
var 下载文件 = {
    webContents: null,
    下载文件列表: [],
    初始化: function (webContents) {
        this.webContents = webContents;
        var self = this;

        ipcMain.handle('暂停下载', this.暂停下载);
        ipcMain.handle('恢复下载', this.恢复下载);
        ipcMain.handle('取消下载', this.取消下载);

        // session.defaultSession.setDownloadPath(缓存目录);
        session.defaultSession.on('will-download', (event, item) => {
            // var 保存文件路径 = path.join(缓存目录);
            // item.setSavePath(保存文件路径);
            item.setSaveDialogOptions({
                title: '选择文件保存位置'
            });

            var 下载信息 = {
                状态: '下载中',
                下载地址: item.getURL(),
                文件名: item.getSavePath(),
                文件大小: item.getTotalBytes(),
                已下载大小: 0,
                下载进度: item.getPercentComplete()
            };
            下载信息.文件大小 = (下载信息.文件大小 / 1024 / 1024).toFixed(2) + 'MB';
            item.on('updated', (event, state) => {
                if (state === 'interrupted') {
                    下载信息.状态 = '下载中断';
                    self.发送消息(下载信息);
                    // console.log('Download is interrupted but can be resumed')
                } else if (state === 'progressing') {
                    if (item.isPaused()) {
                        下载信息.状态 = '暂停';
                        self.发送消息(下载信息);
                        // console.log('Download is paused')
                    } else {
                        下载信息.状态 = '下载中';
                        下载信息.文件名 = item.getSavePath();
                        下载信息.下载进度 = item.getPercentComplete();
                        下载信息.已下载大小 = item.getReceivedBytes();
                        下载信息.已下载大小 = (下载信息.已下载大小 / 1024 / 1024).toFixed(2) + 'MB';
                        self.发送消息(下载信息);
                        // console.log(`Received bytes: ${item.getReceivedBytes()}`)
                    }
                }
            });
            item.once('done', (event, state) => {
                if (state === 'completed') {
                    下载信息.状态 = '下载完成';
                    下载信息.文件名 = item.getSavePath();
                    self.发送消息(下载信息);
                    // console.log('Download successfully')
                } else {
                    下载信息.状态 = '下载失败';
                    self.发送消息(下载信息);
                    // console.log(`Download failed: ${state}`)
                }
            });

            self.下载文件列表.push(item);
            // webContents.send('download', 下载信息);
        });
    },
    发送消息: function (下载信息) {
        try {
            this.webContents.send('下载状态更新', 下载信息);
        } catch (e) {

        }
    },
    暂停下载: function (event, 下载地址) {
        console.log('暂停下载', 下载地址);
        for (var i = 0; i < 下载文件.下载文件列表.length; i++) {
            var item = 下载文件.下载文件列表[i];
            if (item.getURL() == 下载地址) {
                item.pause();
                return true;
            }
        }
    },
    恢复下载: function (event, 下载地址) {
        for (var i = 0; i < 下载文件.下载文件列表.length; i++) {
            var item = 下载文件.下载文件列表[i];
            if (item.getURL() == 下载地址) {
                item.resume();
                return true;
            }
        }
    },
    取消下载: function (event, 下载地址) {
        for (var i = 0; i < 下载文件.下载文件列表.length; i++) {
            var item = 下载文件.下载文件列表[i];
            if (item.getURL() == 下载地址) {
                item.cancel();
                return true;
            }
        }
    },
}

module.exports = 下载文件;