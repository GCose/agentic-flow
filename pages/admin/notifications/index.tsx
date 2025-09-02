import React, { useState } from "react";
import { User, Users, Shield, Bell, CheckCircle, AlertCircle, Send, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import DashboardHeader from "@/components/dashboard/dashboard-header";

const AdminNotificationsPage = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [sendType, setSendType] = useState("both"); // "email", "in-app", "both"
  const [showConfirm, setShowConfirm] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [targetGroup, setTargetGroup] = useState("all"); // "all", "clients", "admins"
  const [targetClients, setTargetClients] = useState<string[]>([]);
  const [clientOptions, setClientOptions] = useState<any[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [mandatory, setMandatory] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [, setSchedule] = useState("");
  const [showPreview, setShowPreview] = useState(false);


  const handleSendNotification = async () => {
    setIsSending(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, message, sendType, targetGroup, targetClients, mandatory }),
      });
      const result = await res.json();
      if (res.ok) {
        setFeedback({ type: "success", message: result.message || "Notification sent successfully." });
        setTitle("");
        setMessage("");
        setSchedule("");
        setTargetClients([]);
        setMandatory(false);
        // Add to recent notifications
        setRecentNotifications((prev) => [
          { title, message, sendType, targetGroup, mandatory, date: new Date().toLocaleString() },
          ...prev.slice(0, 4)
        ]);
      } else {
        setFeedback({ type: "error", message: result.error || "Failed to send notification." });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.message || "Send failed." });
    }
    setIsSending(false);
    setShowConfirm(false);
  };

  React.useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch("/api/clients");
        const data = await res.json();
        setClientOptions(data);
      } catch {}
    }
    fetchClients();
  }, []);
  return (
    <DashboardLayout role="admin" meta={{ title: "Admin Notifications", description: "Send custom notifications to users" }}>
      <DashboardHeader role="admin" title="Send Notifications" hasBackButton={true} />
      <div className="flex flex-1 h-full py-8 ">
        <div className="w-full px-4 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Notification Composer */}
          <Card className="border-none bg-blue-900/80 shadow-xl rounded-xl col-span-1">
            <CardHeader>
              <CardTitle className="text-2xl text-white font-bold flex items-center gap-2"><Bell className="w-6 h-6" /> Send Custom Notification</CardTitle>
              <p className="text-slate-200">Write and send a custom notification to users who have notifications enabled.</p>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div className="space-y-2">
                <Label htmlFor="notif-title" className="text-white font-semibold">Title</Label>
                <Input
                  id="notif-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-blue-950/60 border-blue-800 text-white placeholder:text-blue-200"
                  placeholder="Notification title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notif-message" className="text-white font-semibold">Message</Label>
                <textarea
                  id="notif-message"
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                  className="bg-blue-950/60 border-blue-800 text-white placeholder:text-blue-200 min-h-[100px] w-full rounded px-3 py-2 resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-700"
                  placeholder="Notification message"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white font-semibold">Target Group</Label>
                <div className="flex gap-4 mb-2">
                  <label className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${targetGroup === "all" ? "bg-blue-800/60" : "hover:bg-blue-800/30"}`}>
                    <Users className="w-4 h-4" />
                    <input type="radio" name="targetGroup" value="all" checked={targetGroup === "all"} onChange={() => setTargetGroup("all")} />
                    <span>All Users</span>
                  </label>
                  <label className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${targetGroup === "clients" ? "bg-blue-800/60" : "hover:bg-blue-800/30"}`}>
                    <User className="w-4 h-4" />
                    <input type="radio" name="targetGroup" value="clients" checked={targetGroup === "clients"} onChange={() => setTargetGroup("clients")} />
                    <span>Clients</span>
                  </label>
                  <label className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${targetGroup === "admins" ? "bg-blue-800/60" : "hover:bg-blue-800/30"}`}>
                    <Shield className="w-4 h-4" />
                    <input type="radio" name="targetGroup" value="admins" checked={targetGroup === "admins"} onChange={() => setTargetGroup("admins")} />
                    <span>Admins</span>
                  </label>
                </div>
                {targetGroup === "clients" && (
                  <div className="mt-6 mb-4 p-4 rounded-xl bg-blue-950/40 border border-blue-800 shadow">
                    <Label className="text-white font-semibold text-lg mb-2 block">Target Specific Clients</Label>
                    <Input
                      type="text"
                      value={clientSearch}
                      onChange={e => setClientSearch(e.target.value)}
                      placeholder="Search clients by name or email..."
                      className="mb-3 bg-blue-950/60 border-blue-800 text-white placeholder:text-blue-200"
                    />
                    <div className="bg-blue-950/60 border border-blue-800 rounded p-2 max-h-64 overflow-y-auto">
                      {clientOptions
                        .filter((client: any) =>
                          client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
                          client.email.toLowerCase().includes(clientSearch.toLowerCase())
                        )
                        .map((client: any) => (
                          <label key={client.id} className="flex items-center gap-2 py-1 cursor-pointer">
                            <input
                              type="checkbox"
                              value={client.email}
                              checked={targetClients.includes(client.email)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setTargetClients([...targetClients, client.email]);
                                } else {
                                  setTargetClients(targetClients.filter(email => email !== client.email));
                                }
                              }}
                            />
                            <span>{client.name} ({client.email})</span>
                          </label>
                        ))}
                    </div>
                    <span className="text-blue-200 text-xs">Leave blank to target all clients</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-white font-semibold">Mandatory Notification</Label>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={mandatory} onChange={() => setMandatory(!mandatory)} />
                  <span className="text-blue-200 text-xs">Mandatory notifications are shown to all users even if preferences are off</span>
                  {mandatory ? <AlertCircle className="w-4 h-4 text-red-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white font-semibold">Send via</Label>
                <div className="flex gap-4">
                  <label className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${sendType === "email" ? "bg-blue-800/60" : "hover:bg-blue-800/30"}`}>
                    <Send className="w-4 h-4" />
                    <input type="radio" name="sendType" value="email" checked={sendType === "email"} onChange={() => setSendType("email")} />
                    <span>Email</span>
                  </label>
                  <label className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${sendType === "in-app" ? "bg-blue-800/60" : "hover:bg-blue-800/30"}`}>
                    <Bell className="w-4 h-4" />
                    <input type="radio" name="sendType" value="in-app" checked={sendType === "in-app"} onChange={() => setSendType("in-app")} />
                    <span>In-App</span>
                  </label>
                  <label className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${sendType === "both" ? "bg-blue-800/60" : "hover:bg-blue-800/30"}`}>
                    <Send className="w-4 h-4" />
                    <input type="radio" name="sendType" value="both" checked={sendType === "both"} onChange={() => setSendType("both")} />
                    <span>Both</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <Button
                  onClick={() => setShowConfirm(true)}
                  disabled={isSending || !title || !message}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex items-center justify-center gap-2"
                >
                  {isSending ? <span className="loader mr-2" /> : null}
                  {isSending ? "Sending..." : "Send Notification"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(true)}
                  className="flex items-center gap-2 text-blue-700 border-blue-700"
                >
                  <Eye className="w-4 h-4" /> Preview
                </Button>
              </div>
              {showConfirm && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-purple-400 rounded-lg shadow-lg p-8 max-w-sm w-full">
                    <h2 className="text-lg font-bold mb-4">Confirm Send</h2>
                    <p className="mb-6">Are you sure you want to send this notification?</p>
                    <div className="flex gap-4 justify-end">
                      <Button variant="outline" onClick={() => setShowConfirm(false)} className="bg-gray-200 text-gray-800">Cancel</Button>
                      <Button onClick={handleSendNotification} className="bg-blue-700 text-white">Yes, Send</Button>
                    </div>
                  </div>
                </div>
              )}
              {showPreview && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                    <h2 className="text-lg font-bold mb-4">Notification Preview</h2>
                    <div className="mb-4">
                      <div className="font-bold text-lg">{title}</div>
                      <div className="text-base whitespace-pre-line mb-2">{message}</div>
                      <div className="text-xs text-blue-700">Type: {sendType} | Group: {targetGroup} {mandatory && "| Mandatory"}</div>
                    </div>
                    <div className="flex gap-4 justify-end">
                      <Button variant="outline" onClick={() => setShowPreview(false)} className="bg-gray-200 text-gray-800">Close</Button>
                    </div>
                  </div>
                </div>
              )}
              {feedback && (
                <div className={`mt-4 px-4 py-2 rounded text-sm font-medium flex items-center gap-2 ${feedback.type === "success" ? "bg-green-100 text-green-800 border border-green-300 animate-pulse" : "bg-red-100 text-red-800 border border-red-300 animate-shake"}`}>
                  {feedback.type === "success" ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-red-500" />}
                  {feedback.message}
                </div>
              )}
            </CardContent>
          </Card>
          {/* Summary & Recent Notifications */}
          <div className="flex flex-col gap-8 col-span-1">
            <Card className="border-none bg-blue-900/60 shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg text-white font-bold flex items-center gap-2"><Eye className="w-5 h-5" /> Target Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                <div className="text-blue-200 text-sm">Target Group: <span className="font-bold text-white">{targetGroup}</span></div>
                {targetGroup === "clients" && targetClients.length > 0 && (
                  <div className="text-blue-200 text-sm">Specific Clients: <span className="font-bold text-white">{targetClients.join(", ")}</span></div>
                )}
                <div className="text-blue-200 text-sm">Mandatory: {mandatory ? <span className="text-red-500 font-bold">Yes</span> : <span className="text-green-500 font-bold">No</span>}</div>
                <div className="text-blue-200 text-sm">Send Type: <span className="font-bold text-white">{sendType}</span></div>
                <div className="text-blue-200 text-sm">Title: <span className="font-bold text-white">{title || "-"}</span></div>
                <div className="text-blue-200 text-sm">Message: <span className="font-bold text-white">{message ? message.slice(0, 60) + (message.length > 60 ? "..." : "") : "-"}</span></div>
              </CardContent>
            </Card>
            <Card className="border-none bg-blue-900/60 shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="text-lg text-white font-bold flex items-center gap-2"><Bell className="w-5 h-5" /> Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-2">
                {recentNotifications.length === 0 ? (
                  <div className="text-blue-200">No notifications sent yet.</div>
                ) : (
                  recentNotifications.map((notif, idx) => (
                    <div key={idx} className={`bg-blue-950/60 rounded p-3 text-white border border-blue-800 flex flex-col gap-1 ${notif.mandatory ? "border-red-500" : ""}`}>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{notif.title}</span>
                        {notif.mandatory ? <AlertCircle className="w-4 h-4 text-red-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      <div className="text-sm">{notif.message}</div>
                      <div className="text-xs mt-1">{notif.sendType} | {notif.targetGroup} | {notif.date}</div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <style jsx>{`
        .loader {
          border: 2px solid #fff;
          border-top: 2px solid #3b82f6;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          50% { transform: translateX(4px); }
          75% { transform: translateX(-4px); }
          100% { transform: translateX(0); }
        }
        .animate-shake {
          animation: shake 0.4s;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default AdminNotificationsPage;
