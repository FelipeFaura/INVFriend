/**
 * IAuthPort - Authentication port interface
 * Defines the contract for authentication operations
 */
import { User } from "../domain/entities/User";
import { AuthResponse } from "../shared/types/AuthTypes";
export interface IAuthPort {
    /**
     * Registers a new user with email and password
     * @param email - User email
     * @param password - User password (will be hashed by Firebase)
     * @param name - User full name
     * @returns Authentication response with user and tokens
     * @throws UserAlreadyExistsError if email already exists
     * @throws ValidationError if data is invalid
     */
    registerWithEmail(email: string, password: string, name: string): Promise<AuthResponse>;
    /**
     * Authenticates user with email and password
     * @param email - User email
     * @param password - User password
     * @returns Authentication response with user and tokens
     * @throws InvalidCredentialsError if email/password are incorrect
     * @throws ValidationError if data is invalid
     * @throws UserNotFoundError if user doesn't exist
     */
    loginWithEmail(email: string, password: string): Promise<AuthResponse>;
    /**
     * Authenticates user with Google OAuth token
     * @param googleToken - Google ID token
     * @returns Authentication response with user and tokens
     * @throws InvalidTokenError if token is invalid or expired
     * @throws ValidationError if token format is invalid
     */
    loginWithGoogle(googleToken: string): Promise<AuthResponse>;
    /**
     * Retrieves current user information from an access token
     * @param token - JWT access token
     * @returns User entity
     * @throws InvalidTokenError if token is invalid or expired
     */
    getCurrentUser(token: string): Promise<User>;
    /**
     * Verifies if a token is valid
     * @param token - JWT token to verify
     * @returns true if token is valid, false otherwise
     */
    verifyToken(token: string): Promise<boolean>;
    /**
     * Logs out user (clears any server-side session if needed)
     * @param userId - User ID
     */
    logout(userId: string): Promise<void>;
    /**
     * Refreshes an access token using a refresh token
     * @param refreshToken - Refresh token
     * @returns New authentication response with updated tokens
     * @throws InvalidTokenError if refresh token is invalid or expired
     */
    refreshToken(refreshToken: string): Promise<AuthResponse>;
}
//# sourceMappingURL=IAuthPort.d.ts.map