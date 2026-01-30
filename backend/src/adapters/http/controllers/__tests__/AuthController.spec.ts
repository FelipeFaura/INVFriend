/**
 * Tests for AuthController
 */
import { Request, Response } from "express";
import { AuthController } from "../AuthController";
import { IAuthPort } from "../../../../ports/IAuthPort";
import { User } from "../../../../domain/entities/User";
import {
  InvalidCredentialsError,
  InvalidTokenError,
  UserAlreadyExistsError,
  UserNotFoundError,
  ValidationError,
} from "../../../../domain/errors/AuthErrors";
import { AuthenticatedRequest } from "../../../http/middleware/authMiddleware";

describe("AuthController", () => {
  let controller: AuthController;
  let mockAuthPort: jest.Mocked<IAuthPort>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonData: any;

  beforeEach(() => {
    mockAuthPort = {
      registerWithEmail: jest.fn(),
      loginWithEmail: jest.fn(),
      loginWithGoogle: jest.fn(),
      getCurrentUser: jest.fn(),
      verifyToken: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
    };

    controller = new AuthController(mockAuthPort);

    // Mock response
    jsonData = null;

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockImplementation((data) => {
        jsonData = data;
      }),
    };

    mockRequest = {
      body: {},
      headers: {},
    };
  });

  describe("register", () => {
    it("should successfully register a user", async () => {
      const user = User.create("user123", "test@example.com", "John Doe", null);

      const response = {
        user: user.toJSON(),
        accessToken: "token123",
        expiresIn: 3600,
      };

      mockAuthPort.registerWithEmail.mockResolvedValue(response);

      mockRequest.body = {
        email: "test@example.com",
        password: "Password123",
        name: "John Doe",
      };

      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(response);
    });

    it("should handle UserAlreadyExistsError", async () => {
      mockAuthPort.registerWithEmail.mockRejectedValue(
        new UserAlreadyExistsError("test@example.com"),
      );

      mockRequest.body = {
        email: "test@example.com",
        password: "Password123",
        name: "John Doe",
      };

      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(jsonData.code).toBe("USER_ALREADY_EXISTS");
    });

    it("should handle ValidationError", async () => {
      mockAuthPort.registerWithEmail.mockRejectedValue(
        new ValidationError("Invalid email format"),
      );

      mockRequest.body = {
        email: "invalid",
        password: "Password123",
        name: "John Doe",
      };

      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(jsonData.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("login", () => {
    it("should successfully login user", async () => {
      const user = User.create("user123", "test@example.com", "John Doe", null);

      const response = {
        user: user.toJSON(),
        accessToken: "token123",
        expiresIn: 3600,
      };

      mockAuthPort.loginWithEmail.mockResolvedValue(response);

      mockRequest.body = {
        email: "test@example.com",
        password: "Password123",
      };

      await controller.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(response);
    });

    it("should handle InvalidCredentialsError", async () => {
      mockAuthPort.loginWithEmail.mockRejectedValue(
        new InvalidCredentialsError(),
      );

      mockRequest.body = {
        email: "test@example.com",
        password: "WrongPassword",
      };

      await controller.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(jsonData.code).toBe("INVALID_CREDENTIALS");
    });

    it("should handle UserNotFoundError", async () => {
      mockAuthPort.loginWithEmail.mockRejectedValue(
        new UserNotFoundError("nonexistent@example.com"),
      );

      mockRequest.body = {
        email: "nonexistent@example.com",
        password: "Password123",
      };

      await controller.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(jsonData.code).toBe("USER_NOT_FOUND");
    });
  });

  describe("googleLogin", () => {
    it("should successfully login with Google token", async () => {
      const user = User.create("user123", "test@gmail.com", "John Doe", null);

      const response = {
        user: user.toJSON(),
        accessToken: "token123",
        expiresIn: 3600,
      };

      mockAuthPort.loginWithGoogle.mockResolvedValue(response);

      mockRequest.body = {
        googleToken: "google-token-123",
      };

      await controller.googleLogin(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(response);
    });

    it("should handle InvalidTokenError", async () => {
      mockAuthPort.loginWithGoogle.mockRejectedValue(
        new InvalidTokenError("Invalid Google token"),
      );

      mockRequest.body = {
        googleToken: "invalid-token",
      };

      await controller.googleLogin(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(jsonData.code).toBe("INVALID_TOKEN");
    });

    it("should handle ValidationError for missing token", async () => {
      mockAuthPort.loginWithGoogle.mockRejectedValue(
        new ValidationError("Google token is required"),
      );

      mockRequest.body = {
        googleToken: "",
      };

      await controller.googleLogin(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(jsonData.code).toBe("VALIDATION_ERROR");
    });
  });

  describe("logout", () => {
    it("should successfully logout user", async () => {
      mockAuthPort.logout.mockResolvedValue(undefined);

      const authenticatedReq = mockRequest as AuthenticatedRequest;
      authenticatedReq.user = {
        uid: "user123",
        email: "test@example.com",
      };

      await controller.logout(
        authenticatedReq as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(jsonData.success).toBe(true);
      expect(mockAuthPort.logout).toHaveBeenCalledWith("user123");
    });

    it("should return 401 if user is not authenticated", async () => {
      const authenticatedReq = mockRequest as AuthenticatedRequest;
      authenticatedReq.user = undefined;

      await controller.logout(
        authenticatedReq as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(jsonData.code).toBe("MISSING_USER");
    });
  });

  describe("getCurrentUser", () => {
    it("should retrieve current user", async () => {
      const user = User.create("user123", "test@example.com", "John Doe", null);

      mockAuthPort.getCurrentUser.mockResolvedValue(user);

      const authenticatedReq = mockRequest as AuthenticatedRequest;
      authenticatedReq.user = {
        uid: "user123",
        email: "test@example.com",
      };
      authenticatedReq.headers = {
        authorization: "Bearer token123",
      };

      await controller.getCurrentUser(
        authenticatedReq as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(jsonData.user).toEqual(user.toJSON());
    });

    it("should return 401 if user is not authenticated", async () => {
      const authenticatedReq = mockRequest as AuthenticatedRequest;
      authenticatedReq.user = undefined;
      authenticatedReq.headers = {};

      await controller.getCurrentUser(
        authenticatedReq as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it("should return 401 if authorization header is missing", async () => {
      const authenticatedReq = mockRequest as AuthenticatedRequest;
      authenticatedReq.user = {
        uid: "user123",
        email: "test@example.com",
      };
      authenticatedReq.headers = {};

      await controller.getCurrentUser(
        authenticatedReq as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });

    it("should handle InvalidTokenError", async () => {
      mockAuthPort.getCurrentUser.mockRejectedValue(
        new InvalidTokenError("Token expired"),
      );

      const authenticatedReq = mockRequest as AuthenticatedRequest;
      authenticatedReq.user = {
        uid: "user123",
        email: "test@example.com",
      };
      authenticatedReq.headers = {
        authorization: "Bearer expired-token",
      };

      await controller.getCurrentUser(
        authenticatedReq as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(jsonData.code).toBe("INVALID_TOKEN");
    });
  });

  describe("refreshToken", () => {
    it("should successfully refresh token", async () => {
      const user = User.create("user123", "test@example.com", "John Doe", null);

      const response = {
        user: user.toJSON(),
        accessToken: "new-token-123",
        expiresIn: 3600,
      };

      mockAuthPort.refreshToken.mockResolvedValue(response);

      mockRequest.body = {
        refreshToken: "refresh-token-123",
      };

      await controller.refreshToken(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(response);
    });

    it("should handle InvalidTokenError", async () => {
      mockAuthPort.refreshToken.mockRejectedValue(
        new InvalidTokenError("Refresh token expired"),
      );

      mockRequest.body = {
        refreshToken: "invalid-refresh-token",
      };

      await controller.refreshToken(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(jsonData.code).toBe("INVALID_TOKEN");
    });
  });

  describe("error handling", () => {
    it("should handle generic errors with 500 status", async () => {
      mockAuthPort.registerWithEmail.mockRejectedValue(
        new Error("Unexpected error"),
      );

      mockRequest.body = {
        email: "test@example.com",
        password: "Password123",
        name: "John Doe",
      };

      await controller.register(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(jsonData.code).toBe("INTERNAL_ERROR");
    });
  });
});
