import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import LeadGenHeader from "@/components/systems/leadgen-system/leadgen-header";
import WarmLeads from "@/components/systems/leadgen-system/warm-leads";

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

const AdminWarmLeadsPage = () => {
  const router = useRouter();
  const { clientId } = router.query;
  const [client, setClient] = useState<Client | null>(null);

  // If clientId is provided, look up the client data
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
    <>
      <Head>
        <title>Agentic Flow | {title}</title>
        <meta
          name="description"
          content="Manage warm leads in the lead generation system"
        />
      </Head>
      <DashboardLayout>
        <LeadGenHeader
          role="admin"
          title={title}
          hasBackButton={true}
          clientId={client?.id}
        />
        <div className="flex-1 space-y-6 p-8 pt-6">
          <WarmLeads />
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminWarmLeadsPage;
