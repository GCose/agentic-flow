// pages/admin/leadgen-system/cold.tsx
import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import ColdLeads from "@/components/systems/leadgen-system/cold-leads";
import LeadGenHeader from "@/components/systems/leadgen-system/leadgen-header";

// Client interface
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

const AdminColdLeadsPage = () => {
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

  const title = client ? `${client.name} | Cold Leads` : "Cold Leads";

  return (
    <>
      <Head>
        <title>Agentic Flow | {title}</title>
        <meta
          name="description"
          content="Manage cold leads in the lead generation system"
        />
      </Head>
      <DashboardLayout>
        <LeadGenHeader
          title={title}
          hasBackButton={true}
          clientId={client?.id}
        />
        <div className="flex-1 space-y-6 p-8 pt-6">
          <ColdLeads />
        </div>
      </DashboardLayout>
    </>
  );
};

export default AdminColdLeadsPage;
