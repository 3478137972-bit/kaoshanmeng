import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// 只在环境变量存在时创建客户端
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// 数据库类型定义
export interface Conversation {
  id: string
  user_id: string
  agent_name: string
  title: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'ai' | 'user'
  content: string
  is_card: boolean
  created_at: string
}

export interface KnowledgeBase {
  id: string
  user_id: string
  employee_name: string
  department_id: string
  content: string
  created_at: string
  updated_at: string
}
