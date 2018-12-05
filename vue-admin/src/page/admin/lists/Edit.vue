<template>
    <div i="lists_edit">
        <div class="isShow f16" v-show="!isShow">
            <div class="layui-layer layui-layer-loading  layer-anim" type="loading" times="1" showtime="0" contype="string" style="position: relative"><div class="layui-layer-content layui-layer-loading0" style="margin: auto;"></div><span class="layui-layer-setwin"></span></div>
        </div>
        <div class="layui-tab" v-show="isShow" lay-filter="tab">
            <ul class="layui-tab-title">
                <li class="layui-this">基本信息</li>
                <li>修改密码</li>
                <li>角色管理</li>
            </ul>
            <div class="layui-tab-content pl0 pr0 sty">
                <div class="layui-tab-item layui-show">
                    <div class="layui-tab-item layui-show mt20">
                        <div class="layui-form">
                            <div class="layui-form-item">
                                <label class="layui-form-label">头像</label>
                                <div class="layui-input-inline">
                                    <div class="prelook-wrapper clearfix pb10" id="container">
                                        <div class="prelook-inner" v-show="form.img">
                                            <span class="circle-box" @click="form.img = ''">
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
                                <label class="layui-form-label">管理员名称</label>
                                <div class="layui-input-inline">
                                    <input type="text" v-model="form.name" placeholder="请输入管理员名称" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">手机</label>
                                <div class="layui-input-inline">
                                    <input type="text" v-model="form.phone" placeholder="请输入手机号码" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">账号</label>
                                <div class="layui-input-inline">
                                    <input type="text" v-model="form.account" placeholder="请输入账号" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">最后登录IP</label>
                                <div class="layui-input-inline">
                                    <span style="line-height:38px;">{{data.last_login_ip}}</span>
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">最后登录时间</label>
                                <div class="layui-input-inline">
                                    <span style="line-height:38px;">{{data.last_login_time | timeTran}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="layui-block pt10">
                            <button class="layui-btn ml100" @click="submit">修改</button>
                        </div>
                    </div>
                </div>
                <div class="layui-tab-item clearfix">
                    <div class="layui-tab-item layui-show mt20">
                        <div class="layui-form">
                            <div class="layui-form-item">
                                <label class="layui-form-label">密码</label>
                                <div class="layui-input-inline">
                                    <input type="password" v-model="paswd.password" placeholder="请输入密码" class="layui-input">
                                </div>
                            </div>
                            <div class="layui-form-item">
                                <label class="layui-form-label">确认密码</label>
                                <div class="layui-input-inline">
                                    <input type="password" v-model="paswd.passwords" placeholder="请输入确认密码" class="layui-input">
                                </div>
                            </div>
                        </div>
                        <div class="layui-block pt10">
                            <button class="layui-btn ml100" @click="sub">修改</button>
                        </div>
                    </div>
                </div>
                <div class="layui-tab-item">
                    <div class="layui-form-item mt20">
                        <label class="layui-form-label">角色</label>
                        <div class="layui-input-inline" style="max-width: 300px">
                            <multiselect placeholder="请选择角色"
                                         label="name"
                                         track-by="name"
                                         v-model="role"
                                         :options="selectOptions"
                                         :multiple="true"
                                         :searchable="false"
                                         :hide-selected="true"
                                         :show-labels="false" >

                                        <span slot="noResult">没有结果</span>
                            </multiselect>
                        </div>
                    </div>
                    <div class="layui-block mt30">
                        <button class="layui-btn ml100" @click="submits">修改</button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<style rel="stylesheet/scss" lang="scss">
    @import "~sass/common/tool";
    @import "../../../assets/sass/common/multiselect";

    .layui-tab-content .sty{
        height: auto!important;
    }

    [i="lists_edit"]{
        .prelook-wrapper{
            padding-top: 10px;
            //border-bottom: 1px dotted #ddd;
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
        .lin:first-child{
            .layui-form-label,.btn{
                opacity: 1;
            }
            .btn{
                display: inline-block;
            }
            .btns{
                display: none;
            }
        }
        .lin{
            .layui-form-label,.btn{
                opacity: 0;
            }
            .btn{
                display: none;
            }
        }
        .isShow{
            background: #fff;
            position: absolute;
            left: 0;
            right: 0;
            top: 42px;
            bottom: 0;
            text-align: center;
            padding-top: 200px;
        }
    }
</style>
<script>
    import {Verify, Compare, Upload} from 'hanzi-vue-package';
    import md5 from 'js-md5';
    import Multiselect from 'vue-multiselect';

    export default{
        data(){
            this.crumbs.push({
                name:'管理员管理'
            },{
                name:'管理员列表',
                url:'/admin/lists/lists'
            },{
                name:'编辑管理员'
            });
            return{
                isShow: false,
                id: tools.url.params('id'),
                form:{
                    img:'',
                    img_id:'',
                    name:'',
                    account:'',
                    phone: ''
                },
                paswd:{
                    password:'',
                    passwords:''
                },
                selectOptions:[],
                data: {},
                role: [],
                is_one_render: true //第一次进入页面
            }
        },
        props: ['crumbs'],
        methods:{
            /* 获取数据 */
            getData : function () {
                var that = this,
                        ajaxData = {};

                tools.ajax({
                    url: '/api/admin/auth/users/' + that.id,
                    ajaxData: ajaxData,
                    successFun: function (res) {
                        that._oldObj = $.extend(true, {}, res.data);

                        for(var i in res.data.roles){
                            that.role.push(res.data.roles[i]);
                        }
                        if(res.data.roles.length == 0){
                            that.selectList = [{value:that.selectOptions[0].id}];
                        }
                        that.form.img = res.data.headimg;
                        that.form.name = res.data.name;

                        if(res.data.phone == 0){
                            that.form.phone = '';
                        }else {
                            that.form.phone = res.data.phone;
                        }

                        that.form.account = res.data.account;
                        that.isShow = true;
                        that.data = res.data;
                        if(that.is_one_render){
                            that.is_one_render = false;
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
                        }

                    },
                    errorFun: function (error_data,status,headers,error_obj) {
                        that.isShow = true;
                        tools.alert.error(error_data.error_msg);
                    },
                    type: 'GET'
                });
            },

            /* 获取角色列表 */
            getRoles:function () {
                var that = this;

                tools.ajax({
                    url: '/api/admin/auth/roles',
                    ajaxData: {},
                    successFun: function (res) {
                        that.selectOptions = res.list.data;
                        that.getData();
                    },
                    errorFun: function (error_data, status, headers, error_obj) {
                        tools.alert.error(error_data.error_msg);
                    },
                    type: 'GET'
                });
            },

            /* 提交基本信息 */
            submit : function () {
                var that = this,
                        ajaxData = {};

                var verify = Verify.run([
                    {
                        type: 'notEmpty',
                        value: that.form.name,
                        name: '管理员名称',
                        canEmpty: false
                    },
                    {
                        type: 'notEmpty',
                        value: that.form.account,
                        name: '账号',
                        canEmpty: false
                    }
                ]);

                if (verify !== true) {
                    tools.alert.error(verify.msg);
                    return;
                }

                if(that.form.name === that._oldObj.name){
                    delete ajaxData.name;
                }else {
                    ajaxData.name = that.form.name;
                }
                if(that.form.account === that._oldObj.account){
                    delete ajaxData.account;
                }else {
                    ajaxData.account = that.form.account;
                }

                if(that.form.phone === that._oldObj.phone){
                    delete ajaxData.phone;
                }else {
                    var reg = /^(0)?1([3|4|5|6|7|8])+([0-9]){9}$/;
                    if(reg.test(that.form.phone)){
                        ajaxData.phone = that.form.phone;
                    }else {
                        tools.alert.error('手机号码格式错误');
                        return;
                    }
                }

                if(that._oldObj.headimg === that.form.img){
                    delete ajaxData.headimg;
                }else {
                    if(that.form.img == ''){
                        ajaxData.headimg = '';
                    }else {
                        ajaxData.headimg = that.form.img_id;
                    }
                }

                layer.confirm('确认提交？', {
                    btn: ['确认', '取消']
                }, function () {
                    tools.alert.loading();
                    tools.ajax({
                        url: '/api/admin/auth/users/' + that.id,
                        ajaxData: ajaxData,
                        successFun: function (res) {
                            // that.getData();
                            tools.alert.closeLoading();
                            tools.alert.success('提交成功');
                        },
                        errorFun: function (error_data, status, headers, error_obj) {
                            tools.alert.closeLoading();
                            tools.alert.error(error_data.error_msg);
                        },
                        type: 'PUT'
                    });
                });
            },

            /* 提交修改密码 */
            sub: function () {
                var that = this,
                    ajaxData = {};

                var verify = Verify.run([
                    {
                        type: 'notEmpty',
                        value: that.paswd.password,
                        name: '密码',
                        canEmpty: false
                    },
                    {
                        type: 'notEmpty',
                        value: that.paswd.passwords,
                        name: '确认密码',
                        canEmpty: false
                    }
                ]);

                if (verify !== true) {
                    tools.alert.error(verify.msg);
                    return;
                }

                if(that.paswd.password !== that.paswd.passwords){
                    tools.alert.error('输入的密码不匹配');
                    return;
                }

                var password = md5(that.paswd.password);
                ajaxData.password = password;

                layer.confirm('确认提交？', {
                    btn: ['确认', '取消']
                }, function () {
                    tools.alert.loading();
                    tools.ajax({
                        url: '/api/admin/auth/users/' + that.id,
                        ajaxData: ajaxData,
                        successFun: function (res) {
                            tools.alert.closeLoading();
                            tools.alert.success('提交成功');
                            that.paswd = {
                                password:'',
                                passwords:''
                            }
                        },
                        errorFun: function (error_data, status, headers, error_obj) {
                            tools.alert.closeLoading();
                            tools.alert.error(error_data.error_msg);
                        },
                        type: 'PUT'
                    });
                });
            },

            /* 提交角色管理 */
            submits : function () {
                var that = this,
                    ajaxData = {};

                var arr = [];
                for(var i = 0; i < that.role.length; i++){
                    arr.push({role_id:parseInt(that.role[i].id)});
                }

                if(that.role.length == 0){
                    tools.alert.error('角色不能为空');
                    return;
                }

                ajaxData.role_ids = arr;

                layer.confirm('确认提交？', {
                    btn: ['确认', '取消']
                }, function () {
                    tools.alert.loading();
                    tools.ajax({
                        url: '/api/admin/auth/users/' + that.id,
                        ajaxData: ajaxData,
                        successFun: function (res) {
                            tools.alert.closeLoading();
                            tools.alert.success('提交成功');
                        },
                        errorFun: function (error_data, status, headers, error_obj) {
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
            Multiselect,
            Upload
        },
        mounted(){
            var that = this;

            that.getRoles();
        }
    }
</script>
