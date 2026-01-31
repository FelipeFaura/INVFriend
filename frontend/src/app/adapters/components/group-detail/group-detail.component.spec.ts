/**
 * Group Detail Component Tests
 */
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { of, throwError, Subject } from "rxjs";

import { GroupDetailComponent } from "./group-detail.component";
import { GroupHttpService } from "../../services/group-http.service";
import { Group } from "../../../domain/models/group.model";

describe("GroupDetailComponent", () => {
  let component: GroupDetailComponent;
  let fixture: ComponentFixture<GroupDetailComponent>;
  let mockGroupService: jasmine.SpyObj<GroupHttpService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let paramsSubject: Subject<{ id: string }>;

  const mockGroup: Group = {
    id: "group-123",
    name: "Test Group",
    description: "A test group description",
    adminId: "admin-user",
    members: ["admin-user", "member-1", "member-2"],
    budgetLimit: 50,
    raffleStatus: "pending",
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
  };

  beforeEach(async () => {
    mockGroupService = jasmine.createSpyObj("GroupHttpService", [
      "getGroupById",
      "deleteGroup",
      "addMember",
      "removeMember",
    ]);
    mockRouter = jasmine.createSpyObj("Router", ["navigate"]);
    paramsSubject = new Subject();

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [GroupDetailComponent],
      providers: [
        { provide: GroupHttpService, useValue: mockGroupService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: { params: paramsSubject.asObservable() },
        },
      ],
    }).compileComponents();

    // Set current user as admin by default
    spyOn(localStorage, "getItem").and.returnValue("admin-user");
    mockGroupService.getGroupById.and.returnValue(of(mockGroup));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupDetailComponent);
    component = fixture.componentInstance;
  });

  describe("Initialization", () => {
    it("should create", () => {
      fixture.detectChanges();
      paramsSubject.next({ id: "group-123" });
      expect(component).toBeTruthy();
    });

    it("should load group on init", fakeAsync(() => {
      fixture.detectChanges();
      paramsSubject.next({ id: "group-123" });
      tick();

      expect(mockGroupService.getGroupById).toHaveBeenCalledWith("group-123");
      expect(component.group).toEqual(mockGroup);
    }));

    it("should get current user from localStorage", () => {
      fixture.detectChanges();
      expect(component.currentUserId).toBe("admin-user");
    });
  });

  describe("Display", () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      paramsSubject.next({ id: "group-123" });
      tick();
      fixture.detectChanges();
    }));

    it("should display group name", () => {
      const title = fixture.nativeElement.querySelector(".group-title");
      expect(title.textContent).toContain("Test Group");
    });

    it("should display group info", () => {
      const infoSection = fixture.nativeElement.querySelector(".info-section");
      expect(infoSection.textContent).toContain("$50");
      expect(infoSection.textContent).toContain("Pending");
    });

    it("should display description", () => {
      const description = fixture.nativeElement.querySelector(
        ".description-section",
      );
      expect(description.textContent).toContain("A test group description");
    });

    it("should display member list", () => {
      const membersList = fixture.nativeElement.querySelector(
        '[data-testid="members-list"]',
      );
      expect(membersList).toBeTruthy();

      const members = fixture.nativeElement.querySelectorAll(".member-item");
      expect(members.length).toBe(3);
    });

    it("should show admin badge for admin member", () => {
      const adminMember = fixture.nativeElement.querySelector(
        '[data-testid="member-admin-user"]',
      );
      expect(adminMember.textContent).toContain("👑");
      expect(adminMember.textContent).toContain("(Admin)");
    });
  });

  describe("Admin Controls", () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      paramsSubject.next({ id: "group-123" });
      tick();
      fixture.detectChanges();
    }));

    it("should show edit button for admin", () => {
      const editBtn = fixture.nativeElement.querySelector(
        '[data-testid="edit-btn"]',
      );
      expect(editBtn).toBeTruthy();
    });

    it("should show delete button for admin", () => {
      const deleteBtn = fixture.nativeElement.querySelector(
        '[data-testid="delete-btn"]',
      );
      expect(deleteBtn).toBeTruthy();
    });

    it("should show add member button for admin", () => {
      const addBtn = fixture.nativeElement.querySelector(
        '[data-testid="add-member-btn"]',
      );
      expect(addBtn).toBeTruthy();
    });

    it("should show remove button for non-admin members", () => {
      const removeBtn = fixture.nativeElement.querySelector(
        '[data-testid="remove-member-1"]',
      );
      expect(removeBtn).toBeTruthy();
    });

    it("should not show remove button for admin member", () => {
      const removeBtn = fixture.nativeElement.querySelector(
        '[data-testid="remove-admin-user"]',
      );
      expect(removeBtn).toBeFalsy();
    });
  });

  describe("Non-Admin View", () => {
    beforeEach(fakeAsync(() => {
      // Override localStorage mock for non-admin
      (localStorage.getItem as jasmine.Spy).and.returnValue("member-1");

      fixture = TestBed.createComponent(GroupDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      paramsSubject.next({ id: "group-123" });
      tick();
      fixture.detectChanges();
    }));

    it("should hide edit button for non-admin", () => {
      const editBtn = fixture.nativeElement.querySelector(
        '[data-testid="edit-btn"]',
      );
      expect(editBtn).toBeFalsy();
    });

    it("should hide delete button for non-admin", () => {
      const deleteBtn = fixture.nativeElement.querySelector(
        '[data-testid="delete-btn"]',
      );
      expect(deleteBtn).toBeFalsy();
    });

    it("should hide add member button for non-admin", () => {
      const addBtn = fixture.nativeElement.querySelector(
        '[data-testid="add-member-btn"]',
      );
      expect(addBtn).toBeFalsy();
    });

    it("should hide remove buttons for non-admin", () => {
      const removeBtns = fixture.nativeElement.querySelectorAll(".btn-remove");
      expect(removeBtns.length).toBe(0);
    });
  });

  describe("Delete Group", () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      paramsSubject.next({ id: "group-123" });
      tick();
      fixture.detectChanges();
    }));

    it("should show confirmation modal on delete click", () => {
      const deleteBtn = fixture.nativeElement.querySelector(
        '[data-testid="delete-btn"]',
      );
      deleteBtn.click();
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector(
        '[data-testid="delete-modal"]',
      );
      expect(modal).toBeTruthy();
    });

    it("should close modal on cancel", () => {
      component.confirmDelete();
      fixture.detectChanges();

      const cancelBtn = fixture.nativeElement.querySelector(
        '[data-testid="cancel-delete-btn"]',
      );
      cancelBtn.click();
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector(
        '[data-testid="delete-modal"]',
      );
      expect(modal).toBeFalsy();
    });

    it("should delete group and navigate on confirm", fakeAsync(() => {
      mockGroupService.deleteGroup.and.returnValue(
        of({ success: true, message: "Deleted" }),
      );

      component.confirmDelete();
      fixture.detectChanges();

      const confirmBtn = fixture.nativeElement.querySelector(
        '[data-testid="confirm-delete-btn"]',
      );
      confirmBtn.click();
      tick();

      expect(mockGroupService.deleteGroup).toHaveBeenCalledWith("group-123");
      expect(mockRouter.navigate).toHaveBeenCalledWith(["/groups"]);
    }));

    it("should show error on delete failure", fakeAsync(() => {
      mockGroupService.deleteGroup.and.returnValue(
        throwError(() => new Error("Cannot delete after raffle")),
      );

      component.confirmDelete();
      component.deleteGroup();
      tick();
      fixture.detectChanges();

      expect(component.actionError).toBe("Cannot delete after raffle");
    }));
  });

  describe("Add Member", () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      paramsSubject.next({ id: "group-123" });
      tick();
      fixture.detectChanges();
    }));

    it("should show add member modal", () => {
      const addBtn = fixture.nativeElement.querySelector(
        '[data-testid="add-member-btn"]',
      );
      addBtn.click();
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector(
        '[data-testid="add-member-modal"]',
      );
      expect(modal).toBeTruthy();
    });

    it("should add member on confirm", fakeAsync(() => {
      const updatedGroup = {
        ...mockGroup,
        members: [...mockGroup.members, "new-member"],
      };
      mockGroupService.addMember.and.returnValue(of(updatedGroup));

      component.openAddMemberModal();
      component.newMemberId = "new-member";
      component.addMember();
      tick();

      expect(mockGroupService.addMember).toHaveBeenCalledWith(
        "group-123",
        "new-member",
      );
      expect(component.group?.members).toContain("new-member");
      expect(component.showAddMemberModal).toBeFalse();
    }));

    it("should show error on add member failure", fakeAsync(() => {
      mockGroupService.addMember.and.returnValue(
        throwError(() => new Error("Already a member")),
      );

      component.openAddMemberModal();
      component.newMemberId = "member-1";
      component.addMember();
      tick();

      expect(component.actionError).toBe("Already a member");
    }));
  });

  describe("Remove Member", () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      paramsSubject.next({ id: "group-123" });
      tick();
      fixture.detectChanges();
    }));

    it("should show remove confirmation modal", () => {
      const removeBtn = fixture.nativeElement.querySelector(
        '[data-testid="remove-member-1"]',
      );
      removeBtn.click();
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector(
        '[data-testid="remove-member-modal"]',
      );
      expect(modal).toBeTruthy();
    });

    it("should remove member on confirm", fakeAsync(() => {
      const updatedGroup = {
        ...mockGroup,
        members: mockGroup.members.filter((m) => m !== "member-1"),
      };
      mockGroupService.removeMember.and.returnValue(of(updatedGroup));

      component.confirmRemoveMember("member-1");
      component.removeMember();
      tick();

      expect(mockGroupService.removeMember).toHaveBeenCalledWith(
        "group-123",
        "member-1",
      );
      expect(component.group?.members).not.toContain("member-1");
    }));

    it("should show error on remove failure", fakeAsync(() => {
      mockGroupService.removeMember.and.returnValue(
        throwError(() => new Error("Cannot remove admin")),
      );

      component.confirmRemoveMember("admin-user");
      component.removeMember();
      tick();

      expect(component.actionError).toBe("Cannot remove admin");
    }));
  });

  describe("Error States", () => {
    it("should show error on load failure", fakeAsync(() => {
      mockGroupService.getGroupById.and.returnValue(
        throwError(() => new Error("Group not found")),
      );

      fixture.detectChanges();
      paramsSubject.next({ id: "invalid-id" });
      tick();
      fixture.detectChanges();

      const errorEl = fixture.nativeElement.querySelector(
        '[data-testid="error-message"]',
      );
      expect(errorEl).toBeTruthy();
      expect(errorEl.textContent).toContain("Group not found");
    }));
  });

  describe("Navigation", () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      paramsSubject.next({ id: "group-123" });
      tick();
      fixture.detectChanges();
    }));

    it("should navigate back to list", () => {
      const backBtn = fixture.nativeElement.querySelector(
        '[data-testid="back-btn"]',
      );
      backBtn.click();

      expect(mockRouter.navigate).toHaveBeenCalledWith(["/groups"]);
    });
  });

  describe("Helper Methods", () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      paramsSubject.next({ id: "group-123" });
      tick();
    }));

    it("should format date correctly", () => {
      const formatted = component.formatDate(new Date("2026-01-15"));
      expect(formatted).toContain("Jan");
      expect(formatted).toContain("15");
      expect(formatted).toContain("2026");
    });

    it("should return correct status label", () => {
      expect(component.getStatusLabel("pending")).toBe("Pending");
      expect(component.getStatusLabel("completed")).toBe("Completed");
    });

    it("should identify admin member", () => {
      expect(component.isMemberAdmin("admin-user")).toBeTrue();
      expect(component.isMemberAdmin("member-1")).toBeFalse();
    });
  });
});
