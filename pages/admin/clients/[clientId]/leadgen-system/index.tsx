import { useState } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { AdminPageMeta } from "@/page-config/meta.config";
import { useEffect } from "react";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardStatCard from "@/components/cards/dashboard-stats-card";
import { adminWarmLeadDashboardStats } from "@/data/stats-card-data";
import SubSystemComponent from "@/components/sub-system-component";
import { adminLeadGenSubSystems } from "@/data/sub-systems";

interface Client {
  id: string;
  name: string;
  description: string;
}

// Sample client data for lookup
const clients: Record<string, Client> = {
  "client-1": {
    id: "client-1",
    name: "NextGen Agency",
    description: "Forward-thinking digital marketing solutions",
  },
  "client-2": {
    id: "client-2",
    name: "Aftermath Marketing",
    description: "Results-driven performance marketing",
  },
  "client-3": {
    id: "client-3",
    name: "Group26Consult",
    description: "Strategic marketing consultancy",
  },
};

const LeadGenSystemPage = () => {
  const router = useRouter();
  const { clientId } = router.query;
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    if (clientId && typeof clientId === "string" && clients[clientId]) {
      setClient(clients[clientId]);
    }
  }, [clientId]);

  const title = client ? `${client.name} Leadgen System` : "Leadgen System";

  const handleBack = () => {
    if (clientId) {
      router.push(`/admin/clients/${clientId}`);
    } else {
      router.push("/admin/clients");
    }
  };

  return (
    <DashboardLayout meta={AdminPageMeta.leadgenPage}>
      <DashboardHeader
        role="admin"
        title={title}
        hasBackButton={true}
        onBackClick={handleBack}
      />
      <div className="flex-1 space-y-6 p-8 pt-8">
        <DashboardStatCard stats={adminWarmLeadDashboardStats} />

        {/*==================== SubSystem Component ====================*/}
        <SubSystemComponent
          title="Subscribed Sub-Systems"
          systems={adminLeadGenSubSystems}
        />
        {/*==================== End of SubSystem Component ====================*/}
      </div>
    </DashboardLayout>
  );
};

export default LeadGenSystemPage;
