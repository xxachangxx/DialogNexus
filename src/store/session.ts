import { create } from "zustand";
import { Session, SessionMap } from "@/types/session";
import { generateSessionId } from "@/hooks/chatUtils";
import { ClientDisplayMessage } from "@/types/message";
 
interface SessionState {
    sessions: SessionMap;
    currentSessionId: string;
    setCurrentSessionId: (id: string) => void;
    addSession: (session: Session) => void;
    removeSession: (id: string) => void;
    setSessionMessages: (id: string, messages: ClientDisplayMessage[]) => void;
}

export const useSessionStore = create<SessionState>((set) => {
    const defaultSessionId = generateSessionId();
    const initialSessions = new Map([[defaultSessionId, {
        name: "默认话题",
        createdAt: new Date(),
        updatedAt: new Date(),
        assistantName: "默认助手",
        messages: [],
    }]]);

    return {
        sessions: initialSessions,
        currentSessionId: defaultSessionId,
        setCurrentSessionId: (id: string) => set({ currentSessionId: id }),
        addSession: (session: Session) => set((state) => {
            const newSessions = new Map(state.sessions);
            newSessions.set(generateSessionId(), session);
            return { sessions: newSessions };
        }),
        removeSession: (id: string) => set((state) => {
            const newSessions = new Map(state.sessions);
            newSessions.delete(id);
            
            // 如果删除后session为空，添加默认session
            if (newSessions.size === 0) {
                const defaultSessionId = generateSessionId();
                const defaultSession = {
                    name: "默认话题",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    assistantName: "默认助手",
                    messages: [],
                };
                newSessions.set(defaultSessionId, defaultSession);
                return {
                    sessions: newSessions,
                    currentSessionId: defaultSessionId
                };
            }
            
            return { sessions: newSessions };
        }),
        setSessionMessages: (id: string, messages: ClientDisplayMessage[]) => set((state) => {
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