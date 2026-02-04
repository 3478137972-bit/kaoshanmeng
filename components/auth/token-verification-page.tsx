"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { TokenDialog } from "@/components/auth/token-dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, LogOut, User } from "lucide-react"

interface TokenVerificationPageProps {
  onSuccess: () => void
}

export function TokenVerificationPage({ onSuccess }: TokenVerificationPageProps) {
  const [showTokenDialog, setShowTokenDialog] = useState(true)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    // 获取用户信息
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email || null)
      }
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const handleTokenSuccess = () => {
    setShowTokenDialog(false)
    onSuccess()
  }

  return (
    <div className="flex h-screen w-screen bg-background">
      {/* 左侧：登录状态信息 */}
      <div className="w-1/2 flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 p-8">
        <div className="max-w-md w-full">
          <div className="bg-card border rounded-lg p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">登录成功</h2>
              <p className="text-muted-foreground text-sm">
                您已使用 Google 账号登录
              </p>
            </div>

            {userEmail && (
              <div className="bg-muted rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">登录账号</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {userEmail}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>下一步：</strong>请在右侧输入访问令牌以解锁使用权限
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧：令牌输入 */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">访问权限验证</h1>
            <p className="text-muted-foreground">
              请输入访问令牌以解锁使用权限
            </p>
          </div>
          <TokenDialog
            open={showTokenDialog}
            onOpenChange={setShowTokenDialog}
            onSuccess={handleTokenSuccess}
          />
        </div>
      </div>
    </div>
  )
}
