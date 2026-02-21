import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: '缺少 code 参数' },
        { status: 400 }
      );
    }

    // 使用 code 换取 openid 和 session_key
    const appid = process.env.WECHAT_APPID;
    const secret = process.env.WECHAT_SECRET;

    if (!appid || !secret) {
      return NextResponse.json(
        { error: '微信小程序配置缺失' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
    );

    const data = await response.json();

    if (data.errcode) {
      return NextResponse.json(
        { error: data.errmsg },
        { status: 400 }
      );
    }

    const { openid, session_key } = data;

    // 在数据库中查找或创建用户

    // 检查用户是否存在
    const { data: existingUser, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('wechat_openid', openid)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('查询用户失败:', fetchError);
      return NextResponse.json(
        { error: '数据库查询失败' },
        { status: 500 }
      );
    }

    let userId;

    if (existingUser) {
      // 用户已存在
      userId = existingUser.id;
    } else {
      // 创建新用户
      const { data: newUser, error: createError } = await supabase
        .from('user_profiles')
        .insert({
          wechat_openid: openid,
          has_access: false, // 默认没有访问权限
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error('创建用户失败:', createError);
        return NextResponse.json(
          { error: '创建用户失败' },
          { status: 500 }
        );
      }

      userId = newUser.id;
    }

    return NextResponse.json({
      openid,
      userId,
      hasAccess: existingUser?.has_access || false
    });

  } catch (error) {
    console.error('微信登录错误:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}
