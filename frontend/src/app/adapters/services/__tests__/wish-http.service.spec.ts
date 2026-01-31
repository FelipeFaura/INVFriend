/**
 * Wish HTTP Service Tests
 */
import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { WishHttpService } from "../wish-http.service";
import { environment } from "../../../../environments/environment";
import { Wish } from "../../../domain/models/wish.model";
import {
  CreateWishDTO,
  UpdateWishDTO,
  WishResponseDTO,
  WishListResponseDTO,
} from "../../../application/dto/wish.dto";
import {
  WishNotFoundError,
  NotWishOwnerError,
  RaffleNotCompletedError,
  NoAssignmentError,
} from "../../../domain/errors/wish-errors";

describe("WishHttpService", () => {
  let service: WishHttpService;
  let httpMock: HttpTestingController;
  const groupId = "group-123";
  const apiUrl = `${environment.apiUrl}/groups/${groupId}/wishes`;

  // Mock data
  const mockWishResponse: WishResponseDTO = {
    id: "wish-123",
    groupId: "group-123",
    userId: "user-1",
    title: "PlayStation 5",
    description: "The new console",
    url: "https://example.com/ps5",
    estimatedPrice: 500,
    priority: 1,
    createdAt: "2026-01-31T10:00:00.000Z",
    updatedAt: "2026-01-31T10:00:00.000Z",
  };

  const mockWishListResponse: WishListResponseDTO = {
    wishes: [
      mockWishResponse,
      {
        id: "wish-456",
        groupId: "group-123",
        userId: "user-1",
        title: "Nintendo Switch",
        description: "Gaming on the go",
        estimatedPrice: 300,
        priority: 2,
        createdAt: "2026-01-31T11:00:00.000Z",
        updatedAt: "2026-01-31T11:00:00.000Z",
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WishHttpService],
    });

    service = TestBed.inject(WishHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe("createWish", () => {
    it("should create a wish and return mapped Wish", () => {
      const createDto: CreateWishDTO = {
        title: "PlayStation 5",
        description: "The new console",
        url: "https://example.com/ps5",
        estimatedPrice: 500,
        priority: 1,
      };

      let result: Wish | undefined;
      service.createWish(groupId, createDto).subscribe((wish) => {
        result = wish;
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(createDto);
      req.flush(mockWishResponse);

      expect(result).toBeDefined();
      expect(result!.id).toBe("wish-123");
      expect(result!.title).toBe("PlayStation 5");
      expect(result!.createdAt).toBeInstanceOf(Date);
    });

    it("should handle validation error", () => {
      const createDto: CreateWishDTO = {
        title: "",
      };

      let error: Error | undefined;
      service.createWish(groupId, createDto).subscribe({
        error: (e) => {
          error = e;
        },
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(
        {
          error: "Bad Request",
          code: "VALIDATION_ERROR",
          message: "Title is required",
        },
        { status: 400, statusText: "Bad Request" },
      );

      expect(error).toBeDefined();
      expect(error!.message).toBe("Title is required");
    });
  });

  describe("getMyWishes", () => {
    it("should get list of wishes", () => {
      let result: Wish[] | undefined;
      service.getMyWishes(groupId).subscribe((wishes) => {
        result = wishes;
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe("GET");
      req.flush(mockWishListResponse);

      expect(result).toBeDefined();
      expect(result!.length).toBe(2);
      expect(result![0].title).toBe("PlayStation 5");
      expect(result![1].title).toBe("Nintendo Switch");
    });

    it("should return empty array when no wishes", () => {
      let result: Wish[] | undefined;
      service.getMyWishes(groupId).subscribe((wishes) => {
        result = wishes;
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ wishes: [] });

      expect(result).toEqual([]);
    });
  });

  describe("getAssignedWishes", () => {
    it("should get assigned recipient wishes", () => {
      let result: Wish[] | undefined;
      service.getAssignedWishes(groupId).subscribe((wishes) => {
        result = wishes;
      });

      const req = httpMock.expectOne(`${apiUrl}/assigned`);
      expect(req.request.method).toBe("GET");
      req.flush(mockWishListResponse);

      expect(result).toBeDefined();
      expect(result!.length).toBe(2);
    });

    it("should handle raffle not completed error", () => {
      let error: Error | undefined;
      service.getAssignedWishes(groupId).subscribe({
        error: (e) => {
          error = e;
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/assigned`);
      req.flush(
        {
          error: "Bad Request",
          code: "RAFFLE_NOT_COMPLETED",
          message: "Raffle has not been completed",
        },
        { status: 400, statusText: "Bad Request" },
      );

      expect(error).toBeInstanceOf(RaffleNotCompletedError);
    });

    it("should handle no assignment error", () => {
      let error: Error | undefined;
      service.getAssignedWishes(groupId).subscribe({
        error: (e) => {
          error = e;
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/assigned`);
      req.flush(
        {
          error: "Bad Request",
          code: "NO_ASSIGNMENT",
          message: "User has no assignment",
        },
        { status: 400, statusText: "Bad Request" },
      );

      expect(error).toBeInstanceOf(NoAssignmentError);
    });
  });

  describe("updateWish", () => {
    it("should update a wish", () => {
      const updateDto: UpdateWishDTO = {
        title: "Updated Title",
        priority: 2,
      };

      const updatedResponse: WishResponseDTO = {
        ...mockWishResponse,
        title: "Updated Title",
        priority: 2,
      };

      let result: Wish | undefined;
      service.updateWish(groupId, "wish-123", updateDto).subscribe((wish) => {
        result = wish;
      });

      const req = httpMock.expectOne(`${apiUrl}/wish-123`);
      expect(req.request.method).toBe("PUT");
      expect(req.request.body).toEqual(updateDto);
      req.flush(updatedResponse);

      expect(result).toBeDefined();
      expect(result!.title).toBe("Updated Title");
      expect(result!.priority).toBe(2);
    });

    it("should handle wish not found error", () => {
      let error: Error | undefined;
      service.updateWish(groupId, "invalid-wish", { title: "Test" }).subscribe({
        error: (e) => {
          error = e;
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/invalid-wish`);
      req.flush(
        {
          error: "Not Found",
          code: "WISH_NOT_FOUND",
          message: "Wish not found",
        },
        { status: 404, statusText: "Not Found" },
      );

      expect(error).toBeInstanceOf(WishNotFoundError);
    });

    it("should handle not owner error", () => {
      let error: Error | undefined;
      service.updateWish(groupId, "wish-123", { title: "Test" }).subscribe({
        error: (e) => {
          error = e;
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/wish-123`);
      req.flush(
        {
          error: "Forbidden",
          code: "NOT_WISH_OWNER",
          message: "User is not the owner",
        },
        { status: 403, statusText: "Forbidden" },
      );

      expect(error).toBeInstanceOf(NotWishOwnerError);
    });
  });

  describe("deleteWish", () => {
    it("should delete a wish", () => {
      let result: { success: boolean; message: string } | undefined;
      service.deleteWish(groupId, "wish-123").subscribe((response) => {
        result = response;
      });

      const req = httpMock.expectOne(`${apiUrl}/wish-123`);
      expect(req.request.method).toBe("DELETE");
      req.flush({ success: true, message: "Wish deleted successfully" });

      expect(result).toBeDefined();
      expect(result!.success).toBe(true);
    });

    it("should handle wish not found error on delete", () => {
      let error: Error | undefined;
      service.deleteWish(groupId, "invalid-wish").subscribe({
        error: (e) => {
          error = e;
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/invalid-wish`);
      req.flush(
        {
          error: "Not Found",
          code: "WISH_NOT_FOUND",
          message: "Wish not found",
        },
        { status: 404, statusText: "Not Found" },
      );

      expect(error).toBeInstanceOf(WishNotFoundError);
    });
  });

  describe("error handling", () => {
    it("should handle network error", () => {
      let error: Error | undefined;
      service.getMyWishes(groupId).subscribe({
        error: (e) => {
          error = e;
        },
      });

      const req = httpMock.expectOne(apiUrl);
      req.error(new ProgressEvent("error"), { status: 0 });

      expect(error).toBeDefined();
      expect(error!.message).toBe("Unable to connect to server");
    });
  });
});
