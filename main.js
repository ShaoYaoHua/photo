import Vue from 'vue'
import App from './App'
import router from '@/common/fa.route'

Vue.config.productionTip = false

App.mpType = 'app'

import * as Util from '@/common/util.js'
//原型追加工具函数
Vue.prototype.$util = Util;
Vue.prototype.$api = {};//定义api对象

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView);


// 引入uView对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare)

// 此处为演示vuex使用，非uView的功能部分
import store from '@/store'

// 引入uView提供的对vuex的简写法文件
let vuexStore = require('@/store/$u.mixin.js')
Vue.mixin(vuexStore)

//皮肤色处理
let styleMixin = require('@/common/fa.style.mixin.js')
Vue.mixin(styleMixin)

import { RouterMount } from 'uni-simple-router'

const app = new Vue({
	store,
    ...App
})

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import httpInterceptor from '@/common/http.interceptor.js'
Vue.use(httpInterceptor, app)

// http接口API抽离，免于写url或者一些固定的参数
import httpApi from '@/common/http.api.js'
Vue.use(httpApi, app)

//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
	RouterMount(app,'#app');
// #endif

// #ifndef H5
	app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif
