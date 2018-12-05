<template>
    <div id="app" :class="{'site-mobile':isNavBlock}" v-cloak v-show="isShow">

        <div v-if="!isfullScreen" class="app-panels clearfix">
            <div class="app-panel-top clearfix">
                <div class="f24 app-col col-20 pull-left clearfix">
                    <div class="pull-left pl20 pr20 pointer f20 navbar-header-btn" @click="navBlockTow(!isNavBlock2)">
                        <i class="ion-navicon"></i>
                        <!-- <i class="el-icon-menu"></i> -->
                    </div>
                    <div class="navbar-header pull-left pointer" @click="toUrl('/')">
                        <img class="logo" src="/static/images/hanzi_logo_2.png" alt="logo">
                        <span>汉子管理后台<!--<i style="color:#20a0ff;">管理后台</i>--></span>
                    </div>
                </div>
                <div class="app-col app-sign clearfix">
                    <ul class="layui-nav app-col-nav">
                        <li class="layui-nav-item">
                            <p class="pointer" style="font-size: 0">
                                <span class="portrait">
                                    <i v-if="headimg" class="app-col-nav-img-box" :style="'background-image: url('+ headimg +')' "></i>
                                    <i v-else class="fa fa-user-circle f30"></i>
                                </span>
                                <span class="app-col-name f12">{{name}}</span>
                                <i class="layui-icon f12">&#xe625;</i>
                                <!-- <span class="layui-nav-more f12"></span> -->
                            </p>
                            <dl class="layui-nav-child layui-anim layui-anim-upbit">
                                <dd>
                                    <a href="javascript:void(0);" @click="pathname.link = '',pathname.key = [],toUrl('/setting')">
                                        <i aria-hidden="true" class="fa fa-user-circle"></i>
                                        个人设置
                                    </a>
                                </dd>
                                <dd>
                                    <a href="javascript:void(0);" @click="logOut">
                                        <i aria-hidden="true" class="fa fa-sign-out"></i>
                                        注销
                                    </a>
                                </dd>
                            </dl>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="app-panel-center clearfix">
                <div class="app-side" :class="{'active':!isNavBlock2}">
                    <div class="app-side-scroll" v-if="isPass">
                        <el-menu :unique-opened="false" :router="true" :default-active="pathname.index" :default-openeds="pathname.key" theme="dark">
                            <el-submenu :index="key.toString()" v-for="(nav, key) in navData">
                                <template slot="title"><i class="el-submenu__icon-arrow layui-icon">&#xe625;</i>{{nav.parent}}</template>
                                <el-menu-item :route="{path: sub.link, query: {}}" :index='`${key}-${index}`' v-for="(sub, index) in nav.sub">{{sub.title}}</el-menu-item>
                                <!-- <el-menu-item :index='sub.link' v-for="(sub, index) in nav.sub">{{sub.title}}</el-menu-item> -->
                            </el-submenu>
                        </el-menu>
                    </div>
                </div>

                <div class="app-panel-content" :class="{'active':!isNavBlock2}">
                    <el-breadcrumb class="breadcrumb-line pl20 pr20" separator="/" v-if="crumbs.length > 0">
                        <el-breadcrumb-item :to="{ path: '/' }"><i class="fa fa-home mr10"></i>首页</el-breadcrumb-item>
                        <el-breadcrumb-item :to="c.url" v-for="c in crumbs" v-if="c.name">{{c.name}}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div class="el-row content mt20">
                        <div class="panel-body">
                            <!-- <transition name="tran" mode="out-in"> -->
                                <router-view :crumbs="crumbs"></router-view>
                            <!-- </transition> -->
                        </div>
                    </div>
                </div>

                <div class="site-tree-mobile layui-hide" @click="navBlock(true)">
                    <i class="layui-icon"></i>
                </div>

                <div class="site-mobile-shade" @click="navBlock(false)"></div>

            </div>
        </div>

        <div v-if="isfullScreen" class="app-panels">
            <router-view :crumbs="crumbs"></router-view>
        </div>

    </div>
