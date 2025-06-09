import DashboardLayout from "@/components/dashboard/dashboard-layout";
import LeadGenHeader from "@/components/systems/leadgen-system/leadgen-header";
import LeadGenOverview from "@/components/systems/leadgen-system/leadgen-overview";
import SubSystemComponent from "@/components/shared/sub-system-component";
import { ClientLeadGenSubSystems } from "@/data/sub-systems";
import { ClientPageMeta } from "@/page-config/meta.config";

const ClientLeadGenSystemPage = () => {
  return (
    <DashboardLayout role="client" meta={ClientPageMeta.leadgenPage}>
      <LeadGenHeader title="LeadGen System" />
      <div className="flex-1 space-y-6 p-8 pt-6">
        <LeadGenOverview />
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
