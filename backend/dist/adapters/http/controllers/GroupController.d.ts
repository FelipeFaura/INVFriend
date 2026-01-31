/**
 * Group Controller
 * Handles HTTP requests for group management operations
 */
import { Response } from "express";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
export declare class GroupController {
    private createGroupUseCase;
    private getGroupDetailsUseCase;
    private getUserGroupsUseCase;
    private updateGroupUseCase;
    private addMemberToGroupUseCase;
    private removeMemberFromGroupUseCase;
    private deleteGroupUseCase;
    constructor(groupRepository: IGroupRepository);
    /**
     * POST /groups
     * Creates a new group with the authenticated user as admin
     */
    createGroup(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * GET /groups
     * Lists all groups where the authenticated user is a member
     */
    getGroups(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * GET /groups/:id
     * Gets details of a specific group (member only)
     */
    getGroupById(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * PUT /groups/:id
     * Updates a group (admin only)
     */
    updateGroup(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * DELETE /groups/:id
     * Deletes a group (admin only, before raffle)
     */
    deleteGroup(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * POST /groups/:id/members
     * Adds a member to the group (admin only)
     */
    addMember(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * DELETE /groups/:id/members/:userId
     * Removes a member from the group (admin only)
     */
    removeMember(req: AuthenticatedRequest, res: Response): Promise<void>;
    /**
     * Centralized error handler for group errors
     */
    private handleGroupError;
}
//# sourceMappingURL=GroupController.d.ts.map