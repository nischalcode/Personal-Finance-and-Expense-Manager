import { useState } from "react";
import { CheckCheck, Bell } from "lucide-react";
import { useAsync } from "@/hooks/useAsync";
import * as notificationService from "@/services/notificationService";
import { useToast } from "@/components/common/Toast";

import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import EmptyState from "@/components/common/EmptyState";
import NotificationItem from "@/components/notifications/NotificationItem";

export default function NotificationsPage() {
  const {
    data: notifications,
    isLoading,
    error,
    reload,
  } = useAsync(() => notificationService.getNotifications(), []);
  const { showToast } = useToast();
  const [isBulkActionRunning, setIsBulkActionRunning] = useState(false);

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  async function handleMarkRead(id: string) {
    await notificationService.markNotificationRead(id);
    reload();
  }

  async function handleDelete(id: string) {
    await notificationService.deleteNotification(id);
    showToast("Notification deleted.");
    reload();
  }

  async function handleMarkAllRead() {
    setIsBulkActionRunning(true);
    try {
      await notificationService.markAllNotificationsRead();
      reload();
    } finally {
      setIsBulkActionRunning(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Notifications
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}.`
              : "You're all caught up."}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            icon={<CheckCheck className="h-4 w-4" />}
            onClick={handleMarkAllRead}
            isLoading={isBulkActionRunning}
          >
            Mark all as read
          </Button>
        )}
      </div>

      <Card>
        {isLoading ? (
          <LoadingState label="Loading notifications..." />
        ) : error || !notifications ? (
          <ErrorState
            message={error ?? "Could not load notifications."}
            onRetry={reload}
          />
        ) : notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="h-10 w-10" />}
            title="No notifications"
            description="You'll see budget alerts and goal updates here."
          />
        ) : (
          <div>
            {notifications.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
