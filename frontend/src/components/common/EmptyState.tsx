import type { ReactNode } from "react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

/** Shown when a list/page has no data yet. See section 25 of the spec. */
export default function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <div className="mb-2 text-gray-300 dark:text-gray-600">
        {icon ?? <Inbox className="h-10 w-10" aria-hidden />}
      </div>
      <p className="font-medium text-gray-700 dark:text-gray-300">{title}</p>
      {description && (
        <p className="max-w-xs text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
