<template>
	<u-form :model="form" ref="uForm" style="margin: 20px;">
		<u-form-item label="订单编号" label-width="200" style="margin: 0 20px;">
			<u-input v-model="form.shop_order_id" placeholder="请输入订单编号" />
			<u-button slot="right" type="primary" size="mini" @click="GetInfo">获取</u-button>
		</u-form-item>
		<u-form-item label="昵称" label-width="200"style="margin: 0 20px;">
			<u-input placeholder="请输入订单编号自动获取" :disabled="true" v-model="form.user_nickname" />
		</u-form-item>
		<u-form-item label="收件人" label-width="200"style="margin: 0 20px;">
			<u-input placeholder="请输入订单编号自动获取" :disabled="true" v-model="form.post_receiver" />
		</u-form-item>
		<u-form-item label="联系电话" label-width="200"style="margin: 0 20px;">
			<u-input placeholder="请输入订单编号自动获取" :disabled="true" v-model="form.post_tel" />
		</u-form-item>

		<view style="margin: 0px 20px;10px;20px">填写订单编号后，点击获取，自动加载订单信息哦,注：付款后5分钟才可以点击获取</view>

		<view style="display: flex;flex-wrap: wrap;text-align: center;    margin-top: 20px;">
			
			<view  v-if="item.name=='尺寸'" style="width: 49%;margin: 10px 0px;" v-for="(item, index) in form.sku_spec">
				<u-tag :text="item.value" type="error" @click="gophoto(item.value)" />
			</view>
		
		
		</view>
	</u-form>
</template>

<script>
	export default {
		onLoad: async function(e) {
			let query = this.$Route.query || e || {};
			this.mainorderid = query.orderid || 0;
			if(this.mainorderid!=0)
			{
				let res = await this.$api.getTikOrder({ orderid:this.mainorderid });
				if (!res.code) {
					this.$u.toast(res.msg);
					return;
				}else{
					this.form=res.data
				}
			}
			
			
		},
		data() {
			return {
				mainorderid:"",
				form: {
					shop_order_id: '',
					intro: '',
					sex: ''
				},
				
			};
		},
		methods:{
			GetInfo: async function(){
				var orderid=this.form.shop_order_id;
				let res = await this.$api.getTikOrder({ orderid:orderid });
				console.log(res);
				if (!res.code) {
					this.$u.toast(res.msg);
					return;
				}else{
					this.form=res.data
				}
				
			},
			
			
			
			gophoto(id) {
				var orderid=this.form.shop_order_id;
				this.$Router.push({
					path: `/pages/upphoto/upphoto`,
					query: { orderid: orderid,chichu:id }
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
</style>
