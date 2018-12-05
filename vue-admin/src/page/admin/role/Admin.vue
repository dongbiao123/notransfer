<template>
    <div i="r_admin">
        <div class="cont-wrap mt30" v-for="(info,index) in lists">
            <div class="head-box pl20 pr20 clearfix">
                <span class="gray3">{{info.name}}</span>
                <div class="btn-wrap pull-right">
                    <button class="btn" @click="select(index,true)">全选</button>
                    <button class="btn ml10" @click="select(index,false)">取消所有</button>
                </div>
            </div>
            <div class="con-box">
                <div class="con clearfix">
                    <div class="lab pull-left" v-for="(data,index) in info.child">
                        <label class="pl15">
                            <input type="checkbox" :disabled="isBtn" v-model="data.is_opt" class="my-checkbox" @change="check(index,info.id,data.is_opt)">
                            <span style="cursor: pointer; position: relative;top: 1px;">{{data.name}}</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <!--<div class="pt30 text-center">
            <button class="layui-btn" @click="sub">提交</button>
        </div>-->
    </div>
</template>
<style rel="stylesheet/scss" lang="scss">
    @import "~sass/common/tool";

    [i="r_admin"]{

        .my-checkbox {
            @include checkbox_core(#1e9fff,18px, 2px);
        }

        .cont-wrap{
            max-width: 1100px;

            .head-box{
                height: 52px;
                line-height: 52px;
                background: #e4e4e4;

                .btn-wrap{
                    .btn{
                        color: #1e9fff;
                    }
                }
            }
            .con-box{
                background: #f2f2f2;
                padding: 40px;

                .con{
                    width: 100%;
                    background: #fff;

                    .lab{
                        width: 33.333333333%;
                        min-width: 200px;
                        height: 40px;
                        line-height: 40px;
                    }
                }
            }
        }
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
                name:'角色列表',
                url: '/admin/role/lists'
            },{
                name:'角色权限：' + decodeURI(decodeURI(tools.url.params('name')))
            });
            return {
                name: decodeURI(decodeURI(tools.url.params('name'))),
                id: tools.url.params('id'),
                lists:[],
                isBtn:false //是否禁止点击
            }
        },
        props: ['crumbs'],
        methods: {
            /* 获取数据 */
            getData: function () {
                var that = this,
                    ajaxData = {};

                ajaxData.admin_role_id = that.id;

                tools.ajax({
                    url: '/api/admin/auth/role/permissions',
                    ajaxData: ajaxData,
                    successFun: function (res) {
                        for(var i in res.list){
                            res.list[i].is_select = false;

                            for(var k in res.list[i].child){
                                if(res.list[i].child[k].is_opt == 0){
                                    res.list[i].child[k].is_opt = false;
                                }else {
                                    res.list[i].child[k].is_opt = true;
                                }
                            }
                        }
                        that.lists = res.list;
                    },
                    errorFun: function (error_data, status, headers, error_obj) {
                        tools.alert.error(error_data.error_msg);
                        that.isShow = true;
                    },
                    type: 'GET'
                });
            },

            /* 单选 */
            check: function (index,parent_id,type) {
                var that = this;

                for(var i in that.lists){
                    if(that.lists[i].id == parent_id){
                        //that.lists[i].child[index].is_opt = !type;
                        that.putData(i,index);
                    }
                }
            },

            /* 全选 */
            select: function (index,type) {
                var that = this;

                if(that.isBtn){
                    return;
                }

                for(var i in that.lists[index].child){
                    that.lists[index].child[i].is_opt = type;
                }
                that.putData(index);
            },

            /* 请求接口 */
            putData:function (index,child_index) {
                var that = this,
                    ajaxData = {};

                that.isBtn = true;

                var arr = [];

                if(child_index || child_index == 0){

                    var obj = {};
                    var is_select = 0;

                    if(that.lists[index].child[child_index].is_opt){
                        is_select = 1;
                    }

                    obj.admin_permission_id = that.lists[index].child[child_index].id;
                    ajaxData.is_opt = is_select;

                    arr.push(obj);

                }else {

                    for(var k in that.lists[index].child){

                        var objs = {};
                        var is_selects = 1;

                        objs.admin_permission_id = that.lists[index].child[k].id;

                        if(!that.lists[index].child[k].is_opt){
                            is_selects = 0;
                        }

                        ajaxData.is_opt = is_selects;

                        arr.push(objs);

                    }

                }

                ajaxData.list = arr;

                if(ajaxData.list.length === 0){
                    return;
                }

                tools.ajax({
                    url: '/api/admin/auth/role/permissions/' + that.id,
                    ajaxData: ajaxData,
                    successFun: function (res) {
                        that.isBtn = false;
                        that.isError = false;
                    },
                    errorFun: function (error_data,status,headers,error_obj) {
                        that.isBtn = false;
                        that.isError = true;
                        tools.alert.error(error_data.error_msg);
                    },
                    type: 'PUT'
                });
            },

            /* 提交 */
            /*sub: function () {
                var that = this,
                    ajaxData = {};

                var arr = [];

                for(var i in that.lists){
                    var obj = {};
                    obj.admin_permission_id = that.lists[i].id;

                    obj.child = [];

                    for(var k in that.lists[i].child){
                        var is_select = 0;

                        if(that.lists[i].child[k].is_opt){
                            is_select = 1;
                        }

                        obj.child.push({is_opt:is_select});/!*,id:that.lists[i].child[k].id*!/
                    }

                    arr.push(obj);
                }

                ajaxData.list = arr;

                layer.confirm('确认提交？',{
                    btn: ['确认', '取消']
                },function () {
                    tools.alert.loading();
                    tools.ajax({
                        url: '/api/admin/auth/role/permissions/' + that.id,
                        ajaxData: ajaxData,
                        successFun: function (res) {
                            tools.alert.closeLoading();
                            tools.alert.success('提交成功');
                            tools.router.push('/role/lists');
                        },
                        errorFun: function (error_data,status,headers,error_obj) {
                            tools.alert.closeLoading();
                            tools.alert.error(error_data.error_msg);
                        },
                        type: 'PUT'
                    });
                });
            },*/

            /* 跳转 */
            go: function (url, val) {
                tools.router.push({path: url, query: val});
            }
        },
        watch: {},
        components: {

        },
        mounted(){
            var that = this;

            that.getData();
        }
    }
</script>
