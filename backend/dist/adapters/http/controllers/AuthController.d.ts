/**
 * Authentication Controller
 * Handles HTTP requests for authentication operations
 */
import { Request, Response } from "express";
import { IAuthPort } from "../../../ports/IAuthPort";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
export declare class AuthController {
    private authPort;
    constructor(authPort: IAuthPort);
    /**
     * POST /auth/register
     * Registers a new user with email and password
     */
    register(req: Request, res: Response): Promise<void>;
    /**
     * POST /auth/login
     * Authenticates user with email and password
     */
    login(req: Request, res: Response): Promise<void>;
    /**
     * POST /auth/google-login
     * Authenticates user with Google OAuth token
     */
    googleLogin(req: Request, res: Response): Promise<void>;
    /**
     * POST /auth/logout
     * Logs out the authenticated user
     */
    logout(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * GET /auth/me
     * Retrieves current authenticated user profile
     */
    getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * POST /auth/refresh-token
     * Refreshes the access token
     */
    refreshToken(req: Request, res: Response): Promise<void>;
    /**
     * Centralized error handler for auth errors
     */
    private handleAuthError;
}
//# sourceMappingURL=AuthController.d.ts.map