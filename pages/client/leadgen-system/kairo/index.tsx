import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import AiroLeads from "@/components/systems/leadgen-system/airo";
import { ClientPageMeta } from "@/page-config/meta.config";
import router from "next/router";

const KairoSubPage = () => {
  return (
    <DashboardLayout role="client" meta={ClientPageMeta.kairoSubPage}>
      <DashboardHeader
        role="client"
        title="Kairo Audits"
        hasBackButton={true}
        onBackClick={() => router.push("/client/leadgen-system")}
      />
      <div className="flex-1 px-8 pt-2">
        <AiroLeads />
      </div>
    </DashboardLayout>
  );
};

export default KairoSubPage;
