import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import {request} from '../../../request/index.js';
import {formatTime} from '../../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用于判断是不是从修改页面返回
    isFromModify: false,
    postTypeList:[],
    active: 0, 
    // 类型
    postList: [],
    show: false,
    index : 0,
    // 帖子在数组中的下标
    actions: [
      {
        id: 1,
        name: "修改"
      },
      {
        id: 2,
        name: "删除",
        color: '#ee0a24'
      }
    ]
  },

  /**
   * 分页信息
   */
  pageSize: 20,
  pageNum: 1,
  totalPages: 1,
  // 这个用来辅助判断是否从修改页面跳转回来的
  // 保存的是当前一共有多少页面
  pageNumber: 0,

  /**
   * 获取帖子类型列表
   */
  async getPostTypeList() {
    // 发送请求
    try {
      const res = await request({url: '/post-server/post-type/getPostType'});
      if (res.data.code === 20000) {
        const {postType} = res.data.data;
        this.setData({
          postTypeList: postType
        });
      } else {
        wx.showToast({
          title: '获取类型失败',
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
   * 根据类型获取帖子
   */
  async getPostByType() {
    const url = '/post-server/post/getPostListByType';
    const reqData = {
      userId: wx.getStorageSync('userSession').userId,
      postTypeId: this.data.active + 1,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    };
    // 发送请求
    try {
      const res = await request({url: url, data: reqData});
      if( res.data.code === 20000 ) {
        const {total} = res.data.data;
        this.totalPages = Math.ceil( total / this.pageSize );
        let {postList} = res.data.data;
        postList.forEach(item => {
          item.postCreateTime = formatTime(item.postCreateTime);
        });
        this.setData({
          postList: [...this.data.postList, ...postList]
        });
      } else {
        wx.showToast({
          title: '获取帖子失败',
          duration: 1000,
          icon: 'none'
        });
      }
    } catch (error) {
      // 提示请求信息
      console.log(error);
    }
  },

  /**
   * 更改帖子类型
   */
  changeType(e) {
    const {index} = e.currentTarget.dataset;
    this.setData({
      active: index,
      postList: []
    })
    // 清空已有的数据
    this.pageNum = 1;
    // 给后端发请求，获取帖子
    this.getPostByType();
  },

  /**
   * 修改或删除帖子
   */
  modifyOrDelete(e) {
    let {index} = e.currentTarget.dataset;
    this.setData({
      show: true,
      index: index
    });
  },

  /**
   * 关闭选择项
   */
  closeAction() {
    this.setData({
      show: false
    });
  },

  /**
   * 选择修改帖子或删除帖子
   */
  selectAction(e) {
    this.setData({
      show: false
    });
    const selection = e.detail.id;
    if(selection === 1) {
      // 修改
      // 重定向到修改页面
      this.setData({
        isFromModify: true
      });
      wx.navigateTo({
        url: '../../post_about/post_modify/index?postId=' + this.data.postList[this.data.index].postId,
      })
    } else {
      // 删除
      Dialog.confirm({
        message: '确认删除该帖子？',
      }).then(async () => {
        // on confirm
        // 给后端发请求，删除帖子
        try {
          // 先删除
          const deleteUrl = '/post-server/post/deletePostByPostId';
          const reqData = {
            userId: wx.getStorageSync('userSession').userId,
            postId: this.data.postList[this.data.index].postId
          };
          const res = await request({url: deleteUrl, data: reqData, method: 'POST'});
          if( res.data.code === 20000) {
            wx.showToast({
              title: '删除成功',
              duration: 1000,
            });
            // 如果删除成功，就从数组中除去这个记录，修改才重新刷新页面，优化用户体验
            let {postList} = this.data;
            postList.splice(this.data.index, 1);
            this.setData({
              postList
            });
          } else {
            wx.showToast({
              title: '删除失败',
              duration: 1000,
              icon: 'none'
            });
          }
        } catch (error) {
          // 提示请求失败信息
          console.log(error)
        }
      })
      .catch(() => {
        // on cancel
        Toast('删除已取消');
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPostTypeList();
    this.getPostByType();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 更新帖子
   */
  async getNewPost() {
    const url = "/post-server/post/getPostFullInfo";
    const reqData = {
      postId: this.data.postList[this.data.index].postId
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        // 发送新的请求，只替换这一个帖子的数据
        let postList = this.data.postList;
        let obj1 = postList[this.data.index];
        let obj2 = res.data.data.formData;
        Object.keys(obj1).forEach((key) => {
          obj1[key] = obj2[key];
        });
        obj1.postCreateTime = formatTime(obj1.postCreateTime);
        postList[this.data.index] = obj1;
        this.setData({
          postList
        });
      } else {
        wx.showToast({
          title: '更新帖子信息失败',
          duration: 1000,
          icon: 'none'
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.data.isFromModify) {
      this.getNewPost();
      this.setData({
        isFromModify: false
      });
    }
    // let pages = getCurrentPages();
    // let prevPage = pages[pages.length - 2];
    // console.log(pages);
    // if ( prevPage.route === 'pages/post_about/post_modify/index' && pages.length !== this.pageNumber) {
    //   // 如果是从修改页面跳转过来的，就需要刷新数据，暂定修改不需要审核
    //   // 只有从修改页面跳转回来，或者从my页面重新跳转（这时页面会重新加载）进入这个页面，length才会改变，
    //   this.pageNumber = pages.length;
    //   this.getNewPost();
    // } else {
    //   // 否则不需要刷新数据，因为在load是发送了请求，所以这里不需要操作
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
    this.pageNum = 1;
    this.setData({
      postList: []
    });
    this.getPostByType();
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
      this.getPostByType();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})