/**
 * Tests for FirebaseUserRepository
 */
import { FirebaseUserRepository } from "../FirebaseUserRepository";
import { User } from "../../../domain/entities/User";

// Mock Firebase Admin
jest.mock("../../../config/firebase.config", () => {
  const mockDoc = jest.fn();
  const mockWhere = jest.fn();
  const mockLimit = jest.fn();
  const mockGet = jest.fn();
  const mockCollection = jest.fn(() => ({
    doc: mockDoc,
    where: mockWhere,
  }));

  mockWhere.mockReturnValue({ limit: mockLimit });
  mockLimit.mockReturnValue({ get: mockGet });

  return {
    db: {
      collection: mockCollection,
    },
  };
});

describe("FirebaseUserRepository", () => {
  let repository: FirebaseUserRepository;
  let mockCollection: jest.Mock;
  let mockDoc: jest.Mock;
  let mockWhere: jest.Mock;
  let mockLimit: jest.Mock;
  let mockGet: jest.Mock;
  let mockDocRef: {
    get: jest.Mock;
    id: string;
  };

  const mockUserDocument = {
    email: "test@example.com",
    name: "Test User",
    photoUrl: null,
    createdAt: 1704067200000,
    updatedAt: 1704067200000,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockDocRef = {
      get: jest.fn(),
      id: "user-123",
    };

    mockDoc = jest.fn().mockReturnValue(mockDocRef);

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { db } = require("../../../config/firebase.config");
    mockCollection = db.collection;

    mockWhere = jest.fn();
    mockLimit = jest.fn();
    mockGet = jest.fn();
    mockWhere.mockReturnValue({ limit: mockLimit });
    mockLimit.mockReturnValue({ get: mockGet });

    mockCollection.mockReturnValue({
      doc: mockDoc,
      where: mockWhere,
    });

    repository = new FirebaseUserRepository();
  });

  describe("findByEmail", () => {
    it("should return user when found by email", async () => {
      const mockSnapshot = {
        empty: false,
        docs: [
          {
            id: "user-456",
            data: () => mockUserDocument,
          },
        ],
      };
      mockGet.mockResolvedValue(mockSnapshot);

      const result = await repository.findByEmail("test@example.com");

      expect(result).toBeInstanceOf(User);
      expect(result?.id).toBe("user-456");
      expect(result?.email).toBe("test@example.com");
      expect(result?.name).toBe("Test User");
      expect(mockWhere).toHaveBeenCalledWith(
        "email",
        "==",
        "test@example.com",
      );
      expect(mockLimit).toHaveBeenCalledWith(1);
    });

    it("should return null when email not found", async () => {
      const mockSnapshot = {
        empty: true,
        docs: [],
      };
      mockGet.mockResolvedValue(mockSnapshot);

      const result = await repository.findByEmail("nonexistent@example.com");

      expect(result).toBeNull();
      expect(mockWhere).toHaveBeenCalledWith(
        "email",
        "==",
        "nonexistent@example.com",
      );
    });

    it("should normalize email to lowercase and trim", async () => {
      const mockSnapshot = {
        empty: true,
        docs: [],
      };
      mockGet.mockResolvedValue(mockSnapshot);

      await repository.findByEmail("  TEST@EXAMPLE.COM  ");

      expect(mockWhere).toHaveBeenCalledWith(
        "email",
        "==",
        "test@example.com",
      );
    });
  });
});
