
import type { LLMMessage } from '@/types/message'
import { createUserMessage, createAssistantMessage } from './chatUtils'
import { StreamingChatClient } from '@/services/StreamingChatClient'
import { useUIStore } from '@/store/ui'
import { useChatStore } from '@/store/chat'
import { useSessionStore } from '@/store/session'

// 创建单个客户端实例
const chatClient = new StreamingChatClient()

export function useChatHandlers() {
  // 从zustand获取状态和方法
  const { 
    messages,
    systemPrompt,
    isLoading,
    setIsLoading,
    addMessage,
    appendToLastMessage,
    setSystemPrompt,
    clearMessages
  } = useChatStore()

  const { 
    inputText, 
    isModalOpen, 
    isClearConfirmOpen,
    setInputText,
    setIsModalOpen,
    setIsClearConfirmOpen,
    clearInputText
  } = useUIStore()

  const {
    sessions,
    currentSessionId,
    setCurrentSessionId,
    addSession,
    setMessages,
    removeSession,
  } = useSessionStore()

  // 消息处理
  const sendMessage = async (content: string) => {
    // 创建一个临时的 assistant 消息用于流式更新
    const tempAssistantMessage = createAssistantMessage("")
    
    setIsLoading(true)
    
    // 添加用户消息
    const userNewMessage = createUserMessage(content)
    addMessage(userNewMessage)

    // 添加临时的assistant消息
    addMessage(tempAssistantMessage)

    // 提取messages中的role和content
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
        appendToLastMessage(token);
      },
      onError: (error) => {
        console.error('流式处理错误:', error);
        // 在错误情况下，我们需要替换整个消息内容
        const errorMessage = createAssistantMessage(error.message);
        addMessage(errorMessage);
      },
      onFinish: () => {
        console.log('流式响应处理完成');
        setIsLoading(false);
      }
    });
  }

  // 发送消息并清空输入
  const handleSend = () => {
    if (inputText.trim()) {
      sendMessage(inputText)
      clearInputText()
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
    clearMessages()
    setIsClearConfirmOpen(false)
  }

  const handleClearCancel = () => {
    setIsClearConfirmOpen(false)
  }

  // Session 处理函数
  const handleSessionClick = (id: string) => {
    const session = sessions[id]
    setMessages(id, session.messages)
    setCurrentSessionId(id)
  }

  const handleAddSession = () => {
    addSession({
      name: "新话题",
      assistantName: "新助手",
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: [],
    })
  }
  
  const handleRemoveSession = (id: string) => {
    removeSession(id)
  }



  return {
    // 状态
    messages,
    sessions,
    currentSessionId, 
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
    handleSessionClick,
    handleAddSession,
    handleRemoveSession,
  }
} 