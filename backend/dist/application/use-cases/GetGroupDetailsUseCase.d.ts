/**
 * GetGroupDetailsUseCase
 * Use case for retrieving group details
 */
import { IGroupRepository } from "../../ports/IGroupRepository";
import { GroupResponseDTO } from "../dto/GroupDTOs";
/**
 * Retrieves detailed information about a group
 * Only group members can view group details
 */
export declare class GetGroupDetailsUseCase {
    private readonly groupRepository;
    constructor(groupRepository: IGroupRepository);
    /**
     * Executes the use case
     * @param groupId - Group unique identifier
     * @param requesterId - User requesting the details (must be member)
     * @returns Group response DTO
     * @throws GroupNotFoundError if group doesn't exist
     * @throws NotGroupMemberError if requester is not a member
     */
    execute(groupId: string, requesterId: string): Promise<GroupResponseDTO>;
}
//# sourceMappingURL=GetGroupDetailsUseCase.d.ts.map