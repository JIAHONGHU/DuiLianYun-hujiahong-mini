import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import {request} from '../../../request/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userDocuments: 6,
    selectedDocumentId: 0,
    documentList: [],
    index: 0,
    show: false,
    actions: [
      {
        name: '移除资料',
        color: '#ee0a24'
      }
    ],
  },

  /**
   * 分页信息
   */
  pageNum: 1,
  pageSize: 20,
  totalPages: 1,

  /**
   * 获取资料数据
   */
  async getDocumentData() {
    // 发送获取资料列表请求
    let url = '/file-server/document-collection/getDocumentList';
    const reqData = {
      pageSize: this.pageSize,
      pageNum: this.pageNum,
      userId: wx.getStorageSync('userSession').userId,
    };
    try {
      const res = await request({url: url, data: reqData});
      if( res.data.code === 20000) {
        const {userDocuments} = res.data.data;
        this.totalPages = Math.ceil(userDocuments / this.pageSize);
        this.setData({
          userDocuments,
          documentList: [...this.data.documentList, ...res.data.data.documentList]
        })
      } else {
        wx.showToast({
          title: '获取书架失败',
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
   * 将资料移出书架
   */
  deleteDocument(e) {
    // console.log(e);
    const documentId = e.currentTarget.dataset.documentid;
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectedDocumentId: documentId,
      index: index,
      show: true
    });
  },

  /**
   * 取消操作
   */
  cancelAction() {
    this.setData({ show: false });
  },

  /**
   * 移出资料
   */
  async selectAction(e) {
    // console.log(e);
    this.setData({
      show: false
    });
    // 给后端发请求,删除资料
    let url = '/file-server/document-collection/deleteDocumentByDocumentId';
    const reqData = {
      userId: wx.getStorageSync('userSession').userId,
      documentId: this.data.selectedDocumentId
    }
    try {
      const res = await request({url: url, data: reqData, method: 'POST'});
      if(res.data.code === 20000) {
        let documentList = this.data.documentList;
        documentList.splice(this.data.index, 1);
        this.setData({
          documentList,
          userDocuments: this.data.userDocuments - 1
        });
        Toast.success('移除成功');
      } else {
        wx.showToast({
          title: '移除失败',
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDocumentData();
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
      documentList: []
    });
    this.getDocumentData();
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
      this.getDocumentData();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})