/**
 * Tests for DeleteGroupUseCase
 */
import { DeleteGroupUseCase } from "../DeleteGroupUseCase";
import { Group } from "../../../domain/entities/Group";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import {
  GroupNotFoundError,
  NotGroupAdminError,
  CannotDeleteAfterRaffleError,
} from "../../../domain/errors/GroupErrors";

describe("DeleteGroupUseCase", () => {
  let useCase: DeleteGroupUseCase;
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

    useCase = new DeleteGroupUseCase(mockRepository);
  });

  it("should delete a group successfully", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);
    mockRepository.delete.mockResolvedValue(undefined);

    await useCase.execute("group-123", "admin-123");

    expect(mockRepository.findById).toHaveBeenCalledWith("group-123");
    expect(mockRepository.delete).toHaveBeenCalledWith("group-123");
  });

  it("should throw GroupNotFoundError when group does not exist", async () => {
    mockRepository.findById.mockResolvedValue(null);

    let error: unknown;
    try {
      await useCase.execute("non-existent", "admin-123");
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(GroupNotFoundError);
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });

  it("should throw NotGroupAdminError when requester is not admin", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);

    let error: unknown;
    try {
      await useCase.execute("group-123", "member-456");
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(NotGroupAdminError);
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });

  it("should throw CannotDeleteAfterRaffleError when raffle is completed", async () => {
    const mockGroup = createMockGroup({ raffleStatus: "completed" });
    mockRepository.findById.mockResolvedValue(mockGroup);

    let error: unknown;
    try {
      await useCase.execute("group-123", "admin-123");
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(CannotDeleteAfterRaffleError);
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });

  it("should throw NotGroupAdminError before checking raffle status", async () => {
    const mockGroup = createMockGroup({ raffleStatus: "completed" });
    mockRepository.findById.mockResolvedValue(mockGroup);

    let error: unknown;
    try {
      await useCase.execute("group-123", "non-admin-user");
    } catch (e) {
      error = e;
    }

    // Should fail with NotGroupAdminError, not CannotDeleteAfterRaffleError
    expect(error).toBeInstanceOf(NotGroupAdminError);
  });
});
