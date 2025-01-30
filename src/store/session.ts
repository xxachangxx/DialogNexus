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
    setMessages: (id: string, messages: ClientDisplayMessage[]) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
    sessions: {
        [generateSessionId()]: {
            name: "默认话题",
            createdAt: new Date(),
            updatedAt: new Date(),
            assistantName: "默认助手",
            messages: [],
        }
    },
    currentSessionId: generateSessionId(),
    setCurrentSessionId: (id: string) => set({ currentSessionId: id }),
    setSessions: (sessions: SessionMap) => set({ sessions }),
    addSession: (session: Session) => set((state) => ({ sessions: { ...state.sessions, [generateSessionId()]: session } })),
    removeSession: (id: string) => set((state) => {
        const updatedSessions = Object.fromEntries(
            Object.entries(state.sessions).filter(([sessionId]) => sessionId !== id)
        );
        
        // 如果删除后session为空，添加默认session
        if (Object.keys(updatedSessions).length === 0) {
            const defaultSessionId = generateSessionId();
            const defaultSession = {
                name: "默认话题",
                createdAt: new Date(),
                updatedAt: new Date(),
                assistantName: "默认助手",
                messages: [],
            };
            return {
                sessions: { [defaultSessionId]: defaultSession },
                currentSessionId: defaultSessionId
            };
        }
        
        return { sessions: updatedSessions };
    }),
    setMessages: (id: string, messages: ClientDisplayMessage[]) => set((state) => ({
        sessions: {
            ...state.sessions,
            [id]: {
                ...state.sessions[id],
                messages,
            }
        }   
    })),
}))