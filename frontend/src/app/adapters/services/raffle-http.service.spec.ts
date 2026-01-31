import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { RaffleHttpService } from "./raffle-http.service";
import { environment } from "../../../environments/environment";
import {
  RaffleGroupNotFoundError,
  NotGroupAdminError,
  NotEnoughMembersError,
  RaffleAlreadyCompletedError,
  RaffleNotCompletedError,
  AssignmentNotFoundError,
  UnknownRaffleError,
} from "../../domain/errors/raffle-errors";

describe("RaffleHttpService", () => {
  let service: RaffleHttpService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/groups`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RaffleHttpService],
    });

    service = TestBed.inject(RaffleHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe("performRaffle", () => {
    const groupId = "group-123";

    it("should perform raffle and return result", () => {
      const mockResponse = {
        groupId: "group-123",
        raffleDate: 1700000000000,
        assignmentCount: 5,
      };

      service.performRaffle(groupId).subscribe((result) => {
        expect(result.groupId).toBe("group-123");
        expect(result.assignmentCount).toBe(5);
        expect(result.raffleDate).toBeInstanceOf(Date);
      });

      const req = httpMock.expectOne(`${apiUrl}/${groupId}/raffle`);
      expect(req.request.method).toBe("POST");
      req.flush(mockResponse);
    });

    it("should handle NotGroupAdminError", () => {
      service.performRaffle(groupId).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(NotGroupAdminError);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/${groupId}/raffle`);
      req.flush(
        { code: "NOT_GROUP_ADMIN", message: "Only admin can perform raffle" },
        { status: 403, statusText: "Forbidden" },
      );
    });

    it("should handle GroupNotFoundError", () => {
      service.performRaffle(groupId).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(RaffleGroupNotFoundError);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/${groupId}/raffle`);
      req.flush(
        { code: "GROUP_NOT_FOUND", message: "Group not found" },
        { status: 404, statusText: "Not Found" },
      );
    });

    it("should handle NotEnoughMembersError", () => {
      service.performRaffle(groupId).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(NotEnoughMembersError);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/${groupId}/raffle`);
      req.flush(
        { code: "NOT_ENOUGH_MEMBERS", message: "At least 2 members required" },
        { status: 400, statusText: "Bad Request" },
      );
    });

    it("should handle RaffleAlreadyCompletedError", () => {
      service.performRaffle(groupId).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(RaffleAlreadyCompletedError);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/${groupId}/raffle`);
      req.flush(
        { code: "RAFFLE_ALREADY_COMPLETED", message: "Raffle already done" },
        { status: 400, statusText: "Bad Request" },
      );
    });
  });

  describe("getMyAssignment", () => {
    const groupId = "group-123";

    it("should get assignment and return result", () => {
      const mockResponse = {
        id: "assignment-456",
        groupId: "group-123",
        receiverId: "user-789",
        createdAt: 1700000000000,
      };

      service.getMyAssignment(groupId).subscribe((result) => {
        expect(result.id).toBe("assignment-456");
        expect(result.groupId).toBe("group-123");
        expect(result.receiverId).toBe("user-789");
        expect(result.createdAt).toBeInstanceOf(Date);
      });

      const req = httpMock.expectOne(`${apiUrl}/${groupId}/my-assignment`);
      expect(req.request.method).toBe("GET");
      req.flush(mockResponse);
    });

    it("should handle RaffleNotCompletedError", () => {
      service.getMyAssignment(groupId).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(RaffleNotCompletedError);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/${groupId}/my-assignment`);
      req.flush(
        { code: "RAFFLE_NOT_COMPLETED", message: "Raffle not done yet" },
        { status: 400, statusText: "Bad Request" },
      );
    });

    it("should handle AssignmentNotFoundError", () => {
      service.getMyAssignment(groupId).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(AssignmentNotFoundError);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/${groupId}/my-assignment`);
      req.flush(
        { code: "ASSIGNMENT_NOT_FOUND", message: "Assignment not found" },
        { status: 404, statusText: "Not Found" },
      );
    });
  });

  describe("error handling", () => {
    it("should handle network errors", () => {
      service.performRaffle("group-123").subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(UnknownRaffleError);
          expect(error.message).toContain("connect");
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/group-123/raffle`);
      req.error(new ProgressEvent("error"), { status: 0 });
    });

    it("should handle unknown error codes", () => {
      service.performRaffle("group-123").subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(UnknownRaffleError);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/group-123/raffle`);
      req.flush(
        { code: "WEIRD_ERROR", message: "Something weird" },
        { status: 500, statusText: "Internal Server Error" },
      );
    });
  });
});
