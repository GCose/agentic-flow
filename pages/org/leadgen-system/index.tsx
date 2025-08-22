import DashboardLayout from "@/components/dashboard/dashboard-layout";
import SubSystemComponent from "@/components/sub-system";
import { ClientLeadGenSubSystems } from "@/data/sub-systems";
import { ClientPageMeta } from "@/page-meta/meta";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardStatCard from "@/components/cards/dashboard-stats-card";
import { clientWarmLeadDashboardStats } from "@/data/stats-card-data";

const ClientLeadGenSystemPage = () => {
  return (
    <DashboardLayout 
      role="client" 
      allowedRoles={['client', 'user', 'viewer']}
      meta={ClientPageMeta.leadgenPage}
    >
      <DashboardHeader title="LeadGen System" />
      <div className="flex-1 space-y-6 p-8 pt-6 ">
        <DashboardStatCard stats={clientWarmLeadDashboardStats} />
        {/*==================== SubSystem Component ====================*/}
        <SubSystemComponent
          title="Sub-Systems"
          systems={ClientLeadGenSubSystems}
        />
        {/*==================== End of SubSystem Component ====================*/}
      </div>
    </DashboardLayout>
  );
};

export default ClientLeadGenSystemPage;
