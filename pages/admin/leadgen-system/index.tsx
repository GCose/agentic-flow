import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Thermometer, Snowflake, ArrowUpRight } from "lucide-react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import LeadGenHeader from "@/components/systems/leadgen-system/leadgen-header";
import LeadGenOverview from "@/components/systems/leadgen-system/leadgen-overview";
import { Card, CardContent } from "@/components/ui/card";
import { LeadType } from "@/types/leads";

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

const LeadGenSystemPage = () => {
  const router = useRouter();
  const { clientId } = router.query;
  const [client, setClient] = useState<Client | null>(null);

  // Determine if we have a valid client
  useState(() => {
    if (clientId && typeof clientId === "string" && clients[clientId]) {
      setClient(clients[clientId]);
    }
  });

  // Handle card click to navigate to the detailed view
  const handleLeadTypeClick = (leadType: LeadType) => {
    if (client) {
      router.push(`/admin/leadgen-system/${leadType}?clientId=${client.id}`);
    } else {
      router.push(`/admin/leadgen-system/${leadType}`);
    }
  };

  const title = client ? `${client.name} | LeadGen System` : "LeadGen System";

  return (
    <>
      <Head>
        <title>Agentic Flow | {title}</title>
        <meta
          name="description"
          content="Lead generation system for tracking and managing leads"
        />
      </Head>
      <DashboardLayout>
        <LeadGenHeader
          title={title}
          hasBackButton={!!client}
          clientId={client?.id}
        />
        <div className="flex-1 space-y-6 p-8 pt-6">
          <LeadGenOverview />

          <div className="grid gap-6 md:grid-cols-2">
            {/* Warm leads card */}
            <Card
              className="border border-slate-800 bg-gradient-to-br from-orange-500/10 to-orange-500/5 cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              onClick={() => handleLeadTypeClick("warm")}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-orange-500/10 p-4 mb-4">
                  <Thermometer className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="font-medium text-lg mb-2">Warm Leads</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage leads that have shown interest in your products or
                  services
                </p>
                <div className="flex items-center justify-center w-full mt-auto">
                  <Link
                    href={
                      client
                        ? `/admin/leadgen-system/warm?clientId=${client.id}`
                        : "/admin/leadgen-system/warm"
                    }
                    className="flex items-center text-primary text-sm hover:underline"
                  >
                    <span>View warm leads</span>
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Cold leads card */}
            <Card
              className="border border-slate-800 bg-gradient-to-br from-blue-500/10 to-blue-500/5 cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              onClick={() => handleLeadTypeClick("cold")}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="rounded-full bg-blue-500/10 p-4 mb-4">
                  <Snowflake className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="font-medium text-lg mb-2">Cold Leads</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover potential leads and start your outreach campaigns
                </p>
                <div className="flex items-center justify-center w-full mt-auto">
                  <Link
                    href={
                      client
                        ? `/admin/leadgen-system/cold?clientId=${client.id}`
                        : "/admin/leadgen-system/cold"
                    }
                    className="flex items-center text-primary text-sm hover:underline"
                  >
                    <span>View cold leads</span>
                    <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default LeadGenSystemPage;
