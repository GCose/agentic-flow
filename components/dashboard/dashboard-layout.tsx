import Head from "next/head";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import DashboardSidebar from "../dashboard/dashboard-sidebar";
import BackgroundElements from "../ui/background-elements";
import { useAuth } from "@/contexts/auth-context";
import { UserRole } from "@/types/user";

type Meta = {
  title: string;
  description?: string;
  icon?: string;
};

interface DashboardLayoutProps {
  children: ReactNode;
  role?: UserRole;
  meta: Meta;
}

const DashboardLayout = ({
  children,
  role = "admin",
  meta,
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
      if (user?.role === "admin") return;
      else if (user?.role === "videographer")
        router.push("/admin/videographer");
      else if (user?.role === "designer") router.push("/admin/designer");
    }
  }, [loading, isAuthenticated, user, router, role]);

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        {meta.description && (
          <meta name="description" content={meta.description} />
        )}
        <link rel="icon" href="/images/Icon.png" />
      </Head>

      <div className="flex h-screen w-screen overflow-hidden">
        <BackgroundElements />
        <DashboardSidebar role={role} />
        <main className="flex-1 w-full overflow-y-auto relative">
          <div className="relative z-10 w-full">{children}</div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
