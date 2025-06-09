import { useState } from "react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { PlusCircle, MoreHorizontal, Check } from "lucide-react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { initialClients } from "@/mock/clients-data";
import { Client } from "@/types/clients";
import { AdminPageMeta } from "@/page-config/meta.config";
import DashboardHeader from "@/components/dashboard/dashboard-header";

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
    <DashboardLayout meta={AdminPageMeta.clientsDashboardPage}>
      <DashboardHeader title="Clients" />

      {/*==================== Client Content ====================*/}
      <div className="flex-1 p-4 py-2">
        <Card className="border-none bg-transparent ">
          <CardHeader className="flex flex-col gap-4 md:flex-row items-center justify-between">
            <Input
              value={searchTerm}
              placeholder="Search clients..."
              className="w-full md:w-64 border-slate-800"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto border rounded-xl px-4 pt-2 border-slate-800">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-800 hover:bg-transparent">
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
                      className="cursor-pointer border-b border-slate-800 hover:bg-white/3 hover:rounded-md"
                    >
                      <TableCell className="font-medium">
                        {client.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {client.systems.map((system) => (
                            <div key={system} className="font-medium p-2">
                              {system}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-medium">
                        {client.createdAt}
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-medium">
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
                            <DropdownMenuLabel>Systems</DropdownMenuLabel>
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
      {/*==================== End of Client Content ====================*/}
    </DashboardLayout>
  );
};

export default ClientDashboardPage;
