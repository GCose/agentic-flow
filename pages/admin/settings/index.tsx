import React, { useState } from "react";
import { User, Shield, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/dashboard/dashboard-layout";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { useAuth } from "@/contexts/auth-context";

const AdminSettingsPage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [adminName, setAdminName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
  ];

  const handleSave = async (section: string) => {
    setIsLoading(true);
    setFeedback(null);
    try {
      if (section === "profile") {
        // Require current password for email change
        if (email !== user?.email && !currentPassword) {
          setFeedback({ type: "error", message: "Current password required to change email." });
          return;
        }
        const res = await fetch("/api/admin/update-settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user?.id, email, name: adminName, currentPassword: email !== user?.email ? currentPassword : undefined }),
        });
        const result = await res.json();
        if (res.ok) {
          setFeedback({ type: "success", message: result.message || "Profile updated successfully." });
          if (result.user) {
            updateUser(result.user);
          }
        } else {
          setFeedback({ type: "error", message: result.error || "Failed to update profile." });
        }
      }
      if (section === "security") {
        // Password strength validation
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
        if (!strongRegex.test(newPassword)) {
          setFeedback({ type: "error", message: "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol." });
          return;
        }
        if (newPassword !== confirmPassword) {
          setFeedback({ type: "error", message: "Passwords do not match." });
          return;
        }
        const res = await fetch("/api/admin/update-settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user?.id, currentPassword, newPassword }),
        });
        const result = await res.json();
        if (res.ok) {
          setFeedback({ type: "success", message: result.message || "Password updated successfully." });
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          setFeedback({ type: "error", message: result.error || "Failed to update password." });
        }
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err?.message || "Update failed." });
    }
    setIsLoading(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <Card className="border-none bg-transparent" role="form" aria-label="Admin Profile Settings">
            <CardHeader>
              <CardTitle className="text-xl text-white">Admin Profile Settings</CardTitle>
              <p className="text-slate-300">Manage your admin profile and account information.</p>
            </CardHeader>
            <CardContent className="space-y-8 pt-6">
              <div className="space-y-2">
                <Label htmlFor="admin-name" className="text-white">Admin Name</Label>
                <Input
                  id="admin-name"
                  aria-label="Admin Name"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="bg-transparent border-blue-900/70 text-gray-50/70"
                  placeholder="Enter your name"
                  tabIndex={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <Input
                  id="email"
                  aria-label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent border-blue-900/70 text-gray-50/70"
                  placeholder="your@email.com"
                  type="email"
                  tabIndex={0}
                />
              </div>
              <Button
                onClick={() => handleSave("profile")}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                aria-disabled={isLoading}
                tabIndex={0}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        );

      case "security":
        return (
          <Card className="border-none bg-transparent" role="form" aria-label="Security Settings">
            <CardHeader>
              <CardTitle className="text-xl text-white">Security Settings</CardTitle>
              <p className="text-slate-300">Update your password and security preferences.</p>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-white">Current Password</Label>
                <Input
                  id="current-password"
                  aria-label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-transparent border-blue-900/70 text-gray-50/70"
                  placeholder="Enter current password"
                  tabIndex={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-white">New Password</Label>
                <Input
                  id="new-password"
                  aria-label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-transparent border-blue-900/70 text-gray-50/70"
                  placeholder="Enter new password"
                  tabIndex={0}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-white">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  aria-label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-transparent border-blue-900/70 text-gray-50/70"
                  placeholder="Confirm new password"
                  tabIndex={0}
                />
              </div>
              <div className="pt-2">
                <p className="text-sm text-slate-400 mb-4">Password must be at least 8 characters and include uppercase, lowercase, number, and symbol.</p>
                <Button
                  onClick={() => handleSave("security")}
                  disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  aria-disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                  tabIndex={0}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout
      role="admin"
      meta={{
        title: "Agentic Flow | Admin Settings",
        description: "Manage your admin account settings",
      }}
    >
      <DashboardHeader role="admin" title="Admin Settings" hasBackButton={false} />
      {feedback && (
        <div
          role="alert"
          aria-live="assertive"
          className={`mb-4 px-4 py-2 rounded text-sm font-medium max-w-xl mx-auto ${
            feedback.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {feedback.message}
        </div>
      )}
      <div className="flex flex-1 h-full py-8">
        {/*==================== Sidebar ====================*/}
        <div className="w-64 border-r border-blue-900/70 bg-transparent p-6">
          <nav className="space-y-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors border-b border-blue-900/70 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-900 via-blue-900 to-blue-500 text-white shadow-lg shadow-blue-500/50"
                      : "text-slate-300 hover:bg-gradient-to-r hover:from-blue-800/30 hover:via-blue-700/20 hover:to-blue-500/25 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        {/*==================== End of Sidebar ====================*/}

        {/*==================== Main Content ====================*/}
        <div className="flex-1 px-8">{renderTabContent()}</div>
        {/*==================== End of Main Content ====================*/}
      </div>
    </DashboardLayout>
  );
};

export default AdminSettingsPage;
