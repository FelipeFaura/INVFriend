"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWishUseCase = exports.NotWishOwnerError = exports.WishNotFoundError = void 0;
class WishNotFoundError extends Error {
    constructor(message = "Wish not found") {
        super(message);
        this.name = "WishNotFoundError";
    }
}
exports.WishNotFoundError = WishNotFoundError;
class NotWishOwnerError extends Error {
    constructor(message = "User is not the owner of this wish") {
        super(message);
        this.name = "NotWishOwnerError";
    }
}
exports.NotWishOwnerError = NotWishOwnerError;
class UpdateWishUseCase {
    constructor(wishRepository) {
        this.wishRepository = wishRepository;
    }
    async execute(request) {
        // Find the wish
        const wish = await this.wishRepository.findById(request.wishId);
        if (!wish) {
            throw new WishNotFoundError();
        }
        // Validate ownership
        if (!wish.belongsToUser(request.userId)) {
            throw new NotWishOwnerError();
        }
        // Update wish
        const updatedWish = wish.update({
            title: request.title,
            description: request.description,
            url: request.url,
            estimatedPrice: request.estimatedPrice,
            priority: request.priority,
        });
        // Save to repository
        await this.wishRepository.update(updatedWish);
        return {
            id: updatedWish.id,
            title: updatedWish.title,
            description: updatedWish.description,
            url: updatedWish.url,
            estimatedPrice: updatedWish.estimatedPrice,
            priority: updatedWish.priority,
            updatedAt: updatedWish.updatedAt,
        };
    }
}
exports.UpdateWishUseCase = UpdateWishUseCase;
//# sourceMappingURL=UpdateWishUseCase.js.map