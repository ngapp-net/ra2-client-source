var 接口 = {
    获取分辨率: () => {
        return { ...global.screen };
    },
    打开文件: async () => {
        const { dialog } = require('electron');
        const { canceled, filePaths } = await dialog.showOpenDialog();
        if (!canceled) {
            return filePaths[0];
        }
        return null;
    },
    删除文件: (文件名) => {
        const fs = require('fs');
        fs.unlinkSync(文件名);
        return true;
    },
    重命名文件: (旧文件名, 新文件名) => {
        const fs = require('fs');
        fs.renameSync(旧文件名, 新文件名);
        return true;
    },
    获取文件信息: (文件名) => {
        const fs = require('fs');
        return fs.statSync(文件名);
    },
    打开目录: async () => {
        const { dialog } = require('electron');
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openDirectory']
        });
        if (!canceled) {
            return filePaths[0];
        }
        return null;
    },
    创建目录: (目录名) => {
        const fs = require('fs');
        if (接口.目录存在(目录名)) {
            return true;
        }
        fs.mkdirSync(目录名, { recursive: true });
        return true;
    },
    删除目录: (目录名) => {
        const fs = require('fs');
        fs.rmdirSync(目录名, { recursive: true });
        return true;
    },
    目录存在: (文件名) => {
        const fs = require('fs');
        return fs.existsSync(文件名);
    },
    复制文件: (源文件名, 目标文件名) => {
        const fs = require('fs');
        fs.copyFileSync(源文件名, 目标文件名);
        return true;
    },
    检测附件目录是否存在: async (地图路径) => {
        var path = require('path');
        var 游戏目录 = 接口.获取游戏目录();
        // 获取地图路径的目录
        var 源文件 = path.parse(地图路径);
        var 源文件目录 = 源文件.dir;
        var 自动识别资源目录 = ['附件', '资源', 'assets', '资源包'];

        var 资源文件目录 = 自动识别资源目录.map(x => path.join(源文件目录, x)).find(x => 接口.目录存在(x));
        if (资源文件目录) {
            return true;
        }
        return false;
    },
    复制地图附件到游戏目录: async (地图路径) => {
        return new Promise((resolve, reject) => {
            var path = require('path');
            var 游戏目录 = 接口.获取游戏目录();
            // 获取地图路径的目录
            var 源文件 = path.parse(地图路径);
            var 源文件目录 = 源文件.dir;
            var 自动识别资源目录 = ['附件', '资源', 'assets', '资源包'];

            var 资源文件目录 = 自动识别资源目录.map(x => path.join(源文件目录, x)).find(x => 接口.目录存在(x));
            if (!资源文件目录) {
                resolve(false);
                return;
            }

            var 命令 = `xcopy "${资源文件目录}" "${游戏目录}" /y`;
            const { exec } = require('node:child_process');
            exec(命令, (error, stdout, stderr) => {
                if (error) {
                    console.log(`exec error: ${error}`);
                    resolve(error);
                    return;
                }
                resolve(true);
            });
        });
    },
    重置游戏: async () => {
        return new Promise((resolve, reject) => {
            // 把Ra2.7z 解压到Ra2目录下
            const path = require('path');
            var 源文件 = path.join(process.cwd(), 'Ra2.7z');
            var 输出目录 = path.join(process.cwd(), 'Ra2');
            var 目标文件 = path.join(process.cwd());

            // 如果输出目录存在就删除
            if (接口.目录存在(输出目录)) {
                接口.删除目录(输出目录);
            }

            if (!接口.目录存在(目标文件)) {
                接口.创建目录(目标文件);
            }

            // 使用 node:child_process 调用 cli-tools/7zr.exe 解压
            const { exec } = require('node:child_process');
            exec(`"${process.cwd()}\\cli-tools\\7zr.exe" x "${源文件}" -o"${目标文件}"`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`exec error: ${error}`);
                    resolve(error);
                    return;
                }
                resolve(true);
            });

        });

    },
    获取程序目录: () => {
        const path = require('path');
        return path.join(process.cwd(), '/');
    },
    获取游戏目录: () => {
        const path = require('path');
        var 配置项 = 接口.获取设置('游戏目录');
        if (配置项 && 配置项 != '') {
            return path.join(配置项, "/");
        }
        return path.join(process.cwd(), 'Ra2/');
    },
    写入文件: (文件名, 文件内容) => {
        const fs = require('fs');
        fs.writeFileSync(文件名, 文件内容);
        return true;
    },
    读取文件: (文件名) => {
        const fs = require('fs');
        if (!fs.existsSync(文件名)) {
            return null;
        }
        var 文件内容 = fs.readFileSync(文件名).toString();
        return 文件内容;
    },
    读取红警配置文件: () => {
        const fs = require('fs');
        const path = require('path');
        var 配置文件 = path.join(接口.获取游戏目录(), 'RA2MD.ini');
        if (!fs.existsSync(配置文件)) {
            return null;
        }
        var 文件内容 = fs.readFileSync(配置文件).toString();
        return 文件内容;
    },
    写入红警配置文件: (文件内容) => {
        const fs = require('fs');
        const path = require('path');
        var 配置文件 = path.join(接口.获取游戏目录(), 'RA2MD.ini');
        if (!fs.existsSync(配置文件)) {
            return null;
        }
        fs.writeFileSync(配置文件, 文件内容);
        return true;
    },
    读取地图文件: (文件名) => {
        const fs = require('fs');
        if (!fs.existsSync(文件名)) {
            return null;
        }
        var 文件内容 = new TextDecoder('gbk').decode(fs.readFileSync(文件名)).toString();
        return 文件内容;
    },
    写入地图文件: (文件名, 文件内容) => {
        const fs = require('fs');
        fs.writeFileSync(文件名, 文件内容);
        return true;
    },
    文件存在: (文件名) => {
        const fs = require('fs');
        return fs.existsSync(文件名);
    },
    创建历史记录: (文件名) => {
        const path = require('path');
        var 文件信息 = path.parse(文件名);
        var 历史记录目录 = 文件信息.dir + '/历史记录/';
        var 备份时间 = new Date().toLocaleString();
        var 历史记录文件名 = 历史记录目录 + 文件信息.name + 备份时间 + 文件信息.ext;
        if (!接口.目录存在(历史记录目录)) {
            接口.创建目录(历史记录目录);
        }
        if (!接口.文件存在(历史记录文件名)) {
            接口.复制文件(文件名, 历史记录文件名);
        }
    },
    写入启动配置: (配置内容) => {
        var 配置文件 = 接口.获取游戏目录() + 'spawn.ini';
        const fs = require('fs');
        fs.writeFileSync(配置文件, 配置内容);
        return true;
    },
    写入地图: (文件内容) => {
        const path = require('path');
        const fs = require('fs');
        var 文件名 = path.join(接口.获取游戏目录(), 'mp.dat');
        fs.writeFileSync(文件名, 文件内容);
        return true;
    },
    启动游戏: () => {
        const { exec } = require('node:child_process');
        var 游戏目录 = 接口.获取游戏目录();
        var 启动命令 = 游戏目录 + 'Syringe.exe "gamemd-ares.exe" -SPAWN -CD';
        exec(启动命令, { cwd: 游戏目录 });
    },
    设置为窗口模式: () => {
        const path = require('path');
        var 补丁目录 = path.join(process.cwd(), '补丁', "OpenGL/");
        var 游戏目录 = 接口.获取游戏目录();
        if (!接口.目录存在(游戏目录)) {
            return;
        }
        var 配置文件 = path.join(游戏目录, 'ddraw.ini');
        var 补丁 = path.join(游戏目录, 'EDRAW.dll');
        var 新配置文件 = path.join(补丁目录, 'ddraw.ini');
        var 新补丁 = path.join(补丁目录, 'EDRAW.dll');
        if (接口.文件存在(配置文件)) {
            接口.删除文件(配置文件);
        }
        if (接口.文件存在(补丁)) {
            接口.删除文件(补丁);
        }
        // 接口.复制文件(新配置文件, 配置文件);
        接口.复制文件(新补丁, 补丁);
    },
    设置为全屏模式: () => {
        const path = require('path');
        var 补丁目录 = path.join(process.cwd(), '补丁', "全屏/");
        var 游戏目录 = 接口.获取游戏目录();
        if (!接口.目录存在(游戏目录)) {
            return;
        }
        var 配置文件 = path.join(游戏目录, 'ddraw.ini');
        var 补丁 = path.join(游戏目录, 'EDRAW.dll');
        var 新配置文件 = path.join(补丁目录, 'ddraw.ini');
        var 新补丁 = path.join(补丁目录, 'EDRAW.dll');
        if (接口.文件存在(配置文件)) {
            接口.删除文件(配置文件);
        }
        if (接口.文件存在(补丁)) {
            接口.删除文件(补丁);
        }
        接口.复制文件(新配置文件, 配置文件);
        接口.复制文件(新补丁, 补丁);
    },
    检测游戏主程序是否存在: (游戏目录 = '') => {
        游戏目录 = (游戏目录 ? 游戏目录 : 接口.获取游戏目录());
        return require('fs').existsSync(游戏目录 + 'gamemd-ares.exe');
    },
    保存设置: (设置名, 设置值) => {
        const path = require('path');
        var 设置文件名 = path.join(process.cwd(), '设置.json');
        var 配置内容 = 接口.读取文件(设置文件名);
        if (配置内容 === null) {
            配置内容 = '{}';
        }
        配置内容 = JSON.parse(配置内容);
        配置内容[设置名] = 设置值;
        配置内容 = JSON.stringify(配置内容, null, '    ');
        接口.写入文件(设置文件名, 配置内容);
    },
    获取设置: (设置名) => {
        const path = require('path');
        var 设置文件名 = path.join(process.cwd(), '设置.json');
        var 配置内容 = 接口.读取文件(设置文件名);
        if (配置内容 === null) {
            return null;
        }
        配置内容 = JSON.parse(配置内容);
        if (typeof 配置内容[设置名] === 'undefined') {
            return null;
        }
        return 配置内容[设置名];
    },
    获取缩略图: async (文件路径) => {
        var path = require('path');
        var 地图文件信息 = path.parse(文件路径);
        var 缩略图 = path.join(地图文件信息.dir, 'thumb_' + 地图文件信息.name + '.png');
        var 缩略图存在 = await 接口.文件存在(缩略图);
        if (缩略图存在) {
            return 缩略图;
        } else {
            // await 接口.生成截图(文件路径);
            // return 缩略图;
            return "";
        }
        // console.log('地图文件信息: ', 地图文件信息);
    },
    生成截图: async (地图文件名) => {
        var path = require('path');
        var 地图文件信息 = path.parse(地图文件名);
        var 游戏目录 = 接口.获取游戏目录();
        var 截图生成器目录 = path.join(process.cwd(), '/CNCMaps/');
        var 截图生成器 = path.join(截图生成器目录, 'CNCMaps.Renderer.exe');
        var 参数 = [
            '-i', '"' + 地图文件名 + '"',
            '-p', '-o', '"' + 地图文件信息.name + '"',
            '-m', '"' + 游戏目录 + '"',
            '-Y', '-F',
            '--mark-start-pos', '-s', '4',
            '-z', '+(400,0)', '--thumb-png', '--bkp'
        ];

        const { exec } = require('child_process');

        return new Promise((resolve, reject) => {
            exec(截图生成器 + ' ' + 参数.join(' '), (error, stdout, stderr) => {
                var 错误文件 = 地图文件信息.dir + '/错误.txt';
                if (error) {
                    var fs = require('fs');
                    fs.writeFileSync(错误文件, error.toString());
                    reject(error.toString());
                    return;
                }
                if (stderr) {
                    var fs = require('fs');
                    fs.writeFileSync(错误文件, stderr.toString());
                    reject(stderr.toString());
                    return;
                }
                console.log(`stdout: ${stdout}`);
                resolve();
            });
        });

    },
    获取最近地图: async () => {
        var path = require('path');
        var 最近地图 = 接口.获取设置('最近地图');
        var 返回列表 = [];
        for (var i = 0; i < 最近地图.length; i++) {
            var 文件名 = 最近地图[i];
            var 扩展名 = path.extname(文件名);
            var 缩略图 = await 接口.获取缩略图(文件名)
            返回列表.push({
                文件名: 文件名,
                缩略图: 缩略图,
                名字: 文件名.replace(/.*\\/g, '').replace(扩展名, '')
            });
        }
        return 返回列表;
    },
    获取内置地图: async () => {
        var path = require('path');
        var 内置地图目录 = path.join(process.cwd(), '/地图/');
        var 内置地图 = [];
        var fs = require('fs');
        var 文件列表 = fs.readdirSync(内置地图目录);
        for (var i = 0; i < 文件列表.length; i++) {
            var 文件名 = 文件列表[i];
            var 扩展名 = path.extname(文件名);
            var 地图扩展名列表 = ['.map', '.yrm'];
            if (地图扩展名列表.includes(扩展名)) {
                内置地图.push({
                    文件名: 内置地图目录 + 文件名,
                    缩略图: 内置地图目录 + 'thumb_' + 文件名.replace(扩展名, '.png'),
                    名字: 文件名.replace(扩展名, '')
                });
            }
        }
        return 内置地图;
    },
    最小化窗口: () => {
        const { BrowserWindow } = require('electron');
        const currentWindow = BrowserWindow.getFocusedWindow();
        currentWindow.minimize();
    },
    最大化窗口: () => {
        const { BrowserWindow } = require('electron');
        const currentWindow = BrowserWindow.getFocusedWindow();
        if (currentWindow.isMaximized()) {
            currentWindow.unmaximize();
        } else {
            currentWindow.maximize();
        }
    },
    初始化下载: false,
    下载文件: (下载地址) => {
        var session = require('electron').session;
        session.defaultSession.downloadURL(下载地址);
    },
};

module.exports = 接口;