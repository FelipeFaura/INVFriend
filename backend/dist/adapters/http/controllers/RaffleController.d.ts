/**
 * Raffle Controller
 * Handles HTTP requests for raffle operations
 */
import { Response } from "express";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import { IAssignmentRepository } from "../../../ports/IAssignmentRepository";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
export declare class RaffleController {
    private performRaffleUseCase;
    private getMyAssignmentUseCase;
    constructor(groupRepository: IGroupRepository, assignmentRepository: IAssignmentRepository);
    /**
     * POST /groups/:id/raffle
     * Performs the Secret Santa raffle for a group (admin only)
     */
    performRaffle(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * GET /groups/:id/my-assignment
     * Gets the authenticated user's Secret Santa assignment (who they give a gift to)
     */
    getMyAssignment(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Handles errors from raffle operations and sends appropriate HTTP responses
     */
    private handleRaffleError;
}
//# sourceMappingURL=RaffleController.d.ts.map