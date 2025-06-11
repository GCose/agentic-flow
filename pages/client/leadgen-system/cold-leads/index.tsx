import DashboardLayout from "@/components/dashboard/dashboard-layout";
import ColdLeads from "@/components/systems/leadgen-system/cold-leads";
import { ClientPageMeta } from "@/page-config/meta.config";
import DashboardHeader from "@/components/dashboard/dashboard-header";

const ClientColdLeadsPage = () => {
  return (
    <DashboardLayout role="client" meta={ClientPageMeta.coldLeadsSubPage}>
      <DashboardHeader title="Cold Leads" hasBackButton={true} role="client" />
      <div className="flex-1 space-y-6 p-8 pt-6">
        <ColdLeads />
      </div>
    </DashboardLayout>
  );
};

export default ClientColdLeadsPage;
