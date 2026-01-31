/**
 * Tests for GetGroupDetailsUseCase
 */
import { GetGroupDetailsUseCase } from "../GetGroupDetailsUseCase";
import { Group } from "../../../domain/entities/Group";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import {
  GroupNotFoundError,
  NotGroupMemberError,
} from "../../../domain/errors/GroupErrors";

describe("GetGroupDetailsUseCase", () => {
  let useCase: GetGroupDetailsUseCase;
  let mockRepository: jest.Mocked<IGroupRepository>;

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

    useCase = new GetGroupDetailsUseCase(mockRepository);
  });

  it("should return group details for a member", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);

    const result = await useCase.execute("group-123", "member-456");

    expect(mockRepository.findById).toHaveBeenCalledWith("group-123");
    expect(result.id).toBe("group-123");
    expect(result.name).toBe("Secret Santa 2026");
    expect(result.members).toContain("member-456");
  });

  it("should return group details for the admin", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);

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
});
