/**
 * Update Wish Use Case Tests
 */
import {
  UpdateWishUseCase,
  UpdateWishRequest,
  WishNotFoundError,
  NotWishOwnerError,
} from "../UpdateWishUseCase";
import { IWishRepository } from "../../../ports/IWishRepository";
import { Wish } from "../../../domain/entities/Wish";

describe("UpdateWishUseCase", () => {
  let useCase: UpdateWishUseCase;
  let mockWishRepository: jest.Mocked<IWishRepository>;

  const mockWish = Wish.create({
    id: "wish-123",
    groupId: "group-456",
    userId: "user-789",
    title: "Original Title",
    description: "Original Description",
    estimatedPrice: 100,
  });

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

    useCase = new UpdateWishUseCase(mockWishRepository);
  });

  it("should update wish title", async () => {
    mockWishRepository.findById.mockResolvedValue(mockWish);
    mockWishRepository.update.mockResolvedValue(undefined);

    const request: UpdateWishRequest = {
      wishId: "wish-123",
      userId: "user-789",
      title: "Updated Title",
    };

    const result = await useCase.execute(request);

    expect(result.title).toBe("Updated Title");
    expect(mockWishRepository.update).toHaveBeenCalled();
  });

  it("should update wish description", async () => {
    mockWishRepository.findById.mockResolvedValue(mockWish);
    mockWishRepository.update.mockResolvedValue(undefined);

    const request: UpdateWishRequest = {
      wishId: "wish-123",
      userId: "user-789",
      description: "New Description",
    };

    const result = await useCase.execute(request);

    expect(result.description).toBe("New Description");
  });

  it("should update wish estimated price", async () => {
    mockWishRepository.findById.mockResolvedValue(mockWish);
    mockWishRepository.update.mockResolvedValue(undefined);

    const request: UpdateWishRequest = {
      wishId: "wish-123",
      userId: "user-789",
      estimatedPrice: 200,
    };

    const result = await useCase.execute(request);

    expect(result.estimatedPrice).toBe(200);
  });

  it("should throw WishNotFoundError when wish does not exist", async () => {
    mockWishRepository.findById.mockResolvedValue(null);

    const request: UpdateWishRequest = {
      wishId: "nonexistent",
      userId: "user-789",
      title: "New Title",
    };

    let error: unknown;
    try {
      await useCase.execute(request);
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(WishNotFoundError);
  });

  it("should throw NotWishOwnerError when user is not the owner", async () => {
    mockWishRepository.findById.mockResolvedValue(mockWish);

    const request: UpdateWishRequest = {
      wishId: "wish-123",
      userId: "other-user",
      title: "New Title",
    };

    let error: unknown;
    try {
      await useCase.execute(request);
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(NotWishOwnerError);
  });
});
