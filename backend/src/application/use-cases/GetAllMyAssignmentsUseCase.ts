/**
 * GetAllMyAssignmentsUseCase
 * Use case for getting all Secret Santa assignments for a user across all groups
 */
import { IGroupRepository } from "../../ports/IGroupRepository";
import { IAssignmentRepository } from "../../ports/IAssignmentRepository";

/**
 * Input DTO for getting all assignments
 */
export interface GetAllMyAssignmentsDTO {
  /** User ID of the requester */
  userId: string;
}

/**
 * Output DTO for a single enriched assignment
 */
export interface MyAssignmentSummaryDTO {
  /** Assignment ID */
  assignmentId: string;
  /** Group ID */
  groupId: string;
  /** Group name */
  groupName: string;
  /** Group budget limit */
  budgetLimit: number;
  /** User ID who receives the gift */
  receiverId: string;
  /** Timestamp when assignment was created */
  createdAt: number;
}

/**
 * Use case for getting all Secret Santa assignments for a user
 * Returns all assignments where the user is the secret santa, enriched with group info
 */
export class GetAllMyAssignmentsUseCase {
  constructor(
    private readonly assignmentRepository: IAssignmentRepository,
    private readonly groupRepository: IGroupRepository,
  ) {}

  /**
   * Gets all assignments where user is the secret santa, enriched with group details
   * @param dto - Input data with userId
   * @returns Array of assignments with group info (empty if none found)
   */
  async execute(dto: GetAllMyAssignmentsDTO): Promise<MyAssignmentSummaryDTO[]> {
    // Get all assignments involving the user
    const allAssignments = await this.assignmentRepository.findByUserId(dto.userId);

    // Filter to only those where user is the secret santa
    const santaAssignments = allAssignments.filter((a) => a.isSecretSanta(dto.userId));

    if (santaAssignments.length === 0) {
      return [];
    }

    // Enrich each assignment with group details
    const results: MyAssignmentSummaryDTO[] = [];

    for (const assignment of santaAssignments) {
      const group = await this.groupRepository.findById(assignment.groupId);

      // Skip assignments whose group has been deleted
      if (!group) {
        continue;
      }

      results.push({
        assignmentId: assignment.id,
        groupId: assignment.groupId,
        groupName: group.name,
        budgetLimit: group.budgetLimit,
        receiverId: assignment.receiverId,
        createdAt: assignment.createdAt,
      });
    }

    return results;
  }
}
