"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddWishUseCase = exports.GroupNotFoundError = exports.NotGroupMemberError = void 0;
/**
 * Add Wish Use Case
 * Creates a new wish for a user in a group
 */
const Wish_1 = require("../../domain/entities/Wish");
class NotGroupMemberError extends Error {
    constructor(message = "User is not a member of this group") {
        super(message);
        this.name = "NotGroupMemberError";
    }
}
exports.NotGroupMemberError = NotGroupMemberError;
class GroupNotFoundError extends Error {
    constructor(message = "Group not found") {
        super(message);
        this.name = "GroupNotFoundError";
    }
}
exports.GroupNotFoundError = GroupNotFoundError;
class AddWishUseCase {
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
        // Create wish
        const wishId = this.generateWishId();
        const wish = Wish_1.Wish.create({
            id: wishId,
            groupId: request.groupId,
            userId: request.userId,
            title: request.title,
            description: request.description,
            url: request.url,
            estimatedPrice: request.estimatedPrice,
            priority: request.priority,
        });
        // Save to repository
        await this.wishRepository.save(wish);
        return {
            id: wish.id,
            groupId: wish.groupId,
            userId: wish.userId,
            title: wish.title,
            description: wish.description,
            url: wish.url,
            estimatedPrice: wish.estimatedPrice,
            priority: wish.priority,
            createdAt: wish.createdAt,
        };
    }
    generateWishId() {
        return `wish_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
}
exports.AddWishUseCase = AddWishUseCase;
//# sourceMappingURL=AddWishUseCase.js.map