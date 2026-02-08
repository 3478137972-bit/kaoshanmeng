# 手动验证 Supabase 用户

## 问题
用户已在数据库中创建，但 `email_confirmed_at` 字段为 null，导致无法登录。

## 解决方案

### 方法 1：在 Supabase Dashboard 中手动验证

#### 步骤：
1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目：`tdvjpfuuzkwhmtogwavj`
3. 进入 **Authentication** → **Users**
4. 找到需要验证的用户（可以通过邮箱搜索）
5. 点击用户进入详情页
6. 找到 **"Email confirmed"** 状态
7. 点击 **"Confirm email"** 按钮
8. 用户现在可以正常登录了

### 方法 2：使用 SQL 直接更新（高级）

如果需要批量验证用户，可以在 Supabase SQL Editor 中执行：

```sql
-- 验证单个用户（替换为实际邮箱）
UPDATE auth.users
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email = 'user@example.com';

-- 验证所有未验证的用户（谨慎使用）
UPDATE auth.users
SET email_confirmed_at = NOW(),
    confirmed_at = NOW()
WHERE email_confirmed_at IS NULL;
```

⚠️ **警告：** 直接修改数据库需要谨慎，建议先在测试环境验证。

### 方法 3：删除用户，让其重新注册

如果用户数量不多，最简单的方式是：

1. 在 Supabase Dashboard 中删除该用户
2. 先修正 Site URL 配置（见 FIX_SITE_URL.md）
3. 或者关闭邮箱验证（见 DISABLE_EMAIL_VERIFICATION.md）
4. 让用户重新注册

## 验证用户状态

在 Supabase Dashboard 的 Users 列表中，可以看到：
- ✅ **绿色勾号**：邮箱已验证
- ⚠️ **黄色感叹号**：邮箱未验证

## 推荐流程

### 对于测试环境：
1. 关闭邮箱验证功能
2. 删除所有测试用户
3. 重新注册测试

### 对于生产环境：
1. 修正 Site URL 配置
2. 手动验证现有用户
3. 新用户可以正常通过邮件验证

## 检查用户验证状态的 SQL

```sql
-- 查看所有用户的验证状态
SELECT
    email,
    email_confirmed_at,
    confirmed_at,
    created_at,
    CASE
        WHEN email_confirmed_at IS NOT NULL THEN '已验证'
        ELSE '未验证'
    END as status
FROM auth.users
ORDER BY created_at DESC;

-- 统计验证情况
SELECT
    COUNT(*) as total_users,
    COUNT(email_confirmed_at) as confirmed_users,
    COUNT(*) - COUNT(email_confirmed_at) as unconfirmed_users
FROM auth.users;
```

## 常见问题

### Q: 手动验证后用户还是无法登录？
A: 检查密码是否正确，或者尝试重置密码。

### Q: 批量验证所有用户安全吗？
A: 在测试环境可以，但生产环境不建议，因为无法确认用户是否真正拥有该邮箱。

### Q: 验证后需要重启应用吗？
A: 不需要，Supabase 的更改会立即生效。
