import { NextRequest, NextResponse } from 'next/server';
import { getAlipay } from '@/lib/alipay';
import { createClient } from '@supabase/supabase-js';

// 延迟初始化 Supabase 客户端
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const params: Record<string, string> = {};

    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    // 验证签名
    const signVerified = getAlipay().checkNotifySign(params);

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
      const supabaseAdmin = getSupabaseAdmin();

      // 查询订单获取用户ID
      const { data: order, error: orderError } = await supabaseAdmin
        .from('payment_orders')
        .select('user_id, amount, status')
        .eq('out_trade_no', outTradeNo)
        .single();

      if (orderError) {
        console.error('查询订单失败:', orderError);
        return new NextResponse('fail', { status: 500 });
      }

      // 防止重复处理
      if (order.status === 'paid') {
        console.log(`订单 ${outTradeNo} 已处理过，跳过`);
        return new NextResponse('success', { status: 200 });
      }

      // 更新订单状态
      await supabaseAdmin
        .from('payment_orders')
        .update({
          status: 'paid',
          trade_no: tradeNo,
          paid_at: new Date().toISOString()
        })
        .eq('out_trade_no', outTradeNo);

      // 给用户充值积分
      if (order.user_id) {
        const amount = parseFloat(totalAmount);

        // 获取用户当前积分
        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('credits')
          .eq('id', order.user_id)
          .single();

        const currentCredits = profile?.credits || 0;
        const newBalance = currentCredits + amount;

        // 更新积分
        await supabaseAdmin
          .from('user_profiles')
          .update({ credits: newBalance })
          .eq('id', order.user_id);

        // 记录交易
        await supabaseAdmin
          .from('credit_transactions')
          .insert({
            user_id: order.user_id,
            amount: amount,
            transaction_type: 'recharge',
            description: `支付宝充值 - 订单号: ${outTradeNo}`,
            balance_after: newBalance,
          });

        console.log(`用户 ${order.user_id} 充值 ${amount} 积分成功，新余额: ${newBalance}`);
      }

      console.log(`订单 ${outTradeNo} 支付成功，支付宝交易号: ${tradeNo}`);
    }

    // 返回 success 告诉支付宝已收到通知
    return new NextResponse('success', { status: 200 });
  } catch (error) {
    console.error('处理支付宝回调失败:', error);
    return new NextResponse('fail', { status: 500 });
  }
}
