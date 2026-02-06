"use client"

import { useState, useEffect } from "react"
import { Wallet, ArrowLeft, Loader2, Plus, TrendingDown } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { LoginPage } from "@/components/auth/login-page"
import { PasswordGate } from "@/components/auth/password-gate"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getUserCredits, rechargeCredits } from "@/lib/billing"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"

interface UsageRecord {
  id: string
  agent_name: string
  model_name: string
  input_tokens: number
  output_tokens: number
  input_cost: number
  output_cost: number
  total_cost: number
  created_at: string
}

export default function BillingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [credits, setCredits] = useState(0)
  const [usageRecords, setUsageRecords] = useState<UsageRecord[]>([])
  const [isLoadingRecords, setIsLoadingRecords] = useState(true)
  const [rechargeAmount, setRechargeAmount] = useState("")
  const [isRecharging, setIsRecharging] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
      if (user) {
        setUserId(user.id)
        await loadUserData(user.id)
      }
    } catch (error) {
      console.error("检查认证状态失败:", error)
      setIsLoggedIn(false)
    } finally {
      setIsCheckingAuth(false)
    }
  }

  const loadUserData = async (uid: string) => {
    try {
      // 加载积分
      const userCredits = await getUserCredits(uid)
      setCredits(userCredits)

      // 加载使用记录
      const { data, error } = await supabase
        .from('usage_records')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) {
        console.error('加载使用记录失败:', error)
      } else {
        setUsageRecords(data || [])
      }
    } catch (error) {
      console.error('加载用户数据失败:', error)
    } finally {
      setIsLoadingRecords(false)
    }
  }

  const handleRecharge = async () => {
    if (!userId || !rechargeAmount) return

    const amount = parseFloat(rechargeAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('请输入有效的充值金额')
      return
    }

    setIsRecharging(true)
    try {
      const result = await rechargeCredits(userId, amount, `充值 ${amount} 积分`)
      if (result.success) {
        setCredits(result.balance || 0)
        setRechargeAmount("")
        alert('充值成功！')

        // 触发自定义事件，通知其他组件积分已更新
        window.dispatchEvent(new CustomEvent('creditsUpdated', {
          detail: { balance: result.balance }
        }))
      } else {
        alert('充值失败：' + result.error)
      }
    } catch (error) {
      console.error('充值失败:', error)
      alert('充值失败')
    } finally {
      setIsRecharging(false)
    }
  }

  const handleEmployeeClick = (employeeName: string) => {
    router.push(`/?employee=${encodeURIComponent(employeeName)}`)
  }

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">正在检查认证状态...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <LoginPage />
  }

  return (
    <PasswordGate
      title="访问验证"
      description="请输入密码以访问靠山实战营"
    >
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar activeItem="" onItemClick={handleEmployeeClick} />
        <div className="flex-1 flex flex-col h-full bg-background overflow-hidden">
          {/* Header */}
          <header className="px-6 py-4 bg-card border-b border-border flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  返回主页
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">积分与计费</h1>
                <p className="text-sm text-muted-foreground">管理您的积分和查看使用记录</p>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* 积分卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      当前积分
                    </CardTitle>
                    <CardDescription>1积分 = 1人民币</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-primary">
                      {credits.toFixed(4)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      积分余额
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      充值积分
                    </CardTitle>
                    <CardDescription>增加您的积分余额</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="amount">充值金额（积分）</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="请输入充值金额"
                          value={rechargeAmount}
                          onChange={(e) => setRechargeAmount(e.target.value)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <Button
                        onClick={handleRecharge}
                        disabled={isRecharging || !rechargeAmount}
                        className="w-full"
                      >
                        {isRecharging ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            充值中...
                          </>
                        ) : (
                          '立即充值'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 计费规则说明 */}
              <Card>
                <CardHeader>
                  <CardTitle>Gemini 3 Pro 计费规则</CardTitle>
                  <CardDescription>按照输入和输出 tokens 数量计费</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">输入（提示）</p>
                        <p className="text-sm text-muted-foreground">Input tokens</p>
                      </div>
                      <Badge variant="secondary" className="text-base">
                        ¥0.8 / 1M tokens
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">输出（补全）</p>
                        <p className="text-sm text-muted-foreground">Output tokens</p>
                      </div>
                      <Badge variant="secondary" className="text-base">
                        ¥4.8 / 1M tokens
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 使用记录 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5" />
                    使用记录
                  </CardTitle>
                  <CardDescription>最近 50 条使用记录</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingRecords ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">加载中...</p>
                    </div>
                  ) : usageRecords.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">暂无使用记录</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {usageRecords.map((record) => (
                        <div
                          key={record.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{record.agent_name}</p>
                              <Badge variant="outline" className="text-xs">
                                {record.model_name}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>输入: {record.input_tokens.toLocaleString()} tokens</span>
                              <span>输出: {record.output_tokens.toLocaleString()} tokens</span>
                              <span>
                                {formatDistanceToNow(new Date(record.created_at), {
                                  addSuffix: true,
                                  locale: zhCN,
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              -{record.total_cost.toFixed(4)}
                            </p>
                            <p className="text-xs text-muted-foreground">积分</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PasswordGate>
  )
}
