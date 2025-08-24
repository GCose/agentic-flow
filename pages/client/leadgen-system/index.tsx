import DashboardLayout from "@/components/dashboard/dashboard-layout";
import SubSystemComponent from "@/components/sub-system";
import { ClientLeadGenSubSystems } from "@/data/sub-systems";
import { ClientPageMeta } from "@/page-meta/meta";
import DashboardHeader from "@/components/dashboard/dashboard-header";

const ClientLeadGenSystemPage = () => {
  return (
    <DashboardLayout role="client" meta={ClientPageMeta.leadgenPage}>
      <DashboardHeader title="LeadGen System" />
      <div className="flex-1 space-y-6 px-8">
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
