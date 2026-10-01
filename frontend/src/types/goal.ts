export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO date string
  description?: string;
  createdAt: string;
}

export interface GoalInput {
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  description?: string;
}

// Computed at render time, not stored.
export interface GoalWithProgress extends Goal {
  percentComplete: number;
  remaining: number;
}
