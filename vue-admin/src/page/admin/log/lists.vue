<template>
    <div i="log_lists">
        <div class="layui-form">
            <div class="layui-inline mb10 mr10">
                <span>管理员名称：</span>
                <div class="layui-input-inline">
                    <input type="text" v-model="form.admin_name" placeholder="请输入管理员名称" class="layui-input">
                </div>
            </div>
            <div class="layui-inline mb10 mr10">
                <span>内容：</span>
                <div class="layui-input-inline">
                    <input type="text" v-model="form.keyword" placeholder="请输入内容" class="layui-input">
                </div>
            </div>
            <div class="layui-inline mb10 mr10">
                <span>手机：</span>
                <div class="layui-input-inline">
                    <input type="text" v-model="form.phone" placeholder="请输入手机" class="layui-input">
                </div>
            </div>
            <div class="layui-inline mb10 mr20">
                <span>添加时间：</span>
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
                :extra_data="extra_data"
                v-on:getList="getList"
                v-on:getHistoryList="getHistoryList">
        </base-table>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss">
    @import "~sass/common/tool";
    @import "../../../assets/sass/common/multiselect";

    [i="log_lists"]{
        [i="tab_data"]{
            width: 350px;
            min-width: 100px;
            word-break:break-all;
            word-wrap: break-word;
        }
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
            this.crumbs.push({name:'管理员管理'},{name:'管理员操作日志'});
            return {
                title:[
                    {
                        title: '管理员名称',
                        name: 'name'
                    },
                    {
                        title: '手机号码',
                        name: 'phone',
                        type: 'zero'
                    },
                    {
                        title: 'ip',
                        name : 'ip'
                    },
                    {
                        title: '内容',
                        name: 'content'
                    },
                    {
                        title: '代码',
                        name: 'code'
                    },
                    {
                        title: '数据',
                        name: 'data',
                        i: 'tab_data'
                    },
                    {
                        title: '添加时间',
                        name: 'created_at',
                        type: 'date'
                    }
                ],
                lists : [],
                page : {},
                is_btn: true,
                extra_data : {},
                form:{
                    admin_name: '',
                    keyword: '',
                    phone: '',
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
                    if(tools.url.params('admin_name')){
                        ajaxData.admin_name = decodeURI(tools.url.params('admin_name'));
                    }
                    if(tools.url.params('keyword')){
                        ajaxData.keyword = decodeURI(tools.url.params('keyword'));
                    }
                    if(tools.url.params('phone')){
                        ajaxData.phone = decodeURI(tools.url.params('phone'));
                    }
                    if(tools.url.params('start_time') && tools.url.params('end_time')){
                        ajaxData.start_time = decodeURI(tools.url.params('start_time'));
                        ajaxData.end_time = decodeURI(tools.url.params('end_time'));
                    }
                    that.is_init = false;
                }

                tools.ajax({
                    url: '/api/admin/log/action',
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

                if(that.form.admin_name != ''){
                    that.extra_data.admin_name = that.form.admin_name;
                }else {
                    delete that.extra_data.admin_name;
                }

                if(that.form.keyword != ''){
                    that.extra_data.keyword = that.form.keyword;
                }else {
                    delete that.extra_data.keyword;
                }

                if(that.form.phone != ''){
                    that.extra_data.phone = that.form.phone;
                }else {
                    delete that.extra_data.phone;
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

            /* 跳转 */
            go: function (url, val) {
                tools.router.push({path: url, query: val});
            }
        },
        props: ['crumbs'],
        watch: {
            extra_data: {
                handler: function (data, oldVal) {
                    var that = this;

                    if(data.admin_name){
                        that.form.admin_name = data.admin_name;
                    }else {
                        that.form.admin_name = '';
                    }

                    if(data.keyword){
                        that.form.keyword = data.keyword;
                    }else {
                        that.form.keyword = '';
                    }

                    if(data.phone){
                        that.form.phone = data.phone;
                    }else {
                        that.form.phone = '';
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

            if(tools.url.params('admin_name')){
                that.form.admin_name = decodeURI(tools.url.params('admin_name'));
            }else {
                that.form.admin_name = '';
            }
            if(tools.url.params('keyword')){
                that.form.keyword = decodeURI(tools.url.params('keyword'));
            }else {
                that.form.keyword = '';
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
        }
    }
</script>
