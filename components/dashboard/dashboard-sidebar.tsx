import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Brain,
  Users,
  BarChart,
  FileInput,
  RefreshCw,
  Search,
  Settings,
  LogOut,
  LayoutDashboard,
  FileText,
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

const mainNavItems = [
  {
    title: "Overview",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Content System",
    href: "/content-system",
    icon: FileText,
  },
  {
    title: "Agent Management",
    href: "/agent-management",
    icon: Brain,
  },
  {
    title: "Client Dashboard",
    href: "/client-dashboard",
    icon: Users,
  },
  {
    title: "Reporting & Output",
    href: "/reporting",
    icon: BarChart,
  },
  {
    title: "Onboarding & Prompts",
    href: "/onboarding",
    icon: FileInput,
  },
  {
    title: "Feedback & Optimization",
    href: "/feedback",
    icon: RefreshCw,
  },
];

const secondaryNavItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Logout",
    href: "/logout",
    icon: LogOut,
  },
];

const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar className="backdrop-blur-sm border-none border-slate-800">
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
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href} className="group">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
                          pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : "bg-transparent group-hover:bg-primary/10"
                        }`}
                      >
                        <item.icon className="h-3.5 w-3.5" />
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
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href} className="group">
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
                          pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : "bg-transparent group-hover:bg-primary/10"
                        }`}
                      >
                        <item.icon className="h-3.5 w-3.5" />
                      </div>
                      <span>{item.title}</span>
                    </Link>
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
            <span className="text-sm font-medium text-white">JD</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default DashboardSidebar;
