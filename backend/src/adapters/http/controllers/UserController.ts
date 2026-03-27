/**
 * User Controller
 * Handles HTTP requests for user-related operations
 */
import { Response } from "express";
import { IUserRepository } from "../../../ports/IUserRepository";
import {
  GetUserPublicProfileUseCase,
  UserNotFoundError,
} from "../../../application/use-cases";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export class UserController {
  private getUserPublicProfileUseCase: GetUserPublicProfileUseCase;

  constructor(userRepository: IUserRepository) {
    this.getUserPublicProfileUseCase = new GetUserPublicProfileUseCase(
      userRepository,
    );
  }

  /**
   * GET /users/:id/public-profile
   * Returns a user's public profile (name, photoUrl)
   */
  async getPublicProfile(
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

      const { id } = req.params;

      const result = await this.getUserPublicProfileUseCase.execute({
        userId: id,
        requesterId: req.user.uid,
      });

      res.status(200).json(result);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  /**
   * Handles errors and sends appropriate HTTP responses
   */
  private handleError(error: unknown, res: Response): void {
    if (error instanceof UserNotFoundError) {
      res.status(404).json({
        error: "Not Found",
        code: "USER_NOT_FOUND",
        message: error.message,
      });
      return;
    }

    console.error("Unexpected error in UserController:", error);
    res.status(500).json({
      error: "Internal Server Error",
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    });
  }
}
