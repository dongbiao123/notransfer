<template>
    <div i="menu_admin_edit">
        <div class="isShow f16" v-show="!isShow">
            <div class="layui-layer layui-layer-loading  layer-anim" type="loading" times="1" showtime="0" contype="string" style="position: relative"><div class="layui-layer-content layui-layer-loading0" style="margin: auto;"></div><span class="layui-layer-setwin"></span></div>
        </div>
        <div v-show="isShow">
            <div class="layui-tab-item layui-show mt20 mb20">
                <div class="layui-form">
                    <div class="layui-form-item">
                        <label class="layui-form-label">菜单组名称</label>
                        <div class="layui-input-inline">
                            <input type="text" v-model="form.name" placeholder="请输入菜单组名称" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">菜单组描述</label>
                        <div class="layui-input-inline">
                            <input type="text" v-model="form.description" placeholder="请输入菜单组描述" class="layui-input">
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">菜单组排序</label>
                        <div class="layui-input-inline">
                            <input type="text" v-model="form.order" placeholder="请输入菜单组排序" class="layui-input">
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

    [i="menu_admin_edit"]{
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
            var text = '添加菜单组';
            if(tools.url.params('id')){
                text = '编辑菜单组';
            }
            this.crumbs.push({
                name:'管理员管理'
            },{
                name:'菜单组列表',
                url:'/admin/menu/lists'
            },{
                name:text
            });
            return{
                id: tools.url.params('id'),
                isShow: false,
                form:{
                    name:'',
                    description:'',
                    order:''
                }
            }
        },
        props: ['crumbs'],
        methods:{
            /* 获取数据 */
            getData : function () {
                var that = this,
                        ajaxData = {};

                tools.ajax({
                    url: '/api/admin/auth/menus/' + that.id,
                    ajaxData: ajaxData,
                    successFun: function (res) {
                        Compare.oldObj(res.data); //将旧数据存起来
                        that.form.name = res.data.name;
                        that.form.description = res.data.description;
                        that.form.order = res.data.order;
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
                        name : '菜单组名称',
                        canEmpty : false
                    },
                    {
                        type : 'notEmpty',
                        value : that.form.description,
                        name : '菜单组描述',
                        canEmpty : false
                    },
                    {
                        type : 'notEmpty',
                        value : that.form.order,
                        name : '菜单组排序',
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
                    url = '/api/admin/auth/menus/' + that.id;
                    ajaxData = Compare.newObj(ajaxData); //如果数据未改动则为空对象
                }else {
                    url = '/api/admin/auth/menus';
                    type = 'POST';
                }

                ajaxData.level = 1;
                ajaxData.parent_id = 0;

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
                            that.go('/admin/menu/lists');
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
