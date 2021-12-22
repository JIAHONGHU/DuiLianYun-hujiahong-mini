import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import {request} from '../../../request/index.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    currentMasterList: [],
    ancientMasterList: [],
    inputKey:''
  },

  current_pageNum: 1,
  current_totalPages: 1,
  ancient_pageNum: 1,
  ancient_totalPages: 1,
  pageSize: 20,

  /**
   * 切换tab
   */
  changeTab(e) {
    const {index} = e.detail;
    // 切换tab需要清空搜索输入
    this.setData({
      active: index,
      inputKey: '',
    });
    if(this.data.active === 0) {
      if(this.data.currentMasterList.length === 0) {
        this.getCurrentMasterList();
      }
    } else {
      if(this.data.ancientMasterList.length === 0) {
        this.getAncientMasterList();
      }
    }
  },

  /**
   * 监听用户搜索输入
   */
  changeInput(e) {
    this.setData({
      inputKey : e.detail,
    });
  },

  /**
   * 获取当代楹联家列表
   */
  async getCurrentMasterList() {
    const url = '/couplet-server/master/getMasterListByType'
    const reqData = {
      pageNum: this.current_pageNum,
      pageSize: this.pageSize,
      inputKey: this.data.inputKey,
      listType: 0,
      userId: wx.getStorageSync('userSession').userId
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        const {total} = res.data.data;
        this.current_totalPages = Math.ceil(total / this.pageSize);
        this.setData({
          currentMasterList: [...this.data.currentMasterList, ...res.data.data.masterList]
        });
      } else {
        wx.showToast({
          title: '获取当代楹联家失败',
          duration: 1000,
          icon: 'none'
        });
      }      
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * 获取古代（非当代）楹联家列表
   */
  async getAncientMasterList() {
    const url = '/couplet-server/master/getMasterListByType'
    const reqData = {
      pageNum: this.ancient_pageNum,
      pageSize: this.pageSize,
      inputKey: this.data.inputKey,
      listType: 1,
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        const {total} = res.data.data;
        this.ancient_totalPages = Math.ceil(total / this.pageSize);
        this.setData({
          ancientMasterList: [...this.data.ancientMasterList, ...res.data.data.masterList]
        });
      } else {
        wx.showToast({
          title: '获取古代楹联家失败',
          duration: 1000,
          icon: 'none'
        });
      }      
    } catch (error) {
      console.log(error);
    }
  },

	/**
	 * 取消搜索
	 */
  cancelSearch() {
    // 清空搜索输入，重新拉取数据，待优化
    this.setData({
      inputKey: ''
    });
    if(this.data.active === 0) {
      this.current_pageNum = 1;
      this.setData({
        currentMasterList: []
      });
      this.getCurrentMasterList();
    } else {
      this.ancient_pageNum = 1;
      this.setData({
        ancientMasterList: []
      });
      this.getAncientMasterList();
    }
  },

	/**
	 * 搜索楹联家
   * 用户在键盘点击确定，或者搜获触发
	 */
  async onSearch() {
    if(this.data.active === 0) {
      this.current_pageNum = 1;
      this.setData({
        currentMasterList: []
      });
      this.getCurrentMasterList();
    } else {
      this.ancient_pageNum = 1;
      this.setData({
        ancientMasterList: []
      });
      this.getAncientMasterList();
    }
  },

	/**
	 * 关注楹联家
	 */
  doAttention(e) {
    let currentMasterList = this.data.currentMasterList;
    // 根据id获取改楹联家在列表中的下表
    let index = currentMasterList.findIndex(v => v.masterBindedUserId === e.currentTarget.dataset.masterbindeduserid);
    if(currentMasterList[index].attention === true) {
      Dialog.confirm({
        message: '确定取消关注该楹联家？',
      }).then(async () => {
          // on confirm
          const url = '/user-server/relationship/cancelAttention';
          const reqData = {
            userId: wx.getStorageSync('userSession').userId,
            userId2: this.data.currentMasterList[index].masterBindedUserId
          };
          try {
            const res = await request({url: url, data: reqData, method: 'POST'});
            if(res.data.code === 20000 ) {
              // 更新关注状态
              currentMasterList[index].attention = !currentMasterList[index].attention;
              this.setData({
                currentMasterList
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
      // 判断是不是自己进入自己主页
      if(wx.getStorageSync('userSession').userId === this.data.currentMasterList[index].masterBindedUserId) {
        wx.showToast({
          title: '不能自己关注自己哟',
          icon: 'none',
          duration: 1000
        });
        return ;
      }
      Dialog.confirm({
        message: '确定关注该楹联家？',
      }).then(async () => {
        // on confirm
        const url = '/user-server/relationship/doAttention';
        const reqData = {
          userId: wx.getStorageSync('userSession').userId,
          userId2: this.data.currentMasterList[index].masterBindedUserId
        };
        try {
          const res = await request({url: url, data: reqData, method: 'POST'});
          if(res.data.code === 20000 ) {
            currentMasterList[index].attention = !currentMasterList[index].attention;
            this.setData({
              currentMasterList
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
    if(this.data.active === 0) {
      this.current_totalPages = 1;
      this.setData({
        currentMasterList: []
      });
      this.getCurrentMasterList();
    } else {
      this.ancient_pageNum = 1;
      this.setData({
        ancientMasterList: []
      });
      this.getAncientMasterList();
    }
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
      this.current_totalPages = 1;
      this.setData({
        currentMasterList: []
      });
      this.getCurrentMasterList();
    } else {
      this.ancient_pageNum = 1;
      this.setData({
        ancientMasterList: []
      });
      this.getAncientMasterList();
    }
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.active === 0) {
      if(this.current_pageNum >= this.current_totalPages) {
        wx.showToast({
          title: '到底啦！',
          duration: 1000,
          icon: 'none'
        });
      } else {
        this.current_pageNum++;
        this.getCurrentMasterList();
      }
    } else {
      if(this.ancient_pageNum >= this.ancient_totalPages) {
        wx.showToast({
          title: '到底啦！',
          duration: 1000,
          icon: 'none'
        });
      } else {
        this.ancient_pageNum++;
        this.getAncientMasterList();
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})