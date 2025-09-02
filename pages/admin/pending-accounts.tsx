import { useState, useEffect } from "react";
import { NextPage } from "next";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
// ...existing code...
import { Button } from "@/components/ui/button";

interface PendingAccount {
  name: string;
  email: string;
  systems: string[];
  createdAt: string;
}

const PendingAccountsPage: NextPage = () => {
  const [pendingAccounts, setPendingAccounts] = useState<PendingAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch pending accounts on mount
  useEffect(() => {
  const interval: NodeJS.Timeout = setInterval(() => {
    fetchPending();
  }, 5000); // Poll every 5 seconds

    const fetchPending = async () => {
      const res = await fetch("/api/pending-accounts");
      if (res.ok) {
        setPendingAccounts(await res.json());
      }
    };
    fetchPending();
    return () => clearInterval(interval);
  }, []);

  // Automatic creation handler
  const handleCreateClient = async (account: PendingAccount) => {
    setError(null);
    if (!account.name || !account.email || !Array.isArray(account.systems) || account.systems.length === 0) {
      setError("All fields are required, including at least one system.");
      return;
    }
    setLoading(true);
    try {
      const randomPassword = Math.random().toString(36).slice(-12);
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: account.name,
          email: account.email,
          systems: account.systems,
          password: randomPassword, // Send random password for onboarding
        }),
      });
      if (res.ok) {
        // Remove from pending accounts in DB
        await fetch(`/api/pending-accounts?email=${encodeURIComponent(account.email)}`, {
          method: "DELETE",
        });
        setPendingAccounts(prev => prev.filter(a => a.email !== account.email));
      } else {
        const data = await res.json();
        setError(data.error || "Unknown error");
      }
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectAccount = async (account: PendingAccount) => {
    setLoading(true);
    try {
      await fetch(`/api/pending-accounts?email=${encodeURIComponent(account.email)}`, {
        method: "DELETE",
      });
      setPendingAccounts(prev => prev.filter(a => a.email !== account.email));
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout meta={{ title: "Pending Accounts" }}>
      <DashboardHeader title="Pending Accounts" />
      <div className="flex-1 p-4 py-2">
        <Card className="border-none bg-transparent">
            <CardHeader>
                <h2 className="text-lg font-medium">Pending Client Account Requests</h2>
                <p className="text-sm text-muted-foreground">
                Review and create client accounts from pending requests.
                </p>
              </CardHeader>
          <CardContent>
            <div>
              <h3 className="mb-2 font-medium">Pending Client Accounts</h3>
              {error && (
                <div className="text-red-500 mb-4">{error}</div>
              )}
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <span className="animate-spin mr-2 h-5 w-5 border-4 border-blue-400 border-t-transparent rounded-full inline-block"></span>
                  <span>Loading...</span>
                </div>
              ) : pendingAccounts.length === 0 ? (
                <div>No pending accounts.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border rounded text-white">
                    <thead>
                      <tr className="">
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Systems</th>
                        <th className="px-4 py-2 text-left">Submitted</th>
                        <th className="px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingAccounts.map((account, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="px-4 py-2 font-medium">{account.name}</td>
                          <td className="px-4 py-2">{account.email}</td>
                          <td className="px-4 py-2">{account.systems.join(", ")}</td>
                          <td className="px-4 py-2">{account.createdAt}</td>
                          <td className="px-4 py-2 flex gap-2">
                            <Button
                              onClick={() => handleCreateClient(account)}
                              disabled={loading}
                              size="sm"
                            >
                              {loading ? "Creating..." : "Create Client"}
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleRejectAccount(account)}
                              disabled={loading}
                              size="sm"
                              className="bg-red-500 hover:bg-red-600"
                            >
                              {loading ? "Rejecting..." : "Reject"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PendingAccountsPage;
