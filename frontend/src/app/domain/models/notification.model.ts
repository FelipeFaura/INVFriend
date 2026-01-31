/**
 * Notification Model
 * Represents a notification message
 */

export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number; // milliseconds, 0 = sticky
}

export interface NotificationConfig {
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number;
}

/**
 * Default durations for notification types (in ms)
 */
export const DEFAULT_DURATIONS: Record<NotificationType, number> = {
  success: 4000,
  error: 6000,
  info: 4000,
  warning: 5000,
};
