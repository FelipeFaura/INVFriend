/**
 * Wish Controller
 * Handles HTTP requests for wish management operations
 */
import { Response } from "express";
import { IWishRepository } from "../../../ports/IWishRepository";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import { IAssignmentRepository } from "../../../ports/IAssignmentRepository";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
export declare class WishController {
    private addWishUseCase;
    private updateWishUseCase;
    private deleteWishUseCase;
    private getMyWishesUseCase;
    private getSecretSantaWishesUseCase;
    constructor(wishRepository: IWishRepository, groupRepository: IGroupRepository, assignmentRepository: IAssignmentRepository);
    /**
     * POST /groups/:groupId/wishes
     * Creates a new wish in a group
     */
    createWish(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * GET /groups/:groupId/wishes
     * Gets the authenticated user's wishes in a group
     */
    getMyWishes(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * GET /groups/:groupId/wishes/assigned
     * Gets the wishes of the user's Secret Santa assignment
     */
    getAssignedWishes(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * PUT /groups/:groupId/wishes/:wishId
     * Updates a wish (owner only)
     */
    updateWish(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * DELETE /groups/:groupId/wishes/:wishId
     * Deletes a wish (owner only)
     */
    deleteWish(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Centralized error handler for wish errors
     */
    private handleWishError;
}
//# sourceMappingURL=WishController.d.ts.map