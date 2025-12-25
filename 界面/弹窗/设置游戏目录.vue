<script>
export default {
    name: '设置游戏目录',
    data() {
        return {
            下载地址: "https://cache.ngapp.net/aHR0cHM6Ly9naXRodWIuY29tL3poYWlzaHVhaWdhbi9yYTIvcmVsZWFzZXMvZG93bmxvYWQvdjAuMC4xL1JhMi56aXA=",
            显示提示框: false,
            显示下载进度: false,
            下载信息: {
                状态: '',
                下载地址: '',
                文件名: '',
                文件大小: '',
                已下载大小: '',
                下载进度: 0
            }
        }
    },
    async mounted() {
        var 游戏目录 = await 接口.获取游戏目录();
        if (!游戏目录 || 游戏目录 == '') {
            this.显示提示框 = true;
        }

        接口.监听事件('下载状态更新', (下载信息) => {
            this.下载信息 = 下载信息;
        });

    },
    methods: {
        从网络下载() {
            this.显示提示框 = false;
            this.显示下载进度 = true;
            接口.下载文件(this.下载地址);
        },
        async 选择游戏目录() {
            var 游戏目录 = await 接口.打开目录();
            if (!游戏目录 || 游戏目录 == '') {
                return;
            }
            var 检测结果 = await 接口.检测游戏主程序是否存在(游戏目录 + '/');
            if (!检测结果) {
                ElementPlus.ElMessageBox.alert("你选择的目录好像不是红警的游戏目录!", "提示", {
                    confirmButtonText: '确定'
                });
                return;
            }
            接口.保存设置('游戏目录', 游戏目录);
            this.显示提示框 = false;
        },
        暂停() {
            接口.主进程('暂停下载', this.下载信息.下载地址);
        },
        继续() {
            接口.主进程('恢复下载', this.下载信息.下载地址);
        },
        取消下载() {
            接口.主进程('取消下载', this.下载信息.下载地址);
        }

    }

}
</script>

<template>
    <span @click="选择游戏目录">选择游戏目录</span>
    <el-dialog v-model="显示提示框" title="提示" width="500">
        <span>还没设置游戏目录, 请先设置游戏目录</span>
        <template #footer>
            <div class="dialog-footer">
                <!--el-button @click="从网络下载">从网络下载 (373.5M)</el-button-->
                <el-button type="primary" @click="选择游戏目录">选择游戏目录</el-button>
            </div>
        </template>
    </el-dialog>

    <el-dialog v-model="显示下载进度" title="下载进度" width="500" center>
        <div class="dashboard">
            <el-progress type="dashboard" :stroke-width="10" :percentage="下载信息.下载进度">
                <template #default="{ percentage }">
                    <span class="percentage-value">{{ 下载信息.下载进度 }}%</span>
                    <span class="percentage-label">{{ 下载信息.已下载大小 }} / {{ 下载信息.文件大小 }}</span>
                </template>
            </el-progress>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="暂停" v-if="下载信息.状态 == '下载中'">暂停</el-button>
                <el-button @click="继续" v-if="下载信息.状态 == '暂停'">继续</el-button>
                <el-button type="primary" @click="取消下载">取消下载</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scoped>
.dashboard {
    display: flex;
    justify-content: center;
    zoom: 2;
}

.percentage-value {
    display: block;
    margin-top: 10px;
    font-size: 28px;
}

.percentage-label {
    display: block;
    margin-top: 10px;
    font-size: 6px;
}
</style>