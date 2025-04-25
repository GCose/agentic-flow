import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { PlusCircle, MoreHorizontal, Check } from "lucide-react";
import DashboardLayout from "@/components/layouts/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ClientDashboardHeader from "@/components/client-dashboard/client-dashboard-header";

// Client interface
interface Client {
  id: string;
  name: string;
  description: string;
  systems: string[];
  agents: number;
  createdAt: string;
  subscriptionDuration: string;
}

// Sample client data with the specific companies you requested
const initialClients: Client[] = [
  {
    id: "client-1",
    name: "Nextgen Agency",
    description: "Forward-thinking digital marketing solutions",
    systems: ["Content", "LeadGen System", "Sales System", "Onboarding System"],
    agents: 24,
    createdAt: "2024-03-15",
    subscriptionDuration: "6 months",
  },
  {
    id: "client-2",
    name: "Aftermath Marketing",
    description: "Results-driven performance marketing",
    systems: ["Content", "LeadGen System", "Sales System"],
    agents: 18,
    createdAt: "2024-02-20",
    subscriptionDuration: "3 months",
  },
  {
    id: "client-3",
    name: "Group26Consult",
    description: "Strategic marketing consultancy",
    systems: ["Content", "LeadGen System", "Onboarding System"],
    agents: 15,
    createdAt: "2024-01-10",
    subscriptionDuration: "12 months",
  },
  {
    id: "client-4",
    name: "Zenith Digital",
    description: "Premium digital strategy firm",
    systems: ["Content", "Sales System"],
    agents: 12,
    createdAt: "2023-12-05",
    subscriptionDuration: "9 months",
  },
  {
    id: "client-5",
    name: "Apex Marketing Group",
    description: "Comprehensive marketing solutions",
    systems: ["Content", "LeadGen System"],
    agents: 10,
    createdAt: "2024-03-01",
    subscriptionDuration: "4 months",
  },
  {
    id: "client-6",
    name: "Elevate Media",
    description: "Innovative media strategies",
    systems: ["Content"],
    agents: 6,
    createdAt: "2023-11-15",
    subscriptionDuration: "6 months",
  },
  {
    id: "client-7",
    name: "Catalyst Partners",
    description: "Business transformation specialists",
    systems: ["LeadGen System", "Sales System"],
    agents: 14,
    createdAt: "2024-01-21",
    subscriptionDuration: "8 months",
  },
  {
    id: "client-8",
    name: "Blueprint Agency",
    description: "Strategic marketing blueprints",
    systems: ["Content", "Sales System"],
    agents: 11,
    createdAt: "2023-10-05",
    subscriptionDuration: "10 months",
  },
  {
    id: "client-9",
    name: "Horizon Marketing",
    description: "Future-focused marketing strategies",
    systems: ["Content", "LeadGen System", "Onboarding System"],
    agents: 16,
    createdAt: "2024-02-10",
    subscriptionDuration: "5 months",
  },
  {
    id: "client-10",
    name: "Pulse Media",
    description: "Engagement-driven marketing",
    systems: ["Content"],
    agents: 7,
    createdAt: "2023-12-18",
    subscriptionDuration: "3 months",
  },
  {
    id: "client-11",
    name: "Innovate Partners",
    description: "Disruptive marketing solutions",
    systems: ["LeadGen System", "Sales System"],
    agents: 12,
    createdAt: "2024-01-03",
    subscriptionDuration: "7 months",
  },
  {
    id: "client-12",
    name: "Quantum Marketing",
    description: "Data-driven marketing excellence",
    systems: ["Content", "LeadGen System", "Sales System"],
    agents: 19,
    createdAt: "2023-11-22",
    subscriptionDuration: "9 months",
  },
  {
    id: "client-13",
    name: "Fusion Strategies",
    description: "Integrated marketing approaches",
    systems: ["Content", "Onboarding System"],
    agents: 13,
    createdAt: "2024-02-28",
    subscriptionDuration: "4 months",
  },
  {
    id: "client-14",
    name: "Pinnacle Media",
    description: "High-performance media solutions",
    systems: ["Content", "LeadGen System"],
    agents: 14,
    createdAt: "2023-10-12",
    subscriptionDuration: "11 months",
  },
  {
    id: "client-15",
    name: "Vertex Consulting",
    description: "Strategic marketing consulting",
    systems: ["Content", "Sales System", "Onboarding System"],
    agents: 17,
    createdAt: "2024-01-17",
    subscriptionDuration: "5 months",
  },
  {
    id: "client-16",
    name: "Echo Digital",
    description: "Resonant digital strategies",
    systems: ["Content"],
    agents: 8,
    createdAt: "2023-12-07",
    subscriptionDuration: "6 months",
  },
  {
    id: "client-17",
    name: "Velocity Partners",
    description: "Accelerated growth marketing",
    systems: ["Content", "LeadGen System", "Sales System"],
    agents: 20,
    createdAt: "2024-02-05",
    subscriptionDuration: "4 months",
  },
  {
    id: "client-18",
    name: "Synergy Group",
    description: "Collaborative marketing excellence",
    systems: ["LeadGen System", "Onboarding System"],
    agents: 11,
    createdAt: "2023-11-18",
    subscriptionDuration: "7 months",
  },
  {
    id: "client-19",
    name: "Spark Creative",
    description: "Inspired creative marketing",
    systems: ["Content", "LeadGen System"],
    agents: 15,
    createdAt: "2024-03-05",
    subscriptionDuration: "2 months",
  },
  {
    id: "client-20",
    name: "Prism Media",
    description: "Multi-faceted media strategies",
    systems: ["Content", "Sales System"],
    agents: 13,
    createdAt: "2023-10-30",
    subscriptionDuration: "8 months",
  },
];

