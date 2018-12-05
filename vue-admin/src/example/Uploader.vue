<template>
    <div i="uploader">

        <!-- 上传单张图片 -->
        <base-upload :parameter="parameter" :success_data="uploader_data"></base-upload>

        <!-- 上传单张图片 -->
        <div class="prelook-wrapper clearfix pb10" id="container">
            <div class="prelook-inner" v-show="img_url">
                <span class="circle-box" @click="img_url = ''">
                    <i class="circle"></i>
                </span>
                <a rel="group" class="fancybox prelook-block">
                    <img :src="img_url">
                </a>
            </div>
            <div class="form-groups" v-show="!img_url">
                <div class="col-10">
                    <div class="upload-wrapper" id="pickfiles">
                        <div class="progress text-center" id="progress"></div>
                        <i class="fa fa-plus f16"></i>
                    </div>
                </div>
            </div>
        </div>
        <!-- 上传多张图片 -->
        <div class="prelook-wrapper clearfix pb10" id="container2">
            <div class="prelook-inner" v-for="(info,index) in imgs" v-show="imgs.length>0">
                <span class="circle-box" @click="imgs.splice(index,1)">
                    <i class="circle"></i>
                </span>
                <a rel="group" class="fancybox prelook-block">
                    <img :src="info.url">
                </a>
                <span class="prelook-radio mt10">
                    <label>
                        <input type="radio" name="prelookRadio" class="mr10 radio">设为封面图
                    </label>
                </span>
            </div>
            <div class="form-groups" :class="{'dn': imgs.length>=5}">
                <div class="col-10">
                    <div class="upload-wrapper" id="pickfiles2">
                        <div class="progress text-center" id="progress2"></div>
                        <i class="fa fa-plus f16"></i>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<style rel="stylesheet/scss" lang="scss">
    @import "~sass/common/tool";

    [i="uploader"]{

        .prelook-wrapper{
            padding-top: 10px;
            //border-bottom: 1px dotted #ddd;
        }
        .prelook-wrapper .upload-wrapper{
            float: left;
            position: relative;
            width: 120px;
            height: 120px;
            text-align: center;
            line-height: 120px;
            border: 1px solid #ddd;
            margin-bottom: 20px;
            cursor: pointer;
            overflow: hidden;
        }
        .prelook-wrapper .upload-wrapper i{
            line-height: 120px;
        }
        .prelook-wrapper .prelook-inner .circle-box{
            position: absolute;
            right: -10px;
            top: -10px;
            cursor: pointer;
            z-index: 1;
        }
        .prelook-wrapper .prelook-inner .circle{
            @include round_close(22px);
        }
        .prelook-wrapper .upload-wrapper .file-button{
            font-size: 200px;
            opacity: 0;
            position: absolute;
            left: 0;
            top: 0;
            width: 120px;
            height: 120px;
            cursor: pointer;
            z-index: 9;
        }
        .prelook-inner {
            float: left;
            width: 120px;
            height: 160px;
            margin-right: 20px;
            margin-bottom: 10px;
            position: relative;
        }
        .prelook-inner i.fa-times-circle {
            font-size: 20px;
            position: absolute;
            top: -10px;
            right: -10px;
            z-index: 999;
            cursor: pointer;
        }
        .prelook-block {
            display: block;
            width: 120px;
            height: 120px;
            overflow: hidden;
            position: relative;
        }
        .prelook-block img {
            width: 100%;
        }
        .prelook-inner .prelook-radio {
            display: block;
            width: 100%;
            height: 30px;
            line-height: 30px;
            padding-left: 10px;
        }
        .prelook-inner .prelook-radio .radio{
            @include radio_core(#5FB878,16px); //#5FB878,#1e9fff
        }
        .moxie-shim{
            display: none;
        }
        .progress{
            position: absolute;
            top: 0;
            background-color: #5cb85c;
            color: #000;
            font-size: 12px;
            line-height: 20px;

            background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
            background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
            background-image: linear-gradient(45deg, rgba(255, 255, 255, .15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .15) 50%, rgba(255, 255, 255, .15) 75%, transparent 75%, transparent);
            -webkit-background-size: 40px 40px;
            background-size: 40px 40px;

            -webkit-animation: progress-bar-stripes 2s linear infinite;
            -o-animation: progress-bar-stripes 2s linear infinite;
            animation: progress-bar-stripes 2s linear infinite;
        }
    }
</style>
<script>
    import {baseUpload} from 'hanzi-vue-package';
    tools.vue.use(baseUpload);

    export default{
        data(){
            return{
                parameter:{
                    type: 'admin_headpic',
                    setting : 'local',
                    chunk_size : '200kb',
                    group: ['img'],
                    // custom: 'txt',
                    url: '/api/admin/uploads'
                },
                uploader_data:{},
                img_url:'',
                imgs:[]
            }
        },
        methods:{
            uploadInit:function () {
                var that = this;

                var uploads = new upload({
                    container: 'container',     //容器ID
                    browse_button: 'pickfiles', //按钮ID
                    progress:'progress',        //进度条ID
                    type: 'admin_headpic',      //请求接口时的传参，upload_type
                    setting : 'cloud',          //local：本地，cloud：云
                    chunk_size : '200kb',       //分段传输的大小
                    group: ['img'],             //上传格式组
                    // custom: 'txt',              //自定上传义格式
                    url: '/api/admin/uploads',   //上传路径
                    callback: function (res) {
                        that.img_url = res.data.url;
                    }
                });

                var uploads2 = new upload({
                    container: 'container2',     //容器ID
                    browse_button: 'pickfiles2', //按钮ID
                    progress:'progress2',        //进度条ID
                    type: 'admin_headpic',            //请求接口时的传参，upload_type
                    setting : 'local',          //local：本地，cloud：云
                    chunk_size : '200kb',       //分段传输的大小
                    group: ['img'],
                    url: '/api/admin/uploads',   //上传路径
                    callback: function (res) {
                        that.imgs.push(res.data);
                    }
                });

            }
        },
        watch: {

        },
        components:{

        },
        filters: {

        },
        mounted(){
            var that = this;
            that.uploadInit();
        }
    }
</script>
