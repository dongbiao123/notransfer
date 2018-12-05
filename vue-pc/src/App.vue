<template>
    <div id="app" v-cloak v-show="isShow">
        <router-view></router-view>
    </div>
</template>

<script>
    import {LoginStatus} from 'hanzi-vue-package';

    export default {
        data(){
            return {
                isShow: false,  //页面是否显示
                name: tools.cache.get('nickname'),
            }
        },
        created(){
            let that = this;

            /*
                **混合 （请认真查看使用方法 https://vuefe.cn/v2/guide/mixins.html）
                **注意同名钩子函数将混合为一个数组，因此都将被调用。且先调用混合对象的钩子
                **
            */
            tools.vue.mixin({
                /* 全局方法 */
                methods: {
                    /* 默认图片过滤 */
                    thumbnail: function (val, size) {
                        return !val ? app.defaultImg() : val + (!size ? '' : size);
                    },

                    /* 跳转 */
                    toUrl: function (url, val) {
                        tools.router.push({path: url, query: val});
                    }
                },
                /* 全局过滤 */
                filters: {
                    /* 默认图片过滤 */
                    thumbnail: function (val, size) {
                        return !val ? app.defaultImg() : val + (!size ? '' : size);
                    },

                    /* 时间转换 */
                    timeTran: function (value) {
                        return parseInt(value) === 0 ? '-' : tools.date('Y-m-d H:i:s', value);
                    },

                    /* 自定时间格式转换 */
                    setTimeTran: function (value, type) {
                        return parseInt(value) === 0 ? '-' : tools.date(type, value);
                    },

                    /* 价格转换--保留两位小数 */
                    toFixedPrice : function (value) {
                        return value ? (parseInt(value) / 100).toFixed(2) : '0';
                    },

                    /* 价格转换 */
                    toPrice: function (value) {
                        return value ? (parseInt(value) / 100) : '0';
                    }
                }
            });

        },
        name: 'app',
        watch: {
            // 如果路由有变化，会再次执行该方法
            '$route': 'isLinkChange'
        },
        methods: {
            /* 连接变化时执行 */
            isLinkChange: function () {
                var that = this;
                //console.log('改变了导航:',this.$route);

                if (!that.isHavePage()) {
                    return;
                }

                that.name = tools.cache.get('nickname'); //用户名

                //判断是否为登陆页
                // if(!(that.$route.path == '/login' || that.$route.path == '/register' || tools.noLoginUrl.isUrl(that.$route.path))){
                //
                //     //每次跳页面都会验证登录是否过期
                //     LoginStatus.check({
                //         type:  'login'
                //     });
                //
                // }

                that.isShow = true;
            },

            /* 判断页面是否存在 */
            isHavePage:function () {

                //首页跳过
                if (this.$route.path == '/') {
                    return true;
                }

                //首页跳过
                if (this.$route.path == '/404') {
                    this.isShow = true;
                    return false;
                }

                //注册页跳过
                if (this.$route.path == '/register') {
                    this.isShow = true;
                    return false;
                }

                //不存在自动跳转到404页面
                if (this.$route.matched.length < 1) {
                    tools.router.push('/404');
                    return false;
                }

                this.isfullScreen = false;
                return true;
            },

            navBlock:function (type) {
                this.isNavBlock = type;
            },

            /* 注销登录 */
            logOut: function () {
                tools.alert.loading();
                tools.ajax({
                    url: '/api/login/out',
                    ajaxData: {},
                    successFun: function (res) {
                        tools.alert.closeLoading();
                        tools.cache.del('nickname');
                        tools.cache.del('Authorization');
                        tools.cache.set('isLogin', '0');

                        that.toUrl('/login');
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

<style rel="stylesheet/scss" lang="scss">

</style>
