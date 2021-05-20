<template>
	<view class="">
		<!-- 顶部导航 -->
		<fa-navbar title="详情"></fa-navbar>
		<!-- 内容 -->
		<view class="u-p-30 u-bg-white">
			<view class="u-font-40"><text v-text="archivesInfo.title"></text></view>
			<view class="u-m-t-20 u-font-22 u-tips-color"><text v-text="archivesInfo.create_date"></text></view>
			<view class="u-flex u-row-between u-m-t-20 u-font-24 detail-tag">
				<view class="u-flex">
					<view class="u-flex u-col-center u-m-r-30" v-if="archivesInfo.user" @click="toUser(archivesInfo.user_id)">
						<u-avatar size="40" :src="archivesInfo.user.avatar"></u-avatar>
						<view class="u-font-22 u-m-l-10 u-line-1" style="max-width: 70px;">{{ archivesInfo.user.nickname }}</view>
					</view>
					<view class="">
						<u-icon name="thumb-up-fill" color="#aaa" size="20"></u-icon>
						<text class="u-m-l-5 u-m-r-5" v-text="archivesInfo.likes"></text>
						点赞
					</view>
					<view class="u-m-l-30">
						<u-icon name="chat-fill" color="#aaa" size="20"></u-icon>
						<text class="u-m-l-5 u-m-r-5" v-text="archivesInfo.comments"></text>
						评论
					</view>
					<view class="u-m-l-30">
						<u-icon name="eye-fill" color="#aaa" size="20"></u-icon>
						<text class="u-m-l-5 u-m-r-5" v-text="archivesInfo.views"></text>
						浏览
					</view>
				</view>
				<view class="">
					<!-- #ifdef MP-WEIXIN -->
					<button class="share-btn" open-type="share">
						<u-icon name="share-fill"></u-icon>
						<text class="u-p-l-5">分享</text>
					</button>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<button class="share-btn" @click="copyUrl">
						<u-icon name="share-fill"></u-icon>
						<text class="u-p-l-5">分享</text>
					</button>
					<!-- #endif -->
				</view>
			</view>
		</view>
		<view class="u-flex u-flex-wrap u-p-l-30 u-p-r-30 u-p-t-30">
			<view class="product-images" v-for="(item, index) in imagesList" :key="index">
				<u-image width="100%" height="220" :src="item" @click="lookImage(index)"></u-image>
			</view>
		</view>
		<view class="u-p-30 u-bg-white u-line-height">
			<u-parse
				:html="archivesInfo.content"
				:tag-style="vuex_parse_style"
				:domain="vuex_config.config ? vuex_config.config.upload.cdnurl : ''"
				@linkpress="navigate"
			></u-parse>
		</view>
		<view class="u-p-30 u-bg-white">
			<view class="u-flex u-flex-wrap">
				<view class="u-m-r-10" v-for="(item, index) in archivesInfo.tagslist" :key="index">
					<u-tag :text="item.name" shape="circle" type="info" mode="light" @click="goTag(item.name)" />
				</view>
			</view>
			<view class="u-flex u-row-right">
				<view class="">
					<u-button
						type="primary"
						hover-class="none"
						:custom-style="{ backgroundColor: theme.bgColor, color: theme.color }"
						size="mini"
						shape="circle"
						@click="collection(id, 'archives')"
					>
						<u-icon name="heart-fill"></u-icon>
						<text class="u-p-l-5" v-text="`收藏`"></text>
					</u-button>
				</view>
				<view class="u-m-l-15">
					<u-button
						type="primary"
						hover-class="none"
						:custom-style="{ backgroundColor: theme.bgColor, color: theme.color }"
						size="mini"
						shape="circle"
						@click="likes"
					>
						<u-icon name="thumb-up"></u-icon>
						<text class="u-p-l-5" v-text="`点赞（${archivesInfo.likes || 0}）`"></text>
					</u-button>
				</view>
			</view>
		</view>

		<u-gap height="20" bg-color="#f4f6f8"></u-gap>
		<view class="u-bg-white u-p-30">
			<view class="u-p-b-10 u-tips-color">发表评论</view>
			<view class=""><u-input v-model="content" type="textarea" placeholder="请输入评论内容" :border="false" /></view>
			<view class="u-flex u-row-center">
				<u-button
					type="primary"
					hover-class="none"
					:custom-style="{ backgroundColor: theme.bgColor, color: theme.color, width: '60vw' }"
					size="medium"
					v-if="!vuex_token"
					@click="goLogin"
				>
					立即登录
				</u-button>
				<u-button
					type="primary"
					hover-class="none"
					:custom-style="{ backgroundColor: theme.bgColor, color: theme.color, width: '60vw' }"
					size="medium"
					v-else
					@click="submit"
				>
					立即评论
				</u-button>
			</view>
		</view>
		<u-gap height="20" bg-color="#f4f6f8"></u-gap>
		<view class="u-p-30 u-bg-white">
			<view class="u-p-b-10 u-tips-color">评论列表</view>
			<view class="comment" v-for="(item, index) in commentList" :key="item.id">
				<view class="left" @click="toUser(item.user_id)"><image :src="item.user && item.user.avatar" mode="aspectFill"></image></view>
				<view class="right">
					<view class="top">
						<view class="u-light-color">
							<u-icon name="account-fill" color="#c0c4cc"></u-icon>
							<text class="u-p-l-10 name u-line-1">{{ item.user && item.user.nickname }}</text>
							<text class="u-m-l-30">{{ item.create_date }}</text>
						</view>
						<view class="replay" @click="replay(item)">
							<u-icon name="chat" :size="30"></u-icon>
							<view class="opeate">回复</view>
						</view>
					</view>
					<view class="content"><rich-text :nodes="item.content"></rich-text></view>
				</view>
			</view>
			<view class="" v-if="!commentList.length"><u-empty text="暂无评论"></u-empty></view>
		</view>
		<!-- 回到顶部 -->
		<u-back-top :scroll-top="scrollTop" :icon-style="{ color: theme.bgColor }" :custom-style="{ backgroundColor: lightColor }"></u-back-top>
		<!-- 底部导航 -->
		<fa-tabbar></fa-tabbar>
	</view>