const ClientDashboardPage: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState<{
    name: string;
    description: string;
    systems: string[];
  }>({
    name: "",
    description: "",
    systems: [],
  });

  const router = useRouter();

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigateToClientDashboard = (clientId: string) => {
    router.push(`/admin/client-dashboard/${clientId}`);
  };

  const navigateToClientSystem = (clientId: string, system: string) => {
    // If Content, go to that page with the clientId
    if (system === "Content") {
      router.push(`/admin/content-system?clientId=${clientId}`);
    } else {
      // For other systems, use a slug format
      const systemSlug = system.toLowerCase().replace(/\s+/g, "-");
      router.push(`/admin/client-dashboard/${clientId}/${systemSlug}`);
    }
  };

  const handleSystemToggle = (system: string) => {
    setNewClient((prev) => {
      const systemExists = prev.systems.includes(system);
      return {
        ...prev,
        systems: systemExists
          ? prev.systems.filter((s) => s !== system)
          : [...prev.systems, system],
      };
    });
  };

  const handleCreateClient = () => {
    // Simple validation
    if (!newClient.name) return;

    const newClientData: Client = {
      id: `client-${clients.length + 1}`,
      name: newClient.name,
      description: newClient.description,
      systems: newClient.systems,
      agents: newClient.systems.length * 4 + 2, // Simple calculation for demo
      createdAt: new Date().toISOString().split("T")[0],
      subscriptionDuration: "1 month", // Default for new clients
    };

    setClients([...clients, newClientData]);
    setIsModalOpen(false);

    // Reset form
    setNewClient({
      name: "",
      description: "",
      systems: [],
    });
  };

  return (
    <>
      <Head>
        <title>Agentic Flow | Client Dashboard</title>
        <meta
          name="description"
          content="Manage all your clients in Agentic Flow"
        />
      </Head>
      <DashboardLayout>
        <ClientDashboardHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
              <p className="text-muted-foreground">
                Manage all client accounts and their system access
              </p>
            </div>
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Client
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Client</DialogTitle>
                  <DialogDescription>
                    Add a new client to Agentic Flow. Fill in the details below.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Client Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter client name"
                      value={newClient.name}
                      onChange={(e) =>
                        setNewClient((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the client"
                      value={newClient.description}
                      onChange={(e) =>
                        setNewClient((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Systems</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Content",
                        "LeadGen System",
                        "Sales System",
                        "Onboarding System",
                      ].map((system) => (
                        <div
                          key={system}
                          className="flex items-center space-x-2"
                        >
                          <Button
                            type="button"
                            variant={
                              newClient.systems.includes(system)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => handleSystemToggle(system)}
                          >
                            {newClient.systems.includes(system) ? (
                              <Check className="mr-2 h-4 w-4" />
                            ) : null}
                            {system}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateClient}>Create Client</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-slate-800 bg-transparent backdrop-blur-sm mt-7">
            <CardHeader className="pb-2">
              <CardTitle>Client List</CardTitle>
              <CardDescription>
                All clients with their active systems and agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 border-t">
                      <TableHead>Client</TableHead>
                      <TableHead>Systems</TableHead>
                      <TableHead>Agents</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Client Since
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Subscription
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow
                        key={client.id}
                        onClick={() => navigateToClientDashboard(client.id)}
                        className="cursor-pointer border-b border-slate-800 hover:bg-white/5"
                      >
                        <TableCell className="font-medium">
                          {client.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {client.systems.map((system) => (
                              <Badge
                                key={system}
                                variant="outline"
                                className="cursor-pointer hover:bg-primary/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateToClientSystem(client.id, system);
                                }}
                              >
                                {system}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{client.agents}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {client.createdAt}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {client.subscriptionDuration}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateToClientDashboard(client.id);
                                }}
                              >
                                View Dashboard
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {client.systems.map((system) => (
                                <DropdownMenuItem
                                  key={system}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigateToClientSystem(client.id, system);
                                  }}
                                >
                                  View {system}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => e.stopPropagation()}
                              >
                                Edit Client
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setClients(
                                    clients.filter((c) => c.id !== client.id)
                                  );
                                }}
                                className="text-destructive focus:text-destructive"
                              >
                                Delete Client
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default ClientDashboardPage;
