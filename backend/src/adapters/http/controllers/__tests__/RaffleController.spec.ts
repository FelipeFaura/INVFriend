/**
 * Tests for RaffleController
 * TDD approach - tests written first
 */
import { Response } from "express";
import { RaffleController } from "../RaffleController";
import { IGroupRepository } from "../../../../ports/IGroupRepository";
import { IAssignmentRepository } from "../../../../ports/IAssignmentRepository";
import {
  GroupNotFoundError,
  NotGroupAdminError,
  NotGroupMemberError,
  NotEnoughMembersError,
  RaffleAlreadyCompletedError,
} from "../../../../domain/errors/GroupErrors";
import { AuthenticatedRequest } from "../../middleware/authMiddleware";

// Mock all use cases
jest.mock("../../../../application/use-cases", () => ({
  PerformRaffleUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn(),
  })),
  GetMyAssignmentUseCase: jest.fn().mockImplementation(() => ({
    execute: jest.fn(),
  })),
  RaffleFailedError: class RaffleFailedError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "RaffleFailedError";
    }
  },
  RaffleNotCompletedError: class RaffleNotCompletedError extends Error {
    constructor(message: string = "Raffle has not been completed") {
      super(message);
      this.name = "RaffleNotCompletedError";
    }
  },
  AssignmentNotFoundError: class AssignmentNotFoundError extends Error {
    constructor(message: string = "Assignment not found") {
      super(message);
      this.name = "AssignmentNotFoundError";
    }
  },
}));

describe("RaffleController", () => {
  let controller: RaffleController;
  let mockGroupRepository: jest.Mocked<IGroupRepository>;
  let mockAssignmentRepository: jest.Mocked<IAssignmentRepository>;
  let mockRequest: Partial<AuthenticatedRequest>;
  let mockResponse: Partial<Response>;
  let jsonData: unknown;

  const mockUser = {
    uid: "user-123",
    email: "test@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();

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

    controller = new RaffleController(
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
      params: { id: "group-123" },
      user: mockUser,
    };
  });

  describe("performRaffle", () => {
    const mockRaffleResult = {
      groupId: "group-123",
      raffleDate: Date.now(),
      assignmentCount: 3,
    };

    it("should perform raffle successfully", async () => {
      const {
        PerformRaffleUseCase,
      } = require("../../../../application/use-cases");
      const mockExecute = jest.fn().mockResolvedValue(mockRaffleResult);
      PerformRaffleUseCase.mockImplementation(() => ({ execute: mockExecute }));

      controller = new RaffleController(
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.performRaffle(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(jsonData).toEqual(mockRaffleResult);
    });

    it("should return 401 when user is not authenticated", async () => {
      mockRequest.user = undefined;

      await controller.performRaffle(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect((jsonData as { code: string }).code).toBe("UNAUTHORIZED");
    });

    it("should return 403 when user is not admin", async () => {
      const {
        PerformRaffleUseCase,
      } = require("../../../../application/use-cases");
      PerformRaffleUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new NotGroupAdminError()),
      }));

      controller = new RaffleController(
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.performRaffle(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect((jsonData as { code: string }).code).toBe("NOT_GROUP_ADMIN");
    });

    it("should return 404 when group not found", async () => {
      const {
        PerformRaffleUseCase,
      } = require("../../../../application/use-cases");
      PerformRaffleUseCase.mockImplementation(() => ({
        execute: jest
          .fn()
          .mockRejectedValue(new GroupNotFoundError("group-123")),
      }));

      controller = new RaffleController(
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.performRaffle(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect((jsonData as { code: string }).code).toBe("GROUP_NOT_FOUND");
    });

    it("should return 400 when raffle already completed", async () => {
      const {
        PerformRaffleUseCase,
      } = require("../../../../application/use-cases");
      PerformRaffleUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new RaffleAlreadyCompletedError()),
      }));

      controller = new RaffleController(
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.performRaffle(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect((jsonData as { code: string }).code).toBe(
        "RAFFLE_ALREADY_COMPLETED",
      );
    });

    it("should return 400 when not enough members", async () => {
      const {
        PerformRaffleUseCase,
      } = require("../../../../application/use-cases");
      PerformRaffleUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new NotEnoughMembersError(2)),
      }));

      controller = new RaffleController(
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.performRaffle(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect((jsonData as { code: string }).code).toBe("NOT_ENOUGH_MEMBERS");
    });
  });

  describe("getMyAssignment", () => {
    const mockAssignment = {
      id: "assignment-123",
      groupId: "group-123",
      receiverId: "member-456",
      createdAt: Date.now(),
    };

    it("should get assignment successfully", async () => {
      const {
        GetMyAssignmentUseCase,
      } = require("../../../../application/use-cases");
      const mockExecute = jest.fn().mockResolvedValue(mockAssignment);
      GetMyAssignmentUseCase.mockImplementation(() => ({
        execute: mockExecute,
      }));

      controller = new RaffleController(
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.getMyAssignment(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(jsonData).toEqual(mockAssignment);
    });

    it("should return 401 when user is not authenticated", async () => {
      mockRequest.user = undefined;

      await controller.getMyAssignment(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect((jsonData as { code: string }).code).toBe("UNAUTHORIZED");
    });

    it("should return 403 when user is not a member", async () => {
      const {
        GetMyAssignmentUseCase,
      } = require("../../../../application/use-cases");
      GetMyAssignmentUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new NotGroupMemberError()),
      }));

      controller = new RaffleController(
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.getMyAssignment(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect((jsonData as { code: string }).code).toBe("NOT_GROUP_MEMBER");
    });

    it("should return 404 when group not found", async () => {
      const {
        GetMyAssignmentUseCase,
      } = require("../../../../application/use-cases");
      GetMyAssignmentUseCase.mockImplementation(() => ({
        execute: jest
          .fn()
          .mockRejectedValue(new GroupNotFoundError("group-123")),
      }));

      controller = new RaffleController(
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.getMyAssignment(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect((jsonData as { code: string }).code).toBe("GROUP_NOT_FOUND");
    });

    it("should return 400 when raffle not completed", async () => {
      const {
        GetMyAssignmentUseCase,
        RaffleNotCompletedError,
      } = require("../../../../application/use-cases");
      GetMyAssignmentUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new RaffleNotCompletedError()),
      }));

      controller = new RaffleController(
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.getMyAssignment(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect((jsonData as { code: string }).code).toBe("RAFFLE_NOT_COMPLETED");
    });

    it("should return 404 when assignment not found", async () => {
      const {
        GetMyAssignmentUseCase,
        AssignmentNotFoundError,
      } = require("../../../../application/use-cases");
      GetMyAssignmentUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new AssignmentNotFoundError()),
      }));

      controller = new RaffleController(
        mockGroupRepository,
        mockAssignmentRepository,
      );

      await controller.getMyAssignment(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect((jsonData as { code: string }).code).toBe("ASSIGNMENT_NOT_FOUND");
    });
  });

  describe("error handling", () => {
    it("should return 500 for unexpected errors", async () => {
      const {
        PerformRaffleUseCase,
      } = require("../../../../application/use-cases");
      PerformRaffleUseCase.mockImplementation(() => ({
        execute: jest.fn().mockRejectedValue(new Error("Unexpected error")),
      }));

      controller = new RaffleController(
        mockGroupRepository,
        mockAssignmentRepository,
      );

      // Suppress console.error for this test
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      await controller.performRaffle(
        mockRequest as AuthenticatedRequest,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect((jsonData as { code: string }).code).toBe("INTERNAL_ERROR");

      consoleErrorSpy.mockRestore();
    });
  });
});
