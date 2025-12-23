<script>
import 配置项 from './配置项.json';
import 配置 from '../类库/配置.mjs';

import juanzeng from './弹窗/捐赠.vue';
import fankui from './弹窗/反馈.vue';
import shezhiyouximulu from './弹窗/设置游戏目录.vue';
import shiyongshuoming from './弹窗/使用说明.vue';
export default {
    name: 'Main',
    components: {
        juanzeng,
        shezhiyouximulu,
        shiyongshuoming,
        fankui
    },
    data() {
        return {
            地图名: "地图预览图",
            缩略图: "",
            地图文件: "",
            显示选择框: false,
            选择字段: '',
            选项列表: [],
            点击位置: { x: 0, y: 0, transform: '' },
            当前选择索引: -1,
            电脑列表: [],
            部队数: 0,
            金钱: 30000,
            速度: 5,
            屏幕: {
                "宽度": 1920,
                "高度": 1080
            },
            玩家信息: {
                "名称": "Tester",
                "国家": "随机",
                "颜色": "随机",
                "位置": "随机",
                "小队": "随机"
            },
            设置: {
                初始基地: true,
                快速游戏: true,
                升级工具箱: true,
                允许基地重新部署: true,
                超级武器: true,
                可摧毁桥梁: true,
                加速建造: false,
                多位工程师: false,
                盟友基地旁边建造: true,
                允许结盟: true,
            },
            显示模式: "全屏"
        };
    },
    async mounted() {
        var 上次选择地图 = await 接口.获取设置("上次选择地图");
        if (上次选择地图 && 上次选择地图 != "") {
            this.设置地图(上次选择地图);
        }
        this.玩家信息.名称 = await 接口.获取设置("昵称");
        var 保存的分辨率 = await 接口.获取设置('分辨率');
        if (保存的分辨率) {
            this.屏幕.宽度 = 保存的分辨率.宽度;
            this.屏幕.高度 = 保存的分辨率.高度;
        } else {
            var 分辨率 = await 接口.获取分辨率();
            this.屏幕.宽度 = 分辨率.width;
            this.屏幕.高度 = 分辨率.height;

            await 接口.保存设置('分辨率', {
                宽度: this.屏幕.宽度,
                高度: this.屏幕.高度
            });
        }

        var 当前屏幕分辨率 = `${this.屏幕.宽度}x${this.屏幕.高度}`;

        if (!配置项.可选分辨率.includes(当前屏幕分辨率)) {
            配置项.可选分辨率.unshift(当前屏幕分辨率);
        }


        var 保存的显示模式 = await 接口.获取设置('显示模式');
        if (保存的显示模式) {
            this.显示模式 = 保存的显示模式;
        }

        var 电脑 = {
            名称: '无',
            国家: '-',
            颜色: '-',
            位置: '-',
            小队: '-',
        }

        for (var i = 0; i < 7; i++) {
            this.电脑列表.push(JSON.parse(JSON.stringify(电脑)));
        }

        window.addEventListener('click', () => {
            console.log('点击了');
            if (this.显示选择框) {
                this.关闭下拉框();
            }
        });
    },
    methods: {
        最小化窗口() {
            接口.最小化窗口();
        },

        关闭窗口() {
            window.close();
        },

        记录点击位置(event) {
            var rect;
            if (event.currentTarget) {
                rect = event.currentTarget.getBoundingClientRect();
            } else {
                rect = event.target.getBoundingClientRect();
            }
            var 窗口区域 = document.body.getBoundingClientRect();
            if (rect.bottom < 窗口区域.height / 2) {
                this.点击位置 = {
                    x: rect.left,
                    y: rect.bottom,
                    transform: ''
                };
                return;
            }

            this.点击位置 = {
                x: rect.left,
                y: rect.top,
                transform: 'translate(0%, -100%)'
            };

        },

        编辑玩家名称() {
            ElementPlus.ElMessageBox.prompt('请输入玩家名称', '玩家名称', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: this.玩家信息.名称,
                inputPlaceholder: '请输入玩家名称',
            }).then(async ({ value }) => {
                if (value) {
                    this.玩家信息.名称 = value;
                    await 接口.保存设置("昵称", value);
                }
            })
        },

        选择电脑(index, event) {
            if (this.选择字段 == '名称' && this.当前选择索引 === index && this.显示选择框 == true) {
                this.关闭下拉框();
                return;
            }
            this.记录点击位置(event);
            this.当前选择索引 = index;
            this.选择字段 = '名称';
            this.选项列表 = Object.keys(配置项.可选电脑);
            this.显示选择框 = true;
        },

        选择国家(index, event) {
            if (this.选择字段 == '国家' && this.当前选择索引 === index && this.显示选择框 == true) {
                this.关闭下拉框();
                return;
            }
            if (index >= 0 && this.电脑列表[index].名称 == '无') {
                return;
            }
            this.记录点击位置(event);
            this.当前选择索引 = index;
            this.选择字段 = '国家';
            this.选项列表 = Object.keys(配置项.可选国家);
            this.显示选择框 = true;
        },

        选择颜色(index, event) {
            if (this.选择字段 == '颜色' && this.当前选择索引 === index && this.显示选择框 == true) {
                this.关闭下拉框();
                return;
            }
            if (index >= 0 && this.电脑列表[index].名称 == '无') {
                return;
            }
            this.记录点击位置(event);
            this.当前选择索引 = index;
            this.选择字段 = '颜色';
            this.选项列表 = Object.keys(配置项.可选颜色);
            this.显示选择框 = true;
        },
        选择位置(index, event) {
            if (this.选择字段 == '位置' && this.当前选择索引 === index && this.显示选择框 == true) {
                this.关闭下拉框();
                return;
            }
            if (index >= 0 && this.电脑列表[index].名称 == '无') {
                return;
            }
            this.记录点击位置(event);
            this.当前选择索引 = index;
            this.选择字段 = '位置';
            this.选项列表 = 配置项.可选位置;
            this.显示选择框 = true;
        },

        选择小队(index, event) {
            if (this.选择字段 == '位置' && this.当前选择索引 === index && this.显示选择框 == true) {
                this.关闭下拉框();
                return;
            }

            if (index >= 0 && this.电脑列表[index].名称 == '无') {
                return;
            }

            this.记录点击位置(event);
            this.当前选择索引 = index;
            this.选择字段 = '小队';
            this.选项列表 = 配置项.可选小队;
            this.显示选择框 = true;
        },

        选择金钱(event) {
            if (this.选择字段 == '金钱' && this.显示选择框 == true) {
                this.关闭下拉框();
                return;
            }
            this.记录点击位置(event);
            this.当前选择索引 = -1;
            this.选择字段 = '金钱';
            this.选项列表 = 配置项.可选金钱;
            this.显示选择框 = true;
        },

        选择部队数(event) {
            if (this.选择字段 == '部队数' && this.显示选择框 == true) {
                this.关闭下拉框();
                return;
            }
            this.记录点击位置(event);
            this.当前选择索引 = -1;
            this.选择字段 = '部队数';
            this.选项列表 = 配置项.可选部队数;
            this.显示选择框 = true;
        },
        选择分辨率(event) {
            if (this.选择字段 == '分辨率' && this.显示选择框 == true) {
                this.关闭下拉框();
                return;
            }
            this.记录点击位置(event);
            this.当前选择索引 = -1;
            this.选择字段 = '分辨率';
            this.选项列表 = 配置项.可选分辨率;
            this.显示选择框 = true;
        },

        选择游戏速度(event) {
            if (this.选择字段 == '速度' && this.显示选择框 == true) {
                this.关闭下拉框();
                return;
            }
            this.记录点击位置(event);
            this.当前选择索引 = -1;
            this.选择字段 = '速度';
            this.选项列表 = 配置项.可选速度;
            this.显示选择框 = true;
        },

        选择游戏窗口模式(event) {
            if (this.选择字段 == '显示模式' && this.显示选择框 == true) {
                this.关闭下拉框();
                return;
            }
            this.记录点击位置(event);
            this.当前选择索引 = -1;
            this.选择字段 = '显示模式';
            this.选项列表 = ["全屏", "不全屏"];
            this.显示选择框 = true;
        },

        async 确认选项(值) {
            switch (this.选择字段) {
                case '部队数':
                    this.部队数 = 值;
                    break;
                case '金钱':
                    this.金钱 = 值;
                    break;
                case '速度':
                    this.速度 = 值;
                    break;
                case '显示模式':
                    this.显示模式 = 值;
                    await 接口.保存设置('显示模式', this.显示模式);
                    await this.写入分辨率配置();
                    break;
                case '最近地图':
                    this.设置地图(值);
                    break;
                case '分辨率':
                    var 分辨率 = 值.split('x');
                    this.屏幕.宽度 = 分辨率[0];
                    this.屏幕.高度 = 分辨率[1];
                    await 接口.保存设置('分辨率', {
                        宽度: this.屏幕.宽度,
                        高度: this.屏幕.高度
                    });
                    await this.写入分辨率配置();
                    break;
                case '名称':
                    if (值 == '无') {
                        this.电脑列表[this.当前选择索引]['位置'] = '-';
                        this.电脑列表[this.当前选择索引]['国家'] = '-';
                        this.电脑列表[this.当前选择索引]['颜色'] = '-';
                        this.电脑列表[this.当前选择索引]['小队'] = '-';
                    } else if (this.电脑列表[this.当前选择索引][this.选择字段] == '无') {
                        this.电脑列表[this.当前选择索引]['位置'] = '随机';
                        this.电脑列表[this.当前选择索引]['国家'] = '随机';
                        this.电脑列表[this.当前选择索引]['颜色'] = '随机';
                        this.电脑列表[this.当前选择索引]['小队'] = '随机';
                    }
                    if (this.当前选择索引 >= 0) {
                        this.电脑列表[this.当前选择索引]['名称'] = 值;
                    } else {
                        // this.玩家信息['名称'] = 值;
                    }
                    break;
                default:
                    if (this.当前选择索引 >= 0) {
                        this.电脑列表[this.当前选择索引][this.选择字段] = 值;
                    } else {
                        this.玩家信息[this.选择字段] = 值;
                    }
                    break;
            }

            this.显示选择框 = false;
            this.当前选择索引 = -1;
        },

        // 关闭下拉框
        关闭下拉框() {
            this.显示选择框 = false;
            this.当前选择索引 = -1;
        },

        async 最近地图(event) {
            var 最近地图列表 = await 接口.获取设置('最近地图');
            if (!最近地图列表 || 最近地图列表.length == 0) {
                ElementPlus.ElMessageBox.alert("好像还没选择过地图!", "提示", {
                    confirmButtonText: '确定'
                });
                return;
            }
            if (this.选择字段 == '最近地图' && this.显示选择框 == true) {
                this.关闭下拉框();
                return;
            }
            this.记录点击位置(event);
            this.当前选择索引 = -1;
            this.选择字段 = '最近地图';

            this.选项列表 = 最近地图列表;
            this.显示选择框 = true;
        },

        async 选择其他地图() {
            var 文件路径 = await 接口.打开文件();
            if (!文件路径) {
                return;
            }
            this.设置地图(文件路径);
        },

        async 设置地图(文件路径) {
            try {
                var 地图内容 = await 接口.读取地图文件(文件路径);
                var 配置对象 = new 配置(地图内容);
                配置对象.同步解析();
                this.地图文件 = 文件路径;
                this.地图名 = 配置对象.配置项['Basic']['Name'];
                this.缩略图 = await 接口.获取缩略图(文件路径);
                await 接口.保存设置('上次选择地图', 文件路径);

                var 最近地图列表 = await 接口.获取设置('最近地图');
                if (!最近地图列表) {
                    最近地图列表 = [];
                }
                if (!最近地图列表.includes(文件路径)) {
                    最近地图列表.unshift(文件路径);
                    await 接口.保存设置('最近地图', 最近地图列表);
                }

                await this.读取配置();
            } catch (e) {
                ElementPlus.ElMessageBox.alert("你似乎选择的不是地图文件!", "提示", {
                    confirmButtonText: '确定'
                });
            }
        },

        async 开始游戏() {
            var 检测结果 = await 接口.检测游戏主程序是否存在();
            if (!检测结果) {
                ElementPlus.ElMessageBox.alert("游戏主程序不存在", "提示", {
                    confirmButtonText: '确定'
                });
                return;
            }

            if (!this.地图文件) {
                ElementPlus.ElMessageBox.alert("还没有选择地图", "提示", {
                    confirmButtonText: '确定'
                });
                return;
            }

            const 加载中 = ElementPlus.ElLoading.service({
                lock: true,
                text: '正在启动游戏...',
                background: 'rgba(0, 0, 0, 0.7)',
            });
            await this.写入分辨率配置();
            await this.生成游戏配置();
            await this.写入地图数据();
            await this.保存配置();
            接口.启动游戏(this.显示模式 == "全屏" ? false : true);
            setTimeout(() => {
                加载中.close();
            }, 5000)
        },

        async 保存配置() {
            var 配置文件名 = this.地图文件 + '.run.json';
            var 配置 = {
                玩家信息: this.玩家信息,
                电脑列表: this.电脑列表,
                设置: this.设置,
                部队数: this.部队数,
                金钱: this.金钱,
                速度: this.速度,
            };
            await 接口.写入文件(配置文件名, JSON.stringify(配置));
        },
        async 读取配置() {
            var 配置文件名 = this.地图文件 + '.run.json';
            if (await 接口.文件存在(配置文件名)) {
                var 配置内容 = await 接口.读取文件(配置文件名);
                var 配置 = JSON.parse(配置内容);
                for (var 键 in 配置) {
                    this[键] = 配置[键];
                }
            }
            this.玩家信息.名称 = await 接口.获取设置("昵称");
        },

        获取设置的电脑列表() {
            var 返回结果 = [];
            this.电脑列表.map((电脑) => {
                if (电脑.名称 != '无') {
                    返回结果.push(JSON.parse(JSON.stringify(电脑)));
                }
                return false;
            });
            return 返回结果;
        },

        async 写入分辨率配置() {
            var 配置内容 = await 接口.读取红警配置文件();
            var 红警配置 = new 配置(配置内容);
            红警配置.同步解析();

            if (this.显示模式 == '全屏') {
                await 接口.设置为全屏模式();
            } else {
                await 接口.设置为窗口模式();
            }

            var 显示模式 = this.显示模式 == '全屏' ? 'False' : 'True';
            // console.log(this.显示模式, 显示模式)
            var ddraw = this.显示模式 == '全屏' ? '10' : '7';
            // console.log(this.显示模式, ddraw);
            红警配置.修改属性值('Video', 'ScreenWidth', this.屏幕.宽度);
            红警配置.修改属性值('Video', 'ScreenHeight', this.屏幕.高度);
            红警配置.修改属性值('Video', 'Video.Windowed', 显示模式);
            红警配置.修改属性值('Video', 'ddraw', ddraw);
            await 接口.写入红警配置文件(红警配置.生成配置文件());
        },
        async 生成游戏配置() {

            var 玩家信息 = JSON.parse(JSON.stringify(this.玩家信息));
            if (玩家信息.国家 == '随机') {
                // 打乱顺序随机一个
                var 国家列表 = Object.values(配置项.可选国家);
                国家列表.sort(() => Math.random() - 0.5);
                玩家信息.国家 = 国家列表.shift();
            } else {
                玩家信息.国家 = 配置项.可选国家[玩家信息.国家];
            }


            var 设置的电脑列表 = this.获取设置的电脑列表();

            var 已选颜色 = [];
            if (玩家信息.颜色 != '随机') {
                已选颜色.push(玩家信息.颜色);
            }
            设置的电脑列表.map((当前电脑) => {
                if (当前电脑.颜色 != '随机') {
                    已选颜色.push(当前电脑.颜色);
                }
            });

            var 所有颜色 = Object.keys(配置项.可选颜色);
            所有颜色.shift();
            var 剩余颜色列表 = 所有颜色.filter((当前颜色) => !已选颜色.includes(当前颜色));
            剩余颜色列表.sort(() => Math.random() - 0.5);
            if (玩家信息.颜色 == '随机') {
                玩家信息.颜色 = 剩余颜色列表.shift();
            }
            玩家信息.颜色 = 配置项.可选颜色[玩家信息.颜色];

            if (玩家信息.位置 == '随机') {
                玩家信息.位置 = "";
            } else {
                玩家信息.位置 -= 1;
            }

            var 游戏配置 = new 配置();
            游戏配置.添加属性值('Settings', 'Name', 玩家信息.名称);
            游戏配置.添加属性值('Settings', 'Side', 玩家信息.国家);
            游戏配置.添加属性值('Settings', 'Bases', this.设置.初始基地);
            游戏配置.添加属性值('Settings', 'Color', 玩家信息.颜色);
            游戏配置.添加属性值('Settings', 'Crates', this.设置.升级工具箱);
            游戏配置.添加属性值('Settings', 'Credits', this.金钱);
            游戏配置.添加属性值('Settings', 'Scenario', "mp.dat");
            游戏配置.添加属性值('Settings', 'AIPlayers', 设置的电脑列表.length);
            游戏配置.添加属性值('Settings', 'GameSpeed', 6 - this.速度);
            游戏配置.添加属性值('Settings', 'ShortGame', this.设置.快速游戏);
            游戏配置.添加属性值('Settings', 'TechLevel', '10');
            游戏配置.添加属性值('Settings', 'UnitCount', this.部队数);
            游戏配置.添加属性值('Settings', 'MCVRedeploy', this.设置.允许基地重新部署);
            游戏配置.添加属性值('Settings', 'BuildOffAlly', this.设置.盟友基地旁边建造);
            游戏配置.添加属性值('Settings', 'Superweapons', this.设置.超级武器);
            游戏配置.添加属性值('Settings', 'BridgeDestroy', this.设置.可摧毁桥梁);
            游戏配置.添加属性值('Settings', 'MultiEngineer', this.设置.特殊工程师);

            if (玩家信息.小队 !== '随机') {
                var 联盟列表 = [
                    'HouseAllyOne',
                    'HouseAllyTwo',
                    'HouseAllyThree',
                    'HouseAllyFour',
                    'HouseAllyFive',
                    'HouseAllySix',
                    'HouseAllySeven'
                ];
                for (var j = 0; j < 设置的电脑列表.length; j++) {
                    if (设置的电脑列表[j].小队 == 玩家信息.小队) {
                        游戏配置.添加属性值(`Multi1_Alliances`, 联盟列表.shift(), j + 1);
                    }
                }

            }

            游戏配置.添加属性值('SpawnLocations', 'Multi1', 玩家信息.位置);
            if (设置的电脑列表.length > 0) {
                for (var i = 1; i <= 设置的电脑列表.length; i++) {
                    var 编号 = i + 1;
                    var 当前电脑 = 设置的电脑列表[i - 1];

                    if (当前电脑.位置 == '随机') {
                        当前电脑.位置 = "";
                    } else {
                        当前电脑.位置 -= 1;
                    }
                    游戏配置.添加属性值('SpawnLocations', `Multi${编号}`, 当前电脑.位置);
                    var 颜色 = 当前电脑.颜色 == '随机' ? 剩余颜色列表.shift() : 当前电脑.颜色;
                    颜色 = 配置项.可选颜色[颜色];
                    游戏配置.添加属性值('HouseColors', `Multi${编号}`, 颜色);
                    var 国家 = 当前电脑.国家 == '随机' ? Math.floor(Math.random() * 10) : 配置项.可选国家[当前电脑.国家];
                    游戏配置.添加属性值('HouseCountries', `Multi${编号}`, 国家);
                    游戏配置.添加属性值('HouseHandicaps', `Multi${编号}`, 配置项.可选电脑[当前电脑.名称]);
                    var 联盟列表 = [
                        'HouseAllyOne',
                        'HouseAllyTwo',
                        'HouseAllyThree',
                        'HouseAllyFour',
                        'HouseAllyFive',
                        'HouseAllySix',
                        'HouseAllySeven'
                    ];



                    if (当前电脑.小队 != '随机') {
                        if (当前电脑.小队 == 玩家信息.小队) {
                            游戏配置.添加属性值(`Multi${编号}_Alliances`, 联盟列表.shift(), 0);
                        }
                        for (var j = 0; j < 设置的电脑列表.length; j++) {
                            if (j + 2 == 编号) {
                                // 跳过自己
                                continue;
                            }
                            if (设置的电脑列表[j].小队 == 当前电脑.小队) {
                                游戏配置.添加属性值(`Multi${编号}_Alliances`, 联盟列表.shift(), j + 1);
                            }
                        }
                    }
                }
            }

            await 接口.写入启动配置(游戏配置.生成配置文件());
        },
        async 写入地图数据() {
            var 地图数据 = await 接口.读取地图文件(this.地图文件);
            if (this.设置.加速建造) {
                if (地图数据.includes("BuildSpeed")) {
                    地图数据 = 地图数据.replace("BuildSpeed=", "BuildSpeed=.001;");
                }
                else if (地图数据.includes("[General]")) {
                    地图数据 = 地图数据.replace("[General]", "[General]\nBuildSpeed=.001");
                }
                else {
                    地图数据 += "\n\n[General]\nBuildSpeed=.001\n";
                }
            }

            await 接口.写入地图(地图数据);
        },
        async 重置游戏() {
            const 加载中 = ElementPlus.ElLoading.service({
                lock: true,
                text: '正在重置游戏, 请稍等...',
                background: 'rgba(0, 0, 0, 0.7)',
            });
            var 返回结果 = await 接口.重置游戏().catch(function (e) {
                console.log('解压失败: ', e);
            });
            加载中.close();
            if (!返回结果) {
                return;
            }
            // 弹出提醒
            this.$alert('重置游戏完成', '提示', {
                confirmButtonText: '确定',
            });
        },
        async 复制地图附件到游戏目录() {
            var 返回结果 = await 接口.复制地图附件到游戏目录(this.地图文件);
            if (!返回结果) {
                this.$alert('复制地图附件失败', '提示', {
                    confirmButtonText: '确定',
                });
                return;
            }
            this.$alert('复制地图附件成功', '提示', {
                confirmButtonText: '确定',
            });
        }
    },
};

