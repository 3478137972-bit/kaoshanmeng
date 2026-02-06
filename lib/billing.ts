import { supabase } from './supabase'

// Gemini 3 Pro 计费规则（单位：积分/百万tokens）
const GEMINI_3_PRO_PRICING = {
  input: 0.8,    // ¥0.8 / 1M tokens
  output: 4.8,   // ¥4.8 / 1M tokens
}

/**
 * 计算 token 使用费用
 * @param inputTokens 输入 token 数量
 * @param outputTokens 输出 token 数量
 * @returns 费用详情
 */
export function calculateCost(inputTokens: number, outputTokens: number) {
  const inputCost = (inputTokens / 1_000_000) * GEMINI_3_PRO_PRICING.input
  const outputCost = (outputTokens / 1_000_000) * GEMINI_3_PRO_PRICING.output
  const totalCost = inputCost + outputCost

  return {
    inputCost: Number(inputCost.toFixed(4)),
    outputCost: Number(outputCost.toFixed(4)),
    totalCost: Number(totalCost.toFixed(4)),
  }
}

/**
 * 记录使用并扣除积分
 * @param userId 用户 ID
 * @param agentName AI 员工名称
 * @param inputTokens 输入 token 数量
 * @param outputTokens 输出 token 数量
 * @param conversationId 对话 ID（可选）
 * @returns 是否成功
 */
export async function recordUsageAndDeductCredits(
  userId: string,
  agentName: string,
  inputTokens: number,
  outputTokens: number,
  conversationId?: string
) {
  try {
    // 计算费用
    const { inputCost, outputCost, totalCost } = calculateCost(inputTokens, outputTokens)

    // 获取用户当前积分
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.error('获取用户积分失败:', profileError)
      return { success: false, error: '获取用户积分失败' }
    }

    const currentCredits = profile?.credits || 0

    // 检查积分是否足够
    if (currentCredits < totalCost) {
      return {
        success: false,
        error: '积分不足',
        required: totalCost,
        current: currentCredits
      }
    }

    const newBalance = currentCredits - totalCost

    // 开始事务：扣除积分、记录使用、记录交易
    // 1. 扣除积分
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ credits: newBalance })
      .eq('id', userId)

    if (updateError) {
      console.error('扣除积分失败:', updateError)
      return { success: false, error: '扣除积分失败' }
    }

    // 2. 记录使用
    const { error: usageError } = await supabase
      .from('usage_records')
      .insert({
        user_id: userId,
        conversation_id: conversationId,
        agent_name: agentName,
        model_name: 'gemini-3-pro-preview',
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        input_cost: inputCost,
        output_cost: outputCost,
        total_cost: totalCost,
      })

    if (usageError) {
      console.error('记录使用失败:', usageError)
      // 注意：这里积分已经扣除，但记录失败了
      // 在生产环境中应该使用数据库事务或补偿机制
    }

    // 3. 记录交易
    const { error: transactionError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount: -totalCost,
        transaction_type: 'usage',
        description: `使用 ${agentName} - 输入:${inputTokens} tokens, 输出:${outputTokens} tokens`,
        balance_after: newBalance,
      })

    if (transactionError) {
      console.error('记录交易失败:', transactionError)
    }

    return {
      success: true,
      cost: totalCost,
      balance: newBalance,
    }
  } catch (error) {
    console.error('计费处理失败:', error)
    return { success: false, error: '计费处理失败' }
  }
}

/**
 * 充值积分
 * @param userId 用户 ID
 * @param amount 充值金额
 * @param description 描述
 * @returns 是否成功
 */
export async function rechargeCredits(
  userId: string,
  amount: number,
  description?: string
) {
  try {
    // 获取当前积分
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('id', userId)
      .single()

    if (profileError) {
      return { success: false, error: '获取用户积分失败' }
    }

    const currentCredits = profile?.credits || 0
    const newBalance = currentCredits + amount

    // 更新积分
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ credits: newBalance })
      .eq('id', userId)

    if (updateError) {
      return { success: false, error: '充值失败' }
    }

    // 记录交易
    const { error: transactionError } = await supabase
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount: amount,
        transaction_type: 'recharge',
        description: description || '充值',
        balance_after: newBalance,
      })

    if (transactionError) {
      console.error('记录交易失败:', transactionError)
    }

    return {
      success: true,
      balance: newBalance,
    }
  } catch (error) {
    console.error('充值失败:', error)
    return { success: false, error: '充值失败' }
  }
}

/**
 * 获取用户积分余额
 * @param userId 用户 ID
 * @returns 积分余额
 */
export async function getUserCredits(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('credits')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('获取用户积分失败:', error)
    return 0
  }

  return data?.credits || 0
}
