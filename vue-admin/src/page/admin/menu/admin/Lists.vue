<template>
    <div i="menu_admin_lists">
        <div class="mb10">
            <button class="layui-btn"
                    @click="go('/admin/menu/admin/edit',{'parent_id':id,'name':encodeURI(data.name)})">
                添加菜单 到 {{data.name}}
            </button>
        </div>
        <base-table
                :title="title"
                :tableData="lists"
                :page="page"
                :todos="todos"
                v-on:edit="edit"
                v-on:del="del"
                v-on:binding="binding"
                v-on:getList="getList"
                v-on:getHistoryList="getHistoryList">
        </base-table>

        <div id="popup" class="dn">
            <div class="border-table-wrap" v-if="isShow">
                <table class="table table-bordered">
                    <tbody>
                    <tr>
                        <td width="20%">
                            一级菜单
                        </td>
                        <td>
                            二级菜单
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <label>
                                <input type="checkbox" class="my-checkbox" v-model="isSelect" @click="select(isSelect)">
                                全选
                            </label>
                        </td>
                    </tr>
                    <tr v-for="(menu,index) in menu_list">
                        <td>
                            <label>
                                <input type="checkbox" class="my-checkbox" v-model="menu.isCheck"
                                       @click="check(index,menu.isCheck)">
                                <span>{{menu.name}}</span>
                            </label>
                        </td>
                        <td>
                            <label class="sty" v-for="(child,index) in menu.child">
                                <input type="checkbox" class="my-checkbox" v-model="child.is_opt" :true-value="1"
                                       :false-value="0" @click="second(index,child.parent_id,child.is_opt)">
                                <span>{{child.name}}</span>
                            </label>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
    @import "~sass/common/tool";

    #popup {
        padding: 20px;

        .table {
            width: 100%;

            tr {
                td {
                    padding: 10px;
                    text-align: left !important;
                    border: 1px solid #e2e2e2;

                    .sty {
                        margin-left: 10px;

                        &:first-child {
                            margin-left: 0;
                        }
                    }
                }
            }

        }
        .my-checkbox {
            -webkit-appearance: none;
            position: relative;
            width: 16px;
            height: 16px;
            border: solid 1px #ccc;
            border-radius: 1px;
            background-clip: padding-box;
            display: inline-block;
            cursor: pointer;
        }

        .my-checkbox:checked {
            background-color: #1e9fff;
            border-color: #1e9fff;
        }

        input.my-checkbox[type='checkbox'] {
            vertical-align: middle;
        }

        .my-checkbox:checked::before {
            position: absolute;
            display: inline-block;
            right: 50%;
            bottom: 50%;
            transform: translate(50%, 50%);
            font-family: "Microsoft Yahei";
            content: "√";
            color: rgb(255, 255, 255);
            font-size: 14px;
            font-weight: 600;
        }

    }

    [i="p_lists"] {

    }
