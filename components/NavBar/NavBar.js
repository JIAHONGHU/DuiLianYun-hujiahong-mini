const app = getApp()
Component({
  properties: {
  },
  data: {
    navBarHeight: '',
    navStatusHeight: '',
    navBarImg: "../../icons/navImage.png",
  },
  attached: function() {
    this.setData({
      navBarHeight: app.globalData.navBarHeight,
      navStatusHeight: app.globalData.navStatusHeight
    })
  },
  methods: {

  },
  // 使用全局样式
  options: {
    addGlobalClass: true
  }
})