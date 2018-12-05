<template>
    <div>
        <div class="layui-form">
            <div class="layui-inline m5">
                <label class="layui-label mr5">选择框</label>
                <div class="layui-input-inline">
                    <select name="quiz">
                        <option value="">请选择问题</option>
                        <option value="你工作的第一个城市">你工作的第一个城市</option>
                        <option value="你的工号">你的工号</option>
                        <option value="你最喜欢的老师">你最喜欢的老师</option>
                    </select>
                </div>
            </div>
            <div class="layui-inline m5">
                <div class="layui-input-inline">
                    <input type="text" name="title" placeholder="请输入标题" class="layui-input">
                </div>
            </div>
            <div class="layui-inline m5">
                <input placeholder="开始日期" class="layui-input" @click="startDate">
            </div>
            <span>-</span>
            <div class="layui-inline m5">
                <input placeholder="结束日期" class="layui-input" @click="endDate">
            </div>
            <div class="layui-inline m5">
                <button class="layui-btn">搜索</button>
            </div>
        </div>

        <base-table
                :title="title"
                :tableData="lists"
                :page="page"
                :todos="todos"
                v-on:testClick="testClick"
                v-on:clickSign="clickSign"
                v-on:getList="getList"
                v-on:getHistoryList="getHistoryList"
                v-on:edit="edit">
        </base-table>
    </div>

</template>


<style>
    .test_class {
        color: #7AEBBE;
    }

    .test_class2 {
        color: #FF6685;
    }

</style>
<script>
    import {baseTable} from 'hanzi-vue-package';
    tools.vue.use(baseTable);

    export default{
        data(){
            return {
                title: [
                    {
                        title: 'id',
                        name: 'goods_id',
                    },
                    {
                        title: '商品名称',
                        name: 'name',
                        class: 'test_class'
                    },
                    {
                        title: '商品名称',
                        name: 'name',
                        class: 'test_class',
                        style: 'background:#a93434'
                    },
                    {
                        title: '颜色',
                        name: 'color',
                        type: 'color_block'
                    },
                    {
                        title: '加入时间',
                        name: 'add_time',
                        type: 'date'
                    },
                    {
                        title: '封面',
                        name: 'cover_img',
                        type: 'img'
                    },
                    {
                        title: '商品编码',
                        name: 'goods_code'
                    },
                    {
                        title: '库存',
                        name: 'goods_number'
                    },
                    {
                        title: '是否新品',
                        name: 'is_new',
                        tran_data: [
                            {key: '1', value: ['', 'fa fa-check green f24', '新品']},
                            {key: '0', value: ['', 'fa fa-close red f24', '']}
                        ],
                        click_event: 'testClick'
                    },
                    {
                        title: '是否上架',
                        name: 'is_bracket',
                        tran_data: [
                            {key: '1', value: ['', 'fa fa-check green f24', '上架中']},
                            {key: '0', value: ['', 'fa fa-close red f24', '下架']}
                        ],
                        click_event: 'testClick'
                    }
                ],
                todos: [
                    {
                        title: '查看',
                        action: 'link',
                        link: 'detail',
                        click_event: ''
                    },
                    {
                        title: '修改',
                        action: 'event',
                        click_event: 'edit'
                    }
                ],
                lists: [],
                page:{},
                extra_data:{

                }
            }
        },
        methods: {
            testClick: function (index) {
                alert('触发了父组件123',index);
            },
            clickSign: function () {
                alert('这是点击了签名');
            },
            edit: function(){
                alert('123');
            },

            /* 获取列表 */
            getList : function(page,page_size){
                var that = this;

                var send_data=that.extra_data || {};
                send_data.page_now=page;
                send_data.page_size=page_size || 15;

                tools.ajax({
                    url: '/v1_0/api/test2/fdksj2342',
                    ajaxData: send_data,
                    successFun: function (res) {
                        that.lists = res.data.lists;
                        that.page = res.data.page;
                    },
                    errorFun: function () {

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
            
            /*日期选择*/
            startDate:function (e) {
                var _this = this;

                if(_this.maxdate == undefined){
                    _this.maxdate = '2099-06-16 23:59:59';
                }

                layui.laydate({
                    elem: e.path[0],
                    min: laydate.now(),
                    max: _this.maxdate,
                    istoday: false,
                    choose: function(datas){
                        _this.mindate = datas;
                    }
                })
            },
            endDate:function (e) {
                var _this = this;

                if(_this.mindate == undefined){
                    _this.mindate = laydate.now();
                }

                layui.laydate({
                    elem: e.path[0],
                    min: _this.mindate,
                    max: '2099-06-16 23:59:59',
                    istoday: false,
                    choose: function(datas){
                        _this.maxdate = datas;
                    }
                })
            }
        },
        watch: {},
        components: {
            baseTable
        },
        mounted(){

            layui.use(['form','laydate'], function() {
                var form = layui.form(); //只有执行了这一步，部分表单元素才会修饰成功
                form.render('select');   //select重新渲染
            });

        }
    }
</script>
