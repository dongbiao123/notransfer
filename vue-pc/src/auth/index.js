import LoginTest from './main.js';

export default function (to, from, next) {
    LoginTest.check(next, {
        type: false
    }, to, from)
    
    // LoginTest.check(next, {
    //     // isRepeat: 1,                     // 是否开启每次验证都返回结果， 0：授权成功后只返回一次
    //     type: ['auth', 'login']             // []空数组或者false：只获取签名，['auth']：微信授权，['login']：登录
    //     , authUrl: '/api/wechat/auth'       // 微信授权地址
    //     , redirectUrl: '/login'   
    //     , getLoginState: {
    //         url: '/api/islogins',           // 获取登录状态接口
    //         isAuth: 'is_wechat_auth',       // 判断是否授权字段名称
    //         isLogin: 'is_user'              // 判断是否登录字段名称
    //     }
    // }, to, from)
    // .then((res)=>{
	// 	console.log(res, 999999999999999999)
    // })

}