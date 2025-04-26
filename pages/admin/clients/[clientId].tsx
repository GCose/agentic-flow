import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  FileText,
  Users,
  BarChart,
  FileInput,
  Calendar,
  Clock,
  Edit,
  Trash2,
  ArrowLeft,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/ui/stat-card";

// Define TypeScript interfaces
interface ClientStats {
  agents: number;
  projects: number;
  activeUsers: number;
  successRate: number;
}

interface ClientData {
  id: string;
  name: string;
  description: string;
  systems: string[];
  stats: ClientStats;
  activeTime: string;
  createdAt: string;
}

interface SystemConfig {
  icon: React.ElementType;
  color: string;
  description: string;
  bgGradient: string;
  iconClassName: string;
}

type SystemConfigs = Record<string, SystemConfig>;

// Sample clients data
const clientsData: ClientData[] = [
  {
    id: "client-1",
    name: "NextGen Agency",
    description: "Enterprise technology solutions provider",
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
    name: "Aftermath Marketing",
    description: "Manufacturing and consumer goods company",
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
    name: "Group26Consult",
    description: "Research and development firm",
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
    name: "TechStart Solutions",
    description: "Startup technology consultancy",
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
    name: "Future Enterprises",
    description: "Forward-thinking business solutions",
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
    description: "Content creation and distribution across channels",
    bgGradient: "bg-gradient-to-br from-blue-500/10 to-blue-500/5",
    iconClassName: "text-blue-500",
  },
  "LeadGen System": {
    icon: Users,
    color: "purple",
    description: "Lead generation and qualification pipeline",
    bgGradient: "bg-gradient-to-br from-purple-500/10 to-purple-500/5",
    iconClassName: "text-purple-500",
  },
  "Sales System": {
    icon: BarChart,
    color: "green",
    description: "Sales process optimization and conversion",
    bgGradient: "bg-gradient-to-br from-green-500/10 to-green-500/5",
    iconClassName: "text-green-500",
  },
  "Onboarding System": {
    icon: FileInput,
    color: "orange",
    description: "Client onboarding workflow and automation",
    bgGradient: "bg-gradient-to-br from-orange-500/10 to-orange-500/5",
    iconClassName: "text-orange-500",
  },
};

// Define typing for project items
interface ProjectItem {
  id: string;
  name: string;
  system: string;
  startDate: string;
}

// Sample project data
const projectItems: ProjectItem[] = [
  {
    id: "proj-1",
    name: "Q2 Marketing Campaign",
    system: "Content System",
    startDate: "Started 2 weeks ago",
  },
  {
    id: "proj-2",
    name: "Sales Pipeline Automation",
    system: "Sales System",
    startDate: "Started 1 month ago",
  },
  {
    id: "proj-3",
    name: "Client Acquisition Strategy",
    system: "LeadGen System",
    startDate: "Started 3 weeks ago",
  },
];

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
    // Direct to the content system page for this client
    if (system === "Content System") {
      router.push(`/admin/content-system?clientId=${clientId}`);
    } else if (system === "LeadGen System") {
      router.push("/admin/leadgen-system");
    } else {
      // For other systems, use a slug format
      const systemSlug = system.toLowerCase().replace(/\s+/g, "-");
      router.push(`/admin/clients/${clientId}/${systemSlug}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!client) {
    return (
      <DashboardLayout>
        <div className="flex-1 space-y-4 p-8 pt-6">
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
    <>
      <Head>
        <title>{`Agentic Flow | ${client.name}`}</title>
        <meta name="description" content={`Dashboard for ${client.name}`} />
      </Head>
      <DashboardLayout>
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/clients")}
                className="h-9 w-9 p-0 rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  {client.name}
                </h2>
                <p className="text-muted-foreground">{client.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Edit Client
              </Button>
              <Button variant="outline" size="sm" className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>

          {/*==================== Client Stats Overview ====================*/}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Users}
              color="blue"
              title="Active Agents"
              value={client.stats.agents.toString()}
              change={`Total for ${client.systems.length} systems`}
            />
            <StatCard
              color="purple"
              icon={FileText}
              title="Projects"
              change={`Across all systems`}
              value={client.stats.projects.toString()}
            />
            <StatCard
              icon={Users}
              color="green"
              title="Active Users"
              change={`Last 30 days`}
              value={client.stats.activeUsers.toString()}
            />
            <StatCard
              color="orange"
              icon={BarChart}
              title="Success Rate"
              change={`Avg. across all systems`}
              value={`${client.stats.successRate}%`}
            />
          </div>
          {/*==================== End of Client Stats Overview ====================*/}

          {/*==================== Additional Client Info ====================*/}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1 lg:col-span-2 -none border-slate-800 bg-transparent backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      Client Since
                    </span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{client.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      Subscription Duration
                    </span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{client.activeTime}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      Subscribed Systems
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{client.systems.length} systems</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      Total Content Items
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{client.stats.agents * 8} items</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1 border border-slate-800 bg-transparent backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Active Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  {projectItems.map((project) => (
                    <div key={project.id} className="flex items-start gap-2">
                      <div
                        className={`h-2 w-2 mt-1.5 rounded-full ${
                          project.system === "Content System"
                            ? "bg-blue-500"
                            : project.system === "LeadGen System"
                            ? "bg-purple-500"
                            : project.system === "Sales System"
                            ? "bg-green-500"
                            : "bg-orange-500"
                        }`}
                      ></div>
                      <div>
                        <p className="text-sm font-medium">{project.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {project.system} • {project.startDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          {/*==================== End of Additional Client Info ====================*/}

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
                    className={`border-none border-slate-800 relative overflow-hidden transition-all duration-300 ${
                      isActive
                        ? config.bgGradient
                        : "bg-slate-800/20 opacity-60"
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
                          className={`p-2 rounded-lg ${
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
                            variant="outline"
                            size="sm"
                            className="text-xs bg-slate-800/40"
                          >
                            Add System
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
                        <div className="text-sm">
                          <Button
                            variant="link"
                            className="px-0 mt-2 flex items-center gap-1 text-primary hover:text-primary/80"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSystemClick(system);
                            }}
                          >
                            Go to {system}
                            <ArrowUpRight className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      {!isActive && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2 w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          Subscribe to {system}
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
    </>
  );
};

export default ClientDashboardPage;
