# 检查和修复 Supabase 邮件模板

## 问题
即使 Site URL 配置正确，验证邮件中的链接还是指向 0.0.0.0:3000

## 可能的原因

### 1. Site URL 没有保存成功
- 修改后必须点击 "Save changes" 按钮
- 等待保存成功的提示

### 2. 邮件模板使用了错误的变量
Supabase 的邮件模板中可能使用了错误的变量或配置

## 解决步骤

### 步骤 1：确认 Site URL 已保存

1. 登录 Supabase Dashboard
2. 进入 **Authentication** → **URL Configuration**
3. 确认 Site URL 显示为：`http://124.220.74.191:3000`
4. 如果右侧有 "Save changes" 按钮，点击它
5. 等待看到成功保存的提示（通常是绿色的通知）

### 步骤 2：检查邮件模板

1. 进入 **Authentication** → **Email Templates**
2. 选择 **"Confirm signup"** 模板
3. 检查模板中的链接

**正确的模板应该包含：**
```html
<a href="{{ .ConfirmationURL }}">Confirm your email</a>
```

**不应该包含硬编码的 URL，比如：**
```html
<a href="http://0.0.0.0:3000/...">Confirm your email</a>
```

### 步骤 3：测试配置

1. **清除浏览器缓存**
   - 按 Ctrl+Shift+Delete
   - 清除缓存和 Cookie

2. **使用全新的邮箱注册**
   - 不要使用之前注册过的邮箱
   - 使用一个全新的邮箱地址

3. **检查新收到的验证邮件**
   - 查看邮件中的验证链接
   - 链接应该指向 `http://124.220.74.191:3000/auth/callback?code=...`
   - 而不是 `http://0.0.0.0:3000/...`

### 步骤 4：如果还是不行，尝试重置配置

1. 在 Supabase Dashboard 中，将 Site URL 临时改为其他值
2. 点击 Save
3. 再改回 `http://124.220.74.191:3000`
4. 再次点击 Save
5. 等待几分钟让配置生效

## 临时解决方案：关闭邮箱验证

如果以上方法都不行，建议暂时关闭邮箱验证：

1. 进入 **Authentication** → **Settings** → **Email Auth**
2. 关闭 **"Enable email confirmations"**
3. 点击 Save

这样用户注册后可以直接登录，不需要验证邮箱。

## 验证配置是否生效

### 方法 1：在浏览器控制台测试

在浏览器中打开 http://124.220.74.191:3000，按 F12 打开控制台，运行：

```javascript
console.log('Origin:', window.location.origin)
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
```

应该看到：
```
Origin: http://124.220.74.191:3000
```

### 方法 2：检查收到的邮件

注册新账号后，查看收到的验证邮件：
1. 右键点击验证按钮/链接
2. 选择"复制链接地址"
3. 粘贴到记事本中查看
4. 确认链接是否包含正确的 IP 地址

## 常见问题

### Q: 为什么会出现 0.0.0.0？
A: 这通常是因为：
- Supabase Site URL 配置为空或默认值
- 或者使用了 Docker 容器内部的 HOSTNAME 环境变量

### Q: 修改配置后需要等待多久生效？
A: 通常是立即生效，但建议等待 1-2 分钟

### Q: 如果多次尝试都失败怎么办？
A: 建议暂时关闭邮箱验证功能，或联系 Supabase 支持
