import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';
import {request} from "../../../request/index";
import { formatTime } from '../../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHeight: 0,
    addOrRemove:"加入书架",
    userPortrait: '',
    documentInfo:{
      documentName:"",
      documentPicture:"",
      documemtIntroduction:"",
      documentScore:"",
      documentStar:""
    },
    documentCommentList: [],
    userCommentInput: "",
    userStarInput: 1,
    //判断评论列表是否为空
    isCommentEmpty: true,
    //判断弹出层是否弹出
    shouldShowPopup: false,
  },

  //当前资料的id
  documentId:"",
  //评论分页，每一页的size
  pageSize: 20,
  //当前显示到第几页
  pageNum: 1,
  //总页数
  totalPages: 0,

    /**
   * 显示评论框
   */
  showPopup() {
    this.setData({ shouldShowPopup: true });
  },

  /**
   * 关闭评论框
   */
  onClosePopup() {
    this.setData({ shouldShowPopup: false });
  },

  /**
   * 根据类型选择书籍管理操作
   */
  dealAddOrRemove(){
    if(this.data.addOrRemove === "加入书架"){
      this.addDocumentByDocumentId();
    } else{
      this.deleteDocumentByDocumentId();
    }
  },

  /**
   * 增加浏览记录
   */
  async doBrowse() {
    const url = '/file-server/document-browse/doBrowse';
    const reqData = {
      userId: wx.getStorageSync('userSession').userId,
      documentId: this.documentId
    };
    try {
      const res = await request({url: url, data: reqData, method: 'POST'});
      if(res.data.code === 20000) {
        console.log('增加浏览书籍记录成功');
      } else {
        console.log('增加浏览书记记录失败');
      }
    } catch (error) {
      console.log(error);
    }
  },

  async readDcoument() {
    const url = '/file-server/document/readDocument';
    const reqData = {
      documentId: this.documentId
    };
    try {
      const res = await request({url: url, data: reqData});
      if(res.data.code === 20000) {
        wx.downloadFile({
          url: res.data.filePath,
          success: function (res) {
            const filePath = res.tempFilePath
            wx.openDocument({
              filePath: filePath,
              success: function (res) {
                console.log('打开文档成功')
              }
            });
          }
        });
      } else {
        wx.showToast({
          title: '打开文件失败',
          icon: 'none',
          duration: 2000
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  /**
   * 将书籍加入书架
   */
  async addDocumentByDocumentId(){
    const requestData = {
      documentId:this.documentId,
      userId: wx.getStorageSync('userSession').userId
    }
    let url="/file-server/document-collection/addDocument";
    try{
      const res = await request({url: url, data: requestData, method: 'POST'});
      if(res.data.code == 20000){
        this.setData({
          addOrRemove: '移出书架'
        })
        wx.showToast({
          title: '加入书架成功',
          icon: 'none'
        })
      } else{
        wx.showToast({
          title: '加入书架失败',
          icon: 'none'
        })
      }
    }catch(error) {
      console.log(error)
    }
  },

  /**
   * 将书籍移除书架
   */
  async deleteDocumentByDocumentId(){
    let url="/file-server/document-collection/deleteDocumentByDocumentId";
    try{
      const requestData = {
        documentId: this.documentId,
        userId: wx.getStorageSync('userSession').userId
      }
      const res = await request({url: url, data:requestData, method: 'POST'});
      if(res.data.code == 20000){
        this.setData({
          addOrRemove: '加入书架'
        })
        wx.showToast({
          title: '移出书架成功',
          icon: 'none',
          duration: 1000
        })
      } else {
        wx.showToast({
          title: '移出书架失败',
          icon: 'none',
          duration: 1000
        })
      }
    }catch(error){
      console.log(error)
    }
  },

  /**
   * 监听用户输入评论
   */
  onCommentFieldChange(event) {
    var input = event.detail;
    this.setData({
      userCommentInput:input
    })
  },

  /**
   * 监听用户输入评分
   */
  onCommentRateChange(event){
    //event,detail 为输入的评分星数
    var input = event.detail;
    this.setData({
      userStarInput:input
    })
  },

  /**
   * 获取资料详情
   */
  async getDocumentDetail(){
    const documentDetailData={
      documentId: this.documentId,
      userId: wx.getStorageSync('userSession').userId
    }
    try{
      const res = await request({url: "/file-server/document/getDocumentDetail",data:documentDetailData});
      if( res.data.code === 20000) {
        let {documentInfo} = res.data.data;
        if(res.data.data.isCollection){
          this.setData({
            addOrRemove: "移出书架"
          })
        } else {
          this.setData({
            addOrRemove: '加入书架'
          })
        }
        this.setData({
          documentInfo
        })
      }
    } catch(error){
      console.log(error)
    }
  },

  /**
   * 获取资料评论
   */
  async getDocumentComment(){
    const commentPageData={
      documentId: this.documentId,
      pageSize: this.pageSize,
      pageNum: this.pageNum,
    }
    try{
      const res = await request({url: "/file-server/document-comment/getDocumentComment",data: commentPageData});
      if(res.data.code === 20000){
        const {total} = res.data.data;
        this.totalPages = Math.ceil(total / this.pageSize);
        var {documentCommentList} = res.data.data;
        documentCommentList.forEach(item => {
          item.documentCommentTime = formatTime(item.documentCommentTime);
        });
        this.setData({
          documentCommentList: [...this.data.documentCommentList, ...documentCommentList]
        });
        if(documentCommentList.length !== 0) {
          this.setData({
            isCommentEmpty: false
          });
        } else {
          this.setData({
            isCommentEmpty: true
          });
        }
      } else{
        wx.showToast({
          title: '获取信息失败，请重试',
          icon: 'none',
          duration: 1000
        })
        this.setData({
          isCommentEmpty:true
        })
      }
    } catch(error) {
      console.log(error);
    }
  },
  
  /**
   * 发表评论
   */
  async addDocumentComment(){
    let url ="/file-server/document-comment/addDocumentComment";
    var newDocumentComment={
      documentCommentUserId: wx.getStorageSync('userSession').userId,
      documentCommentDocumentId: this.documentId,
      documentCommentContent: this.data.userCommentInput,
      documentCommentStar: this.data.userStarInput
    };
    if(!this.data.userCommentInput || !this.data.userStarInput) {
      Notify({
        message: '请填写完整读后感和评分',
        safeAreaInsetTop: true,
        background: "#faae58",
        duration: 1000
      });
    } else {
      Toast.loading({
        message: '提交中...',
        forbidClick: true,
      });
      try{
        const result = await request({url: url, data:newDocumentComment, method: 'POST'});
        if(result.data.code === 20000) {
          this.pageNum = 1;
          this.setData({
            shouldShowPopup: false,
            documentCommentList: [],
            userStarInput: 1,
            userCommentInput: ''
          });
          Toast.success('提交成功');
          // 需要重新拉取数据
          this.getDocumentDetail();
          this.getDocumentComment();
        }
        else {
          Toast("提交评论失败");
        }
      } catch(error) {
        console.log(error);
      }
    }
  },

  /**
   * 查看评论触底
   */
  onScrollReachBottom() {
    if (this.pageNum >= this.totalPages) {
      wx.showToast({
        icon: 'none',
        title: '到底啦！',
        duration: 1000
      });
    } else{
      this.pageNum++;
      this.getDocumentComment();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //url中存放着资料id，通过options获取
    this.documentId=options.documentId;
    this.setData({
      userPortrait: wx.getStorageSync('userSession').userPortrait
    });
    this.getDocumentDetail();
    this.getDocumentComment();
    this.doBrowse();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 计算的时候，不能有没有确定宽高的图标或者图片
    setTimeout(() => {
      const query = wx.createSelectorQuery()
      query.selectAll('.minusView').boundingClientRect()
      query.exec((res) => {
        this.setData({
          scrollHeight: (wx.getSystemInfoSync().windowHeight - res[0][0].height - res[0][1].height -  res[0][2].height)
        });
      });
    }, 200);
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
    this.setData({
      documentCommentList:[]
    });
    console.log(this.data.documentCommentList.length)
    this.pageNum = 1;
    this.getDocumentDetail();
    this.getDocumentComment();
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