<template>
    <div i="pt_lists">
        <div class="layui-form">
            <div class="layui-inline mb10 mr10">
                <span>管理员名称：</span>
                <div class="layui-input-inline">
                    <input type="text" v-model="form.name" placeholder="请输入管理员名称" class="layui-input">
                </div>
            </div>
            <div class="layui-inline mb10 mr20">
                <span>创建时间：</span>
                <div class="layui-input-inline">
                    <el-date-picker
                          v-model="form.date"
                          type="daterange"
                          align="right"
                          range-separator=" to "
                          placeholder="选择日期范围"
                          :picker-options="pickerOptions">
                    </el-date-picker>
                </div>
            </div>
            <div class="layui-inline mb10">
                <button class="layui-btn layui-btn-normal" @click="search">
                    <i class="el-icon-search"></i>
                    搜索
                </button>
            </div>
        </div>
        <div class="mb10 mt15">
            <button class="layui-btn" @click="go('/admin/lists/add')">添加管理员</button>
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
<style rel="stylesheet/scss" lang="scss">
    @import "~sass/common/tool";

    [i="pt_lists"]{
        // .hz-base-table tbody tr td .img-box{
        //     @include rounded(100%);
        //     overflow: hidden;
        //     padding: 0;
        //     width: 50px;
        //     height: 50px;
        //
        //     img{
        //         height: 100%;
        //     }
        // }
    }
</style>
<script>
    import {baseTable} from 'hanzi-vue-package';
    import {DatePicker} from 'element-ui';
    tools.vue.use(baseTable);
    tools.vue.use(DatePicker);
    export default{
        data(){
            this.crumbs.push({name:'管理员管理'},{name:'管理员列表'});
            return {
                title:[
                    {
                        title: '管理员头像',
                        name: 'headimg',
                        type: 'img'
                    },
                    {
                        title: '管理员名称',
                        name : 'name'
                    },
                    {
                        title: '手机',
                        name : 'phone',
                        type:'zero'
                    },
                    {
                        title: '管理员账号',
                        name : 'account'
                    },
                    {
                        title: '管理员角色',
                        name: 'role_string'
                    },
                    {
                        title: '最后登录ip',
                        name: 'last_login_ip'
                    },
                    {
                        title: '最后登录时间',
                        name: 'last_login_time',
                        type: 'date'
                    },
                    {
                        title: '创建时间',
                        name: 'created_at',
                        type: 'date'
                    },
                    // {
                    //     title: '修改时间',
                    //     name: 'updated_at',
                    //     type: 'date'
                    // }
                ],
                todos: [
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
                extra_data : {},
                form:{
                    name: '',
                    date: [null,null]
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                          const end = new Date();
                          const start = new Date();
                          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                          picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                          const end = new Date();
                          const start = new Date();
                          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                          picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                          const end = new Date();
                          const start = new Date();
                          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                          picker.$emit('pick', [start, end]);
                        }
                    }],
                    onPick: function (obj) {
                        if(obj.maxDate){
                            var end = obj.maxDate.getTime() + 3600 * 1000 * 24 - 1;
                            obj.maxDate = new Date(end);
                        }
                    }
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

                if(that.is_init){
                    if(tools.url.params('name')){
                        ajaxData.name = decodeURI(tools.url.params('name'));
                    }

                    if(that.form.date === undefined){
                        delete that.extra_data.start_time;
                        delete that.extra_data.end_time;
                    }else {
                        if(that.form.date[0] == null){
                            delete that.extra_data.start_time;
                        }else {
                            that.extra_data.start_time = parseInt(that.form.date[0].getTime() / 1000);
                        }
                        if(that.form.date[1] == null){
                            delete that.extra_data.end_time;
                        }else {
                            that.extra_data.end_time = parseInt(that.form.date[1].getTime() / 1000);
                        }
                    }

                    that.is_init = false;
                }

                tools.ajax({
                    url: '/api/admin/auth/users',
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

                if(that.form.date[0] == null){
                    delete that.extra_data.start_time;
                }else {
                    that.extra_data.start_time = parseInt(that.form.date[0].getTime() / 1000);
                }
                if(that.form.date[1] == null){
                    delete that.extra_data.end_time;
                }else {
                    that.extra_data.end_time = parseInt(that.form.date[1].getTime() / 1000);
                }
                if(that.form.name == ''){
                    delete that.extra_data.name;
                }else {
                    that.extra_data.name = that.form.name;
                }

                that.$set(that.page,'is_search',1);
                that.getList(1);

            },

            /* 编辑 */
            edit: function (index, value) {
                tools.router.push({path: '/admin/lists/edit', query: {id: this.lists[index].id}});
            },

            /* 删除 */
            del : function (index, value) {
                var that = this;

                layer.confirm('确认删除？', {
                    btn: ['确认', '取消']
                }, function () {
                    tools.alert.loading();
                    tools.ajax({
                        url: '/api/admin/auth/users/' + that.lists[index].id,
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
            //var goAdmin = $('[i="goAdmin"]');

            for(var i in this.lists){

                if(this.lists[i].is_can_update == 0 && edit.length != 0){
                    edit[i].style = 'pointer-events: none; opacity: 0;';
                }
                if(this.lists[i].is_can_delete == 0 && del.length != 0){
                    del[i].style = 'pointer-events: none; opacity: 0;';
                }
                if(this.lists[i].is_can_update == 0 && this.lists[i].is_can_delete == 0 && edit.length != 0) {
                    edit[i].innerHTML = '-';
                    edit[i].className = '';
                    edit[i].style = 'pointer-events: none;';
                    edit[i].hidden = false;
                }
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

                    if(data.start_time && data.end_time){
                        var a = new Date(parseInt(data.start_time)*1000);
                        var b = new Date(parseInt(data.end_time)*1000);

                        that.form.date = [a,b];
                    }else {
                        that.form.date = [null,null];
                    }

                },
                deep: true
            }
        },
        components: {

        },
        mounted(){
            var that = this;
            if(tools.url.params('start_time') && tools.url.params('end_time')){
                var a = new Date(parseInt(tools.url.params('start_time'))*1000);
                var b = new Date(parseInt(tools.url.params('end_time'))*1000);
                that.form.date = [a,b];
            }else {
                that.form.date = [null,null];
            }
            if(tools.url.params('name')){
                that.form.name = decodeURI(tools.url.params('name'));
            }else {
                that.form.name = '';
            }
        }
    }
</script>
