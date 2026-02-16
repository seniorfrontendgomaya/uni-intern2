"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatLayout } from "@/components/chat";
import { useChatApi } from "@/hooks/useChatApi";
import { useChatWebSocket } from "@/hooks/useChatWebSocket";
import { uploadAttachment } from "@/services/chat.service";
import type { ChatContact, ChatMessage } from "@/types/chat";

export default function StudentChatPage() {
  const router = useRouter();
  const [activeContact, setActiveContact] = useState<ChatContact | null>(null);
  const [userName, setUserName] = useState<string>("Student");
  const [userImage, setUserImage] = useState<string | null>(null);

  useEffect(() => {
    const name = typeof window !== "undefined" ? localStorage.getItem("user_name") : null;
    const image = typeof window !== "undefined" ? localStorage.getItem("user_image") : null;
    if (name) setUserName(name);
    if (image) setUserImage(image);
  }, []);

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
  } = useChatApi("student");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.replace("/login");
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
        // console.error("Failed to send message:", e);
      }
    },
    [contacts, wsSend, wsConnected, sendMessage]
  );

  return (
    <ChatLayout
      userName={userName}
      currentUserImage={userImage}
      dashboardHref="/student"
      dashboardLabel="Go to Dashboard"
      currentUserInitial={userName.charAt(0)}
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
