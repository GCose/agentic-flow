import DashboardLayout from "@/components/dashboard/dashboard-layout";
import SubSystemComponent from "@/components/sub-system";
import { ClientSalesSystemSubSystems } from "@/data/sub-systems";
import { ClientPageMeta } from "@/page-config/meta.config";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardStatCard from "@/components/cards/dashboard-stats-card";
import { clientWarmLeadDashboardStats } from "@/data/stats-card-data";

const SalesSystemPage = () => {
  return (
    <DashboardLayout role="client" meta={ClientPageMeta.salesSystemPage}>
      <DashboardHeader title="Sales System" />
      <div className="flex-1 space-y-6 p-8 pt-6 ">
        <DashboardStatCard stats={clientWarmLeadDashboardStats} />
        {/*==================== SubSystem Component ====================*/}
        <SubSystemComponent
          title="Sub-Systems"
          systems={ClientSalesSystemSubSystems}
        />
        {/*==================== End of SubSystem Component ====================*/}
      </div>
    </DashboardLayout>
  );
};

export default SalesSystemPage;
