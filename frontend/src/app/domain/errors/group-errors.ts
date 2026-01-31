/**
 * Group Domain Errors
 * Error classes for group-related operations
 */

/**
 * Base class for all group errors
 */
export abstract class GroupError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Thrown when a group is not found
 */
export class GroupNotFoundError extends GroupError {
  readonly code = "GROUP_NOT_FOUND";

  constructor(message = "Group not found") {
    super(message);
  }
}

/**
 * Thrown when user is not the group admin
 */
export class NotGroupAdminError extends GroupError {
  readonly code = "NOT_GROUP_ADMIN";

  constructor(message = "Only the group admin can perform this action") {
    super(message);
  }
}

/**
 * Thrown when user is not a group member
 */
export class NotGroupMemberError extends GroupError {
  readonly code = "NOT_GROUP_MEMBER";

  constructor(message = "User is not a member of this group") {
    super(message);
  }
}

/**
 * Thrown when trying to add a user who is already a member
 */
export class AlreadyGroupMemberError extends GroupError {
  readonly code = "ALREADY_GROUP_MEMBER";

  constructor(message = "User is already a member of this group") {
    super(message);
  }
}

/**
 * Thrown when group name validation fails
 */
export class InvalidGroupNameError extends GroupError {
  readonly code = "INVALID_GROUP_NAME";

  constructor(message = "Group name must be between 3 and 100 characters") {
    super(message);
  }
}

/**
 * Thrown when budget limit validation fails
 */
export class InvalidBudgetLimitError extends GroupError {
  readonly code = "INVALID_BUDGET_LIMIT";

  constructor(message = "Budget limit must be greater than 0") {
    super(message);
  }
}

/**
 * Thrown when trying to remove the admin from the group
 */
export class CannotRemoveAdminError extends GroupError {
  readonly code = "CANNOT_REMOVE_ADMIN";

  constructor(message = "Cannot remove the admin from the group") {
    super(message);
  }
}

/**
 * Thrown when trying to delete a group after raffle is completed
 */
export class CannotDeleteAfterRaffleError extends GroupError {
  readonly code = "CANNOT_DELETE_AFTER_RAFFLE";

  constructor(
    message = "Cannot delete a group after the raffle has been completed",
  ) {
    super(message);
  }
}

/**
 * Factory function to create appropriate error from backend response
 */
export function createGroupErrorFromCode(
  code: string,
  message?: string,
): GroupError {
  switch (code) {
    case "GROUP_NOT_FOUND":
      return new GroupNotFoundError(message);
    case "NOT_GROUP_ADMIN":
      return new NotGroupAdminError(message);
    case "NOT_GROUP_MEMBER":
      return new NotGroupMemberError(message);
    case "ALREADY_GROUP_MEMBER":
      return new AlreadyGroupMemberError(message);
    case "INVALID_GROUP_NAME":
      return new InvalidGroupNameError(message);
    case "INVALID_BUDGET_LIMIT":
      return new InvalidBudgetLimitError(message);
    case "CANNOT_REMOVE_ADMIN":
      return new CannotRemoveAdminError(message);
    case "CANNOT_DELETE_AFTER_RAFFLE":
      return new CannotDeleteAfterRaffleError(message);
    default:
      // Return a generic error for unknown codes
      return new GroupNotFoundError(
        message || "An unknown group error occurred",
      );
  }
}
