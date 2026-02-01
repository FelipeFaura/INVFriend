/**
 * Domain errors for authentication operations in the frontend
 * Mirrors backend error classes for consistent error handling
 */

/**
 * Base authentication error class
 */
export class AuthError extends Error {
  /**
   * Creates an AuthError instance
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

/**
 * Thrown when email or password are incorrect
 */
export class InvalidCredentialsError extends AuthError {
  constructor(message = "Email or password is invalid") {
    super(message, "INVALID_CREDENTIALS");
    this.name = "InvalidCredentialsError";
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}

/**
 * Thrown when user tries to register with an existing email
 */
export class UserAlreadyExistsError extends AuthError {
  constructor(email: string) {
    super(`User with email ${email} already exists`, "USER_ALREADY_EXISTS");
    this.name = "UserAlreadyExistsError";
    Object.setPrototypeOf(this, UserAlreadyExistsError.prototype);
  }
}

/**
 * Thrown when a user cannot be found
 */
export class UserNotFoundError extends AuthError {
  constructor(email?: string) {
    super(
      `User not found${email ? ` with email ${email}` : ""}`,
      "USER_NOT_FOUND",
    );
    this.name = "UserNotFoundError";
    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}

/**
 * Thrown when a token is invalid, malformed, or expired
 */
export class InvalidTokenError extends AuthError {
  constructor(message = "Token is invalid or expired") {
    super(message, "INVALID_TOKEN");
    this.name = "InvalidTokenError";
    Object.setPrototypeOf(this, InvalidTokenError.prototype);
  }
}

/**
 * Thrown when input validation fails
 */
export class ValidationError extends AuthError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Thrown when network request fails
 */
export class NetworkError extends AuthError {
  constructor(message = "Network request failed") {
    super(message, "NETWORK_ERROR");
    this.name = "NetworkError";
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * Error code constants for type-safe error handling
 */
export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  INVALID_TOKEN: "INVALID_TOKEN",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  WEAK_PASSWORD: "WEAK_PASSWORD",
  INVALID_EMAIL: "INVALID_EMAIL",
} as const;

export type AuthErrorCode =
  (typeof AUTH_ERROR_CODES)[keyof typeof AUTH_ERROR_CODES];
