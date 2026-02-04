# 个人知识库功能文档

## 功能概述

个人知识库是一个为 21 个 AI 员工提供个性化知识存储的功能。每个用户可以为每个 AI 员工创建独立的知识库，用于存储该员工的专业知识、工作经验、常用话术等内容。

### 核心特性

- **21 个独立知识库**：对应 4 个部门的 21 个 AI 员工
- **富文本编辑器**：支持格式化文本、标题、列表等
- **自动保存**：手动点击保存按钮保存内容
- **数据隔离**：每个用户的数据完全独立，互不干扰
- **快速导航**：通过侧边栏快速切换不同员工的知识库

## 页面结构

### 1. 知识库主页 (`/knowledge-base`)

显示 4 个部门卡片：
- **战略部门**：6 个知识库
- **内容与增长部门**：6 个知识库
- **销售部门**：6 个知识库
- **交付部门**：3 个知识库

点击部门卡片可以查看该部门的所有员工知识库。

### 2. 部门知识库页面 (`/knowledge-base/[departmentId]`)

显示该部门所有员工的卡片列表，点击员工卡片进入编辑页面。

### 3. 员工知识库编辑页面 (`/knowledge-base/[departmentId]/[employeeName]`)

提供富文本编辑器，用于编辑和保存该员工的知识库内容。

## 使用指南

### 访问知识库

1. 在主页面点击左侧侧边栏的"个人知识库"按钮
2. 进入知识库主页，查看 4 个部门卡片
3. 点击任意部门卡片，查看该部门的员工列表
4. 点击员工卡片，进入编辑页面

### 编辑知识库

1. 在编辑页面使用富文本编辑器输入内容
2. 支持的格式：
   - 标题（H1、H2、H3）
   - 加粗、斜体、下划线
   - 有序列表、无序列表
   - 撤销、重做
3. 编辑完成后点击"保存"按钮
4. 保存成功后会显示提示信息

### 快速切换

在任何知识库页面中：
- 点击左侧侧边栏的员工名称 → 跳转到主页面与该员工对话
- 点击右上角的"返回主页"按钮 → 返回主页面

## 数据库设置

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

## 技术实现

### 数据隔离

- 每条知识库记录都关联到 `user_id`
- 使用 Supabase Row Level Security (RLS) 确保数据安全
- 查询和保存操作都会自动过滤当前用户的数据

### 路由结构

```
/knowledge-base                              # 知识库主页（4个部门卡片）
/knowledge-base/[departmentId]               # 部门页面（员工列表）
/knowledge-base/[departmentId]/[employeeName] # 员工知识库编辑页面
```

### 部门和员工映射

**战略部门 (strategy)**
- 定位诊断师
- 商业操盘手
- IP人设定位师
- 用户画像分析师
- IP账号定位师
- IP传记采访师

**内容与增长部门 (content)**
- 平台与流量模式选择
- 爆款选题策划师
- 吸睛文案生成器
- 朋友圈操盘手
- 每周复盘教练
- 个人品牌顾问

**销售部门 (sales)**
- 私信成交高手
- 产品定价策略顾问
- 话术生成师
- 实时顾问（私域成交）
- 对话分析师
- 朋友圈写手

**交付部门 (delivery)**
- 个人技能产品化策划师
- MVP验证助手
- 商业闭环诊断师

## 常见问题

### Q: 知识库内容会丢失吗？
A: 不会。所有内容都保存在 Supabase 数据库中，只要点击保存按钮，数据就会持久化存储。

### Q: 其他用户能看到我的知识库吗？
A: 不能。通过 RLS 策略，每个用户只能访问自己的知识库数据。

### Q: 可以为同一个员工创建多个知识库吗？
A: 不可以。每个用户对每个员工只能有一个知识库，这通过数据库的 UNIQUE 约束实现。

### Q: 如何在知识库和对话页面之间切换？
A: 在知识库页面点击左侧侧边栏的员工名称，会自动跳转到主页面并选中该员工进行对话。

### Q: 富文本编辑器支持哪些格式？
A: 支持标题（H1-H3）、加粗、斜体、下划线、有序列表、无序列表、撤销/重做等基本格式。

## 更新日志

### 2024-02-04
- ✅ 创建个人知识库功能
- ✅ 实现 4 个部门、21 个员工的知识库结构
- ✅ 添加富文本编辑器
- ✅ 实现数据隔离和 RLS 策略
- ✅ 添加侧边栏导航功能
- ✅ 实现知识库和对话页面的快速切换
- ✅ 添加自动换行功能，优化长文本显示

