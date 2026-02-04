import { PasswordGate } from '@/components/auth/password-gate';

export default function SecurePage() {
  return (
    <PasswordGate
      title="安全访问验证"
      description="请输入密码以访问此页面"
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* 导航栏 */}
        <nav className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                  🔒 安全区域
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  已验证访问
                </span>
              </div>
            </div>
          </div>
        </nav>

        {/* 主要内容 */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* 欢迎卡片 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  欢迎访问安全区域
                </h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                你已成功通过密码验证，现在可以访问受保护的内容了。
              </p>
            </div>

            {/* 功能网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 卡片 1 */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">私密文档</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  访问和管理你的私密文档和资料
                </p>
              </div>

              {/* 卡片 2 */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">系统设置</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  配置和管理系统的高级设置
                </p>
              </div>

              {/* 卡片 3 */}
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">安全中心</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  查看和管理安全相关的设置
                </p>
              </div>
            </div>

            {/* 信息面板 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                关于此页面
              </h3>
              <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                <p>
                  这是一个受密码保护的页面示例。只有输入正确的密码才能访问此页面的内容。
                </p>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-2">
                  <p className="font-medium text-slate-900 dark:text-white">安全特性：</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>基于 IP 地址的访问控制</li>
                    <li>15分钟内最多5次尝试</li>
                    <li>超过限制后自动封禁30分钟</li>
                    <li>无需数据库，使用内存缓存</li>
                    <li>密码存储在服务器端环境变量中</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PasswordGate>
  );
}

