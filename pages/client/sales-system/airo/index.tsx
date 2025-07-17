import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import AiroLeads from "@/components/systems/leadgen-system/airo";
import { ClientPageMeta } from "@/page-config/meta.config";
import router from "next/router";

const AiroSubPage = () => {
  return (
    <DashboardLayout role="client" meta={ClientPageMeta.airoSubPage}>
      <DashboardHeader
        role="client"
        hasBackButton={true}
        title="Airo Captured Leads"
        onBackClick={() => router.push("/client/sales-system")}
      />
      <div className="flex-1 px-8 pt-2">
        <AiroLeads />
      </div>
    </DashboardLayout>
  );
};

export default AiroSubPage;
