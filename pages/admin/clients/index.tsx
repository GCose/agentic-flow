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
import { useEffect } from "react";
import { AdminPageMeta } from "@/page-meta/meta";
import DashboardHeader from "@/components/dashboard/dashboard-header";

const ClientDashboardPage: NextPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSystemsId, setEditingSystemsId] = useState<string | null>(null);
  const [editingSystems, setEditingSystems] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableSystems, setAvailableSystems] = useState<string[]>([]);

  type NewClientType = {
    name: string;
    email: string;
    systems: string[];
    password: string;
  };

  const [newClient, setNewClient] = useState<NewClientType>({
    name: "",
    email: "",
    systems: [],
    password: "", // Add password field
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
      router.push(`/admin/content-system/clientId${clientId}`);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch clients from API
  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      const res = await fetch("/api/clients");
      const data = await res.json();
      // For each client, fetch their systems
      const clientsWithSystems = await Promise.all(
        data.map(async (client: any) => {
          const res = await fetch(`/api/clients/${client.id}`);
          const detail = await res.json();
          return {
            ...client,
            systems: (detail.systems || []).map((us: any) => us.system?.name),
          };
        })
      );
      setClients(clientsWithSystems);
      setLoading(false);
    };
    fetchClients();
  }, []);

  // Fetch available systems from backend for dynamic system selection
  useEffect(() => {
    // Fetch available systems from backend
    const fetchSystems = async () => {
      const res = await fetch("/api/systems");
      const data = await res.json();
      setAvailableSystems(data.map((sys: any) => sys.name));
    };
    fetchSystems();
  }, []);

  // Create new client via API
  const handleCreateClient = async () => {
    if (!newClient.name || !newClient.email) return;
    setLoading(true);
    try {
      const passwordToSend = newClient.password || "defaultPassword123";
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newClient.name,
          email: newClient.email,
          systems: newClient.systems,
          password: passwordToSend,
        }),
      });
      if (res.ok) {
        // Refresh client list
        const updated = await fetch("/api/clients");
        const data = await updated.json();
        // Fetch systems for each client
        const clientsWithSystems = await Promise.all(
          data.map(async (client: any) => {
            const res = await fetch(`/api/clients/${client.id}`);
            const detail = await res.json();
            return {
              ...client,
              systems: (detail.systems || []).map((us: any) => us.system?.name),
            };
          })
        );
        setClients(clientsWithSystems);
        setIsModalOpen(false);
        setNewClient({ name: "", email: "", systems: [], password: "" });
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <DashboardLayout meta={AdminPageMeta.clientsDashboardPage}>
      <DashboardHeader title="Clients" />

      {/*==================== Client Content ====================*/}
      <div className="flex-1 p-4 py-2 ">
        <Card className="border-none bg-transparent  ">
          <CardHeader className="flex flex-col gap-4 md:flex-row items-center justify-between">
            <h2 className="font-medium">Clients using Agentic Flow</h2>
            <div className="flex gap-4">
              <Input
                value={searchTerm}
                placeholder="Search clients..."
                className="w-full md:w-64 border-blue-900/70"
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
                      Add a new client to Agentic Flow. Fill in the details
                      below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Client Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter client name"
                        value={newClient.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Client Email</Label>
                      <Input
                        id="email"
                        name="email"
                        placeholder="Enter client email"
                        value={newClient.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password (leave blank for default)"
                        value={newClient.password}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Systems</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableSystems.length > 0 ? (
                          availableSystems.map((system) => (
                            <div key={system} className="flex items-center space-x-2">
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
                          ))
                        ) : (
                          <div className="text-muted-foreground col-span-2">
                            No systems available. Please add systems in backend.
                          </div>
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
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto border rounded-xl px-4 pt-2 border-blue-900/70">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-blue-900/70 hover:bg-transparent">
                    <TableHead>Client</TableHead>
                    <TableHead>Systems</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Client Since
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Subscriptions
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                    </TableRow>
                  ) : filteredClients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No clients found.</TableCell>
                    </TableRow>
                  ) : (
                    filteredClients.map((client) => (
                      <TableRow
                        key={client.id}
                        onClick={() => navigateToClientDashboard(client.id)}
                        className="cursor-pointer border-b border-blue-900/70 hover:bg-blue-600/10 hover:rounded-md"
                      >
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(client.systems || []).map((system: string) => (
                              <div key={system} className="font-medium p-2 bg-blue-900/10 rounded-md">
                                {system}
                              </div>
                            ))}
                            <Button
                              size="sm"
                              variant="outline"
                              className="ml-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingSystemsId(client.id);
                                setEditingSystems(client.systems || []);
                              }}
                            >
                              Edit
                            </Button>
                          </div>
                          {/* Edit Systems Modal */}
                          {editingSystemsId === client.id && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-950/80 backdrop-blur-sm">
                              <div className="bg-gradient-to-br from-blue-900/90 to-blue-950/95 border border-blue-900/40 rounded-2xl shadow-2xl p-8 w-full max-w-md text-white">
                                <h3 className="text-xl font-bold mb-3 text-purple-400">Edit Client Systems</h3>
                                <div className="mb-6">
                                  {availableSystems.map((system) => (
                                    <Button
                                      key={system}
                                      variant={editingSystems.includes(system) ? 'default' : 'outline'}
                                      size="sm"
                                      className="mr-2 mb-2"
                                      onClick={() => {
                                        setEditingSystems((prev) =>
                                          prev.includes(system)
                                            ? prev.filter((s) => s !== system)
                                            : [...prev, system]
                                        );
                                      }}
                                    >
                                      {editingSystems.includes(system) ? <Check className="mr-2 h-4 w-4" /> : null}
                                      {system}
                                    </Button>
                                  ))}
                                </div>
                                <div className="flex justify-end gap-3">
                                  <Button variant="outline" onClick={() => setEditingSystemsId(null)}>
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="default"
                                    onClick={async () => {
                                      await fetch(`/api/clients/${editingSystemsId}`, {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ systems: editingSystems })
                                      });
                                      // Refresh client list
                                      const res = await fetch("/api/clients");
                                      const data = await res.json();
                                      const clientsWithSystems = await Promise.all(
                                        data.map(async (client: any) => {
                                          const res = await fetch(`/api/clients/${client.id}`);
                                          const detail = await res.json();
                                          return {
                                            ...client,
                                            systems: (detail.systems || []).map((us: any) => us.system?.name),
                                          };
                                        })
                                      );
                                      setClients(clientsWithSystems);
                                      setEditingSystemsId(null);
                                    }}
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell font-medium">
                          {client.createdAt ? client.createdAt.split("T")[0] : "-"}
                        </TableCell>
                        <TableCell className="hidden md:table-cell font-medium">
                          {Array.isArray(client.systems) && client.systems.length > 0
                            ? client.systems.join(", ")
                            : "-"}
                        </TableCell>
                          {/* <TableCell className="hidden md:table-cell font-medium">
                            {client.subscriptionDuration || "-"}
                          </TableCell> */}
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Systems</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {(client.systems || []).map((system: string) => (
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
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  // Delete client via API
                                  await fetch(`/api/clients/${client.id}`, { method: "DELETE" });
                                  // Refresh client list
                                  const updated = await fetch("/api/clients");
                                  setClients(await updated.json());
                                }}
                                className="text-destructive focus:text-destructive"
                              >
                                Delete Client
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
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
