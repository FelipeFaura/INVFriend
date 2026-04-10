/**
 * RejectInvitationUseCase
 * Use case for rejecting a pending group invitation
 */
import { IGroupRepository } from "../../ports/IGroupRepository";
import { GroupNotFoundError } from "../../domain/errors/GroupErrors";

export class RejectInvitationUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  /**
   * Rejects a group invitation, removing the user from pendingMembers
   * @param groupId - The group to reject the invitation for
   * @param userId - The user rejecting the invitation
   * @throws GroupNotFoundError if the group does not exist
   * @throws NotPendingMemberError if the user is not in pendingMembers
   */
  async execute(groupId: string, userId: string): Promise<void> {
    const group = await this.groupRepository.findById(groupId);
    if (!group) throw new GroupNotFoundError(groupId);

    const updatedGroup = group.rejectInvitation(userId);
    await this.groupRepository.update(updatedGroup);
  }
}
