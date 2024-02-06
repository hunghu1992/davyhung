const app = getApp();

// 定义环境变量
const ENV_ID = 'prod-0gi5h53v7bb1a7c8'; // 替换成实际环境ID

// 页面配置
Page({
  data: {
    showUploadStatus: false,
    uploadProgress: 0,
    uploadResultMessage: '',
    uploadResultType: '',
  },

  onLoad() {
    wx.cloud.init({ env: ENV_ID });
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
        success: (res) => resolve(res.fileID),
        fail: (e) => reject(new Error(`【文件上传失败】${e.errMsg}`)),
        onProgressUpdate: (res) => this.updateUploadProgress(res.progress),
      });
    });
  }
});