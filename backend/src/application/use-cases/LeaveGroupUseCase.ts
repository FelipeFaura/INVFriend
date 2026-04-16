/**
 * LeaveGroupUseCase
 * Use case for a member leaving a group
 */
import { IGroupRepository } from "../../ports/IGroupRepository";
import { GroupResponseDTO } from "../dto/GroupDTOs";
import { toResponseDTO } from "./CreateGroupUseCase";
import {
  GroupNotFoundError,
  NotGroupMemberError,
  NotGroupAdminError,
  RaffleAlreadyCompletedError,
} from "../../domain/errors/GroupErrors";

/**
 * Allows a non-admin member to leave a group before the raffle is completed
 */
export class LeaveGroupUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  /**
   * Executes the use case
   * @param groupId - Group unique identifier
   * @param requesterId - User requesting to leave
   * @returns Updated group response DTO
   * @throws GroupNotFoundError if group doesn't exist
   * @throws NotGroupMemberError if requester is not a member
   * @throws NotGroupAdminError if requester is the admin
   * @throws RaffleAlreadyCompletedError if raffle has been completed
   */
  async execute(groupId: string, requesterId: string): Promise<GroupResponseDTO> {
    const group = await this.groupRepository.findById(groupId);

    if (!group) {
      throw new GroupNotFoundError(groupId);
    }

    if (!group.isMember(requesterId)) {
      throw new NotGroupMemberError();
    }

    if (group.isAdmin(requesterId)) {
      throw new NotGroupAdminError("Group admin cannot leave the group");
    }

    if (group.raffleStatus === "completed") {
      throw new RaffleAlreadyCompletedError(
        "Cannot leave group after raffle has been completed",
      );
    }

    const updatedGroup = group.removeMember(requesterId);
    await this.groupRepository.update(updatedGroup);

    return toResponseDTO(updatedGroup);
  }
}
