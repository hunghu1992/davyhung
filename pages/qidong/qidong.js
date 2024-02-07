// pages/qidong/qidong.js
const app = getApp();
Page({
  onLoad() {
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/homepage/homepage'
      });
      // 同步更新TabBar选中状态
      app.setCurrentTab(0);
    }, 3000);
  }
});