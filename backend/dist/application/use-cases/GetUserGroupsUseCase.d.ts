/**
 * GetUserGroupsUseCase
 * Use case for retrieving all groups a user belongs to
 */
import { IGroupRepository } from "../../ports/IGroupRepository";
import { GroupSummaryDTO } from "../dto/GroupDTOs";
/**
 * Retrieves all groups where the user is a member
 */
export declare class GetUserGroupsUseCase {
    private readonly groupRepository;
    constructor(groupRepository: IGroupRepository);
    /**
     * Executes the use case
     * @param userId - User unique identifier
     * @returns Array of group summary DTOs
     */
    execute(userId: string): Promise<GroupSummaryDTO[]>;
}
//# sourceMappingURL=GetUserGroupsUseCase.d.ts.map