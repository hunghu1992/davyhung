
const app = getApp();

// 定义环境变量
const ENV_ID = 'prod-0gi5h53v7bb1a7c8'; // 替换成实际环境ID

// 页面配置
Page({
  onLoad() {
    wx.cloud.init('prod-0gi5h53v7bb1a7c8' )
    },

  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1 // 注意这里应该是对应uploadpage在tabbar.list中的索引，假设uploadpage是第二个，所以为1
      });
    }
  },
    
  data: {
    showUploadStatus: false,
    uploadProgress: 0,
    uploadResultMessage: '',
    uploadResultType: '',
  },

  startUploadProcess() {
    this.setData({ showUploadStatus: true });
  },

  clearUploadStatus() {
    this.setData({
      uploadResultMessage: '',
      uploadResultType: '',
      uploadProgress: 0,
      showUploadStatus: false,
    });
  },

  showUploadError(errorMessage) {
    this.setData({
      uploadResultMessage: errorMessage,
      uploadResultType: 'error',
    });
  },

  showUploadSuccess(successMessage) {
    this.setData({
      uploadResultMessage: successMessage,
      uploadResultType: 'success',
    });
  },

  // 新增：生成唯一文件路径的方法
  generateUniqueFilePath(tempFilePath) {
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}_${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const extension = tempFilePath.substring(tempFilePath.lastIndexOf('.') + 1);
    const uniquePath = `uploads/${formattedDate}_1.${extension}`;
    return uniquePath;
  },

  async onUploadClick() {
    const _this = this;
    _this.startUploadProcess();
    try {
      // 使用wx.chooseImage让用户选择图片
      const { tempFiles } = await wx.chooseImage({
        count: 1, // 只允许用户选择一张图片
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
      });

      if (tempFiles.length > 0) {
        const tempFilePath = tempFiles[0].path; // 获取第一张选中的图片临时路径
        const dynamicPath = await this.generateUniqueFilePath(tempFilePath);
        const fileID = await this.uploadFileToCloudStorage(tempFilePath, dynamicPath);
        this.showUploadSuccess('文件上传成功');
      }
    } catch (error) {
      _this.showUploadError(error.message || '文件上传失败，请重试');
    } finally {
      setTimeout(() => _this.clearUploadStatus(), 2000);
    }
  },

  // ... 其他相关方法 ...

  updateUploadProgress(progress) {
    this.setData({ uploadProgress: progress });
  },

  async uploadFileToCloudStorage(file, cloudPath) {
    return new Promise((resolve, reject) => {
      wx.cloud.uploadFile({
        cloudPath,
        filePath: file,
        config: { env: "prod-0gi5h53v7bb1a7c8" },
        success: (res) => {
            const fileID = res.fileID;
            this.saveFileIdToDatabase(fileID); // 新增：保存fileID到数据库
            resolve(fileID);
          },
        fail: (e) => reject(new Error(`【文件上传失败】${e.errMsg}`)),
        onProgressUpdate: (res) => this.updateUploadProgress(res.progress),
      });
    });
  },
  // 添加保存file ID到数据库的方法
  saveFileIdToDatabase(fileID) {
    wx.cloud.database().collection('photo').add({
      data: {
        photoId: fileID,
        createdAt: new Date(),
      },
      success: () => console.log('File ID saved to database successfully.'),
      fail: console.error,
    });
  }
});