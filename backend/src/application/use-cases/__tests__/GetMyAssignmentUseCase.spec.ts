import {
  GetMyAssignmentUseCase,
  RaffleNotCompletedError,
  AssignmentNotFoundError,
} from "../GetMyAssignmentUseCase";
import { Group } from "../../../domain/entities/Group";
import { Assignment } from "../../../domain/entities/Assignment";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import { IAssignmentRepository } from "../../../ports/IAssignmentRepository";
import {
  GroupNotFoundError,
  NotGroupMemberError,
} from "../../../domain/errors/GroupErrors";

describe("GetMyAssignmentUseCase", () => {
  let useCase: GetMyAssignmentUseCase;
  let mockGroupRepository: jest.Mocked<IGroupRepository>;
  let mockAssignmentRepository: jest.Mocked<IAssignmentRepository>;

  const adminId = "admin-user-123";
  const memberId = "member-user-456";
  const groupId = "group-123";

  const createMockGroup = (
    raffleStatus: "pending" | "completed" = "completed",
  ): Group => {
    return Group.fromDatabase(
      groupId,
      "Test Group",
      "Test description",
      adminId,
      [adminId, memberId, "member-2"],
      50,
      raffleStatus,
      raffleStatus === "completed" ? Date.now() : null,
      Date.now() - 1000,
      Date.now(),
    );
  };

  const createMockAssignment = (): Assignment => {
    return Assignment.fromDatabase(
      "assignment-123",
      groupId,
      "member-2", // receiverId - who gets the gift
      memberId, // secretSantaId - who gives the gift
      Date.now(),
    );
  };

  beforeEach(() => {
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

    useCase = new GetMyAssignmentUseCase(
      mockGroupRepository,
      mockAssignmentRepository,
    );
  });

  describe("successful retrieval", () => {
    it("should return assignment for a valid group member", async () => {
      const group = createMockGroup("completed");
      const assignment = createMockAssignment();

      mockGroupRepository.findById.mockResolvedValue(group);
      mockAssignmentRepository.findByGroupAndSecretSanta.mockResolvedValue(
        assignment,
      );

      const result = await useCase.execute({
        groupId,
        userId: memberId,
      });

      expect(result.id).toBe(assignment.id);
      expect(result.groupId).toBe(groupId);
      expect(result.receiverId).toBe("member-2");
      expect(result.createdAt).toBeDefined();
    });

    it("should call repository with correct parameters", async () => {
      const group = createMockGroup("completed");
      const assignment = createMockAssignment();

      mockGroupRepository.findById.mockResolvedValue(group);
      mockAssignmentRepository.findByGroupAndSecretSanta.mockResolvedValue(
        assignment,
      );

      await useCase.execute({
        groupId,
        userId: memberId,
      });

      expect(mockGroupRepository.findById).toHaveBeenCalledWith(groupId);
      expect(
        mockAssignmentRepository.findByGroupAndSecretSanta,
      ).toHaveBeenCalledWith(groupId, memberId);
    });

    it("should work for admin users", async () => {
      const group = createMockGroup("completed");
      const assignment = Assignment.fromDatabase(
        "assignment-456",
        groupId,
        memberId, // admin gives to member
        adminId,
        Date.now(),
      );

      mockGroupRepository.findById.mockResolvedValue(group);
      mockAssignmentRepository.findByGroupAndSecretSanta.mockResolvedValue(
        assignment,
      );

      const result = await useCase.execute({
        groupId,
        userId: adminId,
      });

      expect(result.receiverId).toBe(memberId);
    });
  });

  describe("error cases", () => {
    it("should throw GroupNotFoundError if group does not exist", async () => {
      mockGroupRepository.findById.mockResolvedValue(null);

      let error: unknown;
      try {
        await useCase.execute({
          groupId: "nonexistent-group",
          userId: memberId,
        });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(GroupNotFoundError);
    });

    it("should throw NotGroupMemberError if user is not a member", async () => {
      const group = createMockGroup("completed");
      mockGroupRepository.findById.mockResolvedValue(group);

      let error: unknown;
      try {
        await useCase.execute({
          groupId,
          userId: "not-a-member",
        });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(NotGroupMemberError);
    });

    it("should throw RaffleNotCompletedError if raffle not done", async () => {
      const group = createMockGroup("pending");
      mockGroupRepository.findById.mockResolvedValue(group);

      let error: unknown;
      try {
        await useCase.execute({
          groupId,
          userId: memberId,
        });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(RaffleNotCompletedError);
    });

    it("should throw AssignmentNotFoundError if no assignment exists", async () => {
      const group = createMockGroup("completed");
      mockGroupRepository.findById.mockResolvedValue(group);
      mockAssignmentRepository.findByGroupAndSecretSanta.mockResolvedValue(
        null,
      );

      let error: unknown;
      try {
        await useCase.execute({
          groupId,
          userId: memberId,
        });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(AssignmentNotFoundError);
    });

    it("should not query assignment if raffle not completed", async () => {
      const group = createMockGroup("pending");
      mockGroupRepository.findById.mockResolvedValue(group);

      try {
        await useCase.execute({
          groupId,
          userId: memberId,
        });
      } catch {
        // Expected to throw
      }

      expect(
        mockAssignmentRepository.findByGroupAndSecretSanta,
      ).not.toHaveBeenCalled();
    });
  });
});
