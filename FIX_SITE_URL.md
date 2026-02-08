# 修正 Supabase Site URL 配置

## 问题原因
邮箱验证链接跳转到了 `http://0.0.0.0:3000/` 而不是正确的服务器地址。
这是因为 Supabase 的 Site URL 配置不正确。

## 解决步骤

### 1. 登录 Supabase Dashboard
访问：https://supabase.com/dashboard

### 2. 选择你的项目
项目 ID: tdvjpfuuzkwhmtogwavj

### 3. 修改 Site URL
路径：**Authentication** → **URL Configuration** → **Site URL**

**当前错误的配置（可能是）：**
```
http://0.0.0.0:3000
```
或
```
http://localhost:3000
```

**应该修改为：**
```
http://124.220.74.191:3000
```

### 4. 添加 Redirect URLs
路径：**Authentication** → **URL Configuration** → **Redirect URLs**

**添加以下 URL：**
```
http://124.220.74.191:3000/auth/callback
http://124.220.74.191:3000
```

### 5. 保存配置
点击 **Save** 按钮保存配置

### 6. 测试注册流程
1. 使用新的邮箱地址注册
2. 检查收到的验证邮件
3. 点击验证链接
4. 应该能正确跳转到 `http://124.220.74.191:3000/auth/callback`

## 为什么会出现 0.0.0.0？

`0.0.0.0` 通常来自：
1. Docker 容器内部的 HOSTNAME 环境变量
2. Next.js 的默认配置
3. Supabase Site URL 没有正确设置

在 Dockerfile 中有这行配置：
```dockerfile
ENV HOSTNAME="0.0.0.0"
```

这个配置是让 Next.js 监听所有网络接口，但不应该被用作 Site URL。

## 验证配置是否正确

配置完成后，可以在 Supabase Dashboard 中查看：
- Site URL 应该显示：`http://124.220.74.191:3000`
- Redirect URLs 应该包含你的服务器地址

## 注意事项

1. **已注册但未验证的用户**：
   - 这些用户的验证链接已经失效
   - 需要重新注册，或者在 Supabase 后台手动验证

2. **如果使用域名**：
   - 如果你有域名（如 kaoshanmeng.com），应该使用域名而不是 IP 地址
   - 例如：`https://kaoshanmeng.com`

3. **HTTPS vs HTTP**：
   - 生产环境建议使用 HTTPS
   - 测试环境可以使用 HTTP
