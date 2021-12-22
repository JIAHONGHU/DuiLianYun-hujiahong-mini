import {baseURL} from '../utils/util.js'
export const login = () => {
  wx.login({
    success: (res) => {
      if(res.code) {
        wx.request({
          url: baseURL + '/user-server/user/login',
          data: {
            code: res.code
          },
          method: 'POST',
          success: (res) => {
            if(res.data) {
              let userSession = {
                userId: res.data.user.userId,
                userPortrait: res.data.user.userPortrait,
                userName: res.data.user.userName,
                token: res.data.token.token
              }
              wx.setStorageSync('userSession', userSession);
            } else {
              wx.showToast({
                title: '进入小程序失败，请重新进入',
                icon: 'none'
              });
              // 登陆失败直接退出小程序，两秒后退出
              setTimeout(() => {
                wx.exitMiniProgram();
              }, 2000);
            }
          }
        })
      }
    },
    fail: () => {
      wx.showToast({
        title: '进入小程序失败，请重新进入',
        icon: 'none',
        duration: 1800,
      });
      // 登陆失败直接退出小程序，两秒后退出
      setTimeout(() => {
        wx.exitMiniProgram();
      }, 2000);
    },
    complete: () => {
    }
  });
}