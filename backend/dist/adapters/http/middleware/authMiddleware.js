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
exports.authMiddleware = authMiddleware;
exports.optionalAuthMiddleware = optionalAuthMiddleware;
const admin = __importStar(require("firebase-admin"));
/**
 * Middleware to verify JWT tokens from Authorization header
 * Extracts token from 'Authorization: Bearer <token>' format
 * Adds user information to request if token is valid
 */
function authMiddleware(req, res, next) {
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
        .catch((error) => {
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
function optionalAuthMiddleware(req, _res, next) {
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
//# sourceMappingURL=authMiddleware.js.map