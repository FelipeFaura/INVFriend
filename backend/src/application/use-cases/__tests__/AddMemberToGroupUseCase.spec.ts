/**
 * Tests for AddMemberToGroupUseCase
 */
import { AddMemberToGroupUseCase } from "../AddMemberToGroupUseCase";
import { Group } from "../../../domain/entities/Group";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import {
  GroupNotFoundError,
  NotGroupAdminError,
  AlreadyGroupMemberError,
  RaffleAlreadyCompletedError,
} from "../../../domain/errors/GroupErrors";

describe("AddMemberToGroupUseCase", () => {
  let useCase: AddMemberToGroupUseCase;
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
      overrides?.members || ["admin-123"],
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

    useCase = new AddMemberToGroupUseCase(mockRepository);
  });

  it("should add a member successfully", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);
    mockRepository.update.mockResolvedValue(undefined);

    const result = await useCase.execute({
      groupId: "group-123",
      userId: "new-member-789",
      requesterId: "admin-123",
    });

    expect(result.members).toContain("new-member-789");
    expect(result.members.length).toBe(2);
    expect(mockRepository.update).toHaveBeenCalled();
  });

  it("should throw GroupNotFoundError when group does not exist", async () => {
    mockRepository.findById.mockResolvedValue(null);

    let error: unknown;
    try {
      await useCase.execute({
        groupId: "non-existent",
        userId: "user-123",
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
        userId: "new-member",
        requesterId: "not-admin-user",
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(NotGroupAdminError);
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("should throw AlreadyGroupMemberError when user is already a member", async () => {
    const mockGroup = createMockGroup({
      members: ["admin-123", "existing-member"],
    });
    mockRepository.findById.mockResolvedValue(mockGroup);

    let error: unknown;
    try {
      await useCase.execute({
        groupId: "group-123",
        userId: "existing-member",
        requesterId: "admin-123",
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(AlreadyGroupMemberError);
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("should throw RaffleAlreadyCompletedError when raffle is completed", async () => {
    const mockGroup = createMockGroup({ raffleStatus: "completed" });
    mockRepository.findById.mockResolvedValue(mockGroup);

    let error: unknown;
    try {
      await useCase.execute({
        groupId: "group-123",
        userId: "new-member",
        requesterId: "admin-123",
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(RaffleAlreadyCompletedError);
    expect(mockRepository.update).not.toHaveBeenCalled();
  });
});
