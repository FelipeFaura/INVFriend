/**
 * Wish domain errors
 * Custom error classes for wish-related business rule violations
 */

/**
 * Base error class for wish-related errors
 */
export class WishError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "WishError";
  }
}

/**
 * Error thrown when a wish is not found
 */
export class WishNotFoundError extends WishError {
  constructor(wishId: string) {
    super(`Wish with ID '${wishId}' not found`, "WISH_NOT_FOUND");
    this.name = "WishNotFoundError";
    Object.setPrototypeOf(this, WishNotFoundError.prototype);
  }
}

/**
 * Error thrown when user doesn't own the wish
 */
export class NotWishOwnerError extends WishError {
  constructor(message: string = "User is not the owner of this wish") {
    super(message, "NOT_WISH_OWNER");
    this.name = "NotWishOwnerError";
    Object.setPrototypeOf(this, NotWishOwnerError.prototype);
  }
}

/**
 * Error thrown when wish title validation fails
 */
export class InvalidWishTitleError extends WishError {
  constructor(
    message: string = "Title is required and must be 200 characters or less",
  ) {
    super(message, "INVALID_WISH_TITLE");
    this.name = "InvalidWishTitleError";
    Object.setPrototypeOf(this, InvalidWishTitleError.prototype);
  }
}

/**
 * Error thrown when wish description validation fails
 */
export class InvalidWishDescriptionError extends WishError {
  constructor(message: string = "Description must be 1000 characters or less") {
    super(message, "INVALID_WISH_DESCRIPTION");
    this.name = "InvalidWishDescriptionError";
    Object.setPrototypeOf(this, InvalidWishDescriptionError.prototype);
  }
}

/**
 * Error thrown when wish URL validation fails
 */
export class InvalidWishUrlError extends WishError {
  constructor(message: string = "URL must be 500 characters or less") {
    super(message, "INVALID_WISH_URL");
    this.name = "InvalidWishUrlError";
    Object.setPrototypeOf(this, InvalidWishUrlError.prototype);
  }
}

/**
 * Error thrown when wish price validation fails
 */
export class InvalidWishPriceError extends WishError {
  constructor(message: string = "Estimated price cannot be negative") {
    super(message, "INVALID_WISH_PRICE");
    this.name = "InvalidWishPriceError";
    Object.setPrototypeOf(this, InvalidWishPriceError.prototype);
  }
}

/**
 * Error thrown when wish priority validation fails
 */
export class InvalidWishPriorityError extends WishError {
  constructor(message: string = "Priority must be between 1 and 5") {
    super(message, "INVALID_WISH_PRIORITY");
    this.name = "InvalidWishPriorityError";
    Object.setPrototypeOf(this, InvalidWishPriorityError.prototype);
  }
}

/**
 * Error thrown when raffle has not been completed yet
 */
export class RaffleNotCompletedError extends WishError {
  constructor(
    message: string = "Cannot view wishes until raffle is completed",
  ) {
    super(message, "RAFFLE_NOT_COMPLETED");
    this.name = "RaffleNotCompletedError";
    Object.setPrototypeOf(this, RaffleNotCompletedError.prototype);
  }
}

/**
 * Error thrown when user has no assignment in the group
 */
export class NoAssignmentError extends WishError {
  constructor(message: string = "User has no assignment in this group") {
    super(message, "NO_ASSIGNMENT");
    this.name = "NoAssignmentError";
    Object.setPrototypeOf(this, NoAssignmentError.prototype);
  }
}
