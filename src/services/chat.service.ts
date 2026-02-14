import type { ChatContact, ChatMessage } from "@/types/chat";

const BASE =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "https://inter.malspy.com"
    : "https://inter.malspy.com";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
}

// --- API response types ---

export interface ChatItemLastMessage {
  body?: string;
  room_name?: string;
  sent_time?: string;
  attachment?: string | { url?: string; type?: string; name?: string };
}

export interface ChatItem {
  id: number;
  name?: string;
  image?: string | null;
  room_name?: string;
  last_message?: ChatItemLastMessage | null;
  unread?: number;
}

/** Message from get_user_message/{roomName}/ (student) */
export interface MessageRoom {
  id: number;
  body?: string;
  sent_time?: string;
  created_by?: number;
  attachment?: string | { url?: string; type?: string; name?: string };
}

/** Message from get_message/{chatId}/ (company) */
export interface MessageChat {
  id: number;
  body?: string;
  sent_time?: string;
  sender?: number;
  /** Some backends use created_by instead of sender */
  created_by?: number;
  attachment?: string | { url?: string; type?: string; name?: string };
}

export interface User {
  id: number;
  name?: string;
  email?: string;
  [key: string]: unknown;
}

// --- Mappers ---

function formatMessageTime(sent_time?: string): string {
  if (!sent_time) return "";
  try {
    const d = new Date(sent_time);
    if (isNaN(d.getTime())) return sent_time;
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return sent_time;
  }
}

function attachmentFromApi(
  att?: string | { url?: string; type?: string; name?: string }
): ChatMessage["attachment"] {
  if (!att) return undefined;
  const url = typeof att === "string" ? att : att?.url ?? "";
  const name = typeof att === "object" ? att?.name : undefined;
  const type = typeof att === "object" && att?.type === "image" ? "image" : "file";
  if (!url) return undefined;
  return { url, type, name };
}

/**
 * Generate room name for new chats: room_{sortedUserId1}_{sortedUserId2}
 */
export function generateRoomName(userId1: number, userId2: number): string {
  const ids = [userId1, userId2].sort((a, b) => a - b);
  return `room_${ids[0]}_${ids[1]}`;
}

export function chatItemToContact(item: ChatItem, currentUserId?: number | null): ChatContact {
  const last = item.last_message;
  const subtitle = last?.body ?? undefined;
  const lastMessageAt = last?.sent_time ? formatMessageTime(last.sent_time) : undefined;
  const attachment = last?.attachment;
  const attachmentStr =
    typeof attachment === "string" ? attachment : attachment?.url;
  const subtitleWithAtt = attachmentStr ? (subtitle ? `${subtitle}` : "Attachment") : subtitle;
  // Priority: last_message.room_name → item.room_name → generate room_{userId1}_{userId2}
  let roomName = last?.room_name ?? item.room_name;
  if (!roomName && currentUserId != null && item.id) {
    const contactId = typeof item.id === "number" ? item.id : parseInt(String(item.id), 10);
    if (!Number.isNaN(contactId)) {
      roomName = generateRoomName(currentUserId, contactId);
    }
  }
  return {
    id: String(item.id),
    name: item.name ?? "Unknown",
    subtitle: subtitleWithAtt,
    lastMessageAt,
    avatar: item.image ?? undefined,
    unread: item.unread,
    roomName,
  };
}

function messageRoomToChat(
  m: MessageRoom,
  roomId: string,
  currentUserId: number | null
): ChatMessage {
  const senderId = m.created_by != null ? String(m.created_by) : "unknown";
  const isOwn = currentUserId != null && m.created_by === currentUserId;
  return {
    id: String(m.id),
    conversationId: roomId,
    senderId,
    text: m.body,
    attachment: attachmentFromApi(m.attachment),
    timestamp: m.sent_time ?? new Date().toISOString(),
    isOwn,
    status: isOwn ? "sent" : undefined,
  };
}

function messageChatToChat(
  m: MessageChat,
  conversationId: string,
  currentUserId: number | null
): ChatMessage {
  const sender = m.sender ?? m.created_by;
  const senderId = sender != null ? String(sender) : "unknown";
  const isOwn =
    currentUserId != null &&
    sender != null &&
    (m.sender === currentUserId || m.created_by === currentUserId);
  return {
    id: String(m.id),
    conversationId,
    senderId,
    text: m.body,
    attachment: attachmentFromApi(m.attachment),
    timestamp: m.sent_time ?? new Date().toISOString(),
    isOwn,
    status: isOwn ? "sent" : undefined,
  };
}

