Page({
  data: {
    imageList: [],
    // Swiper组件相关配置
    indicatorDots: true, // 是否显示面板指示点
    autoplay: false, // 是否自动切换
    interval: 3000, // 自动切换时间间隔（单位ms）
    duration: 500, // 滑动动画时长（单位ms）
    screenHeight: 0,
    },
  onLoad: function () {
    wx.cloud.init({
        env: 'davy-9gnk5y262b1ce300', // 替换为你的云开发环境ID
      });
      this.getRandomPhotos().then((photoIds) => {
        console.log('Random photo IDs:', photoIds);
        return this.getPhotoUrls(photoIds);
      }).then((urls) => {
        console.log('Image URLs:', urls);
        // 直接设置imageList数据
    this.setData({ imageList: urls });
    });
  },
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
    },
  async getRandomPhotos() {
    const result = await wx.cloud.database().collection('photo').orderBy('random()', '_desc').limit(3).get();
    return result.data.map(item => item.photoId);
    },
  async getPhotoUrls(photoIds) {
    const tasks = photoIds.map(async (id) => {
        const tempFileResult = await wx.cloud.getTempFileURL({
          fileList: [id],
          });
        return tempFileResult.fileList[0].tempFileURL;
        });
      
        const urls = await Promise.all(tasks);
        return urls;
    }
  // 其他页面生命周期函数或自定义方法...
})