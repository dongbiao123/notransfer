<template>
    <div i="editor" >
        <textarea :id="id" type="text/plain" style="width:100%;height:100%;"></textarea>

        <div :id="container" v-show="!loading">
            <el-button class="mt5" type="primary" :id="pickfiles">选择文件</el-button>
        </div>
        <el-button class="mt5" type="primary" :loading="true" v-if="loading">上传中</el-button>
        <div class="progress-box ml20" style="height: auto; display: inline-block; width: 400px;" v-if="loading">
            <p v-if="upload.type === 0">读取文件中：</p>
            <el-progress :percentage="upload.bar" :status="upload.bar == 100 ? 'success' : ''"></el-progress>
        </div>
        <el-dialog
            :visible.sync="dialogVisible"
            :custom-class="className"
            size="tiny">
            <div class="dialogVisible-html" v-html="Html"></div>
        </el-dialog>
    </div>

</template>
<style rel="stylesheet/scss" lang="scss" >
	[i="editor"]{
		.el-dialog__wrapper{
			overflow: hidden;
			z-index:3001!important;

			.el-dialog--tiny{
				top: 25px !important;
                margin-bottom: 0!important;
                bottom: 20px;
                &.sty{
                    width: 1200px;
                }
				.el-dialog__header{
					padding-top: 15px !important;
					padding-bottom: 15px !important;
				}
				.el-dialog__body{
					padding: 0;
                    position: absolute;
                    width: 100%;
                    top: 48px;
                    bottom: 0;
				}
			}
		}
		
		.dialogVisible-html{
            padding: 20px;
            height: 100% !important;
			overflow-y: auto !important;
            max-width: 100%;
            line-height: 1.5;

			*{
				max-width: 100%;
			}

            blockquote {
                margin: 0;
                padding-left: 10px;
                border-left: 3px solid #DBDBDB;
            }

            hr{
                display: block;
                unicode-bidi: isolate;
                -webkit-margin-before: 0.5em;
                -webkit-margin-after: 0.5em;
                -webkit-margin-start: auto;
                -webkit-margin-end: auto;
                overflow: hidden;
                border-style: inset;
                border-width: 1px;
            }

            table{
                width: 100%;

                td, th{
                    padding: 5px 10px;
                    border: 1px solid #DDD;
                }
            }
		}
		.v-modal{
            z-index: 3000 !important;
        }
	}
	
</style>