</template>

<script>
import { tools, vote } from '@/common/fa.mixin.js';
// #ifdef H5
import { weixinShare } from '@/common/fa.weixin.mixin.js';
// #endif
export default {
	mixins: [
		tools,
		vote,
		// #ifdef H5
		weixinShare
		// #endif
	],
	onLoad(e) {
		let query = this.$Route.query || e || {};
		this.id = query.id || 0;
		this.diyname = query.diyname || '';
		this.getArchivesDetail();
	},
	onShow() {
		// #ifdef MP-BAIDU
		if (this.archivesInfo.id) {
			this.setPagesInfo();
		}
		// #endif
	},
	watch: {
		content(newValue, oldValue) {
			if (!newValue) {
				this.pid = 0;
			}
		}
	},
	data() {
		return {
			id: 0,
			diyname: '',
			archivesInfo: {},
			commentList: [],
			imagesList: [],
			content: '',
			pid: 0,
			scrollTop: 0,
			page: 1,
			has_more: true
		};
	},
	methods: {
		getArchivesDetail: async function() {
			let res = await this.$api.getArchivesDetail({ id: this.id, diyname: this.diyname });
			if (!res.code) {
				this.$u.toast(res.msg);
				return;
			}
			this.archivesInfo = res.data.archivesInfo || {};
			this.commentList = res.data.commentList || [];
			this.imagesList = res.data.archivesInfo.productdata;
			this.$u.mpShare.title = res.data.archivesInfo.title;
			uni.setNavigationBarTitle({
				title: this.archivesInfo.title
			});
			// #ifdef MP-BAIDU
				this.setPagesInfo();
			// #endif
			// #ifdef H5
			if (this.$util.isWeiXinBrowser()) {
				this.wxShare({
					title: this.archivesInfo.title,
					desc: this.archivesInfo.description,
					link: window.location.href,
					img: this.archivesInfo.image
				});
			}
			// #endif
		},
		// #ifdef MP-BAIDU
		setPagesInfo() {
			let sitename = (this.vuex_config && this.vuex_config.config && this.vuex_config.config.sitename) || '';
			swan.setPageInfo({
				title: this.archivesInfo.title+'-'+sitename,
				articleTitle: this.archivesInfo.title+'-'+sitename,
				keywords: this.archivesInfo.keywords,
				description: this.archivesInfo.description,
				releaseDate: this.$u.timeFormat(this.archivesInfo.publishtime, 'yyyy-mm-dd hh:MM:ss'),
				image: this.archivesInfo.images,
				likes: this.archivesInfo.likes,
				comments: this.archivesInfo.comments,
				collects: this.archivesInfo.views,
				success: res => {
					console.log('setPageInfo success', res);
				},
				fail: err => {
					console.log('setPageInfo fail', err);
				}
			});
		},
		// #endif
		goCommentIndex() {
			this.$api.goCommentIndex({ page: this.page, aid: this.archivesInfo.id }).then(res => {
				if (res.code == 1) {
					this.has_more = res.data.commentList.length > 0;
					this.commentList = [...this.commentList, ...res.data.commentList];
				}
			});
		},
		toUser(user_id) {
			this.$Router.push('/pages/user/user?user_id=' + user_id);
		},
		replay(item) {
			if (!item.user) {
				this.$u.toast('用户不存在');
				return;
			}
			this.content = `@${item.user.nickname} `;
			this.pid = item.id;
		},
		goTag(name) {
			this.$Router.push({
				path: '/pages/tag/tag',
				query: { name: name }
			});
		},
		submit: async function() {
			if (!this.content) {
				this.$u.toast('请输入评论内容！');
				return;
			}
			let res = await this.$api.goCommentPost({
				content: this.content,
				aid: this.id,
				pid: this.pid //回复的用户上一条ID
			});
			this.$u.toast(res.msg);
			if (!res.code) {
				return;
			}
			this.content = '';
			if (res.data && res.data.comment) {
				this.commentList = [res.data.comment, ...this.commentList];
			}
		},
		goLogin() {
			this.$Router.push('/pages/login/mobilelogin');
		}
	},
	onPageScroll(e) {
		this.scrollTop = e.scrollTop;
	},
	onReachBottom() {
		if (this.has_more) {
			this.page += 1;
			this.goCommentIndex();
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f4f6f8;
}
.detail-tag {
	color: #aaa;
}
.comment {
	background-color: #ffffff;
	display: flex;
	padding: 30rpx;
	.left {
		image {
			width: 64rpx;
			height: 64rpx;
			border-radius: 50%;
			background-color: #f2f2f2;
		}
	}
	.right {
		flex: 1;
		padding-left: 20rpx;
		.top {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 10rpx;
			.replay {
				display: flex;
				align-items: center;
				color: #9a9a9a;
				font-size: 26rpx;
				.opeate {
					margin-right: 4rpx;
					color: #9a9a9a;
				}
			}
			.name {
				max-width: 100rpx;
			}
		}
		.content {
			margin-bottom: 10rpx;
			word-break: break-word;
		}
	}
}
.comment:not(:last-child) {
	border-bottom: 1px solid #eee;
}
.product-images {
	width: 50%;
	margin-bottom: 30rpx;
}
.product-images:nth-child(2n) {
	padding-left: 15rpx;
}
.product-images:nth-child(2n + 1) {
	padding-right: 15rpx;
}
.share {
	padding: 0;
	margin: 0;
	border: 0;
	background-color: transparent;
	line-height: inherit;
	border-radius: 0;
	font-size: inherit;
	color: #999;
}
.share::after {
	border: none;
}
</style>
