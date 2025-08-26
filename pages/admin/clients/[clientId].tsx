import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  FileText,
  Users,
  BarChart,
  FileInput,
  Calendar,
  Clock,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClientData, SystemConfigs } from "@/types/clients";
import { AdminPageMeta } from "@/page-meta/meta";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { getClientById,getSystemsConfig } from "@/lib/clients";
const ClientDashboardPage: NextPage = () => {
  const router = useRouter();
  const { clientId } = router.query;
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [systemsConfig, setSystemsConfig] = useState<SystemConfigs>({});

  // Helper to extract system names from backend response
  const getSubscribedSystems = (client: any): string[] => {
    if (Array.isArray(client.systems)) {
      // Prisma returns: systems: [{ system: { name: string } }]
      return client.systems.map((us: any) => us.system?.name).filter(Boolean);
    }
    return [];
  };

  useEffect(() => {
    async function fetchClient() {
      if (clientId) {
        setLoading(true);
        const clientData = await getClientById(clientId as string);
        // Extract subscribed systems from backend response
        if (
          clientData &&
          typeof clientData.id === "string" &&
          clientData.id &&
          typeof clientData.name === "string" &&
          clientData.name
        ) {
          setClient({
            ...clientData,
            systems: getSubscribedSystems(clientData),
            id: clientData.id,
            name: clientData.name,
            description: clientData.description ?? "",
            stats: clientData.stats ?? undefined,
            activeTime: clientData.activeTime ?? "",
            createdAt: clientData.createdAt ?? "",
          });
        } else {
          setClient(null);
        }
        setLoading(false);
      }
    }
    fetchClient();
  }, [clientId]);

  useEffect(() => {
    async function fetchSystemsConfig() {
      const config = await getSystemsConfig();
      setSystemsConfig(config);
    }
    fetchSystemsConfig();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!client) {
    return (
      <DashboardLayout meta={AdminPageMeta.clientDashboardPage}>
        <div className="flex-1 h-screen space-y-4 p-8 pt-6 ">
          <div className="flex items-center">
            <Button
              className="mr-4"
              variant="outline"
              onClick={() => router.push("/admin/clients")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clients
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Client Not Found</h2>
            <p className="text-muted-foreground">
              The client you are looking for does not exist or has been removed.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      meta={{
        title: client ? `${client.name} | Dashboard` : "Client Dashboard",
        description: `Dashboard for ${client?.name || "client"}`,
      }}
    >
      <DashboardHeader
        role="admin"
        title={client.name}
        hasBackButton={true}
        onBackClick={() => router.push("/admin/clients")}
      />
      <div className="flex-1 h-screen space-y-6 p-4 md:p-8 pt-6 ">
        {/*==================== Expanded Client Information ====================*/}
        <div className="grid gap-4 grid-cols-1">
          <Card className="border-blue-900/70 bg-transparent">
            <CardHeader>
              <CardTitle>{client.name.replace(" Details", "")}</CardTitle>
              <div className="text-xs text-muted-foreground mt-1">ID: {client.id}</div>
              {client.description && (
                <CardDescription>{client.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    Client Since
                  </span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {client.createdAt
                        ? client.createdAt.split("T")[0]
                        : "-"}
                    </span>
                  </div>
                </div>
                {/* <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    Subscription Duration
                  </span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {client.activeTime || "-"}
                    </span>
                  </div>
                </div> */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    Active Systems
                  </span>
                  <span className="font-medium">
                    {Array.isArray(client.systems) && client.systems.length > 0
                      ? `${client.systems.length} of ${Object.keys(systemsConfig).length} systems`
                      : `0 of ${Object.keys(systemsConfig).length} systems`}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    Account Status
                  </span>
                  <span className="text-green-500 font-medium">Active</span>
                </div>

                {/*==================== System Performance Metrics ====================*/}
                {/* Defensive checks for client.stats */}
                {/* <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    Active Users
                  </span>
                  <span className="font-medium">
                    {client.stats?.activeUsers !== undefined
                      ? `${client.stats.activeUsers} users`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    Success Rate
                  </span>
                  <span className="font-medium text-green-500">
                    {client.stats?.successRate !== undefined
                      ? `${client.stats.successRate}%`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    Active Projects
                  </span>
                  <span className="font-medium">
                    {client.stats?.projects !== undefined
                      ? `${client.stats.projects} projects`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    System Usage
                  </span>
                  <span className="font-medium">
                    {client.stats?.agents !== undefined
                      ? `${client.stats.agents} operations`
                      : "N/A"}
                  </span>
                </div> */}
                {/*==================== End of System Performance Metrics ====================*/}

                {/*==================== Subscribed Systems List ====================*/}
                <div className="col-span-1 sm:col-span-2 lg:col-span-4">
                  <div className="flex flex-col gap-3">
                    <span className="text-sm text-muted-foreground">Subscribed Systems</span>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(client.systems) && client.systems.length > 0 ? (
                        client.systems.map((system) => (
                          <span
                            key={system}
                            className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          >
                            {system}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </div>
                  </div>
                </div>
                {/*==================== End of Subscribed Systems List ====================*/}
              </div>
            </CardContent>
          </Card>
        </div>
        {/*==================== End of Expanded Client Information ====================*/}

        {/*==================== Subscribed Systems ====================*/}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">
            Subscribed Systems
          </h2>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Object.entries(systemsConfig).map(([system, config]) => {
              const isActive = Array.isArray(client.systems) && client.systems.includes(system);
              const IconComponent = config.icon;

              return (
                <Card
                  key={system}
                  className={`border-blue-900/70 relative overflow-hidden transition-all duration-300 ${
                    isActive ? config.bgGradient : "bg-slate-800/20 opacity-60"
                  }  hover:shadow-md ${
                    isActive ? "hover:translate-y-[-2px]" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div
                        className={`p-2 mb-4 rounded-lg ${
                          isActive ? "bg-white/10" : "bg-white/5"
                        }`}
                      >
                        <IconComponent
                          className={`h-5 w-5 ${
                            isActive
                              ? config.iconClassName
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      {!isActive && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-slate-800/40"
                        >
                          Upgrade Plan
                        </Button>
                      )}
                    </div>
                    <CardTitle
                      className={isActive ? "" : "text-muted-foreground"}
                    >
                      {system}
                    </CardTitle>
                    <CardDescription
                      className={isActive ? "" : "text-muted-foreground/60"}
                    >
                      {config.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isActive && (
                      <Button
                        variant="link"
                        className="cursor-pointer flex items-center gap-1 text-primary hover:text-primary/80 p-0"
                      >
                        3 months left
                      </Button>
                    )}
                    {!isActive && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 w-full"
                        disabled
                      >
                        Not Subscribed
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
        {/*==================== End of Subscribed Systems ====================*/}
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboardPage;
