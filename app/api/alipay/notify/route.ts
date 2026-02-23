import { NextRequest, NextResponse } from 'next/server';
import { alipay } from '@/lib/alipay';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const params: Record<string, string> = {};

    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    // 验证签名
    const signVerified = alipay.checkNotifySign(params);

    if (!signVerified) {
      console.error('支付宝回调签名验证失败');
      return new NextResponse('fail', { status: 400 });
    }

    const tradeStatus = params.trade_status;
    const outTradeNo = params.out_trade_no;
    const tradeNo = params.trade_no;
    const totalAmount = params.total_amount;

    console.log('支付宝回调:', {
      outTradeNo,
      tradeNo,
      tradeStatus,
      totalAmount,
    });

    // 处理支付成功
    if (tradeStatus === 'TRADE_SUCCESS' || tradeStatus === 'TRADE_FINISHED') {
      // TODO: 在这里更新数据库中的订单状态
      // 例如：await updateOrderStatus(outTradeNo, 'paid', tradeNo);

      console.log(`订单 ${outTradeNo} 支付成功，支付宝交易号: ${tradeNo}`);
    }

    // 返回 success 告诉支付宝已收到通知
    return new NextResponse('success', { status: 200 });
  } catch (error) {
    console.error('处理支付宝回调失败:', error);
    return new NextResponse('fail', { status: 500 });
  }
}
