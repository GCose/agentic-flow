import type { ReactNode } from "react";
import DashboardSidebar from "../dashboard/dashboard-sidebar";
import BackgroundElements from "../ui/background-elements";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <BackgroundElements />
      <DashboardSidebar />
      <main className="flex-1 w-full overflow-y-auto relative">
        <div className="relative z-10 w-full">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
