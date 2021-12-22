import { request } from "../../request/index.js";
import { formatTime } from '../../utils/util.js';
// 获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 新闻轮播图列表
    swiperList: [],
    // 导航图标列表
    selectionList: [
      {
        sel_id: 0,
        sel_src: "../../icons/images/lianjieshichuang.jpg",
        sel_url: "/pages/news_about/news_list/index"
      },
      {
        sel_id: 1,
        sel_src: "../../icons/images/zhonghuaduilianku.jpg",
        sel_url: "/pages/couplet_about/couplet_list/index"
      },
      {
        sel_id: 2,
        sel_src: "../../icons/images/zhongguoyinglianjia.jpg",
        sel_url: "/pages/person_about/master_list/index"
      },
      {
        sel_id: 3,
        sel_src: "../../icons/images/jingeshigejiang.jpg",
        sel_url: "/pages/competition_about/competition_list/index"
      },
      {
        sel_id: 4,
        sel_src: "../../icons/images/guanyuwomen.jpg",
        sel_url: "/pages/about_us/index"
      },
    ],
    // 推荐楹联列表
    coupletList: [],
    // 推荐楹联家列表
    masterList: [],
    // 比赛获奖信息列表
    awardList: []
  },

  // async getSwiperList() {
  //   try {
  //     const res = await request({url: "/post-server/news/getSwiperList"});
  //     var {swiperList} = res.data.data;
  //   } catch (error) {
  //     console.log("请求获取推荐新闻失败");
  //   }
  //   this.setData({
  //     swiperList
  //   });
  // },

  // async getCoupletList() {
  //   try {
  //     const res = await request({url: "/couplet-server/couplet/getCoupletList"});
  //     var {coupletList} = res.data.data;
  //   } catch (error) {
  //     console.log('请求获取推荐楹联失败');
  //   }
  //   this.setData({
  //     coupletList
  //   });
  // },

  // async getMasterList() {
  //   try {
  //     const res = await request({url: "/couplet-server/master/getMasterList"});
  //     var {masterList} = res.data.data;
  //   } catch (error) {
  //     console.log('请求获取推荐楹联家失败');
  //   }
  //   this.setData({
  //     masterList
  //   });
  // },

  // async getAwardList() {
  //   try {
  //     const res = await request({url: "/post-server/award/getAwardList"});
  //     var {awardList} = res.data.data;
  //   } catch (error) {
  //     console.log('请求获取推荐获奖信息失败');
  //   }
  //   this.setData({
  //     awardList
  //   });
  // },

  /**
   * 获取所有推荐信息
   */
  async getInitData() {
    try {
      let res1 = request({url: "/post-server/news/getSwiperList"}).then((res) => {
        if( res.data.code === 20000) {
          var {swiperList} = res.data.data;
          this.setData({
            swiperList
          });          
        } else {
          wx.showToast({
            title: '获取推荐新闻失败',
            icon: 'none'
          })
        }
      });
      let res2 = request({url: "/couplet-server/couplet/getCoupletList"}).then((res) => {
        if( res.data.code === 20000) {
          var {coupletList} = res.data.data;
          this.setData({
            coupletList
          });       
        } else {
          wx.showToast({
            title: '获取推荐楹联失败',
            icon: 'none'
          })
        }
      });
      let res3 = request({url: "/couplet-server/master/getMasterList"}).then((res) => {
        if( res.data.code === 20000) {
          var {masterList} = res.data.data;
          this.setData({
            masterList
          });    
        } else {
          wx.showToast({
            title: '获取推荐楹联家失败',
            icon: 'none'
          })
        }
      });
      let res4 = request({url: "/post-server/award/getAwardList"}).then((res) => {
        if( res.data.code === 20000) {
          var {awardList} = res.data.data;
          awardList.forEach(item => {
            item.awardCreateTime = formatTime(item.awardCreateTime);
          });
          this.setData({
            awardList
          });
        } else {
          wx.showToast({
            title: '获取推荐获奖信息失败',
            icon: 'none'
          })
        }
      });
      // 只有当四个promise都返回fulfill时，才成功
      await Promise.all([res1, res2, res3, res4]);
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData();
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
    // 允许用户下拉刷新
    this.getInitData();
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