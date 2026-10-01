import AppRoutes from "./routes/AppRoutes";

/**
 * App is intentionally tiny. Its only job is to render the router.
 * All page-level logic lives in src/pages, all navigation logic in
 * src/routes/AppRoutes.tsx.
 */
export default function App() {
  return <AppRoutes />;
}
