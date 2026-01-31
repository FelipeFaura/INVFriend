/**
 * GetMyAssignmentUseCase
 * Use case for getting a user's Secret Santa assignment in a group
 */
import { IGroupRepository } from "../../ports/IGroupRepository";
import { IAssignmentRepository } from "../../ports/IAssignmentRepository";
import {
  GroupNotFoundError,
  NotGroupMemberError,
} from "../../domain/errors/GroupErrors";

/**
 * Input DTO for getting assignment
 */
export interface GetMyAssignmentDTO {
  /** Group ID to get assignment for */
  groupId: string;
  /** User ID of the requester */
  userId: string;
}

/**
 * Output DTO for assignment result
 */
export interface AssignmentResultDTO {
  /** Assignment ID */
  id: string;
  /** Group ID */
  groupId: string;
  /** User ID who receives the gift (the person you're giving a gift to) */
  receiverId: string;
  /** Timestamp when assignment was created */
  createdAt: number;
}

/**
 * Error thrown when raffle hasn't been completed
 */
export class RaffleNotCompletedError extends Error {
  constructor(
    message: string = "Raffle has not been completed for this group",
  ) {
    super(message);
    this.name = "RaffleNotCompletedError";
  }
}

/**
 * Error thrown when assignment is not found
 */
export class AssignmentNotFoundError extends Error {
  constructor(message: string = "Assignment not found") {
    super(message);
    this.name = "AssignmentNotFoundError";
  }
}

/**
 * Use case for getting a user's Secret Santa assignment
 * Returns who the user needs to give a gift to
 */
export class GetMyAssignmentUseCase {
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly assignmentRepository: IAssignmentRepository,
  ) {}

  /**
   * Gets the user's assignment in a group
   * @param dto - Input data
   * @returns Assignment showing who to give a gift to
   * @throws GroupNotFoundError if group doesn't exist
   * @throws NotGroupMemberError if user is not a member
   * @throws RaffleNotCompletedError if raffle hasn't been done
   * @throws AssignmentNotFoundError if no assignment exists
   */
  async execute(dto: GetMyAssignmentDTO): Promise<AssignmentResultDTO> {
    // Fetch the group
    const group = await this.groupRepository.findById(dto.groupId);
    if (!group) {
      throw new GroupNotFoundError(dto.groupId);
    }

    // Verify user is a member
    if (!group.isMember(dto.userId)) {
      throw new NotGroupMemberError();
    }

    // Check raffle is completed
    if (group.raffleStatus !== "completed") {
      throw new RaffleNotCompletedError();
    }

    // Get the assignment where user is the secret santa
    const assignment =
      await this.assignmentRepository.findByGroupAndSecretSanta(
        dto.groupId,
        dto.userId,
      );

    if (!assignment) {
      throw new AssignmentNotFoundError(
        "Your assignment could not be found. Please contact the group admin.",
      );
    }

    return {
      id: assignment.id,
      groupId: assignment.groupId,
      receiverId: assignment.receiverId,
      createdAt: assignment.createdAt,
    };
  }
}
