import type { ChatContact, ChatMessage } from "@/types/chat";

/** Sample contacts for student view (e.g. companies) */
export const mockContactsStudent: ChatContact[] = [
  {
    id: "php-company",
    name: "Php Company",
    subtitle: "rajesh",
    lastMessageAt: "10:51 AM",
  },
  {
    id: "rajesh",
    name: "rajesh",
    subtitle: "Last message",
    lastMessageAt: "09:00 AM",
  },
  {
    id: "java-company",
    name: "Java Company",
    subtitle: "java",
    lastMessageAt: "10:51 AM",
  },
  {
    id: "python-company",
    name: "Python Company",
    subtitle: "python",
    lastMessageAt: "10:51 AM",
  },
  {
    id: "c-company",
    name: "C Company",
    subtitle: "c",
    lastMessageAt: "10:51 AM",
  },
  {
    id: "c++-company",
    name: "C++ Company",
    subtitle: "c++",
    lastMessageAt: "10:51 AM",
  },
  {
    id: "c#-company",
    name: "C# Company",
    subtitle: "c#",
    lastMessageAt: "10:51 AM",
  },
  {
    id: "javascript-company",
    name: "JavaScript Company",
    subtitle: "javascript",
    lastMessageAt: "10:51 AM",
  },
  {
    id: "typescript-company",
    name: "TypeScript Company",
    subtitle: "typescript",
    lastMessageAt: "10:51 AM",
  },
  {
    id: "ruby-company",
    name: "Ruby Company",
    subtitle: "ruby",
    lastMessageAt: "10:51 AM",
  },
  {
    id: "php-alt-company",
    name: "PHP Company",
    subtitle: "php",
    lastMessageAt: "10:51 AM",
  },
  {
    id: "swift-company",
    name: "Swift Company",
    subtitle: "swift",
    lastMessageAt: "10:51 AM",
  },
  {
    id: "kotlin-company",
    name: "Kotlin Company",
    subtitle: "kotlin",
    lastMessageAt: "10:51 AM",
  },
];

/** Sample contacts for company view (e.g. candidates/students) */
export const mockContactsCompany: ChatContact[] = [
  {
    id: "student-1",
    name: "Adi",
    subtitle: "Student",
    lastMessageAt: "10:51 AM",
  },
  {
    id: "student-2",
    name: "Priya",
    subtitle: "Student",
    lastMessageAt: "09:30 AM",
  },
];

const now = new Date();
const toTime = (h: number, m: number) => {
  const d = new Date(now);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

/** Sample messages for "Php Company" conversation — 20 messages */
export const mockMessagesPhpCompany: ChatMessage[] = [
  { id: "1", conversationId: "php-company", senderId: "other", text: "Hi, are you available for a quick chat?", timestamp: toTime(10, 15), isOwn: false },
  { id: "2", conversationId: "php-company", senderId: "me", text: "Yes, sure! How can I help?", timestamp: toTime(10, 18), isOwn: true, status: "read" },
  { id: "3", conversationId: "php-company", senderId: "other", text: "We’d like to discuss the internship role you applied for.", timestamp: toTime(10, 22), isOwn: false },
  { id: "4", conversationId: "php-company", senderId: "me", text: "That would be great. When is a good time?", timestamp: toTime(10, 25), isOwn: true, status: "read" },
  { id: "5", conversationId: "php-company", senderId: "other", text: "How about tomorrow at 11 AM?", timestamp: toTime(10, 28), isOwn: false },
  {
    id: "6",
    conversationId: "php-company",
    senderId: "other",
    timestamp: toTime(10, 30),
    isOwn: false,
    attachment: {
      url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200",
      type: "image",
      name: "Vest",
    },
  },
  { id: "7", conversationId: "php-company", senderId: "me", text: "Got the attachment, thanks. Tomorrow 11 AM works for me.", timestamp: toTime(10, 35), isOwn: true, status: "read" },
  { id: "8", conversationId: "php-company", senderId: "other", text: "Perfect. We’ll send a calendar invite shortly.", timestamp: toTime(10, 38), isOwn: false },
  { id: "9", conversationId: "php-company", senderId: "me", text: "Looking forward to it. See you then!", timestamp: toTime(10, 41), isOwn: true, status: "read" },
  { id: "10", conversationId: "php-company", senderId: "other", text: "Sounds good. Have a great day!", timestamp: toTime(10, 45), isOwn: false },
  { id: "11", conversationId: "php-company", senderId: "me", text: "Quick question — will the interview be in person or online?", timestamp: toTime(10, 52), isOwn: true, status: "read" },
  { id: "12", conversationId: "php-company", senderId: "other", text: "It’ll be a video call. We’ll share the link in the invite.", timestamp: toTime(10, 55), isOwn: false },
  { id: "13", conversationId: "php-company", senderId: "me", text: "Perfect, that works for me. Thanks for confirming!", timestamp: toTime(10, 58), isOwn: true, status: "read" },
  { id: "14", conversationId: "php-company", senderId: "other", text: "No problem. Do prepare to talk about your project experience.", timestamp: toTime(11, 2), isOwn: false },
  { id: "15", conversationId: "php-company", senderId: "me", text: "Will do. I’ll have my portfolio and code samples ready.", timestamp: toTime(11, 6), isOwn: true, status: "read" },
  { id: "16", conversationId: "php-company", senderId: "other", text: "Great. The call will be with our tech lead and HR. About 30–45 mins.", timestamp: toTime(11, 10), isOwn: false },
  { id: "17", conversationId: "php-company", senderId: "me", text: "Noted. I’ll be on time. Anything specific I should read up on?", timestamp: toTime(11, 14), isOwn: true, status: "read" },
  { id: "18", conversationId: "php-company", senderId: "other", text: "Our stack is React and Node. A quick brush-up on those would help.", timestamp: toTime(11, 18), isOwn: false },
  { id: "19", conversationId: "php-company", senderId: "me", text: "Got it, I’m comfortable with both. Thanks again!", timestamp: toTime(11, 22), isOwn: true, status: "read" },
  { id: "20", conversationId: "php-company", senderId: "other", text: "You’re welcome. Talk tomorrow!", timestamp: toTime(11, 25), isOwn: false },
];

/** Default messages for other conversations */
export const mockMessagesDefault: ChatMessage[] = [
  { id: "d1", conversationId: "_", senderId: "other", text: "Hello!", timestamp: toTime(9, 0), isOwn: false },
  { id: "d2", conversationId: "_", senderId: "me", text: "Hi there", timestamp: toTime(9, 1), isOwn: true, status: "read" },
];

/** Build messages map. Pass the contact id that should show the sample thread (e.g. "php-company" or "student-1"). */
export function getMockMessagesByContactId(
  contactIds: string[],
  sampleConversationId: string
): Record<string, ChatMessage[]> {
  const record: Record<string, ChatMessage[]> = {};
  for (const id of contactIds) {
    if (id === sampleConversationId) {
      record[id] = mockMessagesPhpCompany.map((m) => ({
        ...m,
        id: `${id}-${m.id}`,
        conversationId: id,
      }));
    } else {
      record[id] = mockMessagesDefault.map((m) => ({
        ...m,
        id: `${id}-${m.id}`,
        conversationId: id,
      }));
    }
  }
  return record;
}
