export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">退款政策</h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <p className="text-sm text-gray-500 mb-4">
              更新日期：2026年2月13日<br />
              生效日期：2026年2月13日
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">重要提示</h2>
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
              <p className="font-semibold text-orange-800">
                本平台采用积分预充值制，充值后的积分原则上不支持退款。
                请您在充值前仔细阅读本退款政策，充值即视为您已知晓并同意本政策。
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">一、不予退款的情况</h2>
            <div className="space-y-2 leading-relaxed">
              <p>以下情况下，充值金额不予退款：</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>充值成功后，因个人原因（如不想使用、充值金额过多等）要求退款</li>
                <li>已使用部分或全部积分后要求退款</li>
                <li>因违反用户服务协议被封禁账号后要求退款</li>
                <li>充值超过 7 天后要求退款</li>
                <li>无法提供有效的充值凭证</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">二、可申请退款的情况</h2>
            <div className="space-y-2 leading-relaxed">
              <p>仅在以下特殊情况下，您可以申请退款：</p>

              <p className="mt-4"><strong>2.1 系统故障导致的重复充值</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>因系统故障导致同一笔订单重复扣款</li>
                <li>需提供支付凭证和订单号</li>
                <li>退款金额为重复扣款部分</li>
              </ul>

              <p className="mt-4"><strong>2.2 充值未到账</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>支付成功但积分未到账，且超过 24 小时</li>
                <li>需提供支付凭证（支付宝交易记录截图）</li>
                <li>我们核实后将补充积分或退款</li>
              </ul>

              <p className="mt-4"><strong>2.3 误充值且未使用</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>充值后 7 天内未使用任何积分</li>
                <li>需提供充值凭证和未使用证明</li>
                <li>每个账号仅限申请一次误充值退款</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">三、退款流程</h2>
            <div className="space-y-2 leading-relaxed">
              <p><strong>3.1 申请退款</strong></p>
              <p>如您符合退款条件，请通过以下方式申请：</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>发送邮件至：992122851@qq.com</li>
                <li>邮件标题：【退款申请】+ 您的账号邮箱</li>
                <li>邮件内容需包含：
                  <ul className="list-circle list-inside ml-6 mt-1">
                    <li>账号邮箱</li>
                    <li>充值时间和金额</li>
                    <li>支付宝交易号</li>
                    <li>退款原因</li>
                    <li>支付凭证截图</li>
                  </ul>
                </li>
              </ul>

              <p className="mt-4"><strong>3.2 审核处理</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>我们将在收到申请后 3 个工作日内完成审核</li>
                <li>审核通过后，将通过邮件通知您</li>
                <li>审核不通过，将说明原因</li>
              </ul>

              <p className="mt-4"><strong>3.3 退款到账</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>退款将原路返回至您的支付宝账户</li>
                <li>退款处理时间：审核通过后 1-3 个工作日</li>
                <li>支付宝到账时间：通常为即时到账，最长不超过 7 个工作日</li>
                <li>退款金额 = 充值金额 - 已使用积分对应金额</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">四、退款规则说明</h2>
            <div className="space-y-2 leading-relaxed">
              <p><strong>4.1 退款金额计算</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>退款金额 = 充值金额 - 已使用积分金额</li>
                <li>已使用积分按照 1 积分 = 1.1 人民币计算</li>
                <li>不足 0.01 元的部分不予退款</li>
              </ul>

              <p className="mt-4"><strong>4.2 退款手续费</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>系统故障导致的退款：不收取手续费</li>
                <li>误充值退款：不收取手续费</li>
                <li>支付宝可能收取的手续费由支付宝承担</li>
              </ul>

              <p className="mt-4"><strong>4.3 退款后账号处理</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>退款后，对应的积分将被扣除</li>
                <li>如积分不足，账号将被冻结直至补足差额</li>
                <li>退款记录将保留在系统中</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">五、特殊说明</h2>
            <div className="space-y-2 leading-relaxed">
              <p><strong>5.1 支付宝退款规则</strong></p>
              <p>本平台使用支付宝作为支付渠道，退款遵循支付宝的相关规则：</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>退款只能原路返回至支付账户</li>
                <li>退款到账时间由支付宝系统决定</li>
                <li>如遇支付宝系统问题导致退款延迟，请联系支付宝客服</li>
              </ul>

              <p className="mt-4"><strong>5.2 争议解决</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>如对退款结果有异议，请在收到通知后 7 天内提出</li>
                <li>我们将重新审核并在 3 个工作日内给予答复</li>
                <li>如仍有争议，可通过法律途径解决</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">六、温馨提示</h2>
            <div className="space-y-2 leading-relaxed">
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>请根据实际需求充值，避免充值过多</li>
                <li>充值前请仔细核对充值金额</li>
                <li>保存好支付凭证，以便在需要时提供</li>
                <li>如有疑问，请在充值前联系客服咨询</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">七、联系我们</h2>
            <div className="space-y-2 leading-relaxed">
              <p>如您对退款政策有任何疑问，或需要申请退款，请联系我们：</p>
              <ul className="list-none ml-4 space-y-1">
                <li>邮箱：992122851@qq.com</li>
                <li>网站：https://kaoshanmeng.cn</li>
              </ul>
              <p className="mt-2">我们将在 24 小时内回复您的邮件。</p>
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
