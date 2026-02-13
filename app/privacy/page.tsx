export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">隐私政策</h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <p className="text-sm text-gray-500 mb-4">
              更新日期：2026年2月13日<br />
              生效日期：2026年2月13日
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">引言</h2>
            <p className="leading-relaxed">
              靠山盟（以下简称"我们"）非常重视用户的隐私保护。
              本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。
              请您仔细阅读本隐私政策，以便更好地了解我们的隐私保护措施。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">一、我们收集的信息</h2>
            <div className="space-y-2 leading-relaxed">
              <p><strong>1.1 您主动提供的信息</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>注册信息：邮箱地址、密码</li>
                <li>使用信息：您在使用服务时输入的内容和指令</li>
                <li>充值信息：充值金额、支付方式（不包含支付密码）</li>
              </ul>

              <p className="mt-4"><strong>1.2 自动收集的信息</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>设备信息：设备型号、操作系统、浏览器类型</li>
                <li>日志信息：IP 地址、访问时间、访问页面</li>
                <li>使用记录：服务使用频率、功能使用情况</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">二、信息的使用</h2>
            <div className="space-y-2 leading-relaxed">
              <p>我们收集和使用您的个人信息用于以下目的：</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>提供、维护和改进我们的服务</li>
                <li>处理您的充值和消费记录</li>
                <li>向您发送服务通知和更新信息</li>
                <li>分析服务使用情况，优化用户体验</li>
                <li>防止欺诈、滥用和非法活动</li>
                <li>遵守法律法规要求</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">三、信息的存储</h2>
            <div className="space-y-2 leading-relaxed">
              <p><strong>3.1 存储地点</strong></p>
              <p>您的个人信息将存储在中国境内的服务器上。</p>

              <p className="mt-4"><strong>3.2 存储期限</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>账号信息：在您的账号存续期间持续保存</li>
                <li>使用记录：保存 12 个月</li>
                <li>充值记录：根据法律要求保存至少 5 年</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">四、信息的共享</h2>
            <div className="space-y-2 leading-relaxed">
              <p>我们不会向第三方出售、出租或交易您的个人信息。但在以下情况下，我们可能会共享您的信息：</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>获得您的明确同意</li>
                <li>根据法律法规或政府要求</li>
                <li>与服务提供商共享（如支付服务商），但仅限于提供服务所必需的信息</li>
                <li>保护我们或他人的合法权益</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">五、信息安全</h2>
            <div className="space-y-2 leading-relaxed">
              <p>我们采取以下措施保护您的个人信息安全：</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>使用 HTTPS 加密传输数据</li>
                <li>对密码进行加密存储</li>
                <li>实施访问控制和权限管理</li>
                <li>定期进行安全审计和漏洞扫描</li>
                <li>建立数据备份和灾难恢复机制</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">六、您的权利</h2>
            <div className="space-y-2 leading-relaxed">
              <p>您对自己的个人信息享有以下权利：</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>访问权：您可以随时查看您的个人信息</li>
                <li>更正权：您可以更正不准确的个人信息</li>
                <li>删除权：您可以要求删除您的个人信息（法律要求保留的除外）</li>
                <li>注销权：您可以注销您的账号</li>
                <li>拒绝权：您可以拒绝我们处理您的个人信息</li>
              </ul>
              <p className="mt-2">如需行使上述权利，请联系我们：992122851@qq.com</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">七、Cookie 和类似技术</h2>
            <div className="space-y-2 leading-relaxed">
              <p>我们使用 Cookie 和类似技术来：</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>记住您的登录状态</li>
                <li>分析网站流量和用户行为</li>
                <li>提供个性化的服务体验</li>
              </ul>
              <p className="mt-2">您可以通过浏览器设置管理或删除 Cookie，但这可能影响您使用我们的服务。</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">八、未成年人保护</h2>
            <p className="leading-relaxed">
              我们的服务面向年满 18 周岁的成年人。
              如果您是未成年人的监护人，发现未成年人未经您同意使用了我们的服务，请联系我们，我们将及时删除相关信息。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">九、隐私政策的变更</h2>
            <p className="leading-relaxed">
              我们可能会不时更新本隐私政策。
              更新后的隐私政策将在本页面公布，并自公布之日起生效。
              我们建议您定期查看本隐私政策，以了解最新的隐私保护措施。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">十、联系我们</h2>
            <div className="space-y-2 leading-relaxed">
              <p>如您对本隐私政策有任何疑问、意见或建议，请通过以下方式联系我们：</p>
              <ul className="list-none ml-4 space-y-1">
                <li>邮箱：992122851@qq.com</li>
                <li>网站：https://kaoshanmeng.cn</li>
              </ul>
              <p className="mt-2">我们将在收到您的反馈后尽快回复。</p>
            </div>
          </section>

          <section className="border-t pt-6 mt-8">
            <p className="text-sm text-gray-500">
              主办单位：周恩山<br />
              ICP备案号：<a href="https://beian.miit.gov.cn" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">京ICP备2026009026号-1</a>
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t">
          <a href="/" className="text-orange-600 hover:text-orange-700 font-medium">
            ← 返回首页
          </a>
        </div>
      </div>
    </div>
  )
}