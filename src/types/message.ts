export type Role = 'user' | 'assistant' | 'system'

export interface ClientDisplayMessage {
    id?: string;
    content: string;
    createdAt?: Date;
    role: Role;
}

export interface LLMMessage {
    role: Role;
    content: string;
}

export interface ChatRequest {
    message: LLMMessage;
}

export interface ChatResponse {
    content: string;
    role: Role;
    error?: string;
} 