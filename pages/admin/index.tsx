import DashboardHeader from "@/components/dashboard/dashboard-header";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { AdminPageMeta } from "@/page-meta/meta";
import DashboardStatCard from "@/components/cards/dashboard-stats-card";
import { adminDashboardStats } from "@/data/stats-card-data";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/router";

const DashboardPage = () => {
  // Mock pending approvals
  const pendingApprovals = [
    { id: 1, name: "Jane Doe", email: "jane@example.com", systems: ["Content", "LeadGen"], requested: "2 hours ago" },
    { id: 2, name: "John Smith", email: "john@example.com", systems: ["Sales"], requested: "1 hour ago" },
  ];

  // Mock system health
  const systemHealth = {
    apiStatus: "Online",
    uptime: "99.99%",
    lastError: "2025-09-02 14:23",
  };

  // Mock notifications
  const notifications = [
    { id: 1, message: "System update completed successfully.", time: "10 minutes ago" },
    { id: 2, message: "New client account pending approval.", time: "1 hour ago" },
    { id: 3, message: "API error resolved.", time: "Yesterday" },
  ];

  // Mock quick actions
  const quickActions = [
    { id: 1, label: "Approve All Pending", onClick: () => alert("Approved all pending accounts!") },
    { id: 2, label: "Send Notification", onClick: () => alert("Notification sent!") },
    { id: 3, label: "View System Logs", onClick: () => alert("Viewing system logs!") },
  ];

  // Mock top performing agents
  const topAgents = [
    { id: "1", name: "Topic Selector Agent", successRate: 97.8, clients: 156 },
    { id: "4", name: "Content Creator Agent", successRate: 96.2, clients: 168 },
    { id: "2", name: "Trend Researcher Agent", successRate: 94.3, clients: 142 },
  ];

  // Mock top performing clients
  const topClients = [
    { id: "client-1", name: "Nextgen Agency", agents: 24, systems: ["Content", "LeadGen", "Sales", "Onboarding"] },
    { id: "client-2", name: "Aftermath Marketing", agents: 18, systems: ["Content", "LeadGen", "Sales"] },
    { id: "client-3", name: "Group26Consult", agents: 15, systems: ["Content", "LeadGen", "Onboarding"] },
  ];
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user?.role === "ghl_admin") {
      router.replace("/ghl");
    } else if (!authLoading && (!user || user.role !== "admin")) {
      router.replace("/auth");
    }
  }, [user, authLoading, router]);
  if (user?.role === "ghl_admin") return null;


  return (
    <DashboardLayout meta={AdminPageMeta.dashboardPage}>
      <DashboardHeader title="Overview" />
      <div className="flex-1 p-8 pt-6 ">
        {/*==================== Stats Overview ====================*/}
        <div className="mb-10">
          <DashboardStatCard stats={adminDashboardStats} />
        </div>
        {/*==================== End of Stats Overview ====================*/}

        {/*==================== Pending Approvals ====================*/}
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Pending Approvals</h2>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {pendingApprovals.map((account) => (
                <li key={account.id} className="py-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg">{account.name}</div>
                    <div className="text-sm text-gray-500">{account.email} &mdash; {account.systems.join(", ")}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-400">Requested {account.requested}</span>
                    <button className="px-3 py-1 rounded bg-green-600 text-white text-xs" onClick={() => alert(`Approved ${account.name}`)}>Approve</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/*==================== System Health ====================*/}
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-6">System Health</h2>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col gap-2">
            <div><span className="font-semibold">API Status:</span> <span className="text-green-600">{systemHealth.apiStatus}</span></div>
            <div><span className="font-semibold">Uptime:</span> {systemHealth.uptime}</div>
            <div><span className="font-semibold">Last Error:</span> {systemHealth.lastError}</div>
          </div>
        </div>

        {/*==================== Notifications ====================*/}
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Notifications</h2>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {notifications.map((note) => (
                <li key={note.id} className="py-4 flex items-center justify-between">
                  <div className="font-semibold">{note.message}</div>
                  <span className="text-xs text-gray-400">{note.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/*==================== Quick Actions ====================*/}
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Quick Actions</h2>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex gap-4">
            {quickActions.map((action) => (
              <button key={action.id} className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium" onClick={action.onClick}>{action.label}</button>
            ))}
          </div>
        </div>

        {/*==================== Top Performing Agents ====================*/}
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Top Performing Agents</h2>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {topAgents.map((agent) => (
                <li key={agent.id} className="py-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg">{agent.name}</div>
                    <div className="text-sm text-gray-500">Success Rate: {agent.successRate}% &mdash; Clients: {agent.clients}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/*==================== Top Performing Clients ====================*/}
        <div className="mb-10">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Top Performing Clients</h2>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {topClients.map((client) => (
                <li key={client.id} className="py-4 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-lg">{client.name}</div>
                    <div className="text-sm text-gray-500">Agents: {client.agents} &mdash; Systems: {client.systems.join(", ")}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
