<template>
	<view>
		<u-popup v-model="isShow" mode="center" border-radius="5" z-index="1000">
			<view class="payment" :style="[payStyle]">
				<view class="header u-flex u-row-between u-p-l-30 u-p-r-30 u-p-t-20 u-p-b-20">
					<view class="">{{ title }}</view>
					<u-icon name="close" @click="close"></u-icon>
				</view>
				<view class="u-p-30">
					<view class="alert-warning u-p-20 u-m-b-10">
						<view class="">{{ articleTitle }}</view>
						<view class="price u-m-t-10">付费金额：￥{{ money }}</view>
					</view>

					<view class="u-border-top u-m-t-20">
						<u-radio-group v-model="paytype" class="group">
							<view class="group" v-for="(item, index) in paytypelist" :key="index">
								<u-cell-item :icon="item.icon" :icon-style="item.iconColor" :arrow="false" :title="item.name" @click="selectType(item.value)">
									<u-radio slot="right-icon" :active-color="theme.bgColor" label-size="30" :name="item.value">
										<u-icon size="30" name="arrow-right"></u-icon>
									</u-radio>
								</u-cell-item>
							</view>
						</u-radio-group>
					</view>
				</view>

				<view class="u-text-center u-p-30">
					<view class="">
						<u-button
							type="primary"
							hover-class="none"
							:custom-style="{ width: '80%', height: '60rpx', backgroundColor: theme.bgColor, color: theme.color }"
							size="mini"
							@click="submit"
						>
							立即支付
						</u-button>
					</view>
					<view class="u-m-t-30" v-if="vip > 0">
						<u-button
							type="primary"
							hover-class="none"
							size="mini"
							:custom-style="{ width: '80%', height: '60rpx', backgroundColor: '#18b566', color: theme.color }"
							@click="$Router.push('/pages/my/member?vip='+vip)"
						>
							升级VIP{{ vip }},免费阅读
						</u-button>
					</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import {loginfunc} from '@/common/fa.mixin.js'
