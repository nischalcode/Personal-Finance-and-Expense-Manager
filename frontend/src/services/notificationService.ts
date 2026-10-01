/**
 * notificationService.ts
 *
 * Future backend endpoints:
 *   GET    /api/notifications
 *   PUT    /api/notifications/:id/read
 *   DELETE /api/notifications/:id
 */
import type { AppNotification } from "@/types";
import { mockNotifications } from "@/data/mockData";
import { apiRequest, USE_MOCK_DATA, mockDelay } from "./api";

let mockStore: AppNotification[] = [...mockNotifications];

export async function getNotifications(): Promise<AppNotification[]> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return [...mockStore].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }
  return apiRequest<AppNotification[]>("/notifications");
}

export async function markNotificationRead(id: string): Promise<void> {
  if (USE_MOCK_DATA) {
    await mockDelay(150);
    mockStore = mockStore.map((n) =>
      n.id === id ? { ...n, isRead: true } : n,
    );
    return;
  }
  await apiRequest<void>(`/notifications/${id}/read`, { method: "PUT" });
}

export async function markAllNotificationsRead(): Promise<void> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    mockStore = mockStore.map((n) => ({ ...n, isRead: true }));
    return;
  }
  await Promise.all(mockStore.map((n) => markNotificationRead(n.id)));
}

export async function deleteNotification(id: string): Promise<void> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    mockStore = mockStore.filter((n) => n.id !== id);
    return;
  }
  await apiRequest<void>(`/notifications/${id}`, { method: "DELETE" });
}
