import { NextRequest } from "next/server";
import { DEFAULT_API_BASE_URL } from "@/config/api-domain";

export const dynamic = "force-dynamic";

/** Allowed host for resume/media URLs (no open proxy). */
function getAllowedHost(): string {
  const base = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL;
  try {
    const u = new URL(base);
    return u.host;
  } catch {
    return "inter.malspy.com";
  }
}

export async function GET(request: NextRequest) {
  const urlParam = request.nextUrl.searchParams.get("url");
  if (!urlParam || typeof urlParam !== "string") {
    return new Response("Missing url", { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(urlParam);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  const allowedHost = getAllowedHost();
  if (targetUrl.host !== allowedHost) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const res = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent": "UniIntern-Proxy/1.0",
      },
    });
    if (!res.ok) {
      return new Response(`Upstream error: ${res.status}`, { status: res.status });
    }
    const contentType = res.headers.get("content-type") || "application/octet-stream";
    const body = await res.arrayBuffer();
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(msg, { status: 502 });
  }
}