export default {
	mixins:[loginfunc],
	props:{
		title:{
			type:String,
			default:'付费阅读'
		},
		articleTitle:{
			type:String,
			default:''
		},
		articleId:{
			type:[String,Number],
			default:0
		},
		money:{
			type:[String,Number],
			default:0
		},
		vip:{
			type:[String,Number],
			default:0
		}
	},
	computed:{
		defaultpaytype(){
			if(this.vuex_config.config){
				return this.vuex_config.config.defaultpaytype;
			}
			return 'balance'
		},
		paytypelist(){
			if(this.vuex_config.config){
				this.paytype = this.vuex_config.config.defaultpaytype;
				let paytypelist = this.vuex_config.config.paytypelist.split(',');
				let list = [];
				paytypelist.map(item=>{
					switch(item){
						// #ifdef APP-PLUS || MP-WEIXIN || H5
						case 'wechat':
							list.push({
								name:'微信支付',
								value:'wechat',
								icon:'weixin-circle-fill',
								iconColor: { color:'#40BA49' }
							})
						break;
						// #endif
						// #ifdef APP-PLUS || H5 || MP-ALIPAY
						case 'alipay':
							if(!this.isWeixin){
								list.push({
									name:'支付宝支付',
									value:'alipay',
									icon:'zhifubao-circle-fill',
									iconColor: { color: '#00AAEE' }
								})
							}
						break;
						// #endif
						case 'balance':
							list.push({
								name:'余额支付',
								value:'balance',
								icon:'rmb-circle-fill',
								iconColor: { color: '#f39c12' }
							})
						break;
					}
				})
				return list;
			}
			return [];
		},
		isWeixin(){
			// #ifndef MP-WEIXIN
			return this.$util.isWeiXinBrowser()
			// #endif

			// #ifdef MP-WEIXIN
			return true;
			// #endif
		},
		payStyle(){
			let style = {};
			if(this.vip>0){
				style.height = this.paytypelist.length == 3 ? '870rpx' : this.paytypelist.length == 2 ? '770rpx' : '670rpx';
			}else{
				style.height = this.paytypelist.length == 3 ? '770rpx' : this.paytypelist.length == 2 ? '670rpx' : '570rpx'
			}
			return style;
		}
	},
	data() {
		return {
			isShow:false,
			paytype:''
		};
	},
	methods:{
		show(){
			this.isShow = true;
		},
		close(){
			this.isShow = false;
		},
		selectType(type){
			this.paytype = type;
		},
		// #ifdef MP-BAIDU
			submit: async function() {
				let res = await this.$api.getArchivesOrder({
					id: this.articleId,
					paytype: 'balance',
					method: 'miniapp'
				});

				if(!res.code){
					this.$u.toast(res.msg);
					return;
				}
				if(this.paytype=='balance'){
					this.close();
					this.$emit('success');
					this.close();
					return;
				}
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: res.data.timeStamp,
					nonceStr: res.data.nonceStr,
					package: res.data.package,
					signType: res.data.signType,
					paySign: res.data.paySign,
					success: rest => {
						this.$u.toast('支付成功！');
						this.$emit('success');
						this.close()
					},
					fail: err => {
						this.$u.toast('fail:' + JSON.stringify(err));
					}
				});
			}
		// #endif

		// #ifdef MP-WEIXIN
			submit: async function() {
				let res = await this.$api.getArchivesOrder({
					id: this.articleId,
					paytype: this.paytype,
					method: 'miniapp'
				});
				if(res.data=='bind'){
					this.$Router.push('/pages/login/wxlogin');
					return;
				}
				if(!res.code){
					this.$u.toast(res.msg);
					return;
				}
				if(this.paytype=='balance'){
					this.close();
					this.$emit('success');
					this.close();
					return;
				}
				uni.requestPayment({
					provider: 'wxpay',
					timeStamp: res.data.timeStamp,
					nonceStr: res.data.nonceStr,
					package: res.data.package,
					signType: res.data.signType,
					paySign: res.data.paySign,
					success: rest => {
						this.$u.toast('支付成功！');
						this.$emit('success');
						this.close()
					},
					fail: err => {
						this.$u.toast('fail:' + JSON.stringify(err));
					}
				});
			},
			// #endif

		// #ifdef H5
			submit: async function() {

				let data = {
					id: this.articleId,
					paytype: this.paytype,
					method: 'wap'
				};

				//在微信环境，且为微信支付
				if (this.isWeixin && this.paytype == 'wechat') {
					data.method = 'mp';
					let res = await this.$api.getArchivesOrder(data);
					if (res.data == 'bind') {
						this.goAuth();
						return;
					};
					if(!res.code){
						this.$u.toast(res.msg);
						return;
					}
					window.WeixinJSBridge.invoke(
						'getBrandWCPayRequest',
						{
							appId: res.data.appId, // 公众号名称，由商户传入
							timeStamp: res.data.timeStamp, // 时间戳，自1970年以来的秒数
							nonceStr: res.data.nonceStr, // 随机串
							package: res.data.package,
							signType: res.data.signType, // 微信签名方式：
							paySign: res.data.paySign // 微信签名
						},
						rest => {
							if (rest.err_msg === 'get_brand_wcpay_request:ok') {
								this.$u.toast('支付成功！');
								this.$emit('success')
								this.close()
							} else if (rest.err_msg === 'get_brand_wcpay_request:cancel') {
								this.$u.toast('取消支付');
							} else {
								this.$u.toast('支付失败');
							}
						}
					);
				} else {
					//非微信环境的wap 支付方法，会返回orderid，再模拟表单提交
					data.returnurl = window.location.href;
					let res = await this.$api.getArchivesOrder(data);
					if(!res.code){
						this.$u.toast(res.msg);
						return;
					}

					if(this.paytype=='balance'){
						this.close();
						this.$emit('success');
						this.close();
						return;
					}
					//URL地址
					if(res.data.toString().match(/^((?:[a-z]+:)?\/\/)(.*)/i)){
						location.href = res.data;
						return;
					}

					//Form表单
					document.getElementsByTagName("body")[0].innerHTML = res.data;
					let form = document.querySelector("form");
					if(form && form.length>0){
						form.submit();
						return;
					}

					//Meta跳转
					let meta = document.querySelector('meta[http-equiv="refresh"]');
					if(meta && meta.length>0){
						setTimeout(function(){
							location.href = meta.content.split(/;/)[1];
						}, 300);
						return;
					}
				}
			}

		// #endif

		// #ifdef APP-PLUS
			submit: async function() {

				let appid = plus.runtime.appid;

				let res = await this.$api.getArchivesOrder({
					id: this.articleId,
					paytype: this.paytype,
					method: 'app',
					appid:appid
				});
				if(!res.code){
					this.$u.toast(res.msg);
					return;
				}
				if(this.paytype=='balance'){
					this.close();
					this.$emit('success');
					this.close();
					return;
				}
				uni.requestPayment({
					provider: this.paytype=='alipay'?'alipay':'wxpay',
					orderInfo: res.data, //微信、支付宝订单数据
					success: function (rest) {
						this.$u.toast('支付成功！');
						this.$emit('success');
						this.close()
					},
					fail: function (err) {
						console.log('fail:' + JSON.stringify(err));
					}
				});
			}
		// #endif
	}
}
</script>

<style lang="scss">
.payment {
	width: 600rpx;

	.header {
		border-bottom: 1px solid #eee;
		background-color: #f8f8f8;
	}

	.alert-info {
		background-color: #d9edf7;
		border-color: #bce8f1;
		color: #3498db;
		border-radius: 6rpx;
	}

	.alert-warning {
		background-color: #fcf8e3;
		border-color: #faebcc;
		color: #f39c12;
		border-radius: 6rpx;
	}
	.price {
		color: red;
	}
	.group {
		width: 100%;
	}
}
</style>
