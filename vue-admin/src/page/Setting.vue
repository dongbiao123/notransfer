<template>
    <div i="modifyPassword">
        <div>
            <div class="layui-tab-item layui-show mt20">
                <div class="layui-form">
                    <div class="layui-form-item">
                        <label class="layui-form-label">头像</label>
                        <div class="layui-input-inline">
                            <div class="prelook-wrapper clearfix pb10" id="container">
                                <div class="prelook-inner" v-show="form.img">
                                    <span class="circle-box" @click="form.img = '',form.img_id = ''">
                                        <i class="circle"></i>
                                    </span>
                                    <a rel="group" class="fancybox prelook-block">
                                        <img :src="form.img">
                                    </a>
                                </div>
                                <div class="form-groups" v-show="!form.img">
                                    <div class="col-10">
                                        <div class="upload-wrapper" id="pickfiles">
                                            <div class="progress text-center" id="progress"></div>
                                            <i class="fa fa-plus f16"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">账号</label>
                        <div class="layui-input-inline" style="padding-top: 12px;">
                            <span>{{data.account}}</span>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">用户名</label>
                        <div class="layui-input-inline">
                            <input type="text" v-model="data.name" placeholder="请输入用户名" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">手机</label>
                        <div class="layui-input-inline">
                            <input type="text" v-model="data.phone" placeholder="请输入手机" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">旧密码</label>
                        <div class="layui-input-inline">
                            <input type="password" v-model="password_old" placeholder="请输入旧密码" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">密码</label>
                        <div class="layui-input-inline">
                            <input type="password" v-model="password" placeholder="请输入密码" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">确认密码</label>
                        <div class="layui-input-inline">
                            <input type="password" v-model="passwords" placeholder="请输入确认密码" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">最后登录IP</label>
                        <div class="layui-input-inline" style="padding-top: 12px;">
                            <span>{{data.last_login_ip}}</span>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">最后登录时间</label>
                        <div class="layui-input-inline" style="padding-top: 12px;">
                            <span>{{data.last_login_time | timeTran}}</span>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">角色</label>
                        <div class="layui-input-inline" style="padding-top: 12px;">
                            <span class="role" v-for="d in data.role"><i>,</i>{{d.name}}</span>
                        </div>
                    </div>
                </div>
                <div class="layui-block pt10">
                    <button class="layui-btn ml100" @click="submit">立即提交</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss">
    @import "~sass/common/tool";

    [i="modifyPassword"]{
        .prelook-wrapper{
            padding-top: 10px;
            //border-bottom: 1px dotted #ddd;
        }
        .role:first-child i{
            display: none;
        }
        .prelook-wrapper .upload-wrapper{
            float: left;
            position: relative;
            width: 120px;
            height: 120px;
            text-align: center;
            line-height: 120px;
            border: 1px solid #ddd;
            margin-bottom: 10px;
            cursor: pointer;
            overflow: hidden;
        }
        .prelook-wrapper .upload-wrapper i{
            line-height: 120px;
        }
        .prelook-wrapper .prelook-inner .circle-box{
            position: absolute;
            right: -10px;
            top: -10px;
            z-index: 1;
            cursor: pointer;
        }
        .prelook-wrapper .prelook-inner .circle{
            @include round_close(24px);
        }
        .prelook-wrapper .upload-wrapper .file-button{
            font-size: 200px;
            opacity: 0;
            position: absolute;
            left: 0;
            top: 0;
            width: 120px;
            height: 120px;
            cursor: pointer;
            z-index: 9;
        }
        .prelook-inner {
            float: left;
            width: 120px;
            height: 120px;
            margin-right: 20px;
            margin-bottom: 10px;
            position: relative;
        }
        .prelook-inner i.fa-times-circle {
            font-size: 20px;
            position: absolute;
            top: -10px;
            right: -10px;
            z-index: 999;
            cursor: pointer;
        }
        .prelook-block {
            display: block;
            width: 120px;
            height: 120px;
            overflow: hidden;
            position: relative;
        }
        .prelook-block img {
            width: 100%;
        }
        .prelook-inner .prelook-radio {
            display: block;
            width: 100%;
            height: 30px;
            line-height: 30px;
            padding-left: 10px;
        }
        .moxie-shim{
            display: none;
        }
        .progress{
            position: absolute;
            top: 0;
            background-color: #5cb85c;
            color: #000;
            font-size: 12px;
            line-height: 20px;

            background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
            background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
            background-image: linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
            -webkit-background-size: 40px 40px;
            background-size: 40px 40px;

            -webkit-animation: progress-bar-stripes 2s linear infinite;
            -o-animation: progress-bar-stripes 2s linear infinite;
            animation: progress-bar-stripes 2s linear infinite;
        }
    }
