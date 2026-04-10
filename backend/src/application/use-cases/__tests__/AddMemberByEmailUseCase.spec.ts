/**
 * Tests for AddMemberByEmailUseCase
 */
import { AddMemberByEmailUseCase } from "../AddMemberByEmailUseCase";
import { Group } from "../../../domain/entities/Group";
import { User } from "../../../domain/entities/User";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import { IUserRepository } from "../../../ports/IUserRepository";
import {
  GroupNotFoundError,
  NotGroupAdminError,
  AlreadyGroupMemberError,
  RaffleAlreadyCompletedError,
  AlreadyPendingMemberError,
} from "../../../domain/errors/GroupErrors";
import { UserNotFoundError } from "../../../domain/errors/AuthErrors";

describe("AddMemberByEmailUseCase", () => {
  let useCase: AddMemberByEmailUseCase;
  let mockGroupRepository: jest.Mocked<IGroupRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  const createMockGroup = (overrides?: {
    raffleStatus?: "pending" | "completed";
    members?: string[];
    pendingMembers?: string[];
  }): Group => {
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
      overrides?.pendingMembers || [],
    );
  };

  const createMockUser = (id: string, email: string): User => {
    return User.fromDatabase(
      id,
      email,
      "Test User",
      null,
      Date.now(),
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

    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
    };

    useCase = new AddMemberByEmailUseCase(
      mockGroupRepository,
      mockUserRepository,
    );
  });

  it("should add a member by email successfully", async () => {
    const mockGroup = createMockGroup();
    const mockUser = createMockUser("new-member-789", "newmember@test.com");
    mockGroupRepository.findById.mockResolvedValue(mockGroup);
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockGroupRepository.update.mockResolvedValue(undefined);

    const result = await useCase.execute({
      groupId: "group-123",
      email: "newmember@test.com",
      requesterId: "admin-123",
    });

    expect(result.pendingMembers).toContain("new-member-789");
    expect(result.members.length).toBe(1); // Only admin
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      "newmember@test.com",
    );
    expect(mockGroupRepository.update).toHaveBeenCalled();
  });

  it("should throw GroupNotFoundError when group does not exist", async () => {
    mockGroupRepository.findById.mockResolvedValue(null);

    let error: unknown;
    try {
      await useCase.execute({
        groupId: "non-existent",
        email: "user@test.com",
        requesterId: "admin-123",
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(GroupNotFoundError);
    expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    expect(mockGroupRepository.update).not.toHaveBeenCalled();
  });

  it("should throw NotGroupAdminError when requester is not admin", async () => {
    const mockGroup = createMockGroup();
    mockGroupRepository.findById.mockResolvedValue(mockGroup);

    let error: unknown;
    try {
      await useCase.execute({
        groupId: "group-123",
        email: "user@test.com",
        requesterId: "not-admin-user",
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(NotGroupAdminError);
    expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    expect(mockGroupRepository.update).not.toHaveBeenCalled();
  });

  it("should throw UserNotFoundError when email is not registered", async () => {
    const mockGroup = createMockGroup();
    mockGroupRepository.findById.mockResolvedValue(mockGroup);
    mockUserRepository.findByEmail.mockResolvedValue(null);

    let error: unknown;
    try {
      await useCase.execute({
        groupId: "group-123",
        email: "nonexistent@test.com",
        requesterId: "admin-123",
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(UserNotFoundError);
    expect(mockGroupRepository.update).not.toHaveBeenCalled();
  });

  it("should throw AlreadyGroupMemberError when user is already a member", async () => {
    const mockGroup = createMockGroup({
      members: ["admin-123", "existing-member"],
    });
    const mockUser = createMockUser("existing-member", "existing@test.com");
    mockGroupRepository.findById.mockResolvedValue(mockGroup);
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    let error: unknown;
    try {
      await useCase.execute({
        groupId: "group-123",
        email: "existing@test.com",
        requesterId: "admin-123",
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(AlreadyGroupMemberError);
    expect(mockGroupRepository.update).not.toHaveBeenCalled();
  });

  it("should throw RaffleAlreadyCompletedError when raffle is completed", async () => {
    const mockGroup = createMockGroup({ raffleStatus: "completed" });
    const mockUser = createMockUser("new-member", "new@test.com");
    mockGroupRepository.findById.mockResolvedValue(mockGroup);
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    let error: unknown;
    try {
      await useCase.execute({
        groupId: "group-123",
        email: "new@test.com",
        requesterId: "admin-123",
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(RaffleAlreadyCompletedError);
    expect(mockGroupRepository.update).not.toHaveBeenCalled();
  });

  it("should throw AlreadyPendingMemberError when user already has a pending invitation", async () => {
    const mockGroup = createMockGroup({
      pendingMembers: ["pending-user"],
    });
    const mockUser = createMockUser("pending-user", "pending@test.com");
    mockGroupRepository.findById.mockResolvedValue(mockGroup);
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);

    let error: unknown;
    try {
      await useCase.execute({
        groupId: "group-123",
        email: "pending@test.com",
        requesterId: "admin-123",
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(AlreadyPendingMemberError);
    expect(mockGroupRepository.update).not.toHaveBeenCalled();
  });
});
