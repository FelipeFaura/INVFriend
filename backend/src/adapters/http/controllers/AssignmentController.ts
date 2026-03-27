/**
 * Assignment Controller
 * Handles HTTP requests for cross-group assignment operations
 */
import { Response } from "express";
import { IAssignmentRepository } from "../../../ports/IAssignmentRepository";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import { GetAllMyAssignmentsUseCase } from "../../../application/use-cases";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export class AssignmentController {
  private getAllMyAssignmentsUseCase: GetAllMyAssignmentsUseCase;

  constructor(
    assignmentRepository: IAssignmentRepository,
    groupRepository: IGroupRepository,
  ) {
    this.getAllMyAssignmentsUseCase = new GetAllMyAssignmentsUseCase(
      assignmentRepository,
      groupRepository,
    );
  }

  /**
   * GET /assignments/mine
   * Gets all Secret Santa assignments for the authenticated user across all groups
   */
  async getMyAssignments(
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

      const assignments = await this.getAllMyAssignmentsUseCase.execute({
        userId: req.user.uid,
      });

      res.status(200).json({ assignments });
    } catch (error) {
      res.status(500).json({
        error: "Internal Server Error",
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
      });
    }
  }
}
