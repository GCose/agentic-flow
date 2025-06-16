import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import WarmLeads from "@/components/systems/leadgen-system/warm-leads";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { AdminPageMeta } from "@/page-config/meta.config";

interface Client {
  id: string;
  name: string;
  description: string;
}

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

const AdminWarmLeadsPage = () => {
  const router = useRouter();
  const { clientId } = router.query;
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    if (clientId && typeof clientId === "string") {
      const clientData = clients[clientId];
      if (clientData) {
        setClient(clientData);
      }
    }
  }, [clientId]);

  const title = client ? `${client.name} | Warm Leads` : "Warm Leads";

  return (
    <DashboardLayout meta={AdminPageMeta.leadgenPage}>
      <DashboardHeader
        role="admin"
        title={title}
        pageId={client?.id}
        hasBackButton={true}
      />
      <div className="flex-1 space-y-6 px-8 pt-4">
        <WarmLeads role="admin" clientId={client?} />
      </div>
    </DashboardLayout>
  );
};

export default AdminWarmLeadsPage;
