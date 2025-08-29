import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";

const ClientNotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      try {
        const res = await fetch("/api/client/notifications", {
          headers: { "x-user-id": user?.id || "" }
        });
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        setNotifications([]);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) fetchNotifications();
    else {
      setNotifications([]);
      setLoading(false);
    }
  }, [user?.id]);

  return (
    <DashboardLayout role="client" meta={{ title: "Notifications", description: "Your in-app notifications" }}>
      <DashboardHeader role="client" title="Notifications" hasBackButton={true} />
      <div className="flex flex-col min-h-[calc(100vh-4rem)] w-full px-0">
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto py-8 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24">
          <h1 className="text-3xl font-bold text-blue-900 mb-4">Your Notifications</h1>
          {loading ? (
            <div className="text-blue-400 text-lg">Loading notifications...</div>
          ) : (
            notifications.length === 0 ? (
              <div className="text-blue-400 text-lg">No notifications found.</div>
            ) : (
              <div className="grid grid-cols-1 gap-4 w-full">
                {notifications.map((notif) => (
                  <Link key={notif.id} href={`/client/notifications/${notif.id}`} className="block">
                    <div className="w-full bg-blue-900/80 rounded-xl p-6 text-white border border-blue-800 shadow-lg hover:bg-blue-800/90 transition">
                      <div className="font-bold text-xl mb-1">{notif.title}</div>
                      <div className="text-base mb-2">{notif.message.slice(0, 120)}{notif.message.length > 120 ? "..." : ""}</div>
                      <div className="text-xs text-blue-200">{notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ""}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientNotificationsPage;
