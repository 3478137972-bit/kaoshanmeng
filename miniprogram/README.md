# 微信小程序快速部署指南

## 📋 已为你准备的文件

我已经创建了以下文件：

### 小程序代码（miniprogram 目录）
- `app.js` - 小程序入口文件
- `app.json` - 小程序配置
- `app.wxss` - 全局样式
- `pages/index/index.js` - 首页逻辑
- `pages/index/index.wxml` - 首页模板
- `pages/index/index.json` - 首页配置
- `pages/index/index.wxss` - 首页样式

### 后端 API
- `app/api/auth/wechat/route.ts` - 微信登录接口

## 🚀 快速开始

### 第一步：配置环境变量

在 `.env.local` 文件中添加：

```env
# 微信小程序配置
WECHAT_APPID=你的小程序AppID
WECHAT_SECRET=你的小程序AppSecret
```

### 第二步：更新数据库

在 Supabase 的 SQL Editor 中执行：

```sql
-- 添加微信 openid 字段
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS wechat_openid TEXT UNIQUE;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_wechat_openid
ON user_profiles(wechat_openid);
```

### 第三步：修改小程序配置

1. 打开 `miniprogram/app.js`
2. 将 `webUrl` 改为你的实际域名：
   ```javascript
   webUrl: 'https://your-domain.com'
   ```

### 第四步：配置业务域名

1. 登录 [微信公众平台](https://mp.weixin.qq.com)
2. 进入：开发 → 开发管理 → 开发设置 → 业务域名
3. 添加你的域名
4. 下载校验文件
5. 将校验文件放到 `public` 目录
6. 重新部署 Web 应用

### 第五步：导入小程序项目

1. 打开微信开发者工具
2. 选择"导入项目"
3. 选择 `miniprogram` 目录
4. 输入你的小程序 AppID
5. 点击"导入"

### 第六步：测试

1. 在微信开发者工具中点击"编译"
2. 查看是否能正常加载你的 Web 应用
3. 测试微信登录功能

### 第七步：上传发布

1. 点击"上传"按钮
2. 填写版本号和项目备注
3. 登录微信公众平台
4. 进入：版本管理 → 开发版本
5. 提交审核

## ⚠️ 重要注意事项

### 1. 域名要求
- 必须是 HTTPS
- 必须有 ICP 备案
- 必须在微信公众平台配置业务域名

### 2. 登录方式变更
- 原来的 Google OAuth 在小程序中无法使用
- 已添加微信登录支持
- 用户通过 openid 识别

### 3. 功能限制
使用 WebView 方案的限制：
- ❌ 无法使用微信支付
- ❌ 无法使用小程序分享
- ❌ 无法使用小程序原生组件
- ✅ 可以正常使用 Web 应用的所有功能

### 4. 如何在 Web 应用中检测小程序环境

在你的 Web 应用中添加：

```typescript
// 检测是否在微信小程序中
const isInMiniProgram = () => {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return ua.includes('miniprogram');
};

// 获取 URL 参数中的 openid
const urlParams = new URLSearchParams(window.location.search);
const openid = urlParams.get('openid');

if (isInMiniProgram() && openid) {
  // 使用 openid 进行登录
  // 可以调用你的登录 API
}
```

## 🔄 后续优化建议

### 短期（1-2周）
1. 优化小程序加载速度
2. 添加加载动画
3. 处理网络错误情况

### 中期（1-2月）
1. 添加小程序原生首页
2. 核心功能用原生实现
3. 复杂功能继续用 WebView

### 长期（3-6月）
1. 考虑使用 Taro 完全重构
2. 实现完整的小程序原生体验
3. 支持微信支付等高级功能

## 📞 常见问题

### Q: 为什么 WebView 显示空白？
A: 检查：
1. 域名是否配置正确
2. 业务域名是否已验证
3. Web 应用是否正常运行
4. 是否是 HTTPS

### Q: 如何调试？
A:
1. 在微信开发者工具中查看 Console
2. 在 Network 面板查看请求
3. 使用真机调试功能

### Q: 审核需要多久？
A: 通常 1-7 个工作日，首次提交可能更久

## 📚 相关文档

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [web-view 组件文档](https://developers.weixin.qq.com/miniprogram/dev/component/web-view.html)
- [小程序登录文档](https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/login.html)

## 🎯 下一步

1. [ ] 获取微信小程序 AppID 和 AppSecret
2. [ ] 配置环境变量
3. [ ] 更新数据库表结构
4. [ ] 配置业务域名
5. [ ] 导入并测试小程序
6. [ ] 提交审核

祝你部署顺利！🎉
