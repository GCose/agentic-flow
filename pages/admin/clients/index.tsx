/* eslint-disable @typescript-eslint/no-unused-vars */


import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { PlusCircle, MoreHorizontal, Check, MailCheck, MailWarning, UserCog, UserCheck } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
import { useEffect } from "react";
import { fetchClientsWithSystems } from "@/lib/clients";
import { AdminPageMeta } from "@/page-meta/meta";
import DashboardHeader from "@/components/dashboard/dashboard-header";

const ClientDashboardPage: NextPage = () => {
  const { user, isImpersonating, stopImpersonation, loading: authLoading, impersonateClient } = useAuth();
  const router = useRouter();
  // Guard: Only allow admins or impersonating admins
  useEffect(() => {
    if (!authLoading && user && user.role !== "admin" && !isImpersonating) {
      router.replace("/client");
    }
  }, [user, authLoading, isImpersonating, router]);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'clients' | 'systems'>('clients');
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [navigatingClientId, setNavigatingClientId] = useState<string | null>(null);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  // Onboarding resources component
  // function OnboardingResources() {
  //   return (
  //     <div style={{ background: '#f8fafc', borderRadius: 12, padding: 24, marginBottom: 24 }}>
  //       <h2 style={{ color: '#2563eb', fontSize: 20, marginBottom: 12 }}>Onboarding Resources</h2>
  //       <ul style={{ fontSize: 16 }}>
  //         <li><a href="https://yourdomain.com/docs" target="_blank" rel="noopener" style={{ color: '#2563eb' }}>Documentation</a></li>
  //         <li><a href="https://yourdomain.com/tutorials" target="_blank" rel="noopener" style={{ color: '#2563eb' }}>Video Tutorials</a></li>
  //         <li><a href="https://yourdomain.com/support" target="_blank" rel="noopener" style={{ color: '#2563eb' }}>Support Center</a></li>
  //       </ul>
  //     </div>
  //   );
    // Removed unused 'feedback' variable
  const [pageLoading, setPageLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editingSystemsId, setEditingSystemsId] = useState<string | null>(null);
  const [editingSystems, setEditingSystems] = useState<string[]>([]);
  const [editingSystemsLoading, setEditingSystemsLoading] = useState(false);
  const [resendingEmailId, setResendingEmailId] = useState<string | null>(null);
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
    password: "", // Add password field for optional password input
  });

  const filteredClients = clients
    .filter((client) => client.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      // Sort by createdAt descending (newest first)
      if (!a.createdAt || !b.createdAt) return 0;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  const totalPages = Math.ceil(filteredClients.length / pageSize);

  const paginatedClients = filteredClients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
  setPageLoading(true);
      try {
        const clientsWithSystems = await fetchClientsWithSystems();
        setClients(clientsWithSystems);
      } catch (err) {
  setFeedback({ type: "error", message: "Failed to fetch clients." });
      }
  setPageLoading(false);
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
    setPageLoading(true);
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
        // Get the newly created client
        const newClientData = await res.json();
        // Fetch systems for the new client
        const resDetail = await fetch(`/api/clients/${newClientData.id}`);
        const detail = await resDetail.json();
        const clientWithSystems = {
          ...newClientData,
          systems: (detail.systems || []).map((us: any) => us.system?.name),
        };
        // Prepend new client to the list
        setClients((prev) => [clientWithSystems, ...prev]);
        setIsModalOpen(false);
        setNewClient({ name: "", email: "", systems: [], password: "" });
      }
    } catch (err) {
      setFeedback({ type: "error", message: "Failed to fetch clients." });
    }
    setPageLoading(false);
  };

  // useAuth already destructured at top

  // Only show "Return to Admin View" if impersonating
  return (
    <DashboardLayout meta={AdminPageMeta.clientsDashboardPage}>
      {isImpersonating && user && user.role === "client" && (
        <div className="mt-4 flex justify-end">
          <Button size="sm" variant="destructive" onClick={stopImpersonation}>
            Return to Admin View
          </Button>
        </div>
      )}
      <DashboardHeader title="Clients" role="admin" />
  {/* Removed View Clients and View Systems buttons for cleaner UI */}
      {viewMode === 'clients' ? (
        <div className="flex-1 p-4 py-2 ">
          <Card className="border-none bg-transparent  ">
            <CardHeader className="flex flex-col gap-4 md:flex-row items-center justify-between">
              <h2 className="font-medium">Clients using Agentic Flow</h2>
              <div className="flex gap-4 items-center">
                {selectedClientIds.length > 0 && (
                  <>
                    <Button
                      className="font-bold px-6 py-2 rounded-lg shadow-lg border border-red-700 bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all duration-150"
                      variant="destructive"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete Selected
                    </Button>
                    <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Confirm Bulk Delete</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete <span className="font-bold text-red-600">{selectedClientIds.length}</span> selected client{selectedClientIds.length > 1 ? 's' : ''}? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-6">
                          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                          <Button
                            variant="destructive"
                            className="font-bold px-4"
                            onClick={async () => {
                              await fetch("/api/clients", {
                                method: "DELETE",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ ids: selectedClientIds })
                              });
                              setClients(prev => prev.filter(c => !selectedClientIds.includes(c.id)));
                              setSelectedClientIds([]);
                              setShowDeleteModal(false);
                            }}
                          >
                            Yes, Delete
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
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
              <div className="overflow-x-auto border rounded-xl px-4 pt-2 border-blue-900/70 relative">
                {navigatingClientId && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-r from-blue-900/10 to-blue-900/30 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                      <svg className="animate-spin h-8 w-8 text-blue-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <span className="text-blue-900 font-semibold text-lg">Loading client details...</span>
                    </div>
                  </div>
                )}
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-blue-900/70 hover:bg-transparent">
                      <TableHead>
                        <input
                          type="checkbox"
                          checked={selectedClientIds.length === filteredClients.length && filteredClients.length > 0}
                          onChange={e => {
                            if (e.target.checked) {
                              setSelectedClientIds(filteredClients.map(c => c.id));
                            } else {
                              setSelectedClientIds([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Systems</TableHead>
                      <TableHead className="hidden md:table-cell">Client Since</TableHead>
                      <TableHead className="hidden md:table-cell">Subscriptions</TableHead>
                      <TableHead>Email Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                      </TableRow>
                    ) : filteredClients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center">No clients found.</TableCell>
                      </TableRow>
                    ) : (
                      paginatedClients.map((client) => (
                        <TableRow
                          key={client.id}
                          className="cursor-pointer border-b border-blue-900/70 hover:bg-blue-600/10 hover:rounded-md"
                          onClick={e => {
                            // Only navigate if the click is NOT on a checkbox or its label
                            if (
                              e.target instanceof HTMLElement &&
                              (e.target.tagName === "INPUT" || e.target.tagName === "LABEL")
                            ) {
                              return;
                            }
                            setNavigatingClientId(client.id);
                            setTimeout(() => {
                              router.push(`/admin/clients/${client.id}`);
                            }, 400);
                          }}
                        >
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedClientIds.includes(client.id)}
                              onClick={e => e.stopPropagation()}
                              onChange={e => {
                                setSelectedClientIds(ids =>
                                  e.target.checked
                                    ? [...ids, client.id]
                                    : ids.filter(id => id !== client.id)
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{client.name}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {(client.systems || []).map((system: string) => (
                                <div key={system} className="font-medium p-2 bg-blue-900/10 rounded-md">
                                  {system}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell font-medium">
                            {client.createdAt ? client.createdAt.split("T")[0] : "-"}
                          </TableCell>
                          <TableCell className="hidden md:table-cell font-medium">
                            {Array.isArray(client.systems) && client.systems.length > 0
                              ? client.systems.join(", ")
                              : "-"}
                          </TableCell>
                          <TableCell className="font-medium">
                            {resendingEmailId === client.id && feedback ? (
                              <span className={`flex items-center gap-1 text-sm font-medium ${feedback.type === "success" ? "text-green-600" : "text-red-600"}`}>
                                {feedback.type === "success" ? <MailCheck className="w-4 h-4" /> : <MailWarning className="w-4 h-4" />}
                                {feedback.message}
                              </span>
                            ) : client.emailStatus === 'sent' ? (
                              <span className="flex items-center gap-1 text-green-700">
                                <MailCheck className="w-4 h-4" />
                                Welcome email sent
                              </span>
                            ) : client.emailStatus && client.emailStatus.startsWith('failed') ? (
                              <span className="flex items-center gap-1 text-red-600">
                                <MailWarning className="w-4 h-4" />
                                Failed to send welcome email
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <MailCheck className="w-4 h-4 opacity-40" />
                                No welcome email sent
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right flex gap-2 items-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async (e) => {
                                e.stopPropagation();
                                setEditingSystemsId(client.id);
                                setEditingSystems(client.systems || []);
                                setViewMode('systems');
                                setSelectedClient(client);
                                setEditingSystemsLoading(true);
                                setTimeout(() => setEditingSystemsLoading(false), 500);
                              }}
                            >
                              <UserCog className="w-4 h-4 mr-1" /> Edit Systems
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={async (e) => {
                                e.stopPropagation();
                                setNavigatingClientId(client.id);
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                impersonateClient(client);
                                setNavigatingClientId(null);
                              }}
                            >
                              <UserCheck className="w-4 h-4 mr-1" /> Impersonate
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              disabled={resendingEmailId === client.id}
                              onClick={async (e) => {
                                e.stopPropagation();
                                setResendingEmailId(client.id);
                                setFeedback(null);
                                try {
                                  const res = await fetch(`/api/clients/resend-welcome`, {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ clientId: client.id })
                                  });
                                  if (res.ok) {
                                    setFeedback({ type: "success", message: `Email sent to ${client.email}` });
                                  } else {
                                    setFeedback({ type: "error", message: `Failed to send email to ${client.email}` });
                                  }
                                } catch {
                                  setFeedback({ type: "error", message: `Failed to send email to ${client.email}` });
                                }
                                setTimeout(() => setResendingEmailId(null), 2000);
                              }}
                            >
                              <MailCheck className="w-4 h-4 mr-1" />
                              {resendingEmailId === client.id ? "Sending..." : "Resend Email"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <span className="m-4 text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span> 
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex-1 p-4 py-2">
          <Card className="border-none bg-transparent">
            <CardHeader>
              <h2 className="font-medium flex items-center gap-2">
                <UserCog className="w-5 h-5" /> Systems for {selectedClient?.name}
              </h2>
              <Button variant="outline" onClick={() => setViewMode('clients')}>Back to Clients</Button>
            </CardHeader>
            <CardContent>
              {selectedClient ? (
                <div className="space-y-4">
                  <div>
                    <strong>Email:</strong> {selectedClient.email}
                  </div>
                  <div>
                    <strong>Systems:</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {availableSystems.length > 0 ? (
                        availableSystems.map((system) => (
                          <Button
                            key={system}
                            type="button"
                            variant={editingSystems.includes(system) ? "default" : "outline"}
                            size="sm"
                            className="min-w-[100px] justify-start"
                            disabled={editingSystemsLoading}
                            onClick={() => {
                              setEditingSystems((prev) => {
                                const exists = prev.includes(system);
                                return exists
                                  ? prev.filter((s) => s !== system)
                                  : [...prev, system];
                              });
                            }}
                          >
                            {editingSystems.includes(system) ? <Check className="mr-2 h-4 w-4" /> : null}
                            {system}
                          </Button>
                        ))
                      ) : (
                        <span className="text-muted-foreground">No systems available.</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <strong>Created At:</strong> {selectedClient.createdAt ? selectedClient.createdAt.split("T")[0] : "-"}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="default"
                      size="sm"
                      disabled={editingSystemsLoading}
                      onClick={async () => {
                        setEditingSystemsLoading(true);
                        setFeedback(null);
                        try {
                          await fetch(`/api/clients/${selectedClient.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ systems: editingSystems }),
                          });
                          setClients((prev) =>
                            prev.map((c) =>
                              c.id === selectedClient.id
                                ? { ...c, systems: [...editingSystems] }
                                : c
                            )
                          );
                          setFeedback({ type: "success", message: "Systems saved successfully!" });
                        } catch {
                          setFeedback({ type: "error", message: "Failed to save systems." });
                        } finally {
                          setTimeout(() => setEditingSystemsLoading(false), 800);
                        }
                      }}
                    >
                      {editingSystemsLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Check className="mr-2 h-4 w-4" /> Save Systems
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingSystems(selectedClient.systems || []);
                      }}
                    >
                      Reset
                    </Button>
                    {feedback && (
                      <span className={`ml-4 font-medium text-sm ${feedback.type === "success" ? "text-green-600" : "text-red-600"}`}>
                        {feedback.message}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div>No client selected.</div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ClientDashboardPage;
