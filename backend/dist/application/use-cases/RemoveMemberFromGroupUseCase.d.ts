/**
 * RemoveMemberFromGroupUseCase
 * Use case for removing a member from a group
 */
import { IGroupRepository } from "../../ports/IGroupRepository";
import { RemoveMemberDTO, GroupResponseDTO } from "../dto/GroupDTOs";
/**
 * Removes a member from a group
 * Only the group admin can remove members
 */
export declare class RemoveMemberFromGroupUseCase {
    private readonly groupRepository;
    constructor(groupRepository: IGroupRepository);
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
    execute(dto: RemoveMemberDTO): Promise<GroupResponseDTO>;
}
//# sourceMappingURL=RemoveMemberFromGroupUseCase.d.ts.map