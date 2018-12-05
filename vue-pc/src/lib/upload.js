var plupload = require('../../static/plupload/plupload.dev.js');

!(function(win){

    /**
     * 对象扩展
     * @param target
     * @param source
     * @returns {object}
     */
    function extend(target,source){
        for(var p in source){
            if(source.hasOwnProperty(p)){
                target[p] = source[p];
            }
        }
        return target;
    }

    /**
     * 克隆
     * @param obj
     * @returns {object}
     */
    function clone(obj) {
        var o;
        switch(typeof obj){
            case 'undefined':
                break;
            case 'string'   : o = obj + '';
                break;
            case 'number'   : o = obj - 0;
                break;
            case 'boolean'  : o = obj;
                break;
            case 'object'   :
                if(obj === null){
                    o = null;
                }else{
                    if(obj instanceof Array){
                        o = [];
                        for(var i = 0, len = obj.length; i < len; i++){
                            o.push(clone(obj[i]));
                        }
                    }else{
                        o = {};
                        for(var k in obj){
                            o[k] = clone(obj[k]);
                        }
                    }
                }
                break;
            default:
                o = obj;
                break;
        }
        return o;
    }

    /**
     * 构造函数
     * @param params
     * @constructor
     */
    var uploaders = function(params) {
        var defaults = clone(this.data);
        this.data = extend(defaults,params);
        this.init(params);
    };
    uploaders.prototype = {
        data: {
            uploader: {},
            total_part: 0,
            part_now: 0,
            params: {},
            complete_url: '',
            callback: function(obj){}  //回调函数，返回当前图片数据
        },
        /* 初始化 */
        init: function (params) {
            var that = this;

            var mime_types = [];

            if(params.group){

                for(var i = 0; i < params.group.length; i++){
                    if(params.group[i] === 'img'){
                        mime_types.push({
                            title: "Image files",
                            extensions: "jpg,gif,png,jpeg"
                        })
                    }
                    if(params.group[i] === 'zip'){
                        mime_types.push({
                            title: "Zip files",
                            extensions: "zip,rar,lzh,gzip"
                        })
                    }
                }
            }

            if(params.custom){
                mime_types.push({
                    title: "Custom files",
                    extensions : params.custom
                })
            }

            var type = params.type || '';
            var container = params.container || 'container';
            var browse_button = params.browse_button || 'pickfiles';
            var progress = params.progress || 'progress';
            var setting = params.setting || 'loacl';
            var max_file_size = params.max_file_size || '10mb';
            var chunk_size = params.chunk_size || '204800';

            var uploader = new plupload.Uploader({
                runtimes: 'html5',
                browse_button: browse_button, // you can pass in id...
                container: document.getElementById(container), // ... or DOM Element itself
                url: "http://10.1.2.8:9999/api/test3",
                chunk_size: chunk_size,
                filters: {
                    mime_types: mime_types,
                    max_file_size : max_file_size,
                    /*[
                        {title : "Image files", extensions : "jpg,gif,png,jpeg"},
                        {title : "Zip files", extensions : "zip"}
                    ]*/
                },
                init: {
                    PostInit: function () {
                        //document.getElementById(progress).innerHTML = '';

                        /*document.getElementById('uploadfiles').onclick = function () {
                            uploader.start();
                            return false;
                        };*/
                        if(params.PostInit){
                            params.PostInit();
                        }
                    },
                    FilesAdded: function (up, files) {
                        plupload.each(files, function (file) {
                            /*document.getElementById('filelist').innerHTML += '<div id="' + file.id + '"><b></b></div>';*/
                        });
                        if(params.FilesAdded){
                            params.FilesAdded();
                        }

                        //console.log(files);
                        that.getUploadIdAndSign(files[0], setting, type, function () {
                            up.start();
                        },params);

                    },
                    UploadProgress: function (up, file) {

                        if(params.UploadProgress){
                            params.UploadProgress();
                        }else {
                            document.getElementById(progress).innerHTML = file.percent+'%';
                            document.getElementById(progress).style.width = file.percent+'%';
                        }
                        /*document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";*/
                    },
                    Error: function (up, err) {
                        if(err.code == '-601'){
                            tools.alert.error('该文件格式不支持!');
                        }else if(err.code == '-600') {
                            tools.alert.error('文件过大!');
                        }else if(err.code == '-700'){
                            tools.alert.error('该图片格式不支持!');
                        }else{
                            tools.alert.error('文件上传失败!');
                        }
                        //document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;

                        if(params.Error){
                            params.Error();
                        }else {
                            document.getElementById(progress).innerHTML = '';
                            document.getElementById(progress).style.width = '';
                        }

                    },
                    //小片上传完成后
                    ChunkUploaded: function (uploader, file, responseObject) {

                        //console.log(responseObject);
                        if(responseObject.status != 200){
                            if(params.ChunkUploaded){
                                params.ChunkUploaded();
                            }else {
                                document.getElementById(progress).innerHTML = '';
                                document.getElementById(progress).style.width = '';
                            }

                            uploader.stop();
                            tools.alert.error('文件上传失败!');

                            return;
                        }

                        if (that.data.total_part > that.data.part_now) {
                            that.setParams(parseInt(that.data.part_now) + 1);
                        }
                    },
                    //上传完成
                    FileUploaded: function(uploader,file,responseObjec){

                        if(responseObjec.status != 200){
                            if(params.FileUploaded){
                                params.FileUploaded();
                            }else {
                                document.getElementById(progress).innerHTML = '';
                                document.getElementById(progress).style.width = '';
                            }
                            tools.alert.error('文件上传失败!');
                            return;
                        }

                        that.setComplete(that.data.upload_id,params);
                    }
                }
            });

            uploader.init();
            that.data.uploader = uploader;
        },


        /* 获取上传id和签名 */
        getUploadIdAndSign: function (file, setting, type, start, params) {
            var that = this;

            var part_size = that.data.uploader.getOption('chunk_size');
            var progress = params.progress;

            if(part_size == 0){
                part_size = file.size;
            }

            //获取上传id
            tools.ajax({
                url: '/api/upload',
                ajaxData: {
                    total_size: file['size'],
                    part_size: part_size,
                    file_type: file['type'],
                    filename: file['name'],
                    upload_setting: setting,
                    upload_type: type
                },
                successFun: function (res) {
                    var upload_id = res.data.upload_id;
                    //console.log(upload_id);
                    that.data.upload_id = upload_id;
                    that.data.total_part = res.data.part_num;
                    that.data.complete_url = res.data.complete_url;
                    that.data.sign = res.list;

                    //分块
                    if (res.data.part_num > 1) {
                        that.data.uploader.setOption('chunk_size',res.data.part_size);
                    }
                    else{
                        that.data.uploader.setOption('chunk_size','0KB');
                    }

                    //console.log(that.data.uploader.getOption());

                    //设置参数
                    that.setParams(1);

                    start();
                },
                errorFun: function (error_data, status, headers, error_obj) {
                    if(params.getUploadIdAndSign){
                        params.getUploadIdAndSign();
                    }else {
                        document.getElementById(progress).innerHTML = '';
                        document.getElementById(progress).style.width = '';
                    }
                    tools.alert.error(error_data.error_msg);
                },
                type: 'POST'
            });
        },

        /* 设置参数 */
        setParams: function (part_now) {
            var that = this;
            var data = that.data.sign[parseInt(part_now) - 1];

            var params = {};

            var url = data.host+'?token=' + tools.cache.get('Authorization');

            if (data.type == 'cloud') {
                params = {
                    key: data.dir + data.filename,
                    policy: data.policy,
                    OSSAccessKeyId: data.accessid,
                    success_action_status: '200', //让服务端返回200,不然，默认会返回204
                    callback: data.callback,
                    signature: data.signature
                };

                url = data.host;
            }
            else if (data.type == 'local') {
                params = {
                    upload_id: data.upload_id,
                    part_now: data.part_now
                };
            }

            that.data.uploader.setOption({
                url: url,
                multipart_params: params
            });

            that.data.part_now = part_now;

        },

        /* 调取完成 */
        setComplete: function (upload_id,params) {
            var that = this;
            var url = that.data.complete_url + upload_id;
            var progress = params.progress || 'progress';

            tools.ajax({
                url: url,
                ajaxData: {},
                successFun: function (res) {
                    if(params.setComplete){
                        params.setComplete();
                    }else {
                        document.getElementById(progress).innerHTML = '';
                        document.getElementById(progress).style.width = '';
                    }
                    typeof that.data.callback === "function" && that.data.callback(res);  //返回当前数据
                },
                errorFun: function (error_data, status, headers, error_obj) {
                    if(params.setComplete){
                        params.setComplete();
                    }else {
                        document.getElementById(progress).innerHTML = '';
                        document.getElementById(progress).style.width = '';
                    }
                    tools.alert.error(error_data.error_msg);
                },
                type: 'PUT'
            });
        }

    };

    win = win || window;
    //重新封装，实例化后返回一个全局对象
    win.upload = function(params){
        return new uploaders(params);
    };
}(window));
