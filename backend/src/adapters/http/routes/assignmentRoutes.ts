/**
 * Assignment Routes
 * Express routes for cross-group assignment endpoints
 */
import { Router } from "express";
import { AssignmentController } from "../controllers/AssignmentController";
import { authMiddleware } from "../middleware/authMiddleware";
import { IAssignmentRepository } from "../../../ports/IAssignmentRepository";
import { IGroupRepository } from "../../../ports/IGroupRepository";

export function createAssignmentRoutes(
  assignmentRepository: IAssignmentRepository,
  groupRepository: IGroupRepository,
): Router {
  const router = Router();
  const assignmentController = new AssignmentController(
    assignmentRepository,
    groupRepository,
  );

  // All assignment routes require authentication
  router.use(authMiddleware);

  // Get all my assignments across groups
  router.get("/mine", (req, res) =>
    assignmentController.getMyAssignments(req, res),
  );

  return router;
}
