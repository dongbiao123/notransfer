<template>
    <div i="index">
        <div class="index-content">
            <h1>欢迎您，{{name}}</h1>
            <transition>
                <h2 v-if="data.role" class="pt20">当前角色：
                    <transition>
                        <span class="role" v-for="d in data.role"><i>,</i>{{d.name}}</span>
                    </transition>
                </h2>
            </transition>
        </div>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss">
    [i="index"]{
        .index-content{
            width: 100%;
            text-align: center;
            padding: 50px;

            .role:first-child i{
                display: none;
            }
        }
    }
</style>
<script>

    export default{
        data(){
            this.crumbs.push({});
            return{
                data:{},
                name: tools.cache.get('nickname'),
            }
        },
        props: ['crumbs'],
        methods:{
            getData: function () {
                var that = this;

                tools.ajax({
                    url: '/api/admin/auth/user/selfs',
                    ajaxData: {},
                    successFun: function (res) {
                        if(res){
                            that.data = res.data;
                        }
                    },
                    errorFun: function (error_data, status, headers, error_obj) {
                        tools.alert.error(error_data.error_msg);
                    },
                    type: 'GET'
                });
            },
        },
        watch: {

        },
        components:{

        },
        filters: {

        },
        mounted(){
            this.getData();
        }
    }
</script>
