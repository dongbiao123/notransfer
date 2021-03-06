/* 配置错误处理 */

/*
 例子:
 {
     errcode: 'NO LOGIN',                         //错误代码
     prompt: '你还没有登录或登录超时,请登录...',      //错误提示,空字符为不提示
     url: '/login'                               //跳转地址,true为刷新当前页,空字符串为不跳转
     fun: function () {                          //操作方法,空字符串为无

     }
 }
 */

let is_init = true;
let array = [], num = 0;

export default {
    data:[
        {
            errcode: 'AUTHORIZATION_INVALID',
            prompt: '',
            url: '',
            fun: function(res) {
                array.push(res.option);
    
                if (is_init) {
                    tools.cache.del('Authorization');
                    getToken(array);
                }
    
                is_init = false;
    
                function getToken (array){
                    tools.ajax({
                        url: '/api/init',
                        headers: {
                            'X-ISSIGN': 1
                        },
                        isLoading: true,
                        successFun: function(res) {
                            tools.cache.set('Authorization', res.token);
                            tools.cache.set('is_sign', res.is_sign);
                            tools.cache.set('sk', res.sk);
                            next(array);
                        },
                        errorFun: function(error) {
                            log.error('获取签名失败');
                        },
                        type: 'GET'
                    });
                };
    
                function next(dataArr) {
                    for(let i = 0; i < dataArr.length; i++) {
                        num++;
                        tools.ajax(dataArr[i]);
                    }
                    if (num === dataArr.length) {
                        is_init = true;
                        array = [];
                        num = 0;
                    }
                }
            }
        },
        {
            errcode: 'NO LOGIN',
            prompt: '你还没有登录或登录超时,请登录...',
            url: '/login',
            fun: function () {
                //更改本地登录状态
                tools.cache.set('Authorization', '');
                tools.cache.set('isLogin', 0);
                tools.cache.del('nickname');
            }
        },
        {
            errcode: 'PERMISSION_DENIED',
            prompt: '你没有访问权限,3秒后跳转到首页',
            fun: function () {
                setTimeout(function () {
                    tools.router.push({path: '/index'});
                },3000)
            }
        }
    ]
}
