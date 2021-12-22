import {request} from '../../../request/index.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    competitionList: []
  },

  pageNum: 1,
  pageSize: 20,
  totalPages: 1,

  /**
   * 获取比赛列表
   */
  async getCompetitionList() {
    const url = '/post-server/competition/getCompetitionList';
    const reqData = {
      pageNum: this.pageNum,
      pageSize: this.pageSize
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        // 计算总页数，更新比赛列表
        const {total} = res.data.data;
        this.totalPages = Math.ceil(total / this.pageSize);
        this.setData({
          competitionList: [...this.data.competitionList, ...res.data.data.competitionList]
        });
      } else {
        wx.showToast({
          title: '获取比赛信息失败',
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
    this.getCompetitionList();
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
   * 每次下拉需要刷新页面数据
   */
  onPullDownRefresh: function () {
    this.pageNum = 1;
    this.setData({
      competitionList: []
    });
    this.getCompetitionList();
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
      this.getCompetitionList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})