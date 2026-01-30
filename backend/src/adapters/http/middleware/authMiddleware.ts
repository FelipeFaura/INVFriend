/**
 * Authentication middleware for Express
 * Validates JWT tokens and attaches user information to requests
 */
import { Request, Response, NextFunction } from "express";
import * as admin from "firebase-admin";

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
export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      error: "Unauthorized",
      code: "MISSING_TOKEN",
      message: "Authorization header is missing",
    });
    return;
  }

  // Extract token from "Bearer <token>" format
  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({
      error: "Unauthorized",
      code: "INVALID_AUTH_FORMAT",
      message: "Authorization header must be in format 'Bearer <token>'",
    });
    return;
  }

  const token = parts[1];

  // Verify token with Firebase Admin SDK
  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      // Attach user info to request
      req.user = {
        uid: decodedToken.uid || decodedToken.sub,
        email: decodedToken.email,
      };
      next();
    })
    .catch((error: any) => {
      res.status(401).json({
        error: "Unauthorized",
        code: "INVALID_TOKEN",
        message: error.message || "Token verification failed",
      });
    });
}

/**
 * Optional authentication middleware - doesn't fail if token is missing
 * Useful for routes that support both authenticated and unauthenticated access
 */
export function optionalAuthMiddleware(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next();
    return;
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    next();
    return;
  }

  const token = parts[1];

  admin
    .auth()
    .verifyIdToken(token)
    .then((decodedToken) => {
      req.user = {
        uid: decodedToken.uid || decodedToken.sub,
        email: decodedToken.email,
      };
      next();
    })
    .catch(() => {
      // Silently continue without user info
      next();
    });
}
