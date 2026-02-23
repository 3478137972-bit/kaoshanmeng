import { NextRequest, NextResponse } from 'next/server';
import { alipay, generateOutTradeNo } from '@/lib/alipay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, subject, description } = body;

    if (!amount || !subject) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const outTradeNo = generateOutTradeNo();

    // 电脑网站支付
    const result = await alipay.pageExec('alipay.trade.page.pay', {
      method: 'GET',
      bizContent: {
        out_trade_no: outTradeNo,
        total_amount: amount.toFixed(2),
        subject: subject,
        body: description || '',
        product_code: 'FAST_INSTANT_TRADE_PAY',
      },
      returnUrl: process.env.ALIPAY_RETURN_URL,
      notifyUrl: process.env.ALIPAY_NOTIFY_URL,
    });

    return NextResponse.json({
      success: true,
      payUrl: result,
      outTradeNo: outTradeNo,
    });
  } catch (error) {
    console.error('创建支付宝订单失败:', error);
    return NextResponse.json(
      { error: '创建订单失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}
