import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { useRouter } from "next/router";

interface Client {
  id: string;
  name: string;
  email: string;
}

export default function GHLAdminPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { user, loading: authLoading, isImpersonating, stopImpersonation } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ghl_admin")) {
      router.replace("/auth");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    setLoading(true);
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout meta={{ title: "GHL Admin" }} role="ghl_admin">
      <DashboardHeader title="GHL Admin - Client IDs" />
      <div className="mt-4 flex justify-end">
        {isImpersonating ? (
          <Button size="sm" variant="destructive" onClick={stopImpersonation}>
            Return to Admin View
          </Button>
        ) : (
          <Link href="/admin" legacyBehavior>
            <a><button className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-white">Return to Admin View</button></a>
          </Link>
        )}
      </div>
      <div className="flex-1 p-4 py-2">
        <Card className="border-none bg-transparent">
          <CardHeader>
            <h2 className="text-lg font-medium">Client IDs for Go High Level</h2>
            <p className="text-sm text-muted-foreground">
              Copy the client ID below and add it to your GHL forms.
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <table className="min-w-full border rounded text-white">
                <thead>
                  <tr className="">
                    <th className="px-4 py-2 text-left">Client Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Client ID</th>
                    <th className="px-4 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b">
                      <td className="px-4 py-2 font-medium">{client.name}</td>
                      <td className="px-4 py-2">{client.email}</td>
                      <td className="px-4 py-2">{client.id}</td>
                      <td className="px-4 py-2">
                        <Button
                          size="sm"
                          onClick={async () => {
                            await navigator.clipboard.writeText(client.id);
                            setCopiedId(client.id);
                            setTimeout(() => setCopiedId(null), 1500);
                          }}
                        >
                          {copiedId === client.id ? "Copied!" : "Copy ID"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
