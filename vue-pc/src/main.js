import Vue from 'vue';
import Vuex from 'vuex'
import VueRouter from 'vue-router';
import App from './App';
import store from './store';
import Config from '../.config.js';

//加载错误操作设置
import ErrorData from './auth/error_handle.js';

//加载本地路由
import BaseRoute from './routes/base';
import DynamicRoute from './routes/dynamic';
import SystemRoute from './routes/system';
import ExampleRoute from './routes/example';

//加载汉子package
import {Tools,Route,Log,Alert} from 'hanzi-vue-package';

import Jquery from 'jquery';
import Promise from 'bluebird';

var tools = Tools;
var log = Log;
var alert = Alert;

//定义错误操作数组
tools.errorData = ErrorData.data;

//初始化路由
Route.data.baseRoute = BaseRoute;
Route.data.dynamicRoute = DynamicRoute;
Route.data.systemRoute = SystemRoute;
Route.data.exampleRoute = ExampleRoute;

var app = window;

Tools.vue = Vue;
Tools.alert = alert;
app.tools = tools;

app.config = Config;
app.log = log;
app.$ = Jquery;
app.Promise = Promise;

Vue.use(VueRouter);
Vue.use(Vuex);

/* 定义路由 */
const routes = Route.routes();

const router = new VueRouter({
    mode: 'history',
    routes
});

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
//定义是否可以初始化签名
app.canauthinit =1;

window.mainInit = 1;

import Login from './auth/index';

/* 定义路由示例 */
app.tools.router =  router;

/* 定义路由数组 */
app.tools.routes = routes;

/* 等待storage监听执行完后再执行以下 */
window.addEventListener('load', function() {

    if(navigator.appName == "Microsoft Internet Explorer"&&parseInt(navigator.appVersion.split(";")[1].replace(/[ ]/g, "").replace("MSIE",""))<10){
        return;
    }

    /* 初次打开,检查权限 */
    router.beforeEach((to, from, next) => {
        Login(to, from, next);
    });

    /* eslint-disable no-new */
    new Vue({
        el: '#app',
        store,
        template: '<App/>',
        components: { App },
        router
    });

});
