"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSecretSantaWishesUseCase = exports.AssignmentNotFoundError = exports.RaffleNotCompletedError = exports.NotGroupMemberError = exports.GroupNotFoundError = void 0;
class GroupNotFoundError extends Error {
    constructor(message = "Group not found") {
        super(message);
        this.name = "GroupNotFoundError";
    }
}
exports.GroupNotFoundError = GroupNotFoundError;
class NotGroupMemberError extends Error {
    constructor(message = "User is not a member of this group") {
        super(message);
        this.name = "NotGroupMemberError";
    }
}
exports.NotGroupMemberError = NotGroupMemberError;
class RaffleNotCompletedError extends Error {
    constructor(message = "Raffle has not been completed for this group") {
        super(message);
        this.name = "RaffleNotCompletedError";
    }
}
exports.RaffleNotCompletedError = RaffleNotCompletedError;
class AssignmentNotFoundError extends Error {
    constructor(message = "Assignment not found") {
        super(message);
        this.name = "AssignmentNotFoundError";
    }
}
exports.AssignmentNotFoundError = AssignmentNotFoundError;
class GetSecretSantaWishesUseCase {
    constructor(wishRepository, groupRepository, assignmentRepository) {
        this.wishRepository = wishRepository;
        this.groupRepository = groupRepository;
        this.assignmentRepository = assignmentRepository;
    }
    async execute(request) {
        // Validate group exists
        const group = await this.groupRepository.findById(request.groupId);
        if (!group) {
            throw new GroupNotFoundError();
        }
        // Validate user is a member
        if (!group.isMember(request.userId)) {
            throw new NotGroupMemberError();
        }
        // Validate raffle is completed
        if (group.raffleStatus !== "completed") {
            throw new RaffleNotCompletedError();
        }
        // Get user's assignment (who they give a gift to)
        const assignment = await this.assignmentRepository.findByGroupAndSecretSanta(request.groupId, request.userId);
        if (!assignment) {
            throw new AssignmentNotFoundError();
        }
        // Get wishes for the assigned recipient
        const wishes = await this.wishRepository.findByUserInGroup(assignment.receiverId, request.groupId);
        // Return wishes without exposing who the user ID is (for privacy)
        return wishes.map((wish) => ({
            id: wish.id,
            title: wish.title,
            description: wish.description,
            url: wish.url,
            estimatedPrice: wish.estimatedPrice,
            priority: wish.priority,
        }));
    }
}
exports.GetSecretSantaWishesUseCase = GetSecretSantaWishesUseCase;
//# sourceMappingURL=GetSecretSantaWishesUseCase.js.map