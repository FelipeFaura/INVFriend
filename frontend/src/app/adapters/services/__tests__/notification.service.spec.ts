/**
 * Notification Service Tests
 */
import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { NotificationService } from "../notification.service";
import { Notification } from "../../../domain/models/notification.model";

describe("NotificationService", () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService],
    });
    service = TestBed.inject(NotificationService);
  });

  describe("show notifications", () => {
    it("should show success notification", () => {
      let notifications: Notification[] = [];
      service.getNotifications().subscribe((n) => (notifications = n));

      service.success("Success message", "Title");

      expect(notifications.length).toBe(1);
      expect(notifications[0].type).toBe("success");
      expect(notifications[0].message).toBe("Success message");
      expect(notifications[0].title).toBe("Title");
    });

    it("should show error notification", () => {
      let notifications: Notification[] = [];
      service.getNotifications().subscribe((n) => (notifications = n));

      service.error("Error message");

      expect(notifications.length).toBe(1);
      expect(notifications[0].type).toBe("error");
      expect(notifications[0].message).toBe("Error message");
    });

    it("should show info notification", () => {
      let notifications: Notification[] = [];
      service.getNotifications().subscribe((n) => (notifications = n));

      service.info("Info message");

      expect(notifications.length).toBe(1);
      expect(notifications[0].type).toBe("info");
    });

    it("should show warning notification", () => {
      let notifications: Notification[] = [];
      service.getNotifications().subscribe((n) => (notifications = n));

      service.warning("Warning message");

      expect(notifications.length).toBe(1);
      expect(notifications[0].type).toBe("warning");
    });

    it("should return notification ID", () => {
      const id = service.success("Test");

      expect(id).toBeTruthy();
      expect(id).toContain("notification-");
    });

    it("should add multiple notifications", () => {
      let notifications: Notification[] = [];
      service.getNotifications().subscribe((n) => (notifications = n));

      service.success("First");
      service.error("Second");
      service.info("Third");

      expect(notifications.length).toBe(3);
    });
  });

  describe("auto-dismiss", () => {
    it("should auto-dismiss success notification after default duration", fakeAsync(() => {
      let notifications: Notification[] = [];
      service.getNotifications().subscribe((n) => (notifications = n));

      service.success("Auto-dismiss test");
      expect(notifications.length).toBe(1);

      tick(4000); // Default success duration
      expect(notifications.length).toBe(0);
    }));

    it("should auto-dismiss error notification after default duration", fakeAsync(() => {
      let notifications: Notification[] = [];
      service.getNotifications().subscribe((n) => (notifications = n));

      service.error("Error test");
      expect(notifications.length).toBe(1);

      tick(6000); // Default error duration
      expect(notifications.length).toBe(0);
    }));

    it("should respect custom duration", fakeAsync(() => {
      let notifications: Notification[] = [];
      service.getNotifications().subscribe((n) => (notifications = n));

      service.success("Custom duration", undefined, 2000);
      expect(notifications.length).toBe(1);

      tick(2000);
      expect(notifications.length).toBe(0);
    }));

    it("should not auto-dismiss when duration is 0 (sticky)", fakeAsync(() => {
      let notifications: Notification[] = [];
      service.getNotifications().subscribe((n) => (notifications = n));

      service.success("Sticky notification", undefined, 0);
      expect(notifications.length).toBe(1);

      tick(10000); // Long wait
      expect(notifications.length).toBe(1); // Still there
    }));
  });

  describe("dismiss", () => {
    it("should dismiss specific notification", () => {
      let notifications: Notification[] = [];
      service.getNotifications().subscribe((n) => (notifications = n));

      const id1 = service.success("First");
      const id2 = service.success("Second");

      expect(notifications.length).toBe(2);

      service.dismiss(id1);

      expect(notifications.length).toBe(1);
      expect(notifications[0].id).toBe(id2);
    });

    it("should dismiss all notifications", () => {
      let notifications: Notification[] = [];
      service.getNotifications().subscribe((n) => (notifications = n));

      service.success("First");
      service.error("Second");
      service.info("Third");

      expect(notifications.length).toBe(3);

      service.dismissAll();

      expect(notifications.length).toBe(0);
    });

    it("should handle dismissing non-existent notification", () => {
      let notifications: Notification[] = [];
      service.getNotifications().subscribe((n) => (notifications = n));

      service.success("Test");
      expect(notifications.length).toBe(1);

      service.dismiss("non-existent-id");
      expect(notifications.length).toBe(1); // No change
    });
  });

  describe("show with config", () => {
    it("should show notification with full config", () => {
      let notifications: Notification[] = [];
      service.getNotifications().subscribe((n) => (notifications = n));

      const id = service.show({
        type: "warning",
        message: "Full config test",
        title: "Warning Title",
        duration: 3000,
      });

      expect(notifications.length).toBe(1);
      expect(notifications[0].id).toBe(id);
      expect(notifications[0].type).toBe("warning");
      expect(notifications[0].message).toBe("Full config test");
      expect(notifications[0].title).toBe("Warning Title");
      expect(notifications[0].duration).toBe(3000);
    });
  });

  describe("unique IDs", () => {
    it("should generate unique IDs for each notification", () => {
      const ids = new Set<string>();

      for (let i = 0; i < 100; i++) {
        const id = service.success("Test", undefined, 0); // Sticky to avoid cleanup
        expect(ids.has(id)).toBeFalse();
        ids.add(id);
      }

      expect(ids.size).toBe(100);
    });
  });
});
