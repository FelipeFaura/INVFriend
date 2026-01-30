import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { AuthHttpService } from "../auth-http.service";
import { environment } from "../../../../environments/environment";
import {
  AuthResponseDTO,
  LoginRequestDTO,
  RegisterRequestDTO,
} from "../../../application/dto/auth.dto";
import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
  NetworkError,
  AuthError,
} from "../../../domain/errors/auth-errors";

describe("AuthHttpService", () => {
  let service: AuthHttpService;
  let httpMock: HttpTestingController;
  const baseUrl = `${environment.apiUrl}/auth`;

  const mockUser = {
    id: "user-123",
    email: "test@example.com",
    name: "Test User",
    photoUrl: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const mockAuthResponse: AuthResponseDTO = {
    user: mockUser,
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
    expiresIn: 3600,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthHttpService],
    });

    service = TestBed.inject(AuthHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe("register", () => {
    it("should register a new user successfully", (done) => {
      const registerData: RegisterRequestDTO = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      };

      service.register(registerData).subscribe({
        next: (response) => {
          expect(response).toEqual(mockAuthResponse);
          expect(response.user.email).toBe(registerData.email);
          done();
        },
        error: done.fail,
      });

      const req = httpMock.expectOne(`${baseUrl}/register`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(registerData);
      req.flush(mockAuthResponse);
    });

    it("should throw UserAlreadyExistsError when email exists", (done) => {
      const registerData: RegisterRequestDTO = {
        email: "existing@example.com",
        password: "password123",
        name: "Test User",
      };

      service.register(registerData).subscribe({
        next: () => done.fail("Expected error"),
        error: (error) => {
          expect(error).toBeInstanceOf(UserAlreadyExistsError);
          expect(error.code).toBe("USER_ALREADY_EXISTS");
          done();
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/register`);
      req.flush(
        {
          code: "USER_ALREADY_EXISTS",
          message: "User already exists",
          email: "existing@example.com",
        },
        { status: 409, statusText: "Conflict" },
      );
    });
  });

  describe("login", () => {
    it("should login successfully with valid credentials", (done) => {
      const loginData: LoginRequestDTO = {
        email: "test@example.com",
        password: "password123",
      };

      service.login(loginData).subscribe({
        next: (response) => {
          expect(response).toEqual(mockAuthResponse);
          expect(response.accessToken).toBe("mock-access-token");
          done();
        },
        error: done.fail,
      });

      const req = httpMock.expectOne(`${baseUrl}/login`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(loginData);
      req.flush(mockAuthResponse);
    });

    it("should throw InvalidCredentialsError for wrong password", (done) => {
      const loginData: LoginRequestDTO = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      service.login(loginData).subscribe({
        next: () => done.fail("Expected error"),
        error: (error) => {
          expect(error).toBeInstanceOf(InvalidCredentialsError);
          expect(error.code).toBe("INVALID_CREDENTIALS");
          done();
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/login`);
      req.flush(
        {
          code: "INVALID_CREDENTIALS",
          message: "Email or password is invalid",
        },
        { status: 401, statusText: "Unauthorized" },
      );
    });
  });

  describe("loginWithGoogle", () => {
    it("should login with Google token successfully", (done) => {
      const googleData = { googleToken: "google-id-token" };

      service.loginWithGoogle(googleData).subscribe({
        next: (response) => {
          expect(response).toEqual(mockAuthResponse);
          done();
        },
        error: done.fail,
      });

      const req = httpMock.expectOne(`${baseUrl}/google`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(googleData);
      req.flush(mockAuthResponse);
    });
  });

  describe("refreshToken", () => {
    it("should refresh token successfully", (done) => {
      const refreshData = { refreshToken: "old-refresh-token" };
      const refreshResponse = {
        accessToken: "new-access-token",
        expiresIn: 3600,
      };

      service.refreshToken(refreshData).subscribe({
        next: (response) => {
          expect(response.accessToken).toBe("new-access-token");
          done();
        },
        error: done.fail,
      });

      const req = httpMock.expectOne(`${baseUrl}/refresh`);
      expect(req.request.method).toBe("POST");
      req.flush(refreshResponse);
    });
  });

  describe("logout", () => {
    it("should logout successfully", (done) => {
      service.logout().subscribe({
        next: () => done(),
        error: done.fail,
      });

      const req = httpMock.expectOne(`${baseUrl}/logout`);
      expect(req.request.method).toBe("POST");
      req.flush(null);
    });
  });

  describe("getCurrentUser", () => {
    it("should get current user successfully", (done) => {
      service.getCurrentUser().subscribe({
        next: (user) => {
          expect(user).toEqual(mockUser);
          done();
        },
        error: done.fail,
      });

      const req = httpMock.expectOne(`${baseUrl}/me`);
      expect(req.request.method).toBe("GET");
      req.flush({ user: mockUser });
    });
  });

  describe("error handling", () => {
    it("should throw NetworkError when server is unreachable", (done) => {
      const loginData: LoginRequestDTO = {
        email: "test@example.com",
        password: "password123",
      };

      service.login(loginData).subscribe({
        next: () => done.fail("Expected error"),
        error: (error) => {
          expect(error).toBeInstanceOf(NetworkError);
          expect(error.code).toBe("NETWORK_ERROR");
          done();
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/login`);
      req.error(new ProgressEvent("error"), {
        status: 0,
        statusText: "Unknown Error",
      });
    });

    it("should throw generic AuthError for unknown error codes", (done) => {
      const loginData: LoginRequestDTO = {
        email: "test@example.com",
        password: "password123",
      };

      service.login(loginData).subscribe({
        next: () => done.fail("Expected error"),
        error: (error) => {
          expect(error).toBeInstanceOf(AuthError);
          expect(error.code).toBe("SOME_UNKNOWN_CODE");
          done();
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/login`);
      req.flush(
        { code: "SOME_UNKNOWN_CODE", message: "Something went wrong" },
        { status: 500, statusText: "Internal Server Error" },
      );
    });
  });
});
