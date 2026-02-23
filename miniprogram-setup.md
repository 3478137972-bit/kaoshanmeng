# 微信小程序部署指南

## 方案一：WebView 快速部署

### 1. 前置准备

#### 1.1 微信小程序账号
- 注册地址：https://mp.weixin.qq.com
- 获取 AppID（在 开发 → 开发管理 → 开发设置 中）

#### 1.2 域名要求
- 必须是 HTTPS
- 必须有 ICP 备案
- 建议使用你当前的部署域名

### 2. 配置业务域名

#### 2.1 在微信公众平台配置
1. 登录 https://mp.weixin.qq.com
2. 进入：开发 → 开发管理 → 开发设置 → 业务域名
3. 点击"添加"，输入你的域名
4. 下载校验文件（例如：`WxVerifyFile.txt`）

#### 2.2 部署校验文件
将下载的校验文件放到项目的 `public` 目录：
```bash
# 将校验文件复制到 public 目录
cp ~/Downloads/WxVerifyFile.txt ./public/
```

然后重新部署你的 Web 应用。

### 3. 创建小程序项目

#### 3.1 项目结构
```
miniprogram/
├── pages/
│   └── index/
│       ├── index.js
│       ├── index.json
│       ├── index.wxml
│       └── index.wxss
├── app.js
├── app.json
└── app.wxss
```

#### 3.2 核心代码

**app.json**
```json
{
  "pages": [
    "pages/index/index"
  ],
  "window": {
    "navigationBarTitleText": "靠山实战营 AI 助手"
  }
}
```

**pages/index/index.wxml**
```xml
<web-view src="{{webUrl}}"></web-view>
```

**pages/index/index.js**
```javascript
Page({
  data: {
    webUrl: 'https://your-domain.com'
  },
  onLoad: function(options) {
    // 可以通过 URL 参数传递信息
    const token = options.token || '';
    if (token) {
      this.setData({
        webUrl: `https://your-domain.com?token=${token}`
      });
    }
  }
})
```

### 4. 适配微信登录

由于小程序中无法使用 Google OAuth，需要添加微信登录支持。

#### 4.1 在 Web 应用中添加微信登录检测

在 `app/page.tsx` 或登录页面添加：

```typescript
// 检测是否在微信小程序环境
const isInMiniProgram = () => {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.includes('miniprogram');
};

// 如果在小程序中，使用不同的登录方式
if (isInMiniProgram()) {
  // 从 URL 获取小程序传递的用户信息
  const urlParams = new URLSearchParams(window.location.search);
  const openid = urlParams.get('openid');
  // 使用 openid 进行登录
}
```

#### 4.2 添加微信登录 API

创建 `app/api/auth/wechat/route.ts`：

```typescript
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { code } = await request.json();

  // 使用 code 换取 openid
  const response = await fetch(
    `https://api.weixin.qq.com/sns/jscode2session?appid=${process.env.WECHAT_APPID}&secret=${process.env.WECHAT_SECRET}&js_code=${code}&grant_type=authorization_code`
  );

  const data = await response.json();

  // 在数据库中创建或更新用户
  // ...

  return NextResponse.json({ openid: data.openid });
}
```

### 5. 环境变量配置

在 `.env.local` 中添加：

```env
# 微信小程序配置
WECHAT_APPID=your-miniprogram-appid
WECHAT_SECRET=your-miniprogram-secret
```

### 6. 提交审核

1. 在微信开发者工具中点击"上传"
2. 登录微信公众平台
3. 进入：版本管理 → 开发版本
4. 提交审核
5. 等待审核通过（通常 1-7 天）

## 方案二：Taro 原生开发（推荐长期方案）

如果需要更好的用户体验和小程序原生能力，建议使用 Taro 重构。

### 优势
- 原生小程序体验
- 可使用微信支付、分享等能力
- 性能更好

### 工作量评估
- 前端重构：2-3 周
- 后端 API 保持不变
- 需要重写所有 UI 组件

## 常见问题

### Q1: WebView 方案有什么限制？
- 无法使用微信支付
- 无法使用分享功能
- 无法使用小程序原生组件
- 页面跳转受限

### Q2: 如何在 WebView 和小程序之间通信？
使用 `wx.miniProgram.postMessage` 和 URL 参数。

### Q3: 是否需要重新开发登录？
是的，需要将 Google OAuth 替换为微信登录。

## 下一步

1. 确认你的域名是否已备案
2. 准备微信小程序账号
3. 选择部署方案（WebView 或 Taro）
