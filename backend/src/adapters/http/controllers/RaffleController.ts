/**
 * Raffle Controller
 * Handles HTTP requests for raffle operations
 */
import { Response } from "express";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import { IAssignmentRepository } from "../../../ports/IAssignmentRepository";
import {
  PerformRaffleUseCase,
  RaffleFailedError,
  GetMyAssignmentUseCase,
  RaffleNotCompletedError,
  AssignmentNotFoundError,
} from "../../../application/use-cases";
import {
  GroupNotFoundError,
  NotGroupAdminError,
  NotGroupMemberError,
  NotEnoughMembersError,
  RaffleAlreadyCompletedError,
  GroupError,
} from "../../../domain/errors/GroupErrors";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export class RaffleController {
  private performRaffleUseCase: PerformRaffleUseCase;
  private getMyAssignmentUseCase: GetMyAssignmentUseCase;

  constructor(
    groupRepository: IGroupRepository,
    assignmentRepository: IAssignmentRepository,
  ) {
    this.performRaffleUseCase = new PerformRaffleUseCase(
      groupRepository,
      assignmentRepository,
    );
    this.getMyAssignmentUseCase = new GetMyAssignmentUseCase(
      groupRepository,
      assignmentRepository,
    );
  }

  /**
   * POST /groups/:id/raffle
   * Performs the Secret Santa raffle for a group (admin only)
   */
  async performRaffle(req: AuthenticatedRequest, res: Response): Promise<void> {
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
    } catch (error) {
      this.handleRaffleError(error, res);
    }
  }

  /**
   * GET /groups/:id/my-assignment
   * Gets the authenticated user's Secret Santa assignment (who they give a gift to)
   */
  async getMyAssignment(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
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
    } catch (error) {
      this.handleRaffleError(error, res);
    }
  }

  /**
   * Handles errors from raffle operations and sends appropriate HTTP responses
   */
  private handleRaffleError(error: unknown, res: Response): void {
    // Validation errors (400)
    if (error instanceof NotEnoughMembersError) {
      res.status(400).json({
        error: "Bad Request",
        code: error.code,
        message: error.message,
      });
      return;
    }

    if (error instanceof RaffleAlreadyCompletedError) {
      res.status(400).json({
        error: "Bad Request",
        code: error.code,
        message: error.message,
      });
      return;
    }

    if (error instanceof RaffleFailedError) {
      res.status(400).json({
        error: "Bad Request",
        code: "RAFFLE_FAILED",
        message: error.message,
      });
      return;
    }

    if (error instanceof RaffleNotCompletedError) {
      res.status(400).json({
        error: "Bad Request",
        code: "RAFFLE_NOT_COMPLETED",
        message: error.message,
      });
      return;
    }

    // Authorization errors (403)
    if (error instanceof NotGroupAdminError) {
      res.status(403).json({
        error: "Forbidden",
        code: error.code,
        message: error.message,
      });
      return;
    }

    if (error instanceof NotGroupMemberError) {
      res.status(403).json({
        error: "Forbidden",
        code: error.code,
        message: error.message,
      });
      return;
    }

    // Not found errors (404)
    if (error instanceof GroupNotFoundError) {
      res.status(404).json({
        error: "Not Found",
        code: error.code,
        message: error.message,
      });
      return;
    }

    if (error instanceof AssignmentNotFoundError) {
      res.status(404).json({
        error: "Not Found",
        code: "ASSIGNMENT_NOT_FOUND",
        message: error.message,
      });
      return;
    }

    // Generic GroupError
    if (error instanceof GroupError) {
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
