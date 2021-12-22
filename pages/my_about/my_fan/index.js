import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import {request} from '../../../request/index.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userFans: 10,
    fanList: [],
  },

  /**
   * 分页信息
   */
  pageNum: 1,
  pageSize: 20,
  totalPages: 1,

  /**
   * 获取粉丝列表
   */
  async getFanList() {
    const url = '/user-server/relationship/getFanList';
    const reqData = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      userId: wx.getStorageSync('userSession').userId
    };
    // 发送请求
    try {
      const res = await request({url: url, data: reqData});
      if( res.data.code === 20000 ) {
        const {total} = res.data.data;
        this.totalPages = Math.ceil(total / this.pageSize);
        this.setData({
          userFans: total,
          fanList: [...this.data.fanList, ...res.data.data.fanList]
        });
      } else {
        wx.showToast({
          title: '获取粉丝失败',
          duration: 1000,
          icon: 'none'
        });
      }
    } catch (error) {
      // 提示请求失败信息
      console.log(error);
    }
  },

  /**
   * 关注粉丝用户
   */
  doAttention(e) {
    let {fanList} = this.data;
    let index = fanList.findIndex(v=>v.userId === e.currentTarget.dataset.userid);
    // 如果已经关注该粉丝用户，则再次触发取消关注
    if(fanList[index].isAttention === true) {
      Dialog.confirm({
        message: '确定取消关注该粉丝？',
      }).then(async () => {
          const url = '/user-server/relationship/cancelAttention';
          const reqData = {
            userId: wx.getStorageSync('userSession').userId,
            userId2: e.currentTarget.dataset.userid
          };
          // 发送请求
          try {
            const res = await request({url: url, data: reqData, method: 'POST'});
            if(res.data.code === 20000 ) {
              fanList[index].isAttention = !fanList[index].isAttention;
              this.setData({
                fanList
              });
              Toast.success('取关成功');
            } else {
              wx.showToast({
                title: '取消关注失败',
                duration: 1000,
                icon: 'none'
              });
            }  
          } catch (error) {
            // 提示请求失败信息
            console.log(error);
          }
      })
      .catch(() => {
        Toast.success('已取消');
      })
    } else {
      // 否则关注该粉丝
      Dialog.confirm({
        message: '确定关注该粉丝？',
      }).then(async () => {
        const url = '/user-server/relationship/doAttention';
        const reqData = {
          userId: wx.getStorageSync('userSession').userId,
          userId2: e.currentTarget.dataset.userid
        };
        // 发送请求
        try {
          const res = await request({url: url, data: reqData, method: 'POST'});
          if(res.data.code === 20000 ) {
            fanList[index].isAttention = !fanList[index].isAttention;
            this.setData({
              fanList
            });
            Toast.success('关注成功');
          } else {
            wx.showToast({
              title: '关注失败',
              duration: 1000,
              icon: 'none'
            });
          }          
        } catch (error) {
          // 提示请求失败信息
          console.log(error);
        }
      })
      .catch(() => {
        Toast.success('已取消');
      })
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getFanList();
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
      fanList: []
    });
    this.getFanList();
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
      this.getFanList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})