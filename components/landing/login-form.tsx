'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccessMessage('')

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

        setSuccessMessage('注册成功！请查收邮箱验证邮件')
      } else {
        // 登录
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        // 登录成功后跳转到 dashboard
        window.location.href = '/dashboard'
      }
    } catch (err: any) {
      setError(err.message || (isSignUp ? '注册失败，请重试' : '登录失败，请重试'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">欢迎来到靠山盟</h2>
        <p className="text-gray-600">一人公司AIP军团</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (isSignUp ? '注册中...' : '登录中...') : (isSignUp ? '注册账号' : '登录')}
        </button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-600">
        {isSignUp ? '已有账号？' : '没有账号？'}{' '}
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp)
            setError('')
            setSuccessMessage('')
          }}
          className="text-orange-600 hover:text-orange-700 font-medium"
        >
          {isSignUp ? '立即登录' : '立即注册'}
        </button>
      </div>

      <div className="mt-6 text-xs text-center text-gray-500">
        {'登录即表示同意我们的'}
        <a href="/terms" target="_blank" className="text-orange-600 hover:text-orange-700 mx-1">服务条款</a>
        {'、'}
        <a href="/privacy" target="_blank" className="text-orange-600 hover:text-orange-700 mx-1">隐私政策</a>
        {'和'}
        <a href="/refund" target="_blank" className="text-orange-600 hover:text-orange-700 mx-1">退款政策</a>
      </div>
    </div>
  )
}
