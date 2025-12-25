<script>
export default {
    name: '捐赠',
    data() {
        return {
            显示二维码: false,
        }
    },
    mounted() {
        // this.显示二维码 = true;
    },
    methods: {
        关闭() {
            this.显示二维码 = false;
        }
    }
}
</script>
<template>
    <span @click="显示二维码 = true">捐赠</span>
    <el-dialog v-model="显示二维码" title="捐赠" width="350">
        <img :src="'./图片/捐赠.png'" alt="">
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="显示二维码 = false">下次一定</el-button>
                <el-button type="primary" @click="显示二维码 = false">已捐赠</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scope>
img {
    max-width: 100%;
}
</style>