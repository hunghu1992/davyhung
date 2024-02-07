Page({
  data: {
    imageUrl: '/static/images/qidong.jpg',
  },

  onLoad: function () {
    // 设置3秒后自动跳转至uploadpage页面
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/uploadpage/uploadpage',
      });
    }, 3000);
  }
});