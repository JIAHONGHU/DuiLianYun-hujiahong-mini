import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';
import { provinces } from "../../../utils/provinces";
import {request} from '../../../request/index.js';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// 初始省份选择
		initValue: 0,
		totalProvinces : [],
		phoneIsRight: true,
		emailIsRight: true,
		// 暂时只支持上传一张图片
		// fileList: [],
		formData: {
			competitionId: '',
			manuscriptUserId: '',
			manuscriptUserName: '',
			manuscriptContent: '',
			// manuscriptContentImage: '',
			manuscriptUserProvince: '',
			manuscriptUserAddress: '',
			manuscriptUserPhone: '',
			manuscriptUserEmail: ''
		},
	},

	/**
	 * 获取utils的省份信息
	 */
	getProvinces() {
		const defaultProvince = [{
			value: 0,
			text: "请选择省份"
		}];
		const totalProvinces = defaultProvince.concat(provinces);
		this.setData({
			totalProvinces
		});
	},

	/**
	 * 监听用户选择省份
	 */
	changeManuscriptUserProvince(e) {
		this.setData({
			[`formData.manuscriptUserProvince`]: e.detail
		})
	},

	/**
	 * 监听用户输入姓名
	 */
	changeManuscriptUserName(e) {
		this.setData({
			[`formData.manuscriptUserName`]: e.detail
		})
	},

	/**
	 * 监听用户输入地址
	 */
	changeManuscriptUserAddress(e) {
		this.setData({
			[`formData.manuscriptUserAddress`]: e.detail
		})
	},

	/**
	 * 监听用户输入手机号
	 */
	changeManuscriptUserPhone(e) {
		this.setData({
			[`formData.manuscriptUserPhone`]: e.detail
		})
	},

	/**
	 * 监听用户输入邮箱
	 */
	changeManuscriptUserEmail(e) {
		this.setData({
			[`formData.manuscriptUserEmail`]: e.detail
		})
	},

	/**
	 * 监听用户输入作品
	 */
	changeManuscriptContent(e) {
		this.setData({
			[`formData.manuscriptContent`]: e.detail.value
		})
	},

	/**
	 * 验证手机号输入是否符合格式
	 */
	losePhoneBlur() {
		// 1开头的11位数字
		if(!(/^[1]\d{10}$/.test(this.data.formData.manuscriptUserPhone))){
			this.setData({
				phoneIsRight: false
			})
		} else {
			this.setData({
				phoneIsRight: true
			});
		}
	},

	/**
	 * 验证邮箱输入是否符合格式
	 */
	loseEmailBlur(){
		// xxx@xx.xx
		if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(this.data.formData.manuscriptUserEmail))) {
			this.setData({
				emailIsRight: false
			})
		} else {
			this.setData({
				emailIsRight: true
			});
		}
	},

	// /**
	//  * 上传图片
	//  */
	// uploadImg(e) {
	// 	// console.log(e);
	// 	wx.showLoading({
	// 		title: '图片上传中',
	// 	});
	// 	const { file } = e.detail;
	// 	// 调用微信的上传文件接口
	// 	wx.uploadFile({
	// 		// 服务器接口
	// 		url: 'https://duilianyun.com/post-server/manuscript/upload',
	// 		// 文件临时路径
	// 		filePath: file.url,
	// 		// 文件凭证
	// 		name: 'file',
	// 		header: {
	// 			token: wx.getStorageSync('usersession').token
	// 		},
	// 		success: (res) => {
	// 			// 返回的res是一个字符串格式，需要将其转换为JSON对象格式
	// 			const result = JSON.parse(res.data);
	// 			if(result.code == 20000) {
	// 				// 上传成功之后，替换图片路径
	// 				const {fileList} = this.data;
	// 				fileList.push({url: result.data.url});
	// 				this.setData({
	// 					fileList,
	// 					[`formData.manuscriptContentImage`]: result.data.url
	// 				});
	// 				wx.showToast({
	// 					title: '图片上传成功',
	// 					duration: 1000,
	// 				});						
	// 			} else {
	// 				wx.showToast({
	// 					title: '图片上传失败',
	// 					icon: 'none',
	// 					duration: 1000
	// 				});
	// 				// 上传失败就清空数组
	// 				this.setData({
	// 					fileList: []
	// 				});
	// 			}
	// 		},
	// 		fail: (res) => {
	// 			console.log(res);
	// 			// 上传失败就清空数组
	// 			this.setData({
	// 				fileList: []
	// 			});
	// 		},
	// 		complete: () => {
	// 			wx.hideLoading();
	// 		}
	// 	})
	// },

	// /**
	//  * 删除图片
	//  */
	// async deleteImg(event) {
	// 	// 从参数中拿取删除图片的数组下标
	// 	const delIndex = event.detail.index;
	// 	const url = '/post-server/manuscript/deleteFile';
	// 	const reqData = {
	// 		url: this.data.fileList[delIndex].url
	// 	};
	// 	try {
	// 		const res = await request({url: url, data: reqData});
	// 		if(res.data.code === 20000) {
	// 			// 请求成功，从图片列表中将该图片删除，并刷新页面显示
	// 			const { fileList } = this.data;
	// 			fileList.splice(delIndex, 1);
	// 			this.setData({
	// 				fileList,
	// 				[`formData.manuscriptContentImage`]: ''
	// 			});
	// 			wx.showToast({
	// 				title: '图片删除成功',
	// 				duration: 1000,
	// 			});
	// 		} else {
	// 			wx.showToast({
	// 				title: '图片删除失败',
	// 				duration: 1000,
	// 				icon: 'none'
	// 			});
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// },

	/**
	 * 提交投稿
	 */
	async submit() {
		// 如果数据为空，不允许提交投稿
		if(this.data.formData.manuscriptUserName && this.data.formData.manuscriptUserPhone
				&& this.data.formData.manuscriptUserProvince != 0 && this.data.formData.manuscriptUserAddress && this.data.formData.manuscriptUserEmail && thi
				.data.formData.manuscriptContent) {
					// 手机号和邮箱是否正确
					if(!this.data.phoneIsRight || !this.data.emailIsRight) {
						return;
					}
					// // 图片和作品文字是否有其一
					// if(!this.data.formData.manuscriptContent && !this.data.formData.manuscriptContentImage) {
					// 	Notify({
					// 		message: '图片和作品文字必须有其一噢！',
					// 		safeAreaInsetTop: true,
					// 		background: "#faae58",
					// 		duration: 2000
					// 	});
					// } else {
					// 满足所有条件，提交表单
					const url = '/post-server/manuscript/addManuscript';
					try {
						const res = await request({url: url, data: this.data.formData, method: 'POST'});
						if(res.data.code === 20000) {
							wx.showToast({
								title: '投稿成功',
								duration: 2000
							});
							// 提交表单之后，回退页面，需要设置延时
							setTimeout(() => {
								wx.navigateBack({
									delta: 1,
								});
							}, 2000); 
						} else {
							wx.showToast({
								title: '投稿失败',
								duration: 1000,
								icon: 'none'
							});
						}
					} catch (error) {
						console.log(error);
					}							
				} else {
					Notify({
						message: '请填写完整带星号内容！',
						safeAreaInsetTop: true,
						background: "#faae58",
						duration: 2000
					});
				}
	},
	
	/**
	 * 重置页面
	 */
	reset() {
		this.setData({
			initValue: 0,
			// 图片，两个id不重置
			formData: {
				manuscriptUserId: this.data.formData.manuscriptUserId,
				competitionId: this.data.formData.competitionId,
				// manuscriptContentImage: this.data.formData.manuscriptContentImage,
				manuscriptUserName: '',
				manuscriptContent: '',
				manuscriptUserProvince: '',
				manuscriptUserAddress: '',
				manuscriptUserPhone: '',
				manuscriptUserEmail: ''
			}
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// 获取页面初始化数据
		this.setData({
			[`formData.competitionId`]: options.competitionId,
			[`formData.manuscriptUserId`]: wx.getStorageSync('userSession').userId
		});
		this.getProvinces();
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