</style>
<script>
    import {baseTable} from 'hanzi-vue-package';
    tools.vue.use(baseTable);
    export default{
        data(){
            return {
                id: tools.url.params('id'),
                data: {},
                title: [
                    {
                        title: '菜单名称',
                        name: 'name'
                    },
                    {
                        title: '菜单描述',
                        name: 'description'
                    },
                    {
                        title: 'url',
                        name: 'url'
                    },
                    {
                        title: '排序',
                        name: 'order'
                    },
                    // {
                    //     title: '图标',
                    //     name: 'icon'
                    // },
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
                lists: [],
                page: {},
                extra_data: {},
                menu_list: [],
                isShow: false,
                isSelect: false,
                isOneRender:true
            }
        },
        props: ['crumbs'],
        methods: {
            /* 获取列表 */
            getList: function (page, page_size) {
                var that = this;

                var ajaxData = that.extra_data || {};
                ajaxData.page = page;
                ajaxData.menu_id = that.id;

                tools.ajax({
                    url: '/api/admin/auth/menus',
                    ajaxData: ajaxData,
                    successFun: function (res) {
                        that.lists = res.list.data;
                        that.data = res.data;
                        that.page = res.list;

                        if(that.isOneRender){
                            that.crumbs.push({
                                name:'管理员管理'
                            },{
                                name:'菜单组列表',
                                url:'/admin/menu/lists'
                            },{
                                name:'菜单组：' + res.data.name
                            });
                            that.isOneRender = false;
                        }
                    },
                    errorFun: function (error_data, status, headers, error_obj) {
                        tools.alert.error(error_data.error_msg);
                    },
                    type: 'GET'
                });

                return true;
            },

            /* 获取后退历史列表 */
            getHistoryList: function (lists, page) {
                this.lists = Lists;
                this.page = page;
            },

            /* 编辑 */
            edit: function (index, value) {
                tools.router.push({
                    path: '/admin/menu/admin/edit',
                    query: {id: this.lists[index].id, parent_id: this.id, name: encodeURI(this.data.name)}
                });
            },

            /* 删除 */
            del: function (index, value) {
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

            /* 绑定到菜单 */
            binding: function (index, value) {
                var that = this;

                that.index = index;

                that.isShow = false;

                tools.alert.loading();
                tools.alert.layer({
                    title: '绑定到菜单',
                    area: ['720px', '620px'], //宽高
                    content: $('#popup'),
                    success: function () {
                        tools.ajax({
                            url: '/api/admin/auth/menu/menus',
                            ajaxData: {
                                admin_menu_id: that.lists[index].id
                            },
                            successFun: function (res) {
                                that.isSelect = true;
                                var arr = [];
                                for (var i in res.list) {
                                    res.list[i].isCheck = true;
                                    for (var k in res.list[i].child) {
                                        var obj = {}
                                        obj.admin_menu_id = res.list[i].child[k].id;
                                        obj.is_opt = res.list[i].child[k].is_opt;
                                        arr.push(obj);

                                        if (!res.list[i].child[k].is_opt) {
                                            res.list[i].isCheck = false;
                                        }
                                    }

                                    if (!res.list[i].isCheck) {
                                        that.isSelect = false;
                                    }
                                }
                                that.oldObj = $.extend(true, [], arr);
                                that.isShow = true;
                                tools.alert.closeLoading();
                                that.menu_list = res.list;
                            },
                            errorFun: function (error_data, status, headers, error_obj) {
                                that.isShow = true;
                                tools.alert.closeLoading();
                                tools.alert.error(error_data.error_msg);
                            },
                            type: 'GET'
                        });
                    },
                    cancel: function () {

                    }
                });
            },

            /* 选择一级菜单 */
            check: function (index, type) {
                var that = this;
                that.menu_list[index].isCheck = !type;

                for (var i in that.menu_list[index].child) {
                    if (that.menu_list[index].isCheck) {
                        that.menu_list[index].child[i].is_opt = 1;
                    } else {
                        that.menu_list[index].child[i].is_opt = 0;
                    }
                }

                that.judgeCheck();

                if (that.menu_list[index].isCheck) {
                    that.putData(1);
                } else {
                    that.putData(0);
                }
            },

            /* 判断是否选中 */
            judgeCheck: function () {
                var that = this;

                that.isSelect = true;

                for (var i in that.menu_list) {

                    that.menu_list[i].isCheck = true;

                    for (var k in that.menu_list[i].child) {
                        if (that.menu_list[i].child[k].is_opt == 0) {
                            that.menu_list[i].isCheck = false;
                        }
                    }

                    if (!that.menu_list[i].isCheck) {
                        that.isSelect = false;
                    }

                }
            },

            /* 选择二级菜单 */
            second: function (index, parent_id, type) {
                var that = this;

                for (var i in that.menu_list) {
                    if (that.menu_list[i].id == parent_id) {
                        if (type == 0) {
                            that.menu_list[i].child[index].is_opt = 1;
                            that.putData(1);
                        } else if (type == 1) {
                            that.menu_list[i].child[index].is_opt = 0;
                            that.putData(0);
                        }
                    }
                }

                that.judgeCheck();
            },

            /* 全选 */
            select: function (type) {
                var that = this;
                that.isSelect = !type;

                for (var i in that.menu_list) {
                    for (var k in that.menu_list[i].child) {
                        if (that.isSelect) {
                            that.menu_list[i].child[k].is_opt = 1;
                        } else {
                            that.menu_list[i].child[k].is_opt = 0;
                        }
                    }
                }

                that.judgeCheck();

                if (that.isSelect) {
                    that.putData(1);
                } else {
                    that.putData(0);
                }

            },

            /* 请求接口提交选中项 */
            putData: function (type) {
                var that = this,
                        ajaxData = {};

                var arr = [],
                        oldObj = [];

                for (var i in that.menu_list) {
                    for (var k in that.menu_list[i].child) {
                        var obj = {};
                        obj.admin_menu_id = that.menu_list[i].child[k].id;
                        obj.is_opt = that.menu_list[i].child[k].is_opt;
                        oldObj.push(obj);

                        if (type == 0 && that.menu_list[i].child[k].is_opt == 0) {
                            arr.push(obj);
                        }
                        if (type == 1 && that.menu_list[i].child[k].is_opt == 1) {
                            arr.push(obj);
                        }
                    }
                }

                var array = [];
                for (var z in that.oldObj) {
                    for (var v in arr) {
                        if (that.oldObj[z].is_opt != arr[v].is_opt && that.oldObj[z].admin_menu_id == arr[v].admin_menu_id) {
                            array.push({admin_menu_id: arr[v].admin_menu_id})
                        }
                    }
                }

                ajaxData.is_opt = type;
                ajaxData.list = array;

                tools.alert.loading();
                tools.ajax({
                    url: '/api/admin/auth/menus/' + that.lists[that.index].id,
                    ajaxData: ajaxData,
                    successFun: function (res) {
                        that.oldObj = oldObj;
                        tools.alert.closeLoading();
                    },
                    errorFun: function (error_data, status, headers, error_obj) {
                        tools.alert.closeLoading();
                        tools.alert.error(error_data.error_msg);
                    },
                    type: 'PUT'
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
