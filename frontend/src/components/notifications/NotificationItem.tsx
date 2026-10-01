import {
  Trash2,
  Circle,
  Bell,
  AlertTriangle,
  Target,
  FileText,
} from "lucide-react";
import type { AppNotification, NotificationType } from "@/types";
import { formatRelativeDate } from "@/utils/date";

interface NotificationItemProps {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const TYPE_ICON: Record<NotificationType, typeof Bell> = {
  "budget-warning": AlertTriangle,
  "budget-exceeded": AlertTriangle,
  "goal-progress": Target,
  summary: FileText,
  general: Bell,
};

const TYPE_COLOR: Record<NotificationType, string> = {
  "budget-warning": "text-amber-500 bg-amber-100 dark:bg-amber-950",
  "budget-exceeded": "text-red-500 bg-red-100 dark:bg-red-950",
  "goal-progress": "text-brand-500 bg-brand-100 dark:bg-brand-950",
  summary: "text-blue-500 bg-blue-100 dark:bg-blue-950",
  general: "text-gray-500 bg-gray-100 dark:bg-gray-800",
};

/** One row in the notification list (section 20 of the spec). */
export default function NotificationItem({
  notification,
  onMarkRead,
  onDelete,
}: NotificationItemProps) {
  const Icon = TYPE_ICON[notification.type];

  return (
    <div
      className={`flex items-start gap-3 border-b border-gray-100 px-1 py-3 last:border-0 dark:border-gray-800 ${
        !notification.isRead ? "bg-brand-50/40 dark:bg-brand-950/20" : ""
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${TYPE_COLOR[notification.type]}`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm ${!notification.isRead ? "font-medium text-gray-900 dark:text-gray-100" : "text-gray-600 dark:text-gray-400"}`}
        >
          {notification.message}
        </p>
        <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
          {formatRelativeDate(notification.createdAt)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {!notification.isRead && (
          <button
            onClick={() => onMarkRead(notification.id)}
            aria-label="Mark as read"
            className="rounded-md p-1.5 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950"
          >
            <Circle className="h-3.5 w-3.5 fill-current" />
          </button>
        )}
        <button
          onClick={() => onDelete(notification.id)}
          aria-label="Delete notification"
          className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
