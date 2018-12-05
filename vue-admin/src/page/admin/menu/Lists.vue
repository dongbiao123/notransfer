<template>
    <div i="menu_lists">
        <div class="mb10">
            <button class="layui-btn" @click="go('/admin/menu/edit')">添加菜单组</button>
        </div>
        <base-table
                :title="title"
                :tableData="lists"
                :page="page"
                :todos="todos"
                v-on:edit="edit"
                v-on:goAdmin="goAdmin"
                v-on:del="del"
                v-on:getList="getList"
                v-on:getHistoryList="getHistoryList">
        </base-table>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
    @import "~sass/common/tool";

    [i="menu_lists"]{

    }
</style>
<script>
    import {baseTable} from 'hanzi-vue-package';
    tools.vue.use(baseTable);
    export default{
        data(){
            this.crumbs.push({
                name:'管理员管理'
            },{
                name:'菜单组列表'
            });
            return {
                title:[
                    {
                        title: '菜单组名称',
                        name : 'name'
                    },
                    {
                        title: '菜单组描述',
                        name: 'description'
                    },
                    {
                        title: '排序',
                        name: 'order'
                    },
                    {
                        title: '创建时间',
                        name: 'created_at',
                        type: 'date'
                    },
                    {
                        title: '更新时间',
                        name: 'updated_at',
                        type: 'date'
                    }
                ],
                todos: [
                    {
                        title: '<i class="el-icon-setting" title="菜单管理"></i>',
                        action: 'event',
                        click_event: 'goAdmin'
                    },
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
                extra_data : {}
            }
        },
        props: ['crumbs'],
        methods: {
            /* 获取列表 */
            getList : function(page,page_size){
                var that = this;

                var ajaxData = that.extra_data || {};
                ajaxData.page = page;

                tools.ajax({
                    url: '/api/admin/auth/menus',
                    ajaxData: ajaxData,
                    successFun: function (res) {
                        that.lists = res.list.data;
                        that.page = res.list;
                    },
                    errorFun: function (error_data, status, headers, error_obj) {
                        //tools.alert.error(error_data.error_msg);
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
                tools.router.push({path: '/admin/menu/edit', query: {id: this.lists[index].id}});
            },

            /* 菜单管理 */
            goAdmin: function (index, value) {
                var that = this;
                that.go('/admin/menu/admin/lists',{'id':that.lists[index].id});
            },

            /* 删除 */
            del : function (index, value) {
                var that = this;

                layer.confirm('确认删除？', {
                    btn: ['确认', '取消']
                }, function () {
                    tools.alert.loading();
                    tools.ajax({
                        url: '/api/admin/auth/menus/' + that.lists[index].id,
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
        watch: {},
        components: {

        },
        mounted(){

        }
    }
</script>
