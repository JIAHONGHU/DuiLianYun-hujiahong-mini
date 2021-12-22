import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import {request} from '../../../request/index.js';
import {formatTime} from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    userId2: '',
    backgroundImage: '../../../icons/images/background.jpg',
    userCouplets: 0,
    userPosts: 0,
    postList: [],
    coupletList: [],
    personalData: {
      userNickname: '',
      userPortrait: '',
      userMotto: '',
      userIntroduction: '',
      userFans: 0,
      userLikes: 0,
      userAttentions: 0,
      isAttention: false
    }
  },

  pageNum: 1,
  pageSize: 20,
  totalPages: 1,

  /**
   * 获取帖子列表
   */
  async getPostList() {
    const url = '/post-server/post/getAllPersonalPost';
    const reqData = {
      userId: this.data.userId2,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code ===  20000) {
        const {total} = res.data.data;
        this.totalPages = Math.ceil(total / this.pageSize);
        let {postList} = res.data.data;
        postList.forEach(item => {
          item.postCreateTime = formatTime(item.postCreateTime);
        });
        this.setData({
          userPosts: total,
          postList: [...this.data.postList, ...postList]
        });
      } else {
        wx.showToast({
          title: '获取个人帖子失败',
          duration: 1000,
          icon: 'none'
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * 获取楹联列表
   */
  async getCoupletList() {
    const url = '/couplet-server/couplet/getAllPersonalCouplet';
    const reqData = {
      coupletAuthorId: this.data.userId2,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code ===  20000) {
        const {total} = res.data.data;
        this.totalPages = Math.ceil(total / this.pageSize);
        let {coupletList} = res.data.data;
        coupletList.forEach(item => {
          item.coupletCreateTime = formatTime(item.coupletCreateTime);
        });
        this.setData({
          userCouplets: total,
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
   * 获取个人信息
   */
  async getPersonalData() {
    const url = '/user-server/user/getPersonalData';
    const reqData = {
      userId: wx.getStorageSync('userSession').userId,
      userId2: this.data.userId2
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        this.setData({
          personalData: res.data.data.personalData
        });
      } else {
        wx.showToast({
          title: '获取个人信息失败',
          duration: 1000,
          icon: 'none'
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * 切换tab栏
   */
  onChange(e) {
    const {index} = e.detail;
    this.setData({
      active: index,
      postList: [],
      coupletList: []
    });
    this.pageNum = 1;
    if(index === 0) {
      this.getPostList();
    } else {
      this.getCoupletList();
    }
  },

  /**
   * 关注用户
   */
  doAttention(e) {
    if(this.data.userId2 == wx.getStorageSync('userSession').userId) {
      wx.showToast({
        title: '不能自己关注自己哟！',
        duration: 1000,
        icon: 'none'
      });
      return;
    }
    if(this.data.personalData.isAttention === true) {
      Dialog.confirm({
        message: '确定取关该用户？',
      }).then(async () => {
          // on confirm
          const url = '/user-server/relationship/cancelAttention';
          const reqData = {
            userId: wx.getStorageSync('userSession').userId,
            userId2: this.data.userId2
          };
          try {
            const res = await request({url: url, data: reqData, method: 'POST'});
            if(res.data.code === 20000 ) {
              const isAttention = !this.data.personalData.isAttention;
              this.setData({
                [`personalData.userFans`]: this.data.personalData.userFans - 1,
                [`personalData.isAttention`]: isAttention
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
            console.log(error);
          }
      })
      .catch(() => {
        Toast.success('取消操作');
      })
    } else {
      Dialog.confirm({
        message: '确定关注该用户？',
      }).then(async () => {
        // on confirm
        const url = '/user-server/relationship/doAttention';
        const reqData = {
          userId: wx.getStorageSync('userSession').userId,
          userId2: this.data.userId2
        };
        try {
          const res = await request({url: url, data: reqData, method: 'POST'});
          if(res.data.code === 20000 ) {
            const isAttention = !this.data.personalData.isAttention;
            this.setData({
              [`personalData.userFans`]: this.data.personalData.userFans + 1,
              [`personalData.isAttention`]: isAttention
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
          console.log(error);
        }
      })
      .catch(() => {
        Toast.success('取消操作');
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userId2: options.userId
    });
    this.getPersonalData();
    this.getPostList();
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
    if(this.data.active === 0) {
      this.setData({
        postList: []
      });
      this.getPostList();
    } else {
      this.setData({
        coupletList: []
      });
      this.getCoupletList();
    }
    this.getPersonalData();
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
      if(this.data.active === 0) {
        this.getPostList();
      } else {
        this.getCoupletList();
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})