</style>
<script>
    import {Verify,Upload} from 'hanzi-vue-package';
    import md5 from 'js-md5';

    export default{
        data(){
            this.crumbs.push({
                name:'个人设置'
            });
            return{
                form:{
                    img:'',
                    img_id:''
                },
                password : '',
                passwords : '',
                password_old : '',
                data:{}
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
                        that.oldObj = $.extend(true, {}, res.data)
                        if(res.data.phone === 0){
                            res.data.phone = '';
                        }
                        that.data = res.data;
                        that.form.img = res.data.headimg;
                    },
                    errorFun: function (error_data, status, headers, error_obj) {
                        tools.alert.error(error_data.error_msg);
                    },
                    type: 'GET'
                });
            },

            /* 提交 */
            submit : function () {
                var that = this,
                        ajaxData = {};

                var verify = Verify.run([
                    {
                        type : 'notEmpty',
                        value : that.data.name,
                        name : '用户名',
                        canEmpty : false
                    }
                ]);

                if(verify !== true){
                    tools.alert.error(verify.msg);
                    return;
                }

                if(that.password_old){
                    var verifys = Verify.run([
                        {
                            type : 'notEmpty',
                            value : that.password,
                            name : '密码',
                            canEmpty : false
                        },
                        {
                            type : 'notEmpty',
                            value : that.passwords,
                            name : '确认密码',
                            canEmpty : false
                        }
                    ]);

                    if(verifys !== true){
                        tools.alert.error(verifys.msg);
                        return;
                    }
                }

                if(that.password){
                    var verify_one = Verify.run([
                        {
                            type : 'notEmpty',
                            value : that.password_old,
                            name : '旧密码',
                            canEmpty : false
                        },
                        {
                            type : 'notEmpty',
                            value : that.passwords,
                            name : '确认密码',
                            canEmpty : false
                        }
                    ]);

                    if(verify_one !== true){
                        tools.alert.error(verify_one.msg);
                        return;
                    }
                }

                if(that.passwords){
                    var verify_tow = Verify.run([
                        {
                            type : 'notEmpty',
                            value : that.password_old,
                            name : '旧密码',
                            canEmpty : false
                        },
                        {
                            type : 'notEmpty',
                            value : that.password,
                            name : '密码',
                            canEmpty : false
                        }
                    ]);

                    if(verify_tow !== true){
                        tools.alert.error(verify_tow.msg);
                        return;
                    }
                }

                if(that.data.phone){
                    var verify_three = Verify.run([
                        {
                            type : 'mobile',
                            value : that.data.phone,
                            name : '手机',
                            errorMsg : '手机号码格式错误',
                            canEmpty : false
                        }
                    ]);

                    if(verify_three !== true){
                        tools.alert.error(verify_three.msg);
                        return;
                    }
                }

                if(that.password !== that.passwords){
                    tools.alert.error('输入的密码不匹配');
                    return;
                }

                if(that.password){
                    var password = md5(that.password);
                    var old_password = md5(that.password_old);

                    ajaxData.password = password;
                    ajaxData.old_password = old_password;
                }

                if(that.data.phone === that.oldObj.phone){
                    delete ajaxData.phone;
                }else {
                    ajaxData.phone = that.data.phone;
                }

                if(that.data.name === that.oldObj.name){
                    delete ajaxData.name;
                }else {
                    ajaxData.name = that.data.name;
                }

                if(that.oldObj.headimg == that.form.img){
                    delete ajaxData.headimg;
                }else {
                    if(that.form.img == ''){
                        ajaxData.headimg = '';
                    }else {
                        ajaxData.headimg = that.form.img_id;
                    }
                }

                layer.confirm('确认提交？',{
                    btn: ['确认', '取消']
                },function () {
                    tools.alert.loading();
                    tools.ajax({
                        url: '/api/admin/auth/user/selfs',
                        ajaxData: ajaxData,
                        successFun: function (res) {
                            tools.alert.closeLoading();
                            tools.alert.success('提交成功');
                        },
                        errorFun: function (error_data,status,headers,error_obj) {
                            tools.alert.closeLoading();
                            tools.alert.error(error_data.error_msg);
                        },
                        type: 'PUT'
                    });
                });
            },

            /* 跳转 */
            go: function (url, val) {
                tools.router.push({path: url, query: val});
            }
        },
        watch: {

        },
        filters: {

            /* 时间转换 */
            timeTran: function (value) {
                return parseInt(value) == 0 ? '-' : tools.date('Y-m-d H:i:s', value);
            },

        },
        components:{
            Upload
        },
        mounted(){
            var that = this;
            var uploads = new upload({
                container: 'container',     //容器ID
                browse_button: 'pickfiles', //按钮ID
                progress:'progress',        //进度条ID
                type: 'admin_headpic',      //请求接口时的传参，upload_type:"headpic"
                setting : 'local',          //local：本地，cloud：云
                chunk_size : '200kb',       //分段传输的大小
                group: ['img'],             //上传格式组
                url: '/api/admin/uploads',
                callback: function (res) {
                    that.form.img = res.data.url;
                    that.form.img_id = res.data.upload_id;
                }
            });
            that.getData();
        }
    }
</script>
