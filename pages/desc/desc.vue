<template>
	<u-form :model="form" ref="uForm">
	    <view class="page__bd">
	        <view class="weui-cells__title">定制内容</view>
	        <view class="weui-cells weui-cells_after-title">
	            <view class="weui-cell">
	                <view class="weui-cell__bd">
	                    <textarea  class="weui-textarea" maxlength="40" placeholder="请输入定制内容" v-model="form.desc" style="height: 15em" ></textarea>
	                    <view class="weui-textarea-counter"></view>
	                </view>
	            </view>
	        </view>
	    </view>
	
	
	<view style="padding: 15px;">
		<u-button style="margin: 15px;" 
			type="primary" @click="submit">提交</u-button>
	</view>
	
	</u-form>
</template>

<script>
	import lClipper from '@/components/lime-clipper/'
	export default {

		onLoad(e) {
			let query = this.$Route.query || e || {};
			this.postform.orderid = query.orderid || 0;
			this.getDetail();
		},
		components: {
			lClipper
		},
		data() {
			return {
				postform: {
					orderid: "",
					chichu: "",
					desc:"",
				},
				form:{}
			};
		},
		created() {

		},
		methods: {
			submit() {
				var orderid = this.postform.orderid;
				this.$api.UpdateOrder(this.form).then(res => {
					this.$u.toast(res.msg);
					if (res.code) {
						setTimeout(() => {
							this.$Router.replace({
								path: `/pages/upload/upload`,
								query: {
									orderid: orderid
								}
							});
						}, 1500);
					}
				});

			},
			getDetail: async function() {
				var orderid = this.postform.orderid;
				let res = await this.$api.getTikOrder({
					orderid: orderid
				});
				console.log(res);
				if (!res.code) {
					this.$u.toast(res.msg);
					return;
				} else {
					this.form = res.data
				
				}
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
	.weui-cells__title {
	    margin-top: 16px;
	    margin-bottom: 3px;
	    padding-left: 16px;
	    padding-right: 16px;
	    color: var(--weui-FG-1);
	    font-size: 14px;
	    line-height: 1.4;
	}
	.weui-cells__title+.weui-cells {
	    margin-top: 0;
	}
	.weui-cells {
	    margin-top: 8px;
	    background-color: var(--weui-BG-2);
	    line-height: 1.41176471;
	    font-size: 17px;
	    overflow: hidden;
	    position: relative;
	}
	.weui-btn-area {
	    margin: 48px 16px 8px;
	}
	.weui-cells:after, .weui-cells:before {
	    content: " ";
	    position: absolute;
	    left: 0;
	    right: 0;
	    height: 1px;
	    color: var(--weui-FG-3);
	    z-index: 2;
	}
	.weui-cells:before {
	    top: 0;
	    border-top: 1px solid var(--weui-FG-3);
	    transform-origin: 0 0;
	    transform: scaleY(.5);
	}
	.weui-cell {
	    padding: 16px;
	    position: relative;
	    display: flex;
	    -webkit-box-align: center;
	    align-items: center;
	}
	.weui-cells:after {
	    bottom: 0;
	    border-bottom: 1px solid var(--weui-FG-3);
	    transform-origin: 0 100%;
	    transform: scaleY(.5);
	}
	.weui-cells:after, .weui-cells:before {
	    content: " ";
	    position: absolute;
	    left: 0;
	    right: 0;
	    height: 1px;
	    color: var(--weui-FG-3);
	    z-index: 2;
	}
	.weui-cell__bd {
	    -webkit-box-flex: 1;
	    flex: 1;
	}
	.weui-textarea {
	    display: block;
	    border: 0;
	    resize: none;
	    background: transparent;
	    width: 100%;
	    color: inherit;
	    font-size: 1em;
	    line-height: inherit;
	    outline: 0;
	}
</style>
