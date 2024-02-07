Page({
  data: {
    // 页面数据...
  },

  onLoad: function () {
    // 页面加载时的初始化逻辑...
  },

  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },

  // 其他页面生命周期函数或自定义方法...
})