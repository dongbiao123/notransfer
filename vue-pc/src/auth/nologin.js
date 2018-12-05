const list = [//无需登录的页面
	'/login',
	'/register',
	'/index',
	'/',
//	'/personal/index',
	'/goods/classification',
	'/goods/list',
	'/goods/details',
	'/login_old',
	'/authorization_error',
	'/forget',
	'/agreement',
	'/article/details'
];

const isUrl = function(url, type) {
	let that = this,
		sym = '==',
		noLoginUrls = '';

	if(type) {
		sym = type;
	}

	for(var i = 0; i < list.length; i++) {

		if(i == 0) {
			noLoginUrls += `"${url}"${sym}"${list[i]}"`;
		} else if(i == list.length - 1) {
			noLoginUrls += `||"${url}"${sym}"${list[i]}"`;
		} else {
			noLoginUrls += `||"${url}"${sym}"${list[i]}"`;
		}
	}

	return eval(noLoginUrls);
}

export default isUrl