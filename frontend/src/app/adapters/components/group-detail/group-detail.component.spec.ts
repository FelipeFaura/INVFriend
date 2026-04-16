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
import { TranslatePipe } from '../../pipes/translate.pipe';
import { of, throwError, Subject } from "rxjs";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { GroupDetailComponent } from "./group-detail.component";
import { GroupHttpService } from "../../services/group-http.service";
import { Group } from "../../../domain/models/group.model";
import { AuthApplicationService } from "../../../application/services/auth-application.service";
import { AngularFirestore } from "@angular/fire/compat/firestore";

describe("GroupDetailComponent", () => {
  let component: GroupDetailComponent;
  let fixture: ComponentFixture<GroupDetailComponent>;
  let mockGroupService: jasmine.SpyObj<GroupHttpService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: { currentUser: { id: string; email: string; displayName: string } | null };
  let mockFirestore: jasmine.SpyObj<AngularFirestore>;
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
      "addMemberByEmail",
      "removeMember",
      "updateGroup",
      "acceptInvitation",
      "rejectInvitation",
      "leaveGroup",
    ]);
    mockRouter = jasmine.createSpyObj("Router", ["navigate"]);
    
    // Create a simple object mock for AuthApplicationService (allows changing currentUser)
    mockAuthService = {
      currentUser: { id: "admin-user", email: "admin@test.com", displayName: "Admin User" },
    };
    
    // Create a proper mock for AngularFirestore that includes get() method
    const mockDocRef = {
      get: jasmine.createSpy().and.returnValue(of({ exists: true, data: () => ({ name: "Test User", email: "test@test.com" }) })),
      valueChanges: jasmine.createSpy().and.returnValue(of({})),
    };
    const mockCollectionRef = {
      doc: jasmine.createSpy().and.returnValue(mockDocRef),
    };
    mockFirestore = jasmine.createSpyObj("AngularFirestore", ["collection"]);
    (mockFirestore.collection as jasmine.Spy).and.returnValue(mockCollectionRef as any);
    
    paramsSubject = new Subject();

    await TestBed.configureTestingModule({
      imports: [FormsModule, TranslatePipe],
      declarations: [GroupDetailComponent],
      providers: [
        { provide: GroupHttpService, useValue: mockGroupService },
        { provide: Router, useValue: mockRouter },
        { provide: AuthApplicationService, useValue: mockAuthService },
        { provide: AngularFirestore, useValue: mockFirestore },
        {
          provide: ActivatedRoute,
          useValue: { params: paramsSubject.asObservable() },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
      const title = fixture.nativeElement.querySelector(".group-header__title");
      expect(title.textContent).toContain("Test Group");
    });

    it("should display group info", () => {
      const infoSection = fixture.nativeElement.querySelector(".group-info");
      expect(infoSection.textContent).toContain("$50");
    });

    it("should display description", () => {
      const description = fixture.nativeElement.querySelector(
        ".description-text",
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
      expect(adminMember.textContent).toContain("Admin");
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
      // Change mock to simulate non-admin user BEFORE creating fixture
      mockAuthService.currentUser = { id: "member-1", email: "member@test.com", displayName: "Member User" };
      
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
      mockGroupService.addMemberByEmail.and.returnValue(of(updatedGroup));

      component.openAddMemberModal();
      component.newMemberEmail = "newmember@test.com";
      component.addMember();
      tick();

      expect(mockGroupService.addMemberByEmail).toHaveBeenCalledWith(
        "group-123",
        "newmember@test.com",
      );
      expect(component.group?.members).toContain("new-member");
      expect(component.showAddMemberModal).toBeFalse();
    }));

    it("should show error on add member failure", fakeAsync(() => {
      mockGroupService.addMemberByEmail.and.returnValue(
        throwError(() => new Error("Already a member")),
      );

      component.openAddMemberModal();
      component.newMemberEmail = "member@test.com";
      component.addMember();
      tick();

      expect(component.actionError).toBe("Already a member");
    }));

    it("should show validation error for invalid email", () => {
      component.openAddMemberModal();
      component.newMemberEmail = "not-an-email";
      component.addMember();

      expect(component.actionError).toBe("Please enter a valid email address");
      expect(mockGroupService.addMemberByEmail).not.toHaveBeenCalled();
    });
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

    it("should return null for getMemberPhotoUrl when no memberDetails", () => {
      expect(component.getMemberPhotoUrl("admin-user")).toBeNull();
      expect(component.getMemberPhotoUrl("member-1")).toBeNull();
    });
  });

  describe("Member Photo", () => {
    const groupWithPhotos: Group = {
      ...mockGroup,
      memberDetails: [
        { id: "admin-user", name: "Admin User", email: "admin@test.com", photoUrl: "https://example.com/admin.jpg" },
        { id: "member-1", name: "Member One", email: "member1@test.com", photoUrl: null },
        { id: "member-2", name: "Member Two", email: "member2@test.com", photoUrl: "https://example.com/member2.jpg" },
      ],
    };

    beforeEach(fakeAsync(() => {
      mockGroupService.getGroupById.and.returnValue(of(groupWithPhotos));
      fixture = TestBed.createComponent(GroupDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      paramsSubject.next({ id: "group-123" });
      tick();
      fixture.detectChanges();
    }));

    it("should populate memberPhotos from memberDetails", () => {
      expect(component.getMemberPhotoUrl("admin-user")).toBe("https://example.com/admin.jpg");
      expect(component.getMemberPhotoUrl("member-1")).toBeNull();
      expect(component.getMemberPhotoUrl("member-2")).toBe("https://example.com/member2.jpg");
    });

    it("should return null for unknown member", () => {
      expect(component.getMemberPhotoUrl("unknown-id")).toBeNull();
    });

    it("should render img when member has a photo", () => {
      const adminItem = fixture.nativeElement.querySelector('[data-testid="member-admin-user"]');
      const img = adminItem.querySelector('img.member-item__photo');
      expect(img).toBeTruthy();
      expect(img.getAttribute('src')).toBe("https://example.com/admin.jpg");
      expect(img.getAttribute('alt')).toBe("Admin User");
    });

    it("should render initial span when member has no photo", () => {
      const memberItem = fixture.nativeElement.querySelector('[data-testid="member-member-1"]');
      const img = memberItem.querySelector('img.member-item__photo');
      const span = memberItem.querySelector('.member-item__avatar span');
      expect(img).toBeFalsy();
      expect(span).toBeTruthy();
      expect(span.textContent.trim()).toBe("M");
    });
  });

  describe("Edit Group", () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      paramsSubject.next({ id: "group-123" });
      tick();
      fixture.detectChanges();
    }));

    it("should open edit modal with current group data", () => {
      const editBtn = fixture.nativeElement.querySelector(
        '[data-testid="edit-btn"]',
      );
      editBtn.click();
      fixture.detectChanges();

      expect(component.showEditModal).toBeTrue();
      expect(component.editForm.name).toBe("Test Group");
      expect(component.editForm.description).toBe(
        "A test group description",
      );
      expect(component.editForm.budgetLimit).toBe(50);

      const modal = fixture.nativeElement.querySelector(
        '[data-testid="edit-group-modal"]',
      );
      expect(modal).toBeTruthy();
    });

    it("should close edit modal", () => {
      component.editGroup();
      expect(component.showEditModal).toBeTrue();

      component.closeEditModal();
      expect(component.showEditModal).toBeFalse();
    });

    it("should save group changes", fakeAsync(() => {
      const updatedGroup = {
        ...mockGroup,
        name: "Updated Name",
        budgetLimit: 75,
      };
      mockGroupService.updateGroup.and.returnValue(of(updatedGroup));

      component.editGroup();
      component.editForm.name = "Updated Name";
      component.editForm.budgetLimit = 75;
      component.saveGroupChanges();
      tick();

      expect(mockGroupService.updateGroup).toHaveBeenCalledWith(
        "group-123",
        { name: "Updated Name", budgetLimit: 75 },
      );
      expect(component.group?.name).toBe("Updated Name");
      expect(component.group?.budgetLimit).toBe(75);
      expect(component.showEditModal).toBeFalse();
    }));

    it("should show validation error for short name", () => {
      component.editGroup();
      component.editForm.name = "AB";
      component.saveGroupChanges();

      expect(component.actionError).toBe(
        "Group name must be at least 3 characters",
      );
      expect(mockGroupService.updateGroup).not.toHaveBeenCalled();
    });

    it("should show validation error for invalid budget", () => {
      component.editGroup();
      component.editForm.budgetLimit = 0;
      component.saveGroupChanges();

      expect(component.actionError).toBe(
        "Budget limit must be greater than 0",
      );
      expect(mockGroupService.updateGroup).not.toHaveBeenCalled();
    });

    it("should show error on save failure", fakeAsync(() => {
      mockGroupService.updateGroup.and.returnValue(
        throwError(() => new Error("Update failed")),
      );

      component.editGroup();
      component.editForm.name = "New Name";
      component.saveGroupChanges();
      tick();

      expect(component.actionError).toBe("Update failed");
      expect(component.showEditModal).toBeTrue();
    }));
  });

  describe("Pending Member State", () => {
    const pendingGroup: Group = {
      id: "group-123",
      name: "Test Group",
      description: "A test group description",
      adminId: "admin-user",
      members: [], // empty — indicates pending membership
      budgetLimit: 50,
      raffleStatus: "pending",
      createdAt: new Date("2026-01-15"),
      updatedAt: new Date("2026-01-15"),
    };

    beforeEach(fakeAsync(() => {
      // Non-admin user gets empty members array => pending state
      mockAuthService.currentUser = { id: "member-1", email: "member@test.com", displayName: "Member User" };
      mockGroupService.getGroupById.and.returnValue(of(pendingGroup));

      fixture = TestBed.createComponent(GroupDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      paramsSubject.next({ id: "group-123" });
      tick();
      fixture.detectChanges();
    }));

    it("should show pending state when user is not in members list", () => {
      expect(component.isPendingMember).toBeTrue();

      const pendingInvite = fixture.nativeElement.querySelector(
        '[data-testid="pending-invite"]',
      );
      expect(pendingInvite).toBeTruthy();
      expect(pendingInvite.textContent).toContain("Invitation Pending");
      expect(pendingInvite.textContent).toContain("Test Group");
    });

    it("should not show group content when user is pending", () => {
      const groupContent = fixture.nativeElement.querySelector(".group-content-inner");
      expect(groupContent).toBeFalsy();
    });

    it("should show accept and reject buttons in pending state", () => {
      const acceptBtn = fixture.nativeElement.querySelector('[data-testid="detail-accept-btn"]');
      const rejectBtn = fixture.nativeElement.querySelector('[data-testid="detail-reject-btn"]');
      expect(acceptBtn).toBeTruthy();
      expect(rejectBtn).toBeTruthy();
    });

    it("should navigate to groups on reject invitation", fakeAsync(() => {
      mockGroupService.rejectInvitation.and.returnValue(
        of({ success: true, message: "Rejected" }),
      );

      component.rejectGroupInvitation();
      tick();

      expect(mockGroupService.rejectInvitation).toHaveBeenCalledWith("group-123");
      expect(mockRouter.navigate).toHaveBeenCalledWith(["/groups"]);
    }));

    it("should show error on reject failure", fakeAsync(() => {
      mockGroupService.rejectInvitation.and.returnValue(
        throwError(() => new Error("Reject failed")),
      );

      component.rejectGroupInvitation();
      tick();

      expect(component.actionError).toBe("Reject failed");
      expect(component.isProcessing).toBeFalse();
    }));

    it("should reload group and clear pending state on accept invitation", fakeAsync(() => {
      const acceptedGroup: Group = { ...pendingGroup, members: ["member-1"] };
      mockGroupService.acceptInvitation.and.returnValue(of(acceptedGroup));
      // After reload, the group now has members so isPendingMember will be false
      mockGroupService.getGroupById.and.returnValue(of(acceptedGroup));

      component.acceptGroupInvitation();
      tick();
      fixture.detectChanges();

      expect(mockGroupService.acceptInvitation).toHaveBeenCalledWith("group-123");
      expect(component.isPendingMember).toBeFalse();
    }));

    it("should show error on accept failure", fakeAsync(() => {
      mockGroupService.acceptInvitation.and.returnValue(
        throwError(() => new Error("Accept failed")),
      );

      component.acceptGroupInvitation();
      tick();

      expect(component.actionError).toBe("Accept failed");
      expect(component.isProcessing).toBeFalse();
    }));
  });

  describe("Leave Group", () => {
    beforeEach(fakeAsync(() => {
      mockAuthService.currentUser = { id: "member-1", email: "member@test.com", displayName: "Member User" };

      fixture = TestBed.createComponent(GroupDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      paramsSubject.next({ id: "group-123" });
      tick();
      fixture.detectChanges();
    }));

    it("canLeave should be true for non-admin member with pending raffle", () => {
      expect(component.canLeave).toBeTrue();
    });

    it("canLeave should be false for admin", fakeAsync(() => {
      mockAuthService.currentUser = { id: "admin-user", email: "admin@test.com", displayName: "Admin User" };
      fixture = TestBed.createComponent(GroupDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      paramsSubject.next({ id: "group-123" });
      tick();

      expect(component.canLeave).toBeFalse();
    }));

    it("canLeave should be false when raffle is completed", fakeAsync(() => {
      const completedGroup: Group = { ...mockGroup, raffleStatus: "completed" };
      mockGroupService.getGroupById.and.returnValue(of(completedGroup));
      fixture = TestBed.createComponent(GroupDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      paramsSubject.next({ id: "group-123" });
      tick();

      expect(component.canLeave).toBeFalse();
    }));

    it("should open leave confirm modal on confirmLeave()", () => {
      component.confirmLeave();
      fixture.detectChanges();

      expect(component.showLeaveConfirm).toBeTrue();
      const modal = fixture.nativeElement.querySelector('[data-testid="leave-modal"]');
      expect(modal).toBeTruthy();
    });

    it("should navigate to /groups on successful leaveGroup()", fakeAsync(() => {
      mockGroupService.leaveGroup.and.returnValue(of(mockGroup));

      component.confirmLeave();
      component.leaveGroup();
      tick();

      expect(mockGroupService.leaveGroup).toHaveBeenCalledWith("group-123");
      expect(mockRouter.navigate).toHaveBeenCalledWith(["/groups"]);
    }));

    it("should show error on leaveGroup() failure", fakeAsync(() => {
      mockGroupService.leaveGroup.and.returnValue(
        throwError(() => new Error("Cannot leave after raffle")),
      );

      component.confirmLeave();
      component.leaveGroup();
      tick();

      expect(component.actionError).toBe("Cannot leave after raffle");
      expect(component.isProcessing).toBeFalse();
      expect(component.showLeaveConfirm).toBeFalse();
    }));
  });

  describe("Group Content State (accepted member)", () => {
    beforeEach(fakeAsync(() => {
      fixture.detectChanges();
      paramsSubject.next({ id: "group-123" });
      tick();
      fixture.detectChanges();
    }));

    it("should show group content when user is a member", () => {
      expect(component.isPendingMember).toBeFalse();

      const pendingInvite = fixture.nativeElement.querySelector('[data-testid="pending-invite"]');
      expect(pendingInvite).toBeFalsy();

      const groupContent = fixture.nativeElement.querySelector(".group-content-inner");
      expect(groupContent).toBeTruthy();
    });
  });
});
