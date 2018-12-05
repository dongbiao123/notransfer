<template>
    <div i="user_lists">
        <div class="layui-form">
            <div class="layui-inline mb10 mr10">
                <span>用户名：</span>
                <div class="layui-input-inline">
                    <input type="text" v-model.trim="form.username" placeholder="请输入用户名" class="layui-input">
                </div>
            </div>
            <div class="layui-inline mb10 mr10">
                <span>邮箱：</span>
                <div class="layui-input-inline">
                    <input type="text" v-model.trim="form.email" placeholder="请输入邮箱" class="layui-input">
                </div>
            </div>
            <div class="layui-inline mb10 mr10">
                <span>手机：</span>
                <div class="layui-input-inline">
                    <input type="text" v-model.trim="form.phone" placeholder="请输入手机" class="layui-input">
                </div>
            </div>
            <div class="layui-inline mb10 mr10">
                <span>状态：</span>
                <div class="layui-input-inline" style="max-width: 100px;">
                    <multiselect placeholder="请选择"
                                 v-model="form.status"
                                 label="name"
                                 track-by="name"
                                 :options="[{name:'正常',status:1},{name:'禁用',status:0}]"
                                 :show-labels="false" >
                                <span slot="noResult">没有结果</span>
                    </multiselect>
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
        <!-- <div class="mb10 mt15">
            <button class="layui-btn" @click="go('/article/lists/edit')">添加文章</button>
        </div> -->
        <base-table
                class="mt15"
                :title="title"
                :tableData="lists"
                :page="page"
                :todos="todos"
                :extra_data="extra_data"
                v-on:edit="edit"
                v-on:del="del"
                v-on:isShowClick="isShowClick"
                v-on:getList="getList"
                v-on:getHistoryList="getHistoryList">
        </base-table>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss">
    @import "~sass/common/tool";
    @import "../../assets/sass/common/multiselect";

    [i="user_lists"]{

    }
