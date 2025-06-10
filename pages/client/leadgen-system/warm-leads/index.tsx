import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import WarmLeads from "@/components/systems/leadgen-system/warm-leads";
import { ClientPageMeta } from "@/page-config/meta.config";

const ClientWarmLeadsPage = () => {
  return (
    <DashboardLayout role="client" meta={ClientPageMeta.warmLeadsSubPage}>
      <DashboardHeader title="Warm Leads" hasBackButton={true} role="client" />
      <div className="flex-1 px-8 py-2">
        <WarmLeads role="client" />
      </div>
    </DashboardLayout>
  );
};

export default ClientWarmLeadsPage;
