/**
 * Tests for FirebaseAuthAdapter
 */
import { FirebaseAuthAdapter } from "../FirebaseAuthAdapter";
import {
  InvalidCredentialsError,
  InvalidTokenError,
  UserAlreadyExistsError,
  UserNotFoundError,
  ValidationError,
} from "../../../domain/errors/AuthErrors";

describe("FirebaseAuthAdapter", () => {
  let adapter: FirebaseAuthAdapter;
  let mockAuth: any;
  let mockDb: any;

  beforeEach(() => {
    // Mock Firebase Auth
    mockAuth = {
      createUser: jest.fn(),
      getUserByEmail: jest.fn(),
      getUser: jest.fn(),
      createCustomToken: jest.fn(),
      verifyIdToken: jest.fn(),
    };

    // Mock Firestore
    mockDb = {
      collection: jest.fn(),
    };

    adapter = new FirebaseAuthAdapter(mockAuth, mockDb);
  });

  describe("registerWithEmail", () => {
    it("should successfully register a new user", async () => {
      const mockCollectionRef = {
        doc: jest.fn().mockReturnValue({
          set: jest.fn().mockResolvedValue(undefined),
        }),
      };

      mockDb.collection.mockReturnValue(mockCollectionRef);
      mockAuth.getUserByEmail.mockRejectedValue({
        code: "auth/user-not-found",
      });
      mockAuth.createUser.mockResolvedValue({
        uid: "user123",
        email: "test@example.com",
        photoURL: null,
      });
      mockAuth.createCustomToken.mockResolvedValue("token123");

      const response = await adapter.registerWithEmail(
        "test@example.com",
        "Password123",
        "John Doe",
      );

      expect(response.user.email).toBe("test@example.com");
      expect(response.user.name).toBe("John Doe");
      expect(response.accessToken).toBe("token123");
      expect(response.expiresIn).toBe(3600);
      expect(mockAuth.createUser).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "Password123",
        displayName: "John Doe",
      });
    });

    it("should throw UserAlreadyExistsError if user exists", async () => {
      mockAuth.getUserByEmail.mockResolvedValue({
        uid: "existing-user",
      });

      let error: any;
      try {
        await adapter.registerWithEmail(
          "existing@example.com",
          "Password123",
          "John Doe",
        );
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(UserAlreadyExistsError);
    });

    it("should validate email format", async () => {
      let error: any;
      try {
        await adapter.registerWithEmail(
          "invalid-email",
          "Password123",
          "John Doe",
        );
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(ValidationError);
    });

    it("should validate password strength - minimum 8 characters", async () => {
      let error: any;
      try {
        await adapter.registerWithEmail(
          "test@example.com",
          "Pass1",
          "John Doe",
        );
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(ValidationError);
    });

    it("should validate password strength - requires uppercase", async () => {
      let error: any;
      try {
        await adapter.registerWithEmail(
          "test@example.com",
          "password123",
          "John Doe",
        );
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(ValidationError);
    });

    it("should validate password strength - requires number", async () => {
      let error: any;
      try {
        await adapter.registerWithEmail(
          "test@example.com",
          "Password",
          "John Doe",
        );
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(ValidationError);
    });

    it("should validate name length - minimum 2 characters", async () => {
      mockAuth.getUserByEmail.mockRejectedValue({
        code: "auth/user-not-found",
      });

      let error: any;
      try {
        await adapter.registerWithEmail("test@example.com", "Password123", "J");
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(ValidationError);
    });

    it("should normalize email to lowercase", async () => {
      const mockCollectionRef = {
        doc: jest.fn().mockReturnValue({
          set: jest.fn().mockResolvedValue(undefined),
        }),
      };

      mockDb.collection.mockReturnValue(mockCollectionRef);
      mockAuth.getUserByEmail.mockRejectedValue({
        code: "auth/user-not-found",
      });
      mockAuth.createUser.mockResolvedValue({
        uid: "user123",
        photoURL: null,
      });
      mockAuth.createCustomToken.mockResolvedValue("token123");

      await adapter.registerWithEmail(
        "Test@Example.COM",
        "Password123",
        "John Doe",
      );

      const calls = mockAuth.createUser.mock.calls;
      const callArg = calls[0][0];
      expect(callArg.email).toBe("test@example.com");
    });
  });

  describe("loginWithEmail", () => {
    it("should successfully login existing user", async () => {
      const mockDocSnapshot = {
        exists: true,
        data: () => ({
          id: "user123",
          email: "test@example.com",
          name: "John Doe",
          photoUrl: null,
          createdAt: 1000,
          updatedAt: 2000,
        }),
      };

      const mockCollectionRef = {
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue(mockDocSnapshot),
        }),
      };

      mockDb.collection.mockReturnValue(mockCollectionRef);
      mockAuth.getUserByEmail.mockResolvedValue({
        uid: "user123",
      });
      mockAuth.createCustomToken.mockResolvedValue("token123");

      const response = await adapter.loginWithEmail(
        "test@example.com",
        "Password123",
      );

      expect(response.user.email).toBe("test@example.com");
      expect(response.accessToken).toBe("token123");
    });

    it("should throw UserNotFoundError if user does not exist", async () => {
      mockAuth.getUserByEmail.mockRejectedValue({
        code: "auth/user-not-found",
      });

      let error: any;
      try {
        await adapter.loginWithEmail("nonexistent@example.com", "Password123");
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(UserNotFoundError);
    });

    it("should validate email format", async () => {
      let error: any;
      try {
        await adapter.loginWithEmail("invalid-email", "Password123");
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(ValidationError);
    });

    it("should throw InvalidCredentialsError on authentication failure", async () => {
      mockAuth.getUserByEmail.mockRejectedValue(new Error("Auth failed"));

      let error: any;
      try {
        await adapter.loginWithEmail("test@example.com", "WrongPassword");
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(InvalidCredentialsError);
    });
  });

  describe("loginWithGoogle", () => {
    it("should successfully login with Google token for existing user", async () => {
      const mockDocSnapshot = {
        exists: true,
        data: () => ({
          id: "user123",
          email: "test@example.com",
          name: "John Doe",
          photoUrl: "https://example.com/photo.jpg",
          createdAt: 1000,
          updatedAt: 2000,
        }),
      };

      const mockCollectionRef = {
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue(mockDocSnapshot),
          update: jest.fn().mockResolvedValue(undefined),
        }),
      };

      mockDb.collection.mockReturnValue(mockCollectionRef);
      mockAuth.verifyIdToken.mockResolvedValue({
        sub: "user123",
        email: "test@example.com",
        name: "John Doe",
      });
      mockAuth.getUser.mockResolvedValue({
        uid: "user123",
        displayName: "John Doe",
        photoURL: "https://example.com/photo.jpg",
      });
      mockAuth.createCustomToken.mockResolvedValue("token123");

      const response = await adapter.loginWithGoogle("google-token-123");

      expect(response.user.email).toBe("test@example.com");
      expect(response.accessToken).toBe("token123");
    });

    it("should create new user if Google user does not exist", async () => {
      const mockDocSnapshot = {
        exists: false,
      };

      const mockCollectionRef = {
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue(mockDocSnapshot),
          set: jest.fn().mockResolvedValue(undefined),
        }),
      };

      mockDb.collection.mockReturnValue(mockCollectionRef);
      mockAuth.verifyIdToken.mockResolvedValue({
        sub: "new-user-123",
        email: "newuser@gmail.com",
        name: "New User",
      });
      mockAuth.getUser.mockResolvedValue({
        uid: "new-user-123",
        displayName: "New User",
        photoURL: null,
      });
      mockAuth.createCustomToken.mockResolvedValue("token123");

      const response = await adapter.loginWithGoogle("google-token-123");

      expect(response.user.email).toBe("newuser@gmail.com");
      expect(response.user.name).toBe("New User");
      expect(response.accessToken).toBe("token123");
    });

    it("should throw InvalidTokenError if Google token is invalid", async () => {
      mockAuth.verifyIdToken.mockRejectedValue({
        code: "auth/argument-error",
      });

      let error: any;
      try {
        await adapter.loginWithGoogle("invalid-token");
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(InvalidTokenError);
    });

    it("should throw ValidationError if token is missing", async () => {
      let error: any;
      try {
        await adapter.loginWithGoogle("");
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(ValidationError);
    });
  });

  describe("getCurrentUser", () => {
    it("should retrieve current user from valid token", async () => {
      const mockDocSnapshot = {
        exists: true,
        data: () => ({
          id: "user123",
          email: "test@example.com",
          name: "John Doe",
          photoUrl: null,
          createdAt: 1000,
          updatedAt: 2000,
        }),
      };

      const mockCollectionRef = {
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue(mockDocSnapshot),
        }),
      };

      mockDb.collection.mockReturnValue(mockCollectionRef);
      mockAuth.verifyIdToken.mockResolvedValue({
        uid: "user123",
      });

      const user = await adapter.getCurrentUser("valid-token");

      expect(user.id).toBe("user123");
      expect(user.email).toBe("test@example.com");
    });

    it("should throw InvalidTokenError if token is invalid", async () => {
      mockAuth.verifyIdToken.mockRejectedValue({
        code: "auth/argument-error",
      });

      let error: any;
      try {
        await adapter.getCurrentUser("invalid-token");
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(InvalidTokenError);
    });

    it("should throw UserNotFoundError if user not in Firestore", async () => {
      const mockDocSnapshot = {
        exists: false,
      };

      const mockCollectionRef = {
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue(mockDocSnapshot),
        }),
      };

      mockDb.collection.mockReturnValue(mockCollectionRef);
      mockAuth.verifyIdToken.mockResolvedValue({
        uid: "user123",
      });

      let error: any;
      try {
        await adapter.getCurrentUser("valid-token");
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(UserNotFoundError);
    });
  });

  describe("verifyToken", () => {
    it("should return true for valid token", async () => {
      mockAuth.verifyIdToken.mockResolvedValue({
        uid: "user123",
      });

      const isValid = await adapter.verifyToken("valid-token");

      expect(isValid).toBe(true);
    });

    it("should return false for invalid token", async () => {
      mockAuth.verifyIdToken.mockRejectedValue(new Error("Invalid token"));

      const isValid = await adapter.verifyToken("invalid-token");

      expect(isValid).toBe(false);
    });

    it("should return false for empty token", async () => {
      const isValid = await adapter.verifyToken("");

      expect(isValid).toBe(false);
    });
  });

  describe("logout", () => {
    it("should complete logout successfully", async () => {
      await adapter.logout("user123");
    });

    it("should throw ValidationError if userId is missing", async () => {
      let error: any;
      try {
        await adapter.logout("");
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(ValidationError);
    });
  });

  describe("refreshToken", () => {
    it("should successfully refresh token", async () => {
      const mockDocSnapshot = {
        exists: true,
        data: () => ({
          id: "user123",
          email: "test@example.com",
          name: "John Doe",
          photoUrl: null,
          createdAt: 1000,
          updatedAt: 2000,
        }),
      };

      const mockCollectionRef = {
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue(mockDocSnapshot),
        }),
      };

      mockDb.collection.mockReturnValue(mockCollectionRef);
      mockAuth.verifyIdToken.mockResolvedValue({
        uid: "user123",
      });
      mockAuth.createCustomToken.mockResolvedValue("new-token-123");

      const response = await adapter.refreshToken("refresh-token");

      expect(response.accessToken).toBe("new-token-123");
      expect(response.expiresIn).toBe(3600);
    });

    it("should throw InvalidTokenError if refresh token is invalid", async () => {
      mockAuth.verifyIdToken.mockRejectedValue(new Error("Token expired"));

      let error: any;
      try {
        await adapter.refreshToken("invalid-token");
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(InvalidTokenError);
    });
  });
});
