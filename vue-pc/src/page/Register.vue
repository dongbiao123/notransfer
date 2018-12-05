<template>
    <div i="register">
        <div class="main-login">
            <div class="content">
                <div class="login-title">汉子接口工具</div>
                <div class="layui-form login-form">
                    <div class="layui-form-item">
                        <label class="layui-form-label">用户名称</label>
                        <div class="layui-input-block">
                            <input type="text" name="test" placeholder="用户名称" class="layui-input" v-model="r_username" autocomplete="off">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">邮箱</label>
                        <div class="layui-input-block">
                            <input type="text" name="test" placeholder="邮箱" class="layui-input" v-model="r_account" autocomplete="off">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">密码</label>
                        <div class="layui-input-block">
                            <input type="password" placeholder="密码" class="layui-input" v-model="r_password" autocomplete="off">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">确认密码</label>
                        <div class="layui-input-block">
                            <input type="password" placeholder="确认密码" class="layui-input" v-model="r_passwords" autocomplete="off">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <div class="layui-input-block">
                            <button class="layui-btn" @click="regSubmit()">注 册</button>
                        </div>
                    </div>
                    <div class="text-right layui-form-item">
                        <router-link v-if="callback" :to=" '/login?callback=' + callback">已有账号？立即登录</router-link>
                        <router-link v-else to="/login">已有账号？立即登录</router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
    @import "~sass/common/tool";

    [i="register"]{
        .main-login {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: #56bc94 url('/static/images/login-bg.png');
            z-index: 9999;
        }

        .main-login .content {
            position: relative;
            height: 100%;
            width: 100%;
        }

        .main-login .content .login-title {
            color: #fff;
            text-align: center;
            font-size: 20px;
            padding-top: 200px;
        }

        .main-login .content .login-form {
            max-width: 450px;
            margin: 10px auto;
            position: relative;
            left: -50px;
            color: #fff;
        }

        .main-login .content .login-form .layui-input-block{
            @include inputPlaceholder(color,rgba(0, 150, 136, 0.5));
        }

        .main-login .content .login-form input {
            background-color: rgba(255, 255, 255, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: #fff;
        }

        .main-login .content .login-form button {
            width: 100%;
        }
    }

</style>
<script>
    import {Verify} from 'hanzi-vue-package';
    import md5 from 'js-md5';

    export default{
        data(){
            return{
                r_username:'',
                r_account:'',
                r_password:'',
                r_passwords:'',
                callback: tools.url.params('callback')
            }
        },
        methods:{
            /* 提交 */
            regSubmit: function () {
                var that = this,
                        ajaxData = {};

                var verify = Verify.run([
                    {
                        type : 'notEmpty',
                        value : that.r_username,
                        name : '用户名称',
                        canEmpty : false
                    },
                    {
                        type: 'reg',
                        value: that.r_account,
                        name: '邮箱',
                        reg: /^\w+([-+.]\w+)*@han-zi.cn*$/,
                        errorMsg : '请输入汉子邮箱',
                        canEmpty: false
                    },
                    {
                        type : 'notEmpty',
                        value : that.r_password,
                        name : '密码',
                        canEmpty : false
                    },
                    {
                        type : 'notEmpty',
                        value : that.r_passwords,
                        name : '确认密码',
                        canEmpty : false
                    }
                ]);

                if (verify !== true) {
                    tools.alert.error(verify.msg);
                    return;
                }

                if(that.r_password !== that.r_passwords){
                    tools.alert.error('输入的密码不匹配');
                    return;
                }

                var password = md5(that.r_password);

                ajaxData.username = that.r_username;
                ajaxData.account = that.r_account;
                ajaxData.password = password;

                layer.confirm('确认提交？',{
                    btn: ['确认', '取消']
                },function () {
                    tools.alert.loading();
                    tools.ajax({
                        url: '/api/registers',
                        ajaxData: ajaxData,
                        successFun: function (res) {
                            tools.alert.closeLoading();
                            tools.alert.success('提交成功,请登录企业邮箱激活');
                            tools.router.push({path: '/login', query: {callback:decodeURIComponent(tools.url.params('callback'))}});
                        },
                        errorFun: function (error_data,status,headers,error_obj) {
                            tools.alert.closeLoading();
                            tools.alert.error(error_data.error_msg);
                        },
                        type: 'POST'
                    });
                });
            }
        },
        watch: {

        },
        components:{

        },
        filters: {

        },
        mounted(){

        }
    }
</script>
