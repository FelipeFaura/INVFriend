"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const AuthErrors_1 = require("../../../domain/errors/AuthErrors");
class AuthController {
    constructor(authPort) {
        this.authPort = authPort;
    }
    /**
     * POST /auth/register
     * Registers a new user with email and password
     */
    async register(req, res) {
        try {
            const { email, password, name } = req.body;
            const response = await this.authPort.registerWithEmail(email, password, name);
            res.status(201).json(response);
        }
        catch (error) {
            this.handleAuthError(error, res);
        }
    }
    /**
     * POST /auth/login
     * Authenticates user with email and password
     */
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const response = await this.authPort.loginWithEmail(email, password);
            res.status(200).json(response);
        }
        catch (error) {
            this.handleAuthError(error, res);
        }
    }
    /**
     * POST /auth/google-login
     * Authenticates user with Google OAuth token
     */
    async googleLogin(req, res) {
        try {
            const { googleToken } = req.body;
            const response = await this.authPort.loginWithGoogle(googleToken);
            res.status(200).json(response);
        }
        catch (error) {
            this.handleAuthError(error, res);
        }
    }
    /**
     * POST /auth/logout
     * Logs out the authenticated user
     */
    async logout(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: "Unauthorized",
                    code: "MISSING_USER",
                    message: "User information not found",
                });
                return;
            }
            await this.authPort.logout(req.user.uid);
            res.status(200).json({
                success: true,
                message: "Successfully logged out",
            });
        }
        catch (error) {
            this.handleAuthError(error, res);
        }
    }
    /**
     * GET /auth/me
     * Retrieves current authenticated user profile
     */
    async getCurrentUser(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: "Unauthorized",
                    code: "MISSING_USER",
                    message: "User information not found",
                });
                return;
            }
            // In a real scenario, we might extract token from header
            // For now, we use the user info already attached by middleware
            // If we need fresh data from Firestore, we'd need the token
            // Since we don't have direct access to token from request object in this simple implementation,
            // we would need to pass it through middleware or extract it from headers again
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                res.status(401).json({
                    error: "Unauthorized",
                    code: "MISSING_TOKEN",
                    message: "Authorization header is missing",
                });
                return;
            }
            const token = authHeader.split(" ")[1];
            const user = await this.authPort.getCurrentUser(token);
            res.status(200).json({ user: user.toJSON() });
        }
        catch (error) {
            this.handleAuthError(error, res);
        }
    }
    /**
     * POST /auth/refresh-token
     * Refreshes the access token
     */
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            const response = await this.authPort.refreshToken(refreshToken);
            res.status(200).json(response);
        }
        catch (error) {
            this.handleAuthError(error, res);
        }
    }
    /**
     * Centralized error handler for auth errors
     */
    handleAuthError(error, res) {
        if (error instanceof AuthErrors_1.ValidationError) {
            res.status(400).json({
                error: "Bad Request",
                code: error.code,
                message: error.message,
            });
            return;
        }
        if (error instanceof AuthErrors_1.UserAlreadyExistsError) {
            res.status(409).json({
                error: "Conflict",
                code: error.code,
                message: error.message,
            });
            return;
        }
        if (error instanceof AuthErrors_1.InvalidCredentialsError) {
            res.status(401).json({
                error: "Unauthorized",
                code: error.code,
                message: error.message,
            });
            return;
        }
        if (error instanceof AuthErrors_1.UserNotFoundError) {
            res.status(404).json({
                error: "Not Found",
                code: error.code,
                message: error.message,
            });
            return;
        }
        if (error instanceof AuthErrors_1.InvalidTokenError) {
            res.status(401).json({
                error: "Unauthorized",
                code: error.code,
                message: error.message,
            });
            return;
        }
        // Generic error handler
        res.status(500).json({
            error: "Internal Server Error",
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred",
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map