/**
 * Tests for AcceptInvitationUseCase
 */
import { AcceptInvitationUseCase } from "../AcceptInvitationUseCase";
import { Group } from "../../../domain/entities/Group";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import {
  GroupNotFoundError,
  NotPendingMemberError,
} from "../../../domain/errors/GroupErrors";

describe("AcceptInvitationUseCase", () => {
  let useCase: AcceptInvitationUseCase;
  let mockRepository: jest.Mocked<IGroupRepository>;

  const createMockGroup = (overrides?: {
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
      "pending",
      null,
      Date.now(),
      Date.now(),
      overrides?.pendingMembers || ["pending-user"],
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

    useCase = new AcceptInvitationUseCase(mockRepository);
  });

  it("should accept invitation successfully (moves user from pending to members)", async () => {
    const mockGroup = createMockGroup({ pendingMembers: ["pending-user"] });
    mockRepository.findById.mockResolvedValue(mockGroup);
    mockRepository.update.mockResolvedValue(undefined);

    const result = await useCase.execute("group-123", "pending-user");

    expect(result.members).toContain("pending-user");
    expect(result.pendingMembers).not.toContain("pending-user");
    expect(mockRepository.update).toHaveBeenCalledTimes(1);
    expect(mockRepository.findById).toHaveBeenCalledWith("group-123");
  });

  it("should throw GroupNotFoundError when group does not exist", async () => {
    mockRepository.findById.mockResolvedValue(null);

    let error: unknown;
    try {
      await useCase.execute("non-existent", "pending-user");
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(GroupNotFoundError);
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("should throw NotPendingMemberError when user is not pending", async () => {
    const mockGroup = createMockGroup({ pendingMembers: [] });
    mockRepository.findById.mockResolvedValue(mockGroup);

    let error: unknown;
    try {
      await useCase.execute("group-123", "not-pending-user");
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(NotPendingMemberError);
    expect(mockRepository.update).not.toHaveBeenCalled();
  });
});
