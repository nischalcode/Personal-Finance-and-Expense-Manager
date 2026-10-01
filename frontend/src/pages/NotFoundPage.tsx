import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import Button from "@/components/common/Button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center dark:bg-gray-950">
      <FileQuestion className="h-12 w-12 text-gray-400" aria-hidden />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Page not found
      </h1>
      <p className="max-w-sm text-gray-500 dark:text-gray-400">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link to="/">
        <Button>Go home</Button>
      </Link>
    </div>
  );
}
