<template>
    <div class="main-login">
        <div class="content">
            <div class="login-title">{{title}}</div>
            <div class="layui-form login-form">
                <div class="layui-form-item">
                    <!-- <label class="layui-form-label">{{text}}</label> -->
                    <div class="layui-input-block">
                        <input type="text" name="account" :placeholder="placeholder" class="layui-input" v-model="account">
                    </div>
                </div>
                <div class="layui-form-item">
                    <!-- <label class="layui-form-label">密码</label> -->
                    <div class="layui-input-block">
                        <input type="password" name="password" placeholder="密码" class="layui-input" v-model="password">
                    </div>
                </div>
                <div class="layui-form-item">
                    <div class="layui-input-block">
                        <button class="layui-btn layui-btn-normal" @click="componentSubmit()">登 录</button>
                    </div>
                </div>
                <div class="text-right layui-form-item" v-if="registerUrl">
                    <router-link :to="registerUrl">没有账号？立即注册</router-link>
                </div>
            </div>
        </div>
        <div class="foot-wrap">
            <span>Copyright © han-zi.cn 2017</span>
        </div>
    </div>
</template>

<style rel="stylesheet/scss" lang="scss">
    @import "~sass/common/tool";
    @media screen and (max-width: 750px){

        .main-login{
            height: 100%;
            overflow: hidden;
            background-size: auto !important;

            .content{
                height: auto!important;
            }
            .foot-wrap{
                position: relative!important;
                top: 120px;
            }
        }
    }

    .main-login {
        background: #56bc94 url('/static/images/login_bg.jpg');
        background-size: cover;
        position: absolute;
        top: 0;
        left:0 ;
        right: 0;
        bottom: 0;
        z-index: 999;
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
        font-family: "雅黑";
    }

    .main-login .content .login-form {
        max-width: 450px;
        margin: 10px auto;
        position: relative;
        left: -50px;
        color: #fff;
    }

    .main-login .content .login-form .layui-input-block{
        @include inputPlaceholder(color,#fff);
    }

    .main-login .content .login-form input {
        background-color: rgba(255, 255, 255, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: #fff;
    }

    .main-login .content .login-form button {
        width: 100%;
    }

    .main-login .foot-wrap {
        position: absolute;
        bottom: 0;
        width: 100%;
        color: #fff;
        line-height: 50px;
        text-align: center;
    }

</style>

<script>
    import md5 from 'js-md5';
    import {Verify, LoginStatus} from 'hanzi-vue-package';

    export default{
        data(){
            return {
                isLock: false,
                type : 0,
                text : '',
                placeholder : '',
                account: '',        //邮箱
                password: ''        //密码
            }
        },
        components: {},
        props: ['loginApi', 'accountType', 'registerUrl', 'title'],
        computed: {},
        beforeCreate(){
            LoginStatus.check({
                type:  'login'
            });
        },
        methods: {
            /* 用户登录处理 */
            getData: function () {
                var that = this;

                if(typeof that.accountType === 'object'){
                    var val = that.accountType.join();
                    that.accountJudge(val);
                }else if(typeof that.accountType === 'string'){
                    that.accountJudge(that.accountType);
                }else if(typeof that.accountType === 'undefined'){
                    that.type = 0;
                    that.text = '用户名';
                    that.placeholder = '用户名';
                }
            },
            /* 用户登录判断 */
            accountJudge:function (vals) {
                var that = this;
                var val =  vals.replace(/\s/g, "");
                if(val == 'account'){
                    that.type = 0;
                    that.text = '用户名';
                    that.placeholder = '用户名';
                }else if(val == 'phone'){
                    that.type = 1;
                    that.text = '手机';
                    that.placeholder = '手机';
                }else if(val == 'email'){
                    that.type = 2;
                    that.text = '邮箱';
                    that.placeholder = '邮箱';
                }else if(val == ('email,account' || 'account,email')){
                    that.type = 3;
                    that.text = '用户';
                    that.placeholder = '用户/邮箱';
                }else if(val == ('email,phone' || 'phone,email')){
                    that.type = 4;
                    that.text = '用户';
                    that.placeholder = '手机/邮箱';
                }else if(val == ('phone,account' || 'account,phone')){
                    that.type = 5;
                    that.text = '用户';
                    that.placeholder = '用户/手机';
                }else if(val == 'account,phone,email' || 'account,email,phone' || 'phone,account,email' || 'phone,email,account' || 'email,phone,account' || 'email,account,phone'){
                    that.type = 6;
                    that.text = '用户';
                    that.placeholder = '用户/手机/邮箱';
                }
            },
            /* 提交 */
            componentSubmit: function () {
                var that = this,
                        ajaxData = {};

                if (that.isLock) {
                    return;
                }

                var verifyType = '',
                        verifyName = '',
                        verifyErrorMsg = '';

                switch (that.type){
                    case 0:
                        verifyType = 'notEmpty';
                        verifyName = '用户';
                        verifyErrorMsg = '用户不能为空';
                        break;

                    case 1:
                        verifyType = 'mobile';
                        verifyName = '手机';
                        verifyErrorMsg = '手机格式错误';
                        break;

                    case 2:
                        verifyType = 'email';
                        verifyName = '邮箱';
                        verifyErrorMsg = '邮箱格式错误';
                        break;

                    case 3:
                        verifyType = 'notEmpty';
                        verifyName = '用户';
                        verifyErrorMsg = '用户不能为空';
                        break;

                    case 4:
                        verifyType = 'notEmpty';
                        verifyName = '用户';
                        verifyErrorMsg = '用户不能为空';
                        break;

                    case 5:
                        verifyType = 'notEmpty';
                        verifyName = '用户';
                        verifyErrorMsg = '用户不能为空';
                        break;

                    case 6:
                        verifyType = 'notEmpty';
                        verifyName = '用户';
                        verifyErrorMsg = '用户不能为空';
                        break;
                }

                var verify = Verify.run([
                    {
                        type: verifyType,
                        value: that.account,
                        name: verifyName,
                        errorMsg : verifyErrorMsg,
                        canEmpty: false
                    }
                ]);

                if (verify !== true) {
                    tools.alert.error(verify.msg);
                    return;
                }

                if(that.type == 4){
                    if(!Verify.test.mobile(that.account) && !Verify.test.email(that.account)){
                        tools.alert.error('用户格式错误');
                        return;
                    }
                }

                var verifys = Verify.run([
                    {
                        type: 'notEmpty',
                        value: that.password,
                        name: '密码',
                        canEmpty: false
                    }
                ]);

                if (verifys !== true) {
                    tools.alert.error(verifys.msg);
                    return;
                }

                var password = md5(that.password);

                ajaxData.account = that.account;
                ajaxData.password = password;

                that.isLock = true; //按钮禁止

                tools.ajax({
                    url: that.loginApi,
                    ajaxData: ajaxData,
                    successFun: function (res) {
                        var url = decodeURIComponent(decodeURIComponent(tools.url.params('callback')));

                        tools.cache.set('isLogin', 1);
                        tools.cache.set('nickname', res.data.nickname);
                        tools.cache.set('headimg', res.data.headimg);

                        if (tools.url.params('callback')) {
                            tools.router.push(url);
                        } else {
                            tools.router.push('/');
                        }

                        //解锁
                        that.isLock = false;
                    },
                    errorFun: function (error_data, status, headers, error_obj) {
                        tools.alert.error(error_data.error_msg);
                        that.password = '';

                        //解锁
                        that.isLock = false;
                    },
                    type: 'POST'
                });
            }
        },
        mounted(){
            var that = this;
            that.getData();
            document.onkeydown = function (e) {
                if (!e) e = window.event;//火狐中是 window.event
                if ((e.keyCode || e.which) == 13) {
                    that.componentSubmit();
                }
            };
        },
        destroyed(){
            var that = this;
            document.onkeydown = function (e) {
                if (!e) e = window.event;//火狐中是 window.event
                if ((e.keyCode || e.which) == 13) {

                }
            };
        }
    }
</script>
