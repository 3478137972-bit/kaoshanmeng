# 修复访问令牌验证问题

## 问题现象
- 用户已登录
- 输入访问令牌后返回 403 (Forbidden) 错误
- 提示"访问令牌无效"

## 问题原因

### 最可能的原因：数据库迁移未执行

你的应用需要在 Supabase 数据库中创建 `user_profiles` 表和相关字段。

## 解决方案

### 步骤 1：检查数据库表是否存在

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目：`tdvjpfuuzkwhmtogwavj`
3. 进入 **Table Editor**
4. 查看是否有 `user_profiles` 表

**如果没有这个表，需要执行步骤 2**

### 步骤 2：执行数据库迁移

1. 在 Supabase Dashboard 中进入 **SQL Editor**
2. 打开项目中的 `supabase-schema.sql` 文件
3. 复制所有内容
4. 粘贴到 SQL Editor
5. 点击 **Run** 执行

### 步骤 3：执行访问令牌迁移

1. 在 SQL Editor 中
2. 打开项目中的 `supabase-migration-add-access-token.sql` 文件
3. 复制所有内容
4. 粘贴到 SQL Editor
5. 点击 **Run** 执行

### 步骤 4：查看用户的访问令牌

执行以下 SQL 查询，查看你的访问令牌：

```sql
-- 查看所有用户的访问令牌
SELECT
  u.email AS 用户邮箱,
  u.created_at AS 注册时间,
  p.access_token AS 访问令牌,
  p.token_verified AS 已验证,
  p.token_verified_at AS 验证时间
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
ORDER BY u.created_at DESC;
```

**你会看到每个用户的 UUID 格式访问令牌，类似：**
```
a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

### 步骤 5：使用正确的令牌登录

1. 从上面的查询结果中复制你的 `access_token`
2. 回到应用的访问令牌验证页面
3. 粘贴令牌（确保没有多余的空格）
4. 点击验证

## 临时解决方案：关闭访问令牌验证

如果你想暂时跳过访问令牌验证，可以修改代码：

### 方案 A：在数据库中手动标记为已验证

在 Supabase SQL Editor 中执行：

```sql
-- 将所有用户标记为已验证（仅用于测试）
UPDATE user_profiles
SET token_verified = true,
    token_verified_at = NOW()
WHERE token_verified = false OR token_verified IS NULL;
```

### 方案 B：修改前端代码跳过验证

这需要修改代码并重新部署，不推荐。

## 验证是否修复

1. 刷新浏览器页面
2. 如果使用了方案 A，应该可以直接进入应用
3. 如果使用了步骤 4-5，输入正确的令牌应该可以通过验证

## 常见问题

### Q: 为什么需要访问令牌？
A: 这是你的应用的访问控制功能，确保只有授权用户可以使用。

### Q: 如何获取我的访问令牌？
A: 在 Supabase Dashboard 的 SQL Editor 中执行步骤 4 的查询。

### Q: 可以完全关闭这个功能吗？
A: 可以，但需要修改代码。建议先使用方案 A 临时解决。

## 下一步

请先执行步骤 1-4，然后告诉我：
1. `user_profiles` 表是否存在？
2. 查询结果中是否显示了你的访问令牌？
3. 如果显示了，令牌的值是什么？（可以只告诉我前几位）
