"use client";

import { useState, useCallback, useEffect } from "react";
import { ChatSidebar } from "./chat-sidebar";
import { ChatWindow } from "./chat-window";
import { MessageInput } from "./message-input";
import type { ChatContact, ChatMessage } from "@/types/chat";

export interface ChatLayoutProps {
  /** Current user display name (shown in sidebar header) */
  userName?: string;
  /** Current user profile image URL (sidebar header) */
  currentUserImage?: string | null;
  /** Current user initial when no image (sidebar header + bottom avatar) */
  currentUserInitial?: string;
  /** Link and label for "Go to Dashboard" */
  dashboardHref: string;
  dashboardLabel?: string;
  /** All conversations/contacts */
  contacts: ChatContact[];
  /** Messages per conversation (key = contactId) */
  messagesByContactId: Record<string, ChatMessage[]>;
  /** Callback when user sends a message */
  onSendMessage?: (contactId: string, text: string, attachment?: File) => void;
  /** Called when user selects a contact (e.g. to load messages) */
  onSelectContact?: (contact: ChatContact) => void;
  /** Called when the active contact changes (e.g. for WebSocket subscription) */
  onActiveContactChange?: (contact: ChatContact | null) => void;
  /** Show loading state for contact list */
  loadingContacts?: boolean;
  /** Show loading state for current conversation messages */
  loadingMessages?: boolean;
  /** When provided with getMessageKey, used to show loading per conversation */
  loadingMessagesMap?: Record<string, boolean>;
  /** Key for loadingMessagesMap (student: roomName, company: id) */
  getMessageKey?: (contact: ChatContact) => string;
  /** Error message to show */
  error?: string | null;
  /** Sending a message in progress */
  sending?: boolean;
}

export function ChatLayout({
  userName,
  currentUserImage,
  dashboardHref,
  dashboardLabel,
  currentUserInitial,
  contacts,
  messagesByContactId,
  onSendMessage,
  onSelectContact,
  onActiveContactChange,
  loadingContacts = false,
  loadingMessages = false,
  loadingMessagesMap,
  getMessageKey,
  error: errorProp = null,
  sending = false,
}: ChatLayoutProps) {
  const [activeContactId, setActiveContactId] = useState<string | null>(
    contacts[0]?.id ?? null
  );
  /** On mobile: 'list' = show contact list, 'chat' = show chat room */
  const [mobilePanel, setMobilePanel] = useState<"list" | "chat">("list");

  useEffect(() => {
    if (contacts.length > 0 && (!activeContactId || !contacts.some((c) => c.id === activeContactId))) {
      setActiveContactId(contacts[0].id);
    }
  }, [contacts, activeContactId]);

  const activeContact = contacts.find((c) => c.id === activeContactId);

  useEffect(() => {
    onActiveContactChange?.(activeContact ?? null);
  }, [activeContact, onActiveContactChange]);
  const messages = activeContactId
    ? messagesByContactId[activeContactId] ?? []
    : [];

  const loadingMessagesActive =
    loadingMessages ||
    (activeContact && loadingMessagesMap && getMessageKey
      ? loadingMessagesMap[getMessageKey(activeContact)]
      : false);

  const handleSelectContact = useCallback(
    (c: ChatContact) => {
      setActiveContactId(c.id);
      setMobilePanel("chat");
      onSelectContact?.(c);
    },
    [onSelectContact]
  );

  const handleBackToList = useCallback(() => {
    setMobilePanel("list");
  }, []);

  const handleSend = useCallback(
    (text: string, attachment?: File) => {
      if (!activeContactId) return;
      onSendMessage?.(activeContactId, text, attachment);
    },
    [activeContactId, onSendMessage]
  );

  return (
    <div className="flex h-screen flex-col">
      {errorProp && (
        <div className="shrink-0 bg-red-50 px-4 py-2 text-sm text-red-700">
          {errorProp}
        </div>
      )}
      <div className="flex flex-1 min-h-0">
        {/* Left: contact list — full width on mobile when list view, fixed width on md+ */}
        <aside
          className={`flex w-full shrink-0 flex-col border-r bg-white md:w-80 ${
            mobilePanel === "chat" ? "hidden md:flex" : "flex"
          }`}
        >
          <ChatSidebar
            contacts={contacts}
            activeContactId={activeContactId}
            onSelectContact={handleSelectContact}
            currentUserName={userName}
            currentUserImage={currentUserImage}
            currentUserInitial={currentUserInitial}
            loading={loadingContacts}
            dashboardHref={dashboardHref}
            dashboardLabel={dashboardLabel}
          />
        </aside>
        {/* Right: chat room — hidden on mobile when list view; min-h-0 so input stays at bottom */}
        <div
          className={`flex min-h-0 flex-1 flex-col min-w-0 ${
            mobilePanel === "chat" ? "flex" : "hidden md:flex"
          }`}
        >
          <ChatWindow
            messages={messages}
            activeChatName={activeContact?.name}
            dashboardHref={dashboardHref}
            dashboardLabel={dashboardLabel}
            onBack={handleBackToList}
            loading={loadingMessagesActive}
          />
          <MessageInput
            onSend={handleSend}
            disabled={!activeContactId || sending}
          />
        </div>
      </div>
    </div>
  );
}
