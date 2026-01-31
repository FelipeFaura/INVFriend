/**
 * Tests for WishController
 * TDD approach - tests written first
 */
import { Response } from "express";
import { WishController } from "../WishController";
import { IWishRepository } from "../../../../ports/IWishRepository";
import { IGroupRepository } from "../../../../ports/IGroupRepository";
import { IAssignmentRepository } from "../../../../ports/IAssignmentRepository";
import {
  WishNotFoundError,
  NotWishOwnerError,
  RaffleNotCompletedError,
  NoAssignmentError,
} from "../../../../domain/errors/WishErrors";
import {
  GroupNotFoundError,
  NotGroupMemberError,
} from "../../../../domain/errors/GroupErrors";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";

// Mock all use cases
jest.mock("../../../../application/use-cases", () => ({
  AddWishUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn(),
  })),
  UpdateWishUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn(),
  })),
  DeleteWishUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn(),
  })),
  GetMyWishesUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn(),
  })),
  GetSecretSantaWishesUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn(),
  })),
}));

describe("WishController", () => {
  let controller: WishController;
  let mockWishRepository: jest.Mocked<IWishRepository>;
  let mockGroupRepository: jest.Mocked<IGroupRepository>;
  let mockAssignmentRepository: jest.Mocked<IAssignmentRepository>;
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let jsonData: unknown;

  const mockUser = {
    uid: "user-123",
    email: "test@example.com",
  };

  const mockWishResponse = {
    id: "wish-123",
    groupId: "group-123",
    userId: "user-123",
    title: "PlayStation 5",
    description: "The new console",
    url: "https://example.com/ps5",
    estimatedPrice: 500,
    priority: 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockWishRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserInGroup: jest.fn(),
      findByGroup: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteAllByUserInGroup: jest.fn(),
    };

    mockGroupRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByMemberId: jest.fn(),
      findByAdminId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      generateId: jest.fn(),
    };

    mockAssignmentRepository = {
      create: jest.fn(),
      createBatch: jest.fn(),
      findByGroupId: jest.fn(),
      findByUserId: jest.fn(),
      findByGroupAndSecretSanta: jest.fn(),
      deleteByGroupId: jest.fn(),
      generateId: jest.fn(),
    };

    controller = new WishController(
      mockWishRepository,
      mockGroupRepository,
      mockAssignmentRepository,
    );

    jsonData = null;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((data) => {
        jsonData = data;
      }),
    };

    mockRequest = {
      body: {},
      params: {},
      user: mockUser,
    };
  });

  describe("createWish", () => {
    it("should create a wish successfully", async () => {
      mockRequest.params = { groupId: "group-123" };
      mockRequest.body = {
        title: "PlayStation 5",
        description: "The new console",
        url: "https://example.com/ps5",
        estimatedPrice: 500,
        priority: 1,
      };

      const { AddWishUseCase } = require("../../../../application/use-cases");
      const mockExecute = jest.fn().mockResolvedValue(mockWishResponse);
      AddWishUseCase.mockImplementation(() => ({ execute: mockExecute }));

      controller = new WishController(
        mockWishRepository,
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.createWish(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(jsonData).toEqual(mockWishResponse);
    });

    it("should return 401 when user is not authenticated", async () => {
      mockRequest.user = undefined;
      mockRequest.params = { groupId: "group-123" };

      await controller.createWish(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect((jsonData as { code: string }).code).toBe("UNAUTHORIZED");
    });

    it("should return 404 when group not found", async () => {
      mockRequest.params = { groupId: "invalid-group" };
      mockRequest.body = { title: "PlayStation 5" };

      const { AddWishUseCase } = require("../../../../application/use-cases");
      AddWishUseCase.mockImplementation(() => ({
        execute: jest
          .fn()
          .mockRejectedValue(new GroupNotFoundError("invalid-group")),
      }));

      controller = new WishController(
        mockWishRepository,
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.createWish(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect((jsonData as { code: string }).code).toBe("GROUP_NOT_FOUND");
    });

    it("should return 403 when user is not a group member", async () => {
      mockRequest.params = { groupId: "group-123" };
      mockRequest.body = { title: "PlayStation 5" };

      const { AddWishUseCase } = require("../../../../application/use-cases");
      AddWishUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new NotGroupMemberError()),
      }));

      controller = new WishController(
        mockWishRepository,
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.createWish(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect((jsonData as { code: string }).code).toBe("NOT_GROUP_MEMBER");
    });

    it("should return 400 for validation errors", async () => {
      mockRequest.params = { groupId: "group-123" };
      mockRequest.body = { title: "" };

      const { AddWishUseCase } = require("../../../../application/use-cases");
      AddWishUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new Error("Title is required")),
      }));

      controller = new WishController(
        mockWishRepository,
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.createWish(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect((jsonData as { code: string }).code).toBe("VALIDATION_ERROR");
    });
  });

  describe("getMyWishes", () => {
    it("should return user's wishes successfully", async () => {
      mockRequest.params = { groupId: "group-123" };

      const {
        GetMyWishesUseCase,
      } = require("../../../../application/use-cases");
      const mockExecute = jest.fn().mockResolvedValue([mockWishResponse]);
      GetMyWishesUseCase.mockImplementation(() => ({ execute: mockExecute }));

      controller = new WishController(
        mockWishRepository,
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.getMyWishes(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(jsonData).toEqual({ wishes: [mockWishResponse] });
    });

    it("should return 401 when user is not authenticated", async () => {
      mockRequest.user = undefined;
      mockRequest.params = { groupId: "group-123" };

      await controller.getMyWishes(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 when group not found", async () => {
      mockRequest.params = { groupId: "invalid-group" };

      const {
        GetMyWishesUseCase,
      } = require("../../../../application/use-cases");
      GetMyWishesUseCase.mockImplementation(() => ({
        execute: jest
          .fn()
          .mockRejectedValue(new GroupNotFoundError("invalid-group")),
      }));

      controller = new WishController(
        mockWishRepository,
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.getMyWishes(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });
  });

  describe("getAssignedWishes", () => {
    it("should return assigned recipient's wishes successfully", async () => {
      mockRequest.params = { groupId: "group-123" };

      const {
        GetSecretSantaWishesUseCase,
      } = require("../../../../application/use-cases");
      const mockExecute = jest.fn().mockResolvedValue([mockWishResponse]);
      GetSecretSantaWishesUseCase.mockImplementation(() => ({
        execute: mockExecute,
      }));

      controller = new WishController(
        mockWishRepository,
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.getAssignedWishes(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(jsonData).toEqual({ wishes: [mockWishResponse] });
    });

    it("should return 401 when user is not authenticated", async () => {
      mockRequest.user = undefined;
      mockRequest.params = { groupId: "group-123" };

      await controller.getAssignedWishes(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it("should return 400 when raffle is not completed", async () => {
      mockRequest.params = { groupId: "group-123" };

      const {
        GetSecretSantaWishesUseCase,
      } = require("../../../../application/use-cases");
      GetSecretSantaWishesUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new RaffleNotCompletedError()),
      }));

      controller = new WishController(
        mockWishRepository,
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.getAssignedWishes(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect((jsonData as { code: string }).code).toBe("RAFFLE_NOT_COMPLETED");
    });

    it("should return 400 when user has no assignment", async () => {
      mockRequest.params = { groupId: "group-123" };

      const {
        GetSecretSantaWishesUseCase,
      } = require("../../../../application/use-cases");
      GetSecretSantaWishesUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new NoAssignmentError()),
      }));

      controller = new WishController(
        mockWishRepository,
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.getAssignedWishes(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect((jsonData as { code: string }).code).toBe("NO_ASSIGNMENT");
    });
  });

  describe("updateWish", () => {
    it("should update a wish successfully", async () => {
      mockRequest.params = { groupId: "group-123", wishId: "wish-123" };
      mockRequest.body = { title: "Updated Title", priority: 2 };

      const updatedWish = { ...mockWishResponse, title: "Updated Title" };

      const {
        UpdateWishUseCase,
      } = require("../../../../application/use-cases");
      const mockExecute = jest.fn().mockResolvedValue(updatedWish);
      UpdateWishUseCase.mockImplementation(() => ({ execute: mockExecute }));

      controller = new WishController(
        mockWishRepository,
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.updateWish(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(jsonData).toEqual(updatedWish);
    });

    it("should return 401 when user is not authenticated", async () => {
      mockRequest.user = undefined;
      mockRequest.params = { groupId: "group-123", wishId: "wish-123" };

      await controller.updateWish(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 when wish not found", async () => {
      mockRequest.params = { groupId: "group-123", wishId: "invalid-wish" };
      mockRequest.body = { title: "Updated Title" };

      const {
        UpdateWishUseCase,
      } = require("../../../../application/use-cases");
      UpdateWishUseCase.mockImplementation(() => ({
        execute: jest
          .fn()
          .mockRejectedValue(new WishNotFoundError("invalid-wish")),
      }));

      controller = new WishController(
        mockWishRepository,
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.updateWish(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect((jsonData as { code: string }).code).toBe("WISH_NOT_FOUND");
    });

    it("should return 403 when user does not own the wish", async () => {
      mockRequest.params = { groupId: "group-123", wishId: "wish-123" };
      mockRequest.body = { title: "Updated Title" };

      const {
        UpdateWishUseCase,
      } = require("../../../../application/use-cases");
      UpdateWishUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new NotWishOwnerError()),
      }));

      controller = new WishController(
        mockWishRepository,
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.updateWish(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect((jsonData as { code: string }).code).toBe("NOT_WISH_OWNER");
    });
  });

  describe("deleteWish", () => {
    it("should delete a wish successfully", async () => {
      mockRequest.params = { groupId: "group-123", wishId: "wish-123" };

      const {
        DeleteWishUseCase,
      } = require("../../../../application/use-cases");
      const mockExecute = jest.fn().mockResolvedValue(undefined);
      DeleteWishUseCase.mockImplementation(() => ({ execute: mockExecute }));

      controller = new WishController(
        mockWishRepository,
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.deleteWish(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(jsonData).toEqual({
        success: true,
        message: "Wish deleted successfully",
      });
    });

    it("should return 401 when user is not authenticated", async () => {
      mockRequest.user = undefined;
      mockRequest.params = { groupId: "group-123", wishId: "wish-123" };

      await controller.deleteWish(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it("should return 404 when wish not found", async () => {
      mockRequest.params = { groupId: "group-123", wishId: "invalid-wish" };

      const {
        DeleteWishUseCase,
      } = require("../../../../application/use-cases");
      DeleteWishUseCase.mockImplementation(() => ({
        execute: jest
          .fn()
          .mockRejectedValue(new WishNotFoundError("invalid-wish")),
      }));

      controller = new WishController(
        mockWishRepository,
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.deleteWish(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
    });

    it("should return 403 when user does not own the wish", async () => {
      mockRequest.params = { groupId: "group-123", wishId: "wish-123" };

      const {
        DeleteWishUseCase,
      } = require("../../../../application/use-cases");
      DeleteWishUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new NotWishOwnerError()),
      }));

      controller = new WishController(
        mockWishRepository,
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.deleteWish(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
    });
  });

  describe("error handling", () => {
    it("should return 500 for unexpected errors", async () => {
      mockRequest.params = { groupId: "group-123" };
      mockRequest.body = { title: "PlayStation 5" };

      const { AddWishUseCase } = require("../../../../application/use-cases");
      AddWishUseCase.mockImplementation(() => ({
        execute: jest
          .fn()
          .mockRejectedValue(new Error("Database connection failed")),
      }));

      // Suppress console.error during this test
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      controller = new WishController(
        mockWishRepository,
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.createWish(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect((jsonData as { code: string }).code).toBe("INTERNAL_ERROR");

      consoleSpy.mockRestore();
    });
  });
});
