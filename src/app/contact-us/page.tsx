"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Mail, Phone, User, Clock } from "lucide-react";
import { LandingHeader } from "@/components/ui/landing-header";
import { FooterClientMount } from "@/components/ui/landing-footer";
import { submitContactForm } from "@/services/contact.service";
import toast from "react-hot-toast";

export default function ContactUsPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setSending(true);
    try {
      const url = typeof window !== "undefined" ? window.location.href : undefined;
      const result = await submitContactForm({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        url,
      });
      if (result.success) {
        toast.success(result.message ?? "Email sent successfully.");
        setName("");
        setPhone("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        toast.error(result.message ?? "Failed to send message.");
      }
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6 md:py-16">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="grid gap-10 md:grid-cols-[1fr,1fr] md:gap-14">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Get in touch
            </h1>
            <p className="mt-4 text-base text-muted-foreground">
              Have a question or want to work together? Send us a message and we&apos;ll get back to you as soon as we can.
            </p>
            <div className="mt-10 space-y-6">
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Email Address</p>
                  <a
                    href="mailto:info@uniintern.com"
                    className="mt-0.5 block text-sm font-medium text-blue-600 hover:underline"
                  >
                    info@uniintern.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Phone Number</p>
                  <a
                    href="tel:+917858910056"
                    className="mt-0.5 block text-sm font-medium text-green-600 hover:underline"
                  >
                    <span className="mr-1">+91</span>
                    <span>7858910056</span>
                  </a>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Business Hours
                </h2>
                <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  <li>Monday – Friday: 9:00 AM – 6:00 PM</li>
                  <li>Saturday: 10:00 AM – 4:00 PM</li>
                  <li>Sunday: Closed</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-foreground">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What is this about?"
                  className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/10"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-foreground">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
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
          </div>
        </div>
      </main>
      <FooterClientMount />
    </div>
  );
}
