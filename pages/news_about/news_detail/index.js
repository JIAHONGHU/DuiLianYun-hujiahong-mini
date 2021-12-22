import {request} from '../../../request/index.js';

//获取应用实例
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsId: '',
    newsContent: ''
  },

  /**
   * 获取新闻内容
   */
  async getNewsContent() {
    const url = '/post-server/news/getNewsContent';
    const reqData = {
      newsId: this.data.newsId
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        // 使用towxml将markdown转换为wxml
        const newsContent = app.towxml(res.data.data.newsContent, 'markdown', {
          // base:'https://xxx.com',				// 相对资源的base路径
          // theme:'dark',					// 主题，默认`light`
          // events:{					// 为元素绑定的事件方法
          //   tap:(e)=>{
          //     console.log('tap',e);
          //   }
          // }
        })
        this.setData({
          newsContent
        });
      } else {
        wx.showToast({
          title: '获取新闻详情失败',
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
    this.setData({
      newsId: options.newsId
    });
    this.getNewsContent();
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