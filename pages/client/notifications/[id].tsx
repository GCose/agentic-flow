import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { useAuth } from "@/contexts/auth-context";

const NotificationDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [notification, setNotification] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !user?.id) return;
    async function fetchNotification() {
      setLoading(true);
      const res = await fetch(`/api/client/notifications/${id}`, {
        headers: { "x-user-id": user?.id ?? "" }
      });
      const data = await res.json();
      setNotification(data.notification || null);
      setLoading(false);
    }
    fetchNotification();
  }, [id, user?.id]);

  return (
    <DashboardLayout role="client" meta={{ title: "Notification Details", description: "View notification details" }}>
      <DashboardHeader role="client" title="Notification Details" hasBackButton={true} />
      <div className="flex flex-1 h-full py-8">
        <div className="max-w-2xl mx-auto w-full">
          <Card className="border-none bg-blue-900/80 shadow-xl rounded-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white font-bold">Notification Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {loading ? (
                <div className="text-blue-200">Loading...</div>
              ) : !notification ? (
                <div className="text-blue-200">Notification not found.</div>
              ) : (
                <>
                  <div className="font-bold text-lg">{notification.title}</div>
                  <div className="text-white text-base whitespace-pre-line mb-2">{notification.message}</div>
                  <div className="text-xs text-blue-200">Type: {notification.sendType} | Group: {notification.targetGroup}</div>
                  <div className="text-xs text-blue-200">Status: {notification.status} | Created: {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ""}</div>
                  {notification.attachment && (
                    <div className="mt-2 text-blue-200">
                      Attachment: <a href={notification.attachment} target="_blank" rel="noopener noreferrer" className="underline">Download</a>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationDetailPage;
