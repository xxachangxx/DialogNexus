import { create } from 'zustand'

interface UIState {
  // 模态框状态
  isModalOpen: boolean
  isClearConfirmOpen: boolean
  inputText: string

  // 操作方法
  setIsModalOpen: (isOpen: boolean) => void
  setIsClearConfirmOpen: (isOpen: boolean) => void
  setInputText: (text: string) => void
  clearInputText: () => void
}

export const useUIStore = create<UIState>((set) => ({
  // 初始状态
  isModalOpen: false,
  isClearConfirmOpen: false,
  inputText: "",

  // 状态更新方法
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),
  setIsClearConfirmOpen: (isOpen) => set({ isClearConfirmOpen: isOpen }),
  setInputText: (text) => set({ inputText: text }),
  clearInputText: () => set({ inputText: "" })
})) 