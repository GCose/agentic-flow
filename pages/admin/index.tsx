import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import SystemCards from "@/components/cards/system-cards";
import { AdminPageMeta } from "@/page-config/meta.config";
import DashboardStatCard from "@/components/dashboard/dashboard-stats-card";
import { adminDashboardStats } from "@/data/stats-card-data";

const DashboardPage = () => {
  return (
    <DashboardLayout meta={AdminPageMeta.dashboardPage}>
      <DashboardHeader title="Overview" />
      <div className="flex-1 p-8 pt-6">
        {/*==================== Stats Overview ====================*/}
        <div className="mb-10">
          <DashboardStatCard stats={adminDashboardStats} />
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
