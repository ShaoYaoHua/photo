<template>
	<u-form :model="form" ref="uForm" style="margin: 20px;">
		<u-form-item label="订单编号" label-width="200" style="margin: 0 20px;">
			<u-input v-model="form.shop_order_id" placeholder="请输入订单编号" />
			<u-button slot="right" type="primary" size="mini" @click="GetInfo">获取</u-button>
		</u-form-item>
		<u-form-item label="昵称" label-width="200" style="margin: 0 20px;">
			<u-input placeholder="请输入订单编号自动获取" :disabled="true" v-model="form.user_nickname" />
		</u-form-item>
		<u-form-item label="收件人" label-width="200" style="margin: 0 20px;">
			<u-input placeholder="请输入订单编号自动获取" :disabled="true" v-model="form.post_receiver" />
		</u-form-item>
		<u-form-item label="联系电话" label-width="200" style="margin: 0 20px;">
			<u-input placeholder="请输入订单编号自动获取" :disabled="true" v-model="form.post_tel" />
		</u-form-item>

		<view style="margin: 0px 20px;10px;20px">填写订单编号后，点击获取，自动加载订单信息哦,注：付款后2-3分钟才可以点击获取</view>


		<view @click="goTeach()" class="weui-cells__tips"
			style="text-decoration:underline;color:black;font-weight: 600;margin: 10px 20px;10px;20px ">
			不会使用？点我查看教程</view>
			
<view v-if="form.picstatus=='normal'" style="text-align: center;width: 100%;margin: 10px;"> <image style=" width: 200px;height: 200px;" :src="vuex_config.config.upload.cdnurl+'/'+vuex_config.config.picture"></image>
</view>
	
	
		<view style="padding: 0px 20px;font-size: 14px; color: #c8c9cc;" v-if="form.sku_spec.length>1"> 需上传图片</view>
		<view style="display: flex;flex-wrap: wrap;text-align: center;   ">
			<view  :class="item.ishaving==0 ?'mz-red':'mz-green'" class="mainlist"
				v-for="(item, index) in form.sku_spec" @click="gophoto(item.title)">
				<view style="width: 80%;">{{item.title}}</view>
				<view >{{item.ishaving==0 ?'待上传':'已上传'}} </view>
			</view>

</view>



		<view style="padding: 0px 20px;font-size: 14px; color: #c8c9cc;" v-if="form.newstatus=='normal'"> 需上传内容</view>
		<view v-if="form.newstatus=='normal'" style="display: flex;flex-wrap: wrap;text-align: center;   ">
			<view  :class="form.desc==null ||form.desc=='' ?'mz-red':'mz-green'" class="mainlist"  @click="godesc">
				<view style="width: 80%;">需上传内容</view>
				<view >{{form.desc==null ||form.desc=="" ?'待上传':'已上传'}} </view>
			</view>

		</view>





	</u-form>
</template>

<script>
	export default {
		onLoad: async function(e) {
			let query = this.$Route.query || e || {};
			this.mainorderid = query.orderid || 0;
			if (this.mainorderid != 0) {
				
				let res = await this.$api.getTikOrder({
					orderid: this.mainorderid
				});
				if (!res.code) {
					this.$u.toast(res.msg);
					return;
				} else {
					if (res.data.mainstatus == 1) {
						this.$u.toast("该订单已关闭");
						return;
					}
					this.form = res.data
				}
			}
		},
		data() {
			return {
				mainorderid: "",
				form: {
					shop_order_id: '',
					intro: '',
					sex: '',
					picstatus:"",
				},
			};
		},
		methods: {
			GetInfo: async function() {
				var orderid = this.form.shop_order_id;
				let res = await this.$api.getTikOrder({
					orderid: orderid
				});
				console.log(res);
				if (!res.code) {
					this.$u.toast(res.msg);
					return;
				} else {
					if (res.data.mainstatus == 1) {
						this.$u.toast("该订单已关闭");
						return;
					}
					this.form = res.data
				}
			},
			goTeach() {
				debugger
				this.$Router.push({
					path: `/pages/teach/teach`,
					query: {
						chichu: 1
					}
				});
			},
			gophoto(id) {
				var orderid = this.form.shop_order_id;
				this.$Router.push({
					path: `/pages/upphoto/upphoto`,
					query: {
						orderid: orderid,
						chichu: id
					}
				});
			},
			godesc() {
				var orderid = this.form.shop_order_id;
				this.$Router.push({
					path: `/pages/desc/desc`,
					query: {
						orderid: orderid,
					}
				});
			},
		}
	};
</script>
<style lang="scss">
	page {
		background-color: #FFFFFF;
	}
	.u-form-item {
		margin: 0 20px;
		padding: 4px 0px !important;
	}
	@-webkit-keyframes a-red {
		from {
			background-color: #fff;
		}
		to {
			background-color: #ffc8c8;
		}
	}
	@keyframes a-red {
		from {
			background-color: #fff;
		}
		to {
			background-color: #ffc8c8;
		}
	}
	.mz-red {
		animation: a-red .7s cubic-bezier(.7, .5, .3, .1) 0s infinite alternate;
	}
	.mz-green {
		background-color: #c6ffc6;
	}
	.mainlist {
		width: 99%;
		margin: 10px 0px;
		display: flex;
		padding: 10px 0px;
		text-align: left;
		    padding-left: 20px;
	}
</style>