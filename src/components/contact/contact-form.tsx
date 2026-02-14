"use client";

import { useRef, useState } from "react";
import { Send, User, Mail, Phone } from "lucide-react";

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      message: String(formData.get("description") ?? "").trim(),
      url: typeof window !== "undefined" ? window.location.href : undefined,
    };

    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
      };
      if (res.ok && json.success) {
        setSuccess(json.message ?? "Email sent successfully.");
        form.reset();
      } else {
        setError(json.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      ) : null}

      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-foreground">
          Name <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-2">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/10"
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-phone" className="block text-sm font-medium text-foreground">
          Phone
        </label>
        <div className="relative mt-2">
          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            placeholder="Your phone number"
            className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/10"
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-foreground">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative mt-2">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/10"
          />
        </div>
      </div>
      <div>
        <label htmlFor="contact-subject" className="block text-sm font-medium text-foreground">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          required
          placeholder="What is this about?"
          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/10"
        />
      </div>
      <div>
        <label htmlFor="contact-description" className="block text-sm font-medium text-foreground">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-description"
          name="description"
          rows={5}
          required
          placeholder="Your message..."
          className="mt-2 w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/10"
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:opacity-50 disabled:pointer-events-none sm:w-auto"
      >
        <Send className="h-4 w-4" />
        {sending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
