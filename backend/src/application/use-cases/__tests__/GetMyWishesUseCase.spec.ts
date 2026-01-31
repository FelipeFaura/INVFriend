/**
 * Get My Wishes Use Case Tests
 */
import {
  GetMyWishesUseCase,
  GetMyWishesRequest,
  GroupNotFoundError,
  NotGroupMemberError,
} from "../GetMyWishesUseCase";
import { IWishRepository } from "../../../ports/IWishRepository";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import { Group } from "../../../domain/entities/Group";
import { Wish } from "../../../domain/entities/Wish";

describe("GetMyWishesUseCase", () => {
  let useCase: GetMyWishesUseCase;
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

  const mockWishes = [
    Wish.create({
      id: "wish-1",
      groupId: "group-123",
      userId: "user-1",
      title: "Wish 1",
      estimatedPrice: 50,
    }),
    Wish.create({
      id: "wish-2",
      groupId: "group-123",
      userId: "user-1",
      title: "Wish 2",
      estimatedPrice: 100,
    }),
  ];

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

    useCase = new GetMyWishesUseCase(mockWishRepository, mockGroupRepository);
  });

  it("should return user wishes", async () => {
    mockGroupRepository.findById.mockResolvedValue(mockGroup);
    mockWishRepository.findByUserInGroup.mockResolvedValue(mockWishes);

    const request: GetMyWishesRequest = {
      groupId: "group-123",
      userId: "user-1",
    };

    const result = await useCase.execute(request);

    expect(result.length).toBe(2);
    expect(result[0].title).toBe("Wish 1");
    expect(result[1].title).toBe("Wish 2");
  });

  it("should return empty array when no wishes", async () => {
    mockGroupRepository.findById.mockResolvedValue(mockGroup);
    mockWishRepository.findByUserInGroup.mockResolvedValue([]);

    const request: GetMyWishesRequest = {
      groupId: "group-123",
      userId: "user-1",
    };

    const result = await useCase.execute(request);

    expect(result.length).toBe(0);
  });

  it("should throw GroupNotFoundError when group does not exist", async () => {
    mockGroupRepository.findById.mockResolvedValue(null);

    const request: GetMyWishesRequest = {
      groupId: "nonexistent",
      userId: "user-1",
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

    const request: GetMyWishesRequest = {
      groupId: "group-123",
      userId: "outsider",
    };

    let error: unknown;
    try {
      await useCase.execute(request);
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(NotGroupMemberError);
  });
});
