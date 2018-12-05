<template>
    <div>
        <p>dsfsdf</p>

        <swatches-picker v-model="colors" @change-color="onChange"></swatches-picker>
    </div>
</template>
<style>

</style>
<script>
    import {socket} from 'hanzi-vue-package';
    import { Swatches } from 'vue-color'


    var defaultProps = {
        hex: '#fff'
    };

    export default{
        data(){
            return{
                colors: defaultProps
            }
        },
        components:{
            'swatches-picker': Swatches
        },
        watch: {

        },
        methods:{
            onChange (val) {
                this.colors = val
                console.log(val.hex);
            }





        },
        mounted(){
            //连接socket
            socket.connect({
                path : config.api.websocket,
                message : function(){

                },
                close : function(){

                },
                error : function(){

                },
                onopen : function(){

                },
                loginApi : '/api/admin/websocket/get_token',
                loginType :'admin_login'
            });


        },
        destroyed(){
            //离开页面后,销毁socket
            socket.close();
        }
    }
</script>
