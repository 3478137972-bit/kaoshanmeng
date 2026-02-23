# 支付宝支付接入文档

## 概述

本项目集成了支付宝电脑网站支付功能，用于用户积分充值。

## 技术栈

- Next.js 14 (App Router)
- alipay-sdk-nodejs v4.14.0
- Supabase (数据库)

## 文件结构

```
├── lib/
│   └── alipay.ts                    # 支付宝SDK配置
├── app/
│   ├── api/
│   │   └── alipay/
│   │       ├── create/route.ts      # 创建订单API
│   │       └── notify/route.ts      # 支付回调API
│   ├── payment/
│   │   └── success/page.tsx         # 支付成功页面
│   └── billing/page.tsx             # 积分充值页面
└── supabase-payment-orders.sql      # 订单表SQL
```

## 环境变量配置

在 `.env.local` 中配置以下变量：

```env
# 支付宝配置
ALIPAY_APP_ID=你的应用ID
ALIPAY_PRIVATE_KEY=你的应用私钥
ALIPAY_PUBLIC_KEY=支付宝公钥
ALIPAY_NOTIFY_URL=https://你的域名/api/alipay/notify
ALIPAY_RETURN_URL=https://你的域名/payment/success

# Supabase配置（用于订单存储）
SUPABASE_SERVICE_ROLE_KEY=你的service_role_key
```

## 数据库配置

在 Supabase 中执行以下 SQL 创建订单表：

```sql
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

CREATE INDEX IF NOT EXISTS idx_payment_orders_user_id ON payment_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_out_trade_no ON payment_orders(out_trade_no);
```

## 支付流程

```
用户输入金额 → 前端调用 /api/alipay/create → 跳转支付宝支付页面
                                                    ↓
用户完成支付 ← 支付宝异步通知 /api/alipay/notify ← 支付宝处理支付
     ↓
跳转到 /payment/success 页面
```

## API 说明

### 1. 创建订单 API

**路径**: `POST /api/alipay/create`

**请求参数**:
```json
{
  "amount": 10.00,
  "subject": "靠山盟积分充值 ¥10",
  "userId": "user-uuid"
}
```

**响应**:
```json
{
  "success": true,
  "payUrl": "https://openapi.alipay.com/gateway.do?...",
  "outTradeNo": "KSM1234567890ABC"
}
```

### 2. 支付回调 API

**路径**: `POST /api/alipay/notify`

支付宝在用户支付成功后会调用此接口，处理逻辑：
1. 验证签名
2. 查询订单
3. 防止重复处理
4. 更新订单状态
5. 给用户充值积分
6. 返回 "success"

### 积分计算规则

```
积分 = 支付金额(CNY) / 1.5
```

示例：
- 支付 ¥1.5 → 获得 1 积分
- 支付 ¥15 → 获得 10 积分
- 支付 ¥150 → 获得 100 积分

## 部署步骤

### 1. 安装依赖

```bash
pnpm add alipay-sdk
```

### 2. 配置支付宝开放平台

1. 登录 [支付宝开放平台](https://open.alipay.com)
2. 创建应用，获取 APP_ID
3. 配置接口加签方式（RSA2）
4. 生成密钥对，上传应用公钥，获取支付宝公钥
5. 配置授权回调地址

### 3. 配置环境变量

将上述环境变量添加到服务器的 `.env.local` 文件中。

### 4. 上传文件到服务器

```powershell
# 上传支付宝相关文件
scp lib/alipay.ts root@服务器IP:/项目路径/lib/
scp app/api/alipay/create/route.ts root@服务器IP:/项目路径/app/api/alipay/create/
scp app/api/alipay/notify/route.ts root@服务器IP:/项目路径/app/api/alipay/notify/
scp -r app/payment root@服务器IP:/项目路径/app/
scp app/billing/page.tsx root@服务器IP:/项目路径/app/billing/
scp middleware.ts root@服务器IP:/项目路径/
```

### 5. 重启 Docker

```bash
cd /项目路径
docker compose down
docker compose up -d --build
```

## 注意事项

1. **签名验证**: 必须验证支付宝回调的签名，防止伪造请求
2. **幂等性**: 回调可能多次调用，需要防止重复充值
3. **HTTPS**: 回调地址必须是 HTTPS
4. **公钥配置**: 使用支付宝公钥（不是应用公钥）来验证签名
5. **延迟初始化**: Supabase 客户端需要延迟初始化，避免构建时报错

## 测试

```bash
# 测试创建订单API
curl -X POST https://你的域名/api/alipay/create \
  -H "Content-Type: application/json" \
  -d '{"amount": 0.01, "subject": "测试订单", "userId": "test123"}'
```

## 常见问题

### 1. invalid-signature 错误

检查：
- 应用私钥与支付宝开放平台上传的应用公钥是否匹配
- 是否使用了正确的支付宝公钥（不是应用公钥）
- 签名类型是否为 RSA2

### 2. 支付成功后 session 丢失

这是浏览器跨域跳转的正常现象。已在首页添加登录状态检查，如果用户已登录会显示"已登录"状态。

### 3. 构建报错 Failed to collect page data

确保 Supabase 客户端使用延迟初始化（函数内创建），而不是在模块顶层创建。
