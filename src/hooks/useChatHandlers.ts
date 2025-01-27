import { useState } from 'react'
import type { ClientDisplayMessage, LLMMessage } from '@/types/message'
import { createSystemMessage, createUserMessage, createAssistantMessage } from './chatUtils'
import { StreamingChatClient } from '@/services/StreamingChatClient'

// 生成唯一ID的辅助函数
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// 创建单个客户端实例
const chatClient = new StreamingChatClient()

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
    const tempAssistantMessage: ClientDisplayMessage = createAssistantMessage("")

    try {
      setIsLoading(true)
      
      // 添加用户消息
      const userNewMessage: ClientDisplayMessage = createUserMessage(content)
      setMessages(prev => [...prev, userNewMessage])

      // 添加临时的assistant消息, 用于流式更新并实时渲染一个新气泡
      setMessages(prev => [...prev, tempAssistantMessage])

      // 提取messages中的role和content，形成一个新的LLMMessage数组
      const llmMessages = messages.map(({ role, content }) => ({ role, content })) as LLMMessage[];
      llmMessages.push({ role: userNewMessage.role, content: userNewMessage.content });

      console.log('准备发送的消息列表:', JSON.stringify(llmMessages, null, 2));
      
      // 使用共享的chatClient实例处理流式响应
      await chatClient.streamChat(llmMessages, {
        onStart: () => {
          console.log('开始处理流式响应');
        },
        onToken: (token) => {
          console.log('收到token:', token);
          // 更新临时消息的内容
          setMessages(prev => {
            const latestMessages = [...prev];
            const messageIndex = latestMessages.findIndex(msg => msg.id === tempAssistantMessage.id);
            
            if (messageIndex !== -1) {
              latestMessages[messageIndex] = {
                ...latestMessages[messageIndex],
                content: latestMessages[messageIndex].content + token
              };
            }
            
            return latestMessages;
          });
        },
        onError: (error) => {
          console.error('流式处理错误:', error);
          // 添加错误消息到聊天记录
          const errorMessage: ClientDisplayMessage = createSystemMessage(error.message)
          setMessages(prev => prev.map(msg => 
            msg.id === tempAssistantMessage.id ? errorMessage : msg
          ));
        },
        onFinish: () => {
          console.log('流式响应处理完成');
        }
      });

    } catch (error) {
      console.error('发送消息错误:', error);
      // 添加错误消息到聊天记录
      const errorMessage: ClientDisplayMessage = createSystemMessage(error instanceof Error ? error.message : '发送消息时发生错误')
      setMessages(prev => prev.map(msg => 
        msg.id === tempAssistantMessage.id ? errorMessage : msg
      ));
    } finally {
      setIsLoading(false);
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
    const initialMessages = createSystemMessage("You are a helpful assistant.")
    setMessages([initialMessages])
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