"use client";

import { Check, FileText } from "lucide-react";
import type { ChatMessage } from "@/types/chat";

export interface MessageBubbleProps {
  message: ChatMessage;
}

function formatTime(timestamp: string) {
  try {
    const d = new Date(timestamp);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return timestamp;
  }
}

/** Body can be a plain image URL (attachment is null from API) */
function isImageUrl(text: string | undefined): boolean {
  if (!text || typeof text !== "string") return false;
  const trimmed = text.trim();
  if (!/^https?:\/\//i.test(trimmed)) return false;
  return /\.(png|jpe?g|gif|webp|bmp)(\?|$)/i.test(trimmed) || /\/media\/images\//i.test(trimmed);
}

/** Non-image file extensions that cannot be rendered inline (show placeholder) */
const FILE_EXT_REGEX =
  /\.(pdf|xls|xlsx|xlsm|doc|docx|ppt|pptx|zip|rar|7z|csv|txt|odt|ods|odp)(\?|$)/i;

function isFileUrl(text: string | undefined): boolean {
  if (!text || typeof text !== "string") return false;
  const trimmed = text.trim();
  return /^https?:\/\//i.test(trimmed) && FILE_EXT_REGEX.test(trimmed);
}

function getFileLabel(url: string): string {
  const match = url.match(/\.([a-z0-9]+)(\?|$)/i);
  const ext = match ? match[1].toUpperCase() : "File";
  return ext;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const time = formatTime(message.timestamp);

  if (message.attachment) {
    const isImage = message.attachment.type === "image";
    return (
      <div
        className={`flex ${message.isOwn ? "justify-end" : "justify-start"} mb-2`}
      >
        <div
          className={`max-w-[85%] rounded-2xl px-3 py-2 ${
            message.isOwn
              ? "bg-green-100 rounded-br-md"
              : "bg-gray-200 rounded-bl-md"
          }`}
        >
          <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            {isImage ? (
              <a
                href={message.attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={message.attachment.url}
                  alt={message.attachment.name ?? "Image"}
                  className="h-auto max-h-64 w-full object-contain cursor-pointer hover:opacity-90 transition"
                />
              </a>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2 py-8 px-6 text-gray-500">
                <FileText className="h-12 w-12 shrink-0" aria-hidden />
                <span className="text-sm font-medium">
                  {message.attachment.name ?? "Attachment"} file
                </span>
                <p className="text-xs text-gray-400">Cannot be previewed</p>
              </div>
            )}
            <div className="p-2">
              <a
                href={message.attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {isImage ? "View Image" : "View Attachment"}
              </a>
              <p className="mt-1 text-xs text-gray-500">{time}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const urlFromBody = message.text?.trim();
  const imageUrlFromBody = urlFromBody && isImageUrl(message.text) ? urlFromBody : null;
  const fileUrlFromBody = urlFromBody && isFileUrl(message.text) ? urlFromBody : null;

  if (imageUrlFromBody) {
    return (
      <div
        className={`flex ${message.isOwn ? "justify-end" : "justify-start"} mb-2`}
      >
        <div
          className={`max-w-[85%] rounded-2xl px-3 py-2 ${
            message.isOwn
              ? "bg-green-100 rounded-br-md"
              : "bg-gray-200 rounded-bl-md"
          }`}
        >
          <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <a
              href={imageUrlFromBody}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={imageUrlFromBody}
                alt="Shared image"
                className="h-auto max-h-64 w-full object-contain cursor-pointer hover:opacity-90 transition"
              />
            </a>
            <div className="p-2">
              <a
                href={imageUrlFromBody}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View Image
              </a>
              <p className="mt-1 text-xs text-gray-500">{time}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (fileUrlFromBody) {
    const fileLabel = getFileLabel(fileUrlFromBody);
    return (
      <div
        className={`flex ${message.isOwn ? "justify-end" : "justify-start"} mb-2`}
      >
        <div
          className={`max-w-[85%] rounded-2xl px-3 py-2 ${
            message.isOwn
              ? "bg-green-100 rounded-br-md"
              : "bg-gray-200 rounded-bl-md"
          }`}
        >
          <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="flex flex-col items-center justify-center gap-2 py-8 px-6 text-gray-500">
              <FileText className="h-12 w-12 shrink-0" aria-hidden />
              <span className="text-sm font-medium">{fileLabel} file</span>
              <p className="text-xs text-gray-400">Cannot be previewed</p>
            </div>
            <div className="border-t p-2">
              <a
                href={fileUrlFromBody}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View Attachment
              </a>
              <p className="mt-1 text-xs text-gray-500">{time}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex ${message.isOwn ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`flex max-w-[85%] items-end gap-1 rounded-2xl px-3 py-2 ${
          message.isOwn
            ? "bg-green-100 rounded-br-md"
            : "bg-gray-200 rounded-bl-md"
        }`}
      >
        <p className="text-sm text-gray-900 break-words">{message.text}</p>
        <div className="flex shrink-0 items-center gap-0.5">
          <span className="text-xs text-gray-500">{time}</span>
          {message.isOwn && (
            <Check className="h-3.5 w-3.5 text-green-600" aria-hidden />
          )}
        </div>
      </div>
    </div>
  );
}
