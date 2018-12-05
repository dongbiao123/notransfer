import isUrl from './nologin.js';
import store from '../store';
import { MessageBox } from 'element-ui';
import { Promise } from 'core-js/library/web/timers';

const auth = {

	/**
	 * 权限验证
	 */
	check (next, option, to, from) {
		return new Promise((resolve,reject)=>{
			let that = this,
			data = {
				isRepeat: 0,
				type: 0
				, getLoginState: false
				, authUrl: '/api/wechat/auth'
				, redirectUrl: false
			};

			data = Object.assign(data, option); 

			if(!option){
				next();
			}
			else{

				// 没有签名 且 可以获取签名
				if (tools.isEmpty(tools.cache.get('Authorization')) && window.canauthinit === 1) {
					that.getSign(next, data, to, from);
				}
				else {
					
					// type: false 则 next
					if(!data.type){
						typeof next === 'function' ? next() : null;
					}
					else if(typeof data.type === 'object' && data.type instanceof Array && data.type.length === 0) {
						typeof next === 'function' ? next() : null;
					}
					// type: 1 , 授权
					else if (data.type === 'auth') {
						auth();
					}
					// type: 2 , 登录
					else if (data.type === 'login') {
						login();
					}
					// type: Array [auth: 授权， login：登录]
					else if (typeof data.type === 'object' && data.type instanceof Array && data.type.length > 0) {
						asyncFun(data.type).catch(e=>{
							log.error(e)
						})
					}
				}

			}

			async function asyncFun(dataArr) {
				for(let i = 0; i < dataArr.length; i++) {
					if(dataArr[i] === 'auth'){
						await promiseFiy(auth);
					}
					else if(dataArr[i] === 'login') {
						await promiseFiy(login);
					}
					else{
						reject('请传入正确参数(type)，授权：auth，登录：login');
					}
				}
			}

			function promiseFiy(fun) {
				return new Promise((kidResolve,kidReject)=>{
					fun(kidResolve);
				})
			}

			async function auth (kidResolve) {
				// 初次打开或刷新页面 && 可以询问登录状态
			
				if (window.mainInit && data.getLoginState) {
					window.mainInit = 0;
					that.isLogin(data.getLoginState.url, next, data, to, from, that.canAuth, resolve, kidResolve)
				}
				else if (!window.mainInit && data.getLoginState && Number(tools.cache.get('isAuth')) === 2) {
					that.isLogin(data.getLoginState.url, next, data, to, from, that.canAuth, resolve, kidResolve)
				}
				// 初次打开或刷新页面 && 不可以询问登录状态 && 未授权
				else if (window.mainInit && !data.getLoginState && !Number(tools.cache.get('isAuth'))) {
					window.mainInit = 0;
					that.canAuth({status: true}, next, data, to, from, resolve, kidResolve)
				}
				// 初次打开或刷新页面 && 不可以询问登录状态 && 授权中
				else if (window.mainInit && !data.getLoginState && Number(tools.cache.get('isAuth')) === 2) {
					window.mainInit = 0;
					tools.cache.set('isAuth', 1)
					resolve(that.authData);
				}
				// 页面跳转 && 未授权
				else if (!window.mainInit && !Number(tools.cache.get('isAuth'))) {
					that.canAuth({status: true}, next, data, to, from, resolve, kidResolve)
				}
				// 页面跳转 && 可以询问登录状态 && 已授权 && 是否每次跳转都返回结果
				else if(!window.mainInit && data.getLoginState && Number(tools.cache.get('isAuth')) === 1 && data.isRepeat === 1) {
					resolve(that.authData);
				}
				else {
					if(typeof data.type === 'object' && data.type instanceof Array && data.type.length > 1) {
						kidResolve();
					}
					else{
						typeof next === 'function' ? next() : null;
					}
				}
			}

			function login (kidResolve) {
				if(tools.url.params('usertest') && config.environment === 'debug') {
					typeof next === 'function' ? next() : null;
				}
				else if (isUrl(to.path) || data.redirectUrl === to.path) {
					typeof next === 'function' ? next() : null;
				}
				// 初次打开或刷新页面 && 可以询问登录状态
				else if (window.mainInit && data.getLoginState.url) {
					window.mainInit = 0;
					that.isLogin(data.getLoginState.url, next, data, to, from, that.canLogin, resolve, kidResolve)
				}
				else if (window.mainInit && Number(tools.cache.get('isLogin')) === 0) {
					window.mainInit = 0;
					tools.router.replace({path: data.redirectUrl, query: {callback: to.fullPath}});
				}
				else if (window.mainInit && data.getLoginState && Number(tools.cache.get('isLogin')) === 1) {
					window.mainInit = 0;
					resolve(that.authData);
                }
                else if (window.mainInit && !data.getLoginState && Number(tools.cache.get('isLogin')) === 1) {
                    window.mainInit = 0;
                    typeof next === 'function' ? next() : null;
                }
                // else if (!window.mainInit && option.getLoginState && that.authData[option.getLoginState.isLogin]) {
                //     tools.cache.set('isLogin', 1)
                //     next();
                // }
				else if (!window.mainInit && Number(tools.cache.get('isLogin')) === 0 && data.redirectUrl) {
					tools.cache.set('isLogin', 0)
					tools.router.replace({path: data.redirectUrl, query: {callback: to.fullPath}});
				}
				else {
					typeof next === 'function' ? next() : null;
				}
			}
		})
	},

	/* 是否需要登录 */
	canLogin (res, next, option, to, from, resolve, kidResolve) {
		let data = res.data,
			callback = option.callback;
		if(res.status && data && !option.redirectUrl) {
            log.error('请传入参数：redirectUrl');
        }
        else if (res.status && data && option.redirectUrl && !option.getLoginState.isLogin) {
            log.error('请传入参数：getLoginState 中的 isLogin');
        }
        else if(res.status && data && data[option.getLoginState.isLogin]){   // 已登录
            tools.cache.set('isLogin', 1)
            kidResolve();
			typeof resolve === 'function' ? resolve(res) : null
		}
		else if (res.status && data && !data[option.getLoginState.isLogin]) {    // 未登录
			tools.cache.set('isLogin', 0)
			tools.router.replace({path: option.redirectUrl, query: {callback: to.fullPath}});
			// typeof resolve === 'function' ? resolve(res) : null
        }
		else {
			typeof resolve === 'function' ? resolve({status: false, message: '登录异常'}) : null
		}
	},

	/* 是否需要授权 */
	canAuth (res, next, option, to, from, resolve, kidResolve) {
		let that = this,
			data = res.data;
		
		if(res.status && data && data[option.getLoginState.isAuth]){   // 已授权
			tools.cache.set('isAuth', 1)
			kidResolve();
			typeof resolve === 'function' ? resolve(res) : null
		}
		else if (res.status && data && !data[option.getLoginState.isAuth]) {    // 未授权
			tools.cache.set('isAuth', 2)
			goAuth();
		}
		else if((!res.status && !data) || (!res.status && data && data.length === 0)) {
			tools.cache.set('isAuth', 2)
			goAuth();
		}
		else if ((res.status && !data) || (res.status && data && data.length === 0)) {
			tools.cache.set('isAuth', 2)
			goAuth();
		}
		else {
			typeof resolve === 'function' ? resolve({status: false, message: '登录异常'}) : null
		}

		function goAuth () {
			// 授权后返回的地址
            let callbackUrl = location.origin + to.fullPath;

            // 授权地址和所带参数
            let url = window.config.api.url + option.authUrl +
                '?callback=' + (encodeURIComponent(callbackUrl)) +
                '&token=' + (tools.cache.get('Authorization')) +
                '&type=' + 'mp';

            if(!tools.isEmpty(tools.url.params('usertest'))){
                url += '&usertest='+tools.url.params('usertest');
            }

            window.location.href = url;
		}
	},

	/* 获取签名 */
	getSign (next, option, to, from) {
		let that = this;
        window.canauthinit = 0;
        tools.alert.loading();
        tools.ajax({
            url: '/api/init',
            ajaxData: {},
            successFun: function (res) {
                tools.cache.set('Authorization', res.token);
                window.canauthinit = 1;
                tools.alert.closeLoading();
                if(typeof next == 'function'){
                	//重新check
                	that.check(next, option, to, from);
                }
               
            },
            errorFun: function (error) {
                log.error('获取签名失败');
                window.canauthinit = 1;
            },
            type: 'GET'
        });
	},

	/* 获取登录状态 */
    isLogin: function (url, next, option, to, from, callback, resolve, kidResolve) {
		let that = this;
		
        tools.alert.loading();
        tools.ajax({
            url: url,
            ajaxData: {},
            successFun: function (res) {
				tools.alert.closeLoading();
				that.authData = res.data;
            	typeof callback === 'function' ? callback(res, next, option, to, from, resolve, kidResolve) : null
            },
            errorFun: function (error) {
                log.debug('获取登录状态失败, 请查看接口');
                let error_msg = '服务器异常,尝试刷新';
                if(error && error.error_msg) {
                	error_msg = error.error_msg;
				}
				MessageBox.alert(error_msg).then(action => {
					window.location.reload();
				});
                // typeof callback === 'function' ? callback(error, next, option, to, from, resolve) : null
                tools.cache.del('isLogin');
                tools.cache.del('isAuth');
            },
            type: 'GET'
        });
    },
	
	authData: {
        status: true
    }
}

export default auth