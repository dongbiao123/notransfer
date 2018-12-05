
import Vue from 'vue';
import Vuex from 'vuex'
import VueRouter from 'vue-router';
import App from './App';
import Config from '../.config.js';

//加载错误操作设置
import ErrorData from './error_handle.js';

//加载本地路由
import BaseRoute from './routes/base';
import DynamicRoute from './routes/dynamic';
import SystemRoute from './routes/system';
import ExampleRoute from './routes/example';

//加载汉子package
import {Tools,Route,Log,Alert,LoginStatus} from 'hanzi-vue-package';


import Jquery from 'jquery';
import Promise from 'bluebird';

import 'iview/dist/styles/iview.css';
import LoadingBar from 'iview/src/components/loading-bar/index';


//加载element组件
import { Menu, Submenu, MenuItem, MenuItemGroup, Breadcrumb, BreadcrumbItem } from 'element-ui';

Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(LoadingBar);


var tools = Tools;
var log=Log;
var alert=Alert;
var loginStatus=LoginStatus;

//定义错误操作数组
tools.errorData = ErrorData.data;
tools.loginStatus = loginStatus;

//初始化路由
Route.data.baseRoute = BaseRoute;
Route.data.dynamicRoute = DynamicRoute;
Route.data.systemRoute = SystemRoute;
Route.data.exampleRoute = ExampleRoute;

var app = window;

Tools.vue=Vue;
Tools.alert=alert;

app.jQuery=Jquery;
app.tools=tools;
app.config=Config;
app.log=log;
app.$=Jquery;
app.Promise = Promise;

//console.log(Tools,app, 5555);

Vue.use(VueRouter);
Vue.use(Vuex);

/* 定义路由 */
const routes = Route.routes();

const router = new VueRouter({
    mode: 'history',
    routes
});

//Vuex
/*const store = new Vuex.Store({
    state: {
        count: 0
    },
    mutations: {
        increment (state) {
            state.count++
        }
    }
});*/

/* 判断是否为新标签页 */
if (!sessionStorage.length) {
    // Ask other tabs for session storage
    localStorage.setItem('getSessionStorage', Date.now());
}

/* 将纪录过的sessionStorage保存到新标签页 */
window.addEventListener('storage', function(event) {

    if (event.key == 'getSessionStorage') {
        // Some tab asked for the sessionStorage -> send it
        localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage));
        localStorage.removeItem('sessionStorage');

    } else if (event.key == 'sessionStorage' && !sessionStorage.length) {
        // sessionStorage is empty -> fill it
        var p = [];

        if(event.newValue){
            p = JSON.parse(event.newValue);
        }

        for (var key in p) {
            tools.cache.set(key, p[key]);
        }
    }
});

/* 等待storage监听执行完后再执行以下 */
window.addEventListener('load', function() {

    /* 初次打开,检查权限 */
    router.beforeEach((to, from, next) => {
        LoadingBar.start();

        if(to.path !='/login'){
            LoginStatus.check({
                type: 'login',
                redirectUrl: '/login'
            }, next);
        }else{
            next();
        }
    });

    router.afterEach((to, from, next) => {
        LoadingBar.finish();
    });


    /* 定义路由示例 */
    app.tools.router =  router;

    /* 定义路由数组 */
    app.tools.routes = routes;

    //定义是否可以初始化签名
    app.canauthinit =1;

    /* eslint-disable no-new */
    new Vue({
        el: '#app',
        //store,
        template: '<App/>',
        components: { App },
        router
    });

});
