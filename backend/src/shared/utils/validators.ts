/**
 * Validation utilities for authentication
 */
import { ValidationError } from "../../domain/errors/AuthErrors";

/**
 * Validates email format
 * @param email - Email to validate
 * @throws ValidationError if email format is invalid
 */
export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    throw new ValidationError("Invalid email format");
  }
}

/**
 * Validates password strength
 * @param password - Password to validate
 * @throws ValidationError if password doesn't meet requirements
 */
export function validatePassword(password: string): void {
  if (!password || password.length < 8) {
    throw new ValidationError("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    throw new ValidationError(
      "Password must contain at least one uppercase letter",
    );
  }

  if (!/\d/.test(password)) {
    throw new ValidationError("Password must contain at least one number");
  }
}

/**
 * Validates user name
 * @param name - Name to validate
 * @throws ValidationError if name is invalid
 */
export function validateName(name: string): void {
  if (!name || name.trim().length < 2) {
    throw new ValidationError("Name must be at least 2 characters long");
  }

  if (name.trim().length > 100) {
    throw new ValidationError("Name must not exceed 100 characters");
  }
}
