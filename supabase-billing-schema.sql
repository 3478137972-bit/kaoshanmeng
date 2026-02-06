-- 添加积分字段到用户配置表
ALTER TABLE user_profiles
ADD COLUMN credits DECIMAL(10, 4) DEFAULT 0.0000;

-- 创建使用记录表
CREATE TABLE usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  agent_name TEXT NOT NULL,
  model_name TEXT NOT NULL DEFAULT 'gemini-3-pro-preview',
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  input_cost DECIMAL(10, 4) NOT NULL DEFAULT 0.0000,
  output_cost DECIMAL(10, 4) NOT NULL DEFAULT 0.0000,
  total_cost DECIMAL(10, 4) NOT NULL DEFAULT 0.0000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX idx_usage_records_user_id ON usage_records(user_id);
CREATE INDEX idx_usage_records_created_at ON usage_records(created_at DESC);
CREATE INDEX idx_usage_records_agent_name ON usage_records(agent_name);

-- 启用行级安全策略 (RLS)
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;

-- 使用记录表的 RLS 策略：用户只能访问自己的记录
CREATE POLICY "用户只能查看自己的使用记录"
  ON usage_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "用户可以创建自己的使用记录"
  ON usage_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 创建充值记录表（可选，用于记录充值历史）
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 4) NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('recharge', 'usage', 'refund')),
  description TEXT,
  balance_after DECIMAL(10, 4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at DESC);

-- 启用行级安全策略
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- RLS 策略
CREATE POLICY "用户只能查看自己的交易记录"
  ON credit_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "用户可以创建自己的交易记录"
  ON credit_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
