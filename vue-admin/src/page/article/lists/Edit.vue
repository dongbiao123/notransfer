<template>
    <div i="article_l_edit">
        <div class="isShow f16" v-show="!isShow">
            <div class="layui-layer layui-layer-loading  layer-anim t0" type="loading" times="1" showtime="0" contype="string" style="position: relative"><div class="layui-layer-content layui-layer-loading0" style="margin: auto;"></div><span class="layui-layer-setwin"></span></div>
        </div>
        <div v-show="isShow">
            <div class="layui-tab-item layui-show mt20">
                <div class="layui-form">
                  <div class="layui-form-item">
                      <label class="layui-form-label">
                        <i class="star">*</i>
                        文章标题
                      </label>
                      <div class="layui-input-block">
                          <input type="text" v-model="form.title" placeholder="请输入文章名称" class="layui-input">
                      </div>
                  </div>
                  <div class="layui-form-item">
                      <label class="layui-form-label">
                        文章作者
                      </label>
                      <div class="layui-input-block">
                          <input type="text" v-model="form.author" placeholder="请输入文章作者" class="layui-input">
                      </div>
                  </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">
                          <i class="star">*</i>
                          文章分类
                        </label>
                        <div class="layui-input-inline">
                            <multiselect placeholder="请选择"
                                         v-model="form.cfiton"
                                         label="name"
                                         :searchable="false"
                                         :options="cfitonList"
                                         :show-labels="false" >
                                        <span slot="noResult">没有结果</span>
                            </multiselect>
                            <!--<input type="text" v-model="form.cfiton" placeholder="请输入文章分类" class="layui-input">-->
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">
                          文章标签
                        </label>
                        <div class="layui-input-inline">
                            <multiselect placeholder="请选择"
                                         label="name"
                                         track-by="name"
                                         v-model="form.label"
                                         :options="options"
                                         :multiple="true"
                                         :clear-on-select="false"
                                         :close-on-select="false"
                                         :hide-selected="true"
                                         :show-labels="false" >

                                        <span slot="noResult">没有结果</span>
                            </multiselect>
                        </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">
                            封面
                        </label>
                        <div class="prelook-wrapper clearfix pb10" id="container">
                            <div class="prelook-inner" v-show="form.img">
                                <span class="circle-box" @click="form.img = ''">
                                    <i class="circle"></i>
                                </span>
                                <a rel="group" class="fancybox prelook-block">
                                    <img :src="form.img">
                                </a>
                            </div>
                            <div class="form-groups" v-show="!form.img">
                                <div class="col-10">
                                    <div class="upload-wrapper" id="pickfiles">
                                        <div class="progress text-center" id="progress"></div>
                                        <i class="fa fa-plus f16"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="layui-form-item">
                      <label class="layui-form-label">
                        是否显示
                      </label>
                      <div class="layui-input-inline">
                          <input class="checkbox" type="checkbox" v-model="form.is_show" :true-value="1" :false-value="0">
                      </div>
                    </div>
                    <div class="layui-form-item">
                        <label class="layui-form-label">
                          <i class="star">*</i>
                          文章正文
                        </label>
                        <div class="layui-input-block" style="margin-left: 100px">
                          <base-editor ref="editor" @callback="editCallback"></base-editor>
                        </div>
                    </div>
                </div>
                <div class="layui-block pt10 pb10">
                    <button class="layui-btn ml100" @click="submit">立即提交</button>
                    <button class="layui-btn ml20" @click="preview">预览</button>
                </div>
            </div>
        </div>
    </div>
