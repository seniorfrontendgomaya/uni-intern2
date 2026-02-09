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
  constructor(meta?: unknown) {
    super((meta as { message?: string })?.message || "Validation failed.", "VALIDATION_ERROR", 400, meta);
  }
}

export class NotFoundError extends BaseError {
  constructor(meta?: unknown) {
    console.log("meta", meta);
    super((meta as { message?: string })?.message || "Resource not found.", "NOT_FOUND", 404);
  }
}

export class ServerError extends BaseError {
  constructor() {
    super("Internal server error.", "SERVER_ERROR", 500);
  }
}
