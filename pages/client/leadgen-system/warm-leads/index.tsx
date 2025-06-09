import DashboardLayout from "@/components/dashboard/dashboard-layout";
import LeadGenHeader from "@/components/systems/leadgen-system/leadgen-header";
import WarmLeads from "@/components/systems/leadgen-system/warm-leads";
import { ClientPageMeta } from "@/page-config/meta.config";

const ClientWarmLeadsPage = () => {
  return (
    <DashboardLayout role="client" meta={ClientPageMeta.warmLeadsSubPage}>
      <LeadGenHeader title="Warm Leads" hasBackButton={true} role="client" />
      <div className="flex-1 space-y-6 p-8 pt-6">
        <WarmLeads />
      </div>
    </DashboardLayout>
  );
};

export default ClientWarmLeadsPage;
