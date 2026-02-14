export type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  url?: string;
};

export type ContactResponse = {
  success: boolean;
  message: string;
  error?: string;
};

/**
 * POST /api/contact — send contact form to your own origin (same URL as the app).
 * Sends description as message; url is optional (typically window.location.href).
 */
export async function submitContactForm(payload: ContactPayload): Promise<ContactResponse> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json().catch(() => ({}))) as ContactResponse;
  if (!res.ok) {
    return {
      success: false,
      message: data?.message ?? "Something went wrong.",
      error: data?.error,
    };
  }
  return {
    success: data?.success ?? true,
    message: data?.message ?? "Email sent successfully",
    error: data?.error,
  };
}
