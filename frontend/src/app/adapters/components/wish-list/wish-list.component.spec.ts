/**
 * Wish List Component Tests
 */
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { of, throwError } from "rxjs";

import { WishListComponent } from "./wish-list.component";
import { WishHttpService } from "../../services/wish-http.service";
import { Wish } from "../../../domain/models/wish.model";
import { Group } from "../../../domain/models/group.model";

describe("WishListComponent", () => {
  let component: WishListComponent;
  let fixture: ComponentFixture<WishListComponent>;
  let mockWishService: jasmine.SpyObj<WishHttpService>;

  const mockGroup: Group = {
    id: "group-123",
    name: "Test Group",
    description: "A test group",
    adminId: "admin-user",
    members: ["admin-user", "member-1"],
    budgetLimit: 50,
    raffleStatus: "pending",
    createdAt: new Date("2026-01-15"),
    updatedAt: new Date("2026-01-15"),
  };

  const mockCompletedGroup: Group = {
    ...mockGroup,
    raffleStatus: "completed",
  };

  const mockWishes: Wish[] = [
    {
      id: "wish-1",
      groupId: "group-123",
      userId: "admin-user",
      title: "PlayStation 5",
      description: "Gaming console",
      url: "https://example.com/ps5",
      estimatedPrice: 500,
      priority: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "wish-2",
      groupId: "group-123",
      userId: "admin-user",
      title: "Nintendo Switch",
      description: "Portable gaming",
      estimatedPrice: 300,
      priority: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockAssignedWishes: Wish[] = [
    {
      id: "wish-3",
      groupId: "group-123",
      userId: "member-1",
      title: "Headphones",
      description: "Wireless headphones",
      estimatedPrice: 150,
      priority: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    mockWishService = jasmine.createSpyObj("WishHttpService", [
      "getMyWishes",
      "getAssignedWishes",
      "createWish",
      "updateWish",
      "deleteWish",
    ]);

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [WishListComponent],
      providers: [{ provide: WishHttpService, useValue: mockWishService }],
    }).compileComponents();

    mockWishService.getMyWishes.and.returnValue(of(mockWishes));
    mockWishService.getAssignedWishes.and.returnValue(of(mockAssignedWishes));
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WishListComponent);
    component = fixture.componentInstance;
  });

  describe("Initialization", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should load my wishes when group is provided", fakeAsync(() => {
      component.group = mockGroup;
      fixture.detectChanges();
      tick();

      expect(mockWishService.getMyWishes).toHaveBeenCalledWith("group-123");
      expect(component.myWishes.length).toBe(2);
    }));

    it("should not load wishes without a group", () => {
      fixture.detectChanges();

      expect(mockWishService.getMyWishes).not.toHaveBeenCalled();
    });

    it("should load assigned wishes when raffle is completed", fakeAsync(() => {
      component.group = mockCompletedGroup;
      fixture.detectChanges();
      tick();

      expect(mockWishService.getAssignedWishes).toHaveBeenCalledWith(
        "group-123",
      );
      expect(component.assignedWishes.length).toBe(1);
    }));

    it("should not load assigned wishes when raffle is pending", fakeAsync(() => {
      component.group = mockGroup;
      fixture.detectChanges();
      tick();

      expect(mockWishService.getAssignedWishes).not.toHaveBeenCalled();
    }));
  });

  describe("Display", () => {
    beforeEach(fakeAsync(() => {
      component.group = mockGroup;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }));

    it("should display my wishes list", () => {
      const wishCards = fixture.nativeElement.querySelectorAll(".wish-card");
      expect(wishCards.length).toBe(2);
    });

    it("should display wish title", () => {
      const wishTitle = fixture.nativeElement.querySelector(".wish-title");
      expect(wishTitle.textContent).toContain("PlayStation 5");
    });

    it("should sort wishes by priority", () => {
      expect(component.myWishes[0].priority).toBe(1);
      expect(component.myWishes[1].priority).toBe(2);
    });

    it("should show empty state when no wishes", fakeAsync(() => {
      mockWishService.getMyWishes.and.returnValue(of([]));
      component.loadMyWishes();
      tick();
      fixture.detectChanges();

      const emptyState = fixture.nativeElement.querySelector(
        '[data-testid="empty-state"]',
      );
      expect(emptyState).toBeTruthy();
    }));

    it("should show error message on load failure", fakeAsync(() => {
      mockWishService.getMyWishes.and.returnValue(
        throwError(() => new Error("Failed to load")),
      );
      component.loadMyWishes();
      tick();
      fixture.detectChanges();

      expect(component.error).toBe("Failed to load");
    }));
  });

  describe("Assigned Wishes Section", () => {
    it("should not show assigned section when raffle is pending", fakeAsync(() => {
      component.group = mockGroup;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const assignedSection =
        fixture.nativeElement.querySelector(".assigned-wishes");
      expect(assignedSection).toBeFalsy();
    }));

    it("should show assigned section when raffle is completed", fakeAsync(() => {
      component.group = mockCompletedGroup;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const assignedSection =
        fixture.nativeElement.querySelector(".assigned-wishes");
      expect(assignedSection).toBeTruthy();
    }));
  });

  describe("Add Wish Modal", () => {
    beforeEach(fakeAsync(() => {
      component.group = mockGroup;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }));

    it("should open add wish modal", () => {
      component.openAddWishModal();
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector(
        '[data-testid="add-wish-modal"]',
      );
      expect(modal).toBeTruthy();
    });

    it("should close add wish modal", () => {
      component.openAddWishModal();
      fixture.detectChanges();

      component.closeAddWishModal();
      fixture.detectChanges();

      const modal = fixture.nativeElement.querySelector(
        '[data-testid="add-wish-modal"]',
      );
      expect(modal).toBeFalsy();
    });

    it("should create wish successfully", fakeAsync(() => {
      mockWishService.createWish.and.returnValue(of(mockWishes[0]));
      spyOn(component.wishesChanged, "emit");

      component.openAddWishModal();
      component.wishForm.title = "New Wish";
      component.createWish();
      tick();

      expect(mockWishService.createWish).toHaveBeenCalledWith("group-123", {
        title: "New Wish",
        description: undefined,
        url: undefined,
        estimatedPrice: undefined,
        priority: undefined,
      });
      expect(component.showAddWishModal).toBeFalse();
      expect(component.wishesChanged.emit).toHaveBeenCalled();
    }));

    it("should show validation error when title is empty", () => {
      component.openAddWishModal();
      component.wishForm.title = "";
      component.createWish();

      expect(component.actionError).toBe("Title is required");
    });

    it("should handle create error", fakeAsync(() => {
      mockWishService.createWish.and.returnValue(
        throwError(() => new Error("Failed to create")),
      );

      component.openAddWishModal();
      component.wishForm.title = "New Wish";
      component.createWish();
      tick();

      expect(component.actionError).toBe("Failed to create");
      expect(component.showAddWishModal).toBeTrue();
    }));
  });

  describe("Edit Wish Modal", () => {
    beforeEach(fakeAsync(() => {
      component.group = mockGroup;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }));

    it("should open edit wish modal with wish data", () => {
      component.openEditWishModal(mockWishes[0]);
      fixture.detectChanges();

      expect(component.showEditWishModal).toBeTrue();
      expect(component.wishForm.title).toBe("PlayStation 5");
      expect(component.editingWish).toEqual(mockWishes[0]);
    });

    it("should update wish successfully", fakeAsync(() => {
      mockWishService.updateWish.and.returnValue(of(mockWishes[0]));
      spyOn(component.wishesChanged, "emit");

      component.openEditWishModal(mockWishes[0]);
      component.wishForm.title = "Updated Title";
      component.updateWish();
      tick();

      expect(mockWishService.updateWish).toHaveBeenCalled();
      expect(component.showEditWishModal).toBeFalse();
      expect(component.wishesChanged.emit).toHaveBeenCalled();
    }));

    it("should handle update error", fakeAsync(() => {
      mockWishService.updateWish.and.returnValue(
        throwError(() => new Error("Failed to update")),
      );

      component.openEditWishModal(mockWishes[0]);
      component.wishForm.title = "Updated Title";
      component.updateWish();
      tick();

      expect(component.actionError).toBe("Failed to update");
    }));
  });

  describe("Delete Wish", () => {
    beforeEach(fakeAsync(() => {
      component.group = mockGroup;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }));

    it("should open delete confirmation", () => {
      component.confirmDeleteWish(mockWishes[0]);
      fixture.detectChanges();

      expect(component.showDeleteConfirm).toBeTrue();
      expect(component.deletingWish).toEqual(mockWishes[0]);
    });

    it("should cancel delete", () => {
      component.confirmDeleteWish(mockWishes[0]);
      component.cancelDelete();
      fixture.detectChanges();

      expect(component.showDeleteConfirm).toBeFalse();
      expect(component.deletingWish).toBeNull();
    });

    it("should delete wish successfully", fakeAsync(() => {
      mockWishService.deleteWish.and.returnValue(
        of({ success: true, message: "Deleted" }),
      );
      spyOn(component.wishesChanged, "emit");

      component.confirmDeleteWish(mockWishes[0]);
      component.deleteWish();
      tick();

      expect(mockWishService.deleteWish).toHaveBeenCalledWith(
        "group-123",
        "wish-1",
      );
      expect(component.showDeleteConfirm).toBeFalse();
      expect(component.wishesChanged.emit).toHaveBeenCalled();
    }));

    it("should handle delete error", fakeAsync(() => {
      mockWishService.deleteWish.and.returnValue(
        throwError(() => new Error("Failed to delete")),
      );

      component.confirmDeleteWish(mockWishes[0]);
      component.deleteWish();
      tick();

      expect(component.actionError).toBe("Failed to delete");
    }));
  });

  describe("Helper Methods", () => {
    it("should return correct priority label", () => {
      expect(component.getPriorityLabel(1)).toBe("★★★★★");
      expect(component.getPriorityLabel(3)).toBe("★★★☆☆");
      expect(component.getPriorityLabel(5)).toBe("★☆☆☆☆");
      expect(component.getPriorityLabel(undefined)).toBe("");
    });

    it("should format price correctly", () => {
      expect(component.formatPrice(100)).toBe("$100.00");
      expect(component.formatPrice(49.5)).toBe("$49.50");
      expect(component.formatPrice(undefined)).toBe("");
    });

    it("should validate URLs correctly", () => {
      expect(component.isValidUrl("https://example.com")).toBeTrue();
      expect(component.isValidUrl("http://example.com/path")).toBeTrue();
      expect(component.isValidUrl("not-a-url")).toBeFalse();
      expect(component.isValidUrl("")).toBeFalse();
      expect(component.isValidUrl(undefined)).toBeFalse();
    });
  });
});
