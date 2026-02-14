import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  try {
    if (!request.body) {
      return Response.json(
        { success: false, message: "No request body provided" },
        { status: 400 }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) ?? {};
    } catch {
      return Response.json(
        { success: false, message: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const subject = typeof body.subject === "string" ? body.subject.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const service = typeof body.service === "string" ? body.service.trim() : "";
    const url = typeof body.url === "string" ? body.url.trim() : "";

    if (!name || !email || !subject || !message) {
      return Response.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { success: false, message: "Invalid email address" },
        { status: 400 }
      );
    }

    // TEMP credentials (recommend moving to env vars in production)
    const smtpUser = "8f2a77002@smtp-brevo.com";
    const smtpPass = "CQydUfJOYD6zFPMW";
    const fromAddress = "support@businessshine.co.nz";
    const fromName = "Business Shine";
    const businessInbox = "info@businessshine.co.nz";

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
      tls: { rejectUnauthorized: false },
    });

    try {
      await transporter.verify();
    } catch (verifyError) {
      const verifyMessage =
        verifyError instanceof Error
          ? verifyError.message
          : String(verifyError);
      return Response.json(
        {
          success: false,
          message: "SMTP connection failed",
          error:
            process.env.NODE_ENV === "development" ? verifyMessage : undefined,
        },
        { status: 500 }
      );
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #24343F; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; color: #F4B942;">New Contact Form Submission</h1>
        </div>
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #24343F; margin-top: 0;">Contact Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding:10px;border-bottom:1px solid #ddd;font-weight:bold;color:#24343F;">Name:</td><td style="padding:10px;border-bottom:1px solid #ddd;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #ddd;font-weight:bold;color:#24343F;">Email:</td><td style="padding:10px;border-bottom:1px solid #ddd;"><a href="mailto:${escapeHtml(email)}" style="color:#F4B942;">${escapeHtml(email)}</a></td></tr>
            ${
              phone
                ? `<tr><td style="padding:10px;border-bottom:1px solid #ddd;font-weight:bold;color:#24343F;">Phone:</td><td style="padding:10px;border-bottom:1px solid #ddd;"><a href="tel:${escapeHtml(phone)}" style="color:#F4B942;">${escapeHtml(phone)}</a></td></tr>`
                : ""
            }
            ${
              service
                ? `<tr><td style="padding:10px;border-bottom:1px solid #ddd;font-weight:bold;color:#24343F;">Service:</td><td style="padding:10px;border-bottom:1px solid #ddd;">${escapeHtml(String(service).replace(/-/g, " "))}</td></tr>`
                : ""
            }
            ${
              url
                ? `<tr><td style="padding:10px;border-bottom:1px solid #ddd;font-weight:bold;color:#24343F;">Page URL:</td><td style="padding:10px;border-bottom:1px solid #ddd;"><a href="${escapeHtml(url)}" style="color:#F4B942;" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a></td></tr>`
                : ""
            }
          </table>
          <h3 style="color:#24343F;margin-top:30px;">Message</h3>
          <div style="background:white;padding:20px;border-radius:5px;border-left:4px solid #F4B942;">
            <p style="margin:0;line-height:1.6;color:#333;">${escapeHtml(message).replace(/\n/g, "<br>")}</p>
          </div>
          <div style="margin-top:30px;padding:20px;background:#F4B942;border-radius:5px;text-align:center;">
            <p style="margin:0;color:#24343F;font-weight:bold;">Please respond to this inquiry within 24 hours</p>
          </div>
        </div>
        <div style="background:#24343F;color:white;padding:20px;text-align:center;font-size:12px;">
          <p style="margin:0;">This email was sent from the UNIINTERN contact form</p>
        </div>
      </div>`;

    await transporter.sendMail({
      from: `${fromName} <${fromAddress}>`,
      to: businessInbox,
      replyTo: email,
      subject: `Contact Form: ${subject}`,
      html,
    });

    return Response.json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? msg : undefined,
      },
      { status: 500 }
    );
  }
}
