/**
 * Wish Controller
 * Handles HTTP requests for wish management operations
 */
import { Response } from "express";
import { IWishRepository } from "../../../ports/IWishRepository";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import { IAssignmentRepository } from "../../../ports/IAssignmentRepository";
import {
  AddWishUseCase,
  UpdateWishUseCase,
  DeleteWishUseCase,
  GetMyWishesUseCase,
  GetSecretSantaWishesUseCase,
} from "../../../application/use-cases";
import {
  WishError,
  WishNotFoundError,
  NotWishOwnerError,
  InvalidWishTitleError,
  RaffleNotCompletedError,
  NoAssignmentError,
} from "../../../domain/errors/WishErrors";
import {
  GroupNotFoundError,
  NotGroupMemberError,
} from "../../../domain/errors/GroupErrors";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export class WishController {
  private addWishUseCase: AddWishUseCase;
  private updateWishUseCase: UpdateWishUseCase;
  private deleteWishUseCase: DeleteWishUseCase;
  private getMyWishesUseCase: GetMyWishesUseCase;
  private getSecretSantaWishesUseCase: GetSecretSantaWishesUseCase;

  constructor(
    wishRepository: IWishRepository,
    groupRepository: IGroupRepository,
    assignmentRepository: IAssignmentRepository,
  ) {
    this.addWishUseCase = new AddWishUseCase(wishRepository, groupRepository);
    this.updateWishUseCase = new UpdateWishUseCase(wishRepository);
    this.deleteWishUseCase = new DeleteWishUseCase(wishRepository);
    this.getMyWishesUseCase = new GetMyWishesUseCase(
      wishRepository,
      groupRepository,
    );
    this.getSecretSantaWishesUseCase = new GetSecretSantaWishesUseCase(
      wishRepository,
      groupRepository,
      assignmentRepository,
    );
  }

  /**
   * POST /groups/:groupId/wishes
   * Creates a new wish in a group
   */
  async createWish(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: "Unauthorized",
          code: "UNAUTHORIZED",
          message: "Authentication required",
        });
        return;
      }

      const { groupId } = req.params;
      const { title, description, url, estimatedPrice, priority } = req.body;

      const result = await this.addWishUseCase.execute({
        groupId,
        userId: req.user.uid,
        title,
        description,
        url,
        estimatedPrice,
        priority,
      });

      res.status(201).json(result);
    } catch (error) {
      this.handleWishError(error, res);
    }
  }

  /**
   * GET /groups/:groupId/wishes
   * Gets the authenticated user's wishes in a group
   */
  async getMyWishes(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: "Unauthorized",
          code: "UNAUTHORIZED",
          message: "Authentication required",
        });
        return;
      }

      const { groupId } = req.params;

      const wishes = await this.getMyWishesUseCase.execute({
        groupId,
        userId: req.user.uid,
      });

      res.status(200).json({ wishes });
    } catch (error) {
      this.handleWishError(error, res);
    }
  }

  /**
   * GET /groups/:groupId/wishes/assigned
   * Gets the wishes of the user's Secret Santa assignment
   */
  async getAssignedWishes(
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

      const { groupId } = req.params;

      const wishes = await this.getSecretSantaWishesUseCase.execute({
        groupId,
        userId: req.user.uid,
      });

      res.status(200).json({ wishes });
    } catch (error) {
      this.handleWishError(error, res);
    }
  }

  /**
   * PUT /groups/:groupId/wishes/:wishId
   * Updates a wish (owner only)
   */
  async updateWish(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: "Unauthorized",
          code: "UNAUTHORIZED",
          message: "Authentication required",
        });
        return;
      }

      const { wishId } = req.params;
      const { title, description, url, estimatedPrice, priority } = req.body;

      const result = await this.updateWishUseCase.execute({
        wishId,
        userId: req.user.uid,
        title,
        description,
        url,
        estimatedPrice,
        priority,
      });

      res.status(200).json(result);
    } catch (error) {
      this.handleWishError(error, res);
    }
  }

  /**
   * DELETE /groups/:groupId/wishes/:wishId
   * Deletes a wish (owner only)
   */
  async deleteWish(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: "Unauthorized",
          code: "UNAUTHORIZED",
          message: "Authentication required",
        });
        return;
      }

      const { wishId } = req.params;

      await this.deleteWishUseCase.execute({
        wishId,
        userId: req.user.uid,
      });

      res.status(200).json({
        success: true,
        message: "Wish deleted successfully",
      });
    } catch (error) {
      this.handleWishError(error, res);
    }
  }

  /**
   * Centralized error handler for wish errors
   */
  private handleWishError(error: unknown, res: Response): void {
    // Validation errors (400)
    if (error instanceof InvalidWishTitleError) {
      res.status(400).json({
        error: "Bad Request",
        code: error.code,
        message: error.message,
      });
      return;
    }

    // Authorization errors (403)
    if (error instanceof NotWishOwnerError) {
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

    // Business rule errors (400)
    if (error instanceof RaffleNotCompletedError) {
      res.status(400).json({
        error: "Bad Request",
        code: error.code,
        message: error.message,
      });
      return;
    }

    if (error instanceof NoAssignmentError) {
      res.status(400).json({
        error: "Bad Request",
        code: error.code,
        message: error.message,
      });
      return;
    }

    // Not found errors (404)
    if (error instanceof WishNotFoundError) {
      res.status(404).json({
        error: "Not Found",
        code: error.code,
        message: error.message,
      });
      return;
    }

    if (error instanceof GroupNotFoundError) {
      res.status(404).json({
        error: "Not Found",
        code: error.code,
        message: error.message,
      });
      return;
    }

    // Generic WishError
    if (error instanceof WishError) {
      res.status(400).json({
        error: "Bad Request",
        code: error.code,
        message: error.message,
      });
      return;
    }

    // Handle generic errors from entity validation
    if (error instanceof Error) {
      // Entity validation errors map to 400
      if (
        error.message.includes("required") ||
        error.message.includes("must be") ||
        error.message.includes("cannot be")
      ) {
        res.status(400).json({
          error: "Bad Request",
          code: "VALIDATION_ERROR",
          message: error.message,
        });
        return;
      }
    }

    // Unknown errors (500)
    console.error("Unexpected error in WishController:", error);
    res.status(500).json({
      error: "Internal Server Error",
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    });
  }
}
