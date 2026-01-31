/**
 * Add Wish Use Case Tests
 */
import {
  AddWishUseCase,
  AddWishRequest,
  NotGroupMemberError,
  GroupNotFoundError,
} from "../AddWishUseCase";
import { IWishRepository } from "../../../ports/IWishRepository";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import { Group } from "../../../domain/entities/Group";

describe("AddWishUseCase", () => {
  let useCase: AddWishUseCase;
  let mockWishRepository: jest.Mocked<IWishRepository>;
  let mockGroupRepository: jest.Mocked<IGroupRepository>;

  const mockGroup = Group.fromDatabase(
    "group-123",
    "Test Group",
    "Test description",
    "admin-1",
    ["admin-1", "user-1", "user-2"],
    50,
    "pending",
    null,
    Date.now() - 1000,
    Date.now(),
  );

  beforeEach(() => {
    mockWishRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByUserInGroup: jest.fn(),
      findByGroup: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteAllByUserInGroup: jest.fn(),
    };

    mockGroupRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByMemberId: jest.fn(),
      findByAdminId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      generateId: jest.fn(),
    };

    useCase = new AddWishUseCase(mockWishRepository, mockGroupRepository);
  });

  it("should add a wish successfully", async () => {
    mockGroupRepository.findById.mockResolvedValue(mockGroup);
    mockWishRepository.save.mockResolvedValue(undefined);

    const request: AddWishRequest = {
      groupId: "group-123",
      userId: "user-1",
      title: "New Headphones",
      description: "Sony WH-1000XM5",
      estimatedPrice: 350,
      priority: 1,
    };

    const result = await useCase.execute(request);

    expect(result.title).toBe("New Headphones");
    expect(result.description).toBe("Sony WH-1000XM5");
    expect(result.estimatedPrice).toBe(350);
    expect(result.priority).toBe(1);
    expect(result.groupId).toBe("group-123");
    expect(result.userId).toBe("user-1");
    expect(result.id).toBeDefined();
    expect(mockWishRepository.save).toHaveBeenCalled();
  });

  it("should throw GroupNotFoundError when group does not exist", async () => {
    mockGroupRepository.findById.mockResolvedValue(null);

    const request: AddWishRequest = {
      groupId: "nonexistent",
      userId: "user-1",
      title: "A wish",
    };

    let error: unknown;
    try {
      await useCase.execute(request);
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(GroupNotFoundError);
  });

  it("should throw NotGroupMemberError when user is not a member", async () => {
    mockGroupRepository.findById.mockResolvedValue(mockGroup);

    const request: AddWishRequest = {
      groupId: "group-123",
      userId: "outsider",
      title: "A wish",
    };

    let error: unknown;
    try {
      await useCase.execute(request);
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(NotGroupMemberError);
  });

  it("should add wish with minimal fields", async () => {
    mockGroupRepository.findById.mockResolvedValue(mockGroup);
    mockWishRepository.save.mockResolvedValue(undefined);

    const request: AddWishRequest = {
      groupId: "group-123",
      userId: "user-1",
      title: "Just a title",
    };

    const result = await useCase.execute(request);

    expect(result.title).toBe("Just a title");
    expect(result.description).toBeUndefined();
    expect(result.url).toBeUndefined();
  });
});
