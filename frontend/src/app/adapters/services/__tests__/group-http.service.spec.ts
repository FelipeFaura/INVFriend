/**
 * Group HTTP Service Tests
 */
import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

import { GroupHttpService } from "../group-http.service";
import { environment } from "../../../../environments/environment";
import { Group, GroupSummary } from "../../../domain/models/group.model";
import {
  CreateGroupDTO,
  UpdateGroupDTO,
  GroupResponseDTO,
  GroupListResponseDTO,
} from "../../../application/dto/group.dto";
import {
  GroupNotFoundError,
  NotGroupAdminError,
  AlreadyGroupMemberError,
} from "../../../domain/errors/group-errors";

describe("GroupHttpService", () => {
  let service: GroupHttpService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/groups`;

  // Mock data
  const mockGroupResponse: GroupResponseDTO = {
    id: "group-123",
    name: "Test Group",
    description: "A test group",
    adminId: "user-1",
    members: ["user-1", "user-2"],
    budgetLimit: 50,
    raffleStatus: "pending",
    createdAt: "2026-01-31T10:00:00.000Z",
    updatedAt: "2026-01-31T10:00:00.000Z",
  };

  const mockGroupSummaries: GroupListResponseDTO = {
    groups: [
      {
        id: "group-1",
        name: "Group 1",
        memberCount: 3,
        isAdmin: true,
        raffleStatus: "pending",
      },
      {
        id: "group-2",
        name: "Group 2",
        memberCount: 5,
        isAdmin: false,
        raffleStatus: "completed",
      },
    ],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GroupHttpService],
    });

    service = TestBed.inject(GroupHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe("createGroup", () => {
    it("should create a group and return mapped Group", () => {
      const createDto: CreateGroupDTO = {
        name: "Test Group",
        description: "A test group",
        budgetLimit: 50,
      };

      let result: Group | undefined;
      service.createGroup(createDto).subscribe((group) => {
        result = group;
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(createDto);
      req.flush(mockGroupResponse);

      expect(result).toBeDefined();
      expect(result!.id).toBe("group-123");
      expect(result!.name).toBe("Test Group");
      expect(result!.createdAt).toBeInstanceOf(Date);
    });

    it("should handle validation error", () => {
      const createDto: CreateGroupDTO = {
        name: "AB",
        budgetLimit: 50,
      };

      let error: Error | undefined;
      service.createGroup(createDto).subscribe({
        error: (e) => {
          error = e;
        },
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(
        {
          error: "Bad Request",
          code: "INVALID_GROUP_NAME",
          message: "Group name too short",
        },
        { status: 400, statusText: "Bad Request" },
      );

      expect(error).toBeDefined();
      expect(error!.message).toBe("Group name too short");
    });
  });

  describe("getGroups", () => {
    it("should return array of GroupSummary", () => {
      let result: GroupSummary[] | undefined;
      service.getGroups().subscribe((groups) => {
        result = groups;
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe("GET");
      req.flush(mockGroupSummaries);

      expect(result).toBeDefined();
      expect(result!.length).toBe(2);
      expect(result![0].name).toBe("Group 1");
      expect(result![0].isAdmin).toBe(true);
      expect(result![1].raffleStatus).toBe("completed");
    });
  });

  describe("getGroupById", () => {
    it("should return group details", () => {
      const groupId = "group-123";
      let result: Group | undefined;

      service.getGroupById(groupId).subscribe((group) => {
        result = group;
      });

      const req = httpMock.expectOne(`${apiUrl}/${groupId}`);
      expect(req.request.method).toBe("GET");
      req.flush(mockGroupResponse);

      expect(result).toBeDefined();
      expect(result!.id).toBe("group-123");
      expect(result!.members).toEqual(["user-1", "user-2"]);
    });

    it("should handle not found error", () => {
      const groupId = "nonexistent";
      let error: GroupNotFoundError | undefined;

      service.getGroupById(groupId).subscribe({
        error: (e) => {
          error = e;
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/${groupId}`);
      req.flush(
        {
          error: "Not Found",
          code: "GROUP_NOT_FOUND",
          message: "Group not found",
        },
        { status: 404, statusText: "Not Found" },
      );

      expect(error).toBeInstanceOf(GroupNotFoundError);
      expect(error!.code).toBe("GROUP_NOT_FOUND");
    });

    it("should handle not member error", () => {
      const groupId = "group-123";
      let error: Error | undefined;

      service.getGroupById(groupId).subscribe({
        error: (e) => {
          error = e;
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/${groupId}`);
      req.flush(
        {
          error: "Forbidden",
          code: "NOT_GROUP_MEMBER",
          message: "Not a member",
        },
        { status: 403, statusText: "Forbidden" },
      );

      expect(error).toBeDefined();
      expect(error!.message).toBe("Not a member");
    });
  });

  describe("updateGroup", () => {
    it("should update group and return updated Group", () => {
      const groupId = "group-123";
      const updateDto: UpdateGroupDTO = {
        name: "Updated Group",
        budgetLimit: 100,
      };

      let result: Group | undefined;
      service.updateGroup(groupId, updateDto).subscribe((group) => {
        result = group;
      });

      const req = httpMock.expectOne(`${apiUrl}/${groupId}`);
      expect(req.request.method).toBe("PUT");
      expect(req.request.body).toEqual(updateDto);
      req.flush({
        ...mockGroupResponse,
        name: "Updated Group",
        budgetLimit: 100,
      });

      expect(result).toBeDefined();
      expect(result!.name).toBe("Updated Group");
      expect(result!.budgetLimit).toBe(100);
    });

    it("should handle not admin error", () => {
      const groupId = "group-123";
      const updateDto: UpdateGroupDTO = { name: "New Name" };
      let error: NotGroupAdminError | undefined;

      service.updateGroup(groupId, updateDto).subscribe({
        error: (e) => {
          error = e;
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/${groupId}`);
      req.flush(
        {
          error: "Forbidden",
          code: "NOT_GROUP_ADMIN",
          message: "Only admin can update",
        },
        { status: 403, statusText: "Forbidden" },
      );

      expect(error).toBeInstanceOf(NotGroupAdminError);
    });
  });

  describe("deleteGroup", () => {
    it("should delete group and return success response", () => {
      const groupId = "group-123";
      let result: { success: boolean; message: string } | undefined;

      service.deleteGroup(groupId).subscribe((response) => {
        result = response;
      });

      const req = httpMock.expectOne(`${apiUrl}/${groupId}`);
      expect(req.request.method).toBe("DELETE");
      req.flush({ success: true, message: "Group deleted successfully" });

      expect(result).toBeDefined();
      expect(result!.success).toBe(true);
    });

    it("should handle cannot delete after raffle error", () => {
      const groupId = "group-123";
      let error: Error | undefined;

      service.deleteGroup(groupId).subscribe({
        error: (e) => {
          error = e;
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/${groupId}`);
      req.flush(
        {
          error: "Bad Request",
          code: "CANNOT_DELETE_AFTER_RAFFLE",
          message: "Cannot delete after raffle",
        },
        { status: 400, statusText: "Bad Request" },
      );

      expect(error).toBeDefined();
      expect(error!.message).toBe("Cannot delete after raffle");
    });
  });

  describe("addMember", () => {
    it("should add member and return updated Group", () => {
      const groupId = "group-123";
      const userId = "user-3";

      let result: Group | undefined;
      service.addMember(groupId, userId).subscribe((group) => {
        result = group;
      });

      const req = httpMock.expectOne(`${apiUrl}/${groupId}/members`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual({ userId });
      req.flush({
        ...mockGroupResponse,
        members: ["user-1", "user-2", "user-3"],
      });

      expect(result).toBeDefined();
      expect(result!.members).toContain("user-3");
    });

    it("should handle already member error", () => {
      const groupId = "group-123";
      const userId = "user-2";
      let error: AlreadyGroupMemberError | undefined;

      service.addMember(groupId, userId).subscribe({
        error: (e) => {
          error = e;
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/${groupId}/members`);
      req.flush(
        {
          error: "Bad Request",
          code: "ALREADY_GROUP_MEMBER",
          message: "Already a member",
        },
        { status: 400, statusText: "Bad Request" },
      );

      expect(error).toBeInstanceOf(AlreadyGroupMemberError);
    });
  });

  describe("removeMember", () => {
    it("should remove member and return updated Group", () => {
      const groupId = "group-123";
      const userId = "user-2";

      let result: Group | undefined;
      service.removeMember(groupId, userId).subscribe((group) => {
        result = group;
      });

      const req = httpMock.expectOne(`${apiUrl}/${groupId}/members/${userId}`);
      expect(req.request.method).toBe("DELETE");
      req.flush({
        ...mockGroupResponse,
        members: ["user-1"],
      });

      expect(result).toBeDefined();
      expect(result!.members).not.toContain("user-2");
    });

    it("should handle cannot remove admin error", () => {
      const groupId = "group-123";
      const userId = "user-1"; // admin
      let error: Error | undefined;

      service.removeMember(groupId, userId).subscribe({
        error: (e) => {
          error = e;
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/${groupId}/members/${userId}`);
      req.flush(
        {
          error: "Bad Request",
          code: "CANNOT_REMOVE_ADMIN",
          message: "Cannot remove admin",
        },
        { status: 400, statusText: "Bad Request" },
      );

      expect(error).toBeDefined();
      expect(error!.message).toBe("Cannot remove admin");
    });
  });

  describe("error handling", () => {
    it("should handle network errors", () => {
      let error: Error | undefined;

      service.getGroups().subscribe({
        error: (e) => {
          error = e;
        },
      });

      const req = httpMock.expectOne(apiUrl);
      req.error(new ProgressEvent("Network error"));

      expect(error).toBeDefined();
    });

    it("should handle unknown error codes", () => {
      let error: Error | undefined;

      service.getGroups().subscribe({
        error: (e) => {
          error = e;
        },
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(
        { error: "Error", code: "UNKNOWN_CODE", message: "Unknown error" },
        { status: 500, statusText: "Error" },
      );

      expect(error).toBeDefined();
      expect(error!.message).toBe("Unknown error");
    });
  });
});
