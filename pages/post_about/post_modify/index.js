import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';
import { request } from '../../../request/index.js';

Page({

  /**
   * 页面的初始数据
   */
  //初始化数据
  data: {
    postId: '',
    formData: {
      postId: '',
      postTitle: '',
      postUserName: '',
      postFirstLine: '',
      postSecondLine: '',
      postAppreaciation: '',
      postExplanation: '',
      postType: ''
    },
  },

  /**
   * 监听用户修改标题
   */
  changeTitle(e) {
    this.setData({
      [`formData.postTitle`]: e.detail
    })
  },

  /**
   * 监听用户修改上联
   */
  changeFirstLine(e) {
    this.setData({
      [`formData.postFirstLine`]: e.detail
    })
  },

  /**
   * 监听用户修改下联
   */
  changeSecondLine(e) {
    this.setData({
      [`formData.postSecondLine`]: e.detail
    })
  },

  /**
   * 监听用户修改赏析
   */
  changeAppreaciation(e) {
    this.setData({
      [`formData.postAppreaciation`]: e.detail
    })
  },

  /**
   * 监听用户修改注释
   */
  changeExplanation(e) {
    this.setData({
      [`formData.postExplanation`]: e.detail
    })
  },

  /**
   * 提交修改
   */
  async submit() {
    if(this.data.formData.postTitle && this.data.formData.postFirstLine
        && this.data.formData.postSecondLine) {
          const url = '/post-server/post/modifyPost';
          this.setData({
            [`formData.postId`]: this.data.postId
          });
          try {
            const res = await request({url: url, data: this.data.formData, method: 'POST'});
            if(res.data.code === 20000) {
              wx.showToast({
                title: '修改成功',
                duration: 1500,
              });
              // 延迟返回
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1,
                });                
              }, 1500);
            } else {
              wx.showToast({
                title: '修改帖子失败',
                duration: 1000,
                icon: 'none'
              });
            }
          } catch (error) {
            console.log(error)
          }
    } else {
      Notify({
        message: '请填写完整带星号内容',
        safeAreaInsetTop: true,
        background: "#faae58",
        duration: 1000
      });
    }
  },

  /**
   * 重置数据
   */
  reset() {
    this.getFormData();
  },

  /**
   * 获取原有帖子信息
   */
  async getFormData() {
    const url = "/post-server/post/getBasePostInfo";
    const reqData = {
      postId: this.data.postId
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        this.setData({
          formData: res.data.data.formData
        });
      } else {
        wx.showToast({
          title: '获取帖子信息失败',
          duration: 1000,
          icon: 'none'
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      postId: options.postId
    });
    this.getFormData();
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