/**
 * Wish domain errors
 * Custom error classes for wish-related business rule violations
 */
/**
 * Base error class for wish-related errors
 */
export declare class WishError extends Error {
    readonly code: string;
    constructor(message: string, code: string);
}
/**
 * Error thrown when a wish is not found
 */
export declare class WishNotFoundError extends WishError {
    constructor(wishId: string);
}
/**
 * Error thrown when user doesn't own the wish
 */
export declare class NotWishOwnerError extends WishError {
    constructor(message?: string);
}
/**
 * Error thrown when wish title validation fails
 */
export declare class InvalidWishTitleError extends WishError {
    constructor(message?: string);
}
/**
 * Error thrown when wish description validation fails
 */
export declare class InvalidWishDescriptionError extends WishError {
    constructor(message?: string);
}
/**
 * Error thrown when wish URL validation fails
 */
export declare class InvalidWishUrlError extends WishError {
    constructor(message?: string);
}
/**
 * Error thrown when wish price validation fails
 */
export declare class InvalidWishPriceError extends WishError {
    constructor(message?: string);
}
/**
 * Error thrown when wish priority validation fails
 */
export declare class InvalidWishPriorityError extends WishError {
    constructor(message?: string);
}
/**
 * Error thrown when raffle has not been completed yet
 */
export declare class RaffleNotCompletedError extends WishError {
    constructor(message?: string);
}
/**
 * Error thrown when user has no assignment in the group
 */
export declare class NoAssignmentError extends WishError {
    constructor(message?: string);
}
//# sourceMappingURL=WishErrors.d.ts.map