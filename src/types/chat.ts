export interface ChatContact {
  id: string;
  name: string;
  subtitle?: string;
  lastMessageAt?: string;
  avatar?: string;
  unread?: number;
  /** From API: room identifier for student (get_user_message/{roomName}) */
  roomName?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text?: string;
  attachment?: {
    url: string;
    type: "image" | "file";
    name?: string;
  };
  timestamp: string;
  isOwn: boolean;
  status?: "sent" | "delivered" | "read";
}

export interface ChatConversation {
  id: string;
  contact: ChatContact;
  messages: ChatMessage[];
}
