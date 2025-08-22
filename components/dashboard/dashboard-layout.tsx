import Head from "next/head";
import type { ReactNode } from "react";
import DashboardSidebar from "../dashboard/dashboard-sidebar";
import BackgroundElements from "../ui/background-elements";
import { UserRole } from "@/types/user";
import RoleBasedRoute from "@/components/auth/RoleBasedRoute";

type Meta = {
  title: string;
  description?: string;
  icon?: string;
};

interface DashboardLayoutProps {
  children: ReactNode;
  role?: UserRole;
  meta: Meta;
  allowedRoles?: UserRole[];
  requiredPermissions?: string[];
}

const DashboardLayout = ({ 
  children, 
  role, 
  meta, 
  allowedRoles,
  requiredPermissions 
}: DashboardLayoutProps) => {
  // If allowedRoles is not provided, default to the specified role or common roles
  const rolesAllowed = allowedRoles || (role ? [role] : ['Administrator', 'Organization', 'Videographer', 'Designer']);

  return (
    <RoleBasedRoute 
      allowedRoles={rolesAllowed}
      requiredPermissions={requiredPermissions}
    >
      <Head>
        <title>{meta.title}</title>
        {meta.description && (
          <meta name="description" content={meta.description} />
        )}
        <link rel="icon" href="/images/Icon.png" />
      </Head>

      <div className="flex h-screen w-screen overflow-hidden">
        <BackgroundElements />
        <DashboardSidebar />
        <main className="flex-1 w-full overflow-y-auto relative">
          <div className="relative z-10 w-full">{children}</div>
        </main>
      </div>
    </RoleBasedRoute>
  );
};

export default DashboardLayout;
