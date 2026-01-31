/**
 * GetUserGroupsUseCase
 * Use case for retrieving all groups a user belongs to
 */
import { IGroupRepository } from "../../ports/IGroupRepository";
import { GroupSummaryDTO } from "../dto/GroupDTOs";

/**
 * Retrieves all groups where the user is a member
 */
export class GetUserGroupsUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  /**
   * Executes the use case
   * @param userId - User unique identifier
   * @returns Array of group summary DTOs
   */
  async execute(userId: string): Promise<GroupSummaryDTO[]> {
    const groups = await this.groupRepository.findByMemberId(userId);

    return groups.map((group) => ({
      id: group.id,
      name: group.name,
      description: group.description,
      memberCount: group.members.length,
      budgetLimit: group.budgetLimit,
      raffleStatus: group.raffleStatus,
      isAdmin: group.isAdmin(userId),
    }));
  }
}
