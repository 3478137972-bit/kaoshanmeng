export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">用户服务协议</h1>

        <div className="space-y-6 text-gray-700">
          <section>
            <p className="text-sm text-gray-500 mb-4">
              更新日期：2026年2月13日<br />
              生效日期：2026年2月13日
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">欢迎使用靠山盟</h2>
            <p className="leading-relaxed">
              靠山盟（以下简称"本平台"）是由周恩山（以下简称"我们"）运营的 AI 创作助手平台。
              在使用本平台服务前，请您仔细阅读并充分理解本协议的全部内容。
              一旦您注册、登录或使用本平台服务，即表示您已阅读、理解并同意接受本协议的全部内容。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">一、服务说明</h2>
            <div className="space-y-2 leading-relaxed">
              <p><strong>1.1 服务内容</strong></p>
              <p>本平台为用户提供 AI 创作助手服务，包括但不限于：</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>21 个专业 AI 员工，覆盖战略、内容、销售、交付四大部门</li>
                <li>商业定位、内容创作、用户分析等创作支持</li>
                <li>销售话术生成、产品策划等业务协助</li>
              </ul>

              <p className="mt-4"><strong>1.2 服务方式</strong></p>
              <p>本平台采用积分制计费方式，用户需要充值积分后方可使用服务。</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">二、用户注册与账号</h2>
            <div className="space-y-2 leading-relaxed">
              <p><strong>2.1 注册资格</strong></p>
              <p>您需要年满 18 周岁，具有完全民事行为能力，方可注册使用本平台服务。</p>

              <p className="mt-4"><strong>2.2 账号安全</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>您应妥善保管账号和密码，不得将账号出借、转让或分享给他人使用</li>
                <li>因您保管不善导致的账号被盗用，由您自行承担责任</li>
                <li>如发现账号被盗用，请立即联系我们</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">三、积分与充值</h2>
            <div className="space-y-2 leading-relaxed">
              <p><strong>3.1 积分规则</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>1 积分 = 1.1 人民币</li>
                <li>积分仅可用于本平台服务消费，不可提现或转让</li>
                <li>积分按照实际使用量扣除，具体计费标准详见平台说明</li>
              </ul>

              <p className="mt-4"><strong>3.2 充值说明</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>充值金额一经支付成功，即时到账</li>
                <li>充值金额不支持退款，请谨慎充值</li>
                <li>如遇充值异常，请联系客服处理</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">四、用户行为规范</h2>
            <div className="space-y-2 leading-relaxed">
              <p>在使用本平台服务时，您不得：</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>发布违法违规、淫秽色情、暴力恐怖等不良信息</li>
                <li>侵犯他人知识产权、商业秘密或其他合法权益</li>
                <li>利用本平台从事欺诈、传销等违法活动</li>
                <li>恶意攻击、破坏本平台系统或网络安全</li>
                <li>使用外挂、插件等非法手段使用本平台服务</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">五、知识产权</h2>
            <div className="space-y-2 leading-relaxed">
              <p><strong>5.1 平台权利</strong></p>
              <p>本平台的所有内容（包括但不限于文字、图片、软件、程序等）的知识产权归我们所有。</p>

              <p className="mt-4"><strong>5.2 用户内容</strong></p>
              <p>您使用本平台生成的内容，知识产权归您所有。但您授予我们在必要范围内使用该内容的权利，用于改进服务质量。</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">六、免责声明</h2>
            <div className="space-y-2 leading-relaxed">
              <p><strong>6.1 服务中断</strong></p>
              <p>因系统维护、升级、故障或不可抗力等原因导致的服务中断，我们不承担责任。</p>

              <p className="mt-4"><strong>6.2 内容准确性</strong></p>
              <p>AI 生成的内容仅供参考，我们不保证其准确性、完整性或适用性。您应自行判断并承担使用风险。</p>

              <p className="mt-4"><strong>6.3 第三方链接</strong></p>
              <p>本平台可能包含第三方网站链接，我们对第三方网站的内容不承担责任。</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">七、协议变更</h2>
            <p className="leading-relaxed">
              我们有权根据需要修改本协议。修改后的协议将在本平台公布，并自公布之日起生效。
              如您继续使用本平台服务，即视为您接受修改后的协议。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">八、联系我们</h2>
            <div className="space-y-2 leading-relaxed">
              <p>如您对本协议有任何疑问，请通过以下方式联系我们：</p>
              <ul className="list-none ml-4 space-y-1">
                <li>邮箱：992122851@qq.com</li>
                <li>网站：https://kaoshanmeng.cn</li>
              </ul>
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
