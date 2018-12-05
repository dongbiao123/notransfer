<template>
    <div i="article_l_lists">
        <div class="layui-form">
            <div class="layui-inline mb10 mr10">
                <span>文章标题：</span>
                <div class="layui-input-inline">
                    <input type="text" v-model.trim="form.title" placeholder="请输入标题" class="layui-input">
                </div>
            </div>
            <div class="layui-inline mb10 mr10">
                <span>文章作者：</span>
                <div class="layui-input-inline">
                    <input type="text" v-model.trim="form.author" placeholder="请输入作者" class="layui-input">
                </div>
            </div>
            <div class="layui-inline mb10 mr10">
                <span>文章分类：</span>
                <div class="layui-input-inline">
                    <multiselect placeholder="请选择分类"
                                 v-model="form.cat_id"
                                 label="name"
                                 track-by="name"
                                 :options="options"
                                 :show-labels="false" >
                                <span slot="noResult">没有结果</span>
                    </multiselect>
                </div>
            </div>
            <div class="layui-inline mb10 mr10">
                <span>文章标签：</span>
                <div class="layui-input-inline" style="max-width: 300px">
                    <multiselect placeholder="请选择标签"
                                 label="name"
                                 track-by="name"
                                 v-model="form.tags"
                                 :options="tags"
                                 :multiple="true"
                                 :searchable="false"
                                 :close-on-select="false"
                                 :clear-on-select="false"
                                 :hide-selected="true"
                                 :show-labels="false" >

                                <span slot="noResult">没有结果</span>
                    </multiselect>
                </div>
            </div>
            <div class="layui-inline mb10 mr20">
                <span>文章是否显示：</span>
                <div class="layui-input-inline" style="max-width: 100px;">
                    <multiselect placeholder="请选择"
                                 v-model="form.is_show"
                                 label="name"
                                 track-by="name"
                                 :options="[{name:'是',is_show:1},{name:'否',is_show:0}]"
                                 :show-labels="false" >
                                <span slot="noResult">没有结果</span>
                    </multiselect>
                </div>
            </div>
            <div class="layui-inline mb10">
                <button class="layui-btn layui-btn-normal" @click="search">
                    <i class="el-icon-search"></i>
                    搜索
                </button>
            </div>
        </div>
        <div class="mb10 mt10">
            <button class="layui-btn" @click="go('/article/lists/edit')">添加文章</button>
        </div>
        <base-table
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
    @import "../../../assets/sass/common/multiselect";

    [i="article_l_lists"]{

    }
