"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupController = void 0;
const use_cases_1 = require("../../../application/use-cases");
const GroupErrors_1 = require("../../../domain/errors/GroupErrors");
class GroupController {
    constructor(groupRepository) {
        this.createGroupUseCase = new use_cases_1.CreateGroupUseCase(groupRepository);
        this.getGroupDetailsUseCase = new use_cases_1.GetGroupDetailsUseCase(groupRepository);
        this.getUserGroupsUseCase = new use_cases_1.GetUserGroupsUseCase(groupRepository);
        this.updateGroupUseCase = new use_cases_1.UpdateGroupUseCase(groupRepository);
        this.addMemberToGroupUseCase = new use_cases_1.AddMemberToGroupUseCase(groupRepository);
        this.removeMemberFromGroupUseCase = new use_cases_1.RemoveMemberFromGroupUseCase(groupRepository);
        this.deleteGroupUseCase = new use_cases_1.DeleteGroupUseCase(groupRepository);
    }
    /**
     * POST /groups
     * Creates a new group with the authenticated user as admin
     */
    async createGroup(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: "Unauthorized",
                    code: "UNAUTHORIZED",
                    message: "Authentication required",
                });
                return;
            }
            const { name, budgetLimit, description } = req.body;
            const result = await this.createGroupUseCase.execute({
                name,
                adminId: req.user.uid,
                budgetLimit,
                description,
            });
            res.status(201).json(result);
        }
        catch (error) {
            this.handleGroupError(error, res);
        }
    }
    /**
     * GET /groups
     * Lists all groups where the authenticated user is a member
     */
    async getGroups(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: "Unauthorized",
                    code: "UNAUTHORIZED",
                    message: "Authentication required",
                });
                return;
            }
            const groups = await this.getUserGroupsUseCase.execute(req.user.uid);
            res.status(200).json({ groups });
        }
        catch (error) {
            this.handleGroupError(error, res);
        }
    }
    /**
     * GET /groups/:id
     * Gets details of a specific group (member only)
     */
    async getGroupById(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: "Unauthorized",
                    code: "UNAUTHORIZED",
                    message: "Authentication required",
                });
                return;
            }
            const { id } = req.params;
            const result = await this.getGroupDetailsUseCase.execute(id, req.user.uid);
            res.status(200).json(result);
        }
        catch (error) {
            this.handleGroupError(error, res);
        }
    }
    /**
     * PUT /groups/:id
     * Updates a group (admin only)
     */
    async updateGroup(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: "Unauthorized",
                    code: "UNAUTHORIZED",
                    message: "Authentication required",
                });
                return;
            }
            const { id } = req.params;
            const { name, description, budgetLimit } = req.body;
            const result = await this.updateGroupUseCase.execute(id, { name, description, budgetLimit }, req.user.uid);
            res.status(200).json(result);
        }
        catch (error) {
            this.handleGroupError(error, res);
        }
    }
    /**
     * DELETE /groups/:id
     * Deletes a group (admin only, before raffle)
     */
    async deleteGroup(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: "Unauthorized",
                    code: "UNAUTHORIZED",
                    message: "Authentication required",
                });
                return;
            }
            const { id } = req.params;
            await this.deleteGroupUseCase.execute(id, req.user.uid);
            res.status(200).json({
                success: true,
                message: "Group deleted successfully",
            });
        }
        catch (error) {
            this.handleGroupError(error, res);
        }
    }
    /**
     * POST /groups/:id/members
     * Adds a member to the group (admin only)
     */
    async addMember(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: "Unauthorized",
                    code: "UNAUTHORIZED",
                    message: "Authentication required",
                });
                return;
            }
            const { id } = req.params;
            const { userId } = req.body;
            const result = await this.addMemberToGroupUseCase.execute({
                groupId: id,
                userId,
                requesterId: req.user.uid,
            });
            res.status(200).json(result);
        }
        catch (error) {
            this.handleGroupError(error, res);
        }
    }
    /**
     * DELETE /groups/:id/members/:userId
     * Removes a member from the group (admin only)
     */
    async removeMember(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: "Unauthorized",
                    code: "UNAUTHORIZED",
                    message: "Authentication required",
                });
                return;
            }
            const { id, userId } = req.params;
            const result = await this.removeMemberFromGroupUseCase.execute({
                groupId: id,
                userId,
                requesterId: req.user.uid,
            });
            res.status(200).json(result);
        }
        catch (error) {
            this.handleGroupError(error, res);
        }
    }
    /**
     * Centralized error handler for group errors
     */
    handleGroupError(error, res) {
        // Validation errors (400)
        if (error instanceof GroupErrors_1.InvalidGroupNameError) {
            res.status(400).json({
                error: "Bad Request",
                code: error.code,
                message: error.message,
            });
            return;
        }
        if (error instanceof GroupErrors_1.InvalidBudgetLimitError) {
            res.status(400).json({
                error: "Bad Request",
                code: error.code,
                message: error.message,
            });
            return;
        }
        if (error instanceof GroupErrors_1.AlreadyGroupMemberError) {
            res.status(400).json({
                error: "Bad Request",
                code: error.code,
                message: error.message,
            });
            return;
        }
        if (error instanceof GroupErrors_1.CannotRemoveAdminError) {
            res.status(400).json({
                error: "Bad Request",
                code: error.code,
                message: error.message,
            });
            return;
        }
        if (error instanceof GroupErrors_1.CannotDeleteAfterRaffleError) {
            res.status(400).json({
                error: "Bad Request",
                code: error.code,
                message: error.message,
            });
            return;
        }
        if (error instanceof GroupErrors_1.RaffleAlreadyCompletedError) {
            res.status(400).json({
                error: "Bad Request",
                code: error.code,
                message: error.message,
            });
            return;
        }
        // Authorization errors (403)
        if (error instanceof GroupErrors_1.NotGroupAdminError) {
            res.status(403).json({
                error: "Forbidden",
                code: error.code,
                message: error.message,
            });
            return;
        }
        // NotGroupMemberError context:
        // - In getGroupById: requester not authorized (403) - uses custom message
        // - In removeMember: target user not found (400) - uses default message
        if (error instanceof GroupErrors_1.NotGroupMemberError) {
            // Default message means trying to remove someone not in group
            if (error.message === "User is not a member of this group") {
                res.status(400).json({
                    error: "Bad Request",
                    code: error.code,
                    message: error.message,
                });
                return;
            }
            // Custom message means authorization failure
            res.status(403).json({
                error: "Forbidden",
                code: error.code,
                message: error.message,
            });
            return;
        }
        // Not found errors (404)
        if (error instanceof GroupErrors_1.GroupNotFoundError) {
            res.status(404).json({
                error: "Not Found",
                code: error.code,
                message: error.message,
            });
            return;
        }
        // Generic GroupError
        if (error instanceof GroupErrors_1.GroupError) {
            res.status(400).json({
                error: "Bad Request",
                code: error.code,
                message: error.message,
            });
            return;
        }
        // Unknown errors (500)
        console.error("Unexpected error in GroupController:", error);
        res.status(500).json({
            error: "Internal Server Error",
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred",
        });
    }
}
exports.GroupController = GroupController;
//# sourceMappingURL=GroupController.js.map