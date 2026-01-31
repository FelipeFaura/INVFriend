/**
 * Group domain errors
 * Custom error classes for group-related business rule violations
 */
/**
 * Base error class for group-related errors
 */
export declare class GroupError extends Error {
    readonly code: string;
    constructor(message: string, code: string);
}
/**
 * Error thrown when group name validation fails
 */
export declare class InvalidGroupNameError extends GroupError {
    constructor(message?: string);
}
/**
 * Error thrown when budget limit validation fails
 */
export declare class InvalidBudgetLimitError extends GroupError {
    constructor(message?: string);
}
/**
 * Error thrown when trying to perform an operation that requires admin privileges
 */
export declare class NotGroupAdminError extends GroupError {
    constructor(message?: string);
}
/**
 * Error thrown when a group is not found
 */
export declare class GroupNotFoundError extends GroupError {
    constructor(groupId: string);
}
/**
 * Error thrown when a user is not a member of the group
 */
export declare class NotGroupMemberError extends GroupError {
    constructor(message?: string);
}
/**
 * Error thrown when a user is already a member of the group
 */
export declare class AlreadyGroupMemberError extends GroupError {
    constructor(message?: string);
}
/**
 * Error thrown when trying to remove the admin from the group
 */
export declare class CannotRemoveAdminError extends GroupError {
    constructor(message?: string);
}
/**
 * Error thrown when trying to delete a group after raffle is completed
 */
export declare class CannotDeleteAfterRaffleError extends GroupError {
    constructor(message?: string);
}
/**
 * Error thrown when there are not enough members for raffle
 */
export declare class NotEnoughMembersError extends GroupError {
    constructor(minimum?: number);
}
/**
 * Error thrown when raffle has already been performed
 */
export declare class RaffleAlreadyCompletedError extends GroupError {
    constructor(message?: string);
}
//# sourceMappingURL=GroupErrors.d.ts.map