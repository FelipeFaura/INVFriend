/**
 * Tests for GetGroupDetailsUseCase
 */
import { GetGroupDetailsUseCase } from "../GetGroupDetailsUseCase";
import { Group } from "../../../domain/entities/Group";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import { IUserRepository } from "../../../ports/IUserRepository";
import { User } from "../../../domain/entities/User";
import {
  GroupNotFoundError,
  NotGroupMemberError,
} from "../../../domain/errors/GroupErrors";

describe("GetGroupDetailsUseCase", () => {
  let useCase: GetGroupDetailsUseCase;
  let mockRepository: jest.Mocked<IGroupRepository>;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  const createMockGroup = () => {
    return Group.fromDatabase(
      "group-123",
      "Secret Santa 2026",
      "Christmas exchange",
      "admin-123",
      ["admin-123", "member-456"],
      50,
      "pending",
      null,
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

    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
    };

    useCase = new GetGroupDetailsUseCase(mockRepository, mockUserRepository);
  });

  it("should return group details for a member", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);
    mockUserRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute("group-123", "member-456");

    expect(mockRepository.findById).toHaveBeenCalledWith("group-123");
    expect(result.id).toBe("group-123");
    expect(result.name).toBe("Secret Santa 2026");
    expect(result.members).toContain("member-456");
  });

  it("should return group details for the admin", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);
    mockUserRepository.findById.mockResolvedValue(null);

    const result = await useCase.execute("group-123", "admin-123");

    expect(result.adminId).toBe("admin-123");
  });

  it("should throw GroupNotFoundError when group does not exist", async () => {
    mockRepository.findById.mockResolvedValue(null);

    let error: unknown;
    try {
      await useCase.execute("non-existent", "user-123");
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(GroupNotFoundError);
  });

  it("should throw NotGroupMemberError when requester is not a member", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);

    let error: unknown;
    try {
      await useCase.execute("group-123", "non-member-user");
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(NotGroupMemberError);
  });

  it("should return memberDetails with resolved names", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);

    const adminUser = User.fromDatabase(
      "admin-123",
      "admin@example.com",
      "Admin User",
      null,
      Date.now(),
      Date.now(),
    );
    const memberUser = User.fromDatabase(
      "member-456",
      "member@example.com",
      "Member User",
      null,
      Date.now(),
      Date.now(),
    );

    mockUserRepository.findById.mockImplementation(async (id: string) => {
      if (id === "admin-123") return adminUser;
      if (id === "member-456") return memberUser;
      return null;
    });

    const result = await useCase.execute("group-123", "member-456");

    expect(result.memberDetails).toBeDefined();
    expect(result.memberDetails!.length).toBe(2);
    expect(result.memberDetails).toEqual([
      { id: "admin-123", name: "Admin User", email: "admin@example.com" },
      { id: "member-456", name: "Member User", email: "member@example.com" },
    ]);
  });

  it("should use fallback when user not found in repository", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);

    const adminUser = User.fromDatabase(
      "admin-123",
      "admin@example.com",
      "Admin User",
      null,
      Date.now(),
      Date.now(),
    );

    mockUserRepository.findById.mockImplementation(async (id: string) => {
      if (id === "admin-123") return adminUser;
      return null;
    });

    const result = await useCase.execute("group-123", "member-456");

    expect(result.memberDetails).toBeDefined();
    expect(result.memberDetails!.length).toBe(2);
    expect(result.memberDetails![0]).toEqual({
      id: "admin-123",
      name: "Admin User",
      email: "admin@example.com",
    });
    expect(result.memberDetails![1]).toEqual({
      id: "member-456",
      name: "member-456",
      email: "",
    });
  });
});
