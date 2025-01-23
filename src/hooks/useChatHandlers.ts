import { useState } from 'react'
import type { ClientDisplayMessage, LLMMessage } from '@/types/message'

// 生成唯一ID的辅助函数
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export function useChatHandlers() {
  // 聊天核心状态
  const [systemPrompt, setSystemPrompt] = useState<string>("You are a helpful assistant.")
  const [messages, setMessages] = useState<ClientDisplayMessage[]>([
    {id: generateId(), content: systemPrompt, role: "system", createdAt: new Date()}
  ])
  const [isLoading, setIsLoading] = useState(false)

  // UI 状态
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputText, setInputText] = useState("")
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false)

  // 消息处理
  const sendMessage = async (content: string) => {
    // 创建一个临时的 assistant 消息用于流式更新
    const tempAssistantMessage: ClientDisplayMessage = {
      id: generateId(),
      content: '',
      role: 'assistant',
      createdAt: new Date()
    }

    try {
      setIsLoading(true)
      
      // 添加用户消息
      const userMessage: ClientDisplayMessage = {
        id: generateId(),
        content,
        role: 'user',
        createdAt: new Date()
      }
      setMessages(prev => [...prev, userMessage])
      setMessages(prev => [...prev, tempAssistantMessage])

      // 提取messages中的role和content，形成一个新的LLMMessage数组
      const llmMessages: LLMMessage[] = [
        ...messages.map(message => ({
          role: message.role,
          content: message.content
        })),
        {
          role: userMessage.role,
          content: userMessage.content
        }
      ]

      console.log('准备发送的消息列表:', JSON.stringify(llmMessages, null, 2));
      console.log('发送消息到API');
      
      // 发送到API并处理流式响应
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: llmMessages }),
      })

      console.log('API响应状态:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API错误详情:', errorData);
        throw new Error(errorData.details || '发送消息失败')
      }

      if (!response.body) {
        throw new Error('没有响应数据')
      }

      console.log('开始处理流式响应');
      
      // 读取流式响应
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';
      let chunkCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('流式响应结束，总共接收chunks:', chunkCount);
          break;
        }

        // 解码收到的数据
        const chunk = decoder.decode(value);
        console.log('收到原始chunk数据:', chunk);
        const lines = chunk.split('\n');
        
        // 处理每一行数据
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(5));
              
              // 检查是否有错误
              if (data.error) {
                console.error('收到错误信息:', data.error);
                throw new Error(data.error);
              }
              
              // 检查是否是结束信号
              if (data.done) {
                console.log('收到流式响应结束信号');
                break;
              }
              
              if (data.content) {
                accumulatedContent += data.content;
                chunkCount++;
                
                console.log(`处理第 ${chunkCount} 个chunk:`, data.content);
                
                // 更新临时消息的内容
                setMessages(prev => prev.map(msg => 
                  msg.id === tempAssistantMessage.id
                    ? { ...msg, content: accumulatedContent }
                    : msg
                ));
              }
            } catch (e) {
              console.error('解析流式数据错误:', e, '原始数据:', line);
              throw e; // 重新抛出错误以触发错误处理
            }
          }
        }
      }

      console.log('流式响应处理完成');

    } catch (error) {
      console.error('发送消息错误:', error);
      // 添加错误消息到聊天记录
      const errorMessage: ClientDisplayMessage = {
        id: generateId(),
        content: error instanceof Error ? error.message : '发送消息时发生错误',
        role: 'system',
        createdAt: new Date()
      }
      setMessages(prev => prev.map(msg => 
        msg.id === tempAssistantMessage.id ? errorMessage : msg
      ));
    } finally {
      setIsLoading(false); // 确保在所有情况下都重置加载状态
    }
  }

  // 发送消息并清空输入
  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText)
      setInputText('') 
    }
  }

  // UI 处理函数
  const handleInputChange = (text: string) => {
    setInputText(text)
  }

  const handleSystemPromptChange = (text: string) => {
    setSystemPrompt(text)
  }

  const handleEdit = () => {
    setIsModalOpen(true)
  }

  const handleModalSubmit = (text: string) => {
    setInputText(text)
    setIsModalOpen(false)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleClearConfirmOpen = () => {
    setIsClearConfirmOpen(true)
  }

  const handleClearConfirm = () => {
    setMessages([])
    setIsClearConfirmOpen(false)
  }

  const handleClearCancel = () => {
    setIsClearConfirmOpen(false)
  }

  return {
    // 状态
    messages,
    systemPrompt,
    isLoading,
    inputText,
    isModalOpen,
    isClearConfirmOpen,

    // 方法
    handleSend,
    handleInputChange,
    handleSystemPromptChange,
    handleEdit,
    handleModalSubmit,
    handleModalClose,
    handleClearConfirmOpen,
    handleClearConfirm,
    handleClearCancel,
  }
} 