</template>
<style rel="stylesheet/scss" lang="scss">
    @import "~sass/common/tool";
    @import "../../../assets/sass/common/multiselect";
    .v-modal{
		z-index: 3000 !important;
	}
    [i="article_l_edit"]{
	.el-dialog__wrapper{
			z-index:3001!important;
			.el-dialog--tiny{
				width:520px;
				.el-dialog__body{
					padding: 0;
					.dialogVisible-html{
			height: 50%;
			overflow: hidden;
			*{
				max-width: 100%;
			}
		}
				}
			}
		}
      .t0{
        top: 0;
      }

      .checkbox{
        display: block!important;
        margin: 8px 0;
        @include switch_code(50px, 25px, #41B883);
      }

      .isShow{
          background: #fff;
          text-align: center;
          padding: 200px 0;
      }

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
          margin-bottom: 10px;
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
          z-index: 1;
          cursor: pointer;
      }
      .prelook-wrapper .prelook-inner .circle{
          @include round_close(24px);
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
          height: 120px;
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
import baseEditor from '@components/editor/Editor';
import { Verify, Compare, Upload } from 'hanzi-vue-package'
import Multiselect from 'vue-multiselect'
import Vue from 'vue';
import {Dialog} from 'element-ui'; 
Vue.use(Dialog);
export default{
  data() {
    var text = '添加文章'
    if (tools.url.params('id')) {
      text = '编辑文章'
    }
    this.crumbs.push({
      name: '文章管理'
    }, {
      name: '文章列表',
      url: '/article/lists/lists'
    }, {
      name: text
    })

    return {
    	Html:'',
	    dialogVisible:false,
      imgs: [],
      id: tools.url.params('id'),
      isShow: false,
      form: {
        cfiton: '',
        label: '',
        title: '',
        author: '',
        content: '',
        is_show: 1,
        img: '',
        img_id: ''
      },
      options: [],
      cfitonList: []
    }
  },
  methods: {
  	preview(){
		this.$refs.editor.preview();
	},
    editCallback(res) {
      this.form.content = res.html;
      this.Html =  this.form.content
    },
    /* 获取数据 */
    getData: function() {
      var that = this
      var ajaxData = {}

      tools.ajax({
        url: '/api/admin/articles/' + that.id,
        ajaxData: ajaxData,
        successFun: function(res) {
          Compare.oldObj(res.data) // 将旧数据存起来
          that.form.title = res.data.title
          if (res.data.tag) {
            that.form.label = res.data.tag
          }
          for (var i = 0; i < that.cfitonList.length; i++) {
            if (that.cfitonList[i].id == res.data.cat_id) {
              that.form.cfiton = that.cfitonList[i]
            }
          }
          that.form.author = res.data.author
          that.form.is_show = res.data.is_show
          that.form.content = res.data.content
          that.form.img = res.data.cover
          new upload({
            container: 'container', // 容器ID
            browse_button: 'pickfiles', // 按钮ID
            progress: 'progress', // 进度条ID
            type: 'article_cover', // 请求接口时的传参，upload_type:"headpic"
            setting: 'local', // local：本地，cloud：云
            chunk_size: '200kb', // 分段传输的大小
            group: ['img'], // 上传格式组
            url: '/api/admin/uploads',
            callback: function(res) {
              that.form.img = res.data.url
              that.form.img_id = res.data.upload_id
            }
          })
          
          that.isShow = true

          setTimeout(()=>{
            that.$refs.editor.setHtml(that.form.content);
          },100)
        },
        errorFun: function(error_data, status, headers, error_obj) {
          that.isShow = true
          tools.alert.error(error_data.error_msg)
        },
        type: 'GET'
      })
    },

    /* 获取标签列表 */
    getLabelList: function() {
      var that = this
      var ajaxData = {}

      that.isShow = false

      tools.ajax({
        url: '/api/admin/article/tags',
        ajaxData: ajaxData,
        successFun: function(res) {
          that.options = res.list

          if (that.id) {
            that.getData()
          } else {
            that.isShow = true
          }
        },
        errorFun: function(error_data, status, headers, error_obj) {
          that.isShow = true
          tools.alert.error(error_data.error_msg)
        },
        type: 'GET'
      })
    },

    /* 获取分类列表 */
    getCfitonList: function() {
      var that = this
      var ajaxData = {}

      tools.ajax({
        url: '/api/admin/article/categorys',
        ajaxData: ajaxData,
        successFun: function(res) {
          that.cfitonList = res.list
        },
        errorFun: function(error_data, status, headers, error_obj) {
          tools.alert.error(error_data.error_msg)
        },
        type: 'GET'
      })
    },

    /* 提交 */
    submit: function() {
      var that = this
      var ajaxData = {}

      var verify = Verify.run([
        {
          type: 'notEmpty',
          value: that.form.title,
          name: '文章标题',
          canEmpty: false
        },
        {
          type: 'notEmpty',
          value: that.form.cfiton,
          name: '文章分类',
          canEmpty: false
        },
        {
          type: 'notEmpty',
          value: that.form.content,
          name: '文章正文',
          canEmpty: false
        }
      ])

      if (verify !== true) {
        tools.alert.error(verify.msg)
        return
      }

      var arr = []
      for (var i = 0; i < that.form.label.length; i++) {
        arr.push({ tag_id: that.form.label[i].id })
      }

      ajaxData.cat_id = that.form.cfiton.id
      ajaxData.cover_id = that.form.img_id
      ajaxData.is_show = that.form.is_show
      ajaxData.tag_id = arr
      ajaxData.title = that.form.title
      ajaxData.author = that.form.author
      ajaxData.content = that.form.content

      if (ajaxData.cover_id === '') {
        delete ajaxData.cover_id
      }

      if (ajaxData.author === '') {
        delete ajaxData.author
      }

      if (ajaxData.tag_id.length === 0) {
        delete ajaxData.tag_id
      }

      var type = ''
      var url = ''
      if (that.id) {
        type = 'PUT'
        url = '/api/admin/articles/' + that.id
        ajaxData = Compare.newObj(ajaxData) // 如果数据未改动则为空对象
      } else {
        url = '/api/admin/articles'
        type = 'POST'
      }

      ajaxData.level = 1
      ajaxData.parent_id = 0

      layer.confirm('确认提交？', {
        btn: ['确认', '取消']
      }, function() {
        tools.alert.loading()
        tools.ajax({
          url: url,
          ajaxData: ajaxData,
          successFun: function(res) {
            tools.alert.closeLoading()
            tools.alert.success('提交成功')
            that.go('/article/lists/lists')
          },
          errorFun: function(error_data, status, headers, error_obj) {
            tools.alert.closeLoading()
            tools.alert.error(error_data.error_msg)
          },
          type: type
        })
      })
    },

    /* 跳转 */
    go: function(url, val) {
      tools.router.push({ path: url, query: val })
    }
  },
  props: ['crumbs'],
  watch: {

  },
  components: {
    Multiselect,
    Upload,
    baseEditor
  },
  mounted() {
    var that = this
    if (!that.id) {
      new upload({
        container: 'container', // 容器ID
        browse_button: 'pickfiles', // 按钮ID
        progress: 'progress', // 进度条ID
        type: 'article_cover', // 请求接口时的传参，upload_type:"headpic"
        setting: 'local', // local：本地，cloud：云
        chunk_size: '200kb', // 分段传输的大小
        group: ['img'], // 上传格式组
        url: '/api/admin/uploads',
        callback: function(res) {
          that.form.img = res.data.url
          that.form.img_id = res.data.upload_id
        }
      })
    }
    that.getLabelList()
    that.getCfitonList()
  }
}
</script>
