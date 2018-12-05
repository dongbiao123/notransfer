<template>
    <div i="label_edit">
        <div class="isShow f16" v-show="!isShow">
            <div class="layui-layer layui-layer-loading  layer-anim" type="loading" times="1" showtime="0" contype="string" style="position: relative"><div class="layui-layer-content layui-layer-loading0" style="margin: auto;"></div><span class="layui-layer-setwin"></span></div>
        </div>
        <div v-show="isShow">
            <div class="layui-tab-item layui-show mt20">
                <div class="layui-form">
                    <div class="layui-form-item">
                        <label class="layui-form-label">标签名称</label>
                        <div class="layui-input-inline">
                            <input type="text" v-model="form.name" placeholder="请输入标签名称" class="layui-input">
                        </div>
                    </div>
                </div>
                <div class="layui-block pt10 pb10">
                    <button class="layui-btn ml100" @click="submit">立即提交</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss">
    @import "~sass/common/tool";

    [i="label_edit"]{
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
    import {Verify,Compare} from 'hanzi-vue-package';
    import md5 from 'js-md5';

    export default{
        data(){
            var text = '添加文章标签';
            if(tools.url.params('id')){
                text = '编辑文章标签';
            }
            this.crumbs.push({
                name:'文章管理'
            },{
                name:'文章标签',
                url:'/article/label/lists'
            },{
                name: text
            });
            return{
                id: tools.url.params('id'),
                isShow: false,
                form:{
                    name:''
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
                    url: '/api/admin/article/tags/' + that.id,
                    ajaxData: ajaxData,
                    successFun: function (res) {
                        Compare.oldObj(res.data); //将旧数据存起来
                        that.form.name = res.data.name;
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
                        name : '标签名称',
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
                    url = '/api/admin/article/tags/' + that.id;
                    ajaxData = Compare.newObj(ajaxData); //如果数据未改动则为空对象
                }else {
                    url = '/api/admin/article/tags';
                    type = 'POST';
                }

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
                            that.go('/article/label/lists');
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
