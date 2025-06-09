import type { NextPage } from "next";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import DashboardStats from "@/components/dashboard/admin-dashboard-stats";
import SystemCards from "@/components/shared/cards/system-cards";
import { AdminPageMeta } from "@/page-config/meta.config";

const DashboardPage: NextPage = () => {
  return (
    <DashboardLayout meta={AdminPageMeta.dashboardPage}>
      <DashboardHeader title="Overview" />
      <div className="flex-1 p-8 pt-6">
        {/*==================== Stats Overview ====================*/}
        <div className="mb-10">
          <DashboardStats />
        </div>
        {/*==================== End of Stats Overview ====================*/}

        {/*==================== Core Systems ====================*/}
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Core Systems
          </h2>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
            <SystemCards />
          </div>
        </div>
        {/*==================== End of Core Systems ====================*/}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
