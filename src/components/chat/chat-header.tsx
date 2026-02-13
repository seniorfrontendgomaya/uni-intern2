"use client";

import Link from "next/link";
import { MessageCircle, Bell, MoreHorizontal, Rocket } from "lucide-react";

export interface ChatHeaderProps {
  /** Current user display name (e.g. "adi") */
  userName?: string;
  /** Active conversation/contact name (e.g. "Php Company") */
  activeChatName?: string;
  /** Link for "Go to Dashboard" */
  dashboardHref: string;
  dashboardLabel?: string;
  /** Optional avatar/icon for active chat */
  activeChatIcon?: React.ReactNode;
}

export function ChatHeader({
  userName,
  activeChatName,
  dashboardHref,
  dashboardLabel = "Go to Dashboard",
  activeChatIcon,
}: ChatHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-white px-4">
      <span className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
        {userName ?? "You"}
      </span>
      <div className="flex flex-1 items-center justify-center gap-2 min-w-0 mx-2">
        <MessageCircle className="h-5 w-5 shrink-0 text-gray-600" />
        <span className="text-sm font-semibold text-gray-900 truncate">
          {activeChatName ?? "Chat"}
        </span>
        <button
          type="button"
          className="p-1 rounded hover:bg-gray-100 text-gray-500"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={dashboardHref}
          className="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 transition"
        >
          {dashboardLabel}
        </Link>
        <button
          type="button"
          className="p-1 rounded hover:bg-gray-100 text-gray-500"
          aria-label="More options"
        >
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
