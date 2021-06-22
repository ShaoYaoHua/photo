<template>
	<view>
		 <view style="text-align: center;">
		                <video id="myVideo" :src="vuex_config.config.upload.cdnurl+'/'+vuex_config.config.video"
		                    @error="videoErrorCallback"  enable-danmu danmu-btn controls></video>
		 </view>
					
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
