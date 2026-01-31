import { FirebaseGroupRepository } from "../FirebaseGroupRepository";
import { Group } from "../../../domain/entities/Group";
import { GroupNotFoundError } from "../../../domain/errors/GroupErrors";

// Mock Firebase Admin
jest.mock("../../../config/firebase.config", () => {
  const mockDoc = jest.fn();
  const mockCollection = jest.fn(() => ({
    doc: mockDoc,
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    get: jest.fn(),
  }));

  return {
    db: {
      collection: mockCollection,
    },
  };
});

describe("FirebaseGroupRepository", () => {
  let repository: FirebaseGroupRepository;
  let mockCollection: jest.Mock;
  let mockDoc: jest.Mock;
  let mockDocRef: {
    set: jest.Mock;
    get: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    id: string;
  };

  const validGroupData = {
    id: "group-123",
    name: "Secret Santa 2026",
    adminId: "admin-user-123",
    budgetLimit: 50,
    description: "Christmas gift exchange",
  };

  const mockGroupDocument = {
    name: "Secret Santa 2026",
    description: "Christmas gift exchange",
    adminId: "admin-user-123",
    members: ["admin-user-123"],
    budgetLimit: 50,
    raffleStatus: "pending" as const,
    raffleDate: null,
    createdAt: 1704067200000,
    updatedAt: 1704067200000,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockDocRef = {
      set: jest.fn().mockResolvedValue(undefined),
      get: jest.fn(),
      update: jest.fn().mockResolvedValue(undefined),
      delete: jest.fn().mockResolvedValue(undefined),
      id: "generated-id",
    };

    mockDoc = jest.fn().mockReturnValue(mockDocRef);

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { db } = require("../../../config/firebase.config");
    mockCollection = db.collection;
    mockCollection.mockReturnValue({
      doc: mockDoc,
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      get: jest.fn(),
    });

    repository = new FirebaseGroupRepository();
  });

  describe("create", () => {
    it("should create a group in Firestore", async () => {
      const group = Group.create(
        validGroupData.id,
        validGroupData.name,
        validGroupData.adminId,
        validGroupData.budgetLimit,
        validGroupData.description,
      );

      const result = await repository.create(group);

      expect(mockDoc).toHaveBeenCalledWith(validGroupData.id);
      expect(mockDocRef.set).toHaveBeenCalled();
      const setCallArg = mockDocRef.set.mock.calls[0][0];
      expect(setCallArg.name).toBe(validGroupData.name);
      expect(setCallArg.adminId).toBe(validGroupData.adminId);
      expect(setCallArg.budgetLimit).toBe(validGroupData.budgetLimit);
      expect(setCallArg.description).toBe(validGroupData.description);
      expect(setCallArg.members).toEqual([validGroupData.adminId]);
      expect(setCallArg.raffleStatus).toBe("pending");
      expect(setCallArg.raffleDate).toBeNull();
      expect(result).toBe(group);
    });
  });

  describe("findById", () => {
    it("should return group when found", async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
        id: validGroupData.id,
        data: () => mockGroupDocument,
      });

      const result = await repository.findById(validGroupData.id);

      expect(mockDoc).toHaveBeenCalledWith(validGroupData.id);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(validGroupData.id);
      expect(result?.name).toBe(mockGroupDocument.name);
      expect(result?.adminId).toBe(mockGroupDocument.adminId);
    });

    it("should return null when group not found", async () => {
      mockDocRef.get.mockResolvedValue({
        exists: false,
      });

      const result = await repository.findById("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("findByMemberId", () => {
    it("should return groups where user is a member", async () => {
      const mockWhere = jest.fn().mockReturnThis();
      const mockOrderBy = jest.fn().mockReturnThis();
      const mockGet = jest.fn().mockResolvedValue({
        docs: [
          { id: "group-1", data: () => mockGroupDocument },
          {
            id: "group-2",
            data: () => ({ ...mockGroupDocument, name: "Group 2" }),
          },
        ],
      });

      mockCollection.mockReturnValue({
        doc: mockDoc,
        where: mockWhere,
        orderBy: mockOrderBy,
        get: mockGet,
      });

      // Create new repository with updated mock
      repository = new FirebaseGroupRepository();

      const result = await repository.findByMemberId("admin-user-123");

      expect(mockWhere).toHaveBeenCalledWith(
        "members",
        "array-contains",
        "admin-user-123",
      );
      expect(mockOrderBy).toHaveBeenCalledWith("createdAt", "desc");
      expect(result.length).toBe(2);
      expect(result[0].id).toBe("group-1");
      expect(result[1].id).toBe("group-2");
    });

    it("should return empty array when no groups found", async () => {
      const mockWhere = jest.fn().mockReturnThis();
      const mockOrderBy = jest.fn().mockReturnThis();
      const mockGet = jest.fn().mockResolvedValue({
        docs: [],
      });

      mockCollection.mockReturnValue({
        doc: mockDoc,
        where: mockWhere,
        orderBy: mockOrderBy,
        get: mockGet,
      });

      repository = new FirebaseGroupRepository();

      const result = await repository.findByMemberId("unknown-user");

      expect(result.length).toBe(0);
    });
  });

  describe("findByAdminId", () => {
    it("should return groups administered by user", async () => {
      const mockWhere = jest.fn().mockReturnThis();
      const mockOrderBy = jest.fn().mockReturnThis();
      const mockGet = jest.fn().mockResolvedValue({
        docs: [{ id: "group-1", data: () => mockGroupDocument }],
      });

      mockCollection.mockReturnValue({
        doc: mockDoc,
        where: mockWhere,
        orderBy: mockOrderBy,
        get: mockGet,
      });

      repository = new FirebaseGroupRepository();

      const result = await repository.findByAdminId("admin-user-123");

      expect(mockWhere).toHaveBeenCalledWith("adminId", "==", "admin-user-123");
      expect(result.length).toBe(1);
      expect(result[0].adminId).toBe("admin-user-123");
    });
  });

  describe("update", () => {
    it("should update an existing group", async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
      });

      const group = Group.fromDatabase(
        validGroupData.id,
        "Updated Name",
        validGroupData.description,
        validGroupData.adminId,
        [validGroupData.adminId],
        100,
        "pending",
        null,
        1704067200000,
        Date.now(),
      );

      await repository.update(group);

      expect(mockDocRef.update).toHaveBeenCalled();
      const updateCallArg = mockDocRef.update.mock.calls[0][0];
      expect(updateCallArg.name).toBe("Updated Name");
      expect(updateCallArg.budgetLimit).toBe(100);
    });

    it("should throw GroupNotFoundError when group does not exist", async () => {
      mockDocRef.get.mockResolvedValue({
        exists: false,
      });

      const group = Group.fromDatabase(
        "non-existent-id",
        "Test",
        null,
        "admin",
        ["admin"],
        50,
        "pending",
        null,
        1704067200000,
        Date.now(),
      );

      let error: unknown;
      try {
        await repository.update(group);
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(GroupNotFoundError);
    });
  });

  describe("delete", () => {
    it("should delete an existing group", async () => {
      mockDocRef.get.mockResolvedValue({
        exists: true,
      });

      await repository.delete(validGroupData.id);

      expect(mockDocRef.delete).toHaveBeenCalled();
    });

    it("should throw GroupNotFoundError when group does not exist", async () => {
      mockDocRef.get.mockResolvedValue({
        exists: false,
      });

      let error: unknown;
      try {
        await repository.delete("non-existent-id");
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(GroupNotFoundError);
    });
  });

  describe("generateId", () => {
    it("should generate a unique id", () => {
      const mockGeneratedDoc = { id: "generated-unique-id" };
      mockDoc.mockReturnValue(mockGeneratedDoc);

      const id = repository.generateId();

      expect(id).toBe("generated-unique-id");
    });
  });
});
