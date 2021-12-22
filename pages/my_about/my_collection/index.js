import {dialogConfirm, toast} from '../../../utils/asyncVant.js';
import {request} from '../../../request/index.js';
import {formatTime} from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    userPostCollections: 0,
    userCoupletCollections: 0,
    postList: [],
    coupletList: [],
  },

  /**
   * 分页信息
   */
  post_pageNum: 1,
  post_totalPages: 1,
  couplet_pageNum: 1,
  couplet_totalPages: 1,
  pageSize: 20,

  /**
   * 切换标签栏（帖子、楹联）
   */
  onChange(e) {
    // console.log(e);
    const {index} = e.detail;
    this.setData({
      active: index,
    });
    if(index === 0) {
      if(this.data.postList.length === 0) {
        this.getPostList();
      }
    } else {
      if(this.data.coupletList.length === 0) {
        this.getCoupletList();
      }
    }
  },

  /**
   * 获取收藏帖子列表
   */
  async getPostList() {
    // 发送请求
    const url = '/post-server/post-collection/getPostCollectionList';
    const reqData = {
      pageNum: this.post_pageNum,
      pageSize: this.pageSize,
      userId: wx.getStorageSync('userSession').userId
    }
    try {
      const res = await request({url: url, data: reqData});
      if( res.data.code === 20000) {
        const {userPostCollections} = res.data.data;
        this.post_totalPages = Math.ceil(userPostCollections / this.pageSize);
        let {postList} = res.data.data;
        postList.forEach(item => {
          item.postCollectionTime = formatTime(item.postCollectionTime);
        });
        this.setData({
          userPostCollections: userPostCollections,
          postList: [...this.data.postList, ...postList]
        })
      } else {
        wx.showToast({
          title: '获取收藏帖子失败',
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
   * 获取收藏楹联列表
   */
  async getCoupletList() {
    // 发送请求
    let url = '/couplet-server/couplet-collection/getCoupletCollectionList';
    const reqData = {
      pageSize: this.pageSize,
      pageNum: this.couplet_pageNum,
      userId: wx.getStorageSync('userSession').userId
    }
    try {
      const res = await request({url: url, data: reqData});
      if( res.data.code === 20000) {
        const {userCoupletCollections} = res.data.data;
        this.couplet_totalPages = Math.ceil(userCoupletCollections / this.pageSize);
        let {coupletList} = res.data.data;
        coupletList.forEach(item => {
          item.coupletCollectionTime = formatTime(item.coupletCollectionTime);
        });
        this.setData({
          userCoupletCollections: userCoupletCollections,
          coupletList: [...this.data.coupletList, ...coupletList]
        })
      } else {
        wx.showToast({
          title: '获取收藏楹联失败',
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
   * 将已收藏的楹联移出收藏列表
   */
  async deleteCouplet(e) {
    console.log(e);
    const res = await dialogConfirm({message: '该楹联将从我的收藏中移除'});
    const url = '/couplet-server/couplet-collection/deleteCoupletCollection';
    const reqData = {
      coupletId: e.currentTarget.dataset.coupletid,
      userId: wx.getStorageSync('userSession').userId
    }
    if (res) {
      // 向后端发请求
      try {
        const res = await request({url: url, data: reqData, method: 'POST'});
        if(res.data.code === 20000) {
          let coupletList = this.data.coupletList;
          coupletList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            coupletList,
            userCoupletCollections: this.data.userCoupletCollections - 1
          });
          await toast({message: '操作成功'});
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
    } else {
      // 取消
      await toast({message: '已取消'});
    }
  },

  /**
   * 将已收藏的帖子移出收藏列表
   */
  async deletePost(e) {
    const res = await dialogConfirm({message: '该帖子将从我的收藏中移除'});
    const url = '/post-server/post-collection/deletePostCollection';
    const reqData = {
      postId: e.currentTarget.dataset.postid,
      userId: wx.getStorageSync('userSession').userId
    }
    if (res) {
      // 向后端发请求
      try {
        const res = await request({url: url, data: reqData, method: 'POST'});
        if(res.data.code === 20000) {
          let postList = this.data.postList;
          postList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            postList,
            userPostCollections: this.data.userPostCollections - 1
          });
          await toast({message: '操作成功'});
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
    if(this.data.active === 0) {
      this.post_pageNum = 1;
      this.setData({
        postList: []
      });
      this.getPostList();
    } else {
      this.couplet_pageNum = 1;
      this.setData({
        coupletList: []
      });
      this.getCoupletList();
    }
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.active === 0) {
      if( this.post_pageNum >= this.post_totalPages ) {
        wx.showToast({
          title: '到底啦！',
          duration: 1000,
          icon: 'none'
        });
      } else {
        this.post_pageNum++;
        this.getPostList();
      }      
    } else {
      if( this.couplet_pageNum >= this.couplet_totalPages ) {
        wx.showToast({
          title: '到底啦！',
          duration: 1000,
          icon: 'none'
        });
      } else {
        this.couplet_pageNum++;
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