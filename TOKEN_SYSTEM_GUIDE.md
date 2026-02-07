# 用户专属访问令牌系统 - 使用指南

## 系统概述

每个用户在注册时会自动获得一个唯一的 UUID 格式访问令牌。管理员可以在 Supabase 后台查看并发放给用户。

## 一、数据库迁移

### 步骤 1：执行迁移脚本

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 进入 **SQL Editor**
4. 打开 `supabase-migration-add-access-token.sql` 文件
5. 复制所有内容并粘贴到 SQL Editor
6. 点击 **Run** 执行

### 步骤 2：验证迁移结果

1. 进入 **Table Editor**
2. 选择 `user_profiles` 表
3. 确认新增了 `access_token` 列
4. 查看现有用户是否都已生成令牌

## 二、管理员查看令牌

### 在 Supabase 后台查看

1. 登录 Supabase Dashboard
2. 进入 **Table Editor**
3. 选择 `user_profiles` 表
4. 你会看到以下信息：
   - `id`: 用户 ID
   - `access_token`: 用户的专属令牌（UUID 格式）
   - `token_verified`: 令牌是否已验证
   - `token_verified_at`: 验证时间

### 查询特定用户的令牌

你可以使用 SQL 查询：

```sql
-- 通过邮箱查询令牌
SELECT
  u.email,
  p.access_token,
  p.token_verified,
  p.token_verified_at
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
WHERE u.email = 'user@example.com';
```

```sql
-- 查看所有用户的令牌
SELECT
  u.email,
  u.created_at as 注册时间,
  p.access_token as 访问令牌,
  p.token_verified as 已验证,
  p.token_verified_at as 验证时间
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
```

## 三、令牌发放流程

### 管理员操作流程

1. **查看新用户**
   - 在 Supabase 后台查看 `user_profiles` 表
   - 找到新注册的用户（通过 `created_at` 排序）

2. **复制令牌**
   - 点击用户的 `access_token` 字段
   - 复制 UUID 令牌（格式如：`a1b2c3d4-e5f6-7890-abcd-ef1234567890`）

3. **发放给用户**
   - 通过微信、邮件或其他方式发送给用户
   - 告知用户在系统中输入此令牌进行验证

### 用户操作流程

1. 用户注册并登录系统
2. 系统提示输入访问令牌
3. 用户输入管理员发放的令牌
4. 系统验证通过后，用户可以正常使用

## 四、令牌格式说明

- **格式**: UUID v4
- **示例**: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
- **长度**: 36 字符（包含连字符）
- **特点**:
  - 全局唯一
  - 加密安全
  - 不可预测

## 五、常见问题

### Q1: 如何为现有用户生成令牌？

A: 迁移脚本会自动为所有现有用户生成令牌。如果某个用户没有令牌，可以手动执行：

```sql
UPDATE user_profiles
SET access_token = gen_random_uuid()
WHERE id = '用户ID' AND access_token IS NULL;
```

### Q2: 如何重置用户的令牌？

A: 在 Supabase 后台执行：

```sql
UPDATE user_profiles
SET
  access_token = gen_random_uuid(),
  token_verified = false,
  token_verified_at = NULL
WHERE id = '用户ID';
```

### Q3: 令牌会过期吗？

A: 是的，令牌有效期由环境变量 `TOKEN_VALIDITY_DAYS` 控制（默认 30 天）。过期后用户需要重新验证。

### Q4: 如何查看哪些用户还未验证令牌？

A: 使用以下 SQL 查询：

```sql
SELECT
  u.email,
  u.created_at as 注册时间,
  p.access_token as 访问令牌
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
WHERE p.token_verified = false OR p.token_verified IS NULL
ORDER BY u.created_at DESC;
```

## 六、安全建议

1. **不要在公开渠道分享令牌**：通过私密方式（如私信）发送
2. **定期检查令牌使用情况**：监控异常验证行为
3. **及时撤销泄露的令牌**：如果令牌泄露，立即重置
4. **保留发放记录**：记录哪些令牌已发放给哪些用户

## 七、系统架构

```
用户注册
    ↓
自动生成 UUID 令牌（存入数据库）
    ↓
管理员在 Supabase 后台查看
    ↓
管理员发放令牌给用户
    ↓
用户输入令牌验证
    ↓
系统验证令牌是否匹配
    ↓
验证成功，用户可正常使用
```

## 八、相关文件

- **数据库迁移**: `supabase-migration-add-access-token.sql`
- **验证 API**: `app/api/verify-token/route.ts`
- **检查 API**: `app/api/check-token/route.ts`
- **原始表结构**: `supabase-schema.sql`
