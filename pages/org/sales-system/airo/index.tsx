import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import LeadsTable from "@/components/systems/leadgen-system/lead-table";
import { ClientPageMeta } from "@/page-meta/meta";
import { useLeads, useDeleteLead } from "@/hooks/use-airo";
import router from "next/router";

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

  return (
    <DashboardLayout role="client" meta={ClientPageMeta.airoSubPage}>
      <DashboardHeader
        role="client"
        hasBackButton={true}
        title="Airo Captured Leads"
        onBackClick={() => router.push("/client/sales-system")}
      />
      <div className="flex-1 px-8 pt-2">
        <LeadsTable
          basePath="/client/sales-system/airo"
          title="Manage and track leads that have shown interest in your products or services."
          data={Array.isArray(leads) ? leads : leads?.leads || []}
          isLoading={isLoading}
          // error={error}
          onRefresh={async () => {
            await refresh();
          }}
          onDelete={handleDelete}
        />
      </div>
    </DashboardLayout>
  );
};

export default AiroSubPage;
