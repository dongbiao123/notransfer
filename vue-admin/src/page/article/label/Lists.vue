<template>
    <div i="label_lists">
        <div class="layui-form">
            <div class="layui-inline mb10 mr10">
                <span>标签名称：</span>
                <div class="layui-input-inline">
                    <input type="text" v-model.trim="form.name" placeholder="请输入标签名称" class="layui-input">
                </div>
            </div>
            <div class="layui-inline mb10">
                <button class="layui-btn layui-btn-normal" @click="search">
                    <i class="el-icon-search"></i>
                    搜索
                </button>
            </div>
        </div>
        <div class="mb10 mt20">
            <button class="layui-btn" @click="go('/article/label/edit')">添加标签</button>
        </div>
        <base-table
                :title="title"
                :tableData="lists"
                :page="page"
                :todos="todos"
                :extra_data="extra_data"
                v-on:edit="edit"
                v-on:del="del"
                v-on:getList="getList"
                v-on:getHistoryList="getHistoryList">
        </base-table>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
    @import "~sass/common/tool";

    [i="label_lists"]{

    }
</style>
<script>
    import {baseTable} from 'hanzi-vue-package';
    tools.vue.use(baseTable);
    export default{
        data(){
            this.crumbs.push({
                name:'文章管理'
            },{
                name:'文章标签'
            });
            return {
                title:[
                    {
                        title: '文章标签名称',
                        name : 'name'
                    },
                    {
                        title: '创建时间',
                        name: 'created_at',
                        type: 'date'
                    },
                    {
                        title: '修改时间',
                        name: 'updated_at',
                        type: 'date'
                    }
                ],
                todos: [
                    {
                        title: '<i class="el-icon-edit" title="编辑"></i>',
                        action: 'event',
                        click_event: 'edit'
                    },
                    {
                        title: '<i class="el-icon-delete" title="删除"></i>',
                        action: 'event',
                        click_event: 'del'
                    }
                ],
                lists : [],
                page : {},
                extra_data : {},
                form:{
                    name:''
                },
                is_init: true
            }
        },
        props: ['crumbs'],
        methods: {
            /* 获取列表 */
            getList : function(page,page_size){
                var that = this;

                var ajaxData = that.extra_data || {};
                ajaxData.page = page;
                ajaxData.is_page = 1;

                if(that.is_init){
                    if(tools.url.params('name')){
                        ajaxData.name = decodeURI(tools.url.params('name'));
                    }
                    that.is_init = false;
                }

                tools.ajax({
                    url: '/api/admin/article/tags',
                    ajaxData: ajaxData,
                    successFun: function (res) {
                        that.lists = res.list.data;
                        that.page = res.list;
                    },
                    errorFun: function (error_data, status, headers, error_obj) {
                        tools.alert.error(error_data.error_msg);
                    },
                    type: 'GET'
                });

                return true;
            },

            /* 获取后退历史列表 */
            getHistoryList:function(lists,page,extra_data){
                this.lists = lists;
                this.page = page;
                this.extra_data = extra_data;
            },

            /* 搜索 */
            search: function () {
                var that = this;

                if(that.form.name !== ''){
                    that.extra_data.name = that.form.name;
                }else {
                    delete that.extra_data.name;
                }

                that.$set(that.page,'is_search',1);
                that.getList(1);

            },

            /* 编辑 */
            edit: function (index, value) {
                tools.router.push({path: '/article/label/Edit', query: {id: this.lists[index].id}});
            },

            /* 删除 */
            del : function (index, value) {
                var that = this;

                layer.confirm('确认删除？', {
                    btn: ['确认', '取消']
                }, function () {
                    tools.alert.loading();
                    tools.ajax({
                        url: '/api/admin/article/tags/' + that.lists[index].id,
                        ajaxData: {},
                        successFun: function (res) {
                            tools.alert.closeLoading();
                            tools.alert.success('删除成功');
                            that.lists.splice(index,1);
                        },
                        errorFun: function (error_data, status, headers, error_obj) {
                            tools.alert.closeLoading();
                            tools.alert.error(error_data.error_msg);
                        },
                        type: 'DELETE'
                    });
                });
            },

            /* 跳转 */
            go: function (url, val) {
                tools.router.push({path: url, query: val});
            }
        },
        watch: {
            extra_data: {
                handler: function (data, oldVal) {
                    var that = this;

                    if(data.name){
                        that.form.name = data.name;
                    }else {
                        that.form.name = '';
                    }

                },
                deep: true
            }
        },
        components: {

        },
        mounted(){
            var that = this;
            if(tools.url.params('name')){
                that.form.name = decodeURI(tools.url.params('name'));
            }else {
                that.form.name = '';
            }
        }
    }
</script>
