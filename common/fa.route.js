import Vue from 'vue'
//这里仅示范npm安装方式的引入，其它方式引入请看最上面【安装】部分
import Router from 'uni-simple-router'

Vue.use(Router)
//初始化
const router = new Router({
	APP: {
		animation: {
			animationType: 'pop-in',
			animationDuration: 300
		}
	},
	encodeURI:false,  
	routes: ROUTES //路由表
});

//全局路由前置守卫
router.beforeEach((to, from, next) => {
	//去的页面是登录类型，来的页面不是登录类型，就缓存此页面，排除用户协议
	if(to.path.indexOf('/login/') != -1 && from.path.indexOf('/login/') == -1 && from.path.indexOf('agreement') == -1){				
		uni.setStorageSync('last_page', {path:from.path,query:from.query});
	}	
	next();
})
// 全局路由后置守卫
router.afterEach((to, from) => {
	// console.log('999', to, from)
})
export default router;
