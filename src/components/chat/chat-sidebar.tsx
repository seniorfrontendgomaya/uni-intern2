"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";
import { ContactListItem } from "./contact-list-item";
import type { ChatContact } from "@/types/chat";

export interface ChatSidebarProps {
  contacts: ChatContact[];
  activeContactId: string | null;
  onSelectContact: (contact: ChatContact) => void;
  /** Top header: current user display name */
  currentUserName?: string;
  /** Top header: current user profile image URL */
  currentUserImage?: string | null;
  /** Fallback initial when no image (also used for bottom avatar) */
  currentUserInitial?: string;
  loading?: boolean;
  /** Link for back to dashboard */
  dashboardHref?: string;
  dashboardLabel?: string;
}

export function ChatSidebar({
  contacts,
  activeContactId,
  onSelectContact,
  currentUserName,
  currentUserImage,
  currentUserInitial = "N",
  loading = false,
  dashboardHref,
  dashboardLabel = "Go to Dashboard",
}: ChatSidebarProps) {
  const [search, setSearch] = useState("");
  const initial = (currentUserInitial || currentUserName?.trim().charAt(0) || "N").charAt(0).toUpperCase();

  const filtered = search.trim()
    ? contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          (c.subtitle?.toLowerCase().includes(search.toLowerCase()) ?? false)
      )
    : contacts;

  return (
    <aside className="flex min-h-0 w-full flex-1 flex-col bg-white md:border-r">
      {/* User header: name left, back to dashboard right (like chat room) */}
      <div className="shrink-0 flex items-center justify-between gap-2 border-b bg-gray-50/80 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-300 ring-2 ring-white shadow-sm">
            {currentUserImage ? (
              <img
                src={currentUserImage}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-600">
                {initial}
              </span>
            )}
          </div>
          <span className="min-w-0 truncate text-sm font-semibold text-gray-900">
            {currentUserName ?? "You"}
          </span>
        </div>
        {dashboardHref && (
          <Link
            href={dashboardHref}
            className="shrink-0 flex items-center gap-2 rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 transition"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span>{dashboardLabel}</span>
          </Link>
        )}
      </div>
      <div className="border-b p-3">
        <div className="flex items-center gap-2 rounded-lg border bg-gray-50 px-3 py-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-2 p-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-lg bg-gray-100"
              />
            ))}
          </div>
        ) : (
          filtered.map((contact) => (
            <ContactListItem
              key={contact.id}
              contact={contact}
              isActive={activeContactId === contact.id}
              onClick={() => onSelectContact(contact)}
            />
          ))
        )}
      </div>
      <div className="flex justify-center border-t p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-sm font-semibold text-white">
          {initial}
        </div>
      </div>
    </aside>
  );
}
