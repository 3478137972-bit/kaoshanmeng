import { NextRequest, NextResponse } from 'next/server';

// 内存缓存：存储 IP 地址的尝试记录
// 结构：{ ip: { attempts: number, firstAttemptTime: number, blockedUntil?: number } }
const attemptCache = new Map<string, {
  attempts: number;
  firstAttemptTime: number;
  blockedUntil?: number;
}>();

// 配置
const MAX_ATTEMPTS = 5; // 最大尝试次数
const TIME_WINDOW = 15 * 60 * 1000; // 时间窗口：15分钟
const BLOCK_DURATION = 30 * 60 * 1000; // 封禁时长：30分钟

// 获取客户端 IP 地址
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return 'unknown';
}

// 清理过期的缓存记录
function cleanupCache() {
  const now = Date.now();
  for (const [ip, record] of attemptCache.entries()) {
    // 如果时间窗口已过，删除记录
    if (now - record.firstAttemptTime > TIME_WINDOW) {
      attemptCache.delete(ip);
    }
    // 如果封禁时间已过，删除记录
    if (record.blockedUntil && now > record.blockedUntil) {
      attemptCache.delete(ip);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, message: '请输入密码' },
        { status: 400 }
      );
    }

    const clientIP = getClientIP(request);
    const now = Date.now();

    // 清理过期缓存
    cleanupCache();

    // 获取当前 IP 的尝试记录
    let record = attemptCache.get(clientIP);

    // 检查是否被封禁
    if (record?.blockedUntil && now < record.blockedUntil) {
      const remainingMinutes = Math.ceil((record.blockedUntil - now) / 60000);
      return NextResponse.json(
        {
          success: false,
          message: `尝试次数过多，请在 ${remainingMinutes} 分钟后再试`,
          blocked: true,
          remainingMinutes,
        },
        { status: 429 }
      );
    }

    // 检查是否超过时间窗口内的最大尝试次数
    if (record && now - record.firstAttemptTime <= TIME_WINDOW) {
      if (record.attempts >= MAX_ATTEMPTS) {
        // 封禁该 IP
        record.blockedUntil = now + BLOCK_DURATION;
        attemptCache.set(clientIP, record);

        return NextResponse.json(
          {
            success: false,
            message: `尝试次数过多，已被封禁 30 分钟`,
            blocked: true,
            remainingMinutes: 30,
          },
          { status: 429 }
        );
      }
    } else {
      // 时间窗口已过，重置记录
      record = undefined;
    }

    // 验证密码
    const correctPassword = process.env.GATE_PASSWORD;

    if (!correctPassword) {
      console.error('GATE_PASSWORD 环境变量未设置');
      return NextResponse.json(
        { success: false, message: '服务器配置错误' },
        { status: 500 }
      );
    }

    if (password === correctPassword) {
      // 密码正确，清除尝试记录
      attemptCache.delete(clientIP);

      return NextResponse.json({
        success: true,
        message: '验证成功',
      });
    } else {
      // 密码错误，记录尝试
      if (!record) {
        record = {
          attempts: 1,
          firstAttemptTime: now,
        };
      } else {
        record.attempts += 1;
      }

      attemptCache.set(clientIP, record);

      const remainingAttempts = MAX_ATTEMPTS - record.attempts;

      return NextResponse.json(
        {
          success: false,
          message: `密码错误，还剩 ${remainingAttempts} 次尝试机会`,
          remainingAttempts,
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('密码验证错误:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误' },
      { status: 500 }
    );
  }
}
