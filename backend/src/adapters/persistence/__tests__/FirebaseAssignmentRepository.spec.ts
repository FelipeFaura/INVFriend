import { FirebaseAssignmentRepository } from "../FirebaseAssignmentRepository";
import { Assignment } from "../../../domain/entities/Assignment";

// Mock Firebase Admin
jest.mock("../../../config/firebase.config", () => {
  const mockDoc = jest.fn();
  const mockBatch = jest.fn();
  const mockCollection = jest.fn(() => ({
    doc: mockDoc,
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    get: jest.fn(),
  }));

  return {
    db: {
      collection: mockCollection,
      batch: mockBatch,
    },
  };
});

describe("FirebaseAssignmentRepository", () => {
  let repository: FirebaseAssignmentRepository;
  let mockCollection: jest.Mock;
  let mockDoc: jest.Mock;
  let mockDocRef: {
    set: jest.Mock;
    get: jest.Mock;
    id: string;
  };
  let mockBatch: jest.Mock;
  let mockBatchInstance: {
    set: jest.Mock;
    delete: jest.Mock;
    commit: jest.Mock;
  };
  let mockCollectionInstance: {
    doc: jest.Mock;
    where: jest.Mock;
    orderBy: jest.Mock;
    limit: jest.Mock;
    get: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockDocRef = {
      set: jest.fn().mockResolvedValue(undefined),
      get: jest.fn(),
      id: "mock-generated-id",
    };

    mockDoc = jest.fn().mockReturnValue(mockDocRef);

    mockBatchInstance = {
      set: jest.fn(),
      delete: jest.fn(),
      commit: jest.fn().mockResolvedValue(undefined),
    };

    mockCollectionInstance = {
      doc: mockDoc,
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn(),
    };

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { db } = require("../../../config/firebase.config");
    mockCollection = db.collection;
    mockBatch = db.batch;

    mockBatch.mockReturnValue(mockBatchInstance);
    mockCollection.mockReturnValue(mockCollectionInstance);

    repository = new FirebaseAssignmentRepository();
  });

  describe("create", () => {
    it("should create an assignment in Firestore", async () => {
      const assignment = Assignment.fromDatabase(
        "assignment-1",
        "group-1",
        "receiver-1",
        "santa-1",
        1700000000000,
      );

      const result = await repository.create(assignment);

      expect(mockDoc).toHaveBeenCalledWith(assignment.id);
      expect(mockDocRef.set).toHaveBeenCalledWith({
        groupId: assignment.groupId,
        receiverId: assignment.receiverId,
        secretSantaId: assignment.secretSantaId,
        createdAt: assignment.createdAt,
      });
      expect(result).toBe(assignment);
    });
  });

  describe("createBatch", () => {
    it("should create multiple assignments atomically", async () => {
      const assignments = [
        Assignment.fromDatabase(
          "a1",
          "group-1",
          "user-1",
          "user-2",
          Date.now(),
        ),
        Assignment.fromDatabase(
          "a2",
          "group-1",
          "user-2",
          "user-3",
          Date.now(),
        ),
        Assignment.fromDatabase(
          "a3",
          "group-1",
          "user-3",
          "user-1",
          Date.now(),
        ),
      ];

      await repository.createBatch(assignments);

      expect(mockBatchInstance.set).toHaveBeenCalledTimes(3);
      expect(mockBatchInstance.commit).toHaveBeenCalled();
    });

    it("should not call batch operations for empty array", async () => {
      await repository.createBatch([]);

      expect(mockBatchInstance.set).not.toHaveBeenCalled();
      expect(mockBatchInstance.commit).not.toHaveBeenCalled();
    });
  });

  describe("findByGroupId", () => {
    it("should return assignments for a group", async () => {
      const mockDocs = [
        {
          id: "a1",
          data: () => ({
            groupId: "group-1",
            receiverId: "user-1",
            secretSantaId: "user-2",
            createdAt: 1700000000000,
          }),
        },
        {
          id: "a2",
          data: () => ({
            groupId: "group-1",
            receiverId: "user-2",
            secretSantaId: "user-1",
            createdAt: 1700000000001,
          }),
        },
      ];

      mockCollectionInstance.get.mockResolvedValue({ docs: mockDocs });

      const result = await repository.findByGroupId("group-1");

      expect(mockCollectionInstance.where).toHaveBeenCalledWith(
        "groupId",
        "==",
        "group-1",
      );
      expect(mockCollectionInstance.orderBy).toHaveBeenCalledWith(
        "createdAt",
        "asc",
      );
      expect(result.length).toBe(2);
      expect(result[0].id).toBe("a1");
      expect(result[1].id).toBe("a2");
    });

    it("should return empty array if no assignments found", async () => {
      mockCollectionInstance.get.mockResolvedValue({ docs: [] });

      const result = await repository.findByGroupId("nonexistent-group");

      expect(result).toEqual([]);
    });
  });

  describe("findByUserId", () => {
    it("should return assignments where user is involved", async () => {
      const receiverDocs = [
        {
          id: "a1",
          data: () => ({
            groupId: "group-1",
            receiverId: "user-1",
            secretSantaId: "user-2",
            createdAt: 1700000000000,
          }),
        },
      ];

      const santaDocs = [
        {
          id: "a2",
          data: () => ({
            groupId: "group-2",
            receiverId: "user-3",
            secretSantaId: "user-1",
            createdAt: 1700000000001,
          }),
        },
      ];

      // First call (receiverId query), second call (secretSantaId query)
      mockCollectionInstance.get
        .mockResolvedValueOnce({ docs: receiverDocs })
        .mockResolvedValueOnce({ docs: santaDocs });

      const result = await repository.findByUserId("user-1");

      expect(result.length).toBe(2);
    });

    it("should deduplicate assignments where user appears in both queries", async () => {
      const sameDoc = {
        id: "a1",
        data: () => ({
          groupId: "group-1",
          receiverId: "user-1",
          secretSantaId: "user-1",
          createdAt: 1700000000000,
        }),
      };

      mockCollectionInstance.get
        .mockResolvedValueOnce({ docs: [sameDoc] })
        .mockResolvedValueOnce({ docs: [sameDoc] });

      const result = await repository.findByUserId("user-1");

      expect(result.length).toBe(1);
    });
  });

  describe("findByGroupAndSecretSanta", () => {
    it("should return assignment for a secret santa in a group", async () => {
      const mockDocData = {
        id: "a1",
        data: () => ({
          groupId: "group-1",
          receiverId: "user-1",
          secretSantaId: "user-2",
          createdAt: 1700000000000,
        }),
      };

      mockCollectionInstance.get.mockResolvedValue({
        empty: false,
        docs: [mockDocData],
      });

      const result = await repository.findByGroupAndSecretSanta(
        "group-1",
        "user-2",
      );

      expect(mockCollectionInstance.limit).toHaveBeenCalledWith(1);
      expect(result).not.toBeNull();
      expect(result?.id).toBe("a1");
      expect(result?.receiverId).toBe("user-1");
    });

    it("should return null if no assignment found", async () => {
      mockCollectionInstance.get.mockResolvedValue({
        empty: true,
        docs: [],
      });

      const result = await repository.findByGroupAndSecretSanta(
        "group-1",
        "nonexistent-user",
      );

      expect(result).toBeNull();
    });
  });

  describe("deleteByGroupId", () => {
    it("should delete all assignments for a group", async () => {
      const mockDocs = [
        { ref: { id: "a1" } },
        { ref: { id: "a2" } },
        { ref: { id: "a3" } },
      ];

      mockCollectionInstance.get.mockResolvedValue({
        empty: false,
        docs: mockDocs,
      });

      await repository.deleteByGroupId("group-1");

      expect(mockBatchInstance.delete).toHaveBeenCalledTimes(3);
      expect(mockBatchInstance.commit).toHaveBeenCalled();
    });

    it("should not call batch operations if no assignments found", async () => {
      mockCollectionInstance.get.mockResolvedValue({
        empty: true,
        docs: [],
      });

      await repository.deleteByGroupId("nonexistent-group");

      expect(mockBatchInstance.delete).not.toHaveBeenCalled();
      expect(mockBatchInstance.commit).not.toHaveBeenCalled();
    });
  });

  describe("generateId", () => {
    it("should return a unique id from Firestore", () => {
      const id = repository.generateId();

      expect(mockDoc).toHaveBeenCalled();
      expect(id).toBe("mock-generated-id");
    });
  });
});
