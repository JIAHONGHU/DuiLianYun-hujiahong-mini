import {dialogConfirm, toast} from '../../../utils/asyncVant.js';
import {request} from '../../../request/index.js';
import {formatTime} from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    userPostBrowses: 0,
    userCoupletBrowses: 0,
    userDocumentBrowses: 0,
    postList: [],
    coupletList: [],
    documentList: [],
  },

  /**
   * 分页信息
   */
  pageNum: 1,
  pageSize: 20,
  totalPages: 1,

  /**
   * 切换标签栏（帖子、楹联、资料）
   */
  onChange(e) {
    // console.log(e);
    const {index} = e.detail;
    this.setData({
      active: index,
      postList: [],
      coupletList: [],
      documentList: []
    });
    this.pageNum = 1;
    if(index === 0) {
      this.getPostList();
    } else if(index === 1) {
      this.getCoupletList();
    } else {
      this.getDocumentList();
    }
  },

  /**
   * 获取最近浏览帖子列表
   */
  async getPostList() {
    // 发送请求
    const url = '/post-server/post-browse/getPostBrowseList';
    const reqData = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      userId: wx.getStorageSync('userSession').userId
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        const {userPostBrowses} = res.data.data;
        this.totalPages = Math.ceil(userPostBrowses / this.pageSize);
        let {postList} = res.data.data;
        postList.forEach(item => {
          item.postCollectionTime = formatTime(item.postCollectionTime);
        })
        this.setData({
          userPostBrowses: userPostBrowses,
          postList: [...this.data.postList, ...postList]
        });
      } else {
        wx.showToast({
          title: '获取浏览帖子失败',
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
   * 获取最近浏览楹联列表
   */
  async getCoupletList() {
    // 发送请求
    const url = '/couplet-server/couplet-browse/getCoupletBrowseList';
    const reqData = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      userId: wx.getStorageSync('userSession').userId
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        const {userCoupletBrowses} = res.data.data;
        this.totalPages = Math.ceil(userCoupletBrowses / this.pageSize);
        let {coupletList} = res.data.data;
        coupletList.forEach(item => {
          item.coupletCollectionTime = formatTime(item.coupletCollectionTime);
        });
        this.setData({
          userCoupletBrowses: userCoupletBrowses,
          coupletList: [...this.data.coupletList, ...coupletList]
        });
      } else {
        wx.showToast({
          title: '获取浏览楹联失败',
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
   * 获取最近浏览资料信息
   */
  async getDocumentList() {
    // 发送请求
    const url = '/file-server/document-browse/getDocumentBrowseList';
    const reqData = {
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      userId: wx.getStorageSync('userSession').userId
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        const {userDocumentBrowses} = res.data.data;
        this.totalPages = Math.ceil(userDocumentBrowses / this.pageSize);
        let {userDocumentList} = res.data.data;
        userDocumentList.forEach(item => {
          item.documentBrowseTime = formatTime(item.documentBrowseTime);
        });
        this.setData({
          userDocumentBrowses: userDocumentBrowses,
          documentList: [...this.data.documentList, ...userDocumentList]
        });
      } else {
        wx.showToast({
          title: '获取浏览资料失败',
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
   * 删除楹联浏览记录
   */
  async deleteCouplet(e) {
    const res = await dialogConfirm({message: '将删除该楹联浏览记录'});
    if (res) {
      // 向后端发请求
      const url = '/couplet-server/couplet-browse/deleteCoupletBrowse';
      const reqData = {
        userId: wx.getStorageSync('userSession').userId,
        coupletId: e.currentTarget.dataset.coupletid
      };
      try {
        const res = await request({url: url, data: reqData, method: 'POST'});
        if(res.data.code === 20000) {
          let coupletList = this.data.coupletList;
          coupletList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            coupletList,
            userCoupletBrowses: this.data.userCoupletBrowses - 1
          });
          await toast({message: '操作成功', type: 'success'});
        } else {
          wx.showToast({
            title: '删除记录失败',
            duration: 1000,
            icon: 'none'
          });
        }
      } catch (error) {
        // 提示请求失败信息
        console.log(error);
      }
    } else {
      // 取消
      await toast({message: '已取消'});
    }
  },

  /**
   * 删除帖子浏览记录
   */
  async deletePost(e) {
    const res = await dialogConfirm({message: '将删除该帖子浏览记录'});
    if (res) {
      // 向后端发请求
      const url = '/post-server/post-browse/deletePostBrowse';
      const reqData = {
        userId: wx.getStorageSync('userSession').userId,
        postId: e.currentTarget.dataset.postid
      };
      try {
        const res = await request({url: url, data: reqData, method: 'POST'});
        if(res.data.code === 20000) {
          let postList = this.data.postList;
          postList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            postList,
            userPostBrowses: this.data.userPostBrowses - 1
          });
          await toast({message: '操作成功', type: 'success'});
        } else {
          wx.showToast({
            title: '删除记录失败',
            duration: 1000,
            icon: 'none'
          });
        }
      } catch (error) {
        // 提示请求失败
        console.log(error);
      }
    } else {
      // 取消
      await toast({message: '已取消'});
    }
  },

  /**
   * 删除资料浏览记录
   */
  async deleteDocument(e) {
    const res = await dialogConfirm({message: '将删除该资料浏览记录'});
    if (res) {
      // 向后端发请求
      const url = '/file-server/document-browse/deleteDocumentBrowse';
      const reqData = {
        userId: wx.getStorageSync('userSession').userId,
        documentId: e.currentTarget.dataset.documentid
      };
      try {
        const res = await request({url: url, data: reqData, method: 'POST'});
        if(res.data.code === 20000) {
          let documentList = this.data.documentList;
          documentList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            documentList,
            userDocumentBrowses: this.data.userDocumentBrowses - 1
          });
          await toast({message: '操作成功', type: 'success'});
        } else {
          wx.showToast({
            title: '删除记录失败',
            duration: 1000,
            icon: 'none'
          });
        }
      } catch (error) {
        // 提示请求失败信息
        console.log(error);
      }
    } else {
      // 取消
      await toast({message: '已取消'});
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    } else if (this.data.active === 1) {
      this.setData({
        coupletList: []
      });
      this.getCoupletList();
    } else {
      this.setData({
        documentList: []
      });
      this.getDocumentList();
    }
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
      } else if(this.data.active === 1) {
        this.getCoupletList();
      } else {
        this.getDocumentList();
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})