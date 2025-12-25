<script>
export default {
    name: '反馈',
    data() {
        return {
            显示弹窗: false,
            提交数据: {
                联系方式: '',
                反馈类型: '建议',
                反馈内容: ''
            }
        }
    },
    mounted() {
        // this.显示弹窗 = true;
    },
    methods: {
        关闭() {
            this.显示弹窗 = false;
        },
        async 提交() {
            if (this.提交数据.反馈内容.trim() == '') {
                this.$message.error('请填写反馈内容');
                return;
            }

            const 加载中 = ElementPlus.ElLoading.service({
                lock: true,
                text: '正在发送反馈, 请稍等...',
                background: 'rgba(0, 0, 0, 0.7)',
            });

            var 接口地址 = 'https://api.ngapp.net/Feedback';
            var 数据 = {
                标题: '红警地图测试工具反馈',
                联系方式: this.提交数据.联系方式,
                反馈类型: this.提交数据.反馈类型,
                反馈内容: this.提交数据.反馈内容,
            };
            var 请求 = await fetch(接口地址, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(数据)
            });
            var 结果 = await 请求.text();
            if (结果 == 'send ok!') {
                this.$message.success('提交成功');
                this.显示弹窗 = false;
                this.提交数据.反馈内容 = '';
            } else {
                this.$alert('提交失败: ' + 结果);
            }
            加载中.close();

        }

    }
}
</script>
<template>
    <span @click="显示弹窗 = true">问题反馈</span>
    <el-dialog v-model="显示弹窗" title="反馈" width="500">
        <el-form :model="提交数据" label-width="auto" style="max-width: 600px">
            <el-form-item label="联系方式">
                <el-input v-model="提交数据.联系方式" placeholder="选填" />
            </el-form-item>
            <el-form-item label="反馈类型">
                <el-select v-model="提交数据.反馈类型" placeholder="请选择">
                    <el-option label="BUG" value="BUG" />
                    <el-option label="建议" value="建议" />
                </el-select>
            </el-form-item>
            <el-form-item label="反馈内容">
                <el-input v-model="提交数据.反馈内容" type="textarea" :rows="6" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="显示弹窗 = false">关闭</el-button>
                <el-button type="primary" @click="提交">提交</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<style scope></style>