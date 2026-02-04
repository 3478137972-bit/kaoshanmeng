# 个人知识库数据库设置

## 说明
此文档包含设置个人知识库功能所需的 Supabase 数据库 SQL 脚本。

## 执行步骤

1. 登录您的 Supabase 项目控制台
2. 进入 SQL Editor
3. 复制下面的 SQL 脚本并执行

## SQL 脚本

```sql
-- 创建 knowledge_bases 表
CREATE TABLE IF NOT EXISTS knowledge_bases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  employee_name TEXT NOT NULL,
  department_id TEXT NOT NULL,
  content TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, employee_name)
);

-- 添加索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_knowledge_bases_user_id ON knowledge_bases(user_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_bases_department ON knowledge_bases(department_id);

-- 启用行级安全 (RLS)
ALTER TABLE knowledge_bases ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略：用户只能查看自己的知识库
CREATE POLICY "Users can view their own knowledge bases"
  ON knowledge_bases FOR SELECT
  USING (auth.uid() = user_id);

-- 创建 RLS 策略：用户只能插入自己的知识库
CREATE POLICY "Users can insert their own knowledge bases"
  ON knowledge_bases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 创建 RLS 策略：用户只能更新自己的知识库
CREATE POLICY "Users can update their own knowledge bases"
  ON knowledge_bases FOR UPDATE
  USING (auth.uid() = user_id);
```

## 验证

执行完成后，您可以在 Supabase 控制台的 Table Editor 中看到新创建的 `knowledge_bases` 表。

## 表结构说明

- `id`: 主键，UUID 类型
- `user_id`: 用户 ID，关联到 auth.users 表
- `employee_name`: 员工名称（如"定位诊断师"）
- `department_id`: 部门 ID（如"strategy"）
- `content`: 知识库内容（富文本 HTML）
- `created_at`: 创建时间
- `updated_at`: 最后更新时间

## 安全说明

通过 RLS 策略，确保：
- 用户只能访问自己创建的知识库
- 用户无法查看或修改其他用户的知识库
- 每个用户对每个员工只能有一个知识库（通过 UNIQUE 约束）
