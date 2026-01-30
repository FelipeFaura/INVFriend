/**
 * Authentication Data Transfer Objects (DTOs)
 * Used for API requests and responses
 */

import { User } from "../../domain/models/user.model";

// ============================================================================
// REQUEST DTOs
// ============================================================================

/**
 * DTO for user registration request
 */
export interface RegisterRequestDTO {
  /** User email address */
  email: string;
  /** User password (min 6 characters) */
  password: string;
  /** User display name */
  name: string;
}

/**
 * DTO for email/password login request
 */
export interface LoginRequestDTO {
  /** User email address */
  email: string;
  /** User password */
  password: string;
}

/**
 * DTO for Google OAuth login request
 */
export interface GoogleLoginRequestDTO {
  /** Google ID token from Google Sign-In */
  googleToken: string;
}

/**
 * DTO for token refresh request
 */
export interface RefreshTokenRequestDTO {
  /** Refresh token */
  refreshToken: string;
}

// ============================================================================
// RESPONSE DTOs
// ============================================================================

/**
 * Response returned after successful authentication
 */
export interface AuthResponseDTO {
  /** Authenticated user data */
  user: User;
  /** JWT access token */
  accessToken: string;
  /** Optional refresh token */
  refreshToken?: string;
  /** Token expiration time in seconds */
  expiresIn?: number;
}

/**
 * Response for token refresh
 */
export interface RefreshTokenResponseDTO {
  /** New JWT access token */
  accessToken: string;
  /** Token expiration time in seconds */
  expiresIn?: number;
}

/**
 * Generic API error response
 */
export interface AuthErrorResponseDTO {
  /** Error message */
  message: string;
  /** Error code for programmatic handling */
  code: string;
  /** HTTP status code */
  statusCode: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Type for stored authentication state
 */
export interface StoredAuthState {
  /** Current user or null if not authenticated */
  user: User | null;
  /** Access token or null */
  accessToken: string | null;
  /** Refresh token or null */
  refreshToken: string | null;
  /** Token expiration timestamp (milliseconds) */
  expiresAt: number | null;
}

/**
 * Initial empty auth state
 */
export const INITIAL_AUTH_STATE: StoredAuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
};
