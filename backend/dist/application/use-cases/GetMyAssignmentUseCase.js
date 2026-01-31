"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMyAssignmentUseCase = exports.AssignmentNotFoundError = exports.RaffleNotCompletedError = void 0;
const GroupErrors_1 = require("../../domain/errors/GroupErrors");
/**
 * Error thrown when raffle hasn't been completed
 */
class RaffleNotCompletedError extends Error {
    constructor(message = "Raffle has not been completed for this group") {
        super(message);
        this.name = "RaffleNotCompletedError";
    }
}
exports.RaffleNotCompletedError = RaffleNotCompletedError;
/**
 * Error thrown when assignment is not found
 */
class AssignmentNotFoundError extends Error {
    constructor(message = "Assignment not found") {
        super(message);
        this.name = "AssignmentNotFoundError";
    }
}
exports.AssignmentNotFoundError = AssignmentNotFoundError;
/**
 * Use case for getting a user's Secret Santa assignment
 * Returns who the user needs to give a gift to
 */
class GetMyAssignmentUseCase {
    constructor(groupRepository, assignmentRepository) {
        this.groupRepository = groupRepository;
        this.assignmentRepository = assignmentRepository;
    }
    /**
     * Gets the user's assignment in a group
     * @param dto - Input data
     * @returns Assignment showing who to give a gift to
     * @throws GroupNotFoundError if group doesn't exist
     * @throws NotGroupMemberError if user is not a member
     * @throws RaffleNotCompletedError if raffle hasn't been done
     * @throws AssignmentNotFoundError if no assignment exists
     */
    async execute(dto) {
        // Fetch the group
        const group = await this.groupRepository.findById(dto.groupId);
        if (!group) {
            throw new GroupErrors_1.GroupNotFoundError(dto.groupId);
        }
        // Verify user is a member
        if (!group.isMember(dto.userId)) {
            throw new GroupErrors_1.NotGroupMemberError();
        }
        // Check raffle is completed
        if (group.raffleStatus !== "completed") {
            throw new RaffleNotCompletedError();
        }
        // Get the assignment where user is the secret santa
        const assignment = await this.assignmentRepository.findByGroupAndSecretSanta(dto.groupId, dto.userId);
        if (!assignment) {
            throw new AssignmentNotFoundError("Your assignment could not be found. Please contact the group admin.");
        }
        return {
            id: assignment.id,
            groupId: assignment.groupId,
            receiverId: assignment.receiverId,
            createdAt: assignment.createdAt,
        };
    }
}
exports.GetMyAssignmentUseCase = GetMyAssignmentUseCase;
//# sourceMappingURL=GetMyAssignmentUseCase.js.map