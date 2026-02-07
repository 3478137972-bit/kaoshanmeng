-- 迁移脚本：为用户添加专属访问令牌
-- 执行日期：2026-02-07

-- 1. 添加 access_token 字段到 user_profiles 表
ALTER TABLE user_profiles
ADD COLUMN access_token UUID UNIQUE DEFAULT gen_random_uuid();

-- 2. 为现有用户生成令牌（如果有现有用户的话）
UPDATE user_profiles
SET access_token = gen_random_uuid()
WHERE access_token IS NULL;

-- 3. 修改 create_user_profile 函数，在创建用户配置时自动生成令牌
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, access_token)
  VALUES (NEW.id, gen_random_uuid());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. 创建索引以提高令牌查询性能
CREATE INDEX idx_user_profiles_access_token ON user_profiles(access_token);

-- ============================================================
-- 管理员查询用户令牌的 SQL 语句
-- ============================================================

-- 查看所有用户的邮箱和访问令牌
SELECT
  u.email AS 用户邮箱,
  u.created_at AS 注册时间,
  p.access_token AS 访问令牌,
  p.token_verified AS 已验证,
  p.token_verified_at AS 验证时间
FROM auth.users u
LEFT JOIN user_profiles p ON u.id = p.id
ORDER BY u.created_at DESC;

-- 查询特定用户的令牌（通过邮箱）
-- SELECT
--   u.email AS 用户邮箱,
--   p.access_token AS 访问令牌,
--   p.token_verified AS 已验证
-- FROM auth.users u
-- LEFT JOIN user_profiles p ON u.id = p.id
-- WHERE u.email = 'user@example.com';