</template>
<style rel="stylesheet/scss" lang="scss">
    @import "~sass/common/tool";

    .layui-tab{
        overflow: visible;
    }

    .tran-enter-active, .tran-leave-active{
        transition: opacity .3s;
    }

    .tran-enter, .tran-leave-to{
        opacity: 0;
    }

    .app-panels {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        overflow: hidden;

        .app-panel-top {
            position: relative;
            height: 60px;
            line-height: 60px;
            background-color: #242328;
            border-color: #242328;
            color: #c0ccda;

            .col-20 {
                max-width: 83.33333%;
                min-width: 324px;
            }
            .col-4 {
                width: 16.66667%;
            }

            .app-sign{
                width: 200px;
                position: absolute;
                left: 0;
                top: 0;
            }

            .app-col {

                .navbar-header {
                    min-width: 200px;
                    font-size: 20px;
                    /*font-weight: bold;*/
                    color: #fff;

                    .logo {
                        width: 30px;
                        float: left;
                        margin: 15px 10px 10px 18px;
                    }
                }
                .navbar-header-btn {
                    position: relative;
                    z-index: 9999;
                    margin-left: 150px;
                    color: #fff;

                    /*&:hover {
                        background-color: #324148;
                    }*/
                }
                .app-col-nav{
                    text-align: left;
                    background: transparent;
                    padding: 0;
                    height: 60px;
                    z-index: 1000;
                    background-color: #4A4A4A;

                    .layui-nav-bar, .layui-nav .layui-this:after, .layui-nav-tree .layui-nav-itemed:after{
                        background-color: transparent;
                    }

                    .layui-nav-item{
                        width: 100%;
                        padding:0 15px;

                        i{
                            color: #fff;
                            vertical-align: middle;
                        }
                    }

                    .portrait{
                        display: inline-block;
                        @include WH(30px);
                        @include rounded(100%);
                        overflow: hidden;
                        line-height: 100%;
                        margin: 15px 0;
                        vertical-align: middle;
                        /*border: 1px solid #fff;*/

                        i{
                            line-height: 38px;
                        }

                        .app-col-nav-img-box{
                            display: inline-block;
                            @include WH(100%);
                            background-position: center;
                            background-size: cover;
                        }

                        img{
                            width: 100%;
                            vertical-align: top;
                        }

                    }

                    .app-col-name{
                        display: inline-block;
                        max-width: 82px;
                        @include wordEllipsis;
                        text-align: left;
                        vertical-align: middle;
                        padding-left: 5px;
                        padding-right: 5px;
                        color: #fff;
                    }

                    .layui-nav-child{
                        text-align: left;
                        top: 60px;
                        background-color: #4A4A4A;
                        border: none;
                        padding: 0 15px;

                        dd{
                            border-bottom: 1px solid #9B9B9B;

                            &.layui-this{
                                background-color: transparent;
                            }

                            &:last-child{
                                border-bottom: none;
                            }

                            a{
                                color: #9B9B9B;
                                font-size: 14px;
                                padding: 0 5px;
                                height: 40px;
                                line-height: 40px;

                                &:hover{
                                    color: #d0d0d0;
                                    background-color: transparent;

                                    i{
                                        color: #d0d0d0;
                                    }
                                }

                                i{
                                    color: #9B9B9B;
                                }

                            }
                        }
                    }

                }
                .app-col-nav-item{
                    position: absolute;
                    top: 0;
                    right: 0;
                    padding: 0 20px;
                    text-align: center;
                    display: none;
                    background: none;
                }
            }
        }

        .app-panel-center{
            position: absolute;
            top: 60px;
            bottom: 0;
            overflow: hidden;
            width: 100%;
            float: left;

            .el-menu--dark{
                background: #242328;

                .el-submenu{
                    border-bottom: 1px solid #4A4A4A;

                    .el-submenu__title{
                        padding-left: 35px!important;
                        height: 45px;
                        line-height: 45px;
                        color: #fff;

                        .el-submenu__icon-arrow{
                            left: 12px;
                            right: auto;
                            /*top: 8px;*/
                        }

                        .el-submenu__icon-arrow.el-icon-arrow-down{
                            display: none;
                        }
                        .el-submenu__icon-arrow.layui-icon{
                            font-size: 12px;
                            line-height: 14px;
                            height: 14px;
                            /*width: 20px;*/
                            /*display: inline-block;*/
                        }
                    }
                }

                .el-submenu .el-menu{
                    background-color: #242328;
                    /*background-color: rgba(0, 0, 0, .15) !important;
                    box-shadow: 0 1px 0 rgba(255, 255, 255, .05) inset !important;*/

                    .el-menu-item{
                        float: left;
                        padding: 0!important;
                        margin-left: 35px;
                        color: #B5B3B4;
                        font-size: 12px;
                        width: 60px;
                        min-width: inherit;
                        display: inline-block;
                        /*overflow: hidden;*/
                        height: 25px;
                        line-height: 25px;
                        @include wordEllipsis;

                        &:last-child{
                            margin-bottom: 10px;
                        }
                        &:nth-child(2n){
                            margin-left: 20px;
                        }
                        &:hover{
                            color: #d0d0d0;
                            background-color: transparent;
                        }
                    }
                    .el-menu-item.is-active{
                        /*background-color: #26a69a;*/
                        color: #fff;
                    }
                }
            }

            .app-side{
                position: relative;
                height: 100%;
                overflow: auto;
                vertical-align: top;
                width: 200px;
                background-color: #242328;
                color: #fff;
                float: left;
                z-index: 999;

                transition: all 0.3s;
                -moz-transition: all 0.3s;
                -webkit-transition: all 0.3s;
                -o-transition: all 0.3s;

                &.active{
                    transform: translate3d(-280px, 0, 0);
                    -moz-transform: translate3d(-280px, 0, 0);
                    -webkit-transform: translate3d(-280px, 0, 0);
                    -o-transform: translate3d(-280px, 0, 0);
                    opacity: 0;
                    -ms-opacity: 0;
                }

                .app-side-scroll{
                    width: 100%!important;
                    height: 100%;
                    overflow-x: hidden;

                    ul{
                        width: 100%;
                    }
                }
            }

            .app-panel-content{
                background: #f1f2f7;
                //background: #fff;
                position: absolute;
                right: 0;
                top: 0;
                bottom: 0;
                left: 0;
                overflow-y: auto;
                overflow-x: hidden;
                padding-left: 200px;
                transition: all 0.3s;
                -moz-transition: all 0.3s;
                -webkit-transition: all 0.3s;
                -o-transition: all 0.3s;

                &.active{
                    padding-left: 0;
                }

                .content{
                    padding: 0 20px 20px;

                    .panel-body{
                        background: #fff;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        box-shadow: 0 1px 1px rgba(0,0,0,.05);
                        padding: 20px 20px 30px;
                    }
                }

                .breadcrumb-line{
                    /*height: 38px;*/
                    line-height: 38px;
                    background-color: #fcfcfc;
                    position: relative;
                    border-bottom: 1px solid #eee;
                }

            }


        }

    }

    @media screen and (max-width: 750px){

        .app-col-nav-item{
            display: block!important;
            z-index: 2;

            .portrait{
                display: inline-block;
                @include WH(30px);
                @include rounded(100%);
                overflow: hidden;
                vertical-align: middle;
                line-height: 100%;

                i{
                    line-height: 38px;
                }

                .app-col-nav-img-box{
                    display: inline-block;
                    @include WH(100%);
                    background-position: center;
                    background-size: cover;
                }

                img{
                    width: 100%;
                    vertical-align: top;
                }

            }

            .app-col-nav-item-cont{
                top: 60px;
                left: -20px;

                dd{
                    padding: 0 10px;
                    text-align: left;

                    a{
                        color: #333;
                    }
                }
            }
        }

        .app-col-name{
            max-width: 42px!important;
        }
        .layui-nav-more{
            display: none;
        }
        .app-col-nav{
            width: 114px;
            /*width: auto;*/
        }
        .navbar-header-btn{
            display: none;
        }

        .navbar-header{
            display: none;
            margin-left: 114px;
        }

        .app-col{
            width: auto!important;
            .layui-nav-child{
                /*left: -40px;*/
            }
        }
        .layui-nav .layui-nav-item a{
            padding: 0 10px;
        }
        .layui-nav-bar{
            display: none!important;
        }
        .app-side{
            position: fixed!important;
            top: 0;
            left: -260px;
            transition: all .3s;
            -webkit-transition: all .3s;
            z-index: 10000!important;
        }
        .site-mobile .app-side {
            left: 0;
        }

        .app-panels .app-panel-center .app-side.active{
            transform: none;
            -moz-transform: none;
            -webkit-transform: none;
            -o-transform: none;
            opacity: 1;
            -ms-opacity: 1;
        }

        .site-mobile .site-mobile-shade{
            display: block;
        }

        .site-mobile-shade{
            content: '';
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(0, 0, 0, .8);
            z-index: 9999;
            display: none;
        }

        .app-panel-content{
            padding-left: 0!important;

            .content {
                padding: 0 5px!important;
            }
        }

        .site-mobile .site-tree-mobile{
            display: none!important;
        }

        .site-tree-mobile{
            cursor: pointer;
            display: block !important;
            position: fixed;
            z-index: 100000;
            bottom: 15px;
            left: 15px;
            width: 50px;
            height: 50px;
            line-height: 50px;
            border-radius: 2px;
            text-align: center;
            background-color: rgba(0, 0, 0, .7);
            color: #fff;

            i{
                font-size: 20px;
            }
        }
    }
