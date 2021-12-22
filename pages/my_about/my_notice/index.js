import {request} from '../../../request/index.js';
import {formatTime} from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeList: [],
  },

  /**
   * 分页信息
   */
  pageNum: 1,
  pageSize: 20,
  totalPages: 1,

  /**
   * 获取通知列表
   */
  async getNoticeList() {
    const url = '/user-server/notice/getNoticeList';
    const reqData = {
      userId: wx.getStorageSync('userSession').userId,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    }
    // 发送请求
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        const {total} = res.data.data;
        this.totalPages = Math.ceil(total / this.pageSize);
        let {noticeList} = res.data.data;
        noticeList.forEach(item => {
          item.noticeTime = formatTime(item.noticeTime);
        })
        this.setData({
          noticeList: [...this.data.noticeList, ...res.data.data.noticeList]
        });
      } else {
        wx.showToast({
          title: '获取通知失败',
          duration: 1000,
          icon: 'none'
        });
      }
    } catch (error) {
      // 提示请求失败信息
      console.log(error);
    }
  },

  async setNoticeRead() {
    const url = '/user-server/notice/setNoticeRead';
    const reqData = {
      userId: wx.getStorageSync('userSession').userId
    };
    try {
      const res = await request({url: url, data: reqData, method: 'POST'});
      if( res.data.code === 20000 ) {
        console.log('标记所有未读通知成功')
      } else {
        console.log('标记所有未读通知失败');
      }
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getNoticeList();
    this.setNoticeRead();
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
      noticeList: []
    });
    this.getNoticeList();
    this.setNoticeRead();
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
      this.getNoticeList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})