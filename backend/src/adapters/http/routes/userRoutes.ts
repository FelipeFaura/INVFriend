/**
 * User Routes
 * Express routes for user-related endpoints
 */
import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middleware/authMiddleware";
import { IUserRepository } from "../../../ports/IUserRepository";

export function createUserRoutes(userRepository: IUserRepository): Router {
  const router = Router();
  const userController = new UserController(userRepository);

  // All user routes require authentication
  router.use(authMiddleware);

  // Public profile
  router.get("/:id/public-profile", (req, res) =>
    userController.getPublicProfile(req, res),
  );

  return router;
}
