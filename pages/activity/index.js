import {request} from '../../request/index.js';
import { formatTime } from '../../utils/util.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    activePostListA: [],
    activePostListB: [],
  },

  /**
   * 分页信息
   * A是关注列表
   * B是最新列表
   */
  pageSize: 20,
  A_pageNum: 1,
  A_totalPages: 1,
  B_pageNum: 1,
  B_totalPages: 1,

  /**
   * 切换tab栏
   */
  onChange(e) {
    // console.log(e);
    const {index} = e.detail;
    this.setData({
      active: index,
    });
    // 如果tab栏对应的列表为空，才重新发送请求，刷新数据，否则不重刷数据
    if(this.data.active === 0) {
      if(this.data.activePostListA.length === 0) {
        this.getActivePostList();
      }        
    } else {
      if(this.data.activePostListB.length === 0) {
        this.getActivePostList();
      }
    }
  },

  /**
   * 获得动态帖子列表函数
   */
  async getActivePostList() {
    let url = '/post-server/post/getActivePostList';
    let reqData;
    // 根据tab栏选择请求列表，type=0为获得关注列表，type=1获得最新列表
    if(this.data.active === 0) {
      reqData = {
        userId: wx.getStorageSync('userSession').userId,
        type: this.data.active,
        pageNum: this.A_pageNum,
        pageSize: this.pageSize
      };        
    } else {
      reqData = {
        userId: wx.getStorageSync('userSession').userId,
        type: this.data.active,
        pageNum: this.B_pageNum,
        pageSize: this.pageSize
      };      
    }
    try {
      const res = await request({url: url, data: reqData});
      if( res.data.code === 20000) {
        const {total} = res.data.data;
        if(this.data.active === 0)  {
          // 获得总页数并追加列表数据
          this.A_totalPages = Math.ceil(total / this.pageSize);
          let {activePostList} = res.data.data;
          activePostList.forEach(item => {
            item.postCreateTime = formatTime(item.postCreateTime);
          });
          this.setData({
            activePostListA: [...this.data.activePostListA, ...activePostList]
          });            
        } else {
          this.B_totalPages = Math.ceil(total / this.pageSize);
          let {activePostList} = res.data.data;
          activePostList.forEach(item => {
            item.postCreateTime = formatTime(item.postCreateTime);
          });
          this.setData({
            activePostListB: [...this.data.activePostListB, ...activePostList]
          });   
        }
      } else {
        wx.showToast({
          title: '获取信息失败，请重试',
          icon: 'none',
          duration: 1000
        });
      }
    } catch (error) {
      // 请求错误，打印出错信息
      console.log(error);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getActivePostList();
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
    // 用户刷新需要重新初始化数据
    if(this.data.active === 0) {
      this.setData({
        activePostListA: []
      });
      this.A_pageNum = 1;        
    } else {
      this.setData({
        activePostListB: []
      });
      this.B_pageNum = 1;     
    }
    this.getActivePostList();
    // 关闭刷新加载
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 如果已经是最后一页了，就不能再次请求了
    // 否则页数加1后，拉去下一页数据
    if(this.data.active === 0) {
      if (this.A_pageNum >= this.A_totalPages) {
        wx.showToast({
          icon: 'none',
          title: '到底啦！',
          duration: 1000
        });
      } else {
        this.A_pageNum++;
        this.getActivePostList();
      }        
    } else {
      if (this.B_pageNum >= this.B_totalPages) {
        wx.showToast({
          icon: 'none',
          title: '到底啦！',
          duration: 1000
        });
      } else {
        this.B_pageNum++;
        this.getActivePostList();
      }   
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})