<script>
export default {
    name: '反馈',
    data() {
        return {
        }
    },
    async mounted() {
        this.第一次启动();
    },
    methods: {
        async 第一次启动() {
            var 游戏存在 = await 接口.检测游戏主程序是否存在();
            if (游戏存在) {
                return;
            }
            const 加载中 = ElementPlus.ElLoading.service({
                lock: true,
                text: '第一次启动, 正在解压游戏, 请稍等...',
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
            this.$alert('游戏解压完成!', '提示', {
                confirmButtonText: '确定',
            });
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
    }
}
</script>

<template>
    <span @click="重置游戏">重置游戏</span>
</template>

<style scoped></style>
