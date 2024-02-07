Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "pages/homepage",
      iconPath: "/static/icon/home.png",
      selectedIconPath: "/static/icon/tohome.png",
      text: ""
    }, {
      pagePath: "pages/uploadpage",
      iconPath: "/static/icon/upload.png",
      selectedIconPath: "/static/icon/toupload.png",
      text: ""
    }]
  },
  attached() {
    const appInstance = getApp();
    appInstance.registerTabBarComponent(this);
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      console.log('Switching to page:', data.path); // 添加这行来打印即将跳转的页面路径
      wx.switchTab({url: data.path});
      this.setData({
        selected: data.index
      });
    },
    updateSelectedIndex(index) {
      this.setData({ selected: index });
    },
  },
})