import {request} from '../../../request/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData:{
      userId:"",
      userPortrait:'',
      userNickname:'',
      userMotto:'',
      userName:'',
      userBirthday:'',
      userLocation:'',
      userPhone:'',
      userEmail:'',
      userIntroduction:''
    }
  },

  /**
   * 获取用户信息
   */
  async getUserInformation(){
    // 发送请求
    try{
      const userData={
        userId: wx.getStorageSync('userSession').userId
      };
      let url="/user-server/user/getUserInformation";
      const res = await request({url: url,data: userData});
      if(res.data.code == 20000){
        let {formData} = res.data.data;
        this.setData({
          formData
        })
      } else{
        wx.showToast({
          title: '获取信息失败，请重试',
          icon: 'none'
        })
      }
    }catch (error) {
      console.log("获取用户信息失败");
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInformation();
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