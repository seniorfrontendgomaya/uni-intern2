import {
  NetworkError,
  UnauthorizedError,
  ValidationError,
  NotFoundError,
  ServerError,
} from "@/errors/http.errors";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://inter.malspy.com/";

export async function api<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const isFormData =
      typeof FormData !== "undefined" && options?.body instanceof FormData;
    const res = await fetch(`${baseUrl}${url}`, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options?.headers || {}),
      },
    });

    

    if (!res.ok) {
      switch (res.status) {
        case 400:
          throw new ValidationError(await safeJson(res));
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
