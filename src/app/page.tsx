"use client";

import ChatBox from "@/components/ChatBox";
import InputArea from "@/components/InputArea";
import EditModal from "@/components/EditModal";
import ConfirmModal from "@/components/ConfirmModal";
import SideBar from "@/components/Sidebar";
import { useChatHandlers } from "@/hooks/useChatHandlers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  const {
    messages,
    isLoading,
    inputText,
    isModalOpen,
    isClearConfirmOpen,
    handleSend,
    handleInputChange,
    handleEdit,
    handleModalSubmit,
    handleModalClose,
    handleClearConfirmOpen,
    handleClearConfirm,
    handleClearCancel,
  } = useChatHandlers();

  return (
    <main className="w-screen h-screen flex">
      <SidebarProvider>
        <SideBar />
        <SidebarInset>
          <section className="flex-1 h-full bg-gray-50 p-6">
            <div
              className="h-full 
                    w-full 
                    border 
                    border-gray-200 
                    rounded-lg 
                    bg-white 
                    flex 
                    flex-col 
                    justify-between
                    shadow-sm
                    overflow-hidden"
            >
              <ChatBox messages={messages} />
              <InputArea
                value={inputText}
                onChange={handleInputChange}
                onEdit={handleEdit}
                onClear={handleClearConfirmOpen}
                onSend={handleSend}
                disabled={isLoading}
              />
            </div>
          </section>
        </SidebarInset>
      </SidebarProvider>
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
    </main>
  );
}
