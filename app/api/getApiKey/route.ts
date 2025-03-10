import { NextResponse } from 'next/server';

export async function GET() {
  // 从环境变量获取API密钥
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  // 如果API密钥不存在，返回错误
  if (!apiKey) {
    return NextResponse.json(
      { error: 'API密钥未设置' },
      { status: 500 }
    );
  }

  // 返回API密钥
  return NextResponse.json({ apiKey });
} 