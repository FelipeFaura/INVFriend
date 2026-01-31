"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteGroupUseCase = void 0;
const GroupErrors_1 = require("../../domain/errors/GroupErrors");
/**
 * Deletes a group
 * Only the group admin can delete the group
 * Cannot delete after raffle has been completed
 */
class DeleteGroupUseCase {
    constructor(groupRepository) {
        this.groupRepository = groupRepository;
    }
    /**
     * Executes the use case
     * @param groupId - Group unique identifier
     * @param requesterId - User making the request (must be admin)
     * @throws GroupNotFoundError if group doesn't exist
     * @throws NotGroupAdminError if requester is not the admin
     * @throws CannotDeleteAfterRaffleError if raffle has been completed
     */
    async execute(groupId, requesterId) {
        const group = await this.groupRepository.findById(groupId);
        if (!group) {
            throw new GroupErrors_1.GroupNotFoundError(groupId);
        }
        // Verify requester is the admin
        if (!group.isAdmin(requesterId)) {
            throw new GroupErrors_1.NotGroupAdminError("Only the group admin can delete the group");
        }
        // Verify raffle has not been completed
        if (group.raffleStatus === "completed") {
            throw new GroupErrors_1.CannotDeleteAfterRaffleError();
        }
        // Delete the group
        await this.groupRepository.delete(groupId);
    }
}
exports.DeleteGroupUseCase = DeleteGroupUseCase;
//# sourceMappingURL=DeleteGroupUseCase.js.map