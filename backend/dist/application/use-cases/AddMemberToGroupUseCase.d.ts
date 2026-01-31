/**
 * AddMemberToGroupUseCase
 * Use case for adding a member to a group
 */
import { IGroupRepository } from "../../ports/IGroupRepository";
import { AddMemberDTO, GroupResponseDTO } from "../dto/GroupDTOs";
/**
 * Adds a new member to a group
 * Only the group admin can add members
 */
export declare class AddMemberToGroupUseCase {
    private readonly groupRepository;
    constructor(groupRepository: IGroupRepository);
    /**
     * Executes the use case
     * @param dto - Add member data
     * @returns Updated group response DTO
     * @throws GroupNotFoundError if group doesn't exist
     * @throws NotGroupAdminError if requester is not the admin
     * @throws AlreadyGroupMemberError if user is already a member
     * @throws RaffleAlreadyCompletedError if raffle has been completed
     */
    execute(dto: AddMemberDTO): Promise<GroupResponseDTO>;
}
//# sourceMappingURL=AddMemberToGroupUseCase.d.ts.map