</script>
<template>
    <div class="window-controls">
        <button class="window-btn minimize-btn" @click="最小化窗口" title="最小化">−</button>
        <button class="window-btn close-btn" @click="关闭窗口" title="关闭">×</button>
    </div>

    <div class="container">
        <div class="header">
            红色警戒2 - 尤里的复仇
        </div>

        <div class="main-content">
            <div class="left-panel">
                <table class="player-table">
                    <thead>
                        <tr>
                            <th width="145">玩家ID</th>
                            <th width="112">国家</th>
                            <th>颜色</th>
                            <th width="80">位置</th>
                            <th width="80">小队</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="color: #ff6b6b;">
                                <span @click="编辑玩家名称">{{ 玩家信息.名称 }}</span>
                            </td>
                            <td>
                                <!-- 添加点击事件 -->
                                <span @click.stop="选择国家(-1, $event)" :title="'点击选择国家'" style="cursor: pointer;">
                                    {{ 玩家信息.国家 }}
                                </span>

                            </td>
                            <td>
                                <div class="color-box" :class="[玩家信息.颜色]" @click.stop="选择颜色(-1, $event)"></div>
                            </td>
                            <td>
                                <span @click.stop="选择位置(index, $event)" :title="'点击选择位置'" style="cursor: pointer;">
                                    {{ 玩家信息.位置 }}
                                </span>
                            </td>
                            <td>
                                <span @click.stop="选择小队(index, $event)" :title="'点击选择小队'" style="cursor: pointer;">
                                    {{ 玩家信息.小队 }}
                                </span>
                            </td>
                        </tr>
                        <tr v-for="(player, index) in 电脑列表" :key="index">
                            <td>
                                <span @click.stop="选择电脑(index, $event)" :title="'点击选择电脑'" style="cursor: pointer;">
                                    {{ player.名称 }}
                                </span>
                            </td>
                            <td>
                                <span @click.stop="选择国家(index, $event)" :title="'点击选择国家'" style="cursor: pointer;">
                                    {{ player.国家 }}
                                </span>
                            </td>
                            <td>
                                <div class="color-box" :class="[player.颜色]" @click.stop="选择颜色(index, $event)"></div>
                            </td>
                            <td>
                                <span @click.stop="选择位置(index, $event)" :title="'点击选择位置'" style="cursor: pointer;">
                                    {{ player.位置 }}
                                </span>
                            </td>
                            <td>
                                <span @click.stop="选择小队(index, $event)" :title="'点击选择小队'" style="cursor: pointer;">
                                    {{ player.小队 }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="right-panel">
                <div class="map-title">{{ 地图名 }}</div>
                <div class="map-preview">
                    <img v-if="缩略图" :src="缩略图" :alt="地图文件">
                    <div v-else=""><span>暂无缩略图</span></div>
                </div>
                <div class="action-buttons">
                    <button class="btn btn-blue" @click.stop="最近地图($event)">最近地图</button>
                    <button class="btn btn-blue" @click="选择其他地图">选择地图</button>
                    <button class="btn btn-blue" v-if="地图文件" @click="复制地图附件到游戏目录">复制附件</button>
                </div>
                <button class="start-btn" @click="开始游戏()">
                    开始游戏
                </button>
                <div class="room-info">
                    <div>
                        说明: 此版本目前是给地图作者使用的, 方便作者制作地图的时候测试地图, 具体使用方法可以参考:
                        <shiyongshuoming></shiyongshuoming>
                    </div>
                </div>
            </div>
        </div>

        <div class="settings">
            <div class="settings-grid">
                <label class="checkbox-item">
                    <input type="checkbox" v-model="设置.允许基地重新部署">
                    <span>允许基地重新部署</span>
                </label>
                <label class="checkbox-item">
                    <input type="checkbox" v-model="设置.初始基地">
                    <span>初始基地</span>
                </label>
                <label class="checkbox-item">
                    <input type="checkbox" v-model="设置.升级工具箱">
                    <span>升级工具箱</span>
                </label>
                <label class="checkbox-item">
                    <input type="checkbox" v-model="设置.盟友基地旁边建造">
                    <span>盟友基地旁边建造</span>
                </label>
                <label class="checkbox-item">
                    <input type="checkbox" v-model="设置.快速游戏">
                    <span>快速游戏</span>
                </label>
                <label class="checkbox-item">
                    <input type="checkbox" v-model="设置.超级武器">
                    <span>超级武器</span>
                </label>
                <label class="checkbox-item">
                    <input type="checkbox" v-model="设置.多位工程师">
                    <span>多位工程师</span>
                </label>
                <label class="checkbox-item">
                    <input type="checkbox" v-model="设置.可摧毁桥梁">
                    <span>可摧毁桥梁</span>
                </label>
                <label class="checkbox-item">
                    <input type="checkbox" v-model="设置.加速建造">
                    <span>加速建造</span>
                </label>
            </div>
        </div>

        <div class="bottom-bar">
            <div class="stats">
                <span @click.stop="选择部队数($event)">部队数: {{ 部队数 }}</span>
                <span @click.stop="选择金钱($event)">金钱: {{ 金钱 }}</span>
                <span @click.stop="选择游戏速度($event)">速度: {{ 速度 }}</span>
                <span @click.stop="选择游戏窗口模式($event)">显示模式: {{ 显示模式 }}</span>
                <span @click.stop="选择分辨率($event)">分辨率: {{ 屏幕.宽度 }}x{{ 屏幕.高度 }}</span>

                <!--弹窗.设置游戏目录></弹窗.设置游戏目录-->
                <span @click="重置游戏">重置游戏</span>
                <juanzeng></juanzeng>
                <fankui></fankui>
            </div>
        </div>

        <!-- 选择下拉框 -->
        <div v-if="显示选择框" class="selector-dropdown"
            :style="{ left: 点击位置.x + 'px', top: 点击位置.y + 'px', transform: 点击位置.transform }">
            <div class="selector-content">
                <div v-for="value in 选项列表" :key="value" class="country-option" @click="确认选项(value)">
                    <span class="country-name">{{ value }}</span>
                </div>
            </div>
        </div>
    </div>



</template>



<style></style>