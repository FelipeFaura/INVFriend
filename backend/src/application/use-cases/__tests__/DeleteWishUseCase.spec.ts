/**
 * Delete Wish Use Case Tests
 */
import {
  DeleteWishUseCase,
  DeleteWishRequest,
  WishNotFoundError,
  NotWishOwnerError,
} from "../DeleteWishUseCase";
import { IWishRepository } from "../../../ports/IWishRepository";
import { Wish } from "../../../domain/entities/Wish";

describe("DeleteWishUseCase", () => {
  let useCase: DeleteWishUseCase;
  let mockWishRepository: jest.Mocked<IWishRepository>;

  const mockWish = Wish.create({
    id: "wish-123",
    groupId: "group-456",
    userId: "user-789",
    title: "A Wish",
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

    useCase = new DeleteWishUseCase(mockWishRepository);
  });

  it("should delete wish successfully", async () => {
    mockWishRepository.findById.mockResolvedValue(mockWish);
    mockWishRepository.delete.mockResolvedValue(undefined);

    const request: DeleteWishRequest = {
      wishId: "wish-123",
      userId: "user-789",
    };

    await useCase.execute(request);

    expect(mockWishRepository.delete).toHaveBeenCalledWith("wish-123");
  });

  it("should throw WishNotFoundError when wish does not exist", async () => {
    mockWishRepository.findById.mockResolvedValue(null);

    const request: DeleteWishRequest = {
      wishId: "nonexistent",
      userId: "user-789",
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

    const request: DeleteWishRequest = {
      wishId: "wish-123",
      userId: "other-user",
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