<script>
    import Vue from 'vue';
    import '@static/ueditor/ueditor.config.js'
    import '@static/ueditor/ueditor.all.js'
    import {Button, Progress, Dialog} from 'element-ui';
    Vue.use(Button);
    Vue.use(Dialog);
    Vue.use(Progress);
    
    export default {
        data() {
            return {
                upload: {},
                dialogVisible:false,
                Html:'',
                className: '',
                loading: false,
                container:'container' + this.getRandomNum(1,10000000),
                pickfiles:'pickfiles' + this.getRandomNum(1,10000000),
                id: 'editor' + this.getRandomNum(1, 999999999999),
                params: {
					type: 'files',
					setting: 'cloud',
					chunk_size: '200kb',
					custom: '',
					group: [],
					url: '/api/admin/uploads',
					max_file_size: '10gb'
				}
            }
        },
        components: {},
        props: {
            width: {
                type: Number,
                default: 520
            }
        },
        computed: {},
        methods: {
        	preview(className){
                
                if (className) {
                    this.className = className;
                }
                else {
                    this.className = '';
                }

                this.dialogVisible = true;
        	},

            setHtml:function(text){
                let that = this;
                that.editor.setContent(text);
            },

            getRandomNum: function (s1,s2) {
                var Range = s2 - s1;
                var Rand = Math.random();
                return(s1 + Math.round(Rand * Range));
            },

            // 初始化百度编辑器
            ueditor: function() {
                let that = this;
                that.$nextTick(()=>{
                    that.editor = UE.getEditor(that.id, {
                        initialFrameWidth: that.width
                    });
                    that.editor.addListener("contentChange", function() {
                    	that.Html = that.editor.getContent();
                        that.$emit("callback", {
                            html: that.editor.getContent().replace(/!important/g,''),
                            text: that.editor.getContentTxt().replace(/!important/g,''),
                            dom: that.editor
                        }); //回调整个上传对象
                    });
                })
            },

            ready(fun){
                let that = this;
                that.editor.ready(()=>{
                    fun();
                })
            },

            init() {
                let that = this;

                that.uploads = new upload({
                    container: that.container,     //容器ID
                    browse_button: that.pickfiles, //按钮ID
                    // progress: that.progress,        //进度条ID
                    type: that.params.type,      	    //请求接口时的传参，upload_type
                    setting : that.params.setting,          //local：本地，cloud：云
                    chunk_size : that.params.chunk_size,       //分段传输的大小
                    custom: that.params.custom,              //自定上传义格式
                    group: that.params.group,
                    max_file_size: that.params.max_file_size,
                    url: that.params.url,   //上传路径
                    FilesAdded: function (up, files) {
                        that.loading = true;
                        that.baseFiles = files[0];
                        let file = files[0];
                        that.upload = {
                            origin_filename: file.name
                        }
                    },
                    UploadProgress(up, file, type){
                        that.upload = {
                            origin_filename: file.name,
                            bar: file.percent-1,
                            type: type
                        }
                    },
                    getUploadIdAndSign: ()=> {
                        that.loading = false;
                        that.upload.bar = 0;
                        that.uploads.data.uploader.removeFile(that.baseFiles);
                    },
                    Error: function () {
                        that.loading = false;
                    },
                    callback: function (res) {
                        that.loading = false;

                        let URLS = window.location.origin + '/static/ueditor/';
                        let icon, html = '', title = res.data.origin_filename,
                            iconDir = URLS + (URLS.substr(URLS.length - 1) == '/' ? '':'/') + 'dialogs/attachment/fileTypeImages/';
                        icon = iconDir + getFileIcon(res.data.url);
                        html += '<p style="line-height: 16px;">' +
                                '<img style="vertical-align: middle; margin-right: 2px;" src="'+ icon + '" _src="' + icon + '" />' +
                                '<a style="font-size:12px; color:#0066cc;" href="' + res.data.url +'" title="' + title + '">' + title + '</a>' +
                                '</p>';

                        function getFileIcon(url){
                            var ext = url.substr(url.lastIndexOf('.') + 1).toLowerCase(),
                                maps = {
                                    "rar":"icon_rar.gif",
                                    "zip":"icon_rar.gif",
                                    "tar":"icon_rar.gif",
                                    "gz":"icon_rar.gif",
                                    "bz2":"icon_rar.gif",
                                    "doc":"icon_doc.gif",
                                    "docx":"icon_doc.gif",
                                    "pdf":"icon_pdf.gif",
                                    "mp3":"icon_mp3.gif",
                                    "xls":"icon_xls.gif",
                                    "chm":"icon_chm.gif",
                                    "ppt":"icon_ppt.gif",
                                    "pptx":"icon_ppt.gif",
                                    "avi":"icon_mv.gif",
                                    "rmvb":"icon_mv.gif",
                                    "wmv":"icon_mv.gif",
                                    "flv":"icon_mv.gif",
                                    "swf":"icon_mv.gif",
                                    "rm":"icon_mv.gif",
                                    "exe":"icon_exe.gif",
                                    "psd":"icon_psd.gif",
                                    "txt":"icon_txt.gif",
                                    "jpg":"icon_jpg.gif",
                                    "png":"icon_jpg.gif",
                                    "jpeg":"icon_jpg.gif",
                                    "gif":"icon_jpg.gif",
                                    "ico":"icon_jpg.gif",
                                    "bmp":"icon_jpg.gif"
                                };
                            return maps[ext] ? maps[ext]:maps['txt'];
                        }
                        that.editor.execCommand('insertHtml', html);
                    }
                });
            }
        },
        created() {
            let that = this;
            that.ueditor();
        },
        mounted() {
          	this.init();
        },
        destroyed() {
            this.editor.removeListener("contentChange");
			this.editor.destroy();
    		this.editor = null;
        }
    }
</script>
