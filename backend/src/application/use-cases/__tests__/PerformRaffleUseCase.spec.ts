import { PerformRaffleUseCase } from "../PerformRaffleUseCase";
import { Group } from "../../../domain/entities/Group";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import { IAssignmentRepository } from "../../../ports/IAssignmentRepository";
import {
  GroupNotFoundError,
  NotGroupAdminError,
  RaffleAlreadyCompletedError,
  NotEnoughMembersError,
} from "../../../domain/errors/GroupErrors";

describe("PerformRaffleUseCase", () => {
  let useCase: PerformRaffleUseCase;
  let mockGroupRepository: jest.Mocked<IGroupRepository>;
  let mockAssignmentRepository: jest.Mocked<IAssignmentRepository>;

  const adminId = "admin-user-123";
  const groupId = "group-123";

  const createMockGroup = (
    members: string[] = [adminId, "member-1", "member-2"],
    raffleStatus: "pending" | "completed" = "pending",
  ): Group => {
    return Group.fromDatabase(
      groupId,
      "Test Group",
      "Test description",
      adminId,
      members,
      50,
      raffleStatus,
      raffleStatus === "completed" ? Date.now() : null,
      Date.now() - 1000,
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
      generateId: jest.fn().mockReturnValue("assignment-id"),
    };

    useCase = new PerformRaffleUseCase(
      mockGroupRepository,
      mockAssignmentRepository,
    );
  });

  describe("successful raffle", () => {
    it("should perform raffle for a valid group", async () => {
      const group = createMockGroup([adminId, "member-1", "member-2"]);
      mockGroupRepository.findById.mockResolvedValue(group);
      mockAssignmentRepository.createBatch.mockResolvedValue(undefined);
      mockGroupRepository.update.mockResolvedValue(undefined);

      const result = await useCase.execute({
        groupId,
        requesterId: adminId,
      });

      expect(result.groupId).toBe(groupId);
      expect(result.assignmentCount).toBe(3);
      expect(result.raffleDate).toBeDefined();
      expect(typeof result.raffleDate).toBe("number");
    });

    it("should create assignments for all members", async () => {
      const members = [adminId, "member-1", "member-2", "member-3"];
      const group = createMockGroup(members);
      mockGroupRepository.findById.mockResolvedValue(group);
      mockAssignmentRepository.createBatch.mockResolvedValue(undefined);
      mockGroupRepository.update.mockResolvedValue(undefined);

      await useCase.execute({
        groupId,
        requesterId: adminId,
      });

      expect(mockAssignmentRepository.createBatch).toHaveBeenCalled();
      const assignments = mockAssignmentRepository.createBatch.mock.calls[0][0];
      expect(assignments.length).toBe(4);
    });

    it("should update group status to completed", async () => {
      const group = createMockGroup();
      mockGroupRepository.findById.mockResolvedValue(group);
      mockAssignmentRepository.createBatch.mockResolvedValue(undefined);
      mockGroupRepository.update.mockResolvedValue(undefined);

      await useCase.execute({
        groupId,
        requesterId: adminId,
      });

      expect(mockGroupRepository.update).toHaveBeenCalled();
      const updatedGroup = mockGroupRepository.update.mock.calls[0][0];
      expect(updatedGroup.raffleStatus).toBe("completed");
      expect(updatedGroup.raffleDate).not.toBeNull();
    });

    it("should work with exactly 2 members (minimum)", async () => {
      const group = createMockGroup([adminId, "member-1"]);
      mockGroupRepository.findById.mockResolvedValue(group);
      mockAssignmentRepository.createBatch.mockResolvedValue(undefined);
      mockGroupRepository.update.mockResolvedValue(undefined);

      const result = await useCase.execute({
        groupId,
        requesterId: adminId,
      });

      expect(result.assignmentCount).toBe(2);
    });

    it("should generate unique IDs for each assignment", async () => {
      let idCounter = 0;
      mockAssignmentRepository.generateId.mockImplementation(
        () => `assignment-${++idCounter}`,
      );

      const group = createMockGroup([adminId, "member-1", "member-2"]);
      mockGroupRepository.findById.mockResolvedValue(group);
      mockAssignmentRepository.createBatch.mockResolvedValue(undefined);
      mockGroupRepository.update.mockResolvedValue(undefined);

      await useCase.execute({
        groupId,
        requesterId: adminId,
      });

      expect(mockAssignmentRepository.generateId).toHaveBeenCalledTimes(3);
    });
  });

  describe("error cases", () => {
    it("should throw GroupNotFoundError if group does not exist", async () => {
      mockGroupRepository.findById.mockResolvedValue(null);

      let error: unknown;
      try {
        await useCase.execute({
          groupId: "nonexistent-group",
          requesterId: adminId,
        });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(GroupNotFoundError);
    });

    it("should throw NotGroupAdminError if requester is not admin", async () => {
      const group = createMockGroup();
      mockGroupRepository.findById.mockResolvedValue(group);

      let error: unknown;
      try {
        await useCase.execute({
          groupId,
          requesterId: "not-admin-user",
        });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(NotGroupAdminError);
    });

    it("should throw RaffleAlreadyCompletedError if raffle was already done", async () => {
      const group = createMockGroup(
        [adminId, "member-1", "member-2"],
        "completed",
      );
      mockGroupRepository.findById.mockResolvedValue(group);

      let error: unknown;
      try {
        await useCase.execute({
          groupId,
          requesterId: adminId,
        });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(RaffleAlreadyCompletedError);
    });

    it("should throw NotEnoughMembersError if only 1 member", async () => {
      const group = createMockGroup([adminId]);
      mockGroupRepository.findById.mockResolvedValue(group);

      let error: unknown;
      try {
        await useCase.execute({
          groupId,
          requesterId: adminId,
        });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(NotEnoughMembersError);
    });

    it("should not create assignments if validation fails", async () => {
      mockGroupRepository.findById.mockResolvedValue(null);

      try {
        await useCase.execute({
          groupId,
          requesterId: adminId,
        });
      } catch {
        // Expected to throw
      }

      expect(mockAssignmentRepository.createBatch).not.toHaveBeenCalled();
    });

    it("should not update group if validation fails", async () => {
      const group = createMockGroup([adminId]); // Not enough members
      mockGroupRepository.findById.mockResolvedValue(group);

      try {
        await useCase.execute({
          groupId,
          requesterId: adminId,
        });
      } catch {
        // Expected to throw
      }

      expect(mockGroupRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("assignment validation", () => {
    it("should create assignments where no one is their own santa", async () => {
      const members = [adminId, "member-1", "member-2", "member-3", "member-4"];
      const group = createMockGroup(members);
      mockGroupRepository.findById.mockResolvedValue(group);
      mockAssignmentRepository.createBatch.mockResolvedValue(undefined);
      mockGroupRepository.update.mockResolvedValue(undefined);

      await useCase.execute({
        groupId,
        requesterId: adminId,
      });

      const assignments = mockAssignmentRepository.createBatch.mock.calls[0][0];
      for (const assignment of assignments) {
        expect(assignment.receiverId).not.toBe(assignment.secretSantaId);
      }
    });

    it("should ensure everyone receives exactly one gift", async () => {
      const members = [adminId, "member-1", "member-2", "member-3"];
      const group = createMockGroup(members);
      mockGroupRepository.findById.mockResolvedValue(group);
      mockAssignmentRepository.createBatch.mockResolvedValue(undefined);
      mockGroupRepository.update.mockResolvedValue(undefined);

      await useCase.execute({
        groupId,
        requesterId: adminId,
      });

      const assignments = mockAssignmentRepository.createBatch.mock.calls[0][0];
      const receivers = assignments.map(
        (a: { receiverId: string }) => a.receiverId,
      );
      const uniqueReceivers = new Set(receivers);
      expect(uniqueReceivers.size).toBe(members.length);
    });

    it("should ensure everyone gives exactly one gift", async () => {
      const members = [adminId, "member-1", "member-2", "member-3"];
      const group = createMockGroup(members);
      mockGroupRepository.findById.mockResolvedValue(group);
      mockAssignmentRepository.createBatch.mockResolvedValue(undefined);
      mockGroupRepository.update.mockResolvedValue(undefined);

      await useCase.execute({
        groupId,
        requesterId: adminId,
      });

      const assignments = mockAssignmentRepository.createBatch.mock.calls[0][0];
      const santas = assignments.map(
        (a: { secretSantaId: string }) => a.secretSantaId,
      );
      const uniqueSantas = new Set(santas);
      expect(uniqueSantas.size).toBe(members.length);
    });
  });
});
