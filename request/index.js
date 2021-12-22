import {baseURL} from '../utils/util.js';

// 记录同时发送请求的个数
let AjaxTimes = 0;

// 调用时先在js文件中导入该函数，然后传入参数即可
// 参数传入形式{url:xxx, data:xxx, method: xxx}
// method只有POST请求需要说明，url只需传入后面一截就好了，data也只需要在有需要的时候传入即可
export const request=(params)=>{
  AjaxTimes++;
  wx.showLoading({
    title: '加载中',
    mask: true
  });
  
  return new Promise((resolve, reject)=>{
    if(params.method === 'POST') {
      var header = {
        "token" : wx.getStorageSync('userSession').token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }      
    } else {
      var header = {
        "token" : wx.getStorageSync('userSession').token,
      }    
    }
    wx.request({
      ...params,
      url : baseURL + params.url,
      header : header,
      success:(result)=>{
        resolve(result);
      },
      fail:(err)=>{
        reject(err);
      },
      complete:()=>{
        AjaxTimes--;
        //  关闭加载中
        if (AjaxTimes === 0) {
          wx.hideLoading();
        }
      }
    })
  })
}


/**  
* object 对象合并  
* o1     对象一  
* o2     对象二  
*/  
// function mergeObj(o1, o2) {  
//   for (var key in o2) {  
//     o1[key] = o2[key]  
//   }  
//   return o1;  
//   }  
  