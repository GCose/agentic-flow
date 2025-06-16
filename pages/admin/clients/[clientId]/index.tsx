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
import { AdminPageMeta } from "@/page-config/meta.config";
import DashboardHeader from "@/components/dashboard/dashboard-header";

// Sample clients data
const clientsData: ClientData[] = [
  {
    id: "client-1",
    name: "NextGen Agency Details",
    description:
      "Enterprise technology solutions provider specializing in digital transformation, cloud infrastructure, and AI-powered business automation for Fortune 500 companies.",
    systems: [
      "Content System",
      "LeadGen System",
      "Sales System",
      "Onboarding System",
    ],
    stats: {
      agents: 24,
      projects: 8,
      activeUsers: 12,
      successRate: 94.7,
    },
    activeTime: "3 months",
    createdAt: "2024-03-15",
  },
  {
    id: "client-2",
    name: "Aftermath Marketing Details",
    description:
      "Results-driven performance marketing agency focused on manufacturing and consumer goods companies, delivering ROI-focused campaigns and lead generation.",
    systems: ["Content System", "LeadGen System"],
    stats: {
      agents: 12,
      projects: 4,
      activeUsers: 6,
      successRate: 92.3,
    },
    activeTime: "2 months",
    createdAt: "2024-02-20",
  },
  {
    id: "client-3",
    name: "Group26Consult Details",
    description:
      "Strategic marketing consultancy and research development firm providing data-driven insights and market analysis for technology startups.",
    systems: ["Content System", "Sales System"],
    stats: {
      agents: 10,
      projects: 3,
      activeUsers: 5,
      successRate: 90.1,
    },
    activeTime: "5 months",
    createdAt: "2024-01-10",
  },
  {
    id: "client-4",
    name: "TechStart Solutions Details",
    description:
      "Innovative startup technology consultancy helping early-stage companies build scalable tech infrastructure and go-to-market strategies.",
    systems: ["Content System"],
    stats: {
      agents: 5,
      projects: 1,
      activeUsers: 3,
      successRate: 87.5,
    },
    activeTime: "1 month",
    createdAt: "2023-12-05",
  },
  {
    id: "client-5",
    name: "Future Enterprises Details",
    description:
      "Forward-thinking business solutions company focused on emerging technologies, automation, and digital workplace transformation.",
    systems: ["LeadGen System", "Sales System"],
    stats: {
      agents: 8,
      projects: 2,
      activeUsers: 4,
      successRate: 91.2,
    },
    activeTime: "2 months",
    createdAt: "2024-03-01",
  },
];

// System data with colors and icons
const systemsConfig: SystemConfigs = {
  "Content System": {
    icon: FileText,
    color: "blue",
    description: "AI-powered content creation and distribution across channels",
    bgGradient: "bg-gradient-to-br from-blue-500/10 to-blue-500/5",
    iconClassName: "text-blue-500",
  },
  "LeadGen System": {
    icon: Users,
    color: "purple",
    description: "AI-driven lead generation and qualification pipeline",
    bgGradient: "bg-gradient-to-br from-purple-500/10 to-purple-500/5",
    iconClassName: "text-purple-500",
  },
  "Sales System": {
    icon: BarChart,
    color: "green",
    description: "AI-enhanced sales process optimization and conversion",
    bgGradient: "bg-gradient-to-br from-green-500/10 to-green-500/5",
    iconClassName: "text-green-500",
  },
  "Onboarding System": {
    icon: FileInput,
    color: "orange",
    description: "Automated client onboarding workflow with AI assistance",
    bgGradient: "bg-gradient-to-br from-orange-500/10 to-orange-500/5",
    iconClassName: "text-orange-500",
  },
};

const ClientDashboardPage: NextPage = () => {
  const router = useRouter();
  const { clientId } = router.query;
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (clientId) {
      const clientData = clientsData.find((c) => c.id === clientId);
      setClient(clientData || null);
      setLoading(false);
    }
  }, [clientId]);

  const handleSystemClick = (system: string) => {
    const systemSlug = system.toLowerCase().replace(/\s+/g, "-");
    // Fixed routing to keep "Clients" menu active
    router.push(`/admin/clients/${clientId}/${systemSlug}`);
  };

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
          <Card className="border-blue-900/30 bg-transparent">
            <CardHeader>
              <CardTitle>{client.name.replace(" Details", "")}</CardTitle>
              <CardDescription>{client.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    Client Since
                  </span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{client.createdAt}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    Subscription Duration
                  </span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{client.activeTime}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    Active Systems
                  </span>
                  <span className="font-medium">
                    {client.systems.length} of 4 systems
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    Account Status
                  </span>
                  <span className="text-green-500 font-medium">Active</span>
                </div>

                {/* System Performance Metrics */}
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    Active Users
                  </span>
                  <span className="font-medium">
                    {client.stats.activeUsers} users
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    Success Rate
                  </span>
                  <span className="font-medium text-green-500">
                    {client.stats.successRate}%
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    Active Projects
                  </span>
                  <span className="font-medium">
                    {client.stats.projects} projects
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-muted-foreground">
                    System Usage
                  </span>
                  <span className="font-medium">
                    {client.stats.agents} operations
                  </span>
                </div>

                {/* Subscribed Systems List */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-4">
                  <div className="flex flex-col gap-3">
                    <span className="text-sm text-muted-foreground">
                      Subscribed Systems
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {client.systems.map((system) => (
                        <span
                          key={system}
                          className="px-3 py-1 text-xs rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20"
                        >
                          {system}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
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
              const isActive = client.systems.includes(system);
              const IconComponent = config.icon;

              return (
                <Card
                  key={system}
                  className={`border-blue-900/30 relative overflow-hidden transition-all duration-300 ${
                    isActive ? config.bgGradient : "bg-slate-800/20 opacity-60"
                  } cursor-pointer hover:shadow-md ${
                    isActive ? "hover:translate-y-[-2px]" : ""
                  }`}
                  onClick={
                    isActive ? () => handleSystemClick(system) : undefined
                  }
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSystemClick(system);
                        }}
                      >
                        View {system} →
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
