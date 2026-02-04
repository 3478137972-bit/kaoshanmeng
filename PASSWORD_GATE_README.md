# 密码访问控制功能

一个简单但强大的密码保护系统，无需数据库支持。

## 功能特性

- ✅ **无需数据库**：使用内存缓存存储尝试记录
- ✅ **环境变量配置**：密码存储在环境变量中，安全可靠
- ✅ **智能限流**：15分钟内最多5次尝试
- ✅ **自动封禁**：超过限制后自动封禁30分钟
- ✅ **IP 追踪**：基于客户端 IP 地址进行访问控制
- ✅ **优雅 UI**：使用 shadcn/ui 组件，支持深色模式
- ✅ **双重验证**：支持与现有认证系统（如 Google OAuth）配合使用

## 当前应用

### 主页面密码保护

主页面（`app/page.tsx`）已经应用了密码保护功能，访问流程如下：

1. **Google OAuth 登录**：用户首先需要通过 Google 账号登录
2. **密码验证**：登录成功后，需要输入密码才能访问主界面
3. **进入系统**：密码验证通过后，显示完整的靠山实战营界面

**当前密码**：`lelexue.test`（在 `.env.local` 中配置）

### 独立演示页面

- **路径**：`/secure`
- **说明**：展示密码保护功能的独立页面
- **访问**：`http://localhost:3000/secure`

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

启动开发服务器后，可以访问以下页面：

- **主页面**：`http://localhost:3000`（已应用密码保护）
- **独立演示页面**：`http://localhost:3000/secure`
- **功能演示页面**：`http://localhost:3000/protected-demo`

## 实际应用案例

### 案例 1：主页面双重验证

在 `app/page.tsx` 中实现了双重验证机制：

```tsx
import { PasswordGate } from '@/components/auth/password-gate';

export default function DashboardPage() {
  // ... 认证状态检查逻辑

  // 未登录 - 显示 Google 登录页面
  if (!isLoggedIn) {
    return <LoginPage />
  }

  // 已登录 - 显示密码验证，然后才能访问主界面
  return (
    <PasswordGate
      title="访问验证"
      description="请输入密码以访问靠山实战营"
    >
      <div className="flex h-screen w-screen overflow-hidden">
        {/* 主界面内容 */}
      </div>
    </PasswordGate>
  )
}
```

### 案例 2：独立安全页面

在 `app/secure/page.tsx` 中创建了一个完整的安全区域：

```tsx
import { PasswordGate } from '@/components/auth/password-gate';

export default function SecurePage() {
  return (
    <PasswordGate
      title="安全访问验证"
      description="请输入密码以访问此页面"
    >
      {/* 受保护的内容 */}
    </PasswordGate>
  );
}
```

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
├── page.tsx                  # 主页面（已应用密码保护）
├── secure/
│   └── page.tsx              # 独立安全页面
├── protected-demo/
│   └── page.tsx              # 功能演示页面
components/
└── auth/
    └── password-gate.tsx     # 密码保护组件
```

## 部署说明

### Vercel 部署

在 Vercel 项目设置中添加环境变量：

1. 进入项目设置 → Environment Variables
2. 添加变量：
   - **Name**: `GATE_PASSWORD`
   - **Value**: 你的密码（如 `lelexue.test`）
3. 选择环境：Production, Preview, Development
4. 保存并重新部署

### 本地开发

确保 `.env.local` 文件包含：

```env
GATE_PASSWORD=lelexue.test
```

## 更新日志

### 2024-02-04

- ✅ 创建密码访问控制功能
- ✅ 实现基于 IP 的尝试次数限制
- ✅ 创建 PasswordGate 组件
- ✅ 为主页面添加密码保护（双重验证）
- ✅ 创建独立的安全演示页面（/secure）
- ✅ 完善文档和使用说明

## 常见问题

### Q: 如何修改密码？

A: 在 `.env.local` 文件中修改 `GATE_PASSWORD` 的值，然后重启开发服务器。

### Q: 如何修改尝试次数限制？

A: 编辑 `app/api/password-verify/route.ts`，修改以下常量：
- `MAX_ATTEMPTS`：最大尝试次数
- `TIME_WINDOW`：时间窗口
- `BLOCK_DURATION`：封禁时长

### Q: 如何移除主页面的密码保护？

A: 编辑 `app/page.tsx`，移除 `PasswordGate` 组件包裹，直接返回主界面内容。

### Q: 密码保护在生产环境中安全吗？

A: 是的。密码存储在服务器端环境变量中，验证逻辑在服务器端执行，客户端无法绕过。但建议：
- 使用强密码
- 定期更换密码
- 配合 HTTPS 使用
- 如需更高安全性，可以集成 Redis 等持久化存储

## 技术栈

- **Next.js 16**：App Router
- **React 19**：客户端组件
- **TypeScript**：类型安全
- **Tailwind CSS**：样式
- **shadcn/ui**：UI 组件库
- **内存缓存**：尝试次数记录
