<template>
    <login
            :loginApi="loginApi">
    </login>
</template>

<style>

</style>

<script>
    import login from '../components/Login.vue';

    export default{
        data(){
            return {
                loginApi: '/api/admin/login'
            }
        },
        methods: {},
        watch: {},
        components: {
            login
        },
        mounted(){

        }
    }
</script>
