"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatLayout } from "@/components/chat";
import { useChatApi } from "@/hooks/useChatApi";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";
import { uploadAttachment } from "@/services/chat.service";
import type { ChatContact, ChatMessage } from "@/types/chat";

export default function CompanyChatPage() {
  const router = useRouter();
  const [activeContact, setActiveContact] = useState<ChatContact | null>(null);
  const {
    contacts,
    messagesByContactId,
    loadingContacts,
    loadingMessages,
    error,
    sending,
    loadMessagesForContact,
    sendMessage,
    getMessageKey,
    addIncomingMessage,
  } = useChatApi("company");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
      router.replace("/login");
      return;
    }
    if (role !== "COMPANY") {
      router.replace("/");
    }
  }, [router]);

  useEffect(() => {
    if (contacts.length > 0) {
      loadMessagesForContact(contacts[0]);
    }
  }, [contacts, loadMessagesForContact]);

  const onSelectContact = useCallback(
    (contact: { id: string; roomName?: string }) => {
      loadMessagesForContact(contact);
    },
    [loadMessagesForContact]
  );

  const handleIncomingMessage = useCallback(
    (msg: ChatMessage) => {
      if (activeContact) {
        const key = getMessageKey(activeContact);
        addIncomingMessage(key, msg);
      }
    },
    [activeContact, getMessageKey, addIncomingMessage]
  );

  const { send: wsSend, connected: wsConnected } = useChatWebSocket(
    activeContact?.roomName ?? null,
    activeContact?.id ?? "",
    handleIncomingMessage
  );

  const onSendMessage = useCallback(
    async (contactId: string, text: string, attachment?: File) => {
      const contact = contacts.find((c) => c.id === contactId);
      if (!contact) return;

      const recipientId = parseInt(contact.id, 10);
      if (Number.isNaN(recipientId)) return;

      try {
        if (attachment) {
          // File: upload via REST, then send URL via WebSocket
          const fileUrl = await uploadAttachment(attachment);
          if (wsConnected && wsSend) {
            wsSend(fileUrl, recipientId);
          } else {
            // Fallback to REST if WebSocket not connected
            await sendMessage(contact, "", attachment);
          }
        } else if (text.trim()) {
          // Text: send via WebSocket
          if (wsConnected && wsSend) {
            wsSend(text.trim(), recipientId);
          } else {
            // Fallback to REST if WebSocket not connected
            await sendMessage(contact, text);
          }
        }
      } catch (e) {
        ("Failed to send message:", e);
      }
    },
    [contacts, wsSend, wsConnected, sendMessage]
  );

  return (
    <ChatLayout
      userName="Company"
      currentUserImage={null}
      dashboardHref="/company"
      dashboardLabel="Go to Dashboard"
      currentUserInitial="C"
      contacts={contacts}
      messagesByContactId={messagesByContactId}
      onSendMessage={onSendMessage}
      onSelectContact={onSelectContact}
      onActiveContactChange={setActiveContact}
      loadingContacts={loadingContacts}
      loadingMessagesMap={loadingMessages}
      getMessageKey={getMessageKey}
      error={error}
      sending={sending}
    />
  );
}
