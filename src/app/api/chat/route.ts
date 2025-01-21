import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    // TODO: 这里后续会集成实际的AI模型API调用
    // 目前先返回模拟响应
    const response = {
      content: `这是对消息"${message}"的模拟回复`,
      role: 'assistant'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: '处理消息时发生错误' },
      { status: 500 }
    )
  }
} 