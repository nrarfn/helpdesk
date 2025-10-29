import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage.tsx";
import UserDashboardPage from "../pages/UserDashboardPage.tsx";
import CreateTicketPage from "../pages/CreateTicketPage.tsx";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage.tsx";
import ApplicationsPage from "../pages/admin/ApplicationsPage.tsx";
import StatusesPage from "../pages/admin/StatusesPage.tsx";
import TicketDetailsPage from "../pages/admin/TicketDetailsPage.tsx";
import NotFoundPage from "../pages/404Page.tsx";
import AuthProtectedRoute from "./AuthProtectedRoute.tsx";
import AdminProtectedRoute from "./AdminProtectedRoute.tsx";
import AdminLayout from "../components/layout/AdminLayout.tsx";
import Providers from "../Providers.tsx";
import { AuthPage } from "@/pages/AuthPage.tsx";

const router = createBrowserRouter([
  // I recommend you reflect the routes here in the pages folder
  {
    path: "/",
    element: <Providers />,
    children: [
      // Public routes
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/auth",
        element: <AuthPage />,
      },
      // Auth Protected routes
      {
        path: "/",
        element: <AuthProtectedRoute />,
        children: [
          {
            path: "/dashboard",
            element: <UserDashboardPage />,
          },
          {
            path: "/create-ticket",
            element: <CreateTicketPage />,
          },
          {
            path: "/admin",
            element: <AdminProtectedRoute />,
            children: [
              {
                path: "",
                element: <AdminLayout />,
                children: [
                  {
                    path: "",
                    element: <AdminDashboardPage />,
                  },
                  {
                    path: "applications",
                    element: <ApplicationsPage />,
                  },
                  {
                    path: "statuses",
                    element: <StatusesPage />,
                  },
                  {
                    path: "tickets/:id",
                    element: <TicketDetailsPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
