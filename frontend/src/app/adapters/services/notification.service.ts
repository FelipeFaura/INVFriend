/**
 * Notification Service
 * Manages application-wide notifications/toasts
 */
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import {
  Notification,
  NotificationType,
  NotificationConfig,
  DEFAULT_DURATIONS,
} from "../../domain/models/notification.model";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  private notifications$ = new BehaviorSubject<Notification[]>([]);
  private idCounter = 0;

  /**
   * Get observable of current notifications
   */
  getNotifications(): Observable<Notification[]> {
    return this.notifications$.asObservable();
  }

  /**
   * Show a success notification
   */
  success(message: string, title?: string, duration?: number): string {
    return this.show({ type: "success", message, title, duration });
  }

  /**
   * Show an error notification
   */
  error(message: string, title?: string, duration?: number): string {
    return this.show({ type: "error", message, title, duration });
  }

  /**
   * Show an info notification
   */
  info(message: string, title?: string, duration?: number): string {
    return this.show({ type: "info", message, title, duration });
  }

  /**
   * Show a warning notification
   */
  warning(message: string, title?: string, duration?: number): string {
    return this.show({ type: "warning", message, title, duration });
  }

  /**
   * Show a notification with configuration
   */
  show(config: NotificationConfig): string {
    const id = this.generateId();
    const duration = config.duration ?? DEFAULT_DURATIONS[config.type];

    const notification: Notification = {
      id,
      type: config.type,
      message: config.message,
      title: config.title,
      duration,
    };

    // Add notification
    const currentNotifications = this.notifications$.value;
    this.notifications$.next([...currentNotifications, notification]);

    // Auto-dismiss if duration > 0
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }

    return id;
  }

  /**
   * Dismiss a specific notification
   */
  dismiss(id: string): void {
    const currentNotifications = this.notifications$.value;
    this.notifications$.next(currentNotifications.filter((n) => n.id !== id));
  }

  /**
   * Dismiss all notifications
   */
  dismissAll(): void {
    this.notifications$.next([]);
  }

  /**
   * Generate unique notification ID
   */
  private generateId(): string {
    this.idCounter++;
    return `notification-${Date.now()}-${this.idCounter}`;
  }
}
