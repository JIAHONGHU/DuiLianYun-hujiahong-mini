import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';
import {request} from '../../../request/index.js';
import {baseURL} from '../../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    phoneIsRight: true,
    emailIsRight: true,
    isShow: false,
    delUrl: '',
    formData: {
      userId: '',
      userNickname:'',
      userMotto:'',
      userPortrait: '',
      userName:'',
      userBirthday:'',
      userLocation:'',
      userPhone:'',
      userEmail:'',
      userIntroduction:''
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
   * 监听用户修改姓名
   */
  changeUserName(e) {
    this.setData({
      [`formData.userName`]: e.detail
    })
  },

  /**
   * 监听用户修改昵称
   */
  changeUserNickname(e) {
    this.setData({
      [`formData.userNickname`]: e.detail
    })
  },

  /**
   * 监听用户修改电话
   */
  changeUserPhone(e) {
    this.setData({
      [`formData.userPhone`]: e.detail
    })
  },

  /**
   * 监听用户修改邮箱
   */
  changeUserEmail(e) {
    this.setData({
      [`formData.userEmail`]: e.detail
    })
  },

  /**
   * 监听用户修改座右铭
   */
  changeUserMotto(e) {
    // 限制座右铭字数
    if(e.detail.length > 20) {
      wx.showToast({
        title: '最多20个字哟',
        duration: 1000,
        icon: 'none'
      });
      this.setData({
        [`formData.userMotto`]: e.detail.slice(0, 20)
      });
    } else {
      this.setData({
        [`formData.userMotto`]: e.detail
      });
    }
  },

  /**
   * 监听用户修改地址
   */
  changeUserLocation(e) {
    this.setData({
      [`formData.userLocation`]: e.detail
    })
  },

  /**
   * 监听用户修改介绍
   */
  changeUserIntroduction(e) {
    this.setData({
      [`formData.userIntroduction`]: e.detail
    })
  },

  /**
   * 验证手机号码
   */
  losePhoneBlur() {
    // 1开头 11位数字
    if(!(/^[1]\d{10}$/.test(this.data.formData.userPhone))){
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
   * 验证邮箱
   */
  loseEmailBlur(){
    if (!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(this.data.formData.userEmail))) {
      this.setData({
        emailIsRight: false
      })
    } else {
      this.setData({
        emailIsRight: true
      });
    }
  },
  
  /**
   * 上传头像图片
   */
  uploadImg(e) {
    wx.showLoading({
      title: '图片上传中',
    });
    const { file } = e.detail;
    wx.uploadFile({
      url: baseURL + '/user-server/user/uploadPortrait',
      filePath: file.url,
      name: 'file',
      header: {
        token: wx.getStorageSync('usersession').token
      },
      success: (res) => {
        let result = JSON.parse(res.data);
        if(result.code === 20000) {
          const {fileList} = this.data;
          fileList.push({url: result.data.url});
          this.setData({
            fileList,
            [`formData.userPortrait`]: result.data.url
          });
          wx.showToast({
            title: '图片上传成功',
            duration: 1000,
          });						
        } else {
          wx.showToast({
            title: '图片上传失败',
            icon: 'none',
            duration: 1000
          });
          // 上传失败就清空数组
          this.setData({
            fileList: []
          });
        }
      },
      fail: (res) => {
      // 提示请求失败信息
        console.log(res);
        // 上传失败就清空数组
        this.setData({
          fileList: []
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    })
  },

  /**
   * 删除头像图片
   */
  async deleteImg(event) {
    this.data.delUrl = this.data.fileList[event.detail.index].url;
    const { fileList } = this.data;
    fileList.splice(event.detail.index, 1);
    this.setData({
      fileList,
    });
  },

  /**
   * 提交后从数据库删除头像图片
   */
  async deleteImg2() {
    const url = '/user-server/user/deletePortrait';
    const reqData = {
      filePath: this.data.delUrl
    };
    try {
      const res = await request({url: url, data: reqData, method: 'POST'});
      if(res.data.code === 20000) {
        console.log('图片删除成功');
      } else {
        console.log('图片删除失败');
      }
    } catch (error) {
      console.log('请求删除图片失败');
    }
  },

  /**
   * 提交修改信息
   */
  async submit() {
    if(this.data.formData.userNickname && this.data.formData.userName
        && this.data.formData.userPhone && this.data.formData.userLocation
        && this.data.formData.userBirthday && this.data.formData.userEmail
        && this.data.formData.userIntroduction && this.data.formData.userMotto
        ) { 
          // 如果都不为空，才能上传
          if(!this.data.phoneIsRight || !this.data.emailIsRight) {
            return;
          }
          // 发送请求
          const url = '/user-server/user/modifyUserInformation';
          try {
            const res = await request({url: url, data: this.data.formData, method: 'POST'});
            if(res.data.code === 20000) {
              let userSession = wx.getStorageSync('userSession');
              userSession.userPortrait = this.data.formData.userPortrait;
              wx.setStorageSync('userSession', userSession);
              wx.showToast({
                title: '修改成功',
                duration: 2000
              });
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1,
                })                
              }, 2000);
            } else {
              wx.showToast({
                title: '修改失败',
                duration: 2000,
                icon: 'none'
              });
            }
          } catch (error) {
            // 提示请求失败信息
            console.log(error);
          }
        } else {
          Notify({
            message: '请填写完整带星号内容',
            safeAreaInsetTop: true,
            background: "#faae58",
            duration: 1000
          });
        }
    this.deleteImg2()
  },

  /**
   * 重置修改信息
   */
  reset() {
    // 设置页面数据
    this.setData({
      isShow: false,
    });
    this.getUserInformation();
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
      [`formData.userBirthday`]: batchTime,
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
   * 获取用户信息
   */
  async getUserInformation() {
    // 发送请求
    const url = '/user-server/user/getUserInformation';
    const reqData = {
      userId: wx.getStorageSync('userSession').userId
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        this.setData({
          formData: res.data.data.formData
        });
        this.setData({
          fileList: [{url: this.data.formData.userPortrait}]
        })
      } else {
        wx.showToast({
          title: '获取信息失败',
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInformation();
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