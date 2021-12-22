import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import { request } from '../../../request/index.js';
import { formatTime } from '../../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    isLike: false,
    isCollection: false,
    fixedBottomHeight: 0,
    postId: '',
    postData: {
      postId: '',
      postUserId: '',
      postTitle: '',
      postUserName: '',
      postType: '',
      postFirstLine: '',
      postSecondLine: '',
      postExplanation: '',
      postAppreaciation: '',
      postLikes: 0,
      postComments: 0,
      postCollections: 0
    },
    scrollHeight: 0,
    postCommentList: [],
    showComment: false,
    commentInput: ''
  },

  pageNum: 1,
  pageSize: 20,
  totalPages: 1,

  /**
   * 获取帖子信息
   */
  async getPostData() {
    const url = '/post-server/post/getPostData';
    const reqData = {
      postId: this.data.postId,
      userId: wx.getStorageSync('userSession').userId
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        this.setData({
          isLike: res.data.data.isLike,
          isCollection: res.data.data.isCollection,
          postData: res.data.data.postData
        });
      } else {
        wx.showToast({
          title: '获取帖子数据失败',
          duration: 1000,
          icon: 'none'
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * 获取评论列表
   */
  async getCommentList() {
    const url = '/post-server/post-comment/getPostCommentList';
    const reqData = {
      postId: this.data.postId,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        const {total} = res.data.data;
        this.totalPages = Math.ceil(total / this.pageSize);
        let {postCommentList} = res.data.data;
        postCommentList.forEach(item => {
          item.postCommentTime = formatTime(item.postCommentTime);
        });
        this.setData({
          postCommentList: [...this.data.postCommentList, ...postCommentList]
        });
      } else {
        wx.showToast({
          title: '获取帖子评论失败',
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
      active: index
    });
  },

  /**
   * 浏览帖子
   */
  async doBrowse() {
    const url = '/post-server/post-browse/doBrowse';
    const reqData = {
      userId: wx.getStorageSync('userSession').userId,
      postId: this.data.postId
    };
    try {
      const res = await request({url: url, data: reqData, method: 'POST'});
      if(res.data.code === 20000) {
        console.log('增加浏览记录成功');
      } else {
        console.log('增加浏览记录失败');
      }
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * 点赞帖子
   */
  async doLike() {
    let postLikes = this.data.postData.postLikes;
    if( this.data.isLike ) {
      // 给后端发请求，取消点赞
      const url = '/post-server/post-like/cancelLike';
      const reqData = {
        postId: this.data.postId,
        userId: wx.getStorageSync('userSession').userId
      };
      try {
        const res = await request({url: url, data: reqData, method: 'POST'});
        if(res.data.code === 20000) {
          postLikes -= 1;
          const isLike = !this.data.isLike;
          this.setData({
            isLike,
            [`postData.postLikes`]: postLikes
          });
        } else {
          wx.showToast({
            title: '取消点赞失败',
            duration: 1000,
            icon: 'none'
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      // 给后端发请求，进行点赞
      const url = '/post-server/post-like/doLike';
      const reqData = {
        postId: this.data.postId,
        userId: wx.getStorageSync('userSession').userId
      };
      try {
        const res = await request({url: url, data: reqData, method: 'POST'});
        if(res.data.code === 20000) {
          postLikes += 1;
          const isLike = !this.data.isLike;
          this.setData({
            isLike,
            [`postData.postLikes`]: postLikes
          });
        } else {
          wx.showToast({
            title: '点赞失败',
            duration: 1000,
            icon: 'none'
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  },

  /**
   * 收藏帖子
   */
  async doCollection() {
    let postCollections = this.data.postData.postCollections;
    if( this.data.isCollection ) {
      // 给后端发请求，取消收藏
      const url = '/post-server/post-collection/deletePostCollection';
      const reqData = {
        postId: this.data.postId,
        userId: wx.getStorageSync('userSession').userId
      };
      try {
        const res = await request({url: url, data: reqData, method: 'POST'});
        if(res.data.code === 20000) {
          postCollections -= 1;
          const isCollection = !this.data.isCollection;
          this.setData({
            isCollection,
            [`postData.postCollections`]: postCollections
          });
        } else {
          wx.showToast({
            title: '取消收藏失败',
            duration: 1000,
            icon: 'none'
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      // 给后端发请求，进行收藏
      const url = '/post-server/post-collection/doCollection';
      const reqData = {
        postId: this.data.postId,
        userId: wx.getStorageSync('userSession').userId
      };
      try {
        const res = await request({url: url, data: reqData, method: 'POST'});
        if(res.data.code === 20000) {
          postCollections += 1;
          const isCollection = !this.data.isCollection;
          this.setData({
            isCollection,
            [`postData.postCollections`]: postCollections
          });
        } else {
          wx.showToast({
            title: '收藏失败',
            duration: 1000,
            icon: 'none'
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  },

  /**
   * 弹出评论框
   */
  doComment() {
    this.setData({
      showComment: true
    });
  },

  /**
   * 关闭评论框
   */
  onClose() {
    this.setData({
      showComment: false
    });
  },

  /**
   * 监听用户输入评论
   */
  inputComment(e) {
    this.setData({
      commentInput: e.detail
    });
  },

  /**
   * 提交评论
   */
  async submitComment() {
    if(this.data.commentInput) {
      // 向后端发请求
      const url = '/post-server/post-comment/doComment';
      const reqData = {
        postCommentUserId: wx.getStorageSync('userSession').userId,
        postCommentPostId: this.data.postId,
        postCommentContent: this.data.commentInput
      };
      try {
        const res = await request({url: url, data: reqData, method: 'POST'});
        if(res.data.code === 20000) {
          const postComments = this.data.postData.postComments + 1;
          this.setData({
            commentInput: '',
            showComment: false,
            [`postData.postComments`] : postComments
          });
          Toast.success('评论成功');
          this.pageNum = 1;
          this.setData({
            postCommentList: []
          });
          this.getCommentList();
        } else {
          wx.showToast({
            title: '评论失败',
            duration: 1000,
            icon: 'none'
          });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      Notify({
        message: '请填写评论信息',
        safeAreaInsetTop: true,
        background: "#faae58",
        duration: 1000
      });
    }
  },

  /**
   * 清空评论
   */
  clearComment() {
    this.setData({
      commentInput: ''
    })
  },

  /**
   * 触底函数
   */
  reachBottom() {
    if(this.pageNum >= this.totalPages) {
      wx.showToast({
        title: '到底啦！',
        duration: 1000,
        icon: 'none'
      });
    } else {
      this.pageNum++;
      this.getCommentList();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      postId: options.postId
    });
    this.getPostData();
    this.getCommentList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 计算的时候，不能有图标或者图片,如果有,必须需要规定宽高
    setTimeout(() => {
      const query = wx.createSelectorQuery()
      query.selectAll('.minusView').boundingClientRect()
      query.exec((res) => {
        this.setData({
          fixedBottomHeight: res[0][1].height
        });
        if(wx.getSystemInfoSync().windowHeight - res[0][0].height - res[0][1].height - 44 < 250) {
          this.setData({
            scrollHeight: 250
          })
        } else {
          this.setData({
            scrollHeight: (wx.getSystemInfoSync().windowHeight - res[0][0].height - res[0][1].height - 44)
          });      
        }
      });
    }, 200);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 只要一进来就是一条记录
    this.doBrowse();
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
      postCommentList: []
    });
    this.getPostData();
    this.getCommentList();
    wx.stopPullDownRefresh();
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