//基本路由 
export default {
     'index': resolve => require(['../page/Index.vue'], resolve),
     'login': resolve => require(['../page/Login.vue'], resolve),
     'register': resolve => require(['../page/Register.vue'], resolve),

       //首页
      '/': resolve => require(['../page/Index.vue'], resolve)
}