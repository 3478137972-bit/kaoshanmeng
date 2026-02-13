"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast({
        title: "请填写完整信息",
        description: "邮箱和密码不能为空",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      if (isSignUp) {
        // 注册
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/auth/callback`,
          },
        })

        if (error) throw error

        toast({
          title: "注册成功",
          description: "请查收邮箱验证邮件",
        })
      } else {
        // 登录
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        toast({
          title: "登录成功",
          description: "正在跳转...",
        })

        // 登录成功后刷新页面
        window.location.href = "/"
      }
    } catch (error) {
      console.error("操作失败:", error)
      toast({
        title: isSignUp ? "注册失败" : "登录失败",
        description: error instanceof Error ? error.message : "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="max-w-md w-full p-8">
        <div className="bg-card border rounded-lg p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">欢迎来到靠山盟</h1>
            <p className="text-muted-foreground">一人公司AIP军团</p>
          </div>

          <div className="space-y-4">
            {/* 邮箱密码登录表单 */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isSignUp ? "注册中..." : "登录中..."}
                  </>
                ) : (
                  <>{isSignUp ? "注册账号" : "登录"}</>
                )}
              </Button>
            </form>

            {/* 切换登录/注册 */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                disabled={isLoading}
              >
                {isSignUp ? "已有账号？立即登录" : "没有账号？立即注册"}
              </button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              登录即表示您同意我们的
              <a href="/terms" target="_blank" className="text-primary hover:underline mx-1">服务条款</a>
              、
              <a href="/privacy" target="_blank" className="text-primary hover:underline mx-1">隐私政策</a>
              和
              <a href="/refund" target="_blank" className="text-primary hover:underline mx-1">退款政策</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
