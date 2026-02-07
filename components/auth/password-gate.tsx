'use client';

import { useState, FormEvent, ReactNode, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PasswordGateProps {
  children: ReactNode;
  title?: string;
  description?: string;
  onSuccess?: () => void;
}

const STORAGE_KEY = 'password_verified';

export function PasswordGate({
  children,
  title = '访问验证',
  description = '请输入密码以继续访问',
  onSuccess,
}: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  // 检查 sessionStorage 中的验证状态
  useEffect(() => {
    console.log('=== PasswordGate 检查验证状态 ===')
    const verified = sessionStorage.getItem(STORAGE_KEY);
    console.log('sessionStorage 中的验证状态:', verified)
    if (verified === 'true') {
      console.log('验证状态有效，显示受保护内容')
      setIsVerified(true);
    } else {
      console.log('验证状态无效，显示密码输入界面')
    }
    setIsCheckingStorage(false);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 修改为验证用户专属令牌
      const response = await fetch('/api/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsVerified(true);
        setError(null);
        // 保存验证状态到 sessionStorage
        sessionStorage.setItem(STORAGE_KEY, 'true');
        onSuccess?.();
      } else {
        setError(data.error || '访问令牌无效');
        setPassword('');
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('令牌验证错误:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 正在检查存储状态时显示加载
  if (isCheckingStorage) {
    return null;
  }

  // 如果已验证，显示受保护的内容
  if (isVerified) {
    return <>{children}</>;
  }

  // 显示密码输入界面
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">{title}</CardTitle>
          <CardDescription className="text-center">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="请输入访问令牌（UUID 格式）"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isBlocked}
                className="text-center font-mono text-sm"
                autoFocus
              />
              <p className="text-xs text-muted-foreground text-center mt-2">
                格式示例：a1b2c3d4-e5f6-7890-abcd-ef1234567890
              </p>
            </div>

            {error && (
              <Alert variant={isBlocked ? 'destructive' : 'default'}>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {remainingAttempts !== null && !isBlocked && (
              <Alert>
                <AlertDescription className="text-sm text-muted-foreground">
                  剩余尝试次数：{remainingAttempts}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isBlocked || !password}
            >
              {isLoading ? '验证中...' : isBlocked ? '已被封禁' : '验证'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
