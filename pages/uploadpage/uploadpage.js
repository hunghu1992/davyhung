Page({
  data: {
    imageUrl: '',
    showImage: false,
    uploadResult: '',
  },
  chooseImage: function() {
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        this.uploadFile(tempFilePaths[0])
      },
      fail: (err) => {
        this.setData({ uploadResult: '选择图片失败：' + err.errMsg });
      }
    })
  },
  uploadFile: function(filePath) {
    wx.showLoading({ title: '正在上传...' });
    wx.cloud.uploadFile({
      cloudPath: 'user_photos/' + Date.now() + '.jpg', // 云端保存的文件名
      filePath: filePath,
      success: (res) => {
        wx.hideLoading();
        this.setData({
          imageUrl: filePath,
          showImage: true,
          uploadResult: '上传成功，云文件ID：' + res.fileID,
        });
        this.sendToServer(res.fileID);
      },
      fail: (err) => {
        wx.hideLoading();
        this.setData({ uploadResult: '上传失败：' + err.errMsg });
      }
    })
  },
  sendToServer: function(fileID) {
    wx.request({
      url: 'https://yourserver.com/api/upload/image', // 替换为你的Django后端API地址
      method: 'POST',
      header: {
        'content-type': 'application/json' // 按实际情况调整请求头
      },
      data: JSON.stringify({ file_id: fileID }), // 将fileID转换为JSON格式发送给后端
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({ uploadResult: '图片已成功发送至服务器，处理结果：' + res.data.message });
        } else {
          this.setData({ uploadResult: '发送图片至服务器失败：' + res.data.error });
        }
      },
      fail: (err) => {
        this.setData({ uploadResult: '发送图片至服务器失败：' + err.errMsg });
      }
    });
  }
})