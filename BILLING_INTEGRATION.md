# 员工计费功能集成指南

## 概述

本文档说明如何在 AI 员工对话中集成计费功能，实现基于 token 使用量的自动扣费。

## 计费规则

基于 Gemini 3 Pro 的计费标准：
- **输入（提示）**: ¥0.8 / 1M tokens
- **输出（补全）**: ¥4.8 / 1M tokens
- **积分制**: 1积分 = 1人民币

## 数据库表结构

### 1. 用户积分字段（user_profiles 表）
```sql
ALTER TABLE user_profiles
ADD COLUMN credits DECIMAL(10, 4) DEFAULT 0.0000;
```

### 2. 使用记录表（usage_records）
记录每次 API 调用的详细信息：
- user_id: 用户 ID
- agent_name: AI 员工名称
- input_tokens: 输入 token 数量
- output_tokens: 输出 token 数量
- total_cost: 总费用

### 3. 交易记录表（credit_transactions）
记录所有积分变动：
- transaction_type: 'recharge'（充值）、'usage'（使用）、'refund'（退款）
- amount: 变动金额
- balance_after: 变动后余额

## 核心函数

### 1. 计算费用
```typescript
import { calculateCost } from '@/lib/billing'

const { inputCost, outputCost, totalCost } = calculateCost(
  inputTokens,   // 输入 token 数量
  outputTokens   // 输出 token 数量
)
```

### 2. 记录使用并扣除积分
```typescript
import { recordUsageAndDeductCredits } from '@/lib/billing'

const result = await recordUsageAndDeductCredits(
  userId,           // 用户 ID
  agentName,        // AI 员工名称（如"定位诊断师"）
  inputTokens,      // 输入 token 数量
  outputTokens,     // 输出 token 数量
  conversationId    // 对话 ID（可选）
)

if (result.success) {
  console.log('扣费成功，剩余积分:', result.balance)
} else {
  console.error('扣费失败:', result.error)
  // 处理积分不足等错误
}
```

### 3. 充值积分
```typescript
import { rechargeCredits } from '@/lib/billing'

const result = await rechargeCredits(
  userId,
  amount,           // 充值金额
  '充值说明'        // 可选
)
```

### 4. 获取用户积分
```typescript
import { getUserCredits } from '@/lib/billing'

const credits = await getUserCredits(userId)
```

## 集成步骤

### 步骤 1: 在 API 路由中集成计费

假设你有一个 AI 对话的 API 路由（如 `/api/chat`），需要在返回响应后记录使用量：

```typescript
// app/api/chat/route.ts
import { recordUsageAndDeductCredits } from '@/lib/billing'

export async function POST(request: Request) {
  const { userId, agentName, message } = await request.json()

  // 1. 调用 AI API
  const response = await callAIAPI(message)

  // 2. 获取 token 使用量（从 AI API 响应中）
  const inputTokens = response.usage.prompt_tokens
  const outputTokens = response.usage.completion_tokens

  // 3. 记录使用并扣除积分
  const billingResult = await recordUsageAndDeductCredits(
    userId,
    agentName,
    inputTokens,
    outputTokens
  )

  if (!billingResult.success) {
    // 积分不足或其他错误
    return Response.json(
      { error: billingResult.error },
      { status: 400 }
    )
  }

  // 4. 返回响应
  return Response.json({
    message: response.message,
    remainingCredits: billingResult.balance
  })
}
```

### 步骤 2: 在前端显示积分不足提示

```typescript
// 在对话组件中
const handleSendMessage = async (message: string) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ userId, agentName, message })
    })

    if (!response.ok) {
      const error = await response.json()
      if (error.error === '积分不足') {
        // 显示积分不足提示，引导用户充值
        alert('积分不足，请前往"定价与计费"页面充值')
        return
      }
    }

    const data = await response.json()
    // 更新对话界面
    // 可选：更新侧边栏显示的积分余额
  } catch (error) {
    console.error('发送消息失败:', error)
  }
}
```

### 步骤 3: 实时更新侧边栏积分显示

侧边栏已经集成了积分显示功能，会在用户登录时自动加载。如果需要在扣费后实时更新，可以：

1. 使用全局状态管理（如 Context API 或 Zustand）
2. 或者在每次 API 调用后重新加载积分

## 页面功能

### 1. 定价与计费页面 (`/billing`)
- 显示当前积分余额
- 充值功能
- 查看使用记录（最近 50 条）
- 显示计费规则说明

### 2. 侧边栏
- 显示剩余积分
- "定价与计费"按钮，点击跳转到计费页面

## 注意事项

1. **积分不足处理**: 在调用 AI API 之前，可以先检查用户积分是否足够
2. **事务安全**: 当前实现是分步操作，生产环境建议使用数据库事务
3. **错误处理**: 如果扣费失败但 API 已调用，需要有补偿机制
4. **Token 计数**: 确保从 AI API 响应中正确获取 token 使用量

## 示例：完整的对话流程

```typescript
// 1. 用户发送消息
const message = "帮我分析一下我的商业定位"

// 2. 前端调用 API
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    userId: currentUser.id,
    agentName: "定位诊断师",
    message: message
  })
})

// 3. 后端处理
// - 调用 Gemini API
// - 获取响应和 token 使用量
// - 计算费用并扣除积分
// - 记录使用记录

// 4. 前端显示结果
const data = await response.json()
console.log('AI 回复:', data.message)
console.log('剩余积分:', data.remainingCredits)
```

## 数据库迁移

执行以下 SQL 文件来创建必要的表结构：

```bash
# 在 Supabase SQL Editor 中执行
supabase-billing-schema.sql
```

## 测试

1. 为测试用户充值积分
2. 发起对话，观察积分扣除
3. 查看使用记录页面
4. 测试积分不足的情况

## 后续优化

1. 添加积分预警功能（余额不足时提醒）
2. 支持批量充值和优惠活动
3. 添加使用统计图表
4. 支持按日期范围筛选使用记录
5. 添加导出功能（导出使用记录为 CSV）
