<script>
export default {
    name: 'shuoming',
    data() {
        return {
            显示弹窗: false,
        }
    },
    mounted() {
        // this.显示弹窗 = true;
    },
    methods: {
        关闭() {
            this.显示弹窗 = false;
        }
    }
}
</script>
<template>
    <span class="btn-help" @click="显示弹窗 = true">使用说明</span>
    <el-dialog v-model="显示弹窗" title="使用说明" width="600">
        <div class="content">
            <ul>
                <li>第一次启动需要先使用 [重置游戏] 按钮来解压游戏.</li>
                <li>如果想要在右侧查看地图缩略图, 请使用[地图全息截图器]自己生成.</li>
                <li>每个地图运行的时候会生成一个[地图名文件名.run.json]的文件, 这个文件保存了玩家配置信息.</li>
                <li>[重置游戏]将重新解压游戏, 切换地图的时候可能会用到.</li>
                <li>[复制附件]按钮会自动把地图所在目录的[附件]目录复制到游戏目录.</li>
                <li>如果多个地图素材相互干扰了, 可以尝试 [重置游戏] 来解决.</li>
            </ul>
        </div>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="显示弹窗 = false">关闭</el-button>
                <el-button type="primary" @click="显示弹窗 = false">我知道了</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scope>
.btn-help {
    cursor: pointer;
    color: #357ABD;
}

.content {
    text-align: left;
    font-size: 16px;
    line-height: 28px;
    padding: 10px;
}

.content ul {
    list-style-type: decimal;
}
</style>