</style>
<script>
    import Multiselect from 'vue-multiselect';
    import {baseTable} from 'hanzi-vue-package';
    import {DatePicker} from 'element-ui';
    tools.vue.use(DatePicker);
    tools.vue.use(baseTable);
    export default{
        data(){
            this.crumbs.push({name:'会员管理'},{name:'会员列表'});
            return {
                title:[
                    {
                        title: '头像',
                        name: 'headimg',
                        type: 'img'
                    },
                    {
                        title: '用户名',
                        name : 'username'
                    },
                    {
                        title: '手机',
                        name: 'phone',
                        type: 'zero'
                    },
                    {
                        title: '邮箱',
                        name: 'email'
                    },
                    {
                        title: '最后登录IP',
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
                    {
                        title: '状态',
                        name: 'status',
                        tran_data: [
                            {key: '1', value: ['正常', 'green', '点击禁用']},
                            {key: '0', value: ['禁用', 'red', '点击启用']}
                        ],
                        click_event: 'isShowClick'
                    }
                ],
                todos: [
                    {
                        title: '<i class="el-icon-search" title="查看"></i>',
                        action: 'event',
                        click_event: 'edit'
                    },
                    // {
                    //     title: '<i class="el-icon-delete" title="删除"></i>',
                    //     action: 'event',
                    //     click_event: 'del'
                    // }
                ],
                lists : [],
                page : {},
                is_btn: true,
                extra_data : {},
                form:{
                    username: '',
                    email: '',
                    phone: '',
                    status: '',
                    date:[null,null]
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
        methods: {
            /* 获取列表 */
            getList : function(page,page_size){
                var that = this;

                var ajaxData = that.extra_data || {};
                ajaxData.page = page;

                if(that.is_init){
                    if(tools.url.params('username')){
                        ajaxData.username = decodeURI(tools.url.params('username'));
                    }
                    if(tools.url.params('email')){
                        ajaxData.email = decodeURI(tools.url.params('email'));
                    }
                    if(tools.url.params('phone')){
                        ajaxData.phone = decodeURI(tools.url.params('phone'));
                    }
                    if(tools.url.params('status')){
                        ajaxData.status = decodeURI(tools.url.params('status'));
                    }
                    if(tools.url.params('start_time') && tools.url.params('end_time')){
                        ajaxData.start_time = decodeURI(tools.url.params('start_time'));
                        ajaxData.end_time = decodeURI(tools.url.params('end_time'));
                    }
                    that.is_init = false;
                }

                tools.ajax({
                    url: '/api/admin/users',
                    ajaxData: ajaxData,
                    successFun: function (res) {
                        that.lists = res.list.data;
                        that.page = res.list;
                    },
                    errorFun: function (error_data, status, headers, error_obj) {
                        if(error_data.error_code === 'phone_ERROR'){
                            tools.alert.error('手机号码格式错误');
                            return;
                        }
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

                if(that.form.username != ''){
                    that.extra_data.username = that.form.username;
                }else {
                    delete that.extra_data.username;
                }

                if(that.form.email != ''){
                    that.extra_data.email = that.form.email;
                }else {
                    delete that.extra_data.email;
                }

                if(that.form.phone != ''){
                    that.extra_data.phone = that.form.phone;
                }else {
                    delete that.extra_data.phone;
                }

                if(that.form.status != '' && that.form.status != null){
                    that.extra_data.status = that.form.status.status;
                }else {
                    delete that.extra_data.status;
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

                that.$set(that.page,'is_search',1);
                that.getList(1);

            },

            /* 编辑 */
            edit: function (index, value) {
                tools.router.push({path: '/user/edit', query: {id: this.lists[index].id}});
            },

            /* 删除 */
            del : function (index, value) {
                var that = this;

                layer.confirm('确认删除？', {
                    btn: ['确认', '取消']
                }, function () {
                    tools.alert.loading();
                    tools.ajax({
                        url: '/api/admin/articles/' + that.lists[index].id,
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

            /* 改变状态 */
            isShowClick: function (index) {
                var that = this;

                if(!that.is_btn){
                    return;
                }

                that.is_btn = false;

                var status = null;
                if(that.lists[index].status == 1){
                    status = 0;
                }else if(that.lists[index].status == 0){
                    status = 1;
                }

                tools.alert.loading();
                tools.ajax({
                    url: '/api/admin/users/' + that.lists[index].id,
                    ajaxData: {
                      status: status
                    },
                    successFun: function (res) {
                        that.is_btn = true;
                        that.lists[index].status = status;
                        tools.alert.closeLoading();
                    },
                    errorFun: function (error_data, status, headers, error_obj) {
                        tools.alert.closeLoading();
                        that.is_btn = true;
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
        props: ['crumbs'],
        watch: {
            from: {
                handler: function (data, oldVal) {
                    console.log(data,2222)

                },
                deep: true
            },
            extra_data: {
                handler: function (data, oldVal) {
                    var that = this;

                    if(data.username){
                        that.form.username = data.username;
                    }else {
                        that.form.username = '';
                    }

                    if(data.email){
                        that.form.email = data.email;
                    }else {
                        that.form.email = '';
                    }

                    if(data.phone){
                        that.form.phone = data.phone;
                    }else {
                        that.form.phone = '';
                    }

                    if(data.status){
                        if(data.status == 1){
                            that.form.status = {status: 1, name: '正常'};
                        }else {
                            that.form.status = {status: 0, name: '禁用'};
                        }
                    }else {
                        that.form.status = '';
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
            Multiselect
        },
        mounted(){
            var that = this;

            if(tools.url.params('username')){
                that.form.username = decodeURI(tools.url.params('username'));
            }else {
                that.form.username = '';
            }
            if(tools.url.params('email')){
                that.form.email = decodeURI(tools.url.params('email'));
            }else {
                that.form.email = '';
            }
            if(tools.url.params('phone')){
                that.form.phone = decodeURI(tools.url.params('phone'));
            }else {
                that.form.phone = '';
            }
            if(tools.url.params('start_time') && tools.url.params('end_time')){
                var a = new Date(parseInt(tools.url.params('start_time'))*1000);
                var b = new Date(parseInt(tools.url.params('end_time'))*1000);
                that.form.date = [a,b];
            }else {
                that.form.date = [null,null];
            }
            if(tools.url.params('status')){
                if(decodeURI(tools.url.params('status')) == 1){
                    that.form.status = {status:1,name:'正常'};
                }else {
                    that.form.status = {status:0,name:'禁用'};
                }
            }else {
                that.form.status = '';
            }
        }
    }
</script>
