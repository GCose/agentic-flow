import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Settings,
  LogOut,
  LayoutDashboard,
  FileText,
  Video,
  Brush,
  Users,
  BarChart,
  MessageSquare,
  DollarSign,
  Briefcase,
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

  const isMenuItemActive = (href: string) => {
    // Client role navigation highlighting
    if (role === "client") {
      if (href === "/client") return pathname === "/client";
      if (href === "/client/content-system")
        return pathname?.startsWith("/client/content-system");
      return pathname === href;
    }

    // Admin client dashboard highlighting (handles content system with clientId)
    if (href === "/admin/clients")
      return (
        pathname?.startsWith(href) ||
        (pathname?.includes("/admin/content-system") &&
          typeof window !== "undefined" &&
          window.location.search.includes("clientId="))
      );

    // Standard path-based highlighting
    return (
      (href !== "/admin" && pathname?.startsWith(href)) || pathname === href
    );
  };

  const getNavItems = (role: UserRole) => {
    if (role === "client") {
      return {
        mainItems: [
          {
            title: "Dashboard",
            href: "/client",
            icon: LayoutDashboard,
          },
          {
            title: "Content System",
            href: "/client/content-system",
            icon: FileText,
          },
          {
            title: "Leadgen System",
            href: "/client/leadgen-system",
            icon: Users,
          },
          {
            title: "Sales System",
            href: "/client/sales-system",
            icon: DollarSign,
          },
          {
            title: "Onboarding System",
            href: "/client/onboarding",
            icon: Briefcase,
          },
          {
            title: "Reports",
            href: "/client/reporting",
            icon: BarChart,
          },
          {
            title: "Feedback & Optimization",
            href: "/client/feedback",
            icon: MessageSquare,
          },
        ],
        contentCreationItems: [], // No content creation items for clients
      };
    }

    // Admin nav items
    if (role === "admin") {
      const adminMainItems = [
        {
          title: "Overview",
          href: "/admin",
          icon: LayoutDashboard,
        },
        {
          title: "Agent Management",
          href: "/admin/agent-management",
          icon: Users,
        },
        {
          title: "Clients",
          href: "/admin/clients",
          icon: Users,
        },
      ];

      // Content creation items in a separate group
      const contentCreationItems = [
        {
          title: "Videographer",
          href: "/admin/videographer",
          icon: Video,
        },
        {
          title: "Graphics Designer",
          href: "/admin/designer",
          icon: Brush,
        },
      ];

      return { mainItems: adminMainItems, contentCreationItems };
    }

    // Videographer nav items
    if (role === "videographer") {
      return {
        mainItems: [
          {
            title: "Dashboard",
            href: "/admin/role/videographer",
            icon: LayoutDashboard,
          },
          {
            title: "Upload Videos",
            href: "/admin/role/videographer/upload",
            icon: Video,
          },
          {
            title: "Content Library",
            href: "/admin/role/videographer/content",
            icon: FileText,
          },
        ],
        contentCreationItems: [],
      };
    }

    // Designer nav items
    if (role === "designer") {
      return {
        mainItems: [
          {
            title: "Dashboard",
            href: "/admin/role/designer",
            icon: LayoutDashboard,
          },
          {
            title: " Designs",
            href: "/admin/role/designer/upload",
            icon: Brush,
          },
          {
            title: "Content Library",
            href: "/admin/role/designer/content",
            icon: FileText,
          },
        ],
        contentCreationItems: [],
      };
    }

    // Default to admin if role not recognized
    return { mainItems: [], contentCreationItems: [] };
  };

  const { mainItems, contentCreationItems } = getNavItems(role);

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
    <Sidebar className=" border-slate-800">
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
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-4">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isMenuItemActive(item.href)}
                  >
                    <Link href={item.href} className="group">
                      <div className="flex h-6 w-6 items-center justify-center rounded transition-colors bg-transparent">
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

        {role === "admin" && contentCreationItems.length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Content Creation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {contentCreationItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={isMenuItemActive(item.href)}
                      >
                        <Link href={item.href} className="group">
                          <div className="flex h-6 w-6 items-center justify-center rounded transition-colors bg-transparent">
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
          </>
        )}

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={item.onClick}
                    asChild={!item.onClick}
                    isActive={isMenuItemActive(item.href)}
                  >
                    {item.onClick ? (
                      <div className="group flex h-8 w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md text-left text-sm outline-hidden">
                        <div className="flex h-6 w-6 items-center justify-center rounded transition-colors bg-transparent group-hover:bg-primary/10">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <span>{item.title}</span>
                      </div>
                    ) : (
                      <Link href={item.href} className="group">
                        <div className="flex h-6 w-6 items-center justify-center rounded transition-colors bg-transparent">
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
