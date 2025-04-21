import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  // Brain,
  Users,
  // BarChart,
  // FileInput,
  // RefreshCw,
  Search,
  Settings,
  LogOut,
  LayoutDashboard,
  FileText,
  Video,
  Brush,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarInput,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/types/user";

interface DashboardSidebarProps {
  role?: UserRole;
}

const DashboardSidebar = ({ role = "admin" }: DashboardSidebarProps) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Define navigation items based on role
  const getNavItems = (role: UserRole) => {
    // Admin nav items
    if (role === "admin") {
      return [
        {
          title: "Overview",
          href: "/",
          icon: LayoutDashboard,
        },
        {
          title: "Clients",
          href: "/client-dashboard",
          icon: Users,
        },
        // {
        //   title: "Content System",
        //   href: "/content-system",
        //   icon: FileText,
        // },
        // {
        //   title: "Agent Management",
        //   href: "/agent-management",
        //   icon: Brain,
        // },
        // {
        //   title: "Reporting & Output",
        //   href: "/reporting",
        //   icon: BarChart,
        // },
        // {
        //   title: "Onboarding & Prompts",
        //   href: "/onboarding",
        //   icon: FileInput,
        // },
        // {
        //   title: "Feedback & Optimization",
        //   href: "/feedback",
        //   icon: RefreshCw,
        // },
      ];
    }

    // Videographer nav items
    if (role === "videographer") {
      return [
        {
          title: "Dashboard",
          href: "/videographer",
          icon: LayoutDashboard,
        },
        {
          title: "Upload Videos",
          href: "/videographer/upload",
          icon: Video,
        },
        {
          title: "Content Library",
          href: "/videographer/content",
          icon: FileText,
        },
      ];
    }

    // Designer nav items
    if (role === "designer") {
      return [
        {
          title: "Dashboard",
          href: "/designer",
          icon: LayoutDashboard,
        },
        {
          title: "Upload Designs",
          href: "/designer/upload",
          icon: Brush,
        },
        {
          title: "Content Library",
          href: "/designer/content",
          icon: FileText,
        },
      ];
    }

    // Default to admin if role not recognized
    return [];
  };

  const mainNavItems = getNavItems(role);

  const secondaryNavItems = [
    {
      title: "Settings",
      href: role === "admin" ? "/settings" : `/${role}/settings`,
      icon: Settings,
    },
    {
      title: "Logout",
      href: "/logout",
      icon: LogOut,
      onClick: () => logout?.(),
    },
  ];

  const roleTitle = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <Sidebar className="backdrop-blur-sm border-slate-800">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-transparent">
            <Image
              width={150}
              height={150}
              alt="ITCA Logo"
              className="mr-2"
              src="/images/Icon.png"
            />
          </div>
          <span className="text-xl font-bold">Agentic Flow</span>
        </div>
        <div className="px-2 py-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <SidebarInput
              type="search"
              placeholder="Search..."
              className="w-full pl-8"
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>{roleTitle} Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col mt-2 gap-4">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href} className="group">
                      <div
                        className={`flex h-7 w-7 rounded-sm items-center justify-center transition-colors ${
                          pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : "bg-transparent group-hover:bg-white/5"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                      </div>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={item.onClick}
                    asChild={!item.onClick}
                    isActive={pathname === item.href}
                  >
                    {item.onClick ? (
                      <div className="group flex h-8 w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden">
                        <div className="flex h-5 w-5 items-center justify-center rounded transition-colors bg-transparent group-hover:bg-primary/10">
                          <item.icon className="h-3.5 w-3.5" />
                        </div>
                        <span>{item.title}</span>
                      </div>
                    ) : (
                      <Link href={item.href} className="group">
                        <div
                          className={`flex h-7 w-7 items-center justify-center rounded transition-colors ${
                            pathname === item.href
                              ? "bg-primary text-primary-foreground"
                              : "bg-transparent group-hover:bg-primary/10"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                        </div>
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center gap-3 p-4">
          <div className="h-9 w-9 overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user?.name?.charAt(0) || roleTitle.charAt(0)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user?.name || "User"}</span>
            <span className="text-xs text-muted-foreground">{roleTitle}</span>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
