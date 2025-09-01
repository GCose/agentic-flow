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

  // Fetch pending accounts on mount
  useEffect(() => {
    const fetchPending = async () => {
      const res = await fetch("/api/pending-accounts");
      if (res.ok) {
        setPendingAccounts(await res.json());
      }
    };
    fetchPending();
  }, []);

  // Automatic creation handler
  const handleCreateClient = async (account: PendingAccount) => {
    setLoading(true);
    try {
      // Call your client creation API here
        const res = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: account.name,
            email: account.email,
            systems: account.systems,
            password: "", // Send empty password for onboarding
          }),
        });
      if (res.ok) {
        // Optionally remove from pending list
        setPendingAccounts(prev => prev.filter(a => a.email !== account.email));
      }
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
              {pendingAccounts.length === 0 ? (
                <div>No pending accounts.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border rounded text-white">
                    <thead>
                      <tr className="bg-blue-100">
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
                          <td className="px-4 py-2">
                            <Button
                              onClick={() => handleCreateClient(account)}
                              disabled={loading}
                              size="sm"
                            >
                              {loading ? "Creating..." : "Create Client"}
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
