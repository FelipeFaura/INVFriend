"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGroupDetailsUseCase = void 0;
const GroupErrors_1 = require("../../domain/errors/GroupErrors");
const CreateGroupUseCase_1 = require("./CreateGroupUseCase");
/**
 * Retrieves detailed information about a group
 * Only group members can view group details
 */
class GetGroupDetailsUseCase {
    constructor(groupRepository) {
        this.groupRepository = groupRepository;
    }
    /**
     * Executes the use case
     * @param groupId - Group unique identifier
     * @param requesterId - User requesting the details (must be member)
     * @returns Group response DTO
     * @throws GroupNotFoundError if group doesn't exist
     * @throws NotGroupMemberError if requester is not a member
     */
    async execute(groupId, requesterId) {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw new GroupErrors_1.GroupNotFoundError(groupId);
        }
        // Verify requester is a member
        if (!group.isMember(requesterId)) {
            throw new GroupErrors_1.NotGroupMemberError("You must be a member to view group details");
        }
        return (0, CreateGroupUseCase_1.toResponseDTO)(group);
    }
}
exports.GetGroupDetailsUseCase = GetGroupDetailsUseCase;
//# sourceMappingURL=GetGroupDetailsUseCase.js.map