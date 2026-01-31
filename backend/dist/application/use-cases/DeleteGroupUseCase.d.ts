/**
 * DeleteGroupUseCase
 * Use case for deleting a group
 */
import { IGroupRepository } from "../../ports/IGroupRepository";
/**
 * Deletes a group
 * Only the group admin can delete the group
 * Cannot delete after raffle has been completed
 */
export declare class DeleteGroupUseCase {
    private readonly groupRepository;
    constructor(groupRepository: IGroupRepository);
    /**
     * Executes the use case
     * @param groupId - Group unique identifier
     * @param requesterId - User making the request (must be admin)
     * @throws GroupNotFoundError if group doesn't exist
     * @throws NotGroupAdminError if requester is not the admin
     * @throws CannotDeleteAfterRaffleError if raffle has been completed
     */
    execute(groupId: string, requesterId: string): Promise<void>;
}
//# sourceMappingURL=DeleteGroupUseCase.d.ts.map