/**
 * Group domain errors
 * Custom error classes for group-related business rule violations
 */

/**
 * Base error class for group-related errors
 */
export class GroupError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "GroupError";
  }
}

/**
 * Error thrown when group name validation fails
 */
export class InvalidGroupNameError extends GroupError {
  constructor(
    message: string = "Group name must be between 3 and 100 characters",
  ) {
    super(message, "INVALID_GROUP_NAME");
    this.name = "InvalidGroupNameError";
    Object.setPrototypeOf(this, InvalidGroupNameError.prototype);
  }
}

/**
 * Error thrown when budget limit validation fails
 */
export class InvalidBudgetLimitError extends GroupError {
  constructor(message: string = "Budget limit must be greater than 0") {
    super(message, "INVALID_BUDGET_LIMIT");
    this.name = "InvalidBudgetLimitError";
    Object.setPrototypeOf(this, InvalidBudgetLimitError.prototype);
  }
}

/**
 * Error thrown when trying to perform an operation that requires admin privileges
 */
export class NotGroupAdminError extends GroupError {
  constructor(message: string = "User is not the admin of this group") {
    super(message, "NOT_GROUP_ADMIN");
    this.name = "NotGroupAdminError";
    Object.setPrototypeOf(this, NotGroupAdminError.prototype);
  }
}

/**
 * Error thrown when a group is not found
 */
export class GroupNotFoundError extends GroupError {
  constructor(groupId: string) {
    super(`Group with ID '${groupId}' not found`, "GROUP_NOT_FOUND");
    this.name = "GroupNotFoundError";
    Object.setPrototypeOf(this, GroupNotFoundError.prototype);
  }
}

/**
 * Error thrown when a user is not a member of the group
 */
export class NotGroupMemberError extends GroupError {
  constructor(message: string = "User is not a member of this group") {
    super(message, "NOT_GROUP_MEMBER");
    this.name = "NotGroupMemberError";
    Object.setPrototypeOf(this, NotGroupMemberError.prototype);
  }
}

/**
 * Error thrown when a user is already a member of the group
 */
export class AlreadyGroupMemberError extends GroupError {
  constructor(message: string = "User is already a member of this group") {
    super(message, "ALREADY_GROUP_MEMBER");
    this.name = "AlreadyGroupMemberError";
    Object.setPrototypeOf(this, AlreadyGroupMemberError.prototype);
  }
}

/**
 * Error thrown when trying to remove the admin from the group
 */
export class CannotRemoveAdminError extends GroupError {
  constructor(message: string = "Cannot remove the admin from the group") {
    super(message, "CANNOT_REMOVE_ADMIN");
    this.name = "CannotRemoveAdminError";
    Object.setPrototypeOf(this, CannotRemoveAdminError.prototype);
  }
}

/**
 * Error thrown when trying to delete a group after raffle is completed
 */
export class CannotDeleteAfterRaffleError extends GroupError {
  constructor(
    message: string = "Cannot delete group after raffle has been completed",
  ) {
    super(message, "CANNOT_DELETE_AFTER_RAFFLE");
    this.name = "CannotDeleteAfterRaffleError";
    Object.setPrototypeOf(this, CannotDeleteAfterRaffleError.prototype);
  }
}

/**
 * Error thrown when there are not enough members for raffle
 */
export class NotEnoughMembersError extends GroupError {
  constructor(minimum: number = 2) {
    super(
      `Group must have at least ${minimum} members to perform raffle`,
      "NOT_ENOUGH_MEMBERS",
    );
    this.name = "NotEnoughMembersError";
    Object.setPrototypeOf(this, NotEnoughMembersError.prototype);
  }
}

/**
 * Error thrown when raffle has already been performed
 */
export class RaffleAlreadyCompletedError extends GroupError {
  constructor(
    message: string = "Raffle has already been completed for this group",
  ) {
    super(message, "RAFFLE_ALREADY_COMPLETED");
    this.name = "RaffleAlreadyCompletedError";
    Object.setPrototypeOf(this, RaffleAlreadyCompletedError.prototype);
  }
}
