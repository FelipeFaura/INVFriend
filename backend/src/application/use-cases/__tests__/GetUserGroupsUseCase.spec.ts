/**
 * Tests for GetUserGroupsUseCase
 */
import { GetUserGroupsUseCase } from "../GetUserGroupsUseCase";
import { Group } from "../../../domain/entities/Group";
import { IGroupRepository } from "../../../ports/IGroupRepository";

describe("GetUserGroupsUseCase", () => {
  let useCase: GetUserGroupsUseCase;
  let mockRepository: jest.Mocked<IGroupRepository>;

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

    useCase = new GetUserGroupsUseCase(mockRepository);
  });

  it("should return list of groups for a user", async () => {
    const mockGroups = [
      Group.fromDatabase(
        "group-1",
        "Secret Santa 2026",
        "Christmas exchange",
        "admin-123",
        ["admin-123", "user-456"],
        50,
        "pending",
        null,
        Date.now(),
        Date.now(),
      ),
      Group.fromDatabase(
        "group-2",
        "Office Party",
        null,
        "user-456",
        ["user-456", "admin-123"],
        25,
        "completed",
        Date.now(),
        Date.now(),
        Date.now(),
      ),
    ];

    mockRepository.findByMemberId.mockResolvedValue(mockGroups);

    const result = await useCase.execute("user-456");

    expect(mockRepository.findByMemberId).toHaveBeenCalledWith("user-456");
    expect(result.length).toBe(2);

    // First group - user is not admin
    expect(result[0].id).toBe("group-1");
    expect(result[0].name).toBe("Secret Santa 2026");
    expect(result[0].memberCount).toBe(2);
    expect(result[0].isAdmin).toBe(false);

    // Second group - user is admin
    expect(result[1].id).toBe("group-2");
    expect(result[1].isAdmin).toBe(true);
    expect(result[1].raffleStatus).toBe("completed");
  });

  it("should return empty array when user has no groups", async () => {
    mockRepository.findByMemberId.mockResolvedValue([]);

    const result = await useCase.execute("lonely-user");

    expect(result).toEqual([]);
  });

  it("should correctly identify admin status for each group", async () => {
    const mockGroups = [
      Group.fromDatabase(
        "group-1",
        "My Group",
        null,
        "user-123", // user is admin
        ["user-123", "other-user"],
        50,
        "pending",
        null,
        Date.now(),
        Date.now(),
      ),
      Group.fromDatabase(
        "group-2",
        "Other Group",
        null,
        "other-admin", // user is not admin
        ["other-admin", "user-123"],
        50,
        "pending",
        null,
        Date.now(),
        Date.now(),
      ),
    ];

    mockRepository.findByMemberId.mockResolvedValue(mockGroups);

    const result = await useCase.execute("user-123");

    expect(result[0].isAdmin).toBe(true);
    expect(result[1].isAdmin).toBe(false);
  });
});
