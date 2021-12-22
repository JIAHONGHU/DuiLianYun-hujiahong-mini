// pages/competition_about/competition_award/index.js
import {request} from '../../../request/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    competitionId: '',
    topList: [],
    firstList: [],
    secondList: [],
    thirdList: []
  },

  async getAllAwards() {
    let params = {
      competitionId: this.data.competitionId
    };
    const url = '/post-server/award/back/getAllAward';
    try {
      const res = await request({url: url, data: params});
      this.handleData(res.data.data.awardList)
    } catch (error) {
      wx.showToast({
        title: '获取作品失败，请重试',
        duration: 2000,
        icon: 'none'
      });
    }
  },

  handleData(awardList) {
    awardList.forEach(item => {
      item.awardContentMarkdown = app.towxml(item.awardContentMarkdown, 'markdown');
    });
    this.setData({
      topList: awardList.filter(item => {
        return item.awardDetail == '特等奖';
      }),
      firstList: awardList.filter(item => {
        return item.awardDetail == '一等奖';
      }),
      secondList: awardList.filter(item => {
        return item.awardDetail == '二等奖';
      }),
      thirdList: awardList.filter(item => {
        return item.awardDetail == '三等奖';
      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      competitionId: options.competitionId
    });
    this.getAllAwards();
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
    this.getAllAwards();
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