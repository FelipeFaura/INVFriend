"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGroupUseCase = void 0;
const GroupErrors_1 = require("../../domain/errors/GroupErrors");
const CreateGroupUseCase_1 = require("./CreateGroupUseCase");
/**
 * Updates group information
 * Only the group admin can update the group
 */
class UpdateGroupUseCase {
    constructor(groupRepository) {
        this.groupRepository = groupRepository;
    }
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
    async execute(groupId, dto, requesterId) {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw new GroupErrors_1.GroupNotFoundError(groupId);
        }
        // Verify requester is the admin
        if (!group.isAdmin(requesterId)) {
            throw new GroupErrors_1.NotGroupAdminError("Only the group admin can update the group");
        }
        // Update the group (validation happens in the entity)
        const updatedGroup = group.update(dto.name, dto.description, dto.budgetLimit);
        // Persist the changes
        await this.groupRepository.update(updatedGroup);
        return (0, CreateGroupUseCase_1.toResponseDTO)(updatedGroup);
    }
}
exports.UpdateGroupUseCase = UpdateGroupUseCase;
//# sourceMappingURL=UpdateGroupUseCase.js.map