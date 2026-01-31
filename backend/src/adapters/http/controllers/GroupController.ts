/**
 * Group Controller
 * Handles HTTP requests for group management operations
 */
import { Response } from "express";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import {
  CreateGroupUseCase,
  GetGroupDetailsUseCase,
  GetUserGroupsUseCase,
  UpdateGroupUseCase,
  AddMemberToGroupUseCase,
  RemoveMemberFromGroupUseCase,
  DeleteGroupUseCase,
} from "../../../application/use-cases";
import {
  GroupNotFoundError,
  NotGroupAdminError,
  NotGroupMemberError,
  AlreadyGroupMemberError,
  CannotRemoveAdminError,
  CannotDeleteAfterRaffleError,
  InvalidGroupNameError,
  InvalidBudgetLimitError,
  RaffleAlreadyCompletedError,
  GroupError,
} from "../../../domain/errors/GroupErrors";
import { AuthenticatedRequest } from "../middleware/authMiddleware";

export class GroupController {
  private createGroupUseCase: CreateGroupUseCase;
  private getGroupDetailsUseCase: GetGroupDetailsUseCase;
  private getUserGroupsUseCase: GetUserGroupsUseCase;
  private updateGroupUseCase: UpdateGroupUseCase;
  private addMemberToGroupUseCase: AddMemberToGroupUseCase;
  private removeMemberFromGroupUseCase: RemoveMemberFromGroupUseCase;
  private deleteGroupUseCase: DeleteGroupUseCase;

  constructor(groupRepository: IGroupRepository) {
    this.createGroupUseCase = new CreateGroupUseCase(groupRepository);
    this.getGroupDetailsUseCase = new GetGroupDetailsUseCase(groupRepository);
    this.getUserGroupsUseCase = new GetUserGroupsUseCase(groupRepository);
    this.updateGroupUseCase = new UpdateGroupUseCase(groupRepository);
    this.addMemberToGroupUseCase = new AddMemberToGroupUseCase(groupRepository);
    this.removeMemberFromGroupUseCase = new RemoveMemberFromGroupUseCase(
      groupRepository,
    );
    this.deleteGroupUseCase = new DeleteGroupUseCase(groupRepository);
  }

  /**
   * POST /groups
   * Creates a new group with the authenticated user as admin
   */
  async createGroup(req: AuthenticatedRequest, res: Response): Promise<void> {
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
    } catch (error) {
      this.handleGroupError(error, res);
    }
  }

  /**
   * GET /groups
   * Lists all groups where the authenticated user is a member
   */
  async getGroups(req: AuthenticatedRequest, res: Response): Promise<void> {
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
    } catch (error) {
      this.handleGroupError(error, res);
    }
  }

  /**
   * GET /groups/:id
   * Gets details of a specific group (member only)
   */
  async getGroupById(req: AuthenticatedRequest, res: Response): Promise<void> {
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

      const result = await this.getGroupDetailsUseCase.execute(
        id,
        req.user.uid,
      );

      res.status(200).json(result);
    } catch (error) {
      this.handleGroupError(error, res);
    }
  }

  /**
   * PUT /groups/:id
   * Updates a group (admin only)
   */
  async updateGroup(req: AuthenticatedRequest, res: Response): Promise<void> {
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

      const result = await this.updateGroupUseCase.execute(
        id,
        { name, description, budgetLimit },
        req.user.uid,
      );

      res.status(200).json(result);
    } catch (error) {
      this.handleGroupError(error, res);
    }
  }

  /**
   * DELETE /groups/:id
   * Deletes a group (admin only, before raffle)
   */
  async deleteGroup(req: AuthenticatedRequest, res: Response): Promise<void> {
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
    } catch (error) {
      this.handleGroupError(error, res);
    }
  }

  /**
   * POST /groups/:id/members
   * Adds a member to the group (admin only)
   */
  async addMember(req: AuthenticatedRequest, res: Response): Promise<void> {
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
    } catch (error) {
      this.handleGroupError(error, res);
    }
  }

  /**
   * DELETE /groups/:id/members/:userId
   * Removes a member from the group (admin only)
   */
  async removeMember(req: AuthenticatedRequest, res: Response): Promise<void> {
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
    } catch (error) {
      this.handleGroupError(error, res);
    }
  }

  /**
   * Centralized error handler for group errors
   */
  private handleGroupError(error: unknown, res: Response): void {
    // Validation errors (400)
    if (error instanceof InvalidGroupNameError) {
      res.status(400).json({
        error: "Bad Request",
        code: error.code,
        message: error.message,
      });
      return;
    }

    if (error instanceof InvalidBudgetLimitError) {
      res.status(400).json({
        error: "Bad Request",
        code: error.code,
        message: error.message,
      });
      return;
    }

    if (error instanceof AlreadyGroupMemberError) {
      res.status(400).json({
        error: "Bad Request",
        code: error.code,
        message: error.message,
      });
      return;
    }

    if (error instanceof CannotRemoveAdminError) {
      res.status(400).json({
        error: "Bad Request",
        code: error.code,
        message: error.message,
      });
      return;
    }

    if (error instanceof CannotDeleteAfterRaffleError) {
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

    // Authorization errors (403)
    if (error instanceof NotGroupAdminError) {
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
    if (error instanceof NotGroupMemberError) {
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
    if (error instanceof GroupNotFoundError) {
      res.status(404).json({
        error: "Not Found",
        code: error.code,
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
    console.error("Unexpected error in GroupController:", error);
    res.status(500).json({
      error: "Internal Server Error",
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    });
  }
}
