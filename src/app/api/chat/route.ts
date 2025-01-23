import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LLMMessage } from '@/types/message'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('收到的原始消息:', JSON.stringify(body, null, 2));
    
    // 正确获取messages数组
    const messages = body.messages as LLMMessage[]
    console.log('处理后的messages:', JSON.stringify(messages, null, 2));

    const client = new OpenAI({
        apiKey: "sk-B5aiR0r1ljcLCPfLEc0443E186E24149B94aBb853a22743e",
        baseURL: "https://aihubmix.com/v1"
    });

    // 确保消息格式正确
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    console.log('发送给 OpenAI 的消息格式:', JSON.stringify(formattedMessages, null, 2));

    // 设置流式响应
    const response = await client.chat.completions.create({
        model: "gemini-2.0-flash-exp",
        messages: formattedMessages,
        temperature: 0.2,
        frequency_penalty: 0,
        stream: true
    }).catch(error => {
        console.error('OpenAI API 错误详情:', {
            status: error.status,
            message: error.message,
            type: error.type,
            code: error.code,
            param: error.param,
            details: error.details
        });
        throw error;
    });

    // 创建一个新的 TransformStream
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    console.log('开始流式响应');

    // 处理流式响应
    const streamPromise = (async () => {
      try {
        let retryCount = 0;
        const MAX_RETRIES = 3;
        
        const processStream = async () => {
          try {
            for await (const chunk of response) {
              const content = chunk.choices[0]?.delta?.content || '';
              
              if (content) {
                console.log('收到chunk:', content);
                await writer.write(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
              }
              
              // 检查是否是最后一个消息
              if (chunk.choices[0]?.finish_reason === 'stop') {
                console.log('检测到完成标志');
                return true; // 正常完成
              }
            }
          } catch (error: any) {
            if (error.code === 'ECONNRESET' && retryCount < MAX_RETRIES) {
              console.log(`连接重置，第 ${retryCount + 1} 次重试...`);
              retryCount++;
              return false; // 需要重试
            }
            throw error; // 其他错误或超过重试次数
          }
          return true; // 正常完成
        };

        // 尝试处理流，如果失败则重试
        while (retryCount <= MAX_RETRIES) {
          const success = await processStream();
          if (success) break;
        }
        
        console.log('流式响应完成');
        await writer.write(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
      } catch (error: any) {
        console.error('Stream processing error:', error);
        // 发送错误信息给客户端
        await writer.write(encoder.encode(`data: ${JSON.stringify({ 
          error: error.code === 'ECONNRESET' ? '网络连接不稳定，请重试' : '流式响应出错' 
        })}\n\n`));
      } finally {
        console.log('关闭流');
        await writer.close();
      }
    })();

    // 设置超时检查
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('流式响应超时'));
      }, 30000); // 30秒总超时
    });

    // 同时处理流式响应和超时
    Promise.race([streamPromise, timeoutPromise]).catch(async (error) => {
      console.error('流式响应错误或超时:', error);
      try {
        await writer.write(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`));
      } finally {
        await writer.close();
      }
    });

    // 返回流式响应
    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API Error:', error)
    console.error('错误堆栈:', error instanceof Error ? error.stack : '无堆栈信息')
    return NextResponse.json(
      { error: '处理消息时发生错误', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
} 