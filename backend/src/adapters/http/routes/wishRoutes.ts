/**
 * Wish Routes
 * Express routes for wish management endpoints
 */
import { Router } from "express";
import { WishController } from "../controllers/WishController";
import { authMiddleware } from "../middleware/authMiddleware";
import { IWishRepository } from "../../../ports/IWishRepository";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import { IAssignmentRepository } from "../../../ports/IAssignmentRepository";

export function createWishRoutes(
  wishRepository: IWishRepository,
  groupRepository: IGroupRepository,
  assignmentRepository: IAssignmentRepository,
): Router {
  const router = Router({ mergeParams: true }); // mergeParams to access :groupId from parent
  const wishController = new WishController(
    wishRepository,
    groupRepository,
    assignmentRepository,
  );

  // All wish routes require authentication
  router.use(authMiddleware);

  // Wish CRUD operations
  router.post("/", (req, res) => wishController.createWish(req, res));
  router.get("/", (req, res) => wishController.getMyWishes(req, res));
  router.get("/assigned", (req, res) =>
    wishController.getAssignedWishes(req, res),
  );
  router.put("/:wishId", (req, res) => wishController.updateWish(req, res));
  router.delete("/:wishId", (req, res) => wishController.deleteWish(req, res));

  return router;
}
