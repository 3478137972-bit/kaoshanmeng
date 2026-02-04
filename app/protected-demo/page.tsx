import { PasswordGate } from '@/components/auth/password-gate';

export default function ProtectedDemoPage() {
  return (
    <PasswordGate
      title="受保护的演示页面"
      description="这是一个密码保护的示例页面"
    >
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-green-600 dark:text-green-400">
            🎉 验证成功！
          </h1>
          <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p className="text-lg">
              恭喜！你已成功通过密码验证，现在可以访问受保护的内容了。
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                功能特性：
              </h2>
              <ul className="list-disc list-inside space-y-2">
                <li>✅ 无需数据库支持</li>
                <li>✅ 基于环境变量的密码配置</li>
                <li>✅ 智能尝试次数限制（15分钟内最多5次）</li>
                <li>✅ 自动封禁机制（超过限制后封禁30分钟）</li>
                <li>✅ 基于 IP 地址的访问控制</li>
                <li>✅ 优雅的用户界面</li>
              </ul>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-3">
                使用说明：
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>在 .env.local 文件中设置 GATE_PASSWORD 环境变量</li>
                <li>使用 PasswordGate 组件包裹需要保护的内容</li>
                <li>用户输入正确密码后即可访问受保护内容</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </PasswordGate>
  );
}
