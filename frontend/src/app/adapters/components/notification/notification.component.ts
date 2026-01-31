/**
 * Notification Component
 * Displays toast notifications
 */
import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  trigger,
  transition,
  style,
  animate,
} from "@angular/animations";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { NotificationService } from "../../services/notification.service";
import { Notification } from "../../../domain/models/notification.model";

@Component({
  selector: "app-notification",
  templateUrl: "./notification.component.html",
  styleUrls: ["./notification.component.scss"],
  animations: [
    trigger("slideIn", [
      transition(":enter", [
        style({ transform: "translateX(100%)", opacity: 0 }),
        animate(
          "300ms ease-out",
          style({ transform: "translateX(0)", opacity: 1 }),
        ),
      ]),
      transition(":leave", [
        animate(
          "200ms ease-in",
          style({ transform: "translateX(100%)", opacity: 0 }),
        ),
      ]),
    ]),
  ],
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService
      .getNotifications()
      .pipe(takeUntil(this.destroy$))
      .subscribe((notifications) => {
        this.notifications = notifications;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Dismiss a notification
   */
  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }

  /**
   * Get icon for notification type
   */
  getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: "✅",
      error: "❌",
      info: "ℹ️",
      warning: "⚠️",
    };
    return icons[type] || "ℹ️";
  }

  /**
   * Track notifications by ID for ngFor
   */
  trackById(index: number, notification: Notification): string {
    return notification.id;
  }
}
