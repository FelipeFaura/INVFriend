/**
 * AddMemberToGroupUseCase
 * Use case for adding a member to a group
 */
import { IGroupRepository } from "../../ports/IGroupRepository";
import { AddMemberDTO, GroupResponseDTO } from "../dto/GroupDTOs";
import {
  GroupNotFoundError,
  NotGroupAdminError,
} from "../../domain/errors/GroupErrors";
import { toResponseDTO } from "./CreateGroupUseCase";

/**
 * Adds a new member to a group
 * Only the group admin can add members
 */
export class AddMemberToGroupUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  /**
   * Executes the use case
   * @param dto - Add member data
   * @returns Updated group response DTO
   * @throws GroupNotFoundError if group doesn't exist
   * @throws NotGroupAdminError if requester is not the admin
   * @throws AlreadyGroupMemberError if user is already a member
   * @throws RaffleAlreadyCompletedError if raffle has been completed
   */
  async execute(dto: AddMemberDTO): Promise<GroupResponseDTO> {
    const group = await this.groupRepository.findById(dto.groupId);

    if (!group) {
      throw new GroupNotFoundError(dto.groupId);
    }

    // Verify requester is the admin
    if (!group.isAdmin(dto.requesterId)) {
      throw new NotGroupAdminError("Only the group admin can add members");
    }

    // Add the member (validation happens in the entity)
    const updatedGroup = group.addMember(dto.userId);

    // Persist the changes
    await this.groupRepository.update(updatedGroup);

    return toResponseDTO(updatedGroup);
  }
}
