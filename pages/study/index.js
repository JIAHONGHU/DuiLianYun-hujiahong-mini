import {request} from '../../request/index.js';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		documentListA:[],
		documentListB:[],
		active: 0,
	},

	pageSize: 20,
	A_pageNum: 1,
	A_totalPages: 1,
	B_pageNum: 1,
	B_totalPages: 1,

  /**
   * 切换tab
   */
	onChange(e) {
		// console.log(e);
		const {index} = e.detail;
		this.setData({
			active: index,
		});
		// 只有当前列表为空,才发请求
		if(this.data.active === 0) {
			if(this.data.documentListA.length === 0) {
				this.getDocumentList();
			}
		} else {
			if(this.data.documentListB.length === 0) {
				this.getDocumentList();
			}
		}
	},
	
  /**
   * 获取评论列表
   */
	async getDocumentList() {
		const url = '/file-server/document/getDocumentList';
		let reqData;
		if(this.data.active === 0) {
			reqData = {
				type: this.data.active,
				pageNum: this.A_pageNum,
				pageSize: this.pageSize
			};				
		} else {
			reqData = {
				type: this.data.active,
				pageNum: this.B_pageNum,
				pageSize: this.pageSize
			};		
		}
		try {
			const res = await request({url: url, data: reqData});
			if( res.data.code === 20000 ) {
				const {total} = res.data.data;
				if(this.data.active === 0) {
					this.A_totalPages = Math.ceil(total / this.pageSize);
					this.setData({
						documentListA: [...this.data.documentListA, ...res.data.data.documentList]
					});						
				} else {
					this.B_totalPages = Math.ceil(total / this.pageSize);
					this.setData({
						documentListB: [...this.data.documentListB, ...res.data.data.documentList]
					});	
				}
			} else {
				wx.showToast({
					title: '获取资料失败',
					duration: 1000,
					icon: 'none'
				});
			}
		} catch (error) {
			console.log(error)
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
			this.getDocumentList();
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
		if(this.data.active === 0) {
			this.A_pageNum = 1;
			this.setData({
				documentListA: []
			});
			this.getDocumentList();	
		} else {
			this.B_pageNum = 1;
			this.setData({
				documentListB: []
			});
			this.getDocumentList();
		}
		wx.stopPullDownRefresh();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		if(this.data.active === 0) {
			if( this.A_pageNum >= this.A_totalPages) {
				wx.showToast({
					title: '到底啦!',
					icon: 'none',
					duration: 1000
				});
			} else {
				this.A_pageNum++;
				this.getDocumentList();
			}				
		} else {
			if( this.B_pageNum >= this.B_totalPages) {
				wx.showToast({
					title: '到底啦!',
					icon: 'none',
					duration: 1000
				});
			} else {
				this.B_pageNum++;
				this.getDocumentList();
			}			
		}

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})