</style>

<script>
    import {LoginStatus} from 'hanzi-vue-package';

    export default {
        data(){
            return {
                isfullScreen: false,  //是否隐藏左边栏和上边栏
                isNavBlock: false,    //菜单的显示和隐藏
                isNavBlock2: true,    //菜单的显示和隐藏
                name: '',             //管理员名称
                headimg:'',               //管理员头像
                //控制菜单选中状态
                pathname:{
                    link: tools.router.currentRoute.fullPath,
                    index: '',
                    key:[]
                },
                isPass: false,  //控制获取菜单列表数据
                isShow: false,  //页面是否显示
                isNavUpbit: false,   //个人信息
                //导航栏
                navData: [
                    /*{
                     parent: '项目管理',
                     sub: [
                     {
                     title: '项目列表',
                     link: '/project/lists',
                     icon: 'fa-list-ul'
                     },
                     {
                     title: '用户列表',
                     link: '/user/lists',
                     icon: 'fa-list-ul'
                     }
                     ]
                     },
                     {
                     parent: '管理员管理',
                     sub: [
                     {
                     title: '管理员列表',
                     link: '/admin/lists',
                     icon: 'fa-list-ul'
                     },
                     {
                     title: '角色列表',
                     link: '/role/lists',
                     icon: 'fa-list-ul'
                     },
                     {
                     title: '权限组列表',
                     link: '/power/lists',
                     icon: 'fa-list-ul'
                     }
                     ]
                     }*/
                ],
                //面包屑
                crumbs:[
                    /*{
                        url: '',
                        name: ''
                    }*/
                ],
            }
        },
        name: 'app',
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'isLinkChange'
        },
        methods: {

            getData: function () {
                var that = this;

                tools.ajax({
                    url: '/api/admin/auth/menu/availables',
                    ajaxData: {},
                    successFun: function (res) {
                        var arr = [];

                        for (var i = 0; i < res.list.length; i++) {
                            var obj = {};
                            obj.parent = res.list[i].name;
                            obj.sub = [];
                            that.pathname.key.push(i.toString()); //默认展开所有菜单

                            for (var j = 0; j < res.list[i].child.length; j++) {
                                var objs = {};
                                objs.title = res.list[i].child[j].name;
                                objs.link = res.list[i].child[j].url;

                                if(that.pathname.link.indexOf(objs.link) !== -1){
                                    that.pathname.index = i + '-' + j;
                                }

                                objs.icon = res.list[i].child[j].icon;
                                obj.sub.push(objs);
                            }
                            arr.push(obj);
                        }
                        if(config.environment === 'debug'){

                        }
                        that.navData = arr;
                        that.isPass = true;
                    },
                    errorFun: function (error_data, status, headers, error_obj) {
                        tools.alert.error(error_data.error_msg);
                    },
                    type: 'GET'
                });
            },

            /* 链接变化时执行 */
            isLinkChange: function (to, from) {
                var that = this;

                //console.log('改变了导航:', this.$route);
                that.crumbs = [];
                that.pathname.link = tools.router.currentRoute.fullPath;
                that.pathname.index = '';
                that.isNavUpbit = false;
                for(let i = 0; i < that.navData.length; i++){
                    for(let k = 0; k < that.navData[i].sub.length; k++){
                        if(that.pathname.link.indexOf(that.navData[i].sub[k].link) !== -1){
                            that.pathname.index = i + '-' + k;
                        }
                    }
                }

                if (!this.isHavePage()) {
                    return;
                }

                that.isNavBlock = false;   //导航效果
                that.name = tools.cache.get('nickname'); //用户名
                that.headimg = tools.cache.get('headimg'); //用户头像

                //判断是否为登陆页
                if (this.$route.path == '/login') {
                    that.isfullScreen = true;
                    that.isPass = false;  //重新登陆后重新获取菜单数据
                } else {
                    that.isfullScreen = false;

                    setTimeout(function () {
                        layui.use('element', function () {
                            var element = layui.element();
                            element.init();   //表单重新渲染
                        });
                    },0);

                    if (!that.isPass) {
                        that.getData();
                    }

                    //每次跳页面都会验证登录是否过期
                    LoginStatus.check({
                        type: 'login'
                    });
                }

                that.isShow = true;
            },

            /* 判断页面是否存在 */
            isHavePage: function () {
                //首页跳过
                if (this.$route.path == '/') {
                    return true;
                }

                //首页跳过
                if (this.$route.path == '/404') {
                    this.isfullScreen = true;
                    this.isNavBlock = true;
                    this.isShow = true;
                    return false;
                }

                //不存在自动跳转到404页面
                if (this.$route.matched.length < 1) {
                    tools.router.replace('/404');
                    return false;
                }

                return true;
            },

            navBlock: function (type) {
                this.isNavBlock = type;
            },

            navBlockTow: function (type) {
                this.isNavBlock2 = type;
            },

            /* 注销登录 */
            logOut: function () {
                tools.alert.loading();
                tools.ajax({
                    url: '/api/admin/logins/1',
                    ajaxData: {},
                    successFun: function (res) {
                        tools.alert.closeLoading();
                        tools.cache.del('nickname');
                        tools.cache.del('Authorization');
                        tools.cache.del('headimg');
                        tools.cache.set('isLogin', '0');
                        var url = location.pathname + location.search;
                        tools.router.push({path: '/login'}); // , query: {callback: encodeURIComponent(url)}
                    },
                    errorFun: function (error_data, status, headers, error_obj) {
                        tools.alert.closeLoading();
                        tools.alert.error(error_data.error_msg);
                    },
                    type: 'DELETE'
                });

            },

            /* 跳转 */
            toUrl: function (url, val) {
                tools.router.push({path: url, query: val});
            }
        },
        components: {

        },
        beforeCreate(){

        },
        mounted(){
            this.isHavePage();
        }
    }
</script>
