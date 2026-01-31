/**
 * Firebase Wish Repository Tests
 * Following the same pattern as FirebaseGroupRepository tests
 */
import { FirebaseWishRepository } from "../FirebaseWishRepository";
import { Wish } from "../../../domain/entities/Wish";

// Mock Firebase Admin - same pattern as FirebaseGroupRepository
jest.mock("../../../config/firebase.config", () => {
  const mockDoc = jest.fn();
  const mockWhere = jest.fn();
  const mockCollection = jest.fn(() => ({
    doc: mockDoc,
    where: mockWhere,
  }));

  return {
    db: {
      collection: mockCollection,
      batch: jest.fn(() => ({
        delete: jest.fn(),
        commit: jest.fn().mockResolvedValue(undefined),
      })),
    },
  };
});

describe("FirebaseWishRepository", () => {
  let repository: FirebaseWishRepository;
  let mockCollection: jest.Mock;
  let mockDoc: jest.Mock;
  let mockWhere: jest.Mock;
  let mockDocRef: {
    set: jest.Mock;
    get: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    id: string;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockDocRef = {
      set: jest.fn().mockResolvedValue(undefined),
      get: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      id: "wish-123",
    };

    mockDoc = jest.fn().mockReturnValue(mockDocRef);
    mockWhere = jest.fn().mockReturnThis();

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { db } = require("../../../config/firebase.config");
    mockCollection = db.collection;
    mockCollection.mockReturnValue({
      doc: mockDoc,
      where: mockWhere,
      get: jest.fn(),
    });

    repository = new FirebaseWishRepository();
  });

  describe("save", () => {
    it("should save a wish to Firestore", async () => {
      const wish = Wish.create({
        id: "wish-123",
        groupId: "group-456",
        userId: "user-789",
        title: "Test Wish",
        description: "A test wish",
        estimatedPrice: 100,
        priority: 1,
      });

      await repository.save(wish);

      expect(mockCollection).toHaveBeenCalledWith("wishes");
      expect(mockDoc).toHaveBeenCalledWith("wish-123");
      expect(mockDocRef.set).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("should return wish when found", async () => {
      const wishData = {
        id: "wish-123",
        groupId: "group-456",
        userId: "user-789",
        title: "Test Wish",
        description: "A test wish",
        estimatedPrice: 100,
        priority: 1,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      mockDocRef.get.mockResolvedValue({
        exists: true,
        id: "wish-123",
        data: () => wishData,
      });

      const result = await repository.findById("wish-123");

      expect(result).not.toBeNull();
      expect(result?.id).toBe("wish-123");
      expect(result?.title).toBe("Test Wish");
    });

    it("should return null when not found", async () => {
      mockDocRef.get.mockResolvedValue({
        exists: false,
      });

      const result = await repository.findById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("findByUserInGroup", () => {
    it("should return wishes for user in group", async () => {
      const mockQueryResult = {
        docs: [
          {
            id: "wish-1",
            data: () => ({
              id: "wish-1",
              groupId: "group-123",
              userId: "user-456",
              title: "Wish 1",
              createdAt: Date.now(),
              updatedAt: Date.now(),
            }),
          },
          {
            id: "wish-2",
            data: () => ({
              id: "wish-2",
              groupId: "group-123",
              userId: "user-456",
              title: "Wish 2",
              createdAt: Date.now(),
              updatedAt: Date.now(),
            }),
          },
        ],
      };

      const mockWhereFirst = jest.fn().mockReturnThis();
      const mockWhereSecond = jest.fn().mockReturnThis();
      const mockGet = jest.fn().mockResolvedValue(mockQueryResult);

      mockCollection.mockReturnValue({
        doc: mockDoc,
        where: mockWhereFirst,
        get: mockGet,
      });

      mockWhereFirst.mockReturnValue({
        where: mockWhereSecond,
        get: mockGet,
      });

      mockWhereSecond.mockReturnValue({
        get: mockGet,
      });

      // Recreate repository with updated mock
      repository = new FirebaseWishRepository();

      const wishes = await repository.findByUserInGroup(
        "user-456",
        "group-123",
      );

      expect(wishes.length).toBe(2);
      expect(wishes[0].title).toBe("Wish 1");
      expect(wishes[1].title).toBe("Wish 2");
    });

    it("should return empty array when no wishes found", async () => {
      const mockQueryResult = { docs: [] };

      const mockWhereFirst = jest.fn().mockReturnThis();
      const mockWhereSecond = jest.fn().mockReturnThis();
      const mockGet = jest.fn().mockResolvedValue(mockQueryResult);

      mockCollection.mockReturnValue({
        doc: mockDoc,
        where: mockWhereFirst,
        get: mockGet,
      });

      mockWhereFirst.mockReturnValue({
        where: mockWhereSecond,
        get: mockGet,
      });

      mockWhereSecond.mockReturnValue({
        get: mockGet,
      });

      // Recreate repository with updated mock
      repository = new FirebaseWishRepository();

      const wishes = await repository.findByUserInGroup(
        "user-456",
        "group-123",
      );

      expect(wishes.length).toBe(0);
    });
  });

  describe("findByGroup", () => {
    it("should return all wishes for a group", async () => {
      const mockQueryResult = {
        docs: [
          {
            id: "wish-1",
            data: () => ({
              id: "wish-1",
              groupId: "group-123",
              userId: "user-1",
              title: "Wish 1",
              createdAt: Date.now(),
              updatedAt: Date.now(),
            }),
          },
        ],
      };

      const mockWhere = jest.fn().mockReturnThis();
      const mockGet = jest.fn().mockResolvedValue(mockQueryResult);

      mockCollection.mockReturnValue({
        doc: mockDoc,
        where: mockWhere,
        get: mockGet,
      });

      mockWhere.mockReturnValue({
        get: mockGet,
      });

      // Recreate repository with updated mock
      repository = new FirebaseWishRepository();

      const wishes = await repository.findByGroup("group-123");

      expect(wishes.length).toBe(1);
    });
  });

  describe("update", () => {
    it("should update a wish", async () => {
      const wish = Wish.create({
        id: "wish-123",
        groupId: "group-456",
        userId: "user-789",
        title: "Updated Wish",
      });

      await repository.update(wish);

      expect(mockCollection).toHaveBeenCalledWith("wishes");
      expect(mockDoc).toHaveBeenCalledWith("wish-123");
      expect(mockDocRef.update).toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete a wish", async () => {
      await repository.delete("wish-123");

      expect(mockCollection).toHaveBeenCalledWith("wishes");
      expect(mockDoc).toHaveBeenCalledWith("wish-123");
      expect(mockDocRef.delete).toHaveBeenCalled();
    });
  });
});
