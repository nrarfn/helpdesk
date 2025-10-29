import { createBrowserRouter } from "react-router-dom";
import UserDashboardPage from "../pages/UserDashboardPage.tsx";
import CreateTicketPage from "../pages/CreateTicketPage.tsx";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage.tsx";
import AdminTicketsPage from "../pages/admin/AdminTicketsPage.tsx";
import ApplicationsPage from "../pages/admin/ApplicationsPage.tsx";
import StatusesPage from "../pages/admin/StatusesPage.tsx";
import UsersPage from "../pages/admin/UsersPage.tsx";
import RolesPage from "../pages/admin/RolesPage.tsx";
import TicketDetailsPage from "../pages/admin/TicketDetailsPage.tsx";
import NotFoundPage from "../pages/404Page.tsx";
import AuthProtectedRoute from "./AuthProtectedRoute.tsx";
import AdminProtectedRoute from "./AdminProtectedRoute.tsx";
import AdminLayout from "../components/layout/AdminLayout.tsx";
import RootRedirect from "../components/RootRedirect.tsx";
import Providers from "../Providers.tsx";
import { AuthPage } from "@/pages/AuthPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Providers />,
    children: [
      // Root redirect berdasarkan status login
      {
        path: "/",
        element: <RootRedirect />,
      },
      // Public route untuk auth
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
            path: "/tickets/create",
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
                    path: "dashboard",
                    element: <AdminDashboardPage />,
                  },
                  {
                    path: "tickets",
                    element: <AdminTicketsPage />,
                  },
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
                    path: "users",
                    element: <UsersPage />,
                  },
                  {
                    path: "roles",
                    element: <RolesPage />,
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
