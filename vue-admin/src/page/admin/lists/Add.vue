<template>
    <div i="admin_add">
        <div class="isShow f16" v-show="!isShow">
            <div class="layui-layer layui-layer-loading  layer-anim" type="loading" times="1" showtime="0" contype="string" style="position: relative"><div class="layui-layer-content layui-layer-loading0" style="margin: auto;"></div><span class="layui-layer-setwin"></span></div>
        </div>
        <div v-show="isShow">
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
                            <input type="text" v-model.trim="form.username" placeholder="请输入管理员名称" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">手机</label>
                        <div class="layui-input-inline">
                            <input type="text" v-model.trim="form.phone" placeholder="请输入手机号码" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">账号</label>
                        <div class="layui-input-inline">
                            <input type="text" v-model.trim="form.account" placeholder="请输入账号" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">密码</label>
                        <div class="layui-input-inline">
                            <input type="password" v-model="form.password" placeholder="请输入密码" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">确认密码</label>
                        <div class="layui-input-inline">
                            <input type="password" v-model="form.passwords" placeholder="请输入确认密码" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">角色</label>
                        <div class="layui-input-inline" style="max-width: 300px">
                            <multiselect placeholder="请选择角色"
                                         label="name"
                                         track-by="name"
                                         v-model="form.role"
                                         :options="selectOptions"
                                         :multiple="true"
                                         :searchable="false"
                                         :hide-selected="true"
                                         :show-labels="false" >
                                         <!-- :close-on-select="false" -->
                                         <!-- :clear-on-select="false" -->
                                        <span slot="noResult">没有结果</span>
                            </multiselect>
                        </div>
                    </div>
                </div>
                <div class="layui-block mt30 pb10">
                    <button class="layui-btn ml100" @click="submit">立即提交</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss">
    @import "~sass/common/tool";
    @import "../../../assets/sass/common/multiselect";
    [i="admin_add"]{
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
    import {Verify,Compare,Upload} from 'hanzi-vue-package';
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
                name:'添加管理员'
            });
            return {
                isShow: false,
                form:{
                    username:'',
                    account:'',
                    password:'',
                    passwords:'',
                    img:'',
                    img_id:'',
                    role: '',
                    phone: ''
                },
                selectOptions:[]
            }
        },
        props: ['crumbs'],
        methods: {
            //提交
            submit: function () {
                var that = this,
                    ajaxData = {};

                var verify = Verify.run([
                    {
                        type: 'notEmpty',
                        value: that.form.username,
                        name: '管理员名称',
                        canEmpty: false
                    },
                    {
                        type: 'notEmpty',
                        value: that.form.account,
                        name: '账号',
                        canEmpty: false
                    },
                    {
                        type : 'notEmpty',
                        value : that.form.password,
                        name : '密码',
                        canEmpty : false
                    },
                    {
                        type : 'notEmpty',
                        value : that.form.passwords,
                        name : '确认密码',
                        canEmpty : false
                    },
                    {
                        type : 'notEmpty',
                        value : that.form.role,
                        name : '角色',
                        canEmpty : false
                    }
                ]);

                if (verify !== true) {
                    tools.alert.error(verify.msg);
                    return false;
                }

                if(that.form.phone){

                    var verify_phnoe = Verify.run([
                        {
                            type: 'mobile',
                            value: that.form.phone,
                            name: '手机',
                            errorMsg : '手机号码格式错误',
                            canEmpty: false
                        }
                    ]);

                    if (verify_phnoe !== true) {
                        tools.alert.error(verify_phnoe.msg);
                        return false;
                    }

                    ajaxData.phone = that.form.phone;
                }

                if(that.form.password !== that.form.passwords){
                    tools.alert.error('输入的密码不匹配');
                    return;
                }

                var password = md5(that.form.password);

                if(that.form.img != ''){
                    ajaxData.headimg = that.form.img_id;
                }else {
                    delete ajaxData.headimg;
                }

                var arr = [];
                for(var k = 0; k < that.form.role.length; k++){
                    arr.push({role_id:that.form.role[k].id});
                }

                ajaxData.name = that.form.username;

                ajaxData.account = that.form.account;
                ajaxData.password = password;
                ajaxData.role_ids = arr;

                layer.confirm('确认提交？',{
                    btn: ['确认', '取消']
                },function () {
                    tools.alert.loading();
                    tools.ajax({
                        url: '/api/admin/auth/users',
                        ajaxData: ajaxData,
                        successFun: function (res) {
                            tools.alert.closeLoading();
                            tools.alert.success('提交成功');
                            that.go('/admin/lists/lists')
                        },
                        errorFun: function (error_data,status,headers,error_obj) {
                            tools.alert.closeLoading();
                            tools.alert.error(error_data.error_msg);
                        },
                        type: 'POST'
                    });
                });

            },

            //获取角色列表
            getRoles:function () {
                var that = this;

                tools.ajax({
                    url: '/api/admin/auth/roles',
                    ajaxData: {},
                    successFun: function (res) {
                        that.selectOptions = res.list.data;

                        for(var i in that.selectList){
                            that.selectList[i].role_id = that.selectOptions[0].id;
                        }
                        /*for(var i in res.list){
                            var obj = {};
                            obj.Text = res.list[i].name;
                            obj.Value = res.list[i].id;
                            that.selectOptions.push(obj);

                            //选中第一项
                            if(i == 0){
                                that.form.selectValue = obj.Value;
                            }
                        }*/

                        that.isShow = true;
                    },
                    errorFun: function (error_data, status, headers, error_obj) {
                        tools.alert.error(error_data.error_msg);
                    },
                    type: 'GET'
                });
            },

            /* 跳转 */
            go: function (url, val) {
                tools.router.push({path: url, query: val});
            }
        },
        watch: {},
        components: {
            Multiselect,
            Upload
        },
        mounted(){
            var that = this;
//            that.isShow = true;
            that.getRoles();
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
    }
</script>
