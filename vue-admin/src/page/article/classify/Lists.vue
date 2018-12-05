<template>
    <div i="classify_lists">
        <div class="mb10">
            <button class="layui-btn" @click="go('/article/classify/edit',{parent_id: 0})">添加</button>
        </div>

        <base-table
                :title="title"
                :tableData="lists"
                :page="page"
                :todos="todos"
                v-on:edit="edit"
                v-on:del="del"
                v-on:add="add"
                v-on:getList="getList"
                v-on:getHistoryList="getHistoryList">
        </base-table>

    </div>
</template>
<style rel="stylesheet/scss" lang="scss">
    @import "~sass/common/tool";

    [i="classify_lists"]{
        .hz-base-table thead tr th:first-child{
            text-align: left;
            padding-left: 32px;
        }

        [i="name"]{
            text-align: left;
            padding-left: 32px;
        }
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
                name:'文章分类'
            });
            return {
                title:[
                    {
                        title: '文章分类名称',
                        name : 'name',
                        i: 'name'
                    },
                    {
                        title: '文章数量',
                        name : 'article_num'
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
                    },
                    {
                        title: '<i class="el-icon-plus" title="添加子集"></i>',
                        action: 'event',
                        click_event: 'add',
                        i: 'add'
                    }
                ],
                lists : [],
                page : {},
                extra_data : {}
            }
        },
        props: ['crumbs'],
        computed:{

        },
        methods: {
            /* 获取列表 */
            getList : function(page,page_size){
                var that = this;

                var ajaxData = that.extra_data || {};
                // ajaxData.page = page;

                tools.ajax({
                    url: '/api/admin/article/categorys',
                    ajaxData: ajaxData,
                    successFun: function (res) {
                        that.lists = res.list;
                    },
                    errorFun: function (error_data, status, headers, error_obj) {
                        tools.alert.error(error_data.error_msg);
                    },
                    type: 'GET'
                });

                return true;
            },

            /* 获取后退历史列表 */
            getHistoryList:function(lists,page){
                this.lists = lists;
                this.page = page;
            },

            /* 编辑 */
            edit: function (index, value) {
                tools.router.push({path: '/article/classify/edit', query: {id: this.lists[index].id}});
            },

            /* 添加 */
            add : function (index, value) {
                tools.router.push({path: '/article/classify/edit', query: {parent_id: this.lists[index].id}});
            },

            /* 删除 */
            del : function (index, value) {
                var that = this;

                layer.confirm('确认删除？', {
                    btn: ['确认', '取消']
                }, function () {
                    tools.alert.loading();
                    tools.ajax({
                        url: '/api/admin/article/categorys/' + that.lists[index].id,
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
        beforeUpdate(){
            var add = $('[i="add"]');
            for(var i in this.lists){
                if(this.lists[i].level == 3 && add.length != 0){
                    add[i].style = 'pointer-events: none; opacity: 0;';
                }
            }
        },
        watch: {

        },
        components: {

        },
        mounted(){

        }
    }
</script>
