"use client";

import { useState, useRef } from "react";
import { Paperclip } from "lucide-react";

export interface MessageInputProps {
  placeholder?: string;
  onSend: (text: string, attachment?: File) => void;
  disabled?: boolean;
}

export function MessageInput({
  placeholder = "Type a message",
  onSend,
  disabled = false,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (disabled) return;
    if (trimmed || fileInputRef.current?.files?.[0]) {
      onSend(trimmed, fileInputRef.current?.files?.[0] ?? undefined);
      setText("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex shrink-0 items-center gap-2 border-t bg-white p-3"
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:bg-gray-50"
      />
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const trimmed = text.trim();
            if (trimmed || file) {
              onSend(trimmed, file);
              setText("");
              e.target.value = "";
            }
          }
        }}
      />
      <button
        type="button"
        onClick={handleAttachmentClick}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        aria-label="Attach file"
      >
        <Paperclip className="h-5 w-5" />
      </button>
      <button
        type="submit"
        className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
}
