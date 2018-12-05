<template>
    <div i="power_admin_edit">
        <div class="isShow f16" v-show="!isShow">
            <div class="layui-layer layui-layer-loading  layer-anim" type="loading" times="1" showtime="0" contype="string" style="position: relative"><div class="layui-layer-content layui-layer-loading0" style="margin: auto;"></div><span class="layui-layer-setwin"></span></div>
        </div>
        <div v-show="isShow">
            <div class="layui-tab-item layui-show mt20 mb20">
                <div class="layui-form">
                    <div class="layui-form-item">
                        <label class="layui-form-label">权限名称</label>
                        <div class="layui-input-inline">
                            <input type="text" v-model="form.name" placeholder="请输入权限名称" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">权限描述</label>
                        <div class="layui-input-inline">
                            <input type="text" v-model="form.description" placeholder="请输入权限描述" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">规则代码</label>
                        <div class="layui-input-inline">
                            <input type="text" v-model="form.code" placeholder="请输入规则代码" class="layui-input">
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
<style rel="stylesheet/scss" lang="scss" scoped>
    @import "~sass/common/tool";

    [i="power_admin_edit"]{
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
    import {Verify, Compare} from 'hanzi-vue-package';
    import md5 from 'js-md5';

    export default{
        data(){
            this.crumbs.push({
                name:'管理员管理'
            },{
                name:'权限组列表',
                url:'/admin/power/lists'
            },{
                name: '权限组：' + decodeURI(decodeURI(tools.url.params('name'))),
                url:'/admin/power/admin/lists?id=' + tools.url.params('parent_id')
            },{
                name: '编辑权限 到 ' + decodeURI(decodeURI(tools.url.params('name')))
            });
            return{
                id: tools.url.params('id'),
                parent_id: tools.url.params('parent_id'),
                name: decodeURI(decodeURI(tools.url.params('name'))),
                isShow: false,
                form:{
                    name:'',
                    description:'',
                    code:''
                }
            }
        },
        props: ['crumbs'],
        methods:{
            /* 获取表单数据 */
            getData : function () {
                var that = this,
                        ajaxData = {};

                tools.ajax({
                    url: '/api/admin/auth/permissions/' + that.id,
                    ajaxData: ajaxData,
                    successFun: function (res) {
                        Compare.oldObj(res.data); //将旧数据存起来
                        that.form.name = res.data.name;
                        that.form.description = res.data.description;
                        that.form.code = res.data.code;
                        that.isShow = true;
                    },
                    errorFun: function (error_data,status,headers,error_obj) {
                        that.isShow = true;
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
                        value : that.form.name,
                        name : '权限名称',
                        canEmpty : false
                    },
                    {
                        type : 'notEmpty',
                        value : that.form.description,
                        name : '权限描述',
                        canEmpty : false
                    },
                    {
                        type : 'notEmpty',
                        value : that.form.code,
                        name : '规则代码',
                        canEmpty : false
                    }
                ]);

                if(verify !== true){
                    tools.alert.error(verify.msg);
                    return;
                }

                ajaxData = that.form;

                var type = '';
                var url = '';
                if(that.id){
                    type = 'PUT';
                    url = '/api/admin/auth/permissions/' + that.id;
                    ajaxData = Compare.newObj(ajaxData); //如果数据未改动则为空对象
                }else {
                    url = '/api/admin/auth/permissions';
                    type = 'POST';
                }

                ajaxData.parent_id = that.parent_id;
                ajaxData.level = 2;

                layer.confirm('确认提交？',{
                    btn: ['确认', '取消']
                },function () {
                    tools.alert.loading();
                    tools.ajax({
                        url: url,
                        ajaxData: ajaxData,
                        successFun: function (res) {
                            tools.alert.closeLoading();
                            tools.alert.success('提交成功');
                            that.go('/admin/power/admin/lists',{id: that.parent_id});
                        },
                        errorFun: function (error_data,status,headers,error_obj) {
                            tools.alert.closeLoading();
                            tools.alert.error(error_data.error_msg);
                        },
                        type: type
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
        components:{

        },
        mounted(){
            var that = this;

            if(that.id){
                that.getData();
            }else {
                that.isShow = true;
            }

        }
    }
</script>
