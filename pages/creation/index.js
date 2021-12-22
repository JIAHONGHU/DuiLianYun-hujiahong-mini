import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import {request} from '../../request/index.js';

Page({

	/**
	 * 页面的初始数据
	 */
	//初始化数据
	data: {
		isShow: false,
		postTypeList: [],
		tempData: '',
		postContent: '',
		errorMessage: '',
		formData: {
			userId: '',
			postTitle: '',
			postUserName: '',
			postFirstLine: '',
			postSecondLine: '',
			postAppreaciation: '',
			postExplanation: '',
			postTypeId: 0
		},
	},

	/**
	 * 监听用户选择类型
	 */
	changeType(e) {
		this.setData({
			[`formData.postTypeId`]: e.detail
		})
	},

	/**
	 * 监听用户输入作者
	 */
	changeUserName(e) {
		this.setData({
			[`formData.postUserName`]: e.detail,
		})
	},

	/**
	 * 监听用户输入内容
	 */
	changeContent(e) {
		this.setData({
			postContent: e.detail.value,
		});
	},

	doFocus() {
		this.setData({
			errorMessage: '',
		});
	},

	doBlur(e) {
		if(this.data.postContent) {
			let titleAndLine = this.data.postContent.split(/[(\r\n)\r\n]+/);
			titleAndLine = titleAndLine.filter((item, index) => {
				return item && item != '';
			});
			this.setData({
				[`formData.postTitle`]: titleAndLine[0],
				[`formData.postFirstLine`]: titleAndLine[1],
				[`formData.postSecondLine`]: titleAndLine[2]
			});
			if(titleAndLine.length === 0) {
				this.setData({
					tempData: '标题: ' + '' + '\n上联: ' + '' + '\n下联: '
				});
			} else if(titleAndLine.length === 1) {
				this.setData({
					tempData: '标题: ' + titleAndLine[0] + '\n上联: ' + '' + '\n下联: '
				});
			} else if(titleAndLine.length === 2) {
				this.setData({
					tempData: '标题: ' + titleAndLine[0] + '\n上联: ' + titleAndLine[1] + '\n下联: '
				});
			} else {
				this.setData({
					tempData: '标题: ' + titleAndLine[0]	+ '\n上联: ' + titleAndLine[1] + '\n下联: ' + titleAndLine[2]
				});
			}
			this.setData({
				isShow: true
			});
		} else {
			this.setData({
				isShow: false
			});
		}
	},

	/**
	 * 监听用户输入赏析
	 */
	changeAppreaciation(e) {
		this.setData({
			[`formData.postAppreaciation`]: e.detail.value
		})
	},

	/**
	 * 监听用户输入注释
	 */
	changeExplanation(e) {
		this.setData({
			[`formData.postExplanation`]: e.detail.value
		})
	},

	/**
	 * 提交创作帖子，等待审核
	 */
	async submit() {
		if(this.data.postContent.split(/[(\r\n)\r\n]+/).length != 3) {
			this.setData({
				errorMessage: '请检查格式是否正确'
			});
		} else {
			// 注释，赏析可以为空
			if(this.data.formData.postTypeId > 0 && this.data.formData.postUserName
					&& this.data.formData.postTitle && this.data.formData.postFirstLine
					&& this.data.formData.postSecondLine) {
						try {
							const res = await request({url: '/post-server/post/addPost', method: 'POST', data: this.data.formData});
							if (res.data.code === 20000) {
								wx.showToast({
									title: '提交成功',
								});
								// 提交成功之后需要重置数据
								this.reset();
							}								
						} catch (error) {
							console.log(error);
						}
			} else {
				Notify({
					message: '请填写完整带星号内容',
					safeAreaInsetTop: true,
					top: 60,
					background: "#faae58",
					duration: 1000
				});				
			}
		}
	},

	/**
	 * 重置数据
	 */
	reset() {
		this.setData({
			postContent: '',
			tempData: '',
			isShow: false,
			formData: {
				userId: wx.getStorageSync('userSession').userId,
				postTitle: '',
				postUserName: wx.getStorageSync('userSession').userName,
				postFirstLine: '',
				postSecondLine: '',
				postAppreaciation: '',
				postExplanation: '',
				postTypeId: 0
			}
		})
	},

	/**
	 * 获取帖子类型
	 */
	async getPostType() {
		const defaultType = [{value: 0,text: "请选择"}];
		try {
			const res = await request({url: '/post-server/post-type/getPostType'});
			if (res.data.code === 20000) {
				let {postType} = res.data.data;
				// 替换键值对的键，支持下拉组件
				let postTypeList = postType.map((item) => {
					return{
						"value":item.postTypeId,
						"text":item.postTypeDetail
					}
				});
				postTypeList = defaultType.concat(postTypeList);
				this.setData({
					postTypeList
				})
			} else {
				wx.showToast({
					icon: 'none',
					title: '获取信息失败',
					duration: 1000
				})
			}
		} catch (error) {
			console.log(error);
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.setData({
			[`formData.userId`]: wx.getStorageSync('userSession').userId,
			[`formData.userName`]: wx.getStorageSync('userSession').userName,
		})
		this.getPostType();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		// 每次页面重新显示，就需要重置页面
		this.reset();
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {
		this.getPostType();
		wx.stopPullDownRefresh();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})