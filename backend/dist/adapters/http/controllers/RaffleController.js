"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaffleController = void 0;
const use_cases_1 = require("../../../application/use-cases");
const GroupErrors_1 = require("../../../domain/errors/GroupErrors");
class RaffleController {
    constructor(groupRepository, assignmentRepository) {
        this.performRaffleUseCase = new use_cases_1.PerformRaffleUseCase(groupRepository, assignmentRepository);
        this.getMyAssignmentUseCase = new use_cases_1.GetMyAssignmentUseCase(groupRepository, assignmentRepository);
    }
    /**
     * POST /groups/:id/raffle
     * Performs the Secret Santa raffle for a group (admin only)
     */
    async performRaffle(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: "Unauthorized",
                    code: "UNAUTHORIZED",
                    message: "Authentication required",
                });
                return;
            }
            const { id: groupId } = req.params;
            const result = await this.performRaffleUseCase.execute({
                groupId,
                requesterId: req.user.uid,
            });
            res.status(200).json(result);
        }
        catch (error) {
            this.handleRaffleError(error, res);
        }
    }
    /**
     * GET /groups/:id/my-assignment
     * Gets the authenticated user's Secret Santa assignment (who they give a gift to)
     */
    async getMyAssignment(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: "Unauthorized",
                    code: "UNAUTHORIZED",
                    message: "Authentication required",
                });
                return;
            }
            const { id: groupId } = req.params;
            const result = await this.getMyAssignmentUseCase.execute({
                groupId,
                userId: req.user.uid,
            });
            res.status(200).json(result);
        }
        catch (error) {
            this.handleRaffleError(error, res);
        }
    }
    /**
     * Handles errors from raffle operations and sends appropriate HTTP responses
     */
    handleRaffleError(error, res) {
        // Validation errors (400)
        if (error instanceof GroupErrors_1.NotEnoughMembersError) {
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
        if (error instanceof use_cases_1.RaffleFailedError) {
            res.status(400).json({
                error: "Bad Request",
                code: "RAFFLE_FAILED",
                message: error.message,
            });
            return;
        }
        if (error instanceof use_cases_1.RaffleNotCompletedError) {
            res.status(400).json({
                error: "Bad Request",
                code: "RAFFLE_NOT_COMPLETED",
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
        if (error instanceof GroupErrors_1.NotGroupMemberError) {
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
        if (error instanceof use_cases_1.AssignmentNotFoundError) {
            res.status(404).json({
                error: "Not Found",
                code: "ASSIGNMENT_NOT_FOUND",
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
        console.error("Unexpected error in RaffleController:", error);
        res.status(500).json({
            error: "Internal Server Error",
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred",
        });
    }
}
exports.RaffleController = RaffleController;
//# sourceMappingURL=RaffleController.js.map