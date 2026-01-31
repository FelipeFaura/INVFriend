"use strict";
/**
 * Wish domain errors
 * Custom error classes for wish-related business rule violations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoAssignmentError = exports.RaffleNotCompletedError = exports.InvalidWishPriorityError = exports.InvalidWishPriceError = exports.InvalidWishUrlError = exports.InvalidWishDescriptionError = exports.InvalidWishTitleError = exports.NotWishOwnerError = exports.WishNotFoundError = exports.WishError = void 0;
/**
 * Base error class for wish-related errors
 */
class WishError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = "WishError";
    }
}
exports.WishError = WishError;
/**
 * Error thrown when a wish is not found
 */
class WishNotFoundError extends WishError {
    constructor(wishId) {
        super(`Wish with ID '${wishId}' not found`, "WISH_NOT_FOUND");
        this.name = "WishNotFoundError";
        Object.setPrototypeOf(this, WishNotFoundError.prototype);
    }
}
exports.WishNotFoundError = WishNotFoundError;
/**
 * Error thrown when user doesn't own the wish
 */
class NotWishOwnerError extends WishError {
    constructor(message = "User is not the owner of this wish") {
        super(message, "NOT_WISH_OWNER");
        this.name = "NotWishOwnerError";
        Object.setPrototypeOf(this, NotWishOwnerError.prototype);
    }
}
exports.NotWishOwnerError = NotWishOwnerError;
/**
 * Error thrown when wish title validation fails
 */
class InvalidWishTitleError extends WishError {
    constructor(message = "Title is required and must be 200 characters or less") {
        super(message, "INVALID_WISH_TITLE");
        this.name = "InvalidWishTitleError";
        Object.setPrototypeOf(this, InvalidWishTitleError.prototype);
    }
}
exports.InvalidWishTitleError = InvalidWishTitleError;
/**
 * Error thrown when wish description validation fails
 */
class InvalidWishDescriptionError extends WishError {
    constructor(message = "Description must be 1000 characters or less") {
        super(message, "INVALID_WISH_DESCRIPTION");
        this.name = "InvalidWishDescriptionError";
        Object.setPrototypeOf(this, InvalidWishDescriptionError.prototype);
    }
}
exports.InvalidWishDescriptionError = InvalidWishDescriptionError;
/**
 * Error thrown when wish URL validation fails
 */
class InvalidWishUrlError extends WishError {
    constructor(message = "URL must be 500 characters or less") {
        super(message, "INVALID_WISH_URL");
        this.name = "InvalidWishUrlError";
        Object.setPrototypeOf(this, InvalidWishUrlError.prototype);
    }
}
exports.InvalidWishUrlError = InvalidWishUrlError;
/**
 * Error thrown when wish price validation fails
 */
class InvalidWishPriceError extends WishError {
    constructor(message = "Estimated price cannot be negative") {
        super(message, "INVALID_WISH_PRICE");
        this.name = "InvalidWishPriceError";
        Object.setPrototypeOf(this, InvalidWishPriceError.prototype);
    }
}
exports.InvalidWishPriceError = InvalidWishPriceError;
/**
 * Error thrown when wish priority validation fails
 */
class InvalidWishPriorityError extends WishError {
    constructor(message = "Priority must be between 1 and 5") {
        super(message, "INVALID_WISH_PRIORITY");
        this.name = "InvalidWishPriorityError";
        Object.setPrototypeOf(this, InvalidWishPriorityError.prototype);
    }
}
exports.InvalidWishPriorityError = InvalidWishPriorityError;
/**
 * Error thrown when raffle has not been completed yet
 */
class RaffleNotCompletedError extends WishError {
    constructor(message = "Cannot view wishes until raffle is completed") {
        super(message, "RAFFLE_NOT_COMPLETED");
        this.name = "RaffleNotCompletedError";
        Object.setPrototypeOf(this, RaffleNotCompletedError.prototype);
    }
}
exports.RaffleNotCompletedError = RaffleNotCompletedError;
/**
 * Error thrown when user has no assignment in the group
 */
class NoAssignmentError extends WishError {
    constructor(message = "User has no assignment in this group") {
        super(message, "NO_ASSIGNMENT");
        this.name = "NoAssignmentError";
        Object.setPrototypeOf(this, NoAssignmentError.prototype);
    }
}
exports.NoAssignmentError = NoAssignmentError;
//# sourceMappingURL=WishErrors.js.map