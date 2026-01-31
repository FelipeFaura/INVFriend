/**
 * UpdateGroupUseCase
 * Use case for updating group information
 */
import { IGroupRepository } from "../../ports/IGroupRepository";
import { UpdateGroupDTO, GroupResponseDTO } from "../dto/GroupDTOs";
import {
  GroupNotFoundError,
  NotGroupAdminError,
} from "../../domain/errors/GroupErrors";
import { toResponseDTO } from "./CreateGroupUseCase";

/**
 * Updates group information
 * Only the group admin can update the group
 */
export class UpdateGroupUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  /**
   * Executes the use case
   * @param groupId - Group unique identifier
   * @param dto - Update data
   * @param requesterId - User making the request (must be admin)
   * @returns Updated group response DTO
   * @throws GroupNotFoundError if group doesn't exist
   * @throws NotGroupAdminError if requester is not the admin
   * @throws InvalidGroupNameError if new name is invalid
   * @throws InvalidBudgetLimitError if new budget is invalid
   */
  async execute(
    groupId: string,
    dto: UpdateGroupDTO,
    requesterId: string,
  ): Promise<GroupResponseDTO> {
    const group = await this.groupRepository.findById(groupId);

    if (!group) {
      throw new GroupNotFoundError(groupId);
    }

    // Verify requester is the admin
    if (!group.isAdmin(requesterId)) {
      throw new NotGroupAdminError("Only the group admin can update the group");
    }

    // Update the group (validation happens in the entity)
    const updatedGroup = group.update(
      dto.name,
      dto.description,
      dto.budgetLimit,
    );

    // Persist the changes
    await this.groupRepository.update(updatedGroup);

    return toResponseDTO(updatedGroup);
  }
}
