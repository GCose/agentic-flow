import type { NextPage } from "next";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import DashboardStats from "@/components/dashboard/admin-dashboard-stats";
import { ClientPageMeta } from "@/page-config/meta.config";
import SubSystemComponent from "@/components/shared/sub-system-component";
import { ClientDashboardSystem } from "@/data/sub-systems";

const DashboardPage: NextPage = () => {
  return (
    <DashboardLayout role="client" meta={ClientPageMeta.dashboardPage}>
      <DashboardHeader title="Dashboard" />
      <div className="flex-1 p-8">
        {/*==================== Stats Overview ====================*/}
        <div className="mb-10">
          <DashboardStats />
        </div>
        {/*==================== End of Stats Overview ====================*/}

        {/*==================== SubSystem Component ====================*/}
        <SubSystemComponent
          title="Subscribed System"
          systems={ClientDashboardSystem}
        />
        {/*==================== End of SubSystem Component ====================*/}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
