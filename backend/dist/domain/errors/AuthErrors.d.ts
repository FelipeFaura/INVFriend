/**
 * Domain errors for authentication operations
 * These errors should be thrown by domain logic and caught by adapters
 */
export declare class AuthError extends Error {
    readonly code: string;
    /**
     * Base authentication error
     * @param message - Error message
     * @param code - Error code for classification
     */
    constructor(message: string, code: string);
}
export declare class InvalidCredentialsError extends AuthError {
    /**
     * Thrown when email or password are incorrect
     */
    constructor(message?: string);
}
export declare class UserAlreadyExistsError extends AuthError {
    /**
     * Thrown when user tries to register with an email that already exists
     */
    constructor(email: string);
}
export declare class UserNotFoundError extends AuthError {
    /**
     * Thrown when a user cannot be found
     */
    constructor(email?: string);
}
export declare class InvalidTokenError extends AuthError {
    /**
     * Thrown when a token is invalid, malformed, or expired
     */
    constructor(message?: string);
}
export declare class ValidationError extends AuthError {
    /**
     * Thrown when input validation fails
     */
    constructor(message: string);
}
//# sourceMappingURL=AuthErrors.d.ts.map