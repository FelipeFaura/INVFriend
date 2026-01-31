/**
 * UpdateGroupUseCase
 * Use case for updating group information
 */
import { IGroupRepository } from "../../ports/IGroupRepository";
import { UpdateGroupDTO, GroupResponseDTO } from "../dto/GroupDTOs";
/**
 * Updates group information
 * Only the group admin can update the group
 */
export declare class UpdateGroupUseCase {
    private readonly groupRepository;
    constructor(groupRepository: IGroupRepository);
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
    execute(groupId: string, dto: UpdateGroupDTO, requesterId: string): Promise<GroupResponseDTO>;
}
//# sourceMappingURL=UpdateGroupUseCase.d.ts.map