//基本路由 
export default {
     'index': resolve => require(['../page/Index.vue'], resolve),
     'wechat_auth_error': resolve => require(['../page/Wechat_auth_error.vue'], resolve),

       //首页
      '/': resolve => require(['../page/Index.vue'], resolve)
}