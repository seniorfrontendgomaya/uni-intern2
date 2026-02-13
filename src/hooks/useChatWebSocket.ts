"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { ChatMessage } from "@/types/chat";
import { getChatWebSocketUrl } from "@/services/chat.service";
import { getCurrentUserId } from "@/services/chat.service";

/** Incoming WS payload from server */
interface WsChatPayload {
  type?: "message" | "chat_message" | "attachment";
  room_name?: string;
  id?: number;
  message?: string;
  sent_time?: string;
  created_by?: number;
  sender_id?: number;
  attachment?: string | { url?: string; type?: string; name?: string };
}

function payloadToChatMessage(
  payload: WsChatPayload,
  conversationId: string
): ChatMessage {
  const currentUserId = getCurrentUserId();
  const senderId = payload.created_by ?? payload.sender_id;
  const isOwn =
    currentUserId != null &&
    (payload.created_by === currentUserId || payload.sender_id === currentUserId);
  
  // Body can be an image URL directly (attachment is null)
  const messageBody = payload.message ?? "";
  const hasAttachment = payload.attachment != null;
  
  // If attachment exists, use it; otherwise body might be a file URL
  const attachment =
    typeof payload.attachment === "string"
      ? { url: payload.attachment, type: "file" as const, name: undefined }
      : payload.attachment?.url
        ? {
            url: payload.attachment.url,
            type: (payload.attachment.type === "image" ? "image" : "file") as "image" | "file",
            name: payload.attachment.name,
          }
        : undefined;

  return {
    id: payload.id != null ? String(payload.id) : `ws-${Date.now()}`,
    conversationId,
    senderId: senderId != null ? String(senderId) : "unknown",
    text: messageBody || undefined,
    attachment,
    timestamp: payload.sent_time ?? new Date().toISOString(),
    isOwn,
    status: isOwn ? "sent" : undefined,
  };
}

/**
 * Subscribe to real-time messages for a room and provide send function.
 * Returns WebSocket send function and connection status.
 */
export function useChatWebSocket(
  roomName: string | null,
  conversationId: string,
  onMessage: (message: ChatMessage) => void
) {
  const onMessageRef = useRef(onMessage);
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);

  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!roomName || typeof window === "undefined") {
      wsRef.current?.close();
      wsRef.current = null;
      setConnected(false);
      return;
    }
    const url = getChatWebSocketUrl(roomName);
    if (!url) return;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
    };

    ws.onclose = (event) => {
      setConnected(false);
      // Handle error codes if needed
      if (event.code === 1006) {
        // Network error
      } else if (event.code === 1011) {
        // Server error
      } else if (event.code === 1009) {
        // Message too large
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string) as WsChatPayload;
        if (data.type === "message" || data.type === "chat_message" || data.type === "attachment") {
          // Only process if room_name matches (or is missing)
          if (!data.room_name || data.room_name === roomName) {
            const msg = payloadToChatMessage(data, conversationId);
            onMessageRef.current(msg);
          }
        }
      } catch {
        // ignore parse errors
      }
    };

    ws.onerror = () => {
      setConnected(false);
    };

    return () => {
      ws.close();
      wsRef.current = null;
      setConnected(false);
    };
  }, [roomName, conversationId]);

  const send = useCallback(
    (message: string, recipientId: number) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        throw new Error("WebSocket not connected");
      }
      wsRef.current.send(
        JSON.stringify({
          type: "message",
          message,
          recipient_id: recipientId,
        })
      );
    },
    []
  );

  return { send, connected };
}
