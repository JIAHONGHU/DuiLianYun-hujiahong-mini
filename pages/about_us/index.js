// pages/about_us/index.js

import {request} from '../../request/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeNames: ['0'],
    // 楹联协会基本信息
    associationInfo: {
      basicInfo: '',
      briefInfo: '',
      leadershipInfo: '',
      howToAddUs: '',      
    },

    emblemSrc:"../../icons/images/emblem.jpg"
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  onOpen(event) {
    Toast(`展开: ${event.detail}`);
  },
  onClose(event) {
    Toast(`关闭: ${event.detail}`);
  },

  async getAssociationInfo() {
    const url = '/user-server/association-information/getAssociationInfo';
    try {
      const res = await request({url: url});
      if(res.data.code === 20000) {
        this.setData({
          associationInfo: res.data.data.associationInfo
        });
      } else {
        wx.showToast({
          title: '获取协会信息失败',
          duration: 2000,
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
    this.getAssociationInfo();
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
    this.getAssociationInfo();
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