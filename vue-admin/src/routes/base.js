//基本路由 
export default {
     'admin/lists/add': resolve => require(['../page/admin/lists/Add.vue'], resolve),
     'admin/lists/edit': resolve => require(['../page/admin/lists/Edit.vue'], resolve),
     'admin/lists/lists': resolve => require(['../page/admin/lists/Lists.vue'], resolve),
     'admin/log/lists': resolve => require(['../page/admin/log/lists.vue'], resolve),
     'admin/menu/admin/edit': resolve => require(['../page/admin/menu/admin/Edit.vue'], resolve),
     'admin/menu/admin/lists': resolve => require(['../page/admin/menu/admin/Lists.vue'], resolve),
     'admin/menu/edit': resolve => require(['../page/admin/menu/Edit.vue'], resolve),
     'admin/menu/lists': resolve => require(['../page/admin/menu/Lists.vue'], resolve),
     'admin/power/admin/edit': resolve => require(['../page/admin/power/admin/Edit.vue'], resolve),
     'admin/power/admin/lists': resolve => require(['../page/admin/power/admin/Lists.vue'], resolve),
     'admin/power/edit': resolve => require(['../page/admin/power/Edit.vue'], resolve),
     'admin/power/lists': resolve => require(['../page/admin/power/Lists.vue'], resolve),
     'admin/role/admin': resolve => require(['../page/admin/role/Admin.vue'], resolve),
     'admin/role/edit': resolve => require(['../page/admin/role/Edit.vue'], resolve),
     'admin/role/lists': resolve => require(['../page/admin/role/Lists.vue'], resolve),
     'article/classify/edit': resolve => require(['../page/article/classify/Edit.vue'], resolve),
     'article/classify/lists': resolve => require(['../page/article/classify/Lists.vue'], resolve),
     'article/label/edit': resolve => require(['../page/article/label/Edit.vue'], resolve),
     'article/label/lists': resolve => require(['../page/article/label/Lists.vue'], resolve),
     'article/lists/edit': resolve => require(['../page/article/lists/Edit.vue'], resolve),
     'article/lists/lists': resolve => require(['../page/article/lists/Lists.vue'], resolve),
     'index': resolve => require(['../page/Index.vue'], resolve),
     'log/sms': resolve => require(['../page/log/Sms.vue'], resolve),
     'login': resolve => require(['../page/Login.vue'], resolve),
     'setting': resolve => require(['../page/Setting.vue'], resolve),
     'system/config': resolve => require(['../page/system/Config.vue'], resolve),
     'user/edit': resolve => require(['../page/user/Edit.vue'], resolve),
     'user/lists': resolve => require(['../page/user/Lists.vue'], resolve),

       //首页
      '/': resolve => require(['../page/Index.vue'], resolve)
}