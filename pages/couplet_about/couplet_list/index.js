import {request} from '../../../request/index.js';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		coupletType: [],
		coupletDynasty: [],
		coupletFrom: [],
		searchChoice: {
			inputKey: '',
			coupletTypeId: 0,
			coupletDynasty: '',
			coupletFrom: ''
		},
		coupletList: [],
	},

	/**
	 * 分页参数
	 */
	pageNum: 1,
	pageSize: 20,
	totalPages: 1,

	/**
	 * 监听用户搜索栏输入
	 */
	onChange(e) {
		this.setData({
			[`searchChoice.inputKey`]: e.detail,
		});
	},

	/**
	 * 搜索
	 * 用户在键盘点击确定，或者搜获触发
	 */
	onSearch() {
		this.pageNum = 1;
		this.setData({
			coupletList: []
		});
		this.doCoupletSearch();
	},

	/**
	 * 取消搜索
	 * 点击搜索栏取消触发
	 */
	cancelSearch() {
		// 清空输入
		this.setData({
			[`searchChoice.inputKey`]: '',
			coupletList: []
		});
		this.pageNum = 1;
		// 重新获取楹联列表
		this.doCoupletSearch();
	},
	
	/**
	 * 获取楹联类型列表
	 */
	async getCoupletTypeList() {
		const defaultType = [{value: 0,text: "类型"}];
		try {
			const res = await request({url: '/couplet-server/couplet-type/getCoupletType'});
			if (res.data.code === 20000) {
				let {coupletTypeList} = res.data.data;
				// 替换键值对的键，满足下拉框需要
				let coupletTypeList1 = coupletTypeList.map((item) => {
					return{
						"value":item.coupletTypeId,
						"text":item.coupletTypeDetail
					}
				});
				coupletTypeList1 = defaultType.concat(coupletTypeList1);
				this.setData({
					coupletType: coupletTypeList1
				})
			} else {
				wx.showToast({
					title: '获取类型失败',
					duration: 1000,
					icon: 'none'
				});
			}
		} catch (error) {
			console.log(error);
		}
	},

	/**
	 * 获取页面初始筛选数据
	 */
	getScreens() {
		// 暂时提供检索当代和古代（非当代）
		let coupletDynasty = [
			{ text: '朝代', value: '朝代' },
			{ text: '古代', value: '古代' },
			{ text: '当代', value: '当代' },
		];
		// 暂时提供检索创作（帖子）和文献（非创作）
		let coupletFrom = [
			{ text: '出处', value: '出处' },
			{ text: '文献', value: '文献' },
			{ text: '创作', value: '创作' },
		];
		// 页面数据初始化
		this.setData({
			coupletDynasty: coupletDynasty,
			coupletFrom: coupletFrom,
			searchChoice: {
				inputKey: '',
				coupletTypeId: 0,
				coupletDynasty: '朝代',
				coupletFrom: '出处'
			}
		})
	},

	/**
	 * 监听用户选择筛选楹联类型
	 */
	changeType(e) {
		this.setData({ 
			[`searchChoice.coupletTypeId`]: e.detail,
			coupletList: []
		});
		this.pageNum = 1;
		this.doCoupletSearch();
	},
	
	/**
	 * 监听用户选择筛选朝代
	 */
	changeDynasty(e) {
		this.setData({ 
			[`searchChoice.coupletDynasty`]: e.detail,
			coupletList: []
		});
		this.pageNum = 1;
		this.doCoupletSearch();
	},

	/**
	 * 监听用户选择筛选出处
	 */
	changeFrom(e) {
		this.setData({ 
			[`searchChoice.coupletFrom`]: e.detail,
			coupletList: []
		});
		this.pageNum = 1;
		this.doCoupletSearch();
	},
	
	/**
	 * 获取楹联列表，检索楹联
	 */
	async doCoupletSearch() {
		const url = '/couplet-server/couplet/doCoupletSearch';
		const reqData = {
			// 解析参数
			...this.data.searchChoice,
			pageNum: this.pageNum,
			pageSize: this.pageSize
		}
		try {
			const res = await request({url: url, data: reqData});
			if(res.data.code === 20000) {
				const {total} = res.data.data;
				this.totalPages = Math.ceil(total / this.pageSize);
				this.setData({
					coupletList: [...this.data.coupletList, ...res.data.data.coupletList]
				});
			} else {
				wx.showToast({
					title: '获取楹联失败',
					duration: 1000,
					icon: 'none'
				});
			}
		} catch (error) {
			console.log(error);
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getScreens();
		this.getCoupletTypeList();
		this.doCoupletSearch();
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
		this.pageNum = 1;
		this.setData({
			coupletList: []
		});
		this.doCoupletSearch();
		wx.stopPullDownRefresh();
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		if(this.pageNum >= this.totalPages) {
			wx.showToast({
				title: '到底啦！',
				duration: 1000,
				icon: 'none'
			});
		} else {
			this.pageNum++;
			this.doCoupletSearch();
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})