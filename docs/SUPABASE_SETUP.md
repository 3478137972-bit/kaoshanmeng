# Supabase 配置文档

## 概述

本文档记录了项目中 Supabase 的配置内容，包括数据库表、触发器、RLS 策略等。

**当前状态**：访问令牌验证功能已从代码中移除，但数据库结构仍然保留。

---

## 已创建的数据库内容

### 1. `user_profiles` 表

用于存储用户的访问令牌验证状态。

**表结构**：
```sql
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  token_verified BOOLEAN DEFAULT FALSE,
  token_verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**字段说明**：
- `id`: 用户 ID，关联到 `auth.users` 表
- `token_verified`: 访问令牌是否已验证
- `token_verified_at`: 令牌验证时间
- `created_at`: 记录创建时间
- `updated_at`: 记录更新时间

### 2. RLS (Row Level Security) 策略

**查看自己的 profile**：
```sql
CREATE POLICY "Users can view own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = id);
```

**更新自己的 profile**：
```sql
CREATE POLICY "Users can update own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = id);
```

**插入 profile**：
```sql
CREATE POLICY "Enable insert for authenticated users"
ON public.user_profiles
FOR INSERT
WITH CHECK (auth.uid() = id);
```

### 3. 触发器和函数

**自动创建 profile 的函数**：
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, token_verified, created_at, updated_at)
  VALUES (NEW.id, FALSE, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**自动创建 profile 的触发器**：
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

**自动更新时间戳的函数**：
```sql
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**自动更新时间戳的触发器**：
```sql
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
```

---

## 当前使用状态

### ✅ 正在使用的功能
- Google OAuth 登录
- 用户认证和会话管理
- `auth.users` 表（Supabase 自动管理）

### ❌ 未使用的功能
- `user_profiles` 表
- 访问令牌验证
- 相关的 API 路由（`/api/check-token`, `/api/verify-token`）

---

## 如何删除（如果不再需要）

如果确定永远不需要访问令牌验证功能，可以在 Supabase SQL Editor 中执行以下 SQL：

```sql
-- 1. 删除触发器
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;

-- 2. 删除函数
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_updated_at();

-- 3. 删除表（会自动删除 RLS 策略）
DROP TABLE IF EXISTS public.user_profiles;
```

**注意**：删除后无法恢复，请确保已备份重要数据。

---

## 如何重新启用访问令牌验证

如果将来需要重新启用访问令牌验证功能：

### 1. 确保数据库结构存在

如果已删除，重新运行上面的创建语句。

### 2. 恢复代码中的令牌验证逻辑

需要修改以下文件：

**`app/page.tsx`**：
- 添加 `tokenVerified` 状态
- 添加令牌验证检查
- 添加 TokenVerificationPage 组件

**`app/api/check-token/route.ts`**：
- 检查用户的令牌验证状态

**`app/api/verify-token/route.ts`**：
- 验证用户输入的访问令牌

### 3. 配置访问令牌

在 `.env.local` 中设置：
```
ACCESS_TOKEN=your-secret-token
TOKEN_VALIDITY_DAYS=365
```

---

## 相关文件

### 认证相关
- `app/auth/callback/route.ts` - OAuth 回调处理
- `app/page.tsx` - 主页面，包含认证检查
- `components/auth/login-page.tsx` - 登录页面
- `components/auth/token-dialog.tsx` - 令牌输入对话框（未使用）
- `components/auth/token-verification-page.tsx` - 令牌验证页面（未使用）

### API 路由（未使用）
- `app/api/check-token/route.ts` - 检查令牌状态
- `app/api/verify-token/route.ts` - 验证令牌

### 配置文件
- `.env.local` - 环境变量配置
- `lib/supabase.ts` - Supabase 客户端配置

---

## 建议

**保留数据库结构的理由**：
1. ✅ 不影响当前功能
2. ✅ 占用资源极小
3. ✅ 将来可能需要访问控制
4. ✅ 避免重新创建的麻烦

**删除数据库结构的理由**：
1. ✅ 保持数据库整洁
2. ✅ 减少维护成本
3. ✅ 确定永远不需要

---

## 更新日志

- **2026-02-04**: 创建文档，记录 Supabase 配置
- **2026-02-04**: 从代码中移除访问令牌验证功能
- **2026-02-04**: 简化认证流程为只需 Google 登录

---

## 联系方式

如有问题，请查看：
- Supabase 文档：https://supabase.com/docs
- 项目 GitHub：https://github.com/3478137972-bit/kaoshanmeng
