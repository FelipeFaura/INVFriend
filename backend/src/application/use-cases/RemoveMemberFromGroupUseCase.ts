/**
 * RemoveMemberFromGroupUseCase
 * Use case for removing a member from a group
 */
import { IGroupRepository } from "../../ports/IGroupRepository";
import { RemoveMemberDTO, GroupResponseDTO } from "../dto/GroupDTOs";
import {
  GroupNotFoundError,
  NotGroupAdminError,
} from "../../domain/errors/GroupErrors";
import { toResponseDTO } from "./CreateGroupUseCase";

/**
 * Removes a member from a group
 * Only the group admin can remove members
 */
export class RemoveMemberFromGroupUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  /**
   * Executes the use case
   * @param dto - Remove member data
   * @returns Updated group response DTO
   * @throws GroupNotFoundError if group doesn't exist
   * @throws NotGroupAdminError if requester is not the admin
   * @throws CannotRemoveAdminError if trying to remove the admin
   * @throws NotGroupMemberError if user is not a member
   * @throws RaffleAlreadyCompletedError if raffle has been completed
   */
  async execute(dto: RemoveMemberDTO): Promise<GroupResponseDTO> {
    const group = await this.groupRepository.findById(dto.groupId);

    if (!group) {
      throw new GroupNotFoundError(dto.groupId);
    }

    // Verify requester is the admin
    if (!group.isAdmin(dto.requesterId)) {
      throw new NotGroupAdminError("Only the group admin can remove members");
    }

    // Remove the member (validation happens in the entity)
    const updatedGroup = group.removeMember(dto.userId);

    // Persist the changes
    await this.groupRepository.update(updatedGroup);

    return toResponseDTO(updatedGroup);
  }
}
