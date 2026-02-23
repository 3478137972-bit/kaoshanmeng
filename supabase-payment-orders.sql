-- 支付订单表
CREATE TABLE IF NOT EXISTS payment_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  out_trade_no VARCHAR(64) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  amount DECIMAL(10, 2) NOT NULL,
  subject VARCHAR(256),
  status VARCHAR(20) DEFAULT 'pending',
  trade_no VARCHAR(64),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_payment_orders_user_id ON payment_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_out_trade_no ON payment_orders(out_trade_no);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders(status);

-- 启用 RLS
ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;

-- RLS 策略：用户只能查看自己的订单
CREATE POLICY "Users can view own orders" ON payment_orders
  FOR SELECT USING (auth.uid() = user_id);

-- 服务端可以插入和更新订单（通过 service_role key）
