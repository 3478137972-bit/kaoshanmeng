# 关闭 Supabase 邮箱验证功能

## 适用场景
- 测试环境
- 内部系统
- 不需要邮箱验证的应用

## 操作步骤

### 1. 登录 Supabase Dashboard
访问：https://supabase.com/dashboard

### 2. 进入认证设置
路径：**Authentication** → **Settings** → **Email Auth**

### 3. 关闭邮箱确认
找到 **"Enable email confirmations"** 选项

**关闭这个开关**

### 4. 保存配置
点击 **Save** 按钮

## 效果

关闭后：
- ✅ 用户注册后可以直接登录，无需验证邮箱
- ✅ 不会再发送验证邮件
- ✅ 注册流程更简单快速

## 注意事项

⚠️ **安全性考虑：**
- 关闭邮箱验证后，任何人都可以使用任意邮箱注册
- 无法确认用户是否真正拥有该邮箱
- 生产环境不建议关闭

## 处理已注册但未验证的用户

如果有用户已经注册但未验证，有两种方式处理：

### 方式 1：在 Supabase 后台手动验证
1. 进入 **Authentication** → **Users**
2. 找到对应的用户
3. 点击用户进入详情页
4. 点击 **"Confirm email"** 按钮

### 方式 2：删除用户，让其重新注册
1. 进入 **Authentication** → **Users**
2. 找到对应的用户
3. 点击删除按钮
4. 用户可以重新注册（关闭验证后可直接登录）

## 推荐配置

### 测试环境
```
Enable email confirmations: OFF (关闭)
```

### 生产环境
```
Enable email confirmations: ON (开启)
Site URL: 正确的域名或 IP 地址
Redirect URLs: 包含所有合法的回调地址
```
