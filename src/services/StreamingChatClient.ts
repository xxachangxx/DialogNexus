import { LLMMessage } from '@/types/message'

/**
 * 聊天事件处理器接口，定义了流式聊天过程中的各个生命周期回调
 */
interface ChatEventHandlers {
  /** 开始处理流式响应时的回调 */
  onStart?: () => void
  /** 接收到新的文本片段时的回调 */
  onToken?: (token: string) => void
  /** 发生错误时的回调 */
  onError?: (error: Error) => void
  /** 完成所有流式数据处理时的回调 */
  onFinish?: () => void
}

/**
 * 流式聊天客户端类
 * 负责处理与聊天 API 的通信，支持流式响应处理
 * 实现了基于观察者模式的优化变体，用于处理流式数据
 */
export class StreamingChatClient {
  private readonly apiEndpoint: string
  
  /**
   * 创建流式聊天客户端实例
   * @param apiEndpoint - API 端点地址，默认为 '/api/chat'
   */
  constructor(apiEndpoint: string = '/api/chat') {
    this.apiEndpoint = apiEndpoint
  }

  /**
   * 发起流式聊天请求并处理响应
   * @param messages - 聊天消息数组
   * @param handlers - 事件处理器对象，包含各个生命周期的回调函数
   * @throws {Error} 当请求失败或处理响应出错时抛出异常
   */
  async streamChat(messages: LLMMessage[], handlers: ChatEventHandlers) {
    const { onStart, onToken, onError, onFinish } = handlers
    
    try {
      // 触发开始事件
      onStart?.()
      
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || '发送消息失败')
      }

      if (!response.body) {
        throw new Error('没有响应数据')
      }

      // 处理流式响应数据
      await this.processStream(response.body, { onToken, onError })
      
      // 触发完成事件
      onFinish?.()
    } catch (error) {
      const finalError = error instanceof Error ? error : new Error('未知错误')
      onError?.(finalError)
      throw finalError
    }
  }

  /**
   * 处理流式响应数据
   * @param body - 可读流对象
   * @param handlers - 包含 token 和 error 处理器的对象
   * @private
   */
  private async processStream(
    body: ReadableStream<Uint8Array>,
    handlers: Pick<ChatEventHandlers, 'onToken' | 'onError'>
  ) {
    const reader = body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      await this.processChunk(chunk, handlers)
    }
  }

  /**
   * 处理单个数据块
   * @param chunk - 解码后的数据块字符串
   * @param handlers - 包含 token 和 error 处理器的对象
   * @private
   */
  private async processChunk(
    chunk: string,
    handlers: Pick<ChatEventHandlers, 'onToken' | 'onError'>
  ) {
    // 按行分割数据块
    const lines = chunk.split('\n')
    
    for (const line of lines) {
      // 跳过非数据行
      if (!line.startsWith('data: ')) continue
      
      try {
        // 解析数据行（移除 'data: ' 前缀）
        const data = JSON.parse(line.slice(5))
        
        if (data.error) {
          throw new Error(data.error)
        }
        
        if (data.done) break
        
        if (data.content) {
          handlers.onToken?.(data.content)
        }
      } catch (error) {
        handlers.onError?.(error instanceof Error ? error : new Error('解析错误'))
        throw error
      }
    }
  }
} 