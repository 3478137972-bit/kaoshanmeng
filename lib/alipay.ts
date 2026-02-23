import { AlipaySdk } from 'alipay-sdk';

// 延迟初始化支付宝 SDK（避免构建时报错）
let _alipay: AlipaySdk | null = null;

export function getAlipay(): AlipaySdk {
  if (!_alipay) {
    _alipay = new AlipaySdk({
      appId: process.env.ALIPAY_APP_ID!,
      privateKey: process.env.ALIPAY_PRIVATE_KEY!,
      alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY!,
      signType: 'RSA2',
    });
  }
  return _alipay;
}

// 生成唯一订单号
export function generateOutTradeNo(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `KSM${timestamp}${random}`;
}
