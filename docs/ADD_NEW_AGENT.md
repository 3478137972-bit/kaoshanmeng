# 添加新员工开发指南

本文档记录了如何在靠山盟系统中添加新的 AI 员工角色的完整流程。

## 概述

添加新员工需要修改三个核心文件：
1. `lib/system-prompts.ts` - 系统提示词配置
2. `components/dashboard/chat-console.tsx` - 引导消息配置
3. `components/dashboard/sidebar.tsx` - 侧边栏菜单配置

## 开发流程

### 步骤 1：准备系统提示词

首先，准备好新员工的系统提示词（System Prompt）。系统提示词应该包含：
- 角色定义和简介
- 核心任务和目标
- 工作流程
- 输出格式要求
- 约束条件

**示例格式**：
```markdown
# 角色（Role）: [员工名称]
## 简介（Profile）
- 版本（version）: 1.0
- 语言（language）: 简体中文
- 描述（description）: [角色描述]

## 核心任务 (Core Mission)
[详细描述]

## 工作流（Workflow）
[工作流程]

## 输出格式
[输出要求]
```

### 步骤 2：添加系统提示词配置

**文件路径**: `lib/system-prompts.ts`

在 `systemPrompts` 对象中添加新的键值对：

```typescript
export const systemPrompts: Record<string, string> = {
  // 现有员工...

  "新员工名称": `[完整的系统提示词内容]`,
}
```

**注意事项**：
- 键名必须与侧边栏菜单中的员工名称完全一致
- 使用模板字符串（反引号）包裹提示词内容
- 确保提示词格式正确，避免语法错误

### 步骤 3：添加引导消息

**文件路径**: `components/dashboard/chat-console.tsx`

在 `agentGuideMessages` 对象中添加新员工的引导消息：

```typescript
const agentGuideMessages: Record<string, string> = {
  // 现有员工...

  "新员工名称": `盟主你好，我是[员工名称]。为了帮你[核心目标]，我需要了解：

1. [信息项1]
[具体说明]

2. [信息项2]
[具体说明]

3. [信息项3]
[具体说明]`,
}
```

**引导消息设计原则**：
- 简洁明了，直接说明需要收集的信息
- 使用编号列表，便于用户理解
- 提供示例，帮助用户填写
- 保持友好、专业的语气

### 步骤 4：添加侧边栏菜单项

**文件路径**: `components/dashboard/sidebar.tsx`

在对应部门的 `items` 数组中添加新员工名称：

```typescript
const departments = [
  {
    id: "strategy",
    label: "战略部门",
    icon: Compass,
    items: [
      "定位诊断师",
      "商业操盘手",
      "新员工名称",  // 添加在这里
      // 其他员工...
    ],
  },
  // 其他部门...
]
```

**注意事项**：
- 员工名称必须与系统提示词配置中的键名完全一致
- 按照逻辑顺序排列员工
- 确保添加到正确的部门

## 完整示例：添加"商业操盘手"

### 1. 系统提示词 (lib/system-prompts.ts)

```typescript
"商业操盘手": `# 角色（Role）: 商业操盘手v1.0 (Business Architect)
## 简介（Profile）
- 版本（version）: 2.0
- 语言（language）: 简体中文
- 描述（description）: 我是你的个人商业架构师，擅长将你的独特资源（技能、经验、人脉）转化为一套清晰、可执行、能盈利的商业蓝图。

## 目标（Goals）
我的核心目标是为你交付一份完整的 《个人商业落地蓝图》，这份蓝图将包含以下五大关键模块：
1. 【商业模式画布】
2. 【量化盈利模型】
3. 【首月行动计划】
4. 【关键里程碑】
5. 【核心风险预案】

[... 完整内容 ...]`,
```

### 2. 引导消息 (components/dashboard/chat-console.tsx)

```typescript
"商业操盘手": `盟主你好，我是商业操盘手。为了帮你制定完整的商业方案，我需要了解：

1. 商业构想/项目方向
简单描述你想做的生意或项目（例如：上门美甲平台、AI英语陪练App）

2. 核心用户问题/痛点
用一句话描述你要解决什么难题？（例如：解决职场妈妈没时间辅导孩子英语的问题）

3. 目标客户群体
谁是你的核心用户？（例如：一二线城市、年收入30w+的家庭）

4. 当前现状/持有资源
你现在有什么？（例如：只有想法、已有样书、有2万启动资金、有技术合伙人等）`,
```

### 3. 侧边栏菜单 (components/dashboard/sidebar.tsx)

```typescript
{
  id: "strategy",
  label: "战略部门",
  icon: Compass,
  items: [
    "定位诊断师",
    "商业操盘手",  // 新添加
    "IP人设定位师",
    // ...
  ],
},
```

## 验证与测试

### 1. TypeScript 编译检查

```bash
npx tsc --noEmit
```

确保没有类型错误。

### 2. 功能测试

1. 启动开发服务器
2. 在侧边栏中找到新添加的员工
3. 点击员工，检查引导消息是否正确显示
4. 发送测试消息，验证 AI 回复是否符合预期

### 3. 提交代码

```bash
# 添加文件
git add lib/system-prompts.ts components/dashboard/chat-console.tsx components/dashboard/sidebar.tsx

# 创建提交
git commit -m "添加[员工名称]功能

- 新增[员工名称]的系统提示词配置
- 添加引导消息和侧边栏菜单项
- [其他说明]

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# 推送到远程
git push
```

## 常见问题

### Q1: 员工名称不一致导致无法加载

**问题**: 点击员工后没有反应或显示默认消息

**解决**: 确保三个文件中的员工名称完全一致（包括空格、标点符号）

### Q2: 系统提示词格式错误

**问题**: AI 回复不符合预期或出现错误

**解决**:
- 检查模板字符串是否正确闭合
- 确保没有未转义的特殊字符
- 验证 Markdown 格式是否正确

### Q3: 引导消息显示异常

**问题**: 引导消息格式混乱或无法正常显示

**解决**:
- 使用标准的 Markdown 格式
- 避免使用过于复杂的嵌套结构
- 测试不同长度的消息

## 最佳实践

1. **系统提示词设计**
   - 明确角色定位和核心任务
   - 提供清晰的工作流程
   - 定义具体的输出格式
   - 设置合理的约束条件

2. **引导消息设计**
   - 简洁明了，直击要点
   - 提供具体示例
   - 使用友好的语气
   - 分步骤收集信息

3. **代码规范**
   - 保持代码格式一致
   - 添加必要的注释
   - 遵循项目的命名规范
   - 及时提交代码

4. **测试验证**
   - 完整测试所有功能
   - 验证边界情况
   - 检查用户体验
   - 收集反馈并优化

## 快速参考

### 文件清单
- ✅ `lib/system-prompts.ts` - 系统提示词
- ✅ `components/dashboard/chat-console.tsx` - 引导消息
- ✅ `components/dashboard/sidebar.tsx` - 侧边栏菜单

### 检查清单
- [ ] 系统提示词已添加
- [ ] 引导消息已配置
- [ ] 侧边栏菜单已更新
- [ ] 员工名称完全一致
- [ ] TypeScript 编译通过
- [ ] 功能测试通过
- [ ] 代码已提交推送

## 相关文档

- [AGENT_GUIDE_STANDARDS.md](./AGENT_GUIDE_STANDARDS.md) - 员工引导标准
- [项目 README](../README.md) - 项目概述

---

**最后更新**: 2026-02-02
**维护者**: 开发团队
