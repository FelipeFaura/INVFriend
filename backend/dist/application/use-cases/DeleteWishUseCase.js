"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteWishUseCase = exports.NotWishOwnerError = exports.WishNotFoundError = void 0;
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
class DeleteWishUseCase {
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
        // Delete wish
        await this.wishRepository.delete(request.wishId);
    }
}
exports.DeleteWishUseCase = DeleteWishUseCase;
//# sourceMappingURL=DeleteWishUseCase.js.map