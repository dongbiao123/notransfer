//示例路由

export default {
    'example/uploader': resolve => require(['../example/Uploader.vue'], resolve),
    'example/socket': resolve => require(['../example/Socket.vue'], resolve)
}
