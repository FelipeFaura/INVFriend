/**
 * Authentication-related types and data transfer objects
 */
/**
 * DTO for user registration
 */
export interface RegisterDTO {
    email: string;
    password: string;
    name: string;
}
/**
 * DTO for email/password login
 */
export interface LoginDTO {
    email: string;
    password: string;
}
/**
 * DTO for Google OAuth login
 */
export interface GoogleLoginDTO {
    googleToken: string;
}
/**
 * Response returned after successful authentication
 */
export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
        photoUrl: string | null;
        createdAt: number;
        updatedAt: number;
    };
    accessToken: string;
    refreshToken?: string;
    expiresIn?: number;
}
/**
 * Decoded JWT token payload
 */
export interface DecodedToken {
    uid: string;
    email: string;
    iat: number;
    exp: number;
}
//# sourceMappingURL=AuthTypes.d.ts.map