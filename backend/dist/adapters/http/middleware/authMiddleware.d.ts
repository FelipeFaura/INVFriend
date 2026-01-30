/**
 * Authentication middleware for Express
 * Validates JWT tokens and attaches user information to requests
 */
import { Request, Response, NextFunction } from "express";
export interface AuthenticatedRequest extends Request {
    user?: {
        uid: string;
        email?: string;
    };
}
/**
 * Middleware to verify JWT tokens from Authorization header
 * Extracts token from 'Authorization: Bearer <token>' format
 * Adds user information to request if token is valid
 */
export declare function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
/**
 * Optional authentication middleware - doesn't fail if token is missing
 * Useful for routes that support both authenticated and unauthenticated access
 */
export declare function optionalAuthMiddleware(req: AuthenticatedRequest, _res: Response, next: NextFunction): void;
//# sourceMappingURL=authMiddleware.d.ts.map