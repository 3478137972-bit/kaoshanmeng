// app.js
App({
  onLaunch() {
    console.log('小程序启动');

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo;
            }
          });
        }
      }
    });
  },

  globalData: {
    userInfo: null,
    webUrl: 'https://your-domain.com' // 替换为你的实际域名
  }
});
