export interface Message {
    id: string;
    content: string;
    timestamp: Date;
    role: 'user' | 'assistant';
  } 