import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';
import {request} from '../../../request/index.js';

const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		phoneIsRight: true,
		idcardIsRight: true,
		// 暂时只支持上传一张图片
		fileList: [],
		formData: {
			memberPhone: '',
			memberIdcard: '',
			memberApplicationReason: '',
			memberBindedUserId: '',
			memberType: 1
		},
	},

	/**
	 * 监听用户输入电话
	 */
	changeMemberPhone(e) {
		this.setData({
			[`formData.memberPhone`]: e.detail
		});
	},

	/**
	 * 监听用户输入身份证
	 */
	changeMemberIdcard(e) {
		this.setData({
			[`formData.memberIdcard`]: e.detail
		});
	},

	/**
	 * 验证手机号输入是否符合格式
	 */
	losePhoneBlur() {
		// 1开头的11位数字
		if(!(/^[1]\d{10}$/.test(this.data.formData.memberPhone))){
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
   * 验证身份证
   */
  loseIdcardBlur() {
    if(!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.data.formData.memberIdcard))){
      this.setData({
        idcardIsRight: false
      })
    } else {
      this.setData({
        idcardIsRight: true
      });
    }
  },

	/**
	 * 上传图片
	 */
	uploadImg(e) {
		// console.log(e);
		wx.showLoading({
			title: '图片上传中',
		});
		const { file } = e.detail;
		// 调用微信的上传文件接口
		wx.uploadFile({
			// 服务器接口
			url: app.globalData.baseURL + '/user-server/member/uploadPortrait',
			// 文件临时路径
			filePath: file.url,
			// 文件凭证
			name: 'file',
			header: {
				token: wx.getStorageSync('usersession').token
			},
			success: (res) => {
				// 返回的res是一个字符串格式，需要将其转换为JSON对象格式
				const result = JSON.parse(res.data);
				if(result.code == 20000) {
					// 上传成功之后，替换图片路径
					const {fileList} = this.data;
					fileList.push({url: result.data.url});
					this.setData({
						fileList,
						[`formData.memberApplicationReason`]: result.data.url
					});
					wx.showToast({
						title: '图片上传成功',
						duration: 1000,
					});						
				} else {
					wx.showToast({
						title: '图片上传失败',
						icon: 'none',
						duration: 1000
					});
					// 上传失败就清空数组
					this.setData({
						fileList: []
					});
				}
			},
			fail: (res) => {
				console.log(res);
				// 上传失败就清空数组
				this.setData({
					fileList: []
				});
			},
			complete: () => {
				wx.hideLoading();
			}
		})
	},

	/**
	 * 删除图片
	 */
	async deleteImg(event) {
		// 从参数中拿取删除图片的数组下标
		const delIndex = event.detail.index;
		const url = '/user-server/member/deletePortrait';
		const reqData = {
			url: this.data.fileList[delIndex].url
		};
		try {
			const res = await request({url: url, data: reqData, method: 'POST'});
			if(res.data.code === 20000) {
				// 请求成功，从图片列表中将该图片删除，并刷新页面显示
				const { fileList } = this.data;
				fileList.splice(delIndex, 1);
				this.setData({
					fileList,
					[`formData.memberApplicationReason`]: ''
				});
				wx.showToast({
					title: '图片删除成功',
					duration: 1000,
				});
			} else {
				wx.showToast({
					title: '图片删除失败',
					duration: 1000,
					icon: 'none'
				});
			}
		} catch (error) {
			console.log(error);
		}
	},

	/**
	 * 提交材料
	 */
	async submit() {
		// 如果数据为空，不允许提交
		if(this.data.formData.memberApplicationReason && this.data.formData.memberIdcard
				&& this.data.formData.memberPhone && this.data.formData.member) {
					// 手机号和身份证号是否正确
					if(!this.data.phoneIsRight || !this.data.idcardIsRight) {
						return;
					}				
					const url = '/user-server/member/memberCertification';
					try {
						const res = await request({url: url, data: this.data.formData, method: 'POST'});
						if(res.data.code === 20000) {
							wx.showToast({
								title: '提交材料成功',
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
								title: '提交材料失败',
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
			// 图片，两个id不重置
			[`formData.memberPhone`]: '',
			[`formData.memberIdcard`]: ''
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		// 获取页面初始化数据
		this.setData({
			[`formData.memberType`]: 1,
			[`formData.memberBindedUserId`]: wx.getStorageSync('userSession').userId
		});
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