'use client';

import ChatBox from "@/components/ChatBox";
import InputArea from "@/components/InputArea";
import EditModal from "@/components/EditModal";
import ConfirmModal from "@/components/ConfirmModal";
import { useChatHandlers } from '@/hooks/useChatHandlers';

export default function Home() {
  const {
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
  } = useChatHandlers();

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
      <div className="chat-container">
        <ChatBox messages={messages} />
        <InputArea 
          value={inputText}
          onChange={handleInputChange}
          onEdit={handleEdit}
          onClear={handleClear}
          onSend={handleSend}
        />
      </div>
      <EditModal 
        isOpen={isModalOpen}
        onSubmit={handleModalSubmit}
        onClose={handleModalClose}
        initialText={inputText}
      />
      <ConfirmModal 
        isOpen={isClearConfirmOpen}
        title="确认清除"
        message="您确定要清除所有消息吗？"
        onConfirm={handleClearConfirm}
        onCancel={handleClearCancel}
      />
    </div>
  );
}