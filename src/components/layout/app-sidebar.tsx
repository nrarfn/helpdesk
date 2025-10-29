import {
  TicketIcon,
  LayoutDashboardIcon,
  PlusCircleIcon,
  SettingsIcon,
  ShieldCheckIcon,
  FolderIcon,
  TagIcon,
  UsersIcon,
  UserCheckIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

import { NavGroup } from "@/components/layout/nav-group";
import { NavSecondary } from "@/components/layout/nav-secondary";
import { NavUser } from "@/components/layout/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession } from "@/context/SessionContext";

export function AppSidebar() {
  const { user } = useSession();

  // Menu utama untuk semua user
  const menuUtama = [
    {
      title: "Dashboard",
      url: user?.role === "admin" ? "/admin/dashboard" : "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Tiket",
      url: user?.role === "admin" ? "/admin/tickets" : "/dashboard",
      icon: TicketIcon,
    },
  ];

  // Menu khusus user biasa
  const userMenuUtama = [
    ...menuUtama,
    {
      title: "Buat Tiket",
      url: "/tickets/create", 
      icon: PlusCircleIcon,
    },
  ];

  // Menu administrasi khusus admin
  const menuAdministrasi = [
    {
      title: "Aplikasi",
      url: "/admin/applications",
      icon: FolderIcon,
    },
    {
      title: "Status",
      url: "/admin/statuses",
      icon: TagIcon,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: UsersIcon,
    },
    {
      title: "Roles",
      url: "/admin/roles",
      icon: UserCheckIcon,
    },
  ];

  const navSecondary = [
    {
      title: "Pengaturan",
      url: "/settings",
      icon: SettingsIcon,
    },
  ];

  const userData = {
    name: user?.email?.split('@')[0] || "User",
    email: user?.email || "user@example.com",
    avatar: "/avatars/user.jpg",
    role: user?.role || "user",
  };

  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <ShieldCheckIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Helpdesk DLH</span>
                  <span className="truncate text-xs">
                    Dinas Lingkungan Hidup DKI Jakarta
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup 
          title="Menu Utama" 
          items={user?.role === "admin" ? menuUtama : userMenuUtama} 
        />
        {user?.role === "admin" && (
          <NavGroup 
            title="Administrasi" 
            items={menuAdministrasi} 
          />
        )}
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
