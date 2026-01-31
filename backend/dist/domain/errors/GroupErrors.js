"use strict";
/**
 * Group domain errors
 * Custom error classes for group-related business rule violations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaffleAlreadyCompletedError = exports.NotEnoughMembersError = exports.CannotDeleteAfterRaffleError = exports.CannotRemoveAdminError = exports.AlreadyGroupMemberError = exports.NotGroupMemberError = exports.GroupNotFoundError = exports.NotGroupAdminError = exports.InvalidBudgetLimitError = exports.InvalidGroupNameError = exports.GroupError = void 0;
/**
 * Base error class for group-related errors
 */
class GroupError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
        this.name = "GroupError";
    }
}
exports.GroupError = GroupError;
/**
 * Error thrown when group name validation fails
 */
class InvalidGroupNameError extends GroupError {
    constructor(message = "Group name must be between 3 and 100 characters") {
        super(message, "INVALID_GROUP_NAME");
        this.name = "InvalidGroupNameError";
        Object.setPrototypeOf(this, InvalidGroupNameError.prototype);
    }
}
exports.InvalidGroupNameError = InvalidGroupNameError;
/**
 * Error thrown when budget limit validation fails
 */
class InvalidBudgetLimitError extends GroupError {
    constructor(message = "Budget limit must be greater than 0") {
        super(message, "INVALID_BUDGET_LIMIT");
        this.name = "InvalidBudgetLimitError";
        Object.setPrototypeOf(this, InvalidBudgetLimitError.prototype);
    }
}
exports.InvalidBudgetLimitError = InvalidBudgetLimitError;
/**
 * Error thrown when trying to perform an operation that requires admin privileges
 */
class NotGroupAdminError extends GroupError {
    constructor(message = "User is not the admin of this group") {
        super(message, "NOT_GROUP_ADMIN");
        this.name = "NotGroupAdminError";
        Object.setPrototypeOf(this, NotGroupAdminError.prototype);
    }
}
exports.NotGroupAdminError = NotGroupAdminError;
/**
 * Error thrown when a group is not found
 */
class GroupNotFoundError extends GroupError {
    constructor(groupId) {
        super(`Group with ID '${groupId}' not found`, "GROUP_NOT_FOUND");
        this.name = "GroupNotFoundError";
        Object.setPrototypeOf(this, GroupNotFoundError.prototype);
    }
}
exports.GroupNotFoundError = GroupNotFoundError;
/**
 * Error thrown when a user is not a member of the group
 */
class NotGroupMemberError extends GroupError {
    constructor(message = "User is not a member of this group") {
        super(message, "NOT_GROUP_MEMBER");
        this.name = "NotGroupMemberError";
        Object.setPrototypeOf(this, NotGroupMemberError.prototype);
    }
}
exports.NotGroupMemberError = NotGroupMemberError;
/**
 * Error thrown when a user is already a member of the group
 */
class AlreadyGroupMemberError extends GroupError {
    constructor(message = "User is already a member of this group") {
        super(message, "ALREADY_GROUP_MEMBER");
        this.name = "AlreadyGroupMemberError";
        Object.setPrototypeOf(this, AlreadyGroupMemberError.prototype);
    }
}
exports.AlreadyGroupMemberError = AlreadyGroupMemberError;
/**
 * Error thrown when trying to remove the admin from the group
 */
class CannotRemoveAdminError extends GroupError {
    constructor(message = "Cannot remove the admin from the group") {
        super(message, "CANNOT_REMOVE_ADMIN");
        this.name = "CannotRemoveAdminError";
        Object.setPrototypeOf(this, CannotRemoveAdminError.prototype);
    }
}
exports.CannotRemoveAdminError = CannotRemoveAdminError;
/**
 * Error thrown when trying to delete a group after raffle is completed
 */
class CannotDeleteAfterRaffleError extends GroupError {
    constructor(message = "Cannot delete group after raffle has been completed") {
        super(message, "CANNOT_DELETE_AFTER_RAFFLE");
        this.name = "CannotDeleteAfterRaffleError";
        Object.setPrototypeOf(this, CannotDeleteAfterRaffleError.prototype);
    }
}
exports.CannotDeleteAfterRaffleError = CannotDeleteAfterRaffleError;
/**
 * Error thrown when there are not enough members for raffle
 */
class NotEnoughMembersError extends GroupError {
    constructor(minimum = 2) {
        super(`Group must have at least ${minimum} members to perform raffle`, "NOT_ENOUGH_MEMBERS");
        this.name = "NotEnoughMembersError";
        Object.setPrototypeOf(this, NotEnoughMembersError.prototype);
    }
}
exports.NotEnoughMembersError = NotEnoughMembersError;
/**
 * Error thrown when raffle has already been performed
 */
class RaffleAlreadyCompletedError extends GroupError {
    constructor(message = "Raffle has already been completed for this group") {
        super(message, "RAFFLE_ALREADY_COMPLETED");
        this.name = "RaffleAlreadyCompletedError";
        Object.setPrototypeOf(this, RaffleAlreadyCompletedError.prototype);
    }
}
exports.RaffleAlreadyCompletedError = RaffleAlreadyCompletedError;
//# sourceMappingURL=GroupErrors.js.map