
import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BarChart3, Users, FileText, Search } from "lucide-react";

type KnowledgeMap = { [system: string]: string };
type Client = {
  id: string;
  name: string;
  email: string;
  systems: string[];
  knowledge: KnowledgeMap;
};

function EditableKnowledge({ value, onSave, onDelete, isDeleting }: {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(value);
  const [saving, setSaving] = useState(false);
  return (
    <div className="mb-4">
      <h3 className="font-semibold">Knowledge Base</h3>
      {editing ? (
        <div>
          <textarea
            className="w-full border rounded p-2 mb-2"
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={3}
          />
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded mr-2"
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              await onSave(input);
              setSaving(false);
              setEditing(false);
            }}
          >Save</button>
          <button
            className="px-3 py-1 bg-gray-300 rounded mr-2"
            disabled={saving}
            onClick={() => { setEditing(false); setInput(value); }}
          >Cancel</button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded"
            disabled={saving || isDeleting}
            onClick={async () => {
              setSaving(true);
              await onDelete();
              setSaving(false);
              setEditing(false);
            }}
          >{isDeleting ? "Deleting..." : "Delete"}</button>
        </div>
      ) : (
        <div>
          <p className="mb-2 whitespace-pre-line">{value}</p>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded mr-2"
            onClick={() => setEditing(true)}
          >Edit</button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded"
            disabled={isDeleting}
            onClick={async () => {
              setSaving(true);
              await onDelete();
              setSaving(false);
            }}
          >{isDeleting ? "Deleting..." : "Delete"}</button>
        </div>
      )}
    </div>
  );
}

const AiDeveloperPage = () => {
  const { user, loading: authLoading, isImpersonating, stopImpersonation } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!authLoading && user && user.role !== "ai_developer") {
      router.replace("/");
    }
  }, [user, authLoading, router]);
  useEffect(() => {
    async function fetchClients() {
      setLoadingClients(true);
      const res = await fetch("/api/ai-developer/clients");
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      }
      setLoadingClients(false);
    }
    fetchClients();
  }, []);

  // Dashboard stats
  const totalClients = clients.length;
  const totalSystems = useMemo(() => new Set(clients.flatMap(c => c.systems)).size, [clients]);
  const totalKnowledgeEntries = useMemo(() => clients.reduce((acc, c) => acc + Object.keys(c.knowledge).length, 0), [clients]);

  // Recent activity (last 5 knowledge edits)
  const recentEdits = useMemo(() => {
    let edits: { client: string; system: string; updated: string }[] = [];
    clients.forEach(c => {
      Object.entries(c.knowledge).forEach(([system, value]) => {
        // Assume value contains a lastUpdated ISO string at the end, e.g. "...\n\nLast updated: 2025-09-02T12:34:56Z"
        const match = value.match(/Last updated: ([^\n]+)/);
        if (match) {
          edits.push({ client: c.name, system, updated: match[1] });
        }
      });
    });
    return edits.sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime()).slice(0, 5);
  }, [clients]);

  // Search/filter clients/systems
  const filteredClients = useMemo(() => {
    if (!search.trim()) return clients;
    const s = search.toLowerCase();
    return clients.filter(c =>
      c.name.toLowerCase().includes(s) ||
      c.systems.some(sys => sys.toLowerCase().includes(s))
    );
  }, [clients, search]);

  let mainContent;
  if (authLoading || !user) {
    mainContent = (
      <div className="flex items-center justify-center h-full p-8">
        <span className="text-lg text-muted-foreground">Loading...</span>
      </div>
    );
  } else if (user.role !== "ai_developer") {
    mainContent = (
      <div className="flex items-center justify-center h-full p-8">
        <span className="text-lg text-red-500">Unauthorized</span>
      </div>
    );
  } else {
    mainContent = (
      <div className="flex flex-col gap-8 p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-900 to-blue-700 text-white shadow-lg">
            <CardHeader className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              <span className="text-lg font-semibold">Clients</span>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">{totalClients}</span>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-indigo-900 to-indigo-700 text-white shadow-lg">
            <CardHeader className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-lg font-semibold">Systems</span>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">{totalSystems}</span>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-700 to-indigo-700 text-white shadow-lg">
            <CardHeader className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-lg font-semibold">Knowledge Entries</span>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">{totalKnowledgeEntries}</span>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow">
          <CardHeader>
            <span className="text-lg font-semibold">Recent Knowledge Edits</span>
          </CardHeader>
          <CardContent>
            {recentEdits.length === 0 ? (
              <div className="text-muted-foreground">No recent edits found.</div>
            ) : (
              <ul className="space-y-2">
                {recentEdits.map((edit, idx) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span>{edit.client} - {edit.system}</span>
                    <span className="text-xs text-muted-foreground">{new Date(edit.updated).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Search/Filter */}
        <div className="flex items-center gap-2 mb-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search clients or systems..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Client Knowledge Base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loadingClients ? (
            <div>Loading clients...</div>
          ) : filteredClients.length === 0 ? (
            <div>No clients found.</div>
          ) : (
            filteredClients.map((client) => (
              <Card key={client.id} className="shadow">
                <CardHeader>
                  <h2 className="text-xl font-bold">{client.name}</h2>
                  <div className="text-sm text-muted-foreground">Subscribed Systems: {client.systems.join(", ")}</div>
                </CardHeader>
                <CardContent>
                  {client.systems.map((system) => (
                    <div key={system} className="mb-4">
                      <EditableKnowledge
                        key={system}
                        value={client.knowledge[system]}
                        onSave={async (newValue) => {
                          await fetch("/api/ai-developer/knowledge", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userId: client.id, systemId: system, data: newValue })
                          });
                          setClients((prev) => prev.map(c =>
                            c.id === client.id
                              ? { ...c, knowledge: { ...c.knowledge, [system]: newValue } }
                              : c
                          ));
                        }}
                        onDelete={async () => {
                          await fetch("/api/ai-developer/knowledge", {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userId: client.id, systemId: system })
                          });
                          setClients((prev) => prev.map(c =>
                            c.id === client.id
                              ? { ...c, knowledge: Object.fromEntries(Object.entries(c.knowledge).filter(([k]) => k !== system)) }
                              : c
                          ));
                        }}
                        isDeleting={false}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout meta={{ title: "AI Developer Dashboard" }} role="ai_developer">
      <DashboardHeader title="AI Developer Dashboard" />
      <div className="mt-4 flex justify-end">
        {isImpersonating ? (
          <Button size="sm" variant="destructive" onClick={stopImpersonation}>
            Return to Admin View
          </Button>
        ) : (
          <a href="/admin">
            <button className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-white">Return to Admin View</button>
          </a>
        )}
      </div>
      {mainContent}
    </DashboardLayout>
  );
};

export default AiDeveloperPage;
