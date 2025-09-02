import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

interface Notification {
  id: string;
  message: string;
  createdAt: string;
}

export default function AiDeveloperNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, loading: authLoading, isImpersonating, stopImpersonation } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ai_developer")) {
      router.replace("/auth");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    setLoading(true);
    fetch("/api/ai-developer-notifications")
      .then((res) => res.json())
      .then((data) => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout meta={{ title: "AI Developer Notifications" }} role="ai_developer">
      <DashboardHeader title="AI Developer Notifications" />
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
      <div className="flex-1 p-4 py-2">
        <Card className="border-none bg-transparent">
          <CardHeader>
            <h2 className="text-lg font-medium">Notifications</h2>
            <p className="text-sm text-muted-foreground">
              These are notifications relevant to AI Developer operations.
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading...</div>
            ) : notifications.length === 0 ? (
              <div>No notifications found.</div>
            ) : (
              <ul className="space-y-4">
                {notifications.map((n) => (
                  <li key={n.id} className="border-b pb-2">
                    <div className="font-medium">{n.message}</div>
                    <div className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
