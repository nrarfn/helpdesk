"use client";

import * as React from "react";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/supabase";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const navigate = useNavigate();

  const handleItemClick = async (item: { title: string; url: string; icon: LucideIcon }) => {
    if (item.url === "#logout") {
      try {
        await supabase.auth.signOut();
        toast.success("Logout berhasil");
        navigate("/auth");
      } catch (error) {
        toast.error("Gagal logout");
        console.error("Logout error:", error);
      }
    } else if (item.url === "#") {
      // Handle other actions if needed
      toast.info(`${item.title} belum tersedia`);
    } else {
      navigate(item.url);
    }
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                onClick={() => handleItemClick(item)}
                className="cursor-pointer"
              >
                <item.icon />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
