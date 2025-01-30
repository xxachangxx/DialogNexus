import { create } from "zustand";
import type { ClientDisplayMessage } from "@/types/message";
import { generateMsgId, createSystemMessage } from "@/hooks/chatUtils";

interface ChatState {
  // 核心状态
  clientDisplayMessages: ClientDisplayMessage[];
  systemPrompt: string;
  isLoading: boolean;

  // 操作方法
  setMessages: (clientDisplayMessages: ClientDisplayMessage[]) => void;
  addMessage: (message: ClientDisplayMessage) => void;
  appendToLastMessage: (content: string) => void;
  setSystemPrompt: (prompt: string) => void;
  setIsLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  // 初始状态
  clientDisplayMessages: [
    {
      id: generateMsgId(),
      content: "You are a helpful assistant.",
      role: "system",
      createdAt: new Date(),
    },
  ],
  systemPrompt: "You are a helpful assistant.",
  isLoading: false,

  // 状态更新方法
  setMessages: (clientDisplayMessages) => set({ clientDisplayMessages }),
  addMessage: (message) =>
    set((state) => ({
      clientDisplayMessages: [...state.clientDisplayMessages, message],
    })),
  appendToLastMessage: (content) =>
    set((state) => {
      if (state.clientDisplayMessages.length === 0) return { clientDisplayMessages: state.clientDisplayMessages };

      return {
        clientDisplayMessages: [
          ...state.clientDisplayMessages.slice(0, -1), // 保留除最后一个消息外的元素
          {
            ...state.clientDisplayMessages[state.clientDisplayMessages.length - 1],
            content:
              state.clientDisplayMessages[state.clientDisplayMessages.length - 1].content + content,
          },
        ],
      };
    }),
  setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  clearMessages: () =>
    set((state) => ({
      clientDisplayMessages: [createSystemMessage(state.systemPrompt)],
    })),
}));
