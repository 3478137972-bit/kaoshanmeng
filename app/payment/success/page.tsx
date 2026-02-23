'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const outTradeNo = searchParams.get('out_trade_no');
  const tradeNo = searchParams.get('trade_no');
  const totalAmount = searchParams.get('total_amount');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          支付成功
        </h1>

        <p className="text-gray-600 mb-6">
          感谢您的购买，您的订单已支付成功
        </p>

        {(outTradeNo || tradeNo || totalAmount) && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            {outTradeNo && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">订单号</span>
                <span className="text-gray-900 font-medium">{outTradeNo}</span>
              </div>
            )}
            {tradeNo && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-500">支付宝交易号</span>
                <span className="text-gray-900 font-medium text-sm">{tradeNo}</span>
              </div>
            )}
            {totalAmount && (
              <div className="flex justify-between py-2">
                <span className="text-gray-500">支付金额</span>
                <span className="text-green-600 font-bold">¥{totalAmount}</span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
