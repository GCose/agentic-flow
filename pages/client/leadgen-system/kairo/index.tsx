import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import LeadsTable from "@/components/systems/leadgen-system/lead-table";
import { ClientPageMeta } from "@/page-meta/meta";
import { useLeads, useDeleteLead } from "@/hooks/use-kairo";

import router from "next/router";
import DashboardStatCard from "@/components/cards/dashboard-stats-card";
import { clientWarmLeadDashboardStats } from "@/data/stats-card-data";

const KairoSubPage = () => {
  const { leads: rawLeads, isLoading, error, refresh } = useLeads();
  const { deleteLead } = useDeleteLead();
  const leads = Array.isArray(rawLeads) ? rawLeads : [];

  const handleDelete = async (id: string) => {
    try {
      await deleteLead(id);
    } catch (err) {
      console.error("Failed to delete lead:", err);
    }
  };

  // Only show error if it's not a 404 (no audits found)
  if (error && error.status !== 404) {
    return (
      <DashboardLayout role="client" meta={ClientPageMeta.kairoSubPage}>
        <DashboardHeader
          role="client"
          hasBackButton={true}
          title="Kairo Lead Audits"
          onBackClick={() => router.push("/client/leadgen-system")}
        />
        <div className="flex-1 px-8 pt-2">
          <div className="text-red-500 font-semibold">
            Error loading leads: {error.message || "Unknown error"}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="client" meta={ClientPageMeta.kairoSubPage}>
      <DashboardHeader
        role="client"
        hasBackButton={true}
        title="Kairo Lead Audits"
        onBackClick={() => router.push("/client/leadgen-system")}
      />
      <div className="flex flex-col gap-6 flex-1 px-8 py-6">
        <DashboardStatCard stats={clientWarmLeadDashboardStats} />
        <LeadsTable
          data={leads}
          isLoading={isLoading}
          onRefresh={async () => {
            await refresh();
          }}
          onDelete={handleDelete}
          basePath="/client/leadgen-system/kairo"
          error={error && error.status !== 404 ? error : undefined}
          title="Track all audits of leads interested in your service."
        />
      </div>
    </DashboardLayout>
  );
};

export default KairoSubPage;
