/**
 * Tests for LeaveGroupUseCase
 */
import { LeaveGroupUseCase } from "../LeaveGroupUseCase";
import { Group } from "../../../domain/entities/Group";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import {
  GroupNotFoundError,
  NotGroupMemberError,
  NotGroupAdminError,
  RaffleAlreadyCompletedError,
} from "../../../domain/errors/GroupErrors";

describe("LeaveGroupUseCase", () => {
  let useCase: LeaveGroupUseCase;
  let mockRepository: jest.Mocked<IGroupRepository>;

  const createMockGroup = (overrides?: {
    raffleStatus?: "pending" | "completed";
  }) => {
    return Group.fromDatabase(
      "group-123",
      "Secret Santa 2026",
      "Christmas exchange",
      "admin-123",
      ["admin-123", "member-456"],
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

    useCase = new LeaveGroupUseCase(mockRepository);
  });

  it("should leave group successfully when status is pending", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);
    mockRepository.update.mockResolvedValue(undefined);

    const result = await useCase.execute("group-123", "member-456");

    expect(mockRepository.findById).toHaveBeenCalledWith("group-123");
    expect(mockRepository.update).toHaveBeenCalled();
    expect(result.members).not.toContain("member-456");
  });

  it("should throw GroupNotFoundError when group does not exist", async () => {
    mockRepository.findById.mockResolvedValue(null);

    let error: unknown;
    try {
      await useCase.execute("non-existent", "member-456");
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(GroupNotFoundError);
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("should throw NotGroupMemberError when requester is not a member", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);

    let error: unknown;
    try {
      await useCase.execute("group-123", "stranger-999");
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(NotGroupMemberError);
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("should throw NotGroupAdminError when requester is the admin", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);

    let error: unknown;
    try {
      await useCase.execute("group-123", "admin-123");
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(NotGroupAdminError);
    expect((error as NotGroupAdminError).message).toBe(
      "Group admin cannot leave the group",
    );
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("should throw RaffleAlreadyCompletedError when raffle is completed", async () => {
    const mockGroup = createMockGroup({ raffleStatus: "completed" });
    mockRepository.findById.mockResolvedValue(mockGroup);

    let error: unknown;
    try {
      await useCase.execute("group-123", "member-456");
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(RaffleAlreadyCompletedError);
    expect(mockRepository.update).not.toHaveBeenCalled();
  });
});
