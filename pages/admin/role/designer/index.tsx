import { NextPage } from "next";
import Head from "next/head";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { AdminPageMeta } from "@/page-meta/meta";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

const DesignerDashboard: NextPage = () => {
  const { isImpersonating, stopImpersonation } = useAuth();
    // Example notifications, stats, and recent activity
    const notifications = [
      { id: 1, message: "New design task assigned.", createdAt: new Date().toISOString() },
      { id: 2, message: "Asset upload approved.", createdAt: new Date().toISOString() },
    ];
    const stats = {
      tasks: 12,
      assets: 34,
      completed: 8,
    };
    const recentActivity = [
      { id: 1, action: "Uploaded logo.png", time: "2 hours ago" },
      { id: 2, action: "Completed banner design", time: "Yesterday" },
    ];
  return (
    <>
      <Head>
        <title>Agentic Flow | Designer Dashboard</title>
        <meta name="description" content="Designer dashboard for Agentic Flow" />
      </Head>
      <DashboardLayout role="designer" meta={AdminPageMeta.graphicsDesignerPage}>
        <div className="mt-4 flex justify-end">
          {isImpersonating ? (
            <button className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-white" onClick={stopImpersonation}>Return to Admin View</button>
          ) : (
            <Link href="/admin" legacyBehavior>
              <a><button className="px-4 py-2 text-sm rounded bg-red-600 hover:bg-red-700 text-white">Return to Admin View</button></a>
            </Link>
          )}
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Designer Dashboard</h2>
          </div>
          <Card className="border bg-transparent ">
            <CardHeader>
              <CardTitle>Welcome to your dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Here you can manage your design tasks, upload graphics and visual assets, and view AI research to guide your creative work. Use the sidebar to navigate to different sections.
              </p>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6">
                  <div><span className="font-bold">{stats.tasks}</span> Tasks</div>
                  <div><span className="font-bold">{stats.assets}</span> Assets</div>
                  <div><span className="font-bold">{stats.completed}</span> Completed</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {notifications.map(n => (
                    <li key={n.id} className="border-b pb-2">
                      <div className="font-medium">{n.message}</div>
                      <div className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recentActivity.map(a => (
                    <li key={a.id} className="border-b pb-2">
                      <div className="font-medium">{a.action}</div>
                      <div className="text-xs text-muted-foreground">{a.time}</div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <Link href="/admin/role/designer/upload" className="text-blue-600 hover:underline">Upload Asset</Link>
                  <Link href="/admin/role/designer/content" className="text-blue-600 hover:underline">Manage Content</Link>
                  <Link href="/admin/role/designer/tasks" className="text-blue-600 hover:underline">View Tasks</Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default DesignerDashboard;
