"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
exports.validateName = validateName;
/**
 * Validation utilities for authentication
 */
const AuthErrors_1 = require("../../domain/errors/AuthErrors");
/**
 * Validates email format
 * @param email - Email to validate
 * @throws ValidationError if email format is invalid
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        throw new AuthErrors_1.ValidationError("Invalid email format");
    }
}
/**
 * Validates password strength
 * @param password - Password to validate
 * @throws ValidationError if password doesn't meet requirements
 */
function validatePassword(password) {
    if (!password || password.length < 8) {
        throw new AuthErrors_1.ValidationError("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
        throw new AuthErrors_1.ValidationError("Password must contain at least one uppercase letter");
    }
    if (!/\d/.test(password)) {
        throw new AuthErrors_1.ValidationError("Password must contain at least one number");
    }
}
/**
 * Validates user name
 * @param name - Name to validate
 * @throws ValidationError if name is invalid
 */
function validateName(name) {
    if (!name || name.trim().length < 2) {
        throw new AuthErrors_1.ValidationError("Name must be at least 2 characters long");
    }
    if (name.trim().length > 100) {
        throw new AuthErrors_1.ValidationError("Name must not exceed 100 characters");
    }
}
//# sourceMappingURL=validators.js.map