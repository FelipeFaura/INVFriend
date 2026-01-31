"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMemberToGroupUseCase = void 0;
const GroupErrors_1 = require("../../domain/errors/GroupErrors");
const CreateGroupUseCase_1 = require("./CreateGroupUseCase");
/**
 * Adds a new member to a group
 * Only the group admin can add members
 */
class AddMemberToGroupUseCase {
    constructor(groupRepository) {
        this.groupRepository = groupRepository;
    }
    /**
     * Executes the use case
     * @param dto - Add member data
     * @returns Updated group response DTO
     * @throws GroupNotFoundError if group doesn't exist
     * @throws NotGroupAdminError if requester is not the admin
     * @throws AlreadyGroupMemberError if user is already a member
     * @throws RaffleAlreadyCompletedError if raffle has been completed
     */
    async execute(dto) {
        const group = await this.groupRepository.findById(dto.groupId);
        if (!group) {
            throw new GroupErrors_1.GroupNotFoundError(dto.groupId);
        }
        // Verify requester is the admin
        if (!group.isAdmin(dto.requesterId)) {
            throw new GroupErrors_1.NotGroupAdminError("Only the group admin can add members");
        }
        // Add the member (validation happens in the entity)
        const updatedGroup = group.addMember(dto.userId);
        // Persist the changes
        await this.groupRepository.update(updatedGroup);
        return (0, CreateGroupUseCase_1.toResponseDTO)(updatedGroup);
    }
}
exports.AddMemberToGroupUseCase = AddMemberToGroupUseCase;
//# sourceMappingURL=AddMemberToGroupUseCase.js.map