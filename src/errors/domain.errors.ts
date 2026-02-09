import { BaseError } from "./BaseError";

export class UserAlreadyExistsError extends BaseError {
  constructor() {
    super("User already exists.", "USER_ALREADY_EXISTS", 409);
  }
}

export class InvalidCredentialsError extends BaseError {
  constructor() {
    super('Invalid email or password.', 'INVALID_CREDENTIALS', 401);
  }
}