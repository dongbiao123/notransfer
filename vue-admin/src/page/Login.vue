<template>
    <base-login
            :title="title"
            :loginApi="loginApi">
    </base-login>
</template>

<style>

</style>

<script>
    import baseLogin from '../components/Login.vue';

    export default{
        data(){
            return {
                loginApi: '/api/admin/logins',
                title:'汉子后台管理系统'
            }
        },
        methods: {},
        watch: {},
        components: {
            baseLogin
        },
        mounted(){

        }
    }
</script>
