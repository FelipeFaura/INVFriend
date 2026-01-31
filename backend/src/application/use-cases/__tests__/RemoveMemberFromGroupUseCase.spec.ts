/**
 * Tests for RemoveMemberFromGroupUseCase
 */
import { RemoveMemberFromGroupUseCase } from "../RemoveMemberFromGroupUseCase";
import { Group } from "../../../domain/entities/Group";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import {
  GroupNotFoundError,
  NotGroupAdminError,
  CannotRemoveAdminError,
  NotGroupMemberError,
  RaffleAlreadyCompletedError,
} from "../../../domain/errors/GroupErrors";

describe("RemoveMemberFromGroupUseCase", () => {
  let useCase: RemoveMemberFromGroupUseCase;
  let mockRepository: jest.Mocked<IGroupRepository>;

  const createMockGroup = (overrides?: {
    raffleStatus?: "pending" | "completed";
    members?: string[];
  }) => {
    return Group.fromDatabase(
      "group-123",
      "Secret Santa 2026",
      "Christmas exchange",
      "admin-123",
      overrides?.members || ["admin-123", "member-456", "member-789"],
      50,
      overrides?.raffleStatus || "pending",
      overrides?.raffleStatus === "completed" ? Date.now() : null,
      Date.now(),
      Date.now(),
    );
  };

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByMemberId: jest.fn(),
      findByAdminId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      generateId: jest.fn(),
    };

    useCase = new RemoveMemberFromGroupUseCase(mockRepository);
  });

  it("should remove a member successfully", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);
    mockRepository.update.mockResolvedValue(undefined);

    const result = await useCase.execute({
      groupId: "group-123",
      userId: "member-456",
      requesterId: "admin-123",
    });

    expect(result.members).not.toContain("member-456");
    expect(result.members.length).toBe(2);
    expect(mockRepository.update).toHaveBeenCalled();
  });

  it("should throw GroupNotFoundError when group does not exist", async () => {
    mockRepository.findById.mockResolvedValue(null);

    let error: unknown;
    try {
      await useCase.execute({
        groupId: "non-existent",
        userId: "member-456",
        requesterId: "admin-123",
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(GroupNotFoundError);
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("should throw NotGroupAdminError when requester is not admin", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);

    let error: unknown;
    try {
      await useCase.execute({
        groupId: "group-123",
        userId: "member-789",
        requesterId: "member-456", // Not admin
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(NotGroupAdminError);
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("should throw CannotRemoveAdminError when trying to remove admin", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);

    let error: unknown;
    try {
      await useCase.execute({
        groupId: "group-123",
        userId: "admin-123", // Trying to remove admin
        requesterId: "admin-123",
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(CannotRemoveAdminError);
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("should throw NotGroupMemberError when user is not a member", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);

    let error: unknown;
    try {
      await useCase.execute({
        groupId: "group-123",
        userId: "not-a-member",
        requesterId: "admin-123",
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(NotGroupMemberError);
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("should throw RaffleAlreadyCompletedError when raffle is completed", async () => {
    const mockGroup = createMockGroup({ raffleStatus: "completed" });
    mockRepository.findById.mockResolvedValue(mockGroup);

    let error: unknown;
    try {
      await useCase.execute({
        groupId: "group-123",
        userId: "member-456",
        requesterId: "admin-123",
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(RaffleAlreadyCompletedError);
    expect(mockRepository.update).not.toHaveBeenCalled();
  });
});
