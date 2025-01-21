import { useState } from 'react'
import type { Message } from '@/types/message'

// 生成唯一ID的辅助函数
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export function useChatHandlers() {
  // 聊天核心状态
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // UI 状态
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputText, setInputText] = useState("")
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false)

  // 消息处理
  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true)
      
      // 添加用户消息
      const userMessage: Message = {
        id: generateId(),
        content,
        role: 'user',
        createdAt: new Date()
      }
      setMessages(prev => [...prev, userMessage])

      // 发送到API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '发送消息失败')
      }

      if (!data.content || !data.role) {
        throw new Error('API 响应格式错误')
      }

      // 添加助手回复
      const assistantMessage: Message = {
        id: generateId(),
        content: data.content,
        role: data.role,
        createdAt: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])

    } catch (error) {
      console.error('发送消息错误:', error)
      // 添加错误消息到聊天记录
      const errorMessage: Message = {
        id: generateId(),
        content: error instanceof Error ? error.message : '发送消息时发生错误',
        role: 'system',
        createdAt: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // 发送消息并清空输入
  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText)
      setInputText('') // 直接在这里清空输入，不需要通过额外的函数调用
    }
  }

  // UI 处理函数
  const handleInputChange = (text: string) => {
    setInputText(text)
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
    isLoading,
    inputText,
    isModalOpen,
    isClearConfirmOpen,

    // 方法
    handleSend,
    handleInputChange,
    handleEdit,
    handleModalSubmit,
    handleModalClose,
    handleClearConfirmOpen,
    handleClearConfirm,
    handleClearCancel,
  }
} 