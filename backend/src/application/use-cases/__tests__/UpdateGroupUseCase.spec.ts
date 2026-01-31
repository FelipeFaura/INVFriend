/**
 * Tests for UpdateGroupUseCase
 */
import { UpdateGroupUseCase } from "../UpdateGroupUseCase";
import { Group } from "../../../domain/entities/Group";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import {
  GroupNotFoundError,
  NotGroupAdminError,
  InvalidGroupNameError,
  InvalidBudgetLimitError,
} from "../../../domain/errors/GroupErrors";

describe("UpdateGroupUseCase", () => {
  let useCase: UpdateGroupUseCase;
  let mockRepository: jest.Mocked<IGroupRepository>;

  const createMockGroup = () => {
    return Group.fromDatabase(
      "group-123",
      "Original Name",
      "Original description",
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

    useCase = new UpdateGroupUseCase(mockRepository);
  });

  it("should update group name", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);
    mockRepository.update.mockResolvedValue(undefined);

    const result = await useCase.execute(
      "group-123",
      { name: "Updated Name" },
      "admin-123",
    );

    expect(result.name).toBe("Updated Name");
    expect(mockRepository.update).toHaveBeenCalled();
  });

  it("should update group description", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);
    mockRepository.update.mockResolvedValue(undefined);

    const result = await useCase.execute(
      "group-123",
      { description: "New description" },
      "admin-123",
    );

    expect(result.description).toBe("New description");
  });

  it("should update budget limit", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);
    mockRepository.update.mockResolvedValue(undefined);

    const result = await useCase.execute(
      "group-123",
      { budgetLimit: 100 },
      "admin-123",
    );

    expect(result.budgetLimit).toBe(100);
  });

  it("should update multiple fields at once", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);
    mockRepository.update.mockResolvedValue(undefined);

    const result = await useCase.execute(
      "group-123",
      { name: "New Name", description: "New desc", budgetLimit: 75 },
      "admin-123",
    );

    expect(result.name).toBe("New Name");
    expect(result.description).toBe("New desc");
    expect(result.budgetLimit).toBe(75);
  });

  it("should throw GroupNotFoundError when group does not exist", async () => {
    mockRepository.findById.mockResolvedValue(null);

    let error: unknown;
    try {
      await useCase.execute("non-existent", { name: "New" }, "admin-123");
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
      await useCase.execute("group-123", { name: "New" }, "member-456");
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(NotGroupAdminError);
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("should throw InvalidGroupNameError for invalid name", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);

    let error: unknown;
    try {
      await useCase.execute("group-123", { name: "AB" }, "admin-123");
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(InvalidGroupNameError);
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it("should throw InvalidBudgetLimitError for invalid budget", async () => {
    const mockGroup = createMockGroup();
    mockRepository.findById.mockResolvedValue(mockGroup);

    let error: unknown;
    try {
      await useCase.execute("group-123", { budgetLimit: 0 }, "admin-123");
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(InvalidBudgetLimitError);
    expect(mockRepository.update).not.toHaveBeenCalled();
  });
});
