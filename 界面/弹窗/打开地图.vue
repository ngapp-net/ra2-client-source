<script>
export default {
    name: '打开地图',
    props: ['选中的地图文件'],
    emits: ['选中地图'],
    data() {
        return {
            地图文件: '',
            显示弹窗: false,
            包含附件目录: false,
            地图列表: [],
        }
    },
    async mounted() {
    },
    watch: {
        选中的地图文件: async function (新路径) {
            this.地图文件 = 新路径;
            this.包含附件目录 = await 接口.检测附件目录是否存在(新路径);
        }
    },
    methods: {
        关闭() {
            this.显示弹窗 = false;
        },

        async 打开选择框() {
            this.显示弹窗 = true;
            var 最近地图列表 = await 接口.获取最近地图();
            var 内置地图列表 = await 接口.获取内置地图();
            var 地图列表 = [...最近地图列表, ...内置地图列表];
            // 去重
            this.地图列表 = [...new Map(地图列表.map(item => [item.文件名, item])).values()];

        },

        async 选中地图(文件名) {
            this.地图文件 = 文件名;
            await 接口.保存设置('上次选择地图', 文件名);
            var 最近地图列表 = await 接口.获取设置('最近地图');
            if (!最近地图列表) {
                最近地图列表 = [];
            }
            最近地图列表.unshift(文件名);
            // 去重 最近地图列表
            最近地图列表 = [...new Map(最近地图列表.map(item => [item, item])).values()];
            await 接口.保存设置('最近地图', 最近地图列表);

            this.$emit('选中地图', 文件名);
            this.关闭();
        },

        async 选择其他地图() {
            var 文件路径 = await 接口.打开文件();
            if (!文件路径) {
                return;
            }
            this.选中地图(文件路径);
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
    }
}
</script>
<template>
    <button class="btn btn-blue" @click="打开选择框()">选择地图</button>
    <button class="btn btn-blue" v-if="包含附件目录" @click="复制地图附件到游戏目录">复制附件</button>
    <el-dialog v-model="显示弹窗" title="选择地图" style=" width: 600px;">
        <div class="map-list">
            <div v-for="item in 地图列表" :key="item.文件名" class="item" @click="选中地图(item.文件名)">
                <el-image :src="item.缩略图" :fit="'contain'" />
                <span class="demonstration">{{ item.名字 }}</span>
            </div>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="显示弹窗 = false">关闭</el-button>
                <el-button type="primary" @click="选择其他地图">选择其他地图</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scope>
.map-list {
    height: 300px;
    overflow-y: scroll;
}

.map-list .item {
    cursor: pointer;
    padding: 10px;
    text-align: center;
    display: inline-block;
    width: 33%;
    box-sizing: border-box;
    vertical-align: top;
}

.map-list .item:hover {
    background-color: aliceblue;
}

.map-list .item .el-image {
    height: 64px;
}

.map-list .item:last-child {
    border-right: none;
}

.map-list .demonstration {
    display: block;
    color: var(--el-text-color-secondary);
    font-size: 14px;
}
</style>