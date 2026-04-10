/**
 * AcceptInvitationUseCase
 * Use case for accepting a pending group invitation
 */
import { IGroupRepository } from "../../ports/IGroupRepository";
import { GroupResponseDTO } from "../dto/GroupDTOs";
import { GroupNotFoundError } from "../../domain/errors/GroupErrors";
import { toResponseDTO } from "./CreateGroupUseCase";

export class AcceptInvitationUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  /**
   * Accepts a group invitation, moving the user from pendingMembers to members
   * @param groupId - The group to accept the invitation for
   * @param userId - The user accepting the invitation
   * @returns Updated group response DTO
   * @throws GroupNotFoundError if the group does not exist
   * @throws NotPendingMemberError if the user is not in pendingMembers
   */
  async execute(groupId: string, userId: string): Promise<GroupResponseDTO> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) throw new GroupNotFoundError(groupId);

    const updatedGroup = group.acceptInvitation(userId);
    await this.groupRepository.update(updatedGroup);

    return toResponseDTO(updatedGroup);
  }
}
