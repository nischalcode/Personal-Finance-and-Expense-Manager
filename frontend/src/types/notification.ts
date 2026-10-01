export type NotificationType =
  | "budget-warning"
  | "budget-exceeded"
  | "goal-progress"
  | "summary"
  | "general";

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
}
