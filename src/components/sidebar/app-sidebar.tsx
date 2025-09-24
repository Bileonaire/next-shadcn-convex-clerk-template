"use client";

import * as React from "react";
import {
  FolderOpen,
  Settings2,
  Home,
  BarChart3,
  Globe,
  User,
  Upload,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavProjects } from "@/components/sidebar/nav-projects";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "User",
    email: "user@example.com",
    avatar: "/images/default-avatar.avif",
  },
  teams: [
    {
      name: "My Organization",
      logo: Globe,
      plan: "Premium",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
    {
      title: "File Upload",
      url: "/dashboard/file-upload",
      icon: Upload,
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: FolderOpen,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings2,
    },
  ],
  projects: [
    {
      name: "Project Alpha",
      url: "/dashboard/projects/alpha",
      icon: FolderOpen,
    },
    {
      name: "Project Beta",
      url: "/dashboard/projects/beta",
      icon: FolderOpen,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();

  // Transform Clerk user data to match NavUser expected format
  const userData = user
    ? {
        name:
          user.fullName ||
          user.firstName ||
          user.emailAddresses[0]?.emailAddress ||
          "User",
        email: user.emailAddresses[0]?.emailAddress || "",
        avatar: user.imageUrl || "",
      }
    : null;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>{userData && <NavUser user={userData} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
