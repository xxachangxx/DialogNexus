export type Role = 'user' | 'assistant' | 'system'

export interface Message {
    id?: string;
    content: string;
    createdAt?: Date;
    role: Role;
}

export interface ChatRequest {
    message: string;
}

export interface ChatResponse {
    content: string;
    role: Role;
    error?: string;
} 