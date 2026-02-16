import { BaseError } from "./BaseError";

export class NetworkError extends BaseError {
  constructor() {
    super("Network error. Please try again.", "NETWORK_ERROR");
  }
}

export class UnauthorizedError extends BaseError {
  constructor(meta?: unknown) {

    super((meta as { message?: string })?.message || "Unauthorized access.", "UNAUTHORIZED", 401);
  }
}

export class ValidationError extends BaseError {
  constructor(meta?: unknown, status: number = 400) {
    const message = (() => {
      const raw = (meta as { message?: unknown })?.message;
      if (typeof raw === "string" && raw.trim()) return raw;
      // when backend returns field-level errors as an object, avoid "[object Object]"
      if (raw && typeof raw === "object" && !Array.isArray(raw)) {
        return "Please fix the highlighted fields.";
      }
      return "Validation failed.";
    })();
    super(message, "VALIDATION_ERROR", status, meta);
  }
}

export class NotFoundError extends BaseError {
  constructor(meta?: unknown) {
    // console.log("meta", meta);
    super((meta as { message?: string })?.message || "Resource not found.", "NOT_FOUND", 404);
  }
}

export class ServerError extends BaseError {
  constructor() {
    super("Internal server error.", "SERVER_ERROR", 500);
  }
}
