/**
 * Firebase Authentication Adapter
 * Implements IAuthPort interface using Firebase Admin SDK
 */
import * as admin from "firebase-admin";
import { User } from "../../domain/entities/User";
import { AuthResponse } from "../../shared/types/AuthTypes";
import { IAuthPort } from "../../ports/IAuthPort";
export declare class FirebaseAuthAdapter implements IAuthPort {
    private auth;
    private db;
    constructor(auth?: admin.auth.Auth, db?: admin.firestore.Firestore);
    /**
     * Registers a new user with email and password
     */
    registerWithEmail(email: string, password: string, name: string): Promise<AuthResponse>;
    /**
     * Authenticates user with email and password
     */
    loginWithEmail(email: string, password: string): Promise<AuthResponse>;
    /**
     * Authenticates user with Google OAuth token
     */
    loginWithGoogle(googleToken: string): Promise<AuthResponse>;
    /**
     * Gets current user from token
     */
    getCurrentUser(token: string): Promise<User>;
    /**
     * Verifies if a token is valid
     */
    verifyToken(token: string): Promise<boolean>;
    /**
     * Logs out user (no server-side state in stateless JWT approach)
     */
    logout(userId: string): Promise<void>;
    /**
     * Refreshes access token using a custom token
     */
    refreshToken(refreshToken: string): Promise<AuthResponse>;
}
//# sourceMappingURL=FirebaseAuthAdapter.d.ts.map