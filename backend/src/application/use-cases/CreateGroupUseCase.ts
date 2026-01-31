/**
 * CreateGroupUseCase
 * Use case for creating a new Secret Santa group
 */
import { Group } from "../../domain/entities/Group";
import { IGroupRepository } from "../../ports/IGroupRepository";
import { CreateGroupDTO, GroupResponseDTO } from "../dto/GroupDTOs";

/**
 * Transforms a Group entity to a response DTO
 */
function toResponseDTO(group: Group): GroupResponseDTO {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    adminId: group.adminId,
    members: [...group.members],
    budgetLimit: group.budgetLimit,
    raffleStatus: group.raffleStatus,
    raffleDate: group.raffleDate,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
  };
}

export { toResponseDTO };

/**
 * Creates a new group with the requester as admin
 */
export class CreateGroupUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  /**
   * Executes the use case
   * @param dto - Group creation data
   * @returns Created group response DTO
   * @throws InvalidGroupNameError if name is invalid
   * @throws InvalidBudgetLimitError if budget is invalid
   */
  async execute(dto: CreateGroupDTO): Promise<GroupResponseDTO> {
    // Generate a new ID for the group
    const groupId = this.groupRepository.generateId();

    // Create the group entity (validates name and budget)
    const group = Group.create(
      groupId,
      dto.name,
      dto.adminId,
      dto.budgetLimit,
      dto.description,
    );

    // Persist the group
    const createdGroup = await this.groupRepository.create(group);

    return toResponseDTO(createdGroup);
  }
}
