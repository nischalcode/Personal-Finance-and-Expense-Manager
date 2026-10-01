import { Loader2 } from "lucide-react";

/** Shown while a page is fetching data. See section 25 of the spec. */
export default function LoadingState({
  label = "Loading...",
}: {
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500 dark:text-gray-400">
      <Loader2 className="h-6 w-6 animate-spin text-brand-500" aria-hidden />
      <p className="text-sm">{label}</p>
    </div>
  );
}
