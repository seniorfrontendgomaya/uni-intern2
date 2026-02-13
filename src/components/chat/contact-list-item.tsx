"use client";

import { Rocket } from "lucide-react";
import type { ChatContact } from "@/types/chat";

export interface ContactListItemProps {
  contact: ChatContact;
  isActive: boolean;
  onClick: () => void;
}

export function ContactListItem({
  contact,
  isActive,
  onClick,
}: ContactListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
        isActive ? "bg-gray-200" : "hover:bg-gray-100"
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-300 text-gray-600">
        {contact.avatar ? (
          <img
            src={contact.avatar}
            alt=""
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <Rocket className="h-5 w-5" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">
          {contact.name}
        </p>
        {contact.subtitle && (
          <p className="truncate text-xs text-gray-500">{contact.subtitle}</p>
        )}
      </div>
      {contact.lastMessageAt && (
        <span className="shrink-0 text-xs text-gray-500">
          {contact.lastMessageAt}
        </span>
      )}
    </button>
  );
}
