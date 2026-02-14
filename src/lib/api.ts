import {
  NetworkError,
  UnauthorizedError,
  ValidationError,
  NotFoundError,
  ServerError,
} from "@/errors/http.errors";

/** Single source for backend base URL. Use this everywhere instead of defining URLs explicitly. */
export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://inter.malspy.com/";
const baseUrl = apiBaseUrl;

/** Build full API URL from path and optional query. Path should start with / (e.g. "/top_locations/"). */
export function getApiUrl(path: string, query?: Record<string, string>): string {
  const base = baseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (!query || Object.keys(query).length === 0) return `${base}${normalizedPath}`;
  const params = new URLSearchParams(query);
  return `${base}${normalizedPath}?${params.toString()}`;
}

export async function api<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const isFormData =
      typeof FormData !== "undefined" && options?.body instanceof FormData;
    // When sending FormData, do NOT set Content-Type so the browser sets multipart/form-data with boundary
    const requestHeaders: HeadersInit = { ...(options?.headers || {}) };
    if (isFormData) {
      delete (requestHeaders as Record<string, string>)["Content-Type"];
      delete (requestHeaders as Record<string, string>)["content-type"];
    } else if (!(requestHeaders as Record<string, string>)["Content-Type"] && !(requestHeaders as Record<string, string>)["content-type"]) {
      (requestHeaders as Record<string, string>)["Content-Type"] = "application/json";
    }
    const res = await fetch(`${baseUrl}${url}`, {
      ...options,
      headers: requestHeaders,
    });
    

    if (!res.ok) {
      switch (res.status) {
        case 400:
          throw new ValidationError(await safeJson(res), res.status);
        case 422:
          throw new ValidationError(await safeJson(res), res.status);
        case 401:
          throw new UnauthorizedError(await safeJson(res));
        case 404:
          throw new NotFoundError(await safeJson(res));
        default:
          if (res.status >= 500) throw new ServerError();
      }
    }

    return (await res.json()) as T;
  } catch (error) {
    if (error instanceof TypeError) {
      // fetch network failure
      throw new NetworkError();
    }
    throw error;
  }
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return undefined;
  }
}
