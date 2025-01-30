import { create } from "zustand";
import { Session, SessionMap } from "@/types/session";
import { generateSessionId } from "@/hooks/chatUtils";
import { ClientDisplayMessage } from "@/types/message";

interface SessionState {
  // 核心状态
  sessions: SessionMap;
  currentSessionId: string;
  // 操作方法
  setCurrentSessionId: (id: string) => void;
  addSession: (session: Session) => void;
  removeSession: (id: string) => void;
  setSessionMessages: (id: string, messages: ClientDisplayMessage[]) => void;
}

const DEFAULT_SESSION = {
  name: "默认话题",
  createdAt: new Date(),
  updatedAt: new Date(),
  assistantName: "默认助手",
  messages: [],
};

export const useSessionStore = create<SessionState>((set) => {
  const defaultSessionId = generateSessionId();
  const initialSessions = new Map([[defaultSessionId, DEFAULT_SESSION]]);

  return {
    // 初始状态
    sessions: initialSessions,
    currentSessionId: defaultSessionId,
    // 状态更新方法
    setCurrentSessionId: (id: string) => set({ currentSessionId: id }),
    addSession: (session: Session) =>
      set((state) => ({
        sessions: new Map(state.sessions).set(generateSessionId(), session),
      })),

    removeSession: (id: string) =>
      set((state) => {
        const newSessions = new Map(state.sessions);
        // 获取删除前的会话ID列表，可以据此计算next or prev session id
        const sessionIds = Array.from(newSessions.keys());
        const currentSessionIdx = sessionIds.indexOf(id);
        newSessions.delete(id);

        if (newSessions.size === 0) {
          const defaultSessionId = generateSessionId();
          newSessions.set(defaultSessionId, DEFAULT_SESSION);
          return {
            sessions: newSessions,
            currentSessionId: defaultSessionId,
          };
        }

        // 如果删除后，当前会话是最后一个，则切换到上一个会话, 否则切换到下一个会话
        const nextSessionId =
          sessionIds[currentSessionIdx + 1] ??
          sessionIds[currentSessionIdx - 1] ??
          sessionIds[0]; // 终极 fallback

        return {
          sessions: newSessions,
          currentSessionId: nextSessionId,
        };
      }),

    setSessionMessages: (id: string, messages: ClientDisplayMessage[]) =>
      set((state) => {
        const newSessions = new Map(state.sessions);
        const session = newSessions.get(id);
        if (session) {
          newSessions.set(id, {
            ...session,
            messages,
          });
        }
        return { sessions: newSessions };
      }),
  };
});
