//示例路由

export default {
    'example/table': resolve => require(['../example/Table.vue'], resolve),
    'example/form': resolve => require(['../example/Form.vue'], resolve),
    'example/socket': resolve => require(['../example/Socket.vue'], resolve)
}

