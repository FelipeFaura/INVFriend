/**
 * Raffle Error Classes
 * Custom error types for raffle operations
 */

/**
 * Base class for all raffle-related errors
 */
export abstract class RaffleError extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * Error when group is not found
 */
export class RaffleGroupNotFoundError extends RaffleError {
  readonly code = "GROUP_NOT_FOUND";

  constructor(message: string = "Group not found") {
    super(message);
  }
}

/**
 * Error when user is not the group admin
 */
export class NotGroupAdminError extends RaffleError {
  readonly code = "NOT_GROUP_ADMIN";

  constructor(
    message: string = "Only the group admin can perform this action",
  ) {
    super(message);
  }
}

/**
 * Error when user is not a group member
 */
export class NotGroupMemberError extends RaffleError {
  readonly code = "NOT_GROUP_MEMBER";

  constructor(message: string = "User is not a member of this group") {
    super(message);
  }
}

/**
 * Error when there are not enough members for raffle
 */
export class NotEnoughMembersError extends RaffleError {
  readonly code = "NOT_ENOUGH_MEMBERS";

  constructor(
    message: string = "At least 2 members are required for a raffle",
  ) {
    super(message);
  }
}

/**
 * Error when raffle has already been completed
 */
export class RaffleAlreadyCompletedError extends RaffleError {
  readonly code = "RAFFLE_ALREADY_COMPLETED";

  constructor(
    message: string = "Raffle has already been completed for this group",
  ) {
    super(message);
  }
}

/**
 * Error when raffle has not been completed yet
 */
export class RaffleNotCompletedError extends RaffleError {
  readonly code = "RAFFLE_NOT_COMPLETED";

  constructor(
    message: string = "Raffle has not been completed for this group",
  ) {
    super(message);
  }
}

/**
 * Error when assignment is not found
 */
export class AssignmentNotFoundError extends RaffleError {
  readonly code = "ASSIGNMENT_NOT_FOUND";

  constructor(message: string = "Assignment not found") {
    super(message);
  }
}

/**
 * Error when raffle algorithm fails
 */
export class RaffleFailedError extends RaffleError {
  readonly code = "RAFFLE_FAILED";

  constructor(message: string = "Failed to perform raffle") {
    super(message);
  }
}

/**
 * Generic raffle error for unknown cases
 */
export class UnknownRaffleError extends RaffleError {
  readonly code = "UNKNOWN_ERROR";

  constructor(message: string = "An unknown error occurred") {
    super(message);
  }
}

/**
 * Factory function to create appropriate error from API response
 */
export function createRaffleErrorFromCode(
  code: string,
  message?: string,
): RaffleError {
  switch (code) {
    case "GROUP_NOT_FOUND":
      return new RaffleGroupNotFoundError(message);
    case "NOT_GROUP_ADMIN":
      return new NotGroupAdminError(message);
    case "NOT_GROUP_MEMBER":
      return new NotGroupMemberError(message);
    case "NOT_ENOUGH_MEMBERS":
      return new NotEnoughMembersError(message);
    case "RAFFLE_ALREADY_COMPLETED":
      return new RaffleAlreadyCompletedError(message);
    case "RAFFLE_NOT_COMPLETED":
      return new RaffleNotCompletedError(message);
    case "ASSIGNMENT_NOT_FOUND":
      return new AssignmentNotFoundError(message);
    case "RAFFLE_FAILED":
      return new RaffleFailedError(message);
    default:
      return new UnknownRaffleError(message || `Unknown error: ${code}`);
  }
}
