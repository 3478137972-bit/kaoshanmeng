// pages/index/index.js
const app = getApp();

Page({
  data: {
    webUrl: ''
  },

  onLoad(options) {
    // 获取微信登录凭证
    wx.login({
      success: res => {
        if (res.code) {
          // 发送 code 到后端换取 openid
          this.getOpenId(res.code);
        }
      }
    });

    // 设置 WebView URL
    this.setData({
      webUrl: app.globalData.webUrl
    });
  },

  getOpenId(code) {
    wx.request({
      url: `${app.globalData.webUrl}/api/auth/wechat`,
      method: 'POST',
      data: { code },
      success: res => {
        if (res.data.openid) {
          // 将 openid 添加到 URL 参数中
          this.setData({
            webUrl: `${app.globalData.webUrl}?openid=${res.data.openid}`
          });
        }
      },
      fail: err => {
        console.error('获取 openid 失败', err);
        // 即使失败也加载页面
        this.setData({
          webUrl: app.globalData.webUrl
        });
      }
    });
  },

  // 监听 WebView 消息
  handleMessage(e) {
    console.log('收到 WebView 消息', e.detail.data);
  }
});
