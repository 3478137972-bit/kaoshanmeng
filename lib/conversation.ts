import { supabase, type Conversation, type Message } from './supabase'

/**
 * 创建新对话
 */
export async function createConversation(
  agentName: string,
  title: string
): Promise<Conversation | null> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('用户未登录')
  }

  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: user.id,
      agent_name: agentName,
      title: title,
    })
    .select()
    .single()

  if (error) {
    console.error('创建对话失败:', error)
    return null
  }

  return data
}

/**
 * 获取指定员工的所有对话列表
 */
export async function getConversationsByAgent(
  agentName: string
): Promise<Conversation[]> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', user.id)
    .eq('agent_name', agentName)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('获取对话列表失败:', error)
    return []
  }

  return data || []
}

/**
 * 更新对话标题
 */
export async function updateConversationTitle(
  conversationId: string,
  newTitle: string
): Promise<boolean> {
  const { error } = await supabase
    .from('conversations')
    .update({ title: newTitle })
    .eq('id', conversationId)

  if (error) {
    console.error('更新对话标题失败:', error)
    return false
  }

  return true
}

/**
 * 删除对话（会级联删除所有消息）
 */
export async function deleteConversation(
  conversationId: string
): Promise<boolean> {
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', conversationId)

  if (error) {
    console.error('删除对话失败:', error)
    return false
  }

  return true
}

/**
 * 保存消息到对话
 */
export async function saveMessage(
  conversationId: string,
  role: 'ai' | 'user',
  content: string,
  isCard: boolean = false
): Promise<Message | null> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      role: role,
      content: content,
      is_card: isCard,
    })
    .select()
    .single()

  if (error) {
    console.error('保存消息失败:', error)
    return null
  }

  // 更新对话的 updated_at 时间戳
  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', conversationId)

  return data
}

/**
 * 获取对话的所有消息
 */
export async function getMessagesByConversation(
  conversationId: string
): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('获取消息列表失败:', error)
    return []
  }

  return data || []
}

/**
 * 生成对话标题（从首条用户消息提取）
 */
export function generateConversationTitle(content: string): string {
  // 取前30个字符作为标题
  const maxLength = 30
  const title = content.trim().slice(0, maxLength)
  return title.length < content.trim().length ? `${title}...` : title
}