</style>
<script>
    import Multiselect from 'vue-multiselect';
    import {baseTable} from 'hanzi-vue-package';
    tools.vue.use(baseTable);
    export default{
        data(){
            this.crumbs.push({name:'文章管理'},{name:'文章列表'});
            return {
                title:[
                    {
                        title: '文章标题',
                        name : 'title'
                    },
                    {
                        title: '文章作者',
                        name: 'author'
                    },
                    {
                        title: '阅读数',
                        name: 'click_num'
                    },
                    {
                        title: '封面url',
                        name: 'cover',
                        type: 'img'
                    },
                    {
                        title: '分类名称',
                        name: 'cat_name'
                    },
                    {
                        title: '标签名',
                        name: 'tags_name'
                    },
                    {
                        title: '是否显示',
                        name: 'is_show',
                        tran_data: [
                            {key: '1', value: ['', 'fa fa-check green f24', '点击关闭']},
                            {key: '0', value: ['', 'fa fa-close red f24', '点击显示']}
                        ],
                        click_event: 'isShowClick'
                    }
                    /*,
                    {
                        title: '创建时间',
                        name: 'created_at',
                        type: 'date'
                    },
                    {
                        title: '修改时间',
                        name: 'updated_at',
                        type: 'date'
                    }*/
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
                is_btn: true,
                extra_data : {},
                form:{
                    title: '',
                    author: '',
                    cat_id: '',
                    is_show: '',
                    tags: ''
                },
                tags:[],
                options:[],
                is_init:true
            }
        },
        methods: {

            /* 获取列表 */
            getList : function(page,page_size){
                var that = this;

                var ajaxData = that.extra_data || {};
                ajaxData.page = page;

                if(that.is_init){
                    ajaxData.article_tag = tools.url.params('article_tag');
                    ajaxData.cat_id = tools.url.params('cat_id');
                    if(tools.url.params('title')){
                        ajaxData.title = decodeURI(tools.url.params('title'));
                    }
                    if(tools.url.params('author')){
                        ajaxData.author = decodeURI(tools.url.params('author'));
                    }
                    ajaxData.is_show = tools.url.params('is_show');
                    that.is_init = false;
                }
                ajaxData = tools.deleteObj(ajaxData);

                tools.ajax({
                    url: '/api/admin/articles',
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

            /* 获取分类列表 */
            getLabelList: function () {
                var that = this,
                    ajaxData = {};

                tools.ajax({
                    url: '/api/admin/article/categorys',
                    ajaxData: ajaxData,
                    successFun: function (res) {
                        if(tools.url.params('cat_id')){
                            for(var i = 0; i < res.list.length; i++){
                                if(tools.url.params('cat_id') === res.list[i].id){
                                    that.form.cat_id = res.list[i];
                                }
                            }
                        }
                        that.options = res.list;
                    },
                    errorFun: function (error_data,status,headers,error_obj) {
                        tools.alert.error(error_data.error_msg);
                    },
                    type: 'GET'
                });
            },

            /* 搜索 */
            search: function () {
                var that= this;

                if(that.form.title !== ''){
                    that.extra_data.title = that.form.title;
                }else {
                    delete that.extra_data.title;
                }

                if(that.form.author !== ''){
                    that.extra_data.author = that.form.author;
                }else {
                    delete that.extra_data.author;
                }

                if(that.form.tags !== '' && that.form.tags.length !== 0){
                    var arr = [];
                    for(var k = 0; k < that.form.tags.length; k++){
                        arr.push(that.form.tags[k].id);
                    }
                    arr = arr.join(",");
                    that.extra_data.article_tag = arr;
                }else {
                    delete that.extra_data.article_tag;
                }

                if(that.form.is_show !== "" && that.form.is_show !== null){
                    that.extra_data.is_show = that.form.is_show.is_show;
                }else {
                    delete that.extra_data.is_show;
                }

                if(that.form.cat_id !== '' && that.form.cat_id !== null){
                    that.extra_data.cat_id = that.form.cat_id.id;
                }else {
                    delete that.extra_data.cat_id;
                }

                that.$set(that.page,'is_search',1);
                that.getList(1);
            },

            /* 获取标签列表 */
            getTagsList: function () {
                var that = this;

                tools.ajax({
                    url: '/api/admin/article/tags',
                    ajaxData: {},
                    successFun: function (res) {

                        if(tools.url.params('article_tag')){
                            var arr = tools.url.params('article_tag').split(',');
                            that.form.tags = [];
                            for(var i = 0; i < res.list.length; i++){
                                for(var k = 0; k < arr.length; k++){
                                    if(res.list[i].id == arr[k]){
                                        that.form.tags.push(res.list[i]);
                                    }
                                }
                            }
                        }

                        that.tags = res.list;
                    },
                    errorFun: function (error_data,status,headers,error_obj) {
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
                tools.router.push({path: '/article/lists/edit', query: {id: this.lists[index].id}});
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

            /* 是否显示 */
            isShowClick: function (index) {
                var that = this;

                if(!that.is_btn){
                    return;
                }

                that.is_btn = false;

                var is_show = null;
                if(that.lists[index].is_show == 1){
                    is_show = 0;
                }else if(that.lists[index].is_show == 0){
                    is_show = 1;
                }

                tools.alert.loading();
                tools.ajax({
                    url: '/api/admin/articles/' + that.lists[index].id,
                    ajaxData: {
                      is_show: is_show
                    },
                    successFun: function (res) {
                        that.is_btn = true;
                        that.lists[index].is_show = is_show;
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
            extra_data: {
                handler: function (data, oldVal) {
                    var that = this;

                    if(data.title){
                        that.form.title = data.title;
                    }else {
                        that.form.title = '';
                    }

                    if(data.author){
                        that.form.author = data.author;
                    }else {
                        that.form.author = '';
                    }

                    if(data.is_show){
                        if(data.is_show == 1){
                            that.form.is_show = {name:'是',is_show:1};
                        }else {
                            that.form.is_show = {name:'否',is_show:0};
                        }
                    }else {
                        that.form.is_show = '';
                    }

                    if(data.cat_id){
                        for(var i = 0; i < that.options.length; i++){
                            if(that.options[i].id === data.cat_id){
                                that.form.cat_id = that.options[i];
                            }
                        }
                    }else {
                        that.form.cat_id = '';
                    }

                    if(data.article_tag){
                        var arr = data.article_tag.split(',');
                        that.form.tags = [];
                        for(var i = 0; i < that.tags.length; i++){
                            for(var k = 0; k < arr.length; k++){
                                if(that.tags[i].id == arr[k]){
                                    that.form.tags.push(that.tags[i]);
                                }
                            }
                        }
                    }else {
                        that.form.tags = '';
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
            that.getLabelList();
            that.getTagsList();

            if(tools.url.params('is_show')){
                if(tools.url.params('is_show') == 1){
                    that.form.is_show = {name:'是',is_show:1};
                }else {
                    that.form.is_show = {name:'否',is_show:0};
                }
            }else {
                that.form.is_show = '';
            }

            if(tools.url.params('title')){
                that.form.title = decodeURI(tools.url.params('title'));
            }else {
                that.form.title = '';
            }

            if(tools.url.params('author')){
                that.form.author = decodeURI(tools.url.params('author'));
            }else {
                that.form.author = '';
            }
        }
    }
</script>
