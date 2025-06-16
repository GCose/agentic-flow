import DashboardLayout from "@/components/dashboard/dashboard-layout";
import ColdLeads from "@/components/systems/leadgen-system/cold-leads";
import { AdminPageMeta } from "@/page-config/meta.config";
import DashboardHeader from "@/components/dashboard/dashboard-header";

const AdminClientColdLeadsPage = () => {
  return (
    <DashboardLayout role="client" meta={AdminPageMeta.coldLeadsSubPage}>
      <DashboardHeader title="Cold Leads" hasBackButton={true} role="admin" />
      <div className="flex-1 space-y-6 p-8 pt-6">
        <ColdLeads />
      </div>
    </DashboardLayout>
  );
};

export default AdminClientColdLeadsPage;
