import {request} from '../../../request/index.js';
import {formatTime} from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    masterId: '',
    backgroundImage: '../../../icons/images/background.jpg',
    masterCouplets: 0,
    coupletList: [],
    personalData: {
      masterName: '',
      masterDynasty: '',
      masterPhoto: '',
      masterIntroduction: ''
    }
  },

  pageNum: 1,
  pageSize: 20,
  totalPages: 1,

  /**
   * 获取楹联列表
   */
  async getCoupletList() {
    const url = '/couplet-server/couplet/getAllPersonalCouplet';
    const reqData = {
      coupletAuthorId: this.data.masterId,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code ===  20000) {
        const masterCouplets = res.data.data.total;
        this.totalPages = Math.ceil(masterCouplets / this.pageSize);
        let {coupletList} = res.data.data;
        coupletList.forEach(item => {
          item.coupletCreateTime = formatTime(item.coupletCreateTime);
        });
        this.setData({
          masterCouplets: masterCouplets,
          coupletList: [...this.data.coupletList, ...coupletList]
        });
      } else {
        wx.showToast({
          title: '获取个人楹联失败',
          duration: 1000,
          icon: 'none'
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * 获取楹联家个人信息
   */
  async getPersonalData() {
    const url = '/couplet-server/master/getPersonalData';
    const reqData = {
      masterId: this.data.masterId
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        this.setData({
          personalData: res.data.data.personalData
        });
      } else {
        wx.showToast({
          title: '获取楹联家信息失败',
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
    // 获取页面路径参数
    this.setData({
      masterId: options.masterId
    });
    this.getPersonalData();
    this.getCoupletList();
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
    this.getPersonalData();
    this.getCoupletList();
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
      this.getCoupletList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})