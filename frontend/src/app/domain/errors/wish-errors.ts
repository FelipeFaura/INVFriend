/**
 * Wish Domain Errors
 * Error classes for wish-related operations
 */

/**
 * Base class for all wish errors
 */
export abstract class WishError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Thrown when a wish is not found
 */
export class WishNotFoundError extends WishError {
  readonly code = "WISH_NOT_FOUND";

  constructor(message = "Wish not found") {
    super(message);
  }
}

/**
 * Thrown when user is not the wish owner
 */
export class NotWishOwnerError extends WishError {
  readonly code = "NOT_WISH_OWNER";

  constructor(message = "Only the wish owner can perform this action") {
    super(message);
  }
}

/**
 * Thrown when wish title validation fails
 */
export class InvalidWishTitleError extends WishError {
  readonly code = "INVALID_WISH_TITLE";

  constructor(
    message = "Title is required and must be 200 characters or less",
  ) {
    super(message);
  }
}

/**
 * Thrown when raffle has not been completed
 */
export class RaffleNotCompletedError extends WishError {
  readonly code = "RAFFLE_NOT_COMPLETED";

  constructor(
    message = "Cannot view assigned wishes until raffle is completed",
  ) {
    super(message);
  }
}

/**
 * Thrown when user has no assignment
 */
export class NoAssignmentError extends WishError {
  readonly code = "NO_ASSIGNMENT";

  constructor(message = "User has no assignment in this group") {
    super(message);
  }
}

/**
 * General validation error for wishes
 */
export class WishValidationError extends WishError {
  readonly code = "VALIDATION_ERROR";

  constructor(message: string) {
    super(message);
  }
}

/**
 * Factory function to create error from backend error code
 */
export function createWishErrorFromCode(
  code: string,
  message: string,
): WishError {
  switch (code) {
    case "WISH_NOT_FOUND":
      return new WishNotFoundError(message);
    case "NOT_WISH_OWNER":
      return new NotWishOwnerError(message);
    case "INVALID_WISH_TITLE":
      return new InvalidWishTitleError(message);
    case "RAFFLE_NOT_COMPLETED":
      return new RaffleNotCompletedError(message);
    case "NO_ASSIGNMENT":
      return new NoAssignmentError(message);
    case "VALIDATION_ERROR":
      return new WishValidationError(message);
    default:
      return new WishValidationError(message);
  }
}
