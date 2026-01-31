/**
 * DeleteGroupUseCase
 * Use case for deleting a group
 */
import { IGroupRepository } from "../../ports/IGroupRepository";
import {
  GroupNotFoundError,
  NotGroupAdminError,
  CannotDeleteAfterRaffleError,
} from "../../domain/errors/GroupErrors";

/**
 * Deletes a group
 * Only the group admin can delete the group
 * Cannot delete after raffle has been completed
 */
export class DeleteGroupUseCase {
  constructor(private readonly groupRepository: IGroupRepository) {}

  /**
   * Executes the use case
   * @param groupId - Group unique identifier
   * @param requesterId - User making the request (must be admin)
   * @throws GroupNotFoundError if group doesn't exist
   * @throws NotGroupAdminError if requester is not the admin
   * @throws CannotDeleteAfterRaffleError if raffle has been completed
   */
  async execute(groupId: string, requesterId: string): Promise<void> {
    const group = await this.groupRepository.findById(groupId);

    if (!group) {
      throw new GroupNotFoundError(groupId);
    }

    // Verify requester is the admin
    if (!group.isAdmin(requesterId)) {
      throw new NotGroupAdminError("Only the group admin can delete the group");
    }

    // Verify raffle has not been completed
    if (group.raffleStatus === "completed") {
      throw new CannotDeleteAfterRaffleError();
    }

    // Delete the group
    await this.groupRepository.delete(groupId);
  }
}
