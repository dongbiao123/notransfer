<template>
    <div i="user_edit">
        <div class="layui-form">
            <div class="layui-form-item">
                <label class="layui-form-label">
                    头像：
                </label>
                <div class="layui-input-inline">
                    <template v-if="data.headimg">
                        <img :src="data.headimg" />
                    </template>
                    <template v-else>
                        <span style="line-height: 38px;">-</span>
                    </template>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">
                    手机：
                </label>
                <div class="layui-input-inline">
                    <span v-if="data.phone != 0" style="line-height: 38px;">{{data.phone}}</span>
                    <span v-else style="line-height: 38px;">-</span>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">
                    用户名：
                </label>
                <div class="layui-input-inline">
                    <span style="line-height: 38px;">{{data.username}}</span>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">
                    邮箱：
                </label>
                <div class="layui-input-inline">
                    <span style="line-height: 38px;">{{data.email}}</span>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">
                    最后登录IP：
                </label>
                <div class="layui-input-inline">
                    <span style="line-height: 38px;">{{data.last_login_ip}}</span>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">
                    最后登录时间：
                </label>
                <div class="layui-input-inline">
                    <span style="line-height: 38px;">{{data.last_login_time | timeTran}}</span>

                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">
                    创建时间：
                </label>
                <div class="layui-input-inline">
                    <span style="line-height: 38px;">{{data.created_at | timeTran}}</span>
                </div>
            </div>
            <div class="layui-form-item">
                <label class="layui-form-label">
                    状态：
                </label>
                <div class="layui-input-inline">
                    <span @click="changeStatus()" class="pointer" :class="{'green':data.status == 1,'red': data.status == 0}" style="line-height: 38px;" v-html="data.status == 1 ? '正常' : '禁用'"></span>
                </div>
            </div>
        </div>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss">
    @import "~sass/common/tool";
    [i="user_edit"]{
        .checkbox{
            display: block!important;
            margin: 8px 0;
            @include switch_code(50px, 25px, #41B883);
        }
        .layui-form-label{
            width: 115px
        }
    }
</style>
<script>

    export default{
        data(){

            this.crumbs.push({
                name:'会员管理'
            },{
                name:'会员列表',
                url:'/user/lists'
            },{
                name:'编辑会员'
            });

            return{
                id: tools.url.params('id'),
                data:{},
                is_btn: true
            }
        },
        methods:{
            /* 获取数据 */
            getData: function () {
                var that = this;

                tools.ajax({
                    url: '/api/admin/users/' + that.id,
                    ajaxData: {},
                    successFun: function (res) {
                        that.data = res.data;
                    },
                    errorFun: function (error_data,status,headers,error_obj) {
                        tools.alert.error(error_data.error_msg);
                    },
                    type: 'GET'
                });
            },

            /* 状态修改 */
            changeStatus: function () {
                var that = this;

                if(!that.is_btn){
                    return;
                }

                that.is_btn = false;

                var status = null;

                if(that.data.status == 1){
                    status = 0;
                }else if(that.data.status == 0){
                    status = 1;
                }

                tools.alert.loading();
                tools.ajax({
                    url: '/api/admin/users/' + that.id,
                    ajaxData: {
                      status: status
                    },
                    successFun: function (res) {
                        that.is_btn = true;
                        that.data.status = status;
                        tools.alert.closeLoading();
                    },
                    errorFun: function (error_data, status, headers, error_obj) {
                        tools.alert.closeLoading();
                        that.is_btn = true;
                        tools.alert.error(error_data.error_msg);
                    },
                    type: 'PUT'
                });
            },

            /* 跳转 */
            go: function (url, val) {
                tools.router.push({path: url, query: val});
            }
        },
        props: ['crumbs'],
        watch: {

        },
        filters: {
            /* 时间转换 */
            timeTran: function (value) {
                return parseInt(value) == 0 ? '-' : tools.date('Y-m-d H:i:s', value);
            },
        },
        components:{

        },
        mounted(){
            var that = this;
            that.getData();
        }
    }
</script>
