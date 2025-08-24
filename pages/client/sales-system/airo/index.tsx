import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import LeadsTable from "@/components/systems/leadgen-system/lead-table";
import ErrorState from "@/components/ui/error-state";
import { ClientPageMeta } from "@/page-meta/meta";
import { useLeads, useDeleteLead } from "@/hooks/use-airo";
import router from "next/router";
import DashboardStatCard from "@/components/cards/dashboard-stats-card";
import { clientWarmLeadDashboardStats } from "@/data/stats-card-data";

const AiroSubPage = () => {
  const { leads, isLoading, error, refresh } = useLeads();
  const { deleteLead } = useDeleteLead();
  console.log("Error in LeadsPage:", error);

  const handleDelete = async (id: string) => {
    try {
      await deleteLead(id);
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  };

  if (error && !isLoading) {
    return (
      <DashboardLayout role="client" meta={ClientPageMeta.airoSubPage}>
        <DashboardHeader
          role="client"
          hasBackButton={true}
          title="Airo Captured Leads"
          onBackClick={() => router.push("/client/sales-system")}
        />
        <div className="flex-1 px-8 pt-6">
          <ErrorState
            showRetry={true}
            onRetry={refresh}
            showGoBack={true}
            title="Unable to Load Leads"
            type={error.status >= 500 ? "server" : "network"}
            onGoBack={() => router.push("/client/sales-system")}
            message="I'm having trouble fetching your captured leads. This might be a temporary connectivity issue."
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="client" meta={ClientPageMeta.airoSubPage}>
      <DashboardHeader
        role="client"
        hasBackButton={true}
        title="Airo Captured Leads"
        onBackClick={() => router.push("/client/sales-system")}
      />
      <div className="flex flex-col gap-6 flex-1 px-8 pt-6">
        <DashboardStatCard stats={clientWarmLeadDashboardStats} />
        <LeadsTable
          isLoading={isLoading}
          onRefresh={async () => {
            await refresh();
          }}
          onDelete={handleDelete}
          basePath="/client/sales-system/airo"
          data={Array.isArray(leads) ? leads : leads?.leads || []}
          title="Manage and track leads that have shown interest in your products or services."
        />
      </div>
    </DashboardLayout>
  );
};

export default AiroSubPage;
