import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import {request} from '../../../request/index.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    attentionList: [],
    inputKey:'',
    whetherSearch: false,
    show: false,
    selectedIndex: 0,
    selectedUserId: '',
    selectedUserNickname : '',
    actions: [
      {
        name: '取消关注',
        color: '#ee0a24'
      }
    ],
  },

  /**
   * 分页信息
   */
  pageSize: 20,
  pageNum: 1,
  totalPages: 1,

  /**
   * 输入姓名搜索
   */
  changeInput(e) {
    this.setData({
      inputKey : e.detail,
    });
  },

  /**
   * 用户在键盘点击确定，或者搜索触发
   */
  async onSearch() {
    // 区分是否是第一次搜索的第一页
    if(!this.data.whetherSearch) { 
      this.pageNum = 1;
      this.setData({
        attentionList: [],
        whetherSearch: true
      });
    }
    // 发送请求
    const url = '/user-server/relationship/searchAttention';
    const reqData = {
      userId: wx.getStorageSync('userSession').userId,
      inputKey: this.data.inputKey,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        const {total} = res.data.data;
        this.totalPages = Math.ceil(total / this.pageSize);
        this.setData({
          attentionList: [...this.data.attentionList, ...res.data.data.attentionList]
        });
      } else {
        wx.showToast({
          title: '搜索失败',
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
   * 取消搜索，重置关注列表
   */
  cancelSearch() {
    this.setData({
      whetherSearch: false,
      attentionList: []
    });
    this.pageNum = 1;
    this.getAttentionList();
  },

  /**
   * 获取用户关注列表
   */
  async getAttentionList() {
    // 发送请求
    const url = '/user-server/relationship/getAttentionList';
    const reqData = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      userId: wx.getStorageSync('userSession').userId
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        const {total} = res.data.data;
        this.totalPages = Math.ceil(total / this.pageSize);
        this.setData({
          attentionList: [...this.data.attentionList, ...res.data.data.attentionList]
        });
      } else {
        wx.showToast({
          title: '获取关注失败',
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
   * 取消操作
   */
  cancelAction() {
    this.setData({ show: false });
  },

  /**
   * 取消关注用户
   */
  async selectAction(e) {
    this.setData({
      show: false
    });
    // 给后端发请求,取消关注userId
    const url = '/user-server/relationship/cancelAttention';
    const reqData = {
      userId: wx.getStorageSync('userSession').userId,
      userId2: this.data.selectedUserId
    };
    try {
      const res = await request({url: url, data: reqData, method: 'POST'});
      if(res.data.code === 20000) {
        let attentionList = this.data.attentionList;
        attentionList.splice(this.data.selectedIndex, 1);
        this.setData({
          attentionList
        });
        Toast.success('操作成功');
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
  },

  /**
   * 关注用户
   */
  doAttention(e) {
    let userId = e.currentTarget.dataset.userid;
    let userNickname = e.currentTarget.dataset.usernickname;
    let index = e.currentTarget.dataset.index;
    this.setData({
      show: true,
      selectedIndex: index,
      selectedUserId: userId,
      selectedUserNickname: userNickname
    });
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAttentionList();
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
    // 刷新页面数据
    this.pageNum = 1;
    this.setData({
      attentionList: []
    });
    if(this.data.whetherSearch) {
      this.onSearch();
    } else {
      this.getAttentionList();
    }
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if( this.pageNum >= this.totalPages) {
      wx.showToast({
        title: '到底啦！',
        duration: 1000,
        icon: 'none'
      });
    } else {
      this.pageNum++;
      if(this.data.whetherSearch) {
        this.onSearch();
      } else {
        this.getAttentionList();
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})