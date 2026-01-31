"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserGroupsUseCase = void 0;
/**
 * Retrieves all groups where the user is a member
 */
class GetUserGroupsUseCase {
    constructor(groupRepository) {
        this.groupRepository = groupRepository;
    }
    /**
     * Executes the use case
     * @param userId - User unique identifier
     * @returns Array of group summary DTOs
     */
    async execute(userId) {
        const groups = await this.groupRepository.findByMemberId(userId);
        return groups.map((group) => ({
            id: group.id,
            name: group.name,
            description: group.description,
            memberCount: group.members.length,
            budgetLimit: group.budgetLimit,
            raffleStatus: group.raffleStatus,
            isAdmin: group.isAdmin(userId),
        }));
    }
}
exports.GetUserGroupsUseCase = GetUserGroupsUseCase;
//# sourceMappingURL=GetUserGroupsUseCase.js.map