import {request} from '../../request/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFromModify: false,
    userId: '',
    myInfo: {
      userPortrait: "",
      userNickname: "",
      userMotto: "",
      userType: 0
    },
    noticeNum: 0
  },

  pageNumber: 1,

  /**
   * 退出小程序
   */
  exit() {
    wx.exitMiniProgram({
      success: (res) => {
        // 清除个人缓存，下次进入时需要重新登陆，否则不需要登陆了
        wx.removeStorageSync('userSession');
      },
    })
  },

  /**
   * 修改资料
   */
  modifyInformation() {
    this.setData({
      isFromModify: true
    });
    wx.navigateTo({
      url: '/pages/my_about/modify_information/index',
    })
  },

  /**
   * 申请会员
   */
  applyMember() {
    // 判断用户是不是已经是会员
    if(this.data.myInfo.userType === 1 || this.data.myInfo.userType === 3) {
      wx.showToast({
        title: '你已经是会员啦',
        icon: 'none',
        duration: 1000
      });
    } else {
      wx.navigateTo({
        url: '/pages/my_about/apply_member/index',
      });        
    }
  },

  /**
   * 认证会员
   */
  certificateMember() {
    // 判断用户是不是已经是会员
    if(this.data.myInfo.userType === 1 || this.data.myInfo.userType === 3) {
      wx.showToast({
        title: '你已经是会员啦',
        icon: 'none',
        duration: 1000
      });
    } else {
      wx.navigateTo({
        url: '/pages/my_about/certificate_member/index',
      });        
    }
  },


  /**
   * 获取会员信息
   */
  getMember() {
    // 同样需要判断用户身份
    if(this.data.myInfo.userType === 1 || this.data.myInfo.userType === 3) {
      wx.navigateTo({
        url: '/pages/my_about/my_member/index',
      });
    } else {
      wx.showToast({
        title: '您还不是会员',
        icon: 'none',
        duration: 1000
      });      
    }
  },

  /**
   * 获取用户未读通知数
   */
  async getNoticeNum() {
    const url = '/user-server/notice/getNoticeNum';
    const reqData = {
      userId: wx.getStorageSync('userSession').userId
    }
    try {
      const res = await request({url: url, data: reqData});
      if ( res.data.code === 20000 ) {
        const {noticeNum} = res.data.data;
        this.setData({
          noticeNum
        });
      } else {
        wx.showToast({
          title: '获取通知数失败',
          icon: 'none',
          duration: 1000
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * 获取用户个人信息
   */
  async getMyInfo() {
    const url = '/user-server/user/getUserInformation';
    const reqData = {
      userId: wx.getStorageSync('userSession').userId
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        this.setData({
          myInfo: res.data.data.formData
        });
      } else {
        wx.showToast({
          title: '获取我的信息失败',
          icon: 'none',
          duration: 1000
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
      userId: wx.getStorageSync('userSession').userId
    });
    this.getMyInfo();
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
    // 每次页面显示都需要刷新通知数
    // 给后台发请求，获取未读通知数
    this.getNoticeNum();
    if(this.data.isFromModify) {
      this.setData({
        isFromModify: false
      });
      this.getMyInfo();
    }
    // let pages = getCurrentPages();
    // let prevPage = pages[pages.length - 2];
    // if ( prevPage.route === 'pages/my_about/modify_information/index' && pages.length !== this.pageNumber) {
    //   // 如果是从修改页面跳转过来的，就需要刷新数据
    //   // 只有从修改页面跳转回来，length才会改变，
    //   this.pageNumber = pages.length;
    //   this.getMyInfo();
    // } else {
    //   // 否则不需要刷新数据，说明还是上次修改
    // }
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