// --- REST ---

/** Student: list chat partners / conversations */
export async function getStudentContacts(): Promise<ChatContact[]> {
  const res = await fetch(`${BASE}/get_user_company/`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized");
    throw new Error(`Failed to load conversations: ${res.status}`);
  }
  const json = (await res.json()) as { data?: ChatItem[] };
  const list = Array.isArray(json?.data) ? json.data : [];
  const currentUserId = getCurrentUserId();
  return list.map((item) => chatItemToContact(item, currentUserId));
}

/** Company: list users (students) to message */
export async function getCompanyContacts(): Promise<ChatContact[]> {
  const res = await fetch(`${BASE}/get_company_user/`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized");
    throw new Error(`Failed to load users: ${res.status}`);
  }
  const json = (await res.json()) as { data?: ChatItem[] };
  const list = Array.isArray(json?.data) ? json.data : [];
  const currentUserId = getCurrentUserId();
  return list.map((item) => chatItemToContact(item, currentUserId));
}

/** Student: message history by room (App.jsx) */
export async function getStudentMessages(
  roomName: string,
  currentUserId: number | null
): Promise<ChatMessage[]> {
  const encoded = encodeURIComponent(roomName);
  const res = await fetch(`${BASE}/get_user_message/${encoded}/`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized");
    if (res.status === 404) return [];
    throw new Error(`Failed to load messages: ${res.status}`);
  }
  const json = (await res.json()) as { data?: MessageRoom[] };
  const list = Array.isArray(json?.data) ? json.data : [];
  const messages = list.map((m) => messageRoomToChat(m, roomName, currentUserId));
  // Sort by timestamp ascending (oldest first)
  return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

/** Company: message history by chat/recipient id (Company_Chat.jsx) */
export async function getCompanyMessages(
  chatId: string,
  currentUserId: number | null
): Promise<ChatMessage[]> {
  const res = await fetch(`${BASE}/get_message/${chatId}/`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized");
    if (res.status === 404) return [];
    throw new Error(`Failed to load messages: ${res.status}`);
  }
  const json = (await res.json()) as { data?: MessageChat[] };
  const list = Array.isArray(json?.data) ? json.data : [];
  const messages = list.map((m) => messageChatToChat(m, chatId, currentUserId));
  // Sort by timestamp ascending (oldest first)
  return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

/** Upload attachment file only (returns file URL) */
export async function uploadAttachment(file: File): Promise<string> {
  const form = new FormData();
  form.append("attachment", file);

  const res = await fetch(`${BASE}/send_message/`, {
    method: "POST",
    headers: authHeaders(),
    body: form,
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized");
    throw new Error(`Failed to upload attachment: ${res.status}`);
  }
  const json = (await res.json()) as { data?: string };
  if (!json.data) throw new Error("No file URL returned");
  return json.data;
}

/** Send message or upload attachment (legacy - prefer uploadAttachment + WebSocket) */
export async function sendMessage(params: {
  recipient: number | string;
  body?: string;
  subject?: string;
  attachment?: File;
}): Promise<{ data?: string }> {
  const form = new FormData();
  form.append("recipient", String(params.recipient));
  if (params.body != null && params.body !== "") form.append("body", params.body);
  if (params.subject != null) form.append("subject", params.subject);
  if (params.attachment) form.append("attachment", params.attachment);

  const res = await fetch(`${BASE}/send_message/`, {
    method: "POST",
    headers: authHeaders(),
    body: form,
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Unauthorized");
    throw new Error(`Failed to send message: ${res.status}`);
  }
  return (await res.json()) as { data?: string };
}

/** Get current user id (e.g. from token decode or a /me endpoint). If not available, isOwn will be false for all. */
export function getCurrentUserId(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user_id");
    if (raw == null || raw === "") return null;
    const n = parseInt(raw, 10);
    return Number.isNaN(n) ? null : n;
  } catch {
    return null;
  }
}

const WS_BASE =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_WS_URL
    ? process.env.NEXT_PUBLIC_WS_URL
    : "wss://inter.malspy.com";

/** WebSocket URL for a room: wss://inter.malspy.com/ws/chat/{roomName}/?token={token} */
export function getChatWebSocketUrl(roomName: string): string | null {
  const token = getToken();
  if (!token || typeof window === "undefined") return null;
  const encoded = encodeURIComponent(roomName);
  return `${WS_BASE}/ws/chat/${encoded}/?token=${encodeURIComponent(token)}`;
}
