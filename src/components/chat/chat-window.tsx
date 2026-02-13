"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { Rocket, ArrowLeft } from "lucide-react";
import { MessageBubble } from "./message-bubble";
import type { ChatMessage } from "@/types/chat";

export interface ChatWindowProps {
  messages: ChatMessage[];
  activeChatName?: string;
  activeChatIcon?: React.ReactNode;
  dashboardHref: string;
  dashboardLabel?: string;
  /** Called when user taps back on mobile to return to contact list */
  onBack?: () => void;
  loading?: boolean;
}

export function ChatWindow({
  messages,
  activeChatName,
  activeChatIcon,
  dashboardHref,
  dashboardLabel = "Go to Dashboard",
  onBack,
  loading = false,
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col bg-[#e5ddd5] min-h-0">
      {/* Conversation header strip (lower header) */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-gray-200 bg-white/95 px-4 py-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="md:hidden flex shrink-0 items-center justify-center rounded-full p-2 text-gray-600 hover:bg-gray-100"
              aria-label="Back to chat list"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-300 text-gray-600">
            {activeChatIcon ?? <Rocket className="h-5 w-5" />}
          </div>
          <span className="truncate text-sm font-semibold text-gray-900">
            {activeChatName ?? "Chat"}
          </span>
        </div>
        <Link
          href={dashboardHref}
          className="shrink-0 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 transition"
        >
          {dashboardLabel}
        </Link>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-0"
      >
        {loading ? (
          <div className="flex flex-col gap-3 py-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-12 max-w-[85%] animate-pulse rounded-2xl ${
                  i % 2 === 0 ? "ml-0 bg-gray-200" : "ml-auto mr-0 bg-green-100"
                }`}
              />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-gray-500 py-8">
            No messages yet. Start the conversation.
          </p>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
      </div>
    </div>
  );
}
