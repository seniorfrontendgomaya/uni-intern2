"use client";

import { useState, useCallback, useEffect } from "react";
import type { ChatContact, ChatMessage } from "@/types/chat";
import {
  getStudentContacts,
  getCompanyContacts,
  getStudentMessages,
  sendMessage as sendMessageApi,
  getCurrentUserId,
} from "@/services/chat.service";

export type ChatRole = "student" | "company";

export function useChatApi(role: ChatRole) {
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const [messagesByKey, setMessagesByKey] = useState<Record<string, ChatMessage[]>>({});
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const currentUserId = getCurrentUserId();

  const fetchContacts = useCallback(async () => {
    setLoadingContacts(true);
    setError(null);
    try {
      const list =
        role === "student" ? await getStudentContacts() : await getCompanyContacts();
      setContacts(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load conversations");
      setContacts([]);
    } finally {
      setLoadingContacts(false);
    }
  }, [role]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  /** Message list key: roomName when available (student & company), else contact.id */
  function getMessageKey(contact: ChatContact): string {
    if (contact.roomName) return contact.roomName;
    return contact.id;
  }

  const loadMessagesForContact = useCallback(
    async (contact: ChatContact) => {
      const key = getMessageKey(contact);
      setLoadingMessages((prev) => ({ ...prev, [key]: true }));
      try {
        const roomName = contact.roomName;
        if (roomName) {
          // Same endpoint for both: get_user_message/{roomName}/
          const list = await getStudentMessages(roomName, currentUserId);
          setMessagesByKey((prev) => ({ ...prev, [key]: list }));
        } else {
          setMessagesByKey((prev) => ({ ...prev, [key]: [] }));
        }
      } catch (e) {
        setMessagesByKey((prev) => ({ ...prev, [key]: [] }));
      } finally {
        setLoadingMessages((prev) => ({ ...prev, [key]: false }));
      }
    },
    [currentUserId]
  );

  /** Get messages for the active contact (keyed by contact id for UI, using roomName for student) */
  const getMessagesForContact = useCallback(
    (contact: ChatContact | null): ChatMessage[] => {
      if (!contact) return [];
      const key = getMessageKey(contact);
      return messagesByKey[key] ?? [];
    },
    [messagesByKey, role]
  );

  const sendMessage = useCallback(
    async (contact: ChatContact, text: string, attachment?: File): Promise<boolean> => {
      setSending(true);
      setError(null);
      try {
        const recipientId = parseInt(contact.id, 10);
        if (Number.isNaN(recipientId)) {
          setError("Invalid recipient");
          return false;
        }
        await sendMessageApi({
          recipient: recipientId,
          body: text || undefined,
          attachment,
        });
        const key = getMessageKey(contact);
        const newMsg: ChatMessage = {
          id: `temp-${Date.now()}`,
          conversationId: contact.id,
          senderId: String(currentUserId ?? "me"),
          text,
          timestamp: new Date().toISOString(),
          isOwn: true,
          status: "sent",
        };
        if (attachment) {
          newMsg.attachment = {
            url: URL.createObjectURL(attachment),
            type: attachment.type.startsWith("image/") ? "image" : "file",
            name: attachment.name,
          };
        }
        setMessagesByKey((prev) => ({
          ...prev,
          [key]: [...(prev[key] ?? []), newMsg],
        }));
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to send");
        return false;
      } finally {
        setSending(false);
      }
    },
    [role, currentUserId]
  );

  /** Push an incoming message (e.g. from WebSocket) into the right conversation, maintaining sorted order */
  const addIncomingMessage = useCallback((conversationKey: string, message: ChatMessage) => {
    setMessagesByKey((prev) => {
      const existing = prev[conversationKey] ?? [];
      const combined = [...existing, message];
      // Sort by timestamp ascending (oldest first)
      combined.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      return {
        ...prev,
        [conversationKey]: combined,
      };
    });
  }, []);

  /** Refetch messages for one conversation (e.g. after WebSocket or pull-to-refresh) */
  const refreshMessages = useCallback(
    async (contact: ChatContact) => {
      const roomName = contact.roomName;
      if (!roomName) return;
      const key = getMessageKey(contact);
      setLoadingMessages((prev) => ({ ...prev, [key]: true }));
      try {
        const list = await getStudentMessages(roomName, currentUserId);
        setMessagesByKey((prev) => ({ ...prev, [key]: list }));
      } finally {
        setLoadingMessages((prev) => ({ ...prev, [key]: false }));
      }
    },
    [currentUserId]
  );

  /** Expose messages keyed by contact id for layout (layout uses contact.id for activeContactId) */
  const messagesByContactId = (() => {
    const out: Record<string, ChatMessage[]> = {};
    for (const c of contacts) {
      const key = getMessageKey(c);
      out[c.id] = messagesByKey[key] ?? [];
    }
    return out;
  })();

  return {
    contacts,
    messagesByContactId,
    loadingContacts,
    loadingMessages,
    error,
    sending,
    fetchContacts,
    loadMessagesForContact,
    getMessagesForContact,
    sendMessage,
    refreshMessages,
    addIncomingMessage,
    getMessageKey,
  };
}
