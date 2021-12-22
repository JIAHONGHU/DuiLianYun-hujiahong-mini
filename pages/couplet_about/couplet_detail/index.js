import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import {request} from '../../../request/index.js';
import {formatTime} from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    isLike: false,
    isCollection: false,
    scrollHeight: 0,
    fixedBottomHeight: 0,
    coupletData: {
      coupletId: '',
      coupletAuthorId: '',
      coupletTitle: '',
      coupletAuthorName: '',
      coupletType: '',
      coupletDynasty: '',
      coupletFirstLine: '',
      coupletSecondLine: '',
      coupletExplanation: '',
      coupletAppreaciation: '',
      coupletLikes: 0,
      coupletComments: 0,
      coupletCollections: 0
    },
    coupletCommentList: [],
    showComment: false,
    commentInput: ''
  },

  /**
   * 分页信息
   */
  pageNum: 1,
  pageSize: 20,
  totalPages: 1,

  /**
   * 获取楹联数据
   */
  async getCoupletData() {
    const url = '/couplet-server/couplet/getCoupletData';
    const reqData = {
      coupletId: this.data.coupletData.coupletId,
      userId: wx.getStorageSync('userSession').userId
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        this.setData({
          isLike: res.data.data.isLike,
          isCollection: res.data.data.isCollection,
          coupletData: res.data.data.coupletData
        });
      } else {
        wx.showToast({
          title: '获取楹联数据失败',
          duration: 1000,
          icon: 'none'
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * 获得评论列表
   */
  async getCommentList() {
    const url = '/couplet-server/couplet-comment/getCoupletCommentList';
    const reqData = {
      coupletId: this.data.coupletData.coupletId,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        const {total} = res.data.data;
        this.totalPages = Math.ceil(total / this.pageSize);
        let {coupletCommentList} = res.data.data;
        coupletCommentList.forEach(item => {
          item.coupletCommentTime = formatTime(item.coupletCommentTime);
        });
        this.setData({
          coupletCommentList: [...this.data.coupletCommentList, ...coupletCommentList]
        });
      } else {
        wx.showToast({
          title: '获取楹联评论失败',
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
    // console.log(e);
    const {index} = e.detail;
    this.setData({
      active: index
    });
  },

  /**
   * 浏览楹联
   */
  async doBrowse() {
    const url = '/couplet-server/couplet-browse/doBrowse';
    const reqData = {
      userId: wx.getStorageSync('userSession').userId,
      coupletId: this.data.coupletData.coupletId
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
   * 点赞楹联
   */
  async doLike() {
    let coupletLikes = this.data.coupletData.coupletLikes;
    if( this.data.isLike ) {
      // 给后端发请求，取消点赞
      const url = '/couplet-server/couplet-like/cancelLike';
      const reqData = {
        coupletId: this.data.coupletData.coupletId,
        userId: wx.getStorageSync('userSession').userId
      };
      try {
        const res = await request({url: url, data: reqData, method: 'POST'});
        if(res.data.code === 20000) {
          coupletLikes -= 1;
          const isLike = !this.data.isLike;
          // 更新页面点赞数
          this.setData({
            isLike,
            [`coupletData.coupletLikes`]: coupletLikes
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
      const url = '/couplet-server/couplet-like/doLike';
      const reqData = {
        coupletId: this.data.coupletData.coupletId,
        userId: wx.getStorageSync('userSession').userId
      };
      try {
        const res = await request({url: url, data: reqData, method: 'POST'});
        if(res.data.code === 20000) {
          coupletLikes += 1;
          const isLike = !this.data.isLike;
          this.setData({
            isLike,
            [`coupletData.coupletLikes`]: coupletLikes
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
   * 收藏楹联
   */
  async doCollection() {
    let coupletCollections = this.data.coupletData.coupletCollections;
    if( this.data.isCollection ) {
      // 给后端发请求，取消收藏
      const url = '/couplet-server/couplet-collection/deleteCoupletCollection';
      const reqData = {
        coupletId: this.data.coupletData.coupletId,
        userId: wx.getStorageSync('userSession').userId
      };
      try {
        const res = await request({url: url, data: reqData, method: 'POST'});
        if(res.data.code === 20000) {
          coupletCollections -= 1;
          const isCollection = !this.data.isCollection;
          // 更新页面收藏数
          this.setData({
            isCollection,
            [`coupletData.coupletCollections`]: coupletCollections
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
      const url = '/couplet-server/couplet-collection/doCollection';
      const reqData = {
        coupletId: this.data.coupletData.coupletId,
        userId: wx.getStorageSync('userSession').userId
      };
      try {
        const res = await request({url: url, data: reqData, method: 'POST'});
        if(res.data.code === 20000) {
          coupletCollections += 1;
          const isCollection = !this.data.isCollection;
          this.setData({
            isCollection,
            [`coupletData.coupletCollections`]: coupletCollections
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
   * 监听用户评论输入
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
    // 评论不为空，才能发送请求
    if(this.data.commentInput) {
      // 向后端发请求
      const url = '/couplet-server/couplet-comment/doComment';
      const reqData = {
        coupletCommentUserId: wx.getStorageSync('userSession').userId,
        coupletCommentCoupletId: this.data.coupletData.coupletId,
        coupletCommentContent: this.data.commentInput
      };
      try {
        const res = await request({url: url, data: reqData, method: 'POST'});
        if(res.data.code === 20000) {
          const coupletComments = this.data.coupletData.coupletComments + 1;
          // 更新评论数，关闭评论弹窗
          this.setData({
            commentInput: '',
            showComment: false,
            [`coupletData.coupletComments`] : coupletComments
          });
          Toast.success('评论成功');
          // 刷新评论数据
          this.pageNum = 1;
          this.setData({
            coupletCommentList: []
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
   * 清空评论输入
   */
  clearComment() {
    this.setData({
      commentInput: ''
    })
  },

  /**
   * 查看评论滑动到底部
   */
  reachBottom() {
    if(this.pageNum >= this.totalPages) {
      wx.showToast({
        title: '到底啦！',
        duration: 1000,
        icon: 'none'
      });
    } else {
      // 拉取下一页数据
      this.pageNum++;
      this.getCommentList();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      [`coupletData.coupletId`]: options.coupletId
    });
    this.getCoupletData();
    this.getCommentList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   * 计算评论应有高度，需要在渲染之后获取
   */
  onReady: function () {
    // 计算高度的时候，不能有图标或者图片
    setTimeout(() => {
      // 创建选择器
      const query = wx.createSelectorQuery();
      // 选择class=minusView节点
      query.selectAll('.minusView').boundingClientRect()
      query.exec((res) => {
        // 底部动作高度
        this.setData({
          fixedBottomHeight: res[0][1].height
        });
        // 评论框高度，最小为250px
        if((wx.getSystemInfoSync().windowHeight - res[0][0].height - res[0][1].height - 44) < 250) {
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
      coupletCommentList: []
    });
    this.getCoupletData();
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