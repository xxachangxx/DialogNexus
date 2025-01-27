import { LLMMessage } from '@/types/message'

interface ChatEventHandlers {
  onStart?: () => void
  onToken?: (token: string) => void
  onError?: (error: Error) => void
  onFinish?: () => void
}

export class StreamingChatClient {
  private readonly apiEndpoint: string
  
  constructor(apiEndpoint: string = '/api/chat') {
    this.apiEndpoint = apiEndpoint
  }

  async streamChat(messages: LLMMessage[], handlers: ChatEventHandlers) {
    const { onStart, onToken, onError, onFinish } = handlers
    
    try {
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

      await this.processStream(response.body, { onToken, onError })
      
      onFinish?.()
    } catch (error) {
      const finalError = error instanceof Error ? error : new Error('未知错误')
      onError?.(finalError)
      throw finalError
    }
  }

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

  private async processChunk(
    chunk: string,
    handlers: Pick<ChatEventHandlers, 'onToken' | 'onError'>
  ) {
    const lines = chunk.split('\n')
    
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      
      try {
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