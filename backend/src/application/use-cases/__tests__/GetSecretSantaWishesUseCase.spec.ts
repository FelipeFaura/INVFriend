/**
 * Get Secret Santa Wishes Use Case Tests
 */
import {
  GetSecretSantaWishesUseCase,
  GetSecretSantaWishesRequest,
  GroupNotFoundError,
  NotGroupMemberError,
  RaffleNotCompletedError,
  AssignmentNotFoundError,
} from "../GetSecretSantaWishesUseCase";
import { IWishRepository } from "../../../ports/IWishRepository";
import { IGroupRepository } from "../../../ports/IGroupRepository";
import { IAssignmentRepository } from "../../../ports/IAssignmentRepository";
import { Group } from "../../../domain/entities/Group";
import { Assignment } from "../../../domain/entities/Assignment";
import { Wish } from "../../../domain/entities/Wish";

describe("GetSecretSantaWishesUseCase", () => {
  let useCase: GetSecretSantaWishesUseCase;
  let mockWishRepository: jest.Mocked<IWishRepository>;
  let mockGroupRepository: jest.Mocked<IGroupRepository>;
  let mockAssignmentRepository: jest.Mocked<IAssignmentRepository>;

  const mockGroup = Group.fromDatabase(
    "group-123",
    "Test Group",
    "Test description",
    "admin-1",
    ["admin-1", "user-1", "user-2"],
    50,
    "completed", // Raffle completed
    Date.now() - 1000,
    Date.now() - 2000,
    Date.now(),
  );

  const mockPendingGroup = Group.fromDatabase(
    "group-456",
    "Pending Group",
    "Test description",
    "admin-1",
    ["admin-1", "user-1"],
    50,
    "pending", // Raffle not completed
    null,
    Date.now() - 1000,
    Date.now(),
  );

  const mockAssignment = Assignment.create(
    "assignment-1",
    "group-123",
    "user-2", // receiver
    "user-1", // secret santa
  );

  const mockWishes = [
    Wish.create({
      id: "wish-1",
      groupId: "group-123",
      userId: "user-2",
      title: "Wish from recipient",
      description: "Nice item",
      estimatedPrice: 50,
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

    mockAssignmentRepository = {
      create: jest.fn(),
      createBatch: jest.fn(),
      findByGroupId: jest.fn(),
      findByUserId: jest.fn(),
      findByGroupAndSecretSanta: jest.fn(),
      deleteByGroupId: jest.fn(),
      generateId: jest.fn(),
    };

    useCase = new GetSecretSantaWishesUseCase(
      mockWishRepository,
      mockGroupRepository,
      mockAssignmentRepository,
    );
  });

  it("should return secret santa wishes", async () => {
    mockGroupRepository.findById.mockResolvedValue(mockGroup);
    mockAssignmentRepository.findByGroupAndSecretSanta.mockResolvedValue(
      mockAssignment,
    );
    mockWishRepository.findByUserInGroup.mockResolvedValue(mockWishes);

    const request: GetSecretSantaWishesRequest = {
      groupId: "group-123",
      userId: "user-1",
    };

    const result = await useCase.execute(request);

    expect(result.length).toBe(1);
    expect(result[0].title).toBe("Wish from recipient");
    // Should not expose userId - using eslint-disable to avoid type issues
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result[0] as any).userId).toBeUndefined();
  });

  it("should throw GroupNotFoundError when group does not exist", async () => {
    mockGroupRepository.findById.mockResolvedValue(null);

    const request: GetSecretSantaWishesRequest = {
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

    const request: GetSecretSantaWishesRequest = {
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

  it("should throw RaffleNotCompletedError when raffle not done", async () => {
    mockGroupRepository.findById.mockResolvedValue(mockPendingGroup);

    const request: GetSecretSantaWishesRequest = {
      groupId: "group-456",
      userId: "user-1",
    };

    let error: unknown;
    try {
      await useCase.execute(request);
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(RaffleNotCompletedError);
  });

  it("should throw AssignmentNotFoundError when no assignment", async () => {
    mockGroupRepository.findById.mockResolvedValue(mockGroup);
    mockAssignmentRepository.findByGroupAndSecretSanta.mockResolvedValue(null);

    const request: GetSecretSantaWishesRequest = {
      groupId: "group-123",
      userId: "user-1",
    };

    let error: unknown;
    try {
      await useCase.execute(request);
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(AssignmentNotFoundError);
  });

  it("should return empty array when recipient has no wishes", async () => {
    mockGroupRepository.findById.mockResolvedValue(mockGroup);
    mockAssignmentRepository.findByGroupAndSecretSanta.mockResolvedValue(
      mockAssignment,
    );
    mockWishRepository.findByUserInGroup.mockResolvedValue([]);

    const request: GetSecretSantaWishesRequest = {
      groupId: "group-123",
      userId: "user-1",
    };

    const result = await useCase.execute(request);

    expect(result.length).toBe(0);
  });
});
