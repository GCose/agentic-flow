import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import DashboardSidebar from "../dashboard/dashboard-sidebar";
import BackgroundElements from "../ui/background-elements";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/types/user";

interface DashboardLayoutProps {
  children: ReactNode;
  role?: UserRole;
}

const DashboardLayout = ({
  children,
  role = "admin",
}: DashboardLayoutProps) => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth/");
    } else if (
      !loading &&
      isAuthenticated &&
      user?.role !== role &&
      role !== "admin"
    ) {
      // Redirect if user doesn't have the correct role (except for admin who can view all)
      if (user?.role === "admin") {
        // Admin can view all pages
        return;
      } else if (user?.role === "videographer") {
        router.push("/admin/videographer");
      } else if (user?.role === "designer") {
        router.push("/admin/designer");
      }
    }
  }, [loading, isAuthenticated, user, router, role]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <BackgroundElements />
      <DashboardSidebar role={role} />
      <main className="flex-1 w-full overflow-y-auto relative">
        <div className="relative z-10 w-full">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
