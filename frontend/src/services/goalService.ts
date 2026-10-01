/**
 * goalService.ts
 *
 * Future backend endpoints:
 *   GET    /api/goals
 *   POST   /api/goals
 *   PUT    /api/goals/:id
 *   DELETE /api/goals/:id
 */
import type { Goal, GoalInput } from "@/types";
import { mockGoals } from "@/data/mockData";
import { apiRequest, USE_MOCK_DATA, mockDelay } from "./api";

let mockStore: Goal[] = [...mockGoals];

export async function getGoals(): Promise<Goal[]> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    return [...mockStore];
  }
  return apiRequest<Goal[]>("/goals");
}

export async function createGoal(input: GoalInput): Promise<Goal> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const newGoal: Goal = {
      ...input,
      id: `goal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    mockStore = [...mockStore, newGoal];
    return newGoal;
  }
  return apiRequest<Goal>("/goals", { method: "POST", body: input });
}

export async function updateGoal(id: string, input: GoalInput): Promise<Goal> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    const index = mockStore.findIndex((g) => g.id === id);
    if (index === -1) throw new Error("Goal not found.");
    const updated: Goal = { ...mockStore[index], ...input };
    mockStore[index] = updated;
    return updated;
  }
  return apiRequest<Goal>(`/goals/${id}`, { method: "PUT", body: input });
}

export async function deleteGoal(id: string): Promise<void> {
  if (USE_MOCK_DATA) {
    await mockDelay();
    mockStore = mockStore.filter((g) => g.id !== id);
    return;
  }
  await apiRequest<void>(`/goals/${id}`, { method: "DELETE" });
}
