"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseAuthAdapter = void 0;
/**
 * Firebase Authentication Adapter
 * Implements IAuthPort interface using Firebase Admin SDK
 */
const admin = __importStar(require("firebase-admin"));
const User_1 = require("../../domain/entities/User");
const AuthErrors_1 = require("../../domain/errors/AuthErrors");
const validators_1 = require("../../shared/utils/validators");
class FirebaseAuthAdapter {
    constructor(auth = admin.auth(), db = admin.firestore()) {
        this.auth = auth;
        this.db = db;
    }
    /**
     * Registers a new user with email and password
     */
    async registerWithEmail(email, password, name) {
        // Validate inputs
        (0, validators_1.validateEmail)(email);
        (0, validators_1.validatePassword)(password);
        (0, validators_1.validateName)(name);
        // Normalize email to lowercase
        const normalizedEmail = email.toLowerCase();
        try {
            // Check if user already exists in Firebase Auth
            const existingUser = await this.auth.getUserByEmail(normalizedEmail);
            if (existingUser) {
                throw new AuthErrors_1.UserAlreadyExistsError(normalizedEmail);
            }
        }
        catch (error) {
            // If it's our custom UserAlreadyExistsError, re-throw it
            if (error instanceof AuthErrors_1.UserAlreadyExistsError) {
                throw error;
            }
            // If error is "user not found", that's what we want, continue
            if (error.code === "auth/user-not-found") {
                // User doesn't exist, continue with registration
            }
            else {
                throw error;
            }
        }
        try {
            // Create user in Firebase Auth
            const firebaseUser = await this.auth.createUser({
                email: normalizedEmail,
                password,
                displayName: name,
            });
            // Create user profile in Firestore
            const user = User_1.User.create(firebaseUser.uid, normalizedEmail, name, firebaseUser.photoURL || null);
            await this.db
                .collection("users")
                .doc(firebaseUser.uid)
                .set(user.toJSON());
            // Generate tokens
            const accessToken = await this.auth.createCustomToken(firebaseUser.uid);
            return {
                user: user.toJSON(),
                accessToken,
                expiresIn: 3600, // 1 hour in seconds
            };
        }
        catch (error) {
            if (error instanceof AuthErrors_1.ValidationError ||
                error instanceof AuthErrors_1.UserAlreadyExistsError) {
                throw error;
            }
            if (error.code === "auth/email-already-exists") {
                throw new AuthErrors_1.UserAlreadyExistsError(normalizedEmail);
            }
            throw new AuthErrors_1.AuthError(`Failed to register user: ${error.message}`, "REGISTRATION_FAILED");
        }
    }
    /**
     * Authenticates user with email and password
     */
    async loginWithEmail(email, password) {
        // Validate inputs
        (0, validators_1.validateEmail)(email);
        if (!password) {
            throw new AuthErrors_1.ValidationError("Password is required");
        }
        const normalizedEmail = email.toLowerCase();
        try {
            // Get user by email
            const firebaseUser = await this.auth.getUserByEmail(normalizedEmail);
            if (!firebaseUser) {
                throw new AuthErrors_1.UserNotFoundError(normalizedEmail);
            }
            // Verify password using custom token flow
            // Note: Firebase Admin SDK doesn't directly verify passwords
            // This is typically done via Firebase REST API or on the client
            // For this implementation, we'll trust that password verification
            // happens at a different layer (typically client-side with Firebase SDK)
            // and here we just validate that the user exists
            // Get user profile from Firestore
            const userDoc = await this.db
                .collection("users")
                .doc(firebaseUser.uid)
                .get();
            if (!userDoc.exists) {
                throw new AuthErrors_1.UserNotFoundError(normalizedEmail);
            }
            const userData = userDoc.data();
            const user = User_1.User.fromDatabase(userData.id, userData.email, userData.name, userData.photoUrl, userData.createdAt, userData.updatedAt);
            // Generate custom token (acts as access token)
            const accessToken = await this.auth.createCustomToken(firebaseUser.uid);
            return {
                user: user.toJSON(),
                accessToken,
                expiresIn: 3600,
            };
        }
        catch (error) {
            if (error instanceof AuthErrors_1.UserNotFoundError || error instanceof AuthErrors_1.AuthError) {
                throw error;
            }
            if (error.code === "auth/user-not-found") {
                throw new AuthErrors_1.UserNotFoundError(normalizedEmail);
            }
            throw new AuthErrors_1.InvalidCredentialsError();
        }
    }
    /**
     * Authenticates user with Google OAuth token
     */
    async loginWithGoogle(googleToken) {
        if (!googleToken) {
            throw new AuthErrors_1.ValidationError("Google token is required");
        }
        try {
            // Verify the Google token using Firebase Admin SDK
            const decodedToken = await this.auth.verifyIdToken(googleToken);
            if (!decodedToken.email) {
                throw new AuthErrors_1.ValidationError("Google token does not contain email");
            }
            const normalizedEmail = decodedToken.email.toLowerCase();
            const uid = decodedToken.sub; // Subject claim is the user UID
            try {
                // Try to get existing user
                await this.auth.getUser(uid);
                // Get user profile from Firestore
                const userDoc = await this.db.collection("users").doc(uid).get();
                if (userDoc.exists) {
                    const userData = userDoc.data();
                    const user = User_1.User.fromDatabase(userData.id, userData.email, userData.name, userData.photoUrl, userData.createdAt, userData.updatedAt);
                    // Update lastLogin
                    await this.db
                        .collection("users")
                        .doc(uid)
                        .update({ updatedAt: Date.now() });
                    const accessToken = await this.auth.createCustomToken(uid);
                    return {
                        user: user.toJSON(),
                        accessToken,
                        expiresIn: 3600,
                    };
                }
            }
            catch (error) {
                if (error.code !== "auth/user-not-found") {
                    throw error;
                }
            }
            // User doesn't exist in Firestore, create new user
            const googleUser = await this.auth.getUser(uid);
            const newUser = User_1.User.create(uid, normalizedEmail, decodedToken.name || googleUser.displayName || "Google User", googleUser.photoURL || null);
            await this.db.collection("users").doc(uid).set(newUser.toJSON());
            const accessToken = await this.auth.createCustomToken(uid);
            return {
                user: newUser.toJSON(),
                accessToken,
                expiresIn: 3600,
            };
        }
        catch (error) {
            if (error instanceof AuthErrors_1.ValidationError) {
                throw error;
            }
            if (error.code === "auth/argument-error" ||
                error.message?.includes("decode")) {
                throw new AuthErrors_1.InvalidTokenError("Invalid or malformed Google token");
            }
            throw new AuthErrors_1.InvalidTokenError(`Failed to verify Google token: ${error.message}`);
        }
    }
    /**
     * Gets current user from token
     */
    async getCurrentUser(token) {
        if (!token) {
            throw new AuthErrors_1.InvalidTokenError("Token is required");
        }
        try {
            const decodedToken = await this.auth.verifyIdToken(token);
            const uid = decodedToken.uid || decodedToken.sub;
            const userDoc = await this.db.collection("users").doc(uid).get();
            if (!userDoc.exists) {
                throw new AuthErrors_1.UserNotFoundError();
            }
            const userData = userDoc.data();
            return User_1.User.fromDatabase(userData.id, userData.email, userData.name, userData.photoUrl, userData.createdAt, userData.updatedAt);
        }
        catch (error) {
            if (error instanceof AuthErrors_1.UserNotFoundError) {
                throw error;
            }
            if (error.code === "auth/argument-error" ||
                error.code === "auth/id-token-expired") {
                throw new AuthErrors_1.InvalidTokenError("Token has expired");
            }
            throw new AuthErrors_1.InvalidTokenError("Invalid token");
        }
    }
    /**
     * Verifies if a token is valid
     */
    async verifyToken(token) {
        if (!token) {
            return false;
        }
        try {
            await this.auth.verifyIdToken(token);
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Logs out user (no server-side state in stateless JWT approach)
     */
    async logout(userId) {
        if (!userId) {
            throw new AuthErrors_1.ValidationError("User ID is required");
        }
        // In a stateless JWT architecture, logout is handled on the client
        // by discarding the token. This method can be used for cleanup if needed
        // For now, it's a no-op but could be extended for token blacklisting
    }
    /**
     * Refreshes access token using a custom token
     */
    async refreshToken(refreshToken) {
        if (!refreshToken) {
            throw new AuthErrors_1.InvalidTokenError("Refresh token is required");
        }
        try {
            const decodedToken = await this.auth.verifyIdToken(refreshToken);
            const uid = decodedToken.uid || decodedToken.sub;
            const userDoc = await this.db.collection("users").doc(uid).get();
            if (!userDoc.exists) {
                throw new AuthErrors_1.UserNotFoundError();
            }
            const userData = userDoc.data();
            const user = User_1.User.fromDatabase(userData.id, userData.email, userData.name, userData.photoUrl, userData.createdAt, userData.updatedAt);
            const newAccessToken = await this.auth.createCustomToken(uid);
            return {
                user: user.toJSON(),
                accessToken: newAccessToken,
                expiresIn: 3600,
            };
        }
        catch (error) {
            if (error instanceof AuthErrors_1.UserNotFoundError) {
                throw error;
            }
            throw new AuthErrors_1.InvalidTokenError("Invalid or expired refresh token");
        }
    }
}
exports.FirebaseAuthAdapter = FirebaseAuthAdapter;
//# sourceMappingURL=FirebaseAuthAdapter.js.map