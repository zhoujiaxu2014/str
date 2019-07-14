<template>
    <el-button type="info" @click="loginout">退出</el-button>
</template>

<script>
export default {
    data(){
        return{
        }
    },
    methods:{
        loginout(){
            window.sessionStorage.clear();
            this.$router.push('/login')
            this.$message.warning('退出成功');
        }
    }
}
</script>

<style>

</style>
