import {request} from '../../../request/index.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    emblemSrc: "../../../icons/images/emblem.jpg",
    memberInformation:{
      memberName: "",
      memberBirthday: "",
      memberPhone: "",
      memberUid: "",
      memberCreateTime: "",
    },
    bitIcon: []
  },

  /**
   * 获取会员信息
   */
  async getMemberInformation() {
    // 发送请求
    try{
      const userData = {
        userId: wx.getStorageSync('userSession').userId
      };
      let url="/user-server/member/getMemberInformation";
      const res = await request({url: url, data: userData});
      if(res.data.code == 20000){
        let {memberInformation} = res.data.data;
        console.log(memberInformation);
        this.setData({
          memberInformation
        })
        this.getDays();
      }
      else{
        wx.showToast({
          title: '获取信息失败，请重试',
          icon: 'none',
          duration: 1000,
        })
      }
    } catch(error) {
      // 提示请求失败信息
      console.log(error)
    }
    
  },

  /**
   * 根据用户成为会员的日期，计算会员成为会员多少天
   */
  getDays(){
    var day = "";
    var time = this.data.memberInformation.memberCreateTime.split("-");
    var nowTime = new Date();
    var createTime = new Date(time[0],time[1] - 1, time[2] - 1);
    var day = Math.floor((nowTime.getTime() - createTime.getTime()) / 1000 / 60 / 60 / 24);
    var days = day.toString();
    
    var arrIcon = [
      "iconfont icon-shuzi0",
      "iconfont icon-shuzi0",
      "iconfont icon-shuzi0",
      "iconfont icon-shuzi0",
      "iconfont icon-shuzi0"
    ]
    var bit = 4;
    for (var i = days.length - 1; i >= 0; i--) {
      arrIcon[bit] = "iconfont icon-shuzi" + days[i];
      bit--;
    }
    this.setData({
      bitIcon:arrIcon
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMemberInformation();
    this.getDays();
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