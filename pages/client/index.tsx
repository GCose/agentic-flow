import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { ClientPageMeta } from "@/page-config/meta.config";
import SubSystemComponent from "@/components/sub-system-component";
import { clientDashboardSystem } from "@/data/sub-systems";
import DashboardStatCard from "@/components/dashboard/dashboard-stats-card";
import { clientDashboardStats } from "@/data/stats-card-data";

const DashboardPage = () => {
  return (
    <DashboardLayout role="client" meta={ClientPageMeta.dashboardPage}>
      <DashboardHeader title="Dashboard" />
      <div className="flex-1 p-8">
        {/*==================== Stats Overview ====================*/}
        <div className="mb-10">
          <DashboardStatCard stats={clientDashboardStats} />
        </div>
        {/*==================== End of Stats Overview ====================*/}

        {/*==================== SubSystem Component ====================*/}
        <SubSystemComponent
          title="Subscribed System"
          systems={clientDashboardSystem}
        />
        {/*==================== End of SubSystem Component ====================*/}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
