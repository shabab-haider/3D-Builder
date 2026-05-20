import { createBrowserRouter } from "react-router";
import Builder from "./src/features/builder/Builder";
import Dashboard from "./src/features/dashboard/Dashboard";

export const router = createBrowserRouter([
  { path: "/", element: <Dashboard /> },
  { path: "/builder", element: <Builder /> },
]);
