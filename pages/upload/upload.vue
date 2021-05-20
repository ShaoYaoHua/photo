<template>
	<u-form :model="form" ref="uForm" style="margin: 20px;">
		<u-form-item label="订单编号" label-width="200">
			<u-input v-model="form.name" placeholder="请输入订单编号" />
			<u-button slot="right" type="primary" size="mini">获取</u-button>
		</u-form-item>
		<u-form-item label="昵称" label-width="200">
			<u-input placeholder="请输入订单编号自动获取" disabled=true v-model="form.intro" />
		</u-form-item>
		<u-form-item label="收件人" label-width="200">
			<u-input placeholder="请输入订单编号自动获取" disabled=true v-model="form.intro" />
		</u-form-item>
		<u-form-item label="联系电话" label-width="200">
			<u-input placeholder="请输入订单编号自动获取" disabled=true v-model="form.intro" />
		</u-form-item>

		<view style="margin: 10px 0px;">填写订单编号后，点击获取，自动加载订单信息哦,注：付款后5分钟才可以点击获取</view>

		<view style="display: flex;flex-wrap: wrap;text-align: center;">
			<view style="width: 49%;    margin: 5px 0px;">
				<u-tag text="莫妮白色-长款-冲印 1张" type="error" />
			</view>
			<view style="width: 49%;    margin: 5px 0px;">
				<u-tag text="莫妮白色-长款-冲印 1张" type="error" />
			</view>
			<view style="width: 49%;    margin: 5px 0px;">
				<u-tag text="莫妮白色-长款-冲印 6张" type="error" />
			</view>
		</view>
	</u-form>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					name: '',
					intro: '',
					sex: ''
				},
				checkboxList: [{
						name: '苹果',
						checked: false,
						disabled: false
					},
					{
						name: '雪梨',
						checked: false,
						disabled: false
					},
					{
						name: '柠檬',
						checked: false,
						disabled: false
					}
				],
				radioList: [{
						name: '鲜甜',
						disabled: false
					},
					{
						name: '麻辣',
						disabled: false
					}
				],
				radio: '',
				switchVal: false
			};
		}
	};
</script>
