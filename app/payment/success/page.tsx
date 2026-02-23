"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Loader2, ArrowLeft, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [orderInfo, setOrderInfo] = useState<{
    outTradeNo: string | null
    tradeNo: string | null
    totalAmount: string | null
  }>({
    outTradeNo: null,
    tradeNo: null,
    totalAmount: null,
  })

  useEffect(() => {
    const outTradeNo = searchParams.get("out_trade_no")
    const tradeNo = searchParams.get("trade_no")
    const totalAmount = searchParams.get("total_amount")

    setOrderInfo({
      outTradeNo,
      tradeNo,
      totalAmount,
    })
  }, [searchParams])

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">支付成功</CardTitle>
          <CardDescription>您的积分充值已完成</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {orderInfo.totalAmount && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">充值金额</p>
              <p className="text-3xl font-bold text-primary">
                {orderInfo.totalAmount} 积分
              </p>
            </div>
          )}

          <div className="space-y-2 rounded-lg bg-muted p-4 text-sm">
            {orderInfo.outTradeNo && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">订单号</span>
                <span className="font-mono">{orderInfo.outTradeNo}</span>
              </div>
            )}
            {orderInfo.tradeNo && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">支付宝交易号</span>
                <span className="font-mono text-xs">{orderInfo.tradeNo}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/billing">
              <Button className="w-full">
                <Wallet className="w-4 h-4 mr-2" />
                查看积分余额
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回主页
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">正在确认支付结果...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
