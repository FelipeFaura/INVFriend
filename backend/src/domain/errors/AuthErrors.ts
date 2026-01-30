/**
 * Domain errors for authentication operations
 * These errors should be thrown by domain logic and caught by adapters
 */

export class AuthError extends Error {
  /**
   * Base authentication error
   * @param message - Error message
   * @param code - Error code for classification
   */
  constructor(
    message: string,
    readonly code: string,
  ) {
    super(message);
    this.name = "AuthError";
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export class InvalidCredentialsError extends AuthError {
  /**
   * Thrown when email or password are incorrect
   */
  constructor(message = "Email or password is invalid") {
    super(message, "INVALID_CREDENTIALS");
    this.name = "InvalidCredentialsError";
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}

export class UserAlreadyExistsError extends AuthError {
  /**
   * Thrown when user tries to register with an email that already exists
   */
  constructor(email: string) {
    super(`User with email ${email} already exists`, "USER_ALREADY_EXISTS");
    this.name = "UserAlreadyExistsError";
    Object.setPrototypeOf(this, UserAlreadyExistsError.prototype);
  }
}

export class UserNotFoundError extends AuthError {
  /**
   * Thrown when a user cannot be found
   */
  constructor(email?: string) {
    super(
      `User not found${email ? ` with email ${email}` : ""}`,
      "USER_NOT_FOUND",
    );
    this.name = "UserNotFoundError";
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}

export class InvalidTokenError extends AuthError {
  /**
   * Thrown when a token is invalid, malformed, or expired
   */
  constructor(message = "Token is invalid or expired") {
    super(message, "INVALID_TOKEN");
    this.name = "InvalidTokenError";
    Object.setPrototypeOf(this, InvalidTokenError.prototype);
  }
}

export class ValidationError extends AuthError {
  /**
   * Thrown when input validation fails
   */
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
