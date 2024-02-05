Page({
  async onLoad() {
    wx.cloud.init({
      env: 'prod-0gi5h53v7bb1a7c8',
    })
    const that = this
    await wx.chooseImage({
      count: 1,
      async success(res){
        console.log(res.tempFilePaths)
        const result = await that.uploadFile(res.tempFilePaths[0], 'test/test.jpeg', function(res){
          console.log(`上传进度：${res.progress}%，已上传${res.totalBytesSent}B，共${res.totalBytesExpectedToSend}B`)
          // if(res.progress > 50){ // 测试文件上传一半就终止上传
          //   return false
          // }
        })
        console.log(result)
      }
    })
  },
  /**
   * 上传文件到微信云托管对象存储
   * @param {*} file 微信本地文件，通过选择图片，聊天文件等接口获取
   * @param {*} path 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
   * @param {*} onCall 上传回调，文件上传过程监听，返回false时会中断上传
   */
  uploadFile(file, path, onCall = () => {}) {
    return new Promise((resolve, reject) => {
      const task = wx.cloud.uploadFile({
        cloudPath: path,
        filePath: file,
        config: {
          env: 'prod-0gi5h53v7bb1a7c8' // 需要替换成自己的微信云托管环境ID
        },
        success: res => resolve(res.fileID),
        fail: e => {
          const info = e.toString()
          if (info.indexOf('abort') != -1) {
            reject(new Error('【文件上传失败】中断上传'))
          } else {
            reject(new Error('【文件上传失败】网络或其他错误'))
          }
        }
      })
      task.onProgressUpdate((res) => {
        if (onCall(res) == false) {
          task.abort()
        }
      })
    })
  }
})