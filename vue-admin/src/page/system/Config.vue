<template>
    <div i="goods_lists">

        <base-table
                class="mt15"
                :title="title"
                :tableData="lists"
                :page="page"
                :todos="todos"
                :extra_data="extra_data"
                v-on:edit="edit"
                v-on:getList="getList"
                v-on:getHistoryList="getHistoryList">
        </base-table>

        <el-dialog :visible.sync="dialogVisible" :title="config_title"  @close="closeDialog">
            <label class="layui-form-label">配置值</label>
            <div class="layui-input-inline" style="width: 80%">
                <input type="text" v-model.trim="form.value" class="layui-input" style="width: 90%">
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss">
    @import "../../assets/sass/common/tool";
    @import "../../assets/sass/common/multiselect";
    @import "/static/fancybox/jquery.fancybox.css";

    [i="goods_lists"]{
        .state-btn{
            color: rgb(0, 79, 246);
            cursor: pointer;

            &:hover{
                opacity: 0.8;
            }
        }
    }
</style>
<script>
    import Vue from 'vue';
    import '../../../static/fancybox/jquery.fancybox.pack.js';
    import Multiselect from 'vue-multiselect';
    import {baseTable} from 'hanzi-vue-package';
    import {DatePicker,Button,Dialog} from 'element-ui';
    Vue.use(DatePicker);
    Vue.use(baseTable);
    Vue.use(Button);
    Vue.use(Dialog);

    export default{
        data(){
            this.crumbs.push({name:'系统设置'},{name:'基础设置'});
            return {
                title:[
                    {
                        title: '配置说明',
                        name: 'desc'
                    },
                    {
                        title: '配置值',
                        name : 'value'
                    },
                    {
                        title: '配置单位',
                        name : 'unit'
                    }
                ],
                todos: [
                    {
                        title: '<i class="el-icon-edit" title="编辑"></i>',
                        action: 'event',
                        click_event: 'edit'
                    }
                ],
                lists : [],
                page : {},
                is_btn: true,
                extra_data : {},
                form:{
                    id: '',
                    value: ''
                },
                is_init: true,
                dialogVisible: false,
                config_title: ''
            }
        },
        methods: {
            /* 获取列表 */
            getList : function(page,page_size){
                var that = this;

                var ajaxData = that.extra_data || {};
                ajaxData.page = page;

                tools.ajax({
                    url: '/api/admin/configs',
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
            },

            /* 获取后退历史列表 */
            getHistoryList:function(lists,page,extra_data){
                this.lists = lists;
                this.page = page;
                this.extra_data = extra_data;
            },

            /* 编辑 */
            edit: function (index, value) {
                var that = this;
                that.dialogVisible = true;
                that.config_title = that.lists[index].desc;
                that.form.id = that.lists[index].id;
                that.form.value = that.lists[index].value;
            },

            /* 关闭弹窗 */
            closeDialog: function() {
                let that = this;
                that.form.id = '';
                that.form.value = '';
            },

            /* 提交修改 */
            submit: function(){
                var that = this;

                var ajaxData = {};
                ajaxData.value = that.form.value;

                tools.ajax({
                    url: '/api/admin/configs/'+that.form.id,
                    ajaxData: ajaxData,
                    successFun: function (res) {
                        that.dialogVisible = false;
                        tools.alert.success('修改成功');
                        that.getList(that.page.current_page);
                    },
                    errorFun: function (error_data, status, headers, error_obj) {
                        tools.alert.error(error_data.error_msg);
                    },
                    type: 'PUT'
                });
            }


        },
        props: ['crumbs'],
        watch: {
        },
        components: {
            Multiselect
        },
        mounted(){
            var that = this;

            if(tools.url.params('title')){
                that.form.title = decodeURI(tools.url.params('title'));
            }else {
                that.form.title = '';
            }
        }
    }
</script>
