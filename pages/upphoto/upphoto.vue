<template>
	<u-form :model="form" ref="uForm">
		<u-form-item label="尺寸" label-width="230">
			<u-input :disabled="true" v-model="form.chicunname" />
		</u-form-item>
		<u-form-item label="需要上传照片数" label-width="230">
			<u-input :disabled="true" v-model="form.nums" />
		</u-form-item>
		<u-form-item label="照片最小要求" label-width="230">
			<u-input :disabled="true" v-model="form.yaoqiu" />
		</u-form-item>
		<u-form-item label="照片比例" label-width="230">
			<u-input :disabled="true" v-model="form.bili" />
		</u-form-item>
		<view style="margin: 15px;padding: 5px;margin-top: 0px;padding-top: 0px;">
			<view class="cu-bar bg-white ">
				<view class="action" style="margin-left: 0rpx;">
					图片上传
				</view>
				<view class="action">
					{{imgList.length}}/{{form.nums}}
				</view>
			</view>
			<view style="color: rgb(144, 147, 153);">宫格类请按照顺序上传，设计按照顺序排版</view>
			<view class="cu-form-group" style="padding-left: 0px;margin-top: 10px;">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage"
						:data-url="imgList[index]">
						<image :src="imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage" v-if="imgList.length<form.nums">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
		</view>
		<l-clipper v-if="show" @success="choosesuccess" @ready="readysuccess" @cancel="show = false"
			:width="form.newbili[0]*1" :height="form.newbili[1]*1" :min-width="form.newbili[0]*1":min-height="form.newbili[1]*1" :max-height="form.newbili[1]*1" :max-width="form.newbili[0]*1"  :min-ratio="0" :is-disable-scale="true"/>

		<!-- 	<view >
			<view style="display: flex;justify-content: space-between;margin: 10px 0px;">
			<view>选择上传</view>
			<view>0/12</view>
			</view>
			<view style="color: rgb(144, 147, 153);font-size: 9px;">宫格类请按照顺序上传，设计按照顺序排版</view>
		</view> -->
		<!-- 	<view style="margin-top: 15px;">
			<u-upload ref="uUpload" :action="action" :auto-upload="false"></u-upload>

		</view> -->

		<u-button style="margin: 15px;" v-if="form.shenhestatus==1||form.shenhestatus==null||form.shenhestatus==0"
			type="primary" @click="submit">提交</u-button>
	</u-form>
</template>

<script>
	import lClipper from '@/components/lime-clipper/'
	export default {

		onLoad(e) {
			let query = this.$Route.query || e || {};
			this.postform.orderid = query.orderid || 0;
			this.postform.chichu = query.chichu || '';
			this.getDetail();
		},
		components: {
			lClipper
		},
		data() {
			return {
				form: {
					chi: '莫妮白色',
					nums: 12,
					yaoqiu: '150kb',
					bili: '2500*2600',
					shenhestatus: ''
				},
				imgList: [],
				show: false,
				url: '',
				postform: {
					orderid: "",
					chichu: "",
					imglist: []
				}
			};
		},
		created() {

		},
		methods: {
			submit() {
				if (this.imgList.length != this.form.nums) {
					this.$u.toast("图片请上传完整");
					return fasel;

				}


				this.postform.imglist = this.imgList;
				var orderid = this.postform.orderid;
				this.$api.PostTikOrder(this.postform).then(res => {
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
				let res = await this.$api.getGuigei({
					guige: this.postform.chichu,
					shop_order_id: this.postform.orderid
				});
				console.log(res);
				if (!res.code) {
					this.$u.toast(res.msg);
					setTimeout(() => {
						this.$Router.replace({
							path: `/pages/upload/upload`,
							query: {
								orderid: orderid
							}
						});
					}, 1500);
					return;
				} else {
					this.form = res.data
					if (res.data.imglist != "") {
						this.imgList = res.data.imglist;
					}
				}
			},
			readysuccess: async function(res) {
				console.log(res);
			},
			choosesuccess: function(res) {
				var that = this;
				var formData = [];
				formData.token =that.vuex_token;
				wx.uploadFile({
					url: "https://photo.yaohua1314.cn/api/common/upload",
					filePath: res.url,
					name: 'file',
						formData: formData,
					success: function(res) {
						var data = JSON.parse(res.data);
						if (!res.code) {
							that.$u.toast(res.msg);
						};
						if (that.imgList.length != 0) {
							that.imgList = that.imgList.concat([data.data.fullurl])
						} else {
							that.imgList = [data.data.fullurl]
						}
						uni.showModal({
						    title: '部分上传成功',
						    content: '当前尺寸的照片上传成功，请务必回到首页确认所有尺寸照片都上传完成!',
							showCancel:false,
						    success: function (res) {
						        if (res.confirm) {
						            console.log('用户点击确定');
						        } else if (res.cancel) {
						            console.log('用户点击取消');
						        }
						    }
						});
						that.show = false;
					},
					error: function(res) {
						app.error("上传头像失败!");
					}
				});
				
				// this.$api.goUpload({
				// 	filePath: res.url
				// }).then(res => {
				// 	this.onSuccess(res)
				// }).catch(function(error) {
				// 	// 处理 getJSON 和 前一个回调函数运行时发生的错误
				// 	console.log('发生错误！', error);
				// 	debugger
				// });

				// .then(res){
				// 	// debugger
				// 	// if (!img.code) {
				// 	// 	this.$u.toast(res.msg);
				// 	// };
				// 	// if (this.imgList.length != 0) {
				// 	// 	this.imgList = this.imgList.concat([img.data.fullurl])
				// 	// } else {
				// 	// 	this.imgList = [img.data.fullurl]
				// 	// }
				// 	// 	this.show = false;
				// }

			},

			onSuccess(res) {
				var that = this;
				if (!res.code) {
					that.$u.toast(res.msg);
				};
				if (that.imgList.length != 0) {
					that.imgList = that.imgList.concat([res.data.fullurl])
				} else {
					that.imgList = [res.data.fullurl]
				}
				that.show = false;
			},

			ChooseImage() {




				this.show = true;
				// this.$u.route({
				// 	// 关于此路径，请见下方"注意事项"
				// 	url: '/uview-ui/components/u-avatar-cropper/u-avatar-cropper',
				// 	// 内部已设置以下默认参数值，可不传这些参数
				// 	params: {
				// 		// 输出图片宽度，高等于宽，单位px
				// 		destWidth: 300,
				// 		// 裁剪框宽度，高等于宽，单位px
				// 		rectWidth: 200,
				// 		// 输出的图片类型，如果'png'类型发现裁剪的图片太大，改成"jpg"即可
				// 		fileType: 'jpg',
				// 	}
				// })


				// uni.chooseImage({
				// 	count: 4, //默认9
				// 	sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				// 	sourceType: ['album'], //从相册选择
				// 	success: (res) => {
				// 		if (this.imgList.length != 0) {
				// 			this.imgList = this.imgList.concat(res.tempFilePaths)
				// 		} else {
				// 			this.imgList = res.tempFilePaths
				// 		}
				// 	}
				// });
			},
			ViewImage(e) {
				uni.previewImage({
					urls: this.imgList,
					current: e.currentTarget.dataset.url
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '系统',
					content: '确定要删除吗？',
					cancelText: '再看看',
					confirmText: '再见',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
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
