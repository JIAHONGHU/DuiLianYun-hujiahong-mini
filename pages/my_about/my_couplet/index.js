import {request} from '../../../request/index.js'
import {formatTime} from '../../../utils/util.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupletTypeList:[],
    active: 0,
    coupletList: []
  },

  /**
   * 分页信息
   */
  pageNum: 1,
  pageSize: 20,
  totalPages: 1,

  /**
   * 获取楹联类型列表
   */
  async getCoupletTypeList() {
    // 发送请求
    try {
      const res = await request({url: '/couplet-server/couplet-type/getCoupletType'});
      if (res.data.code === 20000) {
        const {coupletTypeList} = res.data.data;
        this.setData({
          coupletTypeList: coupletTypeList
        });
      } else {
        wx.showToast({
          title: '获取类型失败',
          duration: 1000,
          icon: 'none'
        });
      }
    } catch (error) {
      // 提示请求失败信息
      console.log(error);
    }
  },

  /**
   * 根据类型获取楹联列表
   */
  async getCoupletByType() {
    const url = '/couplet-server/couplet/getCoupletListByCoupletType';
    const reqData = {
      userId: wx.getStorageSync('userSession').userId,
      coupletTypeId: this.data.active + 1,
      pageSize: this.pageSize,
      pageNum: this.pageNum
    }
    // 发送请求
    try {
      const res = await request({url: url, data: reqData});
      if( res.data.code === 20000 ) {
        const {total} = res.data.data;
        this.totalPages = Math.ceil( total / this.pageSize );
        let {coupletList} = res.data.data;
        coupletList.forEach(item => {
          item.coupletCreateTime = formatTime(item.coupletCreateTime);
        });
        this.setData({
          coupletList: [...this.data.coupletList, ...coupletList]
        });
      } else {
        wx.showToast({
          title: '获取楹联失败',
          duration: 1000,
          icon: 'none'
        });
      }
    } catch (error) {
      // 提示请求失败信息
      console.log(error);
    }
  },

  /**
   * 切换楹联类型
   */
  changeType(e) {
    // console.log(e);
    const {index} = e.currentTarget.dataset;
    this.setData({
      active: index,
      coupletList: []
    })
    // 清空已有的数据
    this.pageNum = 1;
    // 给后端发请求，获取帖子
    this.getCoupletByType();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCoupletTypeList();
    this.getCoupletByType();
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
    this.getCoupletByType();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if( this.pageNum >= this.totalPages ) {
      wx.showToast({
        title: '到底啦！',
        icon: 'none',
        duration: 1000,
      });
    } else {
      this.pageNum++;
      this.getCoupletByType();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})