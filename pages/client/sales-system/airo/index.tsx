import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import WarmLeads from "@/components/systems/leadgen-system/warm-leads";
import { ClientPageMeta } from "@/page-config/meta.config";
import router from "next/router";

const AiroSubPage = () => {
  return (
    <DashboardLayout role="client" meta={ClientPageMeta.airoSubPage}>
      <DashboardHeader
        role="client"
        title="Airo Captured Leads"
        hasBackButton={true}
        onBackClick={() => router.push("/client/sales-system")}
      />
      <div className="flex-1 px-8 pt-2">
        <WarmLeads role="client" />
      </div>
    </DashboardLayout>
  );
};

export default AiroSubPage;
