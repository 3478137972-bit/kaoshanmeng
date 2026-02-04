'use client';

import { useState, FormEvent, ReactNode } from 'react';
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

export function PasswordGate({
  children,
  title = '访问验证',
  description = '请输入密码以继续访问',
  onSuccess,
}: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/password-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setIsVerified(true);
        setError(null);
        onSuccess?.();
      } else {
        setError(data.message);
        setPassword('');

        if (data.blocked) {
          setIsBlocked(true);
        } else if (data.remainingAttempts !== undefined) {
          setRemainingAttempts(data.remainingAttempts);
        }
      }
    } catch (err) {
      setError('网络错误，请稍后重试');
      console.error('密码验证错误:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isBlocked}
                className="text-center"
                autoFocus
              />
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
