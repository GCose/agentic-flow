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
  // BarChart,
  // MessageSquare,
  DollarSign,
  Calendar,
  // Briefcase,
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
import { useAuth, useRole } from "@/hooks/use-auth-store";
import { UserRole } from "@/types/user";

interface DashboardSidebarProps {
  role?: UserRole; // Optional fallback role
}

const DashboardSidebar = ({ role: fallbackRole }: DashboardSidebarProps) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { role: storeRole } = useRole();

  // Use role from store, fallback to prop, then default to 'Organization'
  const activeRole = storeRole || fallbackRole || 'Organization';

  const isMenuItemActive = (href: string) => {
    if (href === "/admin" || href === "/client") {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const getNavItems = (role: UserRole) => {
    if (role === "Organization") {
      return {
        mainItems: [
          {
            title: "Dashboard",
            href: "/client",
            icon: LayoutDashboard,
          },
          {
            title: "Appointment Booking",
            href: "/client/appointment-booking",
            icon: Calendar,
          },
          {
            title: "Documents",
            href: "/documents",
            icon: FileText,
          },
          // {
          //   title: "Content System",
          //   href: "/client/content-system",
          //   icon: FileText,
          // },
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
          // {
          //   title: "Onboarding System",
          //   href: "/client/onboarding",
          //   icon: Briefcase,
          // },
          // {
          //   title: "Reports",
          //   href: "/client/reporting",
          //   icon: BarChart,
          // },
          // {
          //   title: "Feedback & Optimization",
          //   href: "/client/feedback",
          //   icon: MessageSquare,
          // },
        ],
        contentCreationItems: [], // No content creation items for clients
      };
    }

    // Admin nav items
    if (role === "Administrator") {
      const adminMainItems = [
        {
          title: "Overview",
          href: "/admin",
          icon: LayoutDashboard,
        },
        {
          title: "Appointment Booking",
          href: "/client/appointment-booking",
          icon: Calendar,
        },
        {
          title: "Documents",
          href: "/documents",
          icon: FileText,
        },
        {
          title: "Subscription Services",
          href: "/admin/subscription-service",
          icon: DollarSign,
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
    if (role === "Videographer") {
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
    if (role === "Designer") {
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

  const { mainItems, contentCreationItems } = getNavItems(activeRole);

  const secondaryNavItems = [
    {
      title: "Settings",
      href: activeRole === "Administrator" ? "/settings" : `/${activeRole}/settings`,
      icon: Settings,
    },
    {
      title: "Logout",
      href: "/logout",
      icon: LogOut,
      onClick: () => logout?.(),
    },
  ];

  const roleTitle = activeRole.charAt(0).toUpperCase() + activeRole.slice(1);

  return (
    <Sidebar className=" border-blue-900/30 ">
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

        {activeRole === "Administrator" && contentCreationItems.length > 0 && (
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
              {user?.firstname?.charAt(0) || user?.lastname?.charAt(0) || roleTitle.charAt(0)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {user ? `${user.firstname} ${user.lastname}` : "User"}
            </span>
            <span className="text-xs text-muted-foreground">{roleTitle}</span>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
