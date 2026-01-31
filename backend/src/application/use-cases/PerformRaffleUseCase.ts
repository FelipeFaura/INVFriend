/**
 * PerformRaffleUseCase
 * Use case for executing the Secret Santa raffle for a group
 */
import { Group } from "../../domain/entities/Group";
import { Assignment } from "../../domain/entities/Assignment";
import { IGroupRepository } from "../../ports/IGroupRepository";
import { IAssignmentRepository } from "../../ports/IAssignmentRepository";
import {
  GroupNotFoundError,
  NotGroupAdminError,
} from "../../domain/errors/GroupErrors";
import { performRaffle } from "../../shared/utils/raffleAlgorithm";

/**
 * Input DTO for performing a raffle
 */
export interface PerformRaffleDTO {
  /** Group ID to perform raffle for */
  groupId: string;
  /** User ID of the requester (must be admin) */
  requesterId: string;
}

/**
 * Output DTO for raffle result
 */
export interface RaffleResultDTO {
  /** Group ID */
  groupId: string;
  /** Timestamp when raffle was performed */
  raffleDate: number;
  /** Number of assignments created */
  assignmentCount: number;
}

/**
 * Error thrown when raffle fails
 */
export class RaffleFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RaffleFailedError";
  }
}

/**
 * Use case for executing a Secret Santa raffle
 *
 * Business Rules:
 * - Only admin can perform raffle
 * - Minimum 2 members required
 * - Cannot raffle if already completed
 * - Updates group status to 'completed'
 * - Stores all assignments atomically
 */
export class PerformRaffleUseCase {
  constructor(
    private readonly groupRepository: IGroupRepository,
    private readonly assignmentRepository: IAssignmentRepository,
  ) {}

  /**
   * Executes the raffle for a group
   * @param dto - Raffle input data
   * @returns Raffle result with assignment count
   * @throws GroupNotFoundError if group doesn't exist
   * @throws NotGroupAdminError if requester is not admin
   * @throws RaffleAlreadyCompletedError if raffle was already done
   * @throws NotEnoughMembersError if less than 2 members
   * @throws RaffleFailedError if algorithm fails
   */
  async execute(dto: PerformRaffleDTO): Promise<RaffleResultDTO> {
    // Fetch the group
    const group = await this.groupRepository.findById(dto.groupId);
    if (!group) {
      throw new GroupNotFoundError(dto.groupId);
    }

    // Verify requester is admin
    if (group.adminId !== dto.requesterId) {
      throw new NotGroupAdminError(
        "Only the group admin can perform the raffle",
      );
    }

    // Check if raffle already completed (throws RaffleAlreadyCompletedError)
    // The Group entity's performRaffle method handles this validation
    // Let's validate first before running the algorithm
    if (group.raffleStatus === "completed") {
      const { RaffleAlreadyCompletedError } =
        await import("../../domain/errors/GroupErrors");
      throw new RaffleAlreadyCompletedError(
        "Raffle has already been completed",
      );
    }

    // Check minimum members (Group entity validates this too)
    if (group.members.length < Group.MIN_MEMBERS_FOR_RAFFLE) {
      const { NotEnoughMembersError } =
        await import("../../domain/errors/GroupErrors");
      throw new NotEnoughMembersError(Group.MIN_MEMBERS_FOR_RAFFLE);
    }

    // Run the raffle algorithm
    const raffleResult = performRaffle(group.members);
    if (!raffleResult.success) {
      throw new RaffleFailedError(
        raffleResult.error || "Raffle algorithm failed",
      );
    }

    // Create Assignment entities
    const assignments: Assignment[] = raffleResult.assignments.map(
      (assignment) =>
        Assignment.create(
          this.assignmentRepository.generateId(),
          dto.groupId,
          assignment.receiverId,
          assignment.secretSantaId,
        ),
    );

    // Store assignments atomically
    await this.assignmentRepository.createBatch(assignments);

    // Update group status to completed
    const updatedGroup = group.completeRaffle();
    await this.groupRepository.update(updatedGroup);

    return {
      groupId: dto.groupId,
      raffleDate: updatedGroup.raffleDate!,
      assignmentCount: assignments.length,
    };
  }
}
