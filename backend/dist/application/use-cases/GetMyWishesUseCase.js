"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMyWishesUseCase = exports.NotGroupMemberError = exports.GroupNotFoundError = void 0;
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
class GetMyWishesUseCase {
    constructor(wishRepository, groupRepository) {
        this.wishRepository = wishRepository;
        this.groupRepository = groupRepository;
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
        // Get wishes
        const wishes = await this.wishRepository.findByUserInGroup(request.userId, request.groupId);
        return wishes.map((wish) => ({
            id: wish.id,
            groupId: wish.groupId,
            userId: wish.userId,
            title: wish.title,
            description: wish.description,
            url: wish.url,
            estimatedPrice: wish.estimatedPrice,
            priority: wish.priority,
            createdAt: wish.createdAt,
            updatedAt: wish.updatedAt,
        }));
    }
}
exports.GetMyWishesUseCase = GetMyWishesUseCase;
//# sourceMappingURL=GetMyWishesUseCase.js.map