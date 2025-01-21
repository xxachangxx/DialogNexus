import { useState } from 'react';
import { Message } from '../types/message';

export const useChatHandlers = () => {
  // 存储聊天消息列表
  const [messages, setMessages] = useState<Message[]>([]);
  // 控制编辑模态框的显示状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 存储输入框的文本内容
  const [inputText, setInputText] = useState("");
  // 控制清空确认模态框的显示状态
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  // 打开编辑模态框
  const handleEdit = () => {
    setIsModalOpen(true);
  };

  // 提交编辑模态框的内容并关闭
  const handleModalSubmit = (text: string) => {
    setInputText(text);
    setIsModalOpen(false);
  };

  // 关闭编辑模态框
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // 确认清空所有消息
  const handleClearConfirm = () => {
    setMessages([]);
    setIsClearConfirmOpen(false);
  };

  // 取消清空操作
  const handleClearCancel = () => {
    setIsClearConfirmOpen(false);
  };

  // 触发清空确认框
  const handleClear = () => {
    if (messages.length > 0) {
      setIsClearConfirmOpen(true);
    }
  };

  // 处理输入框内容变化
  const handleInputChange = (text: string) => {
    setInputText(text);
  };

  // 发送消息
  const handleSend = () => {
    if (inputText.trim()) {
      setMessages([...messages, {
        id: Date.now().toString(),
        content: inputText,
        timestamp: new Date(),
        role: 'user'
      }]);
      setInputText("");
    }
  };

  return {
    messages,
    isModalOpen,
    inputText,
    isClearConfirmOpen,
    handleEdit,
    handleModalSubmit,
    handleModalClose,
    handleClear,
    handleClearConfirm,
    handleClearCancel,
    handleInputChange,
    handleSend
  };
};
