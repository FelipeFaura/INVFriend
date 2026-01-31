/**
 * Tests for CreateGroupUseCase
 */
import { CreateGroupUseCase } from "../CreateGroupUseCase";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import {
  InvalidGroupNameError,
  InvalidBudgetLimitError,
} from "../../../domain/errors/GroupErrors";

describe("CreateGroupUseCase", () => {
  let useCase: CreateGroupUseCase;
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

    useCase = new CreateGroupUseCase(mockRepository);
  });

  it("should create a group successfully", async () => {
    const dto = {
      name: "Secret Santa 2026",
      adminId: "admin-123",
      budgetLimit: 50,
      description: "Christmas gift exchange",
    };

    mockRepository.generateId.mockReturnValue("group-123");
    mockRepository.create.mockImplementation(async (group) => group);

    const result = await useCase.execute(dto);

    expect(mockRepository.generateId).toHaveBeenCalled();
    expect(mockRepository.create).toHaveBeenCalled();
    expect(result.id).toBe("group-123");
    expect(result.name).toBe(dto.name);
    expect(result.adminId).toBe(dto.adminId);
    expect(result.budgetLimit).toBe(dto.budgetLimit);
    expect(result.description).toBe(dto.description);
    expect(result.members).toEqual([dto.adminId]);
    expect(result.raffleStatus).toBe("pending");
  });

  it("should create a group without description", async () => {
    const dto = {
      name: "Office Party",
      adminId: "admin-456",
      budgetLimit: 25,
    };

    mockRepository.generateId.mockReturnValue("group-456");
    mockRepository.create.mockImplementation(async (group) => group);

    const result = await useCase.execute(dto);

    expect(result.description).toBeNull();
  });

  it("should throw InvalidGroupNameError for short name", async () => {
    const dto = {
      name: "AB",
      adminId: "admin-123",
      budgetLimit: 50,
    };

    mockRepository.generateId.mockReturnValue("group-123");

    let error: unknown;
    try {
      await useCase.execute(dto);
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(InvalidGroupNameError);
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it("should throw InvalidBudgetLimitError for zero budget", async () => {
    const dto = {
      name: "Valid Name",
      adminId: "admin-123",
      budgetLimit: 0,
    };

    mockRepository.generateId.mockReturnValue("group-123");

    let error: unknown;
    try {
      await useCase.execute(dto);
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(InvalidBudgetLimitError);
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it("should throw InvalidBudgetLimitError for negative budget", async () => {
    const dto = {
      name: "Valid Name",
      adminId: "admin-123",
      budgetLimit: -10,
    };

    mockRepository.generateId.mockReturnValue("group-123");

    let error: unknown;
    try {
      await useCase.execute(dto);
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(InvalidBudgetLimitError);
  });
});
