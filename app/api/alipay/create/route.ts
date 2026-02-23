import { NextRequest, NextResponse } from 'next/server';
import { getAlipay, generateOutTradeNo } from '@/lib/alipay';
import { createClient } from '@supabase/supabase-js';

// 创建服务端 Supabase 客户端
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, subject, userId } = body;

    if (!amount || !subject) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const outTradeNo = generateOutTradeNo();

    // 保存订单到数据库
    const { error: orderError } = await supabaseAdmin
      .from('payment_orders')
      .insert({
        out_trade_no: outTradeNo,
        user_id: userId || null,
        amount: amount,
        subject: subject,
        status: 'pending',
      });

    if (orderError) {
      console.error('保存订单失败:', orderError);
      // 继续执行，不影响支付流程
    }

    // 电脑网站支付
    const result = await getAlipay().pageExec('alipay.trade.page.pay', {
      method: 'GET',
      bizContent: {
        out_trade_no: outTradeNo,
        total_amount: amount.toFixed(2),
        subject: subject,
        body: userId || '',
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
