import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';
import {request} from '../../../request/index.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    active: false,
    phoneIsRight: true,
    idcardIsRight: true,
    formData: {
      memberBindedUserId: '',
      memberName: '',
      memberGender: '',
      memberPhone: '',
      memberIdcard: '',
      memberBirthday: '点击选择出生日期',
      memberApplicationReason: ''
    },
    currentDate: new Date(1990,6,10).getTime(),
    minDate: new Date(1900, 1, 1).getTime(),
    maxDate:  new Date().getTime(),
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      return value;
    },
  },

  /**
   * 监听用户修改名字
   */
  changeMemberName(e) {
    this.setData({
      [`formData.memberName`]: e.detail
    })
  },

  /**
   * 监听用户修改性别
   */
  changeMemberGender(e) {
    this.setData({
      [`formData.memberGender`]: e.detail
    })
  },

  /**
   * 监听用户修改电话
   */
  changeMemberPhone(e) {
    this.setData({
      [`formData.memberPhone`]: e.detail
    })
  },

  /**
   * 监听用户修改微信
   */
  changeMemberIdcard(e) {
    this.setData({
      [`formData.memberIdcard`]: e.detail
    })
  },

  /**
   * 监听用户修改申请理由
   */
  changeMemberApplicationReason(e) {
    this.setData({
      [`formData.memberApplicationReason`]: e.detail
    })
  },

  /**
   * 验证手机号码
   */
  losePhoneBlur() {
    // 1开头 11位数字
    if(!(/^[1]\d{10}$/.test(this.data.formData.memberPhone))){
      this.setData({
        phoneIsRight: false
      })
    } else {
      this.setData({
        phoneIsRight: true
      });
    }
  },

  /**
   * 验证身份证
   */
  loseIdcardBlur() {
    if(!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.data.formData.memberIdcard))){
      this.setData({
        idcardIsRight: false
      })
    } else {
      this.setData({
        idcardIsRight: true
      });
    }
  },

  /**
   * 提交申请信息
   */
  async submit() {
    if(this.data.formData.memberName && this.data.formData.memberGender
        && this.data.formData.memberPhone && this.data.formData.memberWechat
        && this.data.formData.memberBirthday && this.data.formData.memberApplicationReason) {
          // 带星号信息完整则允许发送请求
          if(!this.data.phoneIsRight || !this.data.idcardIsRight) {
            return;
          }
          // 发送请求
          const url = '/user-server/member/applyMember';
          try {
            const res = await request({url: url, data: this.data.formData, method: 'POST'});
            if(res.data.code === 20000) {
              wx.showToast({
                title: '申请成功',
                duration: 1500
              });
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1,
                });                
              }, 1500);
            } else {
              wx.showToast({
                title: '申请失败',
                icon: 'none',
                duration: 2000
              });
            }
          } catch (error) {
            // 请求错误则打印错误信息
            console.log(error);
          }
        } else {
          // 信息不完整则不允许发送请求，提示错误信息
          Notify({
            message: '请填写完整带星号内容',
            safeAreaInsetTop: true,
            background: "#faae58",
            duration: 1000
          });
        }
  },

  /**
   * 重置申请信息
   */
  reset() {
    // 设置页面数据
    this.setData({
      active: false,
      isShow: false,
      formData: {
        memberBindedUserId: wx.getStorageSync('userSession').userId,
        memberName: '',
        memberGender: '',
        memberPhone: '',
        memberWechat: '',
        memberBirthday: '点击选择出生日期',
        memberApplicationReason: ''
      }
    })
  },

  /**
   * 显示出生日期选择弹出层
   */
  showTime() {
    this.setData({
      isShow: true
    });
  },

  /**
   * 格式化时间
   */
  confirmTime(e) {
    let d = new Date(e.detail);
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let batchTime = '';
    if (month < 10) 
      month = '0' + month;
    if (day < 10)
      day = '0' + day;
    batchTime = d.getFullYear() + '-' + month + '-' + day;
    this.setData({
      isShow: false,
      [`formData.memberBirthday`]: batchTime,
      active: true
    });
  },

  /**
   * 隐藏出生日期选择弹出层
   */
  cancelTime() {
    this.setData({
      isShow: false
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      [`formData.memberBindedUserId`]: wx.getStorageSync('userSession').userId
    })
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