<template>
    <base-login
            :title="title"
            :loginApi="loginApi"
            :registerUrl="registerUrl"
            :accountType="accountType">
    </base-login>
</template>

<style scoped>

</style>

<script>
    import baseLogin from '@components/Login.vue';

    export default{
        data(){
            return {
                loginApi: '/api/logins',
                registerUrl:'/register' + location.search,
                accountType:'email',
                title:'汉子开发平台'
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
