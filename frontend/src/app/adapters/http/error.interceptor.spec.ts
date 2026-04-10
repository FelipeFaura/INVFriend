import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import {
  HttpClient,
  HTTP_INTERCEPTORS,
} from "@angular/common/http";
import { Router } from "@angular/router";

import { ErrorInterceptor } from "./error.interceptor";
import { NotificationService } from "../services/notification.service";

describe("ErrorInterceptor", () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    notificationService = jasmine.createSpyObj("NotificationService", [
      "success",
      "error",
      "warning",
      "info",
    ]);
    router = jasmine.createSpyObj("Router", ["navigate"]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptor,
          multi: true,
        },
        { provide: NotificationService, useValue: notificationService },
        { provide: Router, useValue: router },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should pass through successful requests unchanged", () => {
    const testData = { id: 1, name: "test" };

    httpClient.get("/api/data").subscribe((data) => {
      expect(data).toEqual(testData);
    });

    const req = httpMock.expectOne("/api/data");
    req.flush(testData);

    expect(notificationService.error).not.toHaveBeenCalled();
    expect(notificationService.warning).not.toHaveBeenCalled();
  });

  it("should show notification and re-throw on 403", () => {
    httpClient.get("/api/data").subscribe({
      error: (error) => {
        expect(error.status).toBe(403);
      },
    });

    const req = httpMock.expectOne("/api/data");
    req.flush("Forbidden", { status: 403, statusText: "Forbidden" });

    expect(notificationService.error).toHaveBeenCalledWith(
      "You do not have permission to perform this action",
      "Access Denied",
    );
  });

  it("should show notification and re-throw on 404", () => {
    httpClient.get("/api/data").subscribe({
      error: (error) => {
        expect(error.status).toBe(404);
      },
    });

    const req = httpMock.expectOne("/api/data");
    req.flush("Not Found", { status: 404, statusText: "Not Found" });

    expect(notificationService.warning).toHaveBeenCalledWith(
      "The requested resource was not found",
      "Not Found",
    );
  });

  it("should show notification and re-throw on 500", () => {
    httpClient.get("/api/data").subscribe({
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne("/api/data");
    req.flush("Server Error", {
      status: 500,
      statusText: "Internal Server Error",
    });

    expect(notificationService.error).toHaveBeenCalledWith(
      "Something went wrong. Please try again later.",
      "Server Error",
    );
  });

  it("should show notification on 502 (any 5xx)", () => {
    httpClient.get("/api/data").subscribe({
      error: (error) => {
        expect(error.status).toBe(502);
      },
    });

    const req = httpMock.expectOne("/api/data");
    req.flush("Bad Gateway", { status: 502, statusText: "Bad Gateway" });

    expect(notificationService.error).toHaveBeenCalledWith(
      "Something went wrong. Please try again later.",
      "Server Error",
    );
  });

  it("should show connection error notification on status 0", () => {
    httpClient.get("/api/data").subscribe({
      error: (error) => {
        expect(error.status).toBe(0);
      },
    });

    const req = httpMock.expectOne("/api/data");
    req.error(new ProgressEvent("error"), {
      status: 0,
      statusText: "Unknown Error",
    });

    expect(notificationService.error).toHaveBeenCalledWith(
      "Unable to connect to the server. Check your internet connection.",
      "Connection Error",
    );
  });

  it("should navigate to /login on 401", () => {
    httpClient.get("/api/data").subscribe({
      error: (error) => {
        expect(error.status).toBe(401);
      },
    });

    const req = httpMock.expectOne("/api/data");
    req.flush("Unauthorized", { status: 401, statusText: "Unauthorized" });

    expect(notificationService.error).toHaveBeenCalledWith(
      "Session expired. Please log in again.",
      "Session Expired",
    );
    expect(router.navigate).toHaveBeenCalledWith(["/login"]);
  });

  it("should NOT show notification for /auth/login endpoint", () => {
    httpClient.post("/api/auth/login", {}).subscribe({
      error: (error) => {
        expect(error.status).toBe(401);
      },
    });

    const req = httpMock.expectOne("/api/auth/login");
    req.flush("Unauthorized", { status: 401, statusText: "Unauthorized" });

    expect(notificationService.error).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it("should NOT show notification for /auth/register endpoint", () => {
    httpClient.post("/api/auth/register", {}).subscribe({
      error: (error) => {
        expect(error.status).toBe(400);
      },
    });

    const req = httpMock.expectOne("/api/auth/register");
    req.flush("Bad Request", { status: 400, statusText: "Bad Request" });

    expect(notificationService.error).not.toHaveBeenCalled();
    expect(notificationService.warning).not.toHaveBeenCalled();
  });

  it("should STILL handle errors for /auth/me", () => {
    httpClient.get("/api/auth/me").subscribe({
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne("/api/auth/me");
    req.flush("Server Error", {
      status: 500,
      statusText: "Internal Server Error",
    });

    expect(notificationService.error).toHaveBeenCalledWith(
      "Something went wrong. Please try again later.",
      "Server Error",
    );
  });

  it("should STILL handle errors for /auth/logout", () => {
    httpClient.post("/api/auth/logout", {}).subscribe({
      error: (error) => {
        expect(error.status).toBe(500);
      },
    });

    const req = httpMock.expectOne("/api/auth/logout");
    req.flush("Server Error", {
      status: 500,
      statusText: "Internal Server Error",
    });

    expect(notificationService.error).toHaveBeenCalledWith(
      "Something went wrong. Please try again later.",
      "Server Error",
    );
  });
});
