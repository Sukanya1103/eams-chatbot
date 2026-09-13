// types/chat.ts

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface AskChatbotRequest {
  query: string;
}

export interface AskChatbotResponse {
  answer: string;
}