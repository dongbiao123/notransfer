<template>
    <ul class="layui-nav layui-nav-tree layui-tab m0" i="layui-nav" lay-filter="demo">
        <li class="layui-nav-item" v-for="nav in navData"><!--展开状态：layui-nav-itemed-->
            <a class="javascript:;" href="javascript:void(0);">{{nav.parent}}</a>
            <dl class="layui-nav-child" v-for="sub in nav.sub">
                <dd><!--选中状态：layui-this-->
                    <router-link v-if="sub.icon" :to="sub.link">
                        <i class="fa" :class="sub.icon"></i><cite>{{sub.title}}</cite>
                    </router-link>
                    <router-link v-else :to="sub.link">{{sub.title}}</router-link>
                </dd>
            </dl>
        </li>
    </ul>
</template>
<style>

</style>
<script>
    export default{
        data(){
            return {

            }
        },
        props:['navData'],
        computed:{

        },
        methods: {

        },
        components: {},
        filters:{

        },
        watch:{

        },
        mounted(){

        }
    }
</script>
