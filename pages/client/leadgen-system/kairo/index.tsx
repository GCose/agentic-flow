import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import LeadsTable from "@/components/systems/leadgen-system/lead-table";
import { ClientPageMeta } from "@/page-meta/meta";
import { useLeads } from "@/hooks/use-kairo";

import router from "next/router";

const KairoSubPage = () => {
  const { leads, isLoading, error, refresh } = useLeads();

  console.log("Kairo SubPage - Leads Data:", leads);
  return (
    <DashboardLayout role="client" meta={ClientPageMeta.kairoSubPage}>
      <DashboardHeader
        role="client"
        hasBackButton={true}
        title="Kairo Lead Audits"
        onBackClick={() => router.push("/client/leadgen-system")}
      />
      <div className="flex-1 px-8 pt-2">
        <LeadsTable
          basePath="/client/leadgen-system/kairo"
          title="Track all audits of leads interested in your service."
          data={leads}
          isLoading={isLoading}
          error={error}
          onRefresh={async () => {
            await refresh();
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default KairoSubPage;
