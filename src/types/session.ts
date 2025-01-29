import { ClientDisplayMessage } from "./message";
export interface Session {
    name: string;
    assistantName: string;
    createdAt: Date;
    updatedAt: Date;
    messages: ClientDisplayMessage[];
}

export type SessionMap = Record<string, Session>;