import {request} from '../../../request/index.js';
import { formatTime} from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList: []
  },

  /**
   * 分页参数
   */
  pageNum: 1,
  pageSize: 20,
  totalPages: 1,

  /**
   * 获取新闻列表
   */
  async getNewsList() {
    const url = '/post-server/news/getNewsList';
    const reqData = {
      pageNum: this.pageNum,
      pageSize: this.pageSize
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        const {total} = res.data.data;
        this.totalPages = Math.ceil(total / this.pageSize);
        let {newsList} = res.data.data;
        newsList.forEach(item => {
          item.newsTime = formatTime(item.newsTime);
        });
        this.setData({
          newsList: [...this.data.newsList, ...newsList]
        });
      } else {
        wx.showToast({
          title: '获取新闻列表失败',
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
    this.getNewsList();
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
      newsList: []
    });
    this.getNewsList();
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
      this.getNewsList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})