import { ValidationError } from "@/errors/http.errors";

export type FieldErrors = Record<string, string[]>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function extractFieldErrors(error: unknown): FieldErrors | null {
  if (!(error instanceof ValidationError)) return null;

  const meta = error.meta as { message?: unknown } | undefined;
  const message = meta?.message;
  if (!isPlainObject(message)) return null;

  const out: FieldErrors = {};
  for (const [key, value] of Object.entries(message)) {
    if (Array.isArray(value)) {
      const items = value.map((entry) => String(entry)).filter(Boolean);
      if (items.length > 0) out[key] = items;
      continue;
    }
    if (typeof value === "string" && value.trim()) {
      out[key] = [value.trim()];
    }
  }

  return Object.keys(out).length > 0 ? out : null;
}

