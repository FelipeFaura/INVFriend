"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishController = void 0;
const use_cases_1 = require("../../../application/use-cases");
const WishErrors_1 = require("../../../domain/errors/WishErrors");
const GroupErrors_1 = require("../../../domain/errors/GroupErrors");
class WishController {
    constructor(wishRepository, groupRepository, assignmentRepository) {
        this.addWishUseCase = new use_cases_1.AddWishUseCase(wishRepository, groupRepository);
        this.updateWishUseCase = new use_cases_1.UpdateWishUseCase(wishRepository);
        this.deleteWishUseCase = new use_cases_1.DeleteWishUseCase(wishRepository);
        this.getMyWishesUseCase = new use_cases_1.GetMyWishesUseCase(wishRepository, groupRepository);
        this.getSecretSantaWishesUseCase = new use_cases_1.GetSecretSantaWishesUseCase(wishRepository, groupRepository, assignmentRepository);
    }
    /**
     * POST /groups/:groupId/wishes
     * Creates a new wish in a group
     */
    async createWish(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: "Unauthorized",
                    code: "UNAUTHORIZED",
                    message: "Authentication required",
                });
                return;
            }
            const { groupId } = req.params;
            const { title, description, url, estimatedPrice, priority } = req.body;
            const result = await this.addWishUseCase.execute({
                groupId,
                userId: req.user.uid,
                title,
                description,
                url,
                estimatedPrice,
                priority,
            });
            res.status(201).json(result);
        }
        catch (error) {
            this.handleWishError(error, res);
        }
    }
    /**
     * GET /groups/:groupId/wishes
     * Gets the authenticated user's wishes in a group
     */
    async getMyWishes(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: "Unauthorized",
                    code: "UNAUTHORIZED",
                    message: "Authentication required",
                });
                return;
            }
            const { groupId } = req.params;
            const wishes = await this.getMyWishesUseCase.execute({
                groupId,
                userId: req.user.uid,
            });
            res.status(200).json({ wishes });
        }
        catch (error) {
            this.handleWishError(error, res);
        }
    }
    /**
     * GET /groups/:groupId/wishes/assigned
     * Gets the wishes of the user's Secret Santa assignment
     */
    async getAssignedWishes(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: "Unauthorized",
                    code: "UNAUTHORIZED",
                    message: "Authentication required",
                });
                return;
            }
            const { groupId } = req.params;
            const wishes = await this.getSecretSantaWishesUseCase.execute({
                groupId,
                userId: req.user.uid,
            });
            res.status(200).json({ wishes });
        }
        catch (error) {
            this.handleWishError(error, res);
        }
    }
    /**
     * PUT /groups/:groupId/wishes/:wishId
     * Updates a wish (owner only)
     */
    async updateWish(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: "Unauthorized",
                    code: "UNAUTHORIZED",
                    message: "Authentication required",
                });
                return;
            }
            const { wishId } = req.params;
            const { title, description, url, estimatedPrice, priority } = req.body;
            const result = await this.updateWishUseCase.execute({
                wishId,
                userId: req.user.uid,
                title,
                description,
                url,
                estimatedPrice,
                priority,
            });
            res.status(200).json(result);
        }
        catch (error) {
            this.handleWishError(error, res);
        }
    }
    /**
     * DELETE /groups/:groupId/wishes/:wishId
     * Deletes a wish (owner only)
     */
    async deleteWish(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: "Unauthorized",
                    code: "UNAUTHORIZED",
                    message: "Authentication required",
                });
                return;
            }
            const { wishId } = req.params;
            await this.deleteWishUseCase.execute({
                wishId,
                userId: req.user.uid,
            });
            res.status(200).json({
                success: true,
                message: "Wish deleted successfully",
            });
        }
        catch (error) {
            this.handleWishError(error, res);
        }
    }
    /**
     * Centralized error handler for wish errors
     */
    handleWishError(error, res) {
        // Validation errors (400)
        if (error instanceof WishErrors_1.InvalidWishTitleError) {
            res.status(400).json({
                error: "Bad Request",
                code: error.code,
                message: error.message,
            });
            return;
        }
        // Authorization errors (403)
        if (error instanceof WishErrors_1.NotWishOwnerError) {
            res.status(403).json({
                error: "Forbidden",
                code: error.code,
                message: error.message,
            });
            return;
        }
        if (error instanceof GroupErrors_1.NotGroupMemberError) {
            res.status(403).json({
                error: "Forbidden",
                code: error.code,
                message: error.message,
            });
            return;
        }
        // Business rule errors (400)
        if (error instanceof WishErrors_1.RaffleNotCompletedError) {
            res.status(400).json({
                error: "Bad Request",
                code: error.code,
                message: error.message,
            });
            return;
        }
        if (error instanceof WishErrors_1.NoAssignmentError) {
            res.status(400).json({
                error: "Bad Request",
                code: error.code,
                message: error.message,
            });
            return;
        }
        // Not found errors (404)
        if (error instanceof WishErrors_1.WishNotFoundError) {
            res.status(404).json({
                error: "Not Found",
                code: error.code,
                message: error.message,
            });
            return;
        }
        if (error instanceof GroupErrors_1.GroupNotFoundError) {
            res.status(404).json({
                error: "Not Found",
                code: error.code,
                message: error.message,
            });
            return;
        }
        // Generic WishError
        if (error instanceof WishErrors_1.WishError) {
            res.status(400).json({
                error: "Bad Request",
                code: error.code,
                message: error.message,
            });
            return;
        }
        // Handle generic errors from entity validation
        if (error instanceof Error) {
            // Entity validation errors map to 400
            if (error.message.includes("required") ||
                error.message.includes("must be") ||
                error.message.includes("cannot be")) {
                res.status(400).json({
                    error: "Bad Request",
                    code: "VALIDATION_ERROR",
                    message: error.message,
                });
                return;
            }
        }
        // Unknown errors (500)
        console.error("Unexpected error in WishController:", error);
        res.status(500).json({
            error: "Internal Server Error",
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred",
        });
    }
}
exports.WishController = WishController;
//# sourceMappingURL=WishController.js.map