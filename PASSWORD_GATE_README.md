# 密码访问控制功能

一个简单但强大的密码保护系统，无需数据库支持。

## 功能特性

- ✅ **无需数据库**：使用内存缓存存储尝试记录
- ✅ **环境变量配置**：密码存储在环境变量中，安全可靠
- ✅ **智能限流**：15分钟内最多5次尝试
- ✅ **自动封禁**：超过限制后自动封禁30分钟
- ✅ **IP 追踪**：基于客户端 IP 地址进行访问控制
- ✅ **优雅 UI**：使用 shadcn/ui 组件，支持深色模式

## 快速开始

### 1. 配置环境变量

在 `.env.local` 文件中添加：

```env
GATE_PASSWORD=your-secure-password-here
```

### 2. 使用 PasswordGate 组件

```tsx
import { PasswordGate } from '@/components/auth/password-gate';

export default function YourProtectedPage() {
  return (
    <PasswordGate
      title="访问验证"
      description="请输入密码以继续访问"
    >
      {/* 这里放置需要保护的内容 */}
      <div>
        <h1>受保护的内容</h1>
        <p>只有输入正确密码才能看到这些内容</p>
      </div>
    </PasswordGate>
  );
}
```

### 3. 访问演示页面

启动开发服务器后，访问：`http://localhost:3000/protected-demo`

## API 端点

### POST `/api/password-verify`

验证密码并返回结果。

**请求体：**
```json
{
  "password": "your-password"
}
```

**成功响应（200）：**
```json
{
  "success": true,
  "message": "验证成功"
}
```

**密码错误（401）：**
```json
{
  "success": false,
  "message": "密码错误，还剩 4 次尝试机会",
  "remainingAttempts": 4
}
```

**被封禁（429）：**
```json
{
  "success": false,
  "message": "尝试次数过多，请在 25 分钟后再试",
  "blocked": true,
  "remainingMinutes": 25
}
```

## 配置说明

在 `app/api/password-verify/route.ts` 中可以调整以下参数：

```typescript
const MAX_ATTEMPTS = 5;              // 最大尝试次数
const TIME_WINDOW = 15 * 60 * 1000;  // 时间窗口：15分钟
const BLOCK_DURATION = 30 * 60 * 1000; // 封禁时长：30分钟
```

## 组件 Props

### PasswordGate

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `children` | `ReactNode` | - | 受保护的内容 |
| `title` | `string` | `"访问验证"` | 标题 |
| `description` | `string` | `"请输入密码以继续访问"` | 描述文字 |
| `onSuccess` | `() => void` | - | 验证成功后的回调函数 |

## 安全说明

1. **密码存储**：密码存储在服务器端环境变量中，不会暴露给客户端
2. **验证逻辑**：所有验证逻辑在服务器端执行，客户端无法绕过
3. **限流机制**：基于 IP 地址的限流可以防止暴力破解
4. **内存缓存**：使用内存缓存意味着服务器重启后限制会重置

## 注意事项

- 服务器重启后，所有尝试记录和封禁状态会被清除
- 如果使用负载均衡或多个服务器实例，每个实例的缓存是独立的
- 用户可以通过更换 IP 地址绕过封禁（但这对大多数场景已足够）
- 如需更强的安全性，建议配合 Redis 等持久化存储使用

## 文件结构

```
app/
├── api/
│   └── password-verify/
│       └── route.ts          # 密码验证 API
├── protected-demo/
│   └── page.tsx              # 演示页面
components/
└── auth/
    └── password-gate.tsx     # 密码保护组件
```
