<template>
    <div i="role_lists">
        <div class="mb10">
            <button class="layui-btn" @click="go('/admin/role/edit')">添加角色</button>
        </div>
        <base-table
                :title="title"
                :tableData="lists"
                :page="page"
                :todos="todos"
                v-on:edit="edit"
                v-on:del="del"
                v-on:goAdmin="goAdmin"
                v-on:getList="getList"
                v-on:getHistoryList="getHistoryList">
        </base-table>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
    @import "~sass/common/tool";

    [i="role_lists"]{

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
                name:'角色列表'
            });
            return {
                title:[
                    {
                        title: '角色名称',
                        name : 'name'
                    },
                    {
                        title: '角色描述',
                        name : 'description'
                    },
                    {
                        title: '管理员数',
                        name : 'admins_count'
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
                        title: '<i class="el-icon-setting" title="权限管理"></i>',
                        action: 'event',
                        click_event: 'goAdmin',
                        i:'goAdmin'
                    },
                    {
                        title: '<i class="el-icon-edit" title="编辑"></i>',
                        action: 'event',
                        click_event: 'edit',
                        i:'edit'
                    },
                    {
                        title: '<i class="el-icon-delete" title="删除"></i>',
                        action: 'event',
                        click_event: 'del',
                        i:'del'
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
                ajaxData.is_page = 1;

                tools.ajax({
                    url: '/api/admin/auth/roles',
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
            getHistoryList:function(lists,page){
                this.lists = lists;
                this.page = page;
            },

            /* 编辑 */
            edit: function (index, value) {
                tools.router.push({path: '/admin/role/edit', query: {id: this.lists[index].id}});
            },

            /* 权限管理 */
            goAdmin: function (index, value) {
                tools.router.push({path: '/admin/role/admin', query: {id: this.lists[index].id,name:encodeURI(this.lists[index].name)}});
            },

            /* 删除 */
            del : function (index, value) {
                var that = this;

                layer.confirm('确认删除？', {
                    btn: ['确认', '取消']
                }, function () {
                    tools.alert.loading();
                    tools.ajax({
                        url: '/api/admin/auth/roles/' + that.lists[index].id,
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
            var edit = $('[i="edit"]');
            var del = $('[i="del"]');
            var goAdmin = $('[i="goAdmin"]');
            for(var i in this.lists){
                if(this.lists[i].is_update == 0 && edit.length != 0){
                    edit[i].hidden = true;
                }
                if(this.lists[i].is_delete == 0 && del.length != 0){
                    del[i].hidden = true;
                }
                if(this.lists[i].is_manage == 0 && goAdmin.length != 0){
                    goAdmin[i].hidden = true;
                }
                if(this.lists[i].is_update == 0 && this.lists[i].is_delete == 0 && this.lists[i].is_manage == 0 && edit.length != 0) {
                    edit[i].innerHTML = '-';
                    edit[i].className = '';
                    edit[i].style = 'pointer-events: none;';
                    edit[i].hidden = false;
                }
            }
        },
        watch: {},
        components: {

        },
        mounted(){

        }
    }
</script>
