import DashboardLayout from "@/components/dashboard/dashboard-layout";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import FileUpload from "@/components/upload/file-upload";
import { NextPage } from "next";
import Head from "next/head";
import VideographerHeader from "./videographer-header";
import { AdminPageMeta } from "@/page-meta/meta";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
const UploadVideosPage: NextPage = () => {
  const { isImpersonating, stopImpersonation } = useAuth();
    // Example notifications, stats, and recent activity
    const notifications = [
      { id: 1, message: "New video task assigned.", createdAt: new Date().toISOString() },
      { id: 2, message: "Video upload approved.", createdAt: new Date().toISOString() },
    ];
    const stats = {
      tasks: 7,
      assets: 19,
      completed: 5,
    };
    const recentActivity = [
      { id: 1, action: "Uploaded intro.mp4", time: "1 hour ago" },
      { id: 2, action: "Completed editing", time: "Yesterday" },
    ];
  return (
    <>
      <Head>
        <title>Agentic Flow | Upload Videos</title>
        <meta name="description" content="Upload videos for Agentic Flow" />
      </Head>
        <DashboardLayout role="videographer" meta={AdminPageMeta.videographerUploadPage}>
          <VideographerHeader />
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
                    <Link href="/admin/role/videographer/upload" className="text-blue-600 hover:underline">Upload Video</Link>
                    <Link href="/admin/role/videographer/content" className="text-blue-600 hover:underline">Manage Content</Link>
                    <Link href="/admin/role/videographer/tasks" className="text-blue-600 hover:underline">View Tasks</Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Upload Videos</h2>
          </div>

          <FileUpload
            maxFiles={3}
            maxSize={104857600} // 100MB
            title="Upload Video Content"
            acceptedFileTypes={["video/*"]}
            description="Upload video files for content creation"
          />
        </div>
      </DashboardLayout>
    </>
  );
};

export default UploadVideosPage;
