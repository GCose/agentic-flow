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
import ClientDashboardHeader from "@/components/clients/clients-header";
import { initialClients } from "@/mock/clients-data";
import { Client } from "@/types/clients";

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
    router.push(`/admin/clients/${clientId}`);
  };

  const navigateToClientSystem = (clientId: string, system: string) => {
    // If Content, go to that page with the clientId
    if (system === "Content") {
      router.push(`/admin/content-system/clientId=${clientId}`);
    } else {
      // For other systems, use a slug format
      const systemSlug = system.toLowerCase().replace(/\s+/g, "-");
      router.push(`/admin/clients/${clientId}/${systemSlug}`);
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
                      {["Content", "LeadGen", "Sales", "Onboarding"].map(
                        (system) => (
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
                        )
                      )}
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
                        className="cursor-pointer border-none hover:bg-white/5 hover:rounded-md"
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
