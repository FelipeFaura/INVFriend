"use strict";
/**
 * Domain errors for authentication operations
 * These errors should be thrown by domain logic and caught by adapters
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.InvalidTokenError = exports.UserNotFoundError = exports.UserAlreadyExistsError = exports.InvalidCredentialsError = exports.AuthError = void 0;
class AuthError extends Error {
    /**
     * Base authentication error
     * @param message - Error message
     * @param code - Error code for classification
     */
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = "AuthError";
        Object.setPrototypeOf(this, AuthError.prototype);
    }
}
exports.AuthError = AuthError;
class InvalidCredentialsError extends AuthError {
    /**
     * Thrown when email or password are incorrect
     */
    constructor(message = "Email or password is invalid") {
        super(message, "INVALID_CREDENTIALS");
        this.name = "InvalidCredentialsError";
        Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
    }
}
exports.InvalidCredentialsError = InvalidCredentialsError;
class UserAlreadyExistsError extends AuthError {
    /**
     * Thrown when user tries to register with an email that already exists
     */
    constructor(email) {
        super(`User with email ${email} already exists`, "USER_ALREADY_EXISTS");
        this.name = "UserAlreadyExistsError";
        Object.setPrototypeOf(this, UserAlreadyExistsError.prototype);
    }
}
exports.UserAlreadyExistsError = UserAlreadyExistsError;
class UserNotFoundError extends AuthError {
    /**
     * Thrown when a user cannot be found
     */
    constructor(email) {
        super(`User not found${email ? ` with email ${email}` : ""}`, "USER_NOT_FOUND");
        this.name = "UserNotFoundError";
        Object.setPrototypeOf(this, UserNotFoundError.prototype);
    }
}
exports.UserNotFoundError = UserNotFoundError;
class InvalidTokenError extends AuthError {
    /**
     * Thrown when a token is invalid, malformed, or expired
     */
    constructor(message = "Token is invalid or expired") {
        super(message, "INVALID_TOKEN");
        this.name = "InvalidTokenError";
        Object.setPrototypeOf(this, InvalidTokenError.prototype);
    }
}
exports.InvalidTokenError = InvalidTokenError;
class ValidationError extends AuthError {
    /**
     * Thrown when input validation fails
     */
    constructor(message) {
        super(message, "VALIDATION_ERROR");
        this.name = "ValidationError";
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=AuthErrors.js.map