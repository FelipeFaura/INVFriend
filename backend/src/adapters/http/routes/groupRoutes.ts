/**
 * Group Routes
 * Express routes for group management endpoints
 */
import { Router } from "express";
import { GroupController } from "../controllers/GroupController";
import { RaffleController } from "../controllers/RaffleController";
import { authMiddleware } from "../middleware/authMiddleware";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import { IAssignmentRepository } from "../../../ports/IAssignmentRepository";

export function createGroupRoutes(
  groupRepository: IGroupRepository,
  assignmentRepository: IAssignmentRepository,
): Router {
  const router = Router();
  const groupController = new GroupController(groupRepository);
  const raffleController = new RaffleController(
    groupRepository,
    assignmentRepository,
  );

  // All group routes require authentication
  router.use(authMiddleware);

  // Group CRUD operations
  router.post("/", (req, res) => groupController.createGroup(req, res));
  router.get("/", (req, res) => groupController.getGroups(req, res));
  router.get("/:id", (req, res) => groupController.getGroupById(req, res));
  router.put("/:id", (req, res) => groupController.updateGroup(req, res));
  router.delete("/:id", (req, res) => groupController.deleteGroup(req, res));

  // Group member operations
  router.post("/:id/members", (req, res) =>
    groupController.addMember(req, res),
  );
  router.delete("/:id/members/:userId", (req, res) =>
    groupController.removeMember(req, res),
  );

  // Raffle operations
  router.post("/:id/raffle", (req, res) =>
    raffleController.performRaffle(req, res),
  );
  router.get("/:id/my-assignment", (req, res) =>
    raffleController.getMyAssignment(req, res),
  );

